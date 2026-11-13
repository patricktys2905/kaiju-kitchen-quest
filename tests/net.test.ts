// Online co-op: the host's World is copied into each guest's drawing-only World through compact snapshots.
import { describe, expect, it } from 'vitest';
import { applySnapshot, guestDropGain, makeSnapshot } from '../src/net/snapshot';
import { AVERAGE, Bot } from '../src/sim/bot';
import { STAGES } from '../src/sim/stages';
import { derive, newProfile } from '../src/sim/stats';
import { World } from '../src/sim/world';
import { MOBS } from '../src/sim/mobs';
import { NO_INPUT } from '../src/sim/types';

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
  it("the guest sees the team's drop bag and opened exits, not its own leftovers", () => {
    const { host, guest } = pair('1-4');
    const maps = host.stage.maps!, g = maps[0].goal!;
    if (g.kind !== 'collect') throw new Error('1-4 map I should want drops');
    const [a, b2] = g.wants.map(q => q.mob);
    const wire = () => applySnapshot(guest, JSON.parse(JSON.stringify(makeSnapshot(host))));
    guest.drops = { [a]: 9 }; // whatever the guest's World held (old builds seeded it from the guest's own save)
    host.drops = { [a]: 1 };
    wire();
    expect(guest.drops).toEqual({ [a]: 1 });
    expect(guest.zones2.map(z => z.done)).toEqual(host.zones2.map(z => z.done));
    host.drops = { [a]: g.wants[0].n, [b2]: g.wants[1].n };
    wire();
    expect(g.wants.every(q => (guest.drops[q.mob] ?? 0) >= q.n)).toBe(true); // the guest's HUD says "→ EXIT" too
    // the exit takes the drops and opens: the guest's sign must read "open" and the counts drop back
    for (const q of g.wants) host.drops[q.mob] = 0;
    host.zones2[0].done = true;
    wire();
    expect(guest.zones2.map(z => z.done)).toEqual(host.zones2.map(z => z.done));
    expect(guest.zones2[0].done).toBe(true);
    expect(Object.values(guest.drops).every(n => !n)).toBe(true);
    // the drop bag and the exits together stay tiny
    const s = makeSnapshot(host);
    expect(JSON.stringify({ dr: s.dr, zd: s.zd }).length).toBeLessThan(40);
    // a stage without maps sends neither
    const flat = makeSnapshot(pair('1-10').host.stage.maps ? pair('1-3').host : pair('1-10').host);
    if (!pair('1-10').host.stage.maps) { expect(flat.dr).toBeUndefined(); expect(flat.zd).toBeUndefined(); }
  });

  it('a sleeping boss-room foe wakes on the guest too (world-boss bar, boss-room foes)', () => {
    for (const id of ['1-10', '1-4']) {
      const { host, guest } = pair(id);
      const wire = () => applySnapshot(guest, JSON.parse(JSON.stringify(makeSnapshot(host))));
      const foe = host.mobs.find(m => m.wake)!;
      expect(foe, id).toBeTruthy();
      const twin = () => guest.mobs.find(m => m.id === foe.id)!;
      wire();
      expect(twin().wake, id).toBeTruthy();
      expect(guest.boss, id).toBeUndefined(); // asleep: no boss bar yet
      // everyone walks into its room
      const line = foe.wake!;
      host.heroes.forEach((h, i) => { h.x = line + 40 + i * 20; h.y = host.stage.groundY; });
      wire(); // (the heroes are in the foe's map now, so it is sent in full: still asleep)
      expect(twin().wake, id).toBeTruthy();
      for (let f = 0; f < 5; f++) host.step(host.heroes.map(() => NO_INPUT));
      expect(foe.wake, id).toBeFalsy();
      wire();
      expect(twin().wake, id).toBeFalsy();
      if (MOBS[foe.kind].brain === 'boss') { expect(guest.boss?.id, id).toBe(foe.id); expect(guest.boss?.id).toBe(host.boss?.id); }
    }
  });

  it('carries whether the timed objective is running', () => {
    const { host, guest } = pair('1-4');
    for (const armed of [false, true, false]) {
      host.objArmed = armed;
      applySnapshot(guest, JSON.parse(JSON.stringify(makeSnapshot(host))));
      expect(guest.objArmed).toBe(armed);
    }
  });

  it('a guest banks what the team bag gained, and never loses or copies a stash', () => {
    // the host brought 5 buns; the team picked up 3 jam and 2 buns and an exit took 3 buns: the host's save ends 4 buns, 3 jam
    expect(guestDropGain({ worm: 2 }, { bun: 5 }, { bun: 4, jamhop: 3 })).toEqual({ worm: 2, jamhop: 3 });
    // nothing brought: the guest gets exactly what the host banks
    expect(guestDropGain({}, {}, { bun: 1, jamhop: 2 })).toEqual({ bun: 1, jamhop: 2 });
    // the team only spent the host's stash: the guest's own drops are untouched
    expect(guestDropGain({ bun: 7 }, { bun: 6 }, { bun: 0 })).toEqual({ bun: 7 });
    expect(guestDropGain({ bun: 1 }, { bun: 2 }, { bun: 5 })).toEqual({ bun: 4 });
  });
});
