// Free Play balance with the weakness multipliers switched off, for a before/after pair with scripts/free-balance.ts (same seeds):
//   npx vite-node scripts/weak-free.ts [runs]            the game before weaknesses (all six multipliers 1)
//   npx vite-node scripts/free-balance.ts [runs]         the game as it is
import { ELEMENT_TUNE } from '../src/sim/elementTune';
for (const k of Object.keys(ELEMENT_TUNE) as (keyof typeof ELEMENT_TUNE)[]) ELEMENT_TUNE[k] = 1;
await import('./free-balance');
