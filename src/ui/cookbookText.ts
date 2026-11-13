// Monster Cookbook wording (pure: no save, no DOM), shared by the Cookbook screen (src/ui/cookbook.ts), the camp toast
// and the online lobby. Rewards are crumbs, stamps, gold card borders and titles only (docs/DROPS-USES.md, rule B1).
import { type CookReward, type HandInResult, type PaidReward, cookbook, titleName } from '../sim/cookbook';
import { dropName } from '../sim/drops';
import { MOBS } from '../sim/mobs';
import type { MobKind } from '../sim/types';

/** '★☆' for 1 of 2. */
export const starText = (n: number, of = 2): string => '★'.repeat(Math.max(0, Math.min(of, n))) + '☆'.repeat(Math.max(0, of - Math.max(0, n)));

/** What a reward gives, in a few words: "🍪 500 + chef stamp", "🍪 2000 + gold stamp + title Fridge Cook". */
export function rewardLine(r: CookReward): string {
  const parts: string[] = [];
  if (r.crumbs) parts.push(`🍪 ${r.crumbs}`);
  if (r.border) parts.push('gold border');
  if (r.stamp) parts.push(r.stamp === 'gold' ? 'gold stamp' : 'chef stamp');
  if (r.title) parts.push(`title ${titleName(r.title)}`);
  return parts.join(' + ');
}

/** The name on a card's level: 1 Discovered, 2 ★, 3 ★★. */
export const levelName = (level: number): string => (level >= 3 ? '★★' : level === 2 ? '★' : level === 1 ? 'found' : 'unknown');

const pageName = (id: string): string => cookbook().pages.find(p => p.id === id)?.name ?? `World ${id}`;
const mobName = (kind: string): string => MOBS[kind as MobKind]?.name ?? kind;

export interface PaidSummary {
  /** drops taken from the bag in all, and crumbs paid in all */
  handed: number; crumbs: number;
  /** page and book rewards among them (the screen plays its flourish for these) */
  pages: PaidReward[]; book: boolean;
  /** titles earned now (names) */
  titles: string[];
  /** the toast line ('' when nothing was handed in) */
  text: string;
}

/** One toast line for one hand-in or a whole "hand in all spares": what went in and everything it paid. */
export function paidSummary(results: readonly HandInResult[]): PaidSummary {
  const done = results.filter(r => r.handed > 0);
  const handed = done.reduce((a, r) => a + r.handed, 0), crumbs = done.reduce((a, r) => a + r.crumbs, 0);
  const paid = done.flatMap(r => r.paid);
  const pages = paid.filter(p => p.source === 'page'), book = paid.some(p => p.source === 'book');
  const titles = paid.filter(p => p.reward.title).map(p => titleName(p.reward.title));
  if (!handed) return { handed, crumbs, pages, book, titles, text: '' };
  const parts: string[] = [done.length === 1 ? `📖 Handed in ${handed} ${dropName(done[0].kind as MobKind)}` : `📖 Handed in ${handed} drops`];
  if (crumbs) parts.push(`+🍪 ${crumbs}`);
  // each card's best new level (a card can jump two levels in one hand-in)
  const cards = done.filter(r => r.to > r.from);
  if (cards.length && cards.length <= 2) parts.push(...cards.map(r => `${mobName(r.kind)} ${levelName(r.to)}${r.to >= 3 ? ' (gold border)' : ''}`));
  else if (cards.length) parts.push(`${cards.length} cards up`);
  for (const p of pages) parts.push(`${pageName(p.id)} page ${p.level >= 2 ? '★★: gold stamp' : '★: chef stamp'}`);
  for (const t of titles) parts.push(`new title: ${t}`);
  return { handed, crumbs, pages, book, titles, text: parts.join(' · ') };
}

/** "3-2", "3-2 and 3-4", "3-2, 3-4 and 3-7": the stages named in the SKIP TO BOSS warning. */
export function listText(names: readonly string[]): string {
  return names.length <= 1 ? names.join('') : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}
