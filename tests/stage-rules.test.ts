// Generator rules of the story maps (genMaps): where hazards may stand, and monsters the story counts on.
import { describe, expect, it } from 'vitest';
import { STAGES, WORLDS } from '../src/sim/stages';

describe('story map rules', () => {
  it('no stage hazard stands at a ladder or on top of another hazard', () => {
    const bad: string[] = [];
    for (const st of STAGES) {
      const hz = (st.hazards ?? []).filter(h => !h.phase2); // the boss room's own (phase 2) hazards have fixed spots
      for (const h of hz) {
        if ((st.ladders ?? []).some(l => Math.abs(l.x - h.x) < h.w / 2 + 55)) bad.push(`${st.id}: ${h.kind}@${h.x} at a ladder`);
        if (hz.some(o => o !== h && Math.abs(o.x - h.x) < 300)) bad.push(`${st.id}: ${h.kind}@${h.x} on another hazard`);
      }
      // from stage 2 of a world on (World 1: from 1-2), every stage still has a hazard
      if (st.maps && (st.world >= 2 || +st.id.split('-')[1] >= 2) && /^\d+-\d+$/.test(st.id)) expect(hz.length, st.id).toBeGreaterThan(0);
    }
    expect(bad).toEqual([]);
  });

  it("a world's `sure` monsters are in every map of their stage, from the start, and are not wanted because of it", () => {
    const sure = WORLDS.flatMap(w => (w.sure ?? []).map(([n, kind]) => ({ id: `${w.id}-${n}`, kind })));
    expect(sure).toContainEqual({ id: '11-3', kind: 'churro' }); // the story's 11-3 scenes: Whack-a-Churros pop up in Ring Toss Row
    for (const { id, kind } of sure) {
      const st = STAGES.find(s => s.id === id)!;
      for (const m of st.maps!.filter(q => q.kind === 'zone')) {
        expect(m.spawns!.kinds, `${id} respawns`).toContain(kind);
        expect(st.mobs.some(mob => mob.kind === kind && mob.x >= m.x0 && mob.x < m.x1), `${id} at the start`).toBe(true);
        if (m.goal?.kind === 'collect') expect(m.goal.wants.map(q => q.mob)).not.toContain(kind); // (a burrower is never wanted)
      }
    }
  });
});
