// Overnight chaos run: every stage (filter) x every kaiju x a few seeds and start spots, random inputs, rule checks.
// npx vite-node scripts/chaos.ts [stageFilter=''] [seconds=40] [seeds=2]   → prints each broken rule once per stage/kaiju
// Runs in parallel nicely: one process per world, e.g. `for w in 1 2 3; do npx vite-node scripts/chaos.ts $w- & done`.
import { chaosRun } from '../src/sim/chaos';
import { CLASSES } from '../src/sim/classes';
import { BONUS_STAGES, STAGES } from '../src/sim/stages';
import { derive } from '../src/sim/stats';
import { heroFor } from './hero-at';

const filter = process.argv[2] ?? '', SECONDS = Number(process.argv[3] ?? 40), SEEDS = Number(process.argv[4] ?? 2);
const stages = [...STAGES, ...BONUS_STAGES].filter(s => s.id.startsWith(filter));
let runs = 0, problems = 0;
const tally: Record<string, number> = {};
for (const st of stages) for (const c of CLASSES) for (let s = 1; s <= SEEDS; s++) {
  // start somewhere along the stage (ladders, ledges and secrets are spread out), not only at the start
  const startX = Math.round(100 + ((s * 2654435761 + c.species * 40503) % 1000) / 1000 * (st.width - 300));
  const found = chaosRun(st, derive(heroFor(c.species, st.rec + 2, s)), s * 9973 + c.species, SECONDS, s === 1 ? undefined : startX);
  runs++;
  for (const v of found) { problems++; tally[v.rule] = (tally[v.rule] ?? 0) + 1; console.log(`${st.id.padEnd(5)} ${c.name.padEnd(13)} seed ${s}  ${v.rule.padEnd(18)} t=${v.t}s  ${v.detail}`); }
}
console.log(`\n${runs} runs, ${problems} problems${problems ? ': ' + Object.entries(tally).map(([k, n]) => `${k} x${n}`).join(', ') : ''}`);
