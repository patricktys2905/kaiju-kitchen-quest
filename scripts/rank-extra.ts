// Extra rank analyses on the probe CSVs: npx vite-node scripts/rank-extra.ts
import { readdirSync, readFileSync } from 'node:fs';
import { challengesFor } from '../src/sim/challenges';
import { clearLevel, clearCount } from '../src/sim/loot';
import * as loot from '../src/sim/loot';
type Row = Record<string, string> & { _: Record<string, number> };
function load(prefix: string): Row[] {
  const rows: Row[] = [];
  for (const f of readdirSync('shots/rank').filter(x => x.startsWith(prefix) && x.endsWith('.csv'))) {
    const [head, ...lines] = readFileSync(`shots/rank/${f}`, 'utf8').trim().split('\n');
    const cols = head.split(',');
    for (const l of lines) { const v = l.split(','); const r = {} as Row; r._ = {}; cols.forEach((c, i) => { r[c] = v[i]; r._[c] = Number(v[i]); }); rows.push(r); }
  }
  return rows;
}
const pct = (a: number, b: number) => (b ? Math.round(a / b * 100) : 0) + '%';
const mean = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : NaN);
const q = (a: number[], p: number) => { const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(p * s.length))]; };
const group = <T,>(rs: T[], key: (r: T) => string) => { const m = new Map<string, T[]>(); for (const r of rs) { const k = key(r); if (!m.has(k)) m.set(k, []); m.get(k)!.push(r); } return m; };
const letter = (s: number) => (s >= 85 ? 'S' : s >= 70 ? 'A' : s >= 50 ? 'B' : s >= 30 ? 'C' : 'D');
const scoreOf = (time: number, par: number, hits: number, heals: number, combo: number, style: number) => Math.round(Math.max(0, Math.min(40, 40 * (1.6 - time / par) / 0.6)) + Math.max(0, 35 - hits / Math.max(1, time / 60) * 3 - heals * 2) + combo + style);

const N = load('normal').filter(r => r.cleared === '1');
const allN = load('normal');

console.log('== 1. dawdling exploit: same run, but the player waits at the exit until the clock reaches par (hits/min falls, time term still 40)');
{
  const wait = N.map(r => letter(scoreOf(Math.max(r._.time, r._.par), r._.par, r._.hits, r._.heals, r._.comboPart, r._.stylePart)));
  console.log(`as played: S ${pct(N.filter(r => r.rank === 'S').length, N.length)} A ${pct(N.filter(r => r.rank === 'A').length, N.length)} | waiting to par: S ${pct(wait.filter(x => x === 'S').length, N.length)} A ${pct(wait.filter(x => x === 'A').length, N.length)}`);
  const wait13 = N.map(r => letter(scoreOf(Math.max(r._.time, r._.par * 1.15), r._.par, r._.hits, r._.heals, r._.comboPart, r._.stylePart)));
  console.log(`waiting to 1.15 x par (time term 30): S ${pct(wait13.filter(x => x === 'S').length, N.length)} A ${pct(wait13.filter(x => x === 'A').length, N.length)}`);
  const fast = N.filter(r => r._.time / r._.par < 0.6), slow = N.filter(r => r._.time / r._.par >= 0.85 && r._.time / r._.par <= 1);
  console.log(`runs under 0.6 par: n ${fast.length}, hits ${mean(fast.map(r => r._.hits)).toFixed(1)}, hits/min ${mean(fast.map(r => r._.perMin)).toFixed(1)}, hit term ${mean(fast.map(r => r._.hitScore)).toFixed(1)}, S ${pct(fast.filter(r => r.rank === 'S').length, fast.length)} | runs at 0.85-1.0 par: n ${slow.length}, hits ${mean(slow.map(r => r._.hits)).toFixed(1)}, hits/min ${mean(slow.map(r => r._.perMin)).toFixed(1)}, hit term ${mean(slow.map(r => r._.hitScore)).toFixed(1)}, S ${pct(slow.filter(r => r.rank === 'S').length, slow.length)}`);
}

console.log('\n== 2. per kaiju: time vs par, over par (fails the Beat-the-clock chilli), hits, jams, S');
for (const [k, v] of [...group(N, r => r.name)].sort((a, b) => mean(a[1].map(r => r._.time / r._.par)) - mean(b[1].map(r => r._.time / r._.par))))
  console.log(`${k.split(' ')[0].padEnd(12)} t/par ${mean(v.map(r => r._.time / r._.par)).toFixed(2)} over par ${pct(v.filter(r => r._.time > r._.par).length, v.length).padStart(4)} | hits/run ${mean(v.map(r => r._.hits)).toFixed(0).padStart(3)} hits/min ${mean(v.map(r => r._.perMin)).toFixed(1)} jams ${mean(v.map(r => r._.heals)).toFixed(1)} zero-jam ${pct(v.filter(r => r._.heals === 0).length, v.length).padStart(4)} | S ${pct(v.filter(r => r.rank === 'S').length, v.length).padStart(3)} A+ ${pct(v.filter(r => r.rank === 'S' || r.rank === 'A').length, v.length).padStart(4)} | stages with an S ${new Set(v.filter(r => r.rank === 'S').map(r => r.stage)).size}/100`);

console.log('\n== 3. boss stages (x-10) and stage 5');
for (const n of ['5', '10']) {
  const v = N.filter(r => r.n === n), a = allN.filter(r => r.n === n);
  console.log(`x-${n}: runs ${a.length} clears ${v.length} | S ${v.filter(r => r.rank === 'S').length} A ${v.filter(r => r.rank === 'A').length} | hits/min p10 ${q(v.map(r => r._.perMin), 0.1).toFixed(1)} med ${q(v.map(r => r._.perMin), 0.5).toFixed(1)} | jams 0: ${pct(v.filter(r => r._.heals === 0).length, v.length)} <=1: ${pct(v.filter(r => r._.heals <= 1).length, v.length)} mean ${mean(v.map(r => r._.heals)).toFixed(1)} | hit term mean ${mean(v.map(r => r._.hitScore)).toFixed(1)} max ${Math.max(...v.map(r => r._.hitScore))} | best score ${Math.max(...v.map(r => r._.score))} | boss-room share of time ${pct(mean(v.map(r => r._.tBoss / r._.time)) * 100, 100)} boss-room hits ${mean(v.map(r => r._.bossHits)).toFixed(1)} of ${mean(v.map(r => r._.hits)).toFixed(1)}`);
  console.log('   per world best score: ' + [...group(v, r => r.world)].sort((x, y) => +x[0] - +y[0]).map(([w, rs]) => `${w}-${n}: ${Math.max(...rs.map(r => r._.score))}`).join('  '));
}

console.log('\n== 4. the "perfect" run per stage: best observed, fastest clear with its jams removed, composite of the best pieces');
for (const id of ['1-1', '1-5', '1-10', '4-5', '4-8', '4-10', '7-6', '7-10', '10-5', '10-10']) {
  const v = N.filter(r => r.stage === id); if (!v.length) continue;
  const best = [...v].sort((a, b) => b._.score - a._.score)[0], fastest = [...v].sort((a, b) => a._.time - b._.time)[0];
  const zj = v.filter(r => r._.heals === 0);
  const minPM = Math.min(...v.map(r => r._.perMin));
  const fz = scoreOf(fastest._.time, fastest._.par, fastest._.hits, 0, fastest._.comboPart, fastest._.stylePart);
  const comp = Math.round(40 + Math.max(0, 35 - minPM * 3) + 25);
  console.log(`${id.padEnd(5)} par ${best.par} | best observed ${best.score} ${best.rank} (${best.name.split(' ')[0]}, t ${best.time}, hits ${best.hits}, jams ${best.heals}) | fastest ${fastest.time}s (${fastest.name.split(' ')[0]}, score ${fastest.score}; same run with zero jams: ${fz} ${letter(fz)}) | zero-jam clears ${zj.length}/${v.length}, their best ${zj.length ? Math.max(...zj.map(r => r._.score)) : '-'} | composite (fewest hits/min seen ${minPM.toFixed(1)}, 0 jams, rest maxed): ${comp} ${letter(comp)} | clears at <= 5 hits/min: ${pct(v.filter(r => r._.perMin <= 5).length, v.length)}`);
}

console.log('\n== 5. challenges: stars per world within reach (bot rate per stage challenge, all kaiju pooled; 15 of 30 open the secret stage)');
{
  const met: Record<string, (r: Row) => boolean> = { nojam: r => r._.heals === 0, srank: r => r.rank === 'S', arank: r => r.rank === 'S' || r.rank === 'A', fast: r => r._.time <= r._.par, combo: r => r._.maxCombo >= 40, dodge: r => r._.perfects >= 12, boss: r => r._.bossHits <= 3, onejam: r => r._.heals <= 1 };
  for (let w = 1; w <= 10; w++) {
    let e = 0, easy = 0, mid = 0, hard = 0; const sr: string[] = [];
    for (let n = 1; n <= 10; n++) {
      const v = N.filter(r => r.stage === `${w}-${n}`);
      for (const c of challengesFor(`${w}-${n}`)) { const p = v.filter(met[c.id]).length / Math.max(1, v.length); e += p; if (p >= 0.5) easy++; else if (p >= 0.1) mid++; else hard++; if (c.id === 'srank') sr.push(`${w}-${n} ${pct(p * 100, 100)}`); }
    }
    console.log(`world ${String(w).padStart(2)}: bot rate >= 50%: ${easy}, 10-50%: ${mid}, under 10%: ${hard} | expected stars from one clear of each stage ${e.toFixed(1)} | S-rank stars: ${sr.join(', ')}`);
  }
  const perf = N.map(r => r._.perfects);
  console.log(`perfect dodges per clear: mean ${mean(perf).toFixed(1)} p90 ${q(perf, 0.9)} max ${Math.max(...perf)}; clears with >= 12: ${perf.filter(x => x >= 12).length} of ${perf.length}`);
}

console.log('\n== 6. rewards by rank (end chest, before first-clear and challenge boxes)');
{
  const tw = (loot as unknown as { tierWeights?: (l: number) => number[] }).tierWeights;
  for (const [lv, boss] of [[5, false], [20, false], [20, true], [60, false], [60, true]] as [number, boolean][]) {
    const parts: string[] = [];
    for (const rk of ['B', 'A', 'S'] as const) {
      const n = clearCount(rk, boss), L = clearLevel(lv, rk, boss);
      let ev = ''; if (tw) { const w = tw(L), s = w.reduce((a, b) => a + b, 0); const min = boss ? 3 : rk === 'S' ? 2 : 1; let m = 0; w.forEach((x, i) => { m += x / s * Math.max(min, i + 1); }); ev = ` mean tier ${m.toFixed(2)}`; }
      parts.push(`${rk}: ${n} box${n > 1 ? 'es' : ''}, odds level ${L.toFixed(1)}${ev}`);
    }
    console.log(`stage Lv ${lv}${boss ? ' boss' : ''}: ${parts.join(' | ')}`);
  }
}

console.log('\n== 7. hunting time: normal vs a bag that already holds every drop (stocked) vs SKIP TO BOSS');
{
  const S = load('stocked').filter(r => r.cleared === '1'), K = load('skip').filter(r => r.cleared === '1');
  const row = (name: string, v: Row[]) => `${name.padEnd(8)} n ${v.length} time ${mean(v.map(r => r._.time)).toFixed(0)}s (t/par ${mean(v.map(r => r._.time / r._.par)).toFixed(2)}) zones ${mean(v.map(r => r._.tZone)).toFixed(0)}s boss room ${mean(v.map(r => r._.tBoss)).toFixed(0)}s | hits ${mean(v.map(r => r._.hits)).toFixed(0)} hits/min ${mean(v.map(r => r._.perMin)).toFixed(1)} jams ${mean(v.map(r => r._.heals)).toFixed(1)} | T ${mean(v.map(r => r._.timeScore)).toFixed(1)} H ${mean(v.map(r => r._.hitScore)).toFixed(1)} C ${mean(v.map(r => r._.comboPart)).toFixed(1)} St ${mean(v.map(r => r._.stylePart)).toFixed(1)} | S ${pct(v.filter(r => r.rank === 'S').length, v.length)} A ${pct(v.filter(r => r.rank === 'A').length, v.length)} B ${pct(v.filter(r => r.rank === 'B').length, v.length)}`;
  console.log(row('normal', N)); if (S.length) console.log(row('stocked', S)); if (K.length) console.log(row('skip', K));
  for (const [nm, f] of [['x-1..3', (r: Row) => r._.n <= 3], ['x-4..9', (r: Row) => r._.n >= 4 && r._.n <= 9], ['x-10', (r: Row) => r._.n === 10]] as [string, (r: Row) => boolean][]) { console.log(' ' + nm); console.log('  ' + row('normal', N.filter(f))); if (S.length) console.log('  ' + row('stocked', S.filter(f))); if (K.length) console.log('  ' + row('skip', K.filter(f))); }
  if (K.length) console.log('skip, S-rate per kaiju: ' + [...group(K, r => r.name)].map(([k, v]) => `${k.split(' ')[0]} ${pct(v.filter(r => r.rank === 'S').length, v.length)}`).join(' '));
}
