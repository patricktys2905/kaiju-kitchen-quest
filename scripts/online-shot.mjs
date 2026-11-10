// Online co-op, end to end: two browsers (host + phone guest) on the dev server, through the real matchmaking.
// node scripts/online-shot.mjs [backup] → shots/online-*.png (backup = the guest is forced onto the MQTT backup route)
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';
const backup = process.argv[2] === 'backup', tag = backup ? '-backup' : '';
const PORT = 5327, base = `http://localhost:${PORT}/`;
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
const wait = ms => new Promise(r => setTimeout(r, ms));
await wait(3000);
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const errs = [];
async function open(url, phone) {
  const ctx = await b.newContext(phone ? { viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true } : { viewport: { width: 1280, height: 720 } });
  const p = await ctx.newPage();
  p.on('pageerror', e => errs.push((phone ? 'guest: ' : 'host: ') + e.message));
  await p.goto(url); await p.evaluate(() => localStorage.clear()); await p.reload();
  for (let i = 0; i < 60; i++) { if (await p.evaluate(() => !!window.__kkq).catch(() => false)) break; await wait(250); }
  await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(600);
  return p;
}
const setup = (p, name, sp, lv) => p.evaluate(([name, sp, lv]) => {
  const s = window.__kkq.save; s.netName = name; s.unlocked = [...new Set([...s.unlocked, sp])]; s.selected = sp; s.heroes[sp].level = lv;
  for (let n = 1; n <= 5; n++) s.heroes[sp].cleared['1-' + n] = 'A';
  window.__kkq.scene.scene.restart({});
}, [name, sp, lv]);
const until = async (p, fn, what, ms = 25000) => { for (let t = 0; t < ms; t += 250) { if (await p.evaluate(fn).catch(() => false)) return; await wait(250); } throw new Error('timed out: ' + what); };

const host = await open(base, false), guest = await open(base + (backup ? '?net=backup&touch' : '?touch'), true);
await setup(host, 'Pat', 0, 9); await setup(guest, 'Kiddo', 10, 8); await wait(800);
await host.evaluate(() => document.querySelector('[data-act=online]').click()); await wait(300);
await host.evaluate(() => document.querySelector('[data-o=host]').click());
await until(host, () => /^[A-Z]{4}$/.test(document.querySelector('#online .code')?.textContent ?? ''), 'room code');
const code = await host.evaluate(() => document.querySelector('#online .code').textContent);
console.log('room', code);
await guest.evaluate(() => document.querySelector('[data-act=online]').click()); await wait(300);
await guest.screenshot({ path: `shots/online-menu${tag}.png` });
await guest.fill('[data-f=code]', code);
await guest.evaluate(() => document.querySelector('[data-o=join]').click());
await until(host, () => document.querySelectorAll('#online .seat:not(.empty)').length === 2, 'guest seat on host', 40000);
await until(guest, () => document.querySelectorAll('#online .seat').length === 2, 'lobby on guest');
await host.evaluate(() => { const s = document.querySelector('[data-f=stage]'); s.value = '1-2'; s.dispatchEvent(new Event('change')); });
await wait(1200);
await host.screenshot({ path: `shots/online-lobby-host${tag}.png` });
await guest.screenshot({ path: `shots/online-lobby-guest${tag}.png` });
await host.evaluate(() => document.querySelector('[data-o=start]').click());
await until(guest, () => !!window.__kkq.world(), 'guest in stage');
await host.evaluate(() => { const w = window.__kkq.world(); for (const h of w.heroes) h.inv = 9999; });
// the guest walks right and attacks; the host stands still
await guest.keyboard.down('ArrowRight'); await wait(1500); await guest.keyboard.up('ArrowRight');
for (let i = 0; i < 6; i++) { await guest.keyboard.down('KeyJ'); await wait(120); await guest.keyboard.up('KeyJ'); await wait(120); }
await wait(1500);
const st = async p => p.evaluate(() => { const w = window.__kkq.world(); return { me: w.heroes.indexOf(w.hero), heroes: w.heroes.map(h => Math.round(h.x)), mobs: w.mobs.filter(m => m.state !== 'dead').length, time: Math.round(w.time * 10) / 10 }; });
const hs = await st(host), gs = await st(guest);
console.log('host', hs, 'guest', gs);
if (gs.me !== 1 || hs.heroes[1] < hs.heroes[0] + 60) errs.push('guest input did not move their kaiju on the host: ' + JSON.stringify(hs));
if (Math.abs(hs.heroes[1] - gs.heroes[1]) > 80) errs.push('guest view out of sync');
await host.screenshot({ path: `shots/online-play-host${tag}.png` });
await guest.screenshot({ path: `shots/online-play-guest${tag}.png` });
// clear the stage on the host: both get a result screen with their own loot
await host.evaluate(() => { const w = window.__kkq.world(); for (const m of w.mobs) { m.hp = 0; m.state = 'dead'; } w.arenas.forEach(a => { a.done = true; a.locked = false; }); });
await wait(1500);
await host.evaluate(() => { const w = window.__kkq.world(); for (const h of w.heroes) h.x = w.exitX; });
console.log('after clear', await host.evaluate(() => { const w = window.__kkq.world(); return w && { portal: w.portal, cleared: w.cleared, alive: w.alive, x: w.heroes.map(h => Math.round(h.x)), exit: w.exitX, obj: w.stage.objective }; }));
await until(guest, () => document.getElementById('result')?.classList.contains('on'), 'guest result', 15000);
await until(host, () => document.getElementById('result')?.classList.contains('on'), 'host result', 15000);
await guest.screenshot({ path: `shots/online-result-guest${tag}.png` });
await guest.evaluate(() => document.querySelector('#result [data-r=camp]').click());
await host.evaluate(() => document.querySelector('#result [data-r=camp]').click());
await until(guest, () => document.getElementById('online')?.classList.contains('on') && document.querySelectorAll('#online .seat').length === 2, 'guest back in room');
await until(host, () => document.getElementById('online')?.classList.contains('on'), 'host back in room');
const cleared = await guest.evaluate(() => Object.keys(window.__kkq.save.heroes[10].cleared));
console.log('guest cleared', cleared.join(','));
console.log(errs.length ? errs : 'no errors');
await b.close(); server.kill(); process.exit(errs.length ? 1 : 0);
