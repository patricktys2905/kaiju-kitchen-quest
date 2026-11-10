// Derived stats of every kaiju (balance-bot build) at a few levels: npx vite-node scripts/stat-table.ts [levels=10,50,100]
import { CLASSES } from '../src/sim/classes';
import { derive } from '../src/sim/stats';
import { heroFor } from './hero-at';
const levels = (process.argv[2] ?? '10,50,100').split(',').map(Number);
for (const lv of levels) {
  console.log(`\nLv ${lv}   name          maxHp   dr   atk  skill× atk×skill  crit  critDmg  cdr`);
  for (const c of CLASSES) {
    const d = derive(heroFor(c.species, lv, 1));
    console.log(`        ${c.name.padEnd(13)} ${String(d.maxHp).padStart(6)} ${d.dr.toFixed(2)} ${String(d.atk).padStart(5)} ${d.skillDmg.toFixed(2).padStart(6)} ${String(Math.round(d.atk * d.skillDmg)).padStart(8)} ${String(Math.round(d.crit)).padStart(5)} ${d.critDmg.toFixed(2).padStart(7)} ${d.cdr.toFixed(2)}`);
  }
}
