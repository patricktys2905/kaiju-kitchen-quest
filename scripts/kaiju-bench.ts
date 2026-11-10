// One kaiju's benchmark for the tuner: boss clear rate and stage clear rate on a fixed spread of stages, with the
// balance bot (same build as scripts/balance.ts). npx vite-node scripts/kaiju-bench.ts <species> → one JSON line
import { AVERAGE, Bot } from '../src/sim/bot';
import { nemesisOf } from '../src/sim/mobs';
import { stageById } from '../src/sim/stages';
import { derive } from '../src/sim/stats';
import { World } from '../src/sim/world';
import { heroFor } from './hero-at';

const sp = Number(process.argv[2]);
const BOSSES = ['1-10', '2-10', '3-10', '4-10', '5-10', '6-10', '7-10', '8-10', '9-10', '10-10'], BOSS_RUNS = 10;
const STAGES = ['2-7', '3-9', '4-5', '5-3', '6-9', '7-5', '8-7', '9-3', '10-7'], STAGE_RUNS = 4;
// a run that times out means the bot got stuck (not a loss): it doesn't count either way
function play(id: string, r: number): { clear: boolean; hp: number; stuck: boolean } {
  const st = stageById(id);
  const w = new World(st, derive(heroFor(sp, st.rec, r + 1)), 100 + r, [{ id: 'jam', n: 3 }, null, null, null], 0, false, undefined, [], nemesisOf(sp), false);
  const bot = new Bot(w, AVERAGE, 7 + r);
  for (let i = 0; i < 60 * 360 && !w.cleared && !w.failed; i++) w.step(bot.think());
  return { clear: w.cleared, hp: w.cleared ? w.hero.hp / w.hero.d.maxHp : 0, stuck: !w.cleared && !w.failed };
}
let b = 0, bn = 0, s = 0, sn = 0, hp = 0;
for (const id of BOSSES) for (let r = 0; r < BOSS_RUNS; r++) { const o = play(id, r); if (o.stuck) continue; bn++; b += o.clear ? 1 : 0; }
for (const id of STAGES) for (let r = 0; r < STAGE_RUNS; r++) { const o = play(id, r); if (o.stuck) continue; sn++; s += o.clear ? 1 : 0; hp += o.hp; }
console.log(JSON.stringify({ sp, boss: b / Math.max(1, bn), stage: s / Math.max(1, sn), hp: s ? hp / s : 0, stuck: BOSSES.length * BOSS_RUNS + STAGES.length * STAGE_RUNS - bn - sn }));
