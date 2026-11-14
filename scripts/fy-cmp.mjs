// Sweep comparison after the stage-layout fix: node scripts/fy-cmp.mjs <new-all> <new-boss> [old-all...] -- prints per world and per stage.
//   node scripts/fy-cmp.mjs shots/fy-all.txt shots/fy-boss.txt
// Old: shots/weak-final-all-plain.txt (Worlds 1-10), shots/w11-pass1.txt (World 11), shots/weak-final-boss-plain.txt (bosses).
import fs from 'node:fs';
function read(...files) {
  const st = {};
  for (const file of files) { const L = fs.readFileSync(file, 'utf8').split('\n');
    for (let i = 0; i < L.length; i++) {
      const x = L[i]; if (!/^\d+-\d+ /.test(x)) continue;
      const id = x.split(' ')[0], j = +/jams ([\d.]+)/.exec(x)[1], t = +(/time (\d+)s/.exec(x) || [0, 0])[1];
      let n = 0, k = 0; const to = [];
      for (const seg of (L[i + 1] || '').split('|')) { const m = /^\s*([A-Za-z]+) (\d+)\/(\d+)\s*$/.exec(seg); if (m) { k += +m[2]; n += +m[3]; } else if (/TIMEOUT/.test(seg)) to.push(seg.trim()); }
      st[id] = { id, n, k, c: k / n * 100, j, t, to };
    } }
  return st;
}
const [fa = 'shots/fy-all.txt', fb = 'shots/fy-boss.txt'] = process.argv.slice(2);
const N = read(fa), NB = fs.existsSync(fb) ? read(fb) : {}, O = read('shots/weak-final-all-plain.txt', 'shots/w11-pass1.txt'), OB = { ...read('shots/weak-final-boss-plain.txt') }; OB['11-10'] ??= O['11-10'];
const r = x => String(Math.round(x)).padStart(3), isBoss = id => id.endsWith('-10');
console.log('PER WORLD (stages 1-9 average clear %, time, jams; old -> new)');
for (let w = 1; w <= 11; w++) {
  const ids = Array.from({ length: 9 }, (_, i) => `${w}-${i + 1}`).filter(id => N[id] && O[id]);
  const avg = (S, f) => ids.reduce((a, id) => a + f(S[id]), 0) / ids.length;
  const b = `${w}-10`;
  console.log(`W${String(w).padEnd(2)} clear ${r(avg(O, s => s.c))}% -> ${r(avg(N, s => s.c))}%   time ${r(avg(O, s => s.t))}s -> ${r(avg(N, s => s.t))}s   jams ${avg(O, s => s.j).toFixed(1)} -> ${avg(N, s => s.j).toFixed(1)}   | boss ${OB[b] ? r(OB[b].c) : '  ?'}% (n=${OB[b]?.n}) -> ${NB[b] ? r(NB[b].c) : '  ?'}% (n=${NB[b]?.n ?? '-'})  [2-run sweep: ${r(N[b].c)}%]`);
}
console.log('\nPER STAGE (old n -> new n)   * = moved more than 10 points   ! = outside the band (stages 70-95%, bosses 50-80%)');
for (let w = 1; w <= 11; w++) for (let n = 1; n <= 10; n++) {
  const id = `${w}-${n}`, boss = isBoss(id), o = boss ? OB[id] : O[id], nw = boss && NB[id] ? NB[id] : N[id];
  if (!o || !nw) continue;
  const d = nw.c - o.c, out = boss ? nw.c < 50 || nw.c > 80 : nw.c < 70 || nw.c > 95;
  console.log(`${id.padEnd(6)} ${r(o.c)}% (n=${o.n}) -> ${r(nw.c)}% (n=${nw.n})  ${(d >= 0 ? '+' : '') + Math.round(d)}`.padEnd(44), `time ${r(o.t)}s -> ${r(nw.t)}s  jams ${o.j.toFixed(1)} -> ${nw.j.toFixed(1)}`, Math.abs(d) > 10 ? ' *' : '', out ? ' !' : '', nw.to.length ? ` TIMEOUT x${nw.to.length}: ${nw.to.join(' ; ')}` : '');
}
const tos = [...Object.values(N), ...Object.values(NB)].filter(s => s.to.length);
console.log(`\nbot timeouts: ${tos.reduce((a, s) => a + s.to.length, 0)}`); for (const s of tos) console.log(' ', s.id, s.to.join(' ; '));
