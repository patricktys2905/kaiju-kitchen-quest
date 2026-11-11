// XP balance: for each story stage, the XP from killing everything (stage monsters + arena waves) against the XP needed
// to go from this stage's recommended level to the next one's. ratio > 1 = you out-level the story playing it once.
// npx vite-node scripts/xp-curve.ts
import { mobXp } from '../src/sim/mobs';
import { STAGES } from '../src/sim/stages';
import { xpFor } from '../src/sim/stats';

const KILL = 0.9; // a player leaves a few stragglers behind
let cum = 0, need = 0;
const rows: string[] = [];
for (let i = 0; i < STAGES.length; i++) {
  const st = STAGES[i], next = STAGES[i + 1];
  const spawns = [...st.mobs, ...(st.arenas ?? []).flatMap(a => a.waves.flat())];
  const g = KILL * spawns.reduce((a, m) => a + mobXp(m.kind, m.lv), 0);
  let n = 0; if (next) for (let L = st.rec; L < next.rec; L++) n += xpFor(L);
  cum += g; need += n;
  if (st.num.endsWith('1') || st.num.endsWith('5') || st.num.endsWith('10') || st.id.endsWith('-10')) rows.push(`${st.id.padEnd(6)} rec ${String(st.rec).padStart(3)}  xp ${Math.round(g).toString().padStart(7)}  need ${String(n).padStart(7)}  ratio ${(g / Math.max(1, n)).toFixed(2)}  cum ratio ${(cum / Math.max(1, need)).toFixed(2)}`);
}
console.log(rows.join('\n'));
