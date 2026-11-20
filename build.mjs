// Builds ScrollWise.
//   npm run build        → docs/ (the website for GitHub Pages) + dist/scrollwise.html (offline single file)
//   npm run build:final  → the same, but leaves out the temporary draft pictures in photos/ai/temporary/
//   npm run dev          → rebuilds on every save; refresh the browser to see changes
//
// Pictures (see PHOTOS.md):
//   photos/*.jpg      licensed photos, each described in photos/credits.json (others are skipped)
//   photos/ai/*.jpg   AI-generated pictures named after their slot, e.g. post-mirror-fit.jpg
// Every picture is resized and compressed automatically when "sharp" is installed (npm install).
//
// Files in public/ (icons, social card, manifest) are copied into docs/ unchanged.
// Anything else you put in docs/ yourself (for example a CNAME file) is left alone.
import * as esbuild from 'esbuild';
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { inflateRawSync } from 'node:zlib';

const watch = process.argv.includes('--watch');
const finalOnly = process.argv.includes('--final');
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
// Your GitHub Pages address, e.g. https://your-name.github.io/scrollwise/ (set "homepage" in package.json).
// Only used for link previews: WhatsApp, Instagram, iMessage etc. need the full address of the preview image.
const HOMEPAGE = (pkg.homepage || '').trim().replace(/\/?$/, '/').replace(/^\/$/, '');
const FONTS =
  'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,400..800&family=Caveat:wght@500;600;700&family=Figtree:wght@400;500;600;700;800&display=swap';

const TITLE = 'ScrollWise · Less scroll. More life.';
const DESCRIPTION =
  'A student-built social feed prototype with a finish line: choose how long to browse, stop at a clear stopping point, then find something worth doing offline.';
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function headTags({ site }) {
  const abs = (f) => (HOMEPAGE ? HOMEPAGE + f : f);
  const icon = site
    ? ['<link rel="icon" href="favicon.svg" type="image/svg+xml">', '<link rel="icon" href="favicon-32.png" sizes="32x32" type="image/png">', '<link rel="apple-touch-icon" href="apple-touch-icon.png">', '<link rel="manifest" href="site.webmanifest">']
    : [`<link rel="icon" href="data:image/svg+xml;base64,${readFileSync('public/favicon.svg').toString('base64')}" type="image/svg+xml">`];
  const social = site
    ? [
        '<meta property="og:type" content="website">',
        '<meta property="og:site_name" content="ScrollWise">',
        `<meta property="og:title" content="${esc(TITLE)}">`,
        `<meta property="og:description" content="${esc(DESCRIPTION)}">`,
        `<meta property="og:image" content="${abs('social-card.png')}">`,
        '<meta property="og:image:width" content="1200">',
        '<meta property="og:image:height" content="630">',
        '<meta property="og:image:alt" content="ScrollWise logo with the words Less scroll. More life. next to a short feed that ends at a stopping point.">',
        ...(HOMEPAGE ? [`<meta property="og:url" content="${HOMEPAGE}">`, `<link rel="canonical" href="${HOMEPAGE}">`] : []),
        '<meta name="twitter:card" content="summary_large_image">',
        `<meta name="twitter:title" content="${esc(TITLE)}">`,
        `<meta name="twitter:description" content="${esc(DESCRIPTION)}">`,
        `<meta name="twitter:image" content="${abs('social-card.png')}">`,
      ]
    : [];
  return [
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">',
    `<title>${esc(TITLE)}</title>`,
    `<meta name="description" content="${esc(DESCRIPTION)}">`,
    `<meta name="author" content="${esc(pkg.author || 'ScrollWise team')}">`,
    '<meta name="theme-color" content="#f3f5fb" media="(prefers-color-scheme: light)">',
    '<meta name="theme-color" content="#060a1a" media="(prefers-color-scheme: dark)">',
    '<meta name="apple-mobile-web-app-title" content="ScrollWise">',
    ...icon,
    ...social,
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    `<link rel="stylesheet" href="${FONTS}">`,
  ].join('\n');
}

const NOSCRIPT = '<noscript><p style="font:16px/1.5 system-ui,sans-serif;padding:24px;max-width:560px;margin:0 auto">ScrollWise needs JavaScript to run. Please turn it on in your browser settings, or try another browser.</p></noscript>';

/* ---------- photos ---------- */
const MIME = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };

// Pictures are resized and compressed automatically with "sharp" (installed by `npm install`).
// Without it the build still works, using the files exactly as they are.
let sharp = null;
try {
  sharp = (await import('sharp')).default;
} catch (e) {
  console.warn('⚠ "sharp" is not installed, so pictures are used at their original size. Run `npm install` to compress them automatically.');
}

// Longest-side limits. The website version (docs/photos/) is sharp on any phone; the single-file version
// (dist/scrollwise.html) carries every picture inside it, so it uses slightly smaller copies.
const LIMITS = {
  post: { web: [1080, 1350, 80], file: [828, 1035, 72] },
  activity: { web: [1080, 1080, 80], file: [828, 828, 72] },
  avatar: { web: [320, 320, 82], file: [240, 240, 78] },
};
const kindOf = (id) => (id.startsWith('avatar-') ? 'avatar' : id.startsWith('activity-') ? 'activity' : 'post');

// Reads width/height from a JPEG, PNG or WebP header.
function imageSize(buf) {
  if (buf[0] === 0x89 && buf[1] === 0x50) return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
    const type = buf.toString('ascii', 12, 16);
    if (type === 'VP8X') return { w: 1 + buf.readUIntLE(24, 3), h: 1 + buf.readUIntLE(27, 3) };
    if (type === 'VP8 ') return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff };
    if (type === 'VP8L') {
      const b = buf.readUInt32LE(21);
      return { w: (b & 0x3fff) + 1, h: ((b >> 14) & 0x3fff) + 1 };
    }
  }
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) return null;
    const marker = buf[i + 1];
    const len = buf.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
    i += 2 + len;
  }
  return null;
}

function readImage(path, data) {
  const buf = data || readFileSync(path);
  const size = imageSize(buf);
  if (!size) return null;
  const ext = path.split('.').pop().toLowerCase();
  return { buf, w: size.w, h: size.h, ext: ext === 'jpeg' ? 'jpg' : ext, mime: MIME[ext] || 'image/jpeg' };
}

// Reads the pictures inside a .zip file (so a downloaded zip can go straight into photos/ai/).
function unzipImages(buf) {
  let end = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) {
      end = i;
      break;
    }
  }
  if (end < 0) return [];
  const out = [];
  let p = buf.readUInt32LE(end + 16);
  for (let n = buf.readUInt16LE(end + 10); n > 0 && buf.readUInt32LE(p) === 0x02014b50; n--) {
    const method = buf.readUInt16LE(p + 10);
    const size = buf.readUInt32LE(p + 20);
    const nameLen = buf.readUInt16LE(p + 28);
    const local = buf.readUInt32LE(p + 42);
    const name = buf.toString('utf8', p + 46, p + 46 + nameLen);
    p += 46 + nameLen + buf.readUInt16LE(p + 30) + buf.readUInt16LE(p + 32);
    const base = name.split('/').pop();
    if (!/\.(jpe?g|png|webp)$/i.test(base) || base.startsWith('.') || name.startsWith('__MACOSX')) continue;
    const start = local + 30 + buf.readUInt16LE(local + 26) + buf.readUInt16LE(local + 28);
    const data = buf.subarray(start, start + size);
    try {
      if (method === 0) out.push({ name, buf: Buffer.from(data) });
      else if (method === 8) out.push({ name, buf: inflateRawSync(data) });
    } catch (e) {
      console.warn(`⚠ Could not unpack ${name} from the zip`);
    }
  }
  return out;
}

// Every picture slot the app knows about (posts and their carousel photos, profile pictures, activities).
let slots = null;
let allPosts = [];
async function loadSlots() {
  try {
    const t = Date.now();
    const { ALL_POSTS, CREATORS } = await import(`./src/data/posts.js?t=${t}`);
    const { ACTIVITIES } = await import(`./src/data/activities.js?t=${t}`);
    const set = new Set();
    for (const p of ALL_POSTS) {
      set.add(`post-${p.id}`);
      for (let i = 2; i <= (p.more || 0) + 1; i++) set.add(`post-${p.id}-${i}`);
    }
    for (const u of Object.keys(CREATORS)) set.add(`avatar-${u}`);
    for (const a of ACTIVITIES) set.add(`activity-${a.id}`);
    slots = set;
    allPosts = ALL_POSTS;
  } catch (e) {
    slots = null; // can't check names; every picture is included as named
  }
}
function slotFor(stem) {
  const id = stem.trim().toLowerCase().replace(/[\s_]+/g, '-').replace(/-+/g, '-');
  if (!slots || slots.has(id)) return id;
  for (const pre of ['post-', 'avatar-', 'activity-']) if (slots.has(pre + id)) return pre + id;
  return id;
}

function loadPhotos() {
  const dir = 'photos';
  const out = [];
  const ids = new Set();
  // 1. Licensed photos: photos/*.jpg, each described in photos/credits.json.
  let list = [];
  if (existsSync(`${dir}/credits.json`)) {
    try {
      list = JSON.parse(readFileSync(`${dir}/credits.json`, 'utf8')).photos || [];
    } catch (e) {
      console.warn(`⚠ photos/credits.json could not be read: ${e.message}`);
    }
  }
  const credited = new Set();
  for (const p of list) {
    credited.add(p.file);
    if (!p.id || !p.file || !existsSync(`${dir}/${p.file}`)) {
      console.warn(`⚠ Skipping photo "${p.id || p.file}": file not found in photos/`);
      continue;
    }
    if (!p.author || !p.license) console.warn(`⚠ Photo "${p.id}" has no author or license in credits.json`);
    const img = readImage(`${dir}/${p.file}`);
    if (!img) {
      console.warn(`⚠ Skipping photo "${p.id}": not a JPEG, PNG or WebP image`);
      continue;
    }
    ids.add(p.id);
    out.push({ ...p, ...img });
  }
  for (const f of readdirSync(dir)) {
    if (/\.(jpe?g|png|webp)$/i.test(f) && !credited.has(f)) console.warn(`⚠ photos/${f} has no entry in credits.json, so it was not included`);
  }
  // 2. AI-generated pictures: photos/ai/<slot>.jpg (or .png/.webp), e.g. post-mirror-fit.jpg,
  //    post-mirror-fit-2.jpg, avatar-jun.wears.jpg. No credits entry needed; the app labels them "AI info".
  //    Sub-folders are fine (e.g. an unzipped download), and names are forgiving: "Mirror_Fit.PNG" or
  //    "mirror-fit.png" both fill post-mirror-fit, and "jun.wears.jpg" fills avatar-jun.wears.
  const aiDir = `${dir}/ai`;
  if (existsSync(aiDir)) {
    const entries = [];
    const files = readdirSync(aiDir, { recursive: true }).map(String).filter((f) => !f.startsWith('.') && !f.includes('/.') && !f.startsWith('__MACOSX'));
    for (const f of files.sort()) {
      if (/\.(jpe?g|png|webp)$/i.test(f)) entries.push({ f, buf: readFileSync(`${aiDir}/${f}`) });
      else if (/\.zip$/i.test(f)) for (const z of unzipImages(readFileSync(`${aiDir}/${f}`))) entries.push({ f: `${f} → ${z.name}`, name: z.name, buf: z.buf });
    }
    // photos/ai/temporary/ holds low-resolution stand-ins. A final picture with the same name anywhere
    // else in photos/ai/ always wins, so dropping in the final version replaces the draft automatically.
    const isTemp = (f) => /^temporary\//i.test(f);
    entries.sort((a, b) => isTemp(a.f) - isTemp(b.f));
    for (const { f, name, buf } of entries) {
      if (finalOnly && isTemp(f)) continue; // npm run build:final leaves the drafts out
      const id = slotFor((name || f).split('/').pop().replace(/\.[^.]+$/, ''));
      if (slots && !slots.has(id)) {
        console.warn(`⚠ photos/ai/${f} doesn't match any post, profile picture or activity, so it was not included. Check its name against photos/ai/prompts.csv.`);
        continue;
      }
      if (ids.has(id)) {
        if (isTemp(f)) console.log(`  photos/ai/${f}: replaced by the final version, so the draft can be deleted`);
        else console.warn(`⚠ photos/ai/${f} skipped: "${id}" is already used by another picture`);
        continue;
      }
      const img = readImage((name || f).toLowerCase(), buf);
      if (!img) {
        console.warn(`⚠ photos/ai/${f} skipped: not a JPEG, PNG or WebP image`);
        continue;
      }
      ids.add(id);
      out.push({ id, file: `ai/${f}`, ai: true, alt: '', ...(isTemp(f) ? { temp: true } : {}), ...img });
    }
  }
  return out;
}

// Resizes and compresses one picture (cached in photos/.cache so rebuilds stay fast).
async function optimise(p, variant) {
  if (!sharp) return { buf: p.buf, w: p.w, h: p.h, ext: p.ext, mime: p.mime };
  const [mw, mh, q] = LIMITS[kindOf(p.id)][variant];
  const key = createHash('sha1').update(p.buf).update(`${mw}x${mh}q${q}v1`).digest('hex').slice(0, 20);
  const cached = `photos/.cache/${key}.jpg`;
  let buf;
  if (existsSync(cached)) buf = readFileSync(cached);
  else {
    buf = await sharp(p.buf)
      .rotate()
      .resize({ width: mw, height: mh, fit: 'inside', withoutEnlargement: true })
      .flatten({ background: '#ffffff' })
      .jpeg({ quality: q, mozjpeg: true })
      .toBuffer();
    mkdirSync('photos/.cache', { recursive: true });
    writeFileSync(cached, buf);
  }
  const size = imageSize(buf);
  return { buf, w: size.w, h: size.h, ext: 'jpg', mime: 'image/jpeg' };
}

async function preparePhotos(photos, variant) {
  const out = [];
  for (const p of photos) {
    try {
      out.push({ ...p, ...(await optimise(p, variant)) });
    } catch (e) {
      console.warn(`⚠ Could not process "${p.id}" (${e.message}); using the original file`);
      out.push(p);
    }
  }
  return out;
}

function photoScript(photos, inline) {
  const map = {};
  for (const p of photos) {
    const { buf, mime, file, ext, temp, ...meta } = p;
    map[p.id] = { ...meta, src: inline ? `data:${mime};base64,${buf.toString('base64')}` : `photos/${p.id}.${ext}` };
  }
  return `<script>window.SW_PHOTOS=${JSON.stringify(map).replace(/</g, '\\u003c')};</script>`;
}

// Lists feed posts that are still waiting for a picture (they stay hidden until they have one).
function feedReport(photos) {
  if (!slots) return;
  const ids = new Set(photos.map((p) => p.id));
  const missing = allPosts.filter((p) => !ids.has(p.photo) && !ids.has(`post-${p.id}`)).map((p) => `post-${p.id}`);
  const avatars = [...slots].filter((id) => id.startsWith('avatar-'));
  console.log(`Feed: ${allPosts.length - missing.length} of ${allPosts.length} posts have a picture; ${avatars.filter((id) => ids.has(id)).length} of ${avatars.length} profile pictures added.`);
  if (missing.length) console.log(`  Waiting for a picture: ${missing.slice(0, 6).join(', ')}${missing.length > 6 ? ` and ${missing.length - 6} more` : ''}`);
  // photos/ai/missing.csv: the rows of prompts.csv that still have no picture.
  const csvPath = 'photos/ai/prompts.csv';
  if (existsSync(csvPath)) {
    const [header, ...rows] = readFileSync(csvPath, 'utf8').trim().split('\n');
    const left = rows.filter((r) => {
      const m = r.match(/^"([^"]+)"/);
      return m && !ids.has(m[1].replace(/\.[^.]+$/, ''));
    });
    if (left.length) writeFileSync('photos/ai/missing.csv', `${[header, ...left].join('\n')}\n`);
    else rmSync('photos/ai/missing.csv', { force: true });
    console.log(left.length ? `  ${left.length} of ${rows.length} pictures in prompts.csv still to make: listed in photos/ai/missing.csv` : `  All ${rows.length} pictures in prompts.csv are installed.`);
    // photos/ai/replace.csv: pictures shown from temporary/ that still need a final version.
    const temp = new Set(photos.filter((p) => p.temp).map((p) => p.id));
    const notesPath = 'photos/ai/temporary/notes.csv';
    const notes = {};
    if (existsSync(notesPath)) {
      for (const line of readFileSync(notesPath, 'utf8').trim().split('\n').slice(1)) {
        const i = line.indexOf(',');
        if (i > 0) notes[line.slice(0, i).replace(/\.[^.]+$/, '')] = line.slice(i + 1).replace(/^"|"$/g, '');
      }
    }
    const repl = rows.filter((r) => {
      const m = r.match(/^"([^"]+)"/);
      return m && temp.has(m[1].replace(/\.[^.]+$/, ''));
    });
    if (repl.length) {
      const q = (v) => `"${String(v).replace(/"/g, '""')}"`;
      writeFileSync('photos/ai/replace.csv', `${header},"note"\n${repl.map((r) => `${r},${q(notes[r.match(/^"([^"]+)"/)[1].replace(/\.[^.]+$/, '')] || 'Temporary draft')}`).join('\n')}\n`);
      console.log(`  ${repl.length} installed pictures are temporary drafts: listed in photos/ai/replace.csv`);
    } else rmSync('photos/ai/replace.csv', { force: true });
  }
}

// PHOTO-MANIFEST.md + photos/manifest.csv: one row per feed picture (80 posts + carousel photos), with its
// file name, section, description, size, status, source/licence and what still has to be done.
// photos/PROMPTS-NEEDED.md: the exact prompt for every picture that is missing or only a temporary draft.
// All three are rewritten by every build, so they always match the files that are really there.
const SECTIONS = { friends: 'Friends & everyday', style: 'Fashion & beauty', food: 'Food & cafés', pets: 'Pets & funny moments', travel: 'Travel & lifestyle', hobbies: 'Sports, music & hobbies' };
function parseCSV(text) {
  const rows = [];
  let row = [];
  let cur = '';
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') q = false;
      else cur += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(cur); cur = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cur); rows.push(row); row = []; cur = '';
    } else cur += c;
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  return rows.filter((r) => r.length > 1);
}
function writeManifest(photos) {
  if (!slots || !allPosts.length) return;
  const byId = new Map(photos.map((p) => [p.id, p]));
  let credits = [];
  try {
    credits = JSON.parse(readFileSync('photos/credits.json', 'utf8')).photos || [];
  } catch (e) { /* no licensed photos */ }
  const prompts = {};
  if (existsSync('photos/ai/prompts.csv')) {
    const [head, ...rows] = parseCSV(readFileSync('photos/ai/prompts.csv', 'utf8'));
    for (const r of rows) prompts[r[0].replace(/\.[^.]+$/, '')] = Object.fromEntries(head.map((h, i) => [h, r[i]]));
  }
  const notes = {};
  if (existsSync('photos/ai/temporary/notes.csv')) {
    for (const r of parseCSV(readFileSync('photos/ai/temporary/notes.csv', 'utf8')).slice(1)) notes[r[0].replace(/\.[^.]+$/, '')] = r[1];
  }
  const RATIO = { '4:5': [1080, 1350], '1:1': [1080, 1080], '3:2': [1350, 900], '2:3': [1080, 1620], '16:9': [1600, 900], '9:16': [1080, 1920] };
  const rows = [];
  for (const p of allPosts) {
    const images = [{ slot: `post-${p.id}`, n: 1, alt: p.alt }, ...Array.from({ length: p.more || 0 }, (_, i) => ({ slot: `post-${p.id}-${i + 2}`, n: i + 2, alt: (p.slides && p.slides[i]) || '' }))];
    for (const im of images) {
      const lib = im.n === 1 && p.photo ? credits.find((c) => c.id === p.photo) : null;
      const have = lib ? byId.get(lib.id) : byId.get(im.slot);
      const pr = prompts[im.slot] || {};
      const [w, h] = pr.width ? [Number(pr.width), Number(pr.height)] : RATIO[p.ratio || '4:5'] || [1080, 1350];
      let status;
      let source;
      let todo;
      let extra = '';
      if (lib && have) {
        status = 'Licensed photo';
        source = `${lib.license}: ${lib.author}, ${lib.link}${lib.changes ? ` (${lib.changes})` : ''}`;
        todo = 'None: keep';
      } else if (have && have.temp) {
        status = 'Temporary draft';
        source = 'AI-generated draft supplied by the team (Batch 01). Record the generator and check its terms allow publishing.';
        // The drafts were enlarged from small previews, so their pixel size says nothing about their real detail.
        extra = notes[im.slot] ? notes[im.slot].replace(/^Low-resolution draft[^.]*\.\s*/, '') : '';
        todo = `Replace with a final image generated at full resolution, at least ${w} × ${h} px. The draft was enlarged from a small preview, so it isn't genuinely high-resolution. ${extra}`.trim();
      } else if (have) {
        status = have.ai ? 'Final AI image' : 'Installed';
        source = have.ai ? 'AI-generated image supplied by the team. Record the generator and check its terms allow publishing.' : 'See photos/credits.json';
        todo = have.w < w * 0.9 ? `Check quality: only ${have.w} × ${have.h} px` : 'None: keep';
      } else {
        status = 'Missing';
        source = '';
        todo = im.n === 1 ? `Needed before this post can appear. Create from the prompt in photos/PROMPTS-NEEDED.md, at least ${w} × ${h} px.` : `Optional carousel photo. Create from the prompt in photos/PROMPTS-NEEDED.md, at least ${w} × ${h} px.`;
      }
      rows.push({
        post: p.id,
        image: im.n === 1 ? 'main' : `carousel ${im.n}`,
        file: lib ? `photos/${lib.file}` : `photos/ai/${im.slot}.jpg`,
        section: SECTIONS[p.cat] || p.cat,
        creator: p.user,
        description: im.alt,
        size: `${w} × ${h} (${pr.shape || `${p.ratio || '4:5'}`})`,
        current: have ? `${have.w} × ${have.h}${have.temp ? ', enlarged draft' : ''}` : '',
        status,
        source,
        todo,
        prompt: pr.prompt || '',
        person: pr.recurring_person || '',
        extra,
      });
    }
  }
  const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;
  const cols = [['post_id', 'post'], ['image', 'image'], ['file', 'file'], ['section', 'section'], ['creator', 'creator'], ['description', 'description'], ['required_size', 'size'], ['current_size', 'current'], ['status', 'status'], ['source_and_licence', 'source'], ['what_is_needed', 'todo']];
  writeFileSync('photos/manifest.csv', `${cols.map(([c]) => c).join(',')}\n${rows.map((r) => cols.map(([, k]) => esc(r[k])).join(',')).join('\n')}\n`);

  const count = (f) => rows.filter(f).length;
  const mains = rows.filter((r) => r.image === 'main');
  const md = [];
  md.push('# ScrollWise photography manifest', '');
  md.push('Generated by `npm run build` from the files that are really in `photos/`. Do not edit by hand: add or replace pictures, then build again.', '');
  md.push('A post appears in the feed only when its **main** picture exists. Carousel photos are optional extras.', '');
  md.push('## Summary', '');
  md.push('| | Main pictures (80 posts) | Carousel photos | All |', '| --- | ---: | ---: | ---: |');
  for (const st of ['Licensed photo', 'Final AI image', 'Temporary draft', 'Missing']) {
    md.push(`| ${st} | ${count((r) => r.image === 'main' && r.status === st)} | ${count((r) => r.image !== 'main' && r.status === st)} | ${count((r) => r.status === st)} |`);
  }
  md.push(`| **Total** | **${mains.length}** | **${rows.length - mains.length}** | **${rows.length}** |`, '');
  md.push('| Section | Posts | With a picture now | Of those, temporary drafts |', '| --- | ---: | ---: | ---: |');
  for (const sec of Object.values(SECTIONS)) {
    const m = mains.filter((r) => r.section === sec);
    md.push(`| ${sec} | ${m.length} | ${m.filter((r) => r.status !== 'Missing').length} | ${m.filter((r) => r.status === 'Temporary draft').length} |`);
  }
  md.push('', '**Requirements for every new picture:** photorealistic and sharp at the size given; suitable for a teenage audience; fictional people only (no real or famous people); no text, logos, brand names or watermarks; no repeats of another picture; made with a tool whose terms allow publishing, or a licensed photo credited in `photos/credits.json`. Never enlarge a small image and call it high resolution.', '');
  for (const sec of Object.values(SECTIONS)) {
    md.push(`## ${sec}`, '', '| Post | Image | File | Description | Size needed | Status | Source / licence | What’s needed |', '| --- | --- | --- | --- | --- | --- | --- | --- |');
    for (const r of rows.filter((x) => x.section === sec)) md.push(`| ${r.post} | ${r.image} | \`${r.file}\` | ${r.description.replace(/\|/g, '/')} | ${r.size} | ${r.status}${r.current ? ` (${r.current})` : ''} | ${r.source.replace(/\|/g, '/') || '–'} | ${r.todo.replace(/\|/g, '/')} |`);
    md.push('');
  }
  writeFileSync('PHOTO-MANIFEST.md', md.join('\n'));

  const need = rows.filter((r) => r.status === 'Missing' || r.status === 'Temporary draft');
  const pm = ['# Prompts for the pictures still needed', '', `Generated by \`npm run build\`. ${need.length} pictures: ${need.filter((r) => r.status === 'Temporary draft').length} temporary drafts to replace and ${need.filter((r) => r.status === 'Missing').length} missing (${need.filter((r) => r.status === 'Missing' && r.image === 'main').length} of them are main post pictures). Profile pictures are optional and listed in \`photos/ai/prompts.csv\`.`, ''];
  pm.push('**How to use:** copy a prompt into an image generator whose terms allow publishing, check the result closely (faces, hands, text, logos), save it with the exact file name shown in `photos/ai/`, then run `npm run build`. A final picture automatically replaces the draft with the same name.', '');
  pm.push('Main pictures come first, because a post only appears once its main picture exists.', '');
  for (const sec of Object.values(SECTIONS)) {
    const list = need.filter((r) => r.section === sec).sort((a, b) => (a.image === 'main' ? 0 : 1) - (b.image === 'main' ? 0 : 1));
    if (!list.length) continue;
    pm.push(`## ${sec}`, '');
    for (const r of list) {
      pm.push(`### ${r.file.split('/').pop()}`, '');
      pm.push(`- **Post:** ${r.post} (${r.image}) by ${r.creator}`, `- **Status:** ${r.status === 'Temporary draft' ? 'Temporary draft (enlarged from a small preview): replace' : 'Missing'}`, `- **Size:** at least ${r.size}`);
      if (r.extra) pm.push(`- **Also fix:** ${r.extra}`);
      if (r.person) pm.push(`- **Recurring person:** ${r.person}`);
      pm.push('', '```text', r.prompt || r.description, '```', '');
    }
  }
  writeFileSync('photos/PROMPTS-NEEDED.md', pm.join('\n'));
  // Exact duplicates are never allowed (the same picture used twice).
  const seen = new Map();
  for (const ph of photos) {
    const h = createHash('sha1').update(ph.buf).digest('hex');
    if (seen.has(h)) console.warn(`⚠ ${ph.id} is the same picture as ${seen.get(h)}: use a different picture`);
    else seen.set(h, ph.id);
  }
  console.log(`  Photo manifest: PHOTO-MANIFEST.md and photos/manifest.csv (${rows.length} pictures); prompts for the ${need.length} still needed: photos/PROMPTS-NEEDED.md`);
}

const mb = (n) => `${(n / 1048576).toFixed(1)} MB`;

/* ---------- output ---------- */
async function write(result) {
  const js = result.outputFiles.find((f) => f.path.endsWith('.js')).text;
  const cssFile = result.outputFiles.find((f) => f.path.endsWith('.css'));
  const css = cssFile ? cssFile.text : '';
  const fonts = result.outputFiles.filter((f) => f.path.endsWith('.woff'));
  const fontName = (f) => f.path.split('/').pop();
  // The offline copy has no folder next to it, so its fonts go inside the file.
  const inlineFonts = (text) =>
    text.replace(/url\((["']?)(?:\.\/)?fonts\/([^"')]+)\1\)/g, (m, q, name) => {
      const f = fonts.find((x) => fontName(x) === name);
      return f ? `url(data:font/woff;base64,${Buffer.from(f.contents).toString('base64')})` : m;
    });
  await loadSlots();
  const photos = loadPhotos();
  const small = await preparePhotos(photos, 'file');
  const web = await preparePhotos(photos, 'web');

  // 1. The website, for GitHub Pages (or any static host): docs/index.html + assets/ + photos/.
  //    Every path is relative, so it works at https://name.github.io/repo/ as well as at a domain's root.
  const hash = (t) => createHash('sha1').update(t).digest('hex').slice(0, 10);
  mkdirSync('docs', { recursive: true });
  rmSync('docs/assets', { recursive: true, force: true });
  rmSync('docs/photos', { recursive: true, force: true });
  mkdirSync('docs/assets', { recursive: true });
  mkdirSync('docs/photos', { recursive: true });
  writeFileSync('docs/assets/app.js', js);
  writeFileSync('docs/assets/app.css', css);
  if (fonts.length) mkdirSync('docs/assets/fonts', { recursive: true });
  for (const f of fonts) writeFileSync(`docs/assets/fonts/${fontName(f)}`, f.contents);
  if (existsSync('src/fonts/OFL.txt')) copyFileSync('src/fonts/OFL.txt', 'docs/assets/fonts/OFL.txt');
  for (const p of web) writeFileSync(`docs/photos/${p.id}.${p.ext}`, p.buf);
  for (const f of readdirSync('public')) copyFileSync(`public/${f}`, `docs/${f}`);
  const index = [
    '<!doctype html>',
    '<html lang="en">',
    '<head>',
    headTags({ site: true }),
    `<link rel="stylesheet" href="assets/app.css?v=${hash(css)}">`,
    '</head>',
    '<body>',
    NOSCRIPT,
    '<div id="root"></div>',
    photoScript(web, false),
    `<script src="assets/app.js?v=${hash(js)}"></script>`,
    '</body>',
    '</html>',
    '',
  ].join('\n');
  writeFileSync('docs/index.html', index);

  // 2. Offline copy: one self-contained file (double-click to open), with every picture inside it.
  mkdirSync('dist', { recursive: true });
  const page = [
    '<!doctype html>',
    '<html lang="en">',
    '<head>',
    headTags({ site: false }),
    `<style>${inlineFonts(css)}</style>`,
    '</head>',
    '<body>',
    NOSCRIPT,
    '<div id="root"></div>',
    photoScript(small, true),
    `<script>${js.replace(/<\/script/gi, '<\\/script')}</script>`,
    '</body>',
    '</html>',
    '',
  ].join('\n');
  writeFileSync('dist/scrollwise.html', page);

  const ai = photos.filter((p) => p.ai).length;
  const tmp = photos.filter((p) => p.temp).length;
  const webBytes = web.reduce((n, p) => n + p.buf.length, 0);
  console.log(`Built docs/ (website: ${mb(Buffer.byteLength(js) + Buffer.byteLength(css))} of code + ${mb(webBytes)} of pictures) and dist/scrollwise.html (offline copy, ${mb(Buffer.byteLength(page))})`);
  console.log(`  ${photos.length} pictures${ai ? `, ${ai} of them AI-generated` : ''}${tmp ? `, ${tmp} temporary drafts` : ''}${finalOnly ? ' (final build: temporary drafts left out)' : ''}`);
  if (!HOMEPAGE) console.log('  Tip: set "homepage" in package.json to your GitHub Pages address so link previews show the social card.');
  feedReport(photos);
  writeManifest(photos);
}

const options = {
  entryPoints: ['src/main.jsx'],
  bundle: true,
  minify: true,
  format: 'iife',
  target: 'es2020',
  jsx: 'automatic',
  outdir: 'dist/.tmp',
  write: false,
  legalComments: 'eof', // keeps the licence notices of React etc. at the end of app.js
  loader: { '.woff': 'file' },
  assetNames: 'fonts/[name]',
  define: { 'process.env.NODE_ENV': '"production"' },
  logLevel: 'warning',
};

if (watch) {
  const ctx = await esbuild.context({
    ...options,
    plugins: [{ name: 'html', setup: (b) => b.onEnd(async (r) => (r.errors.length ? null : write(r))) }],
  });
  await ctx.watch();
  console.log('Watching src/ for changes… (after adding photos, save any file in src/ to rebuild)');
} else {
  await write(await esbuild.build(options));
}
