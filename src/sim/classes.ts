// The four launch heroes. Each kaiju is its own class: stats, a 3-hit combo, an air attack and one skill.
// Species numbers match Kitchen Kaiju (art kaiju-N).

export interface AttackDef {
  dur: number;      // seconds the move lasts
  hit: [number, number]; // active window (seconds from start)
  reach: number;    // hitbox width in front of the hero
  h: number;        // hitbox height (from feet up)
  dmg: number;      // multiplier of the hero's attack stat
  kx: number; ky: number; // knockback (ky < 0 = launch upward)
  lunge: number;    // forward speed during the move
  stun: number;     // hitstun on the target
}

export type Stat = 'str' | 'dex' | 'int' | 'vit';
export type Stats = Record<Stat, number>;

export interface HeroClass {
  species: number;
  name: string;
  role: string;
  hp: number; atk: number; speed: number; jump: number;
  /** Primary stats at level 1, and what each level adds automatically. */
  base: Stats; grow: Stats;
  /** Mothball floats: holding JUMP while falling glides. */
  glide?: boolean;
  combo: AttackDef[];
  air: AttackDef;
}

const A = (o: Partial<AttackDef>): AttackDef => ({ dur: 0.32, hit: [0.08, 0.18], reach: 62, h: 60, dmg: 1, kx: 140, ky: -60, lunge: 60, stun: 0.35, ...o });

export const CLASSES: HeroClass[] = [
  {
    species: 0, name: 'Gobzilla Jr.', role: 'Brawler: balanced all-rounder',
    hp: 132, atk: 10, speed: 230, jump: 700,
    base: { str: 6, dex: 5, int: 4, vit: 5 }, grow: { str: 2, dex: 1, int: 1, vit: 1 },
    combo: [A({}), A({ dmg: 1.1 }), A({ dur: 0.45, hit: [0.14, 0.26], reach: 76, dmg: 1.8, kx: 320, ky: -420, stun: 0.6, lunge: 140 })],
    air: A({ dur: 0.3, reach: 60, h: 70, dmg: 0.9, kx: 120, ky: -120 }),
  },
  {
    species: 10, name: 'Bluebeary', role: 'Tank: slow, heavy hits, huge HP',
    hp: 190, atk: 12, speed: 190, jump: 640,
    base: { str: 6, dex: 3, int: 3, vit: 8 }, grow: { str: 1, dex: 0, int: 1, vit: 3 },
    combo: [A({ dur: 0.4, hit: [0.12, 0.24], dmg: 1.2, reach: 66 }), A({ dur: 0.4, hit: [0.12, 0.24], dmg: 1.3 }), A({ dur: 0.6, hit: [0.22, 0.36], reach: 90, h: 80, dmg: 2.4, kx: 420, ky: -300, stun: 0.8, lunge: 40 })],
    air: A({ dur: 0.36, reach: 70, h: 80, dmg: 1.1, kx: 160, ky: 200 }),
  },
  {
    species: 11, name: 'Pizzaraptor', role: 'Slasher: fast, long combos',
    hp: 145, atk: 10, speed: 280, jump: 740,
    base: { str: 5, dex: 8, int: 3, vit: 4 }, grow: { str: 1, dex: 3, int: 0, vit: 2 },
    combo: [A({ dur: 0.24, hit: [0.05, 0.13] }), A({ dur: 0.24, hit: [0.05, 0.13], dmg: 1 }), A({ dur: 0.38, hit: [0.1, 0.22], reach: 84, dmg: 1.7, kx: 360, ky: -380, lunge: 220, stun: 0.55 })],
    air: A({ dur: 0.26, reach: 66, dmg: 1, kx: 100, ky: -160 }),
  },
  {
    species: 4, name: 'Mothball', role: 'Caster: ranged bolts, glides',
    hp: 108, atk: 11, speed: 220, jump: 680, glide: true,
    base: { str: 3, dex: 4, int: 9, vit: 4 }, grow: { str: 0, dex: 1, int: 3, vit: 2 },
    combo: [A({ reach: 100, dmg: 0.9, lunge: 0 }), A({ reach: 110, dmg: 1, lunge: 0 }), A({ dur: 0.45, hit: [0.15, 0.27], reach: 140, h: 80, dmg: 1.6, kx: 300, ky: -300, lunge: 0, stun: 0.6 })],
    air: A({ dur: 0.3, reach: 100, h: 80, dmg: 0.9, lunge: 0 }),
  },
  {
    species: 1, name: 'Squidgeon', role: 'Lasher: long tentacle reach, multi-hits',
    hp: 105, atk: 9, speed: 215, jump: 690,
    base: { str: 5, dex: 6, int: 6, vit: 4 }, grow: { str: 1, dex: 1, int: 2, vit: 1 },
    combo: [A({ reach: 90, dmg: 0.9 }), A({ reach: 96, dmg: 1 }), A({ dur: 0.46, hit: [0.14, 0.28], reach: 120, h: 80, dmg: 1.7, kx: 300, ky: -360, stun: 0.6, lunge: 60 })],
    air: A({ dur: 0.3, reach: 90, h: 80, dmg: 0.9, ky: -140 }),
  },
  {
    species: 2, name: 'Crabbage', role: 'Guardian: armoured claws, shields up',
    hp: 175, atk: 11, speed: 185, jump: 655,
    base: { str: 6, dex: 3, int: 2, vit: 8 }, grow: { str: 1, dex: 0, int: 1, vit: 3 },
    combo: [A({ dur: 0.36, hit: [0.1, 0.2], reach: 74, dmg: 1.1 }), A({ dur: 0.36, hit: [0.1, 0.2], reach: 74, dmg: 1.2 }), A({ dur: 0.55, hit: [0.2, 0.32], reach: 92, h: 70, dmg: 2.3, kx: 440, ky: -280, stun: 0.8, lunge: 50 })],
    air: A({ dur: 0.34, reach: 70, h: 70, dmg: 1.1, kx: 160, ky: 220 }),
  },
  {
    species: 5, name: 'Toastbat', role: 'Assassin: flies, air combos, crits',
    hp: 115, atk: 10, speed: 265, jump: 760, glide: true,
    base: { str: 5, dex: 8, int: 3, vit: 3 }, grow: { str: 1, dex: 3, int: 0, vit: 2 },
    combo: [A({ dur: 0.24, hit: [0.05, 0.13] }), A({ dur: 0.24, hit: [0.05, 0.13] }), A({ dur: 0.36, hit: [0.1, 0.2], reach: 80, dmg: 1.6, kx: 300, ky: -420, lunge: 200, stun: 0.55 })],
    air: A({ dur: 0.22, hit: [0.04, 0.14], reach: 70, h: 80, dmg: 1.15, kx: 90, ky: -200 }),
  },
  {
    species: 6, name: 'Dumplord', role: 'Healer: steam magic, heals itself',
    hp: 140, atk: 9, speed: 200, jump: 665,
    base: { str: 4, dex: 3, int: 8, vit: 6 }, grow: { str: 0, dex: 1, int: 3, vit: 2 },
    combo: [A({ reach: 80, dmg: 0.95 }), A({ reach: 84, dmg: 1 }), A({ dur: 0.48, hit: [0.16, 0.28], reach: 110, h: 80, dmg: 1.6, kx: 320, ky: -300, stun: 0.6, lunge: 30 })],
    air: A({ dur: 0.3, reach: 80, h: 80, dmg: 0.9 }),
  },
  {
    species: 7, name: 'Norigon', role: 'Dragon mage: wasabi breath, big area skills',
    hp: 115, atk: 10, speed: 220, jump: 690,
    base: { str: 4, dex: 4, int: 8, vit: 5 }, grow: { str: 0, dex: 1, int: 3, vit: 2 },
    combo: [A({ reach: 74, dmg: 0.95 }), A({ reach: 78, dmg: 1.05 }), A({ dur: 0.46, hit: [0.14, 0.28], reach: 110, h: 80, dmg: 1.7, kx: 320, ky: -340, stun: 0.6, lunge: 50 })],
    air: A({ dur: 0.3, reach: 70, h: 70, dmg: 0.95 }),
  },
  {
    species: 8, name: 'Chocomunch', role: 'Bruiser: huge fists, rushes in',
    hp: 165, atk: 13, speed: 195, jump: 650,
    base: { str: 8, dex: 3, int: 2, vit: 7 }, grow: { str: 2, dex: 0, int: 0, vit: 2 },
    combo: [A({ dur: 0.38, hit: [0.12, 0.22], reach: 70, dmg: 1.2 }), A({ dur: 0.38, hit: [0.12, 0.22], reach: 72, dmg: 1.3 }), A({ dur: 0.58, hit: [0.22, 0.34], reach: 90, h: 80, dmg: 2.5, kx: 460, ky: -320, stun: 0.8, lunge: 90 })],
    air: A({ dur: 0.36, reach: 72, h: 80, dmg: 1.2, kx: 160, ky: 240 }),
  },
  {
    species: 15, name: 'Hotchog', role: 'Spiky roller: tanky, rolls through crowds',
    hp: 150, atk: 11, speed: 240, jump: 680,
    base: { str: 6, dex: 5, int: 2, vit: 7 }, grow: { str: 1, dex: 1, int: 0, vit: 2 },
    combo: [A({ dur: 0.3, hit: [0.07, 0.16], reach: 64 }), A({ dur: 0.3, hit: [0.07, 0.16], reach: 64, dmg: 1.1 }), A({ dur: 0.45, hit: [0.12, 0.26], reach: 86, dmg: 1.9, kx: 380, ky: -300, lunge: 180, stun: 0.6 })],
    air: A({ dur: 0.3, reach: 64, h: 70, dmg: 1, kx: 120, ky: 160 }),
  },
  {
    species: 17, name: 'Pengwhip', role: 'Ice skater: fast slides, frosty ranged skills',
    hp: 135, atk: 10, speed: 265, jump: 720,
    base: { str: 4, dex: 7, int: 6, vit: 4 }, grow: { str: 1, dex: 2, int: 2, vit: 2 },
    combo: [A({ dur: 0.26, hit: [0.06, 0.14], reach: 66 }), A({ dur: 0.26, hit: [0.06, 0.14], reach: 70 }), A({ dur: 0.4, hit: [0.1, 0.24], reach: 96, dmg: 1.7, kx: 340, ky: -320, lunge: 200, stun: 0.55 })],
    air: A({ dur: 0.28, reach: 70, h: 70, dmg: 1 }),
  },
  {
    species: 13, name: 'Avocadrake', role: 'Guac guardian: bouncing pits, healing guac pools, wing gusts',
    hp: 138, atk: 11, speed: 238, jump: 700,
    base: { str: 5, dex: 3, int: 6, vit: 6 }, grow: { str: 1, dex: 0, int: 2, vit: 1 },
    combo: [A({ dur: 0.32, hit: [0.08, 0.18], reach: 66 }), A({ dur: 0.32, hit: [0.08, 0.18], reach: 70, dmg: 1.1 }), A({ dur: 0.5, hit: [0.16, 0.3], reach: 92, h: 80, dmg: 2.1, kx: 420, ky: -300, lunge: 80, stun: 0.6 })],
    air: A({ dur: 0.32, reach: 70, h: 72, dmg: 1.1, kx: 160, ky: 200 }),
  },
  {
    species: 19, name: 'Tacowl', role: 'Night flyer: salsa bombs from above, stunning screeches',
    hp: 122, atk: 10, speed: 255, jump: 760,
    base: { str: 4, dex: 7, int: 5, vit: 5 }, grow: { str: 1, dex: 2, int: 1, vit: 2 },
    combo: [A({ dur: 0.26, hit: [0.06, 0.14], reach: 64 }), A({ dur: 0.26, hit: [0.06, 0.14], reach: 68 }), A({ dur: 0.42, hit: [0.12, 0.24], reach: 88, dmg: 1.8, kx: 300, ky: -360, lunge: 140, stun: 0.55 })],
    air: A({ dur: 0.28, reach: 72, h: 76, dmg: 1.15, kx: 140, ky: 260 }),
  },
  {
    species: 9, name: 'Bubblegumbo', role: 'Gum tank: bubble traps, ricocheting gumballs, trumpet shockwaves',
    hp: 162, atk: 11, speed: 225, jump: 660,
    base: { str: 6, dex: 2, int: 4, vit: 8 }, grow: { str: 1, dex: 0, int: 1, vit: 3 },
    combo: [A({ dur: 0.36, hit: [0.1, 0.2], reach: 72 }), A({ dur: 0.36, hit: [0.1, 0.2], reach: 74, dmg: 1.15 }), A({ dur: 0.56, hit: [0.2, 0.34], reach: 96, h: 84, dmg: 2.3, kx: 460, ky: -320, lunge: 70, stun: 0.75 })],
    air: A({ dur: 0.36, reach: 72, h: 76, dmg: 1.15, kx: 160, ky: 240 }),
  },
  {
    species: 18, name: 'Velvaroo', role: 'Hopping boxer: triple hops, punch flurries, cupcake bombs',
    hp: 142, atk: 12, speed: 250, jump: 790,
    base: { str: 7, dex: 5, int: 2, vit: 6 }, grow: { str: 2, dex: 1, int: 0, vit: 2 },
    combo: [A({ dur: 0.24, hit: [0.05, 0.13], reach: 64 }), A({ dur: 0.24, hit: [0.05, 0.13], reach: 66 }), A({ dur: 0.42, hit: [0.12, 0.24], reach: 90, dmg: 2, kx: 420, ky: -380, lunge: 120, stun: 0.6 })],
    air: A({ dur: 0.28, reach: 70, h: 74, dmg: 1.15, kx: 160, ky: 300 }),
  },
  {
    species: 12, name: 'Sloba', role: 'Sleepy swinger: vine swings, power naps, slowing time',
    hp: 132, atk: 11, speed: 215, jump: 720,
    base: { str: 5, dex: 4, int: 6, vit: 6 }, grow: { str: 1, dex: 1, int: 1, vit: 2 },
    combo: [A({ dur: 0.36, hit: [0.1, 0.2], reach: 74 }), A({ dur: 0.36, hit: [0.1, 0.2], reach: 76, dmg: 1.1 }), A({ dur: 0.56, hit: [0.2, 0.34], reach: 98, h: 80, dmg: 2.2, kx: 420, ky: -300, lunge: 90, stun: 0.7 })],
    air: A({ dur: 0.34, reach: 76, h: 76, dmg: 1.15, kx: 150, ky: 220 }),
  },
  {
    species: 16, name: 'Minturtle', role: 'Chill wall: waffle walls, freezing scoops, choc-chip storms',
    hp: 168, atk: 10, speed: 205, jump: 640,
    base: { str: 5, dex: 2, int: 5, vit: 8 }, grow: { str: 1, dex: 0, int: 1, vit: 3 },
    combo: [A({ dur: 0.36, hit: [0.1, 0.2], reach: 68 }), A({ dur: 0.36, hit: [0.1, 0.2], reach: 70, dmg: 1.15 }), A({ dur: 0.56, hit: [0.2, 0.34], reach: 92, h: 76, dmg: 2.3, kx: 440, ky: -300, lunge: 60, stun: 0.8 })],
    air: A({ dur: 0.36, reach: 70, h: 70, dmg: 1.1, kx: 150, ky: 220 }),
  },
  {
    species: 3, name: 'Bloblin', role: 'Jiggly support: sticky splats, jelly clones, a wobble shield',
    hp: 150, atk: 10, speed: 230, jump: 760,
    base: { str: 4, dex: 4, int: 6, vit: 7 }, grow: { str: 1, dex: 1, int: 1, vit: 2 },
    combo: [A({ dur: 0.32, hit: [0.08, 0.18], reach: 66 }), A({ dur: 0.32, hit: [0.08, 0.18], reach: 68, dmg: 1.1 }), A({ dur: 0.5, hit: [0.16, 0.3], reach: 90, h: 80, dmg: 2.1, kx: 420, ky: -340, lunge: 80, stun: 0.7 })],
    air: A({ dur: 0.32, reach: 72, h: 76, dmg: 1.15, kx: 150, ky: 260 }),
  },
  {
    species: 14, name: 'Salmonster', role: 'River rusher: upstream leaps, tidal waves, salmon swarms',
    hp: 140, atk: 12, speed: 260, jump: 740,
    base: { str: 7, dex: 5, int: 3, vit: 5 }, grow: { str: 2, dex: 1, int: 0, vit: 2 },
    combo: [A({ dur: 0.28, hit: [0.06, 0.15], reach: 70 }), A({ dur: 0.28, hit: [0.06, 0.15], reach: 72, dmg: 1.1 }), A({ dur: 0.46, hit: [0.14, 0.28], reach: 94, dmg: 2.1, kx: 440, ky: -340, lunge: 130, stun: 0.6 })],
    air: A({ dur: 0.3, reach: 74, h: 74, dmg: 1.15, kx: 160, ky: 260 }),
  },
];

export function classOf(species: number): HeroClass {
  return CLASSES.find(c => c.species === species) ?? CLASSES[0];
}
