// Summarise rank-probe CSVs: npx vite-node scripts/rank-sum.ts <prefix> [section...]
// reads every shots/rank/<prefix>*.csv
import { readdirSync, readFileSync } from 'node:fs';

const prefix = process.argv[2] ?? 'normal';
const want = process.argv.slice(3);
const show = (s: string) => !want.length || want.includes(s);
type Row = Record<string, string> & { _: Record<string, number> };
const rows: Row[] = [];
for (const f of readdirSync('shots/rank').filter(x => x.startsWith(prefix) && x.endsWith('.csv'))) {
  const [head, ...lines] = readFileSync(`shots/rank/${f}`, 'utf8').trim().split('\n');
  const cols = head.split(',');
  for (const l of lines) { const v = l.split(','); const r = {} as Row; r._ = {}; cols.forEach((c, i) => { r[c] = v[i]; r._[c] = Number(v[i]); }); rows.push(r); }
}
const clears = rows.filter(r => r.cleared === '1');
const pct = (a: number, b: number) => (b ? Math.round(a / b * 100) : 0) + '%';
const mean = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : NaN);
const sd = (a: number[]) => { const m = mean(a); return Math.sqrt(mean(a.map(x => (x - m) ** 2))); };
const q = (a: number[], p: number) => { const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(p * s.length))]; };
const f1 = (v: number) => (Number.isNaN(v) ? '-' : v.toFixed(1));
const dist = (rs: Row[]) => ['S', 'A', 'B', 'C', 'D'].map(k => `${k} ${pct(rs.filter(r => r.rank === k).length, rs.length).padStart(4)}`).join('  ');
const group = (rs: Row[], key: (r: Row) => string) => { const m = new Map<string, Row[]>(); for (const r of rs) { const k = key(r); if (!m.has(k)) m.set(k, []); m.get(k)!.push(r); } return m; };
const line = (name: string, all: Row[]) => {
  const c = all.filter(r => r.cleared === '1');
  const m = (k: string) => f1(mean(c.map(r => r._[k])));
  return `${name.padEnd(14)} n ${String(all.length).padStart(4)} clear ${pct(c.length, all.length).padStart(4)} | ${dist(c)} | score ${m('score')} = T ${m('timeScore')} H ${m('hitScore')} C ${m('comboPart')} St ${m('stylePart')} | t/par ${(mean(c.map(r => r._.time / r._.par))).toFixed(2)} hits/min ${m('perMin')} jams ${m('heals')} combo ${m('maxCombo')} perf ${m('perfects')} int ${m('interrupts')} styleAvg ${m('styleAvg')}`;
};

console.log(`rows ${rows.length}, clears ${clears.length} (${pct(clears.length, rows.length)})`);
if (show('overall')) { console.log('\n== overall'); console.log(line('all', rows)); }
if (show('world')) { console.log('\n== per world'); for (const [k, v] of [...group(rows, r => r.world)].sort((a, b) => +a[0] - +b[0])) console.log(line('world ' + k, v)); }
if (show('num')) { console.log('\n== per stage number'); for (const [k, v] of [...group(rows, r => r.n)].sort((a, b) => +a[0] - +b[0])) console.log(line('x-' + k, v)); }
if (show('kaiju')) { console.log('\n== per kaiju'); for (const [k, v] of [...group(rows, r => r.name)].sort((a, b) => mean(b[1].filter(r => r.cleared === '1').map(r => r._.score)) - mean(a[1].filter(r => r.cleared === '1').map(r => r._.score)))) console.log(line(k.split(' ')[0], v)); }
if (show('stage')) {
  console.log('\n== per stage');
  for (const [k, v] of group(rows, r => r.stage)) console.log(line(k, v) + ` | best ${Math.max(...v.filter(r => r.cleared === '1').map(r => r._.score))} | time min ${f1(Math.min(...v.filter(r => r.cleared === '1').map(r => r._.time)))} med ${f1(q(v.filter(r => r.cleared === '1').map(r => r._.time), 0.5))} p90 ${f1(q(v.filter(r => r.cleared === '1').map(r => r._.time), 0.9))} par ${v[0].par}`);
}
if (show('caps')) {
  console.log('\n== how often is each term at its cap / floor (clears)');
  const n = clears.length;
  console.log(`time term = 40 (run <= par): ${pct(clears.filter(r => r._.timeScore >= 39.95).length, n)};  time term < 40: ${pct(clears.filter(r => r._.timeScore < 39.95).length, n)}; time term = 0: ${pct(clears.filter(r => r._.timeScore <= 0).length, n)}`);
  console.log(`hit term = 0: ${pct(clears.filter(r => r._.hitScore <= 0).length, n)};  hit term >= 20 (needed for S with the rest maxed): ${pct(clears.filter(r => r._.hitScore >= 20).length, n)};  hit term >= 5 (A with the rest maxed): ${pct(clears.filter(r => r._.hitScore >= 5).length, n)}`);
  console.log(`combo part = 12 (combo >= 20): ${pct(clears.filter(r => r._.comboPart >= 11.95).length, n)};  style part = 13: ${pct(clears.filter(r => r._.stylePart >= 12.95).length, n)}; style part >= 10: ${pct(clears.filter(r => r._.stylePart >= 10).length, n)}`);
  console.log(`style part from interrupts alone (int*0.5 >= 13): ${pct(clears.filter(r => r._.interrupts * 0.5 >= 13).length, n)}; mean interrupts ${f1(mean(clears.map(r => r._.interrupts)))}, mean styleAvg*0.3 ${f1(mean(clears.map(r => r._.styleAvg * 0.3)))}, mean perfects*1.5 ${f1(mean(clears.map(r => r._.perfects * 1.5)))}`);
  console.log(`time/par: p10 ${q(clears.map(r => r._.time / r._.par), 0.1).toFixed(2)} median ${q(clears.map(r => r._.time / r._.par), 0.5).toFixed(2)} p90 ${q(clears.map(r => r._.time / r._.par), 0.9).toFixed(2)} max ${Math.max(...clears.map(r => r._.time / r._.par)).toFixed(2)}`);
  console.log(`hits/min: p10 ${f1(q(clears.map(r => r._.perMin), 0.1))} median ${f1(q(clears.map(r => r._.perMin), 0.5))} p90 ${f1(q(clears.map(r => r._.perMin), 0.9))} min ${f1(Math.min(...clears.map(r => r._.perMin)))}`);
  console.log(`jams: 0: ${pct(clears.filter(r => r._.heals === 0).length, n)}  <=1: ${pct(clears.filter(r => r._.heals <= 1).length, n)}  <=2: ${pct(clears.filter(r => r._.heals <= 2).length, n)}  mean ${f1(mean(clears.map(r => r._.heals)))}`);
  console.log(`hit penalty split (mean): hits/min*3 = ${f1(mean(clears.map(r => r._.perMin * 3)))}, jams*2 = ${f1(mean(clears.map(r => r._.heals * 2)))} (budget 35; S needs the sum <= 15, A <= 30 when time+combo+style are maxed)`);
  // what stops S: for each non-S clear, which single term fixed to its cap would have given S
  const non = clears.filter(r => r.rank !== 'S');
  const fix = (r: Row, t: string) => { const T = t === 'time' ? 40 : r._.timeScore, H = t === 'hits' ? 35 : t === 'hitsOnly' ? Math.max(0, 35 - r._.heals * 2) : t === 'jamsOnly' ? Math.max(0, 35 - r._.perMin * 3) : r._.hitScore, C = t === 'combo' ? 25 : r._.comboPart + r._.stylePart; return Math.round(T + H + C) >= 85; };
  console.log(`non-S clears ${non.length}: would be S with perfect time ${pct(non.filter(r => fix(r, 'time')).length, non.length)}, with zero hits AND zero jams ${pct(non.filter(r => fix(r, 'hits')).length, non.length)}, with zero hits (jams kept) ${pct(non.filter(r => fix(r, 'hitsOnly')).length, non.length)}, with zero jams (hits kept) ${pct(non.filter(r => fix(r, 'jamsOnly')).length, non.length)}, with max combo+style ${pct(non.filter(r => fix(r, 'combo')).length, non.length)}`);
}
if (show('spread')) {
  console.log('\n== run-to-run spread on the same stage and kaiju (clears only, cells with >= 3 clears)');
  const cells = [...group(clears, r => r.stage + '|' + r.species).values()].filter(v => v.length >= 3);
  const cv = (k: string) => mean(cells.map(v => sd(v.map(r => r._[k])) / mean(v.map(r => r._[k]))));
  console.log(`cells ${cells.length}: time CV ${(cv('time') * 100).toFixed(0)}%  zone-time CV ${(cv('tZone') * 100).toFixed(0)}%  boss-time CV ${(cv('tBoss') * 100).toFixed(0)}%  kills CV ${(cv('kills') * 100).toFixed(0)}%; mean (max-min)/mean of time ${(mean(cells.map(v => (Math.max(...v.map(r => r._.time)) - Math.min(...v.map(r => r._.time))) / mean(v.map(r => r._.time)))) * 100).toFixed(0)}%; score SD within a cell ${f1(mean(cells.map(v => sd(v.map(r => r._.score)))))}`);
  // share of zone-time variance explained by kills (drop luck: more kills needed = unlucky), within cell
  let sxy = 0, sxx = 0, syy = 0;
  for (const v of cells) { const mk = mean(v.map(r => r._.kills)), mt = mean(v.map(r => r._.tZone)); for (const r of v) { sxy += (r._.kills - mk) * (r._.tZone - mt); sxx += (r._.kills - mk) ** 2; syy += (r._.tZone - mt) ** 2; } }
  console.log(`within-cell: zone time vs kills r^2 = ${(sxy * sxy / (sxx * syy)).toFixed(2)}, slope ${(sxy / sxx).toFixed(1)} s per extra kill`);
  console.log(`zone share of run time: ${pct(mean(clears.map(r => r._.tZone / r._.time)) * 100, 100)}; kills per run mean ${f1(mean(clears.map(r => r._.kills)))}, quest drops picked up ${f1(mean(clears.map(r => r._.questDrops)))}`);
}
if (show('never')) {
  console.log('\n== stages by S and A count');
  const g = group(clears, r => r.stage);
  const noS = [...g].filter(([, v]) => !v.some(r => r.rank === 'S')).map(([k]) => k), noA = [...g].filter(([, v]) => !v.some(r => r.rank === 'S' || r.rank === 'A')).map(([k]) => k);
  console.log(`stages with zero S: ${noS.length}/${g.size}; with zero A-or-better: ${noA.length}/${g.size}`);
  console.log('stages with any S: ' + [...g].filter(([, v]) => v.some(r => r.rank === 'S')).map(([k, v]) => `${k} (${v.filter(r => r.rank === 'S').length}/${v.length})`).join(', '));
  console.log('zero A-or-better: ' + noA.join(' '));
  console.log('top scores: ' + [...clears].sort((a, b) => b._.score - a._.score).slice(0, 15).map(r => `${r.stage} ${r.name.split(' ')[0]} ${r.score} (T${r.timeScore} H${r.hitScore} hits ${r.hits} jams ${r.heals} t ${r.time})`).join(' | '));
}
if (show('challenges')) {
  console.log('\n== challenge conditions met (clears)');
  const n = clears.length;
  console.log(`fast (time <= par) ${pct(clears.filter(r => r._.time <= r._.par).length, n)} | srank ${pct(clears.filter(r => r.rank === 'S').length, n)} | arank ${pct(clears.filter(r => r.rank === 'S' || r.rank === 'A').length, n)} | nojam ${pct(clears.filter(r => r._.heals === 0).length, n)} | onejam ${pct(clears.filter(r => r._.heals <= 1).length, n)} | combo>=40 ${pct(clears.filter(r => r._.maxCombo >= 40).length, n)} | 12 perfect dodges ${pct(clears.filter(r => r._.perfects >= 12).length, n)} | boss room <=3 hits ${pct(clears.filter(r => r._.bossHits <= 3).length, n)} | no hit at all ${pct(clears.filter(r => r._.hits === 0).length, n)}`);
}
if (show('whatif')) {
  console.log('\n== what-if formulas (clears): S / A / B / C / D, then S-rate per world, spread of S-rate over kaiju and stage numbers');
  type F = (r: Row) => number;
  const letter = (s: number, cut = [85, 70, 50, 30]) => (s >= cut[0] ? 'S' : s >= cut[1] ? 'A' : s >= cut[2] ? 'B' : s >= cut[3] ? 'C' : 'D');
  const hunt = (r: Row) => r._.tZone, boss = (r: Row) => r._.tBoss;
  void hunt; void boss;
  const forms: [string, F][] = [
    ['current', r => r._.score],
    // A: retune only. par = par*k ; hits per-minute weight w ; jam cost j
    ...[[0.5, 1.5, 1], [0.5, 2, 1], [0.55, 1.5, 1.5], [0.5, 1.5, 2], [0.45, 1.5, 1], [0.5, 1.2, 1], [0.6, 1.5, 1]].map(([k, w, j]) => [`A par*${k} hit*${w} jam*${j}`, (r: Row) => Math.round(Math.max(0, Math.min(40, 40 * (1.6 - r._.time / (r._.par * k)) / 0.6)) + Math.max(0, 35 - r._.perMin * w - r._.heals * j) + r._.comboPart + r._.stylePart)] as [string, F]),
  ];
  for (const [name, f] of forms) {
    const L = clears.map(r => letter(f(r)));
    const d = ['S', 'A', 'B', 'C', 'D'].map(k => `${k} ${pct(L.filter(x => x === k).length, L.length).padStart(4)}`).join(' ');
    const rate = (rs: Row[]) => rs.filter(r => letter(f(r)) === 'S').length / Math.max(1, rs.length);
    const byW = [...group(clears, r => r.world)].sort((a, b) => +a[0] - +b[0]).map(([, v]) => Math.round(rate(v) * 100)).join('/');
    const byK = [...group(clears, r => r.name)].map(([, v]) => Math.round(rate(v) * 100));
    const byN = [...group(clears, r => r.n)].sort((a, b) => +a[0] - +b[0]).map(([, v]) => Math.round(rate(v) * 100)).join('/');
    const zeroS = [...group(clears, r => r.stage)].filter(([, v]) => rate(v) === 0).length;
    console.log(`${name.padEnd(30)} ${d} | S by world ${byW} | S by x-n ${byN} | S by kaiju min ${Math.min(...byK)} max ${Math.max(...byK)} | stages with 0 S: ${zeroS}`);
  }
}
