// QA: wanted drops per map of World 11 stages, live tree vs the QA snapshot
import { STAGES as A } from '../src/sim/stages';
import { STAGES as B } from '../shots/qa2/snap/src/sim/stages';
const f = (S: typeof A, id: string) => S.find(s => s.id === id)!.maps!.filter(m => m.kind === 'zone').map(m => (m.goal as any).wants.map((q: any) => q.mob).join('+')).join(' | ');
for (const id of ['11-1', '11-3', '11-4', '11-6', '1-1', '5-4']) console.log(id, 'live:', f(A, id), '  snap:', f(B, id));
