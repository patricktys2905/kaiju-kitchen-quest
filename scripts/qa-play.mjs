// QA: World 11 played in the real game by the balance bot (its inputs are fed into world.step in the page; everything else
// is the stock game). node scripts/qa-play.mjs <port> <species> <level> <speed> <stage ids...>
// → shots/qa2/play/<sp>-<stage>-*.png, shots/qa2/play/<sp>.json (facts per stage). Needs a DEV server.
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const [PORT, SP, LV, SPEED] = process.argv.slice(2, 6).map(Number);
const stages = process.argv.slice(6);
const W = Number(process.env.W ?? 844), H = Number(process.env.H ?? 390);
const dir = 'shots/qa2/play'; fs.mkdirSync(dir, { recursive: true });
const wait = ms => new Promise(r => setTimeout(r, ms));
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const p = await (await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })).newPage();
const errs = []; p.on('pageerror', e => { errs.push('page error: ' + e.message); console.log('PAGEERROR', e.message); });
p.on('console', m => { if (m.type() === 'error' && !/favicon|Failed to load resource/.test(m.text())) errs.push('console: ' + m.text().slice(0, 200)); });
const ready = async () => { for (let i = 0; i < 480 && !await p.evaluate(() => !!window.__kkq).catch(() => false); i++) await wait(250); };
const boot = async () => { await p.goto(`http://localhost:${PORT}/?touch`, { waitUntil: 'commit', timeout: 120000 }); await ready(); await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(900); };
await p.goto(`http://localhost:${PORT}/?touch`, { waitUntil: 'commit', timeout: 120000 }); await p.evaluate(() => localStorage.clear());
await boot();
const out = { species: SP, startLevel: LV, stages: {}, errs };
const save = () => fs.writeFileSync(`${dir}/${SP}.json`, JSON.stringify(out, null, 1));
const shot = async name => { await p.screenshot({ path: `${dir}/${SP}-${name}.png` }).catch(() => {}); };

// the save: this kaiju at LV with the balance bot's build, Worlds 1..10 cleared, scenes seen, tips off, jams in the quick bag
await p.evaluate(async ([sp, lv]) => {
  window.process ??= { env: {} };
  const m = await import('/scripts/hero-at.ts');
  const prof = m.heroFor(sp, lv, 1);
  const s = window.__kkq.save;
  s.unlocked = [...new Set([...s.unlocked, sp])]; s.selected = sp;
  const h = s.heroes[sp] ?? (s.heroes[sp] = prof);
  Object.assign(h, { level: prof.level, xp: 0, alloc: prof.alloc, skills: prof.skills, equip: prof.equip, tree: prof.tree, loadout: prof.loadout, skillPts: prof.skillPts, statPts: prof.statPts });
  h.cleared = {}; for (let w = 1; w <= 10; w++) for (let k = 1; k <= 10; k++) h.cleared[`${w}-${k}`] = 'A';
  s.storyMode = 'key';
  const st = await import('/src/story/stories.ts');
  h.seen = ['intro']; for (const bt of ['open', 's2', 's3', 's4', 's6', 's7', 's8', 's9', 'elite', 'boss', 'after']) h.seen.push('w11-' + bt);
  window.__beats = Object.keys(st);
  s.tips = ['move', 'jump', 'attack', 'dodge', 'skill', 'gear', 'weak', 'resist', 'ladder', 'drop', 'arena', 'hazard', 'hazard-skin', 'sponge', 'potion', 'escort', 'fetch', 'boss', 'cookbook', 'exit'];
  s.items.jam = 30; s.items.bigjam = 10; s.quick = ['jam', 'bigjam', null, null];
  s.crumbs = 50000;
  window.__kkq.scene.scene.restart({});
}, [SP, LV]);
await wait(1200);

const midway = async () => { await p.evaluate(() => [...document.querySelectorAll('[data-mappage]')].pop()?.click()); await wait(500); };
/** start a stage through the map: tab → node → PLAY (or the secret-stage button) */
async function startStage(id) {
  await midway();
  if (id.startsWith('S-')) {
    await p.evaluate(() => document.querySelector('[data-node="11-9"]')?.click()); await wait(400);
    const btn = await p.evaluate(i => { const e = document.querySelector(`[data-play="${i}"]`); return e ? e.outerHTML.slice(0, 200) : null; }, id);
    if (!btn) return { ok: false, why: 'no secret-stage button on the card', card: await p.evaluate(() => document.querySelector('.map .info')?.innerText.slice(0, 300)) };
    await p.evaluate(i => document.querySelector(`[data-play="${i}"]`).click(), id);
  } else {
    const node = await p.evaluate(i => { const e = document.querySelector(`[data-node="${i}"]`); return e ? { locked: e.classList.contains('locked') } : null; }, id);
    if (!node) return { ok: false, why: 'no node on the map' };
    if (node.locked) return { ok: false, why: 'node locked' };
    await p.evaluate(i => document.querySelector(`[data-node="${i}"]`).click(), id); await wait(400);
    await shot(`${id}-card`);
    await p.evaluate(i => document.querySelector(`.playrow [data-play="${i}"]`)?.click(), id);
  }
  await wait(1200);
  for (let i = 0; i < 40 && await p.evaluate(() => !!document.querySelector('#story.on')); i++) { await p.evaluate(() => document.querySelector('#story .skip, #story [data-skip]')?.click()); await wait(400); }
  await wait(1200);
  const got = await p.evaluate(() => window.__kkq.world()?.stage.id ?? null);
  return { ok: got === id, why: got === id ? '' : `world is ${got}` };
}
/** put the bot on the player's buttons: the page's world.step gets the bot's input, SPEED sim steps per game step */
const installBot = (speed, protect) => p.evaluate(async ([speed, protect, seed]) => {
  const { Bot, SKILLED } = await import('/src/sim/bot.ts');
  const w = window.__kkq.world(); if (w.__bot) { w.__speed = speed; w.__protect = protect; return; }
  const bot = new Bot(w, SKILLED, seed, 0); w.__bot = bot; w.__speed = speed; w.__protect = protect; w.__on = true;
  window.__ev = []; window.__seen = {}; window.__bad = [];
  const keep = new Set(['bossWake', 'goal', 'objective', 'objFail', 'key', 'warp', 'phase', 'nemesisMove', 'enrage', 'clear', 'down', 'needDrops', 'doorLocked', 'hazard', 'mimic', 'revive', 'arenaLock', 'summon', 'tired', 'portal']);
  const orig = w.step.bind(w);
  w.step = inputs => {
    let all = [];
    for (let k = 0; k < (w.__speed || 1); k++) {
      if (w.__on) inputs[0] = bot.think();
      if (w.__protect) { const h = w.heroes[0]; if (h.hp < h.d.maxHp * 0.5) h.hp = h.d.maxHp; }
      const evs = orig(inputs);
      for (const e of evs) if (keep.has(e.t)) window.__ev.push({ time: +w.time.toFixed(2), ...e });
      for (const e of evs) if (e.t === 'loot') window.__seen['loot:' + e.kind] = (window.__seen['loot:' + e.kind] ?? 0) + e.n;
      all = all.concat(evs);
      if (w.cleared || w.failed) break;
    }
    return all;
  };
}, [speed, protect, SP + 1]);
/** what is on screen now: monsters in view with their texture, flip and size; hazards; the hero */
const look = () => p.evaluate(() => {
  const s = window.__kkq.scene, w = window.__kkq.world(); if (!w) return null;
  const v = s.cameras.main.worldView, h = w.heroes[0];
  const mobs = [];
  for (const m of w.mobs) {
    if (m.state === 'dead' || m.x < v.x || m.x > v.right) continue;
    const mv = s.mobViews.get(m.id); if (!mv) continue;
    const key = mv.img.texture.key;
    mobs.push({ kind: m.kind, key, flipX: mv.img.flipX, face: m.face, hpx: Math.round(mv.img.displayHeight), wpx: Math.round(mv.img.displayWidth), wake: !!m.wake, elite: !!m.elite, st: m.state, mv: m.move, name: w.mobName(m), lv: m.lv });
    if (key === '__WHITE' || key === '__MISSING' || key === '__DEFAULT') window.__bad.push(m.kind + ':' + key);
    window.__seen['mob:' + m.kind + ':' + key] = (window.__seen['mob:' + m.kind + ':' + key] ?? 0) + 1;
  }
  const hz = w.hazards.filter(z => z.x > v.x && z.x < v.right).map(z => ({ kind: z.kind, st: z.state }));
  return { t: +w.time.toFixed(1), map: w.mapAt(h.x), maps: w.stage.maps?.length, x: Math.round(h.x), y: Math.round(h.y), hp: Math.round(h.hp / h.d.maxHp * 100), state: h.state, mobs, hz, drops: { ...w.drops }, boss: w.boss ? { kind: w.boss.kind, hp: +(w.boss.hp / w.boss.maxHp).toFixed(2), st: w.boss.state, mv: w.boss.move } : null,
    cleared: !!w.cleared, failed: !!w.failed, portal: !!w.portal, zones: w.zones2?.map(z => !!z.done), puddles: w.puddles?.filter(q => q.x > v.x && q.x < v.right).length ?? 0, npc: w.npc ? { x: Math.round(w.npc.x), hp: +(w.npc.hp / w.npc.maxHp).toFixed(2) } : null, scroll: w.scroll ? { got: w.scroll.got } : null, holdout: +(w.holdout ?? 0).toFixed(1), level: h.d.level ?? null };
});
const resultOn = () => p.evaluate(() => { const r = document.getElementById('result'); return r?.classList.contains('on') ? r.innerText.replace(/\s+/g, ' ').slice(0, 600) : null; });

for (const id of stages) {
  const rec = out.stages[id] = { attempts: 0 }; let done = false;
  for (let attempt = 1; attempt <= 3 && !done; attempt++) {
    rec.attempts = attempt;
    const protect = attempt >= 2; // a second try keeps the hero alive (noted in the record)
    const st = await startStage(id);
    rec.start = st; console.log(`[${SP}] ${id} start:`, JSON.stringify(st));
    if (!st.ok) { await shot(`${id}-nostart`); break; }
    await shot(`${id}-0start`);
    rec.stage = await p.evaluate(() => { const w = window.__kkq.world(), st = w.stage; return { name: st.name, maps: st.maps?.map(m => ({ kind: m.kind, wants: m.goal?.wants?.map(q => `${q.n} ${q.mob}`) ?? null })), objective: st.objective?.kind ?? null, hazards: [...new Set(w.hazards.map(z => z.kind + (z.skin ? '/' + z.skin : '')))], roomFoes: w.mobs.filter(m => m.wake).map(m => ({ kind: m.kind, name: w.mobName(m), asleep: true })), heroLv: window.__kkq.save.heroes[window.__kkq.save.selected].level }; });
    await installBot(SPEED, protect);
    let lastMap = -1, t0 = Date.now(), lastShot = 0, n = 0, seenWarn = false, seenOn = false, seenPud = false, bossShots = 0, wheelShots = {}, lastEv = 0, phaseShots = 0;
    rec.maps = []; rec.protect = protect;
    while (Date.now() - t0 < 14 * 60000) {
      const L = await look().catch(() => null);
      const res = await resultOn();
      if (res) { rec.result = res; await wait(1500); await shot(`${id}-9result`); rec.result = await resultOn(); done = !/KNOCKED OUT/.test(res); rec.failed = !done; break; }
      if (!L) { await wait(300); continue; }
      if (L.map !== lastMap) {
        lastMap = L.map; await wait(SPEED > 1 ? 900 : 1800); await shot(`${id}-map${L.map}`); rec.maps.push({ map: L.map, t: L.t, mobs: (await look())?.mobs?.map(m => `${m.kind}/${m.key}`) });
        const isBoss = await p.evaluate(() => { const w = window.__kkq.world(); return w.stage.maps?.[w.mapAt(w.heroes[0].x)]?.kind === 'boss'; });
        if (isBoss) {
          // the boss room at normal speed: is the foe awake, which one, which art
          await p.evaluate(() => { window.__kkq.world().__speed = 1; });
          await wait(1500); const B = await look(); rec.bossRoom = { t: B?.t, mobs: B?.mobs, boss: B?.boss, wakeEv: await p.evaluate(() => window.__ev.filter(e => e.t === 'bossWake')) };
          await shot(`${id}-boss0`);
          if (!id.endsWith('-10')) await p.evaluate(s => { window.__kkq.world().__speed = Math.min(2, s); }, SPEED);
        }
      }
      // the Caramel Drip: warning, firing, puddle
      if (!seenWarn && L.hz.some(z => z.kind === 'wax' && z.st === 'warn')) { seenWarn = true; await shot(`${id}-hz-warn`); }
      else if (!seenOn && L.hz.some(z => z.kind === 'wax' && z.st === 'on')) { seenOn = true; await shot(`${id}-hz-on`); }
      else if (!seenPud && seenOn && L.puddles > 0) { seenPud = true; await shot(`${id}-hz-puddle`); }
      // boss fights: the wheel and phases
      const evs = await p.evaluate(i => window.__ev.slice(i), lastEv); lastEv += evs.length;
      for (const e of evs) {
        if (e.t === 'nemesisMove') { const k = e.move.replace(/[^a-z]+/gi, '').slice(0, 30); wheelShots[k] = (wheelShots[k] ?? 0) + 1; if (wheelShots[k] <= 2) { await shot(`${id}-move-${k}-${wheelShots[k]}a`); await wait(350); await shot(`${id}-move-${k}-${wheelShots[k]}b`); await wait(450); await shot(`${id}-move-${k}-${wheelShots[k]}c`); } }
        if ((e.t === 'phase' || e.t === 'enrage') && phaseShots++ < 4) { await wait(300); await shot(`${id}-${e.t}-${phaseShots}`); }
        if (e.t === 'objective' || e.t === 'objFail' || e.t === 'key') { await wait(200); await shot(`${id}-obj-${n++}`); }
      }
      if (L.boss && L.boss.st !== 'sleep' && bossShots < 4 && Date.now() - lastShot > 9000) { bossShots++; lastShot = Date.now(); await shot(`${id}-fight-${bossShots}`); }
      else if (Date.now() - lastShot > 45000) { lastShot = Date.now(); await shot(`${id}-t${Math.round((Date.now() - t0) / 1000)}`); }
      rec.last = { t: L.t, map: L.map, hp: L.hp, drops: L.drops, zones: L.zones, boss: L.boss, npc: L.npc, scroll: L.scroll };
      await wait(250);
    }
    rec.events = await p.evaluate(() => window.__ev).catch(() => []);
    rec.seen = await p.evaluate(() => window.__seen).catch(() => ({}));
    rec.bad = await p.evaluate(() => [...new Set(window.__bad)]).catch(() => []);
    rec.realSeconds = Math.round((Date.now() - t0) / 1000);
    rec.after = await p.evaluate(() => { const s = window.__kkq.save, h = s.heroes[s.selected]; return { level: h.level, xp: h.xp, skillPts: h.skillPts, statPts: h.statPts, cleared: Object.keys(h.cleared).filter(k => /^(11|S)-/.test(k)).map(k => k + ':' + h.cleared[k]), keys: s.keys ?? [], boxes: s.boxes.length, drops: Object.fromEntries(Object.entries(s.drops ?? {}).filter(([, v]) => v)) }; });
    console.log(`[${SP}] ${id} attempt ${attempt}${protect ? ' (protected)' : ''}: ${done ? 'CLEARED' : rec.result ? 'FAILED' : 'TIMEOUT'} in ${rec.realSeconds}s real, sim t ${rec.last?.t}; level now ${rec.after.level}; bad art: ${JSON.stringify(rec.bad)}; result: ${(rec.result ?? '').slice(0, 260)}`);
    save();
    if (!done && !rec.result) { await shot(`${id}-timeout`); rec.timeout = true; }
    // back to camp
    await p.evaluate(() => { const r = document.querySelector('#result.on [data-r="camp"]'); if (r) r.click(); else window.__kkq.scene.scene.restart({}); }); await wait(1200);
    for (let i = 0; i < 20 && await p.evaluate(() => !!document.querySelector('#story.on')); i++) { await p.evaluate(() => document.querySelector('#story .skip, #story [data-skip]')?.click()); await wait(400); }
    await p.evaluate(() => { document.getElementById('gacha')?.classList.remove('on'); }); await wait(300);
  }
}
out.final = await p.evaluate(() => { const s = window.__kkq.save, h = s.heroes[s.selected]; return { level: h.level, xp: h.xp, skillPts: h.skillPts, statPts: h.statPts, hard: s.hard, keys: s.keys, cleared: Object.keys(h.cleared).filter(k => /^(11|S)-/.test(k)) }; });
// keep the save for later looks (Hero / Skills tabs at the new levels)
fs.writeFileSync(`${dir}/${SP}-save.json`, await p.evaluate(() => { try { return localStorage.getItem('kkq-save-v3') ?? JSON.stringify(window.__kkq.save); } catch { return '{}'; } }));
save();
console.log(`[${SP}] done`, JSON.stringify(out.final), errs.length ? errs : 'no page errors');
await b.close(); process.exit(0);
