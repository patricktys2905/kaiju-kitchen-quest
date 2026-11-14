// Why is the bot stuck? Replays one balance run and prints the hero's physics every frame around a time, plus the stage
// geometry near it. npx vite-node scripts/w11-stuck.ts <stage> <species> <run> <t0> [seconds=1]
import { Bot, SKILLED } from '../src/sim/bot';
import { nemesisOf } from '../src/sim/mobs';
import { STAGES } from '../src/sim/stages';
import { derive } from '../src/sim/stats';
import { World } from '../src/sim/world';
import { heroFor } from './hero-at';
const st = STAGES.find(s => s.id === process.argv[2])!, sp = +process.argv[3], r = +(process.argv[4] ?? 1) - 1, t0 = +(process.argv[5] ?? 0), len = +(process.argv[6] ?? 1);
const w = new World(st, derive(heroFor(sp, st.rec, r + 1)), 100 + r, [{ id: 'jam', n: 8 }, null, null, null], 0, false, undefined, [], nemesisOf(sp));
const bot = new Bot(w, SKILLED, 7 + r);
let shown = false;
for (let i = 0; i < 60 * 900 && !w.cleared && !w.failed && w.time < t0 + len; i++) {
  const inp = bot.think(); w.step(inp);
  if (w.time < t0) continue;
  const h = w.hero as unknown as Record<string, unknown> & { x: number; y: number; vx: number; vy: number; state: string; on: number | null; ground: boolean };
  if (!shown) {
    shown = true;
    console.log('platforms near', st.platforms.map((p, pi) => ({ pi, ...p })).filter(p => p.x < h.x + 400 && p.x + p.w > h.x - 400));
    console.log('ladders near', st.ladders.filter(l => Math.abs(l.x - h.x) < 400), 'props', (st.props ?? []).filter(p => Math.abs(p.x - h.x) < 400), 'belts', st.belts, 'maps', st.maps?.map(m => [m.x0, m.x1]));
    console.log('hero', JSON.stringify(Object.fromEntries(Object.entries(h).filter(([k, v]) => typeof v !== 'object' || v === null || k === 'skill' || k === 'buff'))).slice(0, 1500));
    console.log('puddles', (w as unknown as { puddles: { x: number; y: number; kind: string }[] }).puddles.filter(p => Math.abs(p.x - h.x) < 200), 'mines', (w as unknown as { mines: unknown[] }).mines.length, 'zones', JSON.stringify((w as unknown as { zones: unknown[] }).zones).slice(0, 400));
  }
  if (i % 6 === 0) console.log(`${w.time.toFixed(2)} x ${h.x.toFixed(1)} y ${h.y.toFixed(1)} vx ${h.vx.toFixed(0)} vy ${h.vy.toFixed(0)} ${h.state} on=${h.on} ground=${h.ground} in[${Object.entries(inp).filter(e => e[1]).map(e => e[0]).join(',')}]`);
}
