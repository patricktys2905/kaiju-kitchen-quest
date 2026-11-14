// Summary of a scripts/sweep-pass.sh file: per world stage averages, each boss with its per-kaiju min/max, stages out of
// target, per-kaiju totals, timeouts. node scripts/pass-sum.mjs <file> [more files: merged, later lines for a stage add up]
import fs from 'node:fs';
const st = {};
for (const file of process.argv.slice(2)) {
  const L = fs.readFileSync(file, 'utf8').split('\n');
  for (let i = 0; i < L.length; i++) {
    const x = L[i]; if (!/^\d+-\d+ /.test(x)) continue;
    const id = x.split(' ')[0], c = +/clear\s+(\d+)%/.exec(x)[1], j = +/jams ([\d.]+)/.exec(x)[1], t = +(/time (\d+)s/.exec(x) || [0, 0])[1];
    const per = {}; let n = 0, k = 0, to = [];
    for (const seg of (L[i + 1] || '').split('|')) { const m = /^\s*([A-Za-z]+) (\d+)\/(\d+)\s*$/.exec(seg); if (m) { per[m[1]] = [+m[2], +m[3]]; k += +m[2]; n += +m[3]; } else if (/TIMEOUT/.test(seg)) to.push(seg.trim()); }
    const s = (st[id] ??= { id, n: 0, k: 0, jw: 0, tw: 0, per: {}, to: [] });
    s.n += n; s.k += k; s.jw += j * n; s.tw += t * k; s.to.push(...to);
    for (const q in per) { const p = (s.per[q] ??= [0, 0]); p[0] += per[q][0]; p[1] += per[q][1]; }
    void c;
  }
}
const all = Object.values(st).map(s => ({ ...s, c: Math.round(s.k / s.n * 100), j: s.jw / s.n, t: s.k ? s.tw / s.k : 0 }));
const kai = {};
for (let w = 1; w <= 11; w++) {
  if (!all.some(q => q.id.startsWith(w + "-"))) { if (w <= 10) console.log(`W${w}`.padEnd(4) + "stages -"); continue; }
  const s = all.filter(q => q.id.startsWith(w + '-') && !q.id.endsWith('-10')), b = all.find(q => q.id === w + '-10');
  const a = f => s.length ? (s.reduce((p, q) => p + f(q), 0) / s.length) : 0;
  let line = `W${w}`.padEnd(4) + (s.length ? `stages ${a(q => q.c).toFixed(0)}% ${a(q => q.j).toFixed(1)}j ${a(q => q.t).toFixed(0)}s (n=${s[0].n}/stage)` : 'stages -');
  if (b) { const pk = Object.entries(b.per).map(([k, v]) => [k, v[0] / v[1]]).sort((x, y) => x[1] - y[1]); line += ` | BOSS ${b.c}% ${b.j.toFixed(1)}j ${b.t.toFixed(0)}s n=${b.n} min ${pk.slice(0, 3).map(x => x[0] + ' ' + Math.round(x[1] * 100)).join(',')} max ${pk.slice(-2).map(x => x[0] + ' ' + Math.round(x[1] * 100)).join(',')}`; }
  const out = s.filter(q => q.c < 70 || q.c > 95);
  if (out.length) line += ` | out: ${out.map(q => q.id + ' ' + q.c + '%').join(' ')}`;
  console.log(line);
}
if (process.env.STAGES) for (const s of all) console.log(s.id.padEnd(6), String(s.c).padStart(3) + '%', s.j.toFixed(1) + 'j', s.t.toFixed(0) + 's', 'n=' + s.n);
for (const s of all) for (const q in s.per) { const v = (kai[q] ??= { s: 0, n: 0, b: 0, bn: 0 }); if (s.id.endsWith('-10')) { v.b += s.per[q][0]; v.bn += s.per[q][1]; } else { v.s += s.per[q][0]; v.n += s.per[q][1]; } }
console.log('kaiju stage%/boss%: ' + Object.entries(kai).sort((a, b) => a[1].s / (a[1].n || 1) - b[1].s / (b[1].n || 1)).map(([k, v]) => `${k} ${v.n ? Math.round(v.s / v.n * 100) : '-'}/${v.bn ? Math.round(v.b / v.bn * 100) : '-'}`).join('  '));
const tos = all.filter(s => s.to.length);
console.log('timeouts: ' + tos.reduce((p, s) => p + s.to.length, 0)); for (const s of tos) console.log('  ' + s.id + ': ' + s.to.join(' ; '));
