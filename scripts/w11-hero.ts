// What the balance bot's build (scripts/hero-at.ts) looks like at World 10 and World 11 levels, next to monster growth:
// gear item levels and tiers, attack and HP, tree points spent, and an ordinary monster's HP / attack at the same level.
// npx vite-node scripts/w11-hero.ts [levels = 101,110,111,115,120]
import { CLASSES } from '../src/sim/classes';
import { BASES } from '../src/sim/items';
import { mobAtk, mobHp } from '../src/sim/mobs';
import { WORLDS } from '../src/sim/stages';
import { MAX_LEVEL, derive, xpFor } from '../src/sim/stats';
import { powerFor } from '../src/sim/free';
import { heroFor } from './hero-at';

const levels = (process.argv[2] ?? '101,110,111,115,120').split(',').map(Number);
console.log(`MAX_LEVEL ${MAX_LEVEL}; xp for the next level at 110: ${xpFor(110)}, at 119: ${xpFor(119)}`);
for (const lv of levels) {
  const w = [...WORLDS].reverse().find(x => x.baseLv <= lv)!;
  let atk = 0, hp = 0, def = 0, tree = 0, left = 0; const tiers: Record<string, number> = {}, ilv: number[] = [];
  for (const c of CLASSES) {
    const p = heroFor(c.species, lv, 1), d = derive(p);
    atk += d.atk; hp += d.maxHp; def += d.def; tree += Object.values(p.tree ?? {}).reduce((a, b) => a + b, 0); left += p.skillPts;
    for (const it of Object.values(p.equip)) { if (!it) continue; ilv.push(it.ilvl); const b = BASES[it.base]; if (b.slot !== 'charm') tiers[`${b.slot} t${b.tier}`] = (tiers[`${b.slot} t${b.tier}`] ?? 0) + 1; }
  }
  const n = CLASSES.length;
  console.log(`Lv ${lv} (World ${w.id}, power ${w.power}, free-play power ${powerFor(lv).toFixed(2)}): hero atk ${Math.round(atk / n)} hp ${Math.round(hp / n)} def ${Math.round(def / n)} | tree points ${(tree / n).toFixed(0)} spent, ${(left / n).toFixed(1)} unspent | item level ${Math.min(...ilv)}-${Math.max(...ilv)} | ${Object.entries(tiers).sort().map(([k, v]) => `${k}: ${v}`).join(', ')} | cadet-like walker hp ${Math.round(mobHp('fork', lv) * w.power)} atk ${Math.round(mobAtk('fork', lv) * w.power * (w.mobPow ?? 1))}`);
}
