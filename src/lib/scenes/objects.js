// More objects used by specific scenes (fruit, toast, front-view still-life pieces, doodles).
import { TAU, rand, mix, css, lin, vgrad, glow, disc, ellipse, place, drop, rr, hand, pencilLine, leafShape } from './kit.js';
import { plant } from '../art.js';

export { plant };

export function fruit(ctx, s, color, kind = 'round') {
  const rx = kind === 'lemon' ? s * 0.5 : s * 0.45;
  const ry = kind === 'lemon' ? s * 0.36 : s * 0.43;
  drop(ctx, s * 0.18, () => ellipse(ctx, 0, 0, rx, ry, 0, color), 0.32);
  const g = ctx.createRadialGradient(-s * 0.15, -s * 0.15, s * 0.04, 0, 0, s * 0.5);
  g.addColorStop(0, css(mix(color, '#ffffff', 0.45)));
  g.addColorStop(0.6, color);
  g.addColorStop(1, css(mix(color, '#000000', 0.25)));
  ellipse(ctx, 0, 0, rx, ry, 0, g);
  if (kind === 'orange' || kind === 'lemon') {
    for (let i = 0; i < 40; i++) {
      const a = (i * 2.4) % TAU;
      const d = ((i * 0.37) % 1) * 0.85;
      disc(ctx, Math.cos(a) * rx * d, Math.sin(a) * ry * d, s * 0.008, 'rgba(255,255,255,0.18)');
    }
  }
  ellipse(ctx, -s * 0.16, -s * 0.16, s * 0.1, s * 0.05, -0.6, 'rgba(255,255,255,0.45)');
  if (kind === 'apple') {
    ctx.strokeStyle = '#5b3a1e';
    ctx.lineWidth = s * 0.04;
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.05);
    ctx.lineTo(s * 0.04, -s * 0.22);
    ctx.stroke();
    leafShape(ctx, s * 0.14, -s * 0.24, s * 0.22, s * 0.08, -0.5, '#4f8f3a');
  }
}

export function button(ctx, s, color) {
  drop(ctx, s * 0.15, () => disc(ctx, 0, 0, s / 2, color), 0.3);
  disc(ctx, 0, 0, s / 2, lin(ctx, -s / 2, -s / 2, s / 2, s / 2, [[0, mix(color, '#ffffff', 0.35)], [1, mix(color, '#000000', 0.2)]]));
  disc(ctx, 0, 0, s * 0.38, css(mix(color, '#000000', 0.08)));
  for (const [x, y] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) disc(ctx, x * s * 0.1, y * s * 0.1, s * 0.055, css(mix(color, '#000000', 0.45)));
}

export function grapes(ctx, s, color = '#7b4bc4') {
  const pts = [[0, -0.3], [-0.14, -0.18], [0.14, -0.18], [-0.24, -0.04], [0, -0.05], [0.24, -0.04], [-0.12, 0.09], [0.12, 0.09], [0, 0.22], [-0.2, 0.2], [0.2, 0.2], [0, 0.34]];
  pts.forEach(([x, y]) => {
    drop(ctx, s * 0.06, () => disc(ctx, x * s, y * s, s * 0.11, color), 0.25);
    const g = ctx.createRadialGradient(x * s - s * 0.04, y * s - s * 0.04, 1, x * s, y * s, s * 0.11);
    g.addColorStop(0, css(mix(color, '#ffffff', 0.5)));
    g.addColorStop(1, css(mix(color, '#000000', 0.2)));
    disc(ctx, x * s, y * s, s * 0.11, g);
  });
  ctx.strokeStyle = '#5b3a1e';
  ctx.lineWidth = s * 0.03;
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.38);
  ctx.lineTo(s * 0.05, -s * 0.5);
  ctx.stroke();
}

export function phoneBack(ctx, W, color = '#c9cdd6') {
  const H = W * 2.05;
  drop(ctx, W * 0.14, () => {
    ctx.fillStyle = color;
    rr(ctx, -W / 2, -H / 2, W, H, W * 0.17);
    ctx.fill();
  }, 0.34);
  ctx.fillStyle = lin(ctx, -W / 2, -H / 2, W / 2, H / 2, [[0, mix(color, '#ffffff', 0.3)], [1, mix(color, '#000000', 0.12)]]);
  rr(ctx, -W / 2, -H / 2, W, H, W * 0.17);
  ctx.fill();
  ctx.fillStyle = css(mix(color, '#000000', 0.12));
  rr(ctx, -W * 0.4, -H * 0.44, W * 0.42, W * 0.42, W * 0.1);
  ctx.fill();
  for (const [x, y] of [[-0.29, -0.4], [-0.1, -0.4], [-0.2, -0.3]]) {
    disc(ctx, x * W, y * H + 0, W * 0.075, '#1b1d22');
    disc(ctx, x * W, y * H, W * 0.04, '#3a4256');
  }
}

export function toast(ctx, s, r) {
  drop(ctx, s * 0.1, () => {
    ctx.fillStyle = '#b57534';
    rr(ctx, -s / 2, -s / 2, s, s, s * 0.18);
    ctx.fill();
  }, 0.3);
  ctx.fillStyle = lin(ctx, -s / 2, -s / 2, s / 2, s / 2, [[0, '#d39a55'], [1, '#93591f']]);
  rr(ctx, -s / 2, -s / 2, s, s, s * 0.18);
  ctx.fill();
  ctx.fillStyle = lin(ctx, -s / 2, -s / 2, s / 2, s / 2, [[0, '#f2d29b'], [1, '#d9aa62']]);
  rr(ctx, -s * 0.42, -s * 0.42, s * 0.84, s * 0.84, s * 0.14);
  ctx.fill();
  for (let i = 0; i < 70; i++) disc(ctx, rand(r, -0.38, 0.38) * s, rand(r, -0.38, 0.38) * s, s * 0.008, 'rgba(140,90,30,0.35)');
  for (let k = 0; k < 5; k++) {
    const y = -s * 0.25 + k * s * 0.12;
    place(ctx, -s * 0.1 + (k % 2) * s * 0.06, y, -0.3, () => {
      ellipse(ctx, 0, 0, s * 0.26, s * 0.075, 0, '#4d7a2c');
      ellipse(ctx, 0, -s * 0.01, s * 0.23, s * 0.055, 0, '#b8d36a');
      ellipse(ctx, 0, -s * 0.015, s * 0.17, s * 0.035, 0, '#d9e88f');
    });
  }
  for (const [x, y] of [[0.24, -0.22], [0.26, 0.12], [-0.22, 0.28]]) {
    disc(ctx, x * s, y * s, s * 0.1, '#d93a2b');
    disc(ctx, x * s, y * s, s * 0.075, '#ef6a4f');
    for (let k = 0; k < 3; k++) {
      const a = (k / 3) * TAU + 0.4;
      ellipse(ctx, x * s + Math.cos(a) * s * 0.035, y * s + Math.sin(a) * s * 0.035, s * 0.012, s * 0.008, a, '#ffe6a8');
    }
  }
  for (let i = 0; i < 9; i++) leafShape(ctx, rand(r, -0.3, 0.3) * s, rand(r, -0.3, 0.3) * s, s * 0.08, s * 0.03, rand(r, 0, TAU), '#2f7a32');
  for (let i = 0; i < 30; i++) disc(ctx, rand(r, -0.35, 0.35) * s, rand(r, -0.35, 0.35) * s, s * 0.006, '#1b1b1b');
}

export function daisy(ctx, s, petal = '#ffffff', center = '#f4c430') {
  ctx.strokeStyle = '#4f7a3a';
  ctx.lineWidth = s * 0.04;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(s * 0.2, s * 0.6, s * 0.1, s * 1.1);
  ctx.stroke();
  leafShape(ctx, s * 0.22, s * 0.6, s * 0.3, s * 0.08, 0.9, '#5b8c41');
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * TAU;
    place(ctx, Math.cos(a) * s * 0.2, Math.sin(a) * s * 0.2, a, () => {
      drop(ctx, s * 0.04, () => ellipse(ctx, 0, 0, s * 0.2, s * 0.06, 0, petal), 0.18);
    });
  }
  const g = ctx.createRadialGradient(-s * 0.03, -s * 0.03, 1, 0, 0, s * 0.12);
  g.addColorStop(0, css(mix(center, '#ffffff', 0.35)));
  g.addColorStop(1, css(mix(center, '#000000', 0.25)));
  disc(ctx, 0, 0, s * 0.11, g);
}

export function plantTop(ctx, R, r, potColor = '#d07a52') {
  drop(ctx, R * 0.2, () => disc(ctx, 0, 0, R, potColor), 0.32);
  disc(ctx, 0, 0, R, lin(ctx, -R, -R, R, R, [[0, mix(potColor, '#ffffff', 0.2)], [1, mix(potColor, '#000000', 0.2)]]));
  disc(ctx, 0, 0, R * 0.84, '#4a3424');
  for (let i = 0; i < 30; i++) disc(ctx, rand(r, -0.7, 0.7) * R, rand(r, -0.7, 0.7) * R, R * 0.02, 'rgba(255,255,255,0.08)');
  for (let i = 0; i < 13; i++) {
    const a = (i / 13) * TAU + rand(r, -0.2, 0.2);
    const len = R * rand(r, 1.1, 1.6);
    place(ctx, Math.cos(a) * len * 0.45, Math.sin(a) * len * 0.45, a, () => {
      drop(ctx, R * 0.08, () => leafShape(ctx, 0, 0, len, len * 0.32, 0, '#3f7d4a'), 0.25);
      leafShape(ctx, 0, 0, len, len * 0.32, 0, i % 2 ? '#4f9156' : '#3a7346');
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.lineWidth = Math.max(1, R * 0.015);
      ctx.beginPath();
      ctx.moveTo(-len * 0.45, 0);
      ctx.lineTo(len * 0.45, 0);
      ctx.stroke();
    });
  }
}

export function foamBlock(ctx, W, H, color = '#9ec9ff') {
  drop(ctx, W * 0.12, () => {
    ctx.fillStyle = color;
    rr(ctx, -W / 2, -H / 2, W, H, W * 0.12);
    ctx.fill();
  }, 0.3);
  ctx.fillStyle = lin(ctx, -W / 2, -H / 2, W / 2, H / 2, [[0, mix(color, '#ffffff', 0.3)], [1, mix(color, '#000000', 0.12)]]);
  rr(ctx, -W / 2, -H / 2, W, H, W * 0.12);
  ctx.fill();
}

// ---------- front-view pieces (stand on a tabletop line at y = 0) ----------
export function pencilUp(ctx, x, top, bottom, w, color) {
  ctx.fillStyle = lin(ctx, x - w / 2, 0, x + w / 2, 0, [[0, mix(color, '#ffffff', 0.25)], [0.5, color], [1, mix(color, '#000000', 0.25)]]);
  ctx.fillRect(x - w / 2, top + w * 1.6, w, bottom - top - w * 1.6);
  ctx.fillStyle = '#e9c79c';
  ctx.beginPath();
  ctx.moveTo(x - w / 2, top + w * 1.6);
  ctx.lineTo(x, top);
  ctx.lineTo(x + w / 2, top + w * 1.6);
  ctx.fill();
  ctx.fillStyle = '#34363d';
  ctx.beginPath();
  ctx.moveTo(x - w * 0.17, top + w * 0.55);
  ctx.lineTo(x, top);
  ctx.lineTo(x + w * 0.17, top + w * 0.55);
  ctx.fill();
}

export function brushUp(ctx, x, top, bottom, w, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x - w * 0.3, top + w * 3, w * 0.6, bottom - top - w * 3);
  ctx.fillStyle = '#c9ccd3';
  ctx.fillRect(x - w * 0.4, top + w * 1.6, w * 0.8, w * 1.5);
  ctx.fillStyle = '#3a2a1a';
  ctx.beginPath();
  ctx.moveTo(x - w * 0.4, top + w * 1.6);
  ctx.quadraticCurveTo(x, top - w * 0.4, x + w * 0.4, top + w * 1.6);
  ctx.fill();
}

export function tinCan(ctx, W, H, color, plantOn, r) {
  if (plantOn) {
    for (let i = 0; i < 9; i++) {
      const a = -Math.PI / 2 + rand(r, -1.1, 1.1);
      const len = H * rand(r, 0.6, 1.0);
      leafShape(ctx, Math.cos(a) * len * 0.45, -H + Math.sin(a) * len * 0.5, len, len * 0.32, a, i % 2 ? '#4f9156' : '#3a7346');
    }
  }
  drop(ctx, W * 0.1, () => {
    ctx.fillStyle = color;
    ctx.fillRect(-W / 2, -H, W, H);
  }, 0.25);
  ctx.fillStyle = lin(ctx, -W / 2, 0, W / 2, 0, [[0, mix(color, '#000000', 0.2)], [0.3, mix(color, '#ffffff', 0.3)], [0.55, color], [1, mix(color, '#000000', 0.3)]]);
  ctx.fillRect(-W / 2, -H, W, H);
  ctx.strokeStyle = 'rgba(0,0,0,0.12)';
  ctx.lineWidth = 1.5;
  for (let k = 1; k < 6; k++) {
    ctx.beginPath();
    ctx.moveTo(-W / 2, -H + (k * H) / 6);
    ctx.lineTo(W / 2, -H + (k * H) / 6);
    ctx.stroke();
  }
  ctx.fillStyle = lin(ctx, -W / 2, 0, W / 2, 0, [[0, '#9aa0aa'], [0.35, '#f2f3f5'], [1, '#7d828c']]);
  ctx.fillRect(-W / 2 - 2, -H - 4, W + 4, 6);
}

export function wateringCan(ctx, s, color = '#5fb7a0') {
  ctx.strokeStyle = css(mix(color, '#000000', 0.2));
  ctx.lineWidth = s * 0.07;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(s * 0.3, -s * 0.25);
  ctx.lineTo(s * 0.75, -s * 0.7);
  ctx.stroke();
  ellipse(ctx, s * 0.78, -s * 0.73, s * 0.08, s * 0.05, -0.8, css(mix(color, '#000000', 0.25)));
  ctx.lineWidth = s * 0.06;
  ctx.beginPath();
  ctx.arc(-s * 0.05, -s * 0.62, s * 0.26, Math.PI * 1.05, Math.PI * 1.95);
  ctx.stroke();
  drop(ctx, s * 0.1, () => {
    ctx.fillStyle = color;
    rr(ctx, -s * 0.38, -s * 0.62, s * 0.7, s * 0.62, s * 0.08);
    ctx.fill();
  }, 0.25);
  ctx.fillStyle = lin(ctx, -s * 0.38, 0, s * 0.32, 0, [[0, mix(color, '#000000', 0.2)], [0.35, mix(color, '#ffffff', 0.3)], [1, mix(color, '#000000', 0.25)]]);
  rr(ctx, -s * 0.38, -s * 0.62, s * 0.7, s * 0.62, s * 0.08);
  ctx.fill();
}

export function lampSide(ctx, s, on = true) {
  if (on) glow(ctx, 0, -s * 0.72, s * 1.2, '#fff1c9', 0.55);
  ctx.fillStyle = '#2a2d33';
  ctx.fillRect(-s * 0.025, -s * 0.72, s * 0.05, s * 0.7);
  ellipse(ctx, 0, -s * 0.02, s * 0.2, s * 0.05, 0, '#2a2d33');
  ctx.fillStyle = lin(ctx, -s * 0.28, 0, s * 0.28, 0, [[0, '#e7d8c0'], [0.5, '#fff6e6'], [1, '#d3c2a6']]);
  ctx.beginPath();
  ctx.moveTo(-s * 0.16, -s * 1.02);
  ctx.lineTo(s * 0.16, -s * 1.02);
  ctx.lineTo(s * 0.28, -s * 0.7);
  ctx.lineTo(-s * 0.28, -s * 0.7);
  ctx.closePath();
  ctx.fill();
  if (on) ellipse(ctx, 0, -s * 0.7, s * 0.27, s * 0.04, 0, 'rgba(255,240,200,0.9)');
}

export function bookStackSide(ctx, w, r, colors) {
  let y = 0;
  colors.forEach((c, i) => {
    const th = w * rand(r, 0.12, 0.18);
    const ww = w * rand(r, 0.85, 1);
    const x = rand(r, -0.06, 0.06) * w;
    ctx.fillStyle = vgrad(ctx, y - th, y, [[0, mix(c, '#ffffff', 0.15)], [1, mix(c, '#000000', 0.2)]]);
    ctx.fillRect(x - ww / 2, y - th, ww, th);
    ctx.fillStyle = '#efe7d6';
    ctx.fillRect(x + ww / 2 - w * 0.03, y - th + 2, w * 0.03, th - 4);
    ctx.fillStyle = css(mix(c, '#ffffff', 0.6), 0.7);
    ctx.fillRect(x - ww * 0.3, y - th * 0.6, ww * 0.3, th * 0.18);
    y -= th;
  });
  return y;
}

export function frame(ctx, W, H, img) {
  drop(ctx, W * 0.06, () => {
    ctx.fillStyle = '#1f1a16';
    ctx.fillRect(-W / 2, -H / 2, W, H);
  }, 0.3);
  ctx.fillStyle = lin(ctx, -W / 2, -H / 2, W / 2, H / 2, [[0, '#4a3a2c'], [1, '#1f1a16']]);
  ctx.fillRect(-W / 2, -H / 2, W, H);
  ctx.fillStyle = '#f6f2ea';
  ctx.fillRect(-W / 2 + W * 0.06, -H / 2 + W * 0.06, W - W * 0.12, H - W * 0.12);
  if (img) ctx.drawImage(img, -W / 2 + W * 0.14, -H / 2 + W * 0.14, W - W * 0.28, H - W * 0.28);
}

// ---------- line doodles ----------
export function smooth(ctx, pts) {
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i + 1][0]) / 2;
    const my = (pts[i][1] + pts[i + 1][1]) / 2;
    ctx.quadraticCurveTo(pts[i][0], pts[i][1], mx, my);
  }
  const l = pts[pts.length - 1];
  ctx.lineTo(l[0], l[1]);
}

export function inkLine(ctx, pts, width, color = '#1f2430') {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  smooth(ctx, pts);
  ctx.stroke();
  ctx.restore();
}

export function mugDoodle(ctx, pw, ph, r) {
  const cx = pw * 0.52;
  const cy = ph * 0.52;
  const R = Math.min(pw, ph) * 0.3;
  const col = 'rgba(45,48,58,0.85)';
  const ell = (y, rx, ry, a0 = 0, a1 = TAU) => {
    const pts = [];
    for (let k = 0; k <= 40; k++) {
      const a = a0 + ((a1 - a0) * k) / 40;
      pts.push([cx + Math.cos(a) * rx, y + Math.sin(a) * ry]);
    }
    pencilLine(ctx, pts, R * 0.025, col, r);
  };
  ell(cy + R * 0.55, R * 0.7, R * 0.28);
  ell(cy - R * 0.55, R * 0.62, R * 0.24, 0, Math.PI);
  pencilLine(ctx, [[cx - R * 0.7, cy + R * 0.55], [cx - R * 0.62, cy - R * 0.55]], R * 0.025, col, r);
  pencilLine(ctx, [[cx + R * 0.7, cy + R * 0.55], [cx + R * 0.62, cy - R * 0.55]], R * 0.025, col, r);
  const hpts = [];
  for (let k = 0; k <= 20; k++) {
    const a = -Math.PI / 2 + (k / 20) * Math.PI;
    hpts.push([cx + R * 0.66 + Math.cos(a) * R * 0.32, cy + Math.sin(a) * R * 0.35]);
  }
  pencilLine(ctx, hpts, R * 0.025, col, r);
  ell(cy + R * 0.55, R * 0.55, R * 0.2);
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx + R * 0.15, cy - R * 0.55);
  ctx.lineTo(cx + R * 0.62, cy - R * 0.55);
  ctx.lineTo(cx + R * 0.7, cy + R * 0.55);
  ctx.lineTo(cx + R * 0.2, cy + R * 0.75);
  ctx.closePath();
  ctx.clip();
  ctx.strokeStyle = 'rgba(45,48,58,0.35)';
  ctx.lineWidth = R * 0.012;
  for (let k = -R; k < R * 2; k += R * 0.07) {
    ctx.beginPath();
    ctx.moveTo(cx + k - R * 0.5, cy + R);
    ctx.lineTo(cx + k + R * 0.2, cy - R);
    ctx.stroke();
  }
  ctx.restore();
  for (let s = 0; s < 3; s++) {
    const x = cx - R * 0.3 + s * R * 0.3;
    pencilLine(ctx, [[x, cy - R * 0.85], [x + R * 0.08, cy - R * 1.05], [x - R * 0.04, cy - R * 1.25], [x + R * 0.06, cy - R * 1.45]], R * 0.018, 'rgba(45,48,58,0.6)', r, 1);
  }
  ctx.save();
  ctx.translate(pw * 0.08, ph * 0.1);
  hand(ctx, 'mug, from below', 0, 0, ph * 0.06, 'rgba(45,48,58,0.75)');
  ctx.restore();
}

export function faceLine(ctx, pw, ph, color = '#1f2430') {
  const P = [
    [0.36, 0.92], [0.3, 0.74], [0.27, 0.52], [0.3, 0.33], [0.42, 0.2], [0.58, 0.17], [0.72, 0.26], [0.76, 0.42], [0.66, 0.44],
    [0.6, 0.4], [0.57, 0.46], [0.63, 0.47], [0.62, 0.41], [0.52, 0.43], [0.43, 0.4], [0.37, 0.44], [0.42, 0.48], [0.46, 0.42],
    [0.5, 0.5], [0.47, 0.6], [0.55, 0.62], [0.5, 0.58], [0.42, 0.7], [0.5, 0.74], [0.6, 0.7], [0.66, 0.62], [0.74, 0.58], [0.73, 0.76],
    [0.6, 0.88], [0.5, 0.97], [0.62, 0.99], [0.8, 0.92], [0.86, 0.6], [0.82, 0.2], [0.65, 0.07], [0.42, 0.08], [0.22, 0.2], [0.16, 0.45], [0.2, 0.7],
  ].map(([x, y]) => [x * pw, y * ph]);
  inkLine(ctx, P, Math.max(1.5, pw * 0.012), color);
}

export function octopus(ctx, s, color = '#1f2430') {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1.2, s * 0.025);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.ellipse(0, -s * 0.2, s * 0.26, s * 0.3, 0, Math.PI * 0.95, Math.PI * 2.05);
  ctx.stroke();
  for (let k = 0; k < 8; k++) {
    const x0 = -s * 0.24 + (k / 7) * s * 0.48;
    const dir = x0 < 0 ? -1 : 1;
    const pts = [];
    for (let t = 0; t <= 12; t++) {
      const u = t / 12;
      pts.push([x0 + dir * u * s * (0.18 + (k % 4) * 0.05) + Math.sin(u * 6 + k) * s * 0.04, -s * 0.1 + u * s * 0.55]);
    }
    smooth(ctx, pts);
    ctx.stroke();
    const e = pts[pts.length - 1];
    ctx.beginPath();
    ctx.arc(e[0] + dir * s * 0.03, e[1], s * 0.03, 0, Math.PI * 1.5);
    ctx.stroke();
  }
  disc(ctx, -s * 0.09, -s * 0.2, s * 0.035, color);
  disc(ctx, s * 0.09, -s * 0.2, s * 0.035, color);
  ctx.restore();
}
