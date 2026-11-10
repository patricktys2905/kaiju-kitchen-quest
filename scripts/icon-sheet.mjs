// Contact sheet of processed icons from a jobs file, for reviewing art in one look.
// node scripts/icon-sheet.mjs art-src/jobs-weapons2.json → shots/icon-sheet.png
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';
const jobs = JSON.parse(fs.readFileSync(process.argv[2] ?? 'art-src/jobs-weapons2.json', 'utf8'));
const url = f => 'file:///' + path.resolve(f).replace(/\\/g, '/');
const html = `<body style="margin:0;background:#2a1a30;display:grid;grid-template-columns:repeat(8,150px);gap:6px;padding:6px;font:11px sans-serif;color:#fff">${
  jobs.map(j => `<div style="text-align:center"><img src="${url(`public/art/${j.name}.webp`)}" style="width:130px;height:130px;object-fit:contain;background:#3a2448"><br>${j.name}</div>`).join('')}</body>`;
fs.writeFileSync('shots/icon-sheet.html', html);
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
const p = await b.newPage({ viewport: { width: 1270, height: 900 } });
await p.goto(url('shots/icon-sheet.html')); await p.waitForTimeout(800);
await p.screenshot({ path: 'shots/icon-sheet.png', fullPage: true });
await b.close();
console.log('shots/icon-sheet.png');
