// Stages: 10 per world, built by a seeded generator from layout pieces (steps, stairs, ladder towers,
// open ground). Stage 5 has an elite mini-boss; stage 10 is the world boss in its own arena.
// Reach: the lowest jumper (Bluebeary) rises ~105 px, so tiers are 90 px apart; the top tier needs a ladder
// or a lower platform beside it (tests/world.test.ts checks every platform is reachable).
import { MOBS } from './mobs';
import type { Hazard, HazardKind, MobKind, MobSpawn, Platform, Ladder, StageDef } from './types';

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
];

/** Small seeded RNG so a stage is always laid out the same way. */
function rng(seed: number): () => number {
  let s = seed >>> 0 || 1;
  return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; };
}

function genStage(w: WorldDef, n: number): StageDef {
  const id = `${w.id}-${n}`;
  const lvLo = w.baseLv + n - 1, lvHi = lvLo + 1;
  if (n === 10) {
    return {
      id, world: w.id, num: id, name: w.names[9], bg: w.bossBg, mid: '', tile: w.tile, platTint: w.platTint, width: 1500, groundY: G,
      lv: [lvLo + 2, lvLo + 2], par: 130, rec: lvLo, boss: true,
      platforms: [{ x: 180, y: 382, w: 240 }, { x: 1080, y: 382, w: 240 }, { x: 520, y: 294, w: 460 }],
      ladders: [], mobs: [{ kind: w.boss, x: 1150, lv: lvLo + 2 }],
      // phase 2: the arena turns on its hazards (same for every kaiju)
      hazards: [hazardAt(w.hazard, 470, 1), hazardAt(w.hazard, 1030, 2.2)].map(h => ({ ...h, phase2: true })),
    };
  }
  const r = rng(w.id * 1000 + n * 37 + 11);
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
    id, world: w.id, num: id, name: w.names[n - 1], bg: w.bg, mid: w.mid, tile: w.tile, platTint: w.platTint, width, groundY: G,
    lv: [lvLo, n === 5 ? lvHi + 1 : lvHi], par: Math.round(25 + count * 5 + width / 70), rec: lvLo,
    platforms, ladders, mobs, hazards,
  };
}

function hazardAt(kind: HazardKind, x: number, offset: number): Hazard {
  switch (kind) {
    case 'burner': return { kind, x, w: 90, period: 3.6, on: 1.2, offset };
    case 'vent': return { kind, x, w: 70, period: 3.2, on: 0.8, offset };
    case 'drop': return { kind, x, w: 80, period: 3.8, on: 0.35, offset };
    case 'ice': return { kind, x, w: 260, period: 1, on: 1, offset };
  }
}

export const STAGES: StageDef[] = WORLDS.flatMap(w => Array.from({ length: 10 }, (_, i) => genStage(w, i + 1)));

export function stageById(id: string): StageDef { return STAGES.find(s => s.id === id) ?? STAGES[0]; }
export function worldOf(s: StageDef): WorldDef { return WORLDS.find(w => w.id === s.world) ?? WORLDS[0]; }
