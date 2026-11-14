// Balance check for the Garnish (docs/DROPS-USES.md B4): does Hunter's Nose on a WANTED kind make stages shorter?
// The balance bot (same build, seeds and jams as scripts/balance.ts) plays each stage with every kaiju twice over:
// wearing nothing, and wearing the garnish of a monster the stage's exits ask for. Same seeds in both arms, so each pair
// differs only by the garnish.   npx vite-node scripts/garnish-probe.ts [stages...]   env RUNS (default 2),
// SKILL=skilled, WEAR=first (default: the first wanted kind) | <kind> | all (every wanted kind at once: an upper bound
// that no real player can reach with one kaiju, a full party of four could approach it).
import { AVERAGE, Bot, SKILLED } from '../src/sim/bot';
import { CLASSES } from '../src/sim/classes';
import { stageWants } from '../src/sim/cookbook';
import { setWorldGarnishes } from '../src/sim/garnish';
import { nemesisOf } from '../src/sim/mobs';
import { STAGES } from '../src/sim/stages';
import { derive } from '../src/sim/stats';
import { World } from '../src/sim/world';
import { heroFor } from './hero-at';

const RUNS = Number(process.env.RUNS ?? 2), JAMS = 3, SKILL = process.env.SKILL === 'skilled' ? SKILLED : AVERAGE, WEAR = process.env.WEAR ?? 'first';
// FIX=A: what-if, no bonus while the map's own exit still wants that drop (55% stays 55%). FIX=B: no bonus while ANY exit of
// the stage still wants it. Neither is the shipped rule; they are here to size the smallest fix.
const FIX = process.env.FIX === 'A' || process.env.FIX === 'B' ? process.env.FIX : '';
const ids = process.argv.slice(2).length ? process.argv.slice(2) : ['1-2', '4-4', '8-8'];
const mean = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : NaN);
const sd = (a: number[]) => { const m = mean(a); return a.length > 1 ? Math.sqrt(a.reduce((x, y) => x + (y - m) ** 2, 0) / (a.length - 1)) : NaN; };

function play(id: string, species: number, r: number, worn: string[]) {
  const st = STAGES.find(s => s.id === id)!;
  const w = new World(st, derive(heroFor(species, st.rec, r + 1)), 100 + r, [{ id: 'jam', n: JAMS }, null, null, null], 0, false, undefined, [], nemesisOf(species));
  // one human can only wear one; `all` pretends a full party of humans wears one each (the World only looks at humans)
  const setAll = (kinds: string[]) => { const hw = w as unknown as { humans: number }, was = hw.humans; hw.humans = Math.max(1, kinds.length); setWorldGarnishes(w, kinds); hw.humans = was; };
  if (worn.length) setAll(worn);
  const bot = new Bot(w, SKILL, 7 + r);
  for (let i = 0; i < 60 * 60 * 15 && !w.cleared && !w.failed; i++) {
    if (FIX && worn.length) { // what-if (not the shipped rule): the garnish sleeps while an exit still wants its drop
      const maps = st.maps ?? [], asks = (mi: number, k: string) => { const g = maps[mi]?.goal; return !!g && g.kind === 'collect' && !w.zones2[mi].done && g.wants.some(q => q.mob === k); };
      const here = w.mapAt(w.hero.x);
      setAll(worn.filter(k => (FIX === 'A' ? !asks(here, k) : !maps.some((_, mi) => asks(mi, k)))));
    }
    w.step(bot.think());
  }
  return { clear: w.cleared, time: w.run.time, jams: JAMS - (w.hero.bag[0]?.n ?? 0), kills: w.run.kills, picked: Object.values(w.runDrops).reduce((a, b) => a + (b ?? 0), 0), timeout: !w.cleared && !w.failed };
}

console.log(`bot ${SKILL === SKILLED ? 'skilled' : 'average'}, ${CLASSES.length} kaiju x ${RUNS} runs per arm, ${JAMS} jams, wear=${WEAR}${FIX ? ', what-if fix ' + FIX : ''}`);
for (const id of ids) {
  const st = STAGES.find(s => s.id === id)!, wants = Object.keys(stageWants(st));
  const worn = WEAR === 'all' ? wants : [WEAR === 'first' ? wants[0] : WEAR];
  const A: ReturnType<typeof play>[] = [], B: ReturnType<typeof play>[] = [];
  for (const c of CLASSES) for (let r = 0; r < RUNS; r++) { A.push(play(id, c.species, r, [])); B.push(play(id, c.species, r, worn)); }
  const row = (name: string, a: typeof A) => `  ${name.padEnd(22)} clear ${String(Math.round(a.filter(x => x.clear).length / a.length * 100)).padStart(3)}% (${a.filter(x => x.clear).length}/${a.length})  time ${mean(a.filter(x => x.clear).map(x => x.time)).toFixed(1)}s  jams ${mean(a.map(x => x.jams)).toFixed(2)}  kills ${mean(a.filter(x => x.clear).map(x => x.kills)).toFixed(1)}  drops picked ${mean(a.filter(x => x.clear).map(x => x.picked)).toFixed(1)}  timeouts ${a.filter(x => x.timeout).length}`;
  // paired: runs both arms cleared
  const both = A.map((a, i) => [a, B[i]] as const).filter(([a, b]) => a.clear && b.clear);
  const dt = both.map(([a, b]) => b.time - a.time), base = mean(both.map(([a]) => a.time)), dk = both.map(([a, b]) => b.kills - a.kills), dj = A.map((a, i) => B[i].jams - a.jams);
  const se = sd(dt) / Math.sqrt(dt.length);
  console.log(`${id} (exits want ${Object.entries(stageWants(st)).map(([k, n]) => `${k}:${n}`).join(' ')}) garnish: ${worn.join('+')}`);
  console.log(row('no garnish', A)); console.log(row('garnish', B));
  console.log(`  paired (${both.length} pairs both cleared): time ${mean(dt) >= 0 ? '+' : ''}${mean(dt).toFixed(1)}s = ${(mean(dt) / base * 100).toFixed(1)}% (std error ${(se / base * 100).toFixed(1)}%), kills ${mean(dk) >= 0 ? '+' : ''}${mean(dk).toFixed(1)}, jams ${mean(dj) >= 0 ? '+' : ''}${mean(dj).toFixed(2)}; clear changed in ${A.filter((a, i) => a.clear !== B[i].clear).length} pairs (${A.filter((a, i) => a.clear && !B[i].clear).length} lost, ${A.filter((a, i) => !a.clear && B[i].clear).length} gained)`);
}
