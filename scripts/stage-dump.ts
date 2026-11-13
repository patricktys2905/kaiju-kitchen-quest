// Every generated stage as JSON, one per line (to diff stage generation before / after a change):
// npx vite-node scripts/stage-dump.ts > shots/stages.jsonl
import { dailyStage } from '../src/sim/free';
import { BONUS_STAGES, STAGES } from '../src/sim/stages';
for (const st of [...STAGES, ...BONUS_STAGES, ...[20261101, 20261113, 20261225].map(d => dailyStage(d, 30))]) console.log(JSON.stringify(st));
