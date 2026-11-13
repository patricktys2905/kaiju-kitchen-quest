// Guard Break against boss-room foes, with and without weaknesses (the balance bot never Guard Breaks, so the sweeps can't see it).
// Each kaiju goes straight into the boss room with no skills and no gear skill, pressing either only plain combos ("combo") or
// only Guard Breaks (DOWN + attack, "gb"); the same seeds with the six multipliers at 1 (OFF) and as they are (ON).
// npx vite-node scripts/weak-gb.ts [stages... default: every Slippery room foe + four Crusty ones] [KAIJU=0,2,8,14 env]
// Prints per foe: seconds to the first armour crack and to the kill, for combo / gb x OFF / ON.
import { Bot, SKILLED } from '../src/sim/bot';
import { CLASSES } from '../src/sim/classes';
import { ELEMENT_TUNE } from '../src/sim/elementTune';
import { stageElements, typeOf } from '../src/sim/elements';
import { MOBS, nemesisOf } from '../src/sim/mobs';
import { STAGES } from '../src/sim/stages';
import { derive } from '../src/sim/stats';
import { World } from '../src/sim/world';
import { heroFor } from './hero-at';
const ON = { ...ELEMENT_TUNE };
if (process.env.ELTUNE) { const v = process.env.ELTUNE.split(',').map(Number); [ON.weakDmg, ON.weakStatus, ON.resistDmg, ON.resistStatus, ON.bossWeakDmg, ON.bossResistDmg] = v; }
const set = (on: boolean) => { for (const k of Object.keys(ON) as (keyof typeof ON)[]) ELEMENT_TUNE[k] = on ? ON[k] : 1; };
const SP = (process.env.KAIJU ?? '0,2,8,14').split(',').map(Number);
const ids = process.argv.slice(2).length ? process.argv.slice(2)
  : STAGES.filter(s => /^\d+-\d+$/.test(s.id)).filter(s => { const f = stageElements(s).boss; return f && (typeOf(f.kind) === 'SLIPPERY' || ['1-2', '4-1', '7-3', '10-10'].includes(s.id)); }).map(s => s.id);
const tot: Record<string, { crack: number; kill: number; n: number; wins: number }> = {};
for (const id of ids) {
  const st = STAGES.find(s => s.id === id)!; const foe = stageElements(st).boss!;
  const cells: string[] = [];
  for (const how of ['combo', 'gb'] as const) for (const on of [false, true]) {
    set(on);
    let crack = 0, kill = 0, wins = 0, n = 0, cr = 0;
    for (const sp of SP) for (let r = 0; r < 2; r++) {
      const w = new World(st, derive(heroFor(sp, st.rec, r + 1)), 100 + r, [{ id: 'jam', n: 8 }, null, null, null], 0, false, undefined, [], undefined);
      w.skipToBoss();
      const bot = new Bot(w, SKILLED, 7 + r), f = w.mobs[0];
      let i = 0, first = -1;
      for (; i < 60 * 240 && !w.cleared && !w.failed && f.state !== 'dead'; i++) {
        const inp = bot.think(); inp.skill1 = inp.skill2 = inp.skill3 = false; inp.gear = false; (inp as { ult?: boolean }).ult = false;
        if (how === 'gb' && inp.attack && w.hero.ground) inp.down = true;
        for (const e of w.step(inp)) if (e.t === 'armorBreak' && first < 0) first = i / 60;
      }
      n++; if (f.state === 'dead') { wins++; kill += i / 60; } if (first >= 0) { crack += first; cr++; }
    }
    const key = `${typeOf(foe.kind)} ${how} ${on ? 'ON' : 'OFF'}`; const t = (tot[key] ??= { crack: 0, kill: 0, n: 0, wins: 0 });
    t.crack += cr ? crack / cr : 0; t.kill += wins ? kill / wins : 240; t.n++; t.wins += wins / n;
    cells.push(`${how} ${on ? 'ON ' : 'OFF'} crack ${cr ? (crack / cr).toFixed(0) : '-'}s kill ${wins ? (kill / wins).toFixed(0) : '-'}s ${wins}/${n}`);
  }
  console.log(`${id.padEnd(5)} ${MOBS[foe.kind].name.padEnd(24)} ${typeOf(foe.kind).padEnd(8)} | ${cells.join(' | ')}`);
}
set(true);
for (const [k, t] of Object.entries(tot)) console.log(`${k.padEnd(20)} foes ${t.n}  first armour crack ${(t.crack / t.n).toFixed(1)}s  kill ${(t.kill / t.n).toFixed(1)}s  wins ${(t.wins / t.n * 100).toFixed(0)}%`);
