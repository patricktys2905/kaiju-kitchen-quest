// The Recipe Scroll (stage 6 of every world, and the Daily Dungeon's stage-6 shape) lies HIGH UP in the second map, as the
// docs, the painting and every scene say: on that map's highest floor, with a ladder of its own (every kaiju gets up there),
// well back from the exit. It once lay on the ground by the exit (the height was computed, then thrown away).
import { describe, expect, it } from 'vitest';
import { Bot, SKILLED } from '../src/sim/bot';
import { CLASSES } from '../src/sim/classes';
import { dailyStage } from '../src/sim/free';
import { SCROLL_FROM_EXIT, STAGES } from '../src/sim/stages';
import { derive, newProfile } from '../src/sim/stats';
import { NO_INPUT, type StageDef } from '../src/sim/types';
import { World } from '../src/sim/world';
import { MIN_JUMP, genRuleBreaks, twoYearsOfDailies } from '../scripts/gen-rules';
import { BONUS_STAGES } from '../src/sim/stages';

const story = STAGES.filter(s => /-6$/.test(s.id));
// every Daily Dungeon of two years that has the stage-6 shape (each with its own seed and world)
const dailies: StageDef[] = [];
for (let y = 2026; y <= 2027; y++) for (let m = 1; m <= 12; m++) for (let d = 1; d <= 28; d++) { const st = dailyStage(y * 10000 + m * 100 + d, 30); if (st.objective?.kind === 'fetch') dailies.push(st); }
const all = [...story, ...dailies];
const facts = (st: StageDef) => {
  const ob = st.objective!, m = st.maps![1], mine = st.platforms.filter(p => p.x + p.w > m.x0 && p.x < m.x1 && !p.secret && !p.move);
  const floor = mine.find(p => p.y === ob.y && ob.x! >= p.x && ob.x! <= p.x + p.w);
  return { ob, m, mine, floor, exit: m.portals.find(p => p.need)!.x, ladders: floor ? st.ladders.filter(l => l.top === floor.y && l.x >= floor.x && l.x <= floor.x + floor.w) : [] };
};

describe('the Recipe Scroll is high up', () => {
  it('there is one for every world, and plenty of Daily Dungeons to check', () => {
    expect(story.map(s => s.id)).toEqual(['1-6', '2-6', '3-6', '4-6', '5-6', '6-6', '7-6', '8-6', '9-6', '10-6', '11-6']);
    expect(dailies.length).toBeGreaterThan(80);
  });

  it('it lies on the highest floor of the second map, at least 180 px above the ground', () => {
    for (const st of all) {
      const { ob, m, mine, floor } = facts(st);
      expect(ob.kind, st.id).toBe('fetch'); expect(ob.t, st.id).toBe(140);
      expect(ob.x! > m.x0 && ob.x! < m.x1, `${st.id} in map 2`).toBe(true);
      expect(floor, `${st.id}: the scroll lies on a floor`).toBeTruthy();
      expect(ob.y, st.id).toBe(Math.min(...mine.map(p => p.y)));
      expect(st.groundY - ob.y!, `${st.id} height`).toBeGreaterThanOrEqual(180);
      expect(ob.x! - floor!.x >= 40 && floor!.x + floor!.w - ob.x! >= 40, `${st.id}: not hanging off the end of its floor`).toBe(true);
      // the World puts it there (not on the ground)
      const w = new World(st, derive(newProfile(0)), 1);
      expect(w.scroll, st.id).toEqual({ x: ob.x, y: ob.y, got: false });
    }
  });

  it('it keeps well back from the exit portal, and a kaiju on the ground under it cannot grab it', () => {
    for (const st of all) {
      const { ob, exit } = facts(st);
      // SCROLL_FROM_EXIT where the floor is long enough; never closer than 500 px (the old one: 133 px, on the ground)
      expect(exit - ob.x!, `${st.id}: ${exit - ob.x!} px from the exit`).toBeGreaterThanOrEqual(Math.min(SCROLL_FROM_EXIT, 500));
      const w = new World({ ...st, mobs: [], hazards: [], maps: undefined, props: [], objective: { ...ob, at: undefined } }, derive(newProfile(0)), 1);
      w.hero.x = ob.x!; w.hero.y = st.groundY;
      for (let i = 0; i < 90; i++) w.step({ ...NO_INPUT }); // standing right under it (it takes the climb, by ladder or ledge to ledge)
      expect(w.scroll!.got, `${st.id}: grabbed from the ground`).toBe(false);
    }
    expect(SCROLL_FROM_EXIT).toBe(600);
  });

  it('a ladder leads up to its floor (the rule: a ladder up to every upper floor), clear of the exit portal', () => {
    for (const st of all) {
      const { ladders, exit, m } = facts(st);
      expect(ladders.length, `${st.id}: no ladder on the scroll's floor`).toBeGreaterThan(0);
      for (const l of ladders) { expect(l.bottom, st.id).toBe(st.groundY); expect(Math.abs(l.x - exit), st.id).toBeGreaterThanOrEqual(70); expect(l.x > m.x0 && l.x < m.x1, st.id).toBe(true); }
    }
  });

  it('every kaiju climbs that ladder and walks to the scroll with the real physics (level 1, no gear, no skills)', () => {
    const seen = new Set<string>();
    for (const st of all) {
      const { ob, floor, ladders, m } = facts(st);
      const key = JSON.stringify([ob.x! - m.x0, ob.y, floor!.x - m.x0, floor!.w, ladders.map(l => l.x - m.x0)]);
      if (seen.has(key)) continue; seen.add(key);
      for (const l of ladders) for (const c of CLASSES) {
        const w = new World({ ...st, mobs: [], hazards: [], maps: undefined, props: [], belts: undefined, objective: { ...ob, at: undefined } }, derive(newProfile(c.species)), 1);
        const h = w.hero; h.x = l.x; h.y = st.groundY;
        let i = 0;
        for (; i < 60 * 30 && !w.scroll!.got; i++) {
          const up = h.state === 'climb' || (h.ground && h.y > ob.y! + 2);
          w.step({ ...NO_INPUT, up, right: !up && ob.x! > h.x + 6, left: !up && ob.x! < h.x - 6 });
        }
        expect(w.scroll!.got, `${st.id}: ${c.name} up the ladder at ${l.x}`).toBe(true);
        expect(i / 60, `${st.id}: ${c.name}`).toBeLessThan(20);
      }
    }
  });

  it('the bot goes up for it: from the map entrance to the scroll in hand, well inside the timer (no monsters)', () => {
    for (const st of story) for (const sp of [1, 5, 7]) { // Bluebeary, Crabbage, Dumplord: the slow, low jumpers
      const { ob, m } = facts(st);
      const w = new World({ ...st, mobs: [st.mobs[0]], hazards: [], maps: st.maps!.map(q => ({ ...q, spawns: undefined })) }, derive(newProfile(sp)), 1);
      const h = w.hero; h.x = m.x0 + 150; h.y = st.groundY;
      const bot = new Bot(w, SKILLED, 3);
      let i = 0;
      for (; i < 60 * 140 && !w.scroll!.got && !w.failed; i++) w.step(bot.think());
      expect(w.scroll!.got, `${st.id} kaiju ${sp}: the bot never reached the scroll (hero at ${Math.round(h.x)},${Math.round(h.y)} ${h.state}; scroll ${ob.x},${ob.y})`).toBe(true);
      expect(i / 60, `${st.id} kaiju ${sp}`).toBeLessThan(60);
    }
  });
});

describe('generator rules hold for every seed we can try', () => {
  it('story, secret and two years of Daily Dungeons: every floor in reach, sponges under open sky, no ladder on a portal', () => {
    const stages = [...STAGES, ...BONUS_STAGES, ...twoYearsOfDailies()], minJump = MIN_JUMP();
    expect(stages.length).toBe(110 + 11 + 672);
    const broke = stages.flatMap(st => genRuleBreaks(st, minJump).map(b => `${st.id} ${st.name}: ${b}`));
    expect(broke).toEqual([]);
  });
});
