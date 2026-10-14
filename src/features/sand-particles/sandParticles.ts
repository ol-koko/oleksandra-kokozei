/**
 * "Sand" text: the text is sampled into grains that scatter around a pointer
 * and spring back home. Ported from the Claude Design template
 * (footer-particles-sand), physics unchanged.
 *
 * The engine draws on a canvas laid over a text label. It only runs while
 * playing: a rAF loop starts on a pointer move or a sweep and stops once every
 * grain is back home. While playing, the host carries `data-sand-playing` so
 * CSS can hide the static label (it stays in the DOM and the a11y tree).
 */

/** Template physics. Distances are in CSS pixels. */
const CONFIG = {
  /** Pointer reach. */
  radius: 26,
  /** Scatter strength. */
  force: 3.2,
  /** Share of the grains in reach that get a push per step (lower = grainier). */
  chance: 0.35,
  /** 0 = straight away from the pointer, 1 = fully random directions. */
  spread: 0.85,
  /** Pull back home (lower = slower). */
  spring: 0.012,
  /** Sand friction (lower = grains stop sooner). */
  damping: 0.86,
  /** Room around the text for grains to fly into. */
  padX: 90,
  padY: 40,
} as const;

/** Grains at least this far from home take the full accent color. */
const ACCENT_DISTANCE = 12;
/** Pixels fainter than this (0–255) are not sampled as grains. */
const ALPHA_THRESHOLD = 20;
/** Grains moving and displaced less than these are snapped home. */
const REST_VELOCITY = 0.02;
const REST_DISTANCE = 0.3;

/** Color of moving grains; resting grains use the label's own (live) color. */
const ACCENT_TOKEN = '--color-text-primary';

/** Caps that keep the effect cheap on dense screens and large text. */
const MAX_PIXEL_RATIO = 2;
const MAX_PARTICLES = 8000;

/** Physics runs at a fixed 60 steps per second, whatever the display rate. */
const STEP_MS = 1000 / 60;
const MAX_STEPS_PER_FRAME = 3;

/** Virtual pointer speed for sweeps (focus, autoplay), in CSS px per ms. */
const SWEEP_SPEED = 0.25;

type Rgb = readonly [number, number, number];

const colorCache = new Map<string, Rgb>();
let colorProbe: CanvasRenderingContext2D | null = null;

/** Any CSS color as RGB, resolved by painting one pixel. Cached per string. */
function toRgb(color: string): Rgb {
  const cached = colorCache.get(color);
  if (cached) return cached;
  colorProbe ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  if (!colorProbe) return [0, 0, 0];
  colorProbe.clearRect(0, 0, 1, 1);
  colorProbe.fillStyle = '#000';
  colorProbe.fillStyle = color;
  colorProbe.fillRect(0, 0, 1, 1);
  const [r = 0, g = 0, b = 0] = colorProbe.getImageData(0, 0, 1, 1).data;
  const rgb: Rgb = [r, g, b];
  colorCache.set(color, rgb);
  return rgb;
}

/** Virtual pointer path, in CSS px relative to the canvas. */
type Sweep = { from: number; to: number; y: number; duration: number; elapsed: number };

export type SandParticlesOptions = {
  /** Called when a play ends by itself (grains settled), not on `stop()`. */
  onIdle?: () => void;
};

export class SandParticles {
  private readonly host: HTMLElement;
  private readonly label: HTMLElement;
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D | null;
  private readonly onIdle: (() => void) | undefined;

  private pixelRatio = 1;
  private width = 0;
  private height = 0;
  /** Sampling stride in device px; each grain is drawn as a grain × grain block. */
  private grain = 1;
  private count = 0;
  private homeX = new Float32Array(0);
  private homeY = new Float32Array(0);
  private x = new Float32Array(0);
  private y = new Float32Array(0);
  private vx = new Float32Array(0);
  private vy = new Float32Array(0);
  private alpha = new Float32Array(0);
  private image: ImageData | null = null;
  private accent: Rgb = [0, 0, 0];

  private dirty = true;
  private building: Promise<boolean> | null = null;
  /** Bumped by `stop()` so a play waiting on fonts does not start late. */
  private generation = 0;
  private destroyed = false;

  private playing = false;
  private frame = 0;
  private lastTime = 0;
  private backlog = 0;
  /** Pointer in CSS px relative to the canvas. */
  private pointer = { x: 0, y: 0, inside: false };
  private sweepState: Sweep | null = null;

  constructor(
    host: HTMLElement,
    label: HTMLElement,
    canvas: HTMLCanvasElement,
    options: SandParticlesOptions = {},
  ) {
    this.host = host;
    this.label = label;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.onIdle = options.onIdle;
  }

  /** The text's size or position changed: resample before the next play. */
  invalidate() {
    this.dirty = true;
    // A play waiting on fonts is kept: it samples the new layout anyway.
    if (this.playing) this.stop();
  }

  /** Pointer over the text, in client coordinates. Starts a play. */
  pointerMove(clientX: number, clientY: number) {
    const rect = this.host.getBoundingClientRect();
    this.sweepState = null;
    this.pointer.x = clientX - rect.left + CONFIG.padX;
    this.pointer.y = clientY - rect.top + CONFIG.padY;
    this.pointer.inside = true;
    void this.play();
  }

  /** Pointer gone: the grains settle and the play ends. */
  pointerLeave() {
    this.pointer.inside = false;
  }

  /** A virtual pointer crosses the text from start to end. */
  sweep() {
    this.sweepState = { from: 0, to: 0, y: 0, duration: 0, elapsed: 0 };
    if (this.playing) this.startSweep(this.sweepState);
    else void this.play();
  }

  /** Ends any play at once and shows the static text. */
  stop() {
    this.generation += 1;
    this.sweepState = null;
    this.pointer.inside = false;
    if (!this.playing) return;
    cancelAnimationFrame(this.frame);
    this.x.set(this.homeX);
    this.y.set(this.homeY);
    this.vx.fill(0);
    this.vy.fill(0);
    this.finish();
  }

  destroy() {
    this.stop();
    this.destroyed = true;
  }

  private async play() {
    if (this.playing) return;
    const generation = this.generation;
    const ready = await this.prepare();
    if (!ready || this.destroyed || this.playing || generation !== this.generation) return;
    if (this.sweepState) this.startSweep(this.sweepState);
    this.accent = toRgb(getComputedStyle(this.host).getPropertyValue(ACCENT_TOKEN).trim());
    this.playing = true;
    this.host.dataset.sandPlaying = '';
    this.lastTime = performance.now();
    this.backlog = 0;
    this.frame = requestAnimationFrame(this.loop);
  }

  /** Samples the text once its font has loaded. */
  private prepare(): Promise<boolean> {
    if (!this.dirty) return Promise.resolve(true);
    this.building ??= this.loadFont()
      .then(() => {
        if (this.destroyed) return false;
        this.build();
        return this.count > 0;
      })
      .finally(() => {
        this.building = null;
      });
    return this.building;
  }

  private async loadFont() {
    const style = getComputedStyle(this.label);
    await document.fonts.load(`${style.fontWeight} ${style.fontSize} ${style.fontFamily}`);
    await document.fonts.ready;
  }

  private build() {
    this.dirty = false;
    const ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
    const hostRect = this.host.getBoundingClientRect();
    const labelRect = this.label.getBoundingClientRect();
    const cssWidth = Math.ceil(hostRect.width) + CONFIG.padX * 2;
    const cssHeight = Math.ceil(hostRect.height) + CONFIG.padY * 2;
    const width = Math.round(cssWidth * ratio);
    const height = Math.round(cssHeight * ratio);

    this.pixelRatio = ratio;
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.width = `${cssWidth}px`;
    this.canvas.style.height = `${cssHeight}px`;
    this.canvas.style.left = `${-CONFIG.padX}px`;
    this.canvas.style.top = `${-CONFIG.padY}px`;

    // Draw the text offscreen exactly where the label sits, then sample its pixels.
    const offscreen = document.createElement('canvas');
    offscreen.width = width;
    offscreen.height = height;
    const context = offscreen.getContext('2d', { willReadFrequently: true });
    if (!context || width === 0 || height === 0) {
      this.count = 0;
      return;
    }
    const style = getComputedStyle(this.label);
    const text = this.label.textContent ?? '';
    context.font = `${style.fontStyle} ${style.fontWeight} ${Number.parseFloat(style.fontSize) * ratio}px ${style.fontFamily}`;
    const letterSpacing = Number.parseFloat(style.letterSpacing);
    if (!Number.isNaN(letterSpacing)) context.letterSpacing = `${letterSpacing * ratio}px`;
    context.textAlign = 'left';
    context.textBaseline = 'alphabetic';
    context.fillStyle = '#000';
    // An inline box's top edge is one font ascent above its baseline.
    const ascent = context.measureText(text).fontBoundingBoxAscent;
    context.fillText(
      text,
      (CONFIG.padX + labelRect.left - hostRect.left) * ratio,
      (CONFIG.padY + labelRect.top - hostRect.top) * ratio + ascent,
    );
    const data = context.getImageData(0, 0, width, height).data;

    let opaque = 0;
    for (let i = 3; i < data.length; i += 4) {
      if ((data[i] ?? 0) > ALPHA_THRESHOLD) opaque += 1;
    }
    const grain = Math.max(1, Math.ceil(Math.sqrt(opaque / MAX_PARTICLES)));
    const xs: number[] = [];
    const ys: number[] = [];
    const alphas: number[] = [];
    for (let py = 0; py < height; py += grain) {
      for (let px = 0; px < width; px += grain) {
        const a = data[(py * width + px) * 4 + 3] ?? 0;
        if (a <= ALPHA_THRESHOLD) continue;
        xs.push(px);
        ys.push(py);
        alphas.push(a / 255);
      }
    }

    this.grain = grain;
    this.count = xs.length;
    this.homeX = Float32Array.from(xs);
    this.homeY = Float32Array.from(ys);
    this.x = Float32Array.from(xs);
    this.y = Float32Array.from(ys);
    this.vx = new Float32Array(this.count);
    this.vy = new Float32Array(this.count);
    this.alpha = Float32Array.from(alphas);
    this.image = this.ctx?.createImageData(width, height) ?? null;
  }

  private startSweep(sweep: Sweep) {
    const ratio = this.pixelRatio;
    sweep.from = CONFIG.padX - CONFIG.radius;
    sweep.to = this.width / ratio - CONFIG.padX + CONFIG.radius;
    sweep.y = this.height / ratio / 2;
    sweep.duration = (sweep.to - sweep.from) / SWEEP_SPEED;
    sweep.elapsed = 0;
  }

  private loop = (time: number) => {
    this.backlog = Math.min(this.backlog + time - this.lastTime, STEP_MS * MAX_STEPS_PER_FRAME);
    this.lastTime = time;
    let active = true;
    while (this.backlog >= STEP_MS) {
      this.backlog -= STEP_MS;
      this.advanceSweep();
      active = this.step() || this.pointer.inside;
    }
    this.draw();
    if (active) this.frame = requestAnimationFrame(this.loop);
    else {
      this.finish();
      this.onIdle?.();
    }
  };

  private advanceSweep() {
    const sweep = this.sweepState;
    if (!sweep) return;
    sweep.elapsed += STEP_MS;
    const progress = sweep.duration > 0 ? sweep.elapsed / sweep.duration : 1;
    if (progress >= 1) {
      this.sweepState = null;
      this.pointer.inside = false;
      return;
    }
    this.pointer.x = sweep.from + (sweep.to - sweep.from) * progress;
    this.pointer.y = sweep.y;
    this.pointer.inside = true;
  }

  /** One physics step. Returns whether any grain is still moving. */
  private step(): boolean {
    const ratio = this.pixelRatio;
    const reach = CONFIG.radius * ratio;
    const reach2 = reach * reach;
    const push = CONFIG.force * ratio;
    const { x, y, vx, vy, homeX, homeY } = this;
    const { inside } = this.pointer;
    const mx = this.pointer.x * ratio;
    const my = this.pointer.y * ratio;
    let moving = false;

    for (let i = 0; i < this.count; i += 1) {
      let px = x[i] ?? 0;
      let py = y[i] ?? 0;
      let pvx = vx[i] ?? 0;
      let pvy = vy[i] ?? 0;
      const hx = homeX[i] ?? 0;
      const hy = homeY[i] ?? 0;

      if (inside) {
        const dx = px - mx;
        const dy = py - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < reach2 && Math.random() < CONFIG.chance) {
          const d = Math.sqrt(d2) || 1;
          const k = (1 - d / reach) * (0.4 + Math.random());
          const angle = Math.random() * Math.PI * 2;
          const m = CONFIG.spread;
          pvx += (Math.cos(angle) * m + (dx / d) * (1 - m)) * k * push;
          pvy += (Math.sin(angle) * m + (dy / d) * (1 - m)) * k * push;
        }
      }
      pvx = (pvx + (hx - px) * CONFIG.spring) * CONFIG.damping;
      pvy = (pvy + (hy - py) * CONFIG.spring) * CONFIG.damping;
      px += pvx;
      py += pvy;

      if (
        Math.abs(pvx) > REST_VELOCITY ||
        Math.abs(pvy) > REST_VELOCITY ||
        Math.abs(hx - px) > REST_DISTANCE ||
        Math.abs(hy - py) > REST_DISTANCE
      ) {
        moving = true;
      } else {
        px = hx;
        py = hy;
        pvx = 0;
        pvy = 0;
      }
      x[i] = px;
      y[i] = py;
      vx[i] = pvx;
      vy[i] = pvy;
    }
    return moving;
  }

  private draw() {
    const { ctx, image, width, height, grain } = this;
    if (!ctx || !image) return;
    const buffer = image.data;
    buffer.fill(0);
    // Resting grains follow the label's live color, so hover and focus transitions carry over.
    const [r0, g0, b0] = toRgb(getComputedStyle(this.host).color);
    const [r1, g1, b1] = this.accent;
    const accentDistance = ACCENT_DISTANCE * this.pixelRatio;

    for (let i = 0; i < this.count; i += 1) {
      const px = this.x[i] ?? 0;
      const py = this.y[i] ?? 0;
      const left = px | 0;
      const top = py | 0;
      if (left < 0 || top < 0 || left >= width || top >= height) continue;
      const shift = Math.abs(px - (this.homeX[i] ?? 0)) + Math.abs(py - (this.homeY[i] ?? 0));
      const t = Math.min(1, shift / accentDistance);
      const r = r0 + (r1 - r0) * t;
      const g = g0 + (g1 - g0) * t;
      const b = b0 + (b1 - b0) * t;
      const a = 255 * Math.max(this.alpha[i] ?? 0, 0.85 * t);
      const right = Math.min(left + grain, width);
      const bottom = Math.min(top + grain, height);
      for (let row = top; row < bottom; row += 1) {
        for (let col = left; col < right; col += 1) {
          const j = (row * width + col) * 4;
          buffer[j] = r;
          buffer[j + 1] = g;
          buffer[j + 2] = b;
          buffer[j + 3] = Math.max(buffer[j + 3] ?? 0, a);
        }
      }
    }
    ctx.putImageData(image, 0, 0);
  }

  private finish() {
    this.playing = false;
    this.sweepState = null;
    this.pointer.inside = false;
    delete this.host.dataset.sandPlaying;
    this.ctx?.clearRect(0, 0, this.width, this.height);
  }
}
