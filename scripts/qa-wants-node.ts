import { STAGES, BONUS_STAGES } from '../src/sim/stages';
const o: any = {}; for (const s of [...STAGES, ...BONUS_STAGES]) o[s.id] = { wants: s.maps?.filter(q => q.kind === 'zone').map(q => (q.goal as any)?.wants?.map((x: any) => x.mob).join('+')).join(' | '), foe: s.mobs[0]?.kind, n: s.mobs.length, plats: s.platforms.length, w: s.width, hz: s.hazards?.length, props: s.props?.length };
console.log(JSON.stringify(o));
