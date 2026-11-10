// The Market with a played save (each starter kaiju in front, stages cleared, crumbs, a few days of stock).
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';
const PORT = 5332, base = `http://localhost:${PORT}/?touch`;
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
const wait = ms => new Promise(r => setTimeout(r, ms));
await wait(3000);
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const p = await (await b.newContext({ viewport: { width: 852, height: 393 }, isMobile: true, hasTouch: true })).newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message + ' @ ' + (e.stack ?? '').split('\n').slice(1, 3).join(' | '))); p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
await p.goto(base); await p.evaluate(() => localStorage.clear()); await p.reload();
for (let i = 0; i < 60 && !await p.evaluate(() => !!window.__kkq); i++) await wait(250);
await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(1200);
// play the first stages for real (the bot is not here, so just mark progress and run a few real stage clears through the save API)
for (const sp of [0, 10, 11, 4]) {
  await p.evaluate(sp => { const s = window.__kkq.save; s.selected = sp; const h = s.heroes[sp]; h.level = 6; for (let n = 1; n <= 4; n++) h.cleared['1-' + n] = 'B'; s.crumbs = 180; window.__kkq.scene.scene.restart({}); }, sp);
  await wait(700);
  await p.tap('[data-tab="market"]'); await wait(500);
  const st = await p.evaluate(() => ({ on: document.querySelector('[data-tab="market"]')?.classList.contains('on'), market: !!document.querySelector('.market'), offers: document.querySelectorAll('.gearoffer').length }));
  console.log('kaiju', sp, JSON.stringify(st));
  await p.tap('[data-buy="jam"]').catch(e => errs.push('tap jam: ' + e.message.split('\n')[0])); await wait(300);
  console.log('  after buying jam:', await p.evaluate(() => [window.__kkq.save.crumbs, window.__kkq.save.items.jam]));
  const g = await p.$('[data-buygear]'); if (g) { await g.tap().catch(e => errs.push('tap gear: ' + e.message.split('\n')[0])); await wait(300); }
  await p.screenshot({ path: `shots/market2-${sp}.png` });
}
console.log(errs.length ? errs : 'no errors');
await b.close(); server.kill();
