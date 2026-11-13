// Throwaway (design research for docs/WEAKNESS-DESIGN.md): dump every monster kind by world and each stage's monster set.
import { MOBS } from '../src/sim/mobs';
import { WORLDS, ROOM_FOES, STAGES } from '../src/sim/stages';
import type { MobKind } from '../src/sim/types';

const seen = new Set<string>();
const d = (k: string) => { const m = (MOBS as any)[k]; seen.add(k); return `${k}=${m?.name}[${m?.brain}${m?.calls ? ' calls ' + m.calls : ''}${m?.split ? ' split ' + m.split : ''}${m?.nem?.calls ? ' ncalls ' + m.nem.calls : ''}${m?.shield ? ' shield' : ''}${m?.armor ? ' armor' : ''}]`; };
for (const w of WORLDS) {
  console.log(`\n== W${w.id} ${w.name}`);
  console.log(' pool:', w.pool.map(([n, k]) => `${n}:${d(k)}`).join(' | '));
  console.log(' room:', ROOM_FOES[w.id].map(d).join(' | '));
  console.log(' elite:', d(w.elite), ' boss:', d(w.boss), ' mimic:', d(w.mimic));
}
console.log('\n== stages (spawn kinds per stage; room foe)');
for (const s of STAGES) {
  const kinds = new Set<MobKind>();
  for (const mp of s.maps ?? []) for (const k of mp.spawns?.kinds ?? []) kinds.add(k);
  const room = s.mobs.filter(m => m.wake).map(m => m.kind);
  const other = s.mobs.filter(m => !m.wake).map(m => m.kind).filter(k => !kinds.has(k));
  console.log(` ${s.num}: ${[...kinds].join(',')} | room ${room.join(',')}${other.length ? ' | placed ' + [...new Set(other)].join(',') : ''}`);
}
console.log('\n== not referenced above');
for (const k of Object.keys(MOBS)) if (!seen.has(k)) console.log(' ', d(k));
console.log('\ntotal kinds', Object.keys(MOBS).length);
