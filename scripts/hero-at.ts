// Balance-bot hero at a level (same as scripts/balance.ts heroAt), shared by diagnostic scripts.
import { newProfile, type HeroProfile } from '../src/sim/stats';
import { CLASSES, type Stat } from '../src/sim/classes';
import { MAX_SKILL, skillsOf } from '../src/sim/skills';
import { BASES, rollItem, type Slot } from '../src/sim/items';
export function heroFor(species: number, level: number, seed: number): HeroProfile {
  const p = newProfile(species);
  p.level = level;
  const cls = CLASSES.find(c => c.species === species)!;
  const order = (Object.keys(cls.grow) as Stat[]).sort((a, b) => cls.grow[b] - cls.grow[a]);
  for (let i = 0; i < (level - 1) * 3; i++) p.alloc[order[i % 2]]++;
  const sk = skillsOf(species);
  let pts = level - 1;
  const all = [...sk.actives, sk.passive];
  for (let round = 0; round < MAX_SKILL && pts > 0; round++) for (const s of all) if (level >= s.unlock && pts > 0 && (p.skills[s.id] ?? 0) < MAX_SKILL) { p.skills[s.id] = (p.skills[s.id] ?? 0) + 1; if (round > 0 || s.id !== sk.actives[0].id) pts--; }
  let s = seed * 7919 + species;
  const rand = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  for (const slot of ['weapon', 'armor', 'charm'] as Slot[]) {
    let it; do { it = rollItem(1, rand() < 0.5 ? 2 : 3, level, rand, [], species); } while (BASES[it.base].slot !== slot || (BASES[it.base].for !== undefined && BASES[it.base].for !== species));
    it.rarity = Math.min(it.rarity, 3) as 1 | 2 | 3; p.equip[slot] = it;
  }
  return p;
}

