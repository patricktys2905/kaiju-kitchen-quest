// Elemental weaknesses, the menus: stage panel (normal / nemesis / "???" / world boss), Skills and Hero tabs with icons and
// ticks, the Daily card, and the Market Re-season flow before and after paying. Needs a dev server already running:
//   node scripts/weak-shot.mjs [port=5471] [width=844] [height=390]   → shots/weak/<width>-*.png
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const PORT = Number(process.argv[2] ?? 5471), W = Number(process.argv[3] ?? 844), H = Number(process.argv[4] ?? 390);
const base = `http://localhost:${PORT}/?touch`;
fs.mkdirSync('shots/weak', { recursive: true });
const wait = ms => new Promise(r => setTimeout(r, ms));
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const p = await (await b.newContext({ viewport: { width: W, height: H }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })).newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(base, { waitUntil: 'commit', timeout: 120000 }); await p.evaluate(() => localStorage.clear()); await p.reload({ waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 480 && !await p.evaluate(() => !!window.__kkq).catch(() => false); i++) await wait(250);
await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(1200);
for (let i = 0; i < 3; i++) await p.evaluate(() => document.querySelector('#story .skip, #story [data-skip]')?.click());
await wait(400);
const shot = async name => { await wait(350); await p.screenshot({ path: `shots/weak/${W}-${name}.png` }); };
const click = sel => p.evaluate(s => document.querySelector(s)?.click(), sel);
const tab = t => click(`[data-tab="${t}"]`);
/** does the PLAY button sit inside the screen without scrolling the panel? and does anything stick out sideways? */
const fits = async name => {
  const r = await p.evaluate(() => {
    const play = document.querySelector('.map .info [data-play]:not(.secret)')?.getBoundingClientRect(), info = document.querySelector('.map .info');
    const wide = [...document.querySelectorAll('#camp .page *')].filter(e => e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).overflowX === 'visible').length;
    return { playBottom: play ? Math.round(play.bottom) : null, screen: innerHeight, panelScrolls: info ? info.scrollHeight > info.clientHeight + 1 : null, line: document.querySelector('.map .info .weakln')?.textContent ?? '(none)', overflowing: wide, pageWide: document.documentElement.scrollWidth > innerWidth };
  });
  console.log(`${W}x${H} ${name}:`, JSON.stringify(r));
};
// a fresh save: 1-1 with its boss still "???"
await shot('panel-fresh'); await fits('fresh 1-1 (boss ???)');
// a mid-game Toastbat (HOT skills): worlds 1-2 cleared
await p.evaluate(async () => {
  const { BASES } = await import('/src/sim/items.ts');
  const sv = window.__kkq.save, mine = Object.keys(BASES).filter(k => BASES[k].slot === 'weapon' && BASES[k].for === 6);
  const mk = (base, rarity) => ({ id: sv.nextId++, base, rarity, ilvl: 20, plus: 0, grade: 1, lines: BASES[base].main.map(l => ({ ...l })) });
  const plain = mine.filter(k => !BASES[k].boss), boss = mine.filter(k => BASES[k].boss);
  sv.heroes[6].equip.weapon = mk(plain[0], 3);
  sv.bag.push(...plain.slice(1, 4).map((k, i) => mk(k, 2 + i)), ...boss.slice(0, 1).map(k => mk(k, 4)));
  const s = sv; s.selected = 6; s.crumbs = 900; s.unlocked = [...new Set([...s.unlocked, 6, 11])];
  const h = s.heroes[6]; h.level = 24; h.skillPts = 3;
  for (let w = 1; w <= 2; w++) for (let n = 1; n <= 10; n++) h.cleared[`${w}-${n}`] = 'A';
  for (const k of Object.keys(h.skills)) h.skills[k] = 3;
  s.drops = { jamhop: 2, worm: 2, bun: 13, salt: 1 };
  s.shop = { day: new Date().toISOString().slice(0, 10), stock: [] };
  window.__kkq.scene.scene.restart({});
});
await wait(900);
await tab('map');
for (const [id, name] of [['1-4', 'normal'], ['1-5', 'nemesis'], ['1-10', 'worldboss'], ['2-3', 'w2']]) {
  await p.evaluate(id => { const m = document.querySelector(`[data-node="${id}"]`); if (m) m.click(); else { document.querySelector('[data-mappage="0"]')?.click(); } }, id);
  await wait(200); await click(`[data-node="${id}"]`);
  await shot(`panel-${name}`); await fits(`${id} ${name}`);
}
await click('[data-node="2-10"]'); await shot('panel-golem'); await fits('2-10 world boss');
// kit screens against 2-10 (Freezer Golem: weak to HOT) and against 1-4
await tab('hero'); await shot('hero');
await tab('skills'); await click('[data-act="sv-skills"]'); await shot('skills');
await click('[data-slot="0"]'); await shot('skills-pick'); await click('[data-slot="0"]');
await click('[data-act="sv-tree"]'); await shot('tree');
await p.evaluate(() => document.querySelector('.tnode.skill')?.click()); await shot('tree-node');
await tab('bag'); await shot('bag');
await tab('free'); await shot('daily');
console.log('daily card:', await p.evaluate(() => document.querySelector('.fcard .weakln')?.textContent ?? '(none)'));
// Market Re-season: before, element picked, too poor, after paying
await tab('market'); await shot('market');
await click('[data-act="mv-reseason"]'); await shot('reseason-1-pick');
const before = await p.evaluate(() => ({ crumbs: window.__kkq.save.crumbs, name: document.querySelector('.reseason h3, .detail h3')?.textContent, skill: document.querySelector('.detail .gs')?.textContent }));
await click('[data-reel="COLD"]'); await shot('reseason-2-preview');
console.log('preview:', await p.evaluate(() => document.querySelector('.repv')?.innerText.replace(/\n/g, ' | ') + ' · ' + document.querySelector('[data-act=reseason]')?.textContent));
await p.evaluate(() => { window.__kkq.save.crumbs = 5; }); await click('[data-reel="COLD"]'); await click('[data-reel="COLD"]'); await shot('reseason-3-poor');
console.log('poor:', await p.evaluate(() => document.querySelector('[data-act=reseason]')?.textContent + ' disabled=' + document.querySelector('[data-act=reseason]')?.disabled));
await p.evaluate(() => { window.__kkq.save.crumbs = 900; }); await click('[data-reel="COLD"]'); await click('[data-reel="COLD"]');
await click('[data-act="reseason"]'); await shot('reseason-4-paid');
const after = await p.evaluate(() => ({ crumbs: window.__kkq.save.crumbs, name: document.querySelector('.detail h3')?.textContent, skill: document.querySelector('.detail .gs')?.textContent, flash: document.querySelector('.flashmsg')?.textContent }));
console.log('re-season before:', JSON.stringify(before)); console.log('re-season after: ', JSON.stringify(after));
console.log('same element now:', await p.evaluate(() => [...document.querySelectorAll('[data-reel]')].map(x => x.textContent + (x.disabled ? ' (off)' : '')).join(' / ')));
await tab('hero'); await p.evaluate(() => document.querySelector('[data-eqslot="weapon"]')?.click()); await shot('hero-card');
// a boss weapon's card (no re-season), from the Bag
await tab('bag'); await p.evaluate(() => [...document.querySelectorAll('.grid [data-item]')].at(0)?.click()); await shot('bag-card');
console.log('bag cards say:', await p.evaluate(() => [...document.querySelectorAll('.grid [data-item]')].map(i => { i.click(); return document.querySelector('.detail h3')?.textContent + ' → ' + (document.querySelector('.detail .forge .have:last-child')?.textContent ?? '').slice(0, 60); }).join(' | ')));
// a kaiju whose tree adds elements (Avocadrake: Sticky and Hot), against 2-10 (boss weak to Hot)
await p.evaluate(() => { const s = window.__kkq.save; s.unlocked = [...new Set([...s.unlocked, 13])]; s.selected = 13; const h = s.heroes[13]; h.level = 30; for (let w = 1; w <= 2; w++) for (let n = 1; n <= 10; n++) h.cleared[`${w}-${n}`] = 'A'; window.__kkq.scene.scene.restart({}); });
await wait(900); await tab('map'); await click('[data-node="2-10"]');
await tab('skills'); await click('[data-act="sv-tree"]'); await shot('tree-elements');
console.log('tree nodes with an element:', await p.evaluate(() => [...document.querySelectorAll('.tnode')].filter(n => n.querySelector('abbr.el')).map(n => n.querySelector('b').textContent).join(', ')));
await click('[data-act="sv-skills"]'); await click('[data-slot="1"]'); await shot('skills-elements');
console.log(errs.length ? errs : 'no errors');
await b.close(); process.exit(errs.length ? 1 : 0);
