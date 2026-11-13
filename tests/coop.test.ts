// Online co-op polish: friends bring their own potions, and Free Play runs can be played online.
import { describe, expect, it } from 'vitest';
import { applySnapshot, makeSnapshot } from '../src/net/snapshot';
import { EMOTES, type NetFree } from '../src/net/net';
import { dailyStage, endlessFloor, rushStages, stageTitle, withPerks } from '../src/sim/free';
import { NO_INPUT } from '../src/sim/types';
import { STAGES } from '../src/sim/stages';
import { derive, newProfile } from '../src/sim/stats';
import { World } from '../src/sim/world';

const d = (sp: number, lv = 8) => { const p = newProfile(sp); p.level = lv; return derive(p); };

describe('online co-op polish', () => {
  it('each friend brings their own quick bag; using it shows up on their own device', () => {
    const st = STAGES.find(s => s.id === '1-3')!;
    const bagOf = (n: number) => [{ id: 'jam' as const, n }, null, null, null];
    const mk = () => new World(st, d(0), 5, bagOf(3), 1, false, undefined, [], undefined, false, [d(10)], 2, [{ bag: bagOf(5), revives: 2 }]);
    const host = mk(), guest = mk();
    guest.view(1);
    expect(host.heroes[1].bag[0]?.n).toBe(5);
    expect(host.heroes[1].revives).toBe(2);
    host.heroes[1].hp = 10; // hurt, so the jam is used
    host.step([NO_INPUT, { ...NO_INPUT, item1: true }]);
    expect(host.heroes[1].bag[0]?.n).toBe(4);
    expect(host.heroes[0].bag[0]?.n).toBe(3); // the host's own bag is untouched
    applySnapshot(guest, JSON.parse(JSON.stringify(makeSnapshot(host))));
    expect(guest.hero.bag[0]?.n).toBe(4);
    expect(guest.hero.revives).toBe(2);
  });

  it('Free Play stages survive the trip over the network and rebuild the same World', () => {
    const lv = 30;
    const runs: NetFree[] = [
      { mode: 'daily', stage: dailyStage(20261110, lv), floor: 1, seed: 20261110, perks: [], time: 0, hp: [1, 1], lv },
      { mode: 'endless', stage: endlessFloor(4, lv, 77), floor: 4, seed: 77, perks: ['atk', 'hp'], time: 0, hp: [0.5, 1], lv },
      { mode: 'rush', stage: rushStages([1, 2, 3], lv)[1], floor: 2, seed: 9, perks: [], time: 80, hp: [1, 0.3], lv, total: 3 },
    ];
    for (const nf of runs) {
      const wire: NetFree = JSON.parse(JSON.stringify(nf));
      expect(wire.stage).toEqual(nf.stage);
      const mk = (f: NetFree) => new World(f.stage, withPerks(d(0, lv), f.perks), 3, [], 0, false, undefined, [], undefined, false, [withPerks(d(10, lv), f.perks)], 2);
      const a = mk(nf), b = mk(wire);
      expect(b.mobs.map(m => [m.kind, m.x, m.lv])).toEqual(a.mobs.map(m => [m.kind, m.x, m.lv]));
      expect(b.heroes[0].d.maxHp).toBe(a.heroes[0].d.maxHp);
    }
  });

  it('Endless perks reach every teammate', () => {
    const base = d(10, 30), boosted = withPerks(base, ['hp', 'atk']);
    expect(boosted.maxHp).toBeGreaterThan(base.maxHp);
    expect(boosted.atk).toBeGreaterThan(base.atk);
  });

  it('quick chat lines are short enough for a speech bubble', () => {
    expect(EMOTES.length).toBe(4);
    for (const e of EMOTES) expect(e.length).toBeLessThanOrEqual(16);
  });

  it('Free Play titles read once in the HUD', () => {
    const daily = stageTitle(dailyStage(20261113, 30)), rush = stageTitle(rushStages([1, 2, 3], 30)[1]);
    expect(daily).toMatch(/^Daily: \S/);
    expect(daily.match(/daily/gi)?.length).toBe(1);
    expect(rush).toMatch(/^Boss Rush 2: \S/);
    expect(rush.match(/rush/gi)?.length).toBe(1);
    for (const fl of [1, 10]) expect(stageTitle(endlessFloor(fl, 30, 7))).toBe(`Endless Pantry: Floor ${fl}`);
    expect(stageTitle(STAGES.find(s => s.id === '1-3')!)).toMatch(/^1-3 \S/); // story stages keep their number
  });
});
