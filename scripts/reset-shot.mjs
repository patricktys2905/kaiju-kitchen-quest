// Title screen START OVER: shows only with progress, asks first, then wipes this browser's save.
// node scripts/reset-shot.mjs → shots/reset-*.png
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';
const PORT = 5329, base = `http://localhost:${PORT}/`;
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
const wait = ms => new Promise(r => setTimeout(r, ms));
await wait(3000);
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const p = await (await b.newContext({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true })).newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(base); await p.evaluate(() => localStorage.clear()); await p.reload(); await wait(1500);
if (await p.$('#title .over')) errs.push('START OVER shown on a brand-new save');
// give the save some progress (the game's own save object), then reload to the title
await p.evaluate(() => { document.querySelector('#title .play').click(); });
for (let i = 0; i < 60 && !await p.evaluate(() => !!window.__kkq); i++) await wait(250);
await wait(500);
await p.evaluate(() => { const s = window.__kkq.save; s.crumbs = 500; s.heroes[0].level = 7; s.heroes[0].cleared['1-1'] = 'A'; });
await p.evaluate(() => { window.__kkq.scene.scene.restart({}); });
await wait(500);
await p.evaluate(() => localStorage.setItem('kkq-save-v3', JSON.stringify(window.__kkq.save)));
await p.reload(); await wait(1500);
await p.screenshot({ path: 'shots/reset-title.png' });
if (!await p.$('#title .over')) errs.push('START OVER missing with progress');
await p.click('#title .over'); await wait(300);
await p.screenshot({ path: 'shots/reset-ask.png' });
await p.click('#title .ask .no'); await wait(300);
const kept = await p.evaluate(() => JSON.parse(localStorage.getItem('kkq-save-v3')).crumbs);
if (kept !== 500) errs.push('KEEP lost the save: ' + kept);
await p.click('#title .over'); await wait(200); await p.click('#title .ask .yes');
await wait(2500);
const after = await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('kkq-save-v3')); return { crumbs: s.crumbs, lv: s.heroes[0].level, cleared: Object.keys(s.heroes[0].cleared).length, over: !!document.querySelector('#title .over'), title: !!document.querySelector('#title') }; });
console.log('after erase', after);
if (after.crumbs || after.lv !== 1 || after.cleared || after.over || !after.title) errs.push('erase did not give a fresh game');
console.log(errs.length ? errs : 'no errors');
await b.close(); server.kill(); process.exit(errs.length ? 1 : 0);
