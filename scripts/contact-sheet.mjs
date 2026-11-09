// Contact sheet of raw art for review: node scripts/contact-sheet.mjs <prefix> [out] [cols]
// e.g. node scripts/contact-sheet.mjs still- shots/stills-sheet.png 4
import fs from 'node:fs';
import sharp from 'sharp';
const [prefix = 'still-', out = 'shots/sheet.png', colsArg = '4'] = process.argv.slice(2);
const files = fs.readdirSync('art-src/raw').filter(f => f.startsWith(prefix) && f.endsWith('.png')).sort();
const cols = Number(colsArg), W = 400, H = prefix.startsWith('mob') ? 400 : 225, L = 22;
const rows = Math.ceil(files.length / cols);
const tiles = await Promise.all(files.map(async (f, i) => {
  const img = await sharp(`art-src/raw/${f}`).resize(W, H, { fit: 'contain', background: '#222' }).png().toBuffer();
  const label = Buffer.from(`<svg width="${W}" height="${L}"><rect width="100%" height="100%" fill="#000"/><text x="6" y="16" font-size="15" font-family="Arial" fill="#fff">${f}</text></svg>`);
  return [{ input: img, left: (i % cols) * W, top: Math.floor(i / cols) * (H + L) + L }, { input: label, left: (i % cols) * W, top: Math.floor(i / cols) * (H + L) }];
}));
await sharp({ create: { width: cols * W, height: rows * (H + L), channels: 3, background: '#111' } }).composite(tiles.flat()).png().toFile(out);
console.log(`${files.length} images → ${out}`);
