// Summarise a balance sweep: node scripts/bal-sum.mjs [dir=shots/bal]
// Reads the outputs of `npx vite-node scripts/balance.ts <world>- <runs> > dir/w<world>.txt` and prints:
// per-kaiju clear rate (overall, per world), stages outside the targets, and the worst kaiju/stage pairs.
import fs from 'node:fs';
const dir = process.argv[2] ?? 'shots/bal';
const stages = [];
for (const f of fs.readdirSync(dir).filter(f => /^w\d+\.txt$/.test(f))) {
  const lines = fs.readFileSync(`${dir}/${f}`, 'utf8').split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^(\d+-\d+)\s+rec Lv(\d+)\s+clear\s+(\d+)%\s+hpLeft\s+(\S+)%.*?(BOSS (.*))?$/);
    if (!m) continue;
    const per = {}, timeouts = [];
    for (const part of (lines[i + 1] ?? '').split('|').map(s => s.trim())) {
      const k = part.match(/^(\S+) (\d+)\/(\d+)$/);
      if (k) per[k[1]] = [Number(k[2]), Number(k[3])];
      else if (/TIMEOUT/.test(part)) timeouts.push(part);
    }
    stages.push({ id: m[1], world: Number(m[1].split('-')[0]), n: Number(m[1].split('-')[1]), clear: Number(m[3]), hp: m[4] === '-' ? 0 : Number(m[4]), boss: m[6] ?? '', per, timeouts });
  }
}
stages.sort((a, b) => a.world - b.world || a.n - b.n);
const names = Object.keys(stages[0]?.per ?? {});
console.log(`${stages.length} stages\n\nPER KAIJU (clear % overall, then by world 1..10; stages only / bosses only)`);
const rows = names.map(nm => {
  const all = stages.map(s => s.per[nm]).filter(Boolean);
  const pct = arr => { const c = arr.reduce((a, [x, y]) => [a[0] + x, a[1] + y], [0, 0]); return c[1] ? Math.round(c[0] / c[1] * 100) : -1; };
  const byW = Array.from({ length: 10 }, (_, w) => pct(stages.filter(s => s.world === w + 1).map(s => s.per[nm]).filter(Boolean)));
  return { nm, all: pct(all), st: pct(stages.filter(s => !s.boss).map(s => s.per[nm])), bo: pct(stages.filter(s => s.boss).map(s => s.per[nm])), byW };
}).sort((a, b) => a.all - b.all);
for (const r of rows) console.log(`${r.nm.padEnd(12)} ${String(r.all).padStart(3)}%  [${r.byW.map(v => String(v).padStart(3)).join(' ')}]  stages ${r.st}% bosses ${r.bo}%`);
console.log('\nSTAGES OUTSIDE TARGET (stages: clear >= 90% with hpLeft 55-75 is fine; flag clear < 75% or hp < 45 / > 85; bosses: 40-70%)');
for (const s of stages) {
  const bad = s.boss ? (s.clear < 35 || s.clear > 80) : (s.clear < 75 || s.hp < 45 || s.hp > 85);
  if (bad) console.log(`${s.id.padEnd(6)} clear ${String(s.clear).padStart(3)}% hp ${s.hp}% ${s.boss}  weakest: ${Object.entries(s.per).filter(([, [c, t]]) => c / t < 0.5).map(([k, [c, t]]) => `${k} ${c}/${t}`).join(', ')}`);
}
console.log('\nTIMEOUTS (bot stuck)');
for (const s of stages) for (const t of s.timeouts) console.log(`${s.id} ${t}`);
