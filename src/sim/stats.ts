// Hero progression: level, XP, primary stats (STR/DEX/INT/VIT), skill levels and equipment → combat numbers.
import { type HeroClass, type Stat, type Stats, classOf } from './classes';
import { KAIJU_TUNE } from './kaijuTune';
import { type Item, SETS, type SkillMod, type Slot, UNIQUES, itemIcon, itemLines } from './items';
import { type HeroGear, gearOf } from './gear';
import { MAX_SKILL, PASSIVE_UNLOCK, skillScale, skillsOf } from './skills';

export const MAX_LEVEL = 110; // Act 2 (Worlds 6+) goes past 60
export const STAT_PTS_PER_LEVEL = 3;
export const STATS: Stat[] = ['str', 'dex', 'int', 'vit'];
export const STAT_INFO: Record<Stat, string> = {
  str: 'Attack power',
  dex: 'Crit chance and move speed',
  int: 'Skill damage and cooldowns',
  vit: 'Max HP and defence',
};

export interface HeroProfile {
  species: number;
  level: number;
  xp: number;
  statPts: number;
  alloc: Stats;
  skillPts: number;
  /** skill id → level put in with skill points (1 = learned) */
  skills: Record<string, number>;
  equip: Partial<Record<Slot, Item>>;
  /** skill id → chosen branch (from skill level 3) */
  branch?: Record<string, 'a' | 'b'>;
  /** this kaiju's own stage progress (best rank per stage), normal and Hard */
  cleared: Record<string, 'S' | 'A' | 'B' | 'C' | 'D'>;
  hardCleared: Record<string, 'S' | 'A' | 'B' | 'C' | 'D'>;
  /** this kaiju's counters (kills per monster, skill uses, no-hit clears, best combo...) for its quests */
  stats: Record<string, number>;
  /** claimed kaiju-quest ids */
  kq: string[];
  /** story beats already seen */
  seen: string[];
}

export function newProfile(species: number): HeroProfile {
  const sk = skillsOf(species);
  return { species, level: 1, xp: 0, statPts: 0, alloc: { str: 0, dex: 0, int: 0, vit: 0 }, skillPts: 0, skills: { [sk.actives[0].id]: 1 }, equip: {},
    cleared: {}, hardCleared: {}, stats: {}, kq: [], seen: [] };
}

export function xpFor(level: number): number { return Math.round(25 * Math.pow(level, 1.35)); }

/** Adds XP; returns how many levels were gained. Each level: +3 stat points, +1 skill point. */
export function gainXp(p: HeroProfile, xp: number): number {
  if (p.level >= MAX_LEVEL) return 0;
  p.xp += xp;
  let ups = 0;
  while (p.level < MAX_LEVEL && p.xp >= xpFor(p.level)) {
    p.xp -= xpFor(p.level); p.level++; ups++;
    p.statPts += STAT_PTS_PER_LEVEL; p.skillPts += 1;
  }
  if (p.level >= MAX_LEVEL) p.xp = 0;
  return ups;
}

export interface Derived {
  cls: HeroClass;
  level: number;
  prim: Stats;
  maxHp: number; atk: number; def: number;
  /** fraction of damage blocked */
  dr: number;
  crit: number;      // %
  critDmg: number;   // multiplier
  skillDmg: number;  // multiplier
  cdr: number;       // fraction
  speed: number;     // multiplier
  lifeOnKill: number;
  /** effective level of each skill (0 = locked / not learned) */
  skillLv: Record<string, number>;
  branch: Record<string, 'a' | 'b'>;
  /** named-legendary effects worn (UNIQUES keys) */
  uniques: string[];
  /** set name → pieces worn */
  sets: Record<string, number>;
  ultGain: number; ultDmg: number;
  /** passives: HP regen per second (fraction), damage reflected to attackers, finisher/Guard Break bonus, dodge bonus */
  regen: number; thorns: number; heavyDmg: number; dodge: number;
  /** the weapon's gear skill (4th button), trigger effects worn, signature-legendary skill upgrades */
  gear: HeroGear | null; procs: string[]; mods: Record<string, SkillMod>;
}

/** Main-stat scaling (tuned with scripts/kaiju-diag.ts and scripts/balance.ts). INT's skill bonus is measured against the
 *  level (so casters don't run away late), STR also multiplies attack a little, and DEX past the crit cap adds crit damage. */
export const SCALE = { int: 0.025, intLv: 0.024, str: 0.0017, critCap: 75, dexOver: 0.006, hpLv: 14, drSoft: 0.7, drOver: 0.4, hpAll: 0.73, dmgAll: 1.36 };
/** Damage reduction past drSoft counts for less (so the sturdiest kaiju still feel boss hits). */
const softDr = (dr: number) => dr <= SCALE.drSoft ? dr : SCALE.drSoft + (dr - SCALE.drSoft) * SCALE.drOver;

export function derive(p: HeroProfile): Derived {
  const cls = classOf(p.species);
  const sk = skillsOf(p.species);
  const prim = { ...cls.base };
  for (const s of STATS) prim[s] += cls.grow[s] * (p.level - 1) + p.alloc[s];
  const eq: Record<string, number> = {};
  const boosts: Record<string, number> = {};
  for (const it of Object.values(p.equip)) {
    if (!it) continue;
    for (const l of itemLines(it)) eq[l.k] = (eq[l.k] ?? 0) + l.v;
    if (it.skill) boosts[it.skill.id] = (boosts[it.skill.id] ?? 0) + it.skill.n;
  }
  for (const s of STATS) prim[s] += eq[s] ?? 0;

  const skillLv: Record<string, number> = {};
  for (const a of [...sk.actives, sk.passive]) {
    const learned = p.skills[a.id] ?? 0;
    const unlocked = p.level >= a.unlock;
    skillLv[a.id] = unlocked && learned > 0 ? learned + (boosts[a.id] ?? 0) + (boosts.all ?? 0) : 0;
  }
  const pas = sk.passive, pl = p.level >= PASSIVE_UNLOCK ? skillLv[pas.id] : 0;
  // sets: 2 / 3 pieces
  const sets: Record<string, number> = {};
  const uniques: string[] = [];
  const procs: string[] = [], mods: Record<string, SkillMod> = {};
  for (const it of Object.values(p.equip)) {
    if (it?.set) sets[it.set] = (sets[it.set] ?? 0) + 1;
    if (it?.unique) { uniques.push(it.unique); const u = UNIQUES[it.unique]; if (u?.skill && u.mod && u.for === p.species) mods[u.skill] = { ...mods[u.skill], ...u.mod }; }
    if (it?.proc && !procs.includes(it.proc)) procs.push(it.proc);
  }
  const sb = { atkPct: 0, hpPct: 0, critDmg: 0, speed: 0, skillDmg: 0, cdr: 0, dr: 0, ultGain: 0, ultDmg: 0 };
  for (const [k, n] of Object.entries(sets)) for (const b of [n >= 2 ? SETS[k].b2 : null, n >= 3 ? SETS[k].b3 : null]) if (b) for (const [bk, bv] of Object.entries(b)) sb[bk as keyof typeof sb] += bv;
  const per = (k: keyof typeof pas.per) => (pas.per[k] ?? 0) * pl;

  const tune = KAIJU_TUNE[p.species] ?? { hp: 1, dmg: 1 };
  const def = prim.vit * 0.6 + (eq.def ?? 0);
  const critRaw = 5 + prim.dex * 0.5 + (eq.crit ?? 0) + per('crit');
  return {
    cls, level: p.level, prim,
    maxHp: Math.round((cls.hp + prim.vit * 9 + p.level * SCALE.hpLv + (eq.hp ?? 0)) * (1 + per('hpPct') + sb.hpPct) * tune.hp * SCALE.hpAll),
    atk: Math.round((cls.atk + prim.str * 1.2 + p.level + (eq.atk ?? 0)) * (1 + SCALE.str * prim.str) * (1 + per('atkPct') + sb.atkPct) * tune.dmg * SCALE.dmgAll),
    def: Math.round(def),
    dr: softDr(1 - (1 - def / (def + 80)) * (1 - sb.dr) * (1 - per('dr'))),
    crit: Math.min(SCALE.critCap, critRaw),
    critDmg: 1.5 + (eq.critDmg ?? 0) + sb.critDmg + per('critDmg') + Math.max(0, critRaw - SCALE.critCap) * SCALE.dexOver,
    skillDmg: 1 + prim.int * SCALE.int / (1 + SCALE.intLv * (p.level - 1)) + (eq.skillDmg ?? 0) + per('skillDmg') + sb.skillDmg,
    cdr: Math.min(0.5, prim.int * 0.004 + (eq.cdr ?? 0) + per('cdr') + sb.cdr),
    speed: 1 + Math.min(0.35, prim.dex * 0.004 + (eq.speed ?? 0) + sb.speed),
    uniques, sets, ultGain: 1 + sb.ultGain + per('ultGain'), ultDmg: 1 + sb.ultDmg,
    regen: per('regen'), thorns: per('thorns'), heavyDmg: per('heavyDmg'), dodge: per('dodge'),
    lifeOnKill: per('lifeOnKill'),
    gear: gearOf(p.equip.weapon, p.equip.weapon ? itemIcon(p.equip.weapon) : undefined), procs, mods,
    skillLv,
    branch: { ...(p.branch ?? {}) },
  };
}

/** Can this skill take another skill point right now? */
export function canLevelSkill(p: HeroProfile, id: string): boolean {
  const sk = skillsOf(p.species);
  const def = [...sk.actives, sk.passive].find(s => s.id === id);
  if (!def || p.skillPts <= 0 || p.level < def.unlock) return false;
  return (p.skills[id] ?? 0) < MAX_SKILL;
}

export { skillScale };
