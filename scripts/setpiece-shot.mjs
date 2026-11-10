// Set pieces in play: node scripts/setpiece-shot.mjs → shots/sp-arena.png, sp-chase.png, sp-belt.png
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';
const PORT = 5322, url = `http://localhost:${PORT}/?touch`;
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
const wait = ms => new Promise(r => setTimeout(r, ms));
await wait(3000);
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const p = await (await b.newContext({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true })).newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(url); await p.evaluate(() => localStorage.clear()); await p.reload();
for (let i = 0; i < 60; i++) { if (await p.evaluate(() => !!window.__kkq).catch(() => false)) break; await wait(250); }
await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(600);
await p.evaluate(() => { const s = window.__kkq.save; s.heroes[0].level = 30; s.storyMode = 'key'; });
// arena: walk in
await p.evaluate(() => window.__kkq.play('2-3')); await wait(1600);
await p.evaluate(() => { const w = window.__kkq.world(), a = w.arenas[0]; w.hero.inv = 9999; w.hero.x = (a.x0 + a.x1) / 2; for (const m of w.mobs) if (m.arena < 0) { m.hp = 0; m.state = 'dead'; } });
await wait(1400);
await p.evaluate(() => { const w = window.__kkq.world(); for (const m of w.mobs) if (m.arena === 0) { m.hp = 0; m.state = 'dead'; } });
await wait(1300);
await p.screenshot({ path: 'shots/sp-arena.png' });
// chase
await p.evaluate(() => window.__kkq.play('1-2')); await wait(1600);
await p.evaluate(() => { const w = window.__kkq.world(); w.hero.inv = 9999; w.hero.x = w.chase.x0 + 10; });
await wait(1700);
await p.screenshot({ path: 'shots/sp-chase.png' });
// belt
await p.evaluate(() => window.__kkq.play('2-6')); await wait(1600);
await p.evaluate(() => { const w = window.__kkq.world(), b = w.stage.belts[0]; w.hero.inv = 9999; w.hero.x = b.x - b.w / 2 + 30; });
await wait(900);
await p.screenshot({ path: 'shots/sp-belt.png' });
console.log(errs.length ? errs : 'no errors'); await b.close(); server.kill(); process.exit(0);
