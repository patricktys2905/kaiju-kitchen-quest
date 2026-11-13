// Rank probe: what rank does the SKILLED bot get, and which rank input decides it?
// Same hero builds as scripts/balance.ts (heroFor at the stage's recommended level), 8 jams by default.
// Usage: npx vite-node scripts/rank-probe.ts <stages> <kaiju> <runs> [mode] [outfile] [jams]
//   stages: comma list of ids or prefixes ("1-" = world 1, "1-5,4-10"); kaiju: comma list of species or "all"
//   mode: normal | skip (SKIP TO BOSS) | stocked (the bag already holds every drop: walk through the exits)
// Appends CSV rows to shots/rank/<outfile>.csv (delete the file first for a clean sample). Summarise a sample with
//   npx vite-node scripts/rank-rescore.ts <outfile prefix>     (rescoring uses the raw columns, so old CSVs stay valid)
// Re-check after a balance change (16 stages x 20 kaiju x 2 seeds, about 640 runs; run the four in parallel):
//   rm -f shots/rank/fresh-*.csv; for w in 1 4 7 10; do npx vite-node scripts/rank-probe.ts $w-1,$w-5,$w-8,$w-10 all 2 normal fresh-w$w > shots/rank/fresh-w$w.log & done; wait
//   npx vite-node scripts/rank-rescore.ts fresh
import { appendFileSync, existsSync, mkdirSync } from 'node:fs';
import { Bot, SKILLED } from '../src/sim/bot';
import { CLASSES } from '../src/sim/classes';
import { nemesisOf } from '../src/sim/mobs';
import { STAGES } from '../src/sim/stages';
import { derive } from '../src/sim/stats';
import { World, rankParts } from '../src/sim/world';
import { heroFor } from './hero-at';

const stageArg = (process.argv[2] ?? '1-1').split(',');
const kaijuArg = process.argv[3] ?? 'all';
const RUNS = Number(process.argv[4] ?? 2);
const MODE = process.argv[5] ?? 'normal';
const OUT = `shots/rank/${process.argv[6] ?? 'probe'}.csv`;
const JAMS = Number(process.argv[7] ?? 8);
const SEED0 = Number(process.env.SEED0 ?? 0);

mkdirSync('shots/rank', { recursive: true });
const COLS = ['stage', 'world', 'n', 'species', 'name', 'run', 'mode', 'jams', 'cleared', 'end', 'rank', 'score', 'time', 'par', 'tZone', 'tBoss', 'hits', 'perMin', 'heals', 'maxCombo', 'styleAvg', 'perfects', 'interrupts',
  'timeScore', 'hitScore', 'comboPart', 'stylePart', 'kills', 'questDrops', 'bossHits', 'hpLeft', 'dmgFrac'];
if (!existsSync(OUT)) appendFileSync(OUT, COLS.join(',') + '\n');

const stages = STAGES.filter(s => stageArg.some(a => (a.endsWith('-') ? s.id.startsWith(a) : s.id === a)));
const classes = CLASSES.filter(c => kaijuArg === 'all' || kaijuArg.split(',').includes(String(c.species)));
const f1 = (v: number) => v.toFixed(1);

for (const st of stages) {
  const [wn, n] = st.id.split('-').map(Number);
  for (const c of classes) {
    for (let r = 0; r < RUNS; r++) {
      const rr = r + SEED0;
      const p = heroFor(c.species, st.rec, rr + 1);
      const w = new World(st, derive(p), 100 + rr, [{ id: 'jam', n: JAMS }, null, null, null], 0, false, undefined, [], nemesisOf(c.species), false);
      if (st.maps && MODE !== 'normal') {
        for (const m of st.maps) if (m.goal?.kind === 'collect') for (const q of m.goal.wants) w.drops[q.mob] = (w.drops[q.mob] ?? 0) + q.n;
        if (MODE === 'skip') { for (const m of st.maps) if (m.goal?.kind === 'collect') for (const q of m.goal.wants) w.drops[q.mob] = Math.max(0, (w.drops[q.mob] ?? 0) - q.n); w.skipToBoss(); }
      }
      const bot = new Bot(w, SKILLED, 7 + rr);
      const LIMIT = 60 * 60 * 15;
      const last = st.maps ? st.maps.length - 1 : -1;
      let tBossIn = -1;
      let i = 0;
      for (; i < LIMIT && !w.cleared && !w.failed; i++) {
        w.step(bot.think());
        if (tBossIn < 0 && last >= 0 && w.mapAt(w.hero.x) === last) tBossIn = w.run.time;
      }
      const run = w.run, par = st.par;
      // the live formula (RANK in src/sim/world.ts): hitScore is the Defence part; perMin is kept only as a measurement
      const { rank, score, time: timeScore, defence: hitScore, combo: comboPart, style: stylePart } = rankParts(run, par);
      const perMin = run.hitsTaken / Math.max(1, run.time / 60);
      const styleAvg = run.styleTime > 0 ? run.styleSum / run.styleTime : 0;
      const tZone = tBossIn < 0 ? run.time : tBossIn;
      const qd = Object.values(w.runDrops).reduce((a, b) => a + (b ?? 0), 0);
      const row = [st.id, wn, n, c.species, c.name.replace(/,/g, ''), rr, MODE, JAMS, w.cleared ? 1 : 0, w.cleared ? 'clear' : w.failed ? 'fail' : 'timeout', rank, score, f1(run.time), par, f1(tZone), f1(run.time - tZone),
        run.hitsTaken, perMin.toFixed(2), run.heals ?? 0, run.maxCombo, f1(styleAvg), run.perfects, run.interrupts, f1(timeScore), f1(hitScore), f1(comboPart), f1(stylePart), run.kills, qd, w.bossHits, (w.hero.hp / w.hero.d.maxHp).toFixed(2), (run.dmgTaken / w.hero.d.maxHp).toFixed(2)];
      appendFileSync(OUT, row.join(',') + '\n');
      console.log(`${st.id.padEnd(5)} ${c.name.split(' ')[0].padEnd(11)} r${rr} ${MODE.padEnd(7)} ${w.cleared ? 'CLEAR' : w.failed ? 'FAIL ' : 'TIME '} ${rank} ${String(score).padStart(3)}  t ${f1(run.time).padStart(6)}/${String(par).padEnd(4)} (zones ${f1(tZone)}, boss ${f1(run.time - tZone)})  T${f1(timeScore).padStart(5)} H${f1(hitScore).padStart(5)} C${f1(comboPart).padStart(5)} S${f1(stylePart).padStart(5)}  hits ${run.hitsTaken} (${perMin.toFixed(1)}/min) jams ${run.heals ?? 0} combo ${run.maxCombo} style ${f1(styleAvg)} perf ${run.perfects} int ${run.interrupts}`);
    }
  }
}
