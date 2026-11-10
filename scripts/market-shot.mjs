// Fresh save on a phone: open every camp tab, report page errors. node scripts/market-shot.mjs → shots/tab-*.png
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';
const PORT = 5331, base = `http://localhost:${PORT}/?touch`;
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
const wait = ms => new Promise(r => setTimeout(r, ms));
await wait(3000);
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const p = await (await b.newContext({ viewport: { width: 852, height: 393 }, isMobile: true, hasTouch: true })).newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
await p.goto(base); await p.evaluate(() => localStorage.clear()); await p.reload();
for (let i = 0; i < 60 && !await p.evaluate(() => !!window.__kkq); i++) await wait(250);
await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(1500);
const tabs = await p.evaluate(() => [...document.querySelectorAll('[data-tab]')].map(b => b.dataset.tab));
console.log('tabs', tabs.join(','));
for (const t of tabs) {
  await p.tap(`[data-tab="${t}"]`).catch(e => errs.push(`tap ${t}: ${e.message.split('\n')[0]}`)); await wait(400);
  const on = await p.evaluate(t => document.querySelector(`[data-tab="${t}"]`)?.classList.contains('on'), t);
  const blocker = await p.evaluate(t => { const b = document.querySelector(`[data-tab="${t}"]`).getBoundingClientRect(); const el = document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2); return el?.closest('[data-tab]') ? '' : (el?.id || el?.className || el?.tagName); }, t);
  console.log(t, on ? 'opens' : 'DID NOT OPEN', blocker ? 'covered by: ' + blocker : '');
  if (t === 'market') { await p.tap('[data-buy="jam"]'); await wait(300); console.log('tap jam with 0 crumbs:', await p.evaluate(() => document.body.innerText.match(/Not enough crumbs[^\n]*/)?.[0] ?? '(no message)')); await p.screenshot({ path: 'shots/tab-market.png' }); }
}
console.log(errs.length ? errs : 'no errors');
await b.close(); server.kill();
