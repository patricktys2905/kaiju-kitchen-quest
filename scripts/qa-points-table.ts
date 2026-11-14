// Skill points earned vs things to spend them on, by level (tests/tree.test.ts checks the same for every level and kaiju).
// npx vite-node scripts/qa-points-table.ts [levels...]
import { MAX_SKILL, rankLv, skillsOf } from '../src/sim/skills';
import { MAX_LEVEL } from '../src/sim/stats';
import { masteryRanks, nodeLv, treeOf } from '../src/sim/tree';
import { heroFor } from './hero-at';
const sp = 10, sk = skillsOf(sp);
const levels = process.argv.slice(2).map(Number); if (!levels.length) levels.push(70, 100, 110, 111, 114, 115, 117, 120);
console.log(`MAX_LEVEL ${MAX_LEVEL}: ${masteryRanks()} mastery ranks per path`);
for (const lv of levels) {
  let tree = 0, skills = 0, all = 0;
  treeOf(sp).forEach(path => path.nodes.forEach((n, row) => { for (let r = 1; r <= n.ranks; r++) { all++; if (nodeLv(row, r) <= lv) tree++; } }));
  for (const s of [...sk.actives, sk.passive]) for (let r = 1; r <= MAX_SKILL; r++) if (rankLv(s.unlock, r) <= lv && !(s === sk.actives[0] && r === 1)) skills++;
  for (const path of treeOf(sp)) for (let r = 2; r <= MAX_SKILL; r++) if (rankLv(path.nodes[2].skill!.unlock, r) <= lv) skills++;
  const bot = heroFor(sp, lv, 1);
  console.log(`Lv ${lv}: points earned ${lv - 1} | total sinks ${all + 31} | open at this level ${tree + skills} (tree ${tree} + skill ranks ${skills}) | spare choice ${tree + skills - (lv - 1)} | bot build leaves ${bot.skillPts} unspent`);
}
