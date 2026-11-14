// Is there anything left to spend skill points on? (Skills tab badge and its "points to spend" line.)
import { MAX_SKILL, skillsOf } from '../sim/skills';
import { type HeroProfile, canLevelSkill } from '../sim/stats';
import { allActives, canLearn, rankOf, treeOf } from '../sim/tree';

/** 'now': a tree node or a skill rank can be bought right now · 'later': nothing yet, but some open at a higher hero
 *  level (or need another node first) · 'done': every node and every skill rank is full: spare points have no use. */
export type SkillSpend = 'now' | 'later' | 'done';

export function skillSpend(p: HeroProfile): SkillSpend {
  const nodes = treeOf(p.species).flatMap(t => t.nodes);
  const sk = skillsOf(p.species);
  const ranked = [...allActives(p.species), sk.passive]; // the ranks the Skills page sells: every active (its own and the tree's) and the passive
  if (nodes.some(n => canLearn(p, n.id)) || ranked.some(s => canLevelSkill(p, s.id))) return 'now';
  const full = nodes.every(n => rankOf(p, n.id) >= n.ranks) && ranked.every(s => (p.skills[s.id] ?? 0) >= MAX_SKILL);
  return full ? 'done' : 'later';
}

/** The number on the Skills tab (and what lights a kaiju's "has points" dot): unspent points, but only while they can be spent. */
export const skillBadge = (p: HeroProfile): number => (p.skillPts > 0 && skillSpend(p) === 'now' ? p.skillPts : 0);

/** The line beside the TREE / SKILLS buttons: [text, highlighted?]. */
export function skillPointsLine(p: HeroProfile): [string, boolean] {
  const n = p.skillPts, pts = `${n} point${n === 1 ? '' : 's'}`;
  if (!n) return ['0 points to spend', false];
  const s = skillSpend(p);
  return s === 'now' ? [`${pts} to spend`, true] : s === 'done' ? [`Everything learned! ${n} spare point${n === 1 ? '' : 's'}`, false] : [`${pts} saved: more opens as you level up`, false];
}
