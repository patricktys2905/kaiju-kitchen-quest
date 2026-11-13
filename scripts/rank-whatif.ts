// What-if rank formulas scored on the probe CSVs: npx vite-node scripts/rank-whatif.ts
import { readdirSync, readFileSync } from 'node:fs';
type Row = Record<string, string> & { _: Record<string, number> };
function load(prefix: string): Row[] {
  const rows: Row[] = [];
  for (const f of readdirSync('shots/rank').filter(x => x.startsWith(prefix) && x.endsWith('.csv'))) {
    const [head, ...lines] = readFileSync(`shots/rank/${f}`, 'utf8').trim().split('\n');
    const cols = head.split(',');
    for (const l of lines) { const v = l.split(','); const r = {} as Row; r._ = {}; cols.forEach((c, i) => { r[c] = v[i]; r._[c] = Number(v[i]); }); rows.push(r); }
  }
  return rows.filter(r => r.cleared === '1');
}
const group = <T,>(rs: T[], key: (r: T) => string) => { const m = new Map<string, T[]>(); for (const r of rs) { const k = key(r); if (!m.has(k)) m.set(k, []); m.get(k)!.push(r); } return m; };
const letter = (s: number) => (s >= 85 ? 'S' : s >= 70 ? 'A' : s >= 50 ? 'B' : s >= 30 ? 'C' : 'D');
const N = load('normal'), K = load('skip'), ST = load('stocked');
const SKIP_PAR = 130; // the boss room's own par (genStage short)

interface P { name: string; floor: boolean; a: number; b: number; bossA: number; bossB: number; parK?: number; skipPar?: boolean; timeW?: number }
function score(r: Row, p: P, skip = false): number {
  const boss = r._.n === 10;
  const par = (skip && p.skipPar ? SKIP_PAR : r._.par) * (p.parK ?? 1);
  const tw = p.timeW ?? 40;
  const T = Math.max(0, Math.min(tw, tw * (1.6 - r._.time / par) / 0.6));
  const mins = Math.max(1, (p.floor ? Math.max(r._.time, par) : r._.time) / 60);
  const H = Math.max(0, 35 + (40 - tw) - r._.hits / mins * p.a * (boss ? p.bossA : 1) - r._.heals * p.b * (boss ? p.bossB : 1));
  return Math.round(T + H + r._.comboPart + r._.stylePart);
}
const forms: P[] = [
  { name: 'current', floor: false, a: 3, b: 2, bossA: 1, bossB: 1 },
  { name: '1 floor only (minutes = max(time, par))', floor: true, a: 3, b: 2, bossA: 1, bossB: 1, skipPar: true },
  { name: '1b floor, hits 3.5', floor: true, a: 3.5, b: 2, bossA: 1, bossB: 1, skipPar: true },
  { name: '2 floor + boss stage x0.6/x0.5', floor: true, a: 3, b: 2, bossA: 0.6, bossB: 0.5, skipPar: true },
  { name: '2b floor + boss x0.5/x0.5', floor: true, a: 3, b: 2, bossA: 0.5, bossB: 0.5, skipPar: true },
  { name: '2c floor, hits 2.5 jams 3, boss x0.6/x0.5', floor: true, a: 2.5, b: 3, bossA: 0.6, bossB: 0.5, skipPar: true },
  { name: '2d floor, hits 3.5 jams 1, boss x0.5/x0.5', floor: true, a: 3.5, b: 1, bossA: 0.5, bossB: 0.5, skipPar: true },
  { name: '2e floor, hits 2 jams 4, boss x0.6/x0.5', floor: true, a: 2, b: 4, bossA: 0.6, bossB: 0.5, skipPar: true },
  { name: '3 as 2, par x1.15', floor: true, a: 3, b: 2, bossA: 0.6, bossB: 0.5, parK: 1.15, skipPar: true },
  { name: '3b as 2, time worth 25 (defence 50)', floor: true, a: 3, b: 2, bossA: 0.6, bossB: 0.5, timeW: 25, skipPar: true },
  { name: '3c as 2, time 25, hits 4 jams 3', floor: true, a: 4, b: 3, bossA: 0.6, bossB: 0.5, timeW: 25, skipPar: true },
  { name: 'x floor, no skip par (skip keeps stage par)', floor: true, a: 3, b: 2, bossA: 0.6, bossB: 0.5 },
];
const rate = (rs: Row[], p: P, L: string, skip = false) => Math.round(rs.filter(r => { const l = letter(score(r, p, skip)); return L === 'A+' ? l === 'S' || l === 'A' : l === L; }).length / Math.max(1, rs.length) * 100);
for (const p of forms) {
  const byK = [...group(N, r => r.name)].map(([k, v]) => [k.split(' ')[0], rate(v, p, 'S')] as [string, number]).sort((a, b) => a[1] - b[1]);
  const byKA = [...group(N, r => r.name)].map(([k, v]) => [k.split(' ')[0], rate(v, p, 'A+')] as [string, number]).sort((a, b) => a[1] - b[1]);
  const zero = [...group(N, r => r.stage)].filter(([, v]) => rate(v, p, 'S') === 0).map(([k]) => k);
  console.log(`\n${p.name}`);
  console.log(`  normal: S ${rate(N, p, 'S')}% A ${rate(N, p, 'A')}% B ${rate(N, p, 'B')}% C ${rate(N, p, 'C')}% D ${rate(N, p, 'D')}%`);
  console.log(`  S by world ${[...group(N, r => r.world)].sort((a, b) => +a[0] - +b[0]).map(([, v]) => rate(v, p, 'S')).join('/')} | S by x-n ${[...group(N, r => r.n)].sort((a, b) => +a[0] - +b[0]).map(([, v]) => rate(v, p, 'S')).join('/')} | A+ by x-n ${[...group(N, r => r.n)].sort((a, b) => +a[0] - +b[0]).map(([, v]) => rate(v, p, 'A+')).join('/')}`);
  console.log(`  S by kaiju: ${byK.map(([k, v]) => `${k} ${v}`).join(', ')}`);
  console.log(`  A+ by kaiju: lowest ${byKA.slice(0, 3).map(([k, v]) => `${k} ${v}`).join(', ')}; highest ${byKA.slice(-2).map(([k, v]) => `${k} ${v}`).join(', ')} | stages with no S at all: ${zero.length} (${zero.slice(0, 14).join(' ')}${zero.length > 14 ? ' ...' : ''})`);
  console.log(`  SKIP TO BOSS: S ${rate(K, p, 'S', true)}% A ${rate(K, p, 'A', true)}% (x-10: S ${rate(K.filter(r => r.n === '10'), p, 'S', true)}% A ${rate(K.filter(r => r.n === '10'), p, 'A', true)}%) | stocked bag: S ${rate(ST, p, 'S')}% A ${rate(ST, p, 'A')}%`);
}
