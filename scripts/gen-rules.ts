// Generator rules over every story / secret stage and two years of Daily Dungeons: every platform reachable (jump from
// the ground or a reachable ledge, a ladder, or a sponge for a secret ledge), sponges under open sky and away from ladders.
// npx vite-node scripts/gen-rules.ts     (prints the stages that break a rule; tests/scroll.test.ts runs the same check)
import { CLASSES } from '../src/sim/classes';
import { dailyStage } from '../src/sim/free';
import { BONUS_STAGES, STAGES } from '../src/sim/stages';
import type { StageDef } from '../src/sim/types';
import { GRAVITY } from '../src/sim/world';

export function genRuleBreaks(st: StageDef, minJump: number): string[] {
  const bad: string[] = [], reach = new Set<number>();
  for (let grew = true; grew;) {
    grew = false;
    st.platforms.forEach((p, i) => {
      if (reach.has(i)) return;
      const fromGround = st.groundY - p.y <= minJump;
      const byLadder = st.ladders.some(l => l.top === p.y && l.x >= p.x && l.x <= p.x + p.w);
      const fromPlat = [...reach].some(j => { const q = st.platforms[j]; return q.y - p.y <= minJump && q.y > p.y && q.x < p.x + p.w + 120 && p.x < q.x + q.w + 120; });
      const bySponge = !!p.secret && !!st.props?.some(o => o.kind === 'sponge' && o.x >= p.x && o.x <= p.x + p.w);
      if (fromGround || byLadder || fromPlat || bySponge) { reach.add(i); grew = true; }
    });
  }
  st.platforms.forEach((p, i) => { if (!reach.has(i)) bad.push(`platform ${p.x}-${p.x + p.w}@${p.y} out of reach`); });
  for (const p of st.props ?? []) {
    if (p.kind !== 'sponge') continue;
    for (const q of st.platforms) if (!q.secret && p.x > q.x - 60 && p.x < q.x + q.w + 60) bad.push(`sponge at ${p.x} under platform ${q.x}-${q.x + q.w}@${q.y}`);
    if (st.ladders.some(l => Math.abs(l.x - p.x) < 80)) bad.push(`sponge at ${p.x} by a ladder`);
  }
  for (const m of st.maps ?? []) for (const pt of m.portals) {
    if (st.ladders.some(l => Math.abs(l.x - pt.x) < 70)) bad.push(`ladder on the portal at ${pt.x}`);
  }
  return bad;
}
export const MIN_JUMP = (gravity = GRAVITY) => Math.min(...CLASSES.map(c => c.jump * c.jump / (2 * gravity))) - 8;
export function twoYearsOfDailies(lv = 30): StageDef[] { const out: StageDef[] = []; for (let y = 2026; y <= 2027; y++) for (let m = 1; m <= 12; m++) for (let d = 1; d <= 28; d++) out.push(dailyStage(y * 10000 + m * 100 + d, lv)); return out; }

if (typeof process !== 'undefined' && !process.env.VITEST) {
  let n = 0, broke = 0;
  for (const st of [...STAGES, ...BONUS_STAGES, ...twoYearsOfDailies()]) { n++; const bad = genRuleBreaks(st, MIN_JUMP()); if (bad.length) { broke++; console.log(st.id, st.name, bad.join('; ')); } }
  console.log(`${n} stages checked, ${broke} break a rule`);
}
