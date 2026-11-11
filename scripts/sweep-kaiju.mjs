// Per-kaiju clear rates from the per-stage files scripts/sweep-all.sh leaves in shots/sweep: node scripts/sweep-kaiju.mjs
import fs from 'node:fs';
const per = {};
for (const f of fs.readdirSync('shots/sweep')) {
  const t = fs.readFileSync('shots/sweep/' + f, 'utf8').split('\n')[1] || '', boss = f.endsWith('-10.txt');
  for (const m of t.matchAll(/([A-Z][a-z]+)[^|]*? (\d+)\/(\d+)/g)) { const v = (per[m[1]] ??= { s: 0, n: 0, b: 0, bn: 0 }); if (boss) { v.b += +m[2]; v.bn += +m[3]; } else { v.s += +m[2]; v.n += +m[3]; } }
}
console.log(Object.entries(per).map(([k, v]) => [k, Math.round(v.s / v.n * 100), Math.round(v.b / v.bn * 100)]).sort((a, b) => a[1] - b[1]).map(x => `${x[0]} ${x[1]}%/${x[2]}%`).join('  '));
