import { rollBase, BASES, rollItem } from '../src/sim/items';
let bad = 0;
for (let lv = 1; lv <= 120; lv++) for (let seed = 1; seed < 300; seed++) for (const pref of [-1, 0, 10, 11, 4, 19]) {
  let s = seed * 7 + lv; const rand = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const b = rollBase(lv, rand, pref);
  if (!BASES[b]) { bad++; if (bad < 6) console.log('EMPTY base at ilvl', lv, 'prefer', pref, 'seed', seed, '->', b); }
}
console.log('bad', bad);
