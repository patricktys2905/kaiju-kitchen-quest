// Throwaway (design research for docs/DROPS-USES.md): how many monster drops a skilled-bot clear picks up, how many the
// exits eat and what is left over. npx vite-node scripts/drops-probe.ts [mode] [stages...]
//   mode "static": no sim, just what the stage data says (who has a drop, what the exits want across the story)
//   otherwise: runs each stage RUNS times (env RUNS, default 3) from an empty bag
import { Bot, SKILLED } from '../src/sim/bot';
import { DROPS } from '../src/sim/drops';
import { MOBS, nemesisOf } from '../src/sim/mobs';
import { STAGES } from '../src/sim/stages';
import { derive } from '../src/sim/stats';
import { World } from '../src/sim/world';
import { heroFor } from './hero-at';

const args = process.argv.slice(2);
if (args[0] === 'static') {
  const kinds = Object.keys(MOBS);
  const no = kinds.filter(k => !(DROPS as Record<string, unknown>)[k]);
  const byBrain: Record<string, string[]> = {};
  for (const k of no) (byBrain[(MOBS as any)[k].brain] ??= []).push(k);
  console.log('mob kinds', kinds.length, 'with a drop', kinds.length - no.length, 'without', no.length);
  for (const [b, l] of Object.entries(byBrain)) console.log('  no drop, brain', b, l.length, l.join(' '));
  console.log('drops whose kind is not a MOB:', Object.keys(DROPS).filter(k => !(MOBS as any)[k]).join(' ') || 'none');
  // demand: what all story exits want, by kind
  const want: Record<string, number> = {}, stagesOf: Record<string, number> = {}; let total = 0, maps = 0, perStage: number[] = [];
  const story = STAGES.filter(s => /^\d+-\d+$/.test(s.id));
  for (const s of story) { let t = 0; const seen = new Set<string>(); for (const m of s.maps ?? []) if (m.goal?.kind === 'collect') { maps++; for (const q of m.goal.wants) { want[q.mob] = (want[q.mob] ?? 0) + q.n; t += q.n; seen.add(q.mob); } } for (const k of seen) stagesOf[k] = (stagesOf[k] ?? 0) + 1; total += t; perStage.push(t); }
  console.log('story stages', story.length, 'collect maps', maps, 'drops wanted in all', total, 'per stage min/avg/max', Math.min(...perStage), (total / story.length).toFixed(1), Math.max(...perStage));
  const never = Object.keys(DROPS).filter(k => !want[k]);
  console.log('kinds with a drop that no story exit wants:', never.join(' ') || 'none');
  const sorted = Object.entries(want).sort((a, b) => b[1] - a[1]);
  console.log('most wanted:', sorted.slice(0, 8).map(([k, n]) => `${k} ${n} (${stagesOf[k]} stages)`).join(', '));
  console.log('least wanted:', sorted.slice(-8).map(([k, n]) => `${k} ${n} (${stagesOf[k]} stages)`).join(', '));
  // spawn kinds per stage that are not wanted by that stage (their drops are pure surplus there)
  let extraKinds = 0; for (const s of story) { const w = new Set<string>(), sp = new Set<string>(); for (const m of s.maps ?? []) { if (m.goal?.kind === 'collect') for (const q of m.goal.wants) w.add(q.mob); for (const k of m.spawns?.kinds ?? []) sp.add(k); } extraKinds += [...sp].filter(k => !w.has(k)).length; }
  console.log('avg spawn kinds per stage that the stage never asks for', (extraKinds / story.length).toFixed(1));
} else {
  const RUNS = Number(process.env.RUNS ?? 3);
  const ids = args.length ? args : ['1-2', '2-6', '4-4', '6-7', '8-8', '10-3'];
  for (const id of ids) {
    const st = STAGES.find(s => s.id === id)!;
    const need: Record<string, number> = {}; for (const m of st.maps ?? []) if (m.goal?.kind === 'collect') for (const q of m.goal.wants) need[q.mob] = (need[q.mob] ?? 0) + q.n;
    const eaten = Object.values(need).reduce((a, b) => a + b, 0);
    const rows: string[] = []; let sumPick = 0, sumLeft = 0, sumKills = 0, sumT = 0, clears = 0, sumLeftKinds = 0, sumWantedLeft = 0;
    for (let r = 0; r < RUNS; r++) {
      const sp = [0, 10, 11, 4][r % 4];
      const w = new World(st, derive(heroFor(sp, st.rec, 1 + r)), 3 + r, [{ id: 'jam', n: 8 }, null, null, null], 0, false, undefined, [], nemesisOf(sp));
      const bot = new Bot(w, SKILLED, 5 + r);
      for (let i = 0; i < 60 * 900 && !w.cleared && !w.failed; i++) w.step(bot.think());
      const pick = Object.values(w.runDrops).reduce((a, b) => a + (b ?? 0), 0);
      const left = Object.entries(w.drops).filter(([, n]) => (n ?? 0) > 0) as [string, number][];
      const leftN = left.reduce((a, [, n]) => a + n, 0);
      const wantedLeft = left.filter(([k]) => need[k]).reduce((a, [, n]) => a + n, 0);
      if (w.cleared) { clears++; sumPick += pick; sumLeft += leftN; sumKills += w.run.kills; sumT += w.time; sumLeftKinds += left.length; sumWantedLeft += wantedLeft; }
      rows.push(`   run${r} sp${sp} ${w.cleared ? 'clear' : 'FAIL'} ${Math.round(w.time)}s kills ${w.run.kills} picked ${pick} left ${leftN} [${left.map(([k, n]) => `${k}${need[k] ? '*' : ''}:${n}`).join(' ')}]`);
    }
    const c = Math.max(1, clears);
    console.log(`${id} maps ${(st.maps?.length ?? 1) - 1} exits eat ${eaten} (${Object.entries(need).map(([k, n]) => `${k}:${n}`).join(' ')}) | clears ${clears}/${RUNS} avg: ${Math.round(sumT / c)}s kills ${(sumKills / c).toFixed(0)} picked ${(sumPick / c).toFixed(1)} left ${(sumLeft / c).toFixed(1)} over ${(sumLeftKinds / c).toFixed(1)} kinds (of wanted kinds: ${(sumWantedLeft / c).toFixed(1)})`);
    for (const row of rows) console.log(row);
  }
}
