// Multi-hero groundwork: 1-4 heroes in one stage (CPU buddy now, online players later).
import { describe, expect, it } from 'vitest';
import { AVERAGE, Bot } from '../src/sim/bot';
import { STAGES } from '../src/sim/stages';
import { derive, newProfile } from '../src/sim/stats';
import { NO_INPUT, type StageDef } from '../src/sim/types';
import { World } from '../src/sim/world';

const flat: StageDef = {
  id: 't', world: 1, num: 't', name: 't', bg: 'bg-far', mid: '', tile: 'tile-ground', platTint: 0xffffff, width: 2400, groundY: 400, lv: [3, 3], par: 60, rec: 1,
  platforms: [], ladders: [], mobs: [],
};
const d = (sp = 0, lv = 12) => { const p = newProfile(sp); p.level = lv; return derive(p); };
const duo = (st = flat, extra: object = {}) => Object.assign(new World(st, d(0), 1, [], 0, false, undefined, [], undefined, false, [d(10)]), extra);

describe('party', () => {
  it('one hero works exactly as before', () => {
    const w = new World(flat, d(), 1);
    expect(w.heroes.length).toBe(1);
    expect(w.hero).toBe(w.heroes[0]);
  });
  it('monsters go after the nearest hero', () => {
    const w = duo();
    const [p, b] = w.heroes; p.x = 900; b.x = 1250; p.hp = p.d.maxHp = b.hp = b.d.maxHp = 1e7; // within the leash
    const m = w.spawnMob('bun', 1310, 3);
    for (let i = 0; i < 60 * 4; i++) w.step([NO_INPUT, NO_INPUT]);
    expect(m.tgt).toBe(1);
    expect(b.hp).toBeLessThan(1e7);
    expect(p.hp).toBe(1e7);
  });
  it('a downed hero gets revived by a teammate standing next to them; only a full wipe ends the stage', () => {
    const w = duo();
    const [p, b] = w.heroes; p.x = 500; b.x = 520;
    p.hp = 0; (w as unknown as { enter(h: unknown, s: string): void }).enter(p, 'down');
    let revived = false, failed = false;
    for (let i = 0; i < 60 * 4 && !revived; i++) { const ev = w.step([NO_INPUT, NO_INPUT]); revived = ev.some(e => e.t === 'revive'); failed ||= ev.some(e => e.t === 'down'); }
    expect(failed).toBe(false);
    expect(revived).toBe(true);
    expect(p.hp).toBeGreaterThan(0);
    const v = duo();
    for (const h of v.heroes) { h.hp = 0; (v as unknown as { enter(h: unknown, s: string): void }).enter(h, 'down'); }
    let wiped = false;
    for (let i = 0; i < 60 * 3 && !wiped; i++) wiped = v.step([NO_INPUT, NO_INPUT]).some(e => e.t === 'down');
    expect(wiped).toBe(true);
  });
  it('monsters get tougher with more heroes', () => {
    const solo = new World({ ...flat, mobs: [{ kind: 'bun', x: 900, lv: 3 }] }, d(), 1);
    const pair = duo({ ...flat, mobs: [{ kind: 'bun', x: 900, lv: 3 }] });
    expect(pair.mobs[0].maxHp).toBeGreaterThan(solo.mobs[0].maxHp * 1.3); // +35% for a CPU buddy (+60% per extra human)
  });
  it('a teammate who falls far behind is pulled back', () => {
    const w = duo();
    w.heroes[0].x = 1800; w.heroes[1].x = 200;
    w.step([NO_INPUT, NO_INPUT]);
    expect(Math.abs(w.heroes[1].x - w.heroes[0].x)).toBeLessThan(120);
  });
  it('each player gets their own drops (two human players)', () => {
    const w = new World({ ...flat, mobs: [] }, d(), 1, [], 0, false, undefined, [], undefined, false, [d(10)], 2);
    const m = w.spawnMob('egg', 600, 3, undefined, true); // elites always drop 2
    m.hp = 1; w.heroes[0].x = 560; w.heroes[0].face = 1;
    for (let i = 0; i < 30; i++) w.step([{ ...NO_INPUT, attack: i % 2 === 0 }, NO_INPUT]);
    expect(w.boxes.filter(b => b.owner === 0).length).toBe(2);
    expect(w.boxes.filter(b => b.owner === 1).length).toBe(2);
    // the player can't pick up player 2's box
    for (let i = 0; i < 90; i++) { w.heroes[0].x = 600; w.step([NO_INPUT, NO_INPUT]); }
    expect(w.lootOf[0].length).toBe(2);
    expect(w.lootOf[1].length).toBe(0);
  });
  it('an arena locks when anyone walks in and pulls the others inside', () => {
    const st: StageDef = { ...flat, arenas: [{ x0: 800, x1: 1440, waves: [[{ kind: 'bun', x: 900, lv: 1 }]] }] };
    const w = duo(st);
    w.heroes[1].x = 1100; w.heroes[0].x = 700;
    w.step([NO_INPUT, NO_INPUT]); w.step([NO_INPUT, NO_INPUT]);
    expect(w.arenas[0].locked).toBe(true);
    expect(w.heroes[0].x).toBeGreaterThan(800);
  });
  it("the player's rank only counts the player's own hits", () => {
    const w = duo();
    const [p, b] = w.heroes; p.x = 860; b.x = 1200; b.face = 1;
    const m = w.spawnMob('egg', 1250, 30); m.hp = m.maxHp = 1e7;
    for (let i = 0; i < 120; i++) w.step([NO_INPUT, { ...NO_INPUT, attack: i % 6 < 3 }]);
    expect(m.hp).toBeLessThan(1e7);
    expect(w.run.maxCombo).toBe(0);
  });
  it('a CPU buddy pulls its weight: it lands a good share of the hits and the pair clears the stage', () => {
    const st = STAGES.find(s => s.id === '1-3')!;
    const w = new World(st, d(0, 5), 3, [{ id: 'jam', n: 8 }, null, null, null], 0, false, undefined, [], undefined, false, [d(10, 5)], 1, [{ bag: [{ id: 'jam', n: 8 }, null, null, null], revives: 0 }]);
    const a = new Bot(w, AVERAGE, 7, 0), b = new Bot(w, AVERAGE, 9, 1);
    const hits = [0, 0];
    for (let i = 0; i < 60 * 900 && !w.cleared && !w.failed; i++) for (const e of w.step([a.think(), b.think()])) if (e.t === 'hit' && e.target === 'mob') hits[(e as { hi?: number }).hi ?? 0]++;
    expect(w.cleared).toBe(true);
    expect(hits[1] / (hits[0] + hits[1])).toBeGreaterThan(0.25);
  });
  it('a snapshot of the stage is small and JSON-safe (for online play later)', () => {
    const w = duo(STAGES.find(s => s.id === '2-4')!);
    for (let i = 0; i < 60; i++) w.step([NO_INPUT, NO_INPUT]);
    const json = JSON.stringify(w.snapshot());
    expect(JSON.parse(json).heroes.length).toBe(2);
    expect(json.length).toBeLessThan(8000);
  });
});
