// Every kaiju straight into a stage's boss room (skilled bot); logs the foe's HP every 15 s: npx vite-node scripts/room-duel.ts <stage> [kaiju=6]
import { Bot, SKILLED } from '../src/sim/bot';
import { CLASSES } from '../src/sim/classes';
import { nemesisOf } from '../src/sim/mobs';
import { STAGES } from '../src/sim/stages';
import { derive } from '../src/sim/stats';
import { World } from '../src/sim/world';
import { heroFor } from './hero-at';
const st = STAGES.find(s => s.id === process.argv[2])!;
for (const c of CLASSES.slice(0, +(process.argv[3] ?? 6))) {
  const w = new World(st, derive(heroFor(c.species, st.rec, 1)), 100, [{ id: 'jam', n: 8 }, null, null, null], 0, false, undefined, [], nemesisOf(c.species));
  w.skipToBoss();
  const bot = new Bot(w, SKILLED, 7), f = w.mobs[0];
  const log: string[] = [];
  let i = 0;
  for (; i < 60 * 300 && !w.cleared && !w.failed && f.state !== 'dead'; i++) {
    w.step(bot.think());
    if (i % 900 === 0) log.push(`${Math.round(i / 60)}s foe ${f.hp}/${f.maxHp} ${f.state}${f.move ? ':' + f.move : ''} @${Math.round(f.x)},${Math.round(f.y)} hero @${Math.round(w.hero.x)},${Math.round(w.hero.y)} ${w.hero.state}`);
  }
  console.log(c.name, f.kind, f.state === 'dead' ? `KILLED ${Math.round(i / 60)}s` : w.failed ? 'DIED' : 'TIMEOUT', '\n  ' + log.join('\n  '));
}
