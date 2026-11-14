// Stage rank (hits judged per monster defeated, not per minute), the stage challenges that changed with it, the quests that
// asked for the impossible, and save compatibility for stars and quest progress.
import { describe, expect, it, vi } from 'vitest';
import { CHALLENGES, type ChallengeCtx, NO_STAR_CHEF, SLIPPERY_DODGES, STARS_FOR_SECRET, challengesFor, isHardChallenge, keepStars } from '../src/sim/challenges';
import { CLASSES } from '../src/sim/classes';
import { clearLevel } from '../src/sim/loot';
import { STAGES } from '../src/sim/stages';
import { derive, newProfile } from '../src/sim/stats';
import { RANK, type RunStats, World, rankOf, rankParts } from '../src/sim/world';
import { S_RANK_KEY, UNLOCKS, kaijuQuests } from '../src/story/kaijuQuests';

/** A tidy run: under par, full combo and style marks, so only Defence moves the score (Time 40 + Combo 12 + Style 13 = 65). */
const mkRun = (o: Partial<RunStats> = {}): RunStats => ({ time: 200, hitsTaken: 0, dmgTaken: 0, maxCombo: 40, kills: 40, crumbs: 0, revived: 0, stones: 0, perfects: 4, interrupts: 20, styleSum: 10, styleTime: 1, stylePeak: 0, ...o });
const PAR = 300;

describe('stage rank: the formula', () => {
  it('keeps every constant in one block, with the weights adding up to 100', () => {
    expect(RANK.TIME + RANK.DEFENCE + RANK.COMBO + RANK.STYLE).toBe(100);
    expect([RANK.S, RANK.A, RANK.B, RANK.C]).toEqual([85, 70, 50, 30]);
    expect(RANK.PAD_BOSS).toBeGreaterThan(RANK.PAD);
    expect(RANK.JAM_COST_BOSS).toBeLessThan(RANK.JAM_COST);
    expect(RANK.SKIP_BEST).toBe(RANK.S - 1);
  });

  // defence = 35 - 30 x hits / (kills + 20, or + 60 on a world boss stage) - 2 x jams (1.5 x on a world boss stage)
  const table: [string, Partial<RunStats>, number, 'S' | 'A' | 'B' | 'C' | 'D'][] = [
    ['no hits, no jams: full marks', {}, 100, 'S'],
    ['20 hits over 40 monsters', { hitsTaken: 20 }, 90, 'S'], // 35 - 30 x 20/60 = 25
    ['30 hits over 40 monsters: the S line', { hitsTaken: 30 }, 85, 'S'], // 35 - 15 = 20
    ['30 hits and one jam: just under S', { hitsTaken: 30, heals: 1 }, 83, 'A'],
    ['40 hits and 3 jams', { hitsTaken: 40, heals: 3 }, 74, 'A'], // 35 - 20 - 6 = 9
    ['60 hits and 4 jams: Defence gone, still B', { hitsTaken: 60, heals: 4 }, 65, 'B'],
    ['200 hits: Defence stops at 0', { hitsTaken: 200, heals: 8 }, 65, 'B'],
    ['the same 40 hits against 80 monsters is a better defence', { hitsTaken: 40, kills: 80 }, 88, 'S'], // 35 - 30 x 40/100 = 23
    ['world boss stage: 40 hits, 40 monsters, 5 jams', { boss: true, hitsTaken: 40, heals: 5 }, 81, 'A'], // 35 - 12 - 7.5 = 15.5 -> 80.5
    ['world boss stage: 30 hits and 3 jams is an S', { boss: true, hitsTaken: 30, heals: 3 }, 87, 'S'], // 35 - 9 - 4.5 = 21.5
    ['the same run on an ordinary stage is an A', { hitsTaken: 30, heals: 3 }, 79, 'A'], // 35 - 15 - 6 = 14
    ['slow (1.3 x par) and clean', { time: 390 }, 80, 'A'], // time 20
    ['at 1.6 x par the Time part is gone', { time: 480, hitsTaken: 30 }, 45, 'C'],
    ['nothing right at all', { time: 600, hitsTaken: 99, heals: 8, maxCombo: 0, perfects: 0, interrupts: 0, styleSum: 0 }, 0, 'D'],
  ];
  it.each(table)('%s', (_name, o, score, rank) => {
    expect(rankOf(mkRun(o), PAR)).toEqual({ rank, score });
  });

  it('the parts are capped and add up to the score', () => {
    const p = rankParts(mkRun({ hitsTaken: 20, heals: 1, maxCombo: 500, perfects: 50 }), PAR);
    expect(p.time).toBe(40); expect(p.combo).toBe(12); expect(p.style).toBe(13);
    expect(p.defence).toBeCloseTo(35 - 30 * 20 / 60 - 2, 6);
    expect(p.score).toBe(Math.round(p.time + p.defence + p.combo + p.style));
  });

  it('waiting changes nothing: any time up to par scores the same, whatever the hits', () => {
    for (const hitsTaken of [0, 12, 30, 55]) {
      const quick = rankOf(mkRun({ time: 60, hitsTaken, heals: 2 }), PAR);
      for (const time of [61, 150, 299, 300]) expect(rankOf(mkRun({ time, hitsTaken, heals: 2 }), PAR)).toEqual(quick);
      // (the old per-minute rule turned this very run from B into S just by standing around until par)
      expect(rankOf(mkRun({ time: 301, hitsTaken, heals: 2 }), PAR).score).toBeLessThanOrEqual(quick.score);
    }
  });

  it('more hits, more jams or fewer monsters never raise the score', () => {
    const base = mkRun({ hitsTaken: 25, heals: 2 });
    const s = rankOf(base, PAR).score;
    expect(rankOf({ ...base, hitsTaken: 26 }, PAR).score).toBeLessThanOrEqual(s);
    expect(rankOf({ ...base, heals: 3 }, PAR).score).toBeLessThan(s);
    expect(rankOf({ ...base, kills: 30 }, PAR).score).toBeLessThan(s);
    expect(rankOf({ ...base, kills: 60 }, PAR).score).toBeGreaterThan(s);
  });

  it('SKIP TO BOSS: a perfect skipped run is an A, never an S; below the cap it scores like any other run', () => {
    const perfect = mkRun({ time: 25, kills: 1, hitsTaken: 0 });
    expect(rankOf(perfect, PAR)).toEqual({ rank: 'S', score: 100 });
    expect(rankOf({ ...perfect, skipped: true }, PAR)).toEqual({ rank: 'A', score: 84 });
    const rough = mkRun({ time: 40, kills: 1, hitsTaken: 12, heals: 1 }); // 35 - 30 x 12/21 - 2 = 15.9
    expect(rankOf({ ...rough, skipped: true }, PAR)).toEqual(rankOf(rough, PAR));
    expect(rankOf({ ...rough, skipped: true }, PAR).rank).toBe('A');
  });

  it('the World fills in the two flags itself, so callers still pass only (run, par)', () => {
    const d = derive(newProfile(CLASSES[0].species));
    const boss = STAGES.find(s => s.id === '1-10')!, plain = STAGES.find(s => s.id === '1-2')!;
    expect(new World(boss, d).run.boss).toBe(true);
    const w = new World(plain, d);
    expect(w.run.boss).toBeUndefined(); expect(w.run.skipped).toBeUndefined();
    w.skipToBoss();
    expect(w.run.skipped).toBe(true);
    // a spotless skipped run stops at A
    Object.assign(w.run, { time: 20, maxCombo: 40, perfects: 4, interrupts: 20, styleSum: 10, styleTime: 1 });
    expect(rankOf(w.run, plain.par)).toEqual({ rank: 'A', score: RANK.SKIP_BEST });
    // only the world bosses are judged on the boss scale
    expect(STAGES.filter(s => s.boss).map(s => s.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(n => `${n}-10`));
  });

  it('the chest odds still treat A as the usual rank', () => {
    expect(clearLevel(10, 'S', true)).toBeGreaterThan(clearLevel(10, 'A', true));
    expect(clearLevel(10, 'A', true)).toBeGreaterThan(clearLevel(10, 'B', true));
  });
});

describe('stage challenges after the rank change', () => {
  const ctx = (o: Partial<RunStats>, rank: ChallengeCtx['rank'] = 'B', bossHits = 9): ChallengeCtx => ({ run: mkRun(o), rank, par: PAR, bossHits });
  const byId = Object.fromEntries(CHALLENGES.map(c => [c.id, c]));
  const ALL = STAGES.filter(s => /^\d+-\d+$/.test(s.id)).map(s => s.id);

  it('Slippery asks for a number of perfect dodges a skilled run does make', () => {
    expect(SLIPPERY_DODGES).toBe(4);
    expect(byId.dodge.desc).toBe('Make 4 perfect dodges');
    expect(byId.dodge.done(ctx({ perfects: 3 }))).toBe(false);
    expect(byId.dodge.done(ctx({ perfects: 4 }))).toBe(true);
  });

  it('Express Order is an easy one now and Slippery a hard one (the better box)', () => {
    expect(['nojam', 'srank', 'dodge', 'boss'].every(isHardChallenge)).toBe(true);
    expect(['onejam', 'arank', 'combo', 'fast'].some(isHardChallenge)).toBe(false);
  });

  it('every story stage has 3 different challenges, never both jam ones, and the same ones every time', () => {
    expect(ALL.length).toBe(110);
    for (const id of ALL) {
      const ids = challengesFor(id).map(c => c.id);
      expect(new Set(ids).size, id).toBe(3);
      expect(ids.includes('nojam') && ids.includes('onejam'), id).toBe(false);
      expect(challengesFor(id).map(c => c.id)).toEqual(ids);
      const hard = ids.filter(isHardChallenge).length, n = Number(id.split('-')[1]);
      if (!NO_STAR_CHEF.has(id)) expect(hard, id).toBe(n <= 3 ? 1 : 2);
    }
    expect(challengesFor('E-3')).toEqual([]);
  });

  it('Star Chef is gone only from the stages where S stays out of reach, and still on plenty of others', () => {
    expect(NO_STAR_CHEF.size).toBe(11);
    for (const id of NO_STAR_CHEF) expect(challengesFor(id).some(c => c.id === 'srank'), id).toBe(false);
    expect(challengesFor('3-3').map(c => c.id)).toEqual(['onejam', 'combo', 'arank']); // was onejam, combo, srank
    expect(challengesFor('9-1').map(c => c.id)).toEqual(['arank', 'onejam', 'boss']); // already had Top Marks: Untouchable instead
    const withS = ALL.filter(id => challengesFor(id).some(c => c.id === 'srank'));
    expect(withS.length).toBeGreaterThanOrEqual(30);
    // every world can still reach the secret-stage star count
    for (let w = 1; w <= 11; w++) expect(ALL.filter(id => id.startsWith(`${w}-`)).length * 3).toBeGreaterThanOrEqual(STARS_FOR_SECRET);
  });
});

describe('stars already earned stay earned (keepStars)', () => {
  it('leaves a tidy save exactly as it is', () => {
    const saved = { '1-1': challengesFor('1-1').map(c => c.id), '4-6': [challengesFor('4-6')[1].id], 'E-2': ['whatever'] };
    const before = JSON.parse(JSON.stringify(saved));
    expect(keepStars(saved)).toEqual(before);
    expect(keepStars(undefined)).toBeUndefined();
  });

  it('an Express Order star on a stage that now lists Slippery moves onto Slippery (and the other way round)', () => {
    // 6-7 was combo, boss, fast and is now combo, boss, dodge; 10-1 was dodge, combo, nojam and is now fast, combo, nojam
    expect(challengesFor('6-7').map(c => c.id)).toEqual(['combo', 'boss', 'dodge']);
    expect(challengesFor('10-1').map(c => c.id)).toEqual(['fast', 'combo', 'nojam']);
    const saved = keepStars({ '6-7': ['fast'], '10-1': ['combo', 'dodge'] })!;
    expect(saved['6-7']).toEqual(['dodge']);
    expect(saved['10-1'].sort()).toEqual(['combo', 'fast']);
  });

  it('a Star Chef star on a stage that lost Star Chef moves onto its stand-in', () => {
    expect(keepStars({ '3-3': ['srank'] })!['3-3']).toEqual(['arank']);
    // 9-1 already had Top Marks, which an S clear also earned: the star lands on the new third challenge
    expect(keepStars({ '9-1': ['arank', 'srank'] })!['9-1'].sort()).toEqual(['arank', 'boss']);
    // 6-5 lost two (dodge -> fast, srank -> arank)
    expect(keepStars({ '6-5': ['srank', 'nojam', 'dodge'] })!['6-5'].sort()).toEqual(['arank', 'fast', 'nojam']);
  });

  it('never loses a star, never makes one, never leaves more than 3 on a stage, and settles in one pass', () => {
    const OLD_EASY = ['onejam', 'arank', 'combo', 'dodge'], OLD_HARD = ['nojam', 'srank', 'fast', 'boss'];
    /** the picker as it was before 2026-11-14 */
    const oldFor = (stageId: string): string[] => {
      const [w, n] = stageId.split('-').map(Number);
      let s = (w * 131 + n * 17) >>> 0;
      const r = () => { s = (s * 1103515245 + 12345) >>> 0; return s / 4294967296; };
      const pick = (a: string[], k: number) => { const c = [...a]; const out: string[] = []; while (out.length < k) out.push(c.splice(Math.floor(r() * c.length), 1)[0]); return out; };
      const ids = n <= 3 ? [...pick(OLD_EASY, 2), ...pick(OLD_HARD, 1)] : [...pick(OLD_EASY, 1), ...pick(OLD_HARD, 2)];
      if (ids.includes('nojam') && ids.includes('onejam')) ids[ids.indexOf('onejam')] = OLD_EASY.find(e => !ids.includes(e) && e !== 'onejam')!;
      return ids;
    };
    let moved = 0;
    for (let w = 1; w <= 10; w++) for (let n = 1; n <= 10; n++) {
      const id = `${w}-${n}`, old = oldFor(id), now = challengesFor(id).map(c => c.id);
      // nothing but the two swaps and the Star Chef stand-ins changed
      for (const x of old) if (!now.includes(x)) { moved++; expect(['fast', 'dodge', 'srank'], id).toContain(x); }
      // every subset of the old stars a player could hold
      for (let mask = 0; mask < 8; mask++) {
        const had = old.filter((_, i) => mask & (1 << i));
        const out = keepStars({ [id]: [...had] })![id];
        expect(out.length, `${id} ${had}`).toBe(had.length);
        expect(new Set(out).size).toBe(out.length);
        expect(out.every(x => now.includes(x)), `${id} ${had} -> ${out}`).toBe(true);
        for (const x of had) if (now.includes(x)) expect(out).toContain(x);
        expect(keepStars({ [id]: [...out] })![id]).toEqual(out);
      }
    }
    expect(moved).toBeGreaterThan(40);
  });

  it('loading an old save keeps the star count, and a moved star is not paid a second time', async () => {
    const first = await import('../src/save');
    const old = JSON.parse(JSON.stringify(first.save)) as typeof first.save;
    old.challenges = { '6-7': ['fast', 'combo'], '3-3': ['srank'], '1-1': challengesFor('1-1').map(c => c.id) };
    old.crumbs = 0; old.boxes = [];
    const json = JSON.stringify(old);
    vi.stubGlobal('localStorage', { getItem: () => json, setItem: () => undefined });
    vi.resetModules();
    try {
      const mod = await import('../src/save');
      expect(mod.save.challenges!['6-7'].sort()).toEqual(['combo', 'dodge']);
      expect(mod.save.challenges!['3-3']).toEqual(['arank']);
      expect(mod.worldStars(6)).toBe(2); expect(mod.worldStars(3)).toBe(1); expect(mod.worldStars(1)).toBe(3);
      expect(Object.keys(mod.save).sort()).toEqual(Object.keys(old).sort());
      // a clear of 6-7 that meets all three: only Untouchable is new (Slippery holds the star carried over from Express Order)
      const run = mkRun({ perfects: 9, maxCombo: 60 });
      const res = mod.finishStage('6-7', 'A', [], 30, false, false, 0, false, { run, rank: 'A', par: PAR, bossHits: 0 });
      expect(res.newChallenges).toEqual(['Untouchable']);
      expect(mod.save.challenges!['6-7'].sort()).toEqual(['boss', 'combo', 'dodge']);
      expect(mod.finishStage('6-7', 'A', [], 30, false, false, 0, false, { run, rank: 'A', par: PAR, bossHits: 0 }).newChallenges).toEqual([]);
    } finally { vi.unstubAllGlobals(); vi.resetModules(); }
  });
});

describe('quests that asked for the impossible', () => {
  it('Toastbat joins after 3 clears at rank A or better, counted on the counter that always existed', () => {
    const u = UNLOCKS.find(x => x.species === 5)!;
    expect(u).toMatchObject({ key: 'rankA', goal: 3, text: 'Clear 3 stages with an A rank or better' });
    expect(UNLOCKS.some(x => x.key === 'rankS')).toBe(false);
  });

  it('no kaiju quest needs a clear without being hit any more; the fifth quest is an S rank on any stage', () => {
    for (const c of CLASSES) {
      const qs = kaijuQuests(c.species);
      expect(qs.map(q => q.id)).toEqual(['foe', 'skill', 'rank', 'combo', 'nohit', 'golem', 'ult', 'hard']); // ids are saved: unchanged
      expect(qs.some(q => q.key === 'nohit' || /without being hit/.test(q.text))).toBe(false);
      expect(qs[4]).toMatchObject({ key: S_RANK_KEY, goal: 1, text: 'Clear any stage with an S rank' });
    }
  });

  it('old progress carries over: an S already on the books counts, a claimed quest stays claimed and is not paid again', async () => {
    const first = await import('../src/save');
    const old = JSON.parse(JSON.stringify(first.save)) as typeof first.save;
    const [a, b, c, d] = [0, 10, 11, 4];
    old.heroes[a].cleared = { '1-1': 'A', '1-2': 'S' };            // an S from before the change
    old.heroes[b].cleared = { '1-1': 'A' }; old.heroes[b].stats = { nohit: 1 }; // "no hits" done on a skip, never claimed: no longer enough
    old.heroes[c].kq = ['nohit']; old.heroes[c].stats = { nohit: 1 };           // claimed under the old rule
    old.heroes[d].hardCleared = { '2-4': 'S' };                    // Hard mode counts too
    (old as unknown as { quest: unknown }).quest = { stats: { rankS: 1, rankA: 7 }, daily: { day: '', q: [], bonus: false }, ach: {} };
    old.unlocked = [0, 10, 11, 4];
    const json = JSON.stringify(old);
    vi.stubGlobal('localStorage', { getItem: () => json, setItem: () => undefined });
    vi.resetModules();
    try {
      const save = await import('../src/save');
      const q = await import('../src/quests');
      const nohit = (sp: number) => q.kaijuQuestState(sp).find(x => x.id === 'nohit')!;
      expect(nohit(a)).toMatchObject({ prog: 1, goal: 1, claimed: false });
      expect(nohit(b)).toMatchObject({ prog: 0, claimed: false });
      expect(nohit(c)).toMatchObject({ claimed: true });
      expect(nohit(d)).toMatchObject({ prog: 1 });
      expect(q.claimKaijuQuest(c, 'nohit')).toBeNull();
      expect(q.claimKaijuQuest(b, 'nohit')).toBeNull();
      const boxes = save.save.boxes.length;
      expect(q.claimKaijuQuest(a, 'nohit')).toBeTruthy();
      expect(save.save.boxes.length).toBe(boxes + 1);
      expect(q.claimKaijuQuest(a, 'nohit')).toBeNull();
      // Toastbat: 1 S and 7 A-or-better on the old counters -> recruited at once, and only once
      expect(q.unlockProgress().find(u => u.species === 5)).toMatchObject({ prog: 3, goal: 3, done: false });
      expect(q.checkUnlocks()).toContain(5);
      expect(q.checkUnlocks()).not.toContain(5);
      expect(save.save.unlocked.filter(s => s === 5).length).toBe(1);
    } finally { vi.unstubAllGlobals(); vi.resetModules(); }
  });
});

describe('SKIP TO BOSS pays the boss-room clear and nothing on top', () => {
  const plain = STAGES.find(s => s.id === '1-5')!;
  const d = () => derive(newProfile(CLASSES[0].species));
  const NO: import('../src/sim/types').Input = { left: false, right: false, up: false, down: false, jump: false, attack: false, dodge: false, skill: -1 } as never;

  it('a skipped run starts without chillies: no clock, no glass jaw, no jam ban, nothing for the scene to pay a bonus on', () => {
    const w = new World(plain, d(), 5, [{ id: 'jam', n: 3 }, null, null, null], 0, false, undefined, ['clock', 'glass', 'nopots']);
    expect(w.spicy.length).toBe(3);
    w.skipToBoss();
    expect(w.spicy).toEqual([]);
    expect(w.run.skipped).toBe(true);
    // far past par: "Beat the clock" would have failed the stage
    w.run.time = plain.par + 50;
    for (let i = 0; i < 5; i++) w.step(NO);
    expect(w.hero.state).not.toBe('down'); expect(w.failed).toBe(false);
    // an unskipped run keeps its chillies, and the clock still bites
    const full = new World(plain, d(), 5, [], 0, false, undefined, ['clock']);
    full.run.time = plain.par + 50;
    for (let i = 0; i < 5; i++) full.step(NO);
    expect(full.spicy).toEqual(['clock']); expect(full.hero.state).toBe('down');
  });

  it('finishStage: no chilli boxes, no stars, no S, even if a caller passes them in; quests about rank do not move', async () => {
    const first = await import('../src/save');
    const old = JSON.parse(JSON.stringify(first.save)) as typeof first.save;
    old.challenges = {}; old.crumbs = 0; old.boxes = []; old.unlocked = [0, 10, 11, 4]; old.selected = 0;
    (old as unknown as { quest: unknown }).quest = { stats: {}, daily: { day: '', q: [], bonus: false }, ach: {} };
    const json = JSON.stringify(old);
    vi.stubGlobal('localStorage', { getItem: () => json, setItem: () => undefined });
    vi.resetModules();
    try {
      const mod = await import('../src/save');
      const q = await import('../src/quests');
      const sch = await import('../src/sim/challenges');
      const spotless = mkRun({ time: 20, kills: 1, perfects: 9, maxCombo: 60, heals: 0 });
      const ctxOf = (run: RunStats) => ({ run, rank: 'A' as const, par: PAR, bossHits: 0 });
      // what the scene reports after finishStage (GameScene.finish)
      const report = (rank: string) => { q.trackHero(0, 'clear:1-5', ['D', 'C', 'B', 'A', 'S'].indexOf(rank) + 1, true); q.trackHero(0, 'nohit'); q.track('spicy'); q.track('clears'); q.track('rankA'); q.track('rankS'); };

      // the same spotless boss-room run, not skipped, with 3 chillies: 3 bonus boxes and every star on 1-5
      expect(sch.challengesMet('1-5', ctxOf(spotless)).length).toBe(3);
      expect(sch.challengesMet('1-5', ctxOf({ ...spotless, skipped: true }))).toEqual([]);

      const skip = mod.finishStage('1-5', 'S', [], 5, false, false, 3, false, ctxOf({ ...spotless, skipped: true }));
      expect(skip.rank).toBe('A');
      expect(skip.spicy).toBe(0);
      expect(skip.newChallenges).toEqual([]); expect(skip.crumbs).toBe(0);
      expect(mod.save.challenges?.['1-5'] ?? []).toEqual([]);
      expect(mod.worldStars(1)).toBe(0);
      expect(mod.save.heroes[0].cleared['1-5']).toBe('A'); // it is still a clear
      const skipBoxes = skip.boxes.length;
      report(skip.rank);
      expect(q.statOf('clears')).toBe(1);
      expect(q.statOf('rankA')).toBe(0); expect(q.statOf('rankS')).toBe(0); expect(q.statOf('spicy')).toBe(0);
      expect(mod.save.heroes[0].stats['clear:1-5']).toBeUndefined();
      expect(mod.save.heroes[0].stats.nohit).toBeUndefined();
      expect(q.unlockProgress().find(u => u.species === 5)!.prog).toBe(0);

      // the full run right after: chillies, stars and rank quests all count again
      const full = mod.finishStage('1-5', 'A', [], 5, false, false, 3, false, ctxOf(spotless));
      expect(full.spicy).toBe(3);
      expect(full.newChallenges!.length).toBe(3);
      expect(full.boxes.length).toBeGreaterThanOrEqual(skipBoxes - 1 + 3 + 3); // (-1: the first-clear box went to the skip run)
      report(full.rank);
      expect(q.statOf('clears')).toBe(2); expect(q.statOf('rankA')).toBe(1); expect(q.statOf('spicy')).toBe(1);
      expect(mod.save.heroes[0].stats['clear:1-5']).toBe(4);
    } finally { vi.unstubAllGlobals(); vi.resetModules(); }
  });
});
