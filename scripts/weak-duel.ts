// Boss-room fights with and without weaknesses: every kaiju straight into each ordinary stage's boss room (skilled bot, 8 jams),
// the same seeds three ways: OFF (all six multipliers 1 = the game before weaknesses), ON (unprepared build), PREP (prepared build).
// npx vite-node scripts/weak-duel.ts <world 1-10> [seeds=3] [mode=normal|hard]   -> one line per stage x kaiju (machine readable):
//   stage foe type kaiju | per mode: wins/seeds, mean seconds to kill (wins only), jams used, share of the fight the foe was frozen / glued / bubbled
// Summed up by scripts/weak-duel-sum.mjs. The bot plays the same in all three (it never looks at elements).
import { Bot, SKILLED } from '../src/sim/bot';
import { CLASSES } from '../src/sim/classes';
import { ELEMENT_TUNE } from '../src/sim/elementTune';
import { stageElements, typeOf } from '../src/sim/elements';
import { MOBS, nemesisOf } from '../src/sim/mobs';
import { STAGES } from '../src/sim/stages';
import { derive } from '../src/sim/stats';
import { World } from '../src/sim/world';
import { heroFor } from './hero-at';
const wd = Number(process.argv[2] ?? 1), SEEDS = Number(process.argv[3] ?? 3), HARD = process.argv[4] === 'hard';
const ON = { ...ELEMENT_TUNE };
if (process.env.ELTUNE) { const v = process.env.ELTUNE.split(',').map(Number); [ON.weakDmg, ON.weakStatus, ON.resistDmg, ON.resistStatus, ON.bossWeakDmg, ON.bossResistDmg] = v; }
const set = (on: boolean) => { for (const k of Object.keys(ON) as (keyof typeof ON)[]) ELEMENT_TUNE[k] = on ? ON[k] : 1; };
for (const st of STAGES.filter(s => s.world === wd && !s.boss && /^\d+-\d+$/.test(s.id))) for (const c of CLASSES) {
  const foe = stageElements(st, c.species).boss; if (!foe) continue;
  const out: string[] = [];
  for (const mode of ['off', 'on', 'prep'] as const) {
    set(mode !== 'off');
    let wins = 0, t = 0, jams = 0, cc = 0, tt = 0;
    for (let r = 0; r < SEEDS; r++) {
      const w = new World(st, derive(heroFor(c.species, st.rec + (HARD ? 3 : 0), r + 1, mode === 'prep' ? st : undefined, process.env.PREPARED === 'weapon' ? 'weapon' : 'full')), 100 + r, [{ id: 'jam', n: 8 }, null, null, null], 0, HARD, undefined, [], nemesisOf(c.species));
      w.skipToBoss();
      const bot = new Bot(w, SKILLED, 7 + r), f = w.mobs[0];
      let i = 0, held = 0;
      for (; i < 60 * 300 && !w.cleared && !w.failed && f.state !== 'dead'; i++) { w.step(bot.think()); if (f.frozen > 0 || f.glued > 0) held++; }
      if (f.state === 'dead') { wins++; t += i / 60; }
      jams += 8 - (w.hero.bag[0]?.n ?? 0); cc += held; tt += i;
    }
    out.push(`${mode} ${wins}/${SEEDS} ${wins ? (t / wins).toFixed(1) : '-'} ${(jams / SEEDS).toFixed(2)} ${(cc / Math.max(1, tt)).toFixed(3)}`);
  }
  console.log([st.id, foe.kind, typeOf(foe.kind), c.name.split(' ')[0], ...out].join(' | '));
}
set(true);
