// The Monster Cookbook (Bag → Cookbook), tapped for real on a phone-sized screen: a fresh book, a part-filled one, a card
// opened, a hand-in (drops down, crumbs up by the table's amount, paid once, boxes / items / gear untouched), the
// SKIP TO BOSS warning with KEEP, ONLY THE SPARE and HAND IN, HAND IN ALL SPARES (never breaks a skip), a page completed
// (stamp, title, the flourish), the title picked and shown on the Hero tab and the map, and a finished gold book.
// Needs a DEV server already running (not `vite preview`: it imports the game's modules to read the reward table):
//   node scripts/cookbook-shot.mjs [port=5483] [width=844] [height=390]   → shots/cookbook/<width>-*.png
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const PORT = Number(process.argv[2] ?? 5483), W = Number(process.argv[3] ?? 844), H = Number(process.argv[4] ?? 390);
const base = `http://localhost:${PORT}/?touch`;
fs.mkdirSync('shots/cookbook', { recursive: true });
const wait = ms => new Promise(r => setTimeout(r, ms));
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const p = await (await b.newContext({ viewport: { width: W, height: H }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })).newPage();
const errs = []; p.on('pageerror', e => errs.push('page error: ' + e.message));
p.on('console', m => { if (m.type() === 'error' && !/favicon|Failed to load resource/.test(m.text())) errs.push('console: ' + m.text().slice(0, 200)); });
const fail = m => { errs.push(m); console.log('FAIL:', m); };
const check = (ok, what) => { if (!ok) fail(what); return ok; };
await p.goto(base, { waitUntil: 'commit', timeout: 120000 }); await p.evaluate(() => localStorage.clear()); await p.reload({ waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 480 && !await p.evaluate(() => !!window.__kkq).catch(() => false); i++) await wait(250);
await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(1200);
for (let i = 0; i < 3; i++) await p.evaluate(() => document.querySelector('#story .skip, #story [data-skip]')?.click());
await wait(400);
const shot = async name => { await wait(300); await p.screenshot({ path: `shots/cookbook/${W}-${name}.png` }); };
/** a real touch on the element (it must be on screen and not covered) */
const tap = async sel => { try { await p.locator(sel).first().tap({ timeout: 4000 }); await wait(140); return true; } catch { fail(`could not tap ${sel}`); return false; } };
const has = sel => p.evaluate(s => !!document.querySelector(s), sel);
const text = sel => p.evaluate(s => document.querySelector(s)?.textContent?.replace(/\s+/g, ' ').trim() ?? '', sel);
const openBook = async () => { await tap('[data-tab="bag"]'); await tap('[data-bag="cookbook"]'); };
/** the parts of the save a hand-in may and may not touch */
const snap = () => p.evaluate(() => { const s = window.__kkq.save; return { crumbs: s.crumbs, drops: { ...(s.drops ?? {}) }, book: { ...(s.cookbook ?? {}) }, paid: { ...(s.cookbookPaid ?? {}) }, title: s.title ?? null, untouched: JSON.stringify([s.boxes, s.items, s.bag, s.heroes, s.quick]) }; });
/** does anything in the Cookbook stick out, wrap badly or need scrolling? */
const fits = async name => {
  const r = await p.evaluate(() => {
    const page = document.querySelector('#camp .page'), cb = document.querySelector('.cb');
    const out = [...document.querySelectorAll('.cb *, .subtabs *')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.right > innerWidth + 1 || r.left < -1); }).length;
    const clipped = [...document.querySelectorAll('.cbcard .nm')].filter(e => e.scrollWidth > e.clientWidth + 1).map(e => e.textContent);
    const tall = [...document.querySelectorAll('.cbcard')].map(e => Math.round(e.getBoundingClientRect().height));
    const wide = [...document.querySelectorAll('.cb *')].filter(e => e.scrollWidth > e.clientWidth + 2 && !e.classList.contains('nm') && getComputedStyle(e).overflowX === 'visible' && getComputedStyle(e).display !== 'inline').map(e => e.className || e.tagName).slice(0, 5);
    const sub = document.querySelector('.subtabs'), subRows = sub ? new Set([...sub.children].map(e => { const r = e.getBoundingClientRect(); return Math.round((r.top + r.height / 2) / 16); })).size : 0;
    return { cards: tall.length, cardHeights: [...new Set(tall)], scrolls: page.scrollHeight > page.clientHeight + 1 ? `${page.scrollHeight}>${page.clientHeight}` : false, offScreen: out, clippedNames: clipped, overflowing: wide, subtabRows: subRows, bookBottom: cb ? Math.round(cb.getBoundingClientRect().bottom) : null };
  });
  console.log(`${W}x${H} ${name}:`, JSON.stringify(r));
  check(!r.offScreen, `${name}: ${r.offScreen} elements stick out of the screen`);
  check(!r.overflowing.length, `${name}: overflowing ${r.overflowing}`);
  return r;
};

// ---------------- (1) a fresh save: every card a silhouette
await openBook(); await shot('1-fresh'); await fits('fresh book');
{
  const r = await p.evaluate(() => ({ cards: document.querySelectorAll('.cbcard').length, unknown: document.querySelectorAll('.cbcard.unk').length, names: [...document.querySelectorAll('.cbcard .nm')].map(e => e.textContent), chips: document.querySelectorAll('.cbpages [data-cb]').length, spares: document.querySelector('[data-cb^="spares"]')?.disabled, badge: document.querySelector('[data-tab="bag"] em')?.textContent ?? '' }));
  console.log('fresh:', JSON.stringify(r));
  check(r.cards > 0 && r.cards === r.unknown && r.names.every(n => n === '???'), 'a fresh book should be all "???" silhouettes');
  check(r.spares === true && r.badge === '', 'a fresh book has nothing to hand in and no badge');
  await tap('.cbcard'); await shot('1-fresh-card'); check(await text('.cbdetail h3') === '???', 'an undiscovered card opens as "???"'); await tap('[data-cb="back"]');
}

// ---------------- (2) mid-game: worlds 1-3 cleared, a mix of card levels and spare drops
const pages = await p.evaluate(async () => {
  const { cookbook, cardNeeds } = await import('/src/sim/cookbook.ts');
  const s = window.__kkq.save, h = s.heroes[s.selected], book = cookbook();
  for (let w = 1; w <= 3; w++) for (let n = 1; n <= 10; n++) h.cleared[`${w}-${n}`] = 'B';
  h.level = 30; h.seen.push('intro', 'w1-open', 'w2-open', 'w3-open'); s.storyMode = 'key'; s.tips = ['x']; s.boxes = [{ tier: 2, ilvl: 5 }]; s.crumbs = 1000;
  s.drops = {}; s.cookbook = {}; s.cookbookPaid = {}; delete s.title;
  // page 1: levels 0, 1, 2, 3 in turn; page 2: all at one star (stamp); page 3: untouched but with drops in the bag
  book.pages[0].kinds.forEach((k, i) => { const n = cardNeeds(k); s.cookbook[k] = [0, n[0], n[1], n[2], n[1] - 1][i % 5]; s.drops[k] = [1, 6, 0, 5, 1, 12, 2, 0, 30][i % 9]; });
  book.pages[1].kinds.forEach(k => { s.cookbook[k] = cardNeeds(k)[1]; }); s.cookbookPaid['2'] = 1;
  book.pages[2].kinds.forEach((k, i) => { s.drops[k] = i % 3 === 0 ? 0 : 2 + i; });
  s.quest ??= { stats: {}, daily: { day: '', q: [], bonus: false }, ach: {} };
  for (const k of book.pages[0].kinds) s.quest.stats['kill:' + k] = 40 + k.length * 7;
  return book.pages.map(pg => ({ id: pg.id, n: pg.kinds.length, kinds: pg.kinds }));
});
console.log('pages:', pages.map(x => `${x.id}:${x.n}`).join(' '));
await tap('[data-tab="hero"]'); await openBook(); await tap('[data-cb="page:1"]');
await shot('2-mid-page1'); await fits('mid-game page 1');
check(Number(await text('[data-tab="bag"] em')) > 0, 'the Bag tab shows a badge when a card can advance');
check(await has('.cbtab em'), 'the Cookbook sub-tab shows the count too');
// a discovered card, opened: names, where it is hunted, weak / resist, beaten, next reward
{
  const kind = pages[0].kinds[1];
  await tap(`[data-cb="card:${kind}"]`); await shot('2-card-open'); await fits('card opened');
  const d = await p.evaluate(() => ({ name: document.querySelector('.cbdetail h3')?.textContent, lines: [...document.querySelectorAll('.cbdetail .ln')].map(e => e.textContent.replace(/\s+/g, ' ').trim()), ladder: [...document.querySelectorAll('.ladder > div')].map(e => e.textContent.replace(/\s+/g, ' ').trim()), els: document.querySelectorAll('.cbdetail abbr.el').length }));
  console.log('card:', JSON.stringify(d));
  check(d.name && d.name !== '???' && d.els === 2 && d.ladder.length === 3 && d.lines.some(l => /beaten \d+/.test(l)), 'the opened card shows its name, weak / resist icons, the three levels and the beaten count');
  // hand in from the opened card: drops down, crumbs up by exactly what the table says, nothing else touched
  const before = await snap();
  const want = await p.evaluate(async kind => { const { cookCardView } = await import('/src/save.ts'); const { cardReward, cardNeeds } = await import('/src/sim/cookbook.ts'); const c = cookCardView(kind), n = cardNeeds(kind); let crumbs = 0, lv = c.level; for (let h = c.handed + 1; h <= c.handed + c.usable; h++) while (lv < 3 && h >= n[lv]) { lv++; crumbs += cardReward(c.world, lv).crumbs; } return { usable: c.usable, crumbs, breaks: c.breaks, to: lv }; }, kind);
  await tap(`.cbdetail [data-cb="hand:${kind}"]`); await shot('2-handed-in');
  const after = await snap(), toast = await text('#camp .flashmsg');
  console.log(`hand in ${kind}: wanted`, JSON.stringify(want), '· drops', before.drops[kind], '→', after.drops[kind] ?? 0, '· crumbs', before.crumbs, '→', after.crumbs, '· toast:', toast);
  check(want.usable > 0 && want.crumbs > 0 && !want.breaks.length, 'the test card should have a paying, warning-free hand-in');
  check((before.drops[kind] ?? 0) - (after.drops[kind] ?? 0) === want.usable, 'the hand-in took the wrong number of drops');
  check(after.crumbs - before.crumbs === want.crumbs, `crumbs went up by ${after.crumbs - before.crumbs}, the table says ${want.crumbs}`);
  check((after.book[kind] ?? 0) - (before.book[kind] ?? 0) === want.usable, 'the card did not count the drops');
  check(after.untouched === before.untouched, 'a hand-in changed boxes, items, gear or a kaiju');
  check(toast.includes(`+🍪 ${want.crumbs}`), 'the toast does not show the crumbs');
  // paid once: nothing left to tap, and the save stays put
  check(!(await has(`[data-cb="hand:${kind}"]`)) || (await p.evaluate(k => document.querySelector(`.cbdetail [data-cb="hand:${k}"]`)?.textContent, kind)) !== `HAND IN ${want.usable}`, 'the same hand-in is still on offer');
  const again = await snap(); check(again.crumbs === after.crumbs, 'crumbs moved again');
  await tap('[data-cb="back"]');
}
await tap('[data-cb="page:2"]'); await shot('2-mid-page2-stamp'); check(await has('.cbph .cbstamp.hat'), 'page 2 (every card at one star) shows its chef stamp');
await tap('[data-cb="page:3"]'); await shot('2-mid-page3'); await fits(`page 3 (${pages[2].n} cards, the biggest)`);
// hand in straight from a card in the grid (a silhouette turning over)
{
  const kind = pages[2].kinds[1], before = await snap();
  await tap(`.cbcard [data-cb="hand:${kind}"]`); const after = await snap();
  check((after.book[kind] ?? 0) > 0 && after.crumbs > before.crumbs && !(await has(`.cbcard.unk[data-cb="card:${kind}"]`)), 'a grid hand-in turns the card over and pays');
  await shot('2-grid-handed');
}

// ---------------- (3) the SKIP TO BOSS warning: the bag holds exactly what 1-4's exits ask for (+2 spare of the first kind)
const skip = await p.evaluate(async () => {
  const { stageWants } = await import('/src/sim/cookbook.ts'); const { stageById } = await import('/src/sim/stages.ts');
  const s = window.__kkq.save, need = stageWants(stageById('1-4')), kinds = Object.keys(need);
  s.drops = { ...need }; s.drops[kinds[0]] += 2; for (const k of kinds) delete s.cookbook[k];
  return { need, kinds };
});
console.log('1-4 exits want:', JSON.stringify(skip.need));
await tap('[data-cb="page:1"]');
const canSkip14 = () => p.evaluate(async () => { const { canSkipWith } = await import('/src/sim/cookbook.ts'); const { stageById } = await import('/src/sim/stages.ts'); return canSkipWith(window.__kkq.save.drops, stageById('1-4')); });
check(await canSkip14(), 'the bag should pay 1-4\'s skip');
{
  const [k0, k1] = skip.kinds, before = await snap();
  // (a) KEEP: nothing changes
  await tap(`.cbcard [data-cb="hand:${k1 ?? k0}"]`);
  check(await has('.cbask'), 'no HAND IN / KEEP question for a hand-in that breaks a skip');
  const q = await text('.cbask'); console.log('question:', q);
  check(/SKIP TO BOSS on [^.]*1-4 needs/.test(q), 'the question does not name the stage');
  await shot('3-warning'); await fits('the warning');
  await tap('.cbask [data-cb="no"]');
  const kept = await snap();
  check(!(await has('.cbask')) && JSON.stringify(kept.drops) === JSON.stringify(before.drops) && kept.crumbs === before.crumbs, 'KEEP changed the save');
  // (b) ONLY THE SPARE: the two extra go in, the skip stays
  await tap(`.cbcard [data-cb="hand:${k0}"]`); await shot('3-warning-spare');
  check(await has('.cbask [data-cb="safe"]'), 'no ONLY THE SPARE button when some of the drops are spare');
  await tap('.cbask [data-cb="safe"]');
  const spared = await snap();
  check(spared.drops[k0] === skip.need[k0] && (spared.book[k0] ?? 0) === 2 && await canSkip14(), 'ONLY THE SPARE should hand in 2 and leave the skip payable');
  // (c) HAND IN: the drops go, the skip is gone
  await tap(`.cbcard [data-cb="hand:${k0}"]`);
  await tap('.cbask [data-cb="yes"]'); await shot('3-warning-handed');
  const gone = await snap();
  check((gone.drops[k0] ?? 0) < skip.need[k0] && !(await canSkip14()) && gone.crumbs > spared.crumbs, 'HAND IN should take the drops, pay, and break the skip');
  check(gone.untouched === before.untouched, 'the warning flow changed boxes, items, gear or a kaiju');
}

// ---------------- (4) HAND IN ALL SPARES: a full skip set plus extras; the skip survives
await p.evaluate(need => { const s = window.__kkq.save; for (const [k, n] of Object.entries(need)) s.drops[k] = n + 3; }, skip.need);
await tap('[data-cb="page:2"]'); await tap('[data-cb="page:1"]');
{
  const before = await snap(), n = Number((await text('[data-cb="spares:1"]')).match(/\((\d+)\)/)?.[1] ?? 0);
  await shot('4-spares-before');
  check(/never breaks a SKIP TO BOSS/.test(await text('.cbph')), 'the hint by HAND IN ALL SPARES is missing');
  await tap('[data-cb="spares:1"]'); await shot('4-spares-after');
  const after = await snap(), took = Object.keys(before.drops).reduce((a, k) => a + (before.drops[k] ?? 0) - (after.drops[k] ?? 0), 0);
  console.log(`hand in all spares: button said ${n}, took ${took}, crumbs ${before.crumbs} → ${after.crumbs}, toast: ${await text('#camp .flashmsg')}`);
  check(n > 0 && took === n, 'HAND IN ALL SPARES took a different number than it showed');
  check(await canSkip14(), 'HAND IN ALL SPARES broke the skip');
  check(!(await has('.cbask')), 'HAND IN ALL SPARES asked a question');
  check(after.untouched === before.untouched, 'HAND IN ALL SPARES changed boxes, items, gear or a kaiju');
  for (const k of skip.kinds) check((after.drops[k] ?? 0) >= skip.need[k], `it took ${k} the skip needs`);
}

// ---------------- (5) complete a page: the last page, one drop short of two stars on its last card
const last = pages[pages.length - 1];
const done = await p.evaluate(async id => {
  const { cookbook, cardNeeds, cardReward, pageReward, titleName } = await import('/src/sim/cookbook.ts'); const { STAGES } = await import('/src/sim/stages.ts');
  const s = window.__kkq.save, h = s.heroes[s.selected], pg = cookbook().pages.find(x => x.id === id);
  for (const st of STAGES) h.cleared[st.id] = 'A'; // every map page open, so the stamp can be seen on the map
  for (const k of pg.kinds) s.cookbook[k] = cardNeeds(k)[2];
  const k = pg.kinds[pg.kinds.length - 1]; s.cookbook[k] -= 1; s.drops = { [k]: 4 };
  return { kind: k, world: pg.world, name: pg.name, crumbs: cardReward(pg.world, 3).crumbs + pageReward(pg.world, 1).crumbs + pageReward(pg.world, 2).crumbs, title: titleName('w' + id) };
}, last.id);
await tap(`[data-cb="page:${last.id}"]`); await shot('5-page-almost'); await fits(`page ${last.id} (${last.n} cards, the smallest)`);
{
  const before = await snap();
  await tap(`.cbcard [data-cb="hand:${done.kind}"]`);
  await wait(500); await shot('5-page-complete');
  const after = await snap(), fan = await text('.cbfan');
  console.log(`page ${last.id} complete: crumbs +${after.crumbs - before.crumbs} (table ${done.crumbs}), paid ${JSON.stringify(after.paid)}, flourish: ${fan}`);
  check(before.drops[done.kind] - (after.drops[done.kind] ?? 0) === 1, 'completing the card should take exactly the one drop it needs');
  check(after.crumbs - before.crumbs === done.crumbs, `the page paid ${after.crumbs - before.crumbs}, the table says ${done.crumbs}`);
  check(after.paid[last.id] === 2, 'the page is not marked paid at two stars');
  check(/PAGE COMPLETE/.test(fan) && fan.includes(done.title), 'no flourish (or no title in it) for the finished page');
  check(after.untouched === before.untouched, 'completing a page changed boxes, items, gear or a kaiju');
  await wait(3200); await shot('5-page-done');
  check(await has('.cbph .cbstamp.gold') && await has(`.cbpages .gold[data-cb="page:${last.id}"]`), 'the finished page shows no gold stamp');
  check((await p.evaluate(() => document.querySelectorAll('.cbcard.gold').length)) === last.n, 'every two-star card should have its gold border');
  // the 3 drops left over are refused: nothing to hand in, nothing paid twice
  check(!(await has(`[data-cb="hand:${done.kind}"]`)) && (await snap()).crumbs === after.crumbs, 'a finished card still takes drops');
}
// pick the title, see it on the Hero tab and the stamp on the map
await tap('.cbpick'); await shot('5-title-picker');
check(await has(`[data-cb="title:w${last.id}"]`), 'the earned title is not in the picker');
await tap(`[data-cb="title:w${last.id}"]`);
check((await snap()).title === `w${last.id}`, 'picking a title did not save it');
await tap('[data-tab="hero"]'); await shot('5-hero-title');
check((await text('.portrait .cbtitle')).includes(done.title), 'the Hero tab does not show the title');
await tap('.portrait .cbtitle'); check(await has('.cbtitles'), 'tapping the title on the Hero tab should open the picker in the Cookbook');
await tap('[data-cb="title:none"]'); check((await snap()).title === null && !(await has('.cbtitles')), 'None should clear the title');
await tap('.cbpick'); await tap(`[data-cb="title:w${last.id}"]`);
await tap('[data-tab="map"]');
await p.evaluate(w => { const i = [...document.querySelectorAll('[data-mappage]')].length - 1; document.querySelector(`[data-mappage="${i}"]`)?.click(); void w; }, done.world);
await shot('5-map-stamp');
check(await has('.wlabel .cbstamp.gold'), 'no gold stamp on the finished world\'s map');
// a drop chip on a stage card opens that monster's card
await p.evaluate(() => document.querySelector('[data-mappage="0"]')?.click()); await p.evaluate(() => document.querySelector('[data-node="1-4"]')?.click()); await wait(200);
if (await has('.dropreq [data-cb]')) { await p.evaluate(() => document.querySelector('.map .info').scrollTo(0, 0)); await tap('.dropreq [data-cb]'); await shot('5-chip-opens-card'); check(await has('.cbdetail'), 'a drop chip on the stage card should open its Cookbook card'); }
else fail('the stage card has no drop chips');

// ---------------- (6) a finished book: gold cover, Head Chef
await p.evaluate(async () => {
  const { cookbook, cardNeeds } = await import('/src/sim/cookbook.ts');
  const s = window.__kkq.save, book = cookbook();
  for (const pg of book.pages) { for (const k of pg.kinds) s.cookbook[k] = cardNeeds(k)[2]; s.cookbookPaid[pg.id] = 2; }
  // one card one drop short, so the last hand-in finishes the whole book
  const pg = book.pages[0], k = pg.kinds[0]; s.cookbook[k] -= 1; s.cookbookPaid[pg.id] = 1; s.drops = { [k]: 1 };
});
await openBook();
await tap('[data-cb="page:1"]');
{
  const before = await snap();
  await tap(`.cbcard [data-cb^="hand:"]`); await wait(500); await shot('6-book-complete');
  const after = await snap(), fan = await text('.cbfan');
  console.log('book complete:', JSON.stringify(after.paid), '· flourish:', fan);
  check(after.paid.all === 1 && /HEAD CHEF/.test(fan), 'finishing the last card should finish the book');
  check(after.untouched === before.untouched, 'finishing the book changed boxes, items, gear or a kaiju');
  await wait(3200);
  await tap('.cbpick'); await shot('6-gold-book'); await fits('finished book, picker open');
  check(await has('.cbtab.gold') && await has('[data-cb="title:all"]'), 'the finished book should have a gold cover and offer Head Chef');
  await tap('[data-cb="title:all"]'); await tap('[data-tab="hero"]'); await shot('6-head-chef');
  check((await text('.portrait .cbtitle')).includes('Head Chef'), 'Head Chef does not show on the Hero tab');
  // it survives a reload (and the repair on load keeps an earned title)
  await p.reload({ waitUntil: 'commit' }); for (let i = 0; i < 240 && !await p.evaluate(() => !!window.__kkq).catch(() => false); i++) await wait(250);
  check(await p.evaluate(() => window.__kkq.save.title === 'all' && window.__kkq.save.cookbookPaid.all === 1), 'the book did not survive a reload');
}
console.log(errs.length ? errs : 'no errors');
await b.close(); process.exit(errs.length ? 1 : 0);
