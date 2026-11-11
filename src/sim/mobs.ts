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
  /** a miniboss (miniboss rooms, stage-5 champions): never picked as an ordinary monster */
  mini?: boolean;
  /** a King: a giant crowned version of an ordinary monster (drawn with a crown) */
  king?: boolean;
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
  | 'slimesurge' | 'rootspike' | 'dive' | 'snatch' | 'boomerang' | 'beam' | 'lure' | 'vanish' | 'shell' | 'burrow' | 'heatwave' | 'skewer' | 'finslide' | 'yank' | 'stingers' | 'scurry' | 'haymaker' | 'zip' | 'boomhop' | 'drip' | 'swipe';
export interface NemesisDef {
  /** whose story it belongs to (-1: a miniboss, nobody's nemesis) */
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
  toast: { name: 'Burnt Toast King', brain: 'boss', art: 'boss-toast', hp: 1100, atk: 23, speed: 90, w: 120, h: 170, knock: 0.25, aggro: 2000, range: 140, windup: 0.7, patrol: 0, xp: 300, dropChance: 1, armor: true, moves: ['charge', 'leap', 'slash'] },
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
  dragon: { name: 'Grease Dragon', brain: 'boss', art: 'boss-dragon', hp: 1500, atk: 26, speed: 95, w: 150, h: 170, knock: 0.2, aggro: 2000, range: 160, windup: 0.75, patrol: 0, xp: 340, dropChance: 1, armor: true, moves: ['slash', 'leap', 'breath', 'charge', 'rain'] },
  // World 4: The Pantry
  can: { name: 'Can Crusher', brain: 'walker', art: 'mob-can', hp: 110, atk: 12, speed: 55, w: 52, h: 60, knock: 0.6, aggro: 280, range: 70, windup: 0.6, patrol: 100, xp: 18, dropChance: 0.4, shield: true },
  cheerio: { name: 'Cheerio Blob', brain: 'walker', art: 'mob-cheerio', hp: 90, atk: 11, speed: 70, w: 58, h: 52, knock: 0.9, aggro: 280, range: 66, windup: 0.5, patrol: 130, xp: 14, dropChance: 0.3, split: 'minicheerio' },
  minicheerio: { name: 'Cheerio Bit', brain: 'hopper', art: 'mob-cheerio', hp: 28, atk: 7, speed: 100, w: 30, h: 28, knock: 1.3, aggro: 320, range: 180, windup: 0.3, patrol: 120, xp: 4, dropChance: 0.08, scale: 0.55 },
  soda: { name: 'Baking Soda Bomb', brain: 'bomber', art: 'mob-soda', hp: 40, atk: 22, speed: 150, w: 40, h: 46, knock: 1.2, aggro: 340, range: 60, windup: 0.7, patrol: 140, xp: 12, dropChance: 0.25 },
  flour: { name: 'Flour Ghost', brain: 'flyer', art: 'mob-flour', hp: 55, atk: 11, speed: 110, w: 46, h: 50, knock: 1.1, aggro: 340, range: 230, windup: 0.5, patrol: 160, xp: 13, dropChance: 0.3 },
  jar: { name: 'Cookie Jar Mimic', brain: 'boss', art: 'boss-jar', hp: 1230, atk: 25, speed: 85, w: 130, h: 170, knock: 0.2, aggro: 2000, range: 150, windup: 0.75, patrol: 0, xp: 360, dropChance: 1, armor: true, moves: ['slash', 'leap', 'rain', 'charge'] },
  // ---- World 5: The Sink ----
  plate: { name: 'Crusty Plate Knight', brain: 'walker', art: 'mob-plate', hp: 125, atk: 13, speed: 55, w: 54, h: 62, knock: 0.6, aggro: 280, range: 70, windup: 0.6, patrol: 100, xp: 19, dropChance: 0.4, shield: true },
  bubble: { name: 'Soap Bubble Sprite', brain: 'flyer', art: 'mob-bubble', hp: 42, atk: 9, speed: 115, w: 44, h: 44, knock: 1.1, aggro: 340, range: 230, windup: 0.5, patrol: 160, xp: 13, dropChance: 0.3 },
  glove: { name: 'Grabby Glove', brain: 'charger', art: 'mob-glove', hp: 110, atk: 13, speed: 70, w: 56, h: 54, knock: 0.6, aggro: 400, range: 380, windup: 0.7, patrol: 110, xp: 18, dropChance: 0.4 },
  eel: { name: 'Drain Eel', brain: 'burrower', art: 'mob-eel', hp: 95, atk: 13, speed: 100, w: 56, h: 56, knock: 0.9, aggro: 360, range: 40, windup: 0.55, patrol: 120, xp: 18, dropChance: 0.35 },
  mug: { name: 'Mouldy Mug', brain: 'ranged', art: 'mob-mug', hp: 60, atk: 8, speed: 60, w: 44, h: 50, knock: 1, aggro: 360, range: 320, windup: 0.55, patrol: 100, xp: 12, dropChance: 0.3 },
  scrub: { name: 'Scrub Brute', brain: 'brute', art: 'mob-scrub', hp: 215, atk: 16, speed: 50, w: 72, h: 76, knock: 0.45, aggro: 280, range: 90, windup: 0.8, patrol: 90, xp: 30, dropChance: 0.6, armor: true },
  sporeling: { name: 'Sporeling', brain: 'hopper', art: 'mob-sporeling', hp: 26, atk: 7, speed: 100, w: 30, h: 28, knock: 1.3, aggro: 340, range: 180, windup: 0.35, patrol: 120, xp: 3, dropChance: 0.04 },
  moldking: { name: 'The Mold Crown', brain: 'boss', art: 'boss-mold', hp: 1550, atk: 18, speed: 80, w: 140, h: 190, knock: 0.2, aggro: 2000, range: 150, windup: 0.75, patrol: 0, xp: 420, dropChance: 1, armor: true, moves: ['slash', 'leap', 'rain', 'charge'], calls: 'sporeling' },
  // ---- World 10: The Feast of the Forgotten ----
  cherrysoldier: { name: 'Candied Cherry Soldier', brain: 'hopper', art: 'mob-cherrysoldier', hp: 34, atk: 8, speed: 105, w: 32, h: 34, knock: 1.3, aggro: 340, range: 190, windup: 0.35, patrol: 120, xp: 5, dropChance: 0.08 },
  fruitknight: { name: 'Fruitcake Knight', brain: 'brute', art: 'mob-fruitknight', hp: 240, atk: 16, speed: 48, w: 78, h: 84, knock: 0.45, aggro: 280, range: 92, windup: 0.8, patrol: 90, xp: 34, dropChance: 0.6, armor: true, shield: true },
  peel: { name: 'Candied Peel Bat', brain: 'flyer', art: 'mob-peel', hp: 40, atk: 7, speed: 125, w: 44, h: 40, knock: 1.1, aggro: 340, range: 230, windup: 0.5, patrol: 160, xp: 13, dropChance: 0.3 },
  fruitcake: { name: 'Old Fruitcake', brain: 'boss', art: 'boss-fruitcake', hp: 940, atk: 18, speed: 75, w: 140, h: 190, knock: 0.15, aggro: 2000, range: 160, windup: 0.75, patrol: 0, xp: 700, dropChance: 1, armor: true, moves: ['slash', 'leap', 'charge', 'rain'], calls: 'cherrysoldier' },
  // ---- World 9: The Supermarket ----
  trolley: { name: 'Trolley Rammer', brain: 'charger', art: 'mob-trolley', hp: 108, atk: 10, speed: 70, w: 66, h: 56, knock: 0.6, aggro: 400, range: 380, windup: 0.7, patrol: 110, xp: 18, dropChance: 0.4 },
  bag: { name: 'Plastic Bag Ghost', brain: 'flyer', art: 'mob-bag', hp: 40, atk: 7, speed: 120, w: 44, h: 46, knock: 1.1, aggro: 340, range: 230, windup: 0.5, patrol: 160, xp: 13, dropChance: 0.3 },
  scanner: { name: 'Barcode Sniper', brain: 'sniper', art: 'mob-scanner', hp: 60, atk: 14, speed: 60, w: 40, h: 52, knock: 1.1, aggro: 560, range: 540, windup: 1.0, patrol: 80, xp: 18, dropChance: 0.35 },
  banana: { name: 'Bruised Banana Bunch', brain: 'hopper', art: 'mob-banana', hp: 62, atk: 9, speed: 95, w: 50, h: 46, knock: 1.1, aggro: 320, range: 210, windup: 0.4, patrol: 150, xp: 14, dropChance: 0.3 },
  can2: { name: 'Dented Can Turret', brain: 'turret', art: 'mob-can2', hp: 85, atk: 8, speed: 0, w: 56, h: 48, knock: 0, aggro: 400, range: 400, windup: 0.9, patrol: 0, xp: 16, dropChance: 0.4 },
  melon: { name: 'Watermelon Brute', brain: 'brute', art: 'mob-melon', hp: 235, atk: 16, speed: 48, w: 82, h: 80, knock: 0.45, aggro: 280, range: 92, windup: 0.8, patrol: 90, xp: 33, dropChance: 0.6, armor: true },
  lid: { name: 'Lost Lid', brain: 'hopper', art: 'mob-lid', hp: 26, atk: 7, speed: 100, w: 30, h: 26, knock: 1.3, aggro: 340, range: 180, windup: 0.35, patrol: 120, xp: 3, dropChance: 0.04 },
  tupper: { name: 'The Tupperwraith', brain: 'boss', art: 'boss-tupper', hp: 1230, atk: 19, speed: 85, w: 120, h: 170, knock: 0.2, aggro: 2000, range: 150, windup: 0.75, patrol: 0, xp: 580, dropChance: 1, armor: true, moves: ['slash', 'leap', 'charge', 'rain'], calls: 'lid' },
  // ---- World 8: The Garden ----
  snail: { name: 'Lettuce Snail', brain: 'walker', art: 'mob-snail', hp: 130, atk: 12, speed: 45, w: 58, h: 52, knock: 0.6, aggro: 280, range: 70, windup: 0.65, patrol: 80, xp: 19, dropChance: 0.4, shield: true },
  ladybug: { name: 'Ladybug Glider', brain: 'flyer', art: 'mob-ladybug', hp: 40, atk: 7, speed: 125, w: 42, h: 40, knock: 1.1, aggro: 340, range: 230, windup: 0.5, patrol: 160, xp: 13, dropChance: 0.3 },
  peapod: { name: 'Peapod Sniper', brain: 'sniper', art: 'mob-peapod', hp: 60, atk: 14, speed: 60, w: 38, h: 56, knock: 1.1, aggro: 560, range: 540, windup: 1.0, patrol: 80, xp: 18, dropChance: 0.35 },
  mole: { name: 'Potato Mole', brain: 'burrower', art: 'mob-mole', hp: 92, atk: 12, speed: 100, w: 54, h: 48, knock: 0.9, aggro: 360, range: 40, windup: 0.55, patrol: 120, xp: 18, dropChance: 0.35 },
  tomato: { name: 'Tomato Lobber', brain: 'turret', art: 'mob-tomato', hp: 85, atk: 8, speed: 0, w: 52, h: 54, knock: 0, aggro: 400, range: 400, windup: 0.9, patrol: 0, xp: 16, dropChance: 0.4 },
  radish: { name: 'Radish Bomber', brain: 'bomber', art: 'mob-radish', hp: 40, atk: 21, speed: 150, w: 38, h: 46, knock: 1.2, aggro: 340, range: 60, windup: 0.7, patrol: 140, xp: 12, dropChance: 0.25 },
  pumpkin: { name: 'Pumpkin Brute', brain: 'brute', art: 'mob-pumpkin', hp: 230, atk: 16, speed: 48, w: 80, h: 80, knock: 0.45, aggro: 280, range: 92, windup: 0.8, patrol: 90, xp: 32, dropChance: 0.6, armor: true },
  chunk: { name: 'Mystery Chunk', brain: 'hopper', art: 'mob-chunk', hp: 26, atk: 7, speed: 100, w: 30, h: 28, knock: 1.3, aggro: 340, range: 180, windup: 0.35, patrol: 120, xp: 3, dropChance: 0.04 },
  meatloaf: { name: 'The Mystery Meatloaf', brain: 'boss', art: 'boss-meatloaf', hp: 1050, atk: 19, speed: 75, w: 140, h: 150, knock: 0.2, aggro: 2000, range: 150, windup: 0.75, patrol: 0, xp: 540, dropChance: 1, armor: true, moves: ['slash', 'leap', 'charge', 'rain'], calls: 'chunk' },
  // ---- World 7: The Backyard BBQ ----
  wasp: { name: 'Picnic Wasp', brain: 'flyer', art: 'mob-wasp', hp: 40, atk: 7, speed: 125, w: 44, h: 42, knock: 1.1, aggro: 340, range: 230, windup: 0.5, patrol: 160, xp: 13, dropChance: 0.3 },
  corn: { name: 'Corn Cob Cannon', brain: 'turret', art: 'mob-corn', hp: 85, atk: 8, speed: 0, w: 50, h: 60, knock: 0, aggro: 400, range: 400, windup: 0.9, patrol: 0, xp: 16, dropChance: 0.4 },
  ketchup: { name: 'Ketchup Squirter', brain: 'sniper', art: 'mob-ketchup', hp: 60, atk: 14, speed: 60, w: 38, h: 54, knock: 1.1, aggro: 560, range: 540, windup: 1.0, patrol: 80, xp: 18, dropChance: 0.35 },
  beetle: { name: 'Kebab Beetle', brain: 'charger', art: 'mob-beetle', hp: 115, atk: 12, speed: 70, w: 64, h: 46, knock: 0.6, aggro: 400, range: 380, windup: 0.7, patrol: 110, xp: 18, dropChance: 0.4 },
  charcoal: { name: 'Charcoal Imp', brain: 'burrower', art: 'mob-charcoal', hp: 90, atk: 12, speed: 100, w: 50, h: 50, knock: 0.9, aggro: 360, range: 40, windup: 0.55, patrol: 120, xp: 18, dropChance: 0.35 },
  patty: { name: 'Burger Brute', brain: 'brute', art: 'mob-patty', hp: 225, atk: 16, speed: 50, w: 76, h: 78, knock: 0.45, aggro: 280, range: 90, windup: 0.8, patrol: 90, xp: 31, dropChance: 0.6, armor: true },
  sprout: { name: 'Sprout Soldier', brain: 'hopper', art: 'mob-sprout', hp: 26, atk: 7, speed: 100, w: 30, h: 30, knock: 1.3, aggro: 340, range: 180, windup: 0.35, patrol: 120, xp: 3, dropChance: 0.04 },
  brussels: { name: 'Baron Brussels', brain: 'boss', art: 'boss-brussels', hp: 1450, atk: 18, speed: 75, w: 130, h: 170, knock: 0.2, aggro: 2000, range: 150, windup: 0.75, patrol: 0, xp: 500, dropChance: 1, armor: true, moves: ['slash', 'leap', 'charge', 'rain'], calls: 'sprout' },
  // ---- World 6: The Dining Room ----
  fork: { name: 'Fork Soldier', brain: 'walker', art: 'mob-fork', hp: 105, atk: 12, speed: 65, w: 40, h: 70, knock: 0.8, aggro: 300, range: 72, windup: 0.5, patrol: 110, xp: 17, dropChance: 0.35 },
  napkin: { name: 'Napkin Ghost', brain: 'flyer', art: 'mob-napkin', hp: 42, atk: 7, speed: 120, w: 46, h: 48, knock: 1.1, aggro: 340, range: 230, windup: 0.5, patrol: 160, xp: 13, dropChance: 0.3 },
  candle: { name: 'Candle Imp', brain: 'ranged', art: 'mob-candle', hp: 58, atk: 9, speed: 60, w: 40, h: 54, knock: 1, aggro: 360, range: 320, windup: 0.55, patrol: 100, xp: 13, dropChance: 0.3 },
  gravy: { name: 'Gravy Boat Rammer', brain: 'charger', art: 'mob-gravy', hp: 110, atk: 11, speed: 65, w: 66, h: 50, knock: 0.6, aggro: 400, range: 380, windup: 0.7, patrol: 110, xp: 18, dropChance: 0.4 },
  teapot: { name: 'Teapot Nanny', brain: 'healer', art: 'mob-teapot', hp: 70, atk: 8, speed: 55, w: 50, h: 54, knock: 1, aggro: 320, range: 260, windup: 0.9, patrol: 100, xp: 15, dropChance: 0.4 },
  roast: { name: 'Roast Brute', brain: 'brute', art: 'mob-roast', hp: 220, atk: 16, speed: 50, w: 76, h: 74, knock: 0.45, aggro: 280, range: 90, windup: 0.8, patrol: 90, xp: 30, dropChance: 0.6, armor: true },
  crouton: { name: 'Crouton Squire', brain: 'hopper', art: 'mob-crouton', hp: 26, atk: 7, speed: 100, w: 30, h: 30, knock: 1.3, aggro: 340, range: 180, windup: 0.35, patrol: 120, xp: 3, dropChance: 0.04 },
  stale: { name: 'Sir Stale', brain: 'boss', art: 'boss-stale', hp: 1110, atk: 18, speed: 85, w: 110, h: 200, knock: 0.2, aggro: 2000, range: 160, windup: 0.75, patrol: 0, xp: 460, dropChance: 1, armor: true, moves: ['slash', 'leap', 'charge', 'fanshot'], calls: 'crouton' },
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
  nnacho: { name: 'El Nacho', brain: 'nemesis', art: 'mob-nem-nacho', hp: 210, atk: 15, speed: 80, w: 80, h: 84, knock: 0.4, aggro: 900, range: 140, windup: 0.72, patrol: 70, xp: 32, dropChance: 1, armor: true,
    nem: { species: 13, moves: ['yank', 'leap', 'puddle', 'charge'], names: ['Queso Yank', 'Flying Chip Drop', 'Queso Splash', 'Luchador Rush'], puddle: 'slow', shot: 'marinade' } },
  nhornet: { name: 'Señor Sting', brain: 'nemesis', art: 'mob-nem-hornet', hp: 185, atk: 15, speed: 95, w: 70, h: 64, knock: 0.4, aggro: 900, range: 140, windup: 0.68, patrol: 70, xp: 32, dropChance: 1, armor: true,
    nem: { species: 19, moves: ['stingers', 'fanshot', 'rain', 'roar'], names: ['Triple Sting', 'Hot Sauce Spray', 'Sauce Shower', 'Angry Buzz'], fly: true, shot: 'heat' } },
  nmouse: { name: 'Brittle', brain: 'nemesis', art: 'mob-nem-mouse', hp: 180, atk: 15, speed: 100, w: 60, h: 50, knock: 0.45, aggro: 900, range: 120, windup: 0.6, patrol: 80, xp: 32, dropChance: 1, armor: true,
    nem: { species: 9, moves: ['scurry', 'trap', 'fanshot', 'leap'], names: ['Squeaky Scurry', 'Mousetrap', 'Peanut Toss', 'Brittle Pounce'], shot: 'crumb' } },
  ngorilla: { name: 'Rocky Road', brain: 'nemesis', art: 'mob-nem-gorilla', hp: 220, atk: 16, speed: 70, w: 92, h: 100, knock: 0.35, aggro: 900, range: 150, windup: 0.75, patrol: 60, xp: 32, dropChance: 1, armor: true,
    nem: { species: 18, moves: ['haymaker', 'charge', 'roar', 'slash'], names: ['Rocky Haymaker', 'Marshmallow Rush', 'Nutty Roar', 'Fudge Jab'] } },
  nbird: { name: 'Jitters', brain: 'nemesis', art: 'mob-nem-bird', hp: 175, atk: 15, speed: 110, w: 56, h: 52, knock: 0.45, aggro: 900, range: 120, windup: 0.55, patrol: 90, xp: 32, dropChance: 1, armor: true,
    nem: { species: 12, moves: ['zip', 'fanshot', 'rain', 'trap'], names: ['Espresso Zip', 'Bean Spray', 'Caffeine Rain', 'Sugar Trap'], shot: 'crumb' } },
  nhare: { name: 'Hot Fudge Hare', brain: 'nemesis', art: 'mob-nem-hare', hp: 200, atk: 16, speed: 100, w: 64, h: 76, knock: 0.4, aggro: 900, range: 130, windup: 0.6, patrol: 80, xp: 32, dropChance: 1, armor: true,
    nem: { species: 16, moves: ['boomhop', 'charge', 'puddle', 'roar'], names: ['Boom Hop', 'Fudge Dash', 'Fudge Puddle', 'Smug Laugh'], puddle: 'slow' } },
  ngelato: { name: 'Grey Gelato', brain: 'nemesis', art: 'mob-nem-gelatin', hp: 185, atk: 15, speed: 80, w: 56, h: 84, knock: 0.45, aggro: 900, range: 130, windup: 0.65, patrol: 80, xp: 32, dropChance: 1, armor: true,
    nem: { species: 3, moves: ['drip', 'fanshot', 'slash', 'leap'], names: ['Snooty Drip', 'Sprinkle Spray', 'Cone Poke', 'Scoop Drop'], shot: 'crumb' } },
  nbear: { name: 'Grizzly Grizzle', brain: 'nemesis', art: 'mob-nem-bear', hp: 225, atk: 16, speed: 70, w: 92, h: 104, knock: 0.35, aggro: 900, range: 150, windup: 0.75, patrol: 60, xp: 32, dropChance: 1, armor: true,
    nem: { species: 14, moves: ['swipe', 'charge', 'lob', 'leap'], names: ['Double Swipe', 'Bear Rush', 'Patty Toss', 'Big Bear Belly Flop'] } },
  golem: { name: 'Freezer Golem', brain: 'boss', art: 'boss-golem', hp: 2400, atk: 25, speed: 80, w: 130, h: 180, knock: 0.2, aggro: 2000, range: 150, windup: 0.75, patrol: 0, xp: 320, dropChance: 1, armor: true, moves: ['slash', 'leap', 'rain', 'charge'] },
  // ----- minibosses (2 per world): they guard the miniboss rooms of long stages (art: scripts/minis-jobs.mjs) -----
  m1a: { name: 'Sir Butterknife', brain: 'nemesis', art: 'mob-m1a', hp: 200, atk: 15, speed: 85, w: 70, h: 100, knock: 0.35, aggro: 900, range: 130, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['slash','charge','shell','puddle'], names: ['Butter Slash','Knightly Charge','Crumpet Guard','Melted Butter'], puddle: 'slick'} },
  m1b: { name: 'The Toaster Tyrant', brain: 'nemesis', art: 'mob-m1b', hp: 190, atk: 15, speed: 70, w: 84, h: 88, knock: 0.35, aggro: 900, range: 300, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['fanshot','lob','heatwave','boomhop'], names: ['Toast Volley','Burnt Toast Lob','Hot Coils','Pop-Up Hop'], shot: 'crumb'} },
  m2a: { name: 'Ice Cube Ogre', brain: 'nemesis', art: 'mob-m2a', hp: 240, atk: 16, speed: 55, w: 92, h: 104, knock: 0.35, aggro: 900, range: 120, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['haymaker','leap','puddle','roar'], names: ['Ice Fist','Avalanche Drop','Frost Slick','Brain Freeze Roar'], puddle: 'slick'} },
  m2b: { name: 'The Cheese Wheel', brain: 'nemesis', art: 'mob-m2b', hp: 210, atk: 15, speed: 120, w: 90, h: 90, knock: 0.35, aggro: 900, range: 120, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['boomhop','charge','leap','puddle'], names: ['Rind Bounce','Wheel Roll','Big Wheel Drop','Melty Cheese'], puddle: 'slow'} },
  m3a: { name: 'Casserole Commander', brain: 'nemesis', art: 'mob-m3a', hp: 220, atk: 15, speed: 65, w: 90, h: 92, knock: 0.35, aggro: 900, range: 140, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['summon','slash','heatwave','roar'], names: ['Call the Troops','Spoon Smack','Oven Blast','Rally Cry'], calls: 'bacon'} },
  m3b: { name: 'Muffin Tin Mortar', brain: 'nemesis', art: 'mob-m3b', hp: 200, atk: 16, speed: 55, w: 94, h: 80, knock: 0.35, aggro: 900, range: 360, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['lob','fanshot','trap','boomhop'], names: ['Hot Muffin Mortar','Muffin Spray','Cupcake Mines','Tin Hop'], shot: 'heat'} },
  m4a: { name: 'Flour Sack Sumo', brain: 'nemesis', art: 'mob-m4a', hp: 260, atk: 17, speed: 60, w: 100, h: 100, knock: 0.35, aggro: 900, range: 120, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['charge','leap','puddle','roar'], names: ['Belly Push','Sumo Stomp','Flour Cloud','Sumo Shout'], puddle: 'slow'} },
  m4b: { name: 'Honey Pot Hermit', brain: 'nemesis', art: 'mob-m4b', hp: 200, atk: 15, speed: 70, w: 80, h: 88, knock: 0.35, aggro: 900, range: 300, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['drip','boomerang','puddle','summon'], names: ['Honey Drip','Dipper Toss','Sticky Pool','Angry Bees'], puddle: 'slow', shot: 'marinade', calls: 'raisin'} },
  m5a: { name: 'Sponge Golem', brain: 'nemesis', art: 'mob-m5a', hp: 260, atk: 16, speed: 55, w: 96, h: 104, knock: 0.35, aggro: 900, range: 130, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['slimesurge','haymaker','puddle','leap'], names: ['Soap Surge','Soggy Punch','Suds Slick','Squish Drop'], puddle: 'slick', trail: true} },
  m5b: { name: 'Dish Soap Siren', brain: 'nemesis', art: 'mob-m5b', hp: 200, atk: 15, speed: 80, w: 78, h: 100, knock: 0.35, aggro: 900, range: 320, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['fanshot','vanish','slimesurge','stingers'], names: ['Bubble Song','Into the Suds','Soap Wave','Trident Jabs'], shot: 'ring'} },
  m6a: { name: 'Gravy Boat Captain', brain: 'nemesis', art: 'mob-m6a', hp: 230, atk: 16, speed: 80, w: 96, h: 88, knock: 0.35, aggro: 900, range: 140, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['charge','boomerang','puddle','summon'], names: ['Full Steam Ahead','Ladle Hook','Gravy Spill','All Hands!'], puddle: 'slow', shot: 'marinade', calls: 'fork'} },
  m6b: { name: 'Candelabra Duchess', brain: 'nemesis', art: 'mob-m6b', hp: 210, atk: 16, speed: 60, w: 80, h: 120, knock: 0.35, aggro: 900, range: 320, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['heatwave','fanshot','drip','roar'], names: ['Flame Waltz','Wax Volley','Hot Wax','How Rude!'], shot: 'heat'} },
  m7a: { name: 'Hot Coal Golem', brain: 'nemesis', art: 'mob-m7a', hp: 260, atk: 17, speed: 55, w: 96, h: 104, knock: 0.35, aggro: 900, range: 130, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['heatwave','haymaker','puddle','rootspike'], names: ['Ember Blast','Coal Fist','Hot Ash','Fire Vents'], puddle: 'burn', shot: 'heat'} },
  m7b: { name: 'Corn Cob Gunner', brain: 'nemesis', art: 'mob-m7b', hp: 200, atk: 15, speed: 90, w: 70, h: 110, knock: 0.35, aggro: 900, range: 360, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['fanshot','zip','trap','lob'], names: ['Popcorn Burst','Husk Dash','Kernel Mines','Butter Bomb'], shot: 'crumb'} },
  m8a: { name: 'Snapdragon', brain: 'nemesis', art: 'mob-m8a', hp: 230, atk: 16, speed: 40, w: 90, h: 104, knock: 0.35, aggro: 900, range: 200, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['yank','rootspike','fanshot','summon'], names: ['Vine Grab','Root Snap','Thorn Spit','Sprouts'], shot: 'spike', calls: 'ladybug'} },
  m8b: { name: 'Gnome General', brain: 'nemesis', art: 'mob-m8b', hp: 210, atk: 16, speed: 75, w: 70, h: 96, knock: 0.35, aggro: 900, range: 140, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['slash','charge','summon','trap'], names: ['Shovel Strike','Charge!','Gnome Squad','Garden Traps'], calls: 'snail'} },
  m9a: { name: 'Trolley Chariot', brain: 'nemesis', art: 'mob-m9a', hp: 240, atk: 17, speed: 130, w: 100, h: 92, knock: 0.35, aggro: 900, range: 130, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['boomhop','charge','fanshot','leap'], names: ['Wheelie Hop','Runaway Trolley','Can Spill','Aisle Jump'], shot: 'crumb'} },
  m9b: { name: 'Price Gun Paladin', brain: 'nemesis', art: 'mob-m9b', hp: 210, atk: 16, speed: 70, w: 78, h: 104, knock: 0.35, aggro: 900, range: 320, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['fanshot','slash','shell','stingers'], names: ['Price Tag Volley','Box Cutter','Price Shield','Label Jabs'], shot: 'knife'} },
  m10a: { name: 'Forgotten Soup', brain: 'nemesis', art: 'mob-m10a', hp: 200, atk: 16, speed: 90, w: 84, h: 100, knock: 0.35, aggro: 900, range: 300, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['vanish','fanshot','charge','drip'], names: ['Fade Away','Soggy Croutons','Ghostly Swoop','Cold Soup'], shot: 'spore'} },
  m10b: { name: 'Pudding Juggernaut', brain: 'nemesis', art: 'mob-m10b', hp: 280, atk: 18, speed: 55, w: 100, h: 104, knock: 0.35, aggro: 900, range: 130, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['leap','roar','haymaker','charge'], names: ['Christmas Drop','Holly Roar','Pudding Punch','Rolling Pudding']} },
  // ----- stage-5 champions: each world's elite brute fought as a real miniboss with its own moves (same art) -----
  // more minibosses (scripts/minis2-jobs.mjs): with the Kings, every normal stage of a world has its own boss-room foe
  m1c: { name: 'Rolling Pin Rogue', brain: 'nemesis', art: 'mob-m1c', hp: 250, atk: 16, speed: 65, w: 84, h: 100, knock: 0.35, aggro: 900, range: 140, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['charge','leap','spin','roar'], names: ['Pin Roll','Flatten!','Pin Twirl','Stick Em Up']} },
  m1d: { name: 'Cutting Board Golem', brain: 'nemesis', art: 'mob-m1d', hp: 250, atk: 16, speed: 65, w: 84, h: 100, knock: 0.35, aggro: 900, range: 140, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['haymaker','shell','leap','rootspike'], names: ['Chop Punch','Board Guard','Belly Slam','Splinters']} },
  m1e: { name: 'Cookie Cutter Witch', brain: 'nemesis', art: 'mob-m1e', hp: 215, atk: 16, speed: 80, w: 84, h: 100, knock: 0.35, aggro: 900, range: 300, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['fanshot','trap','vanish','summon'], names: ['Star Cookies','Cutter Traps','Poof!','Jam Blobs, Rise!'], calls: 'jamhop', shot: 'crumb'} },
  m2c: { name: 'Fish Finger General', brain: 'nemesis', art: 'mob-m2c', hp: 215, atk: 16, speed: 80, w: 84, h: 100, knock: 0.35, aggro: 900, range: 140, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['skewer','charge','slash','roar'], names: ['Toothpick Thrust','Frozen Charge','Breaded Slash','Attention!']} },
  m2d: { name: 'Butter Block Brute', brain: 'nemesis', art: 'mob-m2d', hp: 215, atk: 16, speed: 80, w: 84, h: 100, knock: 0.35, aggro: 900, range: 300, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['puddle','haymaker','leap','shell'], names: ['Butter Slick','Butter Fist','Splat Drop','Wrapper Guard'], puddle: 'slick'} },
  m2e: { name: 'Leftover Lasagna Lich', brain: 'nemesis', art: 'mob-m2e', hp: 215, atk: 16, speed: 80, w: 84, h: 100, knock: 0.35, aggro: 900, range: 300, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['summon','drip','lob','vanish'], names: ['Rise, Leftovers!','Sauce Drip','Meatball Lob','Back in the Fridge'], calls: 'yogurt', shot: 'marinade'} },
  m3c: { name: 'Pizza Peel Paladin', brain: 'nemesis', art: 'mob-m3c', hp: 215, atk: 16, speed: 80, w: 84, h: 100, knock: 0.35, aggro: 900, range: 140, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['swipe','shell','charge','roar'], names: ['Peel Swipe','Peel Guard','Shield Rush','For the Oven!']} },
  m3d: { name: 'Souffle Sorcerer', brain: 'nemesis', art: 'mob-m3d', hp: 215, atk: 16, speed: 80, w: 84, h: 100, knock: 0.35, aggro: 900, range: 300, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['heatwave','fanshot','puddle','lob'], names: ['Oven Blast','Hot Crumbs','Burnt Batter','Rising Bomb'], puddle: 'burn', shot: 'heat'} },
  m3e: { name: 'Gingerbread Gladiator', brain: 'nemesis', art: 'mob-m3e', hp: 215, atk: 16, speed: 80, w: 84, h: 100, knock: 0.35, aggro: 900, range: 140, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['slash','skewer','boomhop','roar'], names: ['Candy Cane Cut','Cane Lunge','Gumdrop Hop','Run, Run!']} },
  m4c: { name: 'Cereal Box Colossus', brain: 'nemesis', art: 'mob-m4c', hp: 250, atk: 16, speed: 65, w: 84, h: 100, knock: 0.35, aggro: 900, range: 140, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['haymaker','summon','leap','roar'], names: ['Box Smash','Cereal Squad','Pantry Quake','Part of a Balanced Roar'], calls: 'cheerio'} },
  m4d: { name: 'Peanut Butter Ogre', brain: 'nemesis', art: 'mob-m4d', hp: 215, atk: 16, speed: 80, w: 84, h: 100, knock: 0.35, aggro: 900, range: 300, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['puddle','yank','haymaker','shell'], names: ['Sticky Spread','Gloopy Grab','Crunchy Punch','Lid Guard'], puddle: 'slow'} },
  m4e: { name: 'Spice Rack Shaman', brain: 'nemesis', art: 'mob-m4e', hp: 215, atk: 16, speed: 80, w: 84, h: 100, knock: 0.35, aggro: 900, range: 300, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['fanshot','trap','heatwave','lure'], names: ['Spice Spray','Pepper Mines','Chilli Blast','Smell This'], shot: 'heat'} },
  m5c: { name: 'Plunger Paladin', brain: 'nemesis', art: 'mob-m5c', hp: 215, atk: 16, speed: 80, w: 84, h: 100, knock: 0.35, aggro: 900, range: 140, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['yank','slash','shell','charge'], names: ['Plunge Pull','Handle Swing','Bucket Guard','Suction Charge']} },
  m5d: { name: 'Scrub Brush Boar', brain: 'nemesis', art: 'mob-m5d', hp: 250, atk: 16, speed: 65, w: 84, h: 100, knock: 0.35, aggro: 900, range: 140, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['charge','rootspike','swipe','roar'], names: ['Bristle Charge','Bristle Spikes','Scrub Swipe','Grunt!']} },
  m5e: { name: 'Clogged Drain Hag', brain: 'nemesis', art: 'mob-m5e', hp: 215, atk: 16, speed: 80, w: 84, h: 100, knock: 0.35, aggro: 900, range: 300, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['drip','yank','summon','vanish'], names: ['Gunk Drip','Clog Grab','Ducklings!','Down the Drain'], calls: 'duck', shot: 'acid'} },
  m6c: { name: 'Teapot Tyrant', brain: 'nemesis', art: 'mob-m6c', hp: 215, atk: 16, speed: 80, w: 84, h: 100, knock: 0.35, aggro: 900, range: 300, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['heatwave','lob','drip','summon'], names: ['Steam Burst','Sugar Cube Lob','Hot Tea','Tea Cakes, Attend!'], calls: 'teacake', shot: 'heat'} },
  m6d: { name: 'Silver Cloche Knight', brain: 'nemesis', art: 'mob-m6d', hp: 250, atk: 16, speed: 65, w: 84, h: 100, knock: 0.35, aggro: 900, range: 140, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['shell','charge','slash','roar'], names: ['Dome Guard','Serve!','Cutlery Slash','Dinner Is Served']} },
  m6e: { name: 'Napkin Ringmaster', brain: 'nemesis', art: 'mob-m6e', hp: 215, atk: 16, speed: 80, w: 84, h: 100, knock: 0.35, aggro: 900, range: 140, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['boomerang','lure','summon','fanshot'], names: ['Ring Toss','Step Right Up','Napkins, Fly!','Confetti Blast'], calls: 'napkin', shot: 'ring'} },
  m7c: { name: 'Spatula Sheriff', brain: 'nemesis', art: 'mob-m7c', hp: 215, atk: 16, speed: 80, w: 84, h: 100, knock: 0.35, aggro: 900, range: 140, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['slash','skewer','charge','roar'], names: ['Flip Slash','Spatula Jab','Showdown Charge','This Grill Aint Big Enough']} },
  m7d: { name: 'Marshmallow Mammoth', brain: 'nemesis', art: 'mob-m7d', hp: 250, atk: 16, speed: 65, w: 84, h: 100, knock: 0.35, aggro: 900, range: 140, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['leap','haymaker','puddle','roar'], names: ['Fluff Stomp','Tusk Bash','Gooey Melt','Trumpet!'], puddle: 'slow'} },
  m7e: { name: 'Sauce Bandit', brain: 'nemesis', art: 'mob-m7e', hp: 215, atk: 16, speed: 80, w: 84, h: 100, knock: 0.35, aggro: 900, range: 300, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['fanshot','puddle','zip','trap'], names: ['Sauce Spray','Smoky Puddle','Getaway Dash','Sauce Traps'], puddle: 'burn', shot: 'marinade'} },
  m8c: { name: 'Watering Can Wizard', brain: 'nemesis', art: 'mob-m8c', hp: 215, atk: 16, speed: 80, w: 84, h: 100, knock: 0.35, aggro: 900, range: 300, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['drip','slimesurge','lob','summon'], names: ['Sprinkle','Flood!','Seed Bomb','Grow, Snails!'], calls: 'snail'} },
  m8d: { name: 'Hedge Trimmer Beetle', brain: 'nemesis', art: 'mob-m8d', hp: 215, atk: 16, speed: 80, w: 84, h: 100, knock: 0.35, aggro: 900, range: 140, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['swipe','charge','rootspike','roar'], names: ['Snip Snip','Shear Charge','Root Snare','Buzz Off!']} },
  m8e: { name: 'Pumpkin Scarecrow', brain: 'nemesis', art: 'mob-m8e', hp: 215, atk: 16, speed: 80, w: 84, h: 100, knock: 0.35, aggro: 900, range: 300, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['summon','stingers','slash','vanish'], names: ['Caterpillar Crew','Straw Jabs','Scythe Swipe','Scared You!'], calls: 'caterpillar'} },
  m9c: { name: 'Cash Register Golem', brain: 'nemesis', art: 'mob-m9c', hp: 250, atk: 16, speed: 65, w: 84, h: 100, knock: 0.35, aggro: 900, range: 140, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['haymaker','fanshot','shell','roar'], names: ['Ka-Ching Punch','Coin Spray','Drawer Guard','No Refunds!'], shot: 'ring'} },
  m9d: { name: 'Mop Bucket Mage', brain: 'nemesis', art: 'mob-m9d', hp: 215, atk: 16, speed: 80, w: 84, h: 100, knock: 0.35, aggro: 900, range: 140, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['slimesurge','puddle','swipe','drip'], names: ['Mop Wave','Wet Floor!','Mop Swipe','Bucket Drip'], puddle: 'slick'} },
  m9e: { name: 'Shelf Stacker Bot', brain: 'nemesis', art: 'mob-m9e', hp: 205, atk: 15, speed: 75, w: 84, h: 100, knock: 0.35, aggro: 900, range: 140, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['charge','lob','trap','summon'], names: ['Forklift Charge','Can Lob','Price Tags','Boxes, Assemble!'], calls: 'boxbot'} },
  m10c: { name: 'Banquet Butler', brain: 'nemesis', art: 'mob-m10c', hp: 215, atk: 16, speed: 80, w: 84, h: 100, knock: 0.35, aggro: 900, range: 300, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['lob','summon','slash','vanish'], names: ['Tray Toss','Dinner Guests!','Carving Slash','Excuse Me'], calls: 'cherrysoldier'} },
  m10d: { name: 'Trifle Titan', brain: 'nemesis', art: 'mob-m10d', hp: 250, atk: 16, speed: 65, w: 84, h: 100, knock: 0.35, aggro: 900, range: 140, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['haymaker','leap','puddle','roar'], names: ['Custard Punch','Layer Drop','Jelly Slick','Wobble Roar'], puddle: 'slow'} },
  m10e: { name: 'Fondue Fiend', brain: 'nemesis', art: 'mob-m10e', hp: 215, atk: 16, speed: 80, w: 84, h: 100, knock: 0.35, aggro: 900, range: 300, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['heatwave','drip','puddle','fanshot'], names: ['Melt Wave','Cheese Drip','Molten Pool','Cheese Spit'], puddle: 'burn', shot: 'heat'} },
  // Kings: giant crowned versions of a world's monsters (same art, drawn bigger with a crown), fighting like minibosses
  kbun: { name: 'King Moldy Bun', brain: 'nemesis', art: 'mob-bun', hp: 240, atk: 16, speed: 60, w: 85, h: 92, knock: 0.35, aggro: 900, range: 140, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true, king: true,
    nem: {species: -1, moves: ['haymaker','summon','leap','roar'], names: ['Crusty Punch','Rise, Buns!','Loaf Drop','Mouldy Roar'], calls: 'bun'} },
  kworm: { name: 'King Sour Worm', brain: 'nemesis', art: 'mob-worm', hp: 210, atk: 16, speed: 80, w: 78, h: 92, knock: 0.35, aggro: 900, range: 140, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true, king: true,
    nem: {species: -1, moves: ['boomhop','fanshot','slash','puddle'], names: ['Royal Wriggle','Sour Spray','Tail Whip','Sour Slick'], shot: 'acid', puddle: 'slow'} },
  kpepper: { name: 'King Pepper Grunt', brain: 'nemesis', art: 'mob-pepper', hp: 210, atk: 16, speed: 70, w: 68, h: 116, knock: 0.35, aggro: 900, range: 300, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true, king: true,
    nem: {species: -1, moves: ['fanshot','heatwave','lob','slash'], names: ['Seed Volley','Chilli Heat','Pepper Bomb','Stem Swipe'], shot: 'heat'} },
  kpea: { name: 'King Frost Pea', brain: 'nemesis', art: 'mob-pea', hp: 210, atk: 16, speed: 65, w: 75, h: 100, knock: 0.35, aggro: 900, range: 300, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true, king: true,
    nem: {species: -1, moves: ['fanshot','rain','slash','summon'], names: ['Pea Barrage','Hail of Peas','Pod Slap','Pea Pals'], shot: 'icicle', calls: 'pea'} },
  kmilk: { name: 'King Milk Carton Rammer', brain: 'nemesis', art: 'mob-milk', hp: 240, atk: 16, speed: 60, w: 105, h: 120, knock: 0.35, aggro: 900, range: 140, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true, king: true,
    nem: {species: -1, moves: ['charge','leap','puddle','roar'], names: ['Carton Charge','Carton Drop','Spilt Milk','Moo!'], puddle: 'slick'} },
  kcarrot: { name: 'King Carrot Sniper', brain: 'nemesis', art: 'mob-carrot', hp: 210, atk: 16, speed: 60, w: 57, h: 120, knock: 0.35, aggro: 900, range: 140, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true, king: true,
    nem: {species: -1, moves: ['skewer','fanshot','rootspike','slash'], names: ['Carrot Lance','Shred Shot','Root Spikes','Top Swipe'], shot: 'spike'} },
  kbacon: { name: 'King Sizzle Bacon', brain: 'nemesis', art: 'mob-bacon', hp: 240, atk: 16, speed: 100, w: 117, h: 92, knock: 0.35, aggro: 900, range: 140, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true, king: true,
    nem: {species: -1, moves: ['charge','heatwave','slash','puddle'], names: ['Sizzle Rush','Grease Heat','Rasher Whip','Hot Grease'], puddle: 'burn', shot: 'heat'} },
  kpopcorn: { name: 'King Popcorn Popper', brain: 'nemesis', art: 'mob-popcorn', hp: 210, atk: 16, speed: 90, w: 78, h: 92, knock: 0.35, aggro: 900, range: 140, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true, king: true,
    nem: {species: -1, moves: ['boomhop','fanshot','leap','spin'], names: ['Pop Hop','Kernel Burst','Big Pop','Butter Spin'], shot: 'crumb'} },
  kkettle: { name: 'King Kettle Turret', brain: 'nemesis', art: 'mob-kettle', hp: 210, atk: 16, speed: 60, w: 92, h: 104, knock: 0.35, aggro: 900, range: 300, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true, king: true,
    nem: {species: -1, moves: ['heatwave','lob','drip','roar'], names: ['Steam Blast','Boiling Lob','Scald Drip','Whistle!'], shot: 'heat'} },
  kcheerio: { name: 'King Cheerio Blob', brain: 'nemesis', art: 'mob-cheerio', hp: 210, atk: 16, speed: 70, w: 99, h: 104, knock: 0.35, aggro: 900, range: 140, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true, king: true,
    nem: {species: -1, moves: ['boomhop','summon','charge','spin'], names: ['Ring Bounce','Cereal Squad','Ring Roll','Spin Cycle'], calls: 'cheerio'} },
  knoodle: { name: 'King Noodle Lurker', brain: 'nemesis', art: 'mob-noodle', hp: 210, atk: 16, speed: 100, w: 95, h: 100, knock: 0.35, aggro: 900, range: 140, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true, king: true,
    nem: {species: -1, moves: ['yank','slash','leap','burrow'], names: ['Noodle Lasso','Spaghetti Whip','Pasta Pounce','Down the Pot']} },
  kraisin: { name: 'King Raisin Sniper', brain: 'nemesis', art: 'mob-raisin', hp: 210, atk: 16, speed: 60, w: 65, h: 92, knock: 0.35, aggro: 900, range: 300, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true, king: true,
    nem: {species: -1, moves: ['fanshot','trap','lob','vanish'], names: ['Raisin Volley','Sticky Traps','Prune Bomb','Shrivel Away'], shot: 'crumb'} },
  kplate: { name: 'King Crusty Plate Knight', brain: 'nemesis', art: 'mob-plate', hp: 240, atk: 16, speed: 60, w: 89, h: 120, knock: 0.35, aggro: 900, range: 140, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true, king: true,
    nem: {species: -1, moves: ['shell','slash','charge','roar'], names: ['China Guard','Rim Slash','Plate Rush','Smash!']} },
  kmug: { name: 'King Mouldy Mug', brain: 'nemesis', art: 'mob-mug', hp: 210, atk: 16, speed: 60, w: 75, h: 100, knock: 0.35, aggro: 900, range: 300, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true, king: true,
    nem: {species: -1, moves: ['drip','fanshot','lob','puddle'], names: ['Cold Coffee','Mug Splash','Mug Lob','Coffee Puddle'], shot: 'acid', puddle: 'slow'} },
  kglove: { name: 'King Grabby Glove', brain: 'nemesis', art: 'mob-glove', hp: 210, atk: 16, speed: 70, w: 95, h: 108, knock: 0.35, aggro: 900, range: 140, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true, king: true,
    nem: {species: -1, moves: ['yank','haymaker','swipe','leap'], names: ['Rubber Grab','Big Slap','Finger Flick','Palm Slam']} },
  kfork: { name: 'King Fork Soldier', brain: 'nemesis', art: 'mob-fork', hp: 210, atk: 16, speed: 65, w: 58, h: 120, knock: 0.35, aggro: 900, range: 140, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true, king: true,
    nem: {species: -1, moves: ['skewer','stingers','charge','roar'], names: ['Royal Prong','Four Pokes','Fork Charge','Dinner Time!']} },
  kcandle: { name: 'King Candle Imp', brain: 'nemesis', art: 'mob-candle', hp: 210, atk: 16, speed: 60, w: 68, h: 108, knock: 0.35, aggro: 900, range: 300, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true, king: true,
    nem: {species: -1, moves: ['heatwave','drip','fanshot','vanish'], names: ['Flame Burst','Hot Wax','Ember Spray','Snuffed Out'], shot: 'heat'} },
  kteapot: { name: 'King Teapot Nanny', brain: 'nemesis', art: 'mob-teapot', hp: 210, atk: 16, speed: 60, w: 85, h: 108, knock: 0.35, aggro: 900, range: 300, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true, king: true,
    nem: {species: -1, moves: ['lob','summon','heatwave','drip'], names: ['Sugar Lob','Tea Party','Steam Pour','Spill'], calls: 'teacake', shot: 'heat'} },
  kbeetle: { name: 'King Kebab Beetle', brain: 'nemesis', art: 'mob-beetle', hp: 240, atk: 16, speed: 70, w: 109, h: 92, knock: 0.35, aggro: 900, range: 140, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true, king: true,
    nem: {species: -1, moves: ['charge','skewer','shell','leap'], names: ['Shell Rush','Horn Skewer','Shell Up','Beetle Drop']} },
  kketchup: { name: 'King Ketchup Squirter', brain: 'nemesis', art: 'mob-ketchup', hp: 210, atk: 16, speed: 60, w: 65, h: 108, knock: 0.35, aggro: 900, range: 300, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true, king: true,
    nem: {species: -1, moves: ['fanshot','puddle','lob','zip'], names: ['Ketchup Spray','Sauce Slick','Splat Lob','Squeeze Dash'], shot: 'marinade', puddle: 'slick'} },
  kcorn: { name: 'King Corn Cob Cannon', brain: 'nemesis', art: 'mob-corn', hp: 210, atk: 16, speed: 60, w: 85, h: 120, knock: 0.35, aggro: 900, range: 300, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true, king: true,
    nem: {species: -1, moves: ['fanshot','lob','rain','boomhop'], names: ['Kernel Barrage','Cob Mortar','Popcorn Rain','Husk Hop'], shot: 'crumb'} },
  ksnail: { name: 'King Lettuce Snail', brain: 'nemesis', art: 'mob-snail', hp: 240, atk: 16, speed: 60, w: 99, h: 104, knock: 0.35, aggro: 900, range: 140, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true, king: true,
    nem: {species: -1, moves: ['shell','slimesurge','puddle','summon'], names: ['Shell Guard','Slime Wave','Slime Trail','Garden Friends'], calls: 'snail', trail: true, puddle: 'slow'} },
  ktomato: { name: 'King Tomato Lobber', brain: 'nemesis', art: 'mob-tomato', hp: 210, atk: 16, speed: 60, w: 88, h: 108, knock: 0.35, aggro: 900, range: 300, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true, king: true,
    nem: {species: -1, moves: ['lob','leap','puddle','fanshot'], names: ['Tomato Mortar','Squash Drop','Pulp Puddle','Seed Spit'], puddle: 'slow', shot: 'spike'} },
  kradish: { name: 'King Radish Bomber', brain: 'nemesis', art: 'mob-radish', hp: 210, atk: 16, speed: 100, w: 65, h: 92, knock: 0.35, aggro: 900, range: 300, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true, king: true,
    nem: {species: -1, moves: ['rootspike','burrow','slash','roar'], names: ['Root Spikes','Dig Down','Leaf Slap','Radical Roar']} },
  ktrolley: { name: 'King Trolley Rammer', brain: 'nemesis', art: 'mob-trolley', hp: 240, atk: 16, speed: 70, w: 112, h: 112, knock: 0.35, aggro: 900, range: 140, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true, king: true,
    nem: {species: -1, moves: ['charge','boomhop','summon','haymaker'], names: ['Runaway Rush','Wheelie Hop','Bag Brigade','Handle Bash'], calls: 'bag'} },
  kbanana: { name: 'King Bruised Banana Bunch', brain: 'nemesis', art: 'mob-banana', hp: 210, atk: 16, speed: 95, w: 85, h: 92, knock: 0.35, aggro: 900, range: 300, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true, king: true,
    nem: {species: -1, moves: ['puddle','boomhop','spin','fanshot'], names: ['Banana Peels','Bunch Bounce','Peel Spin','Bruise Spray'], puddle: 'slick', shot: 'crumb'} },
  kcan2: { name: 'King Dented Can Turret', brain: 'nemesis', art: 'mob-can2', hp: 240, atk: 16, speed: 60, w: 95, h: 96, knock: 0.35, aggro: 900, range: 140, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true, king: true,
    nem: {species: -1, moves: ['shell','charge','haymaker','lob'], names: ['Tin Guard','Can Roll','Dent Punch','Lid Toss'], shot: 'ring'} },
  kcherrysoldier: { name: 'King Candied Cherry Soldier', brain: 'nemesis', art: 'mob-cherrysoldier', hp: 210, atk: 16, speed: 100, w: 74, h: 92, knock: 0.35, aggro: 900, range: 140, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true, king: true,
    nem: {species: -1, moves: ['skewer','summon','charge','stingers'], names: ['Cocktail Stick','Cherry Battalion','Glace Charge','Stick Flurry'], calls: 'cherrysoldier'} },
  kpudding: { name: 'King Pudding Cup', brain: 'nemesis', art: 'mob-pudding', hp: 210, atk: 16, speed: 100, w: 74, h: 92, knock: 0.35, aggro: 900, range: 140, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true, king: true,
    nem: {species: -1, moves: ['boomhop','drip','leap','puddle'], names: ['Wobble Hop','Choc Drip','Spoon Dive','Pudding Slick'], puddle: 'slow'} },
  kcracker2: { name: 'King Party Cracker Bomber', brain: 'nemesis', art: 'mob-cracker2', hp: 240, atk: 16, speed: 100, w: 65, h: 92, knock: 0.35, aggro: 900, range: 140, windup: 0.7, patrol: 60, xp: 40, dropChance: 1, armor: true, mini: true, king: true,
    nem: {species: -1, moves: ['charge','lob','fanshot','roar'], names: ['Fuse Rush','Snap Bomb','Confetti Burst','BANG!'], shot: 'spark'} },
  xegg: { name: 'Rotten Egg', brain: 'nemesis', art: 'mob-egg', hp: 200, atk: 16, speed: 60, w: 70, h: 78, knock: 0.4, aggro: 900, range: 120, windup: 0.75, patrol: 60, xp: 34, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['haymaker','puddle','leap','roar'], names: ['Yolk Punch','Stink Puddle','Belly Flop','Rotten Roar'], puddle: 'poison'} },
  xpickle: { name: 'Pickle Knight', brain: 'nemesis', art: 'mob-pickle', hp: 190, atk: 15, speed: 70, w: 50, h: 82, knock: 0.4, aggro: 900, range: 120, windup: 0.75, patrol: 60, xp: 34, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['slash','skewer','charge','shell'], names: ['Brine Slash','Toothpick Skewer','Pickle Charge','Jar Guard']} },
  xmeatball: { name: 'Meatball Brute', brain: 'nemesis', art: 'mob-meatball', hp: 210, atk: 16, speed: 65, w: 72, h: 76, knock: 0.4, aggro: 900, range: 120, windup: 0.75, patrol: 60, xp: 34, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['charge','leap','haymaker','puddle'], names: ['Meatball Roll','Big Bounce','Saucy Punch','Sauce Spill'], puddle: 'burn'} },
  xcan: { name: 'Can Crusher', brain: 'nemesis', art: 'mob-can', hp: 110, atk: 12, speed: 70, w: 52, h: 60, knock: 0.4, aggro: 900, range: 120, windup: 0.75, patrol: 60, xp: 34, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['charge','shell','haymaker','boomhop'], names: ['Can Ram','Tin Shell','Crush','Hop Stomp']} },
  xscrub: { name: 'Scrub Brute', brain: 'nemesis', art: 'mob-scrub', hp: 215, atk: 16, speed: 65, w: 72, h: 76, knock: 0.4, aggro: 900, range: 120, windup: 0.75, patrol: 60, xp: 34, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['swipe','slimesurge','haymaker','puddle'], names: ['Scour Swipe','Suds Surge','Steel Wool Punch','Soap Slick'], puddle: 'slick'} },
  xroast: { name: 'Roast Brute', brain: 'nemesis', art: 'mob-roast', hp: 220, atk: 16, speed: 65, w: 76, h: 74, knock: 0.4, aggro: 900, range: 120, windup: 0.75, patrol: 60, xp: 34, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['haymaker','heatwave','leap','roar'], names: ['Roast Punch','Oven Heat','Gravy Drop','Carving Roar']} },
  xpatty: { name: 'Burger Brute', brain: 'nemesis', art: 'mob-patty', hp: 225, atk: 16, speed: 65, w: 76, h: 78, knock: 0.4, aggro: 900, range: 120, windup: 0.75, patrol: 60, xp: 34, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['charge','fanshot','haymaker','puddle'], names: ['Patty Rush','Sesame Spray','Bun Smash','Grease Spill'], puddle: 'burn', shot: 'crumb'} },
  xpumpkin: { name: 'Pumpkin Brute', brain: 'nemesis', art: 'mob-pumpkin', hp: 230, atk: 16, speed: 63, w: 80, h: 80, knock: 0.4, aggro: 900, range: 120, windup: 0.75, patrol: 60, xp: 34, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['boomhop','rootspike','haymaker','summon'], names: ['Gourd Hop','Vine Spikes','Squash!','Seedlings'], calls: 'ladybug'} },
  xmelon: { name: 'Watermelon Brute', brain: 'nemesis', art: 'mob-melon', hp: 235, atk: 16, speed: 63, w: 82, h: 80, knock: 0.4, aggro: 900, range: 120, windup: 0.75, patrol: 60, xp: 34, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['charge','fanshot','leap','haymaker'], names: ['Melon Roll','Seed Spit','Big Splash','Rind Punch'], shot: 'spike'} },
  xfruitknight: { name: 'Fruitcake Knight', brain: 'nemesis', art: 'mob-fruitknight', hp: 240, atk: 16, speed: 63, w: 78, h: 84, knock: 0.4, aggro: 900, range: 120, windup: 0.75, patrol: 60, xp: 34, dropChance: 1, armor: true, mini: true,
    nem: {species: -1, moves: ['slash','skewer','charge','roar'], names: ['Candied Slash','Fork Lance','Knight Charge','Rally']} },
  // ----- more monsters (2 per world, early stages): each has its own drop (art: scripts/mobs3-jobs.mjs) -----
  jamhop: { name: 'Jam Blob', brain: 'hopper', art: 'mob-jamhop', hp: 50, atk: 10, speed: 80, w: 44, h: 44, knock: 1.1, aggro: 300, range: 190, windup: 0.45, patrol: 140, xp: 10, dropChance: 0.3 },
  salt: { name: 'Salt Shaker Gunner', brain: 'ranged', art: 'mob-salt', hp: 55, atk: 9, speed: 70, w: 40, h: 58, knock: 1, aggro: 340, range: 300, windup: 0.6, patrol: 100, xp: 11, dropChance: 0.35 },
  cheesemouse: { name: 'Cheese Cube Critter', brain: 'hopper', art: 'mob-cheesemouse', hp: 45, atk: 11, speed: 90, w: 42, h: 42, knock: 1.2, aggro: 320, range: 210, windup: 0.35, patrol: 150, xp: 11, dropChance: 0.3 },
  icepop: { name: 'Melty Ice Pop', brain: 'walker', art: 'mob-icepop', hp: 85, atk: 9, speed: 55, w: 56, h: 50, knock: 0.9, aggro: 260, range: 64, windup: 0.6, patrol: 120, xp: 10, dropChance: 0.3 },
  crumbcube: { name: 'Burnt Crouton', brain: 'hopper', art: 'mob-crumbcube', hp: 45, atk: 11, speed: 90, w: 42, h: 42, knock: 1.2, aggro: 320, range: 210, windup: 0.35, patrol: 150, xp: 11, dropChance: 0.3 },
  mitt: { name: 'Oven Mitt Grabber', brain: 'charger', art: 'mob-mitt', hp: 120, atk: 15, speed: 70, w: 64, h: 46, knock: 0.6, aggro: 400, range: 380, windup: 0.7, patrol: 110, xp: 18, dropChance: 0.4 },
  bee: { name: 'Honey Bee', brain: 'flyer', art: 'mob-bee', hp: 45, atk: 10, speed: 120, w: 46, h: 40, knock: 1.2, aggro: 340, range: 220, windup: 0.5, patrol: 160, xp: 12, dropChance: 0.3 },
  cracker: { name: 'Cracker Crawler', brain: 'walker', art: 'mob-cracker', hp: 110, atk: 12, speed: 55, w: 52, h: 60, knock: 0.6, aggro: 280, range: 70, windup: 0.6, patrol: 100, xp: 18, dropChance: 0.4, shield: true },
  duck: { name: 'Rubber Ducky', brain: 'ranged', art: 'mob-duck', hp: 60, atk: 8, speed: 60, w: 44, h: 50, knock: 1, aggro: 360, range: 320, windup: 0.55, patrol: 100, xp: 12, dropChance: 0.3 },
  straw: { name: 'Straw Snake', brain: 'walker', art: 'mob-straw', hp: 125, atk: 13, speed: 55, w: 54, h: 62, knock: 0.6, aggro: 280, range: 70, windup: 0.6, patrol: 100, xp: 19, dropChance: 0.4, shield: true },
  teacake: { name: 'Tea Cake Hopper', brain: 'hopper', art: 'mob-teacake', hp: 45, atk: 11, speed: 90, w: 42, h: 42, knock: 1.2, aggro: 320, range: 210, windup: 0.35, patrol: 150, xp: 11, dropChance: 0.3 },
  ladle: { name: 'Ladle Lancer', brain: 'charger', art: 'mob-ladle', hp: 110, atk: 11, speed: 65, w: 66, h: 50, knock: 0.6, aggro: 400, range: 380, windup: 0.7, patrol: 110, xp: 18, dropChance: 0.4 },
  skewer: { name: 'Veggie Skewer Soldier', brain: 'walker', art: 'mob-skewer', hp: 105, atk: 12, speed: 65, w: 40, h: 70, knock: 0.8, aggro: 300, range: 72, windup: 0.5, patrol: 110, xp: 17, dropChance: 0.35 },
  firefly: { name: 'Ember Firefly', brain: 'flyer', art: 'mob-firefly', hp: 40, atk: 7, speed: 125, w: 44, h: 42, knock: 1.1, aggro: 340, range: 230, windup: 0.5, patrol: 160, xp: 13, dropChance: 0.3 },
  caterpillar: { name: 'Leaf Caterpillar', brain: 'walker', art: 'mob-caterpillar', hp: 130, atk: 12, speed: 45, w: 58, h: 52, knock: 0.6, aggro: 280, range: 70, windup: 0.65, patrol: 80, xp: 19, dropChance: 0.4, shield: true },
  toadstool: { name: 'Toadstool Hopper', brain: 'hopper', art: 'mob-toadstool', hp: 62, atk: 9, speed: 95, w: 50, h: 46, knock: 1.1, aggro: 320, range: 210, windup: 0.4, patrol: 150, xp: 14, dropChance: 0.3 },
  coupon: { name: 'Coupon Ghost', brain: 'flyer', art: 'mob-coupon', hp: 40, atk: 7, speed: 120, w: 44, h: 46, knock: 1.1, aggro: 340, range: 230, windup: 0.5, patrol: 160, xp: 13, dropChance: 0.3 },
  boxbot: { name: 'Cardboard Box Walker', brain: 'walker', art: 'mob-boxbot', hp: 105, atk: 12, speed: 65, w: 40, h: 70, knock: 0.8, aggro: 300, range: 72, windup: 0.5, patrol: 110, xp: 17, dropChance: 0.35 },
  pudding: { name: 'Pudding Cup', brain: 'hopper', art: 'mob-pudding', hp: 34, atk: 8, speed: 105, w: 32, h: 34, knock: 1.3, aggro: 340, range: 190, windup: 0.35, patrol: 120, xp: 5, dropChance: 0.08 },
  cracker2: { name: 'Party Cracker Bomber', brain: 'bomber', art: 'mob-cracker2', hp: 40, atk: 21, speed: 150, w: 38, h: 46, knock: 1.2, aggro: 340, range: 60, windup: 0.7, patrol: 140, xp: 12, dropChance: 0.25 },
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
/** World bosses fight in learnable strings: a close or far string (by where you stand), then they're tired for a moment.
 *  Phase 2 at half HP, phase 3 (with a new move) at a quarter. The same for every kaiju. */
export const BOSS_PATTERNS: Partial<Record<MobKind, { near: string[][]; far: string[][] }[]>> = {
  toast: [
    { near: [['slash', 'slash'], ['slash', 'leap']], far: [['charge'], ['leap']] },
    { near: [['slash', 'slash', 'leap'], ['slash', 'charge']], far: [['charge', 'slash'], ['leap', 'leap']] },
    { near: [['slash', 'heatwave', 'slash'], ['leap', 'heatwave']], far: [['heatwave', 'charge'], ['charge', 'leap', 'slash']] },
  ],
  golem: [
    { near: [['slash', 'slash'], ['slash', 'rain']], far: [['rain'], ['charge']] },
    { near: [['slash', 'leap', 'slash'], ['rain', 'slash']], far: [['charge', 'rain'], ['leap', 'leap']] },
    { near: [['roar', 'slash', 'slash'], ['roar', 'leap']], far: [['rain', 'rain', 'charge'], ['roar', 'rain']] },
  ],
  dragon: [
    { near: [['slash', 'breath'], ['slash', 'slash']], far: [['breath'], ['charge']] },
    { near: [['slash', 'breath', 'leap'], ['slash', 'charge']], far: [['rain', 'breath'], ['charge', 'leap']] },
    { near: [['breath', 'heatwave', 'slash'], ['leap', 'breath']], far: [['heatwave', 'rain', 'charge'], ['breath', 'breath']] },
  ],
  // Old Fruitcake: he has every lieutenant's trick (lance charge, sprout summons, borrowed breath, lid boomerangs) and his own candied-fruit storm
  fruitcake: [
    { near: [['slash', 'slash'], ['slash', 'charge']], far: [['rain'], ['summon']] },
    { near: [['slash', 'puddle', 'slash'], ['leap', 'breath']], far: [['boomerang', 'rain'], ['summon', 'charge']] },
    { near: [['roar', 'breath', 'slash'], ['leap', 'heatwave', 'slash']], far: [['rain', 'boomerang', 'charge'], ['summon', 'fanshot', 'rain']] },
  ],
  // the Tupperwraith: lid frisbees, murky puddles, lost lids, a cold wail
  tupper: [
    { near: [['slash', 'slash'], ['slash', 'boomerang']], far: [['boomerang'], ['summon']] },
    { near: [['slash', 'puddle', 'slash'], ['leap', 'boomerang']], far: [['rain', 'boomerang'], ['summon', 'charge']] },
    { near: [['roar', 'slash', 'puddle'], ['leap', 'boomerang', 'slash']], far: [['rain', 'boomerang', 'charge'], ['summon', 'rain', 'boomerang']] },
  ],
  // the Mystery Meatloaf: nobody knows what's in him, so he borrows everybody's moves
  meatloaf: [
    { near: [['slash', 'breath'], ['slash', 'puddle']], far: [['fanshot'], ['summon']] },
    { near: [['slash', 'heatwave', 'slash'], ['leap', 'breath']], far: [['rain', 'charge'], ['summon', 'fanshot']] },
    { near: [['roar', 'breath', 'slash'], ['leap', 'puddle', 'heatwave']], far: [['rain', 'fanshot', 'charge'], ['summon', 'leap', 'rain']] },
  ],
  // Baron Brussels: stink puddles, sprout soldiers, charcoal rain, a big bellyflop
  brussels: [
    { near: [['slash', 'slash'], ['slash', 'puddle']], far: [['rain'], ['summon']] },
    { near: [['slash', 'roar', 'slash'], ['leap', 'puddle']], far: [['charge', 'rain'], ['summon', 'leap']] },
    { near: [['roar', 'slash', 'puddle'], ['leap', 'heatwave']], far: [['rain', 'puddle', 'charge'], ['summon', 'heatwave', 'leap']] },
  ],
  // Sir Stale: lance charges, crumb volleys, crouton squires, a crust shockwave when he's angry
  stale: [
    { near: [['slash', 'slash'], ['slash', 'charge']], far: [['charge'], ['fanshot']] },
    { near: [['slash', 'rootspike', 'slash'], ['leap', 'slash']], far: [['fanshot', 'charge'], ['summon', 'charge']] },
    { near: [['roar', 'slash', 'slash'], ['leap', 'rootspike']], far: [['charge', 'fanshot', 'charge'], ['summon', 'leap', 'fanshot']] },
  ],
  // the final boss: spore rain, Sporelings, mould tendrils along the floor, mould puddles
  moldking: [
    { near: [['slash', 'slash'], ['slash', 'rootspike']], far: [['rain'], ['summon']] },
    { near: [['slash', 'puddle', 'slash'], ['leap', 'slash']], far: [['rootspike', 'rain'], ['summon', 'charge']] },
    { near: [['roar', 'slash', 'slash'], ['leap', 'rootspike']], far: [['rain', 'puddle', 'charge'], ['summon', 'rootspike', 'rain']] },
  ],
  jar: [
    { near: [['slash', 'slash'], ['leap']], far: [['rain'], ['charge']] },
    { near: [['slash', 'rain', 'slash'], ['leap', 'slash']], far: [['charge', 'rain'], ['fanshot', 'charge']] },
    { near: [['fanshot', 'slash', 'slash'], ['leap', 'fanshot']], far: [['rain', 'fanshot', 'charge'], ['charge', 'leap']] },
  ],
};
/** Boss armour: softens hits until broken (heavy hits break it fastest), then the boss is weak for a while. */
export const BOSS_ARMOR = { take: 0.7, pool: 0.1, heavy: 2.5, weak: 5, weakMul: 1.5, tired: 1.6, tiredMul: 1.25 };

/** Attacks that glow red: they can't be interrupted, only dodged. */
export const DANGER_MOVES = new Set(['charge', 'leap', 'rush', 'brute', 'skewer', 'finslide', 'haymaker', 'boomhop']);

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
export const TUNE = { hp: 2.5, atk: 1.5, bossHp: 1.35, bossAtk: 0.6, windup: 0.85, treeRamp: 0.0055 };
/** Monsters past level 20 grow a little extra per level, in step with the skill-tree points a kaiju has by then. */
const ramp = (lv: number) => 1 + TUNE.treeRamp * Math.max(0, lv - 20);
export function mobHp(kind: MobKind, lv: number): number { return Math.round(MOBS[kind].hp * TUNE.hp * (MOBS[kind].brain === 'boss' ? TUNE.bossHp : 1) * (1 + 0.32 * (lv - 1)) * ramp(lv)); }
/** Act 2 monsters (past Lv 55) hit harder still: your kit is complete by then, so they keep you reaching for jams (world
 *  bosses only a little: they're already a long fight at the end of a long stage). */
const lateHit = (kind: MobKind, lv: number) => 1 + (MOBS[kind].brain === 'boss' ? 0 : MOBS[kind].brain === 'nemesis' ? 0.006 : 0.009) * Math.max(0, lv - 55);
export function mobAtk(kind: MobKind, lv: number): number { return Math.round(MOBS[kind].atk * TUNE.atk * (1 + 0.2 * (lv - 1)) * ramp(lv) * lateHit(kind, lv)); }
export function mobXp(kind: MobKind, lv: number): number { return Math.round(MOBS[kind].xp * (1 + 0.3 * (lv - 1))); }
/** Box odds level for a monster level (see loot.ts) */
export function dropLevel(lv: number): number { return 1 + (lv - 1) / 4; }
/** Crumbs a monster drops. */
export function mobCrumbs(lv: number, brain: Brain): number { return Math.round((2 + lv * 0.8) * (brain === 'boss' ? 25 : brain === 'brute' ? 3 : 1)); }
