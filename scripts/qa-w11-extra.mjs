// QA: targeted World 11 checks in the real game, pressed with real keys where the check is about input.
// node scripts/qa-w11-extra.mjs <port> <section> [species=0]   sections: scroll | secret | wheel | cap | hard
// → shots/qa2/extra/<section>-*.png and a log. Needs a DEV server.
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const PORT = Number(process.argv[2]), SEC = process.argv[3], SP = Number(process.argv[4] ?? 0);
const W = Number(process.env.W ?? 844), H = Number(process.env.H ?? 390);
const dir = 'shots/qa2/extra'; fs.mkdirSync(dir, { recursive: true });
const wait = ms => new Promise(r => setTimeout(r, ms));
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const p = await (await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })).newPage();
const errs = []; p.on('pageerror', e => { errs.push('page error: ' + e.message); console.log('PAGEERROR', e.message); });
p.on('console', m => { if (m.type() === 'error' && !/favicon|Failed to load resource/.test(m.text())) errs.push('console: ' + m.text().slice(0, 200)); });
await p.goto(`http://localhost:${PORT}/?touch`, { waitUntil: 'commit', timeout: 120000 }); await p.evaluate(() => localStorage.clear()); await p.reload({ waitUntil: 'commit' });
for (let i = 0; i < 480 && !await p.evaluate(() => !!window.__kkq).catch(() => false); i++) await wait(250);
await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(900);
const shot = async name => { await p.screenshot({ path: `${dir}/${SEC}${W === 844 ? '' : '-' + W}-${name}.png` }).catch(() => {}); };
const log = (...a) => console.log(`[${SEC}]`, ...a.map(x => typeof x === 'string' ? x : JSON.stringify(x)));
const setup = (lv, upTo, extra = {}) => p.evaluate(async ([sp, lv, upTo, extra]) => {
  window.process ??= { env: {} };
  const m = await import('/scripts/hero-at.ts');
  const prof = m.heroFor(sp, lv, 1);
  const s = window.__kkq.save;
  s.unlocked = [...new Set([...s.unlocked, sp])]; s.selected = sp;
  const h = s.heroes[sp] ?? (s.heroes[sp] = prof);
  Object.assign(h, { level: prof.level, xp: extra.xp ?? 0, alloc: prof.alloc, skills: prof.skills, equip: prof.equip, tree: prof.tree, loadout: prof.loadout, skillPts: prof.skillPts, statPts: prof.statPts });
  h.cleared = {}; for (let w = 1; w <= 10; w++) for (let k = 1; k <= 10; k++) h.cleared[`${w}-${k}`] = 'A';
  for (let k = 1; k <= upTo; k++) h.cleared[`11-${k}`] = 'A';
  s.storyMode = 'key'; h.seen = ['intro']; for (const bt of ['open', 's2', 's3', 's4', 's6', 's7', 's8', 's9', 'elite', 'boss', 'after']) h.seen.push('w11-' + bt);
  s.tips = ['move', 'jump', 'attack', 'dodge', 'skill', 'gear', 'weak', 'resist', 'ladder', 'drop', 'arena', 'hazard', 'hazard-skin', 'sponge', 'potion', 'escort', 'fetch', 'boss', 'cookbook', 'exit'];
  s.items.jam = 30; s.items.bigjam = 10; s.quick = ['jam', 'bigjam', null, null]; s.crumbs = 50000;
  window.__kkq.scene.scene.restart({});
}, [SP, lv, upTo, extra]);
const midway = async () => { await p.evaluate(() => [...document.querySelectorAll('[data-mappage]')].pop()?.click()); await wait(500); };
const start = async id => {
  await midway(); await p.evaluate(i => document.querySelector(`[data-node="${i}"]`)?.click(), id); await wait(400);
  await p.evaluate(i => document.querySelector(`.playrow [data-play="${i}"]`)?.click(), id); await wait(1500);
  for (let i = 0; i < 40 && await p.evaluate(() => !!document.querySelector('#story.on')); i++) { await p.evaluate(() => document.querySelector('#story .skip, #story [data-skip]')?.click()); await wait(400); }
  await wait(1200); return p.evaluate(() => window.__kkq.world()?.stage.id ?? null);
};
const installBot = (speed, protect) => p.evaluate(async ([speed, protect]) => {
  const { Bot, SKILLED } = await import('/src/sim/bot.ts');
  const w = window.__kkq.world(); const bot = new Bot(w, SKILLED, 3, 0); w.__speed = speed; w.__protect = protect; w.__on = true;
  window.__ev = []; window.__toasts = [];
  new MutationObserver(ms => { for (const m of ms) for (const n of m.addedNodes) if (n.nodeType === 1 && /toast/i.test(n.className + (n.parentElement?.id ?? '') + (n.parentElement?.className ?? ''))) window.__toasts.push({ t: +window.__kkq.world()?.time.toFixed(2), text: n.textContent }); }).observe(document.body, { childList: true, subtree: true });
  const orig = w.step.bind(w);
  w.step = inputs => {
    let all = [];
    for (let k = 0; k < (w.__speed || 1); k++) {
      if (w.__on) inputs[0] = bot.think();
      if (w.__protect) { const h = w.heroes[0]; if (h.hp < h.d.maxHp * 0.5) h.hp = h.d.maxHp; }
      if (w.__bossFloor && w.boss && w.boss.hp < w.boss.maxHp * w.__bossFloor) w.boss.hp = w.boss.maxHp * w.__bossFloor;
      const evs = orig(inputs);
      for (const e of evs) if (!['hit', 'swing', 'jump', 'land', 'xp', 'crumbs', 'spawnPop', 'style', 'skill', 'mobAttack', 'dodge', 'block', 'stone', 'loot', 'heal', 'proc', 'gear', 'zap', 'shock', 'boom'].includes(e.t)) window.__ev.push({ time: +w.time.toFixed(2), ...e });
      all = all.concat(evs); if (w.cleared || w.failed) break;
    }
    return all;
  };
}, [speed, protect]);
const kq = fn => p.evaluate(fn);
const until = async (fn, ms, step = 150) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await p.evaluate(fn).catch(() => false)) return true; await wait(step); } return false; };
const resultText = () => p.evaluate(() => { const r = document.getElementById('result'); return r?.classList.contains('on') ? r.innerText.replace(/\s+/g, ' ').slice(0, 700) : null; });
const toCamp = async () => { await p.evaluate(() => { const r = document.querySelector('#result.on [data-r="camp"]'); if (r) r.click(); else window.__kkq.scene.scene.restart({}); }); await wait(1200); for (let i = 0; i < 20 && await p.evaluate(() => !!document.querySelector('#story.on')); i++) { await p.evaluate(() => document.querySelector('#story .skip, #story [data-skip]')?.click()); await wait(400); } };

if (SEC === 'scroll') {
  await setup(116, 5); await wait(1000);
  log('start', await start('11-6')); await installBot(3, true);
  await shot('0-start');
  log('objective at start:', await kq(() => { const w = window.__kkq.world(); return { obj: w.stage.objective, armed: w.objArmed, timer: w.objTimer, scroll: w.scroll, scrollMap: w.mapAt(w.scroll.x) }; }));
  if (!await until(() => { const w = window.__kkq.world(); return w.mapAt(w.heroes[0].x) === w.mapAt(w.scroll.x); }, 400000)) log('FAIL: the bot never reached the scroll map');
  await kq(() => { const w = window.__kkq.world(); w.__on = false; w.__speed = 1; });
  await wait(1500); await shot('1-scroll-map-entered');
  log('in the scroll map:', await kq(() => { const w = window.__kkq.world(); return { armed: w.objArmed, timer: +w.objTimer.toFixed(1), hud: document.body.innerText.match(/[^\n]*(Scroll|scroll)[^\n]*/g) }; }));
  // every drop the exit wants in hand, standing on the exit, no scroll: press UP for real
  const before = await kq(() => { const w = window.__kkq.world(), mi = w.mapAt(w.scroll.x), m = w.stage.maps[mi], ex = m.portals.find(q => q.need) ?? m.portals[0]; for (const q of m.goal.wants) w.drops[q.mob] = Math.max(w.drops[q.mob] ?? 0, q.n); const h = w.heroes[0]; for (const o of w.mobs) if (w.mapAt(o.x) === mi && !o.wake) { o.hp = 0; o.state = 'dead'; } h.x = ex.x; h.y = ex.y ?? w.stage.groundY; h.vy = 0; window.__n0 = window.__ev.length; return { mi, exit: ex, wants: m.goal.wants, drops: { ...w.drops }, hero: [Math.round(h.x), Math.round(h.y)] }; });
  log('at the exit with all drops, no scroll:', before);
  await wait(600);
  await p.keyboard.down('ArrowUp'); await wait(250); await p.keyboard.up('ArrowUp'); await wait(500);
  await shot('2-exit-refuses');
  const after = await kq(() => { const w = window.__kkq.world(), h = w.heroes[0]; return { map: w.mapAt(h.x), ev: window.__ev.slice(window.__n0).filter(e => ['objective', 'warp', 'needDrops', 'portal'].includes(e.t)), toasts: window.__toasts.slice(-3), ground: h.ground, hero: [Math.round(h.x), Math.round(h.y)] }; });
  log('after pressing UP:', after);
  if (after.map !== before.mi) log('FAIL: the exit let the hero through without the scroll');
  if (!after.ev.some(e => /Scroll/.test(e.text ?? ''))) log('FAIL?: no "Grab the Recipe Scroll first!" message (events above)');
  // now the bot fetches the scroll and leaves
  await kq(() => { const w = window.__kkq.world(); w.__on = true; w.__speed = 3; });
  const got = await until(() => window.__kkq.world().scroll?.got, 240000); await wait(300); await shot('3-scroll-got');
  log('scroll got:', got, await kq(() => window.__ev.filter(e => e.t === 'objective' || e.t === 'objFail' || e.t === 'goal').slice(-5)));
  const left = await until(() => { const w = window.__kkq.world(); return w.mapAt(w.heroes[0].x) > w.mapAt(w.scroll?.x ?? 0) || !!document.querySelector('#result.on'); }, 300000);
  log('left the scroll map after the scroll:', left);
  await until(() => !!document.querySelector('#result.on'), 400000); await wait(1200); await shot('4-result'); log('result:', await resultText());
}

if (SEC === 'secret') {
  await setup(117, 6); await wait(1000);
  await midway(); await p.evaluate(() => document.querySelector('[data-node="11-7"]')?.click()); await wait(400); await shot('0-card-11-7');
  log('card 11-7:', await kq(() => document.querySelector('.map .info')?.innerText.replace(/\s+/g, ' ').slice(0, 400)));
  log('start', await start('11-7')); await installBot(3, true);
  const info = await kq(() => { const w = window.__kkq.world(); const ch = w.props.find(q => q.kind === 'chest' && q.key), sp = w.props.filter(q => q.kind === 'sponge').sort((a, c) => Math.abs(a.x - ch.x) - Math.abs(c.x - ch.x))[0], pl = w.stage.platforms.find(q => q.secret); window.__ch = ch; window.__sp = sp; return { chest: ch && { x: ch.x, y: ch.y, map: w.mapAt(ch.x) }, sponge: sp && { x: sp.x, y: sp.y, map: w.mapAt(sp.x) }, ledge: pl, maps: w.stage.maps.map(m => [m.x0 ?? m.x, m.x1 ?? m.w, m.kind]), mapKeys: Object.keys(w.stage.maps[0]) }; });
  log('secret:', info);
  if (!info.chest) { log('FAIL: no key chest in 11-7'); }
  else {
    // the bot plays to map 2 (index 1), then real keys: walk onto the sponge, steer onto the ledge, hit the chest
    if (!await until(() => { const w = window.__kkq.world(); return w.mapAt(w.heroes[0].x) === 1; }, 400000)) log('FAIL: the bot never reached map 2');
    await kq(() => { const w = window.__kkq.world(); w.__on = false; w.__speed = 1; const h = w.heroes[0], mi = w.mapAt(h.x); for (const o of w.mobs) if (w.mapAt(o.x) === mi && !o.wake) { o.hp = 0; o.state = 'dead'; } });
    log('where the ledge is vs the map:', await kq(() => { const w = window.__kkq.world(); return { sponge: window.__sp.x, chest: window.__ch.x, spongeMap: w.mapAt(window.__sp.x), heroMap: w.mapAt(w.heroes[0].x), exit: w.stage.maps[1].portals }; }));
    await kq(() => { const w = window.__kkq.world(), h = w.heroes[0]; h.x = window.__sp.x - 420; h.y = w.stage.groundY; h.vy = 0; h.vx = 0; }); await wait(900);
    await shot('1-far-from-ledge');
    await p.keyboard.down('ArrowRight');
    const walked = await until(() => { const w = window.__kkq.world(); return w.heroes[0].x > window.__sp.x - 150; }, 15000, 50);
    await shot('2-ledge-fades-in');
    const bounced = await until(() => window.__ev.some(e => e.t === 'bounce') || window.__kkq.world().heroes[0].y < 250, 15000, 30);
    log('walked to the sponge:', walked, 'bounced:', bounced, await kq(() => { const h = window.__kkq.world().heroes[0]; return [Math.round(h.x), Math.round(h.y), h.state]; }));
    if (!bounced) { await p.keyboard.up('ArrowRight'); await p.keyboard.down('Space'); await wait(120); await p.keyboard.up('Space'); await p.keyboard.down('ArrowRight'); await until(() => window.__kkq.world().heroes[0].y < 250, 5000, 30); }
    await wait(150); await shot('3-bouncing');
    // steer: keep going right until over the ledge, then let go
    await until(() => window.__kkq.world().heroes[0].x > window.__ch.x - 30, 4000, 20); await p.keyboard.up('ArrowRight');
    const landed = await until(() => { const h = window.__kkq.world().heroes[0]; return h.ground && Math.abs(h.y - window.__ch.y) < 6; }, 6000, 40);
    log('landed on the secret ledge:', landed, await kq(() => { const h = window.__kkq.world().heroes[0]; return [Math.round(h.x), Math.round(h.y), h.ground]; }));
    if (!landed) { log('NOTE: real keys did not land on the ledge; placing the hero on it to test the chest'); await kq(() => { const h = window.__kkq.world().heroes[0]; h.x = window.__ch.x - 40; h.y = window.__ch.y; h.vy = 0; }); await wait(400); }
    await shot('4-on-ledge');
    await kq(() => { const h = window.__kkq.world().heroes[0]; window.__face = h.face; });
    if (await kq(() => window.__kkq.world().heroes[0].x > window.__ch.x)) { await p.keyboard.down('ArrowLeft'); await wait(60); await p.keyboard.up('ArrowLeft'); } else { await p.keyboard.down('ArrowRight'); await wait(60); await p.keyboard.up('ArrowRight'); }
    for (let i = 0; i < 25 && !await kq(() => window.__ev.some(e => e.t === 'key')); i++) { await p.keyboard.down('KeyJ'); await wait(90); await p.keyboard.up('KeyJ'); await wait(160); }
    await wait(300); await shot('5-chest-open');
    log('key event:', await kq(() => window.__ev.filter(e => e.t === 'key' || e.t === 'prop')), 'toasts:', await kq(() => window.__toasts.slice(-4)), 'save.keys:', await kq(() => window.__kkq.save.keys));
    // get down: walk off to the left, then onto the sponge again from the ledge (must not re-bounce forever)
    await p.keyboard.down('ArrowLeft'); const down = await until(() => { const h = window.__kkq.world().heroes[0]; return h.ground && h.y > window.__ch.y + 100; }, 8000, 40); await p.keyboard.up('ArrowLeft');
    log('walked off the ledge and landed:', down, await kq(() => { const h = window.__kkq.world().heroes[0]; return [Math.round(h.x), Math.round(h.y), h.state]; }));
    await wait(500); await shot('6-back-down');
  }
  await kq(() => { const w = window.__kkq.world(); w.__on = true; w.__speed = 3; });
  await until(() => !!document.querySelector('#result.on'), 600000); await wait(1200); await shot('7-result'); log('result:', await resultText());
  log('keys after the stage:', await kq(() => window.__kkq.save.keys)); await toCamp();
  await midway(); await p.evaluate(() => document.querySelector('[data-node="11-7"]')?.click()); await wait(500); await shot('8-card-with-secret');
  const btn = await kq(() => document.querySelector('[data-play="S-11"]')?.innerText ?? null); log('secret button on the card:', btn);
  if (btn) {
    await p.locator('[data-play="S-11"]').tap(); await wait(1500);
    for (let i = 0; i < 40 && await p.evaluate(() => !!document.querySelector('#story.on')); i++) { await p.evaluate(() => document.querySelector('#story .skip, #story [data-skip]')?.click()); await wait(400); }
    await wait(1500); log('S-11 started:', await kq(() => { const w = window.__kkq.world(); return w && { id: w.stage.id, name: w.stage.name, maps: w.stage.maps?.map(m => m.goal?.wants?.map(q => q.n + ' ' + q.mob) ?? m.kind), hazards: w.hazards.length, objective: w.stage.objective ?? null, crates: w.props.filter(q => q.kind === 'crate' || q.kind === 'jar').length, cookers: w.cookers?.length, roomFoes: w.mobs.filter(m => m.wake).map(m => w.mobName(m) + (m.elite ? ' (elite)' : '')) }; }));
    await shot('9-S11-start'); await installBot(3, true);
    let lastMap = -1;
    for (let t0 = Date.now(); Date.now() - t0 < 720000;) { if (await resultText()) break; const mi = await kq(() => { const w = window.__kkq.world(); return w ? w.mapAt(w.heroes[0].x) : -1; }).catch(() => -1); if (mi !== lastMap) { lastMap = mi; await wait(1200); await shot(`9-S11-map${mi}`); log(`S-11 map ${mi}:`, await kq(() => { const s = window.__kkq.scene, w = window.__kkq.world(), v = s.cameras.main.worldView; return w.mobs.filter(m => m.state !== 'dead' && m.x > v.x && m.x < v.right).map(m => w.mobName(m) + '/' + s.mobViews.get(m.id)?.img.texture.key); })); } await wait(400); }
    await wait(1200); await shot('9-S11-result'); log('S-11 result:', await resultText(), await kq(() => window.__ev.filter(e => ['bossWake', 'goal', 'clear', 'down'].includes(e.t)).map(e => e.t + ':' + (e.kind ?? e.text ?? ''))));
  }
}

if (SEC === 'wheel') {
  await setup(120, 9); await wait(1000);
  await midway(); await p.evaluate(() => document.querySelector('[data-node="11-10"]')?.click()); await wait(400); await shot('0-card-11-10');
  log('card 11-10:', await kq(() => document.querySelector('.map .info')?.innerText.replace(/\s+/g, ' ').slice(0, 500)));
  log('start', await start('11-10')); await installBot(3, true);
  await until(() => { const w = window.__kkq.world(); return w.stage.maps[w.mapAt(w.heroes[0].x)]?.kind === 'boss'; }, 500000);
  await kq(() => { const w = window.__kkq.world(); w.__speed = 1; w.__bossFloor = 0.12; });
  await wait(700); await shot('1-boss-room-enter');
  log('boss room on entry:', await kq(() => { const w = window.__kkq.world(), s = window.__kkq.scene; return { boss: w.boss && { kind: w.boss.kind, name: w.mobName(w.boss), st: w.boss.state, wake: !!w.boss.wake, art: s.mobViews.get(w.boss.id)?.img.texture.key }, foes: w.mobs.filter(m => m.state !== 'dead' && w.mapAt(m.x) === w.mapAt(w.heroes[0].x)).map(m => `${w.mobName(m)} ${m.state}${m.wake ? ' (asleep)' : ''}`), wakeEv: window.__ev.filter(e => e.t === 'bossWake'), ladders: w.stage.ladders.filter(l => w.mapAt(l.x) === w.mapAt(w.heroes[0].x)), hud: document.querySelector('#hud')?.innerText.replace(/\s+/g, ' ').slice(0, 200) }; }));
  await wait(2500); await shot('2-boss-awake');
  const seen = {}; let lastN = 0, phases = 0, shots = 0, t0 = Date.now();
  while (Date.now() - t0 < 420000 && !(seen.rain && seen.summon && seen.roar && phases >= 2 && Date.now() - t0 > 60000)) {
    const evs = await p.evaluate(i => window.__ev.slice(i), lastN); lastN += evs.length;
    for (const e of evs) {
      if (e.t === 'nemesisMove' && /Wheel/.test(e.move)) {
        const k = /Sugar/.test(e.move) ? 'rain' : /Wisps/.test(e.move) ? 'summon' : 'roar'; seen[k] = (seen[k] ?? 0) + 1;
        if (seen[k] <= 2) {
          const tReal = Date.now();
          await shot(`wheel-${k}-${seen[k]}-a`); const a = await kq(() => { const w = window.__kkq.world(), v = window.__kkq.scene.mobViews.get(w.boss.id).wheel, c = window.__kkq.scene.cameras.main.worldView; return { t: +w.time.toFixed(2), st: w.boss.state, mv: w.boss.move, shown: v?.root.visible, label: v?.label.text, sx: Math.round(v?.root.x - c.x), sy: Math.round(v?.root.y - c.y), heroDist: Math.round(Math.abs(w.boss.x - w.heroes[0].x)), bossOnScreen: w.boss.x > c.x && w.boss.x < c.right, toast: window.__toasts.slice(-2) }; });
          await wait(450); await shot(`wheel-${k}-${seen[k]}-b`);
          // when does the wind-up end (sim seconds after the callout)?
          await until(() => { const b = window.__kkq.world().boss; return !(b.state === 'windup' && b.move.startsWith('wheel-')); }, 4000, 20);
          const end = await kq(() => +window.__kkq.world().time.toFixed(2)); await shot(`wheel-${k}-${seen[k]}-c-fires`);
          await wait(500); await shot(`wheel-${k}-${seen[k]}-d`); await wait(600); await shot(`wheel-${k}-${seen[k]}-e`);
          log(`WHEEL ${e.move} called at sim ${e.time}; first look`, a, `wind-up ended at sim ${end} (${(end - e.time).toFixed(2)} s after the callout, ${Date.now() - tReal} ms real incl. shots)`);
        }
      } else if (e.t === 'nemesisMove') { const k = e.move.replace(/[^a-z]/gi, ''); if (!seen['m' + k]) { seen['m' + k] = 1; await shot(`move-${k}`); log('move:', e.move, 'at', e.time); } }
      if (e.t === 'phase' || e.t === 'enrage') { phases++; await wait(250); await shot(`phase-${phases}-${e.t}`); log('PHASE/ENRAGE', e, await kq(() => window.__toasts.slice(-2))); }
      if (e.t === 'summon') log('summon at', e.time, await kq(() => { const w = window.__kkq.world(); return w.mobs.filter(m => m.parent === w.boss.id && m.state !== 'dead').map(m => w.mobName(m)); }));
      if (e.t === 'hazard' && !seen.hz) { seen.hz = 1; log('hazard switched on in the boss room', e); await wait(300); await shot('hazard-in-room'); }
    }
    if (shots < 5 && Date.now() - t0 > shots * 15000 + 5000) { shots++; await shot(`fight-${shots}`); }
    // once phases have been seen, hold him in the last phase until the wheel has shown all three
    await wait(120);
  }
  log('wheel picks seen:', seen, 'phases/enrage events:', phases, 'boss hp now', await kq(() => +(window.__kkq.world().boss.hp / window.__kkq.world().boss.maxHp).toFixed(2)));
  log('all boss events:', await kq(() => window.__ev.filter(e => !['hazard', 'summon', 'tired', 'stagger', 'interrupt', 'perfect', 'guardBreak', 'armorBreak', 'guardUp', 'use', 'mobDie', 'drop', 'pickup', 'burrow', 'recover'].includes(e.t)).map(e => `${e.time} ${e.t} ${e.move ?? e.name ?? e.text ?? e.kind ?? ''}`)));
  // let him fall
  await kq(() => { const w = window.__kkq.world(); w.__bossFloor = 0; });
  const fell = await until(() => window.__toasts.some(t => /FALLS/.test(t.text)), 240000, 60); await shot('3-boss-falls');
  log('boss-fall toast:', fell, await kq(() => window.__toasts.filter(t => /FALLS|Showman|weapon|Sugar Cube|dropped/i.test(t.text))));
  await until(() => !!document.querySelector('#result.on') || !!document.querySelector('#story.on'), 60000); await wait(800);
  if (await kq(() => !!document.querySelector('#story.on'))) { await shot('4-after-scene'); for (let i = 0; i < 40 && await p.evaluate(() => !!document.querySelector('#story.on')); i++) { await p.evaluate(() => document.querySelector('#story .skip, #story [data-skip]')?.click()); await wait(400); } }
  await until(() => !!document.querySelector('#result.on'), 30000); await wait(1500); await shot('5-result');
  log('result:', await resultText(), 'credits open:', await kq(() => !!document.getElementById('credits')));
  log('all toasts in the fight:', await kq(() => [...new Set(window.__toasts.map(t => t.text))].slice(0, 60)));
  log('save after:', await kq(() => { const s = window.__kkq.save, h = s.heroes[s.selected]; return { cleared: h.cleared['11-10'], hardOpen: !!h.cleared['11-10'], bwPity: s.bwPity, boxes: s.boxes.length, bagShowman: s.bag.filter(i => /flosso/.test(i.base)).map(i => i.base + ' ilv' + i.ilvl + ' r' + i.rarity) }; }));
  // Hard mode on the Midway after the boss
  await toCamp(); await midway(); await p.evaluate(() => document.querySelector('[data-node="11-1"]')?.click()); await wait(400); await shot('6-card-after-boss');
  log('difficulty buttons:', await kq(() => [...document.querySelectorAll('.map .info button, .map .info [data-act]')].map(e => (e.dataset.act ?? '') + ':' + e.innerText.replace(/\s+/g, ' ').slice(0, 30) + (e.disabled ? ' (disabled)' : ''))));
}

if (SEC === 'cap') {
  // Lv 119 with the XP bar nearly full: one stage takes it to 120; then another stage at the cap
  const need = await p.evaluate(async () => { const m = await import('/src/sim/stats.ts'); return { x119: m.xpFor(119), x120: m.xpFor(120), max: m.MAX_LEVEL }; }); log('xp:', need);
  await setup(119, 10, { xp: need.x119 - 50 }); await wait(1000);
  const tabs = async tag => { for (const t of ['hero', 'skills']) { await p.evaluate(t => document.querySelector(`[data-tab="${t}"]`)?.click(), t); await wait(600); await shot(`${tag}-${t}`); log(`${tag} ${t} tab:`, await kq(() => document.querySelector('#camp .body, #camp')?.innerText.replace(/\s+/g, ' ').slice(0, 900))); const junk = await kq(() => /undefined|NaN|\[object|Infinity/.test(document.getElementById('camp').innerText)); if (junk) log('FAIL: junk text on the tab'); } await p.evaluate(() => document.querySelector('[data-tab="map"]')?.click()); await wait(400); };
  await tabs('lv119');
  log('start', await start('11-1')); await installBot(3, true); await shot('0-hud-119');
  log('HUD at 119:', await kq(() => document.querySelector('#hud')?.innerText.replace(/\s+/g, ' ').slice(0, 160)));
  const lvUp = await until(() => window.__kkq.save.heroes[window.__kkq.save.selected].level >= 120 || window.__kkq.world()?.heroes[0].d.level >= 120 || window.__toasts.some(t => /LEVEL/i.test(t.text)), 120000, 50);
  await shot('1-level-up'); await wait(400); await shot('1-level-up-b');
  log('level-up seen in stage:', lvUp, await kq(() => ({ toasts: window.__toasts.filter(t => /LEVEL|Lv/i.test(t.text)).slice(0, 5), hud: document.querySelector('#hud')?.innerText.replace(/\s+/g, ' ').slice(0, 160) })));
  await until(() => !!document.querySelector('#result.on'), 500000); await wait(1500); await shot('2-result-119-to-120'); log('result:', await resultText());
  log('profile:', await kq(() => { const s = window.__kkq.save, h = s.heroes[s.selected]; return { level: h.level, xp: h.xp, skillPts: h.skillPts, statPts: h.statPts }; }));
  await toCamp(); await tabs('lv120');
  // at the cap: another clear
  log('start again at 120', await start('11-2')); await installBot(3, true); await wait(1500); await shot('3-hud-120');
  log('HUD at 120:', await kq(() => document.querySelector('#hud')?.innerText.replace(/\s+/g, ' ').slice(0, 160)));
  await until(() => !!document.querySelector('#result.on'), 500000); await wait(1500); await shot('4-result-at-cap'); log('result at the cap:', await resultText());
  log('profile at the cap:', await kq(() => { const s = window.__kkq.save, h = s.heroes[s.selected]; return { level: h.level, xp: h.xp, skillPts: h.skillPts, statPts: h.statPts, boxes: s.boxes.length }; }));
  // open the boxes: item levels of what a Lv 120 kaiju gets
  await p.evaluate(() => document.querySelector('#result.on [data-r="boxes"]')?.click()); await wait(1500); await shot('5-boxes');
  for (let i = 0; i < 40 && await kq(() => window.__kkq.save.boxes.length > 0); i++) { await p.mouse.click(W / 2, H / 2); await wait(350); await p.evaluate(() => [...document.querySelectorAll('#gacha button')].find(b => /OPEN|ALL|SKIP|NEXT|DONE|OK/i.test(b.innerText))?.click()); await wait(350); }
  await shot('6-boxes-opened');
  log('bag gear item levels:', await kq(() => { const s = window.__kkq.save; const by = {}; for (const i of s.bag) by[i.ilvl] = (by[i.ilvl] ?? 0) + 1; return { by, boxesLeft: s.boxes.length, sample: s.bag.slice(-5).map(i => `${i.base} ilv${i.ilvl} r${i.rarity}`) }; }));
  await p.evaluate(() => { document.getElementById('gacha')?.classList.remove('on'); window.__kkq.scene.scene.restart({}); }); await wait(1000);
  for (const t of ['bag', 'market']) { await p.evaluate(t => document.querySelector(`[data-tab="${t}"]`)?.click(), t); await wait(700); await shot(`7-${t}-lv120`); }
  log('market at 120:', await kq(() => document.getElementById('camp').innerText.replace(/\s+/g, ' ').match(/TODAY.S GEAR.{0,500}/i)?.[0]));
}
console.log(errs.length ? errs : 'no page errors');
await b.close(); process.exit(0);
