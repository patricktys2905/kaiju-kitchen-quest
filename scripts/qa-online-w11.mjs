// QA: online co-op on World 11, watched from the GUEST's phone screen. Two Edge contexts, real PeerJS / MQTT matchmaking.
// node scripts/qa-online-w11.mjs <port> [backup] → shots/qa2/online/<route>-*.png + host-vs-guest facts. Needs a DEV server + internet.
// 11-4 (monsters, drops, exit, Crumblet) then 11-10 (boss bar, the Wheel of Misfortune on the guest for all three picks, the fall).
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const PORT = Number(process.argv[2]), backup = process.argv[3] === 'backup', tag = backup ? 'backup' : 'peer';
fs.mkdirSync('shots/qa2/online', { recursive: true });
const base = `http://localhost:${PORT}/`; const wait = ms => new Promise(r => setTimeout(r, ms));
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const errs = []; const note = (...a) => console.log(a.map(x => typeof x === 'string' ? x : JSON.stringify(x)).join(' '));
const fail = m => { errs.push(m); console.log('FAIL:', m); };
async function open(url, phone) {
  const ctx = await b.newContext(phone ? { viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : { viewport: { width: 1280, height: 720 } });
  const p = await ctx.newPage();
  p.on('pageerror', e => { errs.push((phone ? 'guest: ' : 'host: ') + e.message); console.log('PAGEERROR', phone ? 'guest' : 'host', e.message); });
  await p.goto(url, { waitUntil: 'commit', timeout: 120000 }); await p.evaluate(() => localStorage.clear()); await p.reload({ waitUntil: 'commit', timeout: 120000 });
  for (let i = 0; i < 480; i++) { if (await p.evaluate(() => !!window.__kkq).catch(() => false)) break; await wait(500); }
  await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(600);
  return p;
}
const setup = (p, name, sp, lv, extra) => p.evaluate(async ([name, sp, lv, extra]) => {
  window.process ??= { env: {} };
  const m = await import('/scripts/hero-at.ts'); const prof = m.heroFor(sp, lv, 1);
  const s = window.__kkq.save; s.netName = name; s.unlocked = [...new Set([...s.unlocked, sp])]; s.selected = sp;
  const h = s.heroes[sp] ?? (s.heroes[sp] = prof); Object.assign(h, { level: lv, alloc: prof.alloc, skills: prof.skills, equip: prof.equip, tree: prof.tree, loadout: prof.loadout });
  for (let w = 1; w <= 11; w++) for (let n = 1; n <= 10; n++) h.cleared[`${w}-${n}`] = 'A';
  s.tips = ['move', 'jump', 'attack', 'dodge', 'skill', 'gear', 'weak', 'resist', 'ladder', 'drop', 'arena', 'hazard', 'hazard-skin', 'sponge', 'potion', 'escort', 'fetch', 'boss', 'cookbook', 'exit'];
  Object.assign(s, extra ?? {});
  window.__kkq.scene.scene.restart({});
}, [name, sp, lv, extra]);
const until = async (p, fn, what, ms = 25000, arg) => { for (let t = 0; t < ms; t += 200) { if (await p.evaluate(fn, arg).catch(() => false)) return true; await wait(200); } fail('timed out: ' + what); return false; };
const shot = (p, name) => p.screenshot({ path: `shots/qa2/online/${tag}-${name}.png` });
const facts = p => p.evaluate(() => {
  const k = window.__kkq, w = k.world(); if (!w) return null; const s = k.scene, v = s.cameras.main.worldView;
  const me = w.heroes.indexOf(w.hero), mi = w.mapAt(w.hero.x);
  const inView = w.mobs.filter(m => m.state !== 'dead' && m.x > v.x && m.x < v.right);
  return { me, x: w.heroes.map(h => Math.round(h.x)), map: w.heroes.map(h => w.mapAt(h.x)), hud: document.querySelector('#hud .stage')?.textContent?.slice(0, 110),
    mobsInMyMap: w.mobs.filter(m => m.state !== 'dead' && w.mapAt(m.x) === mi).length, mobsDrawn: inView.map(m => `${m.kind}/${s.mobViews.get(m.id)?.img.texture.key ?? 'NO VIEW'}`),
    drops: w.drops, zones: w.zones2.map(z => z.done), pickups: w.pickups.length, npc: w.npc ? Math.round(w.npc.x) : null, hazards: w.hazards.filter(z => z.x > v.x && z.x < v.right).map(z => z.kind + ':' + z.state), puddles: w.puddles.length,
    bossBar: !!document.querySelector('#hud .boss.on'), bossBarText: document.querySelector('#hud .boss.on')?.textContent?.replace(/\s+/g, ' ').slice(0, 80) ?? null, exitLabels: (s.portalViews ?? []).map(q => q.label?.text?.replace(/\n/g, ' / ')),
    tags: [...document.querySelectorAll('#hud .mates *, #hud .team *')].map(e => e.textContent).filter(Boolean).slice(0, 6) };
});
const both = async label => { const h = await facts(host), g = await facts(guest); note(`--- ${label}`); note('  HOST ', h); note('  GUEST', g); return { h, g }; };
const tap = async (p, code, ms = 140) => { await p.keyboard.down(code); await wait(ms); await p.keyboard.up(code); await wait(120); };

const host = await open(base, false), guest = await open(base + (backup ? '?net=backup&touch' : '?touch'), true);
// titles and garnishes: the host has a Cookbook title and a white garnish, the guest a gold one (two-star card)
const titles = await host.evaluate(async () => { const m = await import('/src/sim/cookbook.ts'); return Object.keys(m).filter(k => /title/i.test(k)); });
note('cookbook title exports:', titles);
await setup(host, 'Pat', 0, 120, { garnishes: ['cadet'], cookbook: { cadet: 6 } }); await setup(guest, 'Kiddo', 19, 118, { garnishes: ['floss'], cookbook: { floss: 60 } }); await wait(800);
note('wear:', await host.evaluate(async () => { const m = await import('/src/save.ts'); return [m.wearGarnish(0, 'cadet'), JSON.stringify(m.garnishOf(0))]; }), await guest.evaluate(async () => { const m = await import('/src/save.ts'); return [m.wearGarnish(19, 'floss'), JSON.stringify(m.garnishOf(19))]; }));
await host.evaluate(() => document.querySelector('[data-act=online]').click()); await wait(300);
await host.evaluate(() => document.querySelector('[data-o=host]').click());
if (!await until(host, () => /^[A-Z]{4}$/.test(document.querySelector('#online .code')?.textContent ?? ''), 'room code', 40000)) { await b.close(); process.exit(2); }
const code = await host.evaluate(() => document.querySelector('#online .code').textContent);
note('room', code, backup ? '(guest on the MQTT backup route)' : '(PeerJS)');
await guest.evaluate(() => document.querySelector('[data-act=online]').click()); await wait(300);
await guest.fill('[data-f=code]', code);
await guest.evaluate(() => document.querySelector('[data-o=join]').click());
if (!await until(host, () => document.querySelectorAll('#online .seat:not(.empty)').length === 2, 'guest seat on host', 60000)) { await shot(guest, 'join-fail-guest'); await b.close(); process.exit(2); }
await wait(1500); await shot(guest, '00-lobby-guest'); await shot(host, '00-lobby-host');
note('lobby on guest:', await guest.evaluate(() => document.querySelector('#online')?.innerText.replace(/\s+/g, ' ').slice(0, 400)));
note('stage choices on host include World 11:', await host.evaluate(() => [...document.querySelectorAll('[data-f=stage] option')].map(o => o.value).filter(v => /^11-|^S-11/.test(v))));
async function start(stage) {
  await host.evaluate(() => { const m = document.querySelector('[data-f=mode]'); if (m && m.value !== 'story') { m.value = 'story'; m.dispatchEvent(new Event('change')); } }); await wait(500);
  await host.evaluate(s => { const el = document.querySelector('[data-f=stage]'); el.value = s; el.dispatchEvent(new Event('change')); }, stage); await wait(1000);
  await host.evaluate(() => document.querySelector('[data-o=start]').click());
  const ok = await until(guest, s => window.__kkq.world()?.stage.id === s, 'guest in stage ' + stage, 30000, stage) && await until(host, s => window.__kkq.world()?.stage.id === s, 'host in stage ' + stage, 30000, stage);
  await host.evaluate(() => { const w = window.__kkq.world(); for (const h of w.heroes) h.inv = 99999; }); await wait(2500); return ok;
}
const put = xs => host.evaluate(xs => { const w = window.__kkq.world(); w.heroes.forEach((h, i) => { if (xs[i] != null) { h.x = xs[i]; h.y = w.stage.groundY; h.vx = h.vy = 0; h.ground = true; h.on = -1; } }); }, xs);

// ================= 11-4: monsters, drops, the exit, the Crumblet =================
if (await start('11-4')) {
  await shot(guest, '01-11-4-start-guest'); await shot(host, '01-11-4-start-host');
  let s = await both('11-4 start');
  // same stage on both sides? (the guest builds its own copy of the stage from the id)
  const sig = p => p.evaluate(() => { const st = window.__kkq.world().stage; return JSON.stringify({ w: st.width, pl: st.platforms.filter(q => !q.move).map(q => [Math.round(q.x), q.y, q.w]), moving: st.platforms.filter(q => q.move).length, lad: st.ladders.map(l => [l.x, l.top]), wants: st.maps.map(m => m.goal?.wants?.map(q => q.mob) ?? m.kind) }); });
  const [sh, sg] = [await sig(host), await sig(guest)]; note('stage layout identical on host and guest (same browser engine here):', sh === sg);
  if (sh !== sg) { const a = JSON.parse(sh), c = JSON.parse(sg); const d = []; for (const k of Object.keys(a)) if (JSON.stringify(a[k]) !== JSON.stringify(c[k])) d.push(k + ': host ' + JSON.stringify(a[k]).slice(0, 300) + ' | guest ' + JSON.stringify(c[k]).slice(0, 300)); fail('host and guest built different layouts for 11-4: ' + d.join(' ;; ')); }
  // walk both to a monster the exit wants, the GUEST hits it (real keys on the guest)
  const kind = await host.evaluate(() => window.__kkq.world().stage.maps[0].goal.wants[0].mob);
  for (let i = 0; i < 40; i++) {
    const got = await host.evaluate(k => { const w = window.__kkq.world(); if ((w.drops[k] ?? 0) > 0) return true; const g = w.heroes[1]; const m = w.mobs.find(o => o.state !== 'dead' && o.kind === k && w.mapAt(o.x) === 0 && Math.abs(o.y - w.stage.groundY) < 5) ?? w.mobs.find(o => o.state !== 'dead' && o.kind === k && w.mapAt(o.x) === 0); if (!m) return false; m.hp = Math.min(m.hp, 50); g.x = m.x - 50; g.y = m.y; g.face = 1; w.heroes[0].x = m.x - 120; w.heroes[0].y = w.stage.groundY; return false; }, kind);
    if (got) break; await tap(guest, 'KeyJ', 200); if (i === 1) await shot(guest, '02-11-4-guest-fighting');
  }
  await wait(1200); s = await both(`11-4 after the guest hunted ${kind}`);
  if (!(s.h.drops[kind] > 0)) fail(`no ${kind} drop arrived on the host`); else if ((s.g.drops[kind] ?? 0) !== s.h.drops[kind]) fail(`drop count differs: host ${s.h.drops[kind]} guest ${s.g.drops[kind]}`);
  if (s.g.mobsDrawn.some(m => /__WHITE|NO VIEW|__MISSING/.test(m))) fail('guest draws a monster without its art: ' + s.g.mobsDrawn.join(' '));
  await shot(guest, '03-11-4-drop-guest');
  // the exit: both stand on it with the full set, the host presses UP
  const ex = await host.evaluate(() => { const w = window.__kkq.world(); for (const q of w.stage.maps[0].goal.wants) w.drops[q.mob] = q.n; return w.stage.maps[0].portals[0].x; });
  await put([ex, ex - 40]); await wait(900); await shot(guest, '04-11-4-at-exit-guest'); s = await both('11-4 at the exit with the set');
  await tap(host, 'ArrowUp', 250); await wait(1500); s = await both('11-4 after the exit'); await shot(guest, '05-11-4-map2-guest');
  if (s.g.map[1] !== 1 && s.g.map[0] !== 1) fail('nobody went through the exit on the guest screen');
  note('Crumblet on guest:', s.g.npc, 'on host:', s.h.npc);
  // a Caramel Drip on the guest's screen
  const hz = await host.evaluate(() => { const w = window.__kkq.world(), mi = w.mapAt(w.heroes[1].x); const z = w.hazards.find(z => z.kind === 'wax' && w.mapAt(z.x) === mi); return z ? z.x : null; });
  if (hz != null) { await put([hz - 150, hz - 100]); for (const st of ['warn', 'on']) { await until(guest, st => window.__kkq.world().hazards.some(z => z.kind === 'wax' && z.state === st && Math.abs(z.x - window.__kkq.world().hero.x) < 300), 'caramel ' + st + ' on guest', 12000, st); await shot(guest, `06-11-4-caramel-${st}-guest`); } await wait(1500); await shot(guest, '06-11-4-caramel-puddle-guest'); s = await both('11-4 by a Caramel Drip'); }
  // out: clear to the result
  await host.evaluate(() => { const w = window.__kkq.world(); w.skipToBoss?.(); }); await wait(1500);
  const bx = await host.evaluate(() => { const w = window.__kkq.world(); return w.stage.maps[w.stage.maps.length - 1].x0; });
  await put([bx + 420, bx + 380]); await wait(3000); await shot(guest, '07-11-4-room-guest'); s = await both('11-4 boss room');
  await host.evaluate(() => { const w = window.__kkq.world(); for (const m of w.mobs) { m.hp = 0; m.state = 'dead'; } }); await wait(2500);
  await host.evaluate(() => { const w = window.__kkq.world(); for (const h of w.heroes) h.x = w.exitX; });
  await until(guest, () => document.getElementById('result')?.classList.contains('on'), 'guest result 11-4', 25000); await wait(700); await shot(guest, '08-11-4-result-guest');
  note('guest result:', await guest.evaluate(() => document.getElementById('result')?.innerText.replace(/\s+/g, ' ').slice(0, 300)));
  await guest.evaluate(() => document.querySelector('#result [data-r=camp]')?.click()); await host.evaluate(() => document.querySelector('#result [data-r=camp]')?.click());
  await until(guest, () => document.getElementById('online')?.classList.contains('on'), 'guest back in the room'); await until(host, () => document.getElementById('online')?.classList.contains('on'), 'host back in the room');
}
// ================= 11-10: the boss bar and the Wheel of Misfortune on the guest =================
if (await start('11-10')) {
  await host.evaluate(() => { const w = window.__kkq.world(); w.skipToBoss?.(); }); await wait(1500);
  const bx = await host.evaluate(() => { const w = window.__kkq.world(); return w.stage.maps[w.stage.maps.length - 1].x0; });
  await put([bx + 420, bx + 380]); await wait(3500);
  await shot(guest, '10-flosso-awake-guest'); await shot(host, '10-flosso-awake-host');
  let s = await both('11-10 boss room, boss awake');
  if (s.h.bossBar && !s.g.bossBar) fail('BOSS BAR shown on the host, missing on the guest');
  note('name tags / garnish badges on guest:', await guest.evaluate(() => [...document.querySelectorAll('#hud *')].filter(e => e.children.length === 0 && /Pat|Kiddo/.test(e.textContent)).map(e => e.className + ':' + e.textContent).slice(0, 6)), 'garnishes the host World knows:', await host.evaluate(() => window.__kkq.garnishes?.()));
  // the wheel: the host's sim picks it from the boss's own queue; watch the guest's screen
  for (const pick of ['rain', 'summon', 'roar']) {
    let seen = false;
    for (let tries = 0; tries < 12 && !seen; tries++) {
      await host.evaluate(() => { const w = window.__kkq.world(), bo = w.boss; for (const h of w.heroes) { h.inv = 99999; h.hp = h.d.maxHp; } bo.hp = Math.round(bo.maxHp * 0.2); bo.tired = 0; bo.weak = 0; for (const m of w.mobs) if (m !== bo && m.state !== 'dead') { m.hp = 0; m.state = 'dead'; } if (bo.state !== 'windup' && bo.state !== 'attack') { bo.state = 'walk'; bo.t = 0; bo.queue = ['wheel']; } bo.x = w.heroes[1].x + 220; });
      const got = await until(guest, () => { const b = window.__kkq.world().boss; return b && b.state === 'windup' && b.move.startsWith('wheel-'); }, 'a wheel wind-up on the guest', 9000).catch(() => false);
      if (!got) continue;
      const t0 = Date.now(); const g = await guest.evaluate(() => { const w = window.__kkq.world(), v = window.__kkq.scene.mobViews.get(w.boss.id)?.wheel; return { mv: w.boss.move, shown: !!v?.root.visible, label: v?.label.text ?? null }; });
      const h = await host.evaluate(() => window.__kkq.world().boss.move);
      if (g.mv !== 'wheel-' + pick) { await wait(2500); errs.pop?.(); continue; }
      await wait(250); await shot(guest, `11-wheel-${pick}-guest`); await shot(host, `11-wheel-${pick}-host`);
      const g2 = await guest.evaluate(() => { const w = window.__kkq.world(), v = window.__kkq.scene.mobViews.get(w.boss.id)?.wheel; return { mv: w.boss.move, shown: !!v?.root.visible, label: v?.label.text ?? null, toasts: [...document.querySelectorAll('.toast, #toasts > *')].map(e => e.textContent).slice(-3) }; });
      let on = 0; while (Date.now() - t0 < 4000 && await guest.evaluate(() => { const b = window.__kkq.world().boss, v = window.__kkq.scene.mobViews.get(b.id)?.wheel; return b.state === 'windup' && b.move.startsWith('wheel-') && !!v?.root.visible; })) { on = Date.now() - t0; await wait(40); }
      note(`WHEEL ${pick}: host move ${h}; guest first look`, g, 'then', g2, `; on the guest's screen for about ${on} ms after first seen`);
      if (!g2.shown) fail(`wheel ${pick}: NOT drawn on the guest`); if (on < 700) fail(`wheel ${pick}: on the guest's screen for only ${on} ms`);
      seen = true; await wait(1200); await shot(guest, `12-wheel-${pick}-after-guest`);
    }
    if (!seen) fail(`wheel pick ${pick} never came up in 12 spins`);
    errs.splice(0, errs.length, ...errs.filter(e => !/a wheel wind-up on the guest/.test(e)));
  }
  await host.evaluate(() => { const w = window.__kkq.world(); for (const m of w.mobs) { m.hp = 0; m.state = 'dead'; } }); await wait(700); await shot(guest, '13-flosso-falls-guest'); await wait(2000);
  await host.evaluate(() => { const w = window.__kkq.world(); for (const h of w.heroes) h.x = w.exitX; });
  await until(guest, () => document.getElementById('result')?.classList.contains('on') || !!document.querySelector('#story.on'), 'guest result 11-10', 25000); await wait(700); await shot(guest, '14-11-10-result-guest');
  note('guest after 11-10:', await guest.evaluate(() => ({ story: !!document.querySelector('#story.on'), result: document.getElementById('result')?.innerText.replace(/\s+/g, ' ').slice(0, 300) })));
}
console.log(errs.length ? 'PROBLEMS:\n  ' + errs.join('\n  ') : 'no problems found');
await b.close(); process.exit(0);
