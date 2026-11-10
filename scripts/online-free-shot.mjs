// Online Free Play + co-op polish, end to end: host + phone guest play Endless Pantry together through the real
// matchmaking: floor 1, the host picks a perk (the guest waits), floor 2, then the host banks the run.
// Also checks quick chat and that the guest drinks from their OWN quick bag.
// node scripts/online-free-shot.mjs → shots/onfree-*.png
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';
const PORT = 5328, base = `http://localhost:${PORT}/`;
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
const setup = (p, name, sp, lv, jams) => p.evaluate(([name, sp, lv, jams]) => {
  const s = window.__kkq.save; s.netName = name; s.unlocked = [...new Set([...s.unlocked, sp])]; s.selected = sp; s.heroes[sp].level = lv;
  for (let n = 1; n <= 10; n++) s.heroes[sp].cleared['1-' + n] = 'A';
  s.heroes[sp].cleared['2-10'] = 'A';
  s.items.jam = jams; s.quick[0] = 'jam';
  window.__kkq.scene.scene.restart({});
}, [name, sp, lv, jams]);
const until = async (p, fn, what, ms = 25000) => { for (let t = 0; t < ms; t += 250) { if (await p.evaluate(fn).catch(() => false)) return; await wait(250); } throw new Error('timed out: ' + what); };
const clearFloor = p => p.evaluate(() => { const w = window.__kkq.world(); for (const m of w.mobs) { m.hp = 0; m.state = 'dead'; } w.arenas.forEach(a => { a.done = true; a.locked = false; }); });
const toExit = p => p.evaluate(() => { const w = window.__kkq.world(); for (const h of w.heroes) h.x = w.exitX; });

const host = await open(base, false), guest = await open(base + '?touch', true);
await setup(host, 'Pat', 0, 20, 2); await setup(guest, 'Kiddo', 10, 18, 4); await wait(800);
await host.evaluate(() => document.querySelector('[data-act=online]').click()); await wait(300);
await host.evaluate(() => document.querySelector('[data-o=host]').click());
await until(host, () => /^[A-Z]{4}$/.test(document.querySelector('#online .code')?.textContent ?? ''), 'room code');
const code = await host.evaluate(() => document.querySelector('#online .code').textContent);
console.log('room', code);
await guest.evaluate(() => document.querySelector('[data-act=online]').click()); await wait(300);
await guest.fill('[data-f=code]', code);
await guest.evaluate(() => document.querySelector('[data-o=join]').click());
await until(host, () => document.querySelectorAll('#online .seat:not(.empty)').length === 2, 'guest seat on host', 40000);
await host.evaluate(() => { const s = document.querySelector('[data-f=mode]'); s.value = 'endless'; s.dispatchEvent(new Event('change')); });
await until(guest, () => /Endless/.test(document.querySelector('#online .stage')?.textContent ?? ''), 'guest sees Endless');
await host.screenshot({ path: 'shots/onfree-lobby-host.png' });
await guest.screenshot({ path: 'shots/onfree-lobby-guest.png' });

// floor 1
await host.evaluate(() => document.querySelector('[data-o=start]').click());
await until(guest, () => window.__kkq.world()?.stage.id === 'E-1', 'guest on floor 1');
await host.evaluate(() => { const w = window.__kkq.world(); for (const h of w.heroes) h.inv = 9999; w.heroes[1].hp = 20; });
await wait(600);
// the guest drinks a jam from their own bag, and says hi
await guest.keyboard.down('Digit1'); await wait(150); await guest.keyboard.up('Digit1');
await guest.keyboard.press('Digit7');
await until(host, () => window.__kkq.scene.mates.some(m => m.emoT > 0), 'host sees the guest emote', 5000);
const bags = await host.evaluate(() => window.__kkq.world().heroes.map(h => h.bag[0]?.n ?? 0));
console.log('bags on host (host, guest)', bags);
if (bags[0] !== 2 || bags[1] !== 3) errs.push('guest should have used their own jam: ' + JSON.stringify(bags));
await wait(500);
await guest.screenshot({ path: 'shots/onfree-play-guest.png' });
await host.screenshot({ path: 'shots/onfree-play-host.png' });
await clearFloor(host); await wait(1200); await toExit(host);
await until(guest, () => document.querySelector('#freepanel.on .perk.wait'), 'guest waits for the perk', 15000);
await until(host, () => document.querySelector('#freepanel.on [data-i]'), 'host picks a perk', 15000);
await guest.screenshot({ path: 'shots/onfree-wait-guest.png' });
await host.screenshot({ path: 'shots/onfree-perk-host.png' });
const guestJam = await guest.evaluate(() => window.__kkq.save.items.jam);
console.log('guest jams after floor 1', guestJam);
if (guestJam !== 3) errs.push('guest jam count not written back: ' + guestJam);
await host.evaluate(() => document.querySelector('#freepanel [data-i="0"]').click());

// floor 2
await until(guest, () => window.__kkq.world()?.stage.id === 'E-2' && !document.querySelector('#freepanel.on'), 'guest on floor 2');
const perks = await guest.evaluate(() => window.__kkq.scene.free?.perks);
console.log('guest perks on floor 2', perks);
if (!perks?.length) errs.push('guest did not get the perk');
await host.evaluate(() => { const w = window.__kkq.world(); for (const h of w.heroes) h.inv = 9999; });
await wait(800);
await clearFloor(host); await wait(1200); await toExit(host);
await until(host, () => document.querySelector('#freepanel.on [data-stop]'), 'host perk panel 2', 15000);
await until(guest, () => document.querySelector('#freepanel.on .perk.wait'), 'guest waits 2', 15000);
await host.evaluate(() => document.querySelector('#freepanel [data-stop]').click());
await until(guest, () => /BANKED/.test(document.querySelector('#freepanel.on h2')?.textContent ?? ''), 'guest sees BANKED', 10000);
await guest.screenshot({ path: 'shots/onfree-banked-guest.png' });
const best = await guest.evaluate(() => [window.__kkq.save.free?.endless?.[10], window.__kkq.save.boxes.length]);
console.log('guest best floor, boxes', best);
if (best[0] !== 2 || best[1] < 2) errs.push('guest record/boxes wrong: ' + JSON.stringify(best));
await guest.evaluate(() => document.querySelector('#freepanel [data-ok]').click());
await host.evaluate(() => document.querySelector('#freepanel [data-ok]').click());
await until(guest, () => document.getElementById('online')?.classList.contains('on') && document.querySelectorAll('#online .seat').length === 2, 'guest back in room');
await until(host, () => document.getElementById('online')?.classList.contains('on'), 'host back in room');
// Boss Rush in the same room: two bosses, the next fight starts on its own, then both see the finish
await host.evaluate(() => { const s = document.querySelector('[data-f=mode]'); s.value = 'rush'; s.dispatchEvent(new Event('change')); });
await wait(600);
await host.evaluate(() => document.querySelector('[data-o=start]').click());
await until(guest, () => window.__kkq.world()?.stage.id === 'R-1', 'guest on boss 1');
await host.evaluate(() => { const w = window.__kkq.world(); for (const h of w.heroes) h.inv = 9999; });
await wait(1500); await clearFloor(host); await wait(1500); await toExit(host);
await until(guest, () => window.__kkq.world()?.stage.id === 'R-2', 'guest on boss 2', 20000);
await until(host, () => window.__kkq.world()?.stage.id === 'R-2', 'host on boss 2', 20000);
await host.evaluate(() => { const w = window.__kkq.world(); for (const h of w.heroes) h.inv = 9999; });
await wait(1500); await clearFloor(host); await wait(1500); await toExit(host);
await until(guest, () => /BOSS RUSH CLEAR/.test(document.querySelector('#freepanel.on h2')?.textContent ?? ''), 'guest rush summary', 15000);
await guest.screenshot({ path: 'shots/onfree-rush-guest.png' });
console.log('guest rush best time', await guest.evaluate(() => window.__kkq.save.free?.rush?.[10]));
console.log(errs.length ? errs : 'no errors');
await b.close(); server.kill(); process.exit(errs.length ? 1 : 0);
