// Stage panel on a portrait phone: fresh save, and a save past 1-10 (Hard on, challenges open).
// node scripts/panel-shot.mjs → shots/panel-*.png
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';
const PORT = 5330, base = `http://localhost:${PORT}/?touch`;
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
const wait = ms => new Promise(r => setTimeout(r, ms));
await wait(3000);
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const p = await (await b.newContext({ viewport: { width: 852, height: 393 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })).newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(base); await p.evaluate(() => localStorage.clear()); await p.reload();
for (let i = 0; i < 60 && !await p.evaluate(() => !!window.__kkq); i++) await wait(250);
await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(1200);
// skip the intro story if it is up
for (let i = 0; i < 3; i++) await p.evaluate(() => document.querySelector('#story .skip, #story [data-skip]')?.click());
await wait(500);
const info = async name => { const el = await p.$('.map .info'); if (el) await el.screenshot({ path: `shots/panel-${name}.png` }); else await p.screenshot({ path: `shots/panel-${name}.png` }); };
await info('fresh');
await p.screenshot({ path: 'shots/panel-fresh-full.png' });
await p.evaluate(() => { const s = window.__kkq.save, h = s.heroes[s.selected]; for (let n = 1; n <= 10; n++) h.cleared['1-' + n] = 'A'; h.level = 12; s.hard = true; window.__kkq.scene.scene.restart({}); });
await wait(800);
await p.evaluate(() => document.querySelector('[data-node="1-4"]')?.click()); await wait(300);
await p.evaluate(() => document.querySelector('[data-act=spicyopen]')?.click()); await wait(300);
await info('later');
await p.evaluate(() => document.querySelector('[data-act=diff-nm]')?.click()); await wait(300);
const flash = await p.evaluate(() => document.body.innerText.match(/🔒 Nightmare[^\n]*/)?.[0] ?? '');
console.log('locked nightmare tap:', flash || '(no message)');
console.log(errs.length ? errs : 'no errors');
await b.close(); server.kill(); process.exit(errs.length ? 1 : 0);
