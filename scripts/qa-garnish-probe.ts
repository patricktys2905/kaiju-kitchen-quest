// QA: Hunter's Nose measured at the drop roll itself. Kills N monsters of a kind inside a chosen map of a real stage and
// counts floor pickups, with and without a garnish, in every case B4 names.   npx vite-node scripts/qa-garnish-probe.ts [N=20000]
import { STAGES, BONUS_STAGES } from '../src/sim/stages';
import { dailyStage, endlessFloor } from '../src/sim/free';
import { World } from '../src/sim/world';
import { derive, newProfile } from '../src/sim/stats';
import { setWorldGarnishes, worldGarnishes, candy, garnishCost, repairGarnish, GARNISH_COST } from '../src/sim/garnish';
import { cookbook, cardNeeds, neverWantedKinds } from '../src/sim/cookbook';
import { DROPS } from '../src/sim/drops';
import { CLASSES } from '../src/sim/classes';
import type { StageDef } from '../src/sim/types';

const N = Number(process.argv[2] ?? 20000);
type Any = any; // eslint-disable-line
function rate(st: StageDef, mapIdx: number, kind: string, worn: unknown[] | null, opts: { done?: boolean; humans?: number; party?: number } = {}) {
  const d = derive(newProfile(0)), party = Array.from({ length: opts.party ?? 0 }, () => derive(newProfile(10)));
  const w = new World(st, d, 77, [], 0, false, undefined, [], undefined, false, party, opts.humans ?? 1) as Any;
  if (worn) setWorldGarnishes(w, worn);
  const m = st.maps?.[mapIdx], x = m ? (m.x0 + m.x1) / 2 : 400;
  if (opts.done && m) w.zones2[mapIdx].done = true;
  let got = 0;
  for (let i = 0; i < N; i++) {
    const mob = w.spawnMob(kind, x, 1);
    const before = w.pickups.length;
    w.killMob(mob);
    got += w.pickups.length - before;
    if (w.pickups.length > 500) w.pickups.length = 0;
    if (w.mobs.length > 200) w.mobs.length = 0;
  }
  return { rate: got / N, got, worn: [...worldGarnishes(w)] };
}
const pct = (r: number) => (r * 100).toFixed(1) + '%';
const line = (label: string, a: { rate: number; got: number }, b: { rate: number; got: number }, expect: string) => console.log(`${label.padEnd(74)} none ${pct(a.rate).padStart(6)} (${a.got}/${N})  worn ${pct(b.rate).padStart(6)} (${b.got}/${N})  diff ${((b.rate - a.rate) * 100).toFixed(1).padStart(5)} pts   expect ${expect}`);

const book = cookbook(), spare = neverWantedKinds();
console.log(`never-wanted kinds: ${spare.length}: ${spare.join(' ')}`);
console.log(`World 11 kinds on page 11: ${book.pages[10]?.kinds.join(' ')}  · never-wanted among them: ${book.pages[10]?.kinds.filter(k => spare.includes(k)).join(' ') || '(none)'}`);
// costs: every kind
{
  let bad = 0;
  for (const k of Object.keys(DROPS)) {
    if (!book.pageOf[k]) { console.log(`  kind ${k} has a drop but no Cookbook page`); continue; }
    const want = spare.includes(k) ? GARNISH_COST.spare : GARNISH_COST.wanted;
    const s: Any = { drops: { [k]: 50 }, cookbook: { [k]: cardNeeds(k)[1] }, heroes: { 0: {} } };
    const r = candy(s, k);
    const r2 = candy(s, k);
    const s0: Any = { drops: { [k]: 50 }, cookbook: { [k]: cardNeeds(k)[0] }, heroes: { 0: {} } }, r0 = candy(s0, k);
    const sShort: Any = { drops: { [k]: want - 1 }, cookbook: { [k]: cardNeeds(k)[1] }, heroes: { 0: {} } }, rS = candy(sShort, k);
    if (!(r.ok && r.cost === want && garnishCost(k) === want && s.drops[k] === 50 - want && !r2.ok && r2.block === 'owned' && s.drops[k] === 50 - want && !r0.ok && r0.block === 'card' && s0.drops[k] === 50 && !rS.ok && rS.block === 'drops')) { bad++; console.log('  COST/RULE MISMATCH', k, JSON.stringify({ r, r2, r0, rS, left: s.drops[k] })); }
  }
  console.log(`candy rules on all ${Object.keys(DROPS).length} kinds (right cost once, never twice, not without a star, not one drop short): ${bad ? bad + ' BAD' : 'all ok'}`);
}
// derive identical
{
  let diff = 0;
  for (const c of CLASSES) for (const lv of [1, 30, 120]) {
    const p = newProfile(c.species); p.level = lv;
    const a = JSON.stringify(derive(p), (k, v) => (typeof v === 'function' ? undefined : v));
    (p as Any).garnish = 'cadet'; (p as Any).garnishGold = true;
    const b = JSON.stringify(derive(p), (k, v) => (typeof v === 'function' ? undefined : v));
    if (a !== b) { diff++; console.log('  DERIVE DIFFERS', c.name, lv); }
  }
  console.log(`derive() with vs without garnish, 20 kaiju x 3 levels: ${diff ? diff + ' DIFFER' : 'identical'}`);
}
const st = STAGES.find(s => s.id === '11-1')!;
const wantsOf = (s: StageDef, i: number) => { const g = s.maps?.[i]?.goal as Any; return g?.kind === 'collect' ? g.wants.map((q: Any) => q.mob) : []; };
console.log('11-1 maps:', st.maps!.map((m, i) => `${i}:${m.kind}[${wantsOf(st, i).join(',')}]`).join('  '));
const z = st.maps!.findIndex((m, i) => wantsOf(st, i).includes('cadet')), z2 = st.maps!.findIndex((m, i) => m.kind === 'zone' && !wantsOf(st, i).includes('cadet')), bossI = st.maps!.findIndex(m => m.kind === 'boss');
line(`11-1 map ${z} still wants cadet (quest roll, pity after 2 misses)`, rate(st, z, 'cadet', null), rate(st, z, 'cadet', ['cadet']), '0 pts (stays 55% + pity)');
line(`11-1 map ${z}, exit already paid (zone done)`, rate(st, z, 'cadet', null, { done: true }), rate(st, z, 'cadet', ['cadet'], { done: true }), '20 -> 35');
line(`11-1 map ${z2} never wants cadet`, rate(st, z2, 'cadet', null), rate(st, z2, 'cadet', ['cadet']), '20 -> 35');
line(`11-1 boss room (map ${bossI})`, rate(st, bossI, 'cadet', null), rate(st, bossI, 'cadet', ['cadet']), '20 -> 35');
line(`11-1 map ${z2}: OTHER kind worn (toffee worn, cadet killed)`, rate(st, z2, 'cadet', null), rate(st, z2, 'cadet', ['toffee']), '0 pts');
const sp = spare[0];
const stS = STAGES.find(s => (s.maps ?? []).some(m => m.spawns?.kinds.includes(sp as Any))) ?? st;
line(`never-wanted kind ${sp} in ${stS.id} map 0`, rate(stS, 0, sp, null), rate(stS, 0, sp, [sp]), '35 -> 50');
const w11spare = book.pages[10].kinds.filter(k => spare.includes(k));
for (const k of w11spare.slice(0, 2)) line(`World 11 never-wanted ${k} in 11-1 map ${z2}`, rate(st, z2, k, null), rate(st, z2, k, [k]), '35 -> 50');
line(`CPU buddy wears it (humans 1, worn [none, cadet])`, rate(st, z2, 'cadet', null, { party: 1 }), rate(st, z2, 'cadet', [undefined, 'cadet'], { party: 1 }), '0 pts');
line(`online friend wears it (humans 2, worn [none, cadet])`, rate(st, z2, 'cadet', null, { party: 1, humans: 2 }), rate(st, z2, 'cadet', [undefined, 'cadet'], { party: 1, humans: 2 }), '20 -> 35');
line(`both humans wear it (humans 2, worn [cadet, cadet])`, rate(st, z2, 'cadet', null, { party: 1, humans: 2 }), rate(st, z2, 'cadet', ['cadet', 'cadet'], { party: 1, humans: 2 }), '20 -> 35 (once)');
line(`friend wears it, quest map ${z} (humans 2)`, rate(st, z, 'cadet', null, { party: 1, humans: 2 }), rate(st, z, 'cadet', [undefined, 'cadet'], { party: 1, humans: 2 }), '0 pts');
const bonus = BONUS_STAGES.find(s => s.id === 'S-11');
if (bonus) { console.log('S-11 maps:', bonus.maps!.map((m, i) => `${i}:${m.kind}[${wantsOf(bonus, i).join(',')}]`).join('  ')); const bi = bonus.maps!.findIndex((m, i) => m.kind === 'zone' && !wantsOf(bonus, i).includes('floss')); if (bi >= 0) line(`S-11 map ${bi} (does not want floss)`, rate(bonus, bi, 'floss', null), rate(bonus, bi, 'floss', ['floss']), '20 -> 35'); const bq = bonus.maps!.findIndex((m, i) => wantsOf(bonus, i).includes('floss')); if (bq >= 0) line(`S-11 map ${bq} (wants floss)`, rate(bonus, bq, 'floss', null), rate(bonus, bq, 'floss', ['floss']), '0 pts'); }
for (let day = 20000; day < 20040; day++) {
  const dd = dailyStage(day, 115), i = (dd.maps ?? []).findIndex(m => m.kind === 'zone');
  if (i < 0) continue;
  const all = dd.maps!.flatMap((m, j) => wantsOf(dd, j)), kind = dd.maps![i].spawns?.kinds.find(k => DROPS[k as keyof typeof DROPS]) as string | undefined;
  if (!kind) continue;
  const wanted = wantsOf(dd, i).includes(kind);
  line(`Daily Dungeon day ${day} (${dd.id}) map ${i}, ${kind} ${wanted ? 'WANTED here' : 'not wanted here'} (${spare.includes(kind) ? 'spare' : 'wanted kind'})`, rate(dd, i, kind, null), rate(dd, i, kind, [kind]), wanted ? '0 pts' : spare.includes(kind) ? '35 -> 50' : '20 -> 35');
  if (!wanted || day > 20003) break;
  void all;
}
{ const e = endlessFloor(3, 115, 5); line(`Endless Pantry floor 3 (maps: ${e.maps ? 'yes' : 'no'})`, rate(e, 0, 'cadet', null), rate(e, 0, 'cadet', ['cadet']), 'no drops at all'); }
// repair
{
  const cases: [string, Any][] = [
    ['old save: no fields', { heroes: { 0: {}, 10: {} } }],
    ['unknown kind in list + worn', { garnishes: ['nope', 'cadet'], heroes: { 0: { garnish: 'nope' }, 10: { garnish: 'cadet' } } }],
    ['worn but not owned', { garnishes: ['cadet'], heroes: { 0: { garnish: 'floss' } } }],
    ['list is a string', { garnishes: 'cadet', heroes: { 0: { garnish: 'cadet' } } }],
    ['list is null', { garnishes: null, heroes: { 0: { garnish: 'cadet' } } }],
    ['list is an object', { garnishes: { cadet: true }, heroes: { 0: { garnish: 'cadet' } } }],
    ['duplicates + junk types', { garnishes: ['cadet', 'cadet', 5, null, {}, 'toString', '__proto__', 'constructor'], heroes: { 0: { garnish: 'toString' }, 1: { garnish: 5 }, 2: { garnish: null }, 3: { garnish: ['cadet'] } } }],
    ['boss kind / kind with no drop', { garnishes: ['flosso', 'toast', 'xcadet'], heroes: { 0: { garnish: 'flosso' } } }],
    ['gold flag saved', { garnishes: ['cadet'], heroes: { 0: { garnish: 'cadet', garnishGold: true } } }],
    ['huge list', { garnishes: Array.from({ length: 50000 }, (_, i) => (i % 2 ? 'cadet' : 'x' + i)), heroes: { 0: { garnish: 'cadet' } } }],
    ['hero entry null', { garnishes: ['cadet'], heroes: { 0: null, 1: 'x' } }],
  ];
  for (const [name, s] of cases) { try { repairGarnish(s); console.log(`repair · ${name}: garnishes=${JSON.stringify(s.garnishes)?.slice(0, 60)} heroes=${JSON.stringify(s.heroes)}`); } catch (e) { console.log(`repair · ${name}: THROWS ${(e as Error).message}`); } }
}
