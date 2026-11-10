// The newer gear-skill styles: a boomerang comes back and hits twice, a burst hits all around you, a trap snaps when stepped on.
import { describe, expect, it } from 'vitest';
import { BASES, rollItem, TWIST_STYLES } from '../src/sim/items';
import { GEAR, STYLE, gearSkillOf } from '../src/sim/gear';
import { STAGES } from '../src/sim/stages';
import { derive, newProfile } from '../src/sim/stats';
import { NO_INPUT } from '../src/sim/types';
import { World } from '../src/sim/world';

const withWeapon = (base: string) => {
  const p = newProfile(BASES[base].for!);
  p.equip.weapon = { id: 1, base, rarity: 2, ilvl: 1, plus: 0, lines: [{ k: 'atk', v: 5 }] };
  const st = STAGES.find(s => s.id === '1-1')!;
  const w = new World({ ...st, mobs: [], arenas: [], hazards: [], chase: undefined, props: [], cookers: [], objective: undefined }, derive(p), 1);
  w.hero.x = 400; w.hero.face = 1;
  return w;
};
const cast = (w: World) => { w.step({ ...NO_INPUT, gear: true }); w.step(NO_INPUT); };

describe('new gear styles', () => {
  it('every style has numbers and can be rolled as a twist', () => {
    for (const s of ['boomerang', 'burst', 'trap'] as const) { expect(STYLE[s].dmg).toBeGreaterThan(0); expect(TWIST_STYLES).toContain(s); }
  });
  it('each kaiju has two new weapon types with their own gear skills', () => {
    const counts: Record<number, number> = {};
    for (const [k, b] of Object.entries(BASES)) if (b.slot === 'weapon' && /^w-[a-z]+[ab]$/.test(k)) { counts[b.for!] = (counts[b.for!] ?? 0) + 1; expect(GEAR[k], k).toBeTruthy(); }
    expect(Object.keys(counts).length).toBe(20);
    expect(Object.values(counts).every(n => n === 2)).toBe(true);
  });
  it('a boomerang hits a monster on the way out and again on the way back', () => {
    const w = withWeapon('w-blueb'.replace('blueb', 'gobb')); // Stem Boomerang
    const m = w.spawnMob('egg', 620, 30);
    const hp0 = m.hp; let hits = 0;
    cast(w);
    for (let i = 0; i < 120; i++) for (const e of w.step(NO_INPUT)) if (e.t === 'hit' && e.target === 'mob') hits++;
    expect(m.hp).toBeLessThan(hp0);
    expect(hits).toBeGreaterThanOrEqual(2);
  });
  it('a burst hits monsters behind you too', () => {
    const w = withWeapon('w-goba'); // Seed Slingshot
    const m = w.spawnMob('egg', 300, 30); // behind
    const hp0 = m.hp;
    cast(w); for (let i = 0; i < 40; i++) w.step(NO_INPUT);
    expect(m.hp).toBeLessThan(hp0);
  });
  it('a trap waits on the floor and snaps the first monster to step on it', () => {
    const w = withWeapon('w-bluea'); // Muffin Tin Shield
    cast(w);
    expect(w.mines.some(mi => mi.icon === BASES['w-bluea'].icon)).toBe(true);
    const m = w.spawnMob('bun', 600, 30); const hp0 = m.hp;
    for (let i = 0; i < 900 && m.hp === hp0; i++) w.step(NO_INPUT); // the bun walks over to the hero, across the trap
    expect(m.hp).toBeLessThan(hp0);
  });
  it('twists can roll the new styles too', () => {
    let s = 9; const rand = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    const styles = new Set<string>();
    for (let i = 0; i < 600; i++) { const it = rollItem(i, 3, 10, rand, []); if (BASES[it.base].slot === 'weapon') styles.add(gearSkillOf(it)!.style); }
    for (const st of ['boomerang', 'burst', 'trap']) expect(styles.has(st), st).toBe(true);
  });
});
