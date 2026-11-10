// Free mode screenshots: node scripts/free-shot.mjs → shots/free-tab.png, free-endless.png, free-perk.png, free-floor2.png, free-rush.png, free-summary.png
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';
const PORT = 5333, url = `http://localhost:${PORT}/?touch`;
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
  h.level = 22; for (let w = 1; w <= 2; w++) for (let n = 1; n <= 10; n++) h.cleared[`${w}-${n}`] = 'A';
  window.__kkq.scene.scene.restart({});
});
await wait(900);
await p.evaluate(() => document.querySelector('[data-tab=free]')?.click()); await wait(400);
await p.screenshot({ path: 'shots/free-tab.png' });
// Endless: play floor 1, clear it by force, pick a perk
await p.evaluate(() => document.querySelector('[data-free=endless]')?.click()); await wait(2200);
await p.evaluate(() => { const w = window.__kkq.world(); w.hero.inv = 9999; w.hero.x = 500; });
await wait(1500);
await p.screenshot({ path: 'shots/free-endless.png' });
for (let k = 0; k < 4; k++) { await p.evaluate(() => { const w = window.__kkq.world(); for (const m of w.mobs) { m.hp = 0; m.state = 'dead'; } }); await wait(700); }
await p.evaluate(() => { const w = window.__kkq.world(); w.hero.x = w.exitX; });
for (let i = 0; i < 20 && !(await p.evaluate(() => document.getElementById('freepanel')?.classList.contains('on'))); i++) await wait(300);
await p.screenshot({ path: 'shots/free-perk.png' });
await p.evaluate(() => document.querySelector('#freepanel [data-i="0"]')?.click()); await wait(2200);
await p.screenshot({ path: 'shots/free-floor2.png' });
// bank and stop next time: lose on purpose to see the summary
await p.evaluate(() => { const w = window.__kkq.world(); w.hero.inv = 0; w.hero.hp = 0; w.hero.state = 'down'; w.hero.t = 0; });
for (let i = 0; i < 20 && !(await p.evaluate(() => document.getElementById('freepanel')?.classList.contains('on'))); i++) await wait(300);
await p.screenshot({ path: 'shots/free-summary.png' });
await p.evaluate(() => document.querySelector('#freepanel [data-ok]')?.click()); await wait(900);
// Boss Rush: first boss
await p.evaluate(() => document.querySelector('[data-tab=free]')?.click()); await wait(300);
await p.evaluate(() => document.querySelector('[data-free=rush]')?.click()); await wait(2200);
await p.evaluate(() => { const w = window.__kkq.world(); w.hero.inv = 9999; });
await wait(2000);
await p.screenshot({ path: 'shots/free-rush.png' });
const best = await p.evaluate(() => JSON.stringify(window.__kkq.save.free));
console.log('save.free', best, errs.length ? errs : 'no errors'); await b.close(); server.kill(); process.exit(0);
