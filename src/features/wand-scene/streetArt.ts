/**
 * The street of the Ollivanders Wand Shop, ported from the site's own source
 * (index.html, shop.js) so it matches the live site. Only the artwork: no
 * game, door or signpost interaction. Text is part of the picture (`aria-hidden`),
 * so it stays in English in every locale. Ids are prefixed per instance, as
 * the card and the case cover can be in the document together.
 */

export type StreetSvgs = {
  sky: SVGSVGElement;
  town: SVGSVGElement;
  shop: SVGSVGElement;
  fg: SVGSVGElement;
};

/** Elements the layout moves. */
export type StreetRefs = {
  moon: Element;
  post: Element;
  postBar: Element;
  postTexts: readonly (readonly [SVGTextContentElement, number])[];
};

type Random = () => number;
type Row2 = [number, number];
type Row3 = [number, number, number];
type Row4 = [number, number, number, number];
type BuildingRow = [number, number, number, string, string];

const SVGNS = 'http://www.w3.org/2000/svg';

/** Seeded, so every scene draws the same stars, windows and lights. */
function rng(seed: number): Random {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function svgEl(tag: string, attrs: Record<string, string | number | undefined>, parent?: Element) {
  const element = document.createElementNS(SVGNS, tag) as SVGElement;
  for (const key in attrs) {
    const value = attrs[key];
    if (value !== undefined) element.setAttribute(key, String(value));
  }
  parent?.appendChild(element);
  return element;
}

function find<T extends Element = SVGElement>(root: ParentNode, selector: string): T {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Street art is missing ${selector}`);
  return element;
}

const SHOP_MARKUP = `      <defs>
        <linearGradient id="gWin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffdc9c"/><stop offset=".55" stop-color="#f3a64c"/><stop offset="1" stop-color="#b4581b"/></linearGradient>
        <radialGradient id="gGlow"><stop offset="0" stop-color="#ffc56e" stop-opacity=".6"/><stop offset="1" stop-color="#ffc56e" stop-opacity="0"/></radialGradient>
        <linearGradient id="gWall" x1="0" x2="1"><stop offset="0" stop-color="#101d16"/><stop offset=".5" stop-color="#1c3226"/><stop offset="1" stop-color="#0f1b14"/></linearGradient>
        <linearGradient id="gDoorL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3d2"/><stop offset="1" stop-color="#ffb55e"/></linearGradient>
        <linearGradient id="gDoor" x1="0" x2="1"><stop offset="0" stop-color="#3b2416"/><stop offset="1" stop-color="#22140b"/></linearGradient>
        <radialGradient id="gFrost" cx="0" cy="1" r="1"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></radialGradient>
        <radialGradient id="gFrost2" cx="1" cy="1" r="1"><stop offset="0" stop-color="#fff" stop-opacity=".6"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></radialGradient>
      </defs>
      <ellipse cx="500" cy="955" rx="380" ry="70" fill="url(#gGlow)"/>
      <polygon points="268,482 500,388 732,482" fill="#1a1420"/>
      <polygon points="300,480 500,402 700,480" fill="#16271d"/>
      <circle cx="500" cy="446" r="19" fill="url(#gWin)" stroke="#0b130e" stroke-width="5"/>
      <line x1="481" y1="446" x2="519" y2="446" stroke="#0b130e" stroke-width="3"/><line x1="500" y1="427" x2="500" y2="465" stroke="#0b130e" stroke-width="3"/>
      <path d="M258,486 L500,380 L742,486 L732,494 L716,490 L708,500 L690,484 L500,400 L310,484 L296,498 L286,488 L268,494Z" fill="#e8eef9"/>
      <rect x="296" y="480" width="408" height="460" fill="url(#gWall)"/>
      <rect x="312" y="490" width="376" height="78" rx="4" fill="#100a07" stroke="#b8924a" stroke-width="3"/>
      <rect x="321" y="498" width="358" height="62" rx="2" fill="none" stroke="#5e4628" stroke-width="1.2"/>
      <text x="500" y="534" text-anchor="middle" font-weight="700" font-size="40" letter-spacing="7" fill="#e6c27a" id="sign1" textLength="330" lengthAdjust="spacingAndGlyphs">OLLIVANDERS</text>
      <text x="500" y="555" text-anchor="middle" font-style="italic" font-size="15" fill="#bfa070" id="sign2">makers of fine wands · since 382 B.C.</text>
      <path d="M308,491 Q320,482 360,484 Q420,480 500,483 Q590,480 650,484 Q682,482 692,491 L688,494 Q600,488 500,490 Q400,488 312,494Z" fill="#eef3fb"/>
      <path d="M302,493 Q401,520 500,493 Q599,520 698,493" fill="none" stroke="#173a24" stroke-width="8" stroke-linecap="round"/>
      <g id="garland"></g>
      <rect x="296" y="568" width="22" height="370" fill="#0c1610"/>
      <rect x="682" y="568" width="22" height="370" fill="#0c1610"/>
      <rect x="500" y="568" width="18" height="370" fill="#0c1610"/>
      <g>
        <rect x="326" y="592" width="166" height="246" fill="url(#gWin)"/>
        <g fill="#7a4220" opacity=".55">
          <rect x="330" y="800" width="44" height="12"/><rect x="334" y="788" width="40" height="12"/><rect x="330" y="776" width="44" height="12"/><rect x="336" y="764" width="36" height="12"/>
          <rect x="446" y="800" width="42" height="12"/><rect x="450" y="788" width="38" height="12"/><rect x="444" y="776" width="44" height="12"/>
          <rect x="330" y="632" width="40" height="11"/><rect x="333" y="621" width="36" height="11"/><rect x="452" y="632" width="36" height="11"/>
        </g>
        <rect x="372" y="796" width="74" height="10" fill="#3b1a10" opacity=".7"/>
        <ellipse cx="409" cy="790" rx="34" ry="9" fill="#6a2448"/>
        <line x1="384" y1="782" x2="436" y2="776" stroke="#2a1608" stroke-width="4" stroke-linecap="round"/>
        <rect x="405" y="592" width="5" height="246" fill="#0b130e"/>
        <rect x="364" y="592" width="3" height="246" fill="#0b130e"/><rect x="448" y="592" width="3" height="246" fill="#0b130e"/>
        <rect x="326" y="670" width="166" height="4" fill="#0b130e"/><rect x="326" y="752" width="166" height="4" fill="#0b130e"/>
        <rect x="326" y="740" width="90" height="98" fill="url(#gFrost)"/>
        <rect x="402" y="740" width="90" height="98" fill="url(#gFrost2)"/>
        <rect x="322" y="588" width="174" height="254" fill="none" stroke="#0b130e" stroke-width="9"/>
        <rect x="314" y="840" width="190" height="12" fill="#0b130e"/>
        <path d="M312,842 Q330,830 360,834 Q410,828 460,834 Q495,830 506,842Z" fill="#eef3fb"/>
      </g>
      <g id="doorG">
        <path d="M528,932 L528,678 A70,70 0 0 1 668,678 L668,932Z" fill="url(#gDoorL)"/>
        <g id="doorLeaf">
          <path d="M528,932 L528,678 A70,70 0 0 1 668,678 L668,932Z" fill="url(#gDoor)"/>
          <path d="M548,690 A50,50 0 0 1 648,690 L648,722 L548,722Z" fill="url(#gWin)" opacity=".9"/>
          <line x1="598" y1="640" x2="598" y2="722" stroke="#22140b" stroke-width="3"/>
          <rect x="548" y="740" width="100" height="78" fill="none" stroke="#1a0e07" stroke-width="3"/>
          <rect x="548" y="834" width="100" height="80" fill="none" stroke="#1a0e07" stroke-width="3"/>
          <circle cx="598" cy="779" r="25" fill="none" stroke="#143a20" stroke-width="10"/>
          <circle cx="598" cy="779" r="25" fill="none" stroke="#1f5230" stroke-width="4" stroke-dasharray="4 5"/>
          <circle cx="584" cy="760" r="3" fill="#c42a2a"/><circle cx="615" cy="768" r="3" fill="#c42a2a"/><circle cx="590" cy="802" r="3" fill="#c42a2a"/><circle cx="612" cy="798" r="3" fill="#c42a2a"/>
          <path d="M592,801 l6,10 l6,-10" fill="#8a1c1c"/>
          <circle cx="652" cy="826" r="5" fill="#d9b46a"/>
        </g>
        <path d="M521,936 L521,676 A77,77 0 0 1 675,676 L675,936" fill="none" stroke="#0b130e" stroke-width="10"/>
        <rect class="leak" x="530" y="924" width="136" height="7" fill="#ffd28a"/>
      </g>
      <line x1="509" y1="568" x2="509" y2="592" stroke="#0b130e" stroke-width="3"/>
      <circle cx="509" cy="608" r="46" fill="url(#gGlow)"/>
      <rect x="499" y="592" width="20" height="28" rx="2" fill="url(#gWin)" stroke="#0b130e" stroke-width="3"/>
      <path d="M496,592 L509,582 L522,592Z" fill="#0b130e"/>
      <rect x="510" y="934" width="176" height="16" fill="#353646"/>
      <path d="M508,936 Q540,926 600,930 Q660,926 690,936Z" fill="#eef3fb"/>`;

function buildSky(svgs: StreetSvgs) {
  const s = svgs.sky;
  const R = rng(3);
  s.innerHTML = `<defs><linearGradient id="gSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#03060f"/><stop offset=".35" stop-color="#0b1532"/><stop offset=".62" stop-color="#1b2a55"/><stop offset=".82" stop-color="#34406b"/></linearGradient>
  <radialGradient id="gMoon"><stop offset="0" stop-color="#fff2cf" stop-opacity=".45"/><stop offset="1" stop-color="#fff2cf" stop-opacity="0"/></radialGradient>
  <mask id="mMoon"><rect x="0" y="0" width="1000" height="1000" fill="#fff"/><circle cx="314" cy="320" r="30" fill="#000"/></mask>
  <filter id="fCloud"><feGaussianBlur stdDeviation="14"/></filter></defs>
  <rect x="-900" y="-400" width="2800" height="1600" fill="url(#gSky)"/>`;
  const g = svgEl('g', {}, s);
  for (let i = 0; i < 170; i++) {
    const c = svgEl(
      'circle',
      {
        cx: -800 + R() * 2600,
        cy: -300 + R() * 760,
        r: (0.5 + R() * 1.4).toFixed(2),
        fill: R() < 0.2 ? '#ffe9c0' : '#dfe6ff',
        opacity: (0.35 + R() * 0.6).toFixed(2),
      },
      g,
    );
    if (R() < 0.35) {
      c.setAttribute('class', 'tw');
      c.style.animationDelay = (R() * 3).toFixed(2) + 's';
    }
  }
  const moon = svgEl('g', { id: 'moonG' }, s);
  svgEl('circle', { cx: 300, cy: 330, r: 120, fill: 'url(#gMoon)' }, moon);
  svgEl('circle', { cx: 300, cy: 330, r: 33, fill: '#f8efd6', mask: 'url(#mMoon)' }, moon);
  const cl = svgEl('g', { filter: 'url(#fCloud)', opacity: 0.5 }, s);
  (
    [
      [120, 380, 160, 22],
      [520, 300, 220, 18],
      [860, 360, 200, 24],
      [-200, 330, 240, 22],
      [1200, 300, 260, 20],
    ] as Row4[]
  ).forEach(([x, y, rx, ry]) =>
    svgEl('ellipse', { cx: x, cy: y, rx, ry, fill: '#5a6894', opacity: 0.5 }, cl),
  );
  // distant castle on a snowy hill
  const c = svgEl('g', {}, s);
  svgEl(
    'path',
    {
      d: 'M380,520 Q470,430 560,428 Q680,410 820,470 Q900,500 960,540 L960,600 L380,600Z',
      fill: '#1a2546',
    },
    c,
  );
  svgEl(
    'path',
    {
      d: 'M470,450 Q560,424 650,420 Q740,425 820,470',
      fill: 'none',
      stroke: '#c9d4ee',
      'stroke-opacity': 0.35,
      'stroke-width': 4,
    },
    c,
  );
  const k = '#0c1430';
  const T = (x: number, y: number, w: number, h: number, rh: number) => {
    svgEl('rect', { x, y, width: w, height: h, fill: k }, c);
    svgEl(
      'polygon',
      { points: `${x - 3},${y} ${x + w / 2},${y - rh} ${x + w + 3},${y}`, fill: k },
      c,
    );
    svgEl(
      'path',
      {
        d: `M${x + w / 2 - 2},${y - rh + 4} L${x + w / 2},${y - rh} L${x + w / 2 + 2},${y - rh + 4}`,
        stroke: '#c9d4ee',
        'stroke-opacity': 0.5,
        fill: 'none',
      },
      c,
    );
  };
  svgEl('rect', { x: 580, y: 392, width: 150, height: 36, fill: k }, c);
  T(565, 372, 18, 56, 34);
  T(600, 350, 30, 78, 52);
  T(640, 368, 22, 60, 36);
  T(676, 340, 26, 88, 58);
  T(712, 378, 16, 50, 30);
  T(738, 395, 14, 36, 24);
  const wins: Row2[] = [
    [606, 370],
    [618, 370],
    [606, 384],
    [682, 360],
    [694, 360],
    [688, 378],
    [645, 385],
    [570, 392],
    [716, 396],
    [600, 404],
    [630, 404],
    [660, 404],
    [700, 406],
    [620, 414],
    [680, 416],
  ];
  wins.forEach(([x, y]) => {
    const r = svgEl('rect', { x, y, width: 3.2, height: 5, fill: '#ffcf7a' }, c);
    if (R() < 0.3) {
      r.setAttribute('class', 'tw');
      r.style.animationDelay = R() * 3 + 's';
    }
  });
}
function building(
  g: Element,
  R: Random,
  x: number,
  w: number,
  top: number,
  kind: string,
  color: string,
) {
  const bottom = 945;
  svgEl('rect', { x, y: top, width: w, height: bottom - top, fill: color }, g);
  if (kind === 'gable') {
    const pk = top - w * 0.42;
    svgEl(
      'polygon',
      {
        points: `${x - 10},${top + 2} ${x + w / 2},${pk} ${x + w + 10},${top + 2}`,
        fill: '#171320',
      },
      g,
    );
    svgEl(
      'path',
      {
        d: `M${x - 14},${top + 4} L${x + w / 2},${pk - 8} L${x + w + 14},${top + 4} L${x + w + 4},${top + 10} L${x + w / 2},${pk + 6} L${x - 4},${top + 10}Z`,
        fill: '#e3ebf7',
      },
      g,
    );
  } else {
    svgEl('rect', { x: x - 8, y: top - 14, width: w + 16, height: 16, fill: '#16121c' }, g);
    svgEl('rect', { x: x - 10, y: top - 22, width: w + 20, height: 11, rx: 5, fill: '#e3ebf7' }, g);
    const cx = x + w * (0.2 + R() * 0.55);
    svgEl('rect', { x: cx, y: top - 60, width: 22, height: 44, fill: '#2a2026' }, g);
    svgEl('rect', { x: cx - 3, y: top - 66, width: 28, height: 8, rx: 3, fill: '#e3ebf7' }, g);
  }
  const cols = Math.max(2, Math.round(w / 52)),
    cw = w / cols;
  for (let r = 0; r < 4; r++) {
    const y = top + 30 + r * 95;
    if (y > 820) break;
    for (let c = 0; c < cols; c++) {
      const lit = R() < 0.62,
        wx = x + c * cw + cw * 0.25,
        ww = cw * 0.5;
      svgEl(
        'rect',
        {
          x: wx,
          y,
          width: ww,
          height: 46,
          fill: lit ? '#f2b05a' : '#141a2c',
          opacity: lit ? 0.92 : 1,
        },
        g,
      );
      if (lit)
        svgEl('rect', { x: wx, y, width: ww, height: 46, fill: '#ffe2a6', opacity: 0.35 }, g);
      svgEl('rect', { x: wx + ww / 2 - 1.5, y, width: 3, height: 46, fill: '#0e0c14' }, g);
      svgEl('rect', { x: wx, y: y + 21, width: ww, height: 3, fill: '#0e0c14' }, g);
      svgEl('rect', { x: wx - 4, y: y + 45, width: ww + 8, height: 5, rx: 2, fill: '#dfe7f5' }, g);
    }
  }
  // garland under eaves
  const gy = top + 12,
    path = `M${x},${gy} Q${x + w / 2},${gy + 26} ${x + w},${gy}`;
  svgEl('path', { d: path, fill: 'none', stroke: '#173a24', 'stroke-width': 5 }, g);
  for (let i = 1; i < 9; i++) {
    const t = i / 9,
      px = x + w * t,
      py = gy + 26 * 2 * t * (1 - t) * 1;
    const l = svgEl(
      'circle',
      { cx: px, cy: py + 2, r: 2.6, fill: ['#ffd27a', '#ff7a6a', '#9fe0ff', '#ffd27a'][i % 4] },
      g,
    );
    l.setAttribute('class', 'tw');
    l.style.animationDelay = R() * 2.2 + 's';
  }
}
function buildTown(svgs: StreetSvgs) {
  const s = svgs.town;
  const R = rng(11);
  const g = svgEl('g', {}, s);
  (
    [
      [-420, 270, 520, 'flat', '#1b1e2a'],
      [-160, 190, 470, 'gable', '#251e22'],
      [24, 152, 505, 'flat', '#1e2230'],
      [172, 122, 520, 'gable', '#241d27'],
      [706, 128, 515, 'gable', '#231c26'],
      [830, 158, 500, 'flat', '#1d2130'],
      [984, 180, 470, 'gable', '#261f22'],
      [1160, 300, 510, 'flat', '#1b1e2a'],
      [-640, 220, 480, 'gable', '#231c26'],
      [-900, 260, 520, 'flat', '#1e2230'],
      [1460, 210, 490, 'gable', '#251e22'],
      [1670, 230, 520, 'flat', '#1d2130'],
    ] as BuildingRow[]
  ).forEach(([x, w, top, k, c]) => building(g, R, x, w, top, k, c));
}
function buildFg(svgs: StreetSvgs) {
  const s = svgs.fg;
  const R = rng(5);
  s.innerHTML = `<defs><linearGradient id="gSnow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9eef8"/><stop offset=".5" stop-color="#bac6df"/><stop offset="1" stop-color="#7d8ab0"/></linearGradient>
  <radialGradient id="gWarmSnow"><stop offset="0" stop-color="#ffc56e" stop-opacity=".45"/><stop offset="1" stop-color="#ffc56e" stop-opacity="0"/></radialGradient>
  <radialGradient id="gLamp"><stop offset="0" stop-color="#ffd58a" stop-opacity=".75"/><stop offset="1" stop-color="#ffd58a" stop-opacity="0"/></radialGradient></defs>
  <path d="M-900,945 C-500,930 -100,950 200,940 C400,932 600,955 800,942 C1100,930 1500,950 1900,940 L1900,1300 L-900,1300Z" fill="url(#gSnow)"/>
  <ellipse cx="560" cy="965" rx="300" ry="40" fill="url(#gWarmSnow)"/>`;
  const g = svgEl('g', {}, s);
  for (let i = 0; i < 9; i++) {
    const t = i / 8;
    const x = lerp(500, 590, t) + (i % 2 ? 9 : -9),
      y = lerp(1060, 950, t);
    svgEl(
      'ellipse',
      {
        cx: x,
        cy: y,
        rx: 5 + 3 * (1 - t),
        ry: 2.5 + 1.5 * (1 - t),
        fill: '#8592b5',
        opacity: 0.55,
      },
      g,
    );
  }
  // mounds
  (
    [
      [300, 942, 70, 16],
      [700, 944, 60, 13],
      [-60, 948, 120, 20],
      [1060, 946, 120, 18],
    ] as Row4[]
  ).forEach(([x, y, rx, ry]) => svgEl('ellipse', { cx: x, cy: y, rx, ry, fill: '#e9eef8' }, g));
  // fir tree with lights
  const tx = 298,
    ty = 945;
  svgEl('rect', { x: tx - 5, y: ty - 26, width: 10, height: 26, fill: '#2a1a10' }, g);
  (
    [
      [0, 150, 70],
      [40, 118, 56],
      [78, 86, 42],
      [112, 56, 28],
    ] as Row3[]
  ).forEach(([dy, w, h]) => {
    svgEl(
      'polygon',
      {
        points: `${tx - w / 2},${ty - 20 - dy} ${tx},${ty - 20 - dy - h - 30} ${tx + w / 2},${ty - 20 - dy}`,
        fill: '#0f2a1d',
      },
      g,
    );
    svgEl(
      'path',
      {
        d: `M${tx - w / 2},${ty - 20 - dy} Q${tx},${ty - 30 - dy} ${tx + w / 2},${ty - 20 - dy}`,
        stroke: '#e9eef8',
        'stroke-width': 5,
        fill: 'none',
        'stroke-linecap': 'round',
      },
      g,
    );
  });
  for (let i = 0; i < 18; i++) {
    const h = R(),
      w = (1 - h) * 66;
    const l = svgEl(
      'circle',
      {
        cx: tx + (R() * 2 - 1) * w,
        cy: ty - 34 - h * 150,
        r: 2.6,
        fill: ['#ffd27a', '#ff8a6a', '#ffe9b0'][i % 3],
      },
      g,
    );
    l.setAttribute('class', 'tw');
    l.style.animationDelay = R() * 2.2 + 's';
  }
  svgEl(
    'polygon',
    {
      points: `${tx},${ty - 214} ${tx + 4},${ty - 204} ${tx + 14},${ty - 204} ${tx + 6},${ty - 197} ${tx + 9},${ty - 186} ${tx},${ty - 193} ${tx - 9},${ty - 186} ${tx - 6},${ty - 197} ${tx - 14},${ty - 204} ${tx - 4},${ty - 204}`,
      fill: '#ffd98a',
    },
    g,
  );
  // lampposts
  (
    [
      [742, 1],
      [130, 1],
      [-260, 1],
      [1180, 1],
    ] as Row2[]
  ).forEach(([x]) => {
    svgEl('circle', { cx: x, cy: 700, r: 70, fill: 'url(#gLamp)' }, g);
    svgEl('rect', { x: x - 4, y: 700, width: 8, height: 245, fill: '#0d0c12' }, g);
    svgEl('rect', { x: x - 10, y: 930, width: 20, height: 14, fill: '#0d0c12' }, g);
    svgEl(
      'rect',
      {
        x: x - 11,
        y: 680,
        width: 22,
        height: 30,
        rx: 3,
        fill: '#ffd58a',
        stroke: '#0d0c12',
        'stroke-width': 3,
      },
      g,
    );
    svgEl('path', { d: `M${x - 15},${682} L${x},${666} L${x + 15},${682}Z`, fill: '#0d0c12' }, g);
    svgEl(
      'path',
      {
        d: `M${x - 16},${679} Q${x},${660} ${x + 16},${679}`,
        stroke: '#e9eef8',
        'stroke-width': 4,
        fill: 'none',
        'stroke-linecap': 'round',
      },
      g,
    );
  });
}
function buildPost(svgs: StreetSvgs) {
  const s = svgs.fg;
  s.insertAdjacentHTML(
    'afterbegin',
    `<defs><linearGradient id="gPost" x1="0" x2="1"><stop offset="0" stop-color="#2a1a0e"/><stop offset=".45" stop-color="#6a4626"/><stop offset="1" stop-color="#24160b"/></linearGradient>
  <linearGradient id="gBoard" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></linearGradient>
  <filter id="fPostGlow" x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation="9"/></filter></defs>`,
  );
  const snow = (x0: number, x1: number, y: number) =>
    `<path d="M${x0 + 2},${y + 1} Q${x0 + 20},${y - 6} ${(x0 + x1) / 2},${y - 3} Q${x1 - 20},${y - 7} ${x1 - 2},${y + 1} Q${(x0 + x1) / 2},${y + 3} ${x0 + 2},${y + 1}Z" fill="#eef3fb"/>`;
  // a painted plank with a rough end and a pointed one
  const board = (x0: number, x1: number, y0: number, h: number, left: boolean) => {
    const m = y0 + h / 2,
      y1 = y0 + h;
    return left
      ? `M${x0},${m} L${x0 + 20},${y0} L${x1 - 3},${y0 + 1} L${x1 + 2},${y0 + h * 0.3} L${x1 - 2},${y0 + h * 0.55} L${x1 + 3},${y1 - 2} L${x0 + 20},${y1}Z`
      : `M${x1},${m} L${x1 - 20},${y0} L${x0 + 2},${y0 + 1} L${x0 - 3},${y0 + h * 0.35} L${x0 + 1},${y0 + h * 0.6} L${x0 - 2},${y1 - 1} L${x1 - 20},${y1}Z`;
  };
  const plank = (d: string, fill: string) =>
    `<path d="${d}" fill="${fill}"/><path d="${d}" fill="url(#gBoard)"/><path d="${d}" fill="none" stroke="#120a06" stroke-opacity=".6" stroke-width="1.5"/>`;
  const b1 = board(-232, 24, 6, 66, true),
    b2 = board(-150, 66, 82, 36, false),
    b3 = board(-182, 22, 126, 36, true);
  s.insertAdjacentHTML(
    'beforeend',
    `<g id="post"><rect id="postBar" x="-7" y="-14" width="14" height="100" fill="url(#gPost)"/>
    <path d="M-10,-14 L0,-26 L10,-14Z" fill="#24160b"/><path d="M-11,-15 Q0,-30 11,-15" stroke="#eef3fb" stroke-width="4" fill="none" stroke-linecap="round"/>
    <g id="postHall"><path class="glow" d="${b1}" fill="#ffcf7a" filter="url(#fPostGlow)"/>${plank(b1, '#4a2d55')}${snow(-212, 22, 6)}
      <text id="postQ" x="-102" y="31" text-anchor="middle" font-style="italic" font-weight="600" font-size="17" fill="#e8d7b0"></text>
      <text id="postHallT" x="-102" y="60" text-anchor="middle" font-weight="700" font-size="27" letter-spacing=".5" fill="#f0cd84"></text>
      <circle cx="0" cy="22" r="2.2" fill="#1a1008"/><circle cx="0" cy="56" r="2.2" fill="#1a1008"/></g>
    <g class="sw" id="postBank">${plank(b2, '#8a8296')}${snow(-146, 46, 82)}<text id="postBankT" x="-78" y="107" text-anchor="middle" font-weight="700" font-size="20" fill="#2a1f34"></text><circle cx="0" cy="100" r="2" fill="#1a1008"/></g>
    <g class="sw" id="postPub">${plank(b3, '#5c2236')}${snow(-162, 20, 126)}<text id="postPubT" x="-82" y="151" text-anchor="middle" font-weight="700" font-size="20" fill="#e9cfa0"></text><circle cx="0" cy="144" r="2" fill="#1a1008"/></g>
  </g>`,
  );
}
function buildGarland(svgs: StreetSvgs) {
  const g = find(svgs.shop, '#garland');
  const R = rng(9);
  for (let i = 1; i < 16; i++) {
    const t = i / 16,
      half = t < 0.5,
      u = half ? t * 2 : (t - 0.5) * 2;
    const x = 302 + 396 * t,
      y = 493 + 27 * 2 * u * (1 - u) * 1.0;
    const l = svgEl(
      'circle',
      { cx: x, cy: y + 3, r: 3, fill: ['#ffd27a', '#ff7a6a', '#ffe9b0'][i % 3] },
      g,
    );
    l.setAttribute('class', 'tw');
    l.style.animationDelay = R() * 2.2 + 's';
  }
}

/** Prefixes every id and `url(#id)` reference, so instances never resolve each other's gradients. */
function scopeIds(svgs: StreetSvgs, prefix: string) {
  for (const svg of Object.values(svgs)) {
    for (const element of svg.querySelectorAll('*')) {
      for (const attribute of element.attributes) {
        if (attribute.name === 'id') attribute.value = `${prefix}${attribute.value}`;
        else if (attribute.value.includes('url(#')) {
          attribute.value = attribute.value.replaceAll('url(#', `url(#${prefix}`);
        } else if (attribute.name === 'href' && attribute.value.startsWith('#')) {
          attribute.value = `#${prefix}${attribute.value.slice(1)}`;
        }
      }
    }
  }
}

/** Draws the four depth layers into their SVGs and returns the parts the layout moves. */
export function buildStreet(svgs: StreetSvgs, prefix: string): StreetRefs {
  svgs.shop.innerHTML = SHOP_MARKUP;
  buildSky(svgs);
  buildTown(svgs);
  buildFg(svgs);
  buildPost(svgs);
  buildGarland(svgs);

  const text = (selector: string, value: string) => {
    const element = find<SVGTextContentElement>(svgs.fg, selector);
    element.textContent = value;
    return element;
  };
  const refs: StreetRefs = {
    moon: find(svgs.sky, '#moonG'),
    post: find(svgs.fg, '#post'),
    postBar: find(svgs.fg, '#postBar'),
    postTexts: [
      [text('#postQ', 'Got a wand?'), 210],
      [text('#postHallT', 'To Hogwarts'), 214],
      [text('#postBankT', 'Platform 9¾'), 136],
      [text('#postPubT', 'Diagon Alley'), 176],
    ],
  };
  scopeIds(svgs, prefix);
  return refs;
}

/** Long words stay on their boards. Runs once the font has loaded. */
export function fitPostText(refs: StreetRefs) {
  for (const [element, max] of refs.postTexts) {
    element.removeAttribute('textLength');
    if (element.getComputedTextLength() > max) {
      element.setAttribute('textLength', String(max));
      element.setAttribute('lengthAdjust', 'spacingAndGlyphs');
    }
  }
}

/** The width the street's fixed sizes are designed for; smaller scenes scale from it. */
export const REFERENCE_WIDTH = 1440;

/**
 * Fits the street to the scene: `setViewBoxes` and `placePost` from the site,
 * with its viewport swapped for a 1440 px wide reference of the scene's ratio,
 * so a small card shows the same picture as a large screen. `titleBottom` is
 * in scene pixels.
 */
export function layoutStreet(
  svgs: StreetSvgs,
  refs: StreetRefs,
  width: number,
  height: number,
  titleBottom: number,
) {
  if (!width || !height) return;
  const scale = width / REFERENCE_WIDTH;
  const H = height / scale;
  const titleEnd = titleBottom / scale;
  const a = width / height;
  const base = a > 0.9 ? 760 : 1080;
  const title = titleEnd + 12;
  const vbH = title < H * 0.8 ? Math.max(base, Math.min(638 / (1 - title / H), 2800 / a)) : base;
  const vbW = vbH * a;
  const vbY = 1018 - vbH;
  const vbX = 500 - vbW / 2;
  const viewBox = `${vbX.toFixed(1)} ${vbY.toFixed(1)} ${vbW.toFixed(1)} ${vbH.toFixed(1)}`;
  for (const svg of Object.values(svgs)) svg.setAttribute('viewBox', viewBox);

  const ppu = (H * 1.08) / vbH;
  const xR = 500 + vbW / 2 / 1.08;
  const yTop = vbY + (vbH * (1 - 1 / 1.08)) / 2;
  const tU = yTop + titleEnd / ppu;
  let x: number;
  let top: number;
  let k: number;
  if (xR - 704 >= 300) {
    k = Math.min(clamp(28 / (27 * ppu), 0.8, 1.6), (xR - 724) / 300);
    x = Math.min(xR - 60 * k, Math.max(940, 724 + 236 * k));
    top = Math.max(945 - 400 * k, tU + 40 * k);
  } else {
    k = clamp(21 / (27 * ppu), 0.8, 1.3);
    x = xR - 34 * k;
    top = tU + 34 * k;
  }
  refs.post.setAttribute(
    'transform',
    `translate(${x.toFixed(1)} ${top.toFixed(1)}) scale(${k.toFixed(3)})`,
  );
  refs.postBar.setAttribute('height', ((946 - top) / k + 14).toFixed(1));
  refs.moon.setAttribute(
    'transform',
    a > 0.9 ? `translate(${Math.min(-210, 200 - (400 * vbH) / H).toFixed(1)} 0)` : '',
  );
}
