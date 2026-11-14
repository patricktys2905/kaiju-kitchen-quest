// Boss-room duels in bulk (the scripts/room-duel.ts fight, summarised): every kaiju at the stage's recommended level goes
// straight into the boss room with 8 jams (skilled bot, a few seeds). One line per stage: wins, how long, jams drunk.
// npx vite-node scripts/w11-duels.ts [stage ids or prefixes, comma list = 11-] [seeds = 2] [jams = 8]
//   e.g. npx vite-node scripts/w11-duels.ts 11-          every World 11 room, the world boss included
//        npx vite-node scripts/w11-duels.ts 10-,11- 3    World 10 next to World 11
import { Bot, SKILLED } from '../src/sim/bot';
import { CLASSES } from '../src/sim/classes';
import { MOBS, nemesisOf } from '../src/sim/mobs';
import { STAGES } from '../src/sim/stages';
import { derive } from '../src/sim/stats';
import { World } from '../src/sim/world';
import { heroFor } from './hero-at';

const want = (process.argv[2] ?? '11-').split(','), SEEDS = Number(process.argv[3] ?? 2), JAMS = Number(process.argv[4] ?? 8);
for (const st of STAGES.filter(s => want.some(q => q.endsWith('-') ? s.id.startsWith(q) : s.id === q))) {
  let win = 0, n = 0, t = 0, jams = 0, timeouts = 0;
  const low: string[] = [];
  let foe = '';
  for (const c of CLASSES) {
    let k = 0;
    for (let seed = 1; seed <= SEEDS; seed++) {
      const w = new World(st, derive(heroFor(c.species, st.rec, seed)), 100 + seed, [{ id: 'jam', n: JAMS }, null, null, null], 0, false, undefined, [], nemesisOf(c.species));
      w.skipToBoss();
      const bot = new Bot(w, SKILLED, 7 + seed), f = w.mobs[0];
      foe = MOBS[f.kind].name;
      let i = 0;
      for (; i < 60 * 300 && !w.cleared && !w.failed && f.state !== 'dead'; i++) w.step(bot.think());
      n++; jams += JAMS - (w.hero.bag[0]?.n ?? 0);
      if (f.state === 'dead') { win++; k++; t += i / 60; } else if (!w.failed) timeouts++;
    }
    if (k < SEEDS) low.push(`${c.name} ${k}/${SEEDS}`);
  }
  console.log(`${st.id.padEnd(6)} ${foe.padEnd(28)} win ${String(Math.round(win / n * 100)).padStart(3)}%  kill ${win ? Math.round(t / win) : '-'}s  jams ${(jams / n).toFixed(1)}  timeouts ${timeouts}${low.length ? '  | ' + low.join(', ') : ''}`);
}
