// One full skilled-bot run, logged every N seconds: where the hero is, HP, jams, the boss-room foe and what is alive nearby.
// npx vite-node scripts/run-trace.ts <stage> <species> [run=1] [every=20] [fromT=0]
import { Bot, SKILLED } from '../src/sim/bot';
import { MOBS, nemesisOf } from '../src/sim/mobs';
import { STAGES } from '../src/sim/stages';
import { derive } from '../src/sim/stats';
import { World } from '../src/sim/world';
import { heroFor } from './hero-at';
const st = STAGES.find(s => s.id === process.argv[2])!, sp = +process.argv[3], r = +(process.argv[4] ?? 1) - 1, every = +(process.argv[5] ?? 20), from = +(process.argv[6] ?? 0);
const w = new World(st, derive(heroFor(sp, st.rec, r + 1)), 100 + r, [{ id: 'jam', n: 8 }, null, null, null], 0, false, undefined, [], nemesisOf(sp));
const bot = new Bot(w, SKILLED, 7 + r);
console.log('maps', (st.maps ?? []).map((m, i) => `${i}:${m.kind ?? ''} ${Math.round(m.x0)}-${Math.round(m.x1)}`).join(' | '), 'width', st.width);
let dmgBy: Record<string, number> = {};
for (let i = 0; i < 60 * 900 && !w.cleared && !w.failed; i++) {
  const hp = w.hero.hp;
  const inp = bot.think(); w.step(inp);
  if (w.hero.hp < hp) { const near = w.mobs.filter(m => m.state !== 'dead' && Math.abs(m.x - w.hero.x) < 300).sort((a, b) => Math.abs(a.x - w.hero.x) - Math.abs(b.x - w.hero.x))[0]; const k = near ? near.kind + (near.move ? ':' + near.move : '') : 'none/hazard'; dmgBy[k] = (dmgBy[k] ?? 0) + (hp - w.hero.hp); }
  if (i % (60 * every) === 0 && w.time >= from) {
    const h = w.hero, near = w.mobs.filter(m => m.state !== 'dead' && Math.abs(m.x - h.x) < 700);
    console.log(`${Math.round(w.time)}s map${w.mapAt(h.x)} hero ${Math.round(h.x)},${Math.round(h.y)} ${h.state} on=${h.on} hp ${Math.round(h.hp / h.d.maxHp * 100)}% jams ${h.bag[0]?.n ?? 0} in[${Object.entries(inp).filter(e => e[1]).map(e => e[0]).join(',')}] | ${near.slice(0, 6).map(m => `${m.kind}${m.roomBoss ? '*' : ''}@${Math.round(m.x)},${Math.round(m.y)} ${m.state}${m.move ? ':' + m.move : ''} ${Math.round(m.hp / m.maxHp * 100)}%${MOBS[m.kind].brain === 'nemesis' || MOBS[m.kind].brain === 'boss' ? ` armor ${m.armor.toFixed(2)}` : ''}`).join(' ; ')}${near.length > 6 ? ` (+${near.length - 6})` : ''} | pickups ${w.pickups.filter(p => Math.abs(p.x - h.x) < 700).map(p => `${p.kind}@${Math.round(p.x)},${Math.round(p.y)}`).join(' ')} | haz ${w.hazards.filter(z => Math.abs(z.x - h.x) < 500).map(z => `${z.kind}@${Math.round(z.x)}w${z.w}:${z.state}`).join(' ')} | drops ${JSON.stringify(w.drops)} | dmg ${JSON.stringify(Object.fromEntries(Object.entries(dmgBy).map(([k, v]) => [k, Math.round(v)])))}`);
    dmgBy = {};
  }
}
console.log(w.cleared ? 'CLEAR' : w.failed ? 'FAIL' : 'TIMEOUT', Math.round(w.time) + 's', 'maxHp', w.hero.d.maxHp, 'last dmg', JSON.stringify(dmgBy));
