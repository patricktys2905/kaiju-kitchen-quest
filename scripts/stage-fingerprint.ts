// A compact fingerprint of everything the generators lay out, so an engine-dependent or accidental change is visible.
//   npx vite-node scripts/stage-fingerprint.ts            print the fingerprints (JSON)
//   npx vite-node scripts/stage-fingerprint.ts --write    re-pin tests/stage-fingerprints.json (ONLY after a change that is
//                                                         MEANT to move stage layouts; then regenerate docs/stage-facts.md,
//                                                         re-run the sweeps and tell the story writers)
// The same module runs in the browser (scripts/stage-fingerprint-browser.mjs) and in tests/stage-fingerprint.test.ts.
import { BONUS_STAGES, STAGES, WORLDS, bossRoom } from '../src/sim/stages';
import { dailyStage, endlessFloor, perkChoices, rushStages } from '../src/sim/free';
import type { StageDef } from '../src/sim/types';

/** FNV-1a (32-bit, integer maths only) of a string, as 8 hex digits. */
export function fnv(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return (h >>> 0).toString(16).padStart(8, '0');
}

/** One stage: its headline facts in clear (so a diff reads at a glance) and a hash of EVERYTHING in the StageDef
 *  (platforms, ladders, monsters, spawn points, wanted drops, props, hazards, belts, maps, portals, objective, width). */
export function stagePrint(s: StageDef): string {
  const wants = (s.maps ?? []).filter(m => m.kind === 'zone').map(m => m.goal?.kind === 'collect' ? m.goal.wants.map(q => q.mob).join('+') : m.goal?.kind ?? '-').join('|');
  return `${fnv(JSON.stringify(s))} w${s.width} p${s.platforms.length} l${s.ladders.length} m${s.mobs.length} ${wants}`;
}

/** Daily Dungeon days (one per stage shape, across worlds) and Endless seeds that are pinned too. */
export const DAILY_DAYS = [20261101, 20261109, 20261117, 20261125, 20261203, 20261211, 20270115, 20270704];
export const ENDLESS = [[1, 1], [3, 12345], [7, 99], [10, 5], [15, 20261114], [24, 777], [40, 3]];

export function fingerprints(): Record<string, string> {
  const o: Record<string, string> = {};
  for (const s of [...STAGES, ...BONUS_STAGES]) o[s.id] = stagePrint(s);
  for (const w of WORLDS) o[`room-${w.id}`] = stagePrint(bossRoom(w.id));
  for (const d of DAILY_DAYS) o[`daily-${d}`] = stagePrint(dailyStage(d, 40 + d % 60));
  for (const [f, seed] of ENDLESS) { o[`endless-${f}-${seed}`] = stagePrint(endlessFloor(f, 50, seed)); o[`perks-${f}-${seed}`] = perkChoices(f, seed).map(p => p.id).join(','); }
  o.rush = fnv(JSON.stringify(rushStages(WORLDS.map(w => w.id), 80)));
  return o;
}

// run as a script (vite-node strips the script path from argv): not in a browser, not under vitest
if (typeof window === 'undefined' && typeof process !== 'undefined' && !process.env.VITEST) {
  const fp = fingerprints();
  if (process.argv.includes('--write')) { const fs = await import('node:fs'); fs.writeFileSync('tests/stage-fingerprints.json', JSON.stringify(fp, null, 1) + '\n'); console.log(`pinned ${Object.keys(fp).length} fingerprints in tests/stage-fingerprints.json`); }
  else console.log(JSON.stringify(fp, null, 1));
}
