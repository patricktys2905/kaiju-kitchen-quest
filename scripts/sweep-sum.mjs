// Per-world summary of scripts/sweep-all.sh output: node scripts/sweep-sum.mjs [file=shots/sweep-all.txt]
import fs from 'node:fs';
const l = fs.readFileSync(process.argv[2] ?? 'shots/sweep-all.txt', 'utf8').split('\n').filter(x => /^\d+-\d+ /.test(x));
const by = {};
for (const x of l) { const id = x.split(' ')[0], w = +id.split('-')[0], boss = id.endsWith('-10'); const c = +/clear\s+(\d+)%/.exec(x)[1], j = +/jams ([\d.]+)/.exec(x)[1], t = +(/time (\d+)s/.exec(x) || [0, 0])[1]; (by[w] ??= { s: [], b: [] })[boss ? 'b' : 's'].push({ id, c, j, t }); }
for (const w in by) { const s = by[w].s, a = k => (s.reduce((p, q) => p + q[k], 0) / s.length).toFixed(1); console.log('W' + w, 'stages clear', a('c'), 'jams', a('j'), 'time', a('t'), '| boss', by[w].b.map(b => b.c + '% ' + b.j + 'j ' + b.t + 's').join(' '), '| <70%:', s.filter(q => q.c < 70).map(q => q.id + ' ' + q.c + '%').join(' ')); }
