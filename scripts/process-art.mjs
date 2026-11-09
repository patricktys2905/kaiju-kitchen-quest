/** Cleans raw Gemini art (art-src/raw) and installs it into public/art. Run: npm run art
 *
 *  - sprites (mob-*, box-*, ob-*, plat-*, fx-*): magenta backdrop removed, trimmed, resized.
 *  - backgrounds (bg-far*, tile-*): resized, kept opaque.
 *  - layers (bg-mid*): magenta removed but the full frame kept, so it lines up as a parallax strip.
 *  - parts sheets (parts-N): magenta removed, split into connected pieces at ONE common scale
 *    -> parts-N-<i>.webp + public/art/parts-N.json (each piece's box on the sheet). Rigs in
 *    src/render/rigs.ts say which piece is which and where its joints are.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const RAW = path.resolve('art-src/raw');
const OUT = path.resolve('public/art');
const SPRITES = [[/^mob-/, 384], [/^box-/, 256], [/^ob-/, 768], [/^plat-/, 768], [/^fx-/, 256], [/^icon-/, 192]];
const BACKGROUNDS = [[/^bg-far/, [1920, 1080]], [/^tile-/, [512, 512]], [/^bg-town/, [1920, 1080]]];
const LAYERS = [[/^bg-mid/, [1920, 1080]]];
const PARTS_SCALE = 0.5; // parts sheets are 1024px; pieces end up ~150-250px

fs.mkdirSync(OUT, { recursive: true });
const only = process.argv[2];
const files = fs.readdirSync(RAW).filter(f => /\.(png|jpe?g|webp)$/i.test(f) && (!only || f.startsWith(only)));

function removeBackground(data, w, h) {
  const at = (x, y) => (y * w + x) * 4;
  const corners = [at(2, 2), at(w - 3, 2), at(2, h - 3), at(w - 3, h - 3)];
  const ref = corners.map(i => [data[i], data[i + 1], data[i + 2]]).filter(([r, g, b]) => r > 150 && b > 150 && g < 120);
  if (!ref.length) ref.push([255, 0, 255]);
  const near = (i, tol) => ref.some(([R, G, B]) => Math.abs(data[i] - R) + Math.abs(data[i + 1] - G) + Math.abs(data[i + 2] - B) < tol);
  const magentaish = i => data[i] > 150 && data[i + 2] > 150 && data[i + 1] < 130 && Math.abs(data[i] - data[i + 2]) < 90;
  const mark = new Uint8Array(w * h);
  const queue = [];
  const push = (x, y) => { const p = y * w + x; if (mark[p] || !near(p * 4, 90)) return; mark[p] = 1; queue.push(p); };
  for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
  for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
  while (queue.length) {
    const p = queue.pop(), x = p % w, y = (p / w) | 0;
    if (x > 0) push(x - 1, y); if (x < w - 1) push(x + 1, y); if (y > 0) push(x, y - 1); if (y < h - 1) push(x, y + 1);
  }
  for (let p = 0; p < w * h; p++) if (!mark[p] && near(p * 4, 45)) mark[p] = 1;
  for (let pass = 0; pass < 2; pass++) {
    const add = [];
    for (let p = 0; p < w * h; p++) {
      if (mark[p]) continue;
      const x = p % w, y = (p / w) | 0;
      const touching = (x > 0 && mark[p - 1]) || (x < w - 1 && mark[p + 1]) || (y > 0 && mark[p - w]) || (y < h - 1 && mark[p + w]);
      if (touching && magentaish(p * 4)) add.push(p);
    }
    for (const p of add) mark[p] = 1;
  }
  for (let p = 0; p < w * h; p++) {
    if (mark[p]) { data[p * 4 + 3] = 0; continue; }
    const x = p % w, y = (p / w) | 0;
    const edge = (x > 0 && mark[p - 1]) || (x < w - 1 && mark[p + 1]) || (y > 0 && mark[p - w]) || (y < h - 1 && mark[p + w]);
    if (edge) data[p * 4 + 3] = Math.min(data[p * 4 + 3], 170);
  }
}

function bbox(data, w, h) {
  let l = w, t = h, r = -1, b = -1;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++)
    if (data[(y * w + x) * 4 + 3] > 24) { if (x < l) l = x; if (x > r) r = x; if (y < t) t = y; if (y > b) b = y; }
  return r < 0 ? null : { left: l, top: t, width: r - l + 1, height: b - t + 1 };
}

/** Connected opaque regions (4-neighbour), biggest first; tiny specks dropped. */
function components(data, w, h, minArea) {
  const lab = new Int32Array(w * h).fill(-1);
  const out = [];
  for (let s = 0; s < w * h; s++) {
    if (lab[s] >= 0 || data[s * 4 + 3] <= 24) continue;
    const id = out.length, stack = [s];
    lab[s] = id;
    let l = w, t = h, r = 0, b = 0, n = 0;
    while (stack.length) {
      const p = stack.pop(), x = p % w, y = (p / w) | 0;
      n++; if (x < l) l = x; if (x > r) r = x; if (y < t) t = y; if (y > b) b = y;
      for (const q of [x > 0 ? p - 1 : -1, x < w - 1 ? p + 1 : -1, y > 0 ? p - w : -1, y < h - 1 ? p + w : -1])
        if (q >= 0 && lab[q] < 0 && data[q * 4 + 3] > 24) { lab[q] = id; stack.push(q); }
    }
    out.push({ id, n, left: l, top: t, width: r - l + 1, height: b - t + 1 });
  }
  return { lab, comps: out.filter(c => c.n >= minArea).sort((a, b) => b.n - a.n) };
}

for (const file of files) {
  const name = path.basename(file, path.extname(file)).toLowerCase();
  const src = path.join(RAW, file);
  const bg = BACKGROUNDS.find(([re]) => re.test(name));
  if (bg) {
    const [w, h] = bg[1];
    await sharp(src).resize({ width: w, height: h, fit: 'cover' }).webp({ quality: 84 }).toFile(path.join(OUT, `${name}.webp`));
    console.log(`OK ${name}.webp (background ${w}x${h})`);
    continue;
  }
  const layer = LAYERS.find(([re]) => re.test(name));
  const parts = /^parts-\d+$/.test(name);
  const spec = SPRITES.find(([re]) => re.test(name));
  if (!layer && !parts && !spec) { console.log(`? skipped ${file}`); continue; }

  let img = sharp(src).ensureAlpha();
  if (layer) img = img.resize({ width: layer[1][0], height: layer[1][1], fit: 'cover' });
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  removeBackground(data, info.width, info.height);
  const raw = { raw: { width: info.width, height: info.height, channels: 4 } };

  if (layer) {
    // see-through glass shows the backdrop: clear every clearly-magenta pixel, soften tinted ones
    for (let p = 0; p < info.width * info.height; p++) {
      const r = data[p * 4], g = data[p * 4 + 1], bl = data[p * 4 + 2];
      const mag = Math.min(r, bl) - g; // how much more red+blue than green
      if (mag > 120 && Math.abs(r - bl) < 110) data[p * 4 + 3] = 0;
      else if (mag > 70 && Math.abs(r - bl) < 110) { data[p * 4 + 3] = Math.min(data[p * 4 + 3], 120); data[p * 4] = data[p * 4 + 2] = g + 40; }
    }
    await sharp(data, raw).webp({ quality: 86, alphaQuality: 95 }).toFile(path.join(OUT, `${name}.webp`));
    console.log(`OK ${name}.webp (layer)`);
    continue;
  }
  if (parts) {
    const { lab, comps } = components(data, info.width, info.height, 1500);
    const meta = [];
    for (const [i, c] of comps.entries()) {
      const piece = Buffer.alloc(c.width * c.height * 4);
      for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) {
        const p = (c.top + y) * info.width + (c.left + x);
        if (lab[p] !== c.id) continue;
        data.copy(piece, (y * c.width + x) * 4, p * 4, p * 4 + 4);
      }
      const w = Math.round(c.width * PARTS_SCALE), h = Math.round(c.height * PARTS_SCALE);
      await sharp(piece, { raw: { width: c.width, height: c.height, channels: 4 } }).resize(w, h).webp({ quality: 92, alphaQuality: 95 })
        .toFile(path.join(OUT, `${name}-${i}.webp`));
      meta.push({ i, x: Math.round(c.left * PARTS_SCALE), y: Math.round(c.top * PARTS_SCALE), w, h });
    }
    fs.writeFileSync(path.join(OUT, `${name}.json`), JSON.stringify(meta, null, 1) + '\n');
    console.log(`OK ${name}: ${meta.length} pieces ` + meta.map(m => `#${m.i} ${m.w}x${m.h}@${m.x},${m.y}`).join('  '));
    continue;
  }
  const box = bbox(data, info.width, info.height);
  if (!box) { console.log(`! ${file}: everything was removed`); continue; }
  const out = await sharp(data, raw).extract(box).resize({ width: spec[1], height: spec[1], fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 90, alphaQuality: 95 }).toFile(path.join(OUT, `${name}.webp`));
  console.log(`OK ${name}.webp ${out.width}x${out.height}`);
}

const manifest = fs.readdirSync(OUT).filter(f => f.endsWith('.webp')).map(f => f.replace(/\.webp$/, '')).sort();
fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 1) + '\n');
console.log(`manifest: ${manifest.length} images`);
