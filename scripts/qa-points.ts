// QA: skill points with nothing left to buy, per level (balance-bot build spends everything it can)
import { CLASSES } from '../src/sim/classes';
import { MAX_SKILL, skillsOf } from '../src/sim/skills';
import { treeOf, canLearn } from '../src/sim/tree';
import { heroFor } from './hero-at';
for (const lv of [100, 110, 115, 120]) {
  const rows = CLASSES.map(c => { const p = heroFor(c.species, lv, 1); const sk = skillsOf(c.species); const open = [...sk.actives, sk.passive].filter(s => (p.skills[s.id] ?? 0) < MAX_SKILL).length; const treeOpen = treeOf(c.species).flatMap(t => t.nodes).filter(n => canLearn({ ...p, skillPts: 99 }, n.id)).length; return { left: p.skillPts, open, treeOpen }; });
  console.log(`Lv ${lv}: unspent skill points min ${Math.min(...rows.map(r => r.left))} max ${Math.max(...rows.map(r => r.left))}; kaiju with any original skill below max rank: ${rows.filter(r => r.open).length}; with any tree node still learnable: ${rows.filter(r => r.treeOpen).length}`);
}
