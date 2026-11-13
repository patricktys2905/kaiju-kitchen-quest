// What-if: hits judged per monster defeated (a boss counts as B monsters) instead of per minute. npx vite-node scripts/rank-whatif2.ts
import { readdirSync, readFileSync } from "node:fs";
type Row = Record<string, string> & { _: Record<string, number> };
function load(prefix: string): Row[] {
  const rows: Row[] = [];
  for (const f of readdirSync("shots/rank").filter(x => x.startsWith(prefix) && x.endsWith(".csv"))) {
    const [head, ...lines] = readFileSync("shots/rank/" + f, "utf8").trim().split("\n");
    const cols = head.split(",");
    for (const l of lines) { const v = l.split(","); const r = {} as Row; r._ = {}; cols.forEach((c, i) => { r[c] = v[i]; r._[c] = Number(v[i]); }); rows.push(r); }
  }
  return rows.filter(r => r.cleared === "1");
}
const group = <T,>(rs: T[], key: (r: T) => string) => { const m = new Map<string, T[]>(); for (const r of rs) { const k = key(r); if (!m.has(k)) m.set(k, []); m.get(k)!.push(r); } return m; };
const letter = (s: number) => (s >= 85 ? "S" : s >= 70 ? "A" : s >= 50 ? "B" : s >= 30 ? "C" : "D");
const N = load("normal"), K = load("skip"), ST = load("stocked");
const mean = (a: number[]) => a.reduce((x, y) => x + y, 0) / Math.max(1, a.length);
console.log("hits per kill-equivalent check: normal kills " + mean(N.map(r => r._.kills)).toFixed(1) + " hits " + mean(N.map(r => r._.hits)).toFixed(1) + " | stocked kills " + mean(ST.map(r => r._.kills)).toFixed(1) + " hits " + mean(ST.map(r => r._.hits)).toFixed(1) + " | skip kills " + mean(K.map(r => r._.kills)).toFixed(1) + " hits " + mean(K.map(r => r._.hits)).toFixed(1) + " | skip x-10 kills " + mean(K.filter(r => r.n === "10").map(r => r._.kills)).toFixed(1) + " hits " + mean(K.filter(r => r.n === "10").map(r => r._.hits)).toFixed(1));
interface P { name: string; c: number; b: number; mini: number; boss: number; bossB: number }
const score = (r: Row, p: P) => {
  const boss = r._.n === 10;
  const T = r._.timeScore;
  const H = Math.max(0, 35 - p.c * r._.hits / (r._.kills + (boss ? p.boss : p.mini)) - r._.heals * p.b * (boss ? p.bossB : 1));
  return Math.round(T + H + r._.comboPart + r._.stylePart);
};
const rate = (rs: Row[], p: P, L: string) => Math.round(rs.filter(r => { const l = letter(score(r, p)); return L === "A+" ? l === "S" || l === "A" : l === L; }).length / Math.max(1, rs.length) * 100);
const forms: P[] = [];
for (const c of [28, 32, 36]) for (const b of [2, 3]) for (const [mini, boss] of [[15, 40], [20, 60]]) forms.push({ name: "per-kill c" + c + " jam" + b + " mini=" + mini + " boss=" + boss, c, b, mini, boss, bossB: 0.5 });
for (const p of forms) {
  const byK = [...group(N, r => r.name)].map(([k, v]) => [k.split(" ")[0], rate(v, p, "S")] as [string, number]).sort((a, b) => a[1] - b[1]);
  const zero = [...group(N, r => r.stage)].filter(([, v]) => rate(v, p, "S") === 0).length;
  console.log("\n" + p.name);
  console.log("  normal: S " + rate(N, p, "S") + "% A " + rate(N, p, "A") + "% B " + rate(N, p, "B") + "% C " + rate(N, p, "C") + "% | S by world " + [...group(N, r => r.world)].sort((a, b) => +a[0] - +b[0]).map(([, v]) => rate(v, p, "S")).join("/") + " | S by x-n " + [...group(N, r => r.n)].sort((a, b) => +a[0] - +b[0]).map(([, v]) => rate(v, p, "S")).join("/") + " | A+ by x-n " + [...group(N, r => r.n)].sort((a, b) => +a[0] - +b[0]).map(([, v]) => rate(v, p, "A+")).join("/"));
  console.log("  S by kaiju: " + byK.map(([k, v]) => k + " " + v).join(", ") + " | stages with no S: " + zero);
  console.log("  SKIP: S " + rate(K, p, "S") + "% A " + rate(K, p, "A") + "% (x-10 S " + rate(K.filter(r => r.n === "10"), p, "S") + "% A " + rate(K.filter(r => r.n === "10"), p, "A") + "%) | stocked: S " + rate(ST, p, "S") + "% A " + rate(ST, p, "A") + "%");
}
