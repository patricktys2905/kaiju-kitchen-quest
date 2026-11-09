// Mothball flies: trims the feet Gemini painted onto its body piece and redraws a round belly outline.
// art-src/old/parts-4-v1.png → art-src/raw/parts-4.png (same layout, so the rig still lines up).
import sharp from 'sharp';
const E = { cx: 705, cy: 556, rx: 186, ry: 134 }; // the belly ellipse (raw sheet px)
let buf = await sharp('art-src/old/parts-4-v1.png').ensureAlpha().png().toBuffer();
// 1) fluff over the part of the front foot that overlaps the body
const w = 110, h = 90, x = 585, y = 600;
const mask = Buffer.from(`<svg width="${w}" height="${h}"><defs><filter id="f"><feGaussianBlur stdDeviation="6"/></filter></defs><ellipse cx="${w / 2}" cy="${h / 2}" rx="${w / 2 - 8}" ry="${h / 2 - 8}" fill="#fff" filter="url(#f)"/></svg>`);
const patch = await sharp(buf).extract({ left: x + 40, top: y - 90, width: w, height: h }).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
buf = await sharp(buf).composite([{ input: patch, left: x, top: y }]).png().toBuffer();
// 2) everything below the belly curve (the feet) becomes backdrop
const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
for (let py = 600; py < info.height; py++) for (let px = 540; px < 800; px++) {
  const dx = (px - E.cx) / E.rx, dy = (py - E.cy) / E.ry;
  if (dx * dx + dy * dy > 1) { const i = (py * info.width + px) * info.channels; data[i] = 255; data[i + 1] = 0; data[i + 2] = 255; if (info.channels === 4) data[i + 3] = 255; }
}
buf = await sharp(data, { raw: info }).png().toBuffer();
// 3) outline along the new bottom edge
const arc = Buffer.from(`<svg width="${info.width}" height="${info.height}"><defs><clipPath id="c"><rect x="540" y="610" width="260" height="200"/></clipPath></defs>
  <ellipse cx="${E.cx}" cy="${E.cy}" rx="${E.rx - 3}" ry="${E.ry - 3}" fill="none" stroke="#5b2d5e" stroke-width="7" clip-path="url(#c)"/></svg>`);
await sharp(buf).composite([{ input: arc }]).png().toFile('art-src/raw/parts-4.png');
console.log('patched parts-4 (feet removed)');
