// The armour/charm effects added with gear variety 2, each triggered for real in the simulation.
import { describe, expect, it } from 'vitest';
import { BASES, PROCS, rollItem } from '../src/sim/items';
import { STAGES } from '../src/sim/stages';
import { derive, newProfile } from '../src/sim/stats';
import { NO_INPUT } from '../src/sim/types';
import { World } from '../src/sim/world';

const st = STAGES.find(s => s.id === '1-1')!;
const make = (proc: string, sp = 0) => {
  const p = newProfile(sp); p.level = 12;
  p.equip.weapon = { id: 1, base: 'spoon', rarity: 2, ilvl: 5, plus: 0, lines: [{ k: 'atk', v: 5 }] };
  const d = derive(p); d.procs.push(proc);
  const w = new World({ ...st, mobs: [], arenas: [], hazards: [], chase: undefined, props: [], cookers: [], objective: undefined }, d, 3);
  w.hero.x = 400; w.hero.face = 1; w.hero.ult = 100;
  return w;
};
const hurt = (w: World, n: number) => (w as unknown as { hurtHero(raw: number, dir: number): void }).hurtHero(n, 1);

describe('gear variety 2 effects', () => {
  it('every new effect is described, and every new armour/charm carries its effect on every copy', () => {
    for (const k of ['meringue', 'popcorn', 'syrup', 'pepper', 'scoop', 'quickdraw', 'bite', 'magnet']) expect(PROCS[k]?.effect, k).toBeTruthy();
    let s = 5; const rand = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    const withProc = Object.entries(BASES).filter(([, b]) => b.proc);
    expect(withProc.length).toBe(28);
    for (const [k, b] of withProc) { expect(PROCS[b.proc!], k).toBeTruthy(); }
    for (let i = 0; i < 400; i++) { const it = rollItem(i, 2, 20, rand, []); if (BASES[it.base].proc) expect(it.proc).toBe(BASES[it.base].proc); }
  });
  it('Meringue Guard halves the first hit, then waits 10 s', () => {
    const w = make('meringue'), h = w.hero, hp0 = h.hp;
    hurt(w, 100); const first = hp0 - h.hp;
    h.inv = 0; const hp1 = h.hp; hurt(w, 100); const second = hp1 - h.hp;
    expect(first).toBeLessThan(second * 0.7);
  });
  it('Popcorn Burst hurts monsters around you when you get hit', () => {
    const w = make('popcorn'); const m = w.spawnMob('egg', 450, 5), hp0 = m.hp;
    hurt(w, 50);
    expect(m.hp).toBeLessThan(hp0);
  });
  it('Syrup Slide slows monsters you dodge through', () => {
    const w = make('syrup'); const m = w.spawnMob('egg', 470, 5);
    w.step({ ...NO_INPUT, right: true }); w.step(NO_INPUT); w.step({ ...NO_INPUT, right: true });
    expect(w.hero.state).toBe('dodge');
    expect(m.slow).toBeGreaterThan(0);
  });
  it('Pepper Breath fires on the 5th skill', () => {
    const w = make('pepper'); w.spawnMob('egg', 480, 30);
    let fired = false;
    for (let i = 0; i < 5; i++) { w.hero.cds[0] = 0; w.hero.state = 'move'; w.hero.skill = null; for (const e of w.step({ ...NO_INPUT, skill1: true })) if (e.t === 'proc' && e.name === 'Pepper Breath!') fired = true; for (let k = 0; k < 40; k++) w.step(NO_INPUT); }
    expect(fired).toBe(true);
  });
  it('Second Scoop refunds 30% of the ultimate', () => {
    const p = newProfile(0); p.level = 20; const d = derive(p); d.procs.push('scoop');
    const w = new World({ ...st, mobs: [], arenas: [], hazards: [], chase: undefined }, d, 3); w.hero.ult = 100;
    w.step({ ...NO_INPUT, ult: true });
    expect(w.hero.ult).toBe(30);
  });
  it('Quick Draw recharges the gear skill on a perfect dodge', () => {
    const w = make('quickdraw'); w.hero.cds[3] = 8;
    (w as unknown as { perfect(): void }).perfect();
    expect(w.hero.cds[3]).toBe(0);
  });
  it('Crumb Magnet gives 25% more crumbs', () => {
    const run = (proc: string) => { const w = make(proc); const m = w.spawnMob('bun', 430, 1); m.hp = 1; for (let i = 0; i < 60 && w.run.crumbs === 0; i++) w.step({ ...NO_INPUT, attack: i % 2 === 0 }); return w.run.crumbs; };
    const plain = run('none'), magnet = run('magnet');
    expect(plain).toBeGreaterThan(0);
    expect(magnet).toBe(Math.round(plain * 1.25));
  });
});
