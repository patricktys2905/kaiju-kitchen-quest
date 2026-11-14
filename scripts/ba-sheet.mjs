// Before/after contact sheet: node scripts/ba-sheet.mjs <out.png> <tileWidth> <pairsPerRow> <beforePrefix> <afterPrefix> <name...>
// Each name is a file suffix: <beforePrefix><name> on the left, <afterPrefix><name> on the right, labelled.
import sharp from 'sharp';
const [out, tw, ppr, bp, ap, ...names] = process.argv.slice(2); const TW = +tw, PPR = +ppr;
const tiles = [];
for (const n of names) for (const [pre, tag] of [[bp, 'BEFORE'], [ap, 'AFTER']]) {
  try { const buf = await sharp(pre + n).resize({ width: TW }).png().toBuffer(); tiles.push({ buf, h: (await sharp(buf).metadata()).height, label: `${tag} ${n.replace(/\.png$/, '')}`, tag }); }
  catch (e) { console.log('skip', pre + n, e.message); tiles.push(null); }
}
const th = Math.max(...tiles.filter(Boolean).map(t => t.h)) + 16, cols = PPR * 2, rows = Math.ceil(tiles.length / cols), comp = [];
tiles.forEach((t, i) => { if (!t) return; const x = (i % cols) * TW, y = Math.floor(i / cols) * th; comp.push({ input: t.buf, left: x, top: y + 16 });
  comp.push({ input: Buffer.from(`<svg width="${TW}" height="16"><rect width="100%" height="100%" fill="${t.tag === 'AFTER' ? '#14532d' : '#7f1d1d'}"/><text x="4" y="12" font-size="12" font-family="Arial" fill="#fff">${t.label}</text></svg>`), left: x, top: y }); });
await sharp({ create: { width: cols * TW, height: rows * th, channels: 3, background: '#000' } }).composite(comp).png().toFile(out);
console.log(out, names.length, 'pairs');
