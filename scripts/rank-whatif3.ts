// What-if: defence judged on health lost (damage taken / max HP) instead of hit count. Uses shots/rank/dmg-*.csv. npx vite-node scripts/rank-whatif3.ts
import { readdirSync, readFileSync } from "node:fs";
type Row = Record<string, string> & { _: Record<string, number> };
const rows: Row[] = [];
for (const f of readdirSync("shots/rank").filter(x => x.startsWith("dmg-") && x.endsWith(".csv"))) {
  const [head, ...lines] = readFileSync("shots/rank/" + f, "utf8").trim().split("\n");
  const cols = head.split(",");
  for (const l of lines) { const v = l.split(","); const r = {} as Row; r._ = {}; cols.forEach((c, i) => { r[c] = v[i]; r._[c] = Number(v[i]); }); rows.push(r); }
}
const N = rows.filter(r => r.cleared === "1");
const group = <T,>(rs: T[], key: (r: T) => string) => { const m = new Map<string, T[]>(); for (const r of rs) { const k = key(r); if (!m.has(k)) m.set(k, []); m.get(k)!.push(r); } return m; };
const mean = (a: number[]) => a.reduce((x, y) => x + y, 0) / Math.max(1, a.length);
const letter = (s: number) => (s >= 85 ? "S" : s >= 70 ? "A" : s >= 50 ? "B" : s >= 30 ? "C" : "D");
console.log("rows " + rows.length + " clears " + N.length + " (worlds 2, 4, 7, 9; all 20 kaiju; 2 runs)");
console.log("per kaiju: hits/run, health bars lost/run, jams");
for (const [k, v] of [...group(N, r => r.name)].sort((a, b) => mean(a[1].map(r => r._.dmgFrac)) - mean(b[1].map(r => r._.dmgFrac)))) console.log("  " + k.split(" ")[0].padEnd(12) + " hits " + mean(v.map(r => r._.hits)).toFixed(0).padStart(3) + "  bars lost " + mean(v.map(r => r._.dmgFrac)).toFixed(2) + "  jams " + mean(v.map(r => r._.heals)).toFixed(1) + "  damage per hit " + (mean(v.map(r => r._.dmgFrac)) / mean(v.map(r => r._.hits)) * 100).toFixed(1) + "% of max HP");
type F = [string, (r: Row) => number];
const eq = (r: Row, mini: number, boss: number) => r._.kills + (r._.n === 10 ? boss : mini);
const forms: F[] = [
  ["current", r => r._.score],
  ["hits per kill (c30, jam 2, boss jam x0.5, mini 20, boss 60)", r => Math.round(r._.timeScore + Math.max(0, 35 - 30 * r._.hits / eq(r, 20, 60) - r._.heals * 2 * (r._.n === 10 ? 0.5 : 1)) + r._.comboPart + r._.stylePart)],
  ...[500, 600, 700].map(c => ["health lost per kill (c" + c + ", no jam term, mini 20, boss 60)", (r: Row) => Math.round(r._.timeScore + Math.max(0, 35 - c * r._.dmgFrac / eq(r, 20, 60)) + r._.comboPart + r._.stylePart)] as F),
  ...[400, 500].map(c => ["health lost per kill (c" + c + ") + jam 1.5", (r: Row) => Math.round(r._.timeScore + Math.max(0, 35 - c * r._.dmgFrac / eq(r, 20, 60) - r._.heals * 1.5 * (r._.n === 10 ? 0.5 : 1)) + r._.comboPart + r._.stylePart)] as F),
];
for (const [name, f] of forms) {
  const rate = (rs: Row[], L: string) => Math.round(rs.filter(r => letter(f(r)) === L).length / Math.max(1, rs.length) * 100);
  const byK = [...group(N, r => r.name)].map(([k, v]) => [k.split(" ")[0], rate(v, "S")] as [string, number]).sort((a, b) => a[1] - b[1]);
  console.log("\n" + name + "\n  S " + rate(N, "S") + "% A " + rate(N, "A") + "% B " + rate(N, "B") + "% C " + rate(N, "C") + "% | S by x-n " + [...group(N, r => r.n)].sort((a, b) => +a[0] - +b[0]).map(([, v]) => rate(v, "S")).join("/") + " | S by world " + [...group(N, r => r.world)].sort((a, b) => +a[0] - +b[0]).map(([, v]) => rate(v, "S")).join("/"));
  console.log("  S by kaiju: " + byK.map(([k, v]) => k + " " + v).join(", "));
}
