// Progression check: one kaiju plays every stage once, in order, from Lv 1 (the bot, with the build heroFor gives at its
// current level), keeping all the XP it earns. Prints the level it has on reaching each world vs the recommended level,
// the skill points it has had, and how long each stage took.
// npx vite-node scripts/progress-sim.ts [species=10] [worlds=10]
import { Bot, SKILLED } from '../src/sim/bot';
import { nemesisOf } from '../src/sim/mobs';
import { STAGES } from '../src/sim/stages';
import { derive, gainXp, newProfile } from '../src/sim/stats';
import { World } from '../src/sim/world';
import { heroFor } from './hero-at';

const sp = Number(process.argv[2] ?? 10), worlds = Number(process.argv[3] ?? 10);
const me = newProfile(sp);
let t = 0, fails = 0;
for (const st of STAGES.filter(s => Number(s.id.split('-')[0]) <= worlds)) {
  let cleared = false;
  for (let attempt = 0; attempt < 4 && !cleared; attempt++) {
    const w = new World(st, derive(heroFor(sp, me.level, attempt + 1)), 100 + attempt, [{ id: 'jam', n: 8 }, null, null, null], 0, false, undefined, [], nemesisOf(sp));
    const bot = new Bot(w, SKILLED, 7 + attempt);
    for (let i = 0; i < 60 * 60 * 15 && !w.cleared && !w.failed; i++) for (const e of w.step(bot.think())) if (e.t === 'xp') gainXp(me, e.n);
    t += w.run.time; cleared = w.cleared; if (!cleared) fails++;
    if (st.id.endsWith('-1') || st.id.endsWith('-5') || st.id.endsWith('-10')) if (attempt === 0) console.log(`${st.id.padEnd(5)} rec ${String(st.rec).padStart(3)}  hero Lv ${String(me.level).padStart(3)}  skill pts so far ${me.level - 1}  stage ${Math.round(w.run.time)}s  ${cleared ? '' : 'FAILED'}`);
  }
}
console.log(`total play ${Math.round(t / 60)} min, ${fails} failed attempts, final Lv ${me.level}`);
