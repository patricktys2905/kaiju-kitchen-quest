// Why does the bot fail a stage? Runs every kaiju once (skilled bot) and prints where and how each failed run ended.
// npx vite-node scripts/fail-why.ts <stageId> [average|skilled]
import { AVERAGE, Bot, SKILLED } from '../src/sim/bot';
import { CLASSES } from '../src/sim/classes';
import { MOBS, nemesisOf } from '../src/sim/mobs';
import { STAGES } from '../src/sim/stages';
import { derive } from '../src/sim/stats';
import { World } from '../src/sim/world';
import { heroFor } from './hero-at';
const st = STAGES.find(s => s.id === process.argv[2])!, opts = process.argv[3] === 'average' ? AVERAGE : SKILLED;
const sum: Record<string, number> = {};
for (const c of CLASSES) {
  const w = new World(st, derive(heroFor(c.species, st.rec, 1)), 100, [{ id: 'jam', n: 8 }, null, null, null], 0, false, undefined, [], nemesisOf(c.species));
  const bot = new Bot(w, opts, 7);
  let last = '', why = '';
  for (let i = 0; i < 60 * 900 && !w.cleared && !w.failed; i++) {
    const hp = w.hero.hp;
    for (const e of w.step(bot.think())) if (e.t === 'objFail') why = e.why;
    if (w.hero.hp < hp) { const near = w.mobs.filter(m => m.state !== 'dead' && Math.abs(m.x - w.hero.x) < 260).map(m => MOBS[m.kind].brain + ':' + m.kind); last = `${Math.round(hp - w.hero.hp)} dmg near [${near.slice(0, 4).join(',')}]${w.chase?.on ? ' CHASE' : ''}${w.hazards.some(z => z.state === 'on' && Math.abs(z.x - w.hero.x) < z.w) ? ' HAZARD' : ''}`; }
  }
  const res = w.cleared ? 'clear' : w.failed ? 'FAIL' : 'timeout';
  const arena = w.arenas.findIndex(a => a.locked);
  const k = w.cleared ? 'clear' : why ? 'objective' : w.chase?.on ? 'chase' : arena >= 0 ? 'arena' : w.boss ? 'boss' : 'roaming';
  sum[k] = (sum[k] ?? 0) + 1;
  if (!w.cleared) console.log(`${c.name.padEnd(12)} ${res} t=${Math.round(w.time)}s x=${Math.round(w.hero.x)}/${st.width} jams left ${w.hero.bag[0]?.n ?? 0} ${why || ''} ${arena >= 0 ? 'IN ARENA ' + arena : ''} last: ${last}`);
}
console.log(st.id, JSON.stringify(sum));
