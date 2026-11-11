// The skill tree screen on a phone: learn down a path, unlock its new skill, put it on a button.
// node scripts/tree-shot.mjs → shots/tree-*.png
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';
const PORT = 5401, base = `http://localhost:${PORT}/?touch`;
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
const wait = ms => new Promise(r => setTimeout(r, ms));
await wait(3000);
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const p = await (await b.newContext({ viewport: { width: 852, height: 393 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })).newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(base); await p.evaluate(() => localStorage.clear()); await p.reload();
for (let i = 0; i < 60 && !await p.evaluate(() => !!window.__kkq); i++) await wait(250);
await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(800);
// The in-stage bag: node scripts/bag-shot.mjs -> shots/bag-1.png (button) and shots/bag-2.png (open)
await p.evaluate(() => { const s = window.__kkq.save; s.selected = 0; s.storyMode = 'key'; s.heroes[0].level = 20; s.heroes[0].seen.push('intro', 'w2-open', 'w2-s3'); s.tips = ['move', 'jump', 'attack', 'dodge', 'skill', 'gear', 'ladder', 'drop', 'arena', 'hazard', 'sponge', 'potion', 'boss', 'exit']; s.drops = { pea: 4, yogurt: 2, bun: 7 }; });
await p.evaluate(() => window.__kkq.play('2-3')); await wait(3000);
await p.screenshot({ path: 'shots/bag-1.png' });
await p.evaluate(() => document.querySelector('#hud .bagb')?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))); await wait(500);
await p.screenshot({ path: 'shots/bag-2.png' });
const paused = await p.evaluate(() => { const t = window.__kkq.world().time; return new Promise(r => setTimeout(() => r(window.__kkq.world().time === t), 600)); });
await p.evaluate(() => document.querySelector('#bagov [data-bagclose]')?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))); await wait(400);
const shut = await p.evaluate(() => !document.getElementById('bagov').classList.contains('on'));
console.log('paused while open', paused, 'closed', shut, errs.length ? errs : 'no errors'); await b.close(); server.kill();
