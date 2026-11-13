// Sums up scripts/weak-duel.ts output: node scripts/weak-duel-sum.mjs <files...>
import fs from 'node:fs';
const rows = [];
for (const f of process.argv.slice(2)) for (const l of fs.readFileSync(f, 'utf8').split('\n')) {
  const p = l.split(' | '); if (p.length < 7) continue;
  const m = {}; for (const x of p.slice(4)) { const [mode, w, t, j, cc] = x.split(' '); m[mode] = { w: +w.split('/')[0], n: +w.split('/')[1], t: t === '-' ? NaN : +t, j: +j, cc: +cc }; }
  rows.push({ stage: p[0], foe: p[1], type: p[2], kaiju: p[3], ...m });
}
const agg = (rs, mode) => { let w = 0, n = 0, t = 0, tw = 0, j = 0, cc = 0; for (const r of rs) { const x = r[mode]; w += x.w; n += x.n; if (x.w) { t += x.t * x.w; tw += x.w; } j += x.j; cc += x.cc; } return { win: w / n * 100, t: t / tw, j: j / rs.length, cc: cc / rs.length * 100 }; };
const line = (name, rs) => { const a = agg(rs, 'off'), b = agg(rs, 'on'), c = agg(rs, 'prep'); return `${name.padEnd(14)} n=${String(rs.length * rs[0].off.n).padStart(4)}  win ${a.win.toFixed(0)}/${b.win.toFixed(0)}/${c.win.toFixed(0)}%  kill ${a.t.toFixed(1)}/${b.t.toFixed(1)}/${c.t.toFixed(1)}s (${((b.t / a.t - 1) * 100).toFixed(0)}%, ${((c.t / a.t - 1) * 100).toFixed(0)}%)  jams ${a.j.toFixed(2)}/${b.j.toFixed(2)}/${c.j.toFixed(2)}  held ${a.cc.toFixed(0)}/${b.cc.toFixed(0)}/${c.cc.toFixed(0)}%`; };
console.log('boss-room fights, OFF / ON (unprepared) / PREP: win rate, mean time to kill (change vs OFF), jams used, share of the fight the foe is frozen, glued or bubbled');
console.log(line('ALL', rows));
for (const t of ['MELTY', 'FIERY', 'CRUSTY', 'SLIPPERY']) console.log(line('foe ' + t, rows.filter(r => r.type === t)));
for (let w = 1; w <= 10; w++) { const rs = rows.filter(r => r.stage.startsWith(w + '-')); if (rs.length) console.log(line('W' + w, rs)); }
console.log('\nper kaiju:');
for (const k of [...new Set(rows.map(r => r.kaiju))]) console.log(line(k, rows.filter(r => r.kaiju === k)));
console.log('\nper kaiju x foe type (ON vs OFF kill time %, PREP vs OFF %, held ON%, held PREP%):');
for (const k of [...new Set(rows.map(r => r.kaiju))]) console.log(k.padEnd(12) + ['MELTY', 'FIERY', 'CRUSTY', 'SLIPPERY'].map(t => { const rs = rows.filter(r => r.kaiju === k && r.type === t); const a = agg(rs, 'off'), b = agg(rs, 'on'), c = agg(rs, 'prep'); return `${t.slice(0, 4)} ${((b.t / a.t - 1) * 100).toFixed(0).padStart(4)} ${((c.t / a.t - 1) * 100).toFixed(0).padStart(4)} h${b.cc.toFixed(0).padStart(3)}/${c.cc.toFixed(0).padStart(3)} w${b.win.toFixed(0)}/${c.win.toFixed(0)}`; }).join(' | '));
const held = rows.map(r => ({ r, h: Math.max(r.on.cc, r.prep.cc) })).sort((a, b) => b.h - a.h);
console.log('\nmost-held foes (share of fight frozen/glued; off/on/prep): ' + held.slice(0, 25).map(x => `${x.r.kaiju} ${x.r.stage} ${x.r.foe} ${(x.r.off.cc * 100).toFixed(0)}/${(x.r.on.cc * 100).toFixed(0)}/${(x.r.prep.cc * 100).toFixed(0)}`).join('; '));
console.log(`fights where the foe is held over 60% of the time: off ${rows.filter(r => r.off.cc > .6).length}, on ${rows.filter(r => r.on.cc > .6).length}, prep ${rows.filter(r => r.prep.cc > .6).length} of ${rows.length} (over 80%: ${rows.filter(r => r.off.cc > .8).length} / ${rows.filter(r => r.on.cc > .8).length} / ${rows.filter(r => r.prep.cc > .8).length})`);
const slow = rows.filter(r => r.on.w && r.off.w).map(r => ({ r, d: r.on.t / r.off.t })).sort((a, b) => b.d - a.d);
console.log('slowest ON vs OFF: ' + slow.slice(0, 15).map(x => `${x.r.kaiju} ${x.r.stage} ${x.r.foe}(${x.r.type.slice(0, 4)}) ${x.r.off.t.toFixed(0)}->${x.r.on.t.toFixed(0)}s`).join('; '));
console.log('lost fights (wins off/on/prep differ): ' + rows.filter(r => r.on.w < r.off.w || r.prep.w < r.off.w).map(r => `${r.kaiju} ${r.stage} ${r.off.w}/${r.on.w}/${r.prep.w}`).join('; '));
