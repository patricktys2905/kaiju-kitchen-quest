// A stage's boss room with its foe awake: node scripts/room-shot.mjs 1-1 1-3 → shots/room-<stage>.png
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';
const PORT = 5323, url = `http://localhost:${PORT}/?touch`, stages = process.argv.slice(2).length ? process.argv.slice(2) : ['1-1', '1-3'];
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
const wait = ms => new Promise(r => setTimeout(r, ms));
await wait(3000);
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const p = await (await b.newContext({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true })).newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(url); await p.evaluate(() => localStorage.clear()); await p.reload();
for (let i = 0; i < 60; i++) { if (await p.evaluate(() => !!window.__kkq).catch(() => false)) break; await wait(250); }
await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(600);
for (const id of stages) {
  await p.evaluate(id => { window.__kkq.save.heroes[0].level = 30; window.__kkq.play(id); }, id);
  await wait(1800);
  await p.evaluate(() => { const w = window.__kkq.world(); w.skipToBoss(); w.hero.inv = 9999; const f = w.mobs[0]; w.hero.x = f.x - 260; });
  await wait(2500);
  await p.screenshot({ path: `shots/room-${id}.png` });
}
console.log(errs.length ? errs : 'no errors'); await b.close(); server.kill(); process.exit(0);
