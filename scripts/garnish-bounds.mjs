// The Garnish badge's art step. A garnish is shown as the drop's icon in a small ring by a kaiju's name (18 px), and the
// drop icons carry painted sparks, steam, puddles and haze that turn into stray specks at that size. So, for every
// public/art/drop-<kind>.webp, this script derives (no new art, only code):
//   public/art/gb-<kind>.webp   the badge sprite: the drop's MAIN BODY only (detached and barely attached bits removed),
//                               trimmed to its bounds, 64 px on its longer side (enough for an 18 px badge at 3x)
//   src/ui/garnishBounds.ts     the body's measurements in that sprite (centre, long axis, reach), which
//                               src/ui/garnishBadge.ts uses to fit the icon into the disc
//   public/art/manifest.json    rebuilt the way scripts/process-art.mjs does (every .webp in public/art), so the game
//                               loads the new sprites
// RUN IT AFTER ADDING OR CHANGING DROP ART:   node scripts/garnish-bounds.mjs
// (tests/garnish-badge.test.ts fails while a drop has no badge sprite or no measurements), then look at the sheet:
//   npx vite-node scripts/garnish-sheet.ts
import fs from 'node:fs';
import sharp from 'sharp';

/** How many of the largest pieces to keep, for drops where the rule below gets it wrong (rule: the largest piece, plus
 *  any piece at least a quarter of its size, e.g. a pair of seeds). 1 = the largest only (a spoon without its puddle). */
const KEEP = { pudding: 1, ladle: 1 };
const SIZE = 64, ERODE = 2;

const kinds = fs.readdirSync('public/art').filter(f => /^drop-.*\.webp$/.test(f)).map(f => f.slice(5, -5)).sort();
const near = (mask, w, h, r) => { // dilate by r (square)
  const out = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (!mask[y * w + x]) continue;
    for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { const nx = x + dx, ny = y + dy; if (nx >= 0 && ny >= 0 && nx < w && ny < h) out[ny * w + nx] = 1; }
  }
  return out;
};
const erode = (mask, w, h, r) => {
  const out = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let ok = 1;
    for (let dy = -r; dy <= r && ok; dy++) for (let dx = -r; dx <= r; dx++) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= w || ny >= h || !mask[ny * w + nx]) { ok = 0; break; } }
    out[y * w + x] = ok;
  }
  return out;
};
/** connected pieces of a mask (8-neighbour), largest first: each a list of pixel indexes */
function pieces(mask, w, h) {
  const label = new Int32Array(w * h).fill(-1), out = [];
  for (let s = 0; s < w * h; s++) {
    if (!mask[s] || label[s] >= 0) continue;
    const px = [s]; label[s] = out.length;
    for (let q = 0; q < px.length; q++) {
      const x = px[q] % w, y = (px[q] - x) / w;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const n = ny * w + nx; if (mask[n] && label[n] < 0) { label[n] = out.length; px.push(n); }
      }
    }
    out.push(px);
  }
  return out.sort((a, b) => b.length - a.length);
}

const rows = [], notes = [];
let bytes = 0;
for (const k of kinds) {
  const { data, info } = await sharp(`public/art/drop-${k}.webp`).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info, solid = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) solid[i] = data[i * 4 + 3] > 110 ? 1 : 0;
  // the main body: shave the mask a little (so sparks that only just touch come loose), take the big pieces, grow them
  // back inside the original mask
  const core = pieces(erode(solid, w, h, ERODE), w, h);
  const keepN = KEEP[k] ?? core.filter(b => b.length >= core[0].length / 4).length;
  const kept = new Uint8Array(w * h);
  for (const b of core.slice(0, keepN)) for (const p of b) kept[p] = 1;
  let body = kept;
  for (let i = 0; i < ERODE + 1; i++) { const g = near(body, w, h, 1); for (let p = 0; p < w * h; p++) g[p] &= solid[p]; body = g; }
  if (core.length > 1 && core[1].length >= core[0].length / 12) notes.push(`${k}: pieces ${core.slice(0, 4).map(b => b.length).join(' / ')} → kept ${keepN}`);
  // keep the body's own soft edge (one pixel of the fainter rim), drop everything else
  const rim = near(body, w, h, 1), out = Buffer.from(data);
  let x0 = w, y0 = h, x1 = 0, y1 = 0;
  for (let p = 0; p < w * h; p++) {
    if (!rim[p]) { out[p * 4 + 3] = 0; continue; }
    if (out[p * 4 + 3] > 20) { const x = p % w, y = (p - x) / w; x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  }
  const cw = x1 - x0 + 1, ch = y1 - y0 + 1, sc = SIZE / Math.max(cw, ch);
  const file = `public/art/gb-${k}.webp`;
  await sharp(out, { raw: { width: w, height: h, channels: 4 } }).extract({ left: x0, top: y0, width: cw, height: ch })
    .resize(Math.max(1, Math.round(cw * sc)), Math.max(1, Math.round(ch * sc)), { fit: 'fill' }).webp({ quality: 90, alphaQuality: 100 }).toFile(file);
  bytes += fs.statSync(file).size;
  // measure the sprite as written
  const m = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = m.info.width, H = m.info.height, px = [];
  for (let p = 0; p < W * H; p++) if (m.data[p * 4 + 3] > 110) px.push(p);
  let mx = 0, my = 0; for (const p of px) { mx += p % W; my += (p - p % W) / W; } mx /= px.length; my /= px.length;
  // the long axis: the direction the shape is spread along most, and its extent along and across it
  let sxx = 0, syy = 0, sxy = 0;
  for (const p of px) { const x = p % W - mx, y = (p - p % W) / W - my; sxx += x * x; syy += y * y; sxy += x * y; }
  const ang = 0.5 * Math.atan2(2 * sxy, sxx - syy), c = Math.cos(ang), s = Math.sin(ang);
  let a0 = 1e9, a1 = -1e9, b0 = 1e9, b1 = -1e9;
  for (const p of px) { const x = p % W - mx, y = (p - p % W) / W - my, a = x * c + y * s, b = -x * s + y * c; a0 = Math.min(a0, a); a1 = Math.max(a1, a); b0 = Math.min(b0, b); b1 = Math.max(b1, b); }
  const ca = (a0 + a1) / 2, cb = (b0 + b1) / 2, cx = mx + ca * c - cb * s, cy = my + ca * s + cb * c;
  // how far from that centre the shape reaches: the radius that holds 90% of it (a round badge may clip the last corners)
  const rad = px.map(p => Math.hypot(p % W - cx, (p - p % W) / W - cy)).sort((p, q) => p - q);
  rows.push({ k, v: [W, H, +cx.toFixed(1), +cy.toFixed(1), Math.round(ang * 180 / Math.PI), +(a1 - a0 + 1).toFixed(1), +(b1 - b0 + 1).toFixed(1), px.length, +rad[Math.floor(rad.length * 0.9)].toFixed(1)] });
}
const ts = `// GENERATED by scripts/garnish-bounds.mjs from public/art/drop-*.webp: do not edit by hand, run the script.
// The shape of every drop's badge sprite (public/art/gb-<kind>.webp: the drop's main body, sparks and puddles removed),
// for the Garnish badge (src/ui/garnishBadge.ts fits the icon to it):
// [sprite w, sprite h, long-axis centre x, y, long-axis angle (degrees, 0 = lying flat, positive = its right end is
//  lower), length along the axis, thickness across it, opaque pixels, the radius from that centre that holds 90% of the
//  shape]. All in sprite pixels.
export type GarnishBounds = readonly [number, number, number, number, number, number, number, number, number];
export const GARNISH_BOUNDS: Record<string, GarnishBounds> = {
${rows.map(r => `  ${/^[a-z_$][\w$]*$/i.test(r.k) ? r.k : JSON.stringify(r.k)}: [${r.v.join(', ')}],`).join('\n')}
};
`;
fs.writeFileSync('src/ui/garnishBounds.ts', ts);
// the art manifest, exactly as scripts/process-art.mjs writes it
const manifest = fs.readdirSync('public/art').filter(f => f.endsWith('.webp')).map(f => f.replace(/\.webp$/, '')).sort();
fs.writeFileSync('public/art/manifest.json', JSON.stringify(manifest, null, 1) + '\n');
console.log(`${rows.length} badge sprites → public/art/gb-*.webp (${(bytes / 1024).toFixed(0)} KB in all), src/ui/garnishBounds.ts, manifest: ${manifest.length} images`);
console.log('drops with a second sizeable piece (check them on the sheet; KEEP in this script overrides):\n  ' + (notes.join('\n  ') || 'none'));
console.log('REMINDER: run this after adding or changing drop art, then `npx vite-node scripts/garnish-sheet.ts` and look at shots/garnish/badges-4x-*.png');
