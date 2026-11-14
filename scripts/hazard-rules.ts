// Generator rule check: stage hazards standing on a ladder's foot (within 90) or on top of another hazard (within 300).
// npx vite-node scripts/hazard-rules.ts [stage: prints its ladders, hazards and platforms too]
import { STAGES } from '../src/sim/stages';
const one = process.argv[2];
let nl = 0, nh = 0; const bad: string[] = [];
for (const st of STAGES) {
  const hz = (st.hazards ?? []).filter(h => !h.phase2), ls = st.ladders ?? [];
  const onL = hz.filter(h => ls.some(l => Math.abs(l.x - h.x) < 90)), pairs = hz.filter((h, i) => hz.some((o, j) => j < i && Math.abs(o.x - h.x) < 300));
  nl += onL.length; nh += pairs.length;
  if (onL.length || pairs.length) bad.push(`${st.id}: by a ladder ${onL.map(h => h.x).join(',') || '-'} | on another hazard ${pairs.map(h => h.x).join(',') || '-'}`);
  if (st.id === one) { console.log('maps', st.maps?.map(m => `${m.kind} ${m.x0}-${m.x1}`).join(' | ')); console.log('ladders', ls.map(l => `${l.x}:${l.top}`).join(' ')); console.log('hazards', (st.hazards ?? []).map(h => `${h.kind}@${h.x}w${h.w}${h.phase2 ? 'p2' : ''}`).join(' ')); console.log('platforms', st.platforms.map(p => `${p.x}-${p.x + p.w}@${p.y}`).join(' ')); console.log('objective', JSON.stringify(st.objective)); }
}
console.log(bad.join('\n')); console.log(`${bad.length} stages; hazards by a ladder ${nl}, on another hazard ${nh}`);
