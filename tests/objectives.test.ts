// Stage objectives: escort the lost Crumblet (stage 4), fetch the Recipe Scroll then hold out (6), survive the waves (8).
import { describe, expect, it } from 'vitest';
import { BONUS_STAGES, STAGES, WORLDS } from '../src/sim/stages';
import { derive, newProfile } from '../src/sim/stats';
import { NO_INPUT, type StageDef } from '../src/sim/types';
import { World } from '../src/sim/world';

const flat: StageDef = {
  id: 't', world: 1, num: 't', name: 't', bg: 'bg-far', mid: '', tile: 'tile-ground', platTint: 0xffffff, width: 2000, groundY: 400, lv: [3, 3], par: 60, rec: 1,
  platforms: [], ladders: [], mobs: [],
};
const hero = () => { const p = newProfile(0); p.level = 10; return derive(p); };
const steps = (w: World, n: number) => { const evs = []; for (let i = 0; i < n; i++) evs.push(...w.step(NO_INPUT)); return evs; };

describe('objectives', () => {
  it('stages 4 / 6 / 8 of every world have escort / fetch / survive; elites, bosses and bonus stages don\'t', () => {
    for (const wd of WORLDS) {
      const kind = (n: number) => STAGES.find(s => s.id === `${wd.id}-${n}`)!.objective?.kind;
      expect([4, 6, 8].map(kind)).toEqual(['escort', 'fetch', 'survive']);
      expect([1, 2, 3, 5, 7, 9, 10].map(kind).every(k => k === undefined)).toBe(true);
    }
    expect(BONUS_STAGES.every(s => !s.objective)).toBe(true);
  });
  it('escort: the Crumblet follows you, the exit needs it there too, and losing it fails the stage', () => {
    const w = new World({ ...flat, objective: { kind: 'escort' } }, hero(), 1);
    w.hero.x = 600; steps(w, 120);
    expect(w.npc!.x).toBeGreaterThan(300);
    // at the exit without the Crumblet: not cleared
    w.hero.x = w.exitX; steps(w, 2);
    expect(w.cleared).toBe(false);
    steps(w, 60 * 20);
    expect(w.cleared).toBe(true);
    expect(w.loot.length).toBeGreaterThan(0); // bonus Bento
    const v = new World({ ...flat, objective: { kind: 'escort' } }, hero(), 1);
    v.npc!.hp = 1;
    const m = v.spawnMob('bun', v.npc!.x + 10, 3); m.state = 'attack'; m.move = 'walker'; m.t = 0;
    const evs = steps(v, 5);
    expect(evs.some(e => e.t === 'objFail')).toBe(true);
  });
  it('fetch: the exit stays shut until you grab the scroll and hold out; running out of time fails', () => {
    const w = new World({ ...flat, objective: { kind: 'fetch', t: 75, x: 1500 } }, hero(), 1);
    steps(w, 10);
    expect(w.portal).toBe(false);
    w.hero.x = 1500; w.hero.inv = 999;
    const evs = steps(w, 2);
    expect(evs.some(e => e.t === 'objective')).toBe(true);
    expect(w.holdout).toBeGreaterThan(20);
    w.hero.hp = w.hero.d.maxHp = 1e7;
    steps(w, 60 * 27);
    expect(w.portal).toBe(true);
    const late = new World({ ...flat, objective: { kind: 'fetch', t: 2, x: 1500 } }, hero(), 1);
    expect(steps(late, 150).some(e => e.t === 'objFail')).toBe(true);
  });
  it('survive: monsters keep coming until the timer runs out, then they retreat and the exit opens', () => {
    const w = new World({ ...flat, objective: { kind: 'survive', t: 20 } }, hero(), 1);
    w.hero.hp = w.hero.d.maxHp = 1e7; w.hero.x = 900;
    steps(w, 60 * 10);
    expect(w.alive).toBeGreaterThan(0);
    expect(w.portal).toBe(false);
    steps(w, 60 * 11);
    expect(w.alive).toBe(0);
    expect(w.portal).toBe(true);
  });
});
