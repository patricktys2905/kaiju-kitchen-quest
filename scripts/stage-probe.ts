// Stage layout + where a kaiju's bot gets stuck: npx vite-node scripts/stage-probe.ts <stage> <species> [runs]
import { stageById } from '../src/sim/stages';
import { World } from '../src/sim/world';
import { AVERAGE, Bot } from '../src/sim/bot';
import { derive } from '../src/sim/stats';
import { nemesisOf } from '../src/sim/mobs';
import { heroFor } from './hero-at';
const [id, sp, runs] = [process.argv[2], Number(process.argv[3]), Number(process.argv[4] ?? 3)];
const s = stageById(id);
console.log('plats', s.platforms.map(p => `${Math.round(p.x)}-${Math.round(p.x + p.w)}@${p.y}${p.secret ? 's' : ''}${p.move ? 'm' : ''}`).join(' '));
console.log('ladders', s.ladders.map(l => `${l.x}:${l.top}-${l.bottom}`).join(' '), '| haz', (s.hazards ?? []).map(h => `${h.kind}@${h.x}`).join(' '), '| arenas', (s.arenas ?? []).map(a => `${a.x0}-${a.x1}`).join(' '));
console.log('mobs', s.mobs.map(m => `${m.kind}@${m.x},${m.y ?? 'g'}`).join(' '));
for (let r = 0; r < runs; r++) {
  const w = new World(s, derive(heroFor(sp, s.rec, r + 1)), 100 + r, [{ id: 'jam', n: 3 }, null, null, null], 0, false, undefined, [], nemesisOf(sp), false);
  const bot = new Bot(w, AVERAGE, 7 + r); let i = 0;
  for (; i < 60 * 360 && !w.cleared && !w.failed; i++) w.step(bot.think());
  console.log(w.cleared ? 'CLEAR' : w.failed ? 'FAIL' : 'TIMEOUT', Math.round(i / 60) + 's', 'hero', Math.round(w.hero.x), Math.round(w.hero.y), w.hero.state, '| left', w.mobs.filter(m => m.state !== 'dead').map(m => `${m.kind}@${Math.round(m.x)},${Math.round(m.y)}${m.under ? 'U' : ''}${m.disguised ? 'D' : ''}`).join(' '));
}
