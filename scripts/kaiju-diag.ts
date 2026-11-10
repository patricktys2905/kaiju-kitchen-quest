// Why is a kaiju weak? For every kaiju on a few stages: damage per second (as share of the stage's par DPS),
// damage taken (share of max HP per minute), clear rate, and boss kill time with the hero made invulnerable
// (pure damage, no dodging needed).
// npx vite-node scripts/kaiju-diag.ts [stages=4-6,7-6,9-6] [bosses=4-10,7-10,9-10] [runs=4]
import { AVERAGE, Bot } from '../src/sim/bot';
import { CLASSES } from '../src/sim/classes';
import { nemesisOf } from '../src/sim/mobs';
import { stageById } from '../src/sim/stages';
import { derive } from '../src/sim/stats';
import { World } from '../src/sim/world';
import { heroFor } from './hero-at';

const stages = (process.argv[2] ?? '4-6,7-6,9-6').split(',');
const bosses = (process.argv[3] ?? '4-10,7-10,9-10').split(',');
const RUNS = Number(process.argv[4] ?? 4);

function run(id: string, sp: number, r: number, god: boolean) {
  const st = stageById(id);
  const d = derive(heroFor(sp, st.rec, r + 1));
  const w = new World(st, d, 100 + r, [{ id: 'jam', n: 3 }, null, null, null], 0, false, undefined, [], god ? undefined : nemesisOf(sp), false);
  const bot = new Bot(w, AVERAGE, 7 + r);
  let dealt = 0, taken = 0, i = 0;
  for (; i < 60 * 240 && !w.cleared && !w.failed && !(god && w.boss && w.boss.hp <= 0); i++) {
    if (god) { w.hero.inv = 1; w.hero.hp = w.hero.d.maxHp; }
    const hp = w.hero.hp;
    for (const e of w.step(bot.think())) if (e.t === 'hit' && e.target === 'mob') dealt += e.dmg;
    taken += Math.max(0, hp - w.hero.hp);
    if (!god && w.hero.hp > hp) { /* healed */ }
  }
  const t = i / 60;
  return { clear: w.cleared || (god && !!w.boss && w.boss.hp <= 0), t, dps: dealt / Math.max(1, t), takenPm: taken / d.maxHp / Math.max(1 / 60, t / 60), maxHp: d.maxHp, atk: d.atk };
}

const rows: { name: string; vals: string[]; score: number }[] = [];
for (const c of CLASSES) {
  const vals: string[] = [];
  let score = 0;
  for (const id of stages) {
    let cl = 0, dps = 0, tk = 0;
    for (let r = 0; r < RUNS; r++) { const o = run(id, c.species, r, false); cl += o.clear ? 1 : 0; dps += o.dps; tk += o.takenPm; }
    vals.push(`${id} ${cl}/${RUNS} dps ${Math.round(dps / RUNS)} hurt ${(tk / RUNS).toFixed(2)}/min`);
  }
  for (const id of bosses) {
    let t = 0, k = 0, dps = 0;
    for (let r = 0; r < RUNS; r++) { const o = run(id, c.species, r, true); if (o.clear) { k++; t += o.t; } dps += o.dps; }
    vals.push(`${id} kill ${k ? Math.round(t / k) + 's' : 'never'} dps ${Math.round(dps / RUNS)}`);
    score += k ? t / k : 300;
  }
  rows.push({ name: c.name, vals, score });
  console.error(c.name, 'done');
}
rows.sort((a, b) => b.score - a.score);
for (const r of rows) console.log(r.name.padEnd(13), r.vals.join(' | '));
