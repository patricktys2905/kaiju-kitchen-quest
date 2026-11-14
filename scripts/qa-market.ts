// QA: does the Market's daily roll differ between HEAD (shots/qa2/head/src, extracted with git archive) and the working tree?
// npx vite-node scripts/qa-market.ts
const A = { items: await import('../shots/qa2/head/src/sim/items.ts'), skills: await import('../shots/qa2/head/src/sim/skills.ts') }, B = { items: await import('../src/sim/items.ts'), skills: await import('../src/sim/skills.ts') };
const roll = (M: typeof A, day: string, lv: number, sel: number) => {
  let seed = [...day].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7) || 1;
  const rand = () => { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; return ((seed >>> 0) % 100000) / 100000; };
  const ids = Object.values(M.skills.SKILLS as Record<string, { actives: { id: string }[] }>).flatMap(x => x.actives.map(a => a.id));
  const st = [M.items.rollItem(1, 4, lv, rand, ids, sel), M.items.rollItem(2, 3, lv, rand, ids, sel), M.items.rollItem(3, 3, lv, rand, ids)];
  if (st[0].rarity < 3) st[0].rarity = 3;
  return st;
};
let n = 0, diff = 0, w11 = 0; const ex: string[] = [];
const baseKeysA = new Set(Object.keys(A.items.BASES)), newBases = Object.keys(B.items.BASES).filter(k => !baseKeysA.has(k));
console.log('item bases at HEAD:', baseKeysA.size, 'now:', Object.keys(B.items.BASES).length, 'new:', newBases.join(', ') || '(none)');
for (let d = 1; d <= 30; d++) for (const lv of [1, 5, 14, 26, 40, 61, 85, 110, 121, 130]) for (const sel of [0, 10, 19]) {
  const day = `2026-11-${d}`; const a = roll(A, day, lv, sel), b = roll(B, day, lv, sel); n++;
  const same = JSON.stringify(a) === JSON.stringify(b);
  if (!same) { diff++; if (ex.length < 8) ex.push(`${day} lv${lv} sel${sel}: HEAD ${a.map((i: any) => i.base + '/r' + i.rarity).join(', ')} | NOW ${b.map((i: any) => i.base + '/r' + i.rarity).join(', ')}`); }
  for (const it of b) if (newBases.includes(it.base) || /showman/i.test(B.items.BASES[it.base].name ?? '')) { w11++; if (lv < 121) ex.push(`NEW ITEM for lv${lv}: ${it.base}`); }
}
console.log(`market rolls compared: ${n}; different between HEAD and now: ${diff}; rolls containing a new (World 11) base: ${w11}`);
for (const e of ex) console.log(' ', e);
const s = roll(B, '2026-11-14', 14, 10);
console.log('visual-check save (lv 14 progress, Bluebeary), day 2026-11-14, now:', s.map((i: any) => `${B.items.itemName ? B.items.itemName(i) : i.base} r${i.rarity} ilv${i.ilvl}`).join(' | '));
const s0 = roll(A, '2026-11-14', 14, 10);
console.log('same at HEAD:', s0.map((i: any) => `${A.items.itemName ? A.items.itemName(i) : i.base} r${i.rarity} ilv${i.ilvl}`).join(' | '));
