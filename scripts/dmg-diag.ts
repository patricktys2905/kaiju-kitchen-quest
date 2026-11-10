// What hurts the bot most on a stage: npx vite-node scripts/dmg-diag.ts <stage> <species> (share of max HP lost, by source)
import { AVERAGE, Bot } from '../src/sim/bot';
import { MOBS, nemesisOf } from '../src/sim/mobs';
import { stageById } from '../src/sim/stages';
import { derive } from '../src/sim/stats';
import { World } from '../src/sim/world';
import { heroFor } from './hero-at';
const id = process.argv[2] ?? '5-6', sp = Number(process.argv[3] ?? 11);
const st = stageById(id); const tally: Record<string, number> = {};
for (let r = 0; r < 12; r++) {
  const w = new World(st, derive(heroFor(sp, st.rec, r + 1)), 100 + r, [{ id: 'jam', n: 3 }, null, null, null], 0, false, undefined, [], nemesisOf(sp), false);
  const bot = new Bot(w, AVERAGE, 7 + r);
  for (let i = 0; i < 60 * 200 && !w.cleared && !w.failed; i++) {
    const hp = w.hero.hp; w.step(bot.think()); const lost = hp - w.hero.hp;
    if (lost > 0) {
      const shot = w.shots.find(s => s.from === 'mob' && Math.abs(s.x - w.hero.x) < 60);
      const near = w.mobs.filter(m => m.state === 'attack' || m.state === 'windup').sort((a, b) => Math.abs(a.x - w.hero.x) - Math.abs(b.x - w.hero.x))[0];
      const k = shot ? 'shot:' + (shot.kind ?? '?') : near ? MOBS[near.kind].name + ':' + near.move : w.hazards.some(z => z.state === 'on' && Math.abs(z.x - w.hero.x) < 50) ? 'hazard' : 'other';
      tally[k] = (tally[k] ?? 0) + lost / w.hero.d.maxHp;
    }
  }
}
console.log(Object.entries(tally).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v.toFixed(2)}`).join('\n'));
