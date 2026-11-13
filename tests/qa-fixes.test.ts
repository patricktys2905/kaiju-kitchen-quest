// QA-confirmed bugs on map stages (scripts/qa-sim.ts has the long-hand repros):
//  A. the Recipe Scroll race (stage 6, Daily Dungeon in that shape) against one-way exits and SKIP TO BOSS
//  B. the stage 8 hold-out's waves on map stages
//  C. the leash and the top floor
//  D. an online friend opening an exit
//  E. shared rewards are the same for every player
import { describe, expect, it } from 'vitest';
import { dailyStage } from '../src/sim/free';
import { STAGES } from '../src/sim/stages';
import { derive, newProfile } from '../src/sim/stats';
import { type Input, NO_INPUT, type SimEvent, type StageDef } from '../src/sim/types';
import { World } from '../src/sim/world';

const UP: Input = { ...NO_INPUT, up: true };
const stage = (id: string) => STAGES.find(s => s.id === id)!;
const prof = (sp: number, lv: number) => { const p = newProfile(sp); p.level = lv; return derive(p); };
const solo = (st: StageDef) => { const w = new World(st, prof(0, st.rec + 1), 5); w.hero.inv = 1e9; return w; };
const duo = (st: StageDef, humans: number) => { const w = new World(st, prof(0, st.rec + 1), 5, [], 0, false, undefined, [], undefined, false, [prof(10, st.rec + 1)], humans); for (const h of w.heroes) h.inv = 1e9; return w; };
const give = (w: World, mi: number) => { const g = w.stage.maps![mi].goal; if (g?.kind === 'collect') for (const q of g.wants) w.drops[q.mob] = (w.drops[q.mob] ?? 0) + q.n; };
function run(w: World, secs: number, inp: Input | Input[] = NO_INPUT): SimEvent[] { const out: SimEvent[] = []; for (let i = 0; i < 60 * secs && !w.failed && !w.cleared; i++) out.push(...w.step(inp)); return out; }
const said = (evs: SimEvent[]) => evs.filter(e => e.t === 'objective' || e.t === 'objFail').map(e => e.t === 'objective' ? e.text : e.t === 'objFail' ? e.why : '');
/** Through a map's exit (drops handed over). */
function through(w: World, mi: number): SimEvent[] { give(w, mi); for (const h of w.heroes) h.x = w.stage.maps![mi].portals[0].x; w.step(NO_INPUT); return [...w.step(UP), ...w.step(NO_INPUT)]; }
/** Fells the boss-room foe and walks out of the exit. */
function finish(w: World): SimEvent[] {
  const b = w.stage.maps![w.stage.maps!.length - 1];
  for (const h of w.heroes) if (w.mapAt(h.x) !== w.stage.maps!.length - 1) h.x = b.x0 + 200;
  w.step(NO_INPUT);
  for (const m of w.mobs) if (m.roomBoss) { m.hp = 0; m.state = 'dead'; }
  const evs = run(w, 2);
  w.heroes[0].x = w.exitX;
  return [...evs, ...run(w, 30)];
}

describe('A. Recipe Scroll race on map stages', () => {
  const fetchStages = [stage('1-6'), stage('7-6'), dailyStage(20261113, 25)];

  it('the timer waits until you are in the scroll\'s map', () => {
    for (const st of fetchStages) {
      expect(st.objective?.kind, st.id).toBe('fetch');
      const w = solo(st), t0 = w.objTimer;
      const evs = run(w, 20);
      expect(w.objArmed, st.id).toBe(false);
      expect(w.objTimer, st.id).toBe(t0);
      expect(said(evs), st.id).toEqual([]);
      const evs2 = [...through(w, 0), ...run(w, 1)];
      expect(w.objArmed, st.id).toBe(true);
      expect(said(evs2).some(t => t.includes('Recipe Scroll is close')), st.id).toBe(true);
      expect(w.objTimer, st.id).toBeLessThan(t0);
    }
  });

  it('the exit of the scroll\'s map stays shut until the scroll is got (drops kept, one reminder every few seconds)', () => {
    for (const st of fetchStages) {
      const w = solo(st), maps = st.maps!;
      through(w, 0);
      expect(w.mapAt(w.hero.x), st.id).toBe(1);
      expect(w.mapAt(w.scroll!.x), st.id).toBe(1);
      give(w, 1);
      const before = { ...w.drops };
      w.hero.x = maps[1].portals[0].x; w.step(NO_INPUT);
      const evs: SimEvent[] = [];
      for (let i = 0; i < 180; i++) evs.push(...w.step(i % 6 < 3 ? UP : NO_INPUT)); // mashing up for 3 s
      expect(w.mapAt(w.hero.x), st.id).toBe(1);
      expect(w.zones2[1].done, st.id).toBe(false);
      expect(w.drops, st.id).toEqual(before);
      expect(said(evs).filter(t => t === 'Grab the Recipe Scroll first!').length, st.id).toBe(1);
      // with the scroll in hand the same exit opens
      w.hero.x = w.scroll!.x; w.hero.y = w.scroll!.y; run(w, 0.2);
      expect(w.scroll!.got, st.id).toBe(true);
      const ev2 = through(w, 1);
      expect(ev2.some(e => e.t === 'warp'), st.id).toBe(true);
      expect(w.mapAt(w.hero.x), st.id).toBe(2);
      // and the stage pays the objective's Bento at the end
      for (let mi = 2; mi < maps.length - 1; mi++) through(w, mi);
      const end = finish(w);
      expect(w.cleared, st.id).toBe(true);
      expect(said(end), st.id).toContain('Objective complete! Bonus Bento box');
      expect(w.loot.filter(b => b.tier === 3).length, st.id).toBe(1);
    }
  });

  it('SKIP TO BOSS calls the race off: no timer, no message, no fail, no bonus', () => {
    for (const st of fetchStages) {
      const w = solo(st); w.skipToBoss();
      const evs = run(w, 200);
      expect(w.failed, st.id).toBe(false);
      expect(said(evs), st.id).toEqual([]);
      expect(w.objCancelled, st.id).toBe(true);
      expect(w.objDone, st.id).toBe(true); // what the HUD (and a guest's snapshot) reads: nothing to show
      expect(w.scroll, st.id).toBe(null);
      const end = finish(w);
      expect(w.cleared, st.id).toBe(true);
      expect(said(end), st.id).toEqual([]);
      expect(w.loot.length, st.id).toBe(0);
    }
  });

  it('running out of time in the scroll\'s map still loses the stage', () => {
    const w = solo(stage('1-6'));
    through(w, 0);
    const evs = run(w, 150);
    expect(w.failed).toBe(true);
    expect(said(evs).some(t => t.includes('crumbled'))).toBe(true);
  });
});

describe('B. stage 8 hold-out on map stages', () => {
  it('the ambush waves really come, inside the map, and never more than a crowd', () => {
    for (const id of ['1-8', '4-8', '8-8']) {
      const st = stage(id), w = solo(st), maps = st.maps!;
      through(w, 0);
      w.hero.x = (st.objective as { at: number }).at + 20;
      const old = new Set(w.mobs.map(m => m.id)), seen = new Set<number>();
      let near = 0, most = 0, armed = false;
      for (let i = 0; i < 60 * 44; i++) {
        const evs = w.step(NO_INPUT);
        // (the hero stands still, so the fighting is done for it: whatever came close falls every few seconds)
        if (i % 240 === 239) for (const m of w.mobs) if (!m.roomBoss && Math.abs(m.x - w.hero.x) < 420) { m.hp = 0; m.state = 'dead'; }
        if (said(evs).some(t => t.startsWith('Ambush!'))) armed = true;
        for (const m of w.mobs) if (!old.has(m.id) && !seen.has(m.id)) { seen.add(m.id); expect(w.mapAt(m.x), id).toBe(1); if (Math.abs(m.x - w.hero.x) < 420) near++; }
        most = Math.max(most, w.mobs.filter(m => m.state !== 'dead' && m.x >= maps[1].x0 && m.x <= maps[1].x1).length);
      }
      expect(armed, id).toBe(true);
      expect(near, `${id}: ambushers beside the hero in 44 s`).toBeGreaterThanOrEqual(8);
      expect(most, `${id}: most monsters in the map at once`).toBeLessThanOrEqual(14);
      const end = run(w, 3);
      expect(said(end), id).toContain('You held out! The monsters retreat');
      expect(w.mobs.some(m => m.roomBoss && m.state !== 'dead'), id).toBe(true); // the sleeping foe is not part of it
    }
  });

  it('SKIP TO BOSS: no hold-out in the boss room, no bonus', () => {
    for (const id of ['1-8', '6-8']) {
      const st = stage(id), w = solo(st), b = st.maps!.length - 1;
      w.skipToBoss();
      let most = 0; const evs: SimEvent[] = [];
      for (let i = 0; i < 60 * 60; i++) { evs.push(...w.step(NO_INPUT)); most = Math.max(most, w.mobs.filter(m => m.state !== 'dead' && w.mapAt(m.x) === b).length); }
      expect(said(evs), id).toEqual([]);
      expect(w.holdout, id).toBe(0);
      expect(most, id).toBe(1); // just the foe
      const end = finish(w);
      expect(w.cleared, id).toBe(true);
      expect(said(end), id).toEqual([]);
      expect(w.loot.length, id).toBe(0);
    }
  });
});

describe('C. leash', () => {
  it('a teammate on any floor above player 1 (top floor, secret ledge, mid-jump above it) is left alone', () => {
    for (const humans of [1, 2]) for (const id of ['1-4', '1-7', '5-6']) {
      const st = stage(id);
      for (const [i, p] of st.platforms.entries()) {
        if (p.move) continue;
        const w = duo(st, humans), x = p.x + p.w / 2;
        const a = w.heroes[0], g = w.heroes[1];
        a.x = x; a.y = st.groundY; a.ground = true; a.on = -1;
        g.x = x + 30; g.y = p.y; g.vy = 0; g.ground = true; g.on = i;
        w.step([NO_INPUT, NO_INPUT]);
        expect(Math.round(g.y), `${id} ${humans} humans: floor y=${p.y}`).toBe(p.y);
        g.y = p.y - 150; g.ground = false; g.on = null; g.vy = 0; // the top of a jump from that floor
        w.step([NO_INPUT, NO_INPUT]);
        expect(g.y, `${id} ${humans} humans: jumping on floor y=${p.y}`).toBeLessThan(p.y - 100);
      }
    }
  });
  it('still pulls back a teammate left far behind', () => {
    const w = duo(stage('1-4'), 2);
    w.heroes[1].x = w.heroes[0].x + 600;
    w.step([NO_INPUT, NO_INPUT]);
    expect(Math.abs(w.heroes[1].x - w.heroes[0].x)).toBeLessThan(100);
  });
});

describe('D. exits in co-op', () => {
  const st = stage('1-4'), exit = st.maps![0].portals[0];
  for (const who of [0, 1]) it(`${who ? 'an online friend' : 'the host'} opens a ready exit: everyone goes through, the drops are spent once`, () => {
    const w = duo(st, 2); give(w, 0);
    const need = { ...w.drops };
    w.heroes[who].x = exit.x; w.heroes[1 - who].x = exit.x - 300; // the other one is busy a little way off
    w.step([NO_INPUT, NO_INPUT]);
    const ev = w.step(who ? [NO_INPUT, UP] : [UP, NO_INPUT]);
    expect(w.heroes.map(h => w.mapAt(h.x))).toEqual([1, 1]);
    expect(w.zones2[0].done).toBe(true);
    for (const k of Object.keys(need)) expect(w.drops[k as keyof typeof w.drops]).toBe(0);
    expect(ev.filter(e => e.t === 'warp').map(e => e.t === 'warp' ? e.hi : -1).sort()).toEqual([0, 1]);
    expect(w.npc ? w.mapAt(w.npc.x) : 1).toBe(1); // the escorted Crumblet too
    // nobody is snapped back, nothing is charged twice, and holding UP doesn't fire again
    for (let i = 0; i < 60; i++) w.step([UP, UP]);
    expect(w.heroes.map(h => w.mapAt(h.x))).toEqual([1, 1]);
    for (const k of Object.keys(need)) expect(w.drops[k as keyof typeof w.drops]).toBe(0);
  });
  it('an online friend can\'t open an exit that isn\'t ready', () => {
    const w = duo(st, 2);
    for (const h of w.heroes) h.x = exit.x;
    w.step([NO_INPUT, NO_INPUT]);
    const ev = w.step([NO_INPUT, UP]);
    expect(ev.some(e => e.t === 'needDrops')).toBe(true);
    expect(w.heroes.map(h => w.mapAt(h.x))).toEqual([0, 0]);
    expect(w.zones2[0].done).toBe(false);
  });
});

describe('E. shared rewards', () => {
  it('the objective\'s Bento goes to every player', () => {
    const w = duo(stage('1-4'), 2); // escort
    w.skipToBoss();
    finish(w);
    expect(w.cleared).toBe(true);
    expect(w.lootOf.map(l => l.length)).toEqual([1, 1]);
  });
  it('a chest drops a box for every player', () => {
    const st = stage('1-7'), w = duo(st, 2);
    const chest = w.props.find(p => p.kind === 'chest')!;
    for (const h of w.heroes) { h.x = chest.x - 30; h.y = chest.y; h.ground = true; h.on = st.platforms.findIndex(p => p.y === chest.y && chest.x >= p.x && chest.x <= p.x + p.w); h.face = 1; }
    for (let i = 0; i < 60 * 8 && w.props.some(p => p.id === chest.id && p.hp > 0); i++) w.step([{ ...NO_INPUT, attack: i % 12 === 0 }, NO_INPUT]);
    for (let i = 0; i < 180; i++) { if (i === 60) for (const h of w.heroes) h.x = chest.x + 7; w.step([NO_INPUT, NO_INPUT]); }
    expect(w.lootOf[0].length).toBeGreaterThan(0);
    expect(w.lootOf.map(l => l.length)).toEqual([w.lootOf[0].length, w.lootOf[0].length]);
  });
});
