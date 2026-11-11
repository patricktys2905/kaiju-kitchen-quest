// Replace genLong with sectionKit (the section builders) + genMaps (hub + 3 zones + boss room).
const fs = require('fs');
const f = 'src/sim/stages.ts';
let s = fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n');
const a = s.indexOf('function genLong(');
const sw0 = s.indexOf('    switch (sec) {', a);
const end = s.indexOf('  const width = x + 300;', a);
const fnEnd = s.indexOf('\n}\n', end) + 3;
// the switch block (ends with the for-loop's closing "    }\n  }\n")
let sw = s.slice(sw0, end).replace(/\n  \}\n$/, '\n').replace(/o\.run/g, 'run');
const kit = `/** The section builders, shared by every map of a stage: place(sec, x0) builds one section from x0 and returns its width. */
function sectionKit(w: WorldDef, n: number, lvLo: number, lvHi: number, r: () => number, run = false) {
  const b: Build = { platforms: [], ladders: [], mobs: [], props: [], hazards: [], arenas: [], belts: [], darks: [], gates: [] };
  const kinds = w.pool.filter(([from]) => (run ? 9 : n) >= from).map(([, k]) => k);
  const basics = kinds.filter(k => !SPECIALIST.has(MOBS[k].brain));
  const pick = <T>(a: T[]): T => a[Math.floor(r() * a.length)];
  const lv = () => (r() < 0.5 ? lvLo : lvHi);
  const mini = (n + w.id) % 2 ? [\`m\${w.id}a\`, \`m\${w.id}b\`] : [\`m\${w.id}b\`, \`m\${w.id}a\`];
  let miniI = 0, design = n;
  const place = (sec: Sec, x0: number): number => {
    let x = x0;
${sw.split('\n').map(l => l.replace(/^    /, '    ')).join('\n')}
    return x - x0;
  };
  return { b, place, kinds, basics, pick, lv, mini };
}

/** A zone goal's name (also the zone's name) and, for collecting, what each world's quest item is called. */
const GOAL_NAME: Record<ZoneGoal['kind'], string> = { collect: 'Hunting Ground', rescue: 'Crumblet Cages', nests: 'Mould Nests', arena: 'The Pit', fetch: 'Scroll Run', survive: 'Last Stand' };
const QUEST_ITEM = ['Mould Crumbs', 'Frost Shards', 'Ember Coals', 'Pantry Tokens', 'Soap Pearls', 'Silver Spoons', 'Charcoal Chips', 'Seed Pods', 'Price Tags', 'Candied Peels'];

/** A stage of maps (Lunia / MapleStory style): a camp hub with portals to 3 zones; each zone has a goal (hunt a monster
 *  for its quest drops, free caged Crumblets, smash mould nests, clear an arena, race for the scroll, hold out);
 *  when all three are done the boss door opens: the stage's miniboss (stage 5: the elite or your nemesis; stage 10:
 *  the world boss) in its own room, then the exit. */
function genMaps(w: WorldDef, n: number, o: { seed?: number; id: string; name?: string; lvLo: number; lvHi: number }): StageDef {
  const { lvLo, lvHi } = o, boss = n === 10;
  const r = rng(o.seed ?? w.id * 1000 + n * 37 + 11);
  const { b, place, kinds, basics, pick, lv, mini } = sectionKit(w, n, lvLo, lvHi, r, boss);
  const GAP = 600, maps: StageMap[] = [];
  // the camp: a couple of steps, two honey jars, a portal per zone and the boss door
  const hub: StageMap = { name: 'Camp', kind: 'hub', x0: 0, x1: 1800, portals: [] };
  b.platforms.push({ x: 200, y: TIER[0], w: 180 }, { x: 1180, y: TIER[0], w: 160 });
  b.props.push({ kind: 'jar', x: 260, y: TIER[0] }, { kind: 'jar', x: 1250, y: TIER[0] });
  maps.push(hub);
  // the three goals: always a hunt; stage 6 has the scroll race, stage 8 the hold-out; the rest from the pool
  const pool: ZoneGoal['kind'][] = ['rescue', 'nests', 'arena'].sort(() => r() - 0.5) as ZoneGoal['kind'][];
  const kindsG: ZoneGoal['kind'][] = ['collect', n === 6 && !boss ? 'fetch' : n === 8 && !boss ? 'survive' : pool[0], pool[1]];
  const close = basics.filter(k => !['ranged', 'sniper', 'turret', 'flyer'].includes(MOBS[k].brain));
  const target = (close.length ? close : basics)[Math.floor(r() * (close.length || basics.length))];
  const EXTRA: Sec[] = ['field', 'swarm', 'snipers', 'heavies', 'tower', 'gauntlet', 'treasure', 'ambush', 'gate', ...(w.id >= 2 ? ['conveyor' as Sec] : []), ...(w.id >= 3 ? ['dark' as Sec] : [])];
  let x = hub.x1 + GAP, fetchAt: number | undefined, holdAt: number | undefined, scrollX: number | undefined;
  kindsG.forEach((gk, k) => {
    const z0 = x;
    let cx = z0 + 260;
    const secs: Sec[] = [];
    if (n === 2 && k === 0 && !boss) secs.push('chase');
    if (gk === 'arena') secs.push(pick(['field', 'snipers', 'heavies'] as Sec[]), 'arena');
    else if (gk === 'survive') secs.push(pick(['field', 'swarm'] as Sec[]), 'holdout');
    else if (gk === 'fetch') secs.push(pick(['field', 'snipers'] as Sec[]), pick(['tower', 'gauntlet', 'ambush'] as Sec[]), 'field');
    else secs.push(pick(['field', 'swarm', 'snipers', 'heavies'] as Sec[]), pick(EXTRA.filter(e => !(n === 4 && (e === 'ambush' || e === 'gate')))));
    if (n === 3 || n === 7) if (k === 1) secs.splice(1, 0, 'lever');
    const mobs0 = b.mobs.length;
    for (const sec of secs) cx += place(sec, cx);
    let need = 0, goal: ZoneGoal;
    if (gk === 'collect') {
      need = 4 + Math.floor(n / 4);
      goal = { kind: 'collect', mob: target, item: QUEST_ITEM[w.id - 1], need };
      // plenty of the quest monster about (more come back while you hunt)
      for (let i = 0; i < need + 2; i++) b.mobs.push({ kind: target, lv: lv(), x: Math.round(z0 + 500 + ((i + 0.5) / (need + 2)) * (cx - z0 - 700)) });
    } else if (gk === 'rescue') {
      goal = { kind: 'rescue', need: 3 };
      const ledges = b.platforms.filter(p => p.x > z0 + 300 && p.x + p.w < cx - 100 && p.y >= TIER[1] && !p.move && !p.secret);
      for (let i = 0; i < 3; i++) { const p = ledges[i * 2]; b.props.push(p ? { kind: 'cage', x: Math.round(p.x + p.w / 2), y: p.y } : { kind: 'cage', x: Math.round(z0 + 600 + i * (cx - z0 - 900) / 2), y: G }); }
    } else if (gk === 'nests') {
      goal = { kind: 'nests', need: 3 };
      for (let i = 0; i < 3; i++) b.props.push({ kind: 'nest', x: Math.round(z0 + 700 + i * (cx - z0 - 1100) / 2), y: G });
    } else if (gk === 'fetch') {
      goal = { kind: 'fetch' }; fetchAt = z0 + 200; scrollX = cx - 120;
    } else if (gk === 'survive') { goal = { kind: 'survive' }; holdAt = b.holdAt; }
    else goal = { kind: 'arena' };
    void mobs0;
    // a few breakables to smash (crumbs, and now and then a honey jar)
    for (let i = 0; i < 3; i++) b.props.push({ kind: r() < 0.5 ? 'crate' : 'jar', x: Math.round(z0 + 400 + r() * (cx - z0 - 700)), y: G });
    // stage 7's world key: a secret ledge with a sponge, at the far end of the second zone (open sky above it)
    if (n === 7 && k === 1 && !boss) { const lx = cx + 120; b.platforms.push({ x: lx, y: 150, w: 140, secret: true }); b.props.push({ kind: 'sponge', x: lx + 12, y: G }, { kind: 'chest', x: lx + 80, y: 150, key: true }); cx += 420; }
    const z1 = cx + 200, hx = 380 + k * 340;
    maps.push({ name: GOAL_NAME[gk], kind: 'zone', x0: z0, x1: z1, goal, portals: [{ x: z0 + 90, to: 0, tx: hx }] });
    hub.portals.push({ x: hx, to: maps.length - 1, tx: z0 + 170 });
    x = z1 + GAP;
  });
  // the boss room: the world boss on stage 10, else the stage's miniboss (stage 5: the elite, or your nemesis)
  const bx0 = x, room = genStage(w, 10, { lv: lvLo, id: o.id, short: true });
  const mv = <T extends { x: number }>(a: T): T => ({ ...a, x: a.x + bx0 });
  for (const p of room.platforms) b.platforms.push(mv(p));
  const foe: MobSpawn = boss ? { ...mv(room.mobs[0]), wake: bx0 + 320 }
    : { kind: (n === 5 ? w.elite : mini[0]) as MobKind, lv: lvHi + 1, x: bx0 + 1150, elite: !(w.id === 1 && n <= 2), wake: bx0 + 320 };
  b.mobs.unshift(foe); // the boss is mobs[0]
  if (boss) for (const h of room.hazards ?? []) b.hazards.push(mv(h));
  const bossMap: StageMap = { name: boss ? MOBS[w.boss].name : MOBS[foe.kind].name, kind: 'boss', x0: bx0, x1: bx0 + room.width, portals: [] };
  maps.push(bossMap);
  hub.portals.push({ x: hub.x1 - 200, to: maps.length - 1, tx: bx0 + 110, boss: true });
  const width = bossMap.x1;
  // hazards on open floor in the zones (not the camp or the boss room)
  for (const m of maps.filter(q => q.kind === 'zone')) for (let tries = 0, got = 0; got < 1 + (n >= 6 ? 1 : 0) && tries < 40 && (w.id >= 2 || n >= 2); tries++) {
    const hx = Math.round(m.x0 + 500 + r() * (m.x1 - m.x0 - 900));
    if (b.arenas.some(a => hx > a.x0 - 120 && hx < a.x1 + 120) || b.gates.some(g => Math.abs(g.x - hx) < 300) || (b.chase && hx > b.chase.x0 && hx < b.chase.x1) || b.hazards.some(h => Math.abs(h.x - hx) < 380) || b.ladders.some(l => Math.abs(l.x - hx) < 90) || b.props.some(p => Math.abs(p.x - hx) < 120)) continue;
    b.hazards.push(hazardAt(w.hazard, hx, r() * 3)); got++;
  }
  // nothing may sit on a portal (you press up there)
  const portalXs = maps.flatMap(m => m.portals.map(p => p.x));
  b.ladders = b.ladders.filter(l => !portalXs.some(px => Math.abs(px - l.x) < 70));
  const count = b.mobs.length + b.arenas.reduce((a2, ar) => a2 + ar.waves.flat().length, 0);
  const play = width - GAP * (maps.length - 1);
  return {
    id: o.id, world: w.id, num: o.id, name: o.name ?? w.names[n - 1], bg: w.bg, mid: w.mid, tile: w.tile, platTint: w.platTint, width, groundY: G,
    bossBg: boss ? w.bossBg : undefined, boss: boss || undefined,
    lv: [lvLo, boss ? lvLo + 2 : lvHi + 1], par: Math.round(60 + count * 5 + play / 70), rec: lvLo,
    platforms: b.platforms, ladders: b.ladders, mobs: b.mobs, props: b.props, cookers: [],
    hazards: awayFromSponges(b.hazards, b.props, b.ladders, width),
    arenas: b.arenas, belts: b.belts.length ? b.belts : undefined, chase: b.chase, darks: b.darks.length ? b.darks : undefined, gates: b.gates.length ? b.gates : undefined,
    maps, sections: maps.map(m => m.name),
    objective: boss ? undefined : n === 4 ? { kind: 'escort' } : n === 6 ? { kind: 'fetch', t: w.id >= 7 ? 100 : w.id >= 5 ? 90 : 75, x: scrollX, at: fetchAt } : n === 8 ? { kind: 'survive', t: 45, at: holdAt } : undefined,
  };
}
`;
s = s.slice(0, a) + kit + s.slice(fnEnd);
s = s.replace("  if (LEN > 1.5) return genLong(w, n, { ...o, id, lvLo, lvHi });\n", "  if (LEN > 1.5) return genMaps(w, n, { ...o, id, lvLo, lvHi });\n");
s = s.replace("  if (n === 10 && !o.short) return longBoss(w, id, lvLo, o);\n", "  if (n === 10 && !o.short) return genMaps(w, 10, { ...o, id, lvLo, lvHi: lvLo + 1 });\n");
// drop longBoss (the boss room is part of genMaps now)
const lb = s.indexOf('/** A long boss stage: a run-up');
if (lb >= 0) { const lbEnd = s.indexOf('\n}\n', lb) + 3; s = s.slice(0, lb) + s.slice(lbEnd); }
s = s.replace("import type { Arena, Hazard, HazardKind, MobKind, MobSpawn, Platform, Ladder, Prop, StageDef } from './types';", "import type { Arena, Hazard, HazardKind, MobKind, MobSpawn, Platform, Ladder, Prop, StageDef, StageMap, ZoneGoal } from './types';");
fs.writeFileSync(f, s);
console.log('ok', sw.length);
