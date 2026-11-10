// Each kaiju vs its nemesis (World 4 version) mid-move: node scripts/nemesis-shot.mjs [species...] → shots/nemesis-<sp>.png + shots/nemesis-sheet.png
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';
import sharp from 'sharp';
const PORT = 5316, url = `http://localhost:${PORT}/?touch`;
const ALL = [0, 10, 11, 4, 1, 2, 5, 6, 7, 8, 15, 17];
const species = process.argv.slice(2).length ? process.argv.slice(2).map(Number) : ALL;
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
const wait = ms => new Promise(r => setTimeout(r, ms));
await wait(3000);
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const ctx = await b.newContext({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', e => errs.push(e.message));
await p.goto(url);
await p.evaluate(() => localStorage.clear());
await p.reload();
for (let i = 0; i < 60; i++) { if (await p.evaluate(() => !!window.__kkq).catch(() => false)) break; await wait(250); }
await p.evaluate(() => document.querySelector('#title .play')?.click());
await wait(600);
const files = [];
for (const sp of species) {
  await p.evaluate(sp => { const s = window.__kkq.save; if (!s.unlocked.includes(sp)) s.unlocked.push(sp); s.selected = sp; s.heroes[sp].level = 45; }, sp);
  await p.evaluate(() => window.__kkq.play('4-5'));
  await wait(1400);
  await p.evaluate(() => {
    const w = window.__kkq.world(), h = w.hero;
    const n = w.mobs.find(m => m.phase && m.kind.startsWith('n') && m.kind.length > 3 && m.elite);
    for (const m of w.mobs) if (m !== n) { m.hp = 0; m.state = 'dead'; m.deadT = 0.69; }
    h.inv = 99; h.hp = h.d.maxHp;
    if (n) { h.x = n.x - 200; h.y = w.stage.groundY; h.face = 1; n.t = 5; }
  });
  await wait(1500);
  const f = `shots/nemesis-${sp}.png`;
  await p.screenshot({ path: f });
  files.push(f);
}
const W = 560, H = 260;
const tiles = await Promise.all(files.map(async (f, i) => ({ input: await sharp(f).extract({ left: 140, top: 40, width: W, height: H }).toBuffer(), left: (i % 3) * W, top: Math.floor(i / 3) * H })));
await sharp({ create: { width: 3 * W, height: Math.ceil(files.length / 3) * H, channels: 3, background: '#000' } }).composite(tiles).png().toFile('shots/nemesis-sheet.png');
console.log(files.length, 'shots', errs.length ? errs : 'no errors');
await b.close();
server.kill();
process.exit(0);
