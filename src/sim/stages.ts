// Stages: 10 per world, built by a seeded generator from layout pieces (steps, stairs, ladder towers,
// open ground). Stage 5 has an elite mini-boss; stage 10 is the world boss in its own arena.
// Reach: the lowest jumper (Bluebeary) rises ~105 px, so tiers are 90 px apart; the top tier needs a ladder
// or a lower platform beside it (tests/world.test.ts checks every platform is reachable).
import { MOBS } from './mobs';
import type { Arena, Hazard, HazardKind, MobKind, MobSpawn, Platform, Ladder, Prop, StageDef, StageMap } from './types';

const G = 470;
const SPECIALIST = new Set(['turret', 'sniper', 'healer', 'summoner', 'charger', 'burrower']);
const TIER = [380, 290, 200];
/** Story stages are this many times the original short layout (5-10 minutes each); a boss stage's run-up before the boss room. */
export const STAGE_LEN = 5, BOSS_RUN = 3.2;


export interface WorldDef {
  id: number; name: string; blurb: string;
  bg: string; mid: string; tile: string; platTint: number; bossBg: string;
  /** monster level of stage 1; each stage adds ~1 */
  baseLv: number;
  /** monster HP/attack multiplier for this world (heroes arrive stronger than the level alone suggests) */
  power: number;
  /** extra attack for this world's ordinary monsters in the story (not bosses / minibosses): evens out how many jams a
   *  stage costs from world to world (tuned with scripts/sweep.sh, skilled bot) */
  mobPow?: number;
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
    baseLv: 1, power: 1, mobPow: 0.7, pool: [[2, 'salt'], [1, 'jamhop'], [1, 'bun'], [3, 'worm'], [4, 'ant'], [6, 'pepper'], [6, 'garlic'], [7, 'egg']], hazard: 'burner', mimic: 'mimic', elite: 'xegg', boss: 'toast',
    names: ['Countertop Meadow', 'Crumb Trail', 'Gummy Gully', 'Toaster Hills', 'Rotten Ridge', 'Spice Shelf', 'Pepper Pass', 'Cutting Board Bluffs', 'Burner Approach', 'Stovetop Throne'],
  },
  {
    id: 2, name: 'The Fridge', blurb: 'Cold, crisp and full of grudges.', bg: 'bg-far-fridge', mid: 'bg-mid-fridge', tile: 'tile-fridge', platTint: 0xc8e4ff, bossBg: 'bg-far-freezer',
    baseLv: 13, power: 1.3, mobPow: 0.85, pool: [[2, 'icepop'], [1, 'cheesemouse'], [1, 'pea'], [1, 'yogurt'], [2, 'milk'], [3, 'icebat'], [4, 'carrot'], [6, 'pickle'], [7, 'jelly']], hazard: 'ice', mimic: 'mimic', elite: 'xpickle', boss: 'golem',
    names: ['Crisper Drawer', 'Dairy Lane', 'Frosty Shelf', 'Pickle Jar Pier', 'Knight of the Brine', 'Egg Carton Cliffs', 'Butter Bridge', 'Ketchup Canyon', 'Ice Tray Steps', 'Freezer Throne'],
  },
  {
    id: 3, name: 'The Oven', blurb: 'Preheated to dangerous.', bg: 'bg-far-oven', mid: 'bg-mid-oven', tile: 'tile-oven', platTint: 0xffc8a0, bossBg: 'bg-far-dragon',
    baseLv: 25, power: 1.6, mobPow: 0.75, pool: [[2, 'mitt'], [1, 'crumbcube'], [1, 'bacon'], [1, 'popcorn'], [2, 'sausage'], [3, 'imp'], [4, 'kettle'], [6, 'meatball'], [7, 'marsh']], hazard: 'vent', mimic: 'cereal', elite: 'xmeatball', boss: 'dragon',
    names: ['Oven Door Ramp', 'Bottom Rack', 'Muffin Tin Maze', 'Casserole Cliffs', 'Meatball Mountain', 'Cookie Sheet Plains', 'Roasting Pan Pass', 'Pizza Stone Steppe', 'Top Rack Ascent', 'Broiler Peak'],
  },
  {
    id: 4, name: 'The Pantry', blurb: 'Dusty shelves, grumpy groceries.', bg: 'bg-far-pantry', mid: 'bg-mid-pantry', tile: 'tile-pantry', platTint: 0xe8d0b0, bossBg: 'bg-far-jar',
    baseLv: 37, power: 2.5, mobPow: 0.9, pool: [[2, 'cracker'], [1, 'bee'], [1, 'cheerio'], [1, 'flour'], [2, 'noodle'], [3, 'can'], [4, 'raisin'], [5, 'soda']], hazard: 'drop', mimic: 'cereal', elite: 'xcan', boss: 'jar',
    names: ['Cupboard Door', 'Cereal Canyon', 'Flour Drifts', 'Tin Can Alley', 'Shield Wall', 'Spice Rack Ridge', 'Pasta Jar Peaks', 'Honey Hollow', 'Top Shelf Climb', 'Cookie Vault'],
  },
  {
    id: 5, name: 'The Sink', blurb: 'Deep, damp and down the drain.', bg: 'bg-far-sink', mid: 'bg-mid-sink', tile: 'tile-sink', platTint: 0xd0e4f0, bossBg: 'bg-far-drain',
    baseLv: 49, power: 3.0, mobPow: 0.75, pool: [[2, 'straw'], [1, 'duck'], [1, 'plate'], [1, 'bubble'], [2, 'mug'], [3, 'eel'], [4, 'glove'], [7, 'scrub']], hazard: 'tap', mimic: 'mimic', elite: 'xscrub', boss: 'moldking',
    names: ['Faucet Falls', 'Suds Slide', 'Sponge Shoals', 'Dish Rack Ridge', 'Steel Wool Wall', 'Bubble Bay', 'Plughole Pass', 'Greasy Pan Pits', 'Drain Descent', 'The Mold Throne'],
  },
  // ---- Act 2: Beyond the Kitchen ----
  {
    id: 6, name: 'The Dining Room', blurb: 'Fancy plates, forgotten feasts.', bg: 'bg-far-dining', mid: 'bg-mid-dining', tile: 'tile-dining', platTint: 0xf0e0c8, bossBg: 'bg-far-table',
    baseLv: 61, power: 3.4, mobPow: 1, pool: [[2, 'ladle'], [1, 'teacake'], [1, 'fork'], [1, 'napkin'], [2, 'candle'], [3, 'gravy'], [4, 'teapot'], [7, 'roast']], hazard: 'wax', mimic: 'mimic', elite: 'xroast', boss: 'stale',
    names: ['Tablecloth Trail', 'Placemat Plains', 'Candelabra Crossing', 'Gravy Boat Bay', 'Roast Ridge', 'Teacup Terrace', 'Napkin Fold Fort', 'Silverware Siege', 'Chandelier Climb', 'The Head of the Table'],
  },
  {
    id: 7, name: 'The Backyard BBQ', blurb: 'Sizzling, smoky and full of ants.', bg: 'bg-far-backyard', mid: 'bg-mid-backyard', tile: 'tile-backyard', platTint: 0xe8d0a8, bossBg: 'bg-far-grill',
    baseLv: 71, power: 3.8, mobPow: 1, pool: [[2, 'firefly'], [1, 'skewer'], [1, 'beetle'], [1, 'wasp'], [2, 'ketchup'], [3, 'charcoal'], [4, 'corn'], [7, 'patty']], hazard: 'sprinkler', mimic: 'mimic', elite: 'xpatty', boss: 'brussels',
    names: ['Lawn Launch', 'Hose Highway', 'Sprinkler Springs', 'Paddling Pool Pier', 'Patty Plateau', 'Picnic Table Peak', 'Flowerpot Fort', 'Cooler Canyon', 'Charcoal Climb', 'The Grill Summit'],
  },
  {
    id: 8, name: 'The Garden', blurb: 'Overgrown, untended and up to something.', bg: 'bg-far-garden', mid: 'bg-mid-garden', tile: 'tile-garden', platTint: 0xd8e8c0, bossBg: 'bg-far-greenhouse',
    baseLv: 81, power: 4.2, mobPow: 1.15, pool: [[2, 'toadstool'], [1, 'caterpillar'], [1, 'snail'], [1, 'ladybug'], [2, 'peapod'], [3, 'mole'], [4, 'tomato'], [5, 'radish'], [7, 'pumpkin']], hazard: 'pollen', mimic: 'mimic', elite: 'xpumpkin', boss: 'meatloaf',
    names: ['Seedling Lane', 'Watering Can Run', 'Sunflower Grove', 'Pumpkin Patch Path', 'Gourd Guard', 'Beanstalk Heights', 'Compost Keep', 'Scarecrow Stand', 'Greenhouse Steps', 'The Mystery Heap'],
  },
  {
    id: 9, name: 'The Supermarket', blurb: 'Open late. Very, very late.', bg: 'bg-far-market', mid: 'bg-mid-market', tile: 'tile-market', platTint: 0xd8e0e8, bossBg: 'bg-far-freezer2',
    baseLv: 91, power: 4.6, mobPow: 0.6, pool: [[2, 'boxbot'], [1, 'coupon'], [1, 'trolley'], [1, 'bag'], [2, 'banana'], [3, 'scanner'], [4, 'can2'], [7, 'melon']], hazard: 'chill', mimic: 'mimic', elite: 'xmelon', boss: 'tupper',
    names: ['Sliding Doors', 'Trolley Track', 'Cereal Aisle', 'Fruit and Veg', 'Melon Mountain', 'Bakery Bluff', 'Canned Goods Keep', 'Checkout Chaos', 'The Frozen Aisle', 'The Back Aisle'],
  },
  {
    id: 10, name: 'The Feast of the Forgotten', blurb: 'Where forgotten food goes to sulk.', bg: 'bg-far-fridgeback', mid: 'bg-mid-fridgeback', tile: 'tile-fridgeback', platTint: 0xd0e0f0, bossBg: 'bg-far-feast',
    baseLv: 101, power: 5.0, mobPow: 0.62, pool: [[2, 'cracker2'], [1, 'pudding'], [1, 'cherrysoldier'], [1, 'peel'], [2, 'fork'], [3, 'beetle'], [4, 'snail'], [5, 'scanner'], [7, 'fruitknight']], hazard: 'chill', mimic: 'mimic', elite: 'xfruitknight', boss: 'fruitcake',
    names: ['The Cold Door', 'Jam Jar Junction', 'Takeaway Towers', 'Frost Drawer Falls', 'Knight of the Fruitcake', 'Paper Chain Pass', 'The Forgotten Shelf', 'The Last Stand', 'The Long Table', 'The Feast of the Forgotten'],
  },
];

/** Small seeded RNG so a stage is always laid out the same way. */
function rng(seed: number): () => number {
  let s = seed >>> 0 || 1;
  return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; };
}

/** A world's stage n. Free mode passes its own seed / level / id to get fresh layouts at any level. */
export function genStage(w: WorldDef, n: number, o: { seed?: number; lv?: number; id?: string; name?: string; /** length multiplier */ len?: number; /** boss: just the boss room (Boss Rush, Endless) */ short?: boolean } = {}): StageDef {
  const id = o.id ?? `${w.id}-${n}`;
  const lvLo = o.lv ?? w.baseLv + n - 1, lvHi = lvLo + 1;
  if (n === 10 && !o.short) return genMaps(w, 10, { ...o, id, lvLo, lvHi: lvLo + 1 });
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
  const LEN = o.len ?? (w.id <= 5 ? STAGE_LEN * 1.2 : STAGE_LEN); // Act 1 monsters fall faster, so its stages run a little longer
  if (LEN > 1.5) return genMaps(w, n, { ...o, id, lvLo, lvHi });
  const width = Math.round((2200 + n * 140) * LEN);
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
  const count = Math.round((7 + Math.floor(n * 0.8) + (n === 1 && w.id >= 2 ? 2 : 0)) * Math.max(1, LEN)); // a world's first stage was a stroll
  const mobs: MobSpawn[] = [];
  for (let i = 0; i < count; i++) {
    let kind = kinds[Math.floor(r() * kinds.length)];
    // specialists (turrets, snipers, healers, chargers...) are spice, not the meal: at most 2 of each per stage (1 turret)
    if (SPECIALIST.has(MOBS[kind].brain) && mobs.filter(m => m.kind === kind).length >= (MOBS[kind].brain === 'turret' ? 1 : 2)) kind = basics[Math.floor(r() * basics.length)] ?? kind;
    const lv = r() < 0.5 ? lvLo : lvHi;
    // flyers and turrets always start at ground level (from a high platform they would be out of reach); monsters stay
    // off the top tier (only precise hops or a ladder reach it, and a knock-back there undoes the climb), and brutes
    // stay on the floor (on a ledge they just shove you off it)
    const perches = platforms.filter(p => p.y >= TIER[1]);
    if (MOBS[kind].brain !== 'flyer' && MOBS[kind].brain !== 'turret' && r() < 0.35 && platforms.length > 0) {
      const p = MOBS[kind].brain === 'brute' || !perches.length ? null : perches[Math.floor(r() * perches.length)];
      if (!p) { r(); mobs.push({ kind, lv, x: Math.round(520 + (i / count) * (width - 900) + r() * 120) }); continue; }
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
  if (n >= 2 || w.id >= 2) {
    const want = Math.round((1 + Math.floor(n / 3)) * Math.max(1, LEN * 0.8));
    for (let tries = 0; hazards.length < want && tries < 40; tries++) {
      const hx = Math.round(500 + r() * (width - 1000));
      if (hazards.some(h => Math.abs(h.x - hx) < 380) || ladders.some(l => Math.abs(l.x - hx) < 90)) continue;
      hazards.push(hazardAt(w.hazard, hx, r() * 3));
    }
  }
  const inter = interactive(w, n, width, platforms, ladders, r, LEN);
  return {
    id, world: w.id, num: id, name: o.name ?? w.names[n - 1], bg: w.bg, mid: w.mid, tile: w.tile, platTint: w.platTint, width, groundY: G,
    lv: [lvLo, n === 5 ? lvHi + 1 : lvHi], par: Math.round(25 + count * 5 + width / 70), rec: lvLo,
    platforms, ladders, mobs, ...inter, hazards: awayFromSponges(hazards, inter.props ?? [], ladders, width), // never a hazard by a bouncy sponge (it can loop you up to the ledge forever)
    ...setPieces(w, n, width, platforms, mobs, lvLo, lvHi, LEN),
    // a goal on stages 4 / 6 / 8 of every world (on a long stage the fetch race is the last stretch, the hold-out comes past halfway)
    objective: n === 4 ? { kind: 'escort' } : n === 6 ? { kind: 'fetch', t: w.id >= 7 ? 100 : w.id >= 5 ? 90 : 75, x: width - 260, ...(LEN > 1.5 ? { at: width - 3000 } : {}) } : n === 8 ? { kind: 'survive', t: 45, ...(LEN > 1.5 ? { at: Math.round(width * 0.6) } : {}) } : undefined,
  };
}


/** Props, moving trays, cookers and a secret ledge for a normal stage (seeded, the same for everyone). */
function interactive(w: WorldDef, n: number, width: number, platforms: Platform[], ladders: Ladder[], r: () => number, LEN = 1): { props: Prop[]; cookers: number[] } {
  const props: Prop[] = [];
  const free = (x: number) => !props.some(p => Math.abs(p.x - x) < 70);
  // breakables: a few on the floor, some on platforms
  for (let i = 0; i < Math.round((3 + Math.floor(n / 3)) * Math.max(1, LEN * 0.8)); i++) {
    const onPlat = platforms.length && r() < 0.4;
    const p = onPlat ? platforms[Math.floor(r() * platforms.length)] : null;
    const x = p ? Math.round(p.x + 30 + r() * (p.w - 60)) : Math.round(420 + r() * (width - 800));
    if (free(x)) props.push({ kind: r() < 0.6 ? 'crate' : 'jar', x, y: p ? p.y : G });
  }
  // a moving tray from World 2 on (one of the low single steps)
  if (w.id >= 2) { const p = platforms.find(q => q.y === TIER[0] && !platforms.some(o => o !== q && Math.abs(o.x - q.x) < q.w + 160)); if (p) p.move = { dx: 120, period: 4 }; }
  // a lever that drops a rolling pin on the stretch ahead (stages 3 and 7)
  if (n === 3 || n === 7) for (const f of LEN > 1.5 ? [0.2, 0.68] : [0.35]) { const x = Math.round(width * f); props.push({ kind: 'lever', x, y: G, tx: x + 260, tw: 260 }); }
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
  const cookers = [4, 6, 8, 9].includes(n) ? ((k: number) => Array.from({ length: k }, (_, i) => Math.round(width * ((i + 0.4 + r() * 0.3) / k))))(Math.max(1, Math.round(width / 4000))) : [];
  return { props, cookers };
}

/** Arena rooms (stages 2/3/7/9), a rolling-pin chase (stage 2), conveyor belts (worlds 2-4, stages 6/9). */
function setPieces(w: WorldDef, n: number, width: number, platforms: Platform[], mobs: MobSpawn[], lvLo: number, lvHi: number, LEN = 1): { arenas?: Arena[]; chase?: { x0: number; x1: number }; belts?: { x: number; w: number; v: number }[] } {
  const out: ReturnType<typeof setPieces> = {};
  const long = LEN > 1.5;
  if (n === 2) out.chase = { x0: 520, x1: long ? 2400 : Math.round(width * 0.58) };
  // arena rooms: the short layout has one on stages 2/3/7/9; a long stage has a few on every stage, kept clear of the
  // timed stretches (the fetch race at the end of stage 6, the hold-out past halfway on stage 8)
  const at = long ? (n === 4 ? [0.3, 0.7] : n === 6 ? [0.2, 0.4, 0.58] : n === 8 ? [0.22, 0.42, 0.85] : n === 2 ? [0.3, 0.5, 0.68, 0.86] : [0.22, 0.42, 0.62, 0.82]) : [2, 3, 7, 9].includes(n) ? [n === 2 ? 0.64 : 0.5] : [];
  const DESIGN = [2, 3, 7, 9];
  out.arenas = at.map((f, i) => {
    const x0 = Math.round(width * f), x1 = Math.min(x0 + 640, width - 160);
    // nothing wanders around inside the room beforehand: it fills up when you walk in
    for (let k = mobs.length - 1; k >= 0; k--) if (!mobs[k].elite && MOBS[mobs[k].kind].brain !== 'mimic' && mobs[k].x > x0 - 40 && mobs[k].x < x1 + 40 && mobs[k].y === undefined) mobs.splice(k, 1);
    const design = long ? ([2, 3, 7, 9].includes(n) && i === 1 ? n : DESIGN[(n + i) % 4]) : n;
    return { x0, x1, waves: arenaWaves(w, design, x0, x1, lvLo, lvHi) };
  });
  if (!out.arenas.length) delete out.arenas;
  if (w.id >= 2 && (n === 6 || n === 9)) out.belts = (long ? [0.4, 0.7] : [0.35]).map(f => ({ x: Math.round(width * f), w: 340, v: n === 6 ? 90 : -90 }));
  return out;
}

/** Three designed waves that change by stage: warm-up, a team that needs a plan, then a heavy hitter with backup.
 *  Stage 2: a protected healer (or summoner), 3: a sniper behind chargers, 7: a swarm with a bomber, 9: everything at once. */
function arenaWaves(w: WorldDef, n: number, x0: number, x1: number, lvLo: number, lvHi: number, champ?: MobKind): MobSpawn[][] {
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
  // the last wave's big one: on a long stage a champion of the world's monsters (elite, with a twist), else the world elite
  const heavy = [champ ? { ...L(champ, side, 0, lvHi), elite: true } : L(w.elite, side, 0, lvHi), L(sniper, -side, 0), L(f(5), -side, 1)];
  return [warm, team, heavy];
}

/** Secret bonus stage of a world (opened with that world's key): crates everywhere and a golden elite. */
function genBonus(w: WorldDef): StageDef {
  const base = genStage(w, 9);
  const r = rng(w.id * 777 + 5);
  const props: Prop[] = [...(base.props ?? [])];
  for (let i = 0; i < 12; i++) props.push({ kind: r() < 0.5 ? 'crate' : 'jar', x: Math.round(400 + i * (base.width - 800) / 12), y: G });
  return {
    ...base, id: `S-${w.id}`, num: `★${w.id}`, name: `Secret ${['Spice Garden', 'Ice Cream Vault', 'Bakery Hideout', 'Honey Cellar', 'Soap Bubble Grotto', 'Silver Vault', 'Treehouse', 'Seed Vault', 'Stockroom', 'Royal Pantry'][w.id - 1] ?? 'Hideout'}`,
    props, cookers: [Math.round(base.width * 0.5)], hazards: [], objective: undefined,
    mobs: [...base.mobs.slice(0, 8), { kind: w.elite, lv: base.lv[1] + 2, x: base.width - 520, elite: true }],
    lv: [base.lv[0] + 1, base.lv[1] + 2], rec: base.rec + 1,
  };
}

/** Slides any hazard sitting by a bouncy sponge to a free spot nearby (keeps the count, so every stage keeps its hazards). */
function awayFromSponges(hz: Hazard[], props: { kind: string; x: number }[], ladders: Ladder[], width: number): Hazard[] {
  const sponges = props.filter(p => p.kind === 'sponge').map(p => p.x);
  const bad = (x: number, self: Hazard) => sponges.some(sx => Math.abs(sx - x) < 200) || ladders.some(l => Math.abs(l.x - x) < 90) || hz.some(o => o !== self && Math.abs(o.x - x) < 300) || x < 500 || x > width - 500;
  const out = hz.map(h => {
    if (!sponges.some(sx => Math.abs(sx - h.x) < 200)) return h;
    for (const d of [260, -260, 420, -420, 600, -600, 800, -800]) if (!bad(h.x + d, h)) return { ...h, x: h.x + d };
    return h;
  });
  // still stuck by a sponge: drop it, as long as the stage keeps at least one hazard
  const ok = out.filter(h => !sponges.some(sx => Math.abs(sx - h.x) < 200));
  return ok.length ? ok : out;
}

function hazardAt(kind: HazardKind, x: number, offset: number): Hazard {
  switch (kind) {
    case 'burner': return { kind, x, w: 90, period: 3.6, on: 1.2, offset };
    case 'vent': return { kind, x, w: 70, period: 3.2, on: 0.8, offset };
    case 'drop': return { kind, x, w: 80, period: 3.8, on: 0.35, offset };
    case 'ice': return { kind, x, w: 260, period: 1, on: 1, offset };
    case 'tap': return { kind, x, w: 70, period: 3.4, on: 1.1, offset };
    case 'wax': return { kind, x, w: 80, period: 3.6, on: 0.4, offset };
    case 'sprinkler': return { kind, x, w: 80, period: 3.4, on: 0.7, offset };
    case 'pollen': return { kind, x, w: 100, period: 3.8, on: 1.2, offset };
    case 'chill': return { kind, x, w: 90, period: 3.6, on: 0.9, offset };
  }
}

export const STAGES: StageDef[] = WORLDS.flatMap(w => Array.from({ length: 10 }, (_, i) => genStage(w, i + 1)));
/** Secret bonus stages, one per world (keys from that world's stage 7 secret chest). */
export const BONUS_STAGES: StageDef[] = WORLDS.map(genBonus);
/** A world boss's room on its own (no run-up): Boss Rush, tests. */
export const bossRoom = (worldId: number): StageDef => genStage(WORLDS[worldId - 1], 10, { short: true });

export function stageById(id: string): StageDef { return STAGES.find(s => s.id === id) ?? BONUS_STAGES.find(s => s.id === id) ?? STAGES[0]; }
export function worldOf(s: StageDef): WorldDef { return WORLDS.find(w => w.id === s.world) ?? WORLDS[0]; }


// ---------------------------------------------------------------------------------------------------------------------
// Long stages (5-10 minutes): a run of different SECTIONS, so no two stages play alike. Every stage has its own recipe
// (what its number is about: the chase, the lever, the escort, the elite, the scroll race, the hold-out...), shuffled
// with a few picks from the library, and every world plays them with its own monsters and hazard.
interface Build {
  platforms: Platform[]; ladders: Ladder[]; mobs: MobSpawn[]; props: Prop[]; hazards: Hazard[]; arenas: Arena[];
  belts: { x: number; w: number; v: number }[]; darks: { x0: number; x1: number }[]; gates: { x: number }[];
  chase?: { x0: number; x1: number }; holdAt?: number; fetchAt?: number;
}

/** A stage of maps (Lunia / MapleStory style): a camp hub with portals to 3 zones; each zone has a goal (hunt a monster
 *  for its quest drops, free caged Crumblets, smash mould nests, clear an arena, race for the scroll, hold out);
 *  when all three are done the boss door opens: the stage's miniboss (stage 5: the elite or your nemesis; stage 10:
 *  the world boss) in its own room, then the exit. */
function genMaps(w: WorldDef, n: number, o: { seed?: number; id: string; name?: string; lvLo: number; lvHi: number }): StageDef {
  const { lvLo, lvHi } = o, boss = n === 10;
  const r = rng(o.seed ?? w.id * 1000 + n * 37 + 11);
  const pick = <T>(a2: T[]): T => a2[Math.floor(r() * a2.length)];
  const mini = (n + w.id) % 2 ? [`m${w.id}a`, `m${w.id}b`] : [`m${w.id}b`, `m${w.id}a`];
  const b: Build = { platforms: [], ladders: [], mobs: [], props: [], hazards: [], arenas: [], belts: [], darks: [], gates: [] };
  const GAP = 600, maps: StageMap[] = [];
  const nMaps = boss || n <= 3 ? 2 : 3; // a world's first stages and its boss stage: two maps
  const layouts = ['terraces', 'towers', 'steps', 'islands', 'deck', 'valley'].sort(() => r() - 0.5);
  let x = 0, fetchAt: number | undefined, holdAt: number | undefined, scrollX: number | undefined, scrollY: number | undefined;
  for (let k = 0; k < nMaps; k++) {
    const z0 = x, W = 2700 + Math.round(r() * 600), z1 = z0 + W + (n === 7 && k === 1 ? 700 : 0);
    const L = layouts[k % layouts.length], p0 = b.platforms.length;
    const P = (px: number, tier: number, pw: number) => b.platforms.push({ x: Math.round(z0 + px + (r() - 0.5) * 60), y: TIER[tier], w: pw });
    // the floors (every platform can be reached by a jump from the floor below it, or a ladder)
    if (L === 'terraces') { P(250, 0, 900); P(1350, 0, 900); P(2350, 0, 450); P(700, 1, 1000); P(1900, 1, 650); P(1150, 2, 600); }
    else if (L === 'towers') { P(250, 0, 500); P(350, 1, 420); P(250, 2, 520); P(W - 750, 0, 500); P(W - 770, 1, 420); P(W - 770, 2, 520); P(1100, 0, W - 2200); b.ladders.push({ x: z0 + 500, top: TIER[2], bottom: G }, { x: z0 + W - 500, top: TIER[2], bottom: G }); }
    else if (L === 'steps') { P(300, 0, 600); P(800, 1, 600); P(1300, 2, 700); P(1900, 1, 550); P(2350, 0, 450); }
    else if (L === 'islands') { P(300, 0, 400); P(1100, 0, 400); P(1900, 0, 400); P(2650, 0, 260); P(700, 1, 330); P(1500, 1, 330); P(2300, 1, 330); P(1100, 2, 300); P(1900, 2, 300); b.platforms.push({ x: z0 + 1500, y: TIER[0], w: 140, move: { dx: 260, period: 4 } }); }
    else if (L === 'deck') { const dx = z0 + 350, dw = W - 800; b.platforms.push({ x: dx, y: TIER[2], w: dw }); for (const f of [0.15, 0.5, 0.85]) b.ladders.push({ x: Math.round(dx + dw * f), top: TIER[2], bottom: G }); P(600, 0, 400); P(W - 1000, 0, 400); }
    else { P(150, 0, 350); P(250, 1, 700); P(W - 950, 1, 700); P(W - 500, 0, 350); P(1200, 0, 300); if (w.id >= 2) b.belts.push({ x: Math.round(z0 + W / 2 - 400), w: 300, v: r() < 0.5 ? 90 : -90 }, { x: Math.round(z0 + W / 2 + 200), w: 300, v: r() < 0.5 ? 90 : -90 }); }
    // a ladder up to every upper floor (MapleStory style ropes: easy on a phone, and nothing is out of reach)
    b.platforms.slice(p0).forEach((p, i) => {
      if (p.y > TIER[1] || p.move || b.ladders.some(l => l.top === p.y && l.x >= p.x && l.x <= p.x + p.w)) return;
      // never right next to another ladder (standing at the top of one you'd grab the wrong one)
      const at = (i % 2 ? [p.x + p.w - 50, p.x + 50, p.x + p.w / 2] : [p.x + 50, p.x + p.w - 50, p.x + p.w / 2]).find(lx => !b.ladders.some(l => Math.abs(l.x - lx) < 120));
      if (at !== undefined) b.ladders.push({ x: Math.round(at), top: p.y, bottom: G });
    });
    // what lives here: this stage's monsters, and one more of the next stage's in later maps (so even 1-1 varies)
    const kinds = w.pool.filter(([from]) => from <= Math.min(9, n + k)).map(([, kk]) => kk).filter(kk => MOBS[kk].brain !== 'mimic');
    const huntable = kinds.filter(kk => !['sniper', 'healer', 'summoner', 'turret', 'burrower'].includes(MOBS[kk].brain));
    const fresh = huntable.filter(kk => !b.mobs.some(mm => mm.kind === kk)); // prefer monsters the earlier maps didn't ask for
    const nWant = n <= 3 && k === 0 ? 2 : boss ? 2 : n >= 6 && k === 2 ? 3 : 2 + (r() < 0.4 ? 1 : 0);
    // close-range monsters first (a crowd of shooters on the upper floors just wears you down): at most one shooter wanted
    const shoots = (kk: MobKind) => ['ranged', 'sniper', 'turret'].includes(MOBS[kk].brain);
    const order = [...fresh.sort(() => r() - 0.5), ...huntable.filter(kk => !fresh.includes(kk)).sort(() => r() - 0.5)];
    const wantKinds = [...order.filter(kk => !shoots(kk)), ...order.filter(shoots).slice(0, 1)].slice(0, Math.min(nWant, huntable.length));
    const per = 3;
    const wants = wantKinds.map(mob => ({ mob, n: per }));
    const extras = kinds.filter(kk => !wantKinds.includes(kk)).sort(() => r() - 0.5).slice(0, 3);
    const spawnKinds = [...wantKinds, ...wantKinds.filter(kk => !shoots(kk)), ...extras]; // wanted ones twice as often (shooters once)
    // spawn points: along every floor and the ground (not by the entrance or the exit)
    const pts: [number, number][] = [];
    for (const p of b.platforms.slice(p0)) for (let px = p.x + 60; px < p.x + p.w - 40; px += 230) pts.push([Math.round(px), p.y]);
    for (let px = z0 + 500; px < z1 - 350; px += 280) pts.push([px, G]);
    const cap = 6 + Math.floor(n / 4);
    for (let i = 0; i < cap; i++) { const [sx, sy] = pts[Math.floor(r() * pts.length)]; const kk = pick(spawnKinds); b.mobs.push({ kind: kk, lv: r() < 0.5 ? lvLo : lvHi, x: sx, ...(sy !== G && MOBS[kk].brain !== 'flyer' && MOBS[kk].brain !== 'brute' ? { y: sy } : {}) }); }
    // a little of what made stages different: a hazard or two, a breakable, a mimic, the stage's set piece
    if (w.id >= 2 || n >= 2) for (let i = 0; i < 1 + (n >= 6 ? 1 : 0); i++) b.hazards.push(hazardAt(w.hazard, Math.round(z0 + 700 + r() * (W - 1300)), r() * 3));
    b.props.push({ kind: 'jar', x: z0 + 140, y: G }, { kind: 'jar', x: z0 + 200, y: G }, { kind: r() < 0.5 ? 'crate' : 'jar', x: Math.round(z0 + 600 + r() * (W - 1000)), y: G });
    if ((n === 3 || n === 7 || n === 9) && k === 0) b.mobs.push({ kind: w.mimic, lv: lvHi, x: Math.round(z0 + 900 + r() * (W - 1400)) });
    if (n === 6 && k === 1 && !boss) { fetchAt = z0 + 120; const top = b.platforms.slice(p0).sort((u, v) => u.y - v.y || v.x - u.x)[0]; scrollX = Math.round(top.x + top.w - 50); scrollY = top.y; }
    if (n === 8 && k === 1 && !boss) holdAt = z0 + 500;
    if (n === 7 && k === 1 && !boss) { const lx = z0 + W + 200; b.platforms.push({ x: lx, y: 150, w: 140, secret: true }); b.props.push({ kind: 'sponge', x: lx + 12, y: G }, { kind: 'chest', x: lx + 80, y: 150, key: true }); }
    maps.push({ name: `${o.name ?? w.names[n - 1]} ${['I', 'II', 'III'][k]}`, kind: 'zone', x0: z0, x1: z1, goal: { kind: 'collect', wants },
      spawns: { kinds: spawnKinds, pts, cap, lv: lvLo }, portals: [{ x: z1 - 150, to: maps.length + 1, tx: z1 + GAP + 150, need: true }] });
    x = z1 + GAP;
  }
  // the boss room: the world boss on stage 10, else the stage's miniboss (stage 5: the elite, or your nemesis)
  const bx0 = x, room = genStage(w, 10, { lv: lvLo, id: o.id, short: true });
  b.props.push({ kind: 'jar', x: bx0 + 50, y: G }, { kind: 'jar', x: bx0 + 90, y: G }, { kind: 'jar', x: bx0 + 130, y: G }); // before the boss: three jars
  const mv = <T extends { x: number }>(a2: T): T => ({ ...a2, x: a2.x + bx0 });
  for (const p of room.platforms) b.platforms.push(mv(p));
  const foe: MobSpawn = boss ? { ...mv(room.mobs[0]), wake: bx0 + 320 }
    : { kind: (n === 5 ? w.elite : mini[0]) as MobKind, lv: lvHi + 1, x: bx0 + 1150, elite: !(w.id === 1 && n <= 2), wake: bx0 + 320 };
  b.mobs.unshift(foe); // the boss is mobs[0]
  if (boss) for (const h of room.hazards ?? []) b.hazards.push(mv(h));
  const bossMap: StageMap = { name: boss ? MOBS[w.boss].name : MOBS[foe.kind].name, kind: 'boss', x0: bx0, x1: bx0 + room.width, portals: [] };
  maps.push(bossMap);
  const width = bossMap.x1;
  // nothing may sit on a portal (you press up there)
  const portalXs = maps.flatMap(m => m.portals.map(p => p.x));
  b.ladders = b.ladders.filter(l => !portalXs.some(px => Math.abs(px - l.x) < 70));
  b.hazards = b.hazards.filter(h => !portalXs.some(px => Math.abs(px - h.x) < 200));
  const count = b.mobs.length * 2;
  const play = width - GAP * (maps.length - 1);
  void fetchAt; void scrollY;
  return {
    id: o.id, world: w.id, num: o.id, name: o.name ?? w.names[n - 1], bg: w.bg, mid: w.mid, tile: w.tile, platTint: w.platTint, width, groundY: G,
    bossBg: boss ? w.bossBg : undefined, boss: boss || undefined,
    lv: [lvLo, boss ? lvLo + 2 : lvHi + 1], par: Math.round(60 + count * 5 + play / 70), rec: lvLo,
    platforms: b.platforms, ladders: b.ladders, mobs: b.mobs, props: b.props, cookers: [], belts: b.belts.length ? b.belts : undefined,
    hazards: awayFromSponges(b.hazards, b.props, b.ladders, width),
    maps, sections: maps.map(m => m.name),
    objective: boss ? undefined : n === 4 ? { kind: 'escort' } : n === 6 ? { kind: 'fetch', t: 140, x: scrollX, at: fetchAt } : n === 8 ? { kind: 'survive', t: 45, at: holdAt } : undefined,
  };
}


