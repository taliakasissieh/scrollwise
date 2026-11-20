// Scene compositions: one drawn picture for each of the 46 activities (feed posts use photos only).
// Each scene arranges objects from kit.js / objects.js. Key objects stay near the centre so
// the picture still reads when it is cropped to a square thumbnail.
import { registerPainters } from '../art.js';
import * as K from './kit.js';
import * as O from './objects.js';

const { TAU, rand, mix, css, lin, vgrad, fillAll, glow, disc, ellipse, place, drop, rr, hand, scribble, mini, surface, room } = K;

function U(w, h) {
  const S = Math.min(w, h);
  return { S, X: (u) => w / 2 + u * S, Y: (v) => h / 2 + v * S };
}

const HUES = { red: '#e23b3b', orange: '#f28c28', yellow: '#f6cf3a', green: '#4caf50', blue: '#2b59ff', purple: '#8e5cd9', pink: '#ff6f91', mint: '#3ee3a6' };

/* ------------------------------------------------------------------ activities */
const A = {};

A.photoquest = (ctx, w, h, r) => {
  surface(ctx, w, h, r, 'oak');
  const { S, X, Y } = U(w, h);
  place(ctx, X(-0.42), Y(0.03), -0.12, () => K.phone(ctx, S * 0.34, K.screens.camera('bokeh', 3)));
  [['peaks', 5, 'begin', 0.06, -0.21, -0.1], ['bowl', 4, 'middle', 0.4, 0.02, 0.1], ['city', 8, 'end', 0.08, 0.27, 0.05]].forEach(([k, sd, cap, x, y, a]) =>
    place(ctx, X(x), Y(y), a, () => K.polaroid(ctx, S * 0.33, k, sd, cap, r)),
  );
};

A.colorhunt = (ctx, w, h, r) => {
  surface(ctx, w, h, r, '#f4f1ec');
  const { S, X, Y } = U(w, h);
  const cols = [HUES.red, HUES.orange, HUES.yellow, HUES.green, HUES.blue, HUES.purple];
  const top = [
    () => O.fruit(ctx, S * 0.2, '#d8322b', 'apple'),
    () => O.fruit(ctx, S * 0.19, '#f28c28', 'orange'),
    () => O.fruit(ctx, S * 0.2, '#f6cf3a', 'lemon'),
    () => K.leafShape(ctx, 0, 0, S * 0.22, S * 0.08, 0.6, '#4caf50'),
    () => O.button(ctx, S * 0.15, HUES.blue),
    () => O.grapes(ctx, S * 0.2, '#8e5cd9'),
  ];
  cols.forEach((c, i) => {
    const x = X(-0.6 + i * 0.24);
    place(ctx, x, Y(-0.22), 0, top[i]);
    place(ctx, x, Y(0.08), 0.9, () => K.crayon(ctx, S * 0.22, c));
    place(ctx, x, Y(0.32), 0, () => O.button(ctx, S * 0.09, c));
  });
};

A.fashion = (ctx, w, h, r) => {
  surface(ctx, w, h, r, '#efe4d6');
  const { S, X, Y } = U(w, h);
  place(ctx, X(-0.3), Y(-0.08), -0.05, () => K.tshirt(ctx, S * 0.5, '#9bb48f'));
  place(ctx, X(0.12), Y(0.02), 0.04, () => K.jeans(ctx, S * 0.58, '#3e5f8f'));
  place(ctx, X(0.5), Y(-0.22), 0.1, () => K.tote(ctx, S * 0.3, '#e9dcc4'));
  place(ctx, X(0.52), Y(0.2), -0.1, () => K.sneakers(ctx, S * 0.3, '#f6f5f2', '#e2523f'));
  place(ctx, X(-0.3), Y(0.33), 0.08, () => K.sunglasses(ctx, S * 0.26));
  place(ctx, X(-0.64), Y(0.05), 0.2, () => K.watch(ctx, S * 0.3));
};

A.miniartist = (ctx, w, h, r) => {
  surface(ctx, w, h, r, 'linen');
  const { S, X, Y } = U(w, h);
  place(ctx, X(-0.08), Y(0.02), -0.04, () => K.sketchpad(ctx, S * 0.82, S * 0.82, (c, pw, ph) => O.mugDoodle(c, pw, ph, r)));
  place(ctx, X(0.52), Y(-0.08), 1.35, () => K.pencil(ctx, S * 0.62, '#f2c14e', r));
  place(ctx, X(0.62), Y(0.1), 1.5, () => K.pencil(ctx, S * 0.55, '#2b59ff', r));
  place(ctx, X(0.55), Y(0.36), 0.3, () => K.eraser(ctx, S * 0.16));
};

A.conversation = (ctx, w, h, r) => {
  surface(ctx, w, h, r, 'walnut');
  const { S, X, Y } = U(w, h);
  place(ctx, X(-0.38), Y(-0.1), 0.4, () => K.mugTop(ctx, S * 0.15, '#f4f1ec', 'latte', r));
  place(ctx, X(0.38), Y(0.12), -2.6, () => K.mugTop(ctx, S * 0.15, '#2f3542', 'cocoa', r));
  place(ctx, X(0), Y(-0.02), -0.05, () =>
    K.card(ctx, S * 0.48, S * 0.3, '#fbf7ee', (c, cw, ch) => {
      hand(c, 'What did you want to be', cw / 2, ch * 0.36, ch * 0.16, '#1f2430', 'center', 700, cw * 0.88);
      hand(c, 'when you were my age?', cw / 2, ch * 0.62, ch * 0.16, '#1f2430', 'center', 700, cw * 0.88);
    }),
  );
  place(ctx, X(0), Y(0.33), 0, () => {
    K.plate(ctx, S * 0.16);
    K.cookies(ctx, S * 0.1, -S * 0.05, 0, S * 0.06, r);
  });
  place(ctx, X(-0.66), Y(0.28), 0.3, () => O.phoneBack(ctx, S * 0.16));
  place(ctx, X(0.66), Y(-0.28), -0.25, () => O.phoneBack(ctx, S * 0.16, '#e9d7c9'));
};

A.naturedetective = (ctx, w, h, r) => {
  surface(ctx, w, h, r, '#ece6d8');
  const { S, X, Y } = U(w, h);
  place(ctx, X(-0.18), Y(0.02), -0.4, () => drop(ctx, S * 0.03, () => K.bigLeaf(ctx, 0, 0, S * 0.78, S * 0.17, 0, '#4f8f3a'), 0.3));
  place(ctx, X(-0.12), Y(-0.02), 0, () =>
    K.magnifier(ctx, S * 0.52, (c, R) => {
      c.save();
      c.rotate(-0.4);
      c.scale(2.2, 2.2);
      c.translate(-S * 0.03, S * 0.01);
      K.bigLeaf(c, 0, 0, S * 0.78, S * 0.17, 0, '#4f8f3a');
      c.restore();
    }),
  );
  place(ctx, X(0.4), Y(-0.24), 0.5, () => K.pinecone(ctx, S * 0.32));
  place(ctx, X(0.5), Y(0.18), 0, () => K.shell(ctx, S * 0.3));
  place(ctx, X(0.18), Y(0.33), -0.3, () => K.ginkgo(ctx, S * 0.28));
  place(ctx, X(-0.6), Y(-0.3), 0, () => K.pebble(ctx, S * 0.14, '#a39b90', r));
  place(ctx, X(-0.66), Y(0.26), 0, () => K.ginkgo(ctx, S * 0.2, '#d98c2b'));
};

A.movement = (ctx, w, h, r) => {
  surface(ctx, w, h, r, 'oak');
  const { S, X, Y } = U(w, h);
  place(ctx, X(0.05), Y(0), -0.22, () => K.mat(ctx, S * 1.7, S * 0.6, '#b7a6ff'));
  place(ctx, X(0.18), Y(-0.02), 0.25, () => K.sneakers(ctx, S * 0.32, '#f6f5f2', '#2b59ff'));
  place(ctx, X(-0.42), Y(-0.24), 0.5, () => K.waterBottle(ctx, S * 0.42, '#3ee3a6'));
  place(ctx, X(-0.38), Y(0.26), -0.15, () => K.towel(ctx, S * 0.34, S * 0.22, '#f4f2ec', '#2b59ff'));
  place(ctx, X(0.58), Y(-0.3), 0.3, () => K.phone(ctx, S * 0.15, (c, sw, sh) => {
    fillAll(c, sw, sh, '#0b1433');
    c.fillStyle = '#3ee3a6';
    c.font = `800 ${Math.round(sw * 0.3)}px system-ui, sans-serif`;
    c.textAlign = 'center';
    c.fillText('1:00', sw / 2, sh * 0.5);
  }));
};

A.story = (ctx, w, h, r) => {
  surface(ctx, w, h, r, 'oak');
  const { S, X, Y } = U(w, h);
  place(ctx, X(-0.08), Y(0.03), -0.03, () =>
    K.notebookOpen(
      ctx,
      S * 1.0,
      S * 0.66,
      (c, pw, ph) => {
        hand(c, 'Six-sentence story', pw * 0.1, ph * 0.1, ph * 0.075, '#1f2430', 'left', 700);
        for (let i = 0; i < 6; i++) {
          hand(c, `${i + 1}.`, pw * 0.08, ph * (0.22 + i * 0.12), ph * 0.055, '#2b59ff', 'left', 700);
          if (i < 4) scribble(c, pw * 0.16, ph * (0.22 + i * 0.12), pw * rand(r, 0.55, 0.72), ph * 0.045, r);
        }
      },
      (c, pw, ph) => {
        hand(c, 'the lamp wanted', pw * 0.12, ph * 0.22, ph * 0.06, '#5a6070');
        hand(c, 'to see the sea...', pw * 0.12, ph * 0.32, ph * 0.06, '#5a6070');
        O.inkLine(c, [[pw * 0.3, ph * 0.75], [pw * 0.4, ph * 0.55], [pw * 0.5, ph * 0.75]], 2, '#5a6070');
        O.inkLine(c, [[pw * 0.32, ph * 0.75], [pw * 0.68, ph * 0.75]], 2, '#5a6070');
        O.inkLine(c, [[pw * 0.55, ph * 0.72], [pw * 0.6, ph * 0.66], [pw * 0.67, ph * 0.7], [pw * 0.72, ph * 0.64]], 2, '#5a6070');
      },
      '#2f4f6f',
    ),
  );
  place(ctx, X(0.58), Y(0.06), 1.25, () => K.pen(ctx, S * 0.5, '#0b1433'));
  place(ctx, X(0.6), Y(-0.33), 0, () => K.mugTop(ctx, S * 0.12, '#e9d7c9', 'tea', r));
};

A.reuse = (ctx, w, h, r) => {
  room(ctx, w, h, r, '#e8e2d7', '#b88a5c', 0.64);
  const { S, X, Y } = U(w, h);
  const base = Y(0.36);
  ctx.save();
  ctx.translate(X(-0.36), base - S * 0.17);
  ['#f2c14e', '#2b59ff', '#e2523f', '#3ee3a6', '#8e5cd9'].forEach((c, i) => O.pencilUp(ctx, -S * 0.08 + i * S * 0.04, -S * (0.42 - (i % 2) * 0.05), S * 0.12, S * 0.03, c));
  ctx.restore();
  place(ctx, X(-0.36), base - S * 0.17, 0, () => K.jar(ctx, S * 0.26, S * 0.34, null, '#c9ccd3'));
  ctx.strokeStyle = '#a7754a';
  ctx.lineWidth = S * 0.012;
  for (let k = 0; k < 4; k++) {
    ctx.beginPath();
    ctx.ellipse(X(-0.36), base - S * 0.1 + k * S * 0.018, S * 0.13, S * 0.02, 0, 0, Math.PI);
    ctx.stroke();
  }
  place(ctx, X(0.04), base, 0, () => O.tinCan(ctx, S * 0.22, S * 0.26, '#ff8fab', true, r));
  ctx.save();
  ctx.translate(X(0.04), base);
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  for (let k = 0; k < 3; k++) ctx.fillRect(-S * 0.11, -S * 0.2 + k * S * 0.06, S * 0.22, S * 0.018);
  ctx.restore();
  ctx.save();
  ctx.translate(X(0.4), base - S * 0.15);
  ['#8a5a3c', '#2b59ff', '#e2523f'].forEach((c, i) => O.brushUp(ctx, -S * 0.04 + i * S * 0.04, -S * 0.25 + i * S * 0.03, S * 0.1, S * 0.03, c));
  ctx.restore();
  place(ctx, X(0.4), base, 0, () => O.tinCan(ctx, S * 0.16, S * 0.2, '#5fb7a0', false, r));
  place(ctx, X(0.66), Y(0.42), -0.3, () => K.scissors(ctx, S * 0.3, '#2b59ff'));
  place(ctx, X(-0.66), Y(0.42), 0, () => K.tapeRoll(ctx, S * 0.08, '#ffd166', '#ff6f91'));
};

A.sound = (ctx, w, h, r) => {
  surface(ctx, w, h, r, 'grass');
  const { S, X, Y } = U(w, h);
  place(ctx, X(-0.3), Y(-0.02), -0.2, () => K.headphones(ctx, S * 0.62, '#f4f2ec', '#3a3f4a'));
  place(ctx, X(0.32), Y(0.02), 0.06, () =>
    K.card(ctx, S * 0.48, S * 0.64, '#fbf8f0', (c, cw, ch) => {
      hand(c, 'Sounds I heard', cw * 0.1, ch * 0.1, ch * 0.075, '#1f2430', 'left', 700);
      ['birds (near)', 'wind in trees', 'a bike bell', 'dog, far away', 'my own breathing'].forEach((t, i) => {
        hand(c, `• ${t}`, cw * 0.1, ch * (0.26 + i * 0.12), ch * 0.06, '#2f3542');
      });
      c.strokeStyle = '#2b59ff';
      c.lineWidth = 2;
      c.beginPath();
      for (let x = 0; x < cw * 0.8; x += 3) c.lineTo(cw * 0.1 + x, ch * 0.9 + Math.sin(x * 0.18) * ch * 0.03 * Math.sin(x * 0.02));
      c.stroke();
    }),
  );
  place(ctx, X(0.66), Y(0.3), 1.1, () => K.pencil(ctx, S * 0.4, '#f2c14e', r));
  place(ctx, X(-0.66), Y(0.35), 0.8, () => K.bigLeaf(ctx, 0, 0, S * 0.22, S * 0.06, 0, '#c7792b'));
};

A.cloudgallery = (ctx, w, h, r) => {
  ctx.drawImage(mini('clouds', 6, w, h), 0, 0, w, h);
  const { S, X, Y } = U(w, h);
  ctx.save();
  ctx.translate(X(0.02), Y(-0.02));
  ctx.shadowColor = 'rgba(20,50,110,0.55)';
  ctx.shadowBlur = S * 0.02;
  ctx.strokeStyle = 'rgba(255,255,255,0.98)';
  ctx.lineWidth = Math.max(2.5, S * 0.014);
  ctx.setLineDash([S * 0.025, S * 0.018]);
  ctx.lineCap = 'round';
  O.smooth(ctx, [[-0.42, 0.04], [-0.3, -0.12], [-0.05, -0.17], [0.2, -0.12], [0.33, -0.03], [0.44, -0.12], [0.5, -0.02], [0.42, 0.06], [0.33, 0.06], [0.15, 0.13], [-0.15, 0.14], [-0.38, 0.1], [-0.42, 0.04]].map(([x, y]) => [x * S, y * S]));
  ctx.stroke();
  ctx.setLineDash([]);
  disc(ctx, -0.27 * S, -0.04 * S, S * 0.012, '#ffffff');
  O.smooth(ctx, [[-0.12, -0.17], [-0.15, -0.26], [-0.1, -0.3]].map(([x, y]) => [x * S, y * S]));
  ctx.stroke();
  ctx.restore();
  ctx.save();
  ctx.shadowColor = 'rgba(20,50,110,0.6)';
  ctx.shadowBlur = S * 0.02;
  hand(ctx, 'a whale!', X(0.22), Y(0.24), S * 0.085, '#ffffff', 'center', 700);
  ctx.restore();
};

A.playlist = (ctx, w, h, r) => {
  surface(ctx, w, h, r, '#cfc6f2');
  const { S, X, Y } = U(w, h);
  place(ctx, X(-0.06), Y(0.02), -0.06, () => K.phone(ctx, S * 0.4, K.screens.playlist([12, 30])));
  place(ctx, X(0.45), Y(-0.02), 0.3, () => K.headphones(ctx, S * 0.5, '#1f2430', '#4a4f5c'));
  place(ctx, X(-0.5), Y(0.18), -0.12, () =>
    K.sticky(ctx, S * 0.26, '#ffe27a', (c, s) => {
      hand(c, 'for Maya', s / 2, s * 0.38, s * 0.16, '#1f2430', 'center', 700);
      hand(c, '#3 = us', s / 2, s * 0.64, s * 0.14, '#2b59ff', 'center', 700);
    }),
  );
};

A.kitchenremix = (ctx, w, h, r) => {
  surface(ctx, w, h, r, 'marble');
  const { S, X, Y } = U(w, h);
  place(ctx, X(-0.05), Y(0.02), 0, () => {
    K.plate(ctx, S * 0.42);
    place(ctx, 0, 0, 0.2, () => O.toast(ctx, S * 0.42, r));
  });
  place(ctx, X(-0.6), Y(0.04), Math.PI / 2, () => K.cutlery(ctx, S * 0.55, 'fork'));
  place(ctx, X(0.5), Y(0.12), -Math.PI / 2, () => K.cutlery(ctx, S * 0.55, 'knife'));
  place(ctx, X(0.56), Y(-0.28), 0.08, () =>
    K.card(ctx, S * 0.3, S * 0.18, '#fffdf7', (c, cw, ch) => {
      hand(c, "Chef's special", cw / 2, ch * 0.36, ch * 0.22, '#1f2430', 'center', 700);
      hand(c, 'Toast Royale', cw / 2, ch * 0.7, ch * 0.2, '#e2523f', 'center', 700);
    }),
  );
};

A.tenpage = (ctx, w, h, r) => {
  surface(ctx, w, h, r, 'knit');
  const { S, X, Y } = U(w, h);
  place(ctx, X(-0.1), Y(0.04), -0.06, () => K.bookOpen(ctx, S * 1.0, r));
  ctx.fillStyle = '#e2523f';
  place(ctx, X(-0.1), Y(-0.3), -0.06, () => {
    ctx.fillStyle = '#e2523f';
    ctx.fillRect(-S * 0.015, 0, S * 0.03, S * 0.62);
  });
  place(ctx, X(0.58), Y(-0.28), 0, () => K.mugTop(ctx, S * 0.13, '#5fb7a0', 'tea', r));
};

A.stairs = (ctx, w, h, r) => {
  const { S, X, Y } = U(w, h);
  fillAll(ctx, w, h, vgrad(ctx, 0, h, [[0, '#f2ede4'], [1, '#d9d0c2']]));
  glow(ctx, w * 0.8, h * 0.1, w * 0.7, '#fff6e0', 0.6);
  const n = 9;
  const vx = w * 0.5;
  for (let i = 0; i < n; i++) {
    const t0 = i / n;
    const t1 = (i + 1) / n;
    const y0 = h * (1 - Math.pow(t0, 0.85) * 0.92);
    const y1 = h * (1 - Math.pow(t1, 0.85) * 0.92);
    const hw0 = w * (0.62 - t0 * 0.36);
    const hw1 = w * (0.62 - t1 * 0.36);
    const mid = y0 + (y1 - y0) * 0.45;
    ctx.fillStyle = css(mix('#f7f4ee', '#d8d0c4', t0 * 0.6));
    ctx.beginPath();
    ctx.moveTo(vx - hw0, y0);
    ctx.lineTo(vx + hw0, y0);
    ctx.lineTo(vx + hw0, mid);
    ctx.lineTo(vx - hw0, mid);
    ctx.fill();
    ctx.fillStyle = lin(ctx, vx - hw0, 0, vx + hw0, 0, [[0, '#b98a5c'], [0.5, '#d6a874'], [1, '#a77a4f']]);
    ctx.beginPath();
    ctx.moveTo(vx - hw0, mid);
    ctx.lineTo(vx + hw0, mid);
    ctx.lineTo(vx + hw1, y1);
    ctx.lineTo(vx - hw1, y1);
    ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.fillRect(vx - hw0, mid - 2, hw0 * 2, 3);
  }
  ctx.strokeStyle = '#2f3542';
  ctx.lineWidth = S * 0.025;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(w * 0.9, h * 0.62);
  ctx.lineTo(w * 0.68, h * 0.02);
  ctx.stroke();
  ctx.lineWidth = S * 0.01;
  for (let k = 0; k < 7; k++) {
    const t = k / 6;
    ctx.beginPath();
    ctx.moveTo(w * (0.9 - t * 0.22), h * (0.62 - t * 0.6));
    ctx.lineTo(w * (0.9 - t * 0.22), h * (0.62 - t * 0.6) + h * 0.2 * (1 - t * 0.5));
    ctx.stroke();
  }
  place(ctx, X(-0.08), Y(0.36), 0, () => K.sneakers(ctx, S * 0.2, '#f6f5f2', '#3ee3a6'));
};

A.dance = (ctx, w, h, r) => {
  const { S, X, Y } = U(w, h);
  fillAll(ctx, w, h, vgrad(ctx, 0, h, [[0, '#120a2e'], [0.7, '#1d1146'], [1, '#2a1650']]));
  ctx.globalCompositeOperation = 'lighter';
  [['#ff4fa3', -0.6], ['#3a7bff', 0.55], ['#3ee3a6', 0.05]].forEach(([c, x]) => {
    ctx.fillStyle = lin(ctx, X(0), Y(-0.5), X(x), Y(0.5), [[0, c, 0.5], [1, c, 0]]);
    ctx.beginPath();
    ctx.moveTo(X(0), Y(-0.28));
    ctx.lineTo(X(x - 0.12), Y(0.6));
    ctx.lineTo(X(x + 0.12), Y(0.6));
    ctx.fill();
  });
  for (let i = 0; i < 60; i++) glow(ctx, r() * w, r() * h, S * rand(r, 0.01, 0.03), pick3(r), rand(r, 0.4, 0.9));
  ctx.globalCompositeOperation = 'source-over';
  place(ctx, X(0), Y(-0.2), 0, () => K.discoBall(ctx, S * 0.2, r));
  ctx.fillStyle = vgrad(ctx, Y(0.32), h, [[0, '#2a1650'], [1, '#0d0820']]);
  ctx.fillRect(0, Y(0.32), w, h);
  place(ctx, X(0.44), Y(0.4), -0.2, () => K.sneakers(ctx, S * 0.18, '#f6f5f2', '#ff4fa3'));
};
function pick3(r) {
  return ['#ff4fa3', '#3a7bff', '#3ee3a6', '#ffd166', '#ffffff'][Math.floor(r() * 5)];
}

A.recipe = (ctx, w, h, r) => {
  surface(ctx, w, h, r, 'oak');
  const { S, X, Y } = U(w, h);
  place(ctx, X(-0.08), Y(0.04), -0.05, () =>
    K.card(ctx, S * 0.66, S * 0.5, '#fbf6ea', (c, cw, ch) => {
      c.fillStyle = 'rgba(226,82,63,0.85)';
      c.fillRect(0, ch * 0.2, cw, 2);
      hand(c, "Teta's lentil soup", cw * 0.08, ch * 0.11, ch * 0.1, '#1f2430', 'left', 700);
      ['2 cups red lentils', '1 onion, a bit of cumin', 'lemon at the end (lots)', '"cook it until it smells right"'].forEach((t, i) => hand(c, t, cw * 0.08, ch * (0.33 + i * 0.15), ch * 0.075, '#2f3542'));
    }),
  );
  place(ctx, X(0.52), Y(0.0), 1.45, () => K.spoonWood(ctx, S * 0.62, r));
  place(ctx, X(0.42), Y(-0.33), 0.3, () => K.egg(ctx, S * 0.16));
  place(ctx, X(0.6), Y(-0.28), -0.2, () => K.egg(ctx, S * 0.16, '#e8c9a0'));
  place(ctx, X(-0.6), Y(-0.28), 0, () => K.bowlTop(ctx, S * 0.18, '#f4f1ec', (c, R) => {
    disc(c, 0, 0, R, '#f6f2ea');
    glow(c, -R * 0.2, -R * 0.2, R, '#ffffff', 0.6);
  }));
  place(ctx, X(-0.6), Y(0.32), 0.6, () => K.pen(ctx, S * 0.4, '#e2523f'));
};

A.macro = (ctx, w, h, r) => {
  fillAll(ctx, w, h, '#26421f');
  const { S, X, Y } = U(w, h);
  place(ctx, X(-0.2), Y(0.02), -0.5, () => K.bigLeaf(ctx, 0, 0, S * 1.5, S * 0.36, 0, '#4f8f3a'));
  place(ctx, X(0.32), Y(0.02), 0.12, () =>
    K.phone(ctx, S * 0.4, (c, sw, sh) => {
      fillAll(c, sw, sh, '#2f5a26');
      c.save();
      c.translate(sw * 0.5, sh * 0.45);
      c.rotate(-0.5);
      K.bigLeaf(c, 0, 0, sw * 6, sw * 1.45, 0, '#5aa04a');
      c.restore();
      disc(c, sw / 2, sh * 0.88, sw * 0.12, '#ffffff');
      disc(c, sw / 2, sh * 0.88, sw * 0.09, '#2f5a26');
      c.fillStyle = '#ffd166';
      c.font = `700 ${Math.round(sw * 0.08)}px system-ui, sans-serif`;
      c.textAlign = 'center';
      c.fillText('MACRO 5x', sw / 2, sh * 0.1);
    }),
  );
};

A.blindcontour = (ctx, w, h, r) => {
  surface(ctx, w, h, r, 'linen');
  const { S, X, Y } = U(w, h);
  place(ctx, X(-0.08), Y(0.02), -0.04, () =>
    K.card(ctx, S * 0.62, S * 0.84, '#fdfcf8', (c, cw, ch) => {
      c.save();
      c.translate(cw * 0.08, ch * 0.06);
      O.faceLine(c, cw * 0.84, ch * 0.82);
      c.restore();
      hand(c, 'no peeking!', cw * 0.66, ch * 0.94, ch * 0.05, '#e2523f', 'center', 700);
    }),
  );
  place(ctx, X(0.48), Y(0.12), 1.2, () => K.pen(ctx, S * 0.5, '#1f2430'));
  place(ctx, X(0.5), Y(-0.28), 0, () => K.mugTop(ctx, S * 0.12, '#f4f1ec', 'latte', r));
};

A.planes = (ctx, w, h, r) => {
  surface(ctx, w, h, r, 'concrete');
  const { S, X, Y } = U(w, h);
  [['#ffffff', 'dart', -0.45, -0.08, -0.2], ['#bcd2ff', 'glider', 0, -0.14, 0.05], ['#ffd6e0', 'mine', 0.45, -0.06, 0.25]].forEach(([c, label, x, y, a]) => {
    place(ctx, X(x), Y(y), a, () => K.paperPlane(ctx, S * 0.42, c));
    hand(ctx, label, X(x), Y(y + 0.26), S * 0.06, '#1f2430', 'center', 700);
  });
  place(ctx, X(0.08), Y(0.4), 0.02, () => K.measureTape(ctx, S * 1.1));
};

A.regrow = (ctx, w, h, r) => {
  room(ctx, w, h, r, '#f3efe6', '#f6f3ee', 0.7);
  const { S, X, Y } = U(w, h);
  ctx.fillStyle = 'rgba(255,248,225,0.6)';
  ctx.beginPath();
  ctx.moveTo(w * 0.05, 0);
  ctx.lineTo(w * 0.45, 0);
  ctx.lineTo(w * 0.62, h * 0.7);
  ctx.lineTo(w * 0.22, h * 0.7);
  ctx.fill();
  const jarAt = (x, n, hgt) => {
    const base = Y(0.36);
    place(ctx, X(x), base - S * 0.16, 0, () =>
      K.jar(ctx, S * 0.24, S * 0.32, (c, W, H) => {
        c.fillStyle = 'rgba(150,200,230,0.35)';
        c.fillRect(-W / 2, H * 0.05, W, H);
        for (let i = 0; i < n; i++) {
          const xx = -W * 0.25 + (i / Math.max(1, n - 1)) * W * 0.5;
          ellipse(c, xx, H * 0.32, W * 0.07, H * 0.1, 0, '#f6f2e6');
          c.strokeStyle = '#e8e2cf';
          c.lineWidth = 1;
          for (let k = 0; k < 5; k++) {
            c.beginPath();
            c.moveTo(xx, H * 0.42);
            c.lineTo(xx + (k - 2) * W * 0.03, H * 0.5);
            c.stroke();
          }
        }
      }, null),
    );
    for (let i = 0; i < n; i++) {
      const xx = X(x) - S * 0.06 + (i / Math.max(1, n - 1)) * S * 0.12;
      const top = base - S * 0.2 - S * hgt * rand(r, 0.8, 1);
      ctx.strokeStyle = lin(ctx, 0, top, 0, base, [[0, '#4f9a3c'], [0.7, '#7cc35a'], [1, '#e8f0d0']]);
      ctx.lineWidth = S * 0.018;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(xx, base - S * 0.12);
      ctx.quadraticCurveTo(xx + rand(r, -0.04, 0.04) * S, (top + base) / 2, xx + rand(r, -0.06, 0.06) * S, top);
      ctx.stroke();
    }
  };
  jarAt(-0.12, 4, 0.48);
  jarAt(0.3, 3, 0.3);
  place(ctx, X(-0.55), Y(0.36), 0, () => O.plant(ctx, 0, 0, S * 0.12, r));
};

A.map = (ctx, w, h, r) => {
  surface(ctx, w, h, r, 'oak');
  const { S, X, Y } = U(w, h);
  place(ctx, X(-0.06), Y(0.02), -0.03, () =>
    K.card(ctx, S * 1.0, S * 0.76, '#fbf7ec', (c, cw, ch) => {
      const pl = (pts, wd = 2, col = 'rgba(60,60,70,0.75)') => K.pencilLine(c, pts.map(([x, y]) => [x * cw, y * ch]), wd, col, r);
      ellipse(c, cw * 0.72, ch * 0.3, cw * 0.14, ch * 0.13, 0.3, 'rgba(120,190,100,0.35)');
      pl([[0.05, 0.55], [0.3, 0.5], [0.55, 0.56], [0.95, 0.5]], 3);
      pl([[0.05, 0.62], [0.3, 0.57], [0.55, 0.63], [0.95, 0.57]], 3);
      pl([[0.35, 0.05], [0.37, 0.95]], 3);
      pl([[0.42, 0.05], [0.44, 0.95]], 3);
      pl([[0.6, 0.6], [0.65, 0.9]], 2);
      c.strokeStyle = 'rgba(80,150,220,0.6)';
      c.lineWidth = cw * 0.02;
      c.beginPath();
      c.moveTo(cw * 0.05, ch * 0.88);
      c.bezierCurveTo(cw * 0.3, ch * 0.75, cw * 0.6, ch * 0.98, cw * 0.95, ch * 0.82);
      c.stroke();
      c.strokeStyle = '#e2523f';
      c.lineWidth = 2.5;
      c.setLineDash([6, 5]);
      O.smooth(c, [[0.2, 0.75], [0.25, 0.53], [0.4, 0.4], [0.62, 0.35], [0.7, 0.53], [0.52, 0.72], [0.3, 0.78], [0.2, 0.75]].map(([x, y]) => [x * cw, y * ch]));
      c.stroke();
      c.setLineDash([]);
      [['bakery', 0.18, 0.3], ['cat on wall!', 0.62, 0.7], ['big tree', 0.72, 0.16], ['home', 0.12, 0.84]].forEach(([t, x, y]) => hand(c, t, x * cw, y * ch, ch * 0.065, '#1f2430', 'left', 700));
      K.pinMarker(c, cw * 0.2, ch * 0.75, ch * 0.08, '#e2523f');
      K.pinMarker(c, cw * 0.62, ch * 0.62, ch * 0.07, '#2b59ff');
    }),
  );
  place(ctx, X(0.6), Y(0.36), 0.9, () => K.pen(ctx, S * 0.4, '#2b59ff'));
};

A.tenwords = (ctx, w, h, r) => {
  surface(ctx, w, h, r, 'linen');
  const { S, X, Y } = U(w, h);
  place(ctx, X(-0.06), Y(0.03), 0.02, () =>
    K.notebookOpen(
      ctx,
      S * 1.0,
      S * 0.66,
      (c, pw, ph) => {
        hand(c, 'Spanish, day 1', pw * 0.1, ph * 0.1, ph * 0.07, '#1f2430', 'left', 700);
        [['hello', 'hola'], ['thanks', 'gracias'], ['water', 'agua'], ['friend', 'amigo/a'], ['cat', 'gato']].forEach(([a, b], i) => {
          hand(c, a, pw * 0.1, ph * (0.24 + i * 0.13), ph * 0.06, '#5a6070');
          hand(c, b, pw * 0.5, ph * (0.24 + i * 0.13), ph * 0.07, '#2b59ff', 'left', 700);
        });
      },
      (c, pw, ph) => {
        [['good morning', 'buenos días'], ['please', 'por favor'], ['see you', 'hasta luego'], ['delicious', 'rico'], ['beach', 'playa']].forEach(([a, b], i) => {
          hand(c, a, pw * 0.07, ph * (0.24 + i * 0.13), ph * 0.055, '#5a6070', 'left', 600, pw * 0.42);
          hand(c, b, pw * 0.54, ph * (0.24 + i * 0.13), ph * 0.065, '#2b59ff', 'left', 700, pw * 0.42);
        });
      },
      '#e2523f',
    ),
  );
  place(ctx, X(0.6), Y(-0.28), 0.15, () => K.sticky(ctx, S * 0.22, '#ffe27a', (c, s) => hand(c, '¡hola!', s / 2, s / 2, s * 0.24, '#1f2430', 'center', 700)));
  place(ctx, X(0.6), Y(0.3), 1.4, () => K.pen(ctx, S * 0.42, '#0b1433'));
};

A.note = (ctx, w, h, r) => {
  surface(ctx, w, h, r, '#f2dfd7');
  const { S, X, Y } = U(w, h);
  place(ctx, X(0.32), Y(0.1), 0.1, () => K.envelope(ctx, S * 0.56, '#e9d3b5'));
  place(ctx, X(-0.2), Y(-0.02), -0.06, () =>
    K.card(ctx, S * 0.6, S * 0.44, '#fffdf8', (c, cw, ch) => {
      hand(c, 'Hi Sam,', cw * 0.1, ch * 0.18, ch * 0.11, '#1f2430', 'left', 700);
      hand(c, 'thank you for helping me', cw * 0.1, ch * 0.38, ch * 0.09, '#2f3542');
      hand(c, 'study on Tuesday. It really', cw * 0.1, ch * 0.54, ch * 0.09, '#2f3542');
      hand(c, 'made my week :)', cw * 0.1, ch * 0.7, ch * 0.09, '#2f3542');
      hand(c, '- Lina', cw * 0.62, ch * 0.86, ch * 0.09, '#2b59ff', 'left', 700);
    }),
  );
  place(ctx, X(-0.58), Y(0.3), -0.6, () => O.daisy(ctx, S * 0.22));
  place(ctx, X(0.62), Y(-0.32), 1.0, () => K.pen(ctx, S * 0.38, '#e2523f'));
};

A.breathing = (ctx, w, h, r) => {
  ctx.drawImage(mini('sea', 12, w, h), 0, 0, w, h);
  const { S, X, Y } = U(w, h);
  fillAll(ctx, w, h, 'rgba(10,18,48,0.18)');
  const s = S * 0.5;
  ctx.strokeStyle = 'rgba(255,255,255,0.85)';
  ctx.lineWidth = Math.max(2, S * 0.008);
  rr(ctx, X(0) - s / 2, Y(0) - s / 2, s, s, s * 0.12);
  ctx.stroke();
  disc(ctx, X(0) + s / 2, Y(0) - s * 0.15, S * 0.022, '#3ee3a6');
  glow(ctx, X(0) + s / 2, Y(0) - s * 0.15, S * 0.06, '#3ee3a6', 0.6);
  const f = S * 0.06;
  hand(ctx, 'breathe in · 4', X(0), Y(0) - s / 2 - f * 0.9, f, '#ffffff', 'center', 700);
  hand(ctx, 'out · 4', X(0), Y(0) + s / 2 + f * 0.9, f, '#ffffff', 'center', 700);
  hand(ctx, 'hold', X(0) - s / 2 - f * 1.4, Y(0), f, '#ffffff', 'center', 700);
  hand(ctx, 'hold', X(0) + s / 2 + f * 1.4, Y(0), f, '#ffffff', 'center', 700);
};

A.stretch = (ctx, w, h, r) => {
  surface(ctx, w, h, r, 'oak');
  const { S, X, Y } = U(w, h);
  place(ctx, X(-0.05), Y(0.02), 0.1, () => K.mat(ctx, S * 1.6, S * 0.62, '#5fb7a0'));
  place(ctx, X(0.3), Y(-0.04), 0.2, () => O.foamBlock(ctx, S * 0.32, S * 0.2, '#b7a6ff'));
  place(ctx, X(-0.35), Y(0.06), -0.1, () => K.matRoll(ctx, S * 0.42, S * 0.12, '#f2efe8'));
  place(ctx, X(0.56), Y(0.28), 0, () => O.plantTop(ctx, S * 0.1, r));
  place(ctx, X(-0.52), Y(-0.3), 0.3, () => K.waterBottle(ctx, S * 0.3, '#2b59ff'));
};

A.zine = (ctx, w, h, r) => {
  surface(ctx, w, h, r, '#f3c9b6');
  const { S, X, Y } = U(w, h);
  const book = (title, color, sub) => () =>
    K.card(ctx, S * 0.3, S * 0.4, color, (cc, cw, ch) => {
      cc.fillStyle = '#1f2430';
      cc.font = `900 ${Math.round(ch * 0.14)}px system-ui, sans-serif`;
      cc.textAlign = 'center';
      cc.fillText(title, cw / 2, ch * 0.32);
      hand(cc, sub, cw / 2, ch * 0.48, ch * 0.08, '#1f2430', 'center', 700);
      O.inkLine(cc, [[cw * 0.25, ch * 0.78], [cw * 0.4, ch * 0.62], [cw * 0.55, ch * 0.78], [cw * 0.7, ch * 0.64]], 2.5);
    });
  place(ctx, X(-0.36), Y(-0.06), -0.12, book('MY STREET', '#ffe27a', 'issue #1'));
  place(ctx, X(0.0), Y(0.04), 0.05, book('SNACKS', '#bcd2ff', 'a ranking'));
  place(ctx, X(0.36), Y(-0.08), 0.14, book('CATS', '#d9f5e8', 'of my block'));
  place(ctx, X(-0.6), Y(0.34), 0.2, () => K.marker(ctx, S * 0.32, '#2b59ff'));
  place(ctx, X(-0.36), Y(0.4), -0.1, () => K.marker(ctx, S * 0.32, '#e2523f'));
  place(ctx, X(0.52), Y(0.34), -0.4, () => K.scissors(ctx, S * 0.32, '#1f2430'));
};

A.glowup = (ctx, w, h, r) => {
  room(ctx, w, h, r, '#dfe7e2', '#d8c3a5', 0.68);
  const { S, X, Y } = U(w, h);
  const base = Y(0.3);
  place(ctx, X(0.0), Y(-0.24), 0, () => O.frame(ctx, S * 0.36, S * 0.26, mini('peaks', 3, 200, 140)));
  place(ctx, X(-0.42), base, 0, () => O.lampSide(ctx, S * 0.42));
  ctx.save();
  ctx.translate(X(0.05), base);
  O.bookStackSide(ctx, S * 0.32, r, ['#2f4f6f', '#e2523f', '#f2cc8f']);
  ctx.restore();
  place(ctx, X(0.42), base, 0, () => O.plant(ctx, 0, 0, S * 0.16, r));
};

A.concert = (ctx, w, h, r) => {
  ctx.drawImage(mini('guitar', 5, w, h), 0, 0, w, h);
  const { S, X, Y } = U(w, h);
  place(ctx, X(0.5), Y(-0.26), 0.08, () =>
    K.sticky(ctx, S * 0.3, '#ffe27a', (c, s) => {
      hand(c, 'Tiny concert', s / 2, s * 0.3, s * 0.15, '#1f2430', 'center', 700);
      hand(c, 'tonight, 7pm', s / 2, s * 0.52, s * 0.13, '#1f2430', 'center');
      hand(c, 'audience: 1', s / 2, s * 0.74, s * 0.13, '#e2523f', 'center', 700);
    }),
  );
};

A.percussion = (ctx, w, h, r) => {
  surface(ctx, w, h, r, 'tiles');
  const { S, X, Y } = U(w, h);
  place(ctx, X(-0.3), Y(-0.04), 0, () => K.pot(ctx, S * 0.28));
  place(ctx, X(0.3), Y(0.06), 0, () => K.pot(ctx, S * 0.22, '#e2523f'));
  place(ctx, X(0.04), Y(0.34), -0.2, () => K.spoonWood(ctx, S * 0.6, r));
  place(ctx, X(0.06), Y(0.24), 0.15, () => K.spoonWood(ctx, S * 0.6, r));
  place(ctx, X(0.58), Y(-0.28), 0, () => {
    drop(ctx, S * 0.05, () => disc(ctx, 0, 0, S * 0.15, '#c9ccd3'), 0.32);
    disc(ctx, 0, 0, S * 0.15, lin(ctx, -S * 0.15, -S * 0.15, S * 0.15, S * 0.15, [[0, '#ffffff'], [1, '#8a909b']]));
    disc(ctx, 0, 0, S * 0.12, lin(ctx, S * 0.12, S * 0.12, -S * 0.12, -S * 0.12, [[0, '#f2f3f5'], [1, '#a9aeb8']]));
    drop(ctx, S * 0.02, () => disc(ctx, 0, 0, S * 0.035, '#2a2d33'), 0.3);
  });
  place(ctx, X(-0.46), Y(0.36), -0.05, () => K.tagLabel(ctx, 'band: The Lids', S * 0.055));
};

A.skywatch = (ctx, w, h, r) => {
  surface(ctx, w, h, r, 'slate');
  const { S, X, Y } = U(w, h);
  const skies = [
    ['#5aa0e8', '#cfe6ff', 0.2], ['#6a8fe0', '#f6d3b0', 0.35], ['#6a6fc9', '#ffb38a', 0.5], ['#4e4a9c', '#ff8f6b', 0.7], ['#2b2a63', '#f06a6a', 0.9],
  ];
  const fw = S * 0.22;
  const fh = S * 0.38;
  skies.forEach(([a, b, sun], i) => {
    const x = X(-0.56 + i * 0.28);
    place(ctx, x, Y(-0.04), (i - 2) * 0.03, () => {
      drop(ctx, S * 0.03, () => {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-fw / 2 - 4, -fh / 2 - 4, fw + 8, fh + 22);
      }, 0.35);
      ctx.fillStyle = '#fbfaf6';
      ctx.fillRect(-fw / 2 - 4, -fh / 2 - 4, fw + 8, fh + 22);
      ctx.fillStyle = vgrad(ctx, -fh / 2, fh / 2, [[0, a], [1, b]]);
      ctx.fillRect(-fw / 2, -fh / 2, fw, fh);
      glow(ctx, 0, -fh / 2 + fh * sun, fw * 0.6, '#fff3d1', 0.5);
      disc(ctx, 0, -fh / 2 + fh * sun, fw * 0.1, '#fff3d1');
      ctx.fillStyle = 'rgba(10,15,30,0.85)';
      ctx.fillRect(-fw / 2, fh * 0.3, fw, fh * 0.2);
      hand(ctx, `5:0${i * 2}`, 0, fh / 2 + 10, 12 * (S / 440), '#1f2430', 'center', 700);
    });
  });
};

A.games = (ctx, w, h, r) => {
  surface(ctx, w, h, r, 'walnut');
  const { S, X, Y } = U(w, h);
  place(ctx, X(-0.22), Y(0.02), -0.1, () => K.checkerboard(ctx, S * 0.78));
  [['A', 'heart', -0.25], ['7', 'spade', 0], ['K', 'diamond', 0.25]].forEach(([rk, k, a], i) =>
    place(ctx, X(0.5 + i * 0.06), Y(-0.18 + i * 0.02), a, () => K.playingCard(ctx, S * 0.2, rk, k)),
  );
  place(ctx, X(0.42), Y(0.3), 0.3, () => K.dice(ctx, S * 0.11, 5));
  place(ctx, X(0.6), Y(0.26), -0.4, () => K.dice(ctx, S * 0.11, 3, '#e2523f', '#ffffff'));
};

A.colorwheel = (ctx, w, h, r) => {
  surface(ctx, w, h, r, '#efe9e1');
  const { S, X, Y } = U(w, h);
  place(ctx, X(-0.34), Y(-0.02), 0, () => {
    K.colorWheel(ctx, S * 0.34);
    ctx.strokeStyle = '#1f2430';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([6, 5]);
    ctx.beginPath();
    ctx.moveTo(Math.cos(-Math.PI / 2 + (7.5 / 12) * TAU) * S * 0.3, Math.sin(-Math.PI / 2 + (7.5 / 12) * TAU) * S * 0.3);
    ctx.lineTo(Math.cos(-Math.PI / 2 + (1.5 / 12) * TAU) * S * 0.3, Math.sin(-Math.PI / 2 + (1.5 / 12) * TAU) * S * 0.3);
    ctx.stroke();
    ctx.setLineDash([]);
  });
  place(ctx, X(0.18), Y(-0.18), -0.1, () => K.swatch(ctx, S * 0.24, '#2b59ff', r));
  place(ctx, X(0.46), Y(-0.16), 0.12, () => K.swatch(ctx, S * 0.24, '#f28c28', r));
  place(ctx, X(0.18), Y(0.2), 0.08, () => K.swatch(ctx, S * 0.2, '#8e5cd9', r));
  place(ctx, X(0.42), Y(0.22), -0.06, () => K.swatch(ctx, S * 0.2, '#f6cf3a', r));
  hand(ctx, 'opposites!', X(0.32), Y(0.01), S * 0.07, '#1f2430', 'center', 700);
};

A.swap = (ctx, w, h, r) => {
  surface(ctx, w, h, r, '#e3eaf3');
  const { S, X, Y } = U(w, h);
  place(ctx, X(-0.36), Y(0.02), -0.06, () => K.tshirt(ctx, S * 0.56, '#f4efe6', 'rgba(43,89,255,0.85)'));
  place(ctx, X(0.36), Y(0.04), 0.06, () => K.tshirt(ctx, S * 0.56, '#e2523f'));
  ctx.strokeStyle = '#1f2430';
  ctx.lineWidth = S * 0.012;
  ctx.lineCap = 'round';
  const arrow = (y, dir) => {
    ctx.beginPath();
    ctx.moveTo(X(-0.1 * dir), Y(y));
    ctx.quadraticCurveTo(X(0), Y(y - 0.08 * dir), X(0.1 * dir), Y(y));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(0.1 * dir), Y(y));
    ctx.lineTo(X(0.06 * dir), Y(y - 0.04));
    ctx.moveTo(X(0.1 * dir), Y(y));
    ctx.lineTo(X(0.05 * dir), Y(y + 0.02));
    ctx.stroke();
  };
  arrow(-0.12, 1);
  arrow(0.16, -1);
  place(ctx, X(0), Y(0.02), -0.06, () => K.tagLabel(ctx, 'swap', S * 0.065));
};

A.rubbings = (ctx, w, h, r) => {
  surface(ctx, w, h, r, 'oak');
  const { S, X, Y } = U(w, h);
  place(ctx, X(-0.12), Y(0.02), -0.03, () =>
    K.card(ctx, S * 0.84, S * 0.66, '#fdfbf6', (c, cw, ch) => {
      [['#4caf50', 0.25, 0.4, -0.5], ['#f28c28', 0.58, 0.35, 0.4], ['#8e5cd9', 0.42, 0.72, -1.2], ['#e23b3b', 0.78, 0.7, 0.9]].forEach(([col, x, y, a]) => {
        c.save();
        c.translate(x * cw, y * ch);
        c.rotate(a);
        const L = ch * 0.5;
        c.beginPath();
        c.moveTo(-L / 2, 0);
        c.bezierCurveTo(-L * 0.2, -L * 0.24, L * 0.25, -L * 0.22, L / 2, 0);
        c.bezierCurveTo(L * 0.25, L * 0.22, -L * 0.2, L * 0.24, -L / 2, 0);
        c.clip();
        c.strokeStyle = css(col, 0.35);
        c.lineWidth = 2;
        for (let k = -L; k < L; k += 3.5) {
          c.beginPath();
          c.moveTo(k, -L);
          c.lineTo(k + L * 0.3, L);
          c.stroke();
        }
        c.strokeStyle = css(mix(col, '#000000', 0.2), 0.85);
        c.lineWidth = 2.2;
        c.beginPath();
        c.moveTo(-L / 2, 0);
        c.lineTo(L / 2, 0);
        for (let v = 1; v < 7; v++) {
          const px = -L / 2 + (v / 7) * L;
          c.moveTo(px, 0);
          c.lineTo(px + L * 0.1, -L * 0.15);
          c.moveTo(px, 0);
          c.lineTo(px + L * 0.1, L * 0.15);
        }
        c.stroke();
        c.restore();
      });
    }),
  );
  ['#4caf50', '#f28c28', '#8e5cd9', '#e23b3b'].forEach((c, i) => place(ctx, X(0.52 + (i % 2) * 0.1), Y(-0.28 + i * 0.12), 0.4, () => K.crayon(ctx, S * 0.24, c)));
  place(ctx, X(0.6), Y(0.36), 1.2, () => K.bigLeaf(ctx, 0, 0, S * 0.26, S * 0.07, 0, '#5a8f3a'));
};

A.shadows = (ctx, w, h, r) => {
  room(ctx, w, h, r, '#3a4150', '#2a2f3a', 0.7);
  const { S, X, Y } = U(w, h);
  glow(ctx, X(-0.3), Y(-0.05), S * 0.9, '#ffe7b0', 0.45);
  const base = Y(0.26);
  const shapes = [
    (c, sc) => {
      c.beginPath();
      c.moveTo(-sc * 0.06, 0);
      c.quadraticCurveTo(-sc * 0.12, -sc * 0.2, -sc * 0.04, -sc * 0.32);
      c.lineTo(-sc * 0.03, -sc * 0.42);
      c.lineTo(sc * 0.03, -sc * 0.42);
      c.lineTo(sc * 0.04, -sc * 0.32);
      c.quadraticCurveTo(sc * 0.12, -sc * 0.2, sc * 0.06, 0);
      c.closePath();
    },
    (c, sc) => {
      c.beginPath();
      c.rect(-sc * 0.06, -sc * 0.12, sc * 0.12, sc * 0.12);
      c.moveTo(0, -sc * 0.12);
      c.ellipse(0, -sc * 0.24, sc * 0.05, sc * 0.13, 0, 0, TAU);
      c.ellipse(-sc * 0.07, -sc * 0.24, sc * 0.03, sc * 0.07, -0.6, 0, TAU);
      c.ellipse(sc * 0.07, -sc * 0.2, sc * 0.03, sc * 0.07, 0.6, 0, TAU);
    },
    (c, sc) => {
      c.beginPath();
      c.rect(-sc * 0.07, -sc * 0.2, sc * 0.14, sc * 0.2);
      c.rect(-sc * 0.05, -sc * 0.32, sc * 0.1, sc * 0.1);
      c.rect(-sc * 0.11, -sc * 0.18, sc * 0.04, sc * 0.1);
      c.rect(sc * 0.07, -sc * 0.18, sc * 0.04, sc * 0.1);
    },
  ];
  [[-0.1, '#d9e6f2', 0], [0.12, '#5fb7a0', 1], [0.32, '#e8b923', 2]].forEach(([x, col, k]) => {
    ctx.save();
    ctx.translate(X(x) + S * 0.18, base);
    ctx.transform(1, 0, -0.5, 1, 0, 0);
    ctx.scale(1.9, 1.5);
    ctx.filter = 'blur(2px)';
    shapes[k](ctx, S);
    ctx.fillStyle = 'rgba(8,10,16,0.55)';
    ctx.fill();
    ctx.restore();
  });
  [[-0.1, '#d9e6f2', 0], [0.12, '#5fb7a0', 1], [0.32, '#e8b923', 2]].forEach(([x, col, k]) => {
    ctx.save();
    ctx.translate(X(x), base);
    shapes[k](ctx, S);
    ctx.fillStyle = lin(ctx, -S * 0.1, 0, S * 0.1, 0, [[0, mix(col, '#ffffff', 0.35)], [1, mix(col, '#000000', 0.35)]]);
    ctx.fill();
    ctx.restore();
  });
  place(ctx, X(-0.62), Y(0.1), 0.6, () => {
    ctx.fillStyle = '#1b1e26';
    rr(ctx, -S * 0.1, -S * 0.07, S * 0.2, S * 0.14, S * 0.03);
    ctx.fill();
    glow(ctx, S * 0.12, 0, S * 0.18, '#fff3cf', 0.95);
    disc(ctx, S * 0.1, 0, S * 0.04, '#fffbe8');
  });
};

A.questionjar = (ctx, w, h, r) => {
  room(ctx, w, h, r, '#d9eee5', '#e9dccb', 0.7);
  const { S, X, Y } = U(w, h);
  const base = Y(0.3);
  place(ctx, X(-0.08), base - S * 0.24, 0, () =>
    K.jar(ctx, S * 0.36, S * 0.48, (c, W, H) => {
      const cols = ['#ffe27a', '#bcd2ff', '#ffd6e0', '#d9f5e8', '#ffffff'];
      for (let i = 0; i < 46; i++) {
        const x = rand(r, -0.42, 0.42) * W;
        const y = H / 2 - Math.pow(r(), 0.7) * H * 0.62;
        place(c, x, y, rand(r, -1, 1), () => {
          c.fillStyle = cols[i % cols.length];
          c.fillRect(-W * 0.1, -W * 0.04, W * 0.2, W * 0.08);
          c.fillStyle = 'rgba(0,0,0,0.08)';
          c.fillRect(-W * 0.1, 0, W * 0.2, W * 0.015);
        });
      }
    }, '#e8b923'),
  );
  place(ctx, X(-0.08), base - S * 0.26, -0.05, () => K.tagLabel(ctx, 'questions', S * 0.05));
  place(ctx, X(0.38), Y(0.38), 0.05, () =>
    K.card(ctx, S * 0.5, S * 0.15, '#fffdf7', (c, cw, ch) => hand(c, 'What skill would you learn instantly?', cw / 2, ch / 2, ch * 0.3, '#1f2430', 'center', 700, cw * 0.9)),
  );
  place(ctx, X(-0.52), Y(0.42), -0.2, () => K.card(ctx, S * 0.14, S * 0.07, '#ffe27a', (c, cw, ch) => hand(c, '?', cw / 2, ch / 2, ch * 0.7, '#1f2430', 'center', 700)));
};

A.rabbithole = (ctx, w, h, r) => {
  surface(ctx, w, h, r, 'walnut');
  const { S, X, Y } = U(w, h);
  place(ctx, X(-0.06), Y(0.04), 0.02, () =>
    K.bookOpen(ctx, S * 1.0, r, (c, pw, ph) => {
      place(c, pw * 0.5, ph * 0.5, 0, () => O.octopus(c, ph * 0.62, '#2f3542'));
      hand(c, 'Octopus vulgaris', pw * 0.5, ph * 0.9, ph * 0.05, '#5a6070', 'center');
    }),
  );
  place(ctx, X(0.52), Y(-0.26), 0.1, () =>
    K.sticky(ctx, S * 0.24, '#ffe27a', (c, s) => {
      hand(c, '3 hearts!', s / 2, s * 0.36, s * 0.17, '#1f2430', 'center', 700);
      hand(c, 'blue blood', s / 2, s * 0.64, s * 0.15, '#2b59ff', 'center', 700);
    }),
  );
  place(ctx, X(-0.6), Y(-0.28), -0.15, () => K.sticky(ctx, S * 0.2, '#bcd2ff', (c, s) => hand(c, 'fact #4', s / 2, s / 2, s * 0.2, '#1f2430', 'center', 700)));
  place(ctx, X(0.6), Y(0.28), 1.2, () => K.pencil(ctx, S * 0.42, '#f2c14e', r));
};

A.balance = (ctx, w, h, r) => {
  const { S, X, Y } = U(w, h);
  fillAll(ctx, w, h, vgrad(ctx, 0, h, [[0, '#cfe3f2'], [0.45, '#eaf2f4'], [0.5, '#9fc4d6'], [0.62, '#d9c6a6'], [1, '#bfa47c']]));
  glow(ctx, X(0.3), Y(-0.3), S * 0.6, '#ffffff', 0.5);
  speckle(ctx, w, h, r, 1800, 0.05);
  let y = Y(0.36);
  [[0.34, '#8f8a82'], [0.27, '#a59e93'], [0.22, '#7f7a73'], [0.16, '#b3aca1'], [0.11, '#958e84'], [0.07, '#a7a196']].forEach(([s, c], i) => {
    const sw = S * s;
    const sh = sw * 0.42;
    const x = X(0) + rand(r, -0.02, 0.02) * S;
    if (i === 0) ellipse(ctx, x + S * 0.04, y + sh * 0.3, sw * 0.65, sh * 0.25, 0, 'rgba(60,40,20,0.25)');
    const g = ctx.createRadialGradient(x - sw * 0.2, y - sh * 0.8, sw * 0.05, x, y - sh / 2, sw * 0.6);
    g.addColorStop(0, css(mix(c, '#ffffff', 0.35)));
    g.addColorStop(1, css(mix(c, '#000000', 0.3)));
    ellipse(ctx, x, y - sh / 2, sw / 2, sh / 2, rand(r, -0.06, 0.06), g);
    y -= sh * 0.88;
  });
};
function speckle(ctx, w, h, r, n, a) {
  K.speckle(ctx, w, h, r, n, a);
}

A.jump = (ctx, w, h, r) => {
  surface(ctx, w, h, r, 'court');
  const { S, X, Y } = U(w, h);
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.fillRect(0, Y(-0.38), w, S * 0.02);
  place(ctx, X(-0.08), Y(0.04), 0, () => K.jumpRope(ctx, S * 0.62, '#3ee3a6'));
  place(ctx, X(0.52), Y(-0.06), 0.3, () => K.sneakers(ctx, S * 0.3, '#1f2430', '#ff6f91'));
  place(ctx, X(-0.56), Y(0.28), -0.5, () => K.waterBottle(ctx, S * 0.36, '#ff6f91'));
  hand(ctx, 'round 3: ||||| ||||| |||', X(0.36), Y(0.36), S * 0.07, '#ffffff', 'center', 700);
};

A.energybites = (ctx, w, h, r) => {
  surface(ctx, w, h, r, 'marble');
  const { S, X, Y } = U(w, h);
  place(ctx, X(0.02), Y(0.04), 0, () => {
    K.plate(ctx, S * 0.36);
    [[0, 0], [-0.11, -0.08], [0.11, -0.07], [-0.1, 0.1], [0.1, 0.1], [0, -0.17], [0, 0.18]].forEach(([x, y]) => place(ctx, x * S, y * S, 0, () => K.energyBall(ctx, S * 0.1, r)));
  });
  place(ctx, X(-0.52), Y(-0.24), 0, () => K.bowlTop(ctx, S * 0.18, '#f4f1ec', (c, R) => K.oats(c, R, r)));
  place(ctx, X(0.56), Y(-0.24), 0, () => K.honeyJar(ctx, S * 0.12));
  place(ctx, X(0.5), Y(0.3), -0.4, () => K.spoonWood(ctx, S * 0.42, r));
  for (let i = 0; i < 20; i++) ellipse(ctx, X(rand(r, -0.7, -0.3)), Y(rand(r, 0.05, 0.45)), S * 0.012, S * 0.008, r() * TAU, '#e3cc9d');
};

A.stars = (ctx, w, h, r) => {
  const { S, X, Y } = U(w, h);
  fillAll(ctx, w, h, vgrad(ctx, 0, h, [[0, '#040817'], [0.7, '#0e1d3d'], [1, '#1a2f4f']]));
  for (let i = 0; i < 320; i++) {
    const s = Math.pow(r(), 3) * 2 + 0.4;
    ctx.fillStyle = `rgba(255,255,255,${rand(r, 0.25, 0.9)})`;
    ctx.fillRect(r() * w, r() * h * 0.8, s, s);
  }
  const dip = [[-0.45, -0.25], [-0.28, -0.3], [-0.12, -0.24], [0.02, -0.16], [0.07, 0.02], [0.3, 0.04], [0.32, -0.14]];
  ctx.strokeStyle = 'rgba(160,190,255,0.55)';
  ctx.lineWidth = Math.max(1.2, S * 0.004);
  ctx.beginPath();
  dip.forEach(([x, y], i) => (i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y))));
  ctx.lineTo(X(0.02), Y(-0.16));
  ctx.stroke();
  dip.forEach(([x, y]) => {
    glow(ctx, X(x), Y(y), S * 0.04, '#cfe0ff', 0.6);
    disc(ctx, X(x), Y(y), S * 0.008, '#ffffff');
  });
  hand(ctx, 'Big Dipper', X(-0.2), Y(-0.38), S * 0.06, 'rgba(220,230,255,0.85)', 'center', 700);
  ctx.fillStyle = '#05070f';
  ctx.beginPath();
  ctx.moveTo(0, h);
  for (let x = 0; x <= w; x += 6) ctx.lineTo(x, Y(0.32) - Math.sin(x * 0.006 + 1) * S * 0.06 - Math.sin(x * 0.017) * S * 0.02);
  ctx.lineTo(w, h);
  ctx.fill();
};

A.timecapsule = (ctx, w, h, r) => {
  surface(ctx, w, h, r, 'oak');
  const { S, X, Y } = U(w, h);
  place(ctx, X(-0.3), Y(0.02), -0.05, () => {
    drop(ctx, S * 0.06, () => {
      ctx.fillStyle = '#9aa0aa';
      rr(ctx, -S * 0.3, -S * 0.22, S * 0.6, S * 0.44, S * 0.05);
      ctx.fill();
    }, 0.35);
    ctx.fillStyle = lin(ctx, -S * 0.3, -S * 0.22, S * 0.3, S * 0.22, [[0, '#e6e9ee'], [1, '#8a909b']]);
    rr(ctx, -S * 0.3, -S * 0.22, S * 0.6, S * 0.44, S * 0.05);
    ctx.fill();
    ctx.fillStyle = '#5a606c';
    rr(ctx, -S * 0.27, -S * 0.19, S * 0.54, S * 0.38, S * 0.04);
    ctx.fill();
    [['forest', 3, -0.12, -0.04, -0.2], ['coffee', 7, 0.1, 0.03, 0.15]].forEach(([k, sd, x, y, a]) => place(ctx, x * S, y * S, a, () => K.polaroid(ctx, S * 0.2, k, sd, '', r)));
  });
  place(ctx, X(0.24), Y(-0.18), 0.12, () => K.polaroid(ctx, S * 0.26, 'city', 3, 'my street', r));
  place(ctx, X(0.52), Y(0.14), -0.1, () => K.polaroid(ctx, S * 0.26, 'books', 9, 'my desk', r));
  place(ctx, X(-0.3), Y(0.36), -0.04, () => K.tagLabel(ctx, 'open in 5 years', S * 0.06));
};

A.compliments = (ctx, w, h, r) => {
  const { S, X, Y } = U(w, h);
  fillAll(ctx, w, h, vgrad(ctx, 0, h, [[0, '#f3e8f6'], [1, '#e2d6ea']]));
  glow(ctx, X(-0.3), Y(-0.3), S, '#ffffff', 0.45);
  [['#ffe27a', 'You explain', 'things so well', -0.4, -0.1, -0.08], ['#bcd2ff', 'Your laugh is', 'the best one', 0.02, 0.06, 0.05], ['#ffd6e0', 'Thanks for', 'helping today', 0.44, -0.12, 0.1]].forEach(([c, a, b, x, y, rot]) =>
    place(ctx, X(x), Y(y), rot, () =>
      K.sticky(ctx, S * 0.34, c, (cc, s) => {
        hand(cc, a, s / 2, s * 0.38, s * 0.13, '#1f2430', 'center', 700);
        hand(cc, b, s / 2, s * 0.58, s * 0.13, '#1f2430', 'center', 700);
        cc.save();
        K.heartPath(cc, s * 0.5, s * 0.8, s * 0.09);
        cc.fillStyle = '#e2523f';
        cc.fill();
        cc.restore();
      }),
    ),
  );
};

A.plantcare = (ctx, w, h, r) => {
  room(ctx, w, h, r, '#eef0e6', '#f3efe8', 0.7);
  const { S, X, Y } = U(w, h);
  glow(ctx, X(0.4), Y(-0.4), S * 0.9, '#fff5d6', 0.5);
  const base = Y(0.34);
  place(ctx, X(-0.1), base, 0, () => O.plant(ctx, 0, 0, S * 0.24, r));
  place(ctx, X(-0.1), base - S * 0.08, 0, () => K.tagLabel(ctx, 'Basil', S * 0.045));
  place(ctx, X(0.38), base, 0, () => O.wateringCan(ctx, S * 0.36, '#5fb7a0'));
  place(ctx, X(-0.52), base + S * 0.04, 0, () => {
    drop(ctx, S * 0.04, () => {
      ctx.fillStyle = '#bcd2ff';
      rr(ctx, -S * 0.12, -S * 0.04, S * 0.24, S * 0.07, S * 0.02);
      ctx.fill();
    });
  });
};

A.windowpoem = (ctx, w, h, r) => {
  const { S, X, Y } = U(w, h);
  fillAll(ctx, w, h, '#efe8dc');
  const wx = X(-0.62);
  const wy = Y(-0.48);
  const ww = S * 1.24;
  const wh = S * 0.66;
  ctx.drawImage(mini('lake', 21, ww, wh), wx, wy, ww, wh);
  ctx.fillStyle = '#fbf8f2';
  const t = S * 0.03;
  ctx.fillRect(wx - t, wy - t, ww + t * 2, t);
  ctx.fillRect(wx - t, wy, t, wh);
  ctx.fillRect(wx + ww, wy, t, wh);
  ctx.fillRect(wx + ww / 2 - t / 2, wy, t, wh);
  ctx.fillRect(wx, wy + wh / 2 - t / 2, ww, t * 0.8);
  ctx.fillStyle = vgrad(ctx, wy + wh, wy + wh + S * 0.08, [[0, '#ffffff'], [1, '#d9d2c4']]);
  ctx.fillRect(0, wy + wh, w, S * 0.08);
  ctx.fillStyle = vgrad(ctx, wy + wh + S * 0.08, h, [[0, '#cfc6b5'], [1, '#e7e0d3']]);
  ctx.fillRect(0, wy + wh + S * 0.08, w, h);
  place(ctx, X(0.05), Y(0.33), -0.04, () =>
    K.card(ctx, S * 0.62, S * 0.24, '#fffdf8', (c, cw, ch) => {
      hand(c, 'a roof, a bird,', cw * 0.08, ch * 0.28, ch * 0.18, '#1f2430', 'left', 700);
      hand(c, 'a cloud that stays,', cw * 0.08, ch * 0.52, ch * 0.18, '#1f2430', 'left', 700);
      hand(c, 'and me, still here.', cw * 0.08, ch * 0.76, ch * 0.18, '#1f2430', 'left', 700);
    }),
  );
  place(ctx, X(0.52), Y(0.34), 0.6, () => K.pencil(ctx, S * 0.34, '#2b59ff', r));
};

/* ------------------------------------------------------------------ registry */
const ACT_TONE = '#d9cbb5';
const tones = {};
const focals = {};

/* ---------------- productive activities ---------------- */
A.braindump = (ctx, w, h, r) => {
  surface(ctx, w, h, r, 'walnut');
  const { S, X, Y } = U(w, h);
  place(ctx, X(-0.08), Y(0.02), -0.03, () =>
    K.card(ctx, S * 0.62, S * 0.8, '#fffdf6', (c, cw, ch) => {
      hand(c, 'on my mind', cw * 0.1, ch * 0.09, ch * 0.065, '#1f2430', 'left', 700);
      ['maths sheet', 'text Maya back', 'gym bag', 'library book', 'call grandma', 'science poster', 'tidy desk'].forEach((t, i) => {
        hand(c, t, cw * 0.14, ch * (0.2 + i * 0.1), ch * 0.05, '#3a4052', 'left', 600, cw * 0.78);
      });
      [[0, '#e2523f'], [4, '#e2523f'], [5, '#e2523f']].forEach(([i, col]) => {
        c.strokeStyle = col;
        c.lineWidth = Math.max(2, cw * 0.012);
        c.beginPath();
        c.ellipse(cw * 0.42, ch * (0.2 + i * 0.1), cw * 0.36, ch * 0.042, -0.03, 0, TAU);
        c.stroke();
      });
      hand(c, 'top 3 today', cw * 0.14, ch * 0.92, ch * 0.055, '#e2523f', 'left', 700);
    }),
  );
  place(ctx, X(0.48), Y(0.32), 0.9, () => K.pen(ctx, S * 0.4, '#e2523f'));
  place(ctx, X(0.48), Y(-0.3), 0, () => K.mugTop(ctx, S * 0.13, '#f4f1ec', 'tea', r));
};

A.deskreset = (ctx, w, h, r) => {
  surface(ctx, w, h, r, 'oak');
  const { S, X, Y } = U(w, h);
  place(ctx, X(-0.42), Y(-0.28), 0, () => O.plantTop(ctx, S * 0.15, r));
  place(ctx, X(0.02), Y(-0.02), 0.04, () => K.notebook(ctx, S * 0.42, S * 0.56, '#2f4f6f'));
  place(ctx, X(0.36), Y(-0.06), 1.5, () => K.pencil(ctx, S * 0.46, '#f2c14e', r));
  place(ctx, X(0.44), Y(0.08), 1.52, () => K.pen(ctx, S * 0.44, '#0b1433'));
  place(ctx, X(-0.4), Y(0.26), -0.2, () =>
    K.sticky(ctx, S * 0.24, '#ffe27a', (c, sz) => {
      hand(c, 'tomorrow:', sz * 0.12, sz * 0.3, sz * 0.13, '#1f2430', 'left', 700);
      hand(c, 'ch. 4 notes', sz * 0.12, sz * 0.58, sz * 0.12, '#3a4052', 'left', 600, sz * 0.8);
    }),
  );
  place(ctx, X(0.42), Y(-0.36), 0.3, () => K.tapeRoll(ctx, S * 0.08, '#b7a6ff', '#ffffff'));
};

A.focussprint = (ctx, w, h, r) => {
  surface(ctx, w, h, r, 'linen');
  const { S, X, Y } = U(w, h);
  place(ctx, X(-0.06), Y(0.06), 0.03, () =>
    K.notebookOpen(
      ctx,
      S * 0.92,
      S * 0.6,
      (c, pw, ph) => {
        hand(c, 'History essay', pw * 0.1, ph * 0.1, ph * 0.075, '#1f2430', 'left', 700);
        ['intro: why the', 'river mattered', 'point 1: trade', 'point 2: farming'].forEach((t, i) => hand(c, t, pw * 0.1, ph * (0.27 + i * 0.13), ph * 0.06, '#3a4052', 'left', 600, pw * 0.82));
      },
      (c, pw, ph) => {
        hand(c, '25:00', pw * 0.5, ph * 0.36, ph * 0.16, '#2b59ff', 'center', 700);
        hand(c, 'phone: other room', pw * 0.5, ph * 0.6, ph * 0.06, '#5a6070', 'center', 600, pw * 0.86);
        hand(c, 'break: stretch + water', pw * 0.5, ph * 0.74, ph * 0.06, '#5a6070', 'center', 600, pw * 0.86);
      },
      '#3e6b5c',
    ),
  );
  place(ctx, X(0.52), Y(-0.33), 0, () => K.watch(ctx, S * 0.2));
  place(ctx, X(-0.5), Y(-0.34), -0.5, () => K.pencil(ctx, S * 0.4, '#2fd69b', r));
};

A.mendit = (ctx, w, h, r) => {
  surface(ctx, w, h, r, 'linen');
  const { S, X, Y } = U(w, h);
  place(ctx, X(-0.1), Y(0.04), -0.08, () => K.tshirt(ctx, S * 0.62, '#3f6fb0'));
  place(ctx, X(0.36), Y(-0.26), 0, () => O.button(ctx, S * 0.11, '#f4f1ec'));
  place(ctx, X(0.46), Y(-0.12), 0, () => O.button(ctx, S * 0.08, '#f4f1ec'));
  place(ctx, X(0.42), Y(0.24), 0.6, () => K.scissors(ctx, S * 0.32, '#ff6f91'));
  place(ctx, X(-0.48), Y(-0.34), 0.2, () => K.tapeRoll(ctx, S * 0.1, '#ffd166', '#ff6f91'));
  ctx.save();
  ctx.strokeStyle = '#e2523f';
  ctx.lineWidth = Math.max(1.5, S * 0.006);
  ctx.beginPath();
  ctx.moveTo(X(0.3), Y(-0.2));
  ctx.bezierCurveTo(X(0.18), Y(-0.05), X(0.4), Y(0.02), X(0.24), Y(0.12));
  ctx.stroke();
  ctx.restore();
};

A.weekplan = (ctx, w, h, r) => {
  surface(ctx, w, h, r, '#efe9df');
  const { S, X, Y } = U(w, h);
  place(ctx, X(-0.04), Y(0.0), -0.02, () =>
    K.card(ctx, S * 1.0, S * 0.7, '#fffdf8', (c, cw, ch) => {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const notes = ['maths hw', 'football', 'read ch. 3', 'art club', 'movie night', 'park w/ Lu', 'rest :)'];
      const cols = ['#cfe1ff', '#dbf6ea', '#eeeaff', '#ffe9c7', '#ffd6e0', '#dbf6ea', '#cfe1ff'];
      days.forEach((d, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const bw = cw * 0.21;
        const bh = ch * 0.38;
        const x = cw * 0.05 + col * cw * 0.235;
        const y = ch * 0.1 + row * ch * 0.45;
        c.fillStyle = cols[i];
        c.fillRect(x, y, bw, bh);
        hand(c, d, x + bw * 0.1, y + bh * 0.2, bh * 0.15, '#1f2430', 'left', 700);
        hand(c, notes[i], x + bw * 0.1, y + bh * 0.52, bh * 0.12, '#3a4052', 'left', 600, bw * 0.84);
      });
    }),
  );
  place(ctx, X(0.5), Y(0.36), 1.1, () => K.marker(ctx, S * 0.36, '#2b59ff'));
};

Object.keys(A).forEach((k) => {
  tones[k] = ACT_TONE;
  focals[k] = [50, 50, 1.4];
});
Object.assign(tones, { cloudgallery: '#9cc2ef', stars: '#0b1433', dance: '#1d1146', breathing: '#c48c7a' });

registerPainters(A, tones, focals, ['colorhunt', 'note', 'compliments', 'swap', 'colorwheel']);

export const SCENE_KINDS = Object.keys(A);
