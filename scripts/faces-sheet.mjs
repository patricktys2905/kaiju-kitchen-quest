// Contact sheet of expression portraits: node scripts/faces-sheet.mjs → shots/faces-sheet.png (neutral + 4 moods per row)
import fs from 'node:fs';
import sharp from 'sharp';
const SP = (process.argv[2] ?? '0,10,11,4,1,2,5,6,7,8,15,17').split(',').map(Number), MO = ['', 'happy', 'angry', 'shocked', 'sad'], H = 160;
const comp = [];
for (const [r, sp] of SP.entries()) for (const [c, m] of MO.entries()) {
  const f = `public/art/${m ? `face-${sp}-${m}` : `kaiju-${sp}`}.webp`;
  if (!fs.existsSync(f)) continue;
  comp.push({ input: await sharp(f).resize({ height: H, width: H, fit: 'contain', background: '#0000' }).png().toBuffer(), left: c * (H + 8) + 4, top: r * (H + 8) + 4 });
}
await sharp({ create: { width: 5 * (H + 8), height: SP.length * (H + 8), channels: 4, background: '#3a2448' } }).composite(comp).png().toFile('shots/faces-sheet.png');
