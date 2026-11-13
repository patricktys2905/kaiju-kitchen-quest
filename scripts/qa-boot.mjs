// QA: how long does the game take to boot in headless Edge on an already-running dev server? node scripts/qa-boot.mjs [port] [chromium args]
import { chromium } from 'playwright-core';
const PORT = Number(process.argv[2] ?? 5333), url = `http://localhost:${PORT}/?touch`;
const wait = ms => new Promise(r => setTimeout(r, ms));
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true, args: (process.argv[3] ?? '').split(' ').filter(Boolean) });
const p = await (await b.newContext({ viewport: { width: 844, height: 390 } })).newPage();
p.on('pageerror', e => console.log('pageerror', e.message));
const t0 = Date.now();
await p.goto(url, { waitUntil: 'commit', timeout: 60000 }).catch(e => console.log('goto', e.message));
for (let i = 0; i < 100; i++) {
  const s = await p.evaluate(() => ({ kkq: !!window.__kkq, res: performance.getEntriesByType('resource').length })).catch(e => ({ err: e.message.slice(0, 80) }));
  if (i % 3 === 0 || s.kkq) console.log(((Date.now() - t0) / 1000).toFixed(1) + 's', JSON.stringify(s));
  if (s.kkq) break;
  await wait(3000);
}
await b.close();
