// The skill tree screen on a phone: learn down a path, unlock its new skill, put it on a button.
// node scripts/tree-shot.mjs → shots/tree-*.png
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';
const PORT = 5395, base = `http://localhost:${PORT}/?touch`;
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
const wait = ms => new Promise(r => setTimeout(r, ms));
await wait(3000);
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const p = await (await b.newContext({ viewport: { width: 852, height: 393 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })).newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(base); await p.evaluate(() => localStorage.clear()); await p.reload();
for (let i = 0; i < 60 && !await p.evaluate(() => !!window.__kkq); i++) await wait(250);
await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(800);
await p.evaluate(() => { const s = window.__kkq.save; s.selected = 10; const h = s.heroes[10]; h.level = 30; h.skillPts = 20; window.__kkq.scene.scene.restart({}); }); await wait(700);
await p.evaluate(() => document.querySelector('[data-tab="skills"]')?.click()); await wait(300);
await p.screenshot({ path: 'shots/tree-1.png' });
// learn down the first path: click each node and LEARN while possible
for (let k = 0; k < 40; k++) {
  const done = await p.evaluate(() => { if (document.querySelector('[data-learn]:not([disabled])')) { document.querySelector('[data-learn]:not([disabled])').click(); return false; } const n = document.querySelector('.tpath .tnode.can:not(.sel)'); if (!n) return true; n.click(); return false; });
  if (done) break; await wait(100);
}
await p.evaluate(() => [...document.querySelectorAll('.tnode.skill')].find(n => n.classList.contains('got'))?.click()); await wait(200);
await p.screenshot({ path: 'shots/tree-2.png' });
await p.evaluate(() => document.querySelector('[data-act="sv-skills"]')?.click()); await wait(200);
await p.evaluate(() => document.querySelector('[data-slot="0"]')?.click()); await wait(200);
const choices = await p.evaluate(() => [...document.querySelectorAll('[data-equipskill]')].map(b => b.textContent.trim()));
await p.evaluate(() => [...document.querySelectorAll('[data-equipskill]')].at(-1)?.click()); await wait(200);
await p.screenshot({ path: 'shots/tree-3.png' });
const lo = await p.evaluate(() => [...document.querySelectorAll('.loadout .slot')].map(b => b.textContent.trim()));
console.log('choices', choices); console.log('loadout', lo); console.log('tree', JSON.stringify(await p.evaluate(() => window.__kkq.save.heroes[10].tree)));
console.log(errs.length ? errs : 'no errors');
await b.close(); server.kill();
