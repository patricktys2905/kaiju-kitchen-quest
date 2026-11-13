// Cookbook titles online: two browsers (host + phone guest) through the real matchmaking. Each shows a title it has
// earned; both lobbies show both titles under the names, and in the stage a friend's name tag carries the title.
// The title travels as its id in the kit ('w1', 'all'); a client that sends none (or an older version) shows none.
// Needs a DEV server already running and the internet (matchmaking):
//   node scripts/cookbook-online-shot.mjs [port=5483]   → shots/cookbook/online-*.png
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const PORT = Number(process.argv[2] ?? 5483), base = `http://localhost:${PORT}/`;
fs.mkdirSync('shots/cookbook', { recursive: true });
const wait = ms => new Promise(r => setTimeout(r, ms));
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const errs = [];
async function open(url, phone) {
  const ctx = await b.newContext(phone ? { viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : { viewport: { width: 1280, height: 720 } });
  const p = await ctx.newPage();
  p.on('pageerror', e => errs.push((phone ? 'guest: ' : 'host: ') + e.message));
  await p.goto(url, { waitUntil: 'commit', timeout: 120000 }); await p.evaluate(() => localStorage.clear()); await p.reload({ waitUntil: 'commit', timeout: 120000 });
  for (let i = 0; i < 240; i++) { if (await p.evaluate(() => !!window.__kkq).catch(() => false)) break; await wait(250); }
  await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(600);
  return p;
}
/** a kaiju with World 1 half cleared and one finished Cookbook page whose title is shown (title null = none) */
const setup = (p, name, sp, lv, title) => p.evaluate(([name, sp, lv, title]) => {
  const s = window.__kkq.save; s.netName = name; s.unlocked = [...new Set([...s.unlocked, sp])]; s.selected = sp; s.heroes[sp].level = lv;
  for (let n = 1; n <= 5; n++) s.heroes[sp].cleared['1-' + n] = 'A';
  if (title) { s.cookbookPaid = { [title.slice(1)]: 2 }; s.title = title; }
  window.__kkq.scene.scene.restart({});
}, [name, sp, lv, title]);
const until = async (p, fn, what, ms = 25000) => { for (let t = 0; t < ms; t += 250) { if (await p.evaluate(fn).catch(() => false)) return; await wait(250); } throw new Error('timed out: ' + what); };
const seats = p => p.evaluate(() => [...document.querySelectorAll('#online .seat:not(.empty)')].map(e => `${e.querySelector('b')?.textContent} / ${e.querySelector('.ttl')?.textContent ?? '(no title)'}`));

const host = await open(base, false), guest = await open(base + '?touch', true);
await setup(host, 'Pat', 0, 9, 'w1'); await setup(guest, 'Kiddo', 10, 8, 'w3'); await wait(800);
await host.evaluate(() => document.querySelector('[data-act=online]').click()); await wait(300);
await host.evaluate(() => document.querySelector('[data-o=host]').click());
await until(host, () => /^[A-Z]{4}$/.test(document.querySelector('#online .code')?.textContent ?? ''), 'room code');
const code = await host.evaluate(() => document.querySelector('#online .code').textContent);
await guest.evaluate(() => document.querySelector('[data-act=online]').click()); await wait(300);
await guest.fill('[data-f=code]', code);
await guest.evaluate(() => document.querySelector('[data-o=join]').click());
await until(host, () => document.querySelectorAll('#online .seat:not(.empty)').length === 2, 'guest seat on host', 40000);
await until(guest, () => document.querySelectorAll('#online .seat').length === 2, 'lobby on guest');
await wait(800);
const hs = await seats(host), gs = await seats(guest);
console.log('host sees :', hs.join(' | ')); console.log('guest sees:', gs.join(' | '));
for (const [who, s] of [['host', hs], ['guest', gs]]) {
  if (!/Countertop Cook/.test(s[0] ?? '')) errs.push(`${who}: the host's title is missing from the lobby`);
  if (!/Oven Cook/.test(s[1] ?? '')) errs.push(`${who}: the guest's title is missing from the lobby`);
}
await host.screenshot({ path: 'shots/cookbook/online-lobby-host.png' });
await guest.screenshot({ path: 'shots/cookbook/online-lobby-guest.png' });
// in the stage: each sees the other's name tag with the title under it
await host.evaluate(() => { const s = document.querySelector('[data-f=stage]'); s.value = '1-2'; s.dispatchEvent(new Event('change')); });
await wait(600);
await host.evaluate(() => document.querySelector('[data-o=start]').click());
await until(guest, () => !!window.__kkq.world(), 'guest in stage'); await until(host, () => !!window.__kkq.world(), 'host in stage');
await host.evaluate(() => { const w = window.__kkq.world(); for (const h of w.heroes) h.inv = 9999; });
await wait(2500);
const tags = p => p.evaluate(() => window.__kkq.scene.mates.map(m => m.tag.text));
const ht = await tags(host), gt = await tags(guest);
console.log('host name tags:', JSON.stringify(ht), '· guest name tags:', JSON.stringify(gt));
if (!ht.some(t => /Kiddo\nOven Cook/.test(t))) errs.push('host: the guest\'s name tag has no title');
if (!gt.some(t => /Pat\nCountertop Cook/.test(t))) errs.push('guest: the host\'s name tag has no title');
await host.screenshot({ path: 'shots/cookbook/online-play-host.png' });
await guest.screenshot({ path: 'shots/cookbook/online-play-guest.png' });
console.log(errs.length ? errs : 'no errors');
await b.close(); process.exit(errs.length ? 1 : 0);
