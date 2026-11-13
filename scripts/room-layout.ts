// Platforms and ladders of one map of a stage (default: the boss room): npx vite-node scripts/room-layout.ts <stage> [mapIndex]
import { STAGES } from '../src/sim/stages';
const st = STAGES.find(s => s.id === process.argv[2])!, maps = st.maps ?? [], mi = process.argv[3] ? +process.argv[3] : maps.length - 1, m = maps[mi];
console.log(st.id, 'map', mi, m.kind, Math.round(m.x0), '-', Math.round(m.x1), 'groundY', st.groundY);
console.log('platforms', st.platforms.map((p, i) => ({ ...p, i })).filter(p => p.x + p.w > m.x0 && p.x < m.x1).map(p => `#${p.i} ${Math.round(p.x)}-${Math.round(p.x + p.w)}@${p.y}${p.secret ? 's' : ''}${p.move ? 'm' : ''}`).join('  '));
console.log('ladders', st.ladders.filter(l => l.x > m.x0 && l.x < m.x1).map(l => `${l.x}:${l.top}-${l.bottom}`).join('  '));
console.log('hazards', (st.hazards ?? []).filter(h => h.x > m.x0 && h.x < m.x1).map(h => `${h.kind}@${Math.round(h.x)}`).join(' '));
