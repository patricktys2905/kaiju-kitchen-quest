// What the "prepared" build (scripts/hero-at.ts prepare) changes, per kaiju, for a stage: npx vite-node scripts/weak-prep.ts [stage ids...]
// (default: the ten world bosses). Shows the foe's weakness, the weapon's element before -> after, and the three buttons.
import { CLASSES } from '../src/sim/classes';
import { ELEMENT_INFO, elementsOfGear, elementsOfSkill, stageElements } from '../src/sim/elements';
import { MOBS } from '../src/sim/mobs';
import { STAGES } from '../src/sim/stages';
import { derive } from '../src/sim/stats';
import { heroFor } from './hero-at';
const ic = (e: string[]) => e.map(x => ELEMENT_INFO[x as 'HOT'].icon).join('') || '·';
const ids = process.argv.slice(2).length ? process.argv.slice(2) : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(w => `${w}-10`);
for (const id of ids) {
  const st = STAGES.find(s => s.id === id)!;
  for (const c of CLASSES) {
    const foe = stageElements(st, c.species).boss; if (!foe) continue;
    if (c.species === 0 || (id.endsWith('-5') && st.world <= 5)) console.log(`\n== ${id} ${MOBS[foe.kind].name}: weak ${ELEMENT_INFO[foe.weakTo].icon} resists ${ELEMENT_INFO[foe.resists].icon}`);
    const row = (prep: boolean) => [1, 2, 3].map(seed => { const d = derive(heroFor(c.species, st.rec, seed, prep ? st : undefined)); return ic(elementsOfGear(heroFor(c.species, st.rec, seed, prep ? st : undefined).equip.weapon)) + ' [' + d.actives.map(a => (d.skillLv[a.id] ? '' : '(off)') + a.name + ic(elementsOfSkill(a, d.mods[a.id]))).join(', ') + ']'; });
    const a = row(false), b = row(true);
    console.log(c.name.split(' ')[0].padEnd(12), 'plain   ', a[0], '| weapons', a.map(x => x.split(' ')[0]).join(' '));
    console.log(''.padEnd(12), 'prepared', b[0], '| weapons', b.map(x => x.split(' ')[0]).join(' '));
  }
}
