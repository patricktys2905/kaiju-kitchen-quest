// Bluebeary's Berry Mines (and other lobbed skills) thrown from the floor must not get caught on a ledge above the monsters.
import { describe, expect, it } from 'vitest';
import { STAGES } from '../src/sim/stages';
import { derive, newProfile } from '../src/sim/stats';
import { NO_INPUT } from '../src/sim/types';
import { World } from '../src/sim/world';

describe('lobbed skills and ledges', () => {
  it('berries thrown from the floor land on the floor under a ledge (stage 1-1), not on the ledge', () => {
    const st = STAGES.find(s => s.id === '1-1')!;
    const p = newProfile(10); p.level = 8; p.skills.mines = 1;
    const w = new World({ ...st, mobs: [], arenas: [], hazards: [], chase: undefined, props: [], cookers: [], objective: undefined }, derive(p), 1);
    const ledge = st.platforms[0]; // the first ledge of 1-1
    w.hero.x = ledge.x - 120; w.hero.face = 1; // on the floor, just left of the ledge
    w.step({ ...NO_INPUT, skill2: true }); // Berry Mines
    for (let i = 0; i < 90; i++) w.step(NO_INPUT);
    expect(w.mines.length).toBeGreaterThan(0);
    for (const m of w.mines) expect(m.y, `berry at x ${Math.round(m.x)}`).toBe(st.groundY);
  });
  it('thrown from up on a ledge, they still land on that ledge', () => {
    const st = STAGES.find(s => s.id === '1-1')!;
    const p = newProfile(10); p.level = 8; p.skills.mines = 1;
    const w = new World({ ...st, mobs: [], arenas: [], hazards: [], chase: undefined, props: [], cookers: [], objective: undefined }, derive(p), 1);
    const top = st.platforms.find(q => q.w >= 280 && q.y < 380) ?? st.platforms[1];
    w.hero.x = top.x + 20; w.hero.y = top.y; w.hero.ground = true; w.hero.on = st.platforms.indexOf(top); w.hero.face = 1;
    w.step({ ...NO_INPUT, skill2: true });
    for (let i = 0; i < 90; i++) w.step(NO_INPUT);
    expect(w.mines.some(m => m.y === top.y)).toBe(true);
  });
});
