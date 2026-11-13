// Elemental weaknesses (docs/WEAKNESS-DESIGN.md): the type table, the hit rules in the sim, the stage summary, re-season.
import { describe, expect, it, vi } from 'vitest';
import { Bot, SKILLED } from '../src/sim/bot';
import { CLASSES } from '../src/sim/classes';
import { ELEMENT_TUNE, RESEASON_PRICE } from '../src/sim/elementTune';
import {
  type Element, ELEMENTS, ELEMENT_INFO, FX_ELEMENTS, MONSTER_TYPES, type MonsterType, affinity, baseKindOf, canReseason, elementDmgMul, elementOfGear,
  elementOfSkill, elementsOfFx, elementsOfGear, elementsOfSkill, pickElement, reseasonCost, reseasonItem, resistOf, stageElements, stageMatch, typeOf,
  untypedKinds, weakOf,
} from '../src/sim/elements';
import { dailyStage, endlessFloor, rushStages } from '../src/sim/free';
import { GEAR, gearSkillOf } from '../src/sim/gear';
import { BASES, type Item, UNIQUES, itemName, rollItem } from '../src/sim/items';
import { BOSS_ARMOR, MOBS, nemesisOf } from '../src/sim/mobs';
import { SKILLS, ULTS, skillsOf } from '../src/sim/skills';
import { BONUS_STAGES, ROOM_FOES, STAGES, WORLDS } from '../src/sim/stages';
import { type Derived, derive, newProfile } from '../src/sim/stats';
import { allActives, treeOf } from '../src/sim/tree';
import { type Input, type MobKind, NO_INPUT, type SimEvent, type StageDef } from '../src/sim/types';
import { type Mob, World } from '../src/sim/world';
import { decode, encode } from '../src/net/relay';

const KINDS = Object.keys(MOBS) as MobKind[];
const TYPES = Object.keys(MONSTER_TYPES) as MonsterType[];
// one plain monster of each type (no shield, no armour, nothing special): Moldy Bun, Sizzle Bacon, Fork Soldier, Jam Blob
const M: MobKind = 'bun', F: MobKind = 'bacon', C: MobKind = 'fork', S: MobKind = 'jamhop';

const flat: StageDef = {
  id: 't', world: 1, num: 't', name: 't', bg: 'bg-far', mid: '', tile: 'tile-ground', platTint: 0xffffff, width: 2400, groundY: 400, lv: [3, 3], par: 60, rec: 1,
  platforms: [], ladders: [], mobs: [],
};
let nid = 1;
const item = (base: string, extra: Partial<Item> = {}): Item => ({ id: nid++, base, rarity: 3, ilvl: 5, plus: 0, lines: [], grade: 1, ...extra });
type Hit = Extract<SimEvent, { t: 'hit' }>;
const LV = 30;
/** A hero with every skill learned, no crits and a fixed damage roll (rand 0.5 = exactly x1.0), so hit numbers are exact. */
function world(sp: number, o: { lv?: number; weapon?: Item; edit?: (d: Derived) => void; seed?: number } = {}): World {
  const p = newProfile(sp); p.level = o.lv ?? LV;
  for (const s of [...skillsOf(sp).actives, skillsOf(sp).passive]) if (p.level >= s.unlock) p.skills[s.id] = 1;
  if (o.weapon) p.equip = { weapon: o.weapon };
  const d = derive(p); d.crit = 0; d.maxHp = 1e9;
  o.edit?.(d);
  const w = new World(flat, d, o.seed ?? 1);
  w.rand = () => 0.5;
  w.hero.x = 500; w.hero.face = 1;
  return w;
}
/** a monster that stands still and can't die; hold = which status pins it (so the other statuses can be measured) */
function dummy(w: World, kind: MobKind, dx = 60, hold: 'glued' | 'frozen' | 'none' = 'glued', lv = w.hero.d.level): Mob {
  const m = w.spawnMob(kind, w.hero.x + dx, lv); m.hp = m.maxHp = 1e9;
  if (hold !== 'none') m[hold] = 99;
  return m;
}
const press = (w: World, inp: Partial<Input>, frames: number, each?: () => void): SimEvent[] => {
  const ev: SimEvent[] = [];
  for (let i = 0; i < frames; i++) { ev.push(...w.step(i === 0 ? { ...NO_INPUT, ...inp } : NO_INPUT)); each?.(); }
  return ev;
};
const mobHits = (ev: SimEvent[]) => ev.filter((e): e is Hit => e.t === 'hit' && e.target === 'mob');
const slotOf = (w: World, id: string): Partial<Input> => ({ [(['skill1', 'skill2', 'skill3'] as const)[w.hero.d.actives.findIndex(a => a.id === id)]]: true });
/** the first hit a move lands on one monster of this kind */
function hitOn(sp: number, kind: MobKind, inp: (w: World) => Partial<Input>, o: Parameters<typeof world>[1] = {}, frames = 150, dx = 60): { hit: Hit; all: Hit[]; w: World; m: Mob } {
  const w = world(sp, o), m = dummy(w, kind, dx);
  const all = mobHits(press(w, inp(w), frames));
  expect(all.length, `${kind}: the move hit`).toBeGreaterThan(0);
  return { hit: all[0], all, w, m };
}
const near = (a: number, b: number, tol = 0.012) => expect(Math.abs(a - b), `${a} vs ${b}`).toBeLessThan(tol);

describe('monster types', () => {
  it('four elements with an icon and a colour, four types with a fixed weak / resist pair', () => {
    expect(ELEMENTS.slice().sort()).toEqual(['COLD', 'CRUNCH', 'HOT', 'STICKY']);
    expect(ELEMENT_INFO.HOT).toMatchObject({ icon: '🔥', color: '#ff7a3c' });
    expect(ELEMENT_INFO.COLD).toMatchObject({ icon: '❄️', color: '#7fd4ff' });
    expect(ELEMENT_INFO.STICKY).toMatchObject({ icon: '🍬', color: '#ff8af4' });
    expect(ELEMENT_INFO.CRUNCH).toMatchObject({ icon: '🔨', color: '#e8e0c8' });
    expect(MONSTER_TYPES.MELTY).toMatchObject({ weakTo: 'HOT', resists: 'COLD' });
    expect(MONSTER_TYPES.FIERY).toMatchObject({ weakTo: 'COLD', resists: 'HOT' });
    expect(MONSTER_TYPES.CRUSTY).toMatchObject({ weakTo: 'CRUNCH', resists: 'STICKY' });
    expect(MONSTER_TYPES.SLIPPERY).toMatchObject({ weakTo: 'STICKY', resists: 'CRUNCH' });
    // every element is one type's weakness and one other type's resistance
    for (const el of ELEMENTS) { expect(TYPES.filter(t => MONSTER_TYPES[t].weakTo === el).length).toBe(1); expect(TYPES.filter(t => MONSTER_TYPES[t].resists === el).length).toBe(1); }
  });
  it('every monster kind has a type, and its weakness and resistance are that type\'s pair', () => {
    expect(untypedKinds()).toEqual([]);
    expect(KINDS.length).toBeGreaterThanOrEqual(209);
    for (const k of KINDS) {
      const t = MONSTER_TYPES[typeOf(k)];
      expect(weakOf(k), k).toBe(t.weakTo); expect(resistOf(k), k).toBe(t.resists);
      expect(weakOf(k)).not.toBe(resistOf(k));
      expect(ELEMENTS.map(el => affinity(k, el)).sort()).toEqual([-1, 0, 0, 1]);
    }
  });
  it('Kings and champions inherit from their base monster (by rule: none is listed by hand)', () => {
    const kings = KINDS.filter(k => MOBS[k].king), champs = WORLDS.map(w => w.elite);
    expect(kings.length).toBe(30); expect(champs.length).toBe(10);
    for (const k of [...kings, ...champs]) {
      const base = baseKindOf(k);
      expect(base, k).toBeTruthy();
      expect(MOBS[base!].art, k).toBe(MOBS[k].art); // the same monster, bigger
      expect(typeOf(k), k).toBe(typeOf(base!));
    }
    for (const k of kings) expect(MOBS[k].name).toBe(`King ${MOBS[baseKindOf(k)!].name}`);
    for (const k of champs) expect(MOBS[k].name).toBe(MOBS[baseKindOf(k)!].name);
    // and nothing else is treated as a copy of another monster
    for (const k of KINDS) if (!kings.includes(k) && !champs.includes(k)) expect(baseKindOf(k), k).toBeUndefined();
  });
  it('summons and splits share their caller\'s type', () => {
    const pairs = KINDS.flatMap(k => [MOBS[k].calls, MOBS[k].split].filter((c): c is MobKind => !!c).map(c => [k, c] as const));
    for (const want of [['jelly', 'jellybit'], ['cheerio', 'minicheerio'], ['moldking', 'sporeling'], ['stale', 'crouton'], ['brussels', 'sprout'], ['meatloaf', 'chunk'], ['tupper', 'lid']])
      expect(pairs.some(([k, c]) => k === want[0] && c === want[1]), want.join(' calls ')).toBe(true);
    for (const [k, c] of pairs) expect(typeOf(c), `${k} -> ${c}`).toBe(typeOf(k));
  });
  it('the table matches the design note: totals, world bosses, boss-room foes', () => {
    const count = (ks: MobKind[]) => (['HOT', 'COLD', 'CRUNCH', 'STICKY'] as Element[]).map(el => ks.filter(k => weakOf(k) === el).length);
    expect(count([...new Set(WORLDS.flatMap(w => w.pool.map(p => p[1])))])).toEqual([21, 18, 21, 20]);
    expect(count(KINDS.filter(k => /^m\d/.test(k)))).toEqual([11, 13, 14, 12]);
    expect(count(KINDS.filter(k => MOBS[k].king))).toEqual([7, 7, 10, 6]);
    expect(count(WORLDS.map(w => w.elite))).toEqual([1, 2, 7, 0]);
    expect(count(WORLDS.map(w => w.boss))).toEqual([3, 2, 3, 2]);
    expect(WORLDS.map(w => weakOf(w.boss))).toEqual(['CRUNCH', 'HOT', 'COLD', 'CRUNCH', 'HOT', 'STICKY', 'HOT', 'COLD', 'STICKY', 'CRUNCH']);
    expect(ROOM_FOES[1].map(weakOf)).toEqual(['HOT', 'CRUNCH', 'HOT', 'STICKY', 'COLD', 'CRUNCH', 'COLD', 'STICKY']);
    expect(ROOM_FOES[10].map(weakOf)).toEqual(['CRUNCH', 'HOT', 'CRUNCH', 'STICKY', 'STICKY', 'STICKY', 'HOT', 'COLD']);
    expect(weakOf('mimic')).toBe('CRUNCH'); expect(weakOf('cereal')).toBe('HOT');
  });
});

describe('what carries an element', () => {
  it('effects map to elements; utility effects are never one; poison is HOT or STICKY', () => {
    expect(elementsOfFx('burn')).toEqual(['HOT']); expect(elementsOfFx('freeze')).toEqual(['COLD']);
    expect(elementsOfFx('glue')).toEqual(['STICKY']); expect(elementsOfFx('slow')).toEqual(['STICKY']); expect(elementsOfFx('shatter')).toEqual(['CRUNCH']);
    expect(elementsOfFx('poison')).toEqual(['HOT', 'STICKY']);
    for (const fx of ['launch', 'pull', 'heal', 'crumbs', undefined]) expect(elementsOfFx(fx)).toEqual([]);
    expect(elementsOfFx(['slow', 'glue', 'burn'])).toEqual(['STICKY', 'HOT']);
    expect(Object.keys(FX_ELEMENTS).sort()).toEqual(['burn', 'freeze', 'glue', 'poison', 'shatter', 'slow']);
    // poison picks whichever is better for the player; a single element is what it is
    expect(pickElement(M, ['HOT', 'STICKY'])).toEqual({ el: 'HOT', w: 1 }); expect(pickElement(S, ['HOT', 'STICKY'])).toEqual({ el: 'STICKY', w: 1 });
    expect(pickElement(F, ['HOT', 'STICKY'])).toEqual({ el: 'STICKY', w: 0 }); expect(pickElement(C, ['HOT', 'STICKY'])).toEqual({ el: 'HOT', w: 0 });
    expect(pickElement(F, ['HOT'])).toEqual({ el: 'HOT', w: -1 }); expect(pickElement(F, [])).toBeUndefined(); expect(pickElement(F, undefined)).toBeUndefined();
  });
  it('the multipliers come from the one constants block', () => {
    expect(ELEMENT_TUNE).toEqual({ weakDmg: 1.4, weakStatus: 1.25, resistDmg: 0.7, resistStatus: 0.5, bossWeakDmg: 1.25, bossResistDmg: 0.85 });
    expect(elementDmgMul(M, 1)).toBe(1.4); expect(elementDmgMul(M, -1)).toBe(0.7); expect(elementDmgMul(M, 0)).toBe(1);
    expect(elementDmgMul('golem', 1)).toBe(1.25); expect(elementDmgMul('golem', -1)).toBe(0.85);
    expect(elementDmgMul('kbun', 1)).toBe(1.4); expect(elementDmgMul('nrat', 1)).toBe(1.4); // Kings, minibosses and nemeses are not world bosses
  });
  it('skills: the eight approved tags, the three explicit cases, and statuses that already exist', () => {
    const by = (id: string) => Object.values(SKILLS).flatMap(s => s.actives).find(a => a.id === id)!;
    const tags: Record<string, Element> = { jamspin: 'STICKY', quake: 'CRUNCH', wave: 'COLD', crash: 'CRUNCH', steam: 'HOT', chocoslam: 'CRUNCH', bubbletrap: 'STICKY', tide: 'COLD' };
    for (const [id, el] of Object.entries(tags)) { expect(by(id).el, id).toBe(el); expect(elementsOfSkill(by(id)), id).toEqual([el]); }
    // wrong-guess cases: a frosting patch is an ice zone but STICKY; bubbles reuse `frozen` but are STICKY; Icicle Rain slows but is COLD
    expect(elementsOfSkill(by('cakebomb'))).toEqual(['STICKY']); expect(elementsOfSkill(by('bubbletrap'))).toEqual(['STICKY']); expect(elementsOfSkill(ULTS[9])).toEqual(['STICKY']);
    const icicle = allActives(17).find(a => a.id === 'iciclerain')!;
    expect(icicle.slow).toBe(true); expect(elementsOfSkill(icicle)).toEqual(['COLD']);
    // skills that apply a status today carry it without a tag
    const has: Record<string, Element> = { dive: 'HOT', wasabi: 'HOT', salsabomb: 'HOT', mustard: 'STICKY', guacpool: 'STICKY', vineswing: 'STICKY', slothtime: 'STICKY', jiggle: 'STICKY', scoop: 'COLD', slide: 'COLD', freeze: 'COLD' };
    for (const [id, el] of Object.entries(has)) { expect(by(id).el, id).toBeUndefined(); expect(elementOfSkill(by(id)), id).toBe(el); }
    expect(elementOfSkill(ULTS[15])).toBe('HOT'); expect(elementOfSkill(ULTS[17])).toBe('COLD'); expect(elementOfSkill(ULTS[16])).toBe('COLD'); expect(elementOfSkill(ULTS[3])).toBe('STICKY');
    // neutral skills stay neutral, and upgrades that add a status add its element
    for (const id of ['seed', 'upper', 'slice', 'bolt', 'ink', 'snap', 'butter', 'spikeroll', 'snowball', 'hops', 'wafflewall']) expect(elementsOfSkill(by(id)), id).toEqual([]);
    expect(elementsOfSkill(by('seed'), { burn: 2 })).toEqual(['HOT']);
    expect(elementsOfSkill(by('slide'), UNIQUES.cherrybomb.mod)).toEqual(['COLD', 'HOT']); // Cherry Bomb Vest: an icy slide with a fiery trail
    expect(elementsOfSkill(by('wave'), UNIQUES.flaskbelt.mod)).toEqual(['COLD']); // a tag is the whole answer
  });
  it('a tree skill copies its template\'s mechanic, not its flavour tag', () => {
    const t = (sp: number, id: string) => allActives(sp).find(a => a.id === id)!;
    expect(t(4, 'moonpillar').el).toBeUndefined(); expect(elementsOfSkill(t(4, 'moonpillar'))).toEqual([]); // built on Bubbling Flasks (tagged COLD)
    expect(elementsOfSkill(t(10, 'bearhug'))).toEqual([]); expect(elementsOfSkill(t(8, 'cocoavortex'))).toEqual([]); expect(elementsOfSkill(t(2, 'brinetide'))).toEqual([]);
    expect(elementsOfSkill(t(11, 'ovenbreath'))).toEqual(['HOT']); expect(elementsOfSkill(t(4, 'dreamdust'))).toEqual(['STICKY']); expect(elementsOfSkill(t(16, 'mintfreeze'))).toEqual(['COLD']);
    // the capstones that add a status give the skill its element (Frozen Berries, Pickled, Eureka!)
    const cap = (sp: number, path: number) => treeOf(sp)[path].nodes.find(n => n.kind === 'cap')!.mod!;
    expect(elementsOfSkill(t(10, 'berrybolt'), cap(10, 2).mod)).toEqual(['COLD']); expect(elementsOfSkill(t(2, 'brinetide'), cap(2, 2).mod)).toEqual(['STICKY']);
    expect(elementsOfSkill(t(1, 'sparkbeaker'), cap(1, 2).mod)).toEqual(['COLD']);
  });
  it('weapons: base gear skills, twists and boss weapons', () => {
    expect(elementsOfGear(item('spatula'))).toEqual(['HOT']); expect(elementsOfGear(item('icepick'))).toEqual(['COLD']); expect(elementsOfGear(item('w-blue2'))).toEqual(['STICKY']);
    expect(elementsOfGear(item('fork'))).toEqual(['STICKY']); // slow
    expect(elementsOfGear(item('spoon'))).toEqual([]); expect(elementOfGear(item('spoon'))).toBeUndefined(); // launch
    expect(elementsOfGear(item('spoon', { twist: { style: 'lob', fx: 'freeze' } }))).toEqual(['COLD']); // the twist replaces the base effect
    expect(elementsOfGear(item('spatula', { twist: { style: 'lob' } }))).toEqual([]);
    expect(elementsOfGear(item('spatula', { twist: { style: 'lob', fx: 'pull' } }))).toEqual([]);
    const boss: Record<string, Element[]> = { toast: ['HOT'], golem: ['COLD'], dragon: ['HOT'], jar: [], moldking: ['HOT', 'STICKY'], stale: ['CRUNCH'], brussels: [], meatloaf: ['STICKY'], tupper: [], fruitcake: [] };
    for (const [b, els] of Object.entries(boss)) expect(elementsOfGear(item(`bw-${b}-gob`)), b).toEqual(els);
    expect(elementsOfGear(item('a-gob'))).toEqual([]); expect(elementsOfGear(undefined)).toEqual([]);
  });
});

describe('hits in the sim', () => {
  const combo = () => ({ attack: true }), guardBreak = () => ({ down: true, attack: true });
  it('plain hits are unchanged on every type: the same number as before, no element on the event', () => {
    for (const [name, inp] of [['combo', combo], ['launcher', () => ({ up: true, attack: true })]] as const) {
      const hits = [M, F, C, S].map(k => hitOn(0, k, inp).hit);
      for (const h of hits) { expect(h.el, name).toBeUndefined(); expect(h.w, name).toBeUndefined(); expect(h.dmg, name).toBe(hits[0].dmg); }
    }
    // the first combo hit is exactly attack x the hit's damage (level gap none, no crit, the roll fixed at x1.0)
    const { hit, w } = hitOn(0, S, combo);
    expect(hit.dmg).toBe(Math.round(w.hero.d.atk * w.hero.d.cls.combo[0].dmg));
    // an air attack and an untagged skill (Seed Spray) too
    for (const k of [M, F, C, S]) {
      const w2 = world(0); dummy(w2, k, 50);
      press(w2, { jump: true }, 6);
      const air = mobHits(press(w2, { attack: true }, 40))[0];
      expect(air, k).toBeTruthy(); expect(air.el).toBeUndefined();
    }
    const seed = [M, F, C, S].map(k => hitOn(0, k, w => slotOf(w, 'seed')).hit);
    for (const h of seed) { expect(h.el).toBeUndefined(); expect(h.dmg).toBe(seed[0].dmg); }
  });
  it('Guard Break is CRUNCH: weak on Crusty, resisted on Slippery, plain numbers elsewhere', () => {
    const [m, f, c, s] = [M, F, C, S].map(k => hitOn(0, k, guardBreak).hit);
    for (const h of [m, f, c, s]) expect(h.el).toBe('CRUNCH');
    expect(c.w).toBe(1); expect(s.w).toBe(-1); expect(m.w).toBeUndefined(); expect(f.w).toBeUndefined();
    expect(m.dmg).toBe(f.dmg);
    near(c.dmg / m.dmg, 1.4); near(s.dmg / m.dmg, 0.7);
    // and the next plain hit carries nothing over
    const w = world(0); dummy(w, C);
    press(w, guardBreak(), 70);
    expect(mobHits(press(w, combo(), 40))[0].el).toBeUndefined();
  });
  it('a skill that burns is HOT: x1.4 on Melty, x0.7 on Fiery (ordinary monsters)', () => {
    const dive = (w: World) => slotOf(w, 'dive'); // Toastbat's Crumb Dive
    const [m, f, c] = [M, F, C].map(k => hitOn(5, k, dive).hit);
    expect([m.el, f.el, c.el]).toEqual(['HOT', 'HOT', 'HOT']);
    expect([m.w, f.w, c.w]).toEqual([1, -1, undefined]);
    near(m.dmg / c.dmg, ELEMENT_TUNE.weakDmg); near(f.dmg / c.dmg, ELEMENT_TUNE.resistDmg);
    // Kings, champions, minibosses and nemeses take the ordinary multipliers (compare with a neutral one of the same kind of monster)
    const king = hitOn(5, 'kbun', dive).hit, kingN = hitOn(5, 'kfork', dive).hit;
    expect(king.w).toBe(1); near(king.dmg / kingN.dmg, 1.4);
  });
  it('burn ticks are HOT hits', () => {
    const tick = (k: MobKind) => {
      const { all, w, m } = hitOn(5, k, w => slotOf(w, 'dive'), {}, 100);
      expect(m.burn, k).toBeGreaterThan(0);
      const ticks = all.slice(1);
      expect(ticks.length, k).toBeGreaterThanOrEqual(2);
      expect(new Set(ticks.map(t => t.dmg)).size).toBe(1);
      for (const t of ticks) expect(t.el).toBe('HOT');
      return { t: ticks[0], raw: m.burnDmg, w };
    };
    const m = tick(M), f = tick(F), c = tick(C);
    expect([m.t.w, f.t.w, c.t.w]).toEqual([1, -1, undefined]);
    expect(c.t.dmg).toBe(Math.round(c.raw)); expect(m.t.dmg).toBe(Math.round(m.raw * 1.4)); expect(f.t.dmg).toBe(Math.round(f.raw * 0.7));
    // world bosses: x1.25 / x0.85
    const g = tick('golem'), d = tick('dragon');
    expect(g.t.dmg).toBe(Math.round(g.raw * 1.25)); expect(d.t.dmg).toBe(Math.round(d.raw * 0.85));
  });
  it('world bosses swing less (x1.25 / x0.85) and every older rule still multiplies', () => {
    const dive = (w: World) => slotOf(w, 'dive');
    const golem = hitOn(5, 'golem', dive, {}, 60, 90).hit, toast = hitOn(5, 'toast', dive, {}, 60, 90).hit, dragon = hitOn(5, 'dragon', dive, {}, 60, 90).hit;
    expect([golem.w, toast.w, dragon.w]).toEqual([1, undefined, -1]);
    near(golem.dmg / toast.dmg, ELEMENT_TUNE.bossWeakDmg); near(dragon.dmg / toast.dmg, ELEMENT_TUNE.bossResistDmg);
    // a gear skill on a world boss: 40% (gearVs) x boss armour x the boss weak multiplier, against the same throw on a weak ordinary monster
    const hot = () => item('spoon', { twist: { style: 'throw', fx: 'burn' } });
    const onBoss = hitOn(0, 'golem', () => ({ gear: true }), { weapon: hot() }, 60, 120).hit, onMob = hitOn(0, M, () => ({ gear: true }), { weapon: hot() }, 60, 120).hit;
    expect(onBoss.w).toBe(1); expect(onMob.w).toBe(1);
    near(onBoss.dmg / onMob.dmg, 0.4 * BOSS_ARMOR.take * 1.25 / 1.4);
    // frozen +30% and the weak multiplier stack by multiplying
    const w1 = world(5), a = dummy(w1, M, 60, 'frozen');
    const frozenHit = mobHits(press(w1, slotOf(w1, 'dive'), 30))[0];
    expect(a.frozen).toBeGreaterThan(0);
    near(frozenHit.dmg / hitOn(5, C, dive).hit.dmg, 1.3 * 1.4);
  });
  it('the element belongs to the hit, not to what the hero is doing', () => {
    // Norigon breathes fire (a HOT skill, state "skill") while its plain gear skill is still raining down further away
    const w = world(7, { weapon: item('w-nori1', { twist: { style: 'rain', fx: 'launch' } }) });
    dummy(w, M, 300); // out of the breath's reach, under the last falling copy
    press(w, { gear: true }, 20);
    let first: Hit | undefined, state = '';
    for (let i = 0; i < 50 && !first; i++) { const ev = mobHits(w.step(i === 0 ? { ...NO_INPUT, ...slotOf(w, 'wasabi') } : NO_INPUT)); if (ev.length) { first = ev[0]; state = w.hero.state; } }
    expect(first).toBeTruthy();
    expect(state).toBe('skill'); // mid-breath
    expect(first!.el).toBeUndefined(); expect(first!.w).toBeUndefined(); // the weapon's hit stays plain on a monster weak to HOT
    // Hotchog's mustard keeps its element after the cast is over: the goo it leaves behind is still a STICKY hit
    const w3 = world(15), m3 = dummy(w3, S, 170, 'frozen');
    let goo: Hit | undefined, st3 = '';
    for (let i = 0; i < 120 && !goo; i++) { const ev = mobHits(w3.step(i === 0 ? { ...NO_INPUT, ...slotOf(w3, 'mustard') } : NO_INPUT)); if (ev.length) { goo = ev[0]; st3 = w3.hero.state; } }
    expect(st3).not.toBe('skill');
    expect(goo!.el).toBe('STICKY'); expect(goo!.w).toBe(1); expect(m3.glued).toBeGreaterThan(0);
  });
  it('poison (Mold Crown weapons) is HOT or STICKY, whichever is better: never resisted, ticks included', () => {
    const res = (k: MobKind) => {
      const { all, m } = hitOn(0, k, () => ({ gear: true }), { weapon: item('bw-moldking-gob') }, 160, 120);
      expect(m.tox, k).toBe(true);
      return all.filter(h => h.el);
    };
    for (const k of [M, S]) { const h = res(k); expect(h.length).toBeGreaterThan(1); for (const x of h) expect(x.w, k).toBe(1); }
    for (const k of [F, C]) { const h = res(k); expect(h.length).toBeGreaterThan(1); for (const x of h) expect(x.w, k).toBeUndefined(); }
    expect(res(M)[0].el).toBe('HOT'); expect(res(S)[0].el).toBe('STICKY');
  });
});

describe('status durations', () => {
  /** the longest a status got on the monster in the frames after the move */
  const peak = (sp: number, kind: MobKind, id: string, what: 'frozen' | 'glued' | 'slow', hold: 'glued' | 'frozen', dx = 60, o: Parameters<typeof world>[1] = {}, inp?: Partial<Input>) => {
    const w = world(sp, o), m = dummy(w, kind, dx, hold);
    let top = 0;
    press(w, inp ?? slotOf(w, id), 150, () => { if (m[what] < 90) top = Math.max(top, m[what]); });
    return top;
  };
  it('freeze: x1.25 on a monster weak to COLD, x0.5 on one that resists it', () => {
    near(peak(17, C, 'freeze', 'frozen', 'glued'), 2.5, 0.05);   // Pengwhip's Deep Freeze, neutral
    near(peak(17, F, 'freeze', 'frozen', 'glued'), 3.125, 0.05);  // Fiery: weak to COLD
    near(peak(17, M, 'freeze', 'frozen', 'glued'), 1.25, 0.05);  // Melty: resists COLD
  });
  it('glue: x1.25 on Slippery, x0.5 on Crusty', () => {
    near(peak(15, M, 'mustard', 'glued', 'frozen', 170), 2.5, 0.05); // Hotchog's Mustard Glue
    near(peak(15, S, 'mustard', 'glued', 'frozen', 170), 3.125, 0.05);
    near(peak(15, C, 'mustard', 'glued', 'frozen', 170), 1.25, 0.05);
  });
  it('slow: gear effects scale the same way', () => {
    const syrupy = () => item('spoon', { twist: { style: 'throw', fx: 'slow' } });
    const slow = (k: MobKind) => peak(0, k, '', 'slow', 'glued', 120, { weapon: syrupy() }, { gear: true });
    near(slow(M), 3, 0.05); near(slow(S), 3.75, 0.05); near(slow(C), 1.5, 0.05);
    const frosty = () => item('spoon', { twist: { style: 'throw', fx: 'freeze' } });
    const frz = (k: MobKind) => peak(0, k, '', 'frozen', 'glued', 120, { weapon: frosty() }, { gear: true });
    near(frz(C), 1.4, 0.05); near(frz(F), 1.75, 0.05); near(frz(M), 0.7, 0.05);
  });
  it('bosses stay immune to freeze and glue (they are slowed instead), and that slow scales too', () => {
    const w = world(17), boss = dummy(w, 'dragon', 100, 'none'); // Fiery boss: weak to COLD
    let slow = 0, frozen = 0, hit: Hit | undefined;
    for (let i = 0; i < 80; i++) { const ev = mobHits(w.step(i === 0 ? { ...NO_INPUT, ...slotOf(w, 'freeze') } : NO_INPUT)); hit ??= ev[0]; slow = Math.max(slow, boss.slow); frozen = Math.max(frozen, boss.frozen); }
    expect(frozen).toBe(0); near(slow, 3 * 1.25, 0.05);
    expect(hit!.el).toBe('COLD'); expect(hit!.w).toBe(1);
    const w2 = world(15), b2 = dummy(w2, 'stale', 170, 'none'); // Slippery boss: weak to STICKY
    let s2 = 0;
    press(w2, slotOf(w2, 'mustard'), 120, () => { s2 = Math.max(s2, b2.slow); });
    expect(b2.glued).toBe(0); near(s2, 2.5 * 1.25, 0.05);
  });
});

describe('the three explicit-tag cases', () => {
  it('Velvaroo\'s frosting patch is STICKY, although it is an ice zone', () => {
    const go = (k: MobKind) => {
      // (a cupcake that hits a monster in the air bursts on it and leaves no patch: this one lands just short of the monster)
      const w = world(18);
      press(w, slotOf(w, 'cakebomb'), 10);
      const m = dummy(w, k, 340);
      let slow = 0;
      const hits = mobHits(press(w, {}, 150, () => { slow = Math.max(slow, m.slow); }));
      const z = w.zones.find(q => q.kind === 'ice');
      return { hit: hits[0], slow, zoneEls: z?.els };
    };
    const s = go(S), f = go(F), c = go(C);
    expect(s.zoneEls).toEqual(['STICKY']);
    expect(s.hit.el).toBe('STICKY'); expect(s.hit.w).toBe(1);
    expect(f.hit.el).toBe('STICKY'); expect(f.hit.w).toBeUndefined(); // a Fiery monster (weak to COLD) is not weak to frosting
    expect(c.hit.w).toBe(-1);
    near(s.slow, 1.25, 0.05); near(f.slow, 1, 0.05); near(c.slow, 0.5, 0.05);
  });
  it('Pengwhip\'s Icicle Rain is COLD, although what it applies is a slow', () => {
    const icicle = allActives(17).find(a => a.id === 'iciclerain')!;
    const go = (k: MobKind) => {
      const w = world(17, { edit: d => { d.actives = [icicle, ...d.actives.slice(1)]; d.skillLv[icicle.id] = 1; } }), m = dummy(w, k, 200);
      let slow = 0;
      const hits = mobHits(press(w, { skill1: true }, 150, () => { slow = Math.max(slow, m.slow); }));
      return { hit: hits[0], slow };
    };
    const f = go(F), s = go(S), m = go(M);
    expect(f.hit.el).toBe('COLD'); expect(f.hit.w).toBe(1); near(f.slow, 3.75, 0.05);
    expect(s.hit.el).toBe('COLD'); expect(s.hit.w).toBeUndefined(); near(s.slow, 3, 0.05); // Slippery is weak to STICKY, and this is not STICKY
    expect(m.hit.w).toBe(-1); near(m.slow, 1.5, 0.05);
  });
  it('Bubblegumbo\'s bubbles are STICKY, although they hold monsters with `frozen`', () => {
    const go = (k: MobKind) => {
      const w = world(9), m = dummy(w, k, 100);
      const ev = mobHits(press(w, slotOf(w, 'bubbletrap'), 1));
      const held = w.bubbles[0].t;
      const pop = mobHits(press(w, {}, 300)).filter(h => h.el);
      return { first: ev[0], held, pop: pop[pop.length - 1], frozen: m.frozen };
    };
    const s = go(S), f = go(F), c = go(C);
    expect(s.first.el).toBe('STICKY'); expect(s.first.w).toBe(1); expect(s.pop.w).toBe(1); near(s.held, 3.125, 0.05);
    expect(f.first.el).toBe('STICKY'); expect(f.first.w).toBeUndefined(); expect(f.pop.w).toBeUndefined(); near(f.held, 2.5, 0.05); // weak to COLD: not to bubbles
    expect(c.first.w).toBe(-1); expect(c.pop.w).toBe(-1); near(c.held, 1.25, 0.05);
    near(s.pop.dmg / f.pop.dmg, 1.4, 0.02);
  });
});

describe('no dead ends', () => {
  it('every kaiju can produce an element from Lv 1: Guard Break is CRUNCH', () => {
    expect(CLASSES.length).toBe(20);
    for (const c of CLASSES) {
      const { hit } = hitOn(c.species, C, () => ({ down: true, attack: true }), { lv: 1 });
      expect(hit.el, c.name).toBe('CRUNCH'); expect(hit.w, c.name).toBe(1);
    }
  });
  it('plain hits are never resisted and a monster resists only one element', () => {
    for (const k of KINDS) expect(ELEMENTS.filter(el => affinity(k, el) < 0).length, k).toBe(1);
    expect(pickElement('golem', undefined)).toBeUndefined();
  });
  it('a nemesis is weak to an element its rival has from an original skill by Lv 4 (else to CRUNCH) and never resists one', () => {
    for (const c of CLASSES) {
      const nem = nemesisOf(c.species)!;
      expect(nem, c.name).toBeTruthy();
      const early = [...new Set(SKILLS[c.species].actives.filter(a => a.unlock <= 4).flatMap(a => elementsOfSkill(a)))];
      const weak = weakOf(nem);
      if (weak !== 'CRUNCH') expect(early, `${c.name} vs ${MOBS[nem].name}: weak to ${weak}`).toContain(weak);
      expect(early, `${c.name} vs ${MOBS[nem].name}: resists ${resistOf(nem)}`).not.toContain(resistOf(nem));
    }
    // the ones the design note names
    expect(weakOf(nemesisOf(5)!)).toBe('HOT'); expect(weakOf(nemesisOf(16)!)).toBe('COLD'); expect(weakOf(nemesisOf(15)!)).toBe('STICKY'); expect(weakOf(nemesisOf(9)!)).toBe('STICKY');
  });
  it('at most two of a kaiju\'s three original skills carry the same element, and the kaiju that had none now have one', () => {
    for (const c of CLASSES) for (const el of ELEMENTS) expect(SKILLS[c.species].actives.filter(a => elementsOfSkill(a).includes(el)).length, `${c.name} ${el}`).toBeLessThanOrEqual(2);
    for (const sp of [6, 8, 14, 10, 1, 2, 9, 0]) expect(SKILLS[sp].actives.some(a => elementsOfSkill(a).length), String(sp)).toBe(true);
  });
});

describe('stage summary', () => {
  const st = (id: string) => STAGES.find(s => s.id === id)!;
  it('story stages: counts over the spawn kinds, the boss-room foe, the nemesis on stage 5', () => {
    const s = stageElements(st('1-3'));
    const spawn = [...new Set(st('1-3').maps!.flatMap(m => m.spawns?.kinds ?? []))];
    expect(s.kinds.slice().sort()).toEqual(spawn.slice().sort());
    expect(ELEMENTS.reduce((a, el) => a + s.weak[el], 0)).toBe(s.kinds.length);
    for (const el of ELEMENTS) expect(s.weak[el]).toBe(spawn.filter(k => weakOf(k) === el).length);
    expect(s.order.map(o => o.n)).toEqual(s.order.map(o => o.n).slice().sort((a, b) => b - a));
    expect(s.boss).toEqual({ kind: 'm1c', weakTo: 'HOT', resists: 'COLD', worldBoss: false }); // Rolling Pin Rogue
    expect(stageElements(st('1-5')).boss!.kind).toBe('xegg');
    expect(stageElements(st('1-5'), 5).boss).toEqual({ kind: 'nrat', weakTo: 'HOT', resists: 'COLD', worldBoss: false }); // Toastbat's nemesis
    expect(stageElements(st('6-5'), 5).boss!.kind).toBe('xroast'); // Act 2: the nemeses have retired
    expect(stageElements(st('2-10')).boss).toEqual({ kind: 'golem', weakTo: 'HOT', resists: 'COLD', worldBoss: true });
    for (const stage of STAGES) { const e = stageElements(stage, 0); expect(e.boss, stage.id).toBeTruthy(); expect(e.kinds.length, stage.id).toBeGreaterThan(0); expect(e.kinds).not.toContain(e.boss!.kind); }
  });
  it('bonus stages and Free Play stages', () => {
    for (const b of BONUS_STAGES) { const e = stageElements(b); expect(e.boss, b.id).toBeTruthy(); expect(e.kinds.length).toBeGreaterThan(0); }
    const daily = stageElements(dailyStage(20261113, 20));
    expect(daily.kinds.length).toBeGreaterThan(0); expect(daily.boss).toBeTruthy();
    const floor = endlessFloor(3, 20, 7), e3 = stageElements(floor);
    expect(e3.boss).toBeUndefined();
    expect(e3.kinds.slice().sort()).toEqual([...new Set(floor.arenas![0].waves.flat().map(m => m.kind))].sort());
    expect(stageElements(endlessFloor(5, 20, 7)).boss!.kind).toBe(WORLDS[1].elite); // every 5th floor ends with the champion
    expect(stageElements(endlessFloor(10, 20, 7)).boss).toMatchObject({ kind: WORLDS[3].boss, worldBoss: true });
    expect(rushStages([1, 2], 30).map(s => stageElements(s).boss!.kind)).toEqual(['toast', 'golem']);
  });
  it('stageMatch: does this skill or weapon fit the stage', () => {
    const s = stageElements(st('2-10')); // Freezer Golem (weak HOT); the room is mostly weak to HOT too
    expect(stageMatch(['HOT'], s)).toBe('boss'); expect(stageMatch(['COLD'], s)).toBeNull(); expect(stageMatch([], s)).toBeNull();
    const t = stageElements(st('1-3')); // boss weak to HOT, most monsters weak to STICKY
    expect(stageMatch(['STICKY'], t)).toBe('mobs'); expect(stageMatch(['HOT', 'STICKY'], t)).toBe('boss'); expect(stageMatch(['COLD'], t)).toBeNull();
  });
});

describe('the hit event', () => {
  it('online guests get el and w through the event relay unchanged', () => {
    const ev = hitOn(5, M, w => slotOf(w, 'dive')).all.slice(0, 3);
    const msg = decode<{ t: string; ev: SimEvent[] }>(encode({ t: 'snap', s: {}, ev }))!;
    expect(msg.ev).toEqual(ev);
    expect(msg.ev[0]).toMatchObject({ t: 'hit', target: 'mob', el: 'HOT', w: 1 });
    // a plain hit's event has exactly the old fields
    expect(Object.keys(hitOn(0, M, () => ({ attack: true })).hit).sort()).toEqual(['crit', 'dmg', 't', 'target', 'x', 'y']);
  });
});

describe('re-season', () => {
  it('only ordinary weapons: not boss weapons, named legendaries, armour or charms', () => {
    expect(canReseason(item('pin'))).toBe(true); expect(canReseason(item('pin', { twist: { style: 'lob', fx: 'pull' } }))).toBe(true);
    expect(canReseason(item('bw-toast-gob'))).toBe(false);
    expect(canReseason(item('spoon', { rarity: 5, unique: 'jamcrown' }))).toBe(false); // signature legendary
    expect(canReseason(item('spoon', { rarity: 5, unique: 'excalifork' }))).toBe(false);
    expect(canReseason(item('a-gob'))).toBe(false); expect(canReseason(item('cookie'))).toBe(false); expect(canReseason(undefined)).toBe(false);
    for (const [k, b] of Object.entries(BASES)) if (b.slot === 'weapon') expect(canReseason(item(k)), k).toBe(!b.boss);
  });
  it('the price is the named formula: (base + perLv x item level) x rarity', () => {
    expect(RESEASON_PRICE).toEqual({ base: 40, perLv: 40, rarity: [1, 1.3, 1.7, 2.2, 3] });
    expect(reseasonCost(item('pin', { ilvl: 1, rarity: 1 }))).toBe(80);
    expect(reseasonCost(item('pin', { ilvl: 30, rarity: 3 }))).toBe(2108);
    expect(reseasonCost(item('pin', { ilvl: 100, rarity: 5 }))).toBe(12120);
    expect(reseasonCost(item('pin', { ilvl: 30, rarity: 3, plus: 9, grade: 4 }))).toBe(2108); // fortifying or grading a weapon doesn't make it dearer
  });
  it('writes the existing twist: the gear skill and the name follow, the style is kept', () => {
    const pin = item('pin'); // Rolling Pin: Pin Roll (roll, launch)
    const before = Object.keys(pin).sort();
    expect(gearSkillOf(pin)).toEqual(GEAR.pin);
    expect(reseasonItem(pin, 'COLD')).toBe(true);
    expect(pin.twist).toEqual({ style: 'roll', fx: 'freeze' }); // no twist before: it gains one in its base weapon's style
    expect(Object.keys(pin).sort()).toEqual([...before, 'twist'].sort()); // nothing else is written
    expect(itemName(pin)).toBe('Frosty Rolling Pin');
    expect(gearSkillOf(pin)).toEqual({ name: 'Frosty Pin Roll', style: 'roll', fx: 'freeze' });
    expect(elementOfGear(pin)).toBe('COLD');
    expect(reseasonItem(pin, 'COLD')).toBe(false); // already that
    expect(reseasonItem(pin, 'CRUNCH')).toBe(false); // not for sale: Guard Break has it
    expect(reseasonItem(pin, 'HOT')).toBe(true); expect(pin.twist).toEqual({ style: 'roll', fx: 'burn' }); expect(itemName(pin)).toBe('Scorching Rolling Pin');
    const lob = item('spoon', { twist: { style: 'lob', fx: 'launch' } });
    expect(reseasonItem(lob, 'STICKY')).toBe(true);
    expect(lob.twist).toEqual({ style: 'lob', fx: 'glue' }); expect(itemName(lob)).toBe('Sticky Wooden Spoon'); expect(gearSkillOf(lob)!.name).toBe('Sticky Spoon Lob');
    const plain = item('spoon', { twist: { style: 'rain' } }); // a twist with a style only
    expect(reseasonItem(plain, 'HOT')).toBe(true); expect(plain.twist).toEqual({ style: 'rain', fx: 'burn' });
    expect(reseasonItem(item('bw-golem-gob'), 'HOT')).toBe(false); expect(reseasonItem(item('a-gob'), 'HOT')).toBe(false);
    // the re-seasoned weapon plays as its element in a fight
    const { hit } = hitOn(10, F, () => ({ gear: true }), { weapon: pin.twist!.fx === 'burn' ? (reseasonItem(pin, 'COLD'), pin) : pin }, 90, 120);
    expect(hit.el).toBe('COLD'); expect(hit.w).toBe(1);
  });
  it('save side: costs crumbs, refuses what it should, finds held weapons', async () => {
    const mod = await import('../src/save');
    const s = JSON.parse(JSON.stringify(mod.save)) as typeof mod.save;
    const pin = item('pin', { ilvl: 30 }), held = item('spoon', { ilvl: 10, rarity: 2 }), bw = item('bw-toast-gob');
    s.bag.push(pin, bw); s.heroes[0].equip.weapon = held;
    const cost = reseasonCost(pin);
    s.crumbs = cost - 1;
    expect(mod.reseasonBlock(pin, 'COLD', s)).toBe('crumbs'); expect(mod.reseason(pin.id, 'COLD', s)).toBe(0); expect(pin.twist).toBeUndefined(); expect(s.crumbs).toBe(cost - 1);
    s.crumbs = cost + 900;
    expect(mod.reseasonBlock(pin, 'COLD', s)).toBeNull();
    expect(mod.reseason(pin.id, 'COLD', s)).toBe(cost); expect(s.crumbs).toBe(900); expect(itemName(pin)).toBe('Frosty Rolling Pin');
    expect(mod.reseasonBlock(pin, 'COLD', s)).toBe('same'); expect(mod.reseason(pin.id, 'COLD', s)).toBe(0); expect(s.crumbs).toBe(900);
    expect(mod.reseasonBlock(bw, 'HOT', s)).toBe('weapon'); expect(mod.reseason(bw.id, 'HOT', s)).toBe(0);
    expect(mod.reseason(987654, 'HOT', s)).toBe(0);
    expect(mod.reseason(held.id, 'HOT', s)).toBe(reseasonCost(held)); expect(s.heroes[0].equip.weapon!.twist).toEqual({ style: 'throw', fx: 'burn' });
    expect(s.crumbs).toBe(900 - reseasonCost(held));
  });
  it('old saves load unchanged, and their weapons can be re-seasoned', async () => {
    const first = await import('../src/save');
    const old = JSON.parse(JSON.stringify(first.save)) as typeof first.save;
    const twisted: Item = { id: 9001, base: 'w-blue2', rarity: 3, ilvl: 12, plus: 2, lines: [{ k: 'atk', v: 9 }], grade: 2, twist: { style: 'rain', fx: 'slow' } };
    const untwisted: Item = { id: 9002, base: 'pin', rarity: 2, ilvl: 8, plus: 0, lines: [{ k: 'atk', v: 6 }] }; // no grade, no twist: an early save
    old.bag = [twisted, untwisted]; old.crumbs = 5000;
    const json = JSON.stringify(old);
    vi.stubGlobal('localStorage', { getItem: () => json, setItem: () => undefined });
    vi.resetModules();
    try {
      const mod = await import('../src/save');
      expect(mod.save.bag).toEqual([twisted, untwisted]);
      expect(JSON.stringify(mod.save.bag)).toBe(JSON.stringify([twisted, untwisted])); // field for field, no new saved field
      expect(itemName(mod.save.bag[0])).toBe('Syrupy Honey Dipper Mace +2'); expect(elementOfGear(mod.save.bag[0])).toBe('STICKY');
      expect(elementOfGear(mod.save.bag[1])).toBeUndefined();
      expect(mod.reseason(9002, 'COLD')).toBe(reseasonCost(untwisted));
      expect(mod.save.crumbs).toBe(5000 - reseasonCost(untwisted));
      expect(Object.keys(mod.save.bag[1]).sort()).toEqual(['base', 'id', 'ilvl', 'lines', 'plus', 'rarity', 'twist']);
      expect(elementOfGear(mod.save.bag[1])).toBe('COLD');
      expect(Object.keys(mod.save).sort()).toEqual(Object.keys(old).sort());
    } finally { vi.unstubAllGlobals(); vi.resetModules(); }
  });
});

describe('determinism', () => {
  it('the same seed and inputs play out the same, elements and all', () => {
    const play = () => {
      const p = newProfile(5); p.level = 17; // Toastbat: HOT skills, in the Fridge (mostly weak to HOT)
      for (const s of skillsOf(5).actives) p.skills[s.id] = 2;
      let r = 12345; const rand = () => { r = (r * 16807) % 2147483647; return r / 2147483647; };
      p.equip = { weapon: rollItem(1, 3, 17, rand, [], 5, 'fish') }; // Frozen Fish: a COLD gear skill
      const w = new World(STAGES.find(s => s.id === '2-3')!, derive(p), 42, [{ id: 'jam', n: 8 }, null, null, null]);
      const bot = new Bot(w, SKILLED, 9);
      const log: string[] = [];
      for (let i = 0; i < 60 * 40 && !w.cleared && !w.failed; i++) for (const e of w.step(bot.think())) if (e.t === 'hit') log.push(`${i}:${e.target}:${e.dmg}:${e.el ?? '-'}:${e.w ?? 0}`);
      return { log, hp: w.hero.hp, time: w.run.time, kills: w.run.kills, dealt: w.dealt };
    };
    const a = play(), b = play();
    expect(a).toEqual(b);
    expect(a.log.some(l => l.endsWith(':HOT:1'))).toBe(true); // weak hits really happened in that run
    expect(a.log.some(l => l.includes(':mob:') && l.endsWith(':-:0'))).toBe(true); // and plain ones
  });
});
