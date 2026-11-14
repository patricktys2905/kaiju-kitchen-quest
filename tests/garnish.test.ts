// The Garnish (docs/DROPS-USES.md B1 and B4): a worn look with one perk, Hunter's Nose (+15 points to its own monster's
// drop chance), and no power of any kind. Making, owning, wearing, the drop roll, co-op, online fields, saves.
import fs from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import {
  GARNISH_CARD_LEVEL, GARNISH_COST, GARNISH_LUCK, type GarnishSave, candy, garnishBlock, garnishChance, garnishCost, garnishLook, garnishView, garnishesOwned,
  kitGarnish, repairGarnish, setWorldGarnishes, wear, worldGarnishes, wornGarnish,
} from '../src/sim/garnish';
import * as garnishModule from '../src/sim/garnish';
import { baseDropChance, cardNeeds, cookbook, handIn, stageWants } from '../src/sim/cookbook';
import { CLASSES } from '../src/sim/classes';
import { DROPS, DROP_CHANCE, QUEST_DROP_CHANCE, SPARE_DROP_CHANCE, dropIcon } from '../src/sim/drops';
import { BASES, rollItem } from '../src/sim/items';
import { MOBS } from '../src/sim/mobs';
import { BONUS_STAGES, STAGES } from '../src/sim/stages';
import { type HeroProfile, derive, newProfile } from '../src/sim/stats';
import type { Input, MobKind, StageDef } from '../src/sim/types';
import { World } from '../src/sim/world';
import { Bot, SKILLED } from '../src/sim/bot';

const book = cookbook();
const KINDS = Object.keys(DROPS), SPARE = KINDS.filter(k => book.spare.has(k)), WANTED = KINDS.filter(k => !book.spare.has(k));
const stage = (id: string): StageDef => [...STAGES, ...BONUS_STAGES].find(s => s.id === id)!;
const blank = (over: Partial<GarnishSave> = {}): GarnishSave => ({ crumbs: 0, heroes: Object.fromEntries(CLASSES.map(c => [c.species, {}])), ...over });
/** a save whose card for `kind` is at a level (1 discovered, 2 one star, 3 two stars) with `bag` of the drop left */
const withCard = (kind: string, level: 0 | 1 | 2 | 3, bag = 0, s = blank()): GarnishSave => {
  if (level) { s.drops = { ...(s.drops ?? {}), [kind]: 50 }; handIn(s, kind, cardNeeds(kind)[level - 1]); }
  s.drops = { ...(s.drops ?? {}), [kind]: bag }; if (!bag) delete s.drops[kind];
  s.crumbs = 0;
  return s;
};
const kill = (w: World, m: unknown) => (w as unknown as { killMob(m: unknown): void }).killMob(m);

describe('rule B1: a garnish gives no power', () => {
  it('derive(profile) is deep-equal with no garnish and with each of the garnishes, for all 20 kaiju', () => {
    expect(CLASSES.length).toBe(20);
    for (const c of CLASSES) {
      const p = newProfile(c.species); p.level = 40; p.alloc = { str: 30, dex: 30, int: 30, vit: 27 };
      let n = 1, seed = 99 + c.species; const rand = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
      for (const slot of ['weapon', 'armor', 'charm'] as const) { let it; do { it = rollItem(n++, 3, 40, rand, [], c.species); } while (BASES[it.base].slot !== slot || (BASES[it.base].for !== undefined && BASES[it.base].for !== c.species)); p.equip[slot] = it; }
      const plain = derive(p), text = JSON.stringify(plain);
      for (const k of KINDS) {
        const worn = derive({ ...p, garnish: k, garnishGold: true });
        expect(worn, `${c.name} wearing ${k}`).toEqual(plain);
        expect(JSON.stringify(worn)).toBe(text);
      }
    }
  });

  it('the stats code does not know the Garnish exists, and nothing but the drop roll reads it', () => {
    expect(fs.readFileSync('src/sim/stats.ts', 'utf8')).not.toMatch(/garnish/i);
    // the garnish module imports only the Cookbook, the drop table, monster names and types (no stats, items, loot, save)
    const imports = fs.readFileSync('src/sim/garnish.ts', 'utf8').split('\n').filter(l => /^import /.test(l)).join('\n');
    expect(imports).not.toMatch(/items|consumables|loot|stats|save|elements|skills|classes/);
    // in the sim, only world.ts imports it, and uses it on one line: the drop roll in killMob
    for (const f of fs.readdirSync('src/sim').filter(x => x.endsWith('.ts') && x !== 'garnish.ts')) {
      const src = fs.readFileSync(`src/sim/${f}`, 'utf8');
      if (f === 'world.ts') {
        const lines = src.split('\n').filter(l => /garnish/i.test(l) && !/^\s*\/\//.test(l));
        expect(lines.length).toBe(2);
        expect(lines[0]).toBe("import { garnishChance, worldGarnishes } from './garnish';");
        expect(lines[1]).toContain('let drop = this.rand() < (quest ? QUEST_DROP_CHANCE : garnishChance(baseDropChance(m.kind), m.kind, worldGarnishes(this)));');
        const body = src.slice(src.indexOf('private killMob('));
        expect(body.slice(0, body.indexOf('\n  }\n'))).toContain(lines[1]);
      } else expect(src, f).not.toMatch(/from '\.\/garnish'/);
    }
  });

  it('the perk is one constant and one function: there is no perk type to extend', () => {
    expect(GARNISH_LUCK).toBe(0.15);
    // every number the module exports: the perk, and the card level needed to make one
    const numbers = Object.entries(garnishModule).filter(([, v]) => typeof v === 'number').map(([k]) => k).sort();
    expect(numbers).toEqual(['GARNISH_CARD_LEVEL', 'GARNISH_LUCK']);
    expect(Object.entries(garnishModule).filter(([, v]) => v && typeof v === 'object').map(([k]) => k)).toEqual(['GARNISH_COST']);
    expect(GARNISH_COST).toEqual({ wanted: 10, spare: 6 });
    // a view carries looks, ownership and drop chances: no field that could hold a stat
    const v = garnishView(withCard('bun', 3, 20), 'bun')!;
    expect(Object.keys(v).sort()).toEqual(['bag', 'block', 'breaks', 'canMake', 'cardLevel', 'cardOk', 'chance', 'cost', 'dropName', 'gold', 'icon', 'kind', 'name', 'neverWanted', 'owned', 'perk', 'wornBy']);
    expect(v.chance.questWorn).toBe(v.chance.quest);
    expect(Object.keys(v.chance).sort()).toEqual(['plain', 'quest', 'questWorn', 'worn']);
  });
});

describe("Hunter's Nose: the drop chance", () => {
  it('exactly 15 points more for the worn kind in each of the three cases, unchanged for every other kind', () => {
    expect(garnishChance(0.2, 'bun', ['bun'])).toBe(0.35);
    expect(garnishChance(0.35, 'ant', ['ant'])).toBe(0.5);
    expect(garnishChance(0.55, 'bun', ['bun'])).toBe(0.7);
    for (const k of WANTED) { expect(garnishChance(baseDropChance(k), k, [k]), k).toBe(0.35); expect(garnishChance(QUEST_DROP_CHANCE, k, [k]), k).toBe(0.7); }
    for (const k of SPARE) expect(garnishChance(baseDropChance(k), k, [k]), k).toBe(0.5);
    for (const k of KINDS) for (const base of [DROP_CHANCE, SPARE_DROP_CHANCE, QUEST_DROP_CHANCE]) {
      expect(garnishChance(base, k, [])).toBe(base); expect(garnishChance(base, k, undefined)).toBe(base);
      expect(garnishChance(base, k, [k === 'bun' ? 'ant' : 'bun', null, undefined])).toBe(base);
    }
    expect(garnishChance(0.2, 'bun', ['bun', 'bun', 'bun'])).toBe(0.35); // worn by several: added once
    expect(garnishChance(0.95, 'bun', ['bun'])).toBe(1);
  });

  // In a World the roll is `rand() < chance`: fix rand to a value just under or over a threshold and see if a drop falls.
  const st = stage('2-3'), zone = st.maps!.findIndex(m => m.goal?.kind === 'collect');
  const asked = (st.maps![zone].goal as { wants: { mob: MobKind }[] }).wants.map(q => q.mob);
  const plainKind = WANTED.find(k => !Object.keys(stageWants(st)).includes(k) && MOBS[k as MobKind].brain === 'walker')! as MobKind;
  const d = derive(newProfile(0));
  /** does a kill of `kind` drop when the random number is `roll`? `setup` tells the World who wears what */
  const drops = (kind: MobKind, roll: number, setup: (w: World) => void = () => undefined, party: number = 0, humans = 1): boolean => {
    const w = new World(st, d, 11, [], 0, false, undefined, [], undefined, false, Array.from({ length: party }, () => d), humans);
    setup(w);
    const m = w.spawnMob(kind, st.maps![zone].x0 + 500, 5);
    let calls = 0; const real = w.rand; w.rand = () => { calls++; return calls === 1 ? roll : real(); };
    kill(w, m);
    return w.pickups.length === 1;
  };
  const wearing = (...worn: unknown[]) => (w: World) => setWorldGarnishes(w, worn);

  it('in a stage: 20 -> 35 away from its exit, 35 -> 50 for a never-wanted kind', () => {
    expect(asked.length).toBeGreaterThan(0); expect(plainKind).toBeTruthy();
    const cases: [MobKind, number][] = [[plainKind, 0.2], ['ant', 0.35]];
    for (const [kind, base] of cases) {
      const lo = base - 0.005, mid = base + 0.145, hi = base + 0.155; // under the plain chance, under the garnish chance, over it
      expect(drops(kind, lo), `${kind} plain`).toBe(true); expect(drops(kind, base + 0.005), `${kind} plain`).toBe(false);
      expect(drops(kind, mid, wearing(kind)), `${kind} worn`).toBe(true); expect(drops(kind, hi, wearing(kind)), `${kind} worn`).toBe(false);
      // someone else's garnish changes nothing for this kind
      const other = kind === 'bun' ? 'worm' : 'bun';
      expect(drops(kind, base + 0.005, wearing(other))).toBe(false); expect(drops(kind, lo, wearing(other))).toBe(true);
    }
  });

  it('while the map\'s exit still wants the kind, worn and not worn give the identical chance (55%); once the exit has its drops the bonus applies', () => {
    for (const kind of asked) {
      for (const roll of [0.001, 0.2, 0.345, 0.5, 0.545, 0.555, 0.6, 0.695, 0.705, 0.9]) {
        const plain = drops(kind, roll), worn = drops(kind, roll, wearing(kind));
        expect(worn, `${kind} at ${roll}`).toBe(plain); expect(plain).toBe(roll < QUEST_DROP_CHANCE);
      }
      // the exit is done (zone finished): the same monster in the same map is a plain 20% roll, and the garnish makes it 35%
      const done = (worn: unknown[]) => (w: World) => { w.zones2[zone].done = true; setWorldGarnishes(w, worn); };
      expect(drops(kind, 0.345, done([]))).toBe(false); expect(drops(kind, 0.345, done([kind]))).toBe(true); expect(drops(kind, 0.355, done([kind]))).toBe(false);
    }
    expect(fs.readFileSync('src/sim/world.ts', 'utf8')).toContain('(quest ? QUEST_DROP_CHANCE : garnishChance(baseDropChance(m.kind), m.kind, worldGarnishes(this)))');
  });

  it('co-op is a team rule: any human player\'s garnish counts for every kill, two wearing the same kind add 15 once', () => {
    // hero 1 (a second human) wears it and hero 0 gets the kill: it still counts
    expect(drops(plainKind, 0.345, wearing(undefined, plainKind), 1, 2)).toBe(true);
    expect(drops(plainKind, 0.355, wearing(undefined, plainKind), 1, 2)).toBe(false);
    // both wear the same kind: 35%, never 50%
    expect(drops(plainKind, 0.345, wearing(plainKind, plainKind), 1, 2)).toBe(true);
    expect(drops(plainKind, 0.355, wearing(plainKind, plainKind), 1, 2)).toBe(false);
    expect(drops(plainKind, 0.495, wearing(plainKind, plainKind), 1, 2)).toBe(false);
    // different kinds: each gets its own 15
    expect(drops('ant', 0.495, wearing(plainKind, 'ant'), 1, 2)).toBe(true); expect(drops(plainKind, 0.345, wearing(plainKind, 'ant'), 1, 2)).toBe(true);
  });

  it('a CPU buddy\'s garnish adds nothing', () => {
    expect(drops(plainKind, 0.345, wearing(undefined, plainKind), 1, 1)).toBe(false); // hero 1 is the CPU buddy
    expect(drops(plainKind, 0.345, wearing(plainKind, 'ant'), 1, 1)).toBe(true); // the player's own still counts
    expect(drops('ant', 0.495, wearing(plainKind, 'ant'), 1, 1)).toBe(false);
    const w = new World(st, d, 3, [], 0, false, undefined, [], undefined, false, [d, d], 2);
    setWorldGarnishes(w, ['bun', 'ant', 'worm']); expect(worldGarnishes(w)).toEqual(['bun', 'ant']); // two humans, then a CPU
  });

  it('a World knows only what it is told: junk and unknown kinds are ignored, nothing told means no garnish', () => {
    const w = new World(st, d, 3);
    expect(worldGarnishes(w)).toEqual([]);
    for (const junk of [null, undefined, 'bun', 7, {}] as unknown[]) { setWorldGarnishes(w, junk as unknown[]); expect(worldGarnishes(w)).toEqual([]); }
    for (const junk of [[null], [undefined], [7], ['no-such-monster'], ['toast'], [['bun']], ['constructor'], ['__proto__'], []] as unknown[][]) { setWorldGarnishes(w, junk); expect(worldGarnishes(w)).toEqual([]); }
    setWorldGarnishes(w, ['bun']); expect(worldGarnishes(w)).toEqual(['bun']);
    setWorldGarnishes(w, []); expect(worldGarnishes(w)).toEqual([]);
    expect(worldGarnishes(new World(st, d, 3))).toEqual([]); // nothing leaks from one stage to the next
  });

  it('the roll is still one random call, with or without a garnish, and the never-three-misses pity is untouched', () => {
    const count = (worn: unknown[]) => {
      const w = new World(st, d, 11); setWorldGarnishes(w, worn);
      const ms = [plainKind, 'ant' as MobKind, asked[0]].map(k => w.spawnMob(k, st.maps![zone].x0 + 500, 5));
      let calls = 0; const real = w.rand; w.rand = () => { calls++; return real(); };
      for (const m of ms) kill(w, m);
      return calls;
    };
    expect(count(['ant'])).toBe(count([])); expect(count([asked[0]])).toBe(count([])); expect(count([plainKind])).toBe(count([]));
    // pity: two misses, then the third kill of a quest monster always drops, garnish or not
    for (const worn of [[], [asked[0]]]) {
      const w = new World(st, d, 11); setWorldGarnishes(w, worn);
      w.rand = () => 0.99;
      const got: number[] = [];
      for (let i = 0; i < 6; i++) { kill(w, w.spawnMob(asked[0], st.maps![zone].x0 + 500, 5)); got.push(w.pickups.length); }
      expect(got).toEqual([0, 0, 1, 1, 1, 2]);
    }
  });
});

describe('the same fight, with and without a garnish', () => {
  // A skilled bot's button presses are recorded once (no garnish) and replayed, so the player does the same thing in every
  // run. Everything a fight is made of goes into the trace at every step: hero position, HP and state, every monster's id,
  // kind, position, HP and state, every hit's damage (dealt and taken), crumbs, stones, XP and kills.
  const world = (id: string, worn: string[]) => {
    const s = stage(id), p = newProfile(0); p.level = s.rec + 6;
    const w = new World(s, derive(p), 7);
    setWorldGarnishes(w, worn);
    w.hero.inv = 1e9; w.hero.d.atk *= 3; // safe and strong, so the fight (kills and respawns) lasts the whole run
    return w;
  };
  const tapes = new Map<string, Input[]>();
  const run = (id: string, worn: string[], emptyBag: boolean, steps = 60 * 150) => {
    const key = `${id}:${emptyBag}`;
    if (!tapes.has(key)) { const w = world(id, []), bot = new Bot(w, SKILLED, 5), out: Input[] = []; for (let i = 0; i < steps; i++) { const inp = { ...bot.think() }; out.push(inp); w.step(inp); if (emptyBag) w.drops = {}; } tapes.set(key, out); }
    const inputs = tapes.get(key)!, w = world(id, worn);
    const stats = JSON.stringify(w.hero.d);
    const trace: string[] = [], hits: string[] = []; let pickups = 0, xp = 0; const fell: Record<string, number> = {}, killed: Record<string, number> = {};
    for (let i = 0; i < steps; i++) {
      const seen = new Set(w.pickups.map(q => q.id));
      const ev = w.step(inputs[i]); if (emptyBag) w.drops = {};
      for (const q of w.pickups) if (!seen.has(q.id)) { pickups++; fell[q.kind] = (fell[q.kind] ?? 0) + 1; }
      for (const e of ev) { if (e.t === 'xp') xp += e.n; if (e.t === 'hit') hits.push(`${i}:${e.target}:${e.dmg}:${e.crit}`); if (e.t === 'mobDie') killed[e.kind] = (killed[e.kind] ?? 0) + 1; }
      trace.push(`${w.hero.x.toFixed(2)},${w.hero.y.toFixed(2)},${w.hero.hp},${w.hero.state}|${w.run.kills},${w.run.crumbs},${w.run.stones},${xp}|` + w.mobs.map(m => `${m.id}:${m.kind}:${m.x.toFixed(2)}:${m.y.toFixed(2)}:${m.hp}:${m.state}`).join(' '));
    }
    return { trace, hits, pickups, fell, killed, xp, stats, statsEnd: JSON.stringify(w.hero.d), crumbs: w.run.crumbs, kills: w.run.kills, bag: { ...w.drops } };
  };
  /** a never-wanted kind this stage spawns (no exit of the stage asks for it) */
  const spareIn = (id: string): string => { const s = stage(id), wants = stageWants(s); return [...new Set((s.maps ?? []).flatMap(m => m.spawns?.kinds ?? []))].find(k => book.spare.has(k) && !wants[k])!; };
  // two stages where the taped run meets and beats a fair number of a never-wanted monster (2-3: Frost Pea, 9-6: the
  // scanner). Picked with scripts/fy-spare.ts: re-pick with it whenever stage layouts move (tests/stage-fingerprint.test.ts).
  const SPARE_STAGES = ['2-3', '9-6'];

  for (const id of SPARE_STAGES) it(`${id}: a garnish on a kind no exit asks for changes the floor pickups and nothing else (the real bag, exits and respawns included)`, () => {
    const kind = spareIn(id);
    const none = run(id, [], false), absent = run(id, ['cereal' === kind ? 'duck' : 'cereal'], false), worn = run(id, [kind], false);
    expect(kind).toBeTruthy(); expect(none.kills).toBeGreaterThan(15); expect(none.killed[kind] ?? 0).toBeGreaterThanOrEqual(3); // a real fight that kills that monster
    expect(absent.trace).toEqual(none.trace); expect(absent.hits).toEqual(none.hits); expect(absent.pickups).toBe(none.pickups);
    expect(worn.trace).toEqual(none.trace); // hero and monster HP, positions, crumbs, stones, XP and kills at every step
    expect(worn.hits).toEqual(none.hits); // every hit's damage, dealt and taken
    expect(worn.xp).toBe(none.xp); expect(worn.crumbs).toBe(none.crumbs); expect(worn.killed).toEqual(none.killed);
    expect(worn.stats).toBe(none.stats); expect(worn.statsEnd).toBe(none.statsEnd);
    // only that kind's pickups may differ, and only upward
    expect(worn.fell[kind] ?? 0).toBeGreaterThanOrEqual(none.fell[kind] ?? 0);
    for (const k of Object.keys({ ...none.fell, ...worn.fell })) if (k !== kind) expect(worn.fell[k], k).toBe(none.fell[k]);
    for (const k of Object.keys({ ...none.bag, ...worn.bag })) if (k !== kind) expect(worn.bag[k as MobKind], k).toBe(none.bag[k as MobKind]);
  });

  it('across those stages the garnish does put more of its drop on the floor', () => {
    let a = 0, b = 0;
    for (const id of SPARE_STAGES) { const kind = spareIn(id); a += run(id, [], false).fell[kind] ?? 0; b += run(id, [kind], false).fell[kind] ?? 0; }
    expect(b).toBeGreaterThan(a);
  });

  // A WANTED kind is different by design: the drop bag opens exits and picks which monster respawns next, so more drops
  // can change how the stage unfolds (the balance check measures that). What must never change is a combat number. So the
  // bag is emptied every step in both runs (the phase-1 method): then every hit, every HP value and every stat is identical.
  for (const id of ['2-3', '6-7']) it(`${id}: a garnish on a kind the exits DO ask for changes no combat number: same damage per hit, same hero stats`, () => {
    const s = stage(id), kind = Object.keys(stageWants(s))[0];
    const none = run(id, [], true), worn = run(id, [kind], true);
    expect(none.killed[kind] ?? 0).toBeGreaterThan(3);
    expect(worn.stats).toBe(none.stats); expect(worn.statsEnd).toBe(none.statsEnd); // the hero's derived stats, start and end
    expect(worn.hits).toEqual(none.hits); // the damage of every hit, dealt and taken, step by step
    expect(worn.trace).toEqual(none.trace);
    expect(worn.xp).toBe(none.xp); expect(worn.crumbs).toBe(none.crumbs);
    // with the bag kept empty the exits want the kind for the whole run, so its quest rolls get no bonus: it can only drop
    // more in maps that do not ask for it. Every other kind is untouched (the quest roll and its pity never see the garnish).
    expect(worn.fell[kind] ?? 0).toBeGreaterThanOrEqual(none.fell[kind] ?? 0);
    for (const k of Object.keys({ ...none.fell, ...worn.fell })) if (k !== kind) expect(worn.fell[k], k).toBe(none.fell[k]);
  });
});

describe('making one (CANDY IT)', () => {
  it('costs 10 of the drop, 6 for the never-wanted kinds', () => {
    expect(SPARE.length + WANTED.length).toBe(KINDS.length);
    for (const k of WANTED) expect(garnishCost(k), k).toBe(10);
    for (const k of SPARE) expect(garnishCost(k), k).toBe(6);
    expect(GARNISH_CARD_LEVEL).toBe(2);
  });

  it('only from a card at one star or better', () => {
    for (const [kind, cost] of [['bun', 10], ['ant', 6]] as const) {
      for (const level of [0, 1] as const) {
        const s = withCard(kind, level, 30), before = JSON.stringify(s);
        expect(garnishBlock(s, kind)).toBe('card');
        expect(garnishView(s, kind)).toMatchObject({ canMake: false, block: 'card', cardOk: false, owned: false, cost, bag: 30, breaks: [] });
        expect(candy(s, kind)).toEqual({ ok: false, kind, cost: 0, block: 'card' });
        expect(JSON.stringify(s)).toBe(before);
      }
      for (const level of [2, 3] as const) {
        const s = withCard(kind, level, 30);
        expect(garnishView(s, kind)).toMatchObject({ canMake: true, block: null, cardOk: true, gold: level === 3 });
        expect(candy(s, kind)).toEqual({ ok: true, kind, cost, block: null });
        expect(s.garnishes).toEqual([kind]); expect(s.drops![kind]).toBe(30 - cost);
      }
    }
  });

  it('needs the drops in the bag, takes exactly the cost, and changes nothing but the bag and the owned list', () => {
    const s = withCard('bun', 2, 9);
    expect(garnishView(s, 'bun')).toMatchObject({ canMake: false, block: 'drops', cardOk: true, bag: 9, cost: 10 });
    expect(candy(s, 'bun').ok).toBe(false); expect(s.garnishes).toBeUndefined(); expect(s.drops).toEqual({ bun: 9 });
    s.drops!.bun = 10; s.crumbs = 123;
    const cookbookBefore = JSON.stringify(s.cookbook), heroes = JSON.stringify(s.heroes);
    expect(candy(s, 'bun').ok).toBe(true);
    expect(s.drops).toEqual({}); // the last one leaves no empty entry
    expect(s.crumbs).toBe(123); expect(JSON.stringify(s.cookbook)).toBe(cookbookBefore); expect(JSON.stringify(s.heroes)).toBe(heroes); // made, not worn
    expect(Object.keys(s).sort()).toEqual(['cookbook', 'crumbs', 'drops', 'garnishes', 'heroes']);
  });

  it('made once, never twice: a second try is refused and costs nothing', () => {
    const s = withCard('milk', 2, 40);
    expect(candy(s, 'milk').ok).toBe(true);
    expect(garnishView(s, 'milk')).toMatchObject({ owned: true, canMake: false, block: 'owned', breaks: [] });
    expect(candy(s, 'milk')).toEqual({ ok: false, kind: 'milk', cost: 0, block: 'owned' });
    expect(s.drops).toEqual({ milk: 30 }); expect(s.garnishes).toEqual(['milk']);
  });

  it('a monster with no drop has no garnish', () => {
    const s = blank({ drops: { toast: 50 } as Record<string, number> });
    for (const k of ['toast', 'no-such-monster', '', 'constructor', '__proto__']) { expect(garnishView(s, k)).toBeNull(); expect(candy(s, k)).toMatchObject({ ok: false, block: 'unknown' }); }
    expect(s.garnishes).toBeUndefined();
  });

  it('the skip warning: making one says which SKIP TO BOSS it would break, and none when nothing breaks', () => {
    const st = STAGES.find(x => /^\d+-\d+$/.test(x.id) && Object.values(stageWants(x)).some(n => n >= 3))!;
    const wants = stageWants(st), kind = Object.keys(wants)[0];
    // the bag pays this stage's skip exactly, plus 9 more of one kind: making its garnish (10) breaks the skip
    const s = withCard(kind, 2, 0); s.drops = { ...wants, [kind]: wants[kind] + 9 };
    const v = garnishView(s, kind, [st])!;
    expect(v.canMake).toBe(true); expect(v.breaks).toEqual([st.id]);
    expect(garnishView(s, kind, [])!.breaks).toEqual([]); // a locked stage's skip is not the player's to lose
    s.drops[kind] = wants[kind] + 10; // one more: the skip survives, no warning
    expect(garnishView(s, kind, [st])!.breaks).toEqual([]);
    s.drops = { [kind]: 10 }; // cannot pay the skip anyway (the other drops are missing): no warning
    expect(garnishView(s, kind, [st])!.breaks).toEqual([]);
    // the warning is data only: candy does not ask (the screen shows CANDY IT / KEEP first)
    s.drops = { ...wants, [kind]: wants[kind] + 9 };
    expect(candy(s, kind).ok).toBe(true); expect(s.drops[kind]).toBe(wants[kind] - 1);
  });

  it('with the real save: the wrapper checks unlocked stages, and candy / wear go through', async () => {
    vi.resetModules();
    const mod = await import('../src/save');
    const s = JSON.parse(JSON.stringify(mod.save)) as typeof mod.save;
    const first = STAGES[0], wants = stageWants(first), kind = Object.keys(wants)[0];
    s.drops = { ...wants, [kind]: wants[kind] + 9 }; s.cookbook = { [kind]: cardNeeds(kind)[1] };
    expect(mod.garnishCard(kind, s)).toMatchObject({ canMake: true, breaks: [first.id], owned: false, gold: false, wornBy: [] });
    const boxes = JSON.stringify(s.boxes), items = JSON.stringify(s.items), bag = JSON.stringify(s.bag), crumbs = s.crumbs;
    expect(mod.candyGarnish(kind, s).ok).toBe(true);
    expect(mod.wearGarnish(0, kind, s)).toBe(true); expect(mod.wearGarnish(10, kind, s)).toBe(true);
    expect(mod.garnishCard(kind, s)).toMatchObject({ owned: true, wornBy: [0, 10], canMake: false });
    expect(mod.garnishOf(0, s)).toMatchObject({ kind, icon: `drop-${kind}`, gold: false });
    expect(mod.garnishPicker(s).map(v => v.kind)).toEqual([kind]);
    expect(mod.kitGarnishOf(0, s)).toEqual({ garnish: kind });
    expect(JSON.stringify(s.boxes)).toBe(boxes); expect(JSON.stringify(s.items)).toBe(items); expect(JSON.stringify(s.bag)).toBe(bag); expect(s.crumbs).toBe(crumbs);
    expect(derive(s.heroes[0])).toEqual(derive({ ...s.heroes[0], garnish: undefined }));
  });
});

describe('owning and wearing', () => {
  const owned = (...kinds: string[]) => blank({ garnishes: kinds });

  it('one per kaiju, any number of kaiju may wear the same one, changing is free', () => {
    const s = owned('bun', 'ant'); s.crumbs = 50; s.drops = { bun: 3 };
    expect(wear(s, 0, 'bun')).toBe(true); expect(wear(s, 10, 'bun')).toBe(true); expect(wear(s, 11, 'ant')).toBe(true);
    expect(garnishView(s, 'bun')!.wornBy).toEqual([0, 10]); expect(garnishView(s, 'ant')!.wornBy).toEqual([11]);
    expect(wear(s, 0, 'ant')).toBe(true); // swapping replaces: one field, one garnish
    expect(s.heroes[0]).toEqual({ garnish: 'ant' });
    expect(garnishView(s, 'bun')!.wornBy).toEqual([10]); expect(garnishView(s, 'ant')!.wornBy).toEqual([0, 11]);
    expect(wear(s, 0, null)).toBe(true); expect('garnish' in s.heroes[0]).toBe(false); expect(wornGarnish(s, 0)).toBeNull();
    expect(s.crumbs).toBe(50); expect(s.drops).toEqual({ bun: 3 }); expect(s.garnishes).toEqual(['bun', 'ant']); // free, and nothing is used up
  });

  it('only an owned garnish can be worn', () => {
    const s = owned('bun');
    for (const k of ['ant', 'toast', 'no-such-monster', '']) expect(wear(s, 0, k), k).toBe(false);
    expect(wear(s, 999, 'bun')).toBe(false);
    expect(s.heroes[0]).toEqual({});
    s.heroes[0].garnish = 'ant'; // put there by hand, not owned: not shown
    expect(wornGarnish(s, 0)).toBeNull(); expect(kitGarnish(s, 0)).toEqual({});
  });

  it('views: the icon is the drop\'s own icon, gold only when the card has two stars, the picker lists owned ones in Cookbook order', () => {
    const s = owned('milk', 'ant', 'bun');
    withCard('bun', 2, 0, s); withCard('ant', 3, 0, s);
    wear(s, 0, 'bun'); wear(s, 10, 'ant');
    expect(wornGarnish(s, 0)).toEqual({ kind: 'bun', icon: dropIcon('bun'), gold: false, name: MOBS.bun.name, dropName: DROPS.bun![0] });
    expect(wornGarnish(s, 10)).toMatchObject({ kind: 'ant', icon: 'drop-ant', gold: true });
    expect(wornGarnish(s, 11)).toBeNull();
    const order = book.pages.flatMap(p => p.kinds);
    const list = garnishesOwned(s);
    expect(list.map(v => v.kind)).toEqual(['milk', 'ant', 'bun'].sort((a, b) => order.indexOf(a as MobKind) - order.indexOf(b as MobKind)));
    expect(list.find(v => v.kind === 'ant')).toMatchObject({ owned: true, gold: true, wornBy: [10], neverWanted: true, chance: { plain: 0.35, worn: 0.5, quest: null, questWorn: null } });
    expect(list.find(v => v.kind === 'bun')).toMatchObject({ owned: true, gold: false, wornBy: [0], neverWanted: false, chance: { plain: 0.2, worn: 0.35, quest: 0.55, questWorn: 0.55 }, perk: `${MOBS.bun.name} drops its item more often, except while an exit is collecting it` });
    for (const v of list) expect(v.icon).toBe(`drop-${v.kind}`);
    // the card reaching two stars later turns the same garnish gold
    withCard('bun', 3, 0, s); expect(wornGarnish(s, 0)!.gold).toBe(true);
  });

  it('every drop has its icon art, so no garnish can be blank', () => {
    for (const k of KINDS) expect(fs.existsSync(`public/art/${dropIcon(k as MobKind)}.webp`), k).toBe(true);
  });

  it('online: the kit fields carry the kind and the gold flag; a friend\'s look is read from the kit alone', () => {
    const s = owned('bun', 'ant'); withCard('ant', 3, 0, s);
    wear(s, 0, 'bun'); wear(s, 10, 'ant');
    expect(kitGarnish(s, 0)).toEqual({ garnish: 'bun' }); expect(kitGarnish(s, 10)).toEqual({ garnish: 'ant', garnishGold: true }); expect(kitGarnish(s, 11)).toEqual({});
    // on a friend's screen (no save): kind and gold come from the kit; a made-up kind draws nothing
    expect(garnishLook({ garnish: 'ant', garnishGold: true })).toMatchObject({ kind: 'ant', icon: 'drop-ant', gold: true });
    expect(garnishLook({ garnish: 'bun' })).toMatchObject({ kind: 'bun', gold: false });
    for (const g of [undefined, null, '', 'toast', 'no-such-monster', 7, ['bun'], { kind: 'bun' }, 'constructor']) expect(garnishLook({ garnish: g, garnishGold: true })).toBeNull();
    expect(garnishLook(null)).toBeNull(); expect(garnishLook({})).toBeNull();
    expect(garnishLook({ garnish: 'bun', garnishGold: 'yes' })!.gold).toBe(false);
    // on your own screen gold comes from your Cookbook, whatever the profile's flag says
    expect(garnishLook({ garnish: 'ant' }, s)!.gold).toBe(true); expect(garnishLook({ garnish: 'bun', garnishGold: true }, s)!.gold).toBe(false);
    // the kit survives the wire (JSON) and the host can feed it to the World
    const kit = JSON.parse(JSON.stringify({ profile: { ...newProfile(10), ...kitGarnish(s, 10) } })) as { profile: HeroProfile };
    const w = new World(stage('2-3'), derive(kit.profile), 3); setWorldGarnishes(w, [kit.profile.garnish]);
    expect(worldGarnishes(w)).toEqual(['ant']);
  });

  it('the CPU buddy keeps its look (and the World ignores it)', async () => {
    vi.resetModules();
    const mod = await import('../src/save');
    mod.save.garnishes = ['bun']; mod.save.heroes[10].garnish = 'bun';
    try {
      const p = mod.buddyProfile(10, 20);
      expect(p.garnish).toBe('bun'); expect(mod.garnishLookOf(p)).toMatchObject({ kind: 'bun', gold: false });
      expect(derive(p)).toEqual(derive({ ...p, garnish: undefined }));
    } finally { delete mod.save.garnishes; delete mod.save.heroes[10].garnish; }
  });
});

describe('never in boxes or the Market, no rarity, grade, fortify or salvage', () => {
  it('a garnish is not an item: no gear slot, base, consumable or shop row has one', () => {
    expect(Object.values(BASES).map(b => b.slot).filter(sl => !['weapon', 'armor', 'charm'].includes(sl))).toEqual([]);
    for (const f of ['items.ts', 'loot.ts', 'consumables.ts', 'gear.ts']) if (fs.existsSync(`src/sim/${f}`)) expect(fs.readFileSync(`src/sim/${f}`, 'utf8'), f).not.toMatch(/garnish/i);
    // in save.ts the word appears only in the field, the load repair and the Garnish wrappers at the bottom
    const src = fs.readFileSync('src/save.ts', 'utf8'), cut = src.indexOf('// ---------- Garnish');
    expect(cut).toBeGreaterThan(0);
    const before = src.slice(0, cut).split('\n').filter(l => /garnish/i.test(l));
    expect(before.length).toBe(4); // the import, the field's comment, the field, the repair call
    for (const fn of ['openBox', 'finishStage', 'buyBox', 'buyGear', 'buyConsumable', 'shopStock', 'salvage', 'fortify', 'regrade']) expect(src.slice(src.indexOf(`export function ${fn}(`), src.indexOf('\n}\n', src.indexOf(`export function ${fn}(`))), fn).not.toMatch(/garnish/i);
  });

  it('opening boxes, clearing stages and shopping never make, change or remove a garnish', async () => {
    vi.resetModules();
    const mod = await import('../src/save');
    const sv = mod.save;
    sv.garnishes = ['bun']; sv.heroes[sv.selected].garnish = 'bun'; sv.crumbs = 1e6;
    try {
      const snap = () => JSON.stringify([sv.garnishes, Object.values(sv.heroes).map(h => h.garnish)]);
      const was = snap();
      for (let i = 0; i < 40; i++) { sv.boxes.push({ tier: (1 + (i % 5)) as 1 | 2 | 3 | 4 | 5, ilvl: 1 + i }); const got = mod.openBox(sv.boxes.length - 1)!; expect(JSON.stringify(got)).not.toMatch(/garnish/i); }
      mod.finishStage('1-1', 'S', [{ tier: 3, ilvl: 2 }], 2, false); mod.finishStage('1-10', 'S', [], 12, true);
      for (const it of mod.shopStock()) expect(JSON.stringify(it)).not.toMatch(/garnish/i);
      mod.buyBox(0); mod.buyBox(1); for (const id of mod.SHOP_ITEMS) { expect(id).not.toMatch(/garnish/i); mod.buyConsumable(id); }
      for (const it of [...mod.shopStock()]) mod.buyGear(it.id);
      mod.salvageWorse();
      expect(snap()).toBe(was);
      expect(JSON.stringify(sv.bag) + JSON.stringify(sv.boxes) + JSON.stringify(sv.items)).not.toMatch(/garnish/i);
    } finally { mod.resetSave(); }
  });
});

describe('saves: old ones load, odd ones are repaired', () => {
  const loadWith = async (edit: (s: Record<string, unknown> & { heroes: Record<number, Record<string, unknown>> }) => void) => {
    vi.unstubAllGlobals(); vi.resetModules();
    const first = await import('../src/save');
    const raw = JSON.parse(JSON.stringify(first.save)) as Record<string, unknown> & { heroes: Record<number, Record<string, unknown>> };
    edit(raw);
    const json = JSON.stringify(raw);
    vi.stubGlobal('localStorage', { getItem: (k: string) => (k === 'kkq-save-v3' ? json : null), setItem: () => undefined });
    vi.resetModules();
    try { return { mod: await import('../src/save'), raw: JSON.parse(json) as typeof raw }; } finally { vi.unstubAllGlobals(); vi.resetModules(); }
  };

  it('an old save (no Garnish fields) loads unchanged under the same key: nothing owned, nothing worn, no field added', async () => {
    const { mod, raw } = await loadWith(s => { s.crumbs = 555; s.drops = { bun: 30 }; s.cookbook = { bun: 5 }; });
    expect(Object.keys(mod.save).sort()).toEqual(Object.keys(raw).sort());
    for (const [sp, h] of Object.entries(mod.save.heroes)) expect(Object.keys(h).sort(), sp).toEqual(Object.keys(raw.heroes[Number(sp)]).sort());
    expect(mod.save.garnishes).toBeUndefined(); expect(mod.garnishPicker()).toEqual([]); expect(mod.garnishOf(0)).toBeNull();
    expect(fs.readFileSync('src/save.ts', 'utf8')).toContain("const KEY = 'kkq-save-v3'");
    expect(newProfile(0)).not.toHaveProperty('garnish'); // a new kaiju wears nothing
    // and it can use the feature straight away
    expect(mod.candyGarnish('bun').ok).toBe(true); expect(mod.wearGarnish(0, 'bun')).toBe(true);
    expect(mod.save).toMatchObject({ crumbs: 555, drops: { bun: 20 }, garnishes: ['bun'] }); expect(mod.save.heroes[0].garnish).toBe('bun');
  });

  it('a save with garnishes round-trips exactly', async () => {
    const { mod } = await loadWith(s => { s.garnishes = ['bun', 'ant', 'milk']; s.heroes[0].garnish = 'ant'; s.heroes[10].garnish = 'ant'; s.heroes[4].garnish = 'milk'; });
    expect(mod.save.garnishes).toEqual(['bun', 'ant', 'milk']);
    expect([0, 10, 4, 11].map(sp => mod.save.heroes[sp].garnish)).toEqual(['ant', 'ant', 'milk', undefined]);
    expect(mod.garnishCard('ant')!.wornBy).toEqual([0, 10]);
  });

  it('unknown kinds leave the owned list; a worn garnish that is not owned or not a drop is cleared; the gold flag is never kept', async () => {
    const { mod } = await loadWith(s => {
      s.garnishes = ['no-such-monster', 'bun', 'bun', 5, null, ['ant'], 'toast', 'kbun', 'milk', { kind: 'ant' }];
      s.heroes[0].garnish = 'bun'; s.heroes[0].garnishGold = true; // owned: stays, the flag goes
      s.heroes[10].garnish = 'ant'; // a real drop, not owned
      s.heroes[11].garnish = 'no-such-monster'; s.heroes[4].garnish = 'toast'; // a boss: no drop
      s.heroes[1].garnish = 7; s.heroes[2].garnish = ['bun']; s.heroes[3].garnish = null; s.heroes[5].garnish = ''; s.heroes[6].garnish = { kind: 'bun' };
      s.heroes[7].garnish = 'milk';
    });
    expect(mod.save.garnishes).toEqual(['bun', 'milk']);
    expect(mod.save.heroes[0].garnish).toBe('bun'); expect(mod.save.heroes[7].garnish).toBe('milk');
    for (const sp of [10, 11, 4, 1, 2, 3, 5, 6]) expect('garnish' in mod.save.heroes[sp], String(sp)).toBe(false);
    for (const h of Object.values(mod.save.heroes)) expect('garnishGold' in h).toBe(false);
    expect(() => { mod.garnishPicker(); for (const k of KINDS) mod.garnishCard(k); for (const c of CLASSES) { mod.garnishOf(c.species); mod.kitGarnishOf(c.species); derive(mod.save.heroes[c.species]); } }).not.toThrow();
  });

  it('every odd shape of the owned list loads and can be used: null, text, a number, an object, nested junk', async () => {
    const odd: unknown[] = [null, 'bun', 7, true, {}, { bun: true }, [], [null], [[['bun']]], [1e9, -1, 2.5]];
    for (const v of odd) {
      const { mod } = await loadWith(s => { s.garnishes = v; s.heroes[0].garnish = 'bun'; s.drops = { bun: 30 }; s.cookbook = { bun: 12 }; });
      expect(mod.save.garnishes, JSON.stringify(v)).toBeUndefined();
      expect('garnish' in mod.save.heroes[0]).toBe(false);
      expect(mod.garnishPicker()).toEqual([]);
      expect(mod.candyGarnish('bun').ok).toBe(true); expect(mod.wearGarnish(0, 'bun')).toBe(true);
      expect(mod.garnishOf(0)).toMatchObject({ kind: 'bun', gold: true });
    }
  });

  it('repairGarnish leaves absent fields absent and a good save alone', () => {
    const a = blank(); repairGarnish(a); expect(a).toEqual(blank());
    const good = blank({ garnishes: ['bun', 'ant'] }); good.heroes[0].garnish = 'ant';
    const before = JSON.parse(JSON.stringify(good)) as GarnishSave;
    repairGarnish(good); expect(good).toEqual(before);
    // worn but the list is missing altogether: taken off
    const b = blank(); b.heroes[0].garnish = 'bun'; repairGarnish(b); expect(b).toEqual(blank());
  });
});
