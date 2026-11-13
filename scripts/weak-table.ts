// The tables of docs/WEAKNESS-DESIGN.md section 6, printed from the game's own monster-type table and the real MOBS list.
// Types: M = Melty (weak HOT, resists COLD) · F = Fiery (weak COLD, resists HOT) · C = Crusty (weak CRUNCH, resists STICKY)
//        S = Slippery (weak STICKY, resists CRUNCH). Kings (k*) and champions (x*) inherit from their base monster.
import { MOBS } from '../src/sim/mobs';
import { WORLDS, ROOM_FOES, STAGES } from '../src/sim/stages';
import type { MobKind } from '../src/sim/types';
import { ELEMENT_INFO, MONSTER_TYPES, type MonsterType, typeOf as monsterType, untypedKinds } from '../src/sim/elements';

// The type table itself lives in src/sim/elements.ts (BASE_TYPE, read here through typeOf): this script has no copy, so the
// two cannot drift. (An unknown key in that table is caught by tests/elements.test.ts, not here.)
type T = 'M' | 'F' | 'C' | 'S';
const LETTER: Record<MonsterType, T> = { MELTY: 'M', FIERY: 'F', CRUSTY: 'C', SLIPPERY: 'S' };
const untyped = new Set<string>(untypedKinds());
const typeOf = (k: string): T | undefined => untyped.has(k) ? undefined : LETTER[monsterType(k as MobKind)];
const icon = (t: MonsterType, side: 'weakTo' | 'resists') => ELEMENT_INFO[MONSTER_TYPES[t][side]].icon;
const ICON: Record<T, string> = { M: icon('MELTY', 'weakTo'), F: icon('FIERY', 'weakTo'), C: icon('CRUSTY', 'weakTo'), S: icon('SLIPPERY', 'weakTo') };
const RES: Record<T, string> = { M: icon('MELTY', 'resists'), F: icon('FIERY', 'resists'), C: icon('CRUSTY', 'resists'), S: icon('SLIPPERY', 'resists') };

const missing = Object.keys(MOBS).filter(k => !typeOf(k));
console.log('missing:', missing.join(' ') || 'none', '| kinds:', Object.keys(MOBS).length);
if (missing.length) process.exitCode = 1;

const nm = (k: string) => (MOBS as any)[k].name as string;
const cell = (k: string) => `${nm(k)} ${ICON[typeOf(k)!]}`;
const count = (ks: string[]) => { const c: Record<T, number> = { M: 0, F: 0, C: 0, S: 0 }; for (const k of ks) c[typeOf(k)!]++; return (['M', 'F', 'C', 'S'] as T[]).map(t => `${ICON[t]}${c[t]}`).join(' '); };

console.log('\n| World | Monsters (weak to) | Count | Stage 5 champion | World boss |\n| --- | --- | --- | --- | --- |');
const prev = new Set<string>();
for (const w of WORLDS) {
  const pool = w.pool.map(p => p[1]);
  console.log(`| ${w.id} ${w.name.replace(/^The /, '')} | ${pool.map(k => (prev.has(k) ? '*' : '') + cell(k)).join(', ')} | ${count(pool)} | ${cell(w.elite)} | ${cell(w.boss)}, resists ${RES[typeOf(w.boss)!]} |`);
  pool.forEach(k => prev.add(k));
}
console.log('\n| World | 1 | 2 | 3 | 4 | 6 | 7 | 8 | 9 |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
for (const w of WORLDS) console.log(`| ${w.id} | ${ROOM_FOES[w.id].map(cell).join(' | ')} |`);

console.log('\nsummons:', ['jellybit', 'minicheerio', 'sporeling', 'crouton', 'sprout', 'chunk', 'lid'].map(cell).join(', '), '| mimics:', ['mimic', 'cereal'].map(cell).join(', '));
console.log('nemeses:', Object.keys(MOBS).filter(k => (MOBS as any)[k].nem?.species >= 0).map(k => `${cell(k)}`).join(', '));

const all = Object.keys(MOBS);
const ord = [...new Set(WORLDS.flatMap(w => w.pool.map(p => p[1] as string)))];
console.log('\ncounts ordinary:', count(ord), '| minibosses:', count(all.filter(k => /^m\d/.test(k))), '| kings:', count(all.filter(k => (MOBS as any)[k].king)), '| champions:', count(WORLDS.map(w => w.elite)), '| bosses:', count(WORLDS.map(w => w.boss)), '| nemeses:', count(all.filter(k => (MOBS as any)[k].nem?.species >= 0)));

// per stage: how many of the four weaknesses its monsters cover, and how much of the stage the top two cover
let two = 0, n = 0; const worst: string[] = [];
for (const s of STAGES) {
  const kinds = new Set<MobKind>();
  for (const mp of s.maps ?? []) for (const k of mp.spawns?.kinds ?? []) kinds.add(k);
  const c: Record<T, number> = { M: 0, F: 0, C: 0, S: 0 };
  for (const k of kinds) c[typeOf(k)!]++;
  const sorted = Object.values(c).sort((a, b) => b - a), share = (sorted[0] + sorted[1]) / kinds.size;
  n++; if (share >= 0.66) two++; else worst.push(`${s.num} ${Math.round(share * 100)}%`);
}
console.log(`stages where two elements cover at least 2/3 of the monster kinds: ${two}/${n}; the rest: ${worst.join(', ')}`);
// wanted-drop monsters per stage (the ones the exits make you hunt)
let two2 = 0;
for (const s of STAGES) {
  const want = new Set<MobKind>();
  for (const mp of s.maps ?? []) if (mp.goal?.kind === 'collect') for (const q of mp.goal.wants) want.add(q.mob);
  const c: Record<T, number> = { M: 0, F: 0, C: 0, S: 0 };
  for (const k of want) c[typeOf(k)!]++;
  const sorted = Object.values(c).sort((a, b) => b - a);
  if (want.size && (sorted[0] + sorted[1]) / want.size >= 0.66) two2++;
}
console.log(`stages where two elements cover at least 2/3 of the WANTED (exit drop) monsters: ${two2}/${n}`);
