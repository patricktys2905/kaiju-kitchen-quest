// Online co-op: the host's World is copied into each guest's drawing-only World through compact snapshots.
import { describe, expect, it } from 'vitest';
import { applySnapshot, makeSnapshot } from '../src/net/snapshot';
import { AVERAGE, Bot } from '../src/sim/bot';
import { STAGES } from '../src/sim/stages';
import { derive, newProfile } from '../src/sim/stats';
import { World } from '../src/sim/world';

const d = (sp: number, lv = 8) => { const p = newProfile(sp); p.level = lv; return derive(p); };
const pair = (id: string, seed = 5) => {
  const st = STAGES.find(s => s.id === id)!;
  const lv = st.lv[1] + 2;
  const mk = () => new World(st, d(0, lv), seed, [], 0, false, undefined, [], undefined, false, [d(10, lv), d(11, lv)], 3);
  return { host: mk(), guest: mk() };
};

describe('online snapshots', () => {
  it('a guest World mirrors the host after each snapshot, through a whole fight', () => {
    for (const id of ['1-3', '2-4', '3-7', '1-10']) {
      const { host, guest } = pair(id);
      guest.view(2);
      const bots = host.heroes.map((_, i) => new Bot(host, AVERAGE, 11 + i, i));
      let maxLen = 0;
      for (let f = 0; f < 60 * 40 && !host.cleared && !host.failed; f++) {
        host.step(bots.map(b => b.think()));
        if (f % 4 === 0) {
          const json = JSON.stringify(makeSnapshot(host));
          maxLen = Math.max(maxLen, json.length);
          applySnapshot(guest, JSON.parse(json));
          expect(guest.mobs.map(m => [m.id, m.kind, m.state])).toEqual(host.mobs.map(m => [m.id, m.kind, m.state]));
          host.heroes.forEach((h, i) => { expect(Math.abs(guest.heroes[i].x - h.x)).toBeLessThan(1); expect(guest.heroes[i].state).toBe(h.state); expect(guest.heroes[i].hp).toBe(Math.round(h.hp)); });
          expect(guest.shots.map(s => s.id)).toEqual(host.shots.map(s => s.id));
          expect(guest.boxes.length).toBe(host.boxes.length);
        }
      }
      applySnapshot(guest, JSON.parse(JSON.stringify(makeSnapshot(host))));
      expect(guest.hero).toBe(guest.heroes[2]);
      expect(guest.lootOf.map(l => l.length)).toEqual(host.lootOf.map(l => l.length));
      expect(guest.run.kills).toBe(host.run.kills);
      expect(host.run.time, id).toBeGreaterThan(5);
      if (id === '1-3' || id === '3-7') expect(host.run.kills, id).toBeGreaterThan(2);
      expect(maxLen, id).toBeLessThan(8000); // small enough for the backup route at ~8 a second
    }
  });
  it('a teammate who levels up mid-stage gets the new stats, keeping their health share', () => {
    const { host } = pair('1-3');
    const b = host.heroes[1]; b.hp = b.d.maxHp / 2;
    host.setDerivedOf(1, d(10, 20));
    expect(b.d.maxHp).toBe(d(10, 20).maxHp);
    expect(Math.abs(b.hp - b.d.maxHp / 2)).toBeLessThan(2);
    expect(host.hero).toBe(host.heroes[0]);
  });
});
