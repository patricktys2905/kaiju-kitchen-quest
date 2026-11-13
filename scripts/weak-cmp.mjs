// Compare two scripts/sweep-pass.sh files (A = before / unprepared, B = after / prepared), same seeds so differences are paired.
// node scripts/weak-cmp.mjs <A> <B> [stage ids to print per kaiju...]     (TABLE=1: the whole kaiju x boss table of B with deltas)
// Prints per world: stage average A -> B, boss A -> B; the stages that moved most; per-kaiju totals A -> B; cells per kaiju for
// the stages named.
import fs from 'node:fs';
function read(file) {
  const st = {}, L = fs.readFileSync(file, 'utf8').split('\n');
  for (let i = 0; i < L.length; i++) {
    const x = L[i]; if (!/^\d+-\d+ /.test(x)) continue;
    const id = x.split(' ')[0], j = +/jams ([\d.]+)/.exec(x)[1], t = +(/time (\d+)s/.exec(x) || [0, 0])[1];
    const per = {}; let n = 0, k = 0, to = 0;
    for (const seg of (L[i + 1] || '').split('|')) { const m = /^\s*([A-Za-z]+) (\d+)\/(\d+)\s*$/.exec(seg); if (m) { per[m[1]] = [+m[2], +m[3]]; k += +m[2]; n += +m[3]; } else if (/TIMEOUT/.test(seg)) to++; }
    st[id] = { id, n, k, c: k / n * 100, j, t, per, to };
  }
  return st;
}
const [fa, fb, ...cells] = process.argv.slice(2);
const A = read(fa), B = read(fb);
const ids = Object.keys(B).filter(id => A[id]);
const r = x => String(Math.round(x)).padStart(3);
const sg = x => (x >= 0 ? '+' : '') + Math.round(x);
for (let w = 1; w <= 10; w++) {
  const s = ids.filter(id => id.startsWith(w + '-') && !id.endsWith('-10')), b = w + '-10';
  const avg = (S, f) => s.reduce((p, id) => p + f(S[id]), 0) / (s.length || 1);
  let line = `W${w}`.padEnd(4);
  if (s.length) line += `stages ${r(avg(A, q => q.c))}% -> ${r(avg(B, q => q.c))}%  jams ${avg(A, q => q.j).toFixed(1)} -> ${avg(B, q => q.j).toFixed(1)}  time ${r(avg(A, q => q.t))}s -> ${r(avg(B, q => q.t))}s (n=${A[s[0]].n} / ${B[s[0]].n})`;
  if (A[b] && B[b]) line += ` | BOSS ${r(A[b].c)}% -> ${r(B[b].c)}% (${sg(B[b].c - A[b].c)})  jams ${A[b].j.toFixed(1)} -> ${B[b].j.toFixed(1)}  time ${r(A[b].t)}s -> ${r(B[b].t)}s  n=${A[b].n} / ${B[b].n}`;
  console.log(line);
}
const mv = ids.filter(id => !id.endsWith('-10')).map(id => ({ id, d: B[id].c - A[id].c, dt: B[id].t - A[id].t })).sort((x, y) => x.d - y.d);
if (mv.length) {
  console.log('stages down most: ' + mv.slice(0, 8).map(x => `${x.id} ${r(A[x.id].c).trim()}->${r(B[x.id].c).trim()}`).join('  '));
  console.log('stages up most:   ' + mv.slice(-8).reverse().map(x => `${x.id} ${r(A[x.id].c).trim()}->${r(B[x.id].c).trim()}`).join('  '));
  const out = S => ids.filter(id => !id.endsWith('-10') && (S[id].c < 70 || S[id].c > 95)).length;
  console.log(`stages outside 70-95%: ${out(A)} -> ${out(B)}; under 70%: ${ids.filter(id => !id.endsWith('-10') && B[id].c < 70).map(id => id + ' ' + r(B[id].c).trim()).join(' ') || 'none'}`);
}
const names = [...new Set(ids.flatMap(id => Object.keys(B[id].per)))];
const tot = (S, q, boss) => { let k = 0, n = 0; for (const id of ids) if (id.endsWith('-10') === boss && S[id].per[q]) { k += S[id].per[q][0]; n += S[id].per[q][1]; } return n ? k / n * 100 : NaN; };
for (const boss of [false, true]) {
  if (!ids.some(id => id.endsWith('-10') === boss)) continue;
  const rows = names.map(q => ({ q, a: tot(A, q, boss), b: tot(B, q, boss) })).sort((x, y) => x.b - y.b);
  console.log(`per kaiju, ${boss ? 'BOSSES' : 'stages'} A -> B: ` + rows.map(x => `${x.q} ${r(x.a).trim()}->${r(x.b).trim()}`).join('  '));
  console.log(`  band A ${r(Math.min(...rows.map(x => x.a))).trim()}-${r(Math.max(...rows.map(x => x.a))).trim()}  B ${r(Math.min(...rows.map(x => x.b))).trim()}-${r(Math.max(...rows.map(x => x.b))).trim()}`);
}
const cell = (S, id, q) => S[id].per[q] ? S[id].per[q][0] / S[id].per[q][1] * 100 : NaN;
if (process.env.TABLE) {
  const bs = ids.filter(id => id.endsWith('-10'));
  console.log('\nkaiju x boss, B% (B - A):  ' + bs.map(b => b.padStart(9)).join(''));
  for (const q of names) console.log(q.padEnd(12) + bs.map(b => `${r(cell(B, b, q))}(${sg(cell(B, b, q) - cell(A, b, q))})`.padStart(9)).join(''));
  const low = []; for (const b of bs) for (const q of names) if (cell(B, b, q) < 30) low.push(`${q} ${b} ${r(cell(B, b, q)).trim()}% (A ${r(cell(A, b, q)).trim()}%)`);
  console.log('cells under 30% in B: ' + (low.join('; ') || 'none'));
  const zero = []; for (const b of bs) for (const q of names) if (cell(B, b, q) === 0) zero.push(`${q} ${b}`);
  console.log('cells at 0 in B: ' + (zero.join('; ') || 'none'));
}
for (const c of cells) { const [id, ...qs] = c.split(':'); if (!B[id]) continue; console.log(`${id}: ` + (qs.length ? qs[0].split(',') : names).map(q => `${q} ${r(cell(A, id, q)).trim()}->${r(cell(B, id, q)).trim()}`).join('  ')); }
console.log(`timeouts A ${ids.reduce((p, id) => p + A[id].to, 0)}  B ${ids.reduce((p, id) => p + B[id].to, 0)}`);
