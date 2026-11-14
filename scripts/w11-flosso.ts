// The Great Flosso, move by move: every kaiju duels him in his room (skilled bot, 8 jams) and the damage the kaiju takes is
// booked to what dealt it (his move at that moment, a Floss Wisp, the Caramel Drip, anything else), in % of max HP per
// fight. Also: how often each wheel symbol came up, how many of those casts hurt, and the seconds spent in each phase.
// npx vite-node scripts/w11-flosso.ts [seeds = 2] [stage = 11-10]
import { Bot, SKILLED } from '../src/sim/bot';
import { CLASSES } from '../src/sim/classes';
import { MOBS, nemesisOf, wheelPick } from '../src/sim/mobs';
import { STAGES } from '../src/sim/stages';
import { derive } from '../src/sim/stats';
import { World } from '../src/sim/world';
import { heroFor } from './hero-at';
const SEEDS = Number(process.argv[2] ?? 2), st = STAGES.find(s => s.id === (process.argv[3] ?? '11-10'))!;
const by: Record<string, number> = {}, casts: Record<string, number> = {}, hurtCasts: Record<string, number> = {}, phaseT = [0, 0, 0, 0];
let fights = 0, wins = 0;
for (const c of CLASSES) for (let seed = 1; seed <= SEEDS; seed++) {
  const w = new World(st, derive(heroFor(c.species, st.rec, seed)), 100 + seed, [{ id: 'jam', n: 8 }, null, null, null], 0, false, undefined, [], nemesisOf(c.species));
  w.skipToBoss();
  const bot = new Bot(w, SKILLED, 7 + seed), f = w.mobs[0];
  let lastMove = '', cur = '', curHurt = false, lastT = -9;
  fights++;
  for (let i = 0; i < 60 * 300 && !w.cleared && !w.failed && f.state !== 'dead'; i++) {
    const hp = w.hero.hp;
    w.step(bot.think());
    if (!f.wake) phaseT[f.bossPhase] += 1 / 60;
    if (f.move && f.move !== lastMove) { if (cur && curHurt) hurtCasts[cur] = (hurtCasts[cur] ?? 0) + 1; cur = f.move; curHurt = false; casts[cur] = (casts[cur] ?? 0) + 1; }
    if (f.move) lastT = w.time;
    lastMove = f.move;
    if (w.hero.hp < hp) {
      const lost = (hp - w.hero.hp) / w.hero.d.maxHp * 100;
      const haz = w.hazards.some(z => z.state === 'on' && Math.abs(z.x - w.hero.x) < z.w / 2 + 10);
      const wisp = w.mobs.find(m => m !== f && m.state === 'attack' && Math.abs(m.x - w.hero.x) < 80);
      // his shots land after the move ends: book them to the last move for a second and a half
      const k = wisp ? `(${MOBS[wisp.kind].name})` : haz ? '(Caramel Drip)' : f.move || (w.time - lastT < 1.5 ? cur : '(other)');
      by[k] = (by[k] ?? 0) + lost;
      if (k === cur) curHurt = true;
    }
  }
  if (f.state === 'dead') wins++;
}
console.log(`${MOBS[st.mobs[0].kind].name}: ${wins}/${fights} duels won; seconds per fight in phase 1 / 2 / 3: ${phaseT.slice(1).map(t => (t / fights).toFixed(0)).join(' / ')}`);
console.log('damage taken per fight, % of max HP, by source:');
for (const [k, v] of Object.entries(by).sort((a, b) => b[1] - a[1])) console.log(`  ${k.padEnd(16)} ${(v / fights).toFixed(0).padStart(4)}%${casts[k] ? `   casts/fight ${(casts[k] / fights).toFixed(1)}, casts that hurt ${Math.round((hurtCasts[k] ?? 0) / casts[k] * 100)}%${wheelPick(k) ? '  <- wheel' : ''}` : ''}`);
