// The Monster Cookbook (docs/DROPS-USES.md B1-B3): pages built from data, card levels and hand-ins, one-off rewards that
// are never power, the SKIP TO BOSS guard, the 35% never-wanted drop rate, load repair, and the groundwork for the
// Garnish: floor pickups count their own ids, so how many drops fall can never change what the monsters do.
import fs from 'node:fs';
import { describe, expect, it, vi } from 'vitest';

// the drop chances can be turned up and down for the determinism test (undefined = the real numbers)
const knob = vi.hoisted(() => ({ plain: undefined as number | undefined, spare: undefined as number | undefined, quest: undefined as number | undefined }));
vi.mock('../src/sim/drops', async orig => {
  const real = await orig<typeof import('../src/sim/drops')>();
  return { ...real, get DROP_CHANCE() { return knob.plain ?? real.DROP_CHANCE; }, get SPARE_DROP_CHANCE() { return knob.spare ?? real.SPARE_DROP_CHANCE; }, get QUEST_DROP_CHANCE() { return knob.quest ?? real.QUEST_DROP_CHANCE; } };
});

import {
  BOOK_REWARD, CARD_NEEDS, type CookReward, type CookSave, MAX_DROPS, baseDropChance, bookTotals, bookView, buildCookbook, canSkipWith, cardNeeds, cardReward, cardView, cookbook,
  handIn, handInSpares, neverWantedKinds, pageReward, pageView, repairCookbook, setTitle, settleCookbook, shownTitle, skipReserve, skipsBrokenBy, stageWants, titleName, titlesEarned,
} from '../src/sim/cookbook';
import { DROPS, DROP_CHANCE, QUEST_DROP_CHANCE, SPARE_DROP_CHANCE } from '../src/sim/drops';
import { MONSTER_TYPES, typeOf } from '../src/sim/elements';
import { MOBS } from '../src/sim/mobs';
import { BONUS_STAGES, STAGES, WORLDS, bossRoom, type WorldDef } from '../src/sim/stages';
import { derive, newProfile } from '../src/sim/stats';
import type { Input, MobKind, StageDef } from '../src/sim/types';
import { World } from '../src/sim/world';
import { Bot, SKILLED } from '../src/sim/bot';

const book = cookbook();
const blank = (over: Partial<CookSave> = {}): CookSave => ({ crumbs: 0, ...over });
const stage = (id: string): StageDef => [...STAGES, ...BONUS_STAGES].find(s => s.id === id)!;
const SPARE = [...book.spare], WANTED = Object.keys(DROPS).filter(k => !book.spare.has(k));
const REWARD_FIELDS = ['border', 'crumbs', 'stamp', 'title'];
const allRewards = (): CookReward[] => [...book.pages.flatMap(p => [cardReward(p.world, 1), cardReward(p.world, 2), cardReward(p.world, 3), pageReward(p.world, 1), pageReward(p.world, 2)]), BOOK_REWARD];
/** fill every card on a page to a level (by handing in from a big bag) */
const fill = (s: CookSave, pageId: string, level: 1 | 2 | 3, b = book) => { for (const k of b.pageOf && b.pages.find(p => p.id === pageId)!.kinds) { s.drops = { ...(s.drops ?? {}), [k]: 50 }; handIn(s, k, cardNeeds(k, b)[level - 1] - (s.cookbook?.[k] ?? 0), b); delete s.drops[k]; } };

describe('Cookbook pages are built from the data', () => {
  it('10 pages, 82 cards, every drop on exactly one page, both mimics where they first appear', () => {
    expect(book.pages.map(p => p.id)).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
    const all = book.pages.flatMap(p => p.kinds);
    expect(all.length).toBe(82);
    expect(new Set(all).size).toBe(all.length);
    expect([...all].sort()).toEqual(Object.keys(DROPS).sort()); // pages cover exactly the monsters with drops
    for (const k of all) { expect(book.pageOf[k].kinds, k).toContain(k); expect(MOBS[k], k).toBeTruthy(); }
    expect(book.pageOf.mimic.id).toBe('1'); // the Lunchbox Mimic stays on page 1 though eight worlds use it
    expect(book.pageOf.cereal.id).toBe(String(WORLDS.find(w => w.mimic === 'cereal')!.id));
    for (const p of book.pages) { const w = WORLDS.find(x => x.id === p.world)!; expect(p.name).toBe(w.name); for (const k of p.kinds) expect([...w.pool.map(q => q[1]), w.mimic]).toContain(k); }
  });

  it('a made-up eleventh world adds a page and a title by itself, and its kinds are classified from the stages', () => {
    const w11 = { ...WORLDS[0], id: 11, name: 'The Lunch Line', pool: [[1, 'tray'], [2, 'spork'], [3, 'bun']], mimic: 'mimic' } as unknown as WorldDef;
    const drops = { ...DROPS, tray: ['Tray Corner', ''], spork: ['Spork Tine', ''] } as Record<string, unknown>;
    const st = { ...STAGES[0], id: '11-1', world: 11, maps: [{ ...STAGES[0].maps![0], goal: { kind: 'collect', wants: [{ mob: 'tray', n: 3 }] } }] } as unknown as StageDef;
    const b = buildCookbook([...WORLDS, w11], [...STAGES, st], drops);
    expect(b.pages.length).toBe(11);
    expect(b.pages[10]).toMatchObject({ id: '11', world: 11, name: 'The Lunch Line', kinds: ['tray', 'spork'] }); // bun and the mimic stay on page 1
    expect(b.pages.flatMap(p => p.kinds).sort()).toEqual(Object.keys(drops).sort());
    expect(b.spare.has('spork')).toBe(true); expect(b.spare.has('tray')).toBe(false); // no exit asks for a spork: 35%, 1 / 3 / 8
    expect(baseDropChance('spork', b)).toBe(SPARE_DROP_CHANCE); expect(baseDropChance('tray', b)).toBe(DROP_CHANCE);
    expect(cardNeeds('spork', b)).toEqual([1, 3, 8]); expect(cardNeeds('tray', b)).toEqual([1, 5, 12]);
    expect(b.wantedBy.tray).toEqual(['11-1']);
    expect(titleName('w11', b)).toBe('Lunch Line Cook');
    expect(pageReward(11, 2)).toEqual({ crumbs: 11000, stamp: 'gold', title: 'w11' });
    // the old ten pages are unchanged, and a book with the new page is not complete until page 11 is
    expect(b.pages.slice(0, 10)).toEqual(book.pages);
    const s = blank(); for (const p of book.pages) fill(s, p.id, 3, b);
    expect(titlesEarned(s, b)).not.toContain('all');
    fill(s, '11', 3, b);
    expect(titlesEarned(s, b)).toEqual([...b.pages.map(p => `w${p.id}`), 'all']);
  });

  it('titles are built from the world names', () => {
    expect(book.pages.map(p => titleName(`w${p.id}`))).toEqual(['Countertop Cook', 'Fridge Cook', 'Oven Cook', 'Pantry Cook', 'Sink Cook', 'Dining Room Cook', 'Backyard BBQ Cook', 'Garden Cook', 'Supermarket Cook', 'Feast Cook']);
    expect(titleName('all')).toBe('Head Chef');
    for (const bad of ['w99', 'w', '', 'boss', null, undefined]) expect(titleName(bad)).toBe('');
  });
});

describe('the never-wanted kinds drop at 35%', () => {
  it('the classification matches the stages: a kind is spare exactly when no story exit asks for it (26 today)', () => {
    const wanted = new Set<string>();
    for (const s of STAGES) for (const m of s.maps ?? []) if (m.goal?.kind === 'collect') for (const q of m.goal.wants) wanted.add(q.mob);
    expect(SPARE.sort()).toEqual(Object.keys(DROPS).filter(k => !wanted.has(k)).sort());
    expect(neverWantedKinds().sort()).toEqual([...SPARE].sort());
    expect(SPARE.length).toBe(26);
    for (const k of ['ant', 'pepper', 'garlic', 'mimic', 'cereal', 'teapot', 'duck']) expect(SPARE, k).toContain(k);
    for (const k of Object.keys(DROPS)) expect(book.wantedBy[k]?.length ?? 0, k).toBe(book.spare.has(k) ? 0 : STAGES.filter(s => stageWants(s)[k]).length);
  });

  it('SPARE_DROP_CHANCE is 0.35, used for those kinds and no others', () => {
    expect(SPARE_DROP_CHANCE).toBe(0.35); expect(DROP_CHANCE).toBe(0.2); expect(QUEST_DROP_CHANCE).toBe(0.55);
    for (const k of SPARE) expect(baseDropChance(k), k).toBe(0.35);
    for (const k of WANTED) expect(baseDropChance(k), k).toBe(0.2);
    expect(baseDropChance('toast')).toBe(0.2); // a boss has no drop at all; the number is never used for it
    const src = fs.readFileSync('src/sim/world.ts', 'utf8');
    expect(src).toContain('quest ? QUEST_DROP_CHANCE : baseDropChance(m.kind)');
    expect(src).not.toMatch(/\bDROP_CHANCE\b(?<!QUEST_DROP_CHANCE)/); // the plain constant is only reached through baseDropChance
  });

  it('in a stage: a never-wanted kind drops about 35% of the time, a wanted kind away from its exit about 20%', () => {
    const st = stage('2-3'), d = derive(newProfile(0));
    const zone = st.maps!.findIndex(m => m.goal?.kind === 'collect'), asked = new Set((st.maps![zone].goal as { wants: { mob: string }[] }).wants.map(q => q.mob));
    const plain = WANTED.find(k => !asked.has(k) && MOBS[k as MobKind].brain === 'walker')! as MobKind;
    const rate = (kind: MobKind) => {
      const w = new World(st, d, 11); const x = st.maps![zone].x0 + 500; let n = 0;
      for (let i = 0; i < 1500; i++) { const m = w.spawnMob(kind, x, 5); const before = w.pickups.length; (w as unknown as { killMob(m: unknown): void }).killMob(m); n += w.pickups.length - before; w.pickups.length = 0; }
      return n / 1500;
    };
    const a = rate('ant'), b = rate(plain);
    expect(a).toBeGreaterThan(0.31); expect(a).toBeLessThan(0.39);
    expect(b).toBeGreaterThan(0.165); expect(b).toBeLessThan(0.235);
  });

  it('Free Play: bonus stages (and the Daily Dungeon, built the same way) drop; a boss room alone (Boss Rush, Endless) drops nothing', () => {
    const d = derive(newProfile(0));
    const kill = (st: StageDef, x: number) => { const w = new World(st, d, 5); for (let i = 0; i < 200; i++) (w as unknown as { killMob(m: unknown): void }).killMob(w.spawnMob('ant', x, 5)); return w.pickups.length; };
    const bonus = stage('S-1');
    expect(kill(bonus, bonus.maps![1].x0 + 400)).toBeGreaterThan(40);
    const room = bossRoom(1);
    expect(room.maps).toBeUndefined();
    expect(kill(room, 400)).toBe(0);
  });
});

describe('floor pickups have their own ids: drops never change what monsters do', () => {
  // Fixed seed and fixed inputs: a skilled bot's button presses are recorded once and replayed, so nothing reacts to the
  // pickups. The bag is emptied every step in every run, because two things read the BAG by design and are not what this
  // test is about: exits open when it holds what they want, and a map respawns the monsters whose drop is still short.
  const world = (id: string) => {
    const st = stage(id), p = newProfile(0); p.level = st.rec + 6;
    const w = new World(st, derive(p), 7);
    w.hero.inv = 1e9; w.hero.d.atk *= 3; // safe and strong, so the fight (kills and respawns) lasts the whole run
    return w;
  };
  const tape = new Map<string, Input[]>();
  const record = (id: string, steps: number): Input[] => {
    if (!tape.has(id)) { const w = world(id), bot = new Bot(w, SKILLED, 5), out: Input[] = []; for (let i = 0; i < steps; i++) { const inp = { ...bot.think() }; out.push(inp); w.step(inp); w.drops = {}; } tape.set(id, out); }
    return tape.get(id)!;
  };
  const run = (id: string, rates: { plain?: number; spare?: number; quest?: number }, steps = 60 * 150) => {
    const inputs = record(id, steps);
    Object.assign(knob, { plain: undefined, spare: undefined, quest: undefined }, rates);
    try {
      const w = world(id);
      const trace: string[] = []; let pickups = 0, top = 0;
      for (let i = 0; i < steps; i++) {
        const seen = new Set(w.pickups.map(q => q.id));
        w.step(inputs[i]); w.drops = {};
        for (const q of w.pickups) if (!seen.has(q.id)) { pickups++; top = Math.max(top, q.id); }
        if (i % 6 === 0) trace.push(`${Math.round(w.hero.x * 10)},${Math.round(w.hero.y * 10)},${Math.round(w.hero.hp)}|${w.run.kills},${w.run.crumbs},${w.run.stones}|` + w.mobs.map(m => `${m.id}:${m.kind}:${Math.round(m.x * 10)}:${Math.round(m.y * 10)}:${Math.round(m.hp)}:${m.state}`).join(' '));
      }
      return { trace, pickups, top, kills: w.run.kills, mobIds: w.mobs.map(m => m.id), boxes: w.boxes.map(b => b.id) };
    } finally { Object.assign(knob, { plain: undefined, spare: undefined, quest: undefined }); }
  };

  for (const id of ['2-3', '6-7']) it(`${id}: monsters, the hero, crumbs and kills are identical with no drops, today's drops and a drop from every kill`, () => {
    const none = run(id, { plain: 0, spare: 0, quest: 0 }), now = run(id, {}), old = run(id, { spare: 0.2 }), all = run(id, { plain: 1, spare: 1, quest: 1 });
    expect(now.kills).toBeGreaterThan(15); // a real fight, with respawns after the first kills
    expect(all.pickups).toBe(all.kills);
    expect(all.pickups).toBeGreaterThan(now.pickups); expect(now.pickups).toBeGreaterThan(none.pickups);
    expect(now.trace).toEqual(none.trace);
    expect(all.trace).toEqual(none.trace);
    expect(old.trace).toEqual(none.trace); // 20% -> 35% for the never-wanted kinds changes the floor and nothing else
    expect(all.mobIds).toEqual(none.mobIds); expect(all.boxes).toEqual(none.boxes);
    expect(all.top).toBe(all.pickups); // pickups count 1, 2, 3... by themselves
  });

  it('the pickup counter restarts with each stage', () => {
    const d = derive(newProfile(0)), st = stage('2-3');
    for (let r = 0; r < 2; r++) { const w = new World(st, d, 3); knob.spare = 1; try { (w as unknown as { killMob(m: unknown): void }).killMob(w.spawnMob('ant', st.maps![1].x0 + 400, 5)); } finally { knob.spare = undefined; } expect(w.pickups.map(q => q.id)).toEqual([1]); }
  });
});

describe('cards: levels, hand-ins and one-off rewards', () => {
  it('thresholds: 1 / 5 / 12 for wanted kinds, 1 / 3 / 8 for the never-wanted', () => {
    expect(CARD_NEEDS).toEqual({ wanted: [1, 5, 12], spare: [1, 3, 8] });
    for (const k of WANTED) expect(cardNeeds(k)).toEqual([1, 5, 12]);
    for (const k of SPARE) expect(cardNeeds(k)).toEqual([1, 3, 8]);
    const s = blank({ drops: { bun: 30, ant: 30 } });
    const lv = (k: string) => cardView(s, k)!.level;
    expect(lv('bun')).toBe(0);
    handIn(s, 'bun', 1); expect(lv('bun')).toBe(1); handIn(s, 'bun', 3); expect(lv('bun')).toBe(1); handIn(s, 'bun', 1); expect(lv('bun')).toBe(2);
    handIn(s, 'bun', 6); expect(lv('bun')).toBe(2); handIn(s, 'bun', 1); expect(lv('bun')).toBe(3);
    handIn(s, 'ant', 1); expect(lv('ant')).toBe(1); handIn(s, 'ant', 2); expect(lv('ant')).toBe(2); handIn(s, 'ant', 4); expect(lv('ant')).toBe(2); handIn(s, 'ant', 1); expect(lv('ant')).toBe(3);
  });

  it('the card counts hand-ins, never the bag; each level pays once, at the moment it is reached', () => {
    const s = blank({ drops: { milk: 40 } }); // The Fridge, world 2
    expect(cardView(s, 'milk')).toMatchObject({ level: 0, discovered: false, handed: 0, bag: 40, usable: 12, world: 2, page: '2' });
    const a = handIn(s, 'milk', 1);
    expect(a).toMatchObject({ handed: 1, from: 0, to: 1, crumbs: 40 }); expect(a.paid).toEqual([{ source: 'card', id: 'milk', level: 1, reward: { crumbs: 40 } }]);
    expect(s).toEqual({ crumbs: 40, drops: { milk: 39 }, cookbook: { milk: 1 } });
    expect(handIn(s, 'milk', 3)).toMatchObject({ handed: 3, from: 1, to: 1, crumbs: 0, paid: [] }); // between levels: nothing
    const b = handIn(s, 'milk'); // "hand in what I can use": straight to two stars, both rewards at once
    expect(b).toMatchObject({ handed: 8, from: 1, to: 3, crumbs: 120 + 300 });
    expect(b.paid.map(p => [p.level, p.reward])).toEqual([[2, { crumbs: 120 }], [3, { crumbs: 300, border: 'gold' }]]);
    expect(s).toEqual({ crumbs: 460, drops: { milk: 28 }, cookbook: { milk: 12 } });
    expect(cardView(s, 'milk')).toMatchObject({ level: 3, stars: 2, goldBorder: true, next: null, usable: 0, progress: 1, canAdvance: false });
  });

  it('a hand-in never takes more than the card needs, and past two stars it is refused (nothing is wasted)', () => {
    const s = blank({ drops: { ant: 20, bun: 3 } });
    expect(handIn(s, 'ant', 100).handed).toBe(8); expect(s.drops!.ant).toBe(12);
    const before = JSON.stringify(s);
    for (const n of [undefined, 1, 5, 1e9]) expect(handIn(s, 'ant', n)).toMatchObject({ handed: 0, from: 3, to: 3, crumbs: 0, paid: [] });
    expect(JSON.stringify(s)).toBe(before);
    // odd amounts and kinds are refused too
    for (const n of [0, -3, NaN, 0.5]) expect(handIn(s, 'bun', n).handed).toBe(0);
    for (const k of ['toast', 'kbun', 'no-such-monster', '', '__proto__']) expect(handIn(s, k).handed).toBe(0);
    expect(handIn(blank(), 'bun').handed).toBe(0); expect(handIn(blank({ drops: {} }), 'bun').handed).toBe(0); // an empty bag
    expect(JSON.stringify(s)).toBe(before);
    expect(handIn(s, 'bun', 2.9).handed).toBe(2); // a fraction rounds down
    expect(handIn(s, 'bun').handed).toBe(1); expect(s.drops).toEqual({ ant: 12 }); // the bag had fewer than the card wanted; an empty kind leaves the bag
  });

  it('the crumbs follow the table: 20+10w, 60+30w, 150w a card; 500w and 1,000w a page', () => {
    for (const p of book.pages) {
      const w = p.world;
      expect(cardReward(w, 1)).toEqual({ crumbs: 20 + 10 * w }); expect(cardReward(w, 2)).toEqual({ crumbs: 60 + 30 * w }); expect(cardReward(w, 3)).toEqual({ crumbs: 150 * w, border: 'gold' });
      expect(pageReward(w, 1)).toEqual({ crumbs: 500 * w, stamp: 'hat' }); expect(pageReward(w, 2)).toEqual({ crumbs: 1000 * w, stamp: 'gold', title: `w${w}` });
    }
    expect(BOOK_REWARD).toEqual({ crumbs: 0, title: 'all' });
  });

  it('the whole book: 358 drops for one star everywhere, 880 for two, 170,190 crumbs; filling it pays exactly that, once', () => {
    expect(bookTotals()).toEqual({ cards: 82, oneStarDrops: 358, twoStarDrops: 880, crumbs: 170190 });
    const s = blank({ drops: Object.fromEntries(Object.keys(DROPS).map(k => [k, 20])) });
    let paid = 0, handed = 0;
    for (const k of Object.keys(DROPS)) { const r = handIn(s, k); paid += r.crumbs; handed += r.handed; }
    expect(handed).toBe(880); expect(paid).toBe(170190); expect(s.crumbs).toBe(170190);
    expect(s.cookbookPaid).toEqual({ ...Object.fromEntries(book.pages.map(p => [p.id, 2])), all: 1 });
    // again, with a refilled bag: nothing more to give, nothing more paid
    s.drops = Object.fromEntries(Object.keys(DROPS).map(k => [k, 20]));
    for (const k of Object.keys(DROPS)) expect(handIn(s, k)).toMatchObject({ handed: 0, crumbs: 0 });
    expect(handInSpares(s, 'all', STAGES)).toEqual([]); expect(settleCookbook(s)).toEqual([]);
    expect(s.crumbs).toBe(170190);
    expect(bookView(s)).toMatchObject({ complete: true, paid: true, goldCover: true, badge: 0, cards: 82, discovered: 82, oneStar: 82, twoStar: 82 });
  });
});

describe('pages, the whole book and titles', () => {
  it('a page pays 500 x world and a chef-hat stamp at one star everywhere, 1,000 x world, the gold stamp and its title at two', () => {
    const s = blank(), p3 = book.pages[2];
    fill(s, '3', 1);
    expect(pageView(s, '3')).toMatchObject({ stars: 0, paid: 0, stamp: null, discovered: p3.kinds.length, oneStar: 0, next: { level: 1, reward: pageReward(3, 1) } });
    // all but one card at one star: no page reward yet
    for (const k of p3.kinds.slice(1)) { s.drops = { [k]: 20 }; handIn(s, k, cardNeeds(k)[1] - 1); }
    expect(s.cookbookPaid).toBeUndefined();
    s.drops = { [p3.kinds[0]]: 20 };
    const r = handIn(s, p3.kinds[0], cardNeeds(p3.kinds[0])[1] - 1);
    expect(r.paid.map(x => [x.source, x.id, x.level])).toEqual([['card', p3.kinds[0], 2], ['page', '3', 1]]);
    expect(r.paid[1].reward).toEqual({ crumbs: 1500, stamp: 'hat' });
    expect(s.cookbookPaid).toEqual({ 3: 1 });
    expect(pageView(s, '3')).toMatchObject({ stars: 1, paid: 1, stamp: 'hat', next: { level: 2 }, title: { id: 'w3', name: 'Oven Cook', earned: false } });
    expect(titlesEarned(s)).toEqual([]);
    const before = s.crumbs; fill(s, '3', 3);
    expect(s.crumbs - before).toBe(p3.kinds.length * 450 + 3000);
    expect(s.cookbookPaid).toEqual({ 3: 2 });
    expect(pageView(s, '3')).toMatchObject({ stars: 2, paid: 2, stamp: 'gold', next: null, twoStar: p3.kinds.length, title: { earned: true } });
    expect(titlesEarned(s)).toEqual(['w3']);
    expect(bookView(s)).toMatchObject({ complete: false, paid: false, goldCover: false, titles: [{ id: 'w3', name: 'Oven Cook' }], title: null });
  });

  it('a page that jumps straight to two stars pays both page rewards, once', () => {
    const s = blank();
    for (const k of book.pages[0].kinds) s.drops = { ...s.drops, [k]: 12 };
    const paid = handInSpares(s, '1', []).flatMap(r => r.paid).filter(p => p.source === 'page');
    expect(paid.map(p => [p.id, p.level, p.reward.crumbs])).toEqual([['1', 1, 500], ['1', 2, 1000]]);
    expect(s.crumbs).toBe(3930); // World 1's page: 9 cards x 270 + 1,500
    expect(settleCookbook(s)).toEqual([]);
  });

  it('a page cannot pay twice after a monster is added to it', () => {
    const s = blank(); fill(s, '2', 3);
    const crumbs = s.crumbs;
    // an update gives The Fridge a new monster: the page is no longer complete, but its rewards were paid
    const drops = { ...DROPS, sorbet: ['Sorbet Scoop', ''] } as Record<string, unknown>;
    const worlds = WORLDS.map(w => (w.id === 2 ? { ...w, pool: [...w.pool, [5, 'sorbet']] } : w)) as unknown as WorldDef[];
    const b = buildCookbook(worlds, STAGES, drops);
    expect(b.pageOf.sorbet.id).toBe('2');
    expect(pageView(s, '2', [], b)).toMatchObject({ stars: 0, paid: 2, stamp: 'gold', next: null, title: { earned: true } }); // the stamp and title stay earned
    expect(titlesEarned(s, b)).toEqual(['w2']);
    s.drops = { sorbet: 12 };
    const r = handIn(s, 'sorbet', Infinity, b);
    expect(r.paid.every(p => p.source === 'card')).toBe(true); // the new card pays; the page does not pay again
    expect(s.crumbs - crumbs).toBe(40 + 120 + 300);
    expect(s.cookbookPaid).toEqual({ 2: 2 });
    expect(pageView(s, '2', [], b)!.stars).toBe(2);
  });

  it('the whole book gives Head Chef and the gold cover when every page has two stars', () => {
    const s = blank();
    for (const p of book.pages.slice(0, -1)) fill(s, p.id, 3);
    fill(s, '10', 2);
    expect(titlesEarned(s)).toEqual(book.pages.slice(0, -1).map(p => `w${p.id}`));
    expect(bookView(s)).toMatchObject({ complete: false, paid: false, goldCover: false });
    const last = book.pages[9].kinds;
    for (const k of last.slice(1)) { s.drops = { [k]: 20 }; handIn(s, k); }
    s.drops = { [last[0]]: 20 };
    const r = handIn(s, last[0]);
    expect(r.paid.map(p => [p.source, p.id, p.level])).toEqual([['card', last[0], 3], ['page', '10', 2], ['book', 'all', 1]]);
    expect(r.paid[2].reward).toEqual({ crumbs: 0, title: 'all' });
    expect(titlesEarned(s)).toContain('all');
    expect(bookView(s)).toMatchObject({ complete: true, paid: true, goldCover: true });
  });

  it('titles: only an earned one can be shown, or none', () => {
    const s = blank(); fill(s, '1', 3);
    expect(setTitle(s, 'w2')).toBe(false); expect(setTitle(s, 'all')).toBe(false); expect(setTitle(s, 'nonsense')).toBe(false); expect(s.title).toBeUndefined();
    expect(shownTitle(s)).toBe('');
    expect(setTitle(s, 'w1')).toBe(true); expect(s.title).toBe('w1'); expect(shownTitle(s)).toBe('Countertop Cook');
    expect(bookView(s)).toMatchObject({ title: 'w1', titleName: 'Countertop Cook' });
    expect(setTitle(s, null)).toBe(true); expect('title' in s).toBe(false); expect(bookView(s)).toMatchObject({ title: null, titleName: '' });
    expect(shownTitle({ crumbs: 0, title: 'all' })).toBe(''); // set by hand, not earned: not shown
  });
});

describe('rule B1: drops never give power', () => {
  it('every reward is crumbs, a stamp, a border or a title: there is no field for a box, an item or a consumable', () => {
    for (const r of allRewards()) {
      for (const k of Object.keys(r)) expect(REWARD_FIELDS).toContain(k);
      expect(Number.isInteger(r.crumbs) && r.crumbs >= 0).toBe(true);
      if (r.stamp !== undefined) expect(['hat', 'gold']).toContain(r.stamp);
      if (r.border !== undefined) expect(r.border).toBe('gold');
      if (r.title !== undefined) expect(titleName(r.title)).not.toBe('');
    }
    // the type itself: these lines fail to compile if a power field is ever added to CookReward
    type Banned = 'box' | 'boxes' | 'item' | 'items' | 'consumable' | 'stones' | 'gear' | 'xp';
    const noPower: Extract<keyof CookReward, Banned> extends never ? true : false = true;
    const onlyThese: Exclude<keyof CookReward, 'crumbs' | 'stamp' | 'border' | 'title'> extends never ? true : false = true;
    expect(noPower && onlyThese).toBe(true);
  });

  it('the stats code does not know the Cookbook exists', () => {
    const stats = fs.readFileSync('src/sim/stats.ts', 'utf8');
    expect(stats).not.toMatch(/cookbook|garnish/i);
    const src = fs.readFileSync('src/sim/cookbook.ts', 'utf8').split('\n').filter(l => /^import /.test(l)).join('\n');
    expect(src).not.toMatch(/items|consumables|loot|stats|save/);
  });

  it('no hand-in changes boxes, items, the gear bag, the heroes or anything else in a real save', async () => {
    const mod = await import('../src/save');
    const s = JSON.parse(JSON.stringify(mod.save)) as typeof mod.save;
    s.boxes = [{ tier: 2, ilvl: 4 }, { tier: 5, ilvl: 30 }]; s.items = { jam: 3, sugar: 1, fstone: 4, gstone: 1, ggstone: 2, safety: 1 };
    s.bag = [{ id: 1, base: 'pin', rarity: 2, ilvl: 8, plus: 0, lines: [{ k: 'atk', v: 6 }] }];
    s.drops = Object.fromEntries(Object.keys(DROPS).map(k => [k, 15]));
    const rest = () => { const { crumbs: _c, drops: _d, cookbook: _b, cookbookPaid: _p, title: _t, ...other } = s; return JSON.stringify(other); };
    const before = rest(), power = Object.values(s.heroes).map(h => JSON.stringify(derive(h)));
    let crumbs = s.crumbs;
    for (const k of Object.keys(DROPS)) for (const n of [1, 2, undefined]) {
      const r = mod.cookHandIn(k, n, s);
      expect(s.crumbs - crumbs, k).toBe(r.crumbs); crumbs = s.crumbs;
      for (const p of r.paid) for (const f of Object.keys(p.reward)) expect(REWARD_FIELDS).toContain(f);
      expect(rest(), k).toBe(before); // boxes, items, the gear bag, heroes, keys, quick bag... all untouched
    }
    mod.cookHandInSpares('all', s); mod.chooseTitle('all', s);
    expect(rest()).toBe(before);
    expect(Object.values(s.heroes).map(h => JSON.stringify(derive(h)))).toEqual(power);
    expect(s.cookbookPaid!.all).toBe(1); expect(s.title).toBe('all');
    expect(Object.keys(s).filter(k => !(k in mod.save)).sort()).toEqual(['cookbook', 'cookbookPaid', 'drops', 'title']);
  });
});

describe('SKIP TO BOSS is protected', () => {
  const A = stage('4-6'), B = stage('4-7'), C = stage('1-2');
  const need = (...sts: StageDef[]) => { const out: Record<string, number> = {}; for (const st of sts) for (const [k, n] of Object.entries(stageWants(st))) out[k] = Math.max(out[k] ?? 0, n); return out; };

  it('stageWants is the sum of what a stage\'s exits ask for (the stage panel\'s skip price)', () => {
    for (const st of [...STAGES, ...BONUS_STAGES]) {
      const sum: Record<string, number> = {};
      for (const m of st.maps ?? []) if (m.goal?.kind === 'collect') for (const q of m.goal.wants) sum[q.mob] = (sum[q.mob] ?? 0) + q.n;
      expect(stageWants(st), st.id).toEqual(sum);
      expect(canSkipWith(sum, st), st.id).toBe(Object.keys(sum).length > 0);
      expect(canSkipWith({}, st)).toBe(false); expect(canSkipWith(undefined, st)).toBe(false);
      const [k] = Object.keys(sum); if (k) expect(canSkipWith({ ...sum, [k]: sum[k] - 1 }, st), st.id).toBe(false);
    }
    expect(stageWants(bossRoom(1))).toEqual({}); expect(canSkipWith({ bun: 99 }, bossRoom(1))).toBe(false);
  });

  it('skipsBrokenBy: the affordable skips a spend would break, and nothing else', () => {
    const bag = need(A, B), [k] = Object.keys(stageWants(A)), onlyB = Object.keys(stageWants(B)).find(x => !stageWants(A)[x]);
    const all = [A, B, C];
    expect(skipsBrokenBy(bag, {}, all)).toEqual([]);
    expect(skipsBrokenBy(bag, { [k]: 0 }, all)).toEqual([]);
    expect(skipsBrokenBy(bag, { ant: 5 }, all)).toEqual([]); // a kind no skip needs
    const broke = skipsBrokenBy(bag, { [k]: 1 }, all).map(s => s.id);
    expect(broke).toContain('4-6'); expect(broke).not.toContain('1-2'); // 1-2 was not affordable: it cannot be "broken"
    if (onlyB) expect(skipsBrokenBy(bag, { [onlyB]: 1 }, all).map(s => s.id)).toEqual(['4-7']);
    // a spare on top can be spent freely; one more than the spare breaks it
    expect(skipsBrokenBy({ ...bag, [k]: bag[k] + 2 }, { [k]: 2 }, all)).toEqual([]);
    expect(skipsBrokenBy({ ...bag, [k]: bag[k] + 2 }, { [k]: 3 }, all).map(s => s.id)).toContain('4-6');
    // only the stages passed in are looked at (the caller passes the unlocked ones)
    expect(skipsBrokenBy(bag, { [k]: 1 }, [C])).toEqual([]); expect(skipsBrokenBy(bag, { [k]: 1 }, [])).toEqual([]);
    expect(skipsBrokenBy(undefined, { [k]: 1 }, all)).toEqual([]);
    // the smaller of two skips survives a spend that only breaks the bigger one
    const big = { ...need(A, B, C) }, c0 = Object.keys(stageWants(C))[0];
    expect(skipsBrokenBy(big, { [c0]: 1 }, all).map(s => s.id)).toEqual(all.filter(s => (stageWants(s)[c0] ?? 0) === big[c0]).map(s => s.id));
  });

  it('a card says which skips its hand-in would break, and how many drops are safe', () => {
    const bag = need(A), [k] = Object.keys(stageWants(A)), want = stageWants(A)[k];
    const s = blank({ drops: { ...bag, [k]: want + 2 } });
    const c = cardView(s, k, [A, B, C])!;
    expect(c).toMatchObject({ bag: want + 2, usable: Math.min(want + 2, 12), safe: 2, breaks: ['4-6'] });
    expect(cardView(s, k, [])!).toMatchObject({ breaks: [], safe: c.usable }); // nothing unlocked to skip: no warning
    expect(cardView(blank({ drops: { [k]: want + 2 } }), k, [A, B, C])!).toMatchObject({ breaks: [], safe: c.usable }); // the skip was not affordable anyway
    // a card that only needs the spare ones does not warn
    const s2 = blank({ drops: { ...bag, [k]: want + 2 }, cookbook: { [k]: cardNeeds(k)[2] - 2 } });
    expect(cardView(s2, k, [A])!).toMatchObject({ usable: 2, safe: 2, breaks: [] });
    expect(skipReserve(s.drops, [A, B, C])).toEqual(stageWants(A));
  });

  it('"hand in all spares" leaves every affordable skip affordable, and takes everything else the cards can use', () => {
    const stages = [A, B, C], bag: Record<string, number> = {};
    for (const k of Object.keys(DROPS)) bag[k] = 4;
    for (const [k, n] of Object.entries(need(A, B))) bag[k] = n + 3;
    const s = blank({ drops: { ...bag } });
    const could = stages.filter(st => canSkipWith(s.drops, st));
    expect(could.map(x => x.id)).toEqual(expect.arrayContaining(['4-6', '4-7']));
    const view = bookView(s, stages);
    const res = handInSpares(s, 'all', stages);
    for (const st of could) expect(canSkipWith(s.drops, st), st.id).toBe(true);
    const keep = need(...could);
    for (const k of Object.keys(DROPS)) {
      const took = bag[k] - (s.drops![k] ?? 0);
      expect(took, k).toBe(Math.max(0, Math.min(bag[k] - (keep[k] ?? 0), cardNeeds(k)[2])));
      expect(took, k).toBe(view.pages.flatMap(p => p.cards).find(c => c.kind === k)!.safe); // what the card said was safe
    }
    expect(res.reduce((a, r) => a + r.handed, 0)).toBe(view.pages.reduce((a, p) => a + p.spares, 0));
    expect(handInSpares(s, 'all', stages)).toEqual([]); // nothing spare is left
    // one page only
    const t = blank({ drops: { ...bag } }), p4 = book.pages[3];
    const r4 = handInSpares(t, '4', stages);
    expect(r4.every(r => p4.kinds.includes(r.kind as MobKind))).toBe(true);
    for (const k of Object.keys(DROPS)) if (!p4.kinds.includes(k as MobKind)) expect(t.drops![k]).toBe(bag[k]);
    for (const st of could) expect(canSkipWith(t.drops, st)).toBe(true);
    expect(handInSpares(t, 'no-such-page', stages)).toEqual([]);
  });

  it('with the real save: only unlocked stages count, and the wrappers agree with the stage panel\'s rule', async () => {
    const mod = await import('../src/save');
    const s = JSON.parse(JSON.stringify(mod.save)) as typeof mod.save;
    expect(mod.skipStages(s).map(x => x.id)).toEqual(['1-1']); // a new game: only the first stage is open
    const [k] = Object.keys(stageWants(A));
    s.drops = { ...need(A), ...Object.fromEntries(Object.entries(stageWants(STAGES[0])).map(([q, n]) => [q, n])) };
    expect(mod.cookSpendWarning({ [k]: 1 }, s)).toEqual([]); // 4-6 is locked: its skip cannot be used, so nothing to warn about
    const k1 = Object.keys(stageWants(STAGES[0]))[0];
    expect(mod.cookSpendWarning({ [k1]: 1 }, s).map(x => x.id)).toEqual(['1-1']);
    expect(mod.cookCardView(k1, s)!.breaks).toEqual(['1-1']);
    for (const st of STAGES.slice(0, STAGES.indexOf(A))) s.heroes[s.selected].cleared[st.id] = 'B';
    s.keys = [3];
    const open = mod.skipStages(s).map(x => x.id);
    expect(open).toContain('4-6'); expect(open).not.toContain('4-7'); expect(open).toContain('S-3'); expect(open).not.toContain('S-4');
    s.drops = need(A);
    expect(mod.cookSpendWarning({ [k]: 1 }, s).map(x => x.id)).toContain('4-6');
    const view = mod.cookbookView(s);
    expect(view.pages.flatMap(p => p.cards).find(c => c.kind === k)!.breaks).toContain('4-6');
    mod.cookHandInSpares('all', s);
    expect(canSkipWith(s.drops, A)).toBe(true);
    // another kaiju has cleared nothing: for them only 1-1 is open
    s.selected = Number(Object.keys(s.heroes).find(x => Number(x) !== s.selected));
    expect(mod.skipStages(s).map(x => x.id)).toEqual(['1-1', 'S-3']);
  });
});

describe('what a card shows', () => {
  it('every card carries its monster, drop, home world, the stages that ask for it, and its weak / resist elements', () => {
    const s = blank({ drops: { bun: 2 }, cookbook: { bun: 3 } });
    const view = bookView(s, []);
    expect(view.pages.length).toBe(10); expect(view.cards).toBe(82); expect(view.discovered).toBe(1);
    for (const p of view.pages) for (const c of p.cards) {
      const t = MONSTER_TYPES[typeOf(c.kind)];
      expect(c).toMatchObject({ page: p.id, world: p.world, worldName: p.name, name: MOBS[c.kind].name, art: MOBS[c.kind].art, dropName: DROPS[c.kind]![0], dropIcon: `drop-${c.kind}`, weak: t.weakTo, resist: t.resists });
      expect(c.neverWanted).toBe(book.spare.has(c.kind)); expect(c.dropChance).toBe(c.neverWanted ? 0.35 : 0.2);
      expect(c.wantedBy.length > 0).toBe(!c.neverWanted);
      for (const id of c.wantedBy) expect(stageWants(stage(id))[c.kind]).toBeGreaterThan(0);
      expect(c.needs).toEqual(c.neverWanted ? [1, 3, 8] : [1, 5, 12]);
    }
    const bun = view.pages[0].cards.find(c => c.kind === 'bun')!;
    expect(bun).toMatchObject({ level: 1, handed: 3, bag: 2, usable: 2, canAdvance: true, progress: 0.5, next: { level: 2, need: 5, left: 2, reward: { crumbs: 90 } } });
    expect(view.badge).toBe(1); expect(view.pages[0]).toMatchObject({ canHandIn: 1, canAdvance: 1, spares: 2 });
    expect(cardView(blank({ drops: { bun: 1 }, cookbook: { bun: 3 } }), 'bun')).toMatchObject({ usable: 1, canAdvance: false }); // one more is not enough for a star
    expect(cardView(s, 'toast')).toBeNull(); expect(cardView(s, 'nope')).toBeNull(); expect(pageView(s, '11')).toBeNull();
  });
});

describe('saves: old ones load, odd ones are repaired', () => {
  const loadWith = async (edit: (s: Record<string, unknown>) => void) => {
    vi.unstubAllGlobals(); vi.resetModules();
    const first = await import('../src/save');
    const raw = JSON.parse(JSON.stringify(first.save)) as Record<string, unknown>;
    edit(raw);
    const json = JSON.stringify(raw);
    vi.stubGlobal('localStorage', { getItem: (k: string) => (k === 'kkq-save-v3' ? json : null), setItem: () => undefined });
    vi.resetModules();
    try { return { mod: await import('../src/save'), raw: JSON.parse(json) as Record<string, unknown> }; } finally { vi.unstubAllGlobals(); vi.resetModules(); }
  };

  it('an old save (no Cookbook fields) loads unchanged under the same key, as an empty book', async () => {
    const { mod, raw } = await loadWith(s => { s.crumbs = 777; s.drops = { bun: 4, ant: 2 }; });
    expect(Object.keys(mod.save).sort()).toEqual(Object.keys(raw).sort()); // no field is added by loading
    expect(mod.save.crumbs).toBe(777); expect(mod.save.drops).toEqual({ bun: 4, ant: 2 });
    expect(mod.save.cookbook).toBeUndefined(); expect(mod.save.cookbookPaid).toBeUndefined(); expect(mod.save.title).toBeUndefined();
    const v = mod.cookbookView();
    expect(v).toMatchObject({ discovered: 0, complete: false, goldCover: false, titles: [], title: null, cards: 82 });
    expect(fs.readFileSync('src/save.ts', 'utf8')).toContain("const KEY = 'kkq-save-v3'");
    // and it can use the book straight away
    expect(mod.cookHandIn('bun').handed).toBe(4);
    expect(mod.save).toMatchObject({ crumbs: 777 + 30, drops: { ant: 2 }, cookbook: { bun: 4 } });
    const { mod: none } = await loadWith(s => { delete s.drops; });
    expect(none.save.drops).toBeUndefined(); expect(none.cookbookView().discovered).toBe(0); expect(none.cookHandIn('bun').handed).toBe(0);
  });

  it('a save with a part-filled book round-trips exactly', async () => {
    const fields = { drops: { bun: 4 }, cookbook: { bun: 5, ant: 8, milk: 12 }, cookbookPaid: { 3: 2, 4: 1 }, title: 'w3' };
    const { mod } = await loadWith(s => Object.assign(s, fields));
    expect({ drops: mod.save.drops, cookbook: mod.save.cookbook, cookbookPaid: mod.save.cookbookPaid, title: mod.save.title }).toEqual(fields);
    expect(mod.cookbookView()).toMatchObject({ title: 'w3', titleName: 'Oven Cook', titles: [{ id: 'w3', name: 'Oven Cook' }] });
  });

  it('odd books: unknown kinds go, bad counts become 0, hand-ins are capped at two stars, an unearned title is cleared', async () => {
    const { mod } = await loadWith(s => Object.assign(s, {
      drops: { bun: -4, worm: 2.5, ant: 'six', salt: null, egg: 1e12, 'no-such-monster': 9, toast: 3, milk: 7 },
      cookbook: { bun: -1, worm: 3.7, ant: '5', salt: null, egg: 1e9, garlic: 500, 'no-such-monster': 12, toast: 12, kbun: 5, milk: 2 },
      cookbookPaid: { 1: 9, 2: -1, 3: 'two', 4: 1.9, 99: 2, all: 5, x: 1 }, title: 'w99',
    }));
    expect(mod.save.drops).toEqual({ worm: 2, egg: MAX_DROPS, milk: 7 });
    expect(mod.save.cookbook).toEqual({ worm: 3, egg: 12, garlic: 8, milk: 2 });
    expect(mod.save.cookbookPaid).toEqual({ 1: 2, 4: 1, all: 1 });
    expect(mod.save.title).toBeUndefined();
    expect(() => mod.cookbookView()).not.toThrow();
  });

  it('every odd shape loads and can be drawn and used: null, a string, an array, a number, nested junk', async () => {
    const odd: unknown[] = [null, 'full', 7, [1, 2, 3], true, { bun: { n: 3 } }, { bun: [5] }, { '': 4, __proto__: 3, constructor: 9 }, {}];
    for (const v of odd) {
      const { mod } = await loadWith(s => Object.assign(s, { drops: v, cookbook: v, cookbookPaid: v, title: v }));
      for (const f of ['drops', 'cookbook', 'cookbookPaid'] as const) {
        const got = mod.save[f] as Record<string, unknown>;
        expect(got && typeof got === 'object' && !Array.isArray(got), JSON.stringify(v)).toBe(true);
        for (const [k, n] of Object.entries(got)) { expect(Number.isInteger(n) && (n as number) > 0, `${f}.${k}`).toBe(true); if (f !== 'cookbookPaid') expect(DROPS[k as MobKind], k).toBeTruthy(); }
      }
      expect(mod.save.title).toBeUndefined();
      const view = mod.cookbookView();
      expect(view.cards).toBe(82);
      for (const p of view.pages) for (const c of p.cards) expect([c.handed, c.bag, c.usable, c.safe, c.progress].every(n => Number.isFinite(n) && n >= 0), c.kind).toBe(true);
      expect(() => { mod.cookHandInSpares('all'); mod.cookHandIn('bun'); mod.chooseTitle('all'); mod.cookSpendWarning({ bun: 1 }); }).not.toThrow();
    }
  });

  it('a title is kept only while it is earned (payment marks are the only list)', async () => {
    const a = await loadWith(s => Object.assign(s, { cookbookPaid: { 1: 2, 2: 1 }, title: 'w1' }));
    expect(a.mod.save.title).toBe('w1');
    const b = await loadWith(s => Object.assign(s, { cookbookPaid: { 1: 2, 2: 1 }, title: 'w2' })); // one star only: no title yet
    expect(b.mod.save.title).toBeUndefined();
    const c = await loadWith(s => Object.assign(s, { cookbook: Object.fromEntries(Object.keys(DROPS).map(k => [k, 12])), title: 'all' })); // a full book typed in by hand, never paid
    expect(c.mod.save.title).toBeUndefined();
    expect(c.mod.save.cookbook!.ant).toBe(8); // capped at this card's own two-star number
    const d = await loadWith(s => Object.assign(s, { cookbookPaid: { all: 1 }, title: 'all' }));
    expect(d.mod.save.title).toBe('all'); expect(d.mod.cookbookView().titleName).toBe('Head Chef');
  });

  it('repairCookbook leaves absent fields absent and a good book alone', () => {
    const none = blank(); repairCookbook(none); expect(none).toEqual({ crumbs: 0 });
    const good = blank({ drops: { bun: 3 }, cookbook: { bun: 12, ant: 8 }, cookbookPaid: { 1: 2, all: 1 }, title: 'all' }), copy = JSON.parse(JSON.stringify(good));
    repairCookbook(good); expect(good).toEqual(copy);
  });
});
