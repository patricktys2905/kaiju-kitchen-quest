// World 6, The Dining Room: Act 2 opens (hot wax, Sir Stale of the Leftovers, nemeses retired).
import { describe, expect, it } from 'vitest';
import { CLASSES } from '../src/sim/classes';
import { nemesisOf } from '../src/sim/mobs';
import { STAGES, stageById } from '../src/sim/stages';
import { MAX_LEVEL, derive, newProfile } from '../src/sim/stats';
import { NO_INPUT, type StageDef } from '../src/sim/types';
import { World } from '../src/sim/world';
import { STORIES } from '../src/story/stories';

const hero = (lv = 65) => { const p = newProfile(0); p.level = lv; return derive(p); };
const flat: StageDef = { id: 't', world: 6, num: 't', name: 't', bg: 'bg-far', mid: '', tile: 'tile-ground', platTint: 0xffffff, width: 2400, groundY: 470, lv: [62, 62], par: 60, rec: 62, platforms: [], ladders: [], mobs: [] };

describe('World 6: The Dining Room', () => {
  it('ten stages ending with Sir Stale; the level cap reaches past it', () => {
    const w6 = STAGES.filter(s => s.world === 6);
    expect(w6.length).toBe(10);
    expect(w6[9].mobs[0].kind).toBe('stale');
    expect(MAX_LEVEL).toBeGreaterThanOrEqual(w6[9].rec);
  });
  it('a candelabra drips hot wax: it hurts and leaves a sticky puddle', () => {
    const w = new World({ ...flat, hazards: [{ kind: 'wax', x: 600, w: 80, period: 3.6, on: 0.4, offset: 0 }] }, hero(), 1);
    w.hero.x = 600;
    const hp = w.hero.hp;
    for (let i = 0; i < 20; i++) w.step(NO_INPUT);
    expect(w.hero.hp).toBeLessThan(hp);
    expect(w.puddles.some(p => p.kind === 'slow' && Math.abs(p.x - 600) < 10)).toBe(true);
  });
  it('Act 2: stage 6-5 is a normal elite, not the old nemesis', () => {
    const w = new World(stageById('6-5'), hero(), 1, [], 0, false, undefined, [], nemesisOf(0));
    expect(w.mobs.some(m => m.kind === nemesisOf(0))).toBe(false);
    expect(w.mobs.some(m => m.kind === 'xroast' && m.elite)).toBe(true); // the Roast Brute champion (same monster, its own moves)
  });
  it('every kaiju has an Act 2 opening, a Sir Stale fight and a nemesis cameo', () => {
    for (const c of CLASSES) for (const b of ['w6-open', 'w6-elite', 'w6-boss', 'w6-after']) expect(STORIES[c.species].beats[b]?.length, `${c.name} ${b}`).toBeGreaterThan(0);
  });
});
