// Throwaway (docs/DROPS-USES.md): Cookbook pages from data, drop totals and crumb reward totals. npx vite-node scripts/drops-pages.ts
import { DROPS } from '../src/sim/drops';
import { mobCrumbs } from '../src/sim/mobs';
import { STAGES, WORLDS } from '../src/sim/stages';
const wanted = new Set<string>();
for (const s of STAGES.filter(x => /^\d+-\d+$/.test(x.id))) for (const m of s.maps ?? []) if (m.goal?.kind === 'collect') for (const q of m.goal.wants) wanted.add(q.mob);
const seen = new Set<string>(); let one = 0, two = 0, crumbs = 0, cards = 0;
for (const w of WORLDS) {
  const kinds = [...w.pool.map(([, k]) => k as string), w.mimic as string].filter(k => (DROPS as Record<string, unknown>)[k] && !seen.has(k));
  kinds.forEach(k => seen.add(k)); if (!kinds.length) continue;
  const unw = kinds.filter(k => !wanted.has(k)).length;
  const d1 = (kinds.length - unw) * 5 + unw * 3, d2 = (kinds.length - unw) * 12 + unw * 8;
  const st = STAGES.filter(s => s.world === w.id && /^\d+-\d+$/.test(s.id)); const lv = st.reduce((a, s) => a + (s.lv[0] + s.lv[1]) / 2, 0) / st.length;
  const clear = Math.round(mobCrumbs(Math.round(lv), 'walker') * 55);
  const card = (20 + 10 * w.id) + (60 + 30 * w.id) + 150 * w.id, page = 500 * w.id + 1000 * w.id, tot = kinds.length * card + page;
  one += d1; two += d2; crumbs += tot; cards += kinds.length;
  console.log(`W${w.id} cards ${kinds.length} (never wanted ${unw}) drops 1-star ${d1} 2-star ${d2} | est clear ${clear} crumbs | page total ${tot} = ${(tot / clear).toFixed(1)} clears`);
}
console.log('cards', cards, 'of', Object.keys(DROPS).length, 'one star', one, 'two stars', two, 'crumbs', crumbs);
