// Stage challenges (Lunia style): every story stage has 3 optional challenges. Each pays out once (crumbs and a box),
// and gives a star; 15 stars in a world also open that world's secret stage (the key in stage 7's chest still works).
import type { RunStats } from './world';

export interface ChallengeCtx {
  run: RunStats; rank: 'S' | 'A' | 'B' | 'C' | 'D'; par: number;
  /** hits taken in the boss room */ bossHits: number;
}
export interface Challenge { id: string; name: string; desc: string; done: (c: ChallengeCtx) => boolean }
/** The challenges of a stage that this clear meets. A SKIP TO BOSS run meets none: stars are for the whole stage. */
export function challengesMet(stageId: string, c: ChallengeCtx): Challenge[] { return c.run.skipped ? [] : challengesFor(stageId).filter(x => x.done(c)); }

/** Perfect dodges "Slippery" asks for. 12 was met 3 times in 7,169 skilled-bot clears; 4 is met in about 12% (3: 22%, 5: 6%). */
export const SLIPPERY_DODGES = 4;

export const CHALLENGES: Challenge[] = [
  { id: 'nojam', name: 'Iron Belly', desc: 'Clear without drinking a jam', done: c => (c.run.heals ?? 0) === 0 },
  { id: 'srank', name: 'Star Chef', desc: 'Clear with rank S', done: c => c.rank === 'S' },
  { id: 'arank', name: 'Top Marks', desc: 'Clear with rank A or better', done: c => c.rank === 'S' || c.rank === 'A' },
  { id: 'fast', name: 'Express Order', desc: 'Clear before the par time', done: c => c.run.time <= c.par },
  { id: 'combo', name: 'Combo Cook', desc: 'Land a 40-hit combo', done: c => c.run.maxCombo >= 40 },
  { id: 'dodge', name: 'Slippery', desc: `Make ${SLIPPERY_DODGES} perfect dodges`, done: c => c.run.perfects >= SLIPPERY_DODGES },
  { id: 'boss', name: 'Untouchable', desc: 'Take 3 hits or fewer in the boss room', done: c => c.bossHits <= 3 },
  { id: 'onejam', name: 'Light Snack', desc: 'Clear drinking at most 1 jam', done: c => (c.run.heals ?? 0) <= 1 },
];
const BY_ID = Object.fromEntries(CHALLENGES.map(c => [c.id, c]));

// The two tiers, by how often a skilled run meets each (scripts/rank-rescore.ts, 7,169 clears): easy = Light Snack 26%,
// Top Marks 71%, Combo Cook 80%, Express Order 80%; hard = Iron Belly 16%, Star Chef 17%, Slippery 12%, Untouchable 18%.
// A hard one pays a better box. ('fast' and 'dodge' swapped tiers on 2026-11-14: they kept their places in the two lists,
// so a stage that had one now has the other and nothing else moved; keepStars carries an earned star over.)
const EASY = ['onejam', 'arank', 'combo', 'fast'], HARD = ['nojam', 'srank', 'dodge', 'boss'];
export const isHardChallenge = (id: string): boolean => HARD.includes(id);

/** Stages where rank S stays under 4% of skilled clears with the per-monster rank (11 of 100): "Star Chef" would be a star
 *  almost nobody gets, so those stages ask for something else (the first of STAR_CHEF_SWAP the stage doesn't have yet). */
export const NO_STAR_CHEF = new Set(['3-3', '6-1', '6-2', '6-5', '6-6', '6-7', '7-1', '7-2', '9-1', '9-3', '10-1']);
const STAR_CHEF_SWAP = ['arank', 'boss', 'dodge', 'combo'];
const MOVED: Record<string, string | undefined> = { fast: 'dodge', dodge: 'fast' };

/** A stage's 3 challenges (the same every time; harder ones later in a world). */
export function challengesFor(stageId: string): Challenge[] {
  const [w, n] = stageId.split('-').map(Number);
  if (!w || !n) return [];
  let s = (w * 131 + n * 17) >>> 0;
  const r = () => { s = (s * 1103515245 + 12345) >>> 0; return s / 4294967296; };
  const pick = (a: string[], k: number) => { const c = [...a]; const out: string[] = []; while (out.length < k) out.push(c.splice(Math.floor(r() * c.length), 1)[0]); return out; };
  const ids = n <= 3 ? [...pick(EASY, 2), ...pick(HARD, 1)] : [...pick(EASY, 1), ...pick(HARD, 2)];
  // never both no-jam challenges on one stage
  if (ids.includes('nojam') && ids.includes('onejam')) ids[ids.indexOf('onejam')] = EASY.find(e => !ids.includes(e) && e !== 'onejam')!;
  if (NO_STAR_CHEF.has(stageId) && ids.includes('srank')) ids[ids.indexOf('srank')] = STAR_CHEF_SWAP.find(e => !ids.includes(e))!;
  return ids.map(id => BY_ID[id]);
}

/** Stars already earned stay earned when a stage's challenge list changes: a saved star whose challenge is no longer on its
 *  stage moves onto a challenge the stage has now and the player hasn't done (so it still shows, still counts towards the
 *  secret stage, and that challenge is not paid a second time). Run on every load; does nothing once the save is tidy. */
export function keepStars(saved: Record<string, string[]> | undefined): Record<string, string[]> | undefined {
  if (!saved) return saved;
  for (const [stageId, done] of Object.entries(saved)) {
    if (!Array.isArray(done)) { delete saved[stageId]; continue; }
    const now = challengesFor(stageId).map(c => c.id);
    if (!now.length) continue; // not a story stage: leave it alone
    const out = [...new Set(done.filter(id => now.includes(id)))];
    for (const id of done) {
      if (now.includes(id)) continue;
      const open = now.filter(x => !out.includes(x));
      // the challenge that took its place: Express Order <-> Slippery, Star Chef -> its stand-in; failing that, any open one
      const to = [MOVED[id], ...(id === 'srank' ? STAR_CHEF_SWAP : [])].find(x => x && open.includes(x)) ?? open[0];
      if (to) out.push(to);
    }
    saved[stageId] = out;
  }
  return saved;
}

/** Stars needed in a world to open its secret stage without the key. */
export const STARS_FOR_SECRET = 15;
