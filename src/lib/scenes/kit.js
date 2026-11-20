// Flat-lay drawing kit: surfaces, soft shadows, handwriting and everyday objects.
// Every object is drawn around (0, 0) after place() moves and rotates the canvas,
// so compositions only decide where things go.
import { TAU, rand, pick, mix, css, lin, vgrad, fillAll, glow, disc, ellipse, roundRect, speckle, table, bigLeaf, leafShape, heartPath, cookies, paintInto } from '../art.js';

export { TAU, rand, pick, mix, css, lin, vgrad, fillAll, glow, disc, ellipse, roundRect, speckle, bigLeaf, leafShape, heartPath, cookies };

export const HAND = "'Caveat', 'Bradley Hand', 'Segoe Print', 'Noteworthy', 'Comic Sans MS', cursive";

export function place(ctx, x, y, rot, fn) {
  ctx.save();
  ctx.translate(x, y);
  if (rot) ctx.rotate(rot);
  fn();
  ctx.restore();
}

// Soft contact shadow. Canvas shadow offsets ignore rotation, so light always comes from the top left.
export function drop(ctx, blur, fn, alpha = 0.3) {
  ctx.save();
  ctx.shadowColor = `rgba(28,20,12,${alpha})`;
  ctx.shadowBlur = blur;
  ctx.shadowOffsetX = blur * 0.22;
  ctx.shadowOffsetY = blur * 0.42;
  fn();
  ctx.restore();
}

export function rr(ctx, x, y, w, h, r) {
  roundRect(ctx, x, y, w, h, r);
}

// A painted mini picture (used inside polaroids, phone screens, frames).
const minis = new Map();
export function mini(kind, seed, w, h) {
  const key = `${kind}:${seed}:${w}x${h}`;
  if (minis.has(key)) return minis.get(key);
  const c = document.createElement('canvas');
  c.width = Math.max(8, Math.round(w));
  c.height = Math.max(8, Math.round(h));
  paintInto(c, kind, seed);
  if (minis.size > 60) minis.clear();
  minis.set(key, c);
  return c;
}

export function hand(ctx, text, x, y, size, color = '#2b2f3a', align = 'left', weight = 600, maxW) {
  ctx.save();
  ctx.font = `${weight} ${Math.round(size)}px ${HAND}`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  if (maxW) ctx.fillText(text, x, y, maxW);
  else ctx.fillText(text, x, y);
  ctx.restore();
}

// Illegible "handwriting" line for paragraphs.
export function scribble(ctx, x, y, w, size, r, color = 'rgba(40,44,58,0.75)') {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, size * 0.11);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  let px = x;
  ctx.moveTo(px, y);
  while (px < x + w) {
    const word = size * rand(r, 1.2, 3.4);
    const end = Math.min(x + w, px + word);
    while (px < end) {
      const step = size * rand(r, 0.28, 0.45);
      const up = size * rand(r, 0.18, 0.45) * (r() < 0.15 ? 1.8 : 1);
      ctx.quadraticCurveTo(px + step * 0.3, y - up, px + step * 0.55, y);
      ctx.quadraticCurveTo(px + step * 0.8, y + up * 0.25, px + step, y);
      px += step;
    }
    px += size * rand(r, 0.5, 0.8);
    ctx.moveTo(px, y);
  }
  ctx.stroke();
  ctx.restore();
}

export function pencilLine(ctx, pts, width, color, r, passes = 2) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (let p = 0; p < passes; p++) {
    ctx.lineWidth = width * (p ? 0.6 : 1);
    ctx.globalAlpha = p ? 0.55 : 0.9;
    ctx.beginPath();
    pts.forEach(([x, y], i) => {
      const jx = x + rand(r, -0.6, 0.6) * width;
      const jy = y + rand(r, -0.6, 0.6) * width;
      if (i === 0) ctx.moveTo(jx, jy);
      else ctx.lineTo(jx, jy);
    });
    ctx.stroke();
  }
  ctx.restore();
}

/* ---------------- surfaces ---------------- */
export function backdrop(ctx, w, h, r, color) {
  fillAll(ctx, w, h, lin(ctx, 0, 0, w, h, [[0, mix(color, '#ffffff', 0.18)], [0.55, color], [1, mix(color, '#000000', 0.12)]]));
  glow(ctx, w * 0.25, h * 0.15, Math.max(w, h) * 0.8, '#ffffff', 0.16);
  speckle(ctx, w, h, r, Math.round(w * h * 0.004), 0.025);
}

function concrete(ctx, w, h, r, base = '#b9b6b0') {
  fillAll(ctx, w, h, lin(ctx, 0, 0, w, h, [[0, mix(base, '#ffffff', 0.12)], [1, mix(base, '#000000', 0.1)]]));
  for (let i = 0; i < 26; i++) glow(ctx, r() * w, r() * h, w * rand(r, 0.05, 0.2), r() < 0.5 ? '#ffffff' : '#5c5850', rand(r, 0.03, 0.08));
  speckle(ctx, w, h, r, Math.round(w * h * 0.02), 0.07);
}

function grass(ctx, w, h, r) {
  fillAll(ctx, w, h, lin(ctx, 0, 0, w, h, [[0, '#5e8f3e'], [1, '#3f6e2b']]));
  for (let i = 0; i < 30; i++) glow(ctx, r() * w, r() * h, w * rand(r, 0.08, 0.22), r() < 0.5 ? '#a6cf6a' : '#24461a', rand(r, 0.08, 0.18));
  ctx.lineCap = 'round';
  const n = Math.round(w * h * 0.012);
  for (let i = 0; i < n; i++) {
    const x = r() * w;
    const y = r() * h;
    const a = rand(r, 0, TAU);
    const l = rand(r, 4, 11) * (w / 640);
    ctx.strokeStyle = css(pick(r, ['#7fb04c', '#4f8a33', '#9ccc65', '#3c6b26', '#6fa043']), rand(r, 0.5, 0.95));
    ctx.lineWidth = rand(r, 1, 2.2) * (w / 640);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l);
    ctx.stroke();
  }
}

function knit(ctx, w, h, r, color = '#e9e1d4') {
  fillAll(ctx, w, h, color);
  const s = Math.max(10, w / 34);
  for (let y = -s; y < h + s; y += s * 0.82) {
    for (let x = 0; x < w + s; x += s) {
      for (const side of [-1, 1]) {
        ctx.save();
        ctx.translate(x + side * s * 0.22, y);
        ctx.rotate(side * 0.55);
        ellipse(ctx, 0, 0, s * 0.3, s * 0.5, 0, css(mix(color, '#000000', 0.08)));
        ellipse(ctx, -s * 0.05, -s * 0.08, s * 0.2, s * 0.36, 0, css(mix(color, '#ffffff', 0.25)));
        ctx.restore();
      }
    }
  }
}

function tiles(ctx, w, h, r, color = '#eef1f2') {
  fillAll(ctx, w, h, color);
  const s = w / 5;
  ctx.strokeStyle = 'rgba(120,130,140,0.25)';
  ctx.lineWidth = Math.max(1.5, w / 320);
  for (let x = 0; x <= w; x += s) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y <= h; y += s) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  glow(ctx, w * 0.3, h * 0.2, w, '#ffffff', 0.25);
}

export function surface(ctx, w, h, r, kind) {
  if (kind === 'oak') table(ctx, w, h, r, { a: '#d0a273', b: '#ad7d50', kind: 'wood' });
  else if (kind === 'walnut') table(ctx, w, h, r, { a: '#7c5536', b: '#573822', kind: 'wood' });
  else if (kind === 'linen') table(ctx, w, h, r, { a: '#e3d9ca', b: '#cfc2ae', kind: 'linen' });
  else if (kind === 'marble') table(ctx, w, h, r, { a: '#f1eee9', b: '#dcd6cc', kind: 'marble' });
  else if (kind === 'slate') table(ctx, w, h, r, { a: '#2e333c', b: '#1d2128', kind: 'slate' });
  else if (kind === 'concrete') concrete(ctx, w, h, r);
  else if (kind === 'court') concrete(ctx, w, h, r, '#8f6f5c');
  else if (kind === 'grass') grass(ctx, w, h, r);
  else if (kind === 'knit') knit(ctx, w, h, r);
  else if (kind === 'tiles') tiles(ctx, w, h, r);
  else backdrop(ctx, w, h, r, kind);
}

// Wall + tabletop, for front-facing still lifes.
export function room(ctx, w, h, r, wall = '#e9e3da', top = '#c49a6c', edge = 0.66) {
  const y = h * edge;
  ctx.fillStyle = vgrad(ctx, 0, y, [[0, mix(wall, '#ffffff', 0.15)], [1, mix(wall, '#000000', 0.08)]]);
  ctx.fillRect(0, 0, w, y);
  glow(ctx, w * 0.2, h * 0.1, w * 0.9, '#fff8ea', 0.35);
  ctx.fillStyle = vgrad(ctx, y, h, [[0, mix(top, '#ffffff', 0.12)], [1, mix(top, '#000000', 0.18)]]);
  ctx.fillRect(0, y, w, h - y);
  ctx.strokeStyle = 'rgba(70,40,15,0.12)';
  ctx.lineWidth = 1;
  for (let k = 0; k < 9; k++) {
    const yy = y + (h - y) * rand(r, 0.05, 0.95);
    ctx.beginPath();
    ctx.moveTo(0, yy);
    for (let x = 0; x <= w; x += 12) ctx.lineTo(x, yy + Math.sin(x * 0.012 + k) * 2);
    ctx.stroke();
  }
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.fillRect(0, y, w, Math.max(1.5, h * 0.004));
  ctx.fillStyle = vgrad(ctx, y - h * 0.05, y, [[0, '#000000', 0], [1, '#000000', 0.08]]);
  ctx.fillRect(0, y - h * 0.05, w, h * 0.05);
}

/* ---------------- tech + paper ---------------- */
// screen(ctx, sw, sh) draws the display contents in screen coordinates.
export function phone(ctx, W, screen, frame = '#1c1f27') {
  const H = W * 2.05;
  drop(ctx, W * 0.16, () => {
    ctx.fillStyle = frame;
    rr(ctx, -W / 2, -H / 2, W, H, W * 0.17);
    ctx.fill();
  }, 0.38);
  ctx.fillStyle = lin(ctx, -W / 2, 0, W / 2, 0, [[0, mix(frame, '#ffffff', 0.2)], [0.5, frame], [1, mix(frame, '#ffffff', 0.12)]]);
  rr(ctx, -W / 2, -H / 2, W, H, W * 0.17);
  ctx.fill();
  const b = W * 0.045;
  const sw = W - b * 2;
  const sh = H - b * 2;
  ctx.save();
  ctx.translate(-W / 2 + b, -H / 2 + b);
  rr(ctx, 0, 0, sw, sh, W * 0.13);
  ctx.clip();
  ctx.fillStyle = '#0a0d14';
  ctx.fillRect(0, 0, sw, sh);
  if (screen) screen(ctx, sw, sh);
  ctx.fillStyle = '#000000';
  rr(ctx, sw * 0.36, sh * 0.012, sw * 0.28, sh * 0.026, sh * 0.013);
  ctx.fill();
  ctx.fillStyle = lin(ctx, 0, 0, sw, sh, [[0, '#ffffff', 0.16], [0.35, '#ffffff', 0.03], [0.36, '#ffffff', 0], [1, '#ffffff', 0]]);
  ctx.fillRect(0, 0, sw, sh);
  ctx.restore();
}

export const screens = {
  camera: (kind, seed) => (ctx, sw, sh) => {
    const top = sh * 0.12;
    const ih = sh * 0.62;
    ctx.drawImage(mini(kind, seed, sw, ih), 0, top, sw, ih);
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = Math.max(1, sw * 0.006);
    for (let k = 1; k < 3; k++) {
      ctx.beginPath();
      ctx.moveTo((sw * k) / 3, top);
      ctx.lineTo((sw * k) / 3, top + ih);
      ctx.moveTo(0, top + (ih * k) / 3);
      ctx.lineTo(sw, top + (ih * k) / 3);
      ctx.stroke();
    }
    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = sw * 0.012;
    ctx.strokeRect(sw * 0.4, top + ih * 0.4, sw * 0.2, sw * 0.2);
    disc(ctx, sw / 2, sh * 0.86, sw * 0.13, '#ffffff');
    disc(ctx, sw / 2, sh * 0.86, sw * 0.105, '#0a0d14');
    disc(ctx, sw / 2, sh * 0.86, sw * 0.095, '#ffffff');
    ctx.fillStyle = '#ffd166';
    ctx.font = `700 ${Math.round(sw * 0.07)}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('PHOTO', sw / 2, sh * 0.775);
  },
  playlist: (seeds) => (ctx, sw, sh) => {
    fillAll(ctx, sw, sh, vgrad(ctx, 0, sh, [[0, '#2b2a6b'], [0.45, '#121530'], [1, '#0a0d14']]));
    const a = sw * 0.56;
    ctx.drawImage(mini('bokeh', seeds[0], a, a), (sw - a) / 2, sh * 0.09, a, a);
    ctx.fillStyle = '#ffffff';
    rr(ctx, sw * 0.12, sh * 0.42, sw * 0.6, sh * 0.024, sh * 0.012);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    rr(ctx, sw * 0.12, sh * 0.46, sw * 0.38, sh * 0.016, sh * 0.008);
    ctx.fill();
    disc(ctx, sw * 0.8, sh * 0.445, sw * 0.08, '#3ee3a6');
    ctx.fillStyle = '#06291d';
    ctx.beginPath();
    ctx.moveTo(sw * 0.78, sh * 0.43);
    ctx.lineTo(sw * 0.84, sh * 0.445);
    ctx.lineTo(sw * 0.78, sh * 0.46);
    ctx.fill();
    for (let i = 0; i < 5; i++) {
      const y = sh * (0.53 + i * 0.085);
      const t = sw * 0.14;
      ctx.drawImage(mini(['vinyl', 'bokeh', 'paint', 'guitar', 'clouds'][i], seeds[1] + i, t, t), sw * 0.1, y, t, t);
      ctx.fillStyle = 'rgba(255,255,255,0.88)';
      rr(ctx, sw * 0.3, y + t * 0.18, sw * rand(() => ((i * 37) % 10) / 10, 0.3, 0.5), sh * 0.016, sh * 0.008);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      rr(ctx, sw * 0.3, y + t * 0.6, sw * 0.24, sh * 0.012, sh * 0.006);
      ctx.fill();
    }
  },
  map: () => (ctx, sw, sh) => {
    fillAll(ctx, sw, sh, '#eef0e6');
    ellipse(ctx, sw * 0.7, sh * 0.3, sw * 0.3, sh * 0.12, 0.3, '#cfe6c2');
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = sw * 0.06;
    ctx.beginPath();
    ctx.moveTo(-10, sh * 0.6);
    ctx.bezierCurveTo(sw * 0.3, sh * 0.5, sw * 0.6, sh * 0.75, sw + 10, sh * 0.55);
    ctx.moveTo(sw * 0.35, -10);
    ctx.lineTo(sw * 0.45, sh + 10);
    ctx.stroke();
    ctx.strokeStyle = '#2b59ff';
    ctx.lineWidth = sw * 0.03;
    ctx.setLineDash([sw * 0.04, sw * 0.03]);
    ctx.beginPath();
    ctx.moveTo(sw * 0.4, sh * 0.85);
    ctx.lineTo(sw * 0.42, sh * 0.58);
    ctx.lineTo(sw * 0.7, sh * 0.62);
    ctx.stroke();
    ctx.setLineDash([]);
    pinMarker(ctx, sw * 0.7, sh * 0.6, sw * 0.12, '#e2523f');
  },
};

export function pinMarker(ctx, x, y, s, color = '#e2523f') {
  ctx.save();
  ctx.translate(x, y);
  drop(ctx, s * 0.2, () => {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-s * 0.55, -s * 0.55, -s * 0.5, -s * 1.15, 0, -s * 1.15);
    ctx.bezierCurveTo(s * 0.5, -s * 1.15, s * 0.55, -s * 0.55, 0, 0);
    ctx.fillStyle = color;
    ctx.fill();
  }, 0.3);
  disc(ctx, 0, -s * 0.72, s * 0.18, '#ffffff');
  ctx.restore();
}

export function polaroid(ctx, size, kind, seed, caption, r) {
  const W = size;
  const H = size * 1.19;
  drop(ctx, size * 0.07, () => {
    ctx.fillStyle = '#fbfaf6';
    ctx.fillRect(-W / 2, -H / 2, W, H);
  }, 0.32);
  ctx.fillStyle = lin(ctx, -W / 2, -H / 2, W / 2, H / 2, [[0, '#ffffff'], [1, '#ece8df']]);
  ctx.fillRect(-W / 2, -H / 2, W, H);
  const m = W * 0.06;
  const im = W - m * 2;
  ctx.drawImage(mini(kind, seed, im * 1.4, im * 1.4), -W / 2 + m, -H / 2 + m, im, im);
  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  ctx.fillRect(-W / 2 + m, -H / 2 + m, im, 1.5);
  if (caption) hand(ctx, caption, 0, H / 2 - (H - im - m) / 2 + m * 0.2, W * 0.1, '#2b2f3a', 'center');
}

export function pencil(ctx, L, color = '#f2c14e', r) {
  const t = L * 0.075;
  drop(ctx, t * 0.8, () => {
    ctx.fillStyle = color;
    ctx.fillRect(-L / 2, -t / 2, L, t);
  }, 0.28);
  ctx.fillStyle = vgrad(ctx, -t / 2, t / 2, [[0, mix(color, '#ffffff', 0.3)], [0.35, color], [0.36, mix(color, '#000000', 0.08)], [0.7, color], [1, mix(color, '#000000', 0.25)]]);
  ctx.fillRect(-L / 2 + t * 1.6, -t / 2, L - t * 1.6 - t * 1.4, t);
  ctx.fillStyle = '#e9c79c';
  ctx.beginPath();
  ctx.moveTo(-L / 2 + t * 1.6, -t / 2);
  ctx.lineTo(-L / 2, 0);
  ctx.lineTo(-L / 2 + t * 1.6, t / 2);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#34363d';
  ctx.beginPath();
  ctx.moveTo(-L / 2 + t * 0.55, -t * 0.17);
  ctx.lineTo(-L / 2, 0);
  ctx.lineTo(-L / 2 + t * 0.55, t * 0.17);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = vgrad(ctx, -t / 2, t / 2, [[0, '#e8eaee'], [0.5, '#a9adb6'], [1, '#d3d6dc']]);
  ctx.fillRect(L / 2 - t * 1.4, -t / 2, t * 0.65, t);
  ctx.fillStyle = vgrad(ctx, -t / 2, t / 2, [[0, '#f7b3bc'], [1, '#d9808d']]);
  rr(ctx, L / 2 - t * 0.78, -t / 2, t * 0.78, t, t * 0.25);
  ctx.fill();
}

export function eraser(ctx, s, color = '#f28ca0') {
  drop(ctx, s * 0.15, () => {
    ctx.fillStyle = color;
    rr(ctx, -s / 2, -s * 0.28, s, s * 0.56, s * 0.1);
    ctx.fill();
  });
  ctx.fillStyle = vgrad(ctx, -s * 0.28, s * 0.28, [[0, mix(color, '#ffffff', 0.25)], [1, mix(color, '#000000', 0.12)]]);
  rr(ctx, -s / 2, -s * 0.28, s, s * 0.56, s * 0.1);
  ctx.fill();
  ctx.fillStyle = '#2b59ff';
  ctx.fillRect(-s * 0.05, -s * 0.28, s * 0.42, s * 0.56);
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.fillRect(s * 0.04, -s * 0.12, s * 0.24, s * 0.05);
}

export function pen(ctx, L, color = '#0b1433') {
  const t = L * 0.06;
  drop(ctx, t, () => {
    ctx.fillStyle = color;
    rr(ctx, -L / 2, -t / 2, L, t, t / 2);
    ctx.fill();
  }, 0.3);
  ctx.fillStyle = vgrad(ctx, -t / 2, t / 2, [[0, mix(color, '#ffffff', 0.35)], [0.4, color], [1, mix(color, '#000000', 0.3)]]);
  rr(ctx, -L / 2, -t / 2, L, t, t / 2);
  ctx.fill();
  ctx.fillStyle = vgrad(ctx, -t / 2, t / 2, [[0, '#f4f5f7'], [0.5, '#b8bcc5'], [1, '#e2e4e8']]);
  ctx.beginPath();
  ctx.moveTo(-L / 2 + t * 0.2, -t * 0.42);
  ctx.lineTo(-L / 2 - t * 0.9, 0);
  ctx.lineTo(-L / 2 + t * 0.2, t * 0.42);
  ctx.fill();
  ctx.fillStyle = vgrad(ctx, -t, t, [[0, '#e8eaee'], [1, '#9aa0aa']]);
  rr(ctx, L * 0.1, -t * 0.75, L * 0.32, t * 0.32, t * 0.16);
  ctx.fill();
}

export function crayon(ctx, L, color) {
  const t = L * 0.13;
  drop(ctx, t * 0.6, () => {
    ctx.fillStyle = color;
    rr(ctx, -L / 2, -t / 2, L, t, t * 0.2);
    ctx.fill();
  }, 0.26);
  ctx.fillStyle = vgrad(ctx, -t / 2, t / 2, [[0, mix(color, '#ffffff', 0.35)], [0.45, color], [1, mix(color, '#000000', 0.25)]]);
  ctx.beginPath();
  ctx.moveTo(-L / 2, -t * 0.25);
  ctx.lineTo(-L / 2 + t * 1.1, -t / 2);
  ctx.lineTo(L / 2, -t / 2);
  ctx.lineTo(L / 2, t / 2);
  ctx.lineTo(-L / 2 + t * 1.1, t / 2);
  ctx.lineTo(-L / 2, t * 0.25);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.88)';
  ctx.fillRect(-L * 0.18, -t / 2, L * 0.5, t);
  ctx.fillStyle = css(mix(color, '#000000', 0.15));
  ctx.fillRect(-L * 0.16, -t * 0.2, L * 0.46, t * 0.18);
  ctx.fillRect(-L * 0.16, t * 0.1, L * 0.3, t * 0.1);
}

export function marker(ctx, L, color) {
  const t = L * 0.14;
  drop(ctx, t * 0.6, () => {
    ctx.fillStyle = '#eceef2';
    rr(ctx, -L / 2, -t / 2, L, t, t * 0.45);
    ctx.fill();
  });
  ctx.fillStyle = vgrad(ctx, -t / 2, t / 2, [[0, '#ffffff'], [1, '#c7cbd3']]);
  rr(ctx, -L / 2 + L * 0.3, -t / 2, L * 0.7, t, t * 0.45);
  ctx.fill();
  ctx.fillStyle = vgrad(ctx, -t / 2, t / 2, [[0, mix(color, '#ffffff', 0.3)], [1, mix(color, '#000000', 0.2)]]);
  rr(ctx, -L / 2, -t / 2, L * 0.34, t, t * 0.45);
  ctx.fill();
  ctx.fillRect(L * 0.38, -t / 2, L * 0.06, t);
}

// Spiral sketch pad seen from above; content(ctx, pw, ph) draws on the page.
export function sketchpad(ctx, W, H, content, cover = '#232b3d') {
  drop(ctx, W * 0.05, () => {
    ctx.fillStyle = cover;
    rr(ctx, -W / 2, -H / 2, W, H, W * 0.025);
    ctx.fill();
  }, 0.3);
  ctx.fillStyle = cover;
  rr(ctx, -W / 2, -H / 2, W, H, W * 0.025);
  ctx.fill();
  const m = W * 0.03;
  ctx.fillStyle = lin(ctx, -W / 2, -H / 2, W / 2, H / 2, [[0, '#fdfbf6'], [1, '#efeadf']]);
  ctx.fillRect(-W / 2 + m, -H / 2 + m * 2.2, W - m * 2, H - m * 3.2);
  ctx.save();
  ctx.translate(-W / 2 + m, -H / 2 + m * 2.2);
  if (content) content(ctx, W - m * 2, H - m * 3.2);
  ctx.restore();
  const n = Math.round(W / (W * 0.055));
  for (let i = 0; i < n; i++) {
    const x = -W / 2 + W * 0.06 + (i * (W * 0.88)) / (n - 1);
    ctx.strokeStyle = '#7d828c';
    ctx.lineWidth = W * 0.008;
    ctx.beginPath();
    ctx.ellipse(x, -H / 2 + m * 1.2, W * 0.012, m * 1.1, 0, Math.PI * 0.95, Math.PI * 2.05);
    ctx.stroke();
    disc(ctx, x, -H / 2 + m * 2.0, W * 0.006, '#3a3f4a');
  }
}

export function notebookOpen(ctx, W, H, left, right, color = '#c9a06a') {
  drop(ctx, W * 0.04, () => {
    ctx.fillStyle = color;
    rr(ctx, -W / 2 - W * 0.012, -H / 2 - W * 0.012, W + W * 0.024, H + W * 0.024, W * 0.02);
    ctx.fill();
  }, 0.3);
  ctx.fillStyle = color;
  rr(ctx, -W / 2 - W * 0.012, -H / 2 - W * 0.012, W + W * 0.024, H + W * 0.024, W * 0.02);
  ctx.fill();
  for (const side of [-1, 1]) {
    const x0 = side < 0 ? -W / 2 : 0;
    ctx.fillStyle = lin(ctx, x0, 0, x0 + W / 2, 0, side < 0 ? [[0, '#fcfaf4'], [0.88, '#f3eee3'], [1, '#d8d1c2']] : [[0, '#d8d1c2'], [0.12, '#f3eee3'], [1, '#fcfaf4']]);
    ctx.fillRect(x0, -H / 2, W / 2, H);
    ctx.strokeStyle = 'rgba(110,140,190,0.25)';
    ctx.lineWidth = 1;
    for (let y = -H / 2 + H * 0.12; y < H / 2 - H * 0.04; y += H * 0.075) {
      ctx.beginPath();
      ctx.moveTo(x0 + W * 0.03, y);
      ctx.lineTo(x0 + W / 2 - W * 0.03, y);
      ctx.stroke();
    }
    ctx.save();
    ctx.translate(x0, -H / 2);
    const fn = side < 0 ? left : right;
    if (fn) fn(ctx, W / 2, H);
    ctx.restore();
  }
}

export function notebook(ctx, W, H, color = '#2f4f6f', band = true) {
  drop(ctx, W * 0.07, () => {
    ctx.fillStyle = color;
    rr(ctx, -W / 2, -H / 2, W, H, W * 0.05);
    ctx.fill();
  }, 0.32);
  ctx.fillStyle = '#f4efe4';
  rr(ctx, -W / 2 + W * 0.02, -H / 2 + W * 0.02, W, H - W * 0.04, W * 0.04);
  ctx.fill();
  ctx.fillStyle = lin(ctx, -W / 2, -H / 2, W / 2, H / 2, [[0, mix(color, '#ffffff', 0.15)], [1, mix(color, '#000000', 0.15)]]);
  rr(ctx, -W / 2, -H / 2, W * 0.97, H, W * 0.05);
  ctx.fill();
  if (band) {
    ctx.fillStyle = 'rgba(15,15,20,0.75)';
    ctx.fillRect(W * 0.28, -H / 2, W * 0.05, H);
  }
}

export function bookClosed(ctx, W, H, color, title = true) {
  drop(ctx, W * 0.07, () => {
    ctx.fillStyle = color;
    rr(ctx, -W / 2, -H / 2, W, H, W * 0.03);
    ctx.fill();
  }, 0.32);
  ctx.fillStyle = '#f1ebdd';
  ctx.fillRect(-W / 2 + W * 0.04, -H / 2 + W * 0.03, W - W * 0.02, H - W * 0.06);
  ctx.strokeStyle = 'rgba(120,100,70,0.3)';
  ctx.lineWidth = 0.8;
  for (let k = 0; k < 4; k++) {
    ctx.beginPath();
    ctx.moveTo(W / 2 - W * 0.005 + k * 1.2, -H / 2 + W * 0.05);
    ctx.lineTo(W / 2 - W * 0.005 + k * 1.2, H / 2 - W * 0.05);
    ctx.stroke();
  }
  ctx.fillStyle = lin(ctx, -W / 2, 0, W / 2, 0, [[0, mix(color, '#000000', 0.3)], [0.07, mix(color, '#ffffff', 0.12)], [1, color]]);
  rr(ctx, -W / 2, -H / 2, W * 0.97, H, W * 0.03);
  ctx.fill();
  if (title) {
    ctx.fillStyle = css(mix(color, '#ffffff', 0.7), 0.9);
    ctx.fillRect(-W * 0.28, -H * 0.24, W * 0.6, H * 0.035);
    ctx.fillRect(-W * 0.18, -H * 0.17, W * 0.4, H * 0.022);
    disc(ctx, W * 0.02, H * 0.12, W * 0.12, css(mix(color, '#ffffff', 0.45), 0.6));
  }
}

export function bookOpen(ctx, W, r, illustration) {
  const H = W * 0.68;
  notebookOpen(
    ctx,
    W,
    H,
    (c, pw, ph) => {
      for (let i = 0; i < 11; i++) scribble(c, pw * 0.1, ph * (0.12 + i * 0.075), pw * (i === 10 ? 0.4 : 0.78), ph * 0.03, r, 'rgba(40,40,50,0.55)');
    },
    (c, pw, ph) => {
      if (illustration) illustration(c, pw, ph);
      else for (let i = 0; i < 11; i++) scribble(c, pw * 0.1, ph * (0.12 + i * 0.075), pw * 0.78, ph * 0.03, r, 'rgba(40,40,50,0.55)');
    },
    '#8a5a44',
  );
}

export function envelope(ctx, W, color = '#e9d3b5') {
  const H = W * 0.66;
  drop(ctx, W * 0.05, () => {
    ctx.fillStyle = color;
    ctx.fillRect(-W / 2, -H / 2, W, H);
  }, 0.28);
  ctx.fillStyle = lin(ctx, -W / 2, -H / 2, W / 2, H / 2, [[0, mix(color, '#ffffff', 0.15)], [1, mix(color, '#000000', 0.06)]]);
  ctx.fillRect(-W / 2, -H / 2, W, H);
  ctx.strokeStyle = css(mix(color, '#000000', 0.2), 0.5);
  ctx.lineWidth = Math.max(1, W * 0.004);
  ctx.beginPath();
  ctx.moveTo(-W / 2, -H / 2);
  ctx.lineTo(0, H * 0.08);
  ctx.lineTo(W / 2, -H / 2);
  ctx.moveTo(-W / 2, H / 2);
  ctx.lineTo(-W * 0.08, -H * 0.02);
  ctx.moveTo(W / 2, H / 2);
  ctx.lineTo(W * 0.08, -H * 0.02);
  ctx.stroke();
  ctx.save();
  ctx.translate(0, H * 0.08);
  heartPath(ctx, 0, 0, W * 0.09);
  ctx.fillStyle = '#e2523f';
  ctx.fill();
  ctx.restore();
}

export function card(ctx, W, H, color, content) {
  drop(ctx, W * 0.05, () => {
    ctx.fillStyle = color;
    ctx.fillRect(-W / 2, -H / 2, W, H);
  }, 0.25);
  ctx.fillStyle = lin(ctx, -W / 2, -H / 2, W / 2, H / 2, [[0, mix(color, '#ffffff', 0.25)], [1, color]]);
  ctx.fillRect(-W / 2, -H / 2, W, H);
  if (content) {
    ctx.save();
    ctx.translate(-W / 2, -H / 2);
    content(ctx, W, H);
    ctx.restore();
  }
}

export function sticky(ctx, s, color, content) {
  drop(ctx, s * 0.08, () => {
    ctx.fillStyle = color;
    ctx.fillRect(-s / 2, -s / 2, s, s);
  }, 0.24);
  ctx.fillStyle = vgrad(ctx, -s / 2, s / 2, [[0, mix(color, '#000000', 0.06)], [0.18, color], [1, mix(color, '#ffffff', 0.15)]]);
  ctx.fillRect(-s / 2, -s / 2, s, s);
  ctx.fillStyle = 'rgba(0,0,0,0.06)';
  ctx.fillRect(-s / 2, -s / 2, s, s * 0.12);
  if (content) {
    ctx.save();
    ctx.translate(-s / 2, -s / 2);
    content(ctx, s);
    ctx.restore();
  }
}

/* ---------------- kitchen + table ---------------- */
export function mugTop(ctx, R, color = '#f4f1ec', drink = 'latte', r) {
  drop(ctx, R * 0.25, () => disc(ctx, 0, 0, R, color), 0.32);
  ctx.save();
  ctx.rotate(-0.6);
  drop(ctx, R * 0.1, () => {
    ctx.fillStyle = color;
    rr(ctx, R * 0.85, -R * 0.16, R * 0.55, R * 0.32, R * 0.16);
    ctx.fill();
  }, 0.25);
  ctx.fillStyle = css(mix(color, '#000000', 0.06));
  rr(ctx, R * 0.85, -R * 0.16, R * 0.55, R * 0.32, R * 0.16);
  ctx.fill();
  ctx.restore();
  disc(ctx, 0, 0, R, lin(ctx, -R, -R, R, R, [[0, mix(color, '#ffffff', 0.4)], [1, mix(color, '#000000', 0.12)]]));
  disc(ctx, 0, 0, R * 0.86, css(mix(color, '#000000', 0.08)));
  const g = ctx.createRadialGradient(0, 0, R * 0.1, 0, 0, R * 0.82);
  if (drink === 'tea') {
    g.addColorStop(0, '#d89a4a');
    g.addColorStop(1, '#7a3b14');
  } else if (drink === 'cocoa') {
    g.addColorStop(0, '#8a5a3c');
    g.addColorStop(1, '#3b2216');
  } else {
    g.addColorStop(0, '#c99566');
    g.addColorStop(0.8, '#80502c');
    g.addColorStop(1, '#4a2b16');
  }
  disc(ctx, 0, 0, R * 0.8, g);
  if (drink === 'latte') {
    heartPath(ctx, 0, R * 0.06, R * 0.62);
    ctx.fillStyle = '#f5e7d3';
    ctx.fill();
    heartPath(ctx, 0, R * 0.14, R * 0.36);
    ctx.fillStyle = 'rgba(160,100,55,0.45)';
    ctx.fill();
  } else if (drink === 'cocoa') {
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * TAU + 0.3;
      ctx.save();
      ctx.translate(Math.cos(a) * R * 0.38, Math.sin(a) * R * 0.38);
      ctx.rotate(a);
      ctx.fillStyle = i % 2 ? '#ffd6e0' : '#ffffff';
      rr(ctx, -R * 0.11, -R * 0.11, R * 0.22, R * 0.22, R * 0.05);
      ctx.fill();
      ctx.restore();
    }
  } else glow(ctx, -R * 0.25, -R * 0.25, R * 0.45, '#fff4dc', 0.3);
}

export function plate(ctx, R, color = '#f7f5f0') {
  drop(ctx, R * 0.18, () => disc(ctx, 0, 0, R, color), 0.3);
  disc(ctx, 0, 0, R, lin(ctx, -R, -R, R, R, [[0, '#ffffff'], [1, mix(color, '#000000', 0.08)]]));
  disc(ctx, 0, 0, R * 0.74, css(mix(color, '#000000', 0.035)));
  const g = ctx.createRadialGradient(0, 0, R * 0.5, 0, 0, R * 0.76);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, 'rgba(0,0,0,0.07)');
  disc(ctx, 0, 0, R * 0.76, g);
}

export function bowlTop(ctx, R, color, fill) {
  drop(ctx, R * 0.2, () => disc(ctx, 0, 0, R, color), 0.32);
  disc(ctx, 0, 0, R, lin(ctx, -R, -R, R, R, [[0, mix(color, '#ffffff', 0.3)], [1, mix(color, '#000000', 0.15)]]));
  const inner = R * 0.86;
  const g = ctx.createRadialGradient(R * 0.1, R * 0.1, inner * 0.2, 0, 0, inner);
  g.addColorStop(0, css(mix(color, '#ffffff', 0.15)));
  g.addColorStop(1, css(mix(color, '#000000', 0.3)));
  disc(ctx, 0, 0, inner, g);
  if (fill) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, inner * 0.94, 0, TAU);
    ctx.clip();
    fill(ctx, inner * 0.94);
    ctx.restore();
  }
}

export function oats(ctx, R, r) {
  disc(ctx, 0, 0, R, '#d9bf8f');
  for (let i = 0; i < 260; i++) {
    const a = r() * TAU;
    const d = Math.sqrt(r()) * R;
    ellipse(ctx, Math.cos(a) * d, Math.sin(a) * d, R * 0.07, R * 0.045, r() * TAU, css(pick(r, ['#ead6ad', '#d6b886', '#c8a66f', '#f2e4c4']), 0.95));
  }
  const g = ctx.createRadialGradient(0, 0, R * 0.6, 0, 0, R);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, 'rgba(60,30,0,0.25)');
  disc(ctx, 0, 0, R, g);
}

export function spoonWood(ctx, L, r) {
  const t = L * 0.06;
  drop(ctx, t, () => {
    ctx.fillStyle = '#c99a62';
    rr(ctx, -L / 2, -t / 2, L * 0.72, t, t / 2);
    ctx.fill();
    ellipse(ctx, L * 0.32, 0, L * 0.18, L * 0.11, 0, '#c99a62');
  }, 0.28);
  ctx.fillStyle = vgrad(ctx, -t / 2, t / 2, [[0, '#e2b77f'], [1, '#a8763f']]);
  rr(ctx, -L / 2, -t / 2, L * 0.72, t, t / 2);
  ctx.fill();
  const g = ctx.createRadialGradient(L * 0.3, -L * 0.03, L * 0.02, L * 0.32, 0, L * 0.18);
  g.addColorStop(0, '#f0c993');
  g.addColorStop(1, '#a8763f');
  ellipse(ctx, L * 0.32, 0, L * 0.18, L * 0.11, 0, g);
  ellipse(ctx, L * 0.33, 0, L * 0.13, L * 0.075, 0, 'rgba(120,70,30,0.25)');
}

export function cutlery(ctx, L, kind = 'fork') {
  const t = L * 0.05;
  const metal = (c) => vgrad(c, -t, t, [[0, '#f5f6f8'], [0.5, '#a9aeb8'], [1, '#e1e3e8']]);
  drop(ctx, t, () => {
    ctx.fillStyle = '#c9ccd3';
    rr(ctx, -L / 2, -t / 2, L * 0.62, t, t / 2);
    ctx.fill();
  }, 0.25);
  ctx.fillStyle = metal(ctx);
  rr(ctx, -L / 2, -t / 2, L * 0.62, t, t / 2);
  ctx.fill();
  if (kind === 'fork') {
    ctx.beginPath();
    ctx.moveTo(L * 0.1, -t * 0.4);
    ctx.lineTo(L * 0.2, -t * 1.6);
    ctx.lineTo(L * 0.2, t * 1.6);
    ctx.lineTo(L * 0.1, t * 0.4);
    ctx.fill();
    for (let k = 0; k < 4; k++) {
      ctx.fillRect(L * 0.2, -t * 1.6 + k * t * 0.95, L * 0.3, t * 0.6);
    }
  } else {
    ctx.beginPath();
    ctx.moveTo(L * 0.1, -t * 0.7);
    ctx.lineTo(L * 0.5, -t * 0.9);
    ctx.quadraticCurveTo(L * 0.52, t * 0.4, L * 0.12, t * 0.7);
    ctx.closePath();
    ctx.fill();
  }
}

export function egg(ctx, s, color = '#f6efe4') {
  drop(ctx, s * 0.2, () => ellipse(ctx, 0, 0, s * 0.4, s * 0.5, 0, color), 0.28);
  const g = ctx.createRadialGradient(-s * 0.12, -s * 0.18, s * 0.05, 0, 0, s * 0.55);
  g.addColorStop(0, '#ffffff');
  g.addColorStop(1, css(mix(color, '#000000', 0.12)));
  ellipse(ctx, 0, 0, s * 0.4, s * 0.5, 0, g);
}

export function pot(ctx, R, color = '#c9ccd3') {
  ctx.save();
  for (const sd of [-1, 1]) {
    drop(ctx, R * 0.1, () => {
      ctx.fillStyle = '#2a2d33';
      rr(ctx, sd > 0 ? R * 0.95 : -R * 1.3, -R * 0.12, R * 0.35, R * 0.24, R * 0.1);
      ctx.fill();
    });
  }
  ctx.restore();
  drop(ctx, R * 0.22, () => disc(ctx, 0, 0, R, color), 0.34);
  disc(ctx, 0, 0, R, lin(ctx, -R, -R, R, R, [[0, '#ffffff'], [0.45, color], [1, mix(color, '#000000', 0.3)]]));
  disc(ctx, 0, 0, R * 0.9, lin(ctx, R, R, -R, -R, [[0, '#f2f3f5'], [1, mix(color, '#000000', 0.25)]]));
  const g = ctx.createRadialGradient(-R * 0.2, -R * 0.2, R * 0.1, 0, 0, R * 0.9);
  g.addColorStop(0, '#9aa0aa');
  g.addColorStop(1, '#4e535c');
  disc(ctx, 0, 0, R * 0.84, g);
  ellipse(ctx, -R * 0.3, -R * 0.35, R * 0.35, R * 0.1, -0.7, 'rgba(255,255,255,0.35)');
}

export function croissant(ctx, s) {
  const segs = 5;
  drop(ctx, s * 0.15, () => {
    ctx.beginPath();
    ctx.ellipse(0, s * 0.05, s * 0.75, s * 0.32, 0, 0, TAU);
    ctx.fillStyle = '#c98a3e';
    ctx.fill();
  }, 0.3);
  for (let i = 0; i < segs; i++) {
    const t = i / (segs - 1) - 0.5;
    const x = t * s * 1.25;
    const y = Math.abs(t) * s * 0.35 - s * 0.05;
    const rx = s * (0.22 - Math.abs(t) * 0.18);
    const ry = s * (0.34 - Math.abs(t) * 0.24);
    const g = ctx.createRadialGradient(x - rx * 0.3, y - ry * 0.4, 1, x, y, Math.max(rx, ry));
    g.addColorStop(0, '#f2c37a');
    g.addColorStop(0.6, '#d48d3c');
    g.addColorStop(1, '#9a5a1f');
    ellipse(ctx, x, y, rx, ry, t * 0.9, g);
  }
}

export function honeyJar(ctx, R) {
  drop(ctx, R * 0.2, () => disc(ctx, 0, 0, R, '#e0a530'), 0.32);
  disc(ctx, 0, 0, R, lin(ctx, -R, -R, R, R, [[0, '#ffd37a'], [1, '#b8781b']]));
  ctx.strokeStyle = 'rgba(120,70,10,0.35)';
  ctx.lineWidth = R * 0.03;
  for (let k = 0; k < 24; k++) {
    const a = (k / 24) * TAU;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * R * 0.8, Math.sin(a) * R * 0.8);
    ctx.lineTo(Math.cos(a) * R * 0.98, Math.sin(a) * R * 0.98);
    ctx.stroke();
  }
  disc(ctx, 0, 0, R * 0.55, css('#ffffff', 0.85));
  hand(ctx, 'honey', 0, 0, R * 0.35, '#8a5a1a', 'center', 700);
}

export function energyBall(ctx, s, r) {
  drop(ctx, s * 0.25, () => disc(ctx, 0, 0, s * 0.5, '#7a4b2a'), 0.32);
  const g = ctx.createRadialGradient(-s * 0.15, -s * 0.18, s * 0.05, 0, 0, s * 0.5);
  g.addColorStop(0, '#a87249');
  g.addColorStop(1, '#4e2c17');
  disc(ctx, 0, 0, s * 0.5, g);
  for (let i = 0; i < 22; i++) {
    const a = r() * TAU;
    const d = Math.sqrt(r()) * s * 0.45;
    ellipse(ctx, Math.cos(a) * d, Math.sin(a) * d, s * 0.05, s * 0.025, r() * TAU, r() < 0.5 ? 'rgba(255,250,240,0.85)' : 'rgba(210,170,110,0.9)');
  }
}

/* ---------------- fashion ---------------- */
export function tshirt(ctx, s, color, stripe) {
  const path = () => {
    ctx.beginPath();
    ctx.moveTo(-s * 0.18, -s * 0.5);
    ctx.quadraticCurveTo(0, -s * 0.38, s * 0.18, -s * 0.5);
    ctx.lineTo(s * 0.42, -s * 0.42);
    ctx.lineTo(s * 0.58, -s * 0.16);
    ctx.lineTo(s * 0.4, -s * 0.06);
    ctx.lineTo(s * 0.34, -s * 0.16);
    ctx.lineTo(s * 0.34, s * 0.5);
    ctx.lineTo(-s * 0.34, s * 0.5);
    ctx.lineTo(-s * 0.34, -s * 0.16);
    ctx.lineTo(-s * 0.4, -s * 0.06);
    ctx.lineTo(-s * 0.58, -s * 0.16);
    ctx.lineTo(-s * 0.42, -s * 0.42);
    ctx.closePath();
  };
  drop(ctx, s * 0.06, () => {
    path();
    ctx.fillStyle = color;
    ctx.fill();
  }, 0.28);
  path();
  ctx.fillStyle = lin(ctx, -s * 0.5, -s * 0.5, s * 0.5, s * 0.5, [[0, mix(color, '#ffffff', 0.12)], [1, mix(color, '#000000', 0.1)]]);
  ctx.fill();
  ctx.save();
  path();
  ctx.clip();
  if (stripe) {
    ctx.fillStyle = stripe;
    for (let y = -s * 0.5; y < s * 0.5; y += s * 0.09) ctx.fillRect(-s, y, s * 2, s * 0.035);
  }
  ctx.strokeStyle = 'rgba(0,0,0,0.07)';
  ctx.lineWidth = s * 0.03;
  for (let k = 0; k < 3; k++) {
    ctx.beginPath();
    ctx.moveTo(-s * 0.3 + k * s * 0.18, s * 0.5);
    ctx.quadraticCurveTo(-s * 0.2 + k * s * 0.2, s * 0.1, -s * 0.25 + k * s * 0.2, -s * 0.2);
    ctx.stroke();
  }
  ctx.restore();
  ctx.strokeStyle = css(mix(color, '#000000', 0.18));
  ctx.lineWidth = s * 0.025;
  ctx.beginPath();
  ctx.moveTo(-s * 0.18, -s * 0.5);
  ctx.quadraticCurveTo(0, -s * 0.36, s * 0.18, -s * 0.5);
  ctx.stroke();
}

export function jeans(ctx, s, color = '#3b5b8c') {
  const path = () => {
    ctx.beginPath();
    ctx.moveTo(-s * 0.3, -s * 0.6);
    ctx.lineTo(s * 0.3, -s * 0.6);
    ctx.lineTo(s * 0.34, s * 0.6);
    ctx.lineTo(s * 0.08, s * 0.6);
    ctx.lineTo(0, -s * 0.18);
    ctx.lineTo(-s * 0.08, s * 0.6);
    ctx.lineTo(-s * 0.34, s * 0.6);
    ctx.closePath();
  };
  drop(ctx, s * 0.06, () => {
    path();
    ctx.fillStyle = color;
    ctx.fill();
  }, 0.3);
  path();
  ctx.fillStyle = lin(ctx, -s * 0.3, -s * 0.6, s * 0.3, s * 0.6, [[0, mix(color, '#ffffff', 0.15)], [1, mix(color, '#000000', 0.15)]]);
  ctx.fill();
  ctx.save();
  path();
  ctx.clip();
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  for (let k = -s; k < s; k += 3) {
    ctx.beginPath();
    ctx.moveTo(k, -s);
    ctx.lineTo(k + s * 0.6, s);
    ctx.stroke();
  }
  ctx.fillStyle = css(mix(color, '#000000', 0.15));
  ctx.fillRect(-s * 0.3, -s * 0.6, s * 0.6, s * 0.08);
  ctx.strokeStyle = '#d9a35a';
  ctx.setLineDash([s * 0.015, s * 0.012]);
  ctx.lineWidth = Math.max(1, s * 0.008);
  ctx.beginPath();
  ctx.moveTo(-s * 0.28, -s * 0.5);
  ctx.quadraticCurveTo(-s * 0.18, -s * 0.38, -s * 0.12, -s * 0.52);
  ctx.moveTo(s * 0.28, -s * 0.5);
  ctx.quadraticCurveTo(s * 0.18, -s * 0.38, s * 0.12, -s * 0.52);
  ctx.moveTo(0, -s * 0.52);
  ctx.lineTo(0, -s * 0.18);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
  disc(ctx, 0, -s * 0.56, s * 0.018, '#d9a35a');
}

function shoePath(ctx, L) {
  const hw = L * 0.2;
  ctx.beginPath();
  ctx.moveTo(0, -L / 2);
  ctx.bezierCurveTo(hw * 1.1, -L / 2, hw * 1.25, -L * 0.18, hw * 1.05, L * 0.05);
  ctx.bezierCurveTo(hw * 0.9, L * 0.28, hw * 0.95, L / 2, 0, L / 2);
  ctx.bezierCurveTo(-hw * 0.95, L / 2, -hw * 0.85, L * 0.28, -hw * 0.95, L * 0.05);
  ctx.bezierCurveTo(-hw * 1.15, -L * 0.2, -hw * 1.05, -L / 2, 0, -L / 2);
  ctx.closePath();
}

export function sneaker(ctx, L, color = '#f4f4f2', accent = '#2b59ff') {
  drop(ctx, L * 0.06, () => {
    shoePath(ctx, L * 1.04);
    ctx.fillStyle = '#e8e6e1';
    ctx.fill();
  }, 0.32);
  shoePath(ctx, L * 1.04);
  ctx.fillStyle = vgrad(ctx, -L / 2, L / 2, [[0, '#ffffff'], [1, '#d9d6cf']]);
  ctx.fill();
  shoePath(ctx, L * 0.94);
  ctx.fillStyle = lin(ctx, -L * 0.2, -L / 2, L * 0.2, L / 2, [[0, mix(color, '#ffffff', 0.15)], [1, mix(color, '#000000', 0.1)]]);
  ctx.fill();
  ctx.save();
  shoePath(ctx, L * 0.94);
  ctx.clip();
  ctx.fillStyle = css(accent, 0.9);
  ctx.beginPath();
  ctx.ellipse(L * 0.18, L * 0.1, L * 0.08, L * 0.32, 0.25, 0, TAU);
  ctx.fill();
  ctx.fillStyle = css(mix(color, '#000000', 0.08));
  ctx.beginPath();
  ctx.ellipse(0, -L * 0.4, L * 0.2, L * 0.14, 0, 0, TAU);
  ctx.fill();
  ctx.restore();
  ellipse(ctx, 0, L * 0.26, L * 0.1, L * 0.15, 0, '#3a3f4a');
  ellipse(ctx, 0, L * 0.22, L * 0.075, L * 0.09, 0, '#5a606c');
  ctx.fillStyle = css(mix(color, '#000000', 0.05));
  rr(ctx, -L * 0.075, -L * 0.2, L * 0.15, L * 0.34, L * 0.04);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = L * 0.018;
  ctx.lineCap = 'round';
  for (let k = 0; k < 5; k++) {
    const y = -L * 0.16 + k * L * 0.065;
    ctx.beginPath();
    ctx.moveTo(-L * 0.1, y);
    ctx.lineTo(L * 0.1, y + L * 0.03);
    ctx.stroke();
    disc(ctx, -L * 0.1, y, L * 0.012, '#9aa0aa');
    disc(ctx, L * 0.1, y + L * 0.03, L * 0.012, '#9aa0aa');
  }
}

export function sneakers(ctx, L, color, accent) {
  place(ctx, -L * 0.24, 0, -0.08, () => sneaker(ctx, L, color, accent));
  place(ctx, L * 0.24, L * 0.06, 0.1, () => {
    ctx.scale(-1, 1);
    sneaker(ctx, L, color, accent);
  });
}

export function cap(ctx, s, color) {
  drop(ctx, s * 0.08, () => ellipse(ctx, 0, 0, s * 0.45, s * 0.42, 0, color), 0.3);
  ctx.fillStyle = css(mix(color, '#000000', 0.12));
  ctx.beginPath();
  ctx.ellipse(0, s * 0.38, s * 0.42, s * 0.26, 0, 0, Math.PI);
  ctx.fill();
  const g = ctx.createRadialGradient(-s * 0.1, -s * 0.12, s * 0.05, 0, 0, s * 0.46);
  g.addColorStop(0, css(mix(color, '#ffffff', 0.2)));
  g.addColorStop(1, css(mix(color, '#000000', 0.18)));
  ellipse(ctx, 0, 0, s * 0.45, s * 0.42, 0, g);
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  ctx.lineWidth = s * 0.01;
  for (let k = 0; k < 3; k++) {
    const a = -Math.PI / 2 + (k - 1) * 0.9;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * s * 0.44, Math.sin(a) * s * 0.42);
    ctx.stroke();
  }
  disc(ctx, 0, 0, s * 0.04, css(mix(color, '#000000', 0.2)));
}

export function sunglasses(ctx, s, frame = '#1b1b1f') {
  for (const sd of [-1, 1]) {
    drop(ctx, s * 0.06, () => ellipse(ctx, sd * s * 0.26, 0, s * 0.22, s * 0.17, 0, frame), 0.3);
    const g = ctx.createLinearGradient(sd * s * 0.26 - s * 0.2, -s * 0.16, sd * s * 0.26 + s * 0.2, s * 0.16);
    g.addColorStop(0, '#5d4a3a');
    g.addColorStop(1, '#1a1410');
    ellipse(ctx, sd * s * 0.26, 0, s * 0.18, s * 0.135, 0, g);
    ellipse(ctx, sd * s * 0.26 - s * 0.06, -s * 0.06, s * 0.06, s * 0.025, -0.5, 'rgba(255,255,255,0.35)');
  }
  ctx.strokeStyle = frame;
  ctx.lineWidth = s * 0.04;
  ctx.beginPath();
  ctx.moveTo(-s * 0.06, -s * 0.04);
  ctx.quadraticCurveTo(0, -s * 0.09, s * 0.06, -s * 0.04);
  ctx.moveTo(-s * 0.46, -s * 0.06);
  ctx.lineTo(-s * 0.28, s * 0.2);
  ctx.moveTo(s * 0.46, -s * 0.06);
  ctx.lineTo(s * 0.28, s * 0.2);
  ctx.stroke();
}

export function tote(ctx, s, color = '#e9dcc4') {
  ctx.strokeStyle = css(mix(color, '#000000', 0.25));
  ctx.lineWidth = s * 0.05;
  ctx.beginPath();
  ctx.ellipse(-s * 0.15, -s * 0.45, s * 0.12, s * 0.28, 0, Math.PI, TAU);
  ctx.ellipse(s * 0.15, -s * 0.45, s * 0.12, s * 0.28, 0, Math.PI, TAU);
  ctx.stroke();
  drop(ctx, s * 0.06, () => {
    ctx.fillStyle = color;
    ctx.fillRect(-s * 0.4, -s * 0.45, s * 0.8, s * 0.9);
  });
  ctx.fillStyle = lin(ctx, -s * 0.4, -s * 0.45, s * 0.4, s * 0.45, [[0, mix(color, '#ffffff', 0.15)], [1, mix(color, '#000000', 0.08)]]);
  ctx.fillRect(-s * 0.4, -s * 0.45, s * 0.8, s * 0.9);
  disc(ctx, 0, 0, s * 0.16, '#3ee3a6');
  disc(ctx, 0, 0, s * 0.08, '#2b59ff');
}

export function watch(ctx, s) {
  ctx.fillStyle = '#6b4a33';
  rr(ctx, -s * 0.11, -s * 0.5, s * 0.22, s, s * 0.08);
  drop(ctx, s * 0.05, () => ctx.fill(), 0.25);
  drop(ctx, s * 0.06, () => disc(ctx, 0, 0, s * 0.2, '#c9ccd3'), 0.3);
  disc(ctx, 0, 0, s * 0.2, lin(ctx, -s * 0.2, -s * 0.2, s * 0.2, s * 0.2, [[0, '#ffffff'], [1, '#9aa0aa']]));
  disc(ctx, 0, 0, s * 0.165, '#f6f3ec');
  ctx.strokeStyle = '#2b2f3a';
  ctx.lineWidth = s * 0.014;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -s * 0.11);
  ctx.moveTo(0, 0);
  ctx.lineTo(s * 0.08, s * 0.03);
  ctx.stroke();
}

export function bracelet(ctx, R, colors, r, letters) {
  const n = letters ? Math.max(18, letters.length + 12) : 26;
  const b = (TAU * R) / n / 2;
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.lineWidth = b * 0.2;
  ctx.beginPath();
  ctx.arc(0, 0, R, 0, TAU);
  ctx.stroke();
  const start = letters ? n - Math.floor(letters.length / 2) : 0;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU - Math.PI / 2;
    const x = Math.cos(a) * R;
    const y = Math.sin(a) * R;
    const li = letters ? (i - start + n) % n : -1;
    if (letters && li < letters.length) {
      drop(ctx, b * 0.4, () => {
        ctx.fillStyle = '#fbfaf6';
        rr(ctx, x - b * 0.95, y - b * 0.95, b * 1.9, b * 1.9, b * 0.35);
        ctx.fill();
      }, 0.25);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(a + Math.PI / 2);
      ctx.fillStyle = '#1b1f2a';
      ctx.font = `800 ${Math.round(b * 1.25)}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(letters[li], 0, b * 0.06);
      ctx.restore();
    } else {
      const c = colors[i % colors.length];
      drop(ctx, b * 0.4, () => disc(ctx, x, y, b * 0.92, c), 0.25);
      const g = ctx.createRadialGradient(x - b * 0.3, y - b * 0.35, b * 0.05, x, y, b);
      g.addColorStop(0, css(mix(c, '#ffffff', 0.55)));
      g.addColorStop(1, css(mix(c, '#000000', 0.18)));
      disc(ctx, x, y, b * 0.92, g);
    }
  }
}

export function swatch(ctx, s, color, r) {
  const zig = (len, dir) => {
    const n = 12;
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const o = i % 2 ? s * 0.025 : 0;
      if (dir === 'top') ctx.lineTo(-s / 2 + t * s, -s / 2 + o);
      if (dir === 'right') ctx.lineTo(s / 2 - o, -s / 2 + t * s);
      if (dir === 'bottom') ctx.lineTo(s / 2 - t * s, s / 2 - o);
      if (dir === 'left') ctx.lineTo(-s / 2 + o, s / 2 - t * s);
    }
  };
  const path = () => {
    ctx.beginPath();
    ctx.moveTo(-s / 2, -s / 2);
    zig(s, 'top');
    zig(s, 'right');
    zig(s, 'bottom');
    zig(s, 'left');
    ctx.closePath();
  };
  drop(ctx, s * 0.06, () => {
    path();
    ctx.fillStyle = color;
    ctx.fill();
  }, 0.26);
  path();
  ctx.fillStyle = lin(ctx, -s / 2, -s / 2, s / 2, s / 2, [[0, mix(color, '#ffffff', 0.18)], [1, mix(color, '#000000', 0.12)]]);
  ctx.fill();
  ctx.save();
  path();
  ctx.clip();
  ctx.strokeStyle = 'rgba(0,0,0,0.06)';
  ctx.lineWidth = 1;
  for (let k = -s; k < s; k += 2.5) {
    ctx.beginPath();
    ctx.moveTo(k, -s);
    ctx.lineTo(k, s);
    ctx.stroke();
  }
  ctx.restore();
}

/* ---------------- movement + outdoors ---------------- */
export function waterBottle(ctx, L, color = '#3ee3a6') {
  const t = L * 0.3;
  drop(ctx, t * 0.3, () => {
    ctx.fillStyle = color;
    rr(ctx, -L / 2, -t / 2, L, t, t / 2);
    ctx.fill();
  }, 0.32);
  ctx.fillStyle = vgrad(ctx, -t / 2, t / 2, [[0, mix(color, '#ffffff', 0.45)], [0.3, color], [1, mix(color, '#000000', 0.3)]]);
  rr(ctx, -L / 2 + L * 0.16, -t / 2, L * 0.84, t, t / 2);
  ctx.fill();
  ctx.fillStyle = vgrad(ctx, -t / 2, t / 2, [[0, '#4a4f5a'], [0.4, '#2a2d33'], [1, '#121418']]);
  rr(ctx, -L / 2, -t * 0.38, L * 0.2, t * 0.76, t * 0.2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  rr(ctx, -L * 0.2, -t * 0.32, L * 0.6, t * 0.08, t * 0.04);
  ctx.fill();
}

export function mat(ctx, L, W, color = '#b7a6ff') {
  drop(ctx, W * 0.06, () => {
    ctx.fillStyle = color;
    rr(ctx, -L / 2, -W / 2, L, W, W * 0.06);
    ctx.fill();
  }, 0.22);
  ctx.fillStyle = lin(ctx, -L / 2, -W / 2, L / 2, W / 2, [[0, mix(color, '#ffffff', 0.15)], [1, mix(color, '#000000', 0.1)]]);
  rr(ctx, -L / 2, -W / 2, L, W, W * 0.06);
  ctx.fill();
  ctx.strokeStyle = css(mix(color, '#000000', 0.08));
  ctx.lineWidth = 1;
  for (let y = -W / 2 + 4; y < W / 2; y += 5) {
    ctx.beginPath();
    ctx.moveTo(-L / 2 + 4, y);
    ctx.lineTo(L / 2 - 4, y);
    ctx.stroke();
  }
}

export function matRoll(ctx, L, D, color = '#5fb7a0') {
  drop(ctx, D * 0.2, () => {
    ctx.fillStyle = color;
    rr(ctx, -L / 2, -D / 2, L, D, D * 0.1);
    ctx.fill();
  }, 0.32);
  ctx.fillStyle = vgrad(ctx, -D / 2, D / 2, [[0, mix(color, '#ffffff', 0.35)], [0.4, color], [1, mix(color, '#000000', 0.35)]]);
  rr(ctx, -L / 2, -D / 2, L, D, D * 0.1);
  ctx.fill();
  ctx.fillStyle = 'rgba(30,30,35,0.85)';
  ctx.fillRect(-L * 0.25, -D / 2, L * 0.05, D);
  ctx.fillRect(L * 0.2, -D / 2, L * 0.05, D);
}

export function towel(ctx, W, H, color = '#f2efe8', stripe = '#2b59ff') {
  drop(ctx, W * 0.05, () => {
    ctx.fillStyle = color;
    rr(ctx, -W / 2, -H / 2, W, H, W * 0.03);
    ctx.fill();
  }, 0.24);
  ctx.fillStyle = lin(ctx, -W / 2, -H / 2, W / 2, H / 2, [[0, mix(color, '#ffffff', 0.2)], [1, mix(color, '#000000', 0.08)]]);
  rr(ctx, -W / 2, -H / 2, W, H, W * 0.03);
  ctx.fill();
  ctx.fillStyle = css(stripe, 0.85);
  ctx.fillRect(-W / 2, H * 0.22, W, H * 0.07);
  ctx.fillRect(-W / 2, H * 0.33, W, H * 0.03);
  ctx.fillStyle = 'rgba(0,0,0,0.06)';
  ctx.fillRect(-W / 2, -H * 0.05, W, H * 0.03);
}

export function dumbbell(ctx, L, color = '#2f3542') {
  ctx.fillStyle = vgrad(ctx, -L * 0.04, L * 0.04, [[0, '#e8eaee'], [0.5, '#9aa0aa'], [1, '#d3d6dc']]);
  drop(ctx, L * 0.05, () => ctx.fillRect(-L * 0.35, -L * 0.04, L * 0.7, L * 0.08));
  for (const sd of [-1, 1]) {
    drop(ctx, L * 0.08, () => {
      ctx.fillStyle = color;
      rr(ctx, sd * L * 0.32 - L * 0.1, -L * 0.18, L * 0.2, L * 0.36, L * 0.05);
      ctx.fill();
    }, 0.34);
    ctx.fillStyle = lin(ctx, sd * L * 0.32 - L * 0.1, -L * 0.18, sd * L * 0.32 + L * 0.1, L * 0.18, [[0, mix(color, '#ffffff', 0.25)], [1, mix(color, '#000000', 0.25)]]);
    rr(ctx, sd * L * 0.32 - L * 0.1, -L * 0.18, L * 0.2, L * 0.36, L * 0.05);
    ctx.fill();
  }
}

export function jumpRope(ctx, s, color = '#ff6f91') {
  ctx.strokeStyle = 'rgba(30,20,10,0.18)';
  ctx.lineWidth = s * 0.035;
  ctx.lineCap = 'round';
  const loop = (off) => {
    ctx.beginPath();
    ctx.moveTo(-s * 0.5, -s * 0.3);
    ctx.bezierCurveTo(-s * 0.1, -s * 0.7, s * 0.6, -s * 0.4, s * 0.35, 0);
    ctx.bezierCurveTo(s * 0.1, s * 0.4, -s * 0.6, s * 0.35, -s * 0.3, -s * 0.05);
    ctx.bezierCurveTo(-s * 0.05, -s * 0.35, s * 0.4, -s * 0.1, s * 0.2, s * 0.25);
    ctx.bezierCurveTo(s * 0.05, s * 0.5, s * 0.5, s * 0.55, s * 0.55, s * 0.35);
  };
  ctx.save();
  ctx.translate(s * 0.01, s * 0.02);
  loop();
  ctx.stroke();
  ctx.restore();
  ctx.strokeStyle = color;
  ctx.lineWidth = s * 0.028;
  loop();
  ctx.stroke();
  for (const [x, y, a] of [[-s * 0.58, -s * 0.3, 0.3], [s * 0.62, s * 0.3, 0.6]]) {
    place(ctx, x, y, a, () => {
      drop(ctx, s * 0.03, () => {
        ctx.fillStyle = '#1f2430';
        rr(ctx, -s * 0.12, -s * 0.035, s * 0.24, s * 0.07, s * 0.035);
        ctx.fill();
      }, 0.3);
      ctx.fillStyle = vgrad(ctx, -s * 0.035, s * 0.035, [[0, '#4a5060'], [1, '#14171e']]);
      rr(ctx, -s * 0.12, -s * 0.035, s * 0.24, s * 0.07, s * 0.035);
      ctx.fill();
    });
  }
}

export function headphones(ctx, s, color = '#f1efe9', cushion = '#3a3f4a') {
  ctx.lineCap = 'round';
  drop(ctx, s * 0.06, () => {
    ctx.strokeStyle = color;
    ctx.lineWidth = s * 0.09;
    ctx.beginPath();
    ctx.arc(0, s * 0.1, s * 0.42, Math.PI * 1.05, Math.PI * 1.95);
    ctx.stroke();
  }, 0.3);
  ctx.strokeStyle = lin(ctx, -s * 0.4, -s * 0.4, s * 0.4, 0, [[0, mix(color, '#ffffff', 0.4)], [1, mix(color, '#000000', 0.18)]]);
  ctx.lineWidth = s * 0.09;
  ctx.beginPath();
  ctx.arc(0, s * 0.1, s * 0.42, Math.PI * 1.05, Math.PI * 1.95);
  ctx.stroke();
  ctx.strokeStyle = cushion;
  ctx.lineWidth = s * 0.035;
  ctx.beginPath();
  ctx.arc(0, s * 0.1, s * 0.38, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
  for (const sd of [-1, 1]) {
    const x = sd * s * 0.44;
    const y = s * 0.2;
    drop(ctx, s * 0.08, () => ellipse(ctx, x, y, s * 0.17, s * 0.22, sd * 0.12, color), 0.34);
    ellipse(ctx, x, y, s * 0.17, s * 0.22, sd * 0.12, lin(ctx, x - s * 0.17, y - s * 0.22, x + s * 0.17, y + s * 0.22, [[0, mix(color, '#ffffff', 0.3)], [1, mix(color, '#000000', 0.2)]]));
    ellipse(ctx, x - sd * s * 0.03, y, s * 0.11, s * 0.16, sd * 0.12, cushion);
    ellipse(ctx, x - sd * s * 0.035, y, s * 0.06, s * 0.1, sd * 0.12, css(mix(cushion, '#000000', 0.3)));
  }
}

export function pebble(ctx, s, color = '#9b958c', r) {
  const rot = r ? rand(r, 0, TAU) : 0;
  drop(ctx, s * 0.2, () => ellipse(ctx, 0, 0, s * 0.5, s * 0.36, rot, color), 0.32);
  const g = ctx.createRadialGradient(-s * 0.15, -s * 0.15, s * 0.05, 0, 0, s * 0.55);
  g.addColorStop(0, css(mix(color, '#ffffff', 0.35)));
  g.addColorStop(1, css(mix(color, '#000000', 0.25)));
  ellipse(ctx, 0, 0, s * 0.5, s * 0.36, rot, g);
}

export function pinecone(ctx, s) {
  drop(ctx, s * 0.1, () => ellipse(ctx, 0, 0, s * 0.3, s * 0.5, 0, '#6b4226'), 0.3);
  for (let row = 0; row < 9; row++) {
    const y = -s * 0.42 + row * s * 0.1;
    const wRow = Math.sin(((row + 0.5) / 9) * Math.PI) * s * 0.28;
    const n = 3 + Math.round(wRow / (s * 0.08));
    for (let i = 0; i < n; i++) {
      const x = -wRow + ((i + (row % 2) * 0.5) / n) * wRow * 2;
      const g = ctx.createLinearGradient(x, y - s * 0.05, x, y + s * 0.06);
      g.addColorStop(0, '#a87249');
      g.addColorStop(1, '#4b2a14');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(x - s * 0.06, y - s * 0.02);
      ctx.quadraticCurveTo(x, y + s * 0.09, x + s * 0.06, y - s * 0.02);
      ctx.quadraticCurveTo(x, y - s * 0.05, x - s * 0.06, y - s * 0.02);
      ctx.fill();
    }
  }
}

export function shell(ctx, s) {
  drop(ctx, s * 0.12, () => disc(ctx, 0, 0, s * 0.42, '#e8c9a0'), 0.3);
  for (let k = 0; k < 120; k++) {
    const t = k / 120;
    const a = t * Math.PI * 7;
    const rad = s * 0.42 * Math.pow(t, 0.9);
    const x = Math.cos(a) * rad * 0.18;
    const y = Math.sin(a) * rad * 0.18;
    disc(ctx, x * (1 - t) + Math.cos(a) * rad * 0.82, y * (1 - t) + Math.sin(a) * rad * 0.82, s * 0.02 + rad * 0.18, css(mix('#f6e2c4', '#a8683a', (Math.sin(a * 2) + 1) * 0.35), 0.9));
  }
  ctx.strokeStyle = 'rgba(110,60,25,0.55)';
  ctx.lineWidth = s * 0.012;
  ctx.beginPath();
  for (let k = 0; k <= 200; k++) {
    const t = k / 200;
    const a = t * Math.PI * 7;
    const rad = s * 0.42 * Math.pow(t, 0.9);
    if (k === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
    else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
  }
  ctx.stroke();
}

export function ginkgo(ctx, s, color = '#e8b923') {
  ctx.strokeStyle = css(mix(color, '#000000', 0.3));
  ctx.lineWidth = s * 0.02;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, s * 0.45);
  ctx.stroke();
  drop(ctx, s * 0.08, () => {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, s * 0.45, -Math.PI * 0.86, -Math.PI * 0.14);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }, 0.28);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, s * 0.45, -Math.PI * 0.86, -Math.PI * 0.14);
  ctx.closePath();
  ctx.fillStyle = lin(ctx, 0, 0, 0, -s * 0.45, [[0, mix(color, '#000000', 0.15)], [1, mix(color, '#ffffff', 0.2)]]);
  ctx.fill();
  ctx.strokeStyle = css(mix(color, '#000000', 0.15), 0.5);
  ctx.lineWidth = s * 0.006;
  for (let k = 0; k < 18; k++) {
    const a = -Math.PI * 0.84 + (k / 17) * Math.PI * 0.68;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * s * 0.44, Math.sin(a) * s * 0.44);
    ctx.stroke();
  }
}

export function magnifier(ctx, s, inner) {
  ctx.save();
  ctx.rotate(0.8);
  drop(ctx, s * 0.06, () => {
    ctx.fillStyle = '#2a2018';
    rr(ctx, s * 0.36, -s * 0.06, s * 0.5, s * 0.12, s * 0.06);
    ctx.fill();
  }, 0.32);
  ctx.fillStyle = vgrad(ctx, -s * 0.06, s * 0.06, [[0, '#6b4a33'], [1, '#2a1a10']]);
  rr(ctx, s * 0.36, -s * 0.06, s * 0.5, s * 0.12, s * 0.06);
  ctx.fill();
  ctx.restore();
  if (inner) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.34, 0, TAU);
    ctx.clip();
    inner(ctx, s * 0.34);
    ctx.restore();
  }
  ctx.fillStyle = 'rgba(200,230,255,0.12)';
  disc(ctx, 0, 0, s * 0.34, 'rgba(200,230,255,0.12)');
  drop(ctx, s * 0.06, () => {
    ctx.strokeStyle = '#c9ccd3';
    ctx.lineWidth = s * 0.06;
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.37, 0, TAU);
    ctx.stroke();
  }, 0.35);
  ctx.strokeStyle = lin(ctx, -s * 0.4, -s * 0.4, s * 0.4, s * 0.4, [[0, '#ffffff'], [0.5, '#9aa0aa'], [1, '#e1e3e8']]);
  ctx.lineWidth = s * 0.06;
  ctx.beginPath();
  ctx.arc(0, 0, s * 0.37, 0, TAU);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = s * 0.03;
  ctx.beginPath();
  ctx.arc(0, 0, s * 0.27, Math.PI * 1.1, Math.PI * 1.45);
  ctx.stroke();
}

/* ---------------- craft + games ---------------- */
export function scissors(ctx, s, color = '#ff6f91') {
  for (const sd of [-1, 1]) {
    ctx.save();
    ctx.rotate(sd * 0.16);
    drop(ctx, s * 0.04, () => {
      ctx.fillStyle = '#c9ccd3';
      ctx.beginPath();
      ctx.moveTo(-s * 0.05, 0);
      ctx.lineTo(-s * 0.55, sd * s * 0.015);
      ctx.lineTo(-s * 0.05, sd * s * 0.07);
      ctx.closePath();
      ctx.fill();
    }, 0.3);
    ctx.fillStyle = lin(ctx, 0, -s * 0.05, 0, s * 0.05, [[0, '#f5f6f8'], [0.5, '#9aa0aa'], [1, '#e1e3e8']]);
    ctx.beginPath();
    ctx.moveTo(-s * 0.05, 0);
    ctx.lineTo(-s * 0.55, sd * s * 0.015);
    ctx.lineTo(-s * 0.05, sd * s * 0.07);
    ctx.closePath();
    ctx.fill();
    drop(ctx, s * 0.05, () => {
      ctx.strokeStyle = color;
      ctx.lineWidth = s * 0.06;
      ctx.beginPath();
      ctx.ellipse(s * 0.22, sd * s * 0.1, s * 0.15, s * 0.1, sd * 0.2, 0, TAU);
      ctx.stroke();
    }, 0.3);
    ctx.restore();
  }
  disc(ctx, 0, 0, s * 0.03, '#6b7080');
}

export function tapeRoll(ctx, R, color = '#ffd166', pattern = '#ff6f91') {
  drop(ctx, R * 0.2, () => disc(ctx, 0, 0, R, color), 0.3);
  disc(ctx, 0, 0, R, lin(ctx, -R, -R, R, R, [[0, mix(color, '#ffffff', 0.3)], [1, mix(color, '#000000', 0.1)]]));
  for (let k = 0; k < 10; k++) {
    const a = (k / 10) * TAU;
    disc(ctx, Math.cos(a) * R * 0.78, Math.sin(a) * R * 0.78, R * 0.07, pattern);
  }
  disc(ctx, 0, 0, R * 0.62, '#d6c3a0');
  disc(ctx, 0, 0, R * 0.55, 'rgba(0,0,0,0.0)');
}

export function paperPlane(ctx, s, color = '#ffffff') {
  const wing = (sd) => {
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.5);
    ctx.lineTo(sd * s * 0.32, s * 0.42);
    ctx.lineTo(sd * s * 0.04, s * 0.32);
    ctx.lineTo(0, s * 0.45);
    ctx.closePath();
  };
  drop(ctx, s * 0.08, () => {
    wing(-1);
    ctx.fillStyle = color;
    ctx.fill();
    wing(1);
    ctx.fill();
  }, 0.3);
  wing(-1);
  ctx.fillStyle = css(mix(color, '#ffffff', 0.2));
  ctx.fill();
  wing(1);
  ctx.fillStyle = css(mix(color, '#000000', 0.1));
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.18)';
  ctx.lineWidth = Math.max(1, s * 0.008);
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.5);
  ctx.lineTo(0, s * 0.45);
  ctx.stroke();
}

export function measureTape(ctx, L) {
  const t = L * 0.08;
  drop(ctx, t * 0.3, () => {
    ctx.fillStyle = '#f2c14e';
    ctx.fillRect(-L / 2, -t / 2, L, t);
  }, 0.22);
  ctx.fillStyle = vgrad(ctx, -t / 2, t / 2, [[0, '#ffd970'], [1, '#e0a92e']]);
  ctx.fillRect(-L / 2, -t / 2, L, t);
  ctx.strokeStyle = '#3a2a10';
  ctx.fillStyle = '#3a2a10';
  ctx.lineWidth = 1;
  ctx.font = `700 ${Math.round(t * 0.4)}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  for (let i = 0; i <= 40; i++) {
    const x = -L / 2 + (i / 40) * L;
    ctx.beginPath();
    ctx.moveTo(x, -t / 2);
    ctx.lineTo(x, -t / 2 + (i % 5 ? t * 0.25 : t * 0.45));
    ctx.stroke();
    if (i % 5 === 0 && i) ctx.fillText(String(i), x, t * 0.3);
  }
  place(ctx, -L / 2 - t * 1.1, 0, 0, () => {
    drop(ctx, t * 0.4, () => {
      ctx.fillStyle = '#1f2430';
      rr(ctx, -t * 1.3, -t * 1.3, t * 2.6, t * 2.6, t * 0.6);
      ctx.fill();
    }, 0.34);
    ctx.fillStyle = lin(ctx, -t, -t, t, t, [[0, '#ffd166'], [1, '#d6961f']]);
    rr(ctx, -t * 1.1, -t * 1.1, t * 2.2, t * 2.2, t * 0.5);
    ctx.fill();
    disc(ctx, 0, 0, t * 0.5, '#1f2430');
  });
}

export function dice(ctx, s, n, color = '#fbfaf6', pipColor = '#1f2430') {
  drop(ctx, s * 0.15, () => {
    ctx.fillStyle = color;
    rr(ctx, -s / 2, -s / 2, s, s, s * 0.2);
    ctx.fill();
  }, 0.34);
  ctx.fillStyle = lin(ctx, -s / 2, -s / 2, s / 2, s / 2, [[0, mix(color, '#ffffff', 0.4)], [1, mix(color, '#000000', 0.12)]]);
  rr(ctx, -s / 2, -s / 2, s, s, s * 0.2);
  ctx.fill();
  const P = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] };
  (P[n] || P[1]).forEach(([x, y]) => disc(ctx, x * s * 0.25, y * s * 0.25, s * 0.08, pipColor));
}

function suit(ctx, kind, x, y, s, color) {
  ctx.fillStyle = color;
  if (kind === 'heart') {
    heartPath(ctx, x, y, s);
    ctx.fill();
  } else if (kind === 'diamond') {
    ctx.beginPath();
    ctx.moveTo(x, y - s * 0.55);
    ctx.lineTo(x + s * 0.4, y);
    ctx.lineTo(x, y + s * 0.55);
    ctx.lineTo(x - s * 0.4, y);
    ctx.closePath();
    ctx.fill();
  } else if (kind === 'spade') {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.PI);
    heartPath(ctx, 0, s * 0.05, s);
    ctx.fill();
    ctx.restore();
    ctx.fillRect(x - s * 0.06, y + s * 0.1, s * 0.12, s * 0.4);
  } else {
    disc(ctx, x, y - s * 0.22, s * 0.22, color);
    disc(ctx, x - s * 0.22, y + s * 0.08, s * 0.22, color);
    disc(ctx, x + s * 0.22, y + s * 0.08, s * 0.22, color);
    ctx.fillRect(x - s * 0.06, y, s * 0.12, s * 0.45);
  }
}

export function playingCard(ctx, W, rank, kind) {
  const H = W * 1.4;
  const color = kind === 'heart' || kind === 'diamond' ? '#d6324f' : '#1b1f2a';
  drop(ctx, W * 0.06, () => {
    ctx.fillStyle = '#ffffff';
    rr(ctx, -W / 2, -H / 2, W, H, W * 0.08);
    ctx.fill();
  }, 0.3);
  ctx.fillStyle = '#fdfcf8';
  rr(ctx, -W / 2, -H / 2, W, H, W * 0.08);
  ctx.fill();
  ctx.fillStyle = color;
  ctx.font = `800 ${Math.round(W * 0.22)}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(rank, -W * 0.33, -H * 0.38);
  suit(ctx, kind, -W * 0.33, -H * 0.24, W * 0.12, color);
  suit(ctx, kind, 0, 0, W * 0.38, color);
}

export function checkerboard(ctx, s) {
  drop(ctx, s * 0.05, () => {
    ctx.fillStyle = '#6b4226';
    rr(ctx, -s / 2, -s / 2, s, s, s * 0.03);
    ctx.fill();
  }, 0.34);
  ctx.fillStyle = lin(ctx, -s / 2, -s / 2, s / 2, s / 2, [[0, '#9a6a44'], [1, '#5a3420']]);
  rr(ctx, -s / 2, -s / 2, s, s, s * 0.03);
  ctx.fill();
  const b = s * 0.9;
  const c = b / 8;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      ctx.fillStyle = (i + j) % 2 ? '#2f3b33' : '#efe3c8';
      ctx.fillRect(-b / 2 + i * c, -b / 2 + j * c, c, c);
    }
  }
  const pieces = [[1, 0, 'r'], [3, 0, 'r'], [0, 1, 'r'], [2, 1, 'r'], [6, 1, 'r'], [3, 2, 'r'], [5, 2, 'r'], [4, 5, 'b'], [2, 5, 'b'], [1, 6, 'b'], [5, 6, 'b'], [7, 6, 'b'], [0, 7, 'b'], [4, 7, 'b'], [6, 5, 'b']];
  pieces.forEach(([i, j, t]) => {
    const x = -b / 2 + (i + 0.5) * c;
    const y = -b / 2 + (j + 0.5) * c;
    const col = t === 'r' ? '#d6324f' : '#1b1f2a';
    drop(ctx, c * 0.2, () => disc(ctx, x, y, c * 0.38, col), 0.35);
    const g = ctx.createRadialGradient(x - c * 0.1, y - c * 0.12, c * 0.03, x, y, c * 0.4);
    g.addColorStop(0, css(mix(col, '#ffffff', 0.4)));
    g.addColorStop(1, col);
    disc(ctx, x, y, c * 0.38, g);
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = c * 0.04;
    ctx.beginPath();
    ctx.arc(x, y, c * 0.26, 0, TAU);
    ctx.stroke();
  });
}

export function colorWheel(ctx, R) {
  drop(ctx, R * 0.1, () => disc(ctx, 0, 0, R, '#ffffff'), 0.25);
  for (let i = 0; i < 12; i++) {
    const a0 = (i / 12) * TAU - Math.PI / 2;
    const a1 = ((i + 1) / 12) * TAU - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, R * 0.94, a0 + 0.02, a1 - 0.02);
    ctx.closePath();
    ctx.fillStyle = `hsl(${i * 30}, 78%, 58%)`;
    ctx.fill();
  }
  disc(ctx, 0, 0, R * 0.36, '#ffffff');
}

export function jar(ctx, W, H, contents, lid = '#c9ccd3') {
  ctx.save();
  rr(ctx, -W / 2, -H / 2, W, H, W * 0.18);
  ctx.clip();
  if (contents) contents(ctx, W, H);
  ctx.restore();
  ctx.fillStyle = 'rgba(220,240,255,0.16)';
  rr(ctx, -W / 2, -H / 2, W, H, W * 0.18);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.65)';
  ctx.lineWidth = W * 0.03;
  rr(ctx, -W / 2, -H / 2, W, H, W * 0.18);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  rr(ctx, -W * 0.38, -H * 0.32, W * 0.08, H * 0.6, W * 0.04);
  ctx.fill();
  if (lid) {
    ctx.fillStyle = vgrad(ctx, -H / 2 - W * 0.1, -H / 2 + W * 0.02, [[0, mix(lid, '#ffffff', 0.4)], [1, mix(lid, '#000000', 0.2)]]);
    rr(ctx, -W * 0.44, -H / 2 - W * 0.12, W * 0.88, W * 0.16, W * 0.04);
    ctx.fill();
  }
  ellipse(ctx, 0, H / 2 + W * 0.02, W * 0.5, W * 0.05, 0, 'rgba(0,0,0,0.12)');
}

export function discoBall(ctx, R, r) {
  ctx.strokeStyle = '#9aa0aa';
  ctx.lineWidth = R * 0.03;
  ctx.beginPath();
  ctx.moveTo(0, -R);
  ctx.lineTo(0, -R * 3);
  ctx.stroke();
  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, R, 0, TAU);
  ctx.clip();
  disc(ctx, 0, 0, R, '#5a6070');
  const n = 14;
  for (let i = 0; i < n; i++) {
    const lat = -Math.PI / 2 + ((i + 0.5) / n) * Math.PI;
    const y = Math.sin(lat) * R;
    const ringR = Math.cos(lat) * R;
    const m = Math.max(4, Math.round(ringR / (R / 7)));
    for (let j = 0; j < m; j++) {
      const lon = -Math.PI / 2 + ((j + 0.5) / m) * Math.PI;
      const x = Math.sin(lon) * ringR;
      const shade = 0.35 + 0.65 * Math.max(0, Math.cos(lon + 0.6) * Math.cos(lat + 0.4)) + rand(r, -0.15, 0.25);
      const tw = (ringR / m) * 1.5 * Math.cos(lon);
      const th = (R / n) * 1.7;
      ctx.fillStyle = `hsl(${rand(r, 190, 290)}, 30%, ${Math.round(Math.min(96, 25 + shade * 70))}%)`;
      ctx.fillRect(x - tw / 2 + 0.6, y - th / 2 + 0.6, Math.max(1, tw - 1.2), th - 1.2);
    }
  }
  ctx.restore();
  for (let k = 0; k < 5; k++) {
    const x = rand(r, -0.6, 0.2) * R;
    const y = rand(r, -0.6, 0.2) * R;
    sparkle(ctx, x, y, R * rand(r, 0.12, 0.25));
  }
}

export function sparkle(ctx, x, y, s, color = '#ffffff') {
  glow(ctx, x, y, s * 1.5, color, 0.5);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - s);
  ctx.quadraticCurveTo(x, y, x + s, y);
  ctx.quadraticCurveTo(x, y, x, y + s);
  ctx.quadraticCurveTo(x, y, x - s, y);
  ctx.quadraticCurveTo(x, y, x, y - s);
  ctx.fill();
}

export function tagLabel(ctx, text, s, color = '#ffffff') {
  ctx.font = `700 ${Math.round(s)}px ${HAND}`;
  const tw = ctx.measureText(text).width;
  drop(ctx, s * 0.25, () => {
    ctx.fillStyle = color;
    rr(ctx, -tw / 2 - s * 0.6, -s * 0.75, tw + s * 1.2, s * 1.5, s * 0.25);
    ctx.fill();
  }, 0.25);
  hand(ctx, text, 0, 0, s, '#1b1f2a', 'center', 700);
}
