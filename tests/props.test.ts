// Interactive maps: breakables, sponges, levers, runaway pressure cookers, moving trays, secret ledges + keys.
import { describe, expect, it } from 'vitest';
import { BONUS_STAGES, STAGES, WORLDS } from '../src/sim/stages';
import { derive, newProfile } from '../src/sim/stats';
import { type Input, NO_INPUT, type StageDef } from '../src/sim/types';
import { World } from '../src/sim/world';

const flat: StageDef = {
  id: 't', world: 1, num: 't', name: 't', bg: 'bg-far', mid: '', tile: 'tile-ground', platTint: 0xffffff, width: 2000, groundY: 400, lv: [3, 3], par: 60, rec: 1,
  platforms: [], ladders: [], mobs: [],
};
const hero = () => { const p = newProfile(0); p.level = 10; return derive(p); };
const run = (w: World, inp: Partial<Input>, n: number) => { const evs = []; for (let i = 0; i < n; i++) evs.push(...w.step({ ...NO_INPUT, ...inp })); return evs; };
const swing = (w: World, n = 1) => { const evs = []; for (let i = 0; i < n; i++) { evs.push(...run(w, { attack: true }, 1), ...run(w, {}, 40)); } return evs; };

describe('props', () => {
  it('crates take two hits and can drop boxes; jars heal you', () => {
    const w = new World({ ...flat, props: [{ kind: 'crate', x: 540, y: 400 }, { kind: 'jar', x: 560, y: 400 }] }, hero(), 1);
    w.hero.x = 500; w.hero.face = 1; w.hero.hp = 50;
    const evs = swing(w, 3);
    expect(evs.filter(e => e.t === 'prop').map(e => e.t === 'prop' && e.kind).sort()).toEqual(['crate', 'jar']);
    expect(w.hero.hp).toBeGreaterThan(50);
    expect(w.run.crumbs).toBeGreaterThan(0);
  });
  it('a sponge bounces you far higher than a jump when you land on it (walking over it does nothing)', () => {
    const walk = new World({ ...flat, props: [{ kind: 'sponge', x: 500, y: 400 }] }, hero(), 1);
    walk.hero.x = 500; run(walk, {}, 30);
    expect(walk.hero.y).toBe(400);
    const w = new World({ ...flat, props: [{ kind: 'sponge', x: 500, y: 400 }] }, hero(), 1);
    w.hero.x = 500; w.hero.y = 330; w.hero.ground = false; w.hero.on = null; w.hero.state = 'air';
    let top = 400;
    for (let i = 0; i < 70; i++) { w.step(NO_INPUT); if (i > 10) top = Math.min(top, w.hero.y); }
    expect(400 - top).toBeGreaterThan(250);
  });
  it('a lever drops a rolling pin on the monsters in its zone', () => {
    const w = new World({ ...flat, props: [{ kind: 'lever', x: 540, y: 400, tx: 900, tw: 260 }] }, hero(), 1);
    w.hero.x = 500; w.hero.face = 1;
    const near = w.spawnMob('egg', 900, 3), far = w.spawnMob('egg', 1400, 3);
    swing(w);
    expect(near.hp).toBeLessThan(near.maxHp * 0.7);
    expect(far.hp).toBe(far.maxHp);
  });
  it('runaway pressure cookers can\'t be hurt, get shoved by hits, and blow up monsters near them', () => {
    const w = new World({ ...flat, cookers: [700] }, hero(), 1);
    w.hero.x = 200;
    const m = w.spawnMob('bun', 720, 3); m.state = 'hurt'; m.t = -99;
    let boom = false;
    for (let i = 0; i < 120 && !boom; i++) boom = w.step(NO_INPUT).some(e => e.t === 'boom');
    expect(boom).toBe(true);
    expect(m.hp < m.maxHp || (m.state as string) === 'dead').toBe(true);
    // shove one
    const v = new World({ ...flat, cookers: [560] }, hero(), 1);
    v.hero.x = 500; v.hero.face = 1;
    run(v, { attack: true }, 1); run(v, {}, 8);
    expect(v.cookers[0].vx).toBeGreaterThan(100);
  });
  it('moving trays carry you', () => {
    const w = new World({ ...flat, platforms: [{ x: 400, y: 300, w: 200, move: { dx: 120, period: 4 } }] }, hero(), 1);
    w.hero.x = 480; w.hero.y = 300; w.hero.ground = true; w.hero.on = 0;
    run(w, {}, 60);
    expect(w.hero.x).toBeGreaterThan(500);
    expect(w.hero.y).toBe(300);
  });
  it('the World Key is in the secret chest of stage 7 of every world; each world has a secret bonus stage', () => {
    for (const wd of WORLDS) {
      const s7 = STAGES.find(s => s.id === `${wd.id}-7`)!;
      const chest = s7.props!.find(p => p.kind === 'chest')!;
      expect(chest.key).toBe(true);
      expect(s7.platforms.some(p => p.secret && chest.x >= p.x && chest.x <= p.x + p.w)).toBe(true);
      expect(s7.props!.some(p => p.kind === 'sponge' && s7.platforms.some(q => q.secret && p.x >= q.x && p.x <= q.x + q.w))).toBe(true);
      const w = new World(s7, hero(), 1);
      const c = w.props.find(p => p.kind === 'chest')!;
      w.hero.x = c.x - 40; w.hero.y = c.y; w.hero.ground = true; w.hero.on = w.stage.platforms.findIndex(p => p.secret); w.hero.face = 1;
      for (const m of w.mobs) { m.hp = 0; m.state = 'dead'; }
      const evs = swing(w, 4);
      expect(evs.some(e => e.t === 'key' && e.world === wd.id), `world ${wd.id}`).toBe(true);
    }
    expect(BONUS_STAGES.map(s => s.id)).toEqual(['S-1', 'S-2', 'S-3', 'S-4', 'S-5', 'S-6', 'S-7']);
    for (const b of BONUS_STAGES) expect(b.mobs.some(m => m.elite)).toBe(true);
  });
  it('the world\'s own platforms are not changed by a moving tray (each run has its own copy)', () => {
    const st = STAGES.find(s => s.platforms.some(p => p.move))!;
    const before = st.platforms.map(p => p.x).join();
    const w = new World(st, hero(), 1);
    run(w, {}, 90);
    expect(st.platforms.map(p => p.x).join()).toBe(before);
  });
});

describe('sponges', () => {
  it('a sponge is never under another platform or near a ladder (no accidental launches)', () => {
    for (const st of [...STAGES, ...BONUS_STAGES]) for (const p of st.props ?? []) {
      if (p.kind !== 'sponge') continue;
      const above = st.platforms.filter(q => !q.secret && p.x > q.x - 60 && p.x < q.x + q.w + 60);
      expect(above.map(q => `${q.x},${q.y}`), `${st.id} sponge at ${p.x}`).toEqual([]);
      expect(st.ladders.some(l => Math.abs(l.x - p.x) < 80), `${st.id} sponge near a ladder`).toBe(false);
    }
  });
  it('every stage 7 still has its key chest', () => {
    for (const wd of WORLDS) expect(STAGES.find(s => s.id === `${wd.id}-7`)!.props!.some(p => p.kind === 'chest' && p.key), `world ${wd.id}`).toBe(true);
  });
});
