// QA: contact sheets of the story shots (shots/qa2/story/*.jpg) → shots/qa2/story-sheet-<beat>.png
import fs from 'node:fs';
import sharp from 'sharp';
const d = JSON.parse(fs.readFileSync('shots/qa2/story-measure-844.json', 'utf8'));
const TW = 422, TH = 195, COLS = 4;
async function sheet(name, items) {
  const rows = Math.ceil(items.length / COLS), comp = [];
  for (let i = 0; i < items.length; i++) {
    const { file, label } = items[i], x = (i % COLS) * TW, y = Math.floor(i / COLS) * TH;
    comp.push({ input: await sharp(file).resize(TW, TH).png().toBuffer(), left: x, top: y });
    comp.push({ input: Buffer.from(`<svg width="${label.length * 7 + 8}" height="15"><rect width="100%" height="100%" fill="black"/><text x="4" y="11" font-size="11" font-family="Arial" fill="yellow">${label}</text></svg>`), left: x, top: y });
  }
  await sharp({ create: { width: COLS * TW, height: rows * TH, channels: 3, background: '#000' } }).composite(comp).png().toFile(`shots/qa2/story-sheet-${name}.png`);
}
const beats = [...new Set(d.out.map(r => r.beat))];
for (const b of beats) await sheet(b, d.out.filter(r => r.beat === b).map(r => ({ file: `shots/qa2/story/${r.sp}-${b}-0.jpg`, label: `${r.sp} ${r.name}` })));
const right = []; for (const r of d.out) if (r.beat === 'w11-after' || r.beat === 'w11-s7') r.lines.forEach((m, i) => { if (m.right) right.push({ file: `shots/qa2/story/${r.sp}-${r.beat}-${i}.jpg`, label: `${r.sp} ${r.name} ${r.beat.slice(4)} #${i + 1}` }); });
await sheet('right-portraits', right);
console.log('sheets:', beats.length + 1);
