// QA: Market Re-season really paid, tapped: node scripts/qa-reseason.mjs <port> [w] [h] → shots/qa2/reg/reseason-*.png
import { chromium } from 'playwright-core';
const PORT = Number(process.argv[2]), W = Number(process.argv[3] ?? 844), H = Number(process.argv[4] ?? 390); const wait = ms => new Promise(r => setTimeout(r, ms));
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const p = await (await b.newContext({ viewport: { width: W, height: H }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })).newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(`http://localhost:${PORT}/?touch`, { waitUntil: 'commit' }); await p.evaluate(() => localStorage.clear()); await p.reload({ waitUntil: 'commit' });
for (let i = 0; i < 300 && !await p.evaluate(() => !!window.__kkq).catch(() => false); i++) await wait(250);
await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(1200);
await p.evaluate(async () => {
  const { BASES } = await import('/src/sim/items.ts'); const sv = window.__kkq.save, mine = Object.keys(BASES).filter(k => BASES[k].slot === 'weapon' && BASES[k].for === 6 && !BASES[k].boss);
  sv.heroes[6].equip.weapon = { id: sv.nextId++, base: mine[0], rarity: 3, ilvl: 20, plus: 0, grade: 1, lines: BASES[mine[0]].main.map(l => ({ ...l })) };
  sv.selected = 6; sv.crumbs = 5000; sv.unlocked = [...new Set([...sv.unlocked, 6])]; const h = sv.heroes[6]; h.level = 22; for (let w = 1; w <= 2; w++) for (let n = 1; n <= 10; n++) h.cleared[`${w}-${n}`] = 'A'; h.seen = ['intro'];
  window.__kkq.scene.scene.restart({});
}); await wait(900);
const st = () => p.evaluate(() => { const s = window.__kkq.save, w = s.heroes[6].equip.weapon; return { crumbs: s.crumbs, weapon: JSON.stringify({ base: w.base, twist: w.twist ?? w.fx ?? null, el: w.el ?? null, keys: Object.keys(w) }), title: document.querySelector('.detail h3')?.textContent ?? null, gs: document.querySelector('.detail .gs')?.textContent ?? null, btn: document.querySelector('[data-act=reseason]')?.textContent ?? null, flash: document.querySelector('.flashmsg')?.textContent ?? null }; });
await p.locator('[data-tab="market"]').tap(); await wait(400); await p.locator('[data-act="mv-reseason"]').tap(); await wait(500);
console.log('before:', JSON.stringify(await st())); await p.screenshot({ path: `shots/qa2/reg/reseason-${W}-1.png` });
await p.locator('[data-reel="COLD"]').tap(); await wait(400); console.log('COLD picked:', JSON.stringify(await st())); await p.screenshot({ path: `shots/qa2/reg/reseason-${W}-2.png` });
await p.locator('[data-act="reseason"]').tap(); await wait(600); console.log('after paying:', JSON.stringify(await st())); await p.screenshot({ path: `shots/qa2/reg/reseason-${W}-3.png` });
console.log('elements offered now:', await p.evaluate(() => [...document.querySelectorAll('[data-reel]')].map(x => x.textContent + (x.disabled ? ' (off)' : '')).join(' / ')));
await p.reload({ waitUntil: 'commit' }); for (let i = 0; i < 300 && !await p.evaluate(() => !!window.__kkq).catch(() => false); i++) await wait(250);
console.log('after reload:', JSON.stringify(await p.evaluate(() => { const s = window.__kkq.save, w = s.heroes[6].equip.weapon; return { crumbs: s.crumbs, weapon: JSON.stringify(w).slice(0, 200) }; })));
console.log(errs.length ? errs : 'no page errors'); await b.close();
