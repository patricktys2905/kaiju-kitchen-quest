// Rescore the recorded rank-probe runs (shots/rank/*.csv) with the LIVE rank formula (rankParts in src/sim/world.ts) and the
// live stage challenges: cheap, no simulation. Use it to tune the RANK constants, then confirm with fresh rank-probe runs.
// Usage: npx vite-node scripts/rank-rescore.ts [prefix=normal] [stages]   (prefix: the main sample's CSV file-name prefix, e.g. "fresh")
import { readdirSync, readFileSync } from 'node:fs';
import { CHALLENGES, challengesFor } from '../src/sim/challenges';
import { RANK, type RunStats, rankParts } from '../src/sim/world';

type Row = Record<string, string> & { _: Record<string, number> };
function load(prefix: string): Row[] {
  const rows: Row[] = [];
  for (const f of readdirSync('shots/rank').filter(x => x.startsWith(prefix) && x.endsWith('.csv'))) {
    const [head, ...lines] = readFileSync('shots/rank/' + f, 'utf8').trim().split(/\r?\n/);
    const cols = head.split(',');
    for (const l of lines) { const v = l.split(','); const r = {} as Row; r._ = {}; cols.forEach((c, i) => { r[c] = v[i]; r._[c] = Number(v[i]); }); rows.push(r); }
  }
  return rows.filter(r => r.cleared === '1');
}
/** A CSV row back into the RunStats the rank reads. */
export const runOf = (r: Row, dawdle = false): RunStats => ({
  time: dawdle ? Math.max(r._.time, r._.par) : r._.time, hitsTaken: r._.hits, dmgTaken: 0, maxCombo: r._.maxCombo, kills: r._.kills, crumbs: 0, revived: 0, stones: 0,
  perfects: r._.perfects, interrupts: r._.interrupts, styleSum: r._.styleAvg, styleTime: 1, stylePeak: 0, heals: r._.heals, boss: r._.n === 10, skipped: r.mode === 'skip',
});
const rk = (r: Row, dawdle = false) => rankParts(runOf(r, dawdle), r._.par);
const group = <T,>(rs: T[], key: (r: T) => string) => { const m = new Map<string, T[]>(); for (const r of rs) { const k = key(r); if (!m.has(k)) m.set(k, []); m.get(k)!.push(r); } return m; };
const pct = (n: number, d: number) => (d ? Math.round(n / d * 100) : 0);
const dist = (rs: Row[], dawdle = false) => { const c: Record<string, number> = { S: 0, A: 0, B: 0, C: 0, D: 0 }; for (const r of rs) c[rk(r, dawdle).rank]++; return 'SABCD'.split('').map(L => `${L} ${pct(c[L], rs.length)}%`).join(' ') + ` (n ${rs.length})`; };
const sRate = (rs: Row[]) => rs.filter(r => rk(r).rank === 'S').length / Math.max(1, rs.length) * 100;
const num = (a: [string, unknown], b: [string, unknown]) => Number(a[0]) - Number(b[0]);

const PREFIX = process.argv[2] ?? 'normal';
const N = load(PREFIX), K = PREFIX === 'normal' ? load('skip') : [], ST = PREFIX === 'normal' ? load('stocked') : [];
console.log('RANK', JSON.stringify(RANK));
console.log(`\n== ${PREFIX}: full clears ==\noverall      ${dist(N)}`);
for (const [n, v] of [...group(N, r => r.n)].sort(num)) console.log(`x-${n.padEnd(2)}         ${dist(v)}`);
console.log('world bosses by world (S% / A%): ' + [...group(N.filter(r => r.n === '10'), r => r.world)].sort(num).map(([w, v]) => `w${w} ${Math.round(sRate(v))}/${pct(v.filter(r => rk(r).rank === 'A').length, v.length)}`).join('  '));
console.log('by world     ' + [...group(N, r => r.world)].sort(num).map(([w, v]) => `w${w} S ${Math.round(sRate(v))}`).join('  '));
console.log('\nby kaiju (S / A / B %):');
for (const [k, v] of [...group(N, r => r.name)].sort((a, b) => sRate(b[1]) - sRate(a[1]))) console.log(`  ${k.padEnd(14)} ${dist(v)}`);
const byStage = [...group(N, r => r.stage)].map(([id, v]) => ({ id, n: v.length, s: sRate(v), best: Math.max(...v.map(r => rk(r).score)) }));
console.log(`\nstages with no S: ${byStage.filter(x => x.s === 0).map(x => `${x.id} (best score ${x.best}, n ${x.n})`).join(', ') || 'none'}`);
console.log(`stages with S under 4%: ${byStage.filter(x => x.s < 4).map(x => x.id).join(' ')}`);
console.log(`stages with S over 40%: ${byStage.filter(x => x.s > 40).map(x => `${x.id} ${Math.round(x.s)}%`).join(' ')}`);
console.log(`\nwaiting (every run stretched to at least par): ${dist(N, true)}`);
if (K.length) {
  console.log(`SKIP TO BOSS  ${dist(K)}   | x-10 only: ${dist(K.filter(r => r.n === '10'))}`);
  console.log(`drops stocked ${dist(ST)}   | x-10 only: ${dist(ST.filter(r => r.n === '10'))}`);
}
// stage challenges: how often each is met on a full clear, and on the stages that carry it
console.log('\nchallenges (met on a full clear, any stage | on the stages that list it):');
for (const c of CHALLENGES) {
  const ctx = (r: Row) => ({ run: runOf(r), rank: rk(r).rank, par: r._.par, bossHits: r._.bossHits });
  const on = N.filter(r => challengesFor(r.stage).some(x => x.id === c.id));
  console.log(`  ${c.id.padEnd(7)} ${c.name.padEnd(14)} ${String(pct(N.filter(r => c.done(ctx(r))).length, N.length)).padStart(3)}% | ${String(pct(on.filter(r => c.done(ctx(r))).length, on.length)).padStart(3)}% on ${new Set(on.map(r => r.stage)).size} stages`);
}
console.log('perfect dodges in a clear: ' + [1, 2, 3, 4, 5, 6, 8, 12].map(k => `>=${k}: ${(N.filter(r => r._.perfects >= k).length / N.length * 100).toFixed(1)}%`).join('  '));
console.log(`no hits taken: full clears ${N.filter(r => r._.hits === 0).length}/${N.length}` + (K.length ? `, skip runs ${K.filter(r => r._.hits === 0).length}/${K.length}` : ''));
const s15 = N.filter(r => r.stage === '1-5');
if (s15.length) console.log(`1-5 with A or better: ${pct(s15.filter(r => 'SA'.includes(rk(r).rank)).length, s15.length)}% (lowest kaiju: ${[...group(s15, r => r.name)].map(([k, v]) => [k, pct(v.filter(r => 'SA'.includes(rk(r).rank)).length, v.length)] as [string, number]).sort((a, b) => a[1] - b[1]).slice(0, 3).map(([k, v]) => `${k} ${v}%`).join(', ')})`);
console.log('over par (fails the "Beat the clock" chilli): ' + [...group(N, r => r.name)].map(([k, v]) => [k.split(' ')[0], pct(v.filter(r => r._.time > r._.par).length, v.length)] as [string, number]).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}%`).join(', '));
