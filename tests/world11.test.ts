// World 11, The Midway (Act 3): its stages, monsters, drops, boss weapons and unlock, The Great Flosso and his one new move
// (the Wheel of Misfortune), the Caramel Drip hazard, and how the level cap and Free Play pick the world up.
// The world is built ahead of its story and its screens: nothing here needs a scene, a map page or a taunt.
import { describe, expect, it, vi } from 'vitest';
import { heroFor } from '../scripts/hero-at';
import { makeSnapshot, applySnapshot } from '../src/net/snapshot';
import { BOSS_WEAPONS, bossWeaponFor } from '../src/sim/bossgearData';
import { Bot, SKILLED } from '../src/sim/bot';
import { chaosRun } from '../src/sim/chaos';
import { CLASSES } from '../src/sim/classes';
import { cookbook, neverWantedKinds, titleName } from '../src/sim/cookbook';
import { DROPS, dropIcon, dropName } from '../src/sim/drops';
import { stageElements, weakOf } from '../src/sim/elements';
import { dailyStage, endlessFloor, powerFor, rushStages } from '../src/sim/free';
import { GEAR } from '../src/sim/gear';
import { BASES, rollItem } from '../src/sim/items';
import { BOSS_PATTERNS, MOBS, WHEEL, WHEEL_PICKS, type WheelPick, nemesisOf, wheelPick } from '../src/sim/mobs';
import { BONUS_STAGES, ROOM_FOES, STAGES, WORLDS, bossRoom, roomFoe } from '../src/sim/stages';
import { MAX_LEVEL, derive, gainXp, newProfile, xpFor } from '../src/sim/stats';
import { NO_INPUT, type MobKind, type SimEvent } from '../src/sim/types';
import { World } from '../src/sim/world';

const W11 = WORLDS.find(w => w.id === 11)!;
const stages = STAGES.filter(s => s.world === 11);
const NINE: [MobKind, string, string, string][] = [ // kind, name, brain, drop: docs/ACT3-OUTLINE.md section 4
  ['cadet', 'Corn Dog Cadet', 'walker', 'Paper Hat'], ['toffee', 'Toffee Apple Bouncer', 'hopper', 'Toffee Shard'], ['floss', 'Floss Wisp', 'flyer', 'Floss Puff'],
  ['snowcone', 'Snow Cone Slinger', 'ranged', 'Syrup Drop'], ['bumper', 'Bumper Cupcake', 'charger', 'Rubber Bumper'], ['churro', 'Whack-a-Churro', 'burrower', 'Cinnamon Sugar'],
  ['coconut', 'Coconut Shy Lobber', 'turret', 'Coconut Shell'], ['pretzel', 'Ring Toss Pretzel', 'sniper', 'Lucky Ring'], ['jawbreaker', 'Jawbreaker Strongman', 'brute', 'Jawbreaker Chip'],
];

describe('World 11: The Midway', () => {
  it('ten stages, levels 111-120, ending with The Great Flosso; the level cap reaches him', () => {
    expect(W11).toMatchObject({ name: 'The Midway', baseLv: 111, boss: 'flosso', elite: 'xjawbreaker', mimic: 'mimic', hazard: 'wax', hazardSkin: 'caramel', hazardName: 'Caramel Drip' });
    expect(stages.map(s => s.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => `11-${n}`));
    expect(stages.map(s => s.name)).toEqual(['The Ticket Gate', 'Bunting Boulevard', 'Ring Toss Row', 'Bumper Car Bay', 'Test Your Strength', 'Helter-Skelter Heights', 'Hall of Mirrors', 'The Coconut Shy', 'Big Wheel Climb', 'The Big Top']);
    expect(stages.map(s => s.rec)).toEqual([111, 112, 113, 114, 115, 116, 117, 118, 119, 120]);
    expect(stages[9].mobs[0].kind).toBe('flosso'); expect(stages[9].boss).toBe(true); expect(stages[9].bossBg).toBe('bg-far-bigtop');
    expect(MAX_LEVEL).toBe(120);
    expect(STAGES.length).toBe(WORLDS.length * 10);
    for (const s of stages) expect([s.bg, s.mid, s.tile]).toEqual(['bg-far-midway', 'bg-mid-midway', 'tile-midway']);
  });

  it('the level cap: a Lv 110 kaiju levels on to 120 and stops there', () => {
    const p = newProfile(0); p.level = 110;
    let guard = 0;
    while (p.level < MAX_LEVEL && guard++ < 50) expect(gainXp(p, xpFor(p.level))).toBe(1);
    expect(p.level).toBe(120);
    expect(gainXp(p, 1e9)).toBe(0); expect(p.xp).toBe(0);
    expect(xpFor(119)).toBeGreaterThan(xpFor(109));
    // gear: no sixth tier, item levels simply go on; the Market and boxes roll fine at item level 120
    const r = (() => { let s = 7; return () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff); })();
    for (let i = 0; i < 400; i++) { const it = rollItem(i, (1 + (i % 5)) as 1 | 2 | 3 | 4 | 5, 120, r, []); expect(it.ilvl).toBe(120); expect(BASES[it.base].tier ?? 1).toBeLessThanOrEqual(5); expect(BASES[it.base].boss).toBeUndefined(); }
  });

  it('nine new monsters on the brains the outline gives them, each with its drop; new kinds are added at the END of MOBS', () => {
    for (const [k, name, brain, drop] of NINE) {
      expect(MOBS[k], k).toMatchObject({ name, brain, art: `mob-${k}` });
      expect(dropName(k)).toBe(drop); expect(dropIcon(k)).toBe(`drop-${k}`); expect(DROPS[k]).toBeTruthy();
    }
    expect(W11.pool).toEqual([[1, 'cadet'], [1, 'toffee'], [1, 'floss'], [2, 'snowcone'], [2, 'bumper'], [3, 'churro'], [4, 'coconut'], [5, 'pretzel'], [7, 'jawbreaker']]);
    expect(MOBS.jawbreaker).toMatchObject({ armor: true, shield: true });
    // online snapshots send a monster's kind as its index in MOBS (net/snapshot.ts KINDS): the 209 kinds of Worlds 1-10 keep
    // their places, and everything new comes after them
    const keys = Object.keys(MOBS);
    expect(keys.indexOf('bun')).toBe(0); expect(keys.indexOf('cracker2')).toBe(208); expect(keys[209]).toBe('cadet');
    expect(keys.slice(209).sort()).toEqual(['cadet', 'toffee', 'floss', 'snowcone', 'bumper', 'churro', 'coconut', 'pretzel', 'jawbreaker', 'flosso', 'm11a', 'm11b', 'm11c', 'm11d', 'm11e', 'kcadet', 'kbumper', 'kcoconut', 'xjawbreaker'].sort());
  });

  it('boss rooms in the outline\'s order: King, mini, mini, King, champion, mini, mini, King, mini, then Flosso', () => {
    expect(ROOM_FOES[11]).toEqual(['kcadet', 'm11a', 'm11b', 'kbumper', 'm11c', 'm11d', 'kcoconut', 'm11e']);
    expect(stages.map(s => s.mobs[0].kind)).toEqual(['kcadet', 'm11a', 'm11b', 'kbumper', 'xjawbreaker', 'm11c', 'm11d', 'kcoconut', 'm11e', 'flosso']);
    expect(stages.map(s => MOBS[s.mobs[0].kind].name)).toEqual(['King Corn Dog Cadet', 'Pretzel Contortionist', 'Gumball Gunner', 'King Bumper Cupcake', 'Jawbreaker Strongman', 'Fry Basket Brawler', 'Carousel Macaron Pony', 'King Coconut Shy Lobber', 'Bonbon the Cannonball', 'The Great Flosso']);
    expect(roomFoe(11, 6)).toBe('m11c');
    for (const k of [...ROOM_FOES[11], 'xjawbreaker'] as MobKind[]) {
      const d = MOBS[k];
      expect(d, k).toMatchObject({ brain: 'nemesis', mini: true, armor: true });
      expect(d.nem!.moves.length).toBe(4); expect(d.nem!.names.length).toBe(4); expect(d.nem!.species).toBe(-1);
    }
    for (const k of ['kcadet', 'kbumper', 'kcoconut'] as MobKind[]) { expect(MOBS[k].king).toBe(true); expect(MOBS[k].art).toBe(MOBS[k.slice(1) as MobKind].art); }
    // the moves the outline lists (Bonbon's `dive` is a flyer-only move: he gets the cannon-shot `boomhop` instead)
    expect(MOBS.kcadet.nem!.moves).toEqual(['slash', 'charge', 'summon', 'roar']); expect(MOBS.kcadet.nem!.calls).toBe('cadet');
    expect(MOBS.m11a.nem!.moves).toEqual(['spin', 'leap', 'yank', 'slash']);
    expect(MOBS.m11b.nem!.moves).toEqual(['fanshot', 'lob', 'rain', 'roar']);
    expect(MOBS.kbumper.nem!.moves).toEqual(['charge', 'boomhop', 'spin', 'roar']);
    expect(MOBS.m11c.nem!.moves).toEqual(['heatwave', 'puddle', 'lob', 'summon']); expect(MOBS.m11c.nem!.calls).toBe('cadet');
    expect(MOBS.m11d.nem!.moves).toEqual(['charge', 'boomhop', 'leap', 'roar']);
    expect(MOBS.kcoconut.nem!.moves).toEqual(['lob', 'rain', 'shell', 'roar']);
    expect(MOBS.m11e.nem!.moves).toEqual(['boomhop', 'leap', 'charge', 'trap']);
  });

  it('stage identities: objectives on 4 / 6 / 8, mimics on 3 / 7 / 9, the World Key on 7, a bonus stage, Caramel Drips from 11-1', () => {
    expect(stages.map(s => s.objective?.kind ?? '')).toEqual(['', '', '', 'escort', '', 'fetch', '', 'survive', '', '']);
    expect(stages.filter(s => s.mobs.some(m => m.kind === 'mimic')).map(s => s.id)).toEqual(['11-3', '11-7', '11-9']);
    expect(stages.filter(s => (s.props ?? []).some(p => p.kind === 'chest' && p.key)).map(s => s.id)).toEqual(['11-7']);
    expect(stages.map(s => s.maps!.length)).toEqual([3, 3, 3, 4, 4, 4, 4, 4, 4, 3]); // zones + the boss room
    for (const s of stages) { expect(s.hazards!.length, s.id).toBeGreaterThan(0); expect(s.hazards!.every(h => h.kind === 'wax'), s.id).toBe(true); }
    expect(stages[9].hazards!.filter(h => h.phase2).length).toBe(2); // the Big Top's drips switch on when Flosso enrages
    const b = BONUS_STAGES.find(s => s.id === 'S-11')!;
    expect(b.name).toBe('Secret Prize Tent'); expect(b.mobs.some(m => m.elite)).toBe(true);
    // 11-1 is Cadets, Bouncers and Wisps
    expect([...new Set(stages[0].maps![0].spawns!.kinds)].sort()).toEqual(['cadet', 'floss', 'toffee']);
  });

  it('Caramel Drip is the wax mechanic exactly: a drip that hurts, then a sticky puddle', () => {
    const st = { ...stages[0], maps: undefined, mobs: [], props: [], platforms: [], ladders: [], arenas: [], objective: undefined, width: 2400, hazards: [{ kind: 'wax' as const, x: 600, w: 80, period: 3.6, on: 0.4, offset: 0 }] };
    const w = new World(st, derive(heroFor(0, 111, 1)), 3);
    w.hero.x = 610;
    const hp = w.hero.hp;
    for (let i = 0; i < 20; i++) w.step(NO_INPUT);
    expect(w.hero.hp).toBeLessThan(hp);
    expect(w.puddles.some(p => p.kind === 'slow' && Math.abs(p.x - 600) < 10)).toBe(true);
  });

  it('opens after 10-10 for that kaiju, like every world; Hard and Nightmare follow the usual rule', async () => {
    expect(STAGES.findIndex(s => s.id === '11-1')).toBe(STAGES.findIndex(s => s.id === '10-10') + 1);
    vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => undefined });
    vi.resetModules();
    try {
      const mod = await import('../src/save');
      const s = JSON.parse(JSON.stringify(mod.save)) as typeof mod.save;
      const fresh = await import('../src/sim/stages'); // the save module's own copy of the stage list (modules were reset)
      const first = fresh.STAGES.find(x => x.id === '11-1')!, second = fresh.STAGES.find(x => x.id === '11-2')!, bonus = fresh.BONUS_STAGES.find(x => x.id === 'S-11')!;
      expect(mod.stageOpen(first, s)).toBe(false);
      s.heroes[s.selected].cleared['10-10'] = 'B';
      expect(mod.stageOpen(first, s)).toBe(true); expect(mod.stageOpen(second, s)).toBe(false);
      s.heroes[s.selected].cleared['11-1'] = 'A';
      expect(mod.stageOpen(second, s)).toBe(true);
      expect(mod.stageOpen(bonus, s)).toBe(false);
      s.keys = [11];
      expect(mod.stageOpen(bonus, s)).toBe(true);
    } finally { vi.unstubAllGlobals(); vi.resetModules(); }
    // Hard: monsters 6 levels up; a world boss at Lv 128 still gets numbers
    const hard = new World(bossRoom(11), derive(heroFor(0, 120, 1)), 3, [], 0, true);
    expect(hard.mobs[0].lv).toBe(stages[9].mobs[0].lv + 6); expect(Number.isFinite(hard.mobs[0].maxHp)).toBe(true);
  });

  it('the Cookbook grows a page 11 ("Midway Cook") by itself; the shooter, burrower, turret and sniper are never wanted', () => {
    const book = cookbook(), page = book.pages.find(p => p.id === '11')!;
    expect(page.name).toBe('The Midway'); expect(titleName('w11')).toBe('Midway Cook');
    expect([...page.kinds].sort()).toEqual(NINE.map(n => n[0]).sort());
    expect(neverWantedKinds().filter(k => (page.kinds as string[]).includes(k)).sort()).toEqual(['churro', 'coconut', 'pretzel', 'snowcone']);
  });

  it('weak / resist as the outline lists them, and the stage panel summary works for World 11', () => {
    expect(stages.map(s => weakOf(s.mobs[0].kind))).toEqual(['COLD', 'STICKY', 'CRUNCH', 'STICKY', 'CRUNCH', 'COLD', 'STICKY', 'CRUNCH', 'HOT', 'HOT']);
    const se = stageElements(stages[0], 0);
    expect(se.boss).toMatchObject({ kind: 'kcadet', weakTo: 'COLD', worldBoss: false });
    expect(se.kinds.sort()).toEqual(['bumper', 'cadet', 'floss', 'snowcone', 'toffee']); expect(se.weak).toEqual({ HOT: 2, COLD: 2, STICKY: 1, CRUNCH: 0 });
    const all = [...new Set(W11.pool.map(p => p[1]))].map(weakOf); // the world leans COLD: 4 of its 9 monsters
    expect(['COLD', 'HOT', 'CRUNCH', 'STICKY'].map(el => all.filter(e => e === el).length)).toEqual([4, 2, 2, 1]);
    expect(stageElements(stages[9], 0).boss).toMatchObject({ kind: 'flosso', weakTo: 'HOT', resists: 'COLD', worldBoss: true });
    expect(stageElements(stages[4], 3).boss!.kind).toBe('xjawbreaker'); // no nemesis fights after World 5
  });

  it('20 Showman\'s weapons, one per kaiju, STICKY (glue), each a style that kaiju has from no other boss', () => {
    const fl = BOSS_WEAPONS.filter(b => b.boss === 'flosso');
    expect(fl.length).toBe(20);
    expect(new Set(fl.map(b => b.style)).size).toBe(20);
    for (const c of CLASSES) {
      const bw = bossWeaponFor('flosso', c.species)!;
      expect(bw.base).toMatch(/^bw-flosso-[a-z]+$/); expect(bw.fx).toBe('glue');
      expect(bw.name.startsWith('Showman\'s ')).toBe(true); expect(bw.skill.startsWith('Candy Floss ')).toBe(true);
      expect(BASES[bw.base]).toMatchObject({ slot: 'weapon', for: c.species, boss: 'flosso', icon: bw.base });
      expect(GEAR[bw.base]).toMatchObject({ name: bw.skill, style: bw.style, fx: 'glue' });
      expect(BOSS_WEAPONS.filter(b => b.species === c.species && b.style === bw.style).length, c.name).toBe(1);
    }
  });

  it('all its art is in the manifest (monsters, Kings, drops, backdrops, map page, boss weapons, the three paintings)', async () => {
    // @ts-ignore node types aren't in this project's tsconfig (tests run in Node)
    const fs = await import('node:fs');
    const have = new Set<string>(JSON.parse(fs.readFileSync('public/art/manifest.json', 'utf8')));
    const need = [
      ...NINE.flatMap(([k]) => [`mob-${k}`, `drop-${k}`]), 'boss-flosso', 'mob-m11a', 'mob-m11b', 'mob-m11c', 'mob-m11d', 'mob-m11e', 'mob-kcadet', 'mob-kbumper', 'mob-kcoconut',
      'bg-far-midway', 'bg-mid-midway', 'tile-midway', 'bg-far-bigtop', 'map-midway', 'still-w11-open', 'still-w11-boss', 'still-w11-cure',
      ...BOSS_WEAPONS.filter(b => b.boss === 'flosso').map(b => b.base),
      ...[...ROOM_FOES[11], 'xjawbreaker', 'flosso'].map(k => MOBS[k as MobKind].art),
    ];
    expect(need.filter(k => !have.has(k))).toEqual([]);
  });

  it('Free Play picks the world up: Daily themes, Endless floors, Boss Rush, and the strength curve to Lv 120', () => {
    expect(new Set(Array.from({ length: 22 }, (_, i) => dailyStage(20261114 + i, 115).world)).has(11)).toBe(true);
    const day = Array.from({ length: 11 }, (_, i) => 20261114 + i).find(d => dailyStage(d, 115).world === 11)!;
    const d = dailyStage(day, 115);
    expect(d.id).toBe(`D-${day}`); expect(d.maps![d.maps!.length - 1].kind).toBe('boss'); expect(MOBS[d.mobs[0].kind]).toBeTruthy();
    expect(endlessFloor(31, 115, 5).world).toBe(11); expect(endlessFloor(130, 115, 5).mobs[0].kind).toBe('flosso');
    const rush = rushStages([10, 11], 120);
    expect(rush.map(s => s.id)).toEqual(['R-10', 'R-11']); expect(rush[1].name).toBe('Boss Rush 2: The Great Flosso'); expect(rush[1].mobs[0].kind).toBe('flosso');
    expect(powerFor(111)).toBeCloseTo(5.4); expect(powerFor(120)).toBeCloseTo(5.4); expect(powerFor(101)).toBeCloseTo(5.0);
  });
});

// ---------------------------------------------------------------------------------------------------------------------
describe('The Great Flosso', () => {
  /** His room, the hero kept alive, Flosso put straight into his final phase. */
  function fight(seed: number, heroX = 300) {
    const w = new World(bossRoom(11), derive(heroFor(0, 120, 1)), seed);
    const f = w.mobs[0];
    f.bossPhase = 3; f.enraged = true; f.queue = []; f.hp = Math.round(f.maxHp * 0.2);
    w.hero.x = heroX;
    return { w, f };
  }
  /** Steps with the hero standing still and topped up; calls back every step. Stops when `until` says so. */
  function run(w: World, seconds: number, each: (evs: SimEvent[], t: number) => boolean | void): void {
    for (let i = 0; i < seconds * 60; i++) { w.hero.hp = w.hero.d.maxHp; if (each(w.step(NO_INPUT), i / 60)) return; }
  }

  it('is a world boss with three phases; the wheel is only in the last one; he calls Floss Wisps of his own type', () => {
    expect(MOBS.flosso).toMatchObject({ brain: 'boss', art: 'boss-flosso', calls: 'floss', helpers: ['floss', 'floss'], armor: true });
    const pats = BOSS_PATTERNS.flosso!;
    expect(pats.length).toBe(3);
    const moves = (i: number) => new Set([...pats[i].near, ...pats[i].far].flat());
    expect([...moves(0)].sort()).toEqual(['puddle', 'rain', 'slash', 'summon']);
    expect(moves(1).has('leap') && moves(1).has('fanshot')).toBe(true);
    expect(moves(2).has('roar') && moves(2).has('wheel')).toBe(true);
    expect(moves(0).has('wheel') || moves(1).has('wheel')).toBe(false);
    expect(Object.entries(BOSS_PATTERNS).filter(([, p]) => p!.some(ph => [...ph.near, ...ph.far].flat().includes('wheel'))).map(([k]) => k)).toEqual(['flosso']);
    expect(weakOf('flosso')).toBe(weakOf('floss'));
  });

  it('Wheel of Misfortune: the symbol is called out as the long wind-up starts, then that move lands at double size', () => {
    const seen = new Set<WheelPick>();
    for (const seed of [3, 4, 5, 6]) {
      const { w, f } = fight(seed, 300);
      let pick: WheelPick | undefined, t0 = 0, kidsBefore = 0, shots0 = 0, rainT = -1;
      run(w, 90, (evs, t) => {
        const p = wheelPick(f.move);
        if (p && f.state === 'windup' && !pick) { // the wheel has just stopped
          pick = p; t0 = t; seen.add(p);
          expect(evs.some(e => e.t === 'nemesisMove' && e.move === `Wheel of Misfortune: ${WHEEL.names[p]}`), `callout ${p}`).toBe(true);
          expect(evs.some(e => e.t === 'mobAttack' && e.kind === 'wheel-' + p)).toBe(true);
          kidsBefore = w.mobs.filter(o => o.parent === f.id && o.state !== 'dead').length;
        } else if (pick && p === pick && f.state === 'windup') {
          expect(evs.some(e => e.t === 'shock' && e.r === WHEEL.roarR)).toBe(false); // nothing lands during the wind-up
          shots0 = w.shots.filter(s => s.from === 'mob' && s.kind === 'icicle').length;
        } else if (pick && p === pick && f.state === 'attack') {
          if (rainT < 0) { // the frame it lands
            expect(t - t0, 'time to read the wheel').toBeGreaterThan(1.0);
            if (pick === 'roar') expect(evs.some(e => e.t === 'shock' && e.r === WHEEL.roarR)).toBe(true);
            if (pick === 'summon') {
              const kids = w.mobs.filter(o => o.parent === f.id && o.state !== 'dead');
              expect(kids.length - kidsBefore).toBe(Math.min(WHEEL.wisps, WHEEL.maxWisps - kidsBefore));
              expect(kids.every(k => k.kind === 'floss')).toBe(true); expect(kids.length).toBeLessThanOrEqual(WHEEL.maxWisps);
            }
            if (pick === 'rain') expect(w.shots.filter(s => s.from === 'mob' && s.kind === 'icicle').length - shots0).toBe(5);
            rainT = t;
          }
        } else if (pick && !p) { pick = undefined; rainT = -1; } // on to the next move
        return seen.size === WHEEL_PICKS.length && !pick;
      });
    }
    expect([...seen].sort()).toEqual([...WHEEL_PICKS].sort());
    expect(WHEEL.roarR).toBe(480); expect(WHEEL.wisps).toBe(4); // double a roar (240) and a summon (2)
  });

  it('the wheel\'s sugar shower is two showers: five drops, then five more aimed afresh', () => {
    const { w, f } = fight(3, 300);
    f.state = 'windup'; f.move = 'wheel-rain'; f.t = 0; f.vx = 0;
    let total = 0; const ids = new Set<number>();
    run(w, 5, () => { for (const s of w.shots) if (s.from === 'mob' && s.kind === 'icicle' && !ids.has(s.id)) { ids.add(s.id); total++; } return f.move !== 'wheel-rain'; });
    expect(total).toBe(10);
  });

  it('the wheel\'s shockwave is twice as wide as a roar but no taller: far along the floor it still hits, up on the top ledge it does not', () => {
    const hit = (move: string, at: 'floor' | 'ledge', dx: number) => {
      const { w, f } = fight(3, 300);
      const top = w.stage.platforms.slice().sort((a, b) => a.y - b.y)[0];
      f.x = top.x + top.w / 2; f.state = 'windup'; f.move = move; f.t = 0; f.vx = 0;
      const h = w.hero;
      if (at === 'ledge') { h.x = f.x + dx; h.y = top.y; h.on = w.stage.platforms.indexOf(top); h.ground = true; } else h.x = f.x + dx;
      let lost = 0;
      for (let i = 0; i < 60 * 4 && f.move === move; i++) { const hp = (h.hp = h.d.maxHp); w.step(NO_INPUT); lost += hp - h.hp; if (at === 'ledge') expect(h.y).toBeLessThan(w.stage.groundY - 150); }
      return lost > 0;
    };
    expect(hit('wheel-roar', 'floor', 400)).toBe(true);   // out of a plain roar's reach, inside the wheel's
    expect(hit('roar', 'floor', 400)).toBe(false);
    expect(hit('wheel-roar', 'floor', 520)).toBe(false);  // run far enough and it misses
    expect(hit('wheel-roar', 'ledge', 60)).toBe(false);   // the room's top ledge (a ladder leads up) is above it
  });

  it('the wheel is deterministic (the same seed spins the same symbols) and reaches online guests in the snapshot as it is', () => {
    const picks = (seed: number) => { const { w, f } = fight(seed, 300); const out: string[] = []; let last = ''; run(w, 40, () => { if (f.move !== last && wheelPick(f.move)) out.push(f.move); last = f.move; }); return out.join(','); };
    expect(picks(11)).toBe(picks(11));
    expect(picks(11).split(',').length).toBeGreaterThan(3);
    // host -> guest: the pick rides in the monster's move string, which every snapshot already carries (no new field)
    const { w, f } = fight(5, 300);
    const guest = new World(bossRoom(11), derive(heroFor(0, 120, 1)), 99);
    let checked = false;
    run(w, 60, () => {
      if (!(wheelPick(f.move) && f.state === 'windup')) return false;
      const snap = JSON.parse(JSON.stringify(makeSnapshot(w))) as ReturnType<typeof makeSnapshot>;
      expect(snap.m.find(a => a[0] === f.id)![8]).toBe(f.move);
      applySnapshot(guest, snap);
      const g = guest.mobs.find(m => m.id === f.id)!;
      expect(g.kind).toBe('flosso'); expect(g.move).toBe(f.move); expect(g.state).toBe('windup'); expect(wheelPick(g.move)).toBe(wheelPick(f.move));
      return (checked = true);
    });
    expect(checked).toBe(true);
  });

  it('his helpers at 66% and 33% health are Floss Wisps (earlier bosses keep their Moldy Buns and Pepper Grunts)', () => {
    const helpers = (world: number) => {
      const w = new World(bossRoom(world), derive(heroFor(0, WORLDS[world - 1].baseLv + 9, 1)), 3);
      const f = w.mobs[0]; f.hp = Math.round(f.maxHp * 0.6);
      w.hero.x = 300;
      for (let i = 0; i < 60 * 6 && f.summoned < 1; i++) { w.hero.hp = w.hero.d.maxHp; w.step(NO_INPUT); }
      return w.mobs.filter(m => m !== f && !m.parent).map(m => m.kind);
    };
    expect(helpers(11)).toEqual(['floss', 'floss']);
    expect(helpers(10)).toEqual(['bun', 'bun']);
  });
});

// ---------------------------------------------------------------------------------------------------------------------
describe('World 11 plays from start to finish', () => {
  const clear = (id: string, species: number) => {
    const st = STAGES.find(s => s.id === id)!;
    const w = new World(st, derive(heroFor(species, st.rec, 1)), 100, [{ id: 'jam', n: 8 }, null, null, null], 0, false, undefined, [], nemesisOf(species));
    const bot = new Bot(w, SKILLED, 7);
    for (let i = 0; i < 60 * 900 && !w.cleared && !w.failed; i++) w.step(bot.think());
    return w;
  };
  it('the skilled bot clears 11-1 (through both maps and King Corn Dog Cadet)', () => {
    const w = clear('11-1', 0);
    expect(w.cleared).toBe(true); expect(w.mobs[0]?.kind === 'kcadet' ? w.mobs[0].state : 'dead').toBe('dead');
  }, 120_000);
  it('the skilled bot clears 11-10 (The Great Flosso)', () => {
    const w = clear('11-10', 0);
    expect(w.cleared).toBe(true); expect(w.run.kills).toBeGreaterThan(10);
  }, 120_000);
  it('random play on a slice of World 11 never breaks the rules (the full run: npx vite-node scripts/chaos.ts 11- 20 2)', () => {
    const problems: string[] = [];
    for (const id of ['11-1', '11-7', '11-10', 'S-11']) {
      const st = [...STAGES, ...BONUS_STAGES].find(s => s.id === id)!;
      for (const c of CLASSES.filter((_, i) => i % 4 === 0)) {
        const startX = Math.round(100 + ((c.species * 40503) % 1000) / 1000 * (st.width - 300));
        for (const v of chaosRun(st, derive(heroFor(c.species, st.rec + 2, 1)), 7 + c.species, 15, startX)) problems.push(`${id} ${c.name}: ${v.rule} at ${v.t}s (${v.detail})`);
      }
    }
    expect(problems).toEqual([]);
  }, 120_000);
});
