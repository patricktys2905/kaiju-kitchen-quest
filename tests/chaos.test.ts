// Chaos testing on every push: random inputs on a spread of tricky stages (ladders, ledges, moving trays, sponges, arenas,
// bonus stages) for every kaiju, checking the rules in src/sim/chaos.ts. The full overnight sweep is scripts/chaos.ts.
import { describe, expect, it } from 'vitest';
import { chaosRun } from '../src/sim/chaos';
import { CLASSES } from '../src/sim/classes';
import { BONUS_STAGES, STAGES } from '../src/sim/stages';
import { derive } from '../src/sim/stats';
import { heroFor } from '../scripts/hero-at';
import { World } from '../src/sim/world';
import { NO_INPUT } from '../src/sim/types';

const ALL = [...STAGES, ...BONUS_STAGES];
const SLICE = ['1-1', '1-7', '1-9', '3-4', '6-3', '8-8', '9-9', '10-6', 'S-4', 'S-8'];

describe('chaos', () => {
  it('random play never breaks the rules (no air-walking, no NaN, nothing through the floor, no crash)', () => {
    const problems: string[] = [];
    for (const id of SLICE) {
      const st = ALL.find(s => s.id === id)!;
      for (const c of CLASSES) {
        const startX = Math.round(100 + ((c.species * 40503) % 1000) / 1000 * (st.width - 300));
        for (const v of chaosRun(st, derive(heroFor(c.species, st.rec + 2, 1)), 7 + c.species, 15, startX)) problems.push(`${id} ${c.name}: ${v.rule} at ${v.t}s (${v.detail})`);
      }
    }
    expect(problems).toEqual([]);
  }, 120_000);

  it('the same seed and inputs always play out the same (so any report can be replayed)', () => {
    const st = STAGES.find(s => s.id === '2-3')!;
    const run = () => { const w = new World(st, derive(heroFor(10, st.rec, 1)), 5); for (let i = 0; i < 600; i++) w.step({ ...NO_INPUT, right: i % 90 < 60, attack: i % 4 === 0, jump: i % 50 === 0 }); return [w.hero.x, w.hero.y, w.mobs.map(m => [m.id, Math.round(m.x), m.hp])].toString(); };
    expect(run()).toBe(run());
  });
});
