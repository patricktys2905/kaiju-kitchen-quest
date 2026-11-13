// QA: the Daily Dungeon, solo with a CPU buddy, phone viewport, played through its maps to the boss room and the summary.
// Needs a server already running (dev or preview): node scripts/qa-free.mjs [port=5340] → shots/qa/free-*.png + facts.
import { chromium } from 'playwright-core';
const PORT = Number(process.argv[2] ?? 5340), url = `http://localhost:${PORT}/?touch`;
const wait = ms => new Promise(r => setTimeout(r, ms));
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const p = await (await b.newContext({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })).newPage();
const errs = []; p.on('pageerror', e => { errs.push(e.message); console.log('PAGEERROR', e.message); });
const note = (...a) => console.log(a.map(x => typeof x === 'string' ? x : JSON.stringify(x)).join(' '));
await p.goto(url, { waitUntil: 'commit', timeout: 120000 }); await p.evaluate(() => localStorage.clear()); await p.reload({ waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 480; i++) { if (await p.evaluate(() => !!window.__kkq).catch(() => false)) break; await wait(500); }
await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(600);
await p.evaluate(() => {
  const s = window.__kkq.save, h = s.heroes[0];
  h.level = 22; for (let w = 1; w <= 2; w++) for (let n = 1; n <= 10; n++) h.cleared[`${w}-${n}`] = 'A';
  s.buddy = 10; s.items.jam = 3; s.quick[0] = 'jam';
  window.__kkq.scene.scene.restart({});
});
await wait(900);
const shot = n => p.screenshot({ path: `shots/qa/free-${n}.png` });
const tap = async (code, ms = 140) => { await p.keyboard.down(code); await wait(ms); await p.keyboard.up(code); await wait(120); };
const facts = () => p.evaluate(() => {
  const w = window.__kkq.world(); if (!w) return null;
  const mi = w.mapAt(w.hero.x), foe = w.mobs.find(m => m.roomBoss), R = e => { const r = e?.getBoundingClientRect(); return r && [Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)]; };
  return { stage: w.stage.id, name: w.stage.name, num: w.stage.num, heroes: w.heroes.map(h => ({ x: Math.round(h.x), map: w.mapAt(h.x), cpu: !!h.cpu, st: h.state })), map: mi, hud: document.querySelector('#hud .stage .s')?.textContent,
    hudRect: R(document.querySelector('#hud .stage')), cardRect: R(document.querySelector('#hud .me, #hud .card, #hud .hero')), drops: w.drops, zones: w.zones2.map(z => z.done), mobsInMap: w.mobs.filter(m => m.state !== 'dead' && w.mapAt(m.x) === mi).map(m => m.kind),
    foe: foe && { kind: foe.kind, wake: foe.wake, hp: foe.hp, state: foe.state, x: Math.round(foe.x) }, portal: w.portal, objective: w.stage.objective, scroll: w.scroll && { x: Math.round(w.scroll.x), got: w.scroll.got }, objTimer: w.objTimer, objArmed: w.objArmed,
    exitLabels: (window.__kkq.scene.portalViews ?? []).map(v => v.label?.text) };
});
const put = xs => p.evaluate(xs => { const w = window.__kkq.world(); w.heroes.forEach((h, i) => { if (xs[i] != null) { h.x = xs[i]; h.y = w.stage.groundY; h.vx = h.vy = 0; h.ground = true; h.on = -1; } }); }, xs);

await p.evaluate(() => document.querySelector('[data-tab=free]')?.click()); await wait(400);
await shot('0-tab');
await p.evaluate(() => document.querySelector('[data-free=daily]')?.click());
for (let i = 0; i < 40 && !(await p.evaluate(() => /^D-/.test(window.__kkq.world()?.stage.id ?? ''))); i++) await wait(300);
await p.evaluate(() => { const w = window.__kkq.world(); for (const h of w.heroes) h.inv = 9999; }); await wait(2500);
await shot('1-daily-start');
let f = await facts(); note('daily start', f);
const maps = await p.evaluate(() => window.__kkq.world().stage.maps?.map(m => ({ name: m.name, kind: m.kind, x0: m.x0, x1: m.x1, wants: m.goal?.wants, portal: m.portals[0]?.x })));
note('maps', maps);
if (!maps) { note('DAILY HAS NO MAPS (old long layout)'); }
else {
  // a real kill + drop in map I
  const k = maps[0].wants[0].mob;
  for (let i = 0; i < 8; i++) {
    const got = await p.evaluate(k => { const w = window.__kkq.world(); if (w.pickups.length || (w.drops[k] ?? 0) > 0) return true; const g = w.heroes[0]; let m = w.mobs.find(o => o.state !== 'dead' && o.kind === k && w.mapAt(o.x) === 0); if (!m) return 'none'; m.x = g.x + 70; m.y = w.stage.groundY; m.hp = 1; g.face = 1; return false; }, k);
    if (got === true) break; if (got === 'none') { note(`no living ${k} in map I yet (waiting for a respawn)`); await wait(3600); continue; }
    for (let j = 0; j < 4; j++) await tap('KeyJ');
    await wait(700);
  }
  await wait(300); await shot('2-drop'); f = await facts(); note('after a kill', { hud: f.hud, drops: f.drops });
  // walk the real maps exit by exit
  for (let mi = 0; mi < maps.length - 1; mi++) {
    await p.evaluate(mi => { const w = window.__kkq.world(); for (const q of w.stage.maps[mi].goal.wants) w.drops[q.mob] = Math.max(w.drops[q.mob] ?? 0, q.n); }, mi);
    await put([maps[mi].portal - 60, mi === 0 ? maps[0].x0 + 300 : null]); await wait(1200);
    await shot(`3-exit${mi + 1}-ready`); f = await facts(); note(`at exit ${mi + 1}`, { hud: f.hud, heroes: f.heroes, label: f.exitLabels[mi], objective: f.objective, scroll: f.scroll, objTimer: f.objTimer, objArmed: f.objArmed });
    await put([maps[mi].portal, null]); await wait(300); await tap('ArrowUp', 250); await wait(1500);
    f = await facts(); note(`after UP at exit ${mi + 1}`, { map: f.map, heroes: f.heroes, hud: f.hud, zones: f.zones, drops: f.drops, mobsInMap: f.mobsInMap, objTimer: f.objTimer, objArmed: f.objArmed, scroll: f.scroll });
    await shot(`4-map${mi + 2}-arrive`);
    if (f.heroes.some(h => h.map !== f.map)) errs.push(`buddy left behind after exit ${mi + 1}: ${JSON.stringify(f.heroes)}`);
  }
  f = await facts(); note('boss room on arrival', { foe: f.foe, hud: f.hud });
  if (!f.foe || f.foe.state === 'dead') errs.push('NO boss-room foe on arrival');
  const bx = maps[maps.length - 1].x0;
  await put([bx + 420, null]); await wait(2500);
  await shot('5-bossroom-awake'); f = await facts(); note('boss room after walking in', { foe: f.foe, hud: f.hud, heroes: f.heroes });
  if (f.foe?.wake !== 0) errs.push('foe still asleep after walking in');
  await p.evaluate(() => { const w = window.__kkq.world(); for (const m of w.mobs) if (m.roomBoss) { m.hp = 1; m.armor = 0; m.x = w.heroes[0].x + 80; } });
  for (let j = 0; j < 16; j++) await tap('KeyJ');
  await wait(1500); f = await facts(); note('after hitting the 1 HP foe', { foe: f.foe ?? 'gone', portal: f.portal, hud: f.hud });
  if (!f.portal) { await p.evaluate(() => { const w = window.__kkq.world(); for (const m of w.mobs) if (m.roomBoss) { m.hp = 0; m.state = 'dead'; } }); await wait(2000); }
  await shot('6-foe-down');
  await p.evaluate(() => { const w = window.__kkq.world(); w.heroes[0].x = w.exitX; });
  for (let i = 0; i < 40 && !(await p.evaluate(() => document.getElementById('freepanel')?.classList.contains('on'))); i++) await wait(300);
  await wait(400); await shot('7-summary');
  note('summary:', await p.evaluate(() => document.querySelector('#freepanel')?.innerText.replace(/\s+/g, ' ').slice(0, 300)));
  note('save.free', await p.evaluate(() => window.__kkq.save.free), 'boxes', await p.evaluate(() => window.__kkq.save.boxes.length), 'drops', await p.evaluate(() => window.__kkq.save.drops));
  await p.evaluate(() => document.querySelector('#freepanel [data-ok]')?.click()); await wait(900);
  await p.evaluate(() => document.querySelector('[data-tab=free]')?.click()); await wait(400);
  await shot('8-tab-after');
}
note(errs.length ? 'PROBLEMS: ' + JSON.stringify(errs) : 'no problems flagged');
await b.close(); process.exit(errs.length ? 1 : 0);
