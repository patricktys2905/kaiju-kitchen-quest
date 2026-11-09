// Hero progression: level, XP, primary stats (STR/DEX/INT/VIT), skill levels and equipment → combat numbers.
import { type HeroClass, type Stat, type Stats, classOf } from './classes';
import { type Item, type Slot, itemLines } from './items';
import { MAX_SKILL, PASSIVE_UNLOCK, skillScale, skillsOf } from './skills';

export const MAX_LEVEL = 30;
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
}

export function newProfile(species: number): HeroProfile {
  const sk = skillsOf(species);
  return { species, level: 1, xp: 0, statPts: 0, alloc: { str: 0, dex: 0, int: 0, vit: 0 }, skillPts: 0, skills: { [sk.actives[0].id]: 1 }, equip: {} };
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
}

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
  const per = (k: keyof typeof pas.per) => (pas.per[k] ?? 0) * pl;

  const def = prim.vit * 0.6 + (eq.def ?? 0);
  return {
    cls, level: p.level, prim,
    maxHp: Math.round((cls.hp + prim.vit * 9 + p.level * 8 + (eq.hp ?? 0)) * (1 + per('hpPct'))),
    atk: Math.round((cls.atk + prim.str * 1.2 + p.level + (eq.atk ?? 0)) * (1 + per('atkPct'))),
    def: Math.round(def),
    dr: def / (def + 80),
    crit: Math.min(75, 5 + prim.dex * 0.5 + (eq.crit ?? 0) + per('crit')),
    critDmg: 1.5 + (eq.critDmg ?? 0),
    skillDmg: 1 + prim.int * 0.025 + (eq.skillDmg ?? 0) + per('skillDmg'),
    cdr: Math.min(0.45, prim.int * 0.004 + (eq.cdr ?? 0) + per('cdr')),
    speed: 1 + Math.min(0.3, prim.dex * 0.004 + (eq.speed ?? 0)),
    lifeOnKill: per('lifeOnKill'),
    skillLv,
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
