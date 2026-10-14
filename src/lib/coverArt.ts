/**
 * NovelNest cover art engine.
 *
 * Every book gets a deterministic, genre-appropriate illustrated cover built
 * from its own palette + motif. The result is a self-contained SVG (2:3) that
 * is stored on the book as a stable `coverImage` data-URI reference. Nothing is
 * fetched at runtime, so covers never break, never shift, and never randomise.
 */

export const DEFAULT_PALETTE = ["#60452f", "#dcc9a7", "#c7a86b", "#30251e"];

export interface CoverArtOptions {
  id?: string;
  title: string;
  author?: string;
  palette?: string[];
  motif?: string;
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function toHex(n: number): string {
  return clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0");
}

function lum(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function mix(a: string, b: string, t: number): string {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  const m = (x: number, y: number) => x + (y - x) * t;
  return `#${toHex(m(A.r, B.r))}${toHex(m(A.g, B.g))}${toHex(m(A.b, B.b))}`;
}

function rgba(hex: string, a: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number): () => number {
  let s = seed >>> 0 || 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

interface Roles {
  bg: string;
  paper: string;
  deep: string;
  accent: string;
  ink: string;
  snow: string;
  sid: string;
  rand: () => number;
}

function roles(palette: string[], id: string): Roles {
  const safe = palette.length >= 4 ? palette : DEFAULT_PALETTE;
  const sorted = [...safe].sort((a, b) => lum(a) - lum(b));
  const deep = sorted[0];
  const paper = sorted[sorted.length - 1];
  const bg = safe[0];
  const accent = sorted[2] ?? safe[2] ?? deep;
  const text = lum(bg) > 0.58 ? deep : paper;
  return {
    bg,
    paper,
    deep,
    accent,
    ink: text,
    snow: mix(paper, "#ffffff", 0.55),
    sid: hash(id).toString(36),
    rand: rng(hash(`${id}-${safe.join("")}`)),
  };
}

function wrapTitle(title: string, maxChars = 20): string[] {
  const words = title.replace(/\s+/g, " ").trim().split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if (!cur) cur = w;
    else if (`${cur} ${w}`.length <= maxChars) cur += ` ${w}`;
    else {
      lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : ["Untitled"];
}

function starField(count: number, w: number, h: number, color: string, rand: () => number): string {
  let out = "";
  for (let i = 0; i < count; i += 1) {
    const x = (rand() * w).toFixed(1);
    const y = (rand() * h).toFixed(1);
    const r = (0.5 + rand() * 1.4).toFixed(2);
    const o = (0.35 + rand() * 0.6).toFixed(2);
    out += `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="${o}"/>`;
  }
  return out;
}

/* ---------------------------------- scenes --------------------------------- */

function sceneLighthouse(p: Roles): string {
  const { bg, paper, deep, accent, sid } = p;
  return `
  <defs><linearGradient id="s-${sid}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${mix(bg, paper, 0.34)}"/>
    <stop offset="0.55" stop-color="${mix(bg, accent, 0.22)}"/>
    <stop offset="1" stop-color="${mix(bg, deep, 0.32)}"/>
  </linearGradient></defs>
  <rect width="300" height="310" fill="url(#s-${sid})"/>
  <circle cx="214" cy="92" r="30" fill="${mix(paper, accent, 0.25)}"/>
  <circle cx="214" cy="92" r="48" fill="${rgba(paper, 0.12)}"/>
  <g stroke="${rgba(deep, 0.55)}" stroke-width="1.4" fill="none" stroke-linecap="round">
    <path d="M74 116 q6 -6 12 0 q6 -6 12 0"/><path d="M104 104 q5 -5 10 0 q5 -5 10 0"/>
  </g>
  <path d="M0 232 Q76 196 150 232 T300 226 V310 H0 Z" fill="${mix(bg, deep, 0.28)}"/>
  <path d="M0 310 V258 Q34 236 84 254 L132 292 L132 310 Z" fill="${deep}"/>
  <path d="M300 310 V236 Q250 226 208 250 L168 292 L168 310 Z" fill="${deep}"/>
  <path d="M0 258 Q75 244 150 258 T300 258 V310 H0 Z" fill="${mix(bg, deep, 0.55)}"/>
  <g stroke="${rgba(paper, 0.3)}" stroke-width="1.6" fill="none" stroke-linecap="round">
    <path d="M22 276 q11 -6 22 0 t22 0"/><path d="M120 292 q11 -6 22 0 t22 0"/><path d="M214 274 q11 -6 22 0 t22 0"/>
  </g>
  <path d="M232 300 L239 176 L257 176 L264 300 Z" fill="${paper}"/>
  <rect x="236" y="164" width="24" height="14" rx="2" fill="${accent}"/>
  <path d="M234 164 L248 150 L262 164 Z" fill="${deep}"/>
  <circle cx="248" cy="171" r="4" fill="${mix(accent, paper, 0.5)}"/>
  <path d="M262 171 L300 152 L300 190 Z" fill="${rgba(mix(paper, accent, 0.4), 0.22)}"/>
  <path d="M234 171 L196 152 L196 190 Z" fill="${rgba(mix(paper, accent, 0.4), 0.12)}"/>
  <g fill="${deep}">
    <path d="M92 286 q15 11 32 0 l-4 -9 h-24 z"/>
    <rect x="105" y="264" width="2.4" height="16"/>
    <path d="M108 264 l15 11 -15 5 z" fill="${paper}"/>
  </g>`;
}

function sceneTree(p: Roles): string {
  const { bg, paper, deep, accent, sid } = p;
  return `
  <defs><linearGradient id="s-${sid}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${mix(bg, paper, 0.42)}"/>
    <stop offset="1" stop-color="${mix(bg, accent, 0.28)}"/>
  </linearGradient></defs>
  <rect width="300" height="310" fill="url(#s-${sid})"/>
  <circle cx="78" cy="72" r="26" fill="${mix(paper, accent, 0.3)}"/>
  <circle cx="78" cy="72" r="40" fill="${rgba(paper, 0.14)}"/>
  <path d="M0 236 Q80 190 160 232 T300 224 V310 H0 Z" fill="${mix(bg, deep, 0.26)}"/>
  <path d="M0 310 Q90 258 190 296 T300 286 V310 H0 Z" fill="${mix(deep, bg, 0.18)}"/>
  <g stroke="${deep}" stroke-width="8" stroke-linecap="round" fill="none">
    <path d="M150 300 V206"/><path d="M150 236 L124 212"/><path d="M150 226 L176 204"/>
  </g>
  <g fill="${deep}">
    <circle cx="150" cy="174" r="54"/><circle cx="108" cy="196" r="34"/><circle cx="192" cy="194" r="36"/>
  </g>
  <g fill="${mix(deep, accent, 0.42)}" opacity="0.5">
    <circle cx="134" cy="158" r="22"/><circle cx="176" cy="176" r="18"/><circle cx="116" cy="186" r="14"/>
  </g>
  <g fill="${accent}">
    <circle cx="120" cy="182" r="4"/><circle cx="150" cy="150" r="4"/><circle cx="182" cy="190" r="4"/>
    <circle cx="104" cy="206" r="3.5"/><circle cx="196" cy="210" r="3.5"/>
  </g>`;
}

function sceneMap(p: Roles): string {
  const { bg, paper, deep, accent } = p;
  return `
  <defs><linearGradient id="s-${p.sid}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${mix(bg, paper, 0.42)}"/>
    <stop offset="1" stop-color="${mix(bg, paper, 0.2)}"/>
  </linearGradient></defs>
  <rect width="300" height="310" fill="url(#s-${p.sid})"/>
  <g stroke="${rgba(deep, 0.12)}" stroke-width="1">
    <line x1="0" y1="62" x2="300" y2="62"/><line x1="0" y1="124" x2="300" y2="124"/><line x1="0" y1="186" x2="300" y2="186"/>
    <line x1="60" y1="0" x2="60" y2="310"/><line x1="150" y1="0" x2="150" y2="310"/><line x1="240" y1="0" x2="240" y2="310"/>
  </g>
  <path d="M40 300 C26 208 58 156 120 148 C172 140 202 168 214 210 C232 262 192 300 150 300 Z"
        fill="${mix(bg, accent, 0.28)}" stroke="${deep}" stroke-width="2"/>
  <path d="M62 288 C52 216 76 178 122 172 C162 166 188 188 196 218 C210 256 180 288 148 288 Z"
        fill="none" stroke="${rgba(deep, 0.35)}" stroke-width="1.4"/>
  <path d="M62 250 C120 240 138 192 190 190 C220 189 232 158 214 128"
        fill="none" stroke="${accent}" stroke-width="2.6" stroke-dasharray="1 8" stroke-linecap="round"/>
  <circle cx="62" cy="250" r="5.5" fill="${deep}"/>
  <path d="M214 128 l-9 -4 v9 z" fill="${deep}"/>
  <g stroke="${deep}" stroke-width="3" stroke-linecap="round">
    <line x1="198" y1="138" x2="212" y2="152"/><line x1="212" y1="138" x2="198" y2="152"/>
  </g>
  <g transform="translate(250,54)">
    <circle r="21" fill="${rgba(paper, 0.3)}" stroke="${deep}" stroke-width="1.6"/>
    <path d="M0 -20 L5 0 L0 20 L-5 0 Z" fill="${deep}"/>
    <path d="M-20 0 L0 -5 L20 0 L0 5 Z" fill="${accent}"/>
    <circle r="2.6" fill="${paper}"/>
  </g>`;
}

function sceneStar(p: Roles): string {
  const { bg, paper, deep, accent, rand } = p;
  return `
  <defs>
    <linearGradient id="s-${p.sid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${mix(deep, bg, 0.2)}"/>
      <stop offset="1" stop-color="${deep}"/>
    </linearGradient>
    <radialGradient id="g-${p.sid}"><stop offset="0" stop-color="${rgba(accent, 0.5)}"/><stop offset="1" stop-color="${rgba(accent, 0)}"/></radialGradient>
  </defs>
  <rect width="300" height="310" fill="url(#s-${p.sid})"/>
  <g>${starField(46, 300, 210, paper, rand)}</g>
  <circle cx="232" cy="70" r="52" fill="url(#g-${p.sid})"/>
  <circle cx="232" cy="70" r="30" fill="${mix(accent, deep, 0.28)}"/>
  <circle cx="222" cy="62" r="7" fill="${rgba(deep, 0.3)}"/><circle cx="240" cy="80" r="5" fill="${rgba(deep, 0.28)}"/>
  <ellipse cx="232" cy="70" rx="52" ry="12" fill="none" stroke="${rgba(accent, 0.55)}" stroke-width="2" transform="rotate(-18 232 70)"/>
  <path d="M78 292 A72 72 0 0 1 222 292 Z" fill="${rgba(mix(paper, accent, 0.25), 0.14)}" stroke="${rgba(paper, 0.6)}" stroke-width="1.8"/>
  <g stroke="${rgba(paper, 0.35)}" stroke-width="1.1" fill="none">
    <path d="M150 220 V292"/><path d="M114 240 Q150 218 186 240"/><path d="M150 220 Q124 254 128 292"/><path d="M150 220 Q176 254 172 292"/>
  </g>
  <g fill="${accent}">
    <path d="M118 292 q-8 -30 6 -52 q10 22 2 52 z"/><path d="M168 292 q8 -26 -4 -46 q-10 20 -2 46 z"/>
    <path d="M136 292 q0 -22 6 -34 q6 12 6 34 z" opacity="0.85"/>
  </g>
  <rect x="60" y="290" width="180" height="9" rx="4" fill="${deep}"/>`;
}

function sceneCompass(p: Roles): string {
  const { bg, paper, deep, accent } = p;
  return `
  <defs><linearGradient id="s-${p.sid}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${mix(bg, paper, 0.34)}"/><stop offset="1" stop-color="${mix(bg, deep, 0.2)}"/>
  </linearGradient></defs>
  <rect width="300" height="310" fill="url(#s-${p.sid})"/>
  <g stroke="${rgba(deep, 0.18)}" fill="none" stroke-width="1.4">
    <path d="M-10 92 C60 52 120 132 200 92 S280 62 310 92"/>
    <path d="M-10 142 C60 102 120 182 200 142 S280 112 310 142"/>
    <path d="M-10 192 C60 152 120 232 200 192 S280 162 310 192"/>
    <path d="M-10 242 C60 202 120 282 200 242 S280 212 310 242"/>
  </g>
  <g transform="translate(150,156)">
    <circle r="76" fill="${rgba(paper, 0.35)}" stroke="${deep}" stroke-width="2"/>
    <circle r="61" fill="none" stroke="${rgba(deep, 0.45)}" stroke-width="1"/>
    <circle r="46" fill="none" stroke="${rgba(deep, 0.25)}" stroke-width="1"/>
    <g fill="${deep}"><path d="M0 -68 L10 0 L0 68 L-10 0 Z"/></g>
    <g fill="${accent}"><path d="M-68 0 L0 -10 L68 0 L0 10 Z"/></g>
    <circle r="7" fill="${paper}" stroke="${deep}" stroke-width="1.6"/>
    <text y="-84" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="17" fill="${deep}">N</text>
    <text y="98" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="17" fill="${deep}">S</text>
  </g>`;
}

function sceneLetter(p: Roles): string {
  const { bg, paper, deep, accent, snow, rand } = p;
  return `
  <defs><linearGradient id="s-${p.sid}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${mix(bg, deep, 0.16)}"/><stop offset="1" stop-color="${mix(bg, paper, 0.45)}"/>
  </linearGradient></defs>
  <rect width="300" height="310" fill="url(#s-${p.sid})"/>
  <g fill="${mix(deep, accent, 0.25)}" opacity="0.45">
    <path d="M14 250 l15 -46 15 46 z"/><path d="M244 258 l17 -50 17 50 z"/><path d="M44 258 l11 -34 11 34 z"/>
  </g>
  <g stroke="${rgba(deep, 0.18)}" stroke-width="1" fill="none">
    <path d="M28 258 v34"/><path d="M49 258 v34"/><path d="M261 258 v34"/>
  </g>
  <g transform="translate(150,168) rotate(-6)">
    <rect x="-82" y="-54" width="164" height="108" rx="6" fill="${paper}" stroke="${deep}" stroke-width="2"/>
    <path d="M-82 -54 L0 12 L82 -54" fill="none" stroke="${deep}" stroke-width="2"/>
    <path d="M-82 54 L-22 8 M82 54 L22 8" stroke="${rgba(deep, 0.55)}" stroke-width="1.4" fill="none"/>
  </g>
  <circle cx="150" cy="220" r="15" fill="${accent}" stroke="${mix(accent, deep, 0.45)}" stroke-width="1.5"/>
  <circle cx="150" cy="220" r="7.5" fill="none" stroke="${rgba(paper, 0.7)}" stroke-width="1.5"/>
  <g transform="translate(238,58) rotate(6)">
    <rect x="0" y="0" width="42" height="32" fill="${paper}" stroke="${deep}" stroke-width="1.5"/>
    <path d="M0 0 L42 32" stroke="${rgba(deep, 0.35)}" stroke-width="1"/>
  </g>
  <g>${starField(30, 300, 150, snow, rand)}</g>`;
}

function sceneMoon(p: Roles): string {
  const { bg, paper, deep, accent } = p;
  return `
  <defs><linearGradient id="s-${p.sid}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${mix(deep, bg, 0.35)}"/><stop offset="1" stop-color="${deep}"/>
  </linearGradient>
  <radialGradient id="g-${p.sid}"><stop offset="0" stop-color="${rgba(paper, 0.3)}"/><stop offset="1" stop-color="${rgba(paper, 0)}"/></radialGradient></defs>
  <rect width="300" height="310" fill="url(#s-${p.sid})"/>
  <circle cx="96" cy="96" r="88" fill="url(#g-${p.sid})"/>
  <circle cx="96" cy="96" r="58" fill="${mix(paper, accent, 0.18)}"/>
  <g fill="${rgba(deep, 0.22)}">
    <circle cx="76" cy="80" r="11"/><circle cx="114" cy="112" r="8"/><circle cx="106" cy="70" r="6"/><circle cx="78" cy="120" r="6"/>
  </g>
  <g fill="${rgba(mix(paper, deep, 0.4), 0.12)}">
    <ellipse cx="150" cy="248" rx="190" ry="26"/><ellipse cx="110" cy="286" rx="210" ry="30"/>
  </g>
  <path d="M0 310 V220 L18 250 L34 210 L52 252 L70 216 L88 254 L106 222 L120 256 L140 214 L158 252 L176 220 L196 256 L214 218 L232 254 L250 222 L268 258 L286 224 L300 250 V310 Z" fill="${deep}"/>
  <g><path d="M232 300 v-26 l16 -12 l16 12 v26 z" fill="${deep}" stroke="${rgba(paper, 0.3)}" stroke-width="1"/><rect x="244" y="282" width="8" height="10" fill="${accent}"/></g>`;
}

function sceneThread(p: Roles): string {
  const { bg, paper, deep, accent, sid } = p;
  return `
  <defs><linearGradient id="s-${sid}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${mix(bg, paper, 0.36)}"/><stop offset="1" stop-color="${mix(bg, deep, 0.24)}"/>
  </linearGradient></defs>
  <rect width="300" height="310" fill="url(#s-${sid})"/>
  <circle cx="230" cy="78" r="26" fill="${mix(paper, accent, 0.3)}"/>
  <circle cx="230" cy="78" r="40" fill="${rgba(paper, 0.14)}"/>
  <g fill="${accent}"><circle cx="42" cy="176" r="3"/><circle cx="92" cy="150" r="2.4"/><circle cx="262" cy="150" r="2.6"/><circle cx="196" cy="128" r="2.2"/></g>
  <g fill="none" stroke-linecap="round">
    <path d="M-12 232 q42 -22 84 0 t84 0 t84 0 t84 0" stroke="${mix(bg, deep, 0.4)}" stroke-width="12"/>
    <path d="M-12 264 q42 -22 84 0 t84 0 t84 0 t84 0" stroke="${mix(bg, deep, 0.56)}" stroke-width="12"/>
    <path d="M-12 296 q42 -22 84 0 t84 0 t84 0 t84 0" stroke="${mix(bg, deep, 0.72)}" stroke-width="12"/>
  </g>
  <path d="M70 96 C112 152 148 118 190 170 S232 208 210 250" fill="none" stroke="${paper}" stroke-width="3" stroke-linecap="round"/>
  <g transform="translate(66,84) rotate(-42)">
    <rect x="-4" y="-34" width="8" height="52" rx="4" fill="${paper}"/>
    <rect x="-64" y="-2" width="64" height="4" rx="2" fill="${paper}"/>
    <circle cx="-66" cy="0" r="4" fill="none" stroke="${accent}" stroke-width="1.6"/>
  </g>`;
}

function sceneVinyl(p: Roles): string {
  const { bg, paper, deep, accent, sid } = p;
  return `
  <defs><linearGradient id="s-${sid}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${mix(bg, paper, 0.4)}"/><stop offset="0.6" stop-color="${mix(bg, accent, 0.3)}"/><stop offset="1" stop-color="${mix(bg, deep, 0.3)}"/>
  </linearGradient></defs>
  <rect width="300" height="310" fill="url(#s-${sid})"/>
  <circle cx="150" cy="148" r="94" fill="${deep}"/>
  <circle cx="150" cy="148" r="72" fill="none" stroke="${rgba(paper, 0.22)}" stroke-width="1.4"/>
  <circle cx="150" cy="148" r="58" fill="none" stroke="${rgba(paper, 0.16)}" stroke-width="1.2"/>
  <circle cx="150" cy="148" r="44" fill="none" stroke="${rgba(paper, 0.12)}" stroke-width="1.2"/>
  <path d="M92 106 A80 80 0 0 1 150 68" fill="none" stroke="${rgba(paper, 0.55)}" stroke-width="3" stroke-linecap="round"/>
  <circle cx="150" cy="148" r="28" fill="${accent}"/>
  <circle cx="150" cy="148" r="5" fill="${deep}"/>
  <g transform="translate(50,252) rotate(-8)">
    <rect x="-28" y="-17" width="56" height="34" rx="4" fill="${paper}" stroke="${deep}" stroke-width="1.6"/>
    <circle cx="-11" cy="0" r="6.5" fill="none" stroke="${deep}" stroke-width="1.6"/>
    <circle cx="11" cy="0" r="6.5" fill="none" stroke="${deep}" stroke-width="1.6"/>
    <line x1="-11" y1="0" x2="11" y2="0" stroke="${rgba(deep, 0.4)}" stroke-width="1.2"/>
  </g>`;
}

function sceneWheat(p: Roles): string {
  const { bg, paper, deep, accent, sid } = p;
  const stalk = (x: number, base: number, h: number, flip: number) => {
    let g = `<path d="M${x} ${base} V${base - h}" stroke="${mix(deep, accent, 0.35)}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
    for (let i = 0; i < 5; i += 1) {
      const y = base - h + 8 + i * 12;
      g += `<ellipse cx="${x + flip * 7}" cy="${y}" rx="6" ry="3.2" fill="${accent}" transform="rotate(${flip * 28} ${x + flip * 7} ${y})"/>`;
      g += `<ellipse cx="${x - flip * 7}" cy="${y}" rx="6" ry="3.2" fill="${accent}" transform="rotate(${flip * -28} ${x - flip * 7} ${y})"/>`;
    }
    return g;
  };
  return `
  <defs><linearGradient id="s-${sid}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${mix(bg, paper, 0.5)}"/><stop offset="1" stop-color="${mix(bg, accent, 0.3)}"/>
  </linearGradient></defs>
  <rect width="300" height="310" fill="url(#s-${sid})"/>
  <circle cx="204" cy="80" r="40" fill="${mix(paper, accent, 0.2)}"/>
  <circle cx="204" cy="80" r="58" fill="${rgba(paper, 0.16)}"/>
  ${stalk(46, 262, 132, -1)}
  ${stalk(258, 262, 120, 1)}
  ${stalk(84, 262, 96, -1)}
  <rect x="0" y="260" width="300" height="50" fill="${mix(deep, bg, 0.28)}"/>
  <ellipse cx="150" cy="252" rx="56" ry="27" fill="${mix(accent, paper, 0.28)}"/>
  <path d="M96 246 q54 -32 108 0" fill="none" stroke="${deep}" stroke-width="2"/>
  <g stroke="${rgba(deep, 0.4)}" stroke-width="1.6">
    <line x1="120" y1="236" x2="131" y2="250"/><line x1="150" y1="229" x2="150" y2="248"/><line x1="180" y1="236" x2="169" y2="250"/>
  </g>
  <g fill="${mix(deep, accent, 0.2)}"><circle cx="96" cy="270" r="3"/><circle cx="205" cy="272" r="2.4"/><circle cx="122" cy="278" r="2"/></g>`;
}

function sceneSpark(p: Roles): string {
  const { bg, paper, deep, accent, rand } = p;
  return `
  <defs>
    <linearGradient id="s-${p.sid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(deep, bg, 0.25)}"/><stop offset="1" stop-color="${deep}"/></linearGradient>
    <radialGradient id="g-${p.sid}"><stop offset="0" stop-color="${rgba(accent, 0.55)}"/><stop offset="1" stop-color="${rgba(accent, 0)}"/></radialGradient>
  </defs>
  <rect width="300" height="310" fill="url(#s-${p.sid})"/>
  <g>${starField(38, 300, 180, paper, rand)}</g>
  <circle cx="228" cy="66" r="52" fill="url(#g-${p.sid})"/>
  <circle cx="228" cy="66" r="34" fill="${mix(accent, deep, 0.5)}"/>
  <ellipse cx="228" cy="66" rx="54" ry="14" fill="none" stroke="${rgba(accent, 0.4)}" stroke-width="2" transform="rotate(-16 228 66)"/>
  <path d="M40 296 Q150 150 260 296 Z" fill="${rgba(mix(paper, accent, 0.2), 0.12)}" stroke="${rgba(paper, 0.5)}" stroke-width="1.6"/>
  <g fill="${accent}">
    <path d="M96 296 q-10 -40 8 -66 q12 28 4 66 z"/><path d="M150 296 q-4 -34 8 -52 q10 22 4 52 z"/>
    <path d="M198 296 q12 -34 -4 -58 q-14 26 -6 58 z"/>
  </g>
  <g fill="${mix(accent, paper, 0.5)}">
    <circle cx="88" cy="196" r="2.4"/><circle cx="124" cy="170" r="1.8"/><circle cx="188" cy="188" r="2.2"/>
    <circle cx="216" cy="214" r="1.6"/><circle cx="150" cy="210" r="2"/><circle cx="104" cy="228" r="1.6"/>
  </g>
  <rect x="30" y="292" width="240" height="10" rx="4" fill="${mix(deep, bg, 0.3)}"/>`;
}

function sceneHouse(p: Roles): string {
  const { bg, paper, deep, accent, rand } = p;
  return `
  <defs>
    <linearGradient id="s-${p.sid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(deep, bg, 0.4)}"/><stop offset="1" stop-color="${deep}"/></linearGradient>
    <radialGradient id="g-${p.sid}"><stop offset="0" stop-color="${rgba(accent, 0.45)}"/><stop offset="1" stop-color="${rgba(accent, 0)}"/></radialGradient>
  </defs>
  <rect width="300" height="310" fill="url(#s-${p.sid})"/>
  <g>${starField(34, 300, 170, paper, rand)}</g>
  <circle cx="60" cy="66" r="24" fill="${mix(paper, accent, 0.3)}"/>
  <circle cx="60" cy="66" r="38" fill="url(#g-${p.sid})"/>
  <path d="M70 250 V152 L150 98 L230 152 V250 Z" fill="${mix(paper, deep, 0.16)}" stroke="${rgba(deep, 0.5)}" stroke-width="2"/>
  <path d="M58 158 L150 90 L242 158" fill="none" stroke="${accent}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="136" y="196" width="28" height="54" rx="3" fill="${deep}"/>
  <g fill="${accent}">
    <rect x="92" y="176" width="22" height="20" rx="2"/><rect x="186" y="176" width="22" height="20" rx="2"/>
    <rect x="92" y="214" width="22" height="20" rx="2"/><rect x="186" y="214" width="22" height="20" rx="2"/>
  </g>
  <g transform="translate(232,84) rotate(22)" fill="none" stroke="${paper}" stroke-width="2.6" stroke-linecap="round">
    <circle cx="0" cy="0" r="7"/><line x1="7" y1="0" x2="32" y2="0"/><line x1="25" y1="0" x2="25" y2="9"/><line x1="32" y1="0" x2="32" y2="7"/>
  </g>
  <g fill="${mix(deep, bg, 0.3)}"><ellipse cx="72" cy="256" rx="36" ry="18"/><ellipse cx="238" cy="256" rx="30" ry="16"/></g>`;
}

function sceneWaves(p: Roles): string {
  const { bg, paper, deep, accent, sid } = p;
  return `
  <defs><linearGradient id="s-${sid}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${mix(bg, paper, 0.45)}"/><stop offset="1" stop-color="${mix(bg, deep, 0.24)}"/>
  </linearGradient></defs>
  <rect width="300" height="310" fill="url(#s-${sid})"/>
  <circle cx="212" cy="88" r="30" fill="${mix(paper, accent, 0.25)}"/>
  <g fill="none" stroke-linecap="round">
    <path d="M-12 180 q42 -26 84 0 t84 0 t84 0 t84 0" stroke="${mix(bg, deep, 0.35)}" stroke-width="14"/>
    <path d="M-12 220 q42 -26 84 0 t84 0 t84 0 t84 0" stroke="${mix(bg, deep, 0.5)}" stroke-width="14"/>
    <path d="M-12 260 q42 -26 84 0 t84 0 t84 0 t84 0" stroke="${mix(bg, deep, 0.65)}" stroke-width="14"/>
    <path d="M-12 300 q42 -26 84 0 t84 0 t84 0 t84 0" stroke="${mix(bg, deep, 0.8)}" stroke-width="14"/>
  </g>
  <g stroke="${rgba(paper, 0.6)}" stroke-width="3" fill="none" stroke-linecap="round">
    <path d="M64 214 q10 -8 20 0"/><path d="M164 174 q10 -8 20 0"/><path d="M120 254 q10 -8 20 0"/>
  </g>`;
}

function sceneOpenBook(p: Roles): string {
  const { bg, paper, deep, accent, sid } = p;
  return `
  <defs><linearGradient id="s-${sid}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${mix(bg, paper, 0.36)}"/><stop offset="1" stop-color="${mix(bg, deep, 0.22)}"/>
  </linearGradient></defs>
  <rect width="300" height="310" fill="url(#s-${sid})"/>
  <circle cx="150" cy="120" r="70" fill="${rgba(accent, 0.18)}"/>
  <g>
    <path d="M56 168 Q112 142 150 158 L150 262 Q112 246 56 268 Z" fill="${paper}" stroke="${deep}" stroke-width="2"/>
    <path d="M244 168 Q188 142 150 158 L150 262 Q188 246 244 268 Z" fill="${mix(paper, deep, 0.08)}" stroke="${deep}" stroke-width="2"/>
    <line x1="150" y1="158" x2="150" y2="262" stroke="${deep}" stroke-width="2"/>
    <g stroke="${rgba(deep, 0.32)}" stroke-width="1.3">
      <line x1="78" y1="186" x2="134" y2="180"/><line x1="78" y1="200" x2="134" y2="194"/><line x1="78" y1="214" x2="134" y2="208"/>
      <line x1="166" y1="180" x2="222" y2="186"/><line x1="166" y1="194" x2="222" y2="200"/><line x1="166" y1="208" x2="222" y2="214"/>
    </g>
  </g>
  <path d="M150 120 l6 16 17 2 -12 11 4 17 -15 -8 -15 8 4 -17 -12 -11 17 -2 z" fill="${accent}"/>`;
}

const SCENES: Record<string, (p: Roles) => string> = {
  lighthouse: sceneLighthouse,
  tree: sceneTree,
  map: sceneMap,
  star: sceneStar,
  compass: sceneCompass,
  letter: sceneLetter,
  moon: sceneMoon,
  thread: sceneThread,
  vinyl: sceneVinyl,
  wheat: sceneWheat,
  spark: sceneSpark,
  house: sceneHouse,
  waves: sceneWaves,
  openbook: sceneOpenBook,
};

/* --------------------------------- builder --------------------------------- */

export function buildCoverSvg(options: CoverArtOptions): string {
  const palette = options.palette && options.palette.length >= 4 ? options.palette : DEFAULT_PALETTE;
  const motif = options.motif && SCENES[options.motif] ? options.motif : "openbook";
  const id = options.id ?? `${options.title}-${motif}`;
  const p = roles(palette, id);
  const scene = SCENES[motif](p);

  const panel = p.deep;
  const rule = p.accent;
  const titleColor = mix(p.paper, "#ffffff", 0.12);
  const authorColor = mix(p.paper, p.accent, 0.35);

  const lines = wrapTitle(options.title, 20);
  const longest = Math.max(...lines.map((l) => l.length));
  const fs = clamp(Math.floor(250 / (longest * 0.55)), 20, 34);
  const lineH = fs * 1.05;
  const total = lines.length * lineH;
  const firstBaseline = 392 - total / 2 + fs * 0.8;
  const titleSpans = lines
    .map((l, i) => `<tspan x="150" y="${(firstBaseline + i * lineH).toFixed(1)}">${esc(l)}</tspan>`)
    .join("");

  const author = options.author
    ? `<text x="150" y="330" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="12" letter-spacing="3" fill="${authorColor}">${esc(options.author.toUpperCase())}</text>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 450" width="300" height="450" role="img" aria-label="${esc(`Cover of ${options.title}`)}">
  ${scene}
  <rect x="0" y="300" width="300" height="150" fill="${panel}"/>
  <rect x="0" y="296" width="300" height="4" fill="${rule}"/>
  <rect x="9" y="9" width="282" height="432" rx="7" fill="none" stroke="${rule}" stroke-width="1.4" opacity="0.28"/>
  ${author}
  <text x="150" text-anchor="middle" font-family="'Playfair Display', Georgia, 'Times New Roman', serif" font-size="${fs}" font-weight="600" fill="${titleColor}">${titleSpans}</text>
  <text x="150" y="434" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="8.5" letter-spacing="4" fill="${rgba(p.paper, 0.5)}">NOVELNEST</text>
</svg>`;
}

export function coverDataUri(options: CoverArtOptions): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(buildCoverSvg(options))}`;
}
