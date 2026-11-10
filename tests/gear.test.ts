// Gear that plays: weapon gear skills (4th button), procs on armour / charms, signature legendaries.
import { describe, expect, it } from 'vitest';
import { GEAR, STYLE } from '../src/sim/gear';
import { BASES, type Item, PROCS, UNIQUES, rollItem } from '../src/sim/items';
import { SKILLS } from '../src/sim/skills';
import { derive, newProfile } from '../src/sim/stats';
import { NO_INPUT, type StageDef } from '../src/sim/types';
import { World } from '../src/sim/world';

const flat: StageDef = {
  id: 't', world: 1, num: 't', name: 't', bg: 'bg-far', mid: '', tile: 'tile-ground', platTint: 0xffffff, width: 2400, groundY: 400, lv: [3, 3], par: 60, rec: 1,
  platforms: [], ladders: [], mobs: [],
};
let nid = 1;
const item = (base: string, extra: Partial<Item> = {}): Item => ({ id: nid++, base, rarity: 3, ilvl: 5, plus: 0, lines: [], grade: 1, ...extra });
function world(sp: number, equip: Partial<Record<'weapon' | 'armor' | 'charm', Item>>, lv = 12) {
  const p = newProfile(sp); p.level = lv; p.equip = equip;
  for (const a of SKILLS[sp].actives) p.skills[a.id] = 1;
  const w = new World(flat, derive(p), 3);
  w.hero.x = 500; w.hero.face = 1;
  return w;
}
const run = (w: World, frames: number, inp = NO_INPUT) => { const ev = []; for (let i = 0; i < frames; i++) ev.push(...w.step(inp)); return ev; };

describe('gear skills', () => {
  it('every kaiju weapon has one, and no weapon means no gear skill', () => {
    for (const [k, b] of Object.entries(BASES)) if (b.slot === 'weapon' && !b.retired) expect(GEAR[k], k).toBeTruthy();
    expect(world(0, {}).hero.d.gear).toBeNull();
  });
  it('each style hurts a monster in front, goes on cooldown and shows the weapon', () => {
    const pick: Record<string, [number, string]> = { throw: [0, 'spoon'], lob: [10, 'w-blue2'], roll: [10, 'pin'], slam: [0, 'w-gob3'], rain: [4, 'w-moth3'] };
    for (const [style, [sp, base]] of Object.entries(pick)) {
      expect(GEAR[base].style).toBe(style);
      const w = world(sp, { weapon: item(base) });
      const m = w.spawnMob('egg', 680, 3); m.hp = m.maxHp = 1e6;
      const ev = run(w, 1, { ...NO_INPUT, gear: true });
      expect(ev.some(e => e.t === 'gear'), style).toBe(true);
      expect(w.shots.some(s => s.icon === BASES[base].icon), style).toBe(true);
      expect(w.hero.cds[3], style).toBeGreaterThan(STYLE[style as 'throw'].cd * 0.4);
      run(w, 90);
      expect(m.hp, style).toBeLessThan(1e6);
    }
  });
  it('the twist lands: glue, freeze, burn', () => {
    for (const [sp, base, check] of [[10, 'w-blue2', 'glued'], [17, 'w-peng1', 'frozen'], [7, 'w-nori1', 'burn']] as const) {
      const w = world(sp, { weapon: item(base) });
      const m = w.spawnMob('bun', 640, 3); m.hp = m.maxHp = 1e6;
      run(w, 1, { ...NO_INPUT, gear: true });
      let seen = false;
      for (let i = 0; i < 90 && !seen; i++) { w.step(NO_INPUT); seen = (m as unknown as Record<string, number>)[check] > 0; }
      expect(seen, base).toBe(true);
    }
  });
  it('better weapons hit harder', () => {
    const lo = world(0, { weapon: item('spoon', { rarity: 1 }) }).hero.d.gear!, hi = world(0, { weapon: item('spoon', { rarity: 5, plus: 8 }) }).hero.d.gear!;
    expect(hi.power).toBeGreaterThan(lo.power * 2);
  });
});

describe('signature legendaries', () => {
  it('two per kaiju, each upgrading one of its own skills', () => {
    for (const sp of Object.keys(SKILLS).map(Number)) {
      const mine = Object.values(UNIQUES).filter(u => u.for === sp);
      expect(mine.length, `kaiju ${sp}`).toBe(2);
      for (const u of mine) expect(SKILLS[sp].actives.some(a => a.id === u.skill), u.name).toBe(true);
    }
  });
  it('Berry Bomb Basket: Berry Mines throws 6', () => {
    const plain = world(10, {}), basket = world(10, { weapon: item('pin', { unique: 'berrybasket', rarity: 5 }) });
    const count = (w: World) => { run(w, 1, { ...NO_INPUT, skill2: true }); run(w, 3); return w.shots.filter(s => s.kind === 'berry').length + w.mines.length; };
    expect(count(plain)).toBe(3);
    expect(count(basket)).toBe(6);
  });
  it("Deep-Dish Disc: the cutter is thrown twice; another kaiju gets nothing from it", () => {
    const w = world(11, { weapon: item('skewer', { unique: 'deepdish', rarity: 5 }) });
    run(w, 1, { ...NO_INPUT, skill2: true });
    const first = new Set(w.shots.map(s => s.id));
    run(w, 30);
    expect(w.shots.some(s => !first.has(s.id) && s.kind === 'boomerang')).toBe(true);
    expect(Object.keys(world(0, { weapon: item('spoon', { unique: 'deepdish' }) }).hero.d.mods)).toEqual([]);
  });
  it('turn up on their own kaiju\'s gear, more when you play that kaiju', () => {
    let r = 7; const rand = () => { r = (r * 16807) % 2147483647; return r / 2147483647; };
    let mine = 0, other = 0, wrong = 0;
    for (let i = 0; i < 40000; i++) {
      const it = rollItem(i, 5, 30, rand, [], 10);
      const u = it.unique && UNIQUES[it.unique];
      if (!u || u.for === undefined) continue;
      if (u.for !== BASES[it.base].for) wrong++;
      if (u.for === 10) mine++; else other++;
    }
    expect(wrong).toBe(0);
    expect(mine).toBeGreaterThan(other / 11 * 2);
  });
});

describe('procs', () => {
  it('only on armour and charms', () => {
    let r = 11; const rand = () => { r = (r * 16807) % 2147483647; return r / 2147483647; };
    let n = 0;
    for (let i = 0; i < 5000; i++) { const it = rollItem(i, 5, 20, rand, []); if (it.proc) { n++; expect(BASES[it.base].slot).not.toBe('weapon'); expect(PROCS[it.proc]).toBeTruthy(); } }
    expect(n).toBeGreaterThan(300);
  });
  it('Bubble Wrap: a shield pops up at low HP and soaks the next hits', () => {
    const w = world(0, { armor: item('apron', { proc: 'bubble' }) });
    const h = w.hero; h.hp = h.d.maxHp * 0.4;
    const m = w.spawnMob('bun', 540, 3);
    let shielded = false;
    for (let i = 0; i < 60 * 8 && !shielded; i++) { w.step(NO_INPUT); shielded = h.shield > 0; }
    expect(shielded).toBe(true);
    void m;
  });
  it('Static Whisk: every 6th hit zaps nearby monsters', () => {
    const w = world(0, { charm: item('cookie', { proc: 'zap' }) });
    for (const x of [560, 620, 680]) { const m = w.spawnMob('egg', x, 3); m.hp = m.maxHp = 1e6; }
    const ev = []; for (let i = 0; i < 60 * 4; i++) ev.push(...w.step({ ...NO_INPUT, attack: i % 8 < 4 }));
    expect(ev.some(e => e.t === 'zap')).toBe(true);
  });
  it('Snack Break heals on kills; Jam Trap leaves a mine after a perfect dodge', () => {
    const w = world(0, { charm: item('cookie', { proc: 'snack' }), armor: item('apron', { proc: 'jamtrap' }) });
    const h = w.hero; h.hp = h.d.maxHp / 2;
    const m = w.spawnMob('bun', 560, 1); m.hp = 1;
    run(w, 40, { ...NO_INPUT, attack: true });
    expect(h.hp).toBeGreaterThan(h.d.maxHp / 2);
    (w as unknown as { perfect(): void }).perfect();
    expect(w.mines.some(x => x.glue)).toBe(true);
  });
});
