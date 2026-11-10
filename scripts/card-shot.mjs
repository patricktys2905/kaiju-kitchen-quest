// Stage card with Hard + Nightmare unlocked: node scripts/card-shot.mjs [stage] → shots/card.png
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';
const PORT = 5320, url = `http://localhost:${PORT}/?touch`, stage = process.argv[2] ?? '1-4';
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
const wait = ms => new Promise(r => setTimeout(r, ms));
await wait(3000);
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const p = await (await b.newContext({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true })).newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(url); await p.evaluate(() => localStorage.clear()); await p.reload();
for (let i = 0; i < 60; i++) { if (await p.evaluate(() => !!window.__kkq).catch(() => false)) break; await wait(250); }
await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(600);
await p.evaluate(() => { const s = window.__kkq.save; const h = s.heroes[0]; h.level = 20; for (let n = 1; n <= 10; n++) { h.cleared['1-' + n] = 'A'; h.hardCleared['1-' + n] = 'B'; } s.hard = true; s.nightmare = true; s.keys = [1]; window.__kkq.scene.scene.restart({}); });
await wait(900);
await p.evaluate(id => document.querySelector(`[data-node="${id}"]`)?.click(), stage); await wait(400);
await p.screenshot({ path: 'shots/card.png' });
console.log(errs.length ? errs : 'no errors'); await b.close(); server.kill(); process.exit(0);
