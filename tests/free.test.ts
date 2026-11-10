// Free mode: Daily Dungeon, Endless Pantry, Boss Rush.
import { describe, expect, it } from 'vitest';
import { AVERAGE, Bot } from '../src/sim/bot';
import { PERKS, dailyStage, endlessFloor, perkChoices, powerFor, rushStages, withPerks } from '../src/sim/free';
import { WORLDS } from '../src/sim/stages';
import { derive, newProfile } from '../src/sim/stats';
import { World } from '../src/sim/world';
import { heroFor } from '../scripts/hero-at';

const d = (lv: number, sp = 0) => { const p = newProfile(sp); p.level = lv; for (const k of Object.keys(p.skills)) p.skills[k] = 3; return derive(p); };
const play = (st: Parameters<typeof dailyStage> extends never ? never : ReturnType<typeof dailyStage>, lv: number, seed = 3) => {
  const w = new World(st, derive(heroFor(10, lv, seed)), seed, [{ id: 'jam', n: 3 }, null, null, null]);
  const bot = new Bot(w, AVERAGE, seed);
  for (let i = 0; i < 60 * 300 && !w.cleared && !w.failed; i++) w.step(bot.think());
  return w;
};

describe('free mode', () => {
  it('monster strength follows level, smoothly', () => {
    expect(powerFor(1)).toBe(WORLDS[0].power);
    expect(powerFor(WORLDS[4].baseLv)).toBeCloseTo(WORLDS[4].power);
    for (let lv = 2; lv < 60; lv++) expect(powerFor(lv)).toBeGreaterThanOrEqual(powerFor(lv - 1));
  });
  it('the Daily Dungeon is the same for everybody on a day, different the next day, and at your level', () => {
    expect(JSON.stringify(dailyStage(20261110, 30))).toBe(JSON.stringify(dailyStage(20261110, 30)));
    expect(JSON.stringify(dailyStage(20261111, 30))).not.toBe(JSON.stringify(dailyStage(20261110, 30)));
    const st = dailyStage(20261110, 30);
    expect(st.lv[0]).toBe(29);
    expect((st.props ?? []).some(p => p.key)).toBe(false); // no World Keys from the daily
  });
  it('Endless floors get tougher, with an elite every 5th and a boss every 10th', () => {
    const f1 = endlessFloor(1, 20, 5), f12 = endlessFloor(12, 20, 5);
    expect(f12.lv[0]).toBeGreaterThan(f1.lv[0]);
    expect(f12.arenas![0].waves.flat().length).toBeGreaterThan(f1.arenas![0].waves.flat().length);
    expect(endlessFloor(5, 20, 5).arenas![0].waves.flat().some(m => m.elite)).toBe(true);
    expect(endlessFloor(10, 20, 5).boss).toBe(true);
  });
  it('Boss Rush lines up the bosses you have beaten', () => {
    const q = rushStages([1, 3], 30);
    expect(q.map(s => s.mobs[0].kind)).toEqual([WORLDS[0].boss, WORLDS[2].boss]);
    expect(q.every(s => s.boss && s.mobs[0].lv === 31)).toBe(true);
  });
  it('perks: three different choices, and they really change your stats', () => {
    const c = perkChoices(4, 99);
    expect(new Set(c.map(p => p.id)).size).toBe(3);
    const base = d(20), up = withPerks(base, ['atk', 'atk', 'hp', 'crit']);
    expect(up.atk).toBeGreaterThan(base.atk * 1.2);
    expect(up.maxHp).toBeGreaterThan(base.maxHp);
    expect(up.crit).toBeGreaterThan(base.crit);
    expect(PERKS.length).toBeGreaterThanOrEqual(8);
  });
  it('a geared hero at its level can clear the early floors and a daily dungeon', () => {
    for (const lv of [12, 40]) {
      const wins = (mk: () => ReturnType<typeof dailyStage>) => [3, 5, 9].filter(seed => play(mk(), lv, seed).cleared).length;
      expect(wins(() => endlessFloor(1, lv, 7)), `floor 1 at Lv ${lv}`).toBeGreaterThanOrEqual(2);
      expect(wins(() => dailyStage(20261110, lv)), `daily at Lv ${lv}`).toBeGreaterThanOrEqual(2);
    }
  });
});
