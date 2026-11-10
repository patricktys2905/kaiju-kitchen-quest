// The bouncy sponge under a secret ledge: it must get you UP to the chest, and never trap you up there.
import { describe, expect, it } from 'vitest';
import { CLASSES } from '../src/sim/classes';
import { BONUS_STAGES, STAGES } from '../src/sim/stages';
import { derive, newProfile } from '../src/sim/stats';
import { NO_INPUT, type Input } from '../src/sim/types';
import { World } from '../src/sim/world';

const ALL = [...STAGES, ...BONUS_STAGES];
const withSponge = ALL.filter(s => s.props?.some(p => p.kind === 'sponge'));
const make = (id: string, sp: number) => {
  const st = ALL.find(s => s.id === id)!;
  return new World({ ...st, mobs: [], arenas: [], hazards: [], chase: undefined, cookers: [], objective: undefined }, derive(newProfile(sp)), 1);
};
const run = (w: World, inp: Partial<Input>, frames: number) => { for (let i = 0; i < frames; i++) w.step({ ...NO_INPUT, ...inp }); };

describe('sponge and secret ledge', () => {
  it('there are sponge stages to check', () => expect(withSponge.length).toBeGreaterThan(5));

  it('jumping onto the sponge from the floor bounces you up onto the ledge', () => {
    for (const st of withSponge) for (const c of CLASSES) {
      const w = make(st.id, c.species), sp = st.props!.find(p => p.kind === 'sponge')!, ledge = st.platforms.find(p => p.secret)!;
      w.hero.x = sp.x - 20; w.hero.y = st.groundY;
      let up = false;
      for (let i = 0; i < 240 && !up; i++) { w.step({ ...NO_INPUT, jump: i < 3, right: i < 8 }); up = w.hero.ground && Math.abs(w.hero.y - ledge.y) < 2; }
      expect(up, `${st.id} ${c.name} never reached the ledge`).toBe(true);
    }
  });

  it('leaving the ledge (drop through anywhere, or ease off either edge) gets you down and keeps you down', () => {
    // Bluebeary: the slowest, lowest jumper (the one that got stuck on 1-4); Gobzilla: an average one
    for (const st of withSponge) for (const sp of [10, 0]) {
      const ledge = st.platforms.find(p => p.secret)!, li = st.platforms.indexOf(ledge);
      const tries: [string, number, (w: World) => void][] = [];
      for (let x = ledge.x + 4; x <= ledge.x + ledge.w - 4; x += 12) tries.push([`drop at ${x}`, x, w => run(w, { down: true, jump: true }, 3)]);
      tries.push(['ease off left', ledge.x + 10, w => { for (let i = 0; i < 40; i++) w.step({ ...NO_INPUT, left: i % 3 === 0 }); }]);
      tries.push(['ease off right', ledge.x + ledge.w - 10, w => { for (let i = 0; i < 40; i++) w.step({ ...NO_INPUT, right: i % 3 === 0 }); }]);
      for (const [how, x, act] of tries) {
        const w = make(st.id, sp), h = w.hero;
        h.x = x; h.y = ledge.y; h.ground = true; h.on = li;
        run(w, {}, 5); act(w); run(w, {}, 240);
        expect(h.ground && h.on === li, `${st.id} species ${sp} ${how}: bounced back up onto the ledge`).toBe(false);
      }
    }
  });
});
