// Balance-pass helper: set hp / atk of monsters in src/sim/mobs.ts (absolute, or xN to multiply the current value).
// node scripts/set-mob.mjs toast hp=1650 atk=x1.2 golem hp=x1.5      (prints old -> new for the report)
import fs from 'node:fs';
const file = 'src/sim/mobs.ts';
let s = fs.readFileSync(file, 'utf8'), kind = '';
for (const a of process.argv.slice(2)) {
  if (!a.includes('=')) { kind = a; continue; }
  const [k, v] = a.split('=');
  const re = new RegExp(`(\\n  ${kind}: \\{[^\\n]*?\\b${k}: )([\\d.]+)`);
  const m = re.exec(s); if (!m) { console.error('not found', kind, k); process.exit(1); }
  const old = +m[2], nv = v.startsWith('x') ? Math.round(old * +v.slice(1)) : +v;
  s = s.replace(re, `$1${nv}`);
  console.log(`${kind}.${k}: ${old} -> ${nv}`);
}
fs.writeFileSync(file, s);
