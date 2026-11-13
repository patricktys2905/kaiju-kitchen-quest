// Elemental weaknesses online: the room shows the stage's Weak line to host and guest, and the GUEST sees WEAK! / RESIST
// popups for hits the host lands (and for its own). Two Edge contexts, real PeerJS / MQTT matchmaking (needs the internet).
// Needs a dev server already running:  node scripts/weak-online-shot.mjs [port=5471]  → shots/weak/online-*.png
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const PORT = Number(process.argv[2] ?? 5471), base = `http://localhost:${PORT}/`;
fs.mkdirSync('shots/weak', { recursive: true });
const wait = ms => new Promise(r => setTimeout(r, ms));
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const errs = [];
async function open(url, who) {
  const ctx = await b.newContext({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  p.on('pageerror', e => { errs.push(`${who}: ${e.message}`); console.log('PAGEERROR', who, e.message); });
  await p.goto(url, { waitUntil: 'commit', timeout: 120000 }); await p.evaluate(() => localStorage.clear()); await p.reload({ waitUntil: 'commit', timeout: 120000 });
  for (let i = 0; i < 480; i++) { if (await p.evaluate(() => !!window.__kkq).catch(() => false)) break; await wait(500); }
  await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(600);
  return p;
}
const until = async (p, fn, what, ms = 25000, arg) => { for (let t = 0; t < ms; t += 100) { if (await p.evaluate(fn, arg).catch(() => false)) return true; await wait(100); } errs.push('timed out: ' + what); console.log('TIMED OUT:', what); return false; };
// host: Dumplord (Steam Cloud is HOT); guest: Pengwhip (COLD skills)
const setup = (p, name, sp, lv) => p.evaluate(([name, sp, lv]) => {
  const s = window.__kkq.save; s.netName = name; s.unlocked = [...new Set([...s.unlocked, sp])]; s.selected = sp; s.heroes[sp].level = lv; s.tips = [];
  for (let n = 1; n <= 10; n++) s.heroes[sp].cleared['1-' + n] = 'A';
  window.__kkq.scene.scene.restart({});
}, [name, sp, lv]);
const host = await open(base + '?touch', 'host'), guest = await open(base + '?touch', 'guest');
await setup(host, 'Pat', 6, 6); await setup(guest, 'Kiddo', 11, 6); await wait(800);
await host.evaluate(() => document.querySelector('[data-act=online]').click()); await wait(300);
await host.evaluate(() => document.querySelector('[data-o=host]').click());
if (!await until(host, () => /^[A-Z]{4}$/.test(document.querySelector('#online .code')?.textContent ?? ''), 'room code', 40000)) { await b.close(); process.exit(2); }
const code = await host.evaluate(() => document.querySelector('#online .code').textContent);
await guest.evaluate(() => document.querySelector('[data-act=online]').click()); await wait(300);
await guest.fill('[data-f=code]', code);
await guest.evaluate(() => document.querySelector('[data-o=join]').click());
if (!await until(host, () => document.querySelectorAll('#online .seat:not(.empty)').length === 2, 'guest seat on host', 60000)) { await guest.screenshot({ path: 'shots/weak/online-join-fail.png' }); await b.close(); process.exit(2); }
await host.evaluate(() => { const el = document.querySelector('[data-f=stage]'); el.value = '1-2'; el.dispatchEvent(new Event('change')); }); await wait(1200);
console.log('host room line: ', await host.evaluate(() => document.querySelector('#online .weakln')?.textContent ?? '(none)'));
console.log('guest room line:', await guest.evaluate(() => document.querySelector('#online .weakln')?.textContent ?? '(none)'));
await host.screenshot({ path: 'shots/weak/online-room-host.png' }); await guest.screenshot({ path: 'shots/weak/online-room-guest.png' });
// the Daily Dungeon as the room's stage
await host.evaluate(() => { const m = document.querySelector('[data-f=mode]'); m.value = 'daily'; m.dispatchEvent(new Event('change')); }); await wait(1200);
console.log('host daily line: ', await host.evaluate(() => document.querySelector('#online .weakln')?.textContent ?? '(none)'));
console.log('guest daily line:', await guest.evaluate(() => document.querySelector('#online .weakln')?.textContent ?? '(none)'));
await host.evaluate(() => { const m = document.querySelector('[data-f=mode]'); m.value = 'story'; m.dispatchEvent(new Event('change')); }); await wait(800);
await host.evaluate(() => document.querySelector('[data-o=start]').click());
await until(guest, () => window.__kkq.world()?.stage.id === '1-2', 'guest in stage'); await until(host, () => window.__kkq.world()?.stage.id === '1-2', 'host in stage');
await wait(2500);
// count the popups each screen makes
for (const p of [host, guest]) await p.evaluate(() => { const k = window.__kkq; k.words = []; const orig = k.scene.callout.bind(k.scene); k.scene.callout = (x, y, text, ...r) => { k.words.push(text); orig(x, y, text, ...r); };
  // every elemental hit this screen hears about: which monster it thinks was hit, and how far off the hit landed
  k.elHits = []; const ew = k.scene.elementWord.bind(k.scene);
  k.scene.elementWord = (x, y, w, c) => { const near = k.world().mobs.map(m => [m.id, m.kind, Math.round(Math.abs(m.x - x))]).sort((a, b) => a[2] - b[2])[0]; k.elHits.push(`${w > 0 ? 'weak' : 'resist'}→${near?.[1]}#${near?.[0]} (${near?.[2]}px) t${Math.round(k.scene.time.now)}`); ew(x, y, w, c); }; });
await host.evaluate(() => {
  const w = window.__kkq.world(), h = w.heroes[0];
  for (const m of w.mobs) m.x += 4000;
  for (const o of w.heroes) { o.inv = 1e6; o.x = h.x; o.y = h.y; }
  ['bun', 'pepper'].forEach((kind, i) => { const m = w.spawnMob(kind, h.x + 70 + i * 60, 14, h.y); m.hp = m.maxHp = 1e6; m.atk = 0; });
  h.face = 1;
});
await wait(600);
await host.keyboard.down('KeyL'); await wait(120); await host.keyboard.up('KeyL');
const seen = await until(guest, () => window.__kkq.words.includes('WEAK!') && window.__kkq.words.includes('RESIST'), 'guest sees WEAK! and RESIST from the host\'s hits', 12000);
await wait(100);
await guest.evaluate(() => window.__kkq.scene.tweens.pauseAll()); await guest.screenshot({ path: 'shots/weak/online-guest-popups.png' }); await guest.evaluate(() => window.__kkq.scene.tweens.resumeAll());
await wait(6000);
const count = p => p.evaluate(() => { const c = {}; for (const t of window.__kkq.words) if (t === 'WEAK!' || t === 'RESIST') c[t] = (c[t] ?? 0) + 1; return c; });
console.log('guest saw both popups:', seen, '· host popups:', JSON.stringify(await count(host)), '· guest popups:', JSON.stringify(await count(guest)));
console.log('guest heard:', (await guest.evaluate(() => window.__kkq.elHits)).join(' · '));
console.log('guest tips (the host\'s hits must not set off the guest\'s tips):', await guest.evaluate(() => (window.__kkq.save.tips ?? []).filter(t => t === 'weak' || t === 'resist').join(',') || '(none)'));
console.log('host tips:', await host.evaluate(() => (window.__kkq.save.tips ?? []).filter(t => t === 'weak' || t === 'resist').join(',') || '(none)'));
console.log(errs.length ? errs : 'no errors');
await b.close(); process.exit(errs.length ? 1 : 0);
