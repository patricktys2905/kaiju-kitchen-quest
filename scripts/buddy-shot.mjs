// CPU buddy: node scripts/buddy-shot.mjs → shots/buddy-card.png, buddy-fight.png, buddy-revive.png
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';
const PORT = 5323, url = `http://localhost:${PORT}/?touch`;
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
const wait = ms => new Promise(r => setTimeout(r, ms));
await wait(3000);
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const p = await (await b.newContext({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true })).newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(url); await p.evaluate(() => localStorage.clear()); await p.reload();
for (let i = 0; i < 60; i++) { if (await p.evaluate(() => !!window.__kkq).catch(() => false)) break; await wait(250); }
await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(600);
await p.evaluate(() => { const s = window.__kkq.save; s.heroes[0].level = 8; s.buddy = 10; s.storyMode = 'key'; for (let n = 1; n <= 3; n++) s.heroes[0].cleared['1-' + n] = 'A'; window.__kkq.scene.scene.restart({}); });
await wait(900);
await p.evaluate(() => document.querySelector('[data-node="1-4"]')?.click()); await wait(400);
await p.screenshot({ path: 'shots/buddy-card.png' });
await p.evaluate(() => window.__kkq.play('1-4')); await wait(1500);
await p.evaluate(() => { const w = window.__kkq.world(); w.heroes[0].inv = 9999; w.heroes[0].x = 640; });
await wait(3500);
await p.screenshot({ path: 'shots/buddy-fight.png' });
await p.evaluate(() => { const w = window.__kkq.world(), h = w.heroes[0]; for (const m of w.mobs) { m.hp = 0; m.state = 'dead'; } h.inv = 0; h.hp = 0; h.state = 'down'; h.t = 0; });
await wait(1800);
await p.screenshot({ path: 'shots/buddy-revive.png' });
console.log(errs.length ? errs : 'no errors'); await b.close(); server.kill(); process.exit(0);
