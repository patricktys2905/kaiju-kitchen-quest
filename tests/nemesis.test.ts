// Story nemeses: one per kaiju at stage 5 of every world, with its own moves (more each world).
import { describe, expect, it } from 'vitest';
import { CLASSES } from '../src/sim/classes';
import { MOBS, nemesisMoves, nemesisOf } from '../src/sim/mobs';
import { skillsOf } from '../src/sim/skills';
import { STAGES } from '../src/sim/stages';
import { derive, newProfile } from '../src/sim/stats';
import { NO_INPUT, type MobKind } from '../src/sim/types';
import { World } from '../src/sim/world';
import { STORIES } from '../src/story/stories';

const NEMS = (Object.keys(MOBS) as MobKind[]).filter(k => MOBS[k].brain === 'nemesis');
const SIGNATURES = ['slimesurge', 'summon', 'rootspike', 'dive', 'snatch', 'boomerang', 'beam', 'lure', 'vanish', 'shell', 'burrow', 'heatwave', 'skewer', 'finslide', 'yank', 'stingers', 'scurry', 'haymaker', 'zip', 'boomhop'];
function hero(species: number, level: number) {
  const p = newProfile(species); p.level = level;
  for (const s of [...skillsOf(species).actives, skillsOf(species).passive]) if (level >= s.unlock) p.skills[s.id] = 1;
  return derive(p);
}

describe('nemeses', () => {
  it('every kaiju has exactly one nemesis, with 4 moves, a signature move and a unique move set', () => {
    for (const c of CLASSES) expect(NEMS.filter(k => MOBS[k].nem!.species === c.species).length, c.name).toBe(1);
    const sets = NEMS.map(k => MOBS[k].nem!.moves.slice().sort().join());
    expect(new Set(sets).size).toBe(NEMS.length);
    for (const k of NEMS) {
      const n = MOBS[k].nem!;
      expect(n.moves.length).toBe(4);
      expect(n.names.length).toBe(4);
      const sig = n.moves.filter(m => SIGNATURES.includes(m));
      expect(sig.length, MOBS[k].name).toBeGreaterThan(0);
      for (const s of sig) expect(NEMS.filter(o => MOBS[o].nem!.moves.includes(s)).length, `${s} belongs to one nemesis`).toBe(1);
    }
  });
  it('they learn more moves each world', () => {
    for (const k of NEMS) expect([1, 2, 3, 4].map(w => nemesisMoves(k, w).length)).toEqual([2, 3, 4, 4]);
  });
  it('take the elite\'s place at stage 5 of each world for their kaiju only; bosses stay the same', () => {
    for (const c of CLASSES) for (const wid of [1, 2, 3, 4]) {
      const st = STAGES.find(s => s.id === `${wid}-5`)!;
      const w = new World(st, hero(c.species, st.rec), 1, [], 0, false, undefined, [], nemesisOf(c.species));
      const n = w.mobs.filter(m => MOBS[m.kind].brain === 'nemesis');
      expect(n.length).toBe(1);
      expect(n[0].kind).toBe(nemesisOf(c.species));
      expect(n[0].phase).toBe(wid);
      const boss = STAGES.find(s => s.id === `${wid}-10`)!;
      const b = new World(boss, hero(c.species, boss.rec), 1, [], 0, false, undefined, [], nemesisOf(c.species));
      expect(b.mobs.map(m => m.kind)).toEqual([boss.mobs[0].kind]);
    }
  });
  it('every nemesis uses all of its World 4 moves without errors', () => {
    const st = STAGES.find(s => s.id === '4-5')!;
    for (const k of NEMS) {
      const w = new World({ ...st, mobs: [], hazards: [] }, hero(0, 45), 3);
      w.hero.hp = w.hero.d.maxHp = 1e7; w.hero.x = 600;
      const m = w.spawnMob(k, 900, 45, undefined, true); m.phase = 4;
      const used = new Set<string>();
      let hurt = false;
      for (let i = 0; i < 60 * 90 && used.size < 4; i++) {
        for (const e of w.step(NO_INPUT)) { if (e.t === 'mobAttack' && e.id === m.id) used.add(e.kind); if (e.t === 'hit' && e.target === 'hero') hurt = true; }
        if (i % 120 === 0) w.hero.x = 500 + ((i / 120) % 3) * 150; // move around so every range comes up
        m.hp = m.maxHp;
      }
      expect([...used].sort(), MOBS[k].name).toEqual(MOBS[k].nem!.moves.slice().sort());
      expect(hurt, MOBS[k].name).toBe(true);
    }
  });
  it('Crustwing snatches a quick-bag item and gives it back when beaten', () => {
    const w = new World({ ...STAGES[0], mobs: [], hazards: [] }, hero(10, 10), 1, [{ id: 'jam', n: 3 }, null, null, null]);
    w.hero.x = 500;
    const m = w.spawnMob('ncrow', 650, 5, undefined, true);
    m.phase = 4; m.state = 'attack'; m.move = 'snatch'; m.t = 0; m.x = 500; m.y = w.hero.y - 30; m.vx = 0; m.vy = 0;
    const evs = w.step(NO_INPUT);
    expect(evs.some(e => e.t === 'steal')).toBe(true);
    expect(w.hero.bag[0]!.n).toBe(2);
    m.hp = 1; w.hero.inv = 0; w.hero.state = 'move'; w.hero.face = 1;
    let back = false;
    for (let i = 0; i < 300 && !back; i++) { m.x = w.hero.x + 40; m.y = w.hero.y; back = w.step({ ...NO_INPUT, attack: i % 2 === 0 }).some(e => e.t === 'recover'); }
    expect(back).toBe(true);
    expect(w.hero.bag[0]!.n).toBe(3);
  });
  it('Duke Fortune Cookie\'s shell shrugs off hits until a Guard Break cracks it', () => {
    const w = new World({ ...STAGES[0], mobs: [], hazards: [] }, hero(6, 12), 1);
    w.hero.x = 500; w.hero.face = 1;
    const m = w.spawnMob('ncookie', 560, 5, undefined, true); m.shellT = 4; m.state = 'walk'; m.t = -99;
    const hp0 = m.hp;
    for (let i = 0; i < 2; i++) w.step({ ...NO_INPUT, attack: true }), w.step(NO_INPUT);
    for (let i = 0; i < 80; i++) w.step(NO_INPUT); // let the combo finish
    const small = hp0 - m.hp;
    expect(m.shellT).toBeGreaterThan(0);
    m.x = 560; m.vx = 0; m.state = 'walk'; m.t = -99;
    w.step({ ...NO_INPUT, attack: true, down: true });
    for (let i = 0; i < 40 && m.shellT > 0; i++) w.step(NO_INPUT);
    expect(m.shellT).toBe(0);
    expect(small).toBeLessThan(m.maxHp * 0.05);
  });
  it('every kaiju\'s story has its nemesis speak at every stage 5', () => {
    for (const c of CLASSES) for (const n of [1, 2, 3, 4]) expect(STORIES[c.species].beats[`w${n}-elite`].some(([who]) => who === 'foe'), `${c.name} w${n}`).toBe(true);
  });
});
