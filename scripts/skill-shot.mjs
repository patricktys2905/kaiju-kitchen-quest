// Every kaiju casts each of its 3 skills in front of a few monsters: shots/skills-<species>-<slot>.png + shots/skills-sheet.png
// Usage: node scripts/skill-shot.mjs [species...]
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';
import sharp from 'sharp';
const PORT = 5315, url = `http://localhost:${PORT}/?touch`;
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
for (const sp of species) for (const slot of [0, 1, 2]) {
  await p.evaluate(async sp => { const { skillsOf } = await import('/src/sim/skills.ts'); const s = window.__kkq.save; if (!s.unlocked.includes(sp)) s.unlocked.push(sp); s.selected = sp; const h = s.heroes[sp]; h.level = 12; for (const a of skillsOf(sp).actives) h.skills[a.id] = 2; }, sp);
  await p.evaluate(() => window.__kkq.play('1-1'));
  await wait(1300);
  const name = await p.evaluate(([sp, slot]) => {
    const w = window.__kkq.world(), h = w.hero;
    for (const m of w.mobs) { m.hp = 0; m.state = 'dead'; m.deadT = 0.69; }
    h.x = 500; h.face = 1; h.inv = 99;
    for (const dx of [70, 150, 240]) w.spawnMob('bun', h.x + dx, 3);
    w.spawnMob('pepper', h.x + 330, 3);
    const sk = h.d.cls && Object.keys(h.d.skillLv);
    h.cds = [0, 0, 0];
    return sk ? '' : '';
  }, [sp, slot]);
  void name;
  await wait(300);
  await p.keyboard.press(['KeyL', 'KeyI', 'KeyO'][slot]);
  await wait(slot === 2 ? 450 : 300);
  const f = `shots/skills-${sp}-${slot}.png`;
  await p.screenshot({ path: f });
  files.push(f);
}
// contact sheet: 3 columns (slots), one row per kaiju
const W = 560, H = 230;
const tiles = await Promise.all(files.map(async (f, i) => ({ input: await sharp(f).extract({ left: 140, top: 60, width: 560, height: 230 }).toBuffer(), left: (i % 3) * W, top: Math.floor(i / 3) * H })));
await sharp({ create: { width: 3 * W, height: Math.ceil(files.length / 3) * H, channels: 3, background: '#000' } }).composite(tiles).png().toFile('shots/skills-sheet.png');
console.log(files.length, 'shots', errs.length ? errs : 'no errors');
await b.close();
server.kill();
process.exit(0);
