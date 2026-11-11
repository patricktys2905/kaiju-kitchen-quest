// Stage challenges (Lunia style): every story stage has 3 optional challenges. Each pays out once (crumbs and a box),
// and gives a star; 15 stars in a world also open that world's secret stage (the key in stage 7's chest still works).
import type { RunStats } from './world';

export interface ChallengeCtx {
  run: RunStats; rank: 'S' | 'A' | 'B' | 'C' | 'D'; par: number;
  /** hits taken in the boss room */ bossHits: number;
}
export interface Challenge { id: string; name: string; desc: string; done: (c: ChallengeCtx) => boolean }

export const CHALLENGES: Challenge[] = [
  { id: 'nojam', name: 'Iron Belly', desc: 'Clear without drinking a jam', done: c => (c.run.heals ?? 0) === 0 },
  { id: 'srank', name: 'Star Chef', desc: 'Clear with rank S', done: c => c.rank === 'S' },
  { id: 'arank', name: 'Top Marks', desc: 'Clear with rank A or better', done: c => c.rank === 'S' || c.rank === 'A' },
  { id: 'fast', name: 'Express Order', desc: 'Clear before the par time', done: c => c.run.time <= c.par },
  { id: 'combo', name: 'Combo Cook', desc: 'Land a 40-hit combo', done: c => c.run.maxCombo >= 40 },
  { id: 'dodge', name: 'Slippery', desc: 'Make 12 perfect dodges', done: c => c.run.perfects >= 12 },
  { id: 'boss', name: 'Untouchable', desc: 'Take 3 hits or fewer in the boss room', done: c => c.bossHits <= 3 },
  { id: 'onejam', name: 'Light Snack', desc: 'Clear drinking at most 1 jam', done: c => (c.run.heals ?? 0) <= 1 },
];
const BY_ID = Object.fromEntries(CHALLENGES.map(c => [c.id, c]));

/** A stage's 3 challenges (the same every time; harder ones later in a world). */
export function challengesFor(stageId: string): Challenge[] {
  const [w, n] = stageId.split('-').map(Number);
  if (!w || !n) return [];
  const easy = ['onejam', 'arank', 'combo', 'dodge'], hard = ['nojam', 'srank', 'fast', 'boss'];
  let s = (w * 131 + n * 17) >>> 0;
  const r = () => { s = (s * 1103515245 + 12345) >>> 0; return s / 4294967296; };
  const pick = (a: string[], k: number) => { const c = [...a]; const out: string[] = []; while (out.length < k) out.push(c.splice(Math.floor(r() * c.length), 1)[0]); return out; };
  const ids = n <= 3 ? [...pick(easy, 2), ...pick(hard, 1)] : n <= 7 ? [...pick(easy, 1), ...pick(hard, 2)] : [...pick(easy, 1), ...pick(hard, 2)];
  // never both no-jam challenges on one stage
  if (ids.includes('nojam') && ids.includes('onejam')) ids[ids.indexOf('onejam')] = easy.find(e => !ids.includes(e) && e !== 'onejam')!;
  return ids.map(id => BY_ID[id]);
}

/** Stars needed in a world to open its secret stage without the key. */
export const STARS_FOR_SECRET = 15;
