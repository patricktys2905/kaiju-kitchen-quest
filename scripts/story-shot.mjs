// The story player with the painted scenes: node scripts/story-shot.mjs → shots/story-*.png
// (Bluebeary: a shared stage scene with its portrait in front, then its own stage-5 painting with the nemesis)
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';
const PORT = 5338, base = `http://localhost:${PORT}/?touch`;
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
const wait = ms => new Promise(r => setTimeout(r, ms));
await wait(3000);
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const p = await (await b.newContext({ viewport: { width: 852, height: 393 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })).newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(base); await p.evaluate(() => localStorage.clear()); await p.reload();
for (let i = 0; i < 60 && !await p.evaluate(() => !!window.__kkq); i++) await wait(250);
await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(1200);
for (const [stage, shot] of [['1-4', 'scene'], ['2-5', 'elite']]) {
  await p.evaluate(stage => { const s = window.__kkq.save; s.selected = 10; s.storyMode = 'full'; const h = s.heroes[10]; h.level = 20; for (let w = 1; w <= 2; w++) for (let n = 1; n <= 10; n++) h.cleared[`${w}-${n}`] = 'A'; h.seen = ['intro']; window.__kkq.scene.scene.restart({}); window.__selStage = stage; }, stage);
  await wait(700);
  await p.evaluate(stage => { const [w] = stage.split('-'); const pages = [...document.querySelectorAll('[data-mappage]')]; pages[w > 4 ? 1 : 0]?.click(); }, stage); await wait(300);
  await p.evaluate(stage => document.querySelector(`[data-node="${stage}"]`)?.click(), stage); await wait(300);
  await p.evaluate(stage => document.querySelector(`[data-play="${stage}"]`)?.click(), stage); await wait(1600);
  await p.screenshot({ path: `shots/story-${shot}.png` });
  console.log(shot, await p.evaluate(() => ({ still: getComputedStyle(document.querySelector('#story .still i') ?? document.body).backgroundImage.match(/still-[^.]+/)?.[0] ?? 'none', left: !!document.querySelector('#story .por.l'), right: !!document.querySelector('#story .por.r') })));
  await p.evaluate(() => document.querySelector('#story .skip, #story [data-skip]')?.click()); await wait(800);
  await p.evaluate(() => window.__kkq.scene.scene.restart({})); await wait(600);
}
console.log(errs.length ? errs : 'no errors');
await b.close(); server.kill();
