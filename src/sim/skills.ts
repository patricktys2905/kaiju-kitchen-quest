// Skills: every kaiju has 3 actives (unlocking with hero level) and 1 passive. Skill levels 1..MAX_SKILL
// (gear can push past the max). Damage grows +20% per level, cooldown shrinks 4% per level.

export type SkillKind = 'cone' | 'slam' | 'dash' | 'bolt' | 'spin' | 'uppercut' | 'mines' | 'buff' | 'nova' | 'fan';

export interface SkillDef {
  id: string;
  name: string;
  kind: SkillKind;
  desc: string;
  unlock: number;  // hero level needed
  cd: number;      // seconds
  dur: number;     // seconds the hero is busy
  dmg: number;     // × attack
  reach: number; h: number;
  kx: number; ky: number;
  /** spin: hits per second; mines/fan: count */
  n?: number;
  /** buff: what it boosts while active */
  buff?: { atk?: number; def?: number; speed?: number; armor?: boolean; t: number };
}

export interface PassiveDef {
  id: string; name: string; desc: string; unlock: number;
  /** per skill level */
  per: Partial<{ hpPct: number; crit: number; skillDmg: number; cdr: number; lifeOnKill: number; atkPct: number }>;
}

export const MAX_SKILL = 5;
export const SKILL_UNLOCKS = [1, 4, 8];
export const PASSIVE_UNLOCK = 6;

const S = (o: Partial<SkillDef> & Pick<SkillDef, 'id' | 'name' | 'kind' | 'desc'>): SkillDef =>
  ({ unlock: 1, cd: 3, dur: 0.45, dmg: 2, reach: 120, h: 80, kx: 300, ky: -200, ...o });

export const SKILLS: Record<number, { actives: SkillDef[]; passive: PassiveDef }> = {
  0: { // Gobzilla Jr.
    actives: [
      S({ id: 'seed', name: 'Seed Spray', kind: 'cone', desc: 'Spits a cone of strawberry seeds', cd: 3, dmg: 2.4, reach: 210, h: 90, kx: 380 }),
      S({ id: 'upper', name: 'Berry Uppercut', kind: 'uppercut', desc: 'Leaps up with a launching uppercut', unlock: 4, cd: 5, dur: 0.55, dmg: 3.2, reach: 80, h: 150, kx: 120, ky: -720 }),
      S({ id: 'jamspin', name: 'Jam Tornado', kind: 'spin', desc: 'Spins in a sticky jam whirl, hitting all around', unlock: 8, cd: 9, dur: 1.6, dmg: 0.9, reach: 150, h: 100, kx: 160, ky: -160, n: 7 }),
    ],
    passive: { id: 'sweet', name: 'Sweet Tooth', desc: 'Heals 2% max HP per level on each kill', unlock: PASSIVE_UNLOCK, per: { lifeOnKill: 0.02 } },
  },
  10: { // Bluebeary
    actives: [
      S({ id: 'quake', name: 'Muffin Quake', kind: 'slam', desc: 'Belly-flops for a shockwave', cd: 4, dur: 0.6, dmg: 3, reach: 190, h: 70, kx: 200, ky: -520 }),
      S({ id: 'mines', name: 'Berry Mines', kind: 'mines', desc: 'Drops blueberry mines that pop on enemies', unlock: 4, cd: 7, dur: 0.4, dmg: 2.6, reach: 50, h: 60, kx: 260, ky: -460, n: 3 }),
      S({ id: 'frost', name: 'Frosting Shield', kind: 'buff', desc: 'Hardens: -40% damage taken, no flinching, +20% attack', unlock: 8, cd: 16, dur: 0.5, dmg: 0, buff: { def: 0.4, atk: 0.2, armor: true, t: 8 } }),
    ],
    passive: { id: 'thick', name: 'Thick Frosting', desc: '+6% max HP per level', unlock: PASSIVE_UNLOCK, per: { hpPct: 0.06 } },
  },
  11: { // Pizzaraptor
    actives: [
      S({ id: 'slice', name: 'Slice Dash', kind: 'dash', desc: 'Dashes through enemies', cd: 2.5, dur: 0.32, dmg: 2.2, reach: 60, h: 70, kx: 260, ky: -260 }),
      S({ id: 'pspin', name: 'Pepperoni Spin', kind: 'spin', desc: 'Whirls its crust tail, hitting all around', unlock: 4, cd: 6, dur: 1.0, dmg: 0.8, reach: 110, h: 80, kx: 200, ky: -120, n: 9 }),
      S({ id: 'frenzy', name: 'Extra Cheese', kind: 'buff', desc: 'Frenzy: +35% attack and +25% speed', unlock: 8, cd: 15, dur: 0.4, dmg: 0, buff: { atk: 0.35, speed: 0.25, t: 7 } }),
    ],
    passive: { id: 'hot', name: 'Hot Slice', desc: '+3% critical chance per level', unlock: PASSIVE_UNLOCK, per: { crit: 3 } },
  },
  4: { // Mothball
    actives: [
      S({ id: 'bolt', name: 'Dust Bolt', kind: 'bolt', desc: 'Fires a piercing bolt of sugar dust', cd: 2, dur: 0.35, dmg: 2.6, reach: 40, h: 40, kx: 300, ky: -220 }),
      S({ id: 'fan', name: 'Sugar Fan', kind: 'fan', desc: 'Throws a fan of five glittering bolts', unlock: 4, cd: 6, dur: 0.45, dmg: 1.6, reach: 40, h: 40, kx: 220, ky: -160, n: 5 }),
      S({ id: 'nova', name: 'Marshmallow Nova', kind: 'nova', desc: 'A huge fluffy burst all around after a short charge', unlock: 8, cd: 12, dur: 0.8, dmg: 5, reach: 260, h: 200, kx: 420, ky: -420 }),
    ],
    passive: { id: 'soft', name: 'Moonlit Wings', desc: '+5% skill damage and -3% cooldowns per level', unlock: PASSIVE_UNLOCK, per: { skillDmg: 0.05, cdr: 0.03 } },
  },
};

export function skillsOf(species: number) { return SKILLS[species] ?? SKILLS[0]; }

/** Damage multiplier and cooldown at a given skill level. */
export function skillScale(level: number): { dmg: number; cd: number } {
  const l = Math.max(1, level);
  return { dmg: 1 + 0.2 * (l - 1), cd: 1 - 0.04 * (l - 1) };
}
