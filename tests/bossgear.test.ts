// Boss signature weapons: 220 (one per kaiju per world boss), each with its own gear skill, and every style works.
import { describe, expect, it } from 'vitest';
import { BOSS_WEAPONS, ALL_STYLES } from '../src/sim/bossgearData';
import { GEAR, gearOf } from '../src/sim/gear';
import { BASES, rollItem } from '../src/sim/items';
import { STAGES } from '../src/sim/stages';
import { derive, newProfile } from '../src/sim/stats';
import { NO_INPUT } from '../src/sim/types';
import { World } from '../src/sim/world';

describe('boss signature weapons', () => {
  it('every boss drops one weapon for every kaiju, all different skills for a kaiju and for a boss', () => {
    expect(BOSS_WEAPONS.length).toBe(220);
    for (const bw of BOSS_WEAPONS) {
      expect(BASES[bw.base]?.for, bw.base).toBe(bw.species);
      expect(BASES[bw.base].boss).toBe(bw.boss);
      expect(GEAR[bw.base]?.name).toBe(bw.skill);
    }
    for (const sp of new Set(BOSS_WEAPONS.map(b => b.species))) expect(new Set(BOSS_WEAPONS.filter(b => b.species === sp).map(b => b.style)).size).toBe(11);
    for (const boss of new Set(BOSS_WEAPONS.map(b => b.boss))) expect(new Set(BOSS_WEAPONS.filter(b => b.boss === boss).map(b => b.style)).size).toBe(20);
    // never from a random box
    const r = (() => { let s = 7; return () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff); })();
    for (let i = 0; i < 3000; i++) expect(BASES[rollItem(i, 5, 110, r, []).base].boss).toBeUndefined();
  });

  it('every one of the 20 styles casts and hurts monsters', () => {
    const st = STAGES.find(s => s.id === '1-1')!;
    const broken: string[] = [];
    for (const style of ALL_STYLES) {
      const bw = BOSS_WEAPONS.find(b => b.style === style)!;
      const p = newProfile(bw.species); p.level = 40;
      p.equip.weapon = rollItem(1, 5, 40, () => 0.5, [], bw.species, bw.base, 4);
      const d = derive(p);
      expect(gearOf(p.equip.weapon)!.style, bw.base).toBe(style);
      const w = new World({ ...st, mobs: [], arenas: [], hazards: [], props: [], cookers: [], platforms: [], ladders: [], maps: undefined, objective: undefined, gates: undefined, chase: undefined }, d, 3);
      w.hero.x = 600; w.hero.face = 1;
      const mobs = [w.spawnMob('egg', 700, 20), w.spawnMob('egg', 800, 20), w.spawnMob('egg', 520, 20)];
      for (const m of mobs) m.hp = m.maxHp = 1e7;
      let cast = false, guard = 0;
      for (let i = 0; i < 6 && !cast; i++) for (const e of w.step({ ...NO_INPUT, gear: true })) if (e.t === 'gear') { cast = true; guard = w.hero.shield; }
      for (let i = 0; i < 60 * 4; i++) w.step(NO_INPUT);
      const hurt = mobs.some(m => m.hp < 1e7);
      if (!cast) broken.push(`${style}: did not cast`);
      else if (style !== 'shield' && !hurt) broken.push(`${style}: never hit`);
      if (style === 'shield' && guard <= 0) broken.push('shield: no guard');
    }
    expect(broken).toEqual([]);
  });
});
