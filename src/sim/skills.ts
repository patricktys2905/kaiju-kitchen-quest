// Skills: every kaiju has 3 actives (unlocking with hero level) and 1 passive. Skill levels 1..MAX_SKILL
// (gear can push past the max). Damage grows +20% per level, cooldown shrinks 4% per level.

export type SkillKind = 'cone' | 'slam' | 'dash' | 'bolt' | 'spin' | 'uppercut' | 'mines' | 'buff' | 'nova' | 'fan' | 'heal';

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
  /** heal: fraction of max HP restored at skill level 1 */
  heal?: number;
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
  1: { // Squidgeon
    actives: [
      S({ id: 'ink', name: 'Ink Splash', kind: 'cone', desc: 'Sprays a wave of berry ink', cd: 3, dmg: 2.2, reach: 200, h: 90, kx: 300 }),
      S({ id: 'whirl', name: 'Tentacle Whirl', kind: 'spin', desc: 'Spins all eight arms, hitting everything around', unlock: 4, cd: 7, dur: 1.2, dmg: 0.75, reach: 130, h: 90, kx: 180, ky: -140, n: 10 }),
      S({ id: 'wave', name: 'Jelly Wave', kind: 'nova', desc: 'A wobbling jelly shockwave all around', unlock: 8, cd: 11, dur: 0.7, dmg: 4.4, reach: 240, h: 160, kx: 380, ky: -380 }),
    ],
    passive: { id: 'eight', name: 'Eight Arms', desc: '+4% attack per level', unlock: PASSIVE_UNLOCK, per: { atkPct: 0.04 } },
  },
  2: { // Crabbage
    actives: [
      S({ id: 'snap', name: 'Claw Snap', kind: 'dash', desc: 'Scuttles sideways and snaps everything in the way', cd: 3, dur: 0.3, dmg: 2.3, reach: 70, h: 70, kx: 300, ky: -200 }),
      S({ id: 'shell', name: 'Leaf Shell', kind: 'buff', desc: 'Hides in cabbage: -50% damage taken, no flinching', unlock: 4, cd: 15, dur: 0.4, dmg: 0, buff: { def: 0.5, armor: true, t: 7 } }),
      S({ id: 'crash', name: 'Cheddar Crash', kind: 'slam', desc: 'Leaps and crashes down like a falling cheese wheel', unlock: 8, cd: 8, dur: 0.65, dmg: 4, reach: 210, h: 80, kx: 260, ky: -560 }),
    ],
    passive: { id: 'rind', name: 'Thick Rind', desc: '+5% max HP per level', unlock: PASSIVE_UNLOCK, per: { hpPct: 0.05 } },
  },
  5: { // Toastbat
    actives: [
      S({ id: 'dive', name: 'Crumb Dive', kind: 'dash', desc: 'Swoops through enemies in a crumb trail', cd: 2.2, dur: 0.3, dmg: 2.2, reach: 60, h: 80, kx: 240, ky: -320 }),
      S({ id: 'butter', name: 'Butter Bolt', kind: 'bolt', desc: 'Flings a sizzling pat of butter that pierces', unlock: 4, cd: 3, dur: 0.3, dmg: 2.8, reach: 40, h: 40, kx: 280, ky: -220 }),
      S({ id: 'toastado', name: 'Toast Tornado', kind: 'spin', desc: 'Becomes a whirling slice of toast', unlock: 8, cd: 9, dur: 1.3, dmg: 0.85, reach: 120, h: 100, kx: 200, ky: -220, n: 11 }),
    ],
    passive: { id: 'crispy', name: 'Extra Crispy', desc: '+3% critical chance per level', unlock: PASSIVE_UNLOCK, per: { crit: 3 } },
  },
  6: { // Dumplord
    actives: [
      S({ id: 'steam', name: 'Steam Puff', kind: 'cone', desc: 'Puffs out a cloud of scalding steam', cd: 3, dmg: 2.2, reach: 190, h: 100, kx: 280 }),
      S({ id: 'feast', name: 'Dumpling Feast', kind: 'heal', desc: 'Eats a snack: heals 25% HP (+5% per level)', unlock: 4, cd: 14, dur: 0.6, dmg: 0, heal: 0.25 }),
      S({ id: 'soup', name: 'Soup Splash', kind: 'nova', desc: 'A huge splash of hot soup all around', unlock: 8, cd: 11, dur: 0.75, dmg: 4.6, reach: 250, h: 170, kx: 400, ky: -380 }),
    ],
    passive: { id: 'aura', name: 'Steamy Aura', desc: 'Heals 3% max HP per level on each kill', unlock: PASSIVE_UNLOCK, per: { lifeOnKill: 0.03 } },
  },
};

export function skillsOf(species: number) { return SKILLS[species] ?? SKILLS[0]; }

// ---------- ultimates ----------
export const ULT_LV = 15;
/** Each kaiju's ultimate: fills a gauge by landing hits (and taking them); invincible while it plays. */
export const ULTS: Record<number, SkillDef> = {
  0: S({ id: 'ult0', name: 'Strawberry Stampede', kind: 'spin', desc: 'A huge, long berry whirlwind', cd: 0, dur: 2.2, dmg: 1.5, reach: 210, h: 140, kx: 260, ky: -260, n: 18 }),
  10: S({ id: 'ult10', name: 'Blueberry Meteor', kind: 'slam', desc: 'Leaps sky-high and crashes down', cd: 0, dur: 0.9, dmg: 10, reach: 330, h: 120, kx: 300, ky: -700 }),
  11: S({ id: 'ult11', name: 'Pizza Cutter Rush', kind: 'dash', desc: 'Rolls through everything like a pizza wheel', cd: 0, dur: 0.75, dmg: 8, reach: 90, h: 100, kx: 360, ky: -360 }),
  4: S({ id: 'ult4', name: 'Moonbeam Nova', kind: 'nova', desc: 'A blinding burst of moon dust', cd: 0, dur: 0.9, dmg: 11, reach: 380, h: 260, kx: 460, ky: -460 }),
  1: S({ id: 'ult1', name: 'Kraken Whirl', kind: 'spin', desc: 'Every tentacle at once, for ages', cd: 0, dur: 2, dmg: 1.4, reach: 230, h: 140, kx: 240, ky: -200, n: 20 }),
  2: S({ id: 'ult2', name: 'Cheddar Quake', kind: 'slam', desc: 'A cheese-wheel crash that shakes the kitchen', cd: 0, dur: 0.9, dmg: 10, reach: 350, h: 120, kx: 280, ky: -680 }),
  5: S({ id: 'ult5', name: 'Toast Storm', kind: 'fan', desc: 'Twelve flaming toast slices', cd: 0, dur: 0.6, dmg: 3.2, reach: 40, h: 40, kx: 260, ky: -220, n: 12 }),
  6: S({ id: 'ult6', name: 'Steamer Feast', kind: 'nova', desc: 'A giant steam blast that also heals 40%', cd: 0, dur: 0.9, dmg: 8, reach: 340, h: 240, kx: 420, ky: -420, heal: 0.4 }),
};

// ---------- branches ----------
export const BRANCH_LV = 3;
export type BranchId = 'a' | 'b';
export interface Branch { id: BranchId; name: string; desc: string; mods: { dmg?: number; reach?: number; cd?: number; n?: number; dur?: number; heal?: number; buffT?: number } }
/** At skill level 3 every active picks one of two upgrades. */
export function branchesFor(s: SkillDef): [Branch, Branch] {
  const power: Branch = s.kind === 'buff' || s.kind === 'heal'
    ? { id: 'a', name: 'Quick Recharge', desc: '-30% cooldown', mods: { cd: 0.7 } }
    : { id: 'a', name: 'Power', desc: '+35% damage', mods: { dmg: 1.35 } };
  const B: Record<SkillKind, Branch> = {
    cone: { id: 'b', name: 'Wide Spray', desc: '+40% reach and height', mods: { reach: 1.4 } },
    slam: { id: 'b', name: 'Big Shockwave', desc: '+40% radius', mods: { reach: 1.4 } },
    dash: { id: 'b', name: 'Quick Step', desc: '-35% cooldown', mods: { cd: 0.65 } },
    bolt: { id: 'b', name: 'Twin Bolt', desc: 'Fires two bolts', mods: { n: 1 } },
    fan: { id: 'b', name: 'Wide Fan', desc: '+2 bolts', mods: { n: 2 } },
    spin: { id: 'b', name: 'Long Spin', desc: '+40% duration and hits', mods: { dur: 1.4, n: 0.4 } },
    uppercut: { id: 'b', name: 'Quick Upper', desc: '-30% cooldown', mods: { cd: 0.7 } },
    mines: { id: 'b', name: 'More Mines', desc: '+2 mines', mods: { n: 2 } },
    buff: { id: 'b', name: 'Lasting', desc: '+50% duration', mods: { buffT: 1.5 } },
    nova: { id: 'b', name: 'Big Nova', desc: '+35% radius', mods: { reach: 1.35 } },
    heal: { id: 'b', name: 'Big Feast', desc: '+50% healing', mods: { heal: 1.5 } },
  };
  return [power, B[s.kind]];
}

/** A skill with its branch applied (skills are shared constants, so this returns a copy). */
export function applyBranch(s: SkillDef, b: BranchId | undefined): SkillDef {
  if (!b) return s;
  const m = branchesFor(s)[b === 'a' ? 0 : 1].mods;
  const out: SkillDef = { ...s };
  if (m.dmg) out.dmg *= m.dmg;
  if (m.reach) { out.reach *= m.reach; out.h *= Math.sqrt(m.reach); }
  if (m.cd) out.cd *= m.cd;
  if (m.dur) out.dur *= m.dur;
  if (m.n) out.n = s.kind === 'spin' ? Math.round((s.n ?? 6) * (1 + m.n)) : (s.n ?? 1) + m.n;
  if (m.heal && s.heal) out.heal = s.heal * m.heal;
  if (m.buffT && s.buff) out.buff = { ...s.buff, t: s.buff.t * m.buffT };
  return out;
}

/** Damage multiplier and cooldown at a given skill level. */
export function skillScale(level: number): { dmg: number; cd: number } {
  const l = Math.max(1, level);
  return { dmg: 1 + 0.2 * (l - 1), cd: 1 - 0.04 * (l - 1) };
}
