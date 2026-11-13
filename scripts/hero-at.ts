// Balance-bot hero at a level (same as scripts/balance.ts heroAt), shared by diagnostic scripts.
import { newProfile, type HeroProfile } from '../src/sim/stats';
import { CLASSES, type Stat } from '../src/sim/classes';
import { MAX_SKILL, rankLv, skillsOf } from '../src/sim/skills';
import { BASES, rollItem, type Slot } from '../src/sim/items';
import { allActives, canLearn, loadoutOf, skillUnlocked, treeOf } from '../src/sim/tree';
import { derive } from '../src/sim/stats';
import { type Element, MONSTER_TYPES, canReseason, elementsOfGear, elementsOfSkill, reseasonItem, stageElements, typeOf } from '../src/sim/elements';
import type { StageDef } from '../src/sim/types';
/** The build the balance bot plays. The weapon (and its random twist) depends only on (kaiju, level, seed): the same
 *  kaiju on the same stage and run number always carries the same weapon, so sweeps are repeatable.
 *  `prepared`: pass the stage to get the build of a player who read the stage card (docs/WEAKNESS-DESIGN.md section 8):
 *  the weapon is re-seasoned to the boss-room foe's weakness and the three buttons hold the skills that match it.
 *  `how` 'weapon' re-seasons the weapon only and leaves the buttons alone (swapping a shield or a main damage skill for a
 *  matching utility skill often costs the bot more than the weakness pays).
 *  The bot's play is the same either way (it never looks at elements). */
export function heroFor(species: number, level: number, seed: number, prepared?: StageDef, how: 'full' | 'weapon' = 'full'): HeroProfile {
  const p = baseHero(species, level, seed);
  if (prepared) prepare(p, prepared, how);
  return p;
}
/** What a prepared player does before PLAY, with only what the game sells for crumbs or the kaiju already knows:
 *  - weapon: an ordinary weapon is re-seasoned (Market) to the foe's weakness when that is HOT / COLD / STICKY. CRUNCH can't
 *    be bought, so against a Crusty foe the player only makes sure the weapon is not the STICKY it resists (re-season to HOT,
 *    which a Crusty monster neither likes nor minds). Same weapon item, level, rarity and throwing style.
 *  - buttons: learned skills (3 originals + learned tree skills) that carry the weakness go on the buttons, skills the foe
 *    resists come off when something neutral is left to replace them. No skill points move. */
export function prepare(p: HeroProfile, stage: StageDef, how: 'full' | 'weapon' = 'full'): { want: Element; weapon: boolean; skills: number } | null {
  const foe = stageElements(stage, p.species).boss;
  if (!foe) return null;
  const want = foe.weakTo, resist = MONSTER_TYPES[typeOf(foe.kind)].resists;
  const w = p.equip.weapon;
  let weapon = false;
  if (w && canReseason(w)) {
    const els = elementsOfGear(w);
    if (!els.includes(want)) weapon = reseasonItem(w, want) || (els.includes(resist) && !els.some(e => e !== resist) && reseasonItem(w, resist === 'HOT' ? 'COLD' : 'HOT'));
  }
  if (how === 'weapon') return { want, weapon, skills: 0 };
  const d = derive(p);
  const score = (id: string) => { const s = allActives(p.species).find(a => a.id === id)!; const els = elementsOfSkill(s, d.mods[id]); return els.includes(want) ? 2 : els.length && els.every(e => e === resist) ? 0 : 1; };
  // start from the unprepared buttons and swap as little as possible: each learned skill that carries the weakness and is
  // not on a button takes the place of the weakest button that does not (a resisted one first, then the lowest skill rank,
  // then the right-most), and a button the foe resists is swapped for the best-ranked neutral skill left over.
  const rank = (id: string) => p.skills[id] ?? 0;
  const pick = loadoutOf(p).map(s => s.id);
  const spare = () => allActives(p.species).map(a => a.id).filter(id => !pick.includes(id) && skillUnlocked(p, id) && d.skillLv[id] > 0);
  const worst = (below: number) => pick.map((id, i) => ({ i, sc: d.skillLv[id] > 0 ? score(id) : -1, r: rank(id) })).filter(x => x.sc < below).sort((x, y) => x.sc - y.sc || x.r - y.r || y.i - x.i)[0];
  for (const id of spare().filter(id => score(id) === 2)) { const w2 = worst(2); if (w2) pick[w2.i] = id; }
  for (const id of spare().filter(id => score(id) === 1).sort((x, y) => rank(y) - rank(x))) { const w0 = worst(1); if (w0) pick[w0.i] = id; }
  p.loadout = pick;
  return { want, weapon, skills: pick.filter(id => score(id) === 2).length };
}
function baseHero(species: number, level: number, seed: number): HeroProfile {
  const p = newProfile(species);
  p.level = level;
  const cls = CLASSES.find(c => c.species === species)!;
  const order = (Object.keys(cls.grow) as Stat[]).sort((a, b) => cls.grow[b] - cls.grow[a]);
  for (let i = 0; i < (level - 1) * 3; i++) p.alloc[order[i % 2]]++;
  const sk = skillsOf(species);
  let pts = level - 1;
  const all = [...sk.actives, sk.passive];
  for (let round = 0; round < MAX_SKILL && pts > 0; round++) for (const s of all) if (level >= rankLv(s.unlock, (p.skills[s.id] ?? 0) + 1) && pts > 0 && (p.skills[s.id] ?? 0) < MAX_SKILL) { p.skills[s.id] = (p.skills[s.id] ?? 0) + 1; if (round > 0 || s.id !== sk.actives[0].id) pts--; }
  let s = seed * 7919 + species;
  const rand = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  for (const slot of ['weapon', 'armor', 'charm'] as Slot[]) {
    let it; do { it = rollItem(1, rand() < 0.5 ? 2 : 3, level, rand, [], species); } while (BASES[it.base].slot !== slot || (BASES[it.base].for !== undefined && BASES[it.base].for !== species));
    it.rarity = Math.min(it.rarity, 3) as 1 | 2 | 3; p.equip[slot] = it;
  }
  // the rest of the points go into the skill tree, like a player working down one path, then the next
  p.skillPts = pts;
  for (const path of treeOf(species)) for (const n of path.nodes) while (canLearn(p, n.id)) { p.skillPts--; p.tree = { ...(p.tree ?? {}), [n.id]: (p.tree?.[n.id] ?? 0) + 1 }; if (n.skill) p.skills[n.skill.id] = Math.max(1, p.skills[n.skill.id] ?? 0); }
  // put up to two of the new tree skills on the buttons (so the bots use and test them)
  const learned = treeOf(species).map(t => t.nodes[2]).filter(n => (p.tree?.[n.id] ?? 0) > 0).map(n => n.skill!.id).slice(0, 2);
  if (learned.length) p.loadout = [...learned, ...sk.actives.map(a => a.id)].slice(0, 3);
  return p;
}

