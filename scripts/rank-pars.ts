// Par time per story stage and what it is made of: npx vite-node scripts/rank-pars.ts
import { STAGES } from '../src/sim/stages';
import { challengesFor } from '../src/sim/challenges';
console.log('stage maps mobs width play par  = 60 + mobs*10 + play/70 | challenges');
for (const s of STAGES) {
  const maps = s.maps?.length ?? 1, play = s.width - 600 * (maps - 1);
  console.log(`${s.id.padEnd(5)} ${maps - 1}z+boss mobs ${String(s.mobs.length).padStart(2)} width ${s.width} play ${play} par ${s.par} = 60 + ${s.mobs.length * 10} + ${Math.round(play / 70)} | ${s.objective?.kind ?? '-'} | ${challengesFor(s.id).map(c => c.id).join(',')}`);
}
const all = STAGES.flatMap(s => challengesFor(s.id).map(c => c.id));
const cnt: Record<string, number> = {}; for (const a of all) cnt[a] = (cnt[a] ?? 0) + 1;
console.log(cnt);
for (let w = 1; w <= 10; w++) { const c: Record<string, number> = {}; for (const s of STAGES.filter(q => q.world === w)) for (const x of challengesFor(s.id)) c[x.id] = (c[x.id] ?? 0) + 1; console.log('world', w, JSON.stringify(c)); }
