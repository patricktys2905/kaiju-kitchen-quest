// Replay one chaos run (as reported by scripts/chaos.ts) and print the frames just before the first broken rule.
// npx vite-node scripts/chaos-trace.ts <stage> <species> <seed> [seconds=60] [rule]
import { ChaosBot, checkWorld } from '../src/sim/chaos';
import { BONUS_STAGES, STAGES } from '../src/sim/stages';
import { derive } from '../src/sim/stats';
import { World } from '../src/sim/world';
import { heroFor } from './hero-at';

const [id, spS, seedS, secS, rule] = process.argv.slice(2);
const sp = Number(spS), s = Number(seedS), seconds = Number(secS ?? 60);
const st = [...STAGES, ...BONUS_STAGES].find(x => x.id === id)!;
// the same set-up as scripts/chaos.ts / chaosRun
const w = new World(st, derive(heroFor(sp, st.rec + 2, s)), s * 9973 + sp, [{ id: 'jam', n: 99 }, null, null, null], 0);
if (s !== 1) w.hero.x = Math.round(100 + ((s * 2654435761 + sp * 40503) % 1000) / 1000 * (st.width - 300));
const bot = new ChaosBot(w, (s * 9973 + sp) * 7 + 1);
const prev = { stuckT: 0, lastY: w.hero.y, lastX: w.hero.x };
const hist: string[] = [];
for (let i = 0; i < seconds * 60; i++) {
  w.hero.hp = w.hero.d.maxHp; w.hero.revives = 9;
  const inp = bot.think(); w.step(inp);
  const h = w.hero, keys = Object.entries(inp).filter(([, v]) => v).map(([k]) => k).join('+');
  hist.push(`${i} t${w.time.toFixed(2)} ${h.state}${h.skill ? '(' + h.skill.id + ':' + h.skill.kind + ')' : ''} x${Math.round(h.x)} y${Math.round(h.y)} vy${Math.round(h.vy)} g=${h.ground} on=${h.on} t=${h.t.toFixed(2)} lad=${!!w.ladderAt(h.x, h.y)} [${keys}]`);
  if (hist.length > 40) hist.shift();
  const v = checkWorld(w, prev, 1 / 60).find(x => !rule || x.rule === rule);
  if (v) { console.log(hist.join('\n')); console.log('BROKE', v.rule, v.detail); console.log('platforms near (live):', w.stage.platforms.map((p, k) => [k, p]).filter(([, p]) => Math.abs((p as { x: number }).x - h.x) < 400).map(([k, p]) => `${k}:${Math.round((p as { x: number }).x)}-${Math.round((p as { x: number; w: number }).x + (p as { w: number }).w)}@${(p as { y: number }).y}${(p as { move?: unknown }).move ? 'm' : ''}${(p as { secret?: boolean }).secret ? 's' : ''}`).join(' ')); break; }
}
