// Where does a kaiju's healing come from on a stage? npx vite-node scripts/heal-probe.ts <stage> <species>
import { AVERAGE, Bot } from '../src/sim/bot';
import { nemesisOf } from '../src/sim/mobs';
import { stageById } from '../src/sim/stages';
import { derive } from '../src/sim/stats';
import { World } from '../src/sim/world';
import { heroFor } from './hero-at';
const st = stageById(process.argv[2]), sp = Number(process.argv[3]);
const got: Record<string, number> = {}; let lost = 0, time = 0;
for (let r = 0; r < 6; r++) {
  const w = new World(st, derive(heroFor(sp, st.rec, r + 1)), 100 + r, [{ id: 'jam', n: 3 }, null, null, null], 0, false, undefined, [], nemesisOf(sp), false);
  const bot = new Bot(w, AVERAGE, 7 + r); let i = 0;
  for (; i < 60 * 360 && !w.cleared && !w.failed; i++) {
    const hp = w.hero.hp, inp = bot.think(); const evs = w.step(inp); const d = w.hero.hp - hp;
    if (d < 0) lost -= d / w.hero.d.maxHp;
    if (d > 0) { const k = evs.some(e => e.t === 'use') ? 'potion' : w.hero.state === 'skill' && w.hero.skill ? 'skill:' + w.hero.skill.id : d < w.hero.d.maxHp * 0.02 ? 'small(regen/leech)' : 'other'; got[k] = (got[k] ?? 0) + d / w.hero.d.maxHp; }
  }
  time += i / 60;
}
console.log('per minute: lost', (lost / time * 60).toFixed(2), 'healed', Object.entries(got).map(([k, v]) => `${k} ${(v / time * 60).toFixed(2)}`).join(', '));
