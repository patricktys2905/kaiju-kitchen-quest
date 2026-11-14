// QA contact sheet: node scripts/qa-sheet.mjs <out.png> <cols> <tileWidth> <files...>  (each tile labelled with its file name)
import sharp from 'sharp'; import path from 'node:path';
const [out, cols, tw, ...files] = process.argv.slice(2); const C = +cols, TW = +tw;
const tiles = [];
for (const f of files) { try { const img = sharp(f).resize({ width: TW }); const buf = await img.png().toBuffer(); const m = await sharp(buf).metadata(); tiles.push({ f, buf, h: m.height }); } catch (e) { console.log('skip', f, e.message); } }
const th = Math.max(...tiles.map(t => t.h)) + 16, rows = Math.ceil(tiles.length / C);
const comp = [];
tiles.forEach((t, i) => { const x = (i % C) * TW, y = Math.floor(i / C) * th; comp.push({ input: t.buf, left: x, top: y + 16 });
  comp.push({ input: Buffer.from(`<svg width="${TW}" height="16"><rect width="100%" height="100%" fill="#222"/><text x="4" y="12" font-size="12" font-family="Arial" fill="#fff">${path.basename(t.f).replace(/&/g, '+')}</text></svg>`), left: x, top: y }); });
await sharp({ create: { width: C * TW, height: rows * th, channels: 3, background: '#000' } }).composite(comp).png().toFile(out);
console.log(out, tiles.length, 'tiles');
