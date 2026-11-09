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

export type SkillKind = 'cone' | 'slam' | 'dash' | 'bolt';
export interface SkillDef { name: string; kind: SkillKind; cd: number; dur: number; dmg: number; reach: number; h: number; kx: number; ky: number }

export interface HeroClass {
  species: number;
  name: string;
  role: string;
  hp: number; atk: number; speed: number; jump: number;
  /** Mothball floats: holding JUMP while falling glides. */
  glide?: boolean;
  combo: AttackDef[];
  air: AttackDef;
  skill: SkillDef;
}

const A = (o: Partial<AttackDef>): AttackDef => ({ dur: 0.32, hit: [0.08, 0.18], reach: 62, h: 60, dmg: 1, kx: 140, ky: -60, lunge: 60, stun: 0.35, ...o });

export const CLASSES: HeroClass[] = [
  {
    species: 0, name: 'Gobzilla Jr.', role: 'Brawler: balanced all-rounder',
    hp: 120, atk: 10, speed: 230, jump: 700,
    combo: [A({}), A({ dmg: 1.1 }), A({ dur: 0.45, hit: [0.14, 0.26], reach: 76, dmg: 1.8, kx: 320, ky: -420, stun: 0.6, lunge: 140 })],
    air: A({ dur: 0.3, reach: 60, h: 70, dmg: 0.9, kx: 120, ky: -120 }),
    skill: { name: 'Seed Spray', kind: 'cone', cd: 3, dur: 0.45, dmg: 2.4, reach: 210, h: 90, kx: 380, ky: -200 },
  },
  {
    species: 10, name: 'Bluebeary', role: 'Tank: slow, heavy hits, huge HP',
    hp: 190, atk: 12, speed: 190, jump: 640,
    combo: [A({ dur: 0.4, hit: [0.12, 0.24], dmg: 1.2, reach: 66 }), A({ dur: 0.4, hit: [0.12, 0.24], dmg: 1.3 }), A({ dur: 0.6, hit: [0.22, 0.36], reach: 90, h: 80, dmg: 2.4, kx: 420, ky: -300, stun: 0.8, lunge: 40 })],
    air: A({ dur: 0.36, reach: 70, h: 80, dmg: 1.1, kx: 160, ky: 200 }),
    skill: { name: 'Muffin Quake', kind: 'slam', cd: 4, dur: 0.55, dmg: 3, reach: 170, h: 70, kx: 200, ky: -520 },
  },
  {
    species: 11, name: 'Pizzaraptor', role: 'Slasher: fast, long combos',
    hp: 100, atk: 8, speed: 280, jump: 740,
    combo: [A({ dur: 0.24, hit: [0.05, 0.13] }), A({ dur: 0.24, hit: [0.05, 0.13], dmg: 1 }), A({ dur: 0.38, hit: [0.1, 0.22], reach: 84, dmg: 1.7, kx: 360, ky: -380, lunge: 220, stun: 0.55 })],
    air: A({ dur: 0.26, reach: 66, dmg: 1, kx: 100, ky: -160 }),
    skill: { name: 'Slice Dash', kind: 'dash', cd: 2.5, dur: 0.32, dmg: 2.2, reach: 60, h: 70, kx: 260, ky: -260 },
  },
  {
    species: 4, name: 'Mothball', role: 'Caster: ranged bolts, glides',
    hp: 90, atk: 11, speed: 220, jump: 680, glide: true,
    combo: [A({ reach: 100, dmg: 0.9, lunge: 0 }), A({ reach: 110, dmg: 1, lunge: 0 }), A({ dur: 0.45, hit: [0.15, 0.27], reach: 140, h: 80, dmg: 1.6, kx: 300, ky: -300, lunge: 0, stun: 0.6 })],
    air: A({ dur: 0.3, reach: 100, h: 80, dmg: 0.9, lunge: 0 }),
    skill: { name: 'Dust Bolt', kind: 'bolt', cd: 2, dur: 0.35, dmg: 2.6, reach: 40, h: 40, kx: 300, ky: -220 },
  },
];

export function classOf(species: number): HeroClass {
  return CLASSES.find(c => c.species === species) ?? CLASSES[0];
}
