// Enemy definitions. w/h = body size in px (feet at y). Stats are for level 1; levels scale them.
// Elites (stage 5 mini-bosses) are a normal kind with ELITE multipliers.
import type { MobKind } from './types';

export type Brain = 'walker' | 'hopper' | 'ranged' | 'brute' | 'flyer' | 'bomber' | 'boss'
  /** a kaiju's story rival: picks from its own move list, more moves each world */
  | 'nemesis'
  /** heals hurt monsters nearby, keeps away from you */
  | 'healer'
  /** travels underground, pops up under you */
  | 'burrower'
  /** long telegraphed rush; stunned if it misses and hits a wall or runs out */
  | 'charger'
  /** aims a laser line, then a fast shot */
  | 'sniper'
  /** never moves; lobs steam over platforms */
  | 'turret'
  /** pretends to be a loot box until you come close */
  | 'mimic'
  /** keeps a few little ones around */
  | 'summoner';

export interface MobDef {
  name: string; brain: Brain; art: string;
  hp: number; atk: number; speed: number;
  w: number; h: number; knock: number;
  aggro: number; range: number; windup: number; patrol: number;
  xp: number; dropChance: number;
  /** super armour: only finishers / skills make it flinch (boss: stagger meter) */
  armor?: boolean;
  /** boss attack patterns */
  moves?: string[];
  /** blocks 75% of damage from the front until a finisher or skill breaks its guard */
  shield?: boolean;
  /** splits into two of these when it dies */
  split?: MobKind;
  /** drawn smaller than its art (splitter children) */
  scale?: number;
  /** summoner: what it calls */
  calls?: MobKind;
  /** nemesis: its moves in unlock order (world 1 uses the first 2, world 2 the first 3, worlds 3-4 all 4) */
  nem?: NemesisDef;
}

/** Nemesis moves. Shared basics: slash leap charge rain breath fanshot lob spin roar puddle trap.
 *  Signatures (one nemesis each): slimesurge summon rootspike dive snatch boomerang beam lure vanish shell burrow heatwave skewer finslide. */
export type NemMove = 'slash' | 'leap' | 'charge' | 'rain' | 'breath' | 'fanshot' | 'lob' | 'spin' | 'roar' | 'puddle' | 'trap' | 'summon'
  | 'slimesurge' | 'rootspike' | 'dive' | 'snatch' | 'boomerang' | 'beam' | 'lure' | 'vanish' | 'shell' | 'burrow' | 'heatwave' | 'skewer' | 'finslide';
export interface NemesisDef {
  /** whose story it belongs to */
  species: number;
  moves: NemMove[];
  /** what each move is called for this nemesis (shown as it winds up) */
  names: string[];
  fly?: boolean;
  /** puddle flavour: slow (sticky), burn, poison, slick (slippery) */
  puddle?: 'slow' | 'burn' | 'poison' | 'slick';
  /** leaves a slime trail as it moves */
  trail?: boolean;
  calls?: MobKind;
  /** projectile look */
  shot?: string;
}

export const MOBS: Record<MobKind, MobDef> = {
  // World 1: The Countertop
  bun: { name: 'Moldy Bun', brain: 'walker', art: 'mob-bun', hp: 60, atk: 8, speed: 60, w: 50, h: 46, knock: 1, aggro: 260, range: 60, windup: 0.55, patrol: 120, xp: 8, dropChance: 0.3 },
  worm: { name: 'Sour Worm', brain: 'hopper', art: 'mob-worm', hp: 50, atk: 10, speed: 80, w: 44, h: 44, knock: 1.1, aggro: 300, range: 190, windup: 0.45, patrol: 140, xp: 10, dropChance: 0.3 },
  pepper: { name: 'Pepper Grunt', brain: 'ranged', art: 'mob-pepper', hp: 55, atk: 9, speed: 70, w: 40, h: 58, knock: 1, aggro: 340, range: 300, windup: 0.6, patrol: 100, xp: 11, dropChance: 0.35 },
  egg: { name: 'Rotten Egg', brain: 'brute', art: 'mob-egg', hp: 200, atk: 16, speed: 45, w: 70, h: 78, knock: 0.5, aggro: 260, range: 80, windup: 0.9, patrol: 90, xp: 30, dropChance: 0.6, armor: true },
  toast: { name: 'Burnt Toast King', brain: 'boss', art: 'boss-toast', hp: 1250, atk: 16, speed: 90, w: 120, h: 170, knock: 0.25, aggro: 2000, range: 140, windup: 0.7, patrol: 0, xp: 300, dropChance: 1, armor: true, moves: ['charge', 'leap', 'slash'] },
  // World 2: The Fridge
  pea: { name: 'Frost Pea', brain: 'ranged', art: 'mob-pea', hp: 50, atk: 9, speed: 65, w: 44, h: 50, knock: 1, aggro: 360, range: 320, windup: 0.5, patrol: 100, xp: 10, dropChance: 0.3 },
  yogurt: { name: 'Yogurt Slime', brain: 'walker', art: 'mob-yogurt', hp: 85, atk: 9, speed: 55, w: 56, h: 50, knock: 0.9, aggro: 260, range: 64, windup: 0.6, patrol: 120, xp: 10, dropChance: 0.3 },
  icebat: { name: 'Brain-Freeze Bat', brain: 'flyer', art: 'mob-icebat', hp: 45, atk: 10, speed: 120, w: 46, h: 40, knock: 1.2, aggro: 340, range: 220, windup: 0.5, patrol: 160, xp: 12, dropChance: 0.3 },
  pickle: { name: 'Pickle Knight', brain: 'brute', art: 'mob-pickle', hp: 190, atk: 15, speed: 55, w: 50, h: 82, knock: 0.5, aggro: 280, range: 90, windup: 0.75, patrol: 90, xp: 28, dropChance: 0.55, armor: true },
  // World 3: The Oven
  popcorn: { name: 'Popcorn Popper', brain: 'hopper', art: 'mob-popcorn', hp: 45, atk: 11, speed: 90, w: 42, h: 42, knock: 1.2, aggro: 320, range: 210, windup: 0.35, patrol: 150, xp: 11, dropChance: 0.3 },
  imp: { name: 'Hot Sauce Imp', brain: 'ranged', art: 'mob-imp', hp: 55, atk: 10, speed: 75, w: 40, h: 56, knock: 1, aggro: 380, range: 330, windup: 0.5, patrol: 110, xp: 12, dropChance: 0.35 },
  bacon: { name: 'Sizzle Bacon', brain: 'walker', art: 'mob-bacon', hp: 70, atk: 10, speed: 110, w: 60, h: 40, knock: 1, aggro: 300, range: 70, windup: 0.4, patrol: 160, xp: 11, dropChance: 0.3 },
  meatball: { name: 'Meatball Brute', brain: 'brute', art: 'mob-meatball', hp: 210, atk: 16, speed: 50, w: 72, h: 76, knock: 0.45, aggro: 280, range: 90, windup: 0.8, patrol: 90, xp: 30, dropChance: 0.6, armor: true },
  dragon: { name: 'Grease Dragon', brain: 'boss', art: 'boss-dragon', hp: 1800, atk: 19, speed: 95, w: 150, h: 170, knock: 0.2, aggro: 2000, range: 160, windup: 0.75, patrol: 0, xp: 340, dropChance: 1, armor: true, moves: ['slash', 'leap', 'breath', 'charge', 'rain'] },
  // World 4: The Pantry
  can: { name: 'Can Crusher', brain: 'walker', art: 'mob-can', hp: 110, atk: 12, speed: 55, w: 52, h: 60, knock: 0.6, aggro: 280, range: 70, windup: 0.6, patrol: 100, xp: 18, dropChance: 0.4, shield: true },
  cheerio: { name: 'Cheerio Blob', brain: 'walker', art: 'mob-cheerio', hp: 90, atk: 11, speed: 70, w: 58, h: 52, knock: 0.9, aggro: 280, range: 66, windup: 0.5, patrol: 130, xp: 14, dropChance: 0.3, split: 'minicheerio' },
  minicheerio: { name: 'Cheerio Bit', brain: 'hopper', art: 'mob-cheerio', hp: 28, atk: 7, speed: 100, w: 30, h: 28, knock: 1.3, aggro: 320, range: 180, windup: 0.3, patrol: 120, xp: 4, dropChance: 0.08, scale: 0.55 },
  soda: { name: 'Baking Soda Bomb', brain: 'bomber', art: 'mob-soda', hp: 40, atk: 22, speed: 150, w: 40, h: 46, knock: 1.2, aggro: 340, range: 60, windup: 0.7, patrol: 140, xp: 12, dropChance: 0.25 },
  flour: { name: 'Flour Ghost', brain: 'flyer', art: 'mob-flour', hp: 55, atk: 11, speed: 110, w: 46, h: 50, knock: 1.1, aggro: 340, range: 230, windup: 0.5, patrol: 160, xp: 13, dropChance: 0.3 },
  jar: { name: 'Cookie Jar Mimic', brain: 'boss', art: 'boss-jar', hp: 1650, atk: 19, speed: 85, w: 130, h: 170, knock: 0.2, aggro: 2000, range: 150, windup: 0.75, patrol: 0, xp: 360, dropChance: 1, armor: true, moves: ['slash', 'leap', 'rain', 'charge'] },
  // ---- new monsters, 3 per world ----
  garlic: { name: 'Garlic Cleric', brain: 'healer', art: 'mob-garlic', hp: 55, atk: 7, speed: 60, w: 44, h: 56, knock: 1, aggro: 320, range: 260, windup: 0.9, patrol: 100, xp: 14, dropChance: 0.4 },
  ant: { name: 'Sugar Ant Digger', brain: 'burrower', art: 'mob-ant', hp: 60, atk: 11, speed: 95, w: 50, h: 42, knock: 1, aggro: 340, range: 40, windup: 0.6, patrol: 120, xp: 13, dropChance: 0.3 },
  mimic: { name: 'Lunchbox Mimic', brain: 'mimic', art: 'mob-mimic', hp: 130, atk: 13, speed: 105, w: 58, h: 54, knock: 0.7, aggro: 300, range: 72, windup: 0.4, patrol: 0, xp: 30, dropChance: 1 },
  carrot: { name: 'Carrot Sniper', brain: 'sniper', art: 'mob-carrot', hp: 45, atk: 14, speed: 55, w: 36, h: 64, knock: 1.1, aggro: 560, range: 540, windup: 1.1, patrol: 80, xp: 14, dropChance: 0.35 },
  milk: { name: 'Milk Carton Rammer', brain: 'charger', art: 'mob-milk', hp: 110, atk: 14, speed: 60, w: 64, h: 62, knock: 0.6, aggro: 380, range: 360, windup: 0.8, patrol: 100, xp: 18, dropChance: 0.4 },
  jelly: { name: 'Jelly Mother', brain: 'summoner', art: 'mob-jelly', hp: 140, atk: 9, speed: 40, w: 70, h: 66, knock: 0.6, aggro: 340, range: 320, windup: 1.0, patrol: 80, xp: 22, dropChance: 0.5, calls: 'jellybit' },
  jellybit: { name: 'Jelly Baby', brain: 'hopper', art: 'mob-jelly', hp: 24, atk: 7, speed: 100, w: 28, h: 26, knock: 1.3, aggro: 340, range: 180, windup: 0.35, patrol: 120, xp: 3, dropChance: 0.04, scale: 0.45 },
  kettle: { name: 'Kettle Turret', brain: 'turret', art: 'mob-kettle', hp: 80, atk: 8, speed: 0, w: 54, h: 52, knock: 0, aggro: 400, range: 400, windup: 0.9, patrol: 0, xp: 16, dropChance: 0.4 },
  sausage: { name: 'Sausage Ram', brain: 'charger', art: 'mob-sausage', hp: 120, atk: 15, speed: 70, w: 64, h: 46, knock: 0.6, aggro: 400, range: 380, windup: 0.7, patrol: 110, xp: 18, dropChance: 0.4 },
  marsh: { name: 'Marshmallow Medic', brain: 'healer', art: 'mob-marsh', hp: 70, atk: 9, speed: 65, w: 48, h: 60, knock: 1, aggro: 320, range: 260, windup: 0.8, patrol: 100, xp: 16, dropChance: 0.4 },
  noodle: { name: 'Noodle Lurker', brain: 'burrower', art: 'mob-noodle', hp: 90, atk: 13, speed: 100, w: 56, h: 50, knock: 0.9, aggro: 360, range: 40, windup: 0.55, patrol: 120, xp: 18, dropChance: 0.35 },
  raisin: { name: 'Raisin Sniper', brain: 'sniper', art: 'mob-raisin', hp: 60, atk: 16, speed: 60, w: 38, h: 46, knock: 1.1, aggro: 580, range: 560, windup: 1.0, patrol: 80, xp: 18, dropChance: 0.35 },
  cereal: { name: 'Cereal Box Mimic', brain: 'mimic', art: 'mob-cereal', hp: 165, atk: 16, speed: 110, w: 60, h: 70, knock: 0.7, aggro: 300, range: 74, windup: 0.4, patrol: 0, xp: 34, dropChance: 1 },
  // ---- story nemeses: one per kaiju, fought at stage 5 of every world with more moves each time ----
  nbeet: { name: 'Brutus Beetroot', brain: 'nemesis', art: 'mob-nem-beet', hp: 210, atk: 15, speed: 75, w: 70, h: 92, knock: 0.4, aggro: 900, range: 120, windup: 0.75, patrol: 60, xp: 32, dropChance: 1, armor: true,
    nem: { species: 0, moves: ['slash', 'rootspike', 'puddle', 'roar'], names: ['Beet Slap', 'Root Spikes', 'Beet Juice', 'Bully Roar'], puddle: 'slow', shot: 'spike' } },
  ncrow: { name: 'Crustwing', brain: 'nemesis', art: 'mob-nem-crow', hp: 165, atk: 14, speed: 130, w: 70, h: 70, knock: 0.6, aggro: 900, range: 260, windup: 0.6, patrol: 80, xp: 32, dropChance: 1, armor: true,
    nem: { species: 10, moves: ['dive', 'fanshot', 'snatch', 'rain'], names: ['Peck Dive', 'Crumb Scatter', 'Snatch!', 'Feather Storm'], fly: true, shot: 'crumb' } },
  npine: { name: 'Pineapple Pete', brain: 'nemesis', art: 'mob-nem-pine', hp: 180, atk: 14, speed: 110, w: 56, h: 88, knock: 0.5, aggro: 900, range: 120, windup: 0.6, patrol: 80, xp: 32, dropChance: 1, armor: true,
    nem: { species: 11, moves: ['charge', 'boomerang', 'puddle', 'spin'], names: ['Skate Rush', 'Ring Toss', 'Juice Slick', 'Pineapple Spin'], puddle: 'slick', shot: 'ring' } },
  nlamp: { name: 'Zapsy the Bug Lamp', brain: 'nemesis', art: 'mob-nem-lamp', hp: 180, atk: 14, speed: 60, w: 60, h: 96, knock: 0.3, aggro: 900, range: 120, windup: 0.8, patrol: 50, xp: 32, dropChance: 1, armor: true,
    nem: { species: 4, moves: ['beam', 'trap', 'lure', 'rain'], names: ['Zapper Beam', 'Zap Bulbs', 'Lure Glow', 'Spark Shower'], shot: 'spark' } },
  nshroom: { name: 'Professor Penicillin', brain: 'nemesis', art: 'mob-nem-shroom', hp: 180, atk: 13, speed: 65, w: 60, h: 90, knock: 0.4, aggro: 900, range: 120, windup: 0.75, patrol: 60, xp: 32, dropChance: 1, armor: true,
    nem: { species: 1, moves: ['lob', 'summon', 'puddle', 'fanshot'], names: ['Spore Flask', 'Grow Minions', 'Spore Cloud', 'Spore Spray'], puddle: 'poison', calls: 'bun', shot: 'spore' } },
  nslug: { name: 'Sir Slurp', brain: 'nemesis', art: 'mob-nem-slug', hp: 240, atk: 14, speed: 55, w: 90, h: 64, knock: 0.3, aggro: 900, range: 130, windup: 0.75, patrol: 60, xp: 32, dropChance: 1, armor: true,
    nem: { species: 2, moves: ['slash', 'slimesurge', 'leap', 'puddle'], names: ['Slime Slap', 'Slime Surge', 'Belly Flop', 'Slime Pool'], trail: true, puddle: 'slow', shot: 'acid' } },
  nrat: { name: 'Ricotta Rat', brain: 'nemesis', art: 'mob-nem-rat', hp: 165, atk: 12, speed: 115, w: 54, h: 70, knock: 0.6, aggro: 900, range: 120, windup: 0.55, patrol: 80, xp: 32, dropChance: 1, armor: true,
    nem: { species: 5, moves: ['vanish', 'fanshot', 'trap', 'charge'], names: ['Smoke Bomb', 'Knife Fan', 'Mousetraps', 'Pickpocket Dash'], shot: 'knife' } },
  ncookie: { name: 'Duke Fortune Cookie', brain: 'nemesis', art: 'mob-nem-cookie', hp: 195, atk: 13, speed: 60, w: 70, h: 80, knock: 0.4, aggro: 900, range: 120, windup: 0.75, patrol: 50, xp: 32, dropChance: 1, armor: true,
    nem: { species: 6, moves: ['slash', 'shell', 'fanshot', 'rain'], names: ['Royal Swat', 'Crumble Shell', 'Royal Decrees', 'Fortune Rain'], shot: 'fortune' } },
  nginger: { name: 'Gari the Ginger Serpent', brain: 'nemesis', art: 'mob-nem-ginger', hp: 195, atk: 15, speed: 85, w: 90, h: 80, knock: 0.4, aggro: 900, range: 140, windup: 0.7, patrol: 70, xp: 32, dropChance: 1, armor: true,
    nem: { species: 7, moves: ['breath', 'burrow', 'spin', 'leap'], names: ['Pink Flame', 'Serpent Dive', 'Coil Whirl', 'Strike'] } },
  nbrulee: { name: 'Torchy Brûlée', brain: 'nemesis', art: 'mob-nem-brulee', hp: 210, atk: 15, speed: 65, w: 70, h: 80, knock: 0.4, aggro: 900, range: 140, windup: 0.75, patrol: 60, xp: 32, dropChance: 1, armor: true,
    nem: { species: 8, moves: ['breath', 'heatwave', 'puddle', 'leap'], names: ['Blowtorch', 'Heat Wave', 'Hot Caramel', 'Caramel Crash'], puddle: 'burn', shot: 'heat' } },
  nkebab: { name: 'Captain Kebab', brain: 'nemesis', art: 'mob-nem-kebab', hp: 195, atk: 15, speed: 80, w: 60, h: 96, knock: 0.4, aggro: 900, range: 140, windup: 0.7, patrol: 70, xp: 32, dropChance: 1, armor: true,
    nem: { species: 15, moves: ['skewer', 'spin', 'lob', 'charge'], names: ['Skewer Thrust', 'Spit-Roast Spin', 'Marinade Toss', 'Kebab Charge'], shot: 'marinade' } },
  nshark: { name: 'Finn Freezepop', brain: 'nemesis', art: 'mob-nem-shark', hp: 195, atk: 15, speed: 90, w: 90, h: 70, knock: 0.4, aggro: 900, range: 140, windup: 0.7, patrol: 70, xp: 32, dropChance: 1, armor: true,
    nem: { species: 17, moves: ['finslide', 'rain', 'roar', 'leap'], names: ['Fin Slide', 'Icicle Drop', 'Brain Freeze', 'Iceberg Belly-Flop'], shot: 'icicle' } },
  golem: { name: 'Freezer Golem', brain: 'boss', art: 'boss-golem', hp: 1700, atk: 18, speed: 80, w: 130, h: 180, knock: 0.2, aggro: 2000, range: 150, windup: 0.75, patrol: 0, xp: 320, dropChance: 1, armor: true, moves: ['slash', 'leap', 'rain', 'charge'] },
};

/** Stage-5 mini-boss multipliers. */
export const ELITE = { hp: 4, atk: 1.2, xp: 5, scale: 1.45 };

/** Elite modifiers: every elite rolls one (two in Hard mode). The name gets the prefix. */
export type EliteMod = 'spiky' | 'hasty' | 'vampiric' | 'shielded' | 'moldy' | 'splitting';
export const ELITE_MODS: Record<EliteMod, { name: string; desc: string; color: string }> = {
  spiky: { name: 'Spiky', desc: 'Hitting it with plain attacks pricks you', color: '#ff7a3a' },
  hasty: { name: 'Hasty', desc: 'Moves and winds up much faster', color: '#ffe14a' },
  vampiric: { name: 'Vampiric', desc: 'Heals when it hits you', color: '#e0306a' },
  shielded: { name: 'Shielded', desc: 'Guards from the front: use a Guard Break or a skill', color: '#7ab8ff' },
  moldy: { name: 'Moldy', desc: 'Leaves slowing mould puddles', color: '#7ad04a' },
  splitting: { name: 'Splitting', desc: 'Splits into two smaller copies', color: '#c87aff' },
};
/** Attacks that glow red: they can't be interrupted, only dodged. */
export const DANGER_MOVES = new Set(['charge', 'leap', 'rush', 'brute', 'skewer', 'finslide']);

/** The nemesis whose story this kaiju is in. */
export function nemesisOf(species: number): MobKind | undefined {
  return (Object.keys(MOBS) as MobKind[]).find(k => MOBS[k].nem?.species === species);
}
/** Moves a nemesis uses in a given world (2, 3, then all 4). */
export function nemesisMoves(kind: MobKind, world: number): NemMove[] {
  const n = MOBS[kind].nem; if (!n) return [];
  return n.moves.slice(0, Math.min(n.moves.length, world + 1));
}

/** Global difficulty knobs (tuned with scripts/balance.ts). */
export const TUNE = { hp: 2.5, atk: 1.8, bossHp: 1.15, bossAtk: 0.6, windup: 0.85 };
export function mobHp(kind: MobKind, lv: number): number { return Math.round(MOBS[kind].hp * TUNE.hp * (MOBS[kind].brain === 'boss' ? TUNE.bossHp : 1) * (1 + 0.32 * (lv - 1))); }
export function mobAtk(kind: MobKind, lv: number): number { return Math.round(MOBS[kind].atk * TUNE.atk * (1 + 0.2 * (lv - 1))); }
export function mobXp(kind: MobKind, lv: number): number { return Math.round(MOBS[kind].xp * (1 + 0.3 * (lv - 1))); }
/** Box odds level for a monster level (see loot.ts) */
export function dropLevel(lv: number): number { return 1 + (lv - 1) / 4; }
/** Crumbs a monster drops. */
export function mobCrumbs(lv: number, brain: Brain): number { return Math.round((2 + lv * 0.8) * (brain === 'boss' ? 25 : brain === 'brute' ? 3 : 1)); }
