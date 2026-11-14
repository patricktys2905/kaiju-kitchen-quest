// The Market's item level at the end of each world: the old formula (12 levels a world) vs the stage data.
// npx vite-node scripts/market-lv.ts
import { BONUS_STAGES, STAGES, WORLDS } from '../src/sim/stages';
const old = (id: string) => { const m = /^(\d+)-(\d+)$/.exec(id), b = /^S-(\d+)$/.exec(id); return m ? (Number(m[1]) - 1) * 12 + Number(m[2]) + 1 : b ? (Number(b[1]) - 1) * 12 + 9 : 0; };
const neu = (id: string) => { const st = STAGES.find(q => q.id === id); if (st) return st.rec + 1; const b = BONUS_STAGES.find(q => q.id === id); return b ? b.rec - 1 : 0; };
console.log('world  after W-1 (old -> new)  after W-10 (old -> new)  boss rec Lv  after S-W (old -> new)');
for (const w of WORLDS) { const a = `${w.id}-1`, z = `${w.id}-10`, s = `S-${w.id}`; console.log(`${String(w.id).padEnd(5)}  ${old(a)} -> ${neu(a)}`.padEnd(30), `${old(z)} -> ${neu(z)}`.padEnd(24), String(STAGES.find(q => q.id === z)!.rec).padEnd(12), `${old(s)} -> ${neu(s)}`); }
