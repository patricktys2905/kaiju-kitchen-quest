// Smarter monsters: they take turns, flank, guard healers and read button-mashing. Nightmare tightens it all.
import { describe, expect, it } from 'vitest';
import { derive, newProfile } from '../src/sim/stats';
import { NO_INPUT, type StageDef } from '../src/sim/types';
import { World } from '../src/sim/world';

const flat: StageDef = {
  id: 't', world: 1, num: 't', name: 't', bg: 'bg-far', mid: '', tile: 'tile-ground', platTint: 0xffffff, width: 2400, groundY: 400, lv: [3, 3], par: 60, rec: 1,
  platforms: [], ladders: [], mobs: [],
};
const hero = () => { const p = newProfile(0); p.level = 10; return derive(p); };
const busy = (w: World) => w.mobs.filter(m => (m.state === 'windup' || m.state === 'attack')).length;

describe('smarter monsters', () => {
  it('only two attack you at once (three on Nightmare); the rest wait their turn', () => {
    for (const [nm, cap] of [[false, 2], [true, 3]] as const) {
      const w = new World(flat, hero(), 1, [], 0, false, undefined, [], undefined, nm);
      w.hero.x = 1200; w.hero.hp = w.hero.d.maxHp = 1e7;
      for (let i = 0; i < 6; i++) w.spawnMob('bun', 1000 + i * 80, 3);
      let most = 0;
      for (let i = 0; i < 60 * 15; i++) { w.step(NO_INPUT); most = Math.max(most, busy(w)); }
      expect(most, nm ? 'nightmare' : 'normal').toBeLessThanOrEqual(cap);
      expect(most).toBeGreaterThan(0);
    }
  });
  it('they spread out to both sides of you', () => {
    const w = new World(flat, hero(), 1);
    w.hero.x = 1200; w.hero.hp = w.hero.d.maxHp = 1e7;
    for (let i = 0; i < 4; i++) w.spawnMob('bun', 900 + i * 40, 3); // all start on the left
    let both = false;
    for (let i = 0; i < 60 * 8 && !both; i++) { w.step(NO_INPUT); both = w.mobs.some(m => m.x > w.hero.x + 15) && w.mobs.some(m => m.x < w.hero.x - 15); }
    expect(both).toBe(true);
  });
  it('mashing the same combo makes them raise their guard; mixing in a launcher resets it', () => {
    const w = new World(flat, hero(), 1);
    w.hero.x = 1200; w.hero.face = 1; w.hero.hp = w.hero.d.maxHp = 1e7;
    const m = w.spawnMob('egg', 1250, 30); m.hp = m.maxHp = 1e7;
    let guard = false;
    for (let i = 0; i < 60 * 8 && !guard; i++) guard = w.step({ ...NO_INPUT, attack: i % 6 < 3 }).some(e => e.t === 'guardUp');
    expect(guard).toBe(true);
    expect(m.guardT).toBeGreaterThan(0);
    // a launcher (UP + attack) is not a plain combo hit: no read
    const v = new World(flat, hero(), 1);
    v.hero.x = 1200; v.hero.face = 1; v.hero.hp = v.hero.d.maxHp = 1e7;
    const e = v.spawnMob('egg', 1250, 30); e.hp = e.maxHp = 1e7;
    let read = false;
    for (let i = 0; i < 60 * 8; i++) read ||= v.step({ ...NO_INPUT, attack: i % 6 < 3, up: Math.floor(i / 30) % 3 === 0 }).some(x => x.t === 'guardUp');
    expect(read).toBe(false);
  });
  it('a shield carrier stands between you and its healer', () => {
    const w = new World({ ...flat, world: 4 }, hero(), 1);
    w.hero.x = 1500; w.hero.hp = w.hero.d.maxHp = 1e7;
    const healer = w.spawnMob('garlic', 1660, 3);
    const can = w.spawnMob('can', 1750, 3);
    for (let i = 0; i < 60 * 6; i++) w.step(NO_INPUT);
    expect(can.x).toBeLessThan(healer.x);
  });
  it('Nightmare: hard levels, shorter telegraphs', () => {
    const n = new World({ ...flat, mobs: [{ kind: 'bun', x: 1300, lv: 3 }] }, hero(), 1, [], 0, false, undefined, [], undefined, true);
    const h = new World({ ...flat, mobs: [{ kind: 'bun', x: 1300, lv: 3 }] }, hero(), 1, [], 0, true);
    expect(n.mobs[0].lv).toBe(h.mobs[0].lv);
    const windupLen = (w: World) => { w.hero.x = 1255; w.hero.hp = w.hero.d.maxHp = 1e7; let t0 = -1; for (let i = 0; i < 600; i++) { w.step(NO_INPUT); const m = w.mobs[0]; if (m.state === 'windup' && t0 < 0) t0 = i; if (t0 >= 0 && m.state === 'attack') return i - t0; } return 999; };
    expect(windupLen(n)).toBeLessThan(windupLen(h));
  });
});
