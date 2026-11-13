// QA: online co-op on the NEW map stages, watched from the GUEST's screen. Two Edge contexts (host desktop + phone guest), real
// PeerJS / MQTT matchmaking. Needs a dev server already running: node scripts/qa-online.mjs [port=5327] [backup]
// → shots/qa/on-*.png and a log of host-vs-guest facts. Uses only the debug hooks the stock shot scripts use (window.__kkq).
import { chromium } from 'playwright-core';
const PORT = Number(process.argv[2] ?? 5327), backup = process.argv[3] === 'backup', tag = backup ? '-backup' : '';
const base = `http://localhost:${PORT}/`;
const wait = ms => new Promise(r => setTimeout(r, ms));
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const errs = [], notes = [];
const note = (...a) => { const s = a.map(x => typeof x === 'string' ? x : JSON.stringify(x)).join(' '); notes.push(s); console.log(s); };
async function open(url, phone) {
  const ctx = await b.newContext(phone ? { viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true } : { viewport: { width: 1280, height: 720 } });
  const p = await ctx.newPage();
  p.on('pageerror', e => { errs.push((phone ? 'guest: ' : 'host: ') + e.message); console.log('PAGEERROR', phone ? 'guest' : 'host', e.message); });
  await p.goto(url, { waitUntil: 'commit', timeout: 120000 }); await p.evaluate(() => localStorage.clear()); await p.reload({ waitUntil: 'commit', timeout: 120000 });
  for (let i = 0; i < 480; i++) { if (await p.evaluate(() => !!window.__kkq).catch(() => false)) break; await wait(500); }
  await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(600);
  return p;
}
const setup = (p, name, sp, lv) => p.evaluate(([name, sp, lv]) => {
  const s = window.__kkq.save; s.netName = name; s.unlocked = [...new Set([...s.unlocked, sp])]; s.selected = sp; s.heroes[sp].level = lv;
  for (let n = 1; n <= 10; n++) s.heroes[sp].cleared['1-' + n] = 'A';
  window.__kkq.scene.scene.restart({});
}, [name, sp, lv]);
const until = async (p, fn, what, ms = 25000, arg) => { for (let t = 0; t < ms; t += 250) { if (await p.evaluate(fn, arg).catch(() => false)) return true; await wait(250); } errs.push('timed out: ' + what); console.log('TIMED OUT:', what); return false; };
const shot = (p, name) => p.screenshot({ path: `shots/qa/on-${name}${tag}.png` });
// what a page's own World + HUD say
const facts = p => p.evaluate(() => {
  const k = window.__kkq, w = k.world(); if (!w) return null;
  const me = w.heroes.indexOf(w.hero), mi = w.mapAt(w.hero.x), maps = w.stage.maps ?? [];
  const foe = w.mobs.find(m => m.roomBoss);
  return {
    me, x: w.heroes.map(h => Math.round(h.x)), y: w.heroes.map(h => Math.round(h.y)), map: w.heroes.map(h => w.mapAt(h.x)),
    hud: document.querySelector('#hud .stage .s')?.textContent, title: document.querySelector('#hud .stage')?.textContent?.slice(0, 60),
    mobsAlive: w.mobs.filter(m => m.state !== 'dead').length, mobsInMyMap: w.mobs.filter(m => m.state !== 'dead' && w.mapAt(m.x) === mi).length,
    drops: w.drops, zones: w.zones2.map(z => z.done), pickups: w.pickups.length, portal: w.portal,
    foe: foe && { kind: foe.kind, wake: foe.wake, x: Math.round(foe.x), hp: foe.hp, state: foe.state }, bossBar: !!document.querySelector('#hud .boss.on'), bossBarText: document.querySelector('#hud .boss.on .t')?.textContent ?? null,
    toast: [...document.querySelectorAll('.toast, #toasts > *')].map(e => e.textContent).slice(-3), nMaps: maps.length,
    exitLabels: (k.scene.portalViews ?? []).map(v => v.label?.text),
  };
});
const both = async (label) => { const h = await facts(host), g = await facts(guest); note(`--- ${label}`); note('  HOST ', h); note('  GUEST', g); return { h, g }; };
const tap = async (p, code, ms = 140) => { await p.keyboard.down(code); await wait(ms); await p.keyboard.up(code); await wait(120); };

const host = await open(base, false), guest = await open(base + (backup ? '?net=backup&touch' : '?touch'), true);
await setup(host, 'Pat', 0, 9); await setup(guest, 'Kiddo', 10, 8); await wait(800);
await host.evaluate(() => document.querySelector('[data-act=online]').click()); await wait(300);
await host.evaluate(() => document.querySelector('[data-o=host]').click());
await until(host, () => /^[A-Z]{4}$/.test(document.querySelector('#online .code')?.textContent ?? ''), 'room code', 40000);
const code = await host.evaluate(() => document.querySelector('#online .code').textContent);
note('room', code, backup ? '(guest on the MQTT backup route)' : '(PeerJS)');
await guest.evaluate(() => document.querySelector('[data-act=online]').click()); await wait(300);
await guest.fill('[data-f=code]', code);
await guest.evaluate(() => document.querySelector('[data-o=join]').click());
if (!await until(host, () => document.querySelectorAll('#online .seat:not(.empty)').length === 2, 'guest seat on host', 60000)) { await shot(guest, 'join-fail-guest'); await b.close(); process.exit(2); }
note('guest route', await guest.evaluate(() => window.__kkq && document.querySelector('#online')?.textContent?.match(/backup|direct|relay/i)?.[0]));

async function start(stage) {
  await host.evaluate(s => { const m = document.querySelector('[data-f=mode]'); if (m && m.value !== 'story') { m.value = 'story'; m.dispatchEvent(new Event('change')); } }, stage); await wait(500);
  await host.evaluate(s => { const el = document.querySelector('[data-f=stage]'); el.value = s; el.dispatchEvent(new Event('change')); }, stage); await wait(1000);
  await host.evaluate(() => document.querySelector('[data-o=start]').click());
  await until(guest, s => window.__kkq.world()?.stage.id === s, 'guest in stage ' + stage, 30000, stage);
  await until(host, s => window.__kkq.world()?.stage.id === s, 'host in stage ' + stage, 30000, stage);
  await host.evaluate(() => { const w = window.__kkq.world(); for (const h of w.heroes) h.inv = 9999; });
  await wait(2500);
}
const put = (xs) => host.evaluate(xs => { const w = window.__kkq.world(); w.heroes.forEach((h, i) => { if (xs[i] != null) { h.x = xs[i]; h.y = w.stage.groundY; h.vx = h.vy = 0; h.ground = true; h.on = -1; } }); }, xs);

// ================= stage 1-4 (three maps, escort) =================
await start('1-4');
await shot(guest, '1-start-guest'); await shot(host, '1-start-host');
let s = await both('1-4 start (guest save has NO drops, host save has none)');
if (s.g.mobsInMyMap !== s.h.mobsInMyMap) errs.push(`guest sees ${s.g.mobsInMyMap} monsters in its map, host has ${s.h.mobsInMyMap}`);

// a real drop: put a wanted monster with 1 HP in front of the guest, the guest hits it; repeat until something drops, then the guest picks it up
const wantKind = await host.evaluate(() => { const w = window.__kkq.world(); return w.stage.maps[0].goal.wants[0].mob; });
for (let i = 0; i < 8; i++) {
  const got = await host.evaluate(k => { const w = window.__kkq.world(); if (w.pickups.length || (w.drops[k] ?? 0) > 0) return true; const g = w.heroes[1]; const m = w.mobs.find(o => o.state !== 'dead' && o.kind === k && w.mapAt(o.x) === 0); if (m) { m.x = g.x + 70; m.y = w.stage.groundY; m.hp = 1; g.face = 1; } return false; }, wantKind);
  if (got) break;
  for (let j = 0; j < 4; j++) await tap(guest, 'KeyJ');
  await wait(900);
}
await wait(400); await shot(guest, '2-drop-guest');
s = await both(`after the GUEST killed ${wantKind}s (a drop should be on the floor or in the bag)`);
await guest.keyboard.down('ArrowRight'); await wait(900); await guest.keyboard.up('ArrowRight'); await wait(800);
await shot(guest, '3-pickup-guest');
s = await both('after the guest walked over the drop: host bag vs what the guest HUD says');
const hostHas = s.h.drops[wantKind] ?? 0, guestHas = s.g.drops[wantKind] ?? 0;
if (hostHas > 0 && guestHas !== hostHas) errs.push(`GUEST HUD/bag out of sync: team has ${hostHas} ${wantKind}, guest's World says ${guestHas}; guest HUD "${s.g.hud}"`);

// fill the team's bag for map I (host side), stand both at the exit: what does the guest's exit sign / HUD say?
const exit0 = await host.evaluate(() => { const w = window.__kkq.world(); for (const q of w.stage.maps[0].goal.wants) w.drops[q.mob] = q.n; return w.stage.maps[0].portals[0].x; });
await put([exit0 - 30, exit0]); await wait(1500);
await shot(guest, '4-exit-ready-guest'); await shot(host, '4-exit-ready-host');
s = await both('team bag is full for exit I, both at the exit');
if (!/EXIT/.test(s.g.hud ?? '') && /EXIT/.test(s.h.hud ?? '')) errs.push(`host HUD says "${s.h.hud}" but guest HUD says "${s.g.hud}"`);

// the GUEST presses up at the exit, the host stays
await tap(guest, 'ArrowUp', 250); await wait(700);
await shot(guest, '5-guest-pressed-up-guest');
s = await both('GUEST pressed UP at exit I (host did not)');
if (s.h.map[1] !== 1) errs.push(`guest pressed up at an open exit: zone done ${s.h.zones[0]}, but the guest is in map ${s.h.map[1]} (host in ${s.h.map[0]})`);
await wait(2500);
// the HOST presses up
await put([exit0, null]); await wait(300);
await tap(host, 'ArrowUp', 250); await wait(1500);
await shot(guest, '6-map2-guest'); await shot(host, '6-map2-host');
s = await both('HOST pressed UP at exit I');
if (JSON.stringify(s.g.zones) !== JSON.stringify(s.h.zones)) errs.push(`opened exits out of sync: host zones ${JSON.stringify(s.h.zones)}, guest ${JSON.stringify(s.g.zones)}`);
if (/open/.test(s.h.exitLabels[0] ?? '') && !/open/.test(s.g.exitLabels[0] ?? '')) errs.push(`exit I sign: host "${s.h.exitLabels[0]}", guest "${s.g.exitLabels[0]}"`);
if (s.g.mobsInMyMap !== s.h.mobsInMyMap) errs.push(`map II: guest sees ${s.g.mobsInMyMap} monsters, host has ${s.h.mobsInMyMap}`);
// guest walks right in map II for a while: monsters visible?
await guest.keyboard.down('ArrowRight'); await wait(2500); await guest.keyboard.up('ArrowRight'); await wait(600);
await shot(guest, '7-map2-walk-guest');
s = await both('guest walked right in map II for 2.5 s (leash?)');

// top floor: the guest stands on a top-floor platform (y 200) above the host
const top = await host.evaluate(() => { const w = window.__kkq.world(), m = w.stage.maps[1]; const i = w.stage.platforms.findIndex(p => p.y === 200 && p.x > m.x0 && p.x + p.w < m.x1 && !p.move); if (i < 0) return null; const p = w.stage.platforms[i]; const x = p.x + p.w / 2; const [a, g] = w.heroes; a.x = x; a.y = w.stage.groundY; a.ground = true; a.on = -1; g.x = x + 20; g.y = 200; g.vy = 0; g.ground = true; g.on = i; return x; });
await wait(600); s = await both(`guest placed on the top floor (y 200) right above the host at x ${top}`);
if (top && s.h.y[1] > 210) errs.push(`guest cannot stay on the top floor while the host is on the ground: guest y ${s.h.y[1]}`);
await shot(guest, '8-topfloor-guest');

// on to the boss room the legit way: bag full, host goes through exits II and III
for (const mi of [1, 2]) {
  const ex = await host.evaluate(mi => { const w = window.__kkq.world(); for (const q of w.stage.maps[mi].goal.wants) w.drops[q.mob] = q.n; return w.stage.maps[mi].portals[0].x; }, mi);
  await put([ex, ex - 40]); await wait(500); await tap(host, 'ArrowUp', 250); await wait(1200);
}
await shot(guest, '9-bossroom-asleep-guest'); await shot(host, '9-bossroom-asleep-host');
s = await both('in the boss room, nobody has walked in yet (foe asleep)');
if (!s.g.foe) errs.push('guest has no boss-room foe');
const bx = await host.evaluate(() => { const w = window.__kkq.world(); return w.stage.maps[w.stage.maps.length - 1].x0; });
await put([bx + 420, bx + 380]); await wait(2500);
await shot(guest, '10-bossroom-awake-guest'); await shot(host, '10-bossroom-awake-host');
s = await both('walked in: foe should be awake and fighting on both screens');
if (s.h.foe?.wake !== 0) errs.push('host foe did not wake');
if (s.h.foe?.wake === 0 && s.g.foe?.wake) errs.push(`boss-room foe awake on the host but still asleep on the guest (wake ${s.g.foe.wake})`);
// two leftover drops in the team bag at the end: host and guest should both bank them
const leftover = await host.evaluate(() => { const w = window.__kkq.world(); const k = w.stage.maps[0].goal.wants[0].mob; w.drops[k] = (w.drops[k] ?? 0) + 2; return k; });
// kill the foe (host cheat), walk to the exit: results for both
await host.evaluate(() => { const w = window.__kkq.world(); for (const m of w.mobs) if (m.roomBoss) { m.hp = 1; m.x = w.heroes[0].x + 80; m.armor = 0; } });
for (let j = 0; j < 14; j++) await tap(host, 'KeyJ');
await wait(800);
s = await both('host hit the 1 HP foe');
if (s.h.foe && s.h.foe.state !== 'dead') { await host.evaluate(() => { const w = window.__kkq.world(); for (const m of w.mobs) if (m.roomBoss) { m.hp = 0; m.state = 'dead'; } }); await wait(1200); }
await wait(1500);
await host.evaluate(() => { const w = window.__kkq.world(); for (const h of w.heroes) h.x = w.exitX; if (w.npc) w.npc.x = w.exitX; });
await until(guest, () => document.getElementById('result')?.classList.contains('on'), 'guest result', 20000);
await until(host, () => document.getElementById('result')?.classList.contains('on'), 'host result', 20000);
await wait(600);
await shot(guest, '11-result-guest'); await shot(host, '11-result-host');
note('result text guest:', await guest.evaluate(() => document.getElementById('result')?.innerText.replace(/\s+/g, ' ').slice(0, 300)));
note('result text host :', await host.evaluate(() => document.getElementById('result')?.innerText.replace(/\s+/g, ' ').slice(0, 300)));
note('saves after 1-4: host drops', await host.evaluate(() => window.__kkq.save.drops), 'boxes', await host.evaluate(() => window.__kkq.save.boxes.length), '| guest drops', await guest.evaluate(() => window.__kkq.save.drops), 'boxes', await guest.evaluate(() => window.__kkq.save.boxes.length), 'guest cleared 1-4:', await guest.evaluate(() => window.__kkq.save.heroes[10].cleared['1-4']));
{ const hd = await host.evaluate(k => window.__kkq.save.drops?.[k] ?? 0, leftover), gd = await guest.evaluate(k => window.__kkq.save.drops?.[k] ?? 0, leftover); if (hd !== 2 || gd !== 2) errs.push(`leftover team drops not banked on both devices: host save has ${hd} ${leftover}, guest save has ${gd} (want 2 and 2)`); }
await guest.evaluate(() => document.querySelector('#result [data-r=camp]').click());
await host.evaluate(() => document.querySelector('#result [data-r=camp]').click());
await until(guest, () => document.getElementById('online')?.classList.contains('on') && document.querySelectorAll('#online .seat').length === 2, 'guest back in room');
await until(host, () => document.getElementById('online')?.classList.contains('on'), 'host back in room');

// ================= world boss stage 1-10: the boss bar on the guest =================
await start('1-10');
const last = await host.evaluate(() => { const w = window.__kkq.world(); const maps = w.stage.maps; for (let i = 0; i < maps.length - 1; i++) w.zones2[i].done = true; return maps[maps.length - 2].portals[0].x; });
await put([last, last - 40]); await wait(500); await tap(host, 'ArrowUp', 250); await wait(1200);
const bx2 = await host.evaluate(() => { const w = window.__kkq.world(); return w.stage.maps[w.stage.maps.length - 1].x0; });
await shot(guest, '12-boss10-asleep-guest');
await put([bx2 + 420, bx2 + 380]); await wait(3500);
await shot(guest, '13-boss10-awake-guest'); await shot(host, '13-boss10-awake-host');
s = await both('1-10 boss room, boss awake');
if (s.h.bossBar && !s.g.bossBar) errs.push('WORLD BOSS HP BAR: shown on the host, MISSING on the guest');
await host.evaluate(() => { const w = window.__kkq.world(); for (const m of w.mobs) { m.hp = 0; m.state = 'dead'; } }); await wait(2500);
await host.evaluate(() => { const w = window.__kkq.world(); for (const h of w.heroes) h.x = w.exitX; });
await until(guest, () => document.getElementById('result')?.classList.contains('on'), 'guest result 1-10', 20000);
await wait(600); await shot(guest, '14-result10-guest');
await guest.evaluate(() => document.querySelector('#result [data-r=camp]')?.click());
await host.evaluate(() => document.querySelector('#result [data-r=camp]')?.click());
await until(guest, () => document.getElementById('online')?.classList.contains('on') && document.querySelectorAll('#online .seat').length === 2, 'guest back in room 2');
await until(host, () => document.getElementById('online')?.classList.contains('on'), 'host back in room 2');

// ================= Free Play online: the Daily Dungeon =================
await host.evaluate(() => { const m = document.querySelector('[data-f=mode]'); m.value = 'daily'; m.dispatchEvent(new Event('change')); }); await wait(800);
await shot(host, '15-daily-lobby-host');
await host.evaluate(() => document.querySelector('[data-o=start]').click());
await until(guest, () => /^D-/.test(window.__kkq.world()?.stage.id ?? ''), 'guest in the daily', 30000);
await host.evaluate(() => { const w = window.__kkq.world(); for (const h of w.heroes) h.inv = 9999; }); await wait(2500);
await shot(guest, '16-daily-guest'); await shot(host, '16-daily-host');
s = await both('online Daily Dungeon start');
note('daily stage on guest:', await guest.evaluate(() => { const st = window.__kkq.world().stage; return { id: st.id, name: st.name, maps: st.maps?.map(m => m.name), mobs0: st.mobs[0] }; }));
// boss room of the daily
const dl = await host.evaluate(() => { const w = window.__kkq.world(); const maps = w.stage.maps; if (!maps) return null; for (let i = 0; i < maps.length - 1; i++) w.zones2[i].done = true; return [maps[maps.length - 2].portals[0].x, maps[maps.length - 1].x0]; });
if (dl) {
  await put([dl[0], dl[0] - 40]); await wait(500); await tap(host, 'ArrowUp', 250); await wait(1200);
  await put([dl[1] + 420, dl[1] + 380]); await wait(2500);
  await shot(guest, '17-daily-boss-guest');
  s = await both('online daily boss room, walked in');
  await host.evaluate(() => { const w = window.__kkq.world(); for (const m of w.mobs) if (m.roomBoss) { m.hp = 0; m.state = 'dead'; } }); await wait(2500);
  await host.evaluate(() => { const w = window.__kkq.world(); for (const h of w.heroes) h.x = w.exitX; });
  await until(guest, () => document.querySelector('#freepanel.on'), 'guest daily summary', 20000);
  await wait(500); await shot(guest, '18-daily-summary-guest'); await shot(host, '18-daily-summary-host');
  note('daily summary guest:', await guest.evaluate(() => document.querySelector('#freepanel')?.innerText.replace(/\s+/g, ' ').slice(0, 240)));
  note('daily summary host :', await host.evaluate(() => document.querySelector('#freepanel')?.innerText.replace(/\s+/g, ' ').slice(0, 240)));
}
note(errs.length ? 'PROBLEMS:\n  ' + errs.join('\n  ') : 'no problems flagged');
await b.close(); process.exit(errs.length ? 1 : 0);
