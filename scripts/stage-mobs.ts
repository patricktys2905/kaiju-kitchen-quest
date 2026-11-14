// Which monster kinds are in each stage (for the story editor): per map the wanted kinds, the other kinds that spawn
// there (respawns pick from these), and how many of each stand there at the start. npx vite-node scripts/stage-mobs.ts [world=11]
import { MOBS } from '../src/sim/mobs';
import { STAGES } from '../src/sim/stages';
const wd = process.argv[2] ?? '11';
for (const s of STAGES.filter(q => q.id.startsWith(wd + '-'))) {
  const all = new Set<string>();
  const lines = s.maps!.filter(m => m.kind === 'zone').map((m, i) => {
    const want = m.goal?.kind === 'collect' ? m.goal.wants.map(q => q.mob as string) : [];
    const kinds = [...new Set(m.spawns?.kinds ?? [])] as string[];
    const start: Record<string, number> = {};
    for (const mob of s.mobs.slice(1)) if (mob.x >= m.x0 && mob.x < m.x1) start[MOBS[mob.kind].name] = (start[MOBS[mob.kind].name] ?? 0) + 1;
    kinds.forEach(k => all.add(k)); s.mobs.slice(1).filter(mob => mob.x >= m.x0 && mob.x < m.x1).forEach(mob => all.add(mob.kind));
    return `  map ${i + 1}: wanted ${want.map(k => MOBS[k as keyof typeof MOBS].name).join(', ')} | also spawning ${kinds.filter(k => !want.includes(k)).map(k => MOBS[k as keyof typeof MOBS].name).join(', ')} | at the start: ${Object.entries(start).map(([k, n]) => `${n} ${k}`).join(', ')}`;
  });
  console.log(`${s.id} ${s.name}: boss room ${MOBS[s.mobs[0].kind].name}. Kinds present: ${[...all].map(k => MOBS[k as keyof typeof MOBS].name).join(', ')}`);
  console.log(lines.join('\n'));
}
