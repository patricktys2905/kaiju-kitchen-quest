// Stages: 10 per world, built by a seeded generator from layout pieces (steps, stairs, ladder towers,
// open ground). Stage 5 has an elite mini-boss; stage 10 is the world boss in its own arena.
// Reach: the lowest jumper (Bluebeary) rises ~105 px, so tiers are 90 px apart; the top tier needs a ladder
// or a lower platform beside it (tests/world.test.ts checks every platform is reachable).
import { MOBS } from './mobs';
import type { Arena, Hazard, HazardKind, MobKind, MobSpawn, Platform, Ladder, Prop, StageDef } from './types';

const G = 470;
const SPECIALIST = new Set(['turret', 'sniper', 'healer', 'summoner', 'charger', 'burrower']);
const TIER = [380, 290, 200];

export interface WorldDef {
  id: number; name: string; blurb: string;
  bg: string; mid: string; tile: string; platTint: number; bossBg: string;
  /** monster level of stage 1; each stage adds ~1 */
  baseLv: number;
  /** monster HP/attack multiplier for this world (heroes arrive stronger than the level alone suggests) */
  power: number;
  /** monster kinds unlocked by stage number */
  pool: [number, MobKind][];
  elite: MobKind; boss: MobKind;
  /** this world's stage hazard (also switched on in the boss arena when the boss enrages) */
  hazard: HazardKind;
  /** the loot-box mimic hiding in stages 3, 7 and 9 */
  mimic: MobKind;
  names: string[];
}

export const WORLDS: WorldDef[] = [
  {
    id: 1, name: 'The Countertop', blurb: 'Where the leftovers went bad.', bg: 'bg-far', mid: 'bg-mid', tile: 'tile-ground', platTint: 0xffffff, bossBg: 'bg-far-stove',
    baseLv: 1, power: 1, pool: [[1, 'bun'], [3, 'worm'], [4, 'ant'], [6, 'pepper'], [6, 'garlic'], [7, 'egg']], hazard: 'burner', mimic: 'mimic', elite: 'egg', boss: 'toast',
    names: ['Countertop Meadow', 'Crumb Trail', 'Gummy Gully', 'Toaster Hills', 'Rotten Ridge', 'Spice Shelf', 'Pepper Pass', 'Cutting Board Bluffs', 'Burner Approach', 'Stovetop Throne'],
  },
  {
    id: 2, name: 'The Fridge', blurb: 'Cold, crisp and full of grudges.', bg: 'bg-far-fridge', mid: 'bg-mid-fridge', tile: 'tile-fridge', platTint: 0xc8e4ff, bossBg: 'bg-far-freezer',
    baseLv: 13, power: 1.3, pool: [[1, 'pea'], [1, 'yogurt'], [2, 'milk'], [3, 'icebat'], [4, 'carrot'], [6, 'pickle'], [7, 'jelly']], hazard: 'ice', mimic: 'mimic', elite: 'pickle', boss: 'golem',
    names: ['Crisper Drawer', 'Dairy Lane', 'Frosty Shelf', 'Pickle Jar Pier', 'Knight of the Brine', 'Egg Carton Cliffs', 'Butter Bridge', 'Ketchup Canyon', 'Ice Tray Steps', 'Freezer Throne'],
  },
  {
    id: 3, name: 'The Oven', blurb: 'Preheated to dangerous.', bg: 'bg-far-oven', mid: 'bg-mid-oven', tile: 'tile-oven', platTint: 0xffc8a0, bossBg: 'bg-far-dragon',
    baseLv: 25, power: 1.6, pool: [[1, 'bacon'], [1, 'popcorn'], [2, 'sausage'], [3, 'imp'], [4, 'kettle'], [6, 'meatball'], [7, 'marsh']], hazard: 'vent', mimic: 'cereal', elite: 'meatball', boss: 'dragon',
    names: ['Oven Door Ramp', 'Bottom Rack', 'Muffin Tin Maze', 'Casserole Cliffs', 'Meatball Mountain', 'Cookie Sheet Plains', 'Roasting Pan Pass', 'Pizza Stone Steppe', 'Top Rack Ascent', 'Broiler Peak'],
  },
  {
    id: 4, name: 'The Pantry', blurb: 'Dusty shelves, grumpy groceries.', bg: 'bg-far-pantry', mid: 'bg-mid-pantry', tile: 'tile-pantry', platTint: 0xe8d0b0, bossBg: 'bg-far-jar',
    baseLv: 37, power: 2.5, pool: [[1, 'cheerio'], [1, 'flour'], [2, 'noodle'], [3, 'can'], [4, 'raisin'], [5, 'soda']], hazard: 'drop', mimic: 'cereal', elite: 'can', boss: 'jar',
    names: ['Cupboard Door', 'Cereal Canyon', 'Flour Drifts', 'Tin Can Alley', 'Shield Wall', 'Spice Rack Ridge', 'Pasta Jar Peaks', 'Honey Hollow', 'Top Shelf Climb', 'Cookie Vault'],
  },
  {
    id: 5, name: 'The Sink', blurb: 'Deep, damp and down the drain.', bg: 'bg-far-sink', mid: 'bg-mid-sink', tile: 'tile-sink', platTint: 0xd0e4f0, bossBg: 'bg-far-drain',
    baseLv: 49, power: 3.0, pool: [[1, 'plate'], [1, 'bubble'], [2, 'mug'], [3, 'eel'], [4, 'glove'], [7, 'scrub']], hazard: 'tap', mimic: 'mimic', elite: 'scrub', boss: 'moldking',
    names: ['Faucet Falls', 'Suds Slide', 'Sponge Shoals', 'Dish Rack Ridge', 'Steel Wool Wall', 'Bubble Bay', 'Plughole Pass', 'Greasy Pan Pits', 'Drain Descent', 'The Mold Throne'],
  },
];

/** Small seeded RNG so a stage is always laid out the same way. */
function rng(seed: number): () => number {
  let s = seed >>> 0 || 1;
  return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; };
}

/** A world's stage n. Free mode passes its own seed / level / id to get fresh layouts at any level. */
export function genStage(w: WorldDef, n: number, o: { seed?: number; lv?: number; id?: string; name?: string } = {}): StageDef {
  const id = o.id ?? `${w.id}-${n}`;
  const lvLo = o.lv ?? w.baseLv + n - 1, lvHi = lvLo + 1;
  if (n === 10) {
    return {
      id, world: w.id, num: id, name: o.name ?? w.names[9], bg: w.bossBg, mid: '', tile: w.tile, platTint: w.platTint, width: 1500, groundY: G,
      lv: [lvLo + 2, lvLo + 2], par: 130, rec: lvLo, boss: true,
      platforms: [{ x: 180, y: 382, w: 240 }, { x: 1080, y: 382, w: 240 }, { x: 520, y: 294, w: 460 }],
      ladders: [], mobs: [{ kind: w.boss, x: 1150, lv: lvLo + 2 }],
      // phase 2: the arena turns on its hazards (same for every kaiju)
      hazards: [hazardAt(w.hazard, 470, 1), hazardAt(w.hazard, 1030, 2.2)].map(h => ({ ...h, phase2: true })),
    };
  }
  const r = rng(o.seed ?? w.id * 1000 + n * 37 + 11);
  const width = 2200 + n * 140;
  const platforms: Platform[] = [];
  const ladders: Ladder[] = [];
  let x = 320;
  while (x < width - 420) {
    const k = r();
    if (k < 0.18) { x += 220 + r() * 120; continue; } // open ground
    if (k < 0.45) { // single step
      const pw = 220 + Math.round(r() * 120);
      platforms.push({ x, y: TIER[0], w: pw }); x += pw + 140 + r() * 80;
    } else if (k < 0.75) { // stairs up
      const pw = 200 + Math.round(r() * 60);
      platforms.push({ x, y: TIER[0], w: pw }, { x: x + pw - 60, y: TIER[1], w: pw + 40 });
      if (r() < 0.4) platforms.push({ x: x + pw * 2 - 100, y: TIER[2], w: pw }); // a top step off the middle one
      x += pw * 2 + 220;
    } else { // ladder tower
      const pw = 280 + Math.round(r() * 100);
      const top = r() < 0.5 ? TIER[2] : TIER[1];
      platforms.push({ x, y: top, w: pw });
      ladders.push({ x: x + 40 + Math.round(r() * (pw - 80)), top, bottom: G });
      if (top === TIER[2] && r() < 0.6) platforms.push({ x: x + pw + 60, y: TIER[0], w: 200 });
      x += pw + 280;
    }
  }
  const kinds = w.pool.filter(([from]) => n >= from).map(([, k]) => k);
  const basics = kinds.filter(k => !SPECIALIST.has(MOBS[k].brain));
  const count = 7 + Math.floor(n * 0.8);
  const mobs: MobSpawn[] = [];
  for (let i = 0; i < count; i++) {
    let kind = kinds[Math.floor(r() * kinds.length)];
    // specialists (turrets, snipers, healers, chargers...) are spice, not the meal: at most 2 of each per stage (1 turret)
    if (SPECIALIST.has(MOBS[kind].brain) && mobs.filter(m => m.kind === kind).length >= (MOBS[kind].brain === 'turret' ? 1 : 2)) kind = basics[Math.floor(r() * basics.length)] ?? kind;
    const lv = r() < 0.5 ? lvLo : lvHi;
    // flyers and turrets always start at ground level (from a high platform they would be out of reach)
    if (MOBS[kind].brain !== 'flyer' && MOBS[kind].brain !== 'turret' && r() < 0.35 && platforms.length > 0) {
      const p = platforms[Math.floor(r() * platforms.length)];
      mobs.push({ kind, lv, x: Math.round(p.x + 30 + r() * (p.w - 60)), y: p.y });
    } else {
      mobs.push({ kind, lv, x: Math.round(520 + (i / count) * (width - 900) + r() * 120) });
    }
  }
  if (n === 5) mobs.push({ kind: w.elite, lv: lvHi + 1, x: width - 520, elite: true });
  // a loot-box mimic lurks in stages 3, 7 and 9, on the ground among the real boxes
  if (n === 3 || n === 7 || n === 9) mobs.push({ kind: w.mimic, lv: lvHi, x: Math.round(width * (0.45 + r() * 0.3)) });
  // hazards on open ground from stage 2 on, more later in the world; never at the start or the exit
  const hazards: Hazard[] = [];
  if (n >= 2) {
    const want = 1 + Math.floor(n / 3);
    for (let tries = 0; hazards.length < want && tries < 40; tries++) {
      const hx = Math.round(500 + r() * (width - 1000));
      if (hazards.some(h => Math.abs(h.x - hx) < 380) || ladders.some(l => Math.abs(l.x - hx) < 90)) continue;
      hazards.push(hazardAt(w.hazard, hx, r() * 3));
    }
  }
  return {
    id, world: w.id, num: id, name: o.name ?? w.names[n - 1], bg: w.bg, mid: w.mid, tile: w.tile, platTint: w.platTint, width, groundY: G,
    lv: [lvLo, n === 5 ? lvHi + 1 : lvHi], par: Math.round(25 + count * 5 + width / 70), rec: lvLo,
    platforms, ladders, mobs, hazards, ...interactive(w, n, width, platforms, ladders, r),
    ...setPieces(w, n, width, platforms, mobs, lvLo, lvHi),
    // a goal on stages 4 / 6 / 8 of every world
    objective: n === 4 ? { kind: 'escort' } : n === 6 ? { kind: 'fetch', t: w.id >= 5 ? 90 : 75, x: width - 260 } : n === 8 ? { kind: 'survive', t: 45 } : undefined,
  };
}

/** Props, moving trays, cookers and a secret ledge for a normal stage (seeded, the same for everyone). */
function interactive(w: WorldDef, n: number, width: number, platforms: Platform[], ladders: Ladder[], r: () => number): { props: Prop[]; cookers: number[] } {
  const props: Prop[] = [];
  const free = (x: number) => !props.some(p => Math.abs(p.x - x) < 70);
  // breakables: a few on the floor, some on platforms
  for (let i = 0; i < 3 + Math.floor(n / 3); i++) {
    const onPlat = platforms.length && r() < 0.4;
    const p = onPlat ? platforms[Math.floor(r() * platforms.length)] : null;
    const x = p ? Math.round(p.x + 30 + r() * (p.w - 60)) : Math.round(420 + r() * (width - 800));
    if (free(x)) props.push({ kind: r() < 0.6 ? 'crate' : 'jar', x, y: p ? p.y : G });
  }
  // a moving tray from World 2 on (one of the low single steps)
  if (w.id >= 2) { const p = platforms.find(q => q.y === TIER[0] && !platforms.some(o => o !== q && Math.abs(o.x - q.x) < q.w + 160)); if (p) p.move = { dx: 120, period: 4 }; }
  // a lever that drops a rolling pin on the stretch ahead (stages 3 and 7)
  if (n === 3 || n === 7) { const x = Math.round(width * 0.35); props.push({ kind: 'lever', x, y: G, tx: x + 260, tw: 260 }); }
  // a secret ledge high above the floor, a sponge to bounce up, a chest on top (World key in stage 7)
  if ([2, 4, 6, 7, 8, 9].includes(n)) {
    // the sponge must have open sky above it (else you'd drop onto it from a platform by accident and get flung up)
    // and no ladder close by; the ledge itself may sit above lower platforms
    const open = (x: number) => !platforms.some(p => p.x - 70 < x + 12 && x + 12 < p.x + p.w + 70) // nothing above the sponge
      && !platforms.some(p => p.y < 200 && p.x < x + 140 && x < p.x + p.w) && !ladders.some(l => Math.abs(l.x - (x + 12)) < 80) && free(x + 12) && free(x + 80)

    // the trays climb up to the ledge from its left (side -1) or its right (side 1), wherever there is room
    const traySide = (x: number): -1 | 1 | 0 => {
      const clear = (a: number, b: number) => a > 300 && b < width - 200 && !platforms.some(p => p.x < b && a < p.x + p.w) && !ladders.some(l => l.x > a && l.x < b);
      return clear(x - 260, x + 150) ? -1 : clear(x - 10, x + 420) ? 1 : 0;
    };
    const spots: number[] = [];
    for (let x = 500; x < width - 600; x += 20) if (open(x)) spots.push(x);
    const traySpots = n >= 8 ? spots.filter(x => traySide(x) !== 0) : [];
    if (spots.length) {
      const gauntlet = traySpots.length > 0; // stages 8/9: a tray gauntlet where it fits, else the sponge
      const pool = gauntlet ? traySpots : spots;
      const x = pool[Math.floor(r() * pool.length)];
      platforms.push({ x, y: 150, w: 140, secret: true });
      if (gauntlet) {
        // a little platforming gauntlet: two moving trays and a step lead up to the ledge
        if (traySide(x) < 0) platforms.push({ x: x - 230, y: TIER[0], w: 110, move: { dx: 110, period: 3 } }, { x: x - 120, y: TIER[1], w: 100, move: { dx: -90, period: 2.6 } }, { x: x - 40, y: TIER[2], w: 70 });
        else platforms.push({ x: x + 260, y: TIER[0], w: 110, move: { dx: -110, period: 3 } }, { x: x + 160, y: TIER[1], w: 100, move: { dx: 90, period: 2.6 } }, { x: x + 110, y: TIER[2], w: 70 });
        props.push({ kind: 'chest', x: x + 80, y: 150, key: n === 7 });
      } else {
        // the sponge sits under the ledge's left end, so dropping off the middle doesn't bounce you straight back up
        props.push({ kind: 'sponge', x: x + 12, y: G }, { kind: 'chest', x: x + 80, y: 150, key: n === 7 });
      }
    }
  }
  // runaway pressure cookers: stages 4, 6, 8 and 9
  const cookers = [4, 6, 8, 9].includes(n) ? [Math.round(width * (0.4 + r() * 0.3))] : [];
  return { props, cookers };
}

/** Arena rooms (stages 2/3/7/9), a rolling-pin chase (stage 2), conveyor belts (worlds 2-4, stages 6/9). */
function setPieces(w: WorldDef, n: number, width: number, platforms: Platform[], mobs: MobSpawn[], lvLo: number, lvHi: number): { arenas?: Arena[]; chase?: { x0: number; x1: number }; belts?: { x: number; w: number; v: number }[] } {
  const out: ReturnType<typeof setPieces> = {};
  if (n === 2) out.chase = { x0: 520, x1: Math.round(width * 0.58) };
  if ([2, 3, 7, 9].includes(n)) {
    const x0 = Math.round(width * (n === 2 ? 0.64 : 0.5)), x1 = Math.min(x0 + 640, width - 160);
    // nothing wanders around inside the room beforehand: it fills up when you walk in
    for (let i = mobs.length - 1; i >= 0; i--) if (!mobs[i].elite && MOBS[mobs[i].kind].brain !== 'mimic' && mobs[i].x > x0 - 40 && mobs[i].x < x1 + 40 && mobs[i].y === undefined) mobs.splice(i, 1);
    out.arenas = [{ x0, x1, waves: arenaWaves(w, n, x0, x1, lvLo, lvHi) }];
  }
  if (w.id >= 2 && (n === 6 || n === 9)) out.belts = [{ x: Math.round(width * 0.35), w: 340, v: n === 6 ? 90 : -90 }];
  return out;
}

/** Three designed waves that change by stage: warm-up, a team that needs a plan, then a heavy hitter with backup.
 *  Stage 2: a protected healer (or summoner), 3: a sniper behind chargers, 7: a swarm with a bomber, 9: everything at once. */
function arenaWaves(w: WorldDef, n: number, x0: number, x1: number, lvLo: number, lvHi: number): MobSpawn[][] {
  const kinds = w.pool.map(([, k]) => k);
  const by = (...brains: string[]) => kinds.filter(k => brains.includes(MOBS[k].brain));
  const fighters = by('walker', 'hopper', 'flyer', 'charger').filter(k => !MOBS[k].shield);
  const f = (i: number) => fighters[(i + n) % fighters.length] ?? kinds[0];
  const one = (list: MobKind[], fallback: MobKind) => list[0] ?? fallback;
  const L = (k: MobKind, side: number, i: number, lv = lvLo): MobSpawn => ({ kind: k, lv, x: side < 0 ? x0 + 50 + i * 40 : x1 - 50 - i * 40 });
  const healer = one(by('healer', 'summoner'), f(3)), sniper = one(by('sniper', 'ranged'), f(4)), charger = one(by('charger'), f(5));
  const bomber = one(by('bomber', 'hopper'), f(6)), shield = kinds.find(k => MOBS[k].shield) ?? f(7);
  const warm = [L(f(0), -1, 0), L(f(1), 1, 0), L(f(2), -1, 1)];
  const team = n === 2 ? [L(healer, 1, 1, lvHi), L(shield, 1, 0, lvHi), L(f(0), -1, 0), L(f(1), -1, 1)]
    : n === 3 ? [L(sniper, 1, 1), L(sniper, 1, 2), L(charger, -1, 0, lvHi), L(f(2), -1, 1)]
    : n === 7 ? [L(f(0), -1, 0), L(f(1), -1, 1), L(f(2), 1, 0), L(f(3), 1, 1), L(bomber, 1, 2, lvHi)]
    : [L(healer, 1, 1), L(sniper, -1, 1), L(charger, 1, 0, lvHi), L(f(4), -1, 0)];
  const side = n % 2 ? 1 : -1;
  const heavy = [L(w.elite, side, 0, lvHi), L(sniper, -side, 0), L(f(5), -side, 1)];
  return [warm, team, heavy];
}

/** Secret bonus stage of a world (opened with that world's key): crates everywhere and a golden elite. */
function genBonus(w: WorldDef): StageDef {
  const base = genStage(w, 9);
  const r = rng(w.id * 777 + 5);
  const props: Prop[] = [...(base.props ?? [])];
  for (let i = 0; i < 12; i++) props.push({ kind: r() < 0.5 ? 'crate' : 'jar', x: Math.round(400 + i * (base.width - 800) / 12), y: G });
  return {
    ...base, id: `S-${w.id}`, num: `★${w.id}`, name: `Secret ${['Spice Garden', 'Ice Cream Vault', 'Bakery Hideout', 'Honey Cellar'][w.id - 1]}`,
    props, cookers: [Math.round(base.width * 0.5)], hazards: [], objective: undefined,
    mobs: [...base.mobs.slice(0, 8), { kind: w.elite, lv: base.lv[1] + 2, x: base.width - 520, elite: true }],
    lv: [base.lv[0] + 1, base.lv[1] + 2], rec: base.rec + 1,
  };
}

function hazardAt(kind: HazardKind, x: number, offset: number): Hazard {
  switch (kind) {
    case 'burner': return { kind, x, w: 90, period: 3.6, on: 1.2, offset };
    case 'vent': return { kind, x, w: 70, period: 3.2, on: 0.8, offset };
    case 'drop': return { kind, x, w: 80, period: 3.8, on: 0.35, offset };
    case 'ice': return { kind, x, w: 260, period: 1, on: 1, offset };
    case 'tap': return { kind, x, w: 70, period: 3.4, on: 1.1, offset };
  }
}

export const STAGES: StageDef[] = WORLDS.flatMap(w => Array.from({ length: 10 }, (_, i) => genStage(w, i + 1)));
/** Secret bonus stages, one per world (keys from that world's stage 7 secret chest). */
export const BONUS_STAGES: StageDef[] = WORLDS.map(genBonus);

export function stageById(id: string): StageDef { return STAGES.find(s => s.id === id) ?? BONUS_STAGES.find(s => s.id === id) ?? STAGES[0]; }
export function worldOf(s: StageDef): WorldDef { return WORLDS.find(w => w.id === s.world) ?? WORLDS[0]; }
