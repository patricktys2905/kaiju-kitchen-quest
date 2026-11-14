// Boss rooms can always be finished: every ledge a monster can end up on (spawned, summoned, split, knocked or leapt there:
// a monster never walks off its ledge by itself) is reachable by every kaiju with walking, jumping and ladders alone, and
// no monster can end up outside the room's walls. Real hero physics (scripts/reach-lib.ts), not arithmetic.
import { describe, expect, it } from 'vitest';
import { roomKey, roomOf, roomReach, type Room } from '../scripts/reach-lib';
import { CLASSES } from '../src/sim/classes';
import { dailyStage, endlessFloor } from '../src/sim/free';
import { MOBS } from '../src/sim/mobs';
import { BONUS_STAGES, STAGES, bossRoom } from '../src/sim/stages';
import { derive, newProfile } from '../src/sim/stats';
import { NO_INPUT } from '../src/sim/types';
import { World } from '../src/sim/world';

/** A jump only counts as a way up when it works for at least this many frames in a row of a run-up (0.1 s): a hop that
 *  needs a frame-perfect press at the very edge is not a way up for a person on a phone. */
const MIN_WINDOW = 6;

describe('boss rooms', () => {
  const rooms = new Map<string, { room: Room; ids: string[] }>();
  const add = (id: string, room: Room) => { const k = roomKey(room); (rooms.get(k) ?? rooms.set(k, { room, ids: [] }).get(k)!).ids.push(id); };
  for (const st of [...STAGES, ...BONUS_STAGES]) add(st.id, roomOf(st));
  for (let d = 0; d < 42; d++) add(`daily ${20261101 + d}`, roomOf(dailyStage(20261101 + d, 30)));
  for (let w = 1; w <= 11; w++) add(`rush ${w}`, roomOf(bossRoom(w)));
  for (let f = 1; f <= 36; f++) add(`endless ${f}`, roomOf(endlessFloor(f, 30, 5)));

  it('every story, bonus and daily stage ends in a boss room', () => {
    for (const st of [...STAGES, ...BONUS_STAGES]) expect(st.maps?.[st.maps.length - 1].kind, st.id).toBe('boss');
    expect(rooms.size).toBeGreaterThan(0);
  });

  it('every ledge of every boss room can be reached by every kaiju without skills (ladder, or a forgiving jump)', () => {
    const bad: string[] = [];
    for (const { room, ids } of rooms.values()) for (const c of CLASSES) {
      for (const v of roomReach(room, c.species, MIN_WINDOW)) {
        if (v.how === 'none') bad.push(`${c.name} can't get onto the ledge ${v.plat.x}-${v.plat.x + v.plat.w}@${v.plat.y} (best jump window ${v.window} frames) in the room of ${ids[0]} (+${ids.length - 1} more)`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('the room ladder is part of the stage (drawn, and used by guests and CPU buddies) and keeps clear of the door, the jars and the sleeping foe', () => {
    for (const st of [...STAGES, ...BONUS_STAGES]) {
      const m = st.maps![st.maps!.length - 1], ls = st.ladders.filter(l => l.x > m.x0 && l.x < m.x1);
      expect(ls.length, st.id).toBeGreaterThan(0);
      for (const l of ls) {
        expect(l.bottom, st.id).toBe(st.groundY);
        expect(st.platforms.some(p => p.y === l.top && l.x >= p.x + 30 && l.x <= p.x + p.w - 30), st.id).toBe(true);
        for (const o of st.mobs.filter(o => o.x >= m.x0 && o.x <= m.x1)) expect(Math.abs(o.x - l.x), `${st.id} ${o.kind}`).toBeGreaterThan(MOBS[o.kind].w / 2 + 40);
        for (const p of (st.props ?? []).filter(p => p.x >= m.x0 && p.x <= m.x1)) expect(Math.abs(p.x - l.x), `${st.id} ${p.kind}`).toBeGreaterThan(80);
        for (const h of (st.hazards ?? []).filter(h => h.x >= m.x0 && h.x <= m.x1)) expect(Math.abs(h.x - l.x), `${st.id} ${h.kind}`).toBeGreaterThan(h.w / 2 + 40);
        expect(l.x - m.x0, st.id).toBeGreaterThan(400);          // past the door and the wake line
        expect(m.x1 - 120 - l.x, st.id).toBeGreaterThan(200);    // the exit portal
      }
    }
  });

  it('a monster on the top ledge is in reach of the slowest kaiju: Bluebeary climbs up beside it', () => {
    const st = STAGES.find(s => s.id === '4-3')!, m = st.maps![st.maps!.length - 1];
    const top = st.platforms.filter(p => p.x >= m.x0 && p.x < m.x1).sort((a, b) => a.y - b.y)[0];
    const w = new World({ ...st, mobs: [] }, derive(newProfile(1)), 3);
    w.skipToBoss();
    const mob = w.spawnMob('minicheerio', top.x + 60, st.lv[0], top.y);
    const h = w.hero; h.inv = 1e9;
    const lad = st.ladders.find(l => l.top === top.y && l.x > m.x0 && l.x < m.x1)!;
    for (let i = 0; i < 600 && Math.abs(h.x - lad.x) > 6; i++) w.step({ ...NO_INPUT, right: h.x < lad.x, left: h.x > lad.x });
    for (let i = 0; i < 600 && !(h.ground && h.y === top.y); i++) w.step({ ...NO_INPUT, up: true });
    expect(h.y).toBe(top.y);
    expect(h.ground).toBe(true);
    expect(mob.y).toBe(top.y); // it stayed up there (monsters never step off a ledge)
    expect(w.portal).toBe(false);
    // walk over and hit it (one hit left in it): the room clears
    mob.hp = 1;
    for (let i = 0; i < 60 * 30 && !w.portal; i++) { const dx = mob.x - h.x; w.step({ ...NO_INPUT, right: dx > 20, left: dx < -20, attack: i % 10 === 0 && Math.abs(dx) < 60 }); }
    expect(h.y).toBe(top.y); // from up there, not from below
    expect(w.portal).toBe(true);
  });
});

describe('boss room walls hold monsters', () => {
  const st = STAGES.find(s => s.id === '1-3')!, b = st.maps!.length - 1, room = st.maps![b];
  const mk = () => { const w = new World(st, derive(newProfile(0)), 3); w.skipToBoss(); w.hero.inv = 1e9; return w; };

  it('no stage starts with a monster outside every map', () => {
    for (const s of [...STAGES, ...BONUS_STAGES]) for (const m of s.mobs) expect(s.maps!.some(mp => m.x >= mp.x0 && m.x <= mp.x1), `${s.id} ${m.kind}@${m.x}`).toBe(true);
  });

  it('a room foe shoved past the wall (a grab, a pull, its own vanish) comes back inside and the exit stays shut', () => {
    for (const out of [room.x0 - 52, room.x0 - 300, room.x1 + 40]) {
      const w = mk();
      for (let i = 0; i < 30; i++) w.step({ ...NO_INPUT });
      const foe = w.mobs.find(m => m.roomBoss)!;
      foe.x = out;
      for (let i = 0; i < 5; i++) w.step({ ...NO_INPUT });
      expect(w.mapAt(foe.x), `foe put at ${out - room.x0}`).toBe(b);
      expect(w.portal).toBe(false);
    }
  });

  it('nothing alive is ever outside every map during a room fight with summons', () => {
    // the Cereal Box Colossus (4-3) and a world boss calling helpers beside a hero standing at the door (5-10)
    for (const id of ['4-3', '5-10']) {
      const s = STAGES.find(q => q.id === id)!, w = new World(s, derive(newProfile(1)), 7);
      w.skipToBoss(); w.hero.inv = 1e9;
      const foe = w.mobs.find(m => m.roomBoss)!;
      for (let i = 0; i < 60 * 40; i++) {
        if (i === 600) foe.hp = Math.round(foe.maxHp * 0.6);
        if (i === 1200) foe.hp = Math.round(foe.maxHp * 0.3);
        w.step({ ...NO_INPUT, left: true }); // hugging the door
        for (const m of w.mobs) if (m.state !== 'dead') expect(w.mapAt(m.x), `${id} ${m.kind} at ${Math.round(m.x)}`).toBeGreaterThanOrEqual(0);
      }
      expect(w.portal).toBe(false);
    }
  });
});
