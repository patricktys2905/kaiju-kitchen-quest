// Throwaway (design research for docs/WEAKNESS-DESIGN.md): the proposed monster-type table, checked against the real MOBS list.
// Types: M = Melty (weak HOT, resists COLD) · F = Fiery (weak COLD, resists HOT) · C = Crusty (weak CRUNCH, resists STICKY)
//        S = Slippery (weak STICKY, resists CRUNCH). Kings (k*) and champions (x*) inherit from their base monster.
import { MOBS } from '../src/sim/mobs';
import { WORLDS, ROOM_FOES, STAGES } from '../src/sim/stages';
import type { MobKind } from '../src/sim/types';

type T = 'M' | 'F' | 'C' | 'S';
const set = (t: T, s: string): [string, T][] => s.split(' ').map(k => [k, t]);
const BASE: Record<string, T> = Object.fromEntries([
  // ordinary monsters
  ...set('M', 'bun garlic icepop cheesemouse pea yogurt marsh noodle raisin straw duck glove scrub napkin skewer corn caterpillar boxbot coupon bag cracker2'),
  ...set('F', 'pepper bacon popcorn sausage imp kettle soda bubble candle gravy roast firefly charcoal patty ketchup peapod tomato scanner'),
  ...set('C', 'salt egg carrot pickle crumbcube meatball cracker cheerio can plate mug fork ladle teapot beetle snail pumpkin can2 melon cherrysoldier fruitknight'),
  ...set('S', 'jamhop worm ant icebat jelly milk mitt bee flour eel teacake wasp toadstool ladybug mole radish banana trolley pudding peel'),
  // summons and splits: the same type as whoever calls them
  ...set('S', 'jellybit crouton lid'), ...set('C', 'minicheerio'), ...set('M', 'sporeling sprout'), ...set('F', 'chunk'),
  // mimics
  ...set('C', 'mimic'), ...set('M', 'cereal'),
  // world bosses
  ...set('C', 'toast jar fruitcake'), ...set('M', 'golem moldking brussels'), ...set('F', 'dragon meatloaf'), ...set('S', 'stale tupper'),
  // minibosses
  ...set('C', 'm1a m1d m2c m3b m3e m4b m5c m6c m6d m7c m8b m9c m9e m10c'),
  ...set('F', 'm1b m2e m3a m4d m4e m5e m6a m6b m7a m8a m8c m9d m10e'),
  ...set('M', 'm1c m2a m2d m3c m4c m5a m7b m7d m8e m9b m10a'),
  ...set('S', 'm1e m2b m3d m4a m5b m5d m6e m7e m8d m9a m10b m10d'),
  // nemeses: weak to what their rival kaiju is best at (never resisting it)
  ...set('C', 'nbeet ncrow npine nlamp nshroom nslug ncookie nbrulee nshark ngorilla nbear'), ...set('M', 'nrat nginger nhornet'),
  ...set('S', 'nkebab nnacho nmouse nbird ngelato'), ...set('F', 'nhare'),
]);
const typeOf = (k: string): T | undefined => BASE[k] ?? (/^[kx]/.test(k) ? BASE[k.slice(1)] : undefined);
const ICON: Record<T, string> = { M: '🔥', F: '❄️', C: '🔨', S: '🍬' };
const RES: Record<T, string> = { M: '❄️', F: '🔥', C: '🍬', S: '🔨' };

const missing = Object.keys(MOBS).filter(k => !typeOf(k));
const extra = Object.keys(BASE).filter(k => !(k in MOBS));
console.log('missing:', missing.join(' ') || 'none', '| unknown keys:', extra.join(' ') || 'none', '| kinds:', Object.keys(MOBS).length);

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
