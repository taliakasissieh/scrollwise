// ScrollWise imagery engine.
// Every picture in the app is painted on a <canvas> from a scene "kind" and a seed, then
// cached as a JPEG data URL. Same kind + seed always gives the same picture.
// Kinds: peaks, lake, sea, beach, city, forest, dunes, aurora, bokeh, bowl, coffee, books,
//        fabric, paint, vinyl, track, court, leaves, paper, sketch, clouds

const TAU = Math.PI * 2;

/* ---------- small helpers ---------- */
function rng(seed) {
  let a = seed >>> 0;
  a = Math.imul(a ^ (a >>> 16), 0x45d9f3b);
  a = Math.imul(a ^ (a >>> 16), 0x45d9f3b);
  a = (a ^ (a >>> 16)) >>> 0;
  const next = function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  next();
  next();
  return next;
}
const rand = (r, a, b) => a + (b - a) * r();
const pick = (r, list) => list[Math.floor(r() * list.length) % list.length];

function col(c) {
  if (Array.isArray(c)) return c;
  const n = parseInt(c.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function mix(a, b, t) {
  a = col(a);
  b = col(b);
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}
function css(c, alpha = 1) {
  c = col(c);
  return `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${alpha})`;
}

function noise(r) {
  const n = 256;
  const v = new Float32Array(n);
  for (let i = 0; i < n; i++) v[i] = r();
  return (x) => {
    const i = Math.floor(x);
    const f = x - i;
    const u = f * f * (3 - 2 * f);
    const a = v[((i % n) + n) % n];
    const b = v[(((i + 1) % n) + n) % n];
    return a + (b - a) * u;
  };
}
function fbm(r, oct = 4) {
  const ns = [];
  for (let i = 0; i < oct; i++) ns.push(noise(r));
  return (x) => {
    let s = 0, amp = 1, f = 1, tot = 0;
    for (let i = 0; i < oct; i++) {
      s += ns[i](x * f + i * 17.3) * amp;
      tot += amp;
      amp *= 0.5;
      f *= 2.07;
    }
    return s / tot;
  };
}

function lin(ctx, x0, y0, x1, y1, stops) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  for (const [t, c, a] of stops) g.addColorStop(Math.max(0, Math.min(1, t)), css(c, a == null ? 1 : a));
  return g;
}
const vgrad = (ctx, y0, y1, stops) => lin(ctx, 0, y0, 0, y1, stops);
function fillAll(ctx, w, h, style) {
  ctx.fillStyle = style;
  ctx.fillRect(0, 0, w, h);
}
function glow(ctx, x, y, rad, c, a) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
  g.addColorStop(0, css(c, a));
  g.addColorStop(1, css(c, 0));
  ctx.fillStyle = g;
  ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
}
function disc(ctx, x, y, rad, fill) {
  ctx.beginPath();
  ctx.arc(x, y, Math.max(0.1, rad), 0, TAU);
  ctx.fillStyle = fill;
  ctx.fill();
}
function ellipse(ctx, x, y, rx, ry, rot, fill) {
  ctx.beginPath();
  ctx.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), rot, 0, TAU);
  ctx.fillStyle = fill;
  ctx.fill();
}
function roundRect(ctx, x, y, w, h, rad) {
  const r = Math.min(rad, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
// Path from the left edge along y(x) and back along the bottom edge.
function ridge(ctx, w, bottom, yFn, step = 3) {
  ctx.beginPath();
  ctx.moveTo(0, bottom);
  for (let x = 0; x <= w + step; x += step) ctx.lineTo(x, yFn(x));
  ctx.lineTo(w + step, bottom);
  ctx.closePath();
}
function shadowed(ctx, size, fn, alpha = 0.32) {
  ctx.save();
  ctx.shadowColor = `rgba(0,0,0,${alpha})`;
  ctx.shadowBlur = size;
  ctx.shadowOffsetX = size * 0.3;
  ctx.shadowOffsetY = size * 0.45;
  fn();
  ctx.restore();
}
function speckle(ctx, w, h, r, count, alpha) {
  for (let i = 0; i < count; i++) {
    ctx.fillStyle = r() < 0.5 ? `rgba(255,255,255,${alpha})` : `rgba(0,0,0,${alpha})`;
    ctx.fillRect(r() * w, r() * h, 1.6, 1.6);
  }
}

/* ---------- landscapes ---------- */
const PEAKS = [
  { sky: ['#27325f', '#c86b7c', '#f6b98a'], sun: '#fff1d6', far: '#c48d9c', near: '#1b1a33' },
  { sky: ['#3567b0', '#93bdee', '#e6f0fb'], sun: '#ffffff', far: '#a9c0de', near: '#1b2d4b' },
  { sky: ['#2a2456', '#8b6ab6', '#f3c8b6'], sun: '#ffeadb', far: '#a089c2', near: '#1c1736' },
  { sky: ['#123e4d', '#5ea8a1', '#e3f1e6'], sun: '#f6fff4', far: '#85b5ab', near: '#0d2a31' },
  { sky: ['#1d2a5c', '#df7459', '#ffd39c'], sun: '#fff3d1', far: '#d39079', near: '#22172f' },
];

function mountains(ctx, w, h, r, opt = {}) {
  const p = opt.palette || pick(r, PEAKS);
  const top = opt.top != null ? opt.top : h * 0.42;
  const bottom = opt.bottom != null ? opt.bottom : h * 0.9;
  const skyEnd = Math.min(h, top + h * 0.14);
  ctx.fillStyle = vgrad(ctx, 0, skyEnd, [[0, p.sky[0]], [0.62, p.sky[1]], [1, p.sky[2]]]);
  ctx.fillRect(0, 0, w, h);
  const sx = w * rand(r, 0.22, 0.78);
  const sy = top - h * rand(r, 0.04, 0.16);
  const sr = w * rand(r, 0.04, 0.065);
  glow(ctx, sx, sy, sr * 7, p.sun, 0.32);
  glow(ctx, sx, sy, sr * 2.2, p.sun, 0.5);
  disc(ctx, sx, sy, sr, css(p.sun, 0.96));
  const L = opt.layers || 5;
  for (let i = 0; i < L; i++) {
    const t = i / (L - 1);
    const n = fbm(r, 5);
    const off = rand(r, 0, 200);
    const freq = (2.4 - t * 1.0) / w;
    const amp = h * (0.2 - t * 0.07);
    const base = top + (bottom - top) * t;
    const c = mix(p.far, p.near, Math.pow(t, 0.85));
    const y = (x) => base - Math.pow(n(x * freq + off), 1.6) * amp * 1.9 + amp * 0.35;
    ridge(ctx, w, h, y, 3);
    ctx.fillStyle = vgrad(ctx, base - amp * 1.4, base + h * 0.25, [[0, mix(c, p.sun, 0.2)], [1, c]]);
    ctx.fill();
    if (i < L - 1) {
      const span = ((bottom - top) / (L - 1)) * 0.9;
      ctx.fillStyle = vgrad(ctx, base - amp * 0.2, base + span, [[0, p.sky[2], 0], [1, p.sky[2], 0.42 * (1 - t)]]);
      ctx.fillRect(0, base - amp * 0.2, w, h);
    }
  }
  return p;
}

function lake(ctx, w, h, r) {
  const hz = Math.round(h * rand(r, 0.52, 0.58));
  const off = document.createElement('canvas');
  off.width = w;
  off.height = hz;
  const o = off.getContext('2d');
  const p = pick(r, PEAKS);
  mountains(o, w, hz, r, { palette: p, top: hz * 0.5, bottom: hz * 1.02, layers: 4 });
  ctx.drawImage(off, 0, 0);
  ctx.save();
  ctx.translate(0, hz * 2);
  ctx.scale(1, -1);
  ctx.globalAlpha = 0.75;
  ctx.drawImage(off, 0, 0);
  ctx.restore();
  ctx.fillStyle = vgrad(ctx, hz, h, [[0, p.sky[2], 0.16], [1, p.near, 0.7]]);
  ctx.fillRect(0, hz, w, h - hz);
  for (let i = 0; i < 170; i++) {
    const y = hz + Math.pow(r(), 1.4) * (h - hz);
    const d = (y - hz) / (h - hz);
    const len = rand(r, 0.04, 0.2) * w * (0.4 + d);
    ctx.fillStyle = css(r() < 0.5 ? '#ffffff' : p.near, rand(r, 0.04, 0.12));
    ctx.fillRect(rand(r, -0.1, 1) * w, y, len, rand(r, 1, 2.5));
  }
  ctx.fillStyle = css(p.sky[2], 0.4);
  ctx.fillRect(0, hz - 1, w, 2);
}

const SEAS = [
  { sky: ['#1b2a5a', '#e07d6c', '#ffcf9a'], sun: '#fff4dc', sea: ['#ee9f78', '#3a3f74', '#121a3d'] },
  { sky: ['#4c8fe0', '#b9dcff', '#eef7ff'], sun: '#ffffff', sea: ['#a6d8ec', '#2c7cae', '#0d3a62'] },
  { sky: ['#2d2861', '#ac79b4', '#f6cfbf'], sun: '#ffeadb', sea: ['#d8a6bf', '#4a4988', '#1a1b44'] },
];

function sea(ctx, w, h, r, opt = {}) {
  const p = pick(r, SEAS);
  const hz = h * rand(r, 0.46, 0.56);
  ctx.fillStyle = vgrad(ctx, 0, hz, [[0, p.sky[0]], [0.65, p.sky[1]], [1, p.sky[2]]]);
  ctx.fillRect(0, 0, w, hz + 1);
  const sx = w * rand(r, 0.3, 0.7);
  const sr = w * rand(r, 0.06, 0.09);
  const sy = hz - sr * rand(r, 0.15, 0.85);
  glow(ctx, sx, sy, sr * 8, p.sun, 0.3);
  disc(ctx, sx, sy, sr, css(p.sun, 0.97));
  if (r() < 0.6) {
    const n = fbm(r, 4);
    const left = r() < 0.5;
    const y = (x) => {
      const u = left ? x / w : 1 - x / w;
      return hz - Math.max(0, 0.38 - u) * h * 0.28 * (0.6 + n(x * 0.01));
    };
    ridge(ctx, w, hz + 2, y, 3);
    ctx.fillStyle = css(mix(p.sky[1], p.sea[2], 0.7));
    ctx.fill();
  }
  ctx.fillStyle = vgrad(ctx, hz, h, [[0, p.sea[0]], [0.25, p.sea[1]], [1, p.sea[2]]]);
  ctx.fillRect(0, hz, w, h - hz);
  for (let y = hz + 1; y < h; y += rand(r, 2, 4.5)) {
    const d = (y - hz) / (h - hz);
    const half = (sr * 0.8 + d * w * 0.22) * rand(r, 0.25, 1);
    const x = sx + rand(r, -1, 1) * d * w * 0.05;
    ctx.fillStyle = css(p.sun, (1 - d) * rand(r, 0.2, 0.7));
    ctx.fillRect(x - half, y, half * 2, 1 + d * 2.5);
  }
  for (let i = 0; i < 260; i++) {
    const d = Math.pow(r(), 1.7);
    const y = hz + d * (h - hz);
    const len = w * (0.01 + d * rand(r, 0.04, 0.16));
    ctx.fillStyle = css(r() < 0.55 ? '#ffffff' : p.sea[2], rand(r, 0.05, 0.16));
    ctx.fillRect(rand(r, -0.05, 1) * w, y, len, 1 + d * 2);
  }
  if (opt.shore) shore(ctx, w, h, r);
}

function shore(ctx, w, h, r) {
  const n = fbm(r, 3);
  const base = h * rand(r, 0.78, 0.84);
  const y = (x) => base + (n(x * 0.004) - 0.5) * h * 0.09;
  ridge(ctx, w, h, y, 4);
  ctx.fillStyle = vgrad(ctx, base - h * 0.05, h, [[0, '#e9d4b2'], [1, '#b28e66']]);
  ctx.fill();
  ctx.save();
  ridge(ctx, w, h, y, 4);
  ctx.clip();
  ctx.fillStyle = vgrad(ctx, base - h * 0.05, base + h * 0.07, [[0, '#6d5a48', 0.35], [1, '#6d5a48', 0]]);
  ctx.fillRect(0, base - h * 0.06, w, h * 0.14);
  speckle(ctx, w, h, r, 1600, 0.08);
  const glass = ['#7fd1b9', '#9ec9ff', '#e6f5ff', '#86b26a', '#b8a6ff'];
  for (let i = 0; i < 18; i++) {
    const x = rand(r, 0.04, 0.96) * w;
    const yy = y(x) + rand(r, 0.03, 0.16) * h;
    const s = w * rand(r, 0.012, 0.028);
    shadowed(ctx, w * 0.006, () => ellipse(ctx, x, yy, s, s * rand(r, 0.55, 0.85), r() * TAU, css(pick(r, glass), 0.85)), 0.25);
    ellipse(ctx, x - s * 0.3, yy - s * 0.25, s * 0.35, s * 0.15, -0.5, 'rgba(255,255,255,0.65)');
  }
  ctx.restore();
  ctx.beginPath();
  for (let x = 0; x <= w; x += 4) {
    const yy = y(x) - 1;
    if (x === 0) ctx.moveTo(x, yy);
    else ctx.lineTo(x, yy);
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.85)';
  ctx.lineWidth = w * 0.007;
  ctx.stroke();
}

const CITIES = [
  { sky: ['#0b1233', '#3b2a6b', '#e2708a'], glow: '#ffb38a', far: '#3a3264', near: '#0d1028', win: '#ffd79a' },
  { sky: ['#0a1a3a', '#1f4e8a', '#86bce9'], glow: '#d6ecff', far: '#2b4878', near: '#0a1530', win: '#ffe2a8' },
  { sky: ['#140f2e', '#5a2e6e', '#ff8f6b'], glow: '#ffc08a', far: '#4a2f5c', near: '#120c22', win: '#ffd0a0' },
];

function city(ctx, w, h, r) {
  const p = pick(r, CITIES);
  const gy = h * rand(r, 0.72, 0.78);
  ctx.fillStyle = vgrad(ctx, 0, gy, [[0, p.sky[0]], [0.6, p.sky[1]], [1, p.sky[2]]]);
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 90; i++) {
    const s = rand(r, 0.6, 1.8);
    ctx.fillStyle = css('#ffffff', rand(r, 0.2, 0.8));
    ctx.fillRect(r() * w, Math.pow(r(), 1.6) * gy * 0.5, s, s);
  }
  glow(ctx, w * rand(r, 0.3, 0.7), gy, w * 0.75, p.glow, 0.35);
  let x = -10;
  ctx.fillStyle = css(p.far);
  while (x < w) {
    const bw = w * rand(r, 0.05, 0.11);
    const bh = h * rand(r, 0.12, 0.34);
    ctx.fillRect(x, gy - bh, bw, bh + 2);
    if (r() < 0.25) ctx.fillRect(x + bw * 0.45, gy - bh - h * 0.04, 2, h * 0.04);
    x += bw + rand(r, -2, 3);
  }
  ctx.fillStyle = vgrad(ctx, gy - h * 0.25, gy, [[0, p.glow, 0], [1, p.glow, 0.22]]);
  ctx.fillRect(0, gy - h * 0.25, w, h * 0.25);
  x = -w * 0.03;
  const lights = [];
  while (x < w) {
    const bw = w * rand(r, 0.08, 0.17);
    const bh = h * rand(r, 0.18, 0.5);
    const top = gy - bh;
    ctx.fillStyle = css(p.near);
    ctx.fillRect(x, top, bw, bh + 2);
    if (r() < 0.3) ctx.fillRect(x + bw * 0.2, top - h * 0.03, bw * 0.6, h * 0.03);
    const cw = Math.max(3, w * 0.012);
    const gap = cw * 1.1;
    const cols = Math.floor((bw - gap) / (cw + gap));
    const rows = Math.floor((bh - gap * 2) / (cw * 1.5 + gap));
    const density = rand(r, 0.15, 0.5);
    for (let ci = 0; ci < cols; ci++) {
      for (let ri = 0; ri < rows; ri++) {
        if (r() < density) {
          const wx = x + gap + ci * (cw + gap);
          const wy = top + gap * 2 + ri * (cw * 1.5 + gap);
          ctx.fillStyle = css(p.win, rand(r, 0.55, 0.95));
          ctx.fillRect(wx, wy, cw, cw * 1.5);
          if (r() < 0.12) lights.push([wx, wy]);
        }
      }
    }
    x += bw + rand(r, 0, 4);
  }
  ctx.fillStyle = vgrad(ctx, gy, h, [[0, mix(p.near, p.sky[2], 0.25)], [1, p.near]]);
  ctx.fillRect(0, gy, w, h - gy);
  for (const [lx, ly] of lights) {
    const d = gy - ly;
    ctx.fillStyle = css(p.win, 0.2);
    ctx.fillRect(lx, gy + d * 0.08, w * 0.012, d * rand(r, 0.25, 0.5));
  }
  for (let i = 0; i < 70; i++) {
    ctx.fillStyle = css(p.glow, rand(r, 0.05, 0.18));
    ctx.fillRect(r() * w, gy + Math.pow(r(), 1.5) * (h - gy), w * rand(r, 0.02, 0.12), 1.5);
  }
}

const FORESTS = [
  { sky: ['#bfd1cb', '#eef3ee'], sun: '#fffbea', far: '#a3bdb4', near: '#12302a' },
  { sky: ['#a7b5c8', '#e6eaf0'], sun: '#ffffff', far: '#8e9db3', near: '#192334' },
  { sky: ['#e5c3a2', '#f7e9d8'], sun: '#fff6e6', far: '#c7a68f', near: '#2a221f' },
];

function pine(ctx, x, base, H, W, tiers) {
  const s = H / tiers;
  const wk = (k) => (W * k) / tiers;
  const yk = (k) => base - H + s * k;
  ctx.beginPath();
  ctx.moveTo(x, base - H);
  for (let k = 1; k <= tiers; k++) {
    ctx.lineTo(x - wk(k), yk(k));
    if (k < tiers) ctx.lineTo(x - wk(k) * 0.42, yk(k) - s * 0.12);
  }
  for (let k = tiers; k >= 1; k--) {
    ctx.lineTo(x + wk(k), yk(k));
    if (k > 1) ctx.lineTo(x + wk(k - 1) * 0.42, yk(k - 1) - s * 0.12);
  }
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(x - W * 0.06, base - H * 0.04, W * 0.12, H * 0.08);
}

function forest(ctx, w, h, r) {
  const p = pick(r, FORESTS);
  ctx.fillStyle = vgrad(ctx, 0, h, [[0, p.sky[0]], [0.6, p.sky[1]], [1, p.sky[1]]]);
  ctx.fillRect(0, 0, w, h);
  glow(ctx, w * rand(r, 0.3, 0.7), h * rand(r, 0.15, 0.3), w * 0.55, p.sun, 0.65);
  const L = 5;
  for (let i = 0; i < L; i++) {
    const t = i / (L - 1);
    const base = h * (0.5 + t * 0.42);
    const c = mix(p.far, p.near, Math.pow(t, 0.8));
    ctx.fillStyle = css(c);
    const count = Math.round(16 - t * 9 + r() * 3);
    for (let k = 0; k < count; k++) {
      const H = h * rand(r, 0.16, 0.26) * (0.7 + t * 0.9);
      const W = H * rand(r, 0.2, 0.28);
      pine(ctx, rand(r, -0.05, 1.05) * w, base + rand(r, -0.02, 0.03) * h, H, W, 6 + Math.floor(r() * 3));
    }
    ctx.fillRect(0, base, w, h - base);
    if (i < L - 1) {
      ctx.fillStyle = vgrad(ctx, base - h * 0.2, base + h * 0.08, [[0, p.sky[1], 0], [1, p.sky[1], 0.6 - t * 0.2]]);
      ctx.fillRect(0, base - h * 0.2, w, h);
    }
  }
}

const DUNES = [
  { sky: ['#78acdc', '#f3dcbf'], sun: '#fff8e8', sand: ['#f2bb7c', '#cf7c42', '#7c3f22'] },
  { sky: ['#2f3e7a', '#f19b77'], sun: '#ffe2c4', sand: ['#f0a36e', '#b4583a', '#4e2224'] },
  { sky: ['#a8c6ea', '#f7efe3'], sun: '#ffffff', sand: ['#f5d8ab', '#d8a26a', '#8b5b38'] },
];

function dunes(ctx, w, h, r) {
  const p = pick(r, DUNES);
  ctx.fillStyle = vgrad(ctx, 0, h * 0.6, [[0, p.sky[0]], [1, p.sky[1]]]);
  ctx.fillRect(0, 0, w, h);
  const sx = w * rand(r, 0.6, 0.85);
  const sy = h * rand(r, 0.14, 0.26);
  glow(ctx, sx, sy, w * 0.45, p.sun, 0.45);
  disc(ctx, sx, sy, w * 0.035, css(p.sun, 0.95));
  const L = 4;
  for (let i = 0; i < L; i++) {
    const t = i / (L - 1);
    const n = fbm(r, 3);
    const off = rand(r, 0, 100);
    const base = h * (0.48 + t * 0.2);
    const amp = h * (0.1 + t * 0.12);
    const freq = (1.5 - t * 0.6) / w;
    // ridged noise gives the sharp crest line of a real dune
    const y = (x) => {
      const v = 1 - Math.abs(n(x * freq + off) * 2 - 1);
      return base - Math.pow(v, 1.5) * amp * 1.5 + amp * 0.3;
    };
    const haze = 0.45 * (1 - t);
    const lit = mix(p.sand[0], p.sky[1], haze);
    const mid = mix(p.sand[1], p.sky[1], haze);
    const dark = mix(p.sand[2], p.sky[0], haze * 0.8);
    for (let x = 0; x < w; x += 2) {
      const y0 = y(x);
      const s = (y0 - y(x + 2)) / 2; // > 0 means the face turns away from the sun
      const k = Math.max(-1, Math.min(1, s * 1.6));
      ctx.fillStyle = css(k > 0 ? mix(mid, dark, Math.min(1, k * 1.3)) : mix(mid, lit, Math.min(1, -k * 1.8)));
      ctx.fillRect(x, y0, 2.5, h - y0);
    }
    ctx.save();
    ridge(ctx, w, h, y, 3);
    ctx.clip();
    ctx.fillStyle = vgrad(ctx, base - amp * 0.6, base + h * 0.22, [[0, mid, 0], [1, mid, 0.88]]);
    ctx.fillRect(0, base - amp * 1.6, w, h);
    ctx.fillStyle = vgrad(ctx, base, h, [[0, p.sand[2], 0], [1, p.sand[2], 0.3]]);
    ctx.fillRect(0, base, w, h);
    ctx.restore();
    if (i === L - 1) {
      ctx.save();
      ridge(ctx, w, h, y, 3);
      ctx.clip();
      ctx.strokeStyle = css(p.sand[2], 0.13);
      ctx.lineWidth = 1.2;
      for (let k = 0; k < 18; k++) {
        const yy = base + h * 0.04 + k * h * 0.022;
        ctx.beginPath();
        for (let xx = 0; xx <= w; xx += 8) {
          const v = yy + Math.sin(xx * 0.02 + k) * h * 0.006 + (n(xx * 0.01 + k) - 0.5) * h * 0.02;
          if (xx === 0) ctx.moveTo(xx, v);
          else ctx.lineTo(xx, v);
        }
        ctx.stroke();
      }
      ctx.restore();
    }
  }
}

function aurora(ctx, w, h, r) {
  ctx.fillStyle = vgrad(ctx, 0, h, [[0, '#040817'], [0.55, '#0b1d3a'], [1, '#12384a']]);
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 260; i++) {
    const s = Math.pow(r(), 3) * 2.2 + 0.4;
    ctx.fillStyle = css('#ffffff', rand(r, 0.25, 0.95));
    ctx.fillRect(r() * w, r() * h * 0.8, s, s);
  }
  ctx.globalCompositeOperation = 'lighter';
  const sets = [['#3dffb0', '#7c5cff'], ['#5cffd8', '#3a7bff'], ['#a6ff7a', '#2fd69b']];
  for (let k = 0; k < 3; k++) {
    const [c0, c1] = pick(r, sets);
    const n = fbm(r, 3);
    const n2 = fbm(r, 3);
    const base = h * rand(r, 0.34, 0.56);
    const ph = rand(r, 0, TAU);
    const fr = rand(r, 0.6, 1.5);
    for (let x = -4; x < w + 4; x += 2) {
      const y0 = base + Math.sin((x / w) * TAU * fr + ph) * h * 0.07 + (n(x * 0.004) - 0.5) * h * 0.16;
      const len = h * (0.1 + n2(x * 0.012) * 0.32);
      const g = ctx.createLinearGradient(0, y0, 0, y0 - len);
      g.addColorStop(0, css(c0, 0));
      g.addColorStop(0.08, css(c0, 0.32 * n2(x * 0.02 + 3)));
      g.addColorStop(0.5, css(c0, 0.12));
      g.addColorStop(1, css(c1, 0));
      ctx.fillStyle = g;
      ctx.fillRect(x, y0 - len, 2, len);
    }
  }
  ctx.globalCompositeOperation = 'source-over';
  const n = fbm(r, 5);
  const base = h * 0.84;
  ridge(ctx, w, h, (x) => base - n(x * 0.003 + 9) * h * 0.14, 3);
  ctx.fillStyle = '#03060f';
  ctx.fill();
}

const BOKEH = [
  { bg: ['#0d1030', '#2a1440'], lights: ['#ffb35c', '#ff6f91', '#7ad7ff', '#ffd98a'] },
  { bg: ['#04121b', '#0f2c3c'], lights: ['#3ee3a6', '#7ab8ff', '#d6f5ff', '#9b8cff'] },
  { bg: ['#170a12', '#381320'], lights: ['#ff9d5c', '#ffcf6b', '#ff6b6b', '#ffe9c2'] },
  { bg: ['#0a1230', '#14204d'], lights: ['#5b7cff', '#b7a6ff', '#3ee3a6', '#ffffff'] },
];

function bokeh(ctx, w, h, r) {
  const p = pick(r, BOKEH);
  fillAll(ctx, w, h, lin(ctx, 0, 0, w, h, [[0, p.bg[0]], [1, p.bg[1]]]));
  glow(ctx, w * rand(r, 0.2, 0.8), h * rand(r, 0.3, 0.7), w * 0.8, pick(r, p.lights), 0.18);
  ctx.globalCompositeOperation = 'screen';
  for (let i = 0; i < 60; i++) {
    const rad = w * (r() < 0.25 ? rand(r, 0.08, 0.15) : rand(r, 0.02, 0.07));
    const x = r() * w;
    const y = rand(r, 0.05, 0.95) * h;
    const c = pick(r, p.lights);
    const a = rand(r, 0.12, 0.5);
    const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
    g.addColorStop(0, css(c, a * 0.55));
    g.addColorStop(0.82, css(c, a * 0.75));
    g.addColorStop(0.93, css(c, a));
    g.addColorStop(1, css(c, 0));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, TAU);
    ctx.fill();
  }
  for (let i = 0; i < 40; i++) glow(ctx, r() * w, r() * h, w * rand(r, 0.006, 0.016), pick(r, p.lights), rand(r, 0.5, 0.9));
  ctx.globalCompositeOperation = 'source-over';
}

/* ---------- table-top still lifes ---------- */
const TABLES = [
  { a: '#d8cbb8', b: '#c4b199', kind: 'linen' },
  { a: '#2c3038', b: '#1d2026', kind: 'slate' },
  { a: '#ece7df', b: '#d6cec1', kind: 'marble' },
  { a: '#b5835a', b: '#8a5e3c', kind: 'wood' },
];

function table(ctx, w, h, r, t) {
  fillAll(ctx, w, h, lin(ctx, 0, 0, w, h, [[0, t.a], [1, t.b]]));
  if (t.kind === 'wood') {
    const pl = h / rand(r, 4, 6);
    for (let y = 0; y < h; y += pl) {
      ctx.fillStyle = r() < 0.5 ? `rgba(0,0,0,${rand(r, 0.02, 0.07)})` : `rgba(255,255,255,${rand(r, 0.02, 0.06)})`;
      ctx.fillRect(0, y, w, pl);
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillRect(0, y, w, 1.5);
      ctx.strokeStyle = 'rgba(60,30,10,0.12)';
      ctx.lineWidth = 1;
      for (let k = 0; k < 7; k++) {
        const yy = y + rand(r, 0.1, 0.9) * pl;
        ctx.beginPath();
        for (let x = 0; x <= w; x += 10) {
          const v = yy + Math.sin(x * 0.01 + k * 3 + y) * 3;
          if (x === 0) ctx.moveTo(x, v);
          else ctx.lineTo(x, v);
        }
        ctx.stroke();
      }
    }
  } else if (t.kind === 'marble') {
    ctx.strokeStyle = 'rgba(120,110,100,0.18)';
    for (let k = 0; k < 6; k++) {
      ctx.lineWidth = rand(r, 0.6, 2);
      ctx.beginPath();
      let x = r() * w;
      let y = 0;
      ctx.moveTo(x, y);
      while (y < h) {
        x += rand(r, -18, 18);
        y += rand(r, 10, 30);
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  } else {
    speckle(ctx, w, h, r, 1800, 0.05);
  }
}

function leafShape(ctx, x, y, len, wd, rot, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.beginPath();
  ctx.moveTo(-len / 2, 0);
  ctx.bezierCurveTo(-len * 0.2, -wd, len * 0.25, -wd * 0.9, len / 2, 0);
  ctx.bezierCurveTo(len * 0.25, wd * 0.9, -len * 0.2, wd, -len / 2, 0);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function bowl(ctx, w, h, r) {
  table(ctx, w, h, r, pick(r, TABLES));
  const cx = w * rand(r, 0.44, 0.56);
  const cy = h * rand(r, 0.46, 0.54);
  const R = Math.min(w, h) * 0.37;
  const cer = pick(r, [['#f6f2ea', '#d9d1c4'], ['#2f3542', '#1b2029'], ['#c97550', '#9c4f33'], ['#dfe8ef', '#b8c7d4']]);
  shadowed(ctx, w * 0.05, () => disc(ctx, cx, cy, R, cer[0]));
  let g = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.1, cx, cy, R);
  g.addColorStop(0, cer[0]);
  g.addColorStop(1, cer[1]);
  disc(ctx, cx, cy, R, g);
  const Ri = R * 0.86;
  g = ctx.createRadialGradient(cx, cy, Ri * 0.6, cx, cy, Ri);
  g.addColorStop(0, css(cer[1]));
  g.addColorStop(1, css(mix(cer[1], '#000000', 0.25)));
  disc(ctx, cx, cy, Ri, g);
  const Rf = Ri * 0.94;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, Rf, 0, TAU);
  ctx.clip();
  const baseC = pick(r, ['#f2ece0', '#e9d9b8', '#d9b88a']);
  disc(ctx, cx, cy, Rf, baseC);
  for (let i = 0; i < 520; i++) {
    const a = r() * TAU;
    const d = Math.sqrt(r()) * Rf;
    ellipse(ctx, cx + Math.cos(a) * d, cy + Math.sin(a) * d, R * 0.035, R * 0.014, r() * TAU, css(r() < 0.5 ? '#ffffff' : mix(baseC, '#8a6a40', 0.3), rand(r, 0.4, 0.9)));
  }
  const a0 = r() * TAU;
  const at = (k, d, spread = 0) => {
    const a = a0 + k * (TAU / 4) + spread;
    return [cx + Math.cos(a) * d, cy + Math.sin(a) * d];
  };
  for (let i = 0; i < 16; i++) {
    const [x, y] = at(0, Rf * rand(r, 0.35, 0.8), rand(r, -0.5, 0.5));
    leafShape(ctx, x, y, R * rand(r, 0.16, 0.26), R * rand(r, 0.07, 0.11), r() * TAU, pick(r, ['#4f8f3a', '#6aa84f', '#3c7a32', '#85b94f']));
  }
  {
    const [x, y] = at(1, Rf * 0.55);
    const base = a0 + TAU / 4 + Math.PI / 2;
    for (let i = 0; i < 5; i++) {
      const rot = base + (i - 2) * 0.16;
      const ox = x + Math.cos(base) * (i - 2) * R * 0.02 + Math.cos(base + Math.PI / 2) * (i - 2) * R * 0.065;
      const oy = y + Math.sin(base) * (i - 2) * R * 0.02 + Math.sin(base + Math.PI / 2) * (i - 2) * R * 0.065;
      ellipse(ctx, ox, oy, R * 0.3, R * 0.075, rot, '#3f5f20');
      ellipse(ctx, ox, oy, R * 0.28, R * 0.06, rot, '#c9dd76');
      ellipse(ctx, ox + Math.cos(rot) * R * 0.05, oy + Math.sin(rot) * R * 0.05, R * 0.18, R * 0.038, rot, '#a8c95a');
    }
  }
  for (let i = 0; i < 5; i++) {
    const [x, y] = at(2, Rf * rand(r, 0.4, 0.75), rand(r, -0.45, 0.45));
    const tr = R * rand(r, 0.08, 0.11);
    const tg = ctx.createRadialGradient(x - tr * 0.3, y - tr * 0.3, tr * 0.1, x, y, tr);
    tg.addColorStop(0, '#ff8a6b');
    tg.addColorStop(1, '#c3261c');
    disc(ctx, x, y, tr, tg);
    disc(ctx, x, y, tr * 0.62, 'rgba(255,177,153,0.55)');
    for (let s = 0; s < 3; s++) {
      const aa = (s * TAU) / 3 + r();
      ellipse(ctx, x + Math.cos(aa) * tr * 0.35, y + Math.sin(aa) * tr * 0.35, tr * 0.12, tr * 0.07, aa, 'rgba(255,240,200,0.8)');
    }
  }
  {
    const [x, y] = at(3, Rf * 0.42);
    const er = R * 0.22;
    ctx.beginPath();
    for (let k = 0; k <= 24; k++) {
      const aa = (k / 24) * TAU;
      const rr = er * (1 + Math.sin(aa * 3 + 1) * 0.08);
      const px = x + Math.cos(aa) * rr;
      const py = y + Math.sin(aa) * rr * 0.85;
      if (k === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = '#fbf8f1';
    ctx.fill();
    const yg = ctx.createRadialGradient(x - er * 0.15, y - er * 0.15, 1, x, y, er * 0.45);
    yg.addColorStop(0, '#ffd35c');
    yg.addColorStop(1, '#f08a12');
    disc(ctx, x + er * 0.05, y, er * 0.42, yg);
    ellipse(ctx, x - er * 0.08, y - er * 0.12, er * 0.12, er * 0.06, -0.6, 'rgba(255,255,255,0.7)');
  }
  for (let i = 0; i < 70; i++) {
    const a = r() * TAU;
    const d = Math.sqrt(r()) * Rf * 0.9;
    ellipse(ctx, cx + Math.cos(a) * d, cy + Math.sin(a) * d, R * 0.016, R * 0.009, r() * TAU, r() < 0.7 ? '#f3e2b8' : '#2a2420');
  }
  ctx.strokeStyle = '#5aa047';
  ctx.lineWidth = R * 0.012;
  for (let i = 0; i < 14; i++) {
    const a = r() * TAU;
    const d = Math.sqrt(r()) * Rf * 0.8;
    ctx.beginPath();
    ctx.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d, R * 0.03, 0, TAU);
    ctx.stroke();
  }
  g = ctx.createRadialGradient(cx, cy, Rf * 0.75, cx, cy, Rf);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, 'rgba(0,0,0,0.22)');
  disc(ctx, cx, cy, Rf, g);
  ctx.restore();
  ctx.beginPath();
  ctx.arc(cx, cy, R * 0.93, Math.PI * 1.05, Math.PI * 1.6);
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = R * 0.03;
  ctx.lineCap = 'round';
  ctx.stroke();
  const ang = rand(r, -0.9, -0.5);
  for (let k = 0; k < 2; k++) {
    const ox = cx + R * 0.62 + k * R * 0.12;
    const oy = cy - R * 0.05 + k * R * 0.05;
    shadowed(ctx, w * 0.02, () => {
      ctx.save();
      ctx.translate(ox, oy);
      ctx.rotate(ang + k * 0.04);
      ctx.fillStyle = '#c99a62';
      roundRect(ctx, -R * 0.9, -R * 0.022, R * 1.9, R * 0.044, R * 0.02);
      ctx.fill();
      ctx.restore();
    });
  }
}

function heartPath(ctx, x, y, s) {
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.42);
  ctx.bezierCurveTo(x - s * 0.95, y - s * 0.15, x - s * 0.5, y - s * 0.95, x, y - s * 0.38);
  ctx.bezierCurveTo(x + s * 0.5, y - s * 0.95, x + s * 0.95, y - s * 0.15, x, y + s * 0.42);
  ctx.closePath();
}

function cup(ctx, w, cx, cy, R, r) {
  shadowed(ctx, w * 0.05, () => disc(ctx, cx, cy, R * 1.5, '#f4f1ec'));
  let g = ctx.createRadialGradient(cx - R * 0.4, cy - R * 0.4, R * 0.2, cx, cy, R * 1.5);
  g.addColorStop(0, '#ffffff');
  g.addColorStop(1, '#dcd6cc');
  disc(ctx, cx, cy, R * 1.5, g);
  disc(ctx, cx, cy, R * 1.12, 'rgba(0,0,0,0.06)');
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rand(r, -0.6, 0.6));
  shadowed(ctx, w * 0.015, () => {
    ctx.fillStyle = '#f7f5f1';
    roundRect(ctx, R * 0.85, -R * 0.13, R * 0.55, R * 0.26, R * 0.13);
    ctx.fill();
  });
  ctx.restore();
  shadowed(ctx, w * 0.02, () => disc(ctx, cx, cy, R, '#fbfaf7'));
  disc(ctx, cx, cy, R * 0.88, '#e9e4dc');
  const tea = r() < 0.25;
  g = ctx.createRadialGradient(cx, cy, R * 0.1, cx, cy, R * 0.84);
  if (tea) {
    g.addColorStop(0, '#d89a4a');
    g.addColorStop(0.8, '#a35a1e');
    g.addColorStop(1, '#5e2f10');
  } else {
    g.addColorStop(0, '#c08a55');
    g.addColorStop(0.75, '#7a4a28');
    g.addColorStop(1, '#3f2414');
  }
  disc(ctx, cx, cy, R * 0.84, g);
  if (!tea) {
    const s = R * 0.66;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rand(r, -0.4, 0.4));
    heartPath(ctx, 0, R * 0.04, s);
    ctx.fillStyle = '#f5e7d3';
    ctx.fill();
    heartPath(ctx, 0, R * 0.12, s * 0.62);
    ctx.fillStyle = 'rgba(160,100,55,0.45)';
    ctx.fill();
    heartPath(ctx, 0, R * 0.17, s * 0.36);
    ctx.fillStyle = '#f5e7d3';
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, -R * 0.5);
    ctx.lineTo(0, R * 0.46);
    ctx.strokeStyle = 'rgba(150,95,50,0.5)';
    ctx.lineWidth = R * 0.03;
    ctx.stroke();
    ctx.restore();
  } else {
    glow(ctx, cx - R * 0.25, cy - R * 0.25, R * 0.4, '#fff4dc', 0.35);
  }
}

function cookies(ctx, w, x, y, R, r) {
  for (let i = 0; i < 2; i++) {
    const cx = x + i * R * 1.6;
    const cy = y + rand(r, -0.3, 0.3) * R;
    shadowed(ctx, w * 0.02, () => disc(ctx, cx, cy, R, '#c98f52'));
    const g = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.1, cx, cy, R);
    g.addColorStop(0, '#e2ad6c');
    g.addColorStop(1, '#a96b34');
    disc(ctx, cx, cy, R, g);
    for (let k = 0; k < 8; k++) {
      const a = r() * TAU;
      const d = Math.sqrt(r()) * R * 0.75;
      ellipse(ctx, cx + Math.cos(a) * d, cy + Math.sin(a) * d, R * 0.11, R * 0.08, r() * TAU, '#3b2312');
    }
  }
}

function openBook(ctx, w, h, r) {
  ctx.save();
  ctx.translate(w * 0.36, h * 0.66);
  ctx.rotate(rand(r, -0.25, -0.1));
  const bw = w * 0.62;
  const bh = bw * 0.68;
  shadowed(ctx, w * 0.04, () => {
    ctx.fillStyle = '#7a4a3a';
    ctx.fillRect(-bw / 2 - 6, -bh / 2 - 6, bw + 12, bh + 12);
  });
  for (const side of [-1, 1]) {
    const x0 = side < 0 ? -bw / 2 : 0;
    ctx.fillStyle = lin(ctx, x0, 0, x0 + bw / 2, 0, side < 0 ? [[0, '#fbf8f1'], [0.85, '#f3eee4'], [1, '#d9d2c4']] : [[0, '#d9d2c4'], [0.15, '#f3eee4'], [1, '#fbf8f1']]);
    ctx.fillRect(x0, -bh / 2, bw / 2, bh);
    ctx.fillStyle = 'rgba(60,60,70,0.28)';
    for (let l = 0; l < 13; l++) {
      const lw = (bw / 2) * rand(r, 0.6, 0.78);
      ctx.fillRect(x0 + bw * 0.06, -bh / 2 + bh * 0.12 + l * bh * 0.058, l === 12 ? lw * 0.5 : lw, Math.max(1.2, bh * 0.012));
    }
  }
  ctx.restore();
}

function coffee(ctx, w, h, r, seed) {
  table(ctx, w, h, r, pick(r, [TABLES[3], TABLES[1], TABLES[2], TABLES[0]]));
  const variant = seed % 3;
  const m = Math.min(w, h);
  if (variant === 2) {
    openBook(ctx, w, h, r);
    cup(ctx, w, w * 0.72, h * 0.27, m * 0.15, r);
  } else if (variant === 1) {
    cup(ctx, w, w * 0.32, h * 0.34, m * 0.15, r);
    cup(ctx, w, w * 0.68, h * 0.66, m * 0.15, r);
    cookies(ctx, w, w * 0.62, h * 0.2, m * 0.06, r);
  } else {
    cup(ctx, w, w * 0.5, h * 0.44, m * 0.2, r);
    cookies(ctx, w, w * 0.16, h * 0.82, m * 0.07, r);
  }
}

function plant(ctx, x, base, size, r) {
  for (let i = 0; i < 11; i++) {
    const ang = -Math.PI / 2 + rand(r, -1.1, 1.1);
    const len = size * rand(r, 0.9, 1.6);
    const px = x + Math.cos(ang) * len * 0.5;
    const py = base - size * 0.9 + Math.sin(ang) * len * 0.5;
    leafShape(ctx, px, py, len, len * 0.3, ang, pick(r, ['#3f7d4a', '#5a9c5f', '#2f6a3d']));
  }
  ctx.fillStyle = lin(ctx, x - size * 0.5, 0, x + size * 0.5, 0, [[0, '#d9825e'], [1, '#a9573a']]);
  ctx.beginPath();
  ctx.moveTo(x - size * 0.55, base - size * 0.95);
  ctx.lineTo(x + size * 0.55, base - size * 0.95);
  ctx.lineTo(x + size * 0.42, base);
  ctx.lineTo(x - size * 0.42, base);
  ctx.closePath();
  ctx.fill();
}

function spine(ctx, x, y, bw, bh, c, r) {
  ctx.fillStyle = lin(ctx, x, 0, x + bw, 0, [[0, mix(c, '#ffffff', 0.18)], [0.35, c], [1, mix(c, '#000000', 0.3)]]);
  ctx.fillRect(x, y - bh, bw, bh);
  ctx.fillStyle = css(mix(c, r() < 0.5 ? '#f3d27a' : '#ffffff', 0.6), 0.85);
  ctx.fillRect(x, y - bh + bh * 0.08, bw, Math.max(1.5, bh * 0.012));
  ctx.fillRect(x, y - bh * 0.12, bw, Math.max(1.5, bh * 0.012));
  if (r() < 0.7) {
    ctx.fillStyle = css(mix(c, '#ffffff', 0.55), 0.7);
    const tw = bw * 0.36;
    ctx.fillRect(x + (bw - tw) / 2, y - bh * 0.7, tw, bh * rand(r, 0.25, 0.4));
  }
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(x + bw - 1, y - bh, 1, bh);
}

function books(ctx, w, h, r) {
  const P = pick(r, [
    { wall: ['#e9e2d6', '#d8cfc0'], wood: '#a87a50', books: ['#2f4f6f', '#b5523b', '#d9a441', '#5b7a5a', '#7d5a8c', '#e6dccb', '#1f2a44', '#c97b63'] },
    { wall: ['#1f2a3a', '#141c28'], wood: '#5e4330', books: ['#e8d9c0', '#c9a04e', '#7aa6a1', '#b45d4c', '#d8cfe8', '#5e7fb8', '#f0b7a4', '#89a86b'] },
    { wall: ['#dfe7e2', '#c8d4cd'], wood: '#b08d6a', books: ['#26405f', '#e07a5f', '#f2cc8f', '#3d5a40', '#81b29a', '#5e548e', '#f4f1de', '#9a3b3b'] },
  ]);
  ctx.fillStyle = vgrad(ctx, 0, h, [[0, P.wall[0]], [1, P.wall[1]]]);
  ctx.fillRect(0, 0, w, h);
  glow(ctx, w * 0.2, h * 0.08, w * 0.9, '#ffffff', 0.16);
  const shelves = [h * 0.47, h * 0.93];
  shelves.forEach((sy, si) => {
    let x = rand(r, -0.02, 0.03) * w;
    let plantPlaced = false;
    while (x < w * 1.02) {
      if (!plantPlaced && si === 0 && x > w * 0.55 && r() < 0.35) {
        plant(ctx, x + w * 0.09, sy, w * 0.09, r);
        x += w * 0.2;
        plantPlaced = true;
        continue;
      }
      if (r() < 0.07 && x < w * 0.8) {
        // a short stack lying flat
        let yy = sy;
        const sw = w * rand(r, 0.16, 0.22);
        for (let k = 0; k < 3; k++) {
          const th = h * rand(r, 0.025, 0.04);
          const c = pick(r, P.books);
          ctx.fillStyle = vgrad(ctx, yy - th, yy, [[0, mix(c, '#ffffff', 0.15)], [1, mix(c, '#000000', 0.25)]]);
          ctx.fillRect(x + rand(r, -4, 4), yy - th, sw, th);
          yy -= th;
        }
        x += sw + w * 0.01;
        continue;
      }
      const bw = w * rand(r, 0.035, 0.07);
      const bh = h * rand(r, 0.25, 0.37);
      const c = pick(r, P.books);
      const lean = r() < 0.08 ? rand(r, 0.1, 0.2) : 0;
      if (lean) {
        ctx.save();
        ctx.translate(x + bw, sy);
        ctx.rotate(lean);
        spine(ctx, -bw, 0, bw, bh, c, r);
        ctx.restore();
        x += bw + Math.sin(lean) * bh + 2;
      } else {
        spine(ctx, x, sy, bw, bh, c, r);
        x += bw + rand(r, 0, 2);
      }
    }
    ctx.fillStyle = vgrad(ctx, sy, sy + h * 0.035, [[0, mix(P.wood, '#ffffff', 0.15)], [1, mix(P.wood, '#000000', 0.2)]]);
    ctx.fillRect(0, sy, w, h * 0.035);
    ctx.fillStyle = vgrad(ctx, sy + h * 0.035, sy + h * 0.07, [[0, '#000000', 0.28], [1, '#000000', 0]]);
    ctx.fillRect(0, sy + h * 0.035, w, h * 0.035);
  });
}

/* ---------- textures and art ---------- */
const FABRICS = [
  ['#0f3b3a', '#2a8c83', '#b6efe4'],
  ['#2a2154', '#7c6cd6', '#ebe5ff'],
  ['#4a1a12', '#c0532f', '#ffd3b5'],
  ['#0b1a4a', '#2b59ff', '#d6e1ff'],
  ['#24321f', '#7d9a5e', '#e8f4d2'],
  ['#4a1e2e', '#d0708e', '#ffe0ea'],
];

function fabric(ctx, w, h, r) {
  const P = pick(r, FABRICS);
  const dark = col(P[0]);
  const mid = col(P[1]);
  const lite = col(P[2]);
  const sw = Math.ceil(w / 2);
  const sh = Math.ceil(h / 2);
  const off = document.createElement('canvas');
  off.width = sw;
  off.height = sh;
  const o = off.getContext('2d');
  const img = o.createImageData(sw, sh);
  const d = img.data;
  const p1 = rand(r, 0, TAU), p2 = rand(r, 0, TAU), p3 = rand(r, 0, TAU);
  const k1 = rand(r, 4.5, 7.5), k2 = rand(r, 11, 16), tilt = rand(r, -0.7, 0.7);
  for (let y = 0; y < sh; y++) {
    const v = y / sh;
    const bend = Math.sin(v * 2.3 + p1) * 0.9 + Math.sin(v * 5.1 + p2) * 0.25;
    const shade = 0.8 + 0.2 * (1 - v);
    for (let x = 0; x < sw; x++) {
      const u = x / sw;
      const f = Math.sin((u * k1 + bend + v * tilt) * Math.PI);
      const g2 = Math.sin((u * k2 + bend * 1.6 + v * 1.3 + p3) * Math.PI);
      let t = (f * 0.72 + g2 * 0.28 + 1) / 2;
      t = t * t * (3 - 2 * t);
      const sheen = Math.pow(t, 6) * 0.85;
      let R = dark[0] + (mid[0] - dark[0]) * t;
      let G = dark[1] + (mid[1] - dark[1]) * t;
      let B = dark[2] + (mid[2] - dark[2]) * t;
      R += (lite[0] - R) * sheen;
      G += (lite[1] - G) * sheen;
      B += (lite[2] - B) * sheen;
      const i = (y * sw + x) * 4;
      d[i] = R * shade;
      d[i + 1] = G * shade;
      d[i + 2] = B * shade;
      d[i + 3] = 255;
    }
  }
  o.putImageData(img, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(off, 0, 0, w, h);
}

const PAINTS = [
  { ground: '#efe9df', colors: ['#2b59ff', '#ff6b4a', '#0b1433', '#ffd166'] },
  { ground: '#0b1433', colors: ['#3ee3a6', '#b7a6ff', '#f4f1ea', '#5b7cff'] },
  { ground: '#f3e6e0', colors: ['#e2523f', '#f2b134', '#2a6f68', '#1d2433'] },
  { ground: '#e8eef7', colors: ['#1d3a8a', '#ff8fab', '#ffd166', '#2fd69b'] },
];

function paint(ctx, w, h, r) {
  const P = pick(r, PAINTS);
  fillAll(ctx, w, h, P.ground);
  speckle(ctx, w, h, r, 2500, 0.035);
  const strokes = 3 + Math.floor(r() * 3);
  for (let s = 0; s < strokes; s++) {
    const c = col(P.colors[s % P.colors.length]);
    const x0 = rand(r, -0.1, 0.35) * w, y0 = rand(r, 0.1, 0.9) * h;
    const x3 = rand(r, 0.65, 1.1) * w, y3 = rand(r, 0.1, 0.9) * h;
    const x1 = rand(r, 0.1, 0.6) * w, y1 = rand(r, -0.1, 1.1) * h;
    const x2 = rand(r, 0.4, 0.9) * w, y2 = rand(r, -0.1, 1.1) * h;
    const W = w * rand(r, 0.09, 0.2);
    const B = 34;
    const N = 90;
    const pts = [];
    for (let k = 0; k <= N; k++) {
      const t = k / N;
      const mt = 1 - t;
      pts.push([
        mt * mt * mt * x0 + 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t * x3,
        mt * mt * mt * y0 + 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t * y3,
      ]);
    }
    const nrm = pts.map((_, k) => {
      const q = pts[Math.min(N, k + 1)];
      const o = pts[Math.max(0, k - 1)];
      const dx = q[0] - o[0];
      const dy = q[1] - o[1];
      const L = Math.hypot(dx, dy) || 1;
      return [-dy / L, dx / L];
    });
    ctx.lineCap = 'round';
    for (let b = 0; b < B; b++) {
      const off = (b / (B - 1) - 0.5) * W;
      const edge = Math.abs(b / (B - 1) - 0.5) * 2;
      const start = Math.floor(r() * 4 * (1 + edge * 3));
      const end = N - Math.floor(r() * 10 * (0.3 + edge * 2));
      if (end <= start + 2) continue;
      ctx.strokeStyle = css(mix(c, r() < 0.5 ? '#ffffff' : '#000000', rand(r, 0, 0.14)), rand(r, 0.55, 0.92));
      ctx.lineWidth = (W / B) * rand(r, 1.3, 2.4);
      ctx.beginPath();
      for (let k = start; k <= end; k++) {
        const j = Math.sin(k * 0.3 + b) * W * 0.012;
        const x = pts[k][0] + nrm[k][0] * (off + j);
        const y = pts[k][1] + nrm[k][1] * (off + j);
        if (k === start) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }
  for (let i = 0; i < 40; i++) disc(ctx, r() * w, r() * h, rand(r, 1, 5), css(pick(r, P.colors), rand(r, 0.5, 0.9)));
}

const VINYLS = [
  { bg: ['#f0a35e', '#e0743c'], sleeve: ['#1d2a5c', '#f7d9b8', '#e8553f'], label: '#f7d9b8' },
  { bg: ['#9fd6c4', '#5fb7a0'], sleeve: ['#0b1433', '#ffffff', '#2fd69b'], label: '#ff6f91' },
  { bg: ['#c9bdf5', '#9d8ae6'], sleeve: ['#2a1f5c', '#ffd166', '#ff8fab'], label: '#ffd166' },
  { bg: ['#1a2238', '#0d1220'], sleeve: ['#e2523f', '#f4f1ea', '#2b59ff'], label: '#e2523f' },
];

function vinyl(ctx, w, h, r) {
  const P = pick(r, VINYLS);
  ctx.fillStyle = vgrad(ctx, 0, h, [[0, P.bg[0]], [1, P.bg[1]]]);
  ctx.fillRect(0, 0, w, h);
  speckle(ctx, w, h, r, 1200, 0.03);
  const m = Math.min(w, h);
  const S = m * 0.62;
  const sx = w * rand(r, 0.06, 0.14);
  const sy = h * rand(r, 0.08, 0.16);
  ctx.save();
  ctx.translate(sx + S / 2, sy + S / 2);
  ctx.rotate(rand(r, -0.12, 0.05));
  shadowed(ctx, w * 0.04, () => {
    ctx.fillStyle = P.sleeve[0];
    ctx.fillRect(-S / 2, -S / 2, S, S);
  });
  ctx.save();
  ctx.beginPath();
  ctx.rect(-S / 2, -S / 2, S, S);
  ctx.clip();
  disc(ctx, S * rand(r, -0.15, 0.15), S * rand(r, -0.15, 0.1), S * 0.3, P.sleeve[2]);
  ctx.fillStyle = P.sleeve[1];
  for (let k = 0; k < 6; k++) ctx.fillRect(-S / 2, -S / 2 + S * 0.62 + k * S * 0.06, S, S * 0.025);
  ctx.restore();
  ctx.restore();
  const R = m * 0.36;
  const cx = w * rand(r, 0.56, 0.64);
  const cy = h * rand(r, 0.56, 0.64);
  shadowed(ctx, w * 0.05, () => disc(ctx, cx, cy, R, '#0c0c0e'));
  const g = ctx.createRadialGradient(cx, cy, R * 0.3, cx, cy, R);
  g.addColorStop(0, '#1b1b1f');
  g.addColorStop(1, '#09090b');
  disc(ctx, cx, cy, R, g);
  ctx.lineWidth = 1;
  for (let rr = R * 0.36; rr < R * 0.98; rr += 2.2) {
    ctx.beginPath();
    ctx.arc(cx, cy, rr, 0, TAU);
    ctx.strokeStyle = Math.floor(rr) % 3 === 0 ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.025)';
    ctx.stroke();
  }
  if (typeof ctx.createConicGradient === 'function') {
    const cg = ctx.createConicGradient(rand(r, 0, TAU), cx, cy);
    [[0, 0], [0.06, 0.16], [0.13, 0], [0.5, 0], [0.56, 0.12], [0.63, 0], [1, 0]].forEach(([t, a]) => cg.addColorStop(t, `rgba(255,255,255,${a})`));
    disc(ctx, cx, cy, R, cg);
  }
  disc(ctx, cx, cy, R * 0.32, P.label);
  ctx.fillStyle = 'rgba(0,0,0,0.28)';
  ctx.fillRect(cx - R * 0.16, cy - R * 0.14, R * 0.32, R * 0.025);
  ctx.fillRect(cx - R * 0.11, cy - R * 0.09, R * 0.22, R * 0.02);
  ctx.fillRect(cx - R * 0.13, cy + R * 0.1, R * 0.26, R * 0.02);
  disc(ctx, cx, cy, R * 0.03, '#0c0c0e');
}

function track(ctx, w, h, r) {
  const P = pick(r, [
    { lane: '#c4553a', grass: '#4f8a4b', out: '#d9d3c7' },
    { lane: '#2f5fa8', grass: '#4d8c56', out: '#cfd6de' },
    { lane: '#b94a3a', grass: '#5d9150', out: '#e2d8c8' },
  ]);
  fillAll(ctx, w, h, P.out);
  speckle(ctx, w, h, r, 1500, 0.05);
  const cx = -w * rand(r, 0.05, 0.25);
  const cy = h * rand(r, 1.05, 1.2);
  const R1 = Math.hypot(w, h) * 0.55;
  const R2 = R1 + w * 0.42;
  disc(ctx, cx, cy, R2, P.lane);
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, R2, 0, TAU);
  ctx.clip();
  speckle(ctx, w, h, r, 3500, 0.07);
  ctx.restore();
  disc(ctx, cx, cy, R1, P.grass);
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, R1, 0, TAU);
  ctx.clip();
  ctx.translate(w / 2, h / 2);
  ctx.rotate(-0.5);
  for (let k = -12; k < 12; k++) {
    ctx.fillStyle = k % 2 ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
    ctx.fillRect(k * w * 0.1, -h * 1.5, w * 0.1, h * 3);
  }
  ctx.restore();
  const lanes = 8;
  ctx.strokeStyle = 'rgba(255,255,255,0.92)';
  ctx.lineWidth = w * 0.005;
  for (let k = 0; k <= lanes; k++) {
    ctx.beginPath();
    ctx.arc(cx, cy, R1 + (R2 - R1) * (k / lanes), 0, TAU);
    ctx.stroke();
  }
  const a = Math.atan2(h * 0.42 - cy, w * 0.62 - cx);
  ctx.lineWidth = w * 0.009;
  ctx.beginPath();
  ctx.moveTo(cx + Math.cos(a) * R1, cy + Math.sin(a) * R1);
  ctx.lineTo(cx + Math.cos(a) * R2, cy + Math.sin(a) * R2);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.font = `800 ${Math.round(w * 0.042)}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let k = 0; k < lanes; k++) {
    const rr = R1 + (R2 - R1) * ((k + 0.5) / lanes);
    const aa = a - 0.05;
    ctx.save();
    ctx.translate(cx + Math.cos(aa) * rr, cy + Math.sin(aa) * rr);
    ctx.rotate(aa);
    ctx.fillText(String(k + 1), 0, 0);
    ctx.restore();
  }
  ctx.fillStyle = 'rgba(20,10,0,0.16)';
  for (let k = 0; k < 2; k++) {
    ctx.save();
    ctx.translate(w * rand(r, 0.2, 0.8), h * rand(r, 0.1, 0.6));
    ctx.rotate(0.7);
    ctx.fillRect(0, 0, w * 0.9, w * 0.012);
    ctx.restore();
  }
  fillAll(ctx, w, h, lin(ctx, 0, 0, w, h, [[0, '#ffcf8a', 0.22], [1, '#ffcf8a', 0]]));
}

function court(ctx, w, h, r) {
  const P = pick(r, [
    { floor: '#2f6e8f', outer: '#d9773f' },
    { floor: '#3b7d5a', outer: '#c94f3d' },
    { floor: '#30407a', outer: '#e0a341' },
  ]);
  fillAll(ctx, w, h, P.outer);
  speckle(ctx, w, h, r, 2500, 0.05);
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.rotate(rand(r, -0.35, 0.35));
  const S = Math.max(w, h) * 1.05;
  const cw = S * 0.78;
  const ch = S * 1.5;
  const ox = -cw / 2;
  const oy = -ch * 0.22;
  ctx.fillStyle = P.floor;
  ctx.fillRect(ox, oy, cw, ch);
  ctx.strokeStyle = 'rgba(255,255,255,0.92)';
  ctx.lineWidth = w * 0.007;
  ctx.strokeRect(ox, oy, cw, ch);
  const kw = cw * 0.32;
  const kh = cw * 0.38;
  ctx.fillStyle = css(mix(P.floor, P.outer, 0.55));
  ctx.fillRect(-kw / 2, oy, kw, kh);
  ctx.strokeRect(-kw / 2, oy, kw, kh);
  ctx.beginPath();
  ctx.arc(0, oy + kh, kw / 2, 0, Math.PI);
  ctx.stroke();
  const R3 = cw * 0.44;
  const a3 = 0.2;
  ctx.beginPath();
  ctx.moveTo(-Math.cos(a3) * R3, oy);
  ctx.lineTo(-Math.cos(a3) * R3, oy + cw * 0.08 + Math.sin(a3) * R3);
  ctx.arc(0, oy + cw * 0.08, R3, Math.PI - a3, a3, true);
  ctx.lineTo(Math.cos(a3) * R3, oy);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(ox, oy + ch / 2);
  ctx.lineTo(ox + cw, oy + ch / 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, oy + ch / 2, cw * 0.16, 0, TAU);
  ctx.stroke();
  ctx.fillStyle = 'rgba(8,12,30,0.3)';
  ctx.beginPath();
  ctx.moveTo(-w * 0.01, oy - cw * 0.04);
  ctx.lineTo(w * 0.01, oy - cw * 0.04);
  ctx.lineTo(cw * 0.36, oy + cw * 0.5);
  ctx.lineTo(cw * 0.34, oy + cw * 0.5);
  ctx.closePath();
  ctx.fill();
  ctx.save();
  ctx.translate(cw * 0.36, oy + cw * 0.52);
  ctx.rotate(0.55);
  ctx.fillRect(-cw * 0.12, -cw * 0.035, cw * 0.24, cw * 0.07);
  ctx.restore();
  ctx.restore();
  fillAll(ctx, w, h, lin(ctx, 0, 0, w, h, [[0, '#ffd59a', 0.2], [1, '#ffd59a', 0]]));
}

function bigLeaf(ctx, x, y, len, wd, rot, c) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.beginPath();
  ctx.moveTo(-len / 2, 0);
  ctx.bezierCurveTo(-len * 0.25, -wd * 1.15, len * 0.2, -wd * 1.05, len / 2, 0);
  ctx.bezierCurveTo(len * 0.2, wd * 1.05, -len * 0.25, wd * 1.15, -len / 2, 0);
  ctx.closePath();
  ctx.fillStyle = lin(ctx, 0, -wd, 0, wd, [[0, mix(c, '#000000', 0.15)], [0.5, mix(c, '#ffffff', 0.12)], [1, mix(c, '#000000', 0.25)]]);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = css(mix(c, '#ffffff', 0.45), 0.7);
  ctx.lineWidth = Math.max(1, wd * 0.05);
  ctx.beginPath();
  ctx.moveTo(-len / 2, 0);
  ctx.quadraticCurveTo(0, -wd * 0.05, len * 0.47, 0);
  ctx.stroke();
  ctx.lineWidth = Math.max(0.8, wd * 0.025);
  ctx.strokeStyle = css(mix(c, '#ffffff', 0.35), 0.45);
  for (let k = 1; k < 9; k++) {
    const px = (-0.5 + k / 9) * len;
    const span = Math.sin((k / 9) * Math.PI) * wd * 0.9;
    for (const sg of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.quadraticCurveTo(px + len * 0.05, sg * span * 0.5, px + len * 0.11, sg * span);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function leaves(ctx, w, h, r) {
  const P = pick(r, [
    { bg: '#e7eee4', greens: ['#2f6b3a', '#3f8a4a', '#5aa35b', '#7fbf6a', '#1f4d2c'] },
    { bg: '#1a2a24', greens: ['#3f8a4a', '#6dbb6a', '#a4d68a', '#2b5e3a', '#89c99a'] },
    { bg: '#f1ebe2', greens: ['#55745a', '#7b9a6e', '#a8b98a', '#3c5a44', '#c9b27a'] },
    { bg: '#dfe9f1', greens: ['#2f6b55', '#3e8c74', '#5fb39a', '#2b4f63', '#8bc7b0'] },
  ]);
  fillAll(ctx, w, h, P.bg);
  glow(ctx, w * 0.5, h * 0.45, w * 0.7, '#ffffff', 0.25);
  const N = 11 + Math.floor(r() * 5);
  for (let i = 0; i < N; i++) {
    const side = Math.floor(r() * 4);
    let x;
    let y;
    if (side === 0) { x = r() * w; y = -h * 0.05; }
    else if (side === 1) { x = w * 1.05; y = r() * h; }
    else if (side === 2) { x = r() * w; y = h * 1.05; }
    else { x = -w * 0.05; y = r() * h; }
    const ang = Math.atan2(h * rand(r, 0.35, 0.65) - y, w * rand(r, 0.35, 0.65) - x) + rand(r, -0.4, 0.4);
    const len = w * rand(r, 0.38, 0.62);
    const wd = len * rand(r, 0.17, 0.24);
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.28)';
    ctx.shadowBlur = w * 0.035;
    ctx.shadowOffsetX = w * 0.01;
    ctx.shadowOffsetY = w * 0.018;
    bigLeaf(ctx, x + Math.cos(ang) * len * 0.45, y + Math.sin(ang) * len * 0.45, len, wd, ang, pick(r, P.greens));
    ctx.restore();
  }
}

const PAPERS = [
  ['#fdf0e1', '#f7c59f', '#f08a5d', '#b83b5e', '#6a2c70', '#2d1b45'],
  ['#e9fbf3', '#a7ecd0', '#5cc8a9', '#2b8c8c', '#1d5c6f', '#0f2f45'],
  ['#f1edff', '#cfc2ff', '#9f8cf0', '#6a5acd', '#3d3a8f', '#1c1d4a'],
  ['#eaf2ff', '#bcd2ff', '#7fa2ff', '#3f63e6', '#20368f', '#0b1433'],
];

function paperCut(ctx, w, h, r) {
  const P = pick(r, PAPERS);
  fillAll(ctx, w, h, P[0]);
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.2)';
  ctx.shadowBlur = w * 0.03;
  ctx.shadowOffsetY = w * 0.01;
  disc(ctx, w * rand(r, 0.25, 0.75), h * rand(r, 0.17, 0.28), w * 0.11, P[1]);
  ctx.restore();
  for (let i = 1; i < P.length; i++) {
    const t = (i - 1) / (P.length - 2);
    const base = h * (0.36 + t * 0.5);
    const amp = h * rand(r, 0.035, 0.07);
    const fr = rand(r, 1, 2.4);
    const ph = rand(r, 0, TAU);
    const n = fbm(r, 3);
    const y = (x) => base + Math.sin((x / w) * TAU * fr + ph) * amp + (n(x * 0.006) - 0.5) * amp * 1.4;
    ctx.save();
    ctx.shadowColor = 'rgba(20,10,40,0.32)';
    ctx.shadowBlur = w * 0.035;
    ctx.shadowOffsetY = -w * 0.005;
    ridge(ctx, w, h, y, 4);
    ctx.fillStyle = P[i];
    ctx.fill();
    ctx.restore();
  }
  speckle(ctx, w, h, r, 2500, 0.03);
}

function hatch(ctx, w, h, clipFns, angle, spacing, alpha, r) {
  ctx.save();
  for (const fn of clipFns) {
    fn();
    ctx.clip();
  }
  ctx.translate(w / 2, h / 2);
  ctx.rotate(angle);
  ctx.strokeStyle = `rgba(47,50,58,${alpha})`;
  ctx.lineWidth = 1.1;
  const L = Math.hypot(w, h);
  for (let y = -L; y < L; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(-L, y + rand(r, -0.6, 0.6));
    ctx.lineTo(L, y + rand(r, -0.6, 0.6));
    ctx.stroke();
  }
  ctx.restore();
}

function sketch(ctx, w, h, r) {
  fillAll(ctx, w, h, '#f6f4ee');
  ctx.strokeStyle = 'rgba(90,120,170,0.13)';
  ctx.lineWidth = 1;
  const gs = w / 22;
  for (let x = gs; x < w; x += gs) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let y = gs; y < h; y += gs) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
  const sx = w * rand(r, 0.32, 0.4);
  const sy = h * rand(r, 0.42, 0.5);
  const R = w * 0.19;
  const sphere = () => { ctx.beginPath(); ctx.arc(sx, sy, R, 0, TAU); };
  hatch(ctx, w, h, [() => { ctx.beginPath(); ctx.ellipse(sx + R * 0.6, sy + R * 0.95, R * 1.05, R * 0.26, 0, 0, TAU); }], 0.75, 5, 0.38, r);
  hatch(ctx, w, h, [sphere, () => { ctx.beginPath(); ctx.arc(sx + R * 0.35, sy + R * 0.4, R * 1.05, 0, TAU); }], 0.8, 6, 0.32, r);
  hatch(ctx, w, h, [sphere, () => { ctx.beginPath(); ctx.arc(sx + R * 0.55, sy + R * 0.6, R * 0.82, 0, TAU); }], -0.45, 5, 0.32, r);
  hatch(ctx, w, h, [sphere, () => { ctx.beginPath(); ctx.arc(sx + R * 0.72, sy + R * 0.78, R * 0.58, 0, TAU); }], 1.35, 4, 0.36, r);
  ctx.strokeStyle = 'rgba(40,42,50,0.8)';
  for (let k = 0; k < 2; k++) {
    ctx.lineWidth = 1.6 - k * 0.6;
    ctx.beginPath();
    for (let t = 0; t <= 64; t++) {
      const a = (t / 64) * TAU;
      const rr = R + rand(r, -1.2, 1.2) + k * 1.5;
      const x = sx + Math.cos(a) * rr;
      const y = sy + Math.sin(a) * rr;
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  const bx = w * rand(r, 0.66, 0.72);
  const by = h * rand(r, 0.5, 0.56);
  const s = w * 0.14;
  const top = [[bx, by - s], [bx + s * 0.87, by - s * 0.5], [bx, by], [bx - s * 0.87, by - s * 0.5]];
  const left = [[bx - s * 0.87, by - s * 0.5], [bx, by], [bx, by + s], [bx - s * 0.87, by + s * 0.5]];
  const right = [[bx, by], [bx + s * 0.87, by - s * 0.5], [bx + s * 0.87, by + s * 0.5], [bx, by + s]];
  const poly = (pts) => () => { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); };
  hatch(ctx, w, h, [() => { ctx.beginPath(); ctx.ellipse(bx + s * 0.9, by + s * 0.85, s * 1.1, s * 0.22, -0.1, 0, TAU); }], 0.6, 5, 0.3, r);
  hatch(ctx, w, h, [poly(left)], 0.9, 7, 0.3, r);
  hatch(ctx, w, h, [poly(right)], 0.9, 4, 0.38, r);
  hatch(ctx, w, h, [poly(right)], -0.6, 5, 0.3, r);
  ctx.strokeStyle = 'rgba(40,42,50,0.8)';
  ctx.lineWidth = 1.5;
  for (const p of [top, left, right]) { poly(p)(); ctx.stroke(); }
  ctx.save();
  ctx.translate(w * 0.58, h * 0.86);
  ctx.rotate(-0.38);
  const L = w * 0.56;
  const t = w * 0.042;
  shadowed(ctx, w * 0.02, () => { ctx.fillStyle = '#f2c14e'; ctx.fillRect(0, -t / 2, L, t); }, 0.25);
  ctx.fillStyle = '#f2c14e';
  ctx.fillRect(0, -t / 2, L, t);
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.fillRect(0, t * 0.1, L, t * 0.4);
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.fillRect(0, -t / 2, L, t * 0.18);
  ctx.fillStyle = '#e8c9a0';
  ctx.beginPath();
  ctx.moveTo(0, -t / 2);
  ctx.lineTo(-t * 1.6, 0);
  ctx.lineTo(0, t / 2);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#3a3a40';
  ctx.beginPath();
  ctx.moveTo(-t * 1.05, -t * 0.17);
  ctx.lineTo(-t * 1.6, 0);
  ctx.lineTo(-t * 1.05, t * 0.17);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#c9ccd2';
  ctx.fillRect(L, -t / 2, t * 0.7, t);
  ctx.fillStyle = '#f19aa5';
  roundRect(ctx, L + t * 0.7, -t / 2, t * 0.9, t, t * 0.25);
  ctx.fill();
  ctx.restore();
}

function clouds(ctx, w, h, r) {
  const P = pick(r, [
    ['#4f8fe8', '#a9cdf7', '#e9f3ff'],
    ['#e98e6a', '#f5c4a8', '#fbe7da'],
    ['#7468d4', '#b3acf0', '#ebe8ff'],
    ['#2f7fb8', '#8cc8ea', '#e2f4fb'],
  ]);
  ctx.fillStyle = vgrad(ctx, 0, h, [[0, P[0]], [0.6, P[1]], [1, P[2]]]);
  ctx.fillRect(0, 0, w, h);
  glow(ctx, w * rand(r, 0.6, 0.95), h * rand(r, 0.05, 0.2), w * 0.6, '#ffffff', 0.45);
  const shade = mix(P[1], P[0], 0.45);
  const C = 6;
  for (let c = 0; c < C; c++) {
    const t = c / (C - 1);
    const cy = h * (0.18 + t * 0.72) + rand(r, -0.05, 0.05) * h;
    const cx = rand(r, 0, 1) * w;
    const cw = w * (0.35 + t * 0.45);
    const ch = cw * 0.3;
    // soft grey underside first, then many small translucent puffs on top
    const ug = ctx.createRadialGradient(cx, cy, 0, cx, cy, cw * 0.55);
    ug.addColorStop(0, css(shade, 0.22));
    ug.addColorStop(1, css(shade, 0));
    ctx.fillStyle = ug;
    ctx.beginPath();
    ctx.ellipse(cx, cy, cw * 0.55, ch * 0.45, 0, 0, TAU);
    ctx.fill();
    for (let p = 0; p < 42; p++) {
      const u = rand(r, -0.5, 0.5);
      const px = cx + u * cw;
      const py = cy - Math.cos(u * Math.PI) * ch * rand(r, 0.15, 0.95) + rand(r, -0.08, 0.05) * ch;
      const pr = ch * (0.22 + Math.cos(u * Math.PI) * 0.38) * rand(r, 0.6, 1.1);
      const g = ctx.createRadialGradient(px, py - pr * 0.25, 0, px, py, pr);
      g.addColorStop(0, 'rgba(255,255,255,0.62)');
      g.addColorStop(0.45, 'rgba(255,255,255,0.36)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, TAU);
      ctx.fill();
    }
  }
}

/* ---------- macro flower ---------- */
const BLOOMS = [
  { bg: ['#16301f', '#4b7a46'], petal: ['#ffe1e8', '#f27ca0', '#a8284f'], center: '#f6c445' },
  { bg: ['#251c4c', '#6b5bb5'], petal: ['#fff6cf', '#ffcf5c', '#d9821a'], center: '#5e3210' },
  { bg: ['#0c2533', '#2f6f86'], petal: ['#f6f4ff', '#c9bfff', '#6f5acb'], center: '#ffd36b' },
  { bg: ['#341a12', '#9c4e35'], petal: ['#fff3ea', '#ffb38a', '#d8562f'], center: '#ffe08a' },
];

function flower(ctx, cx, cy, R, P, r, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  for (let L = 0; L < 3; L++) {
    const n = 8 + L * 3;
    const rr = R * (1 - L * 0.25);
    const off = r() * TAU;
    for (let k = 0; k < n; k++) {
      const a = off + (k / n) * TAU + rand(r, -0.08, 0.08);
      const len = rr * rand(r, 0.85, 1);
      const wd = rr * 0.33 * (1 - L * 0.1);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(a);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(len * 0.3, -wd, len * 0.85, -wd * 0.9, len, 0);
      ctx.bezierCurveTo(len * 0.85, wd * 0.9, len * 0.3, wd, 0, 0);
      ctx.closePath();
      ctx.fillStyle = lin(ctx, 0, 0, len, 0, [[0, P.petal[2]], [0.45, P.petal[1]], [1, P.petal[0]]]);
      ctx.shadowColor = 'rgba(0,0,0,0.28)';
      ctx.shadowBlur = R * 0.07;
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.strokeStyle = css(P.petal[2], 0.22);
      ctx.lineWidth = Math.max(1, wd * 0.04);
      ctx.beginPath();
      ctx.moveTo(len * 0.12, 0);
      ctx.lineTo(len * 0.85, 0);
      ctx.stroke();
      ctx.restore();
    }
  }
  const cg = ctx.createRadialGradient(cx - R * 0.04, cy - R * 0.04, 0, cx, cy, R * 0.2);
  cg.addColorStop(0, css(mix(P.center, '#ffffff', 0.3)));
  cg.addColorStop(1, css(mix(P.center, '#000000', 0.35)));
  disc(ctx, cx, cy, R * 0.2, cg);
  for (let i = 0; i < 90; i++) {
    const a = r() * TAU;
    const d = Math.sqrt(r()) * R * 0.18;
    disc(ctx, cx + Math.cos(a) * d, cy + Math.sin(a) * d, R * 0.012, css(mix(P.center, '#000000', r() * 0.5), 0.8));
  }
  ctx.restore();
}

function bloom(ctx, w, h, r) {
  const P = pick(r, BLOOMS);
  fillAll(ctx, w, h, lin(ctx, 0, 0, w, h, [[0, P.bg[0]], [1, P.bg[1]]]));
  ctx.globalCompositeOperation = 'screen';
  for (let i = 0; i < 18; i++) glow(ctx, r() * w, r() * h, w * rand(r, 0.08, 0.22), pick(r, [P.petal[1], P.bg[1], '#ffffff']), rand(r, 0.08, 0.2));
  ctx.globalCompositeOperation = 'source-over';
  flower(ctx, w * rand(r, 0.08, 0.28), h * rand(r, 0.12, 0.28), w * 0.2, P, r, 0.32);
  flower(ctx, w * rand(r, 0.45, 0.6), h * rand(r, 0.5, 0.6), Math.min(w, h) * 0.42, P, r, 1);
}

/* ---------- guitar close-up ---------- */
function guitar(ctx, w, h, r) {
  const W = pick(r, [['#ebbb7d', '#b4733a'], ['#7a4a2a', '#3a2213'], ['#f3d8ae', '#c4945a']]);
  fillAll(ctx, w, h, lin(ctx, 0, 0, w, h, [[0, W[0]], [1, W[1]]]));
  ctx.strokeStyle = 'rgba(60,30,10,0.10)';
  ctx.lineWidth = 1.2;
  for (let k = 0; k < 60; k++) {
    const x0 = r() * w * 1.4 - w * 0.2;
    ctx.beginPath();
    for (let y = 0; y <= h; y += 12) {
      const x = x0 + Math.sin(y * 0.01 + k) * 8 + y * 0.15;
      if (y === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.rotate(rand(r, -0.5, -0.25));
  ctx.translate(-w / 2, -h / 2);
  const cx = w * 0.42;
  const cy = h * 0.48;
  const R = Math.min(w, h) * 0.24;
  for (let k = 0; k < 5; k++) {
    ctx.beginPath();
    ctx.arc(cx, cy, R * (1.16 + k * 0.045), 0, TAU);
    ctx.strokeStyle = k % 2 ? 'rgba(30,20,10,0.55)' : 'rgba(250,240,220,0.6)';
    ctx.lineWidth = R * 0.025;
    ctx.stroke();
  }
  const hg = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R);
  hg.addColorStop(0, '#050403');
  hg.addColorStop(1, '#1c130c');
  disc(ctx, cx, cy, R, hg);
  ctx.fillStyle = vgrad(ctx, cy - R * 0.5, cy + R * 0.5, [[0, '#2a1a10'], [0.5, '#3d281a'], [1, '#1f130b']]);
  ctx.fillRect(cx + R * 1.25, cy - R * 0.5, w * 1.5, R);
  for (let k = 0; k < 6; k++) {
    ctx.fillStyle = 'rgba(225,225,215,0.85)';
    ctx.fillRect(cx + R * 1.4 + k * R * 0.55, cy - R * 0.5, R * 0.035, R);
  }
  ctx.fillStyle = '#20140c';
  roundRect(ctx, cx - R * 2.2, cy - R * 0.55, R * 0.35, R * 1.1, R * 0.08);
  ctx.fill();
  for (let s = 0; s < 6; s++) {
    const y = cy - R * 0.4 + s * ((R * 0.8) / 5);
    const th = (1 + (5 - s) * 0.35) * (w / 640) * 1.6;
    ctx.strokeStyle = s < 3 ? 'rgba(235,225,200,0.95)' : 'rgba(205,170,110,0.95)';
    ctx.lineWidth = th;
    ctx.beginPath();
    ctx.moveTo(cx - R * 2.05, y);
    ctx.lineTo(w * 1.6, y);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = th * 0.4;
    ctx.beginPath();
    ctx.moveTo(cx - R * 2.05, y - th * 0.35);
    ctx.lineTo(w * 1.6, y - th * 0.35);
    ctx.stroke();
  }
  ctx.restore();
  const px = w * rand(r, 0.6, 0.78);
  const py = h * rand(r, 0.72, 0.85);
  const ps = w * 0.07;
  shadowed(ctx, w * 0.02, () => {
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(rand(r, 0, TAU));
    ctx.beginPath();
    ctx.moveTo(0, -ps);
    ctx.quadraticCurveTo(ps * 1.1, -ps, ps * 0.75, ps * 0.2);
    ctx.quadraticCurveTo(0, ps * 1.2, -ps * 0.75, ps * 0.2);
    ctx.quadraticCurveTo(-ps * 1.1, -ps, 0, -ps);
    ctx.fillStyle = pick(r, ['#2b59ff', '#3ee3a6', '#ff6f91', '#ffd166']);
    ctx.fill();
    ctx.restore();
  }, 0.3);
  glow(ctx, w * 0.15, h * 0.1, w * 0.8, '#fff2d6', 0.22);
}

/* ---------- registry, finishing and cache ---------- */
const PAINTERS = {
  bloom,
  guitar,
  peaks: (c, w, h, r) => mountains(c, w, h, r),
  lake,
  sea: (c, w, h, r) => sea(c, w, h, r),
  beach: (c, w, h, r) => sea(c, w, h, r, { shore: true }),
  city,
  forest,
  dunes,
  aurora,
  bokeh,
  bowl,
  coffee,
  books,
  fabric,
  paint,
  vinyl,
  track,
  court,
  leaves,
  paper: paperCut,
  sketch,
  clouds,
};

const TONES = {
  peaks: '#c9908f', lake: '#8aa7c4', sea: '#d69b84', beach: '#d9a98c', city: '#2b2c5c', forest: '#a9bdb6',
  dunes: '#e2a774', aurora: '#0b2236', bokeh: '#1d1940', bowl: '#cdbba3', coffee: '#a77a55', books: '#cdbfa9',
  fabric: '#4f6fa8', paint: '#e8e1d6', vinyl: '#d98a55', track: '#c46b52', court: '#3f7280', leaves: '#7f9f7a',
  paper: '#c7a7d8', sketch: '#ecebe5', clouds: '#9cc2ef', bloom: '#5a6f4f', guitar: '#c48f55',
};
export const tone = (kind) => TONES[kind] || '#9aa3c0';

// Where to zoom when a scene is used as a small round profile picture: [x%, y%, scale].
const FOCAL = {
  peaks: [50, 52, 1.5], lake: [50, 45, 1.5], sea: [50, 46, 1.7], beach: [50, 50, 1.5], city: [50, 66, 1.7],
  forest: [50, 62, 1.5], dunes: [55, 58, 1.4], aurora: [50, 45, 1.4], bokeh: [50, 50, 1.3], bowl: [50, 50, 1.5],
  coffee: [50, 42, 1.7], books: [40, 32, 1.9], fabric: [50, 50, 1.2], paint: [50, 50, 1.4], vinyl: [62, 60, 1.6],
  track: [55, 42, 1.6], court: [50, 34, 1.5], leaves: [50, 50, 1.4], paper: [50, 42, 1.3], sketch: [38, 48, 1.8],
  clouds: [50, 50, 1.3], bloom: [55, 55, 1.6], guitar: [45, 48, 1.7],
};
export const focal = (kind) => FOCAL[kind] || [50, 50, 1.3];

const FLAT = { sketch: 1, paper: 1, paint: 1 };

// Lets other modules (src/lib/scenes.js) add their own scene kinds.
export function registerPainters(painters, tones = {}, focals = {}, flat = []) {
  Object.assign(PAINTERS, painters);
  Object.assign(TONES, tones);
  Object.assign(FOCAL, focals);
  flat.forEach((k) => {
    FLAT[k] = 1;
  });
}
let grain = null;
function grainTile() {
  if (grain) return grain;
  grain = document.createElement('canvas');
  grain.width = grain.height = 128;
  const c = grain.getContext('2d');
  const img = c.createImageData(128, 128);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.random() * 255;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  c.putImageData(img, 0, 0);
  return grain;
}

function finish(ctx, w, h, kind) {
  if (!FLAT[kind]) {
    const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.hypot(w, h) * 0.62);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, 'rgba(0,0,0,0.26)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.globalAlpha = FLAT[kind] ? 0.05 : 0.08;
  ctx.globalCompositeOperation = 'overlay';
  ctx.fillStyle = ctx.createPattern(grainTile(), 'repeat');
  ctx.fillRect(0, 0, w, h);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
}

export function paintInto(canvas, kind, seed) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const painter = PAINTERS[kind];
  try {
    if (!painter) throw new Error('Unknown art kind: ' + kind);
    painter(ctx, w, h, rng(seed * 7919 + kind.length * 104729), seed);
    finish(ctx, w, h, kind);
  } catch (err) {
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    fillAll(ctx, w, h, lin(ctx, 0, 0, w, h, [[0, tone(kind)], [1, '#0b1433']]));
  }
}

function render(kind, seed, w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  paintInto(c, kind, seed);
  try {
    return c.toDataURL('image/jpeg', 0.86);
  } catch (e) {
    return '';
  }
}

const done = new Map();
const pending = new Map();
let chain = Promise.resolve();
// Paint between frames (or when the browser is idle) so scrolling stays smooth.
const yieldFrame = () =>
  new Promise((res) => {
    if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(() => res(), { timeout: 120 });
    else setTimeout(res, 0);
  });

// Handwriting in scenes uses the Caveat web font; wait briefly for it before the first paint.
let fontsReady = null;
function waitFonts() {
  if (fontsReady) return fontsReady;
  const f = typeof document !== 'undefined' ? document.fonts : null;
  fontsReady = f && f.load ? Promise.race([f.load('700 24px Caveat').catch(() => null), new Promise((res) => setTimeout(res, 1500))]) : Promise.resolve();
  return fontsReady;
}

export function peekArt(kind, seed, w, h) {
  return done.get(`${kind}:${seed}:${w}x${h}`) || null;
}

// Renders one picture at a time so scrolling stays smooth.
export function getArt(kind, seed, w, h) {
  const key = `${kind}:${seed}:${w}x${h}`;
  if (done.has(key)) return Promise.resolve(done.get(key));
  if (pending.has(key)) return pending.get(key);
  const p = (chain = chain
    .then(waitFonts)
    .then(yieldFrame)
    .then(() => {
      const url = render(kind, seed, w, h);
      done.set(key, url);
      pending.delete(key);
      return url;
    })
    .catch(() => {
      pending.delete(key);
      return '';
    }));
  pending.set(key, p);
  return p;
}

export const artKinds = () => Object.keys(PAINTERS);

// Drawing helpers shared with src/lib/scenes.js
export { TAU, rng, rand, pick, col, mix, css, noise, fbm, lin, vgrad, fillAll, glow, disc, ellipse, roundRect, ridge, shadowed, speckle };
export { table, TABLES, leafShape, bigLeaf, heartPath, cup, cookies, plant, spine, flower, pine, BLOOMS, PAINTERS };
