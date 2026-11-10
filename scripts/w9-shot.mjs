// World 5 screenshots: node scripts/w9-shot.mjs → shots/w9-map.png, w9-stage.png, w9-boss.png, w9-end-*.png
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';
const PORT = 5343, url = `http://localhost:${PORT}/?touch`;
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
const wait = ms => new Promise(r => setTimeout(r, ms));
await wait(3000);
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const p = await (await b.newContext({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })).newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(url); await p.evaluate(() => localStorage.clear()); await p.reload();
for (let i = 0; i < 60; i++) { if (await p.evaluate(() => !!window.__kkq).catch(() => false)) break; await wait(250); }
await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(600);
await p.evaluate(() => {
  const s = window.__kkq.save, h = s.heroes[0];
  h.level = 96; s.storyMode = 'key';
  for (let w = 1; w <= 8; w++) for (let n = 1; n <= 10; n++) h.cleared[`${w}-${n}`] = 'A';
  for (let n = 1; n <= 5; n++) h.cleared[`9-${n}`] = 'B';
  h.seen.push('intro');
  window.__kkq.scene.scene.restart({});
});
await wait(900);
await p.evaluate(() => document.querySelector('[data-mappage="7"]')?.click()); await wait(500);
await p.screenshot({ path: 'shots/w9-map.png' });
await p.evaluate(() => window.__kkq.play('9-3')); await wait(1800);
await p.evaluate(() => { const w = window.__kkq.world(); w.hero.inv = 9999; w.hero.x = 900; });
await wait(2500);
await p.screenshot({ path: 'shots/w9-stage.png' });
await p.evaluate(() => window.__kkq.play('9-10')); await wait(1800);
await p.evaluate(() => { const w = window.__kkq.world(); w.hero.inv = 9999; w.hero.x = 700; });
await wait(4000);
await p.screenshot({ path: 'shots/w9-boss.png' });
// the ending: the hero's own end scene, credits, then the Leftovers
await p.evaluate(() => import('/src/ui/story.ts').then(m => { window.__done = false; m.playStory(2, ['w9-open', 'w9-boss', 'w9-after'], () => { window.__done = true; }); }));
let n = 0;
for (let i = 0; i < 40 && !(await p.evaluate(() => window.__done)); i++) {
  await wait(1800);
  const credits = await p.evaluate(() => !!document.getElementById('credits'));
  if (credits) { await wait(4000); await p.screenshot({ path: 'shots/w9-end-credits.png' }); await p.evaluate(() => document.querySelector('#credits .skip')?.click()); await wait(900); continue; }
  await p.screenshot({ path: `shots/w9-end-${n++}.png` });
  await p.locator('#story').click({ position: { x: 420, y: 150 } });
}
console.log(n, 'story shots', errs.length ? errs : 'no errors'); await b.close(); server.kill(); process.exit(0);
