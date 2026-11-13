// QA health check at sim level (no browser): npx vite-node scripts/qa-sim.ts [daily|buddy|coop|all]
//  daily: the Daily Dungeon's shape (maps? wanted drops spawn? boss-room foe?) and WHY the bot's runs end (clear / wipe / out of time)
//  buddy: player bot + CPU buddy bot on story map stages: does the buddy stay in the player's map, does the stage finish
//  coop : two humans (humans = 2): what happens when only one goes through a portal; what a guest's drawing World sees
import { AVERAGE, SKILLED, Bot } from '../src/sim/bot';
import { dailyStage, endlessFloor, rushStages } from '../src/sim/free';
import { MOBS } from '../src/sim/mobs';
import { STAGES } from '../src/sim/stages';
import { derive } from '../src/sim/stats';
import { NO_INPUT, type Input, type StageDef } from '../src/sim/types';
import { World } from '../src/sim/world';
import { applySnapshot, makeSnapshot } from '../src/net/snapshot';
import { heroFor } from './hero-at';

const what = process.argv[2] ?? 'all';
const J = (o: unknown) => JSON.stringify(o);

function shape(st: StageDef): string {
  const maps = st.maps;
  if (!maps) return `${st.id} "${st.name}" NO MAPS width ${st.width} mobs ${st.mobs.length} arenas ${st.arenas?.length ?? 0} boss ${!!st.boss}`;
  const out = [`${st.id} "${st.name}" maps ${maps.length} width ${st.width} objective ${st.objective?.kind ?? '-'}`];
  maps.forEach((m, i) => {
    const mobs = st.mobs.filter(o => o.x >= m.x0 && o.x <= m.x1);
    const g = m.goal;
    const wants = g?.kind === 'collect' ? g.wants.map(q => `${q.n}x${q.mob}${m.spawns?.kinds.includes(q.mob) ? '' : ' (NOT IN SPAWNS!)'}${mobs.some(o => o.kind === q.mob) ? '' : ' (none placed at start)'}`).join(', ') : '-';
    out.push(`   [${i}] ${m.kind} "${m.name}" x ${m.x0}-${m.x1} mobs ${mobs.length} (${mobs.map(o => o.kind + (o.wake ? '*asleep' : '') + (o.elite ? '!' : '')).join(' ')}) wants ${wants} portals ${J(m.portals.map(p => [p.x, p.to]))}`);
  });
  const foe = st.mobs[0];
  out.push(`   boss-room foe: ${foe.kind} (${MOBS[foe.kind].name}) lv ${foe.lv} wake ${foe.wake} inBossMap ${foe.x >= maps[maps.length - 1].x0}`);
  return out.join('\n');
}

/** One bot run with a post-mortem. */
function run(st: StageDef, sp: number, lv: number, r: number, minutes: number, opts = AVERAGE, jams = 3, party: number[] = []) {
  const w = new World(st, derive(heroFor(sp, lv, r + 1)), 100 + r, [{ id: 'jam', n: jams }, null, null, null], 0, false, undefined, [], undefined, false, party.map(b => derive(heroFor(b, lv, r + 5))));
  const bots = [new Bot(w, opts, 7 + r), ...party.map((_, i) => new Bot(w, AVERAGE, 31 * (i + 1) + 7, i + 1))];
  const maps = st.maps;
  let bossSeen = false, bossAwakeOnEntry: boolean | null = null, foeKilled = false, enterBossT = -1, apart = 0, apartMax = 0, apartRun = 0;
  const foe = w.mobs.find(m => m.roomBoss) ?? null;
  const mapT: number[] = [];
  let i = 0;
  for (; i < 60 * 60 * minutes && !w.cleared && !w.failed; i++) {
    w.step(bots.map(b => b.think()));
    if (maps) {
      const mi = w.mapAt(w.heroes[0].x);
      mapT[mi] = (mapT[mi] ?? 0) + 1 / 60;
      if (mi === maps.length - 1 && enterBossT < 0) { enterBossT = w.time; bossSeen = !!foe && w.mobs.includes(foe) && foe.state !== 'dead'; }
      if (enterBossT >= 0 && bossAwakeOnEntry === null && w.time > enterBossT + 6) bossAwakeOnEntry = !!foe && !foe.wake;
      if (foe && (foe.state === 'dead' || !w.mobs.includes(foe))) foeKilled = true;
      if (w.heroes.length > 1) { const d = w.mapAt(w.heroes[1].x) !== mi; if (d) { apart++; apartRun++; apartMax = Math.max(apartMax, apartRun); } else apartRun = 0; }
    }
  }
  return { cleared: w.cleared, failed: w.failed, timeout: !w.cleared && !w.failed, t: Math.round(w.time), map: maps ? w.mapAt(w.heroes[0].x) : -1, mapT: mapT.map(t => Math.round(t)), bossSeen, bossAwakeOnEntry, foeKilled, enterBossT: Math.round(enterBossT), apartS: +(apart / 60).toFixed(2), apartMaxS: +(apartMax / 60).toFixed(2), zones: w.zones2.map(z => z.done), drops: w.drops, w };
}
type R = ReturnType<typeof run>;
const tally = (rs: R[]) => `n ${rs.length}: clear ${rs.filter(r => r.cleared).length}, wiped ${rs.filter(r => r.failed).length} (in map ${J(rs.filter(r => r.failed).map(r => r.map))}), OUT OF TIME ${rs.filter(r => r.timeout).length} (in map ${J(rs.filter(r => r.timeout).map(r => r.map))}); clear time s ${J(rs.filter(r => r.cleared).map(r => r.t))}; cleared-with-foe-killed ${rs.filter(r => r.cleared && r.foeKilled).length}/${rs.filter(r => r.cleared).length}; foe present on entry ${rs.filter(r => r.bossSeen).length}/${rs.filter(r => r.enterBossT >= 0).length}; foe awake 6s after entry ${rs.filter(r => r.bossAwakeOnEntry).length}/${rs.filter(r => r.bossAwakeOnEntry !== null).length}`;

if (what === 'daily' || what === 'all') {
  console.log('===== DAILY DUNGEON: shape =====');
  for (const day of [20261110, 20261111, 20261112, 20261113, 20261114, 20261117, 20261124, 20261201, 20261208]) console.log(`day ${day}:`, shape(dailyStage(day, 25)));
  console.log('===== DAILY: why runs end (AVERAGE bot, 3 jams, like free-balance; 5 min cap = free-balance, 12 min cap = a patient player) =====');
  for (const lv of [10, 40]) {
    const r5: R[] = [], r12: R[] = [];
    for (const day of [20261113, 20261114, 20261117]) for (const sp of [0, 5, 10, 15]) { const st = dailyStage(day, lv); r5.push(run(st, sp, lv, 0, 5)); r12.push(run(st, sp, lv, 0, 12)); }
    console.log(`Lv${lv}  5 min cap: ${tally(r5)}`);
    console.log(`Lv${lv} 12 min cap: ${tally(r12)}`);
  }
  console.log('===== ENDLESS / RUSH shape =====');
  for (const f of [1, 4, 5, 10, 15, 20]) { const st = endlessFloor(f, 25, 11); console.log(`floor ${f}: ${st.name} world ${st.world} boss ${!!st.boss} mobs ${J(st.mobs.map(m => m.kind))} waves ${J(st.arenas?.[0]?.waves.map(wv => wv.map(m => m.kind + (m.elite ? '!' : ''))))} maps ${!!st.maps}`); }
  for (const st of rushStages([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 60)) console.log(`${st.num}: ${st.name} mobs ${J(st.mobs.map(m => m.kind + ' lv' + m.lv))} maps ${!!st.maps} width ${st.width}`);
}

if (what === 'buddy' || what === 'all') {
  console.log('===== CPU BUDDY on story map stages (player SKILLED bot 8 jams + AVERAGE buddy) =====');
  for (const id of ['1-2', '1-4', '1-6', '1-8', '1-10', '3-5', '6-7']) {
    const st = STAGES.find(s => s.id === id)!;
    const rs = [0, 1].map(r => run(st, r ? 7 : 0, st.rec + 1, r, 12, SKILLED, 8, [10]));
    console.log(`${id}: ${tally(rs)}`);
    for (const r of rs) console.log(`    buddy in another map than the player: total ${r.apartS}s, longest ${r.apartMaxS}s; ended map ${r.map}/${st.maps!.length - 1}; buddy map ${r.w.mapAt(r.w.heroes[1].x)}; buddy state ${r.w.heroes[1].state}; zones ${J(r.zones)}`);
  }
}

if (what === 'coop' || what === 'all') {
  console.log('===== CO-OP (2 humans) portals, scripted =====');
  const st = STAGES.find(s => s.id === '1-4')!, maps = st.maps!;
  const mk = () => new World(st, derive(heroFor(0, 6, 1)), 5, [], 0, false, undefined, [], undefined, false, [derive(heroFor(10, 6, 2))], 2);
  const UP: Input = { ...NO_INPUT, up: true };
  const pos = (w: World) => w.heroes.map(h => `${Math.round(h.x)}(map ${w.mapAt(h.x)})`).join('  ');
  const give = (w: World, mi: number) => { const g = maps[mi].goal; if (g?.kind === 'collect') for (const q of g.wants) w.drops[q.mob] = q.n; };
  const exit0 = maps[0].portals[0];
  console.log(shape(st));
  {
    const w = mk(); give(w, 0);
    for (const h of w.heroes) { h.x = exit0.x; h.inv = 9999; }
    w.step([NO_INPUT, NO_INPUT]);
    const ev = w.step([NO_INPUT, UP]);
    console.log(`A) GUEST (seat 1) presses up at exit I, host stays. events ${J(ev.filter(e => ['warp', 'needDrops', 'goal'].includes(e.t)))}`);
    console.log(`   right after: ${pos(w)}; zone I done ${w.zones2[0].done}; drops left ${J(w.drops)}`);
    for (let i = 0; i < 30; i++) w.step([NO_INPUT, NO_INPUT]);
    console.log(`   0.5 s later: ${pos(w)}`);
  }
  {
    const w = mk(); give(w, 0);
    for (const h of w.heroes) { h.x = exit0.x; h.inv = 9999; }
    w.heroes[1].x = maps[0].x0 + 800; // the guest is busy elsewhere in map I (more than a screen away)
    w.step([NO_INPUT, NO_INPUT]);
    console.log(`B) HOST presses up at exit I while the guest is at x ${Math.round(w.heroes[1].x)} in map I.`);
    const ev = w.step([UP, NO_INPUT]);
    console.log(`   events ${J(ev.filter(e => ['warp', 'needDrops', 'goal'].includes(e.t)))}; right after: ${pos(w)}`);
    for (let i = 0; i < 30; i++) w.step([NO_INPUT, NO_INPUT]);
    console.log(`   0.5 s later: ${pos(w)}`);
  }
  {
    const w = mk();
    for (const h of w.heroes) { h.inv = 9999; }
    w.heroes[1].x = w.heroes[0].x + 600;
    for (let i = 0; i < 5; i++) w.step([NO_INPUT, NO_INPUT]);
    console.log(`C) same map, guest placed 600 px right of the host: after 5 frames ${pos(w)} (leash distance 420)`);
  }
  {
    // guest's drawing world: what survives a snapshot
    const host = mk(), guest = mk(); guest.view(1);
    for (const h of host.heroes) h.inv = 9999;
    const g0 = maps[0].goal; const k0 = g0?.kind === 'collect' ? g0.wants[0].mob : 'bun';
    host.drops[k0] = 2;
    host.skipToBoss();
    for (let i = 0; i < 120; i++) host.step([NO_INPUT, NO_INPUT]);
    for (const h of host.heroes) h.x = maps[maps.length - 1].x0 + 400;
    for (let i = 0; i < 120; i++) { host.step([NO_INPUT, NO_INPUT]); if (i % 4 === 0) applySnapshot(guest, JSON.parse(J(makeSnapshot(host)))); }
    const hf = host.mobs.find(m => m.roomBoss)!, gf = guest.mobs.find(m => m.id === hf.id);
    console.log(`D) after skipToBoss + walking in: host foe ${hf.kind} wake ${hf.wake} state ${hf.state}; GUEST copy: present ${!!gf} wake ${gf?.wake} roomBoss ${gf?.roomBoss} hp ${gf?.hp}/${gf?.maxHp} (host ${hf.hp}/${hf.maxHp})`);
    console.log(`   host drops ${J(host.drops)} zones ${J(host.zones2.map(z => z.done))} doorOpen ${host.doorOpen}  |  GUEST drops ${J(guest.drops)} zones ${J(guest.zones2.map(z => z.done))} doorOpen ${guest.doorOpen}`);
    console.log(`   mobs: host ${host.mobs.length}, guest ${guest.mobs.length}; guest mobs in boss map ${guest.mobs.filter(m => guest.mapAt(m.x) === maps.length - 1).length}`);
  }
  {
    // world boss stage: w.boss on the guest
    const sb = STAGES.find(s => s.id === '1-10')!, mb = sb.maps!;
    const mkb = () => new World(sb, derive(heroFor(0, 12, 1)), 5, [], 0, false, undefined, [], undefined, false, [derive(heroFor(10, 12, 2))], 2);
    const host = mkb(), guest = mkb(); guest.view(1);
    for (const h of host.heroes) h.inv = 9999;
    host.skipToBoss();
    for (const h of host.heroes) h.x = mb[mb.length - 1].x0 + 400;
    for (let i = 0; i < 180; i++) { host.step([NO_INPUT, NO_INPUT]); if (i % 4 === 0) applySnapshot(guest, JSON.parse(J(makeSnapshot(host)))); }
    console.log(`E) 1-10 in the boss room for 3 s: host w.boss ${host.boss?.kind} (hp ${host.boss?.hp}); GUEST w.boss ${guest.boss?.kind ?? 'UNDEFINED'}; guest copy wake ${guest.mobs.find(m => MOBS[m.kind].brain === 'boss')?.wake}`);
  }
}

if (what === 'coopF' || what === 'coop' || what === 'all') {
  // F) a teammate on the top floor while the player (host) stands on the ground
  const st = STAGES.find(s => s.id === '1-4')!;
  for (const [label, humans] of [['online guest (human)', 2], ['CPU buddy', 1]] as const) {
    const w = new World(st, derive(heroFor(0, 6, 1)), 5, [], 0, false, undefined, [], undefined, false, [derive(heroFor(10, 6, 2))], humans);
    for (const h of w.heroes) h.inv = 9999;
    const tops = st.platforms.map((p, i) => ({ p, i })).filter(o => o.p.x < st.maps![0].x1 && !o.p.move);
    const out: string[] = [];
    for (const y of [380, 290, 200]) {
      const t = tops.find(o => o.p.y === y); if (!t) continue;
      const x = t.p.x + t.p.w / 2;
      w.heroes[0].x = x; w.heroes[0].y = 470; w.heroes[0].ground = true; w.heroes[0].on = -1;
      const g = w.heroes[1]; g.x = x + 30; g.y = y; g.vy = 0; g.ground = true; g.on = t.i;
      w.step([NO_INPUT, NO_INPUT]);
      out.push(`floor y=${y}: teammate ends at y ${Math.round(g.y)} ${Math.round(g.y) === y ? 'stays' : 'YANKED DOWN to the player'}`);
    }
    console.log(`F) ${label} standing on an upper floor directly above the player on the ground: ${out.join('; ')}`);
  }
}

if (what === 'coopG' || what === 'coop' || what === 'all') {
  // G) the guest holds RIGHT for 4 s while the host stands still: where is the guest each half second?
  const st = STAGES.find(s => s.id === '1-4')!;
  const w = new World(st, derive(heroFor(0, 6, 1)), 5, [], 0, false, undefined, [], undefined, false, [derive(heroFor(10, 6, 2))], 2);
  for (const h of w.heroes) h.inv = 9999;
  const xs: number[] = []; let yanks = 0, last = w.heroes[1].x;
  for (let i = 0; i < 240; i++) { w.step([NO_INPUT, { ...NO_INPUT, right: true }]); const x = w.heroes[1].x; if (x < last - 100) yanks++; last = x; if (i % 30 === 29) xs.push(Math.round(x)); }
  console.log(`G) host stands at x ${Math.round(w.heroes[0].x)}; guest holds RIGHT 4 s: guest x every 0.5 s ${J(xs)}; snapped back ${yanks} times (leash 420 px; phone screen shows about ${Math.round(844 / 0.9)} px?)`);
}

if (what === 'obj' || what === 'all') {
  console.log('===== objectives vs one-way exits / SKIP TO BOSS (hero invulnerable, standing still) =====');
  const UP: Input = { ...NO_INPUT, up: true };
  const mk = (st: StageDef) => { const w = new World(st, derive(heroFor(0, st.rec + 1, 1)), 5); w.hero.inv = 99999; return w; };
  const evs = (w: World, secs: number, inp: Input = NO_INPUT) => { const out: string[] = []; for (let i = 0; i < 60 * secs && !w.failed && !w.cleared; i++) for (const e of w.step(inp)) if (e.t === 'objective' || e.t === 'objFail') out.push(`${w.time.toFixed(0)}s ${e.t}: ${(e as { text?: string; why?: string }).text ?? (e as { why?: string }).why}`); return out; };
  for (const st of [STAGES.find(s => s.id === '1-6')!, dailyStage(20261113, 25)]) {
    // 1) walk past the scroll: take exit II without it, wait in map III
    const w = mk(st), maps = st.maps!;
    for (const mi of [0, 1]) { const g = maps[mi].goal; if (g?.kind === 'collect') for (const q of g.wants) w.drops[q.mob] = q.n; w.hero.x = maps[mi].portals[0].x; w.step(NO_INPUT); w.step(UP); w.step(NO_INPUT); }
    const log = evs(w, 200);
    console.log(`${st.id} (${st.objective?.kind}) left map II through the exit WITHOUT the scroll (scroll got ${w.scroll?.got}), now in map ${w.mapAt(w.hero.x)}: after waiting -> failed ${w.failed} at ${w.time.toFixed(0)}s; events ${J(log)}`);
    // 2) SKIP TO BOSS
    const w2 = mk(st); w2.skipToBoss();
    const log2 = evs(w2, 200);
    console.log(`${st.id} SKIP TO BOSS then stand in the boss room: failed ${w2.failed} at ${w2.time.toFixed(0)}s; events ${J(log2)}`);
    // 3) SKIP TO BOSS and kill the foe at once: objective bonus without the scroll?
    const w3 = mk(st); w3.skipToBoss(); w3.step(NO_INPUT);
    for (const m of w3.mobs) if (m.roomBoss) { m.hp = 0; m.state = 'dead'; }
    for (let i = 0; i < 120; i++) w3.step(NO_INPUT);
    w3.hero.x = w3.exitX; const log3 = evs(w3, 3);
    console.log(`${st.id} SKIP TO BOSS, foe dead, walk to exit: cleared ${w3.cleared}, scroll got ${w3.scroll?.got}, events ${J(log3)}`);
  }
  for (const id of ['1-8', '6-8']) {
    const st = STAGES.find(s => s.id === id)!;
    const w = mk(st); w.skipToBoss();
    const b = st.maps!.length - 1; let maxMobs = 0; const log: string[] = [];
    for (let i = 0; i < 60 * 60 && !w.failed; i++) { for (const e of w.step(NO_INPUT)) if (e.t === 'objective') log.push(`${w.time.toFixed(0)}s ${(e as { text: string }).text}`); maxMobs = Math.max(maxMobs, w.mobs.filter(m => m.state !== 'dead' && w.mapAt(m.x) === b).length); }
    console.log(`${id} (survive) SKIP TO BOSS: events ${J(log)}; most monsters alive in the boss room at once ${maxMobs} (1 = just the foe); foe alive ${w.mobs.some(m => m.roomBoss && m.state !== 'dead')}`);
  }
}

if (what === 'hold' || what === 'all') {
  console.log('===== stage 8 hold-out on map stages: do the ambush waves come? (holdout spawns need world.alive < 10; alive counts every map) =====');
  const UP: Input = { ...NO_INPUT, up: true };
  for (const id of ['1-8', '4-8', '8-8']) {
    const st = STAGES.find(s => s.id === id)!, maps = st.maps!;
    const w = new World(st, derive(heroFor(0, st.rec + 1, 1)), 5); w.hero.inv = 99999;
    const g = maps[0].goal; if (g?.kind === 'collect') for (const q of g.wants) w.drops[q.mob] = q.n;
    w.hero.x = maps[0].portals[0].x; w.step(NO_INPUT); w.step(UP); w.step(NO_INPUT);
    w.hero.x = (st.objective as { at: number }).at + 20;
    const ids0 = new Set(w.mobs.map(m => m.id)); let newNear = 0, newFar = 0, aliveMin = 1e9, armedAt = -1; const seen = new Set<number>();
    for (let i = 0; i < 60 * 50; i++) {
      w.step(NO_INPUT);
      if (w.holdout > 0 && armedAt < 0) armedAt = w.time;
      aliveMin = Math.min(aliveMin, w.alive);
      for (const m of w.mobs) if (!ids0.has(m.id) && !seen.has(m.id)) { seen.add(m.id); if (Math.abs(m.x - w.hero.x) < 420) newNear++; else newFar++; }
    }
    console.log(`${id}: hold-out armed ${armedAt >= 0}, world.alive never below ${aliveMin}; new monsters in 50 s: ${newNear} beside the hero (ambush style, 380 px), ${newFar} at far spawn points (ordinary respawns); zone II done ${w.zones2[1].done}; holdout left ${w.holdout.toFixed(0)}`);
  }
}
