import { addTick } from './sceneLoop';
import {
  buildStreet,
  fitPostText,
  layoutStreet,
  REFERENCE_WIDTH,
  type StreetSvgs,
} from './streetArt';

/** Depth of each layer (`data-d` on the site). */
const DEPTHS = { sky: 0.12, town: 0.4, shop: 0.7, fg: 1.05 } as const;

/** How far the layers travel, as a share of the scene's short side. */
const PARALLAX_DEPTH = 0.022;
/** Share of the remaining distance the layers cover per 60 Hz frame. */
const PARALLAX_EASING = 0.06;
const FRAME_MS = 1000 / 60;
/** A longer gap (a paused tab) must not fast-forward the snow. */
const MAX_FRAMES = 3;

const SNOW_AREA_PER_FLAKE = 9000;
/** Snow is drawn at one canvas pixel per CSS pixel, as on the site. */
const SNOW_PIXEL_RATIO = 1;

type LayerId = keyof typeof DEPTHS;
type Flake = { x: number; y: number; r: number; v: number; p: number };
type SnowLayer = {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  flakes: Flake[];
  color: string;
  alpha: number;
};

export type WandScene = {
  /** Fits the scene again once the font has loaded. */
  refit: () => void;
  start: () => void;
  stop: () => void;
  /** Cursor position across the scene, -1 to 1 on each axis. */
  setPointer: (x: number, y: number) => void;
  /** Eases the layers back to the center. */
  clearPointer: () => void;
  /** Touch screens have no cursor: the layers drift gently by themselves. */
  setDrift: (drift: boolean) => void;
  resize: () => void;
  destroy: () => void;
};

let instances = 0;

function makeLayer(id: LayerId) {
  const element = document.createElement('div');
  element.className = 'pl';
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('preserveAspectRatio', 'none');
  element.appendChild(svg);
  return { id, element, svg, depth: DEPTHS[id] };
}

function makeSnow(root: HTMLElement, color: string, alpha: number): SnowLayer {
  const canvas = document.createElement('canvas');
  canvas.className = 'full';
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas 2D is not available');
  root.appendChild(canvas);
  return { canvas, context, flakes: [], color, alpha };
}

function makeTitle() {
  const title = document.createElement('div');
  title.className = 'scene-title';
  const heading = document.createElement('span');
  heading.className = 'scene-heading';
  heading.textContent = 'Ollivanders';
  const subtitle = document.createElement('span');
  subtitle.className = 'scene-subtitle';
  subtitle.textContent = 'Among thousands of wands, one is waiting just for you.';
  title.append(heading, subtitle);
  return title;
}

/**
 * Builds the live street into `root`: the depth layers and the snow in front
 * of and behind them, ported from the site's `core.js` (`updatePar`,
 * `initSnow`, `drawSnow`). Constants are the site's. The site moves per frame,
 * so here every step is scaled to 60 Hz and 120 Hz screens match it. It draws
 * one frame on mount and animates only between `start` and `stop`.
 */
export function mountWandScene(root: HTMLElement): WandScene {
  const prefix = `wand-scene-${instances++}-`;
  const sky = makeLayer('sky');
  const town = makeLayer('town');
  const shop = makeLayer('shop');
  const fg = makeLayer('fg');
  const layers = [sky, town, shop, fg];
  const svgs: StreetSvgs = { sky: sky.svg, town: town.svg, shop: shop.svg, fg: fg.svg };

  root.appendChild(sky.element);
  const snowBack = makeSnow(root, '#dfe7ff', 0.7);
  root.append(town.element, shop.element, fg.element);
  const snowFront = makeSnow(root, '#ffffff', 0.85);
  const title = makeTitle();
  root.appendChild(title);

  const refs = buildStreet(svgs, prefix);
  const parallax = { targetX: 0, targetY: 0, x: 0, y: 0 };
  let width = 0;
  let height = 0;
  let drift = false;
  let last = 0;
  let removeTick: (() => void) | null = null;

  function sizeSnow() {
    const count = Math.round((width * height) / SNOW_AREA_PER_FLAKE);
    for (const snow of [snowBack, snowFront]) {
      snow.canvas.width = Math.round(width * SNOW_PIXEL_RATIO);
      snow.canvas.height = Math.round(height * SNOW_PIXEL_RATIO);
      snow.context.setTransform(SNOW_PIXEL_RATIO, 0, 0, SNOW_PIXEL_RATIO, 0, 0);
    }
    snowBack.flakes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 0.6 + Math.random() * 1.3,
      v: 0.25 + Math.random() * 0.5,
      p: Math.random() * 6,
    }));
    snowFront.flakes = Array.from({ length: Math.round(count / 3.5) }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 1.8 + Math.random() * 2.6,
      v: 0.7 + Math.random() * 1,
      p: Math.random() * 6,
    }));
  }

  /** The site sizes its title from the viewport: here, from a 1440 px wide reference. */
  function sizeTitle() {
    const scale = width / REFERENCE_WIDTH;
    const referenceHeight = height / scale;
    const heading = Math.max(30, Math.min(REFERENCE_WIDTH * 0.086, referenceHeight * 0.11, 72));
    const subtitle = Math.max(14, Math.min(REFERENCE_WIDTH * 0.04, referenceHeight * 0.034, 23));
    title.style.setProperty('--scene-scale', String(scale));
    title.style.setProperty('--scene-top', `${Math.max(62, Math.min(referenceHeight * 0.07, 56))}`);
    title.style.setProperty('--scene-heading', `${Math.min(72, heading)}`);
    title.style.setProperty('--scene-subtitle', `${subtitle}`);
    title.style.setProperty('--scene-gap', `${Math.min(12, referenceHeight * 0.016)}`);
  }

  function layout() {
    width = root.clientWidth;
    height = root.clientHeight;
    if (!width || !height) return;
    sizeTitle();
    layoutStreet(svgs, refs, width, height, title.offsetTop + title.offsetHeight);
    sizeSnow();
  }

  function moveLayers() {
    const shift = Math.min(width, height) * PARALLAX_DEPTH;
    for (const layer of layers) {
      const x = -parallax.x * layer.depth * shift;
      const y = -parallax.y * layer.depth * shift * 0.7;
      layer.element.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0)`;
    }
  }

  function drawSnow(time: number, frames: number) {
    for (const snow of [snowBack, snowFront]) {
      const { context, flakes } = snow;
      context.clearRect(0, 0, width, height);
      context.fillStyle = snow.color;
      context.globalAlpha = snow.alpha;
      for (const flake of flakes) {
        flake.y += flake.v * frames;
        flake.x += (Math.sin(time * 0.0008 + flake.p) * 0.35 - parallax.x * 0.05) * frames;
        if (flake.y > height + 6) {
          flake.y = -6;
          flake.x = Math.random() * width;
        }
        if (flake.x < -6) flake.x = width + 6;
        if (flake.x > width + 6) flake.x = -6;
        context.beginPath();
        context.arc(flake.x, flake.y, flake.r, 0, 6.283);
        context.fill();
      }
    }
  }

  function render(time: number, frames: number) {
    if (drift) {
      parallax.targetX = Math.sin(time * 0.00021) * 0.7;
      parallax.targetY = Math.sin(time * 0.00016 + 1) * 0.45;
    }
    const easing = 1 - Math.pow(1 - PARALLAX_EASING, frames);
    parallax.x += (parallax.targetX - parallax.x) * easing;
    parallax.y += (parallax.targetY - parallax.y) * easing;
    moveLayers();
    drawSnow(time, frames);
  }

  function tick(time: number) {
    const frames = Math.min(MAX_FRAMES, (time - last) / FRAME_MS);
    last = time;
    render(time, frames);
  }

  layout();
  render(performance.now(), 0);

  return {
    refit() {
      fitPostText(refs);
      layout();
      render(performance.now(), 0);
    },
    start() {
      if (removeTick) return;
      last = performance.now();
      removeTick = addTick(tick);
    },
    stop() {
      removeTick?.();
      removeTick = null;
    },
    setPointer(x, y) {
      if (drift) return;
      parallax.targetX = x;
      parallax.targetY = y;
    },
    clearPointer() {
      if (drift) return;
      parallax.targetX = 0;
      parallax.targetY = 0;
    },
    setDrift(next) {
      drift = next;
      if (!drift) {
        parallax.targetX = 0;
        parallax.targetY = 0;
      }
    },
    resize() {
      layout();
      render(performance.now(), 0);
    },
    destroy() {
      removeTick?.();
      removeTick = null;
      root.replaceChildren();
    },
  };
}
