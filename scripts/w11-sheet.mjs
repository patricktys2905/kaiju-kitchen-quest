// Review sheet of processed art (public/art) on the game's dark panel colour, with an optional small in-game-size row.
// node scripts/w11-sheet.mjs <out.png> <size> <cols> <name> [name...]   (names without .webp; "raw:<name>" reads art-src/raw)
import fs from 'node:fs';
import sharp from 'sharp';
const [out, sizeArg, colsArg, ...names] = process.argv.slice(2);
const S = Number(sizeArg), cols = Number(colsArg), L = S >= 100 ? 18 : 0, wide = names.some(n => n.includes('still-') || n.includes('bg-'));
const W = wide ? Math.round(S * 16 / 9) : S;
const rows = Math.ceil(names.length / cols);
const tiles = [];
for (const [i, n] of names.entries()) {
  const f = n.startsWith('raw:') ? `art-src/raw/${n.slice(4)}.png` : `public/art/${n}.webp`;
  if (!fs.existsSync(f)) continue;
  const img = await sharp(f).resize(W - 8, S - 8, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  const x = (i % cols) * W, y = Math.floor(i / cols) * (S + L);
  tiles.push({ input: img, left: x + 4, top: y + L + 4 });
  if (L) tiles.push({ input: Buffer.from(`<svg width="${W}" height="${L}"><rect width="100%" height="100%" fill="#000"/><text x="4" y="13" font-size="12" font-family="Arial" fill="#fff">${n}</text></svg>`), left: x, top: y });
}
await sharp({ create: { width: cols * W, height: rows * (S + L), channels: 3, background: '#3a2448' } }).composite(tiles).png().toFile(out);
console.log(`${names.length} -> ${out}`);
