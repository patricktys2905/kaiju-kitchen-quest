// Evens the kaiju out: benchmarks all 20 in parallel (scripts/kaiju-bench.ts), nudges each one's HP / attack multiplier
// in src/sim/kaijuTune.ts toward the shared targets, and repeats. node scripts/kaiju-tune.mjs [rounds=3] [--dry]
import { spawn } from 'node:child_process';
import fs from 'node:fs';
const ROUNDS = Number(process.argv[2] ?? 3), DRY = process.argv.includes('--dry');
const BOSS = 0.55, STAGE = 0.93;
const FILE = 'src/sim/kaijuTune.ts';
const read = () => {
  const t = {};
  for (const m of fs.readFileSync(FILE, 'utf8').matchAll(/^\s+(\d+): \{ hp: ([\d.]+), dmg: ([\d.]+) \},/gm)) t[m[1]] = { hp: Number(m[2]), dmg: Number(m[3]) };
  return t;
};
const write = t => {
  const src = fs.readFileSync(FILE, 'utf8').replace(/(export const KAIJU_TUNE[^=]*= \{)[\s\S]*?\n\};/, (_, head) =>
    `${head}\n${Object.keys(t).sort((a, b) => a - b).map(k => `  ${k}: { hp: ${t[k].hp.toFixed(2)}, dmg: ${t[k].dmg.toFixed(2)} },`).join('\n')}\n};`);
  fs.writeFileSync(FILE, src);
};
const bench = sp => new Promise(res => {
  const p = spawn(process.execPath, ['node_modules/vite-node/dist/cli.mjs', 'scripts/kaiju-bench.ts', String(sp)], { stdio: ['ignore', 'pipe', 'ignore'] });
  let out = ''; p.stdout.on('data', d => out += d); p.on('close', () => { try { res(JSON.parse(out.trim().split('\n').pop())); } catch { res(null); } });
});
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
for (let round = 1; round <= ROUNDS; round++) {
  const t = read();
  const res = (await Promise.all(Object.keys(t).map(bench))).filter(Boolean).sort((a, b) => a.boss - b.boss);
  const pct = v => String(Math.round(v * 100)).padStart(3) + '%';
  console.log(`\nround ${round}: boss ${pct(Math.min(...res.map(r => r.boss)))}..${pct(Math.max(...res.map(r => r.boss)))}  stage ${pct(Math.min(...res.map(r => r.stage)))}..${pct(Math.max(...res.map(r => r.stage)))}`);
  for (const r of res) {
    const cur = t[r.sp];
    const hpF = clamp(1 + (BOSS - r.boss) * 0.7 + Math.max(0, STAGE - r.stage) * 1.2, 0.85, 1.2); // stages only push HP up (a kaiju that struggles)
    const dmgF = clamp(1 + (BOSS - r.boss) * 0.25, 0.94, 1.08);
    const next = DRY || round === ROUNDS && false ? cur : { hp: clamp(cur.hp * hpF, 0.6, 1.8), dmg: clamp(cur.dmg * dmgF, 0.4, 1.3) };
    console.log(`  ${String(r.sp).padStart(2)} boss ${pct(r.boss)} stage ${pct(r.stage)} hpLeft ${pct(r.hp)}  hp ${cur.hp.toFixed(2)}→${next.hp.toFixed(2)} dmg ${cur.dmg.toFixed(2)}→${next.dmg.toFixed(2)}`);
    t[r.sp] = next;
  }
  if (!DRY) write(t);
}
