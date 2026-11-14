// For the writers: which pre-stage scenes name a monster or a drop that the stage's exits do NOT ask for (any more)?
// npx vite-node scripts/story-wants-check.ts [old-wants.json]     old wants (optional): shots/fy/wants-old.json, to mark
// the lines that were right before stage layouts moved. Reads every kaiju's story; prints stage, beat, kaiju, the name, the line.
import fs from 'node:fs';
import { MOBS } from '../src/sim/mobs';
import { STAGES, WORLDS } from '../src/sim/stages';
import { dropName } from '../src/sim/drops';
import { STORIES, beatBefore } from '../src/story/stories';
import { CLASSES } from '../src/sim/classes';
import type { MobKind } from '../src/sim/types';

const old: Record<string, { wants: string }> = process.argv[2] ? JSON.parse(fs.readFileSync(process.argv[2], 'utf8')) : {};
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
let flagged = 0, wasRight = 0; const perWorld: Record<number, number> = {}; const seen = new Set<string>();
for (const st of STAGES) {
  const w = WORLDS[st.world - 1], zones = st.maps!.filter(m => m.kind === 'zone');
  const now = new Set(zones.flatMap(m => m.goal?.kind === 'collect' ? m.goal.wants.map(q => q.mob) : []));
  const was = new Set((old[st.id]?.wants ?? '').split(/[|+ ]+/).filter(Boolean));
  const kinds = [...new Set([...w.pool.map(([, k]) => k), ...was] as MobKind[])];
  for (const beat of beatBefore(st.id, false)) for (const c of CLASSES) {
    const lines = (STORIES[c.species]?.beats as Record<string, [unknown, string][]>)?.[beat] ?? [];
    for (const [, text] of lines) for (const k of kinds) {
      if (now.has(k) || !MOBS[k]) continue;
      for (const name of [MOBS[k].name, dropName(k)].filter(Boolean)) {
        if (!new RegExp(`\\b${esc(name)}s?\\b`, 'i').test(text)) continue;
        const key = `${st.id}|${beat}|${k}|${text}`; if (seen.has(key)) continue; seen.add(key);
        flagged++; perWorld[st.world] = (perWorld[st.world] ?? 0) + 1; if (was.has(k)) wasRight++;
        console.log(`${st.id.padEnd(6)} ${beat.padEnd(10)} ${c.name.split(' ')[0].padEnd(12)} names "${name}" (${k})${was.has(k) ? '  [was wanted before the fix]' : '  [not wanted before either]'}  now wanted: ${[...now].join('+')}\n         "${text}"`);
      }
    }
  }
}
console.log(`\n${flagged} lines name a monster / drop of the world that the stage's exits do not ask for; ${wasRight} of them were right before the layouts moved. Per world: ${JSON.stringify(perWorld)}`);
