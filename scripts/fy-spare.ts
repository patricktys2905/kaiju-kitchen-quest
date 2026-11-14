// Which stages give tests/garnish.test.ts a taped run that meets a never-wanted monster? npx vite-node scripts/fy-spare.ts
import { Bot, SKILLED } from '../src/sim/bot';
import { cookbook, stageWants } from '../src/sim/cookbook';
import { STAGES } from '../src/sim/stages';
import { derive, newProfile } from '../src/sim/stats';
import { World } from '../src/sim/world';
const book = cookbook();
for (const s of STAGES) {
  if (process.argv[2] && !s.id.endsWith(process.argv[2])) continue;
  const wants = stageWants(s);
  const kind = [...new Set((s.maps ?? []).flatMap(m => m.spawns?.kinds ?? []))].find(k => book.spare.has(k) && !wants[k]);
  if (!kind) continue;
  const p = newProfile(0); p.level = s.rec + 6;
  const w = new World(s, derive(p), 7); w.hero.inv = 1e9; w.hero.d.atk *= 3;
  const bot = new Bot(w, SKILLED, 5); const killed: Record<string, number> = {};
  for (let i = 0; i < 60 * 150; i++) { for (const e of w.step({ ...bot.think() })) if (e.t === 'mobDie') killed[e.kind] = (killed[e.kind] ?? 0) + 1; }
  console.log(s.id, kind, 'killed', killed[kind] ?? 0, 'kills', w.run.kills);
}
