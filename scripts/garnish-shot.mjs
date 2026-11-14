// The Garnish is a BADGE BY THE NAME (nothing is drawn on the kaiju's head): the drop's icon in a small ring, white, or gold
// when its Cookbook card has two stars. This script checks it on the HUD name plate, the teammate row, the name tag over
// the CPU buddy / an online friend, the Hero tab's name line and the online lobby rows.
// The Garnish, tapped for real on a phone-sized screen: a card that cannot be candied yet (no star, too few drops), CANDY IT
// (drops down by exactly the cost, owned for good, never twice), the SKIP TO BOSS question with KEEP and with CANDY IT,
// WEAR from the card, the Hero tab's fourth slot and its picker ("None" first, gold ones gold, one per kaiju), stats
// identical before and after wearing (no power), then a stage: the garnish on the kaiju and on the CPU buddy, and the
// World told what is worn (worldGarnishes). With `online` as the 5th argument: two browsers through the real
// matchmaking, a white garnish on one and a gold one on the other, each seen by the friend, both reaching the host's World.
// Needs a DEV server already running (not `vite preview`: it imports the game's modules); online needs the internet.
//   node scripts/garnish-shot.mjs [port=5497] [width=844] [height=390]          → shots/garnish/<width>-*.png
//   node scripts/garnish-shot.mjs [port=5497] 844 390 online                    → shots/garnish/online-*.png
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const PORT = Number(process.argv[2] ?? 5497), W = Number(process.argv[3] ?? 844), H = Number(process.argv[4] ?? 390), ONLINE = process.argv[5] === 'online';
const base = `http://localhost:${PORT}/`;
fs.mkdirSync('shots/garnish', { recursive: true });
const wait = ms => new Promise(r => setTimeout(r, ms));
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const errs = [];
const fail = m => { errs.push(m); console.log('FAIL:', m); };
const check = (ok, what) => { if (!ok) fail(what); return ok; };
async function open(url, vp, who = '') {
  const p = await (await b.newContext({ viewport: vp, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })).newPage();
  p.on('pageerror', e => errs.push(`${who}page error: ${e.message}`));
  p.on('console', m => { if (m.type() === 'error' && !/favicon|Failed to load resource/.test(m.text())) errs.push(`${who}console: ${m.text().slice(0, 200)}`); });
  await p.goto(url, { waitUntil: 'commit', timeout: 120000 }); await p.evaluate(() => localStorage.clear()); await p.reload({ waitUntil: 'commit', timeout: 120000 });
  for (let i = 0; i < 480 && !await p.evaluate(() => !!window.__kkq).catch(() => false); i++) await wait(250);
  await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(1200);
  for (let i = 0; i < 3; i++) await p.evaluate(() => document.querySelector('#story .skip, #story [data-skip]')?.click());
  await wait(400);
  return p;
}
/** everything about the badges in a stage: the HUD name plate, the teammate rows, the name tags, and (must be empty) any
 *  drop icon drawn on a kaiju puppet */
const badges = p => p.evaluate(() => {
  const s = window.__kkq.scene, rect = e => { const r = e.getBoundingClientRect(); return { l: r.left, t: r.top, r: r.right, b: r.bottom, w: r.width, h: r.height }; };
  const el = e => e && e.classList.contains('on') ? { icon: e.querySelector('img').src.split('/').pop().replace('.webp', '').replace(/^gb-/, 'drop-'), gold: e.classList.contains('gold'), ...rect(e), loaded: e.querySelector('img').naturalWidth > 0 } : null;
  const card = document.querySelector('#hud .card'), hp = document.querySelector('#hud .card .bar.hp'), nm = document.querySelector('#hud .card .nm');
  const onHead = [s.hero, ...s.mates.map(m => m.view)].flatMap(v => v.gear.filter(g => g.anchor === 'top' || String(g.img.texture.key).startsWith('drop-')).map(g => g.img.texture.key));
  return {
    mine: el(card.querySelector('.gnb')), card: rect(card), hp: rect(hp), name: rect(nm), nameText: nm.textContent,
    rows: [...document.querySelectorAll('#hud .mate.on')].map(m => ({ name: m.querySelector('b').textContent, badge: el(m.querySelector('.gnb')), row: rect(m) })),
    tags: s.mates.map(m => ({ i: m.i, text: m.tag.text, x: m.tag.x, y: m.tag.y, w: m.tag.width, h: m.tag.height, badge: m.badge ? { icon: String(m.badge.img.texture.key).replace(/^gb-/, 'drop-'), color: m.badge.ring.strokeColor, x: m.badge.ring.x, y: m.badge.ring.y, d: m.badge.ring.radius * 2, visible: m.badge.ring.visible && m.badge.img.visible, css: m.badge.ring.radius * 2 * s.cameras.main.zoom * innerHeight / 1080 } : null })),
    onHead, screen: { w: innerWidth, h: innerHeight },
  };
});
/** the checks every badge on the HUD must pass */
function hudBadgeOk(who, g, want, gold) {
  if (!check(!!g, `${who}: no garnish badge`)) return;
  check(g.icon === `drop-${want}` && g.gold === gold && g.loaded, `${who}: badge should be ${want} with a ${gold ? "gold" : "white"} ring, got ${JSON.stringify(g)}`);
  check(g.w >= 17.5 && g.h >= 17.5, `${who}: the badge is ${g.w.toFixed(1)} px, too small to read (18 px wanted)`);
}
function tagBadgeOk(who, t, want, gold) {
  if (!check(!!t?.badge, `${who}: the name tag has no garnish badge`)) return;
  const b = t.badge, lines = t.text.split('\n').length;
  check(b.icon === `drop-${want}` && b.color === (gold ? 0xffc83c : 0xffffff) && b.visible, `${who}: tag badge should be ${want} with a ${gold ? "gold" : "white"} ring, got ${JSON.stringify(b)}`);
  check(b.css >= 17.5, `${who}: the tag badge is ${b.css.toFixed(1)} CSS px`);
  check(b.x - b.d / 2 >= t.x && b.x - b.d / 2 <= t.x + t.w / 2 + 3, `${who}: the tag badge is not right after the name`);
  // on the name's line (the first), never down on the title line
  check(Math.abs(b.y - (t.y - t.h / 2 + t.h / lines / 2)) < 2, `${who}: the tag badge is not on the name line`);
}

if (!ONLINE) {
  const p = await open(base + '?touch', { width: W, height: H });
  const shot = async name => { await wait(350); await p.screenshot({ path: `shots/garnish/${W}-${name}.png` }); };
  const tap = async sel => { try { await p.locator(sel).first().tap({ timeout: 4000 }); await wait(160); return true; } catch { fail(`could not tap ${sel}`); return false; } };
  const has = sel => p.evaluate(s => !!document.querySelector(s), sel);
  const text = sel => p.evaluate(s => document.querySelector(s)?.textContent?.replace(/\s+/g, ' ').trim() ?? '', sel);
  const snap = () => p.evaluate(() => { const s = window.__kkq.save; return { drops: { ...(s.drops ?? {}) }, made: [...(s.garnishes ?? [])], worn: Object.fromEntries(Object.entries(s.heroes).map(([k, h]) => [k, h.garnish ?? null])), crumbs: s.crumbs, other: JSON.stringify([s.boxes, s.items, s.bag, s.cookbook, s.cookbookPaid]) }; });
  /** nothing sticks out of the screen */
  const fits = async name => {
    const r = await p.evaluate(() => ({
      out: [...document.querySelectorAll('.cb *, .hero *, .gnpick *, .cbask *')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.right > innerWidth + 1 || r.left < -1); }).map(e => e.className || e.tagName).slice(0, 5),
      low: [...document.querySelectorAll('.gnpick > div, .cbask > div')].filter(e => e.getBoundingClientRect().bottom > innerHeight + 1 || e.getBoundingClientRect().top < -1).length,
    }));
    check(!r.out.length, `${name}: these stick out of the screen: ${r.out}`); check(!r.low, `${name}: a dialog is taller than the screen`);
  };
  /** the fight numbers: what derive() says, and what the Hero tab prints */
  const power = () => p.evaluate(async () => {
    const { derive } = await import('/src/sim/stats.ts'); const s = window.__kkq.save, d = derive(s.heroes[s.selected]);
    return { derived: JSON.stringify(d, (k, v) => (k === 'cls' ? undefined : typeof v === 'function' ? undefined : v)), shown: [...document.querySelectorAll('.hero .rows')].map(e => e.textContent.replace(/\s+/g, ' ').trim()).join(' | ') };
  });

  // ---------- a save with worlds 1-3 open and four test cards on page 1
  const k = await p.evaluate(async () => {
    const { cookbook, cardNeeds, stageWants } = await import('/src/sim/cookbook.ts'); const { garnishCard, skipStages } = await import('/src/save.ts'); const { garnishCost } = await import('/src/sim/garnish.ts');
    const s = window.__kkq.save, h = s.heroes[s.selected], book = cookbook();
    for (let w = 1; w <= 3; w++) for (let n = 1; n <= 10; n++) h.cleared[`${w}-${n}`] = 'B';
    h.level = 30; h.seen.push('intro', 'w1-open', 'w2-open', 'w3-open'); s.storyMode = 'key'; s.tips = ['x']; s.crumbs = 500;
    s.drops = {}; s.cookbook = {}; s.cookbookPaid = {}; delete s.garnishes; for (const x of Object.values(s.heroes)) delete x.garnish;
    const other = [10, 11, 4, 1].find(sp => sp !== s.selected); s.unlocked = [...new Set([...s.unlocked, other])]; s.buddy = other;
    // every skip the player could make is affordable right now: hold exactly what each open stage's exits ask for
    const need = {};
    for (const st of skipStages()) for (const [kind, n] of Object.entries(stageWants(st))) need[kind] = Math.max(need[kind] ?? 0, n);
    Object.assign(s.drops, need);
    const kinds = book.pages[0].kinds, wanted = kinds.filter(x => need[x]), spare = kinds.filter(x => !need[x]);
    // plain: one star, plenty of drops, no skip needs them. gold: two stars, wanted by an exit, holding exactly enough to
    // candy, so making it breaks a skip. nostar: found only. short: one star, two drops short.
    const plain = spare[0] ?? wanted[2], gold = wanted[0], nostar = wanted[1] ?? spare[1], short = spare[1] ?? wanted[3];
    s.cookbook[plain] = cardNeeds(plain)[1]; s.drops[plain] = (need[plain] ?? 0) + garnishCost(plain) + 3;
    s.cookbook[gold] = cardNeeds(gold)[2]; s.drops[gold] = Math.max(need[gold], garnishCost(gold));
    s.cookbook[nostar] = cardNeeds(nostar)[0]; s.drops[nostar] = (need[nostar] ?? 0) + 12;
    s.cookbook[short] = cardNeeds(short)[1]; s.drops[short] = garnishCost(short) - 2;
    window.__kkq.scene.scene.restart({});
    const v = x => { const g = garnishCard(x); return { kind: x, name: g.name, drop: g.dropName, cost: g.cost, bag: g.bag, block: g.block, breaks: g.breaks, gold: g.gold, perk: g.perk, chance: g.chance }; };
    return { plain: v(plain), gold: v(gold), nostar: v(nostar), short: v(short), sel: s.selected, other };
  });
  await wait(900);
  console.log('test cards:', JSON.stringify(k));
  check(k.plain.block === null && !k.plain.breaks.length && k.gold.block === null && k.gold.breaks.length > 0 && k.gold.gold && k.nostar.block === 'card' && k.short.block === 'drops', 'the test save is not what the flow needs');

  // ---------- (1) the Hero tab before: an empty Garnish slot that says where garnishes come from
  await tap('[data-tab="hero"]'); await shot('1-hero-empty'); await fits('hero tab');
  const slot0 = await text('.slot.gslot');
  check(/Garnish/.test(slot0) && /Cookbook/.test(slot0), `the empty Garnish slot should say where garnishes come from: "${slot0}"`);
  check((await p.evaluate(() => document.querySelectorAll('.hero .slots > .slot').length)) === 4, 'the Hero tab should have four equipment slots');
  const before = await power();
  await tap('.slot.gslot'); await shot('1-picker-empty'); await fits('empty picker');
  check(await has('.gnpick') && /Cookbook/.test(await text('.gnpick p')), 'the empty picker should point at the Cookbook');
  await tap('.gnpick [data-gn="close"]');

  // ---------- (2) the Cookbook cards: not yet, not enough, CANDY IT
  await tap('[data-tab="bag"]'); await tap('[data-bag="cookbook"]'); await tap('[data-cb="page:1"]');
  check(!(await has('.gnbadge')), 'no card should carry a garnish badge yet');
  await tap(`[data-cb="card:${k.nostar.kind}"]`); await shot('2-card-no-star'); await fits('card without a star');
  check(/NEEDS ONE ★/.test(await text('.gnbox .pill')) && await p.evaluate(() => document.querySelector('.gnbox .pill').disabled), 'a card without a star should say NEEDS ONE ★');
  await tap('[data-cb="back"]'); await tap(`[data-cb="card:${k.short.kind}"]`); await shot('2-card-short');
  check((await text('.gnbox .pill')) === 'NEED 2 MORE', `two drops short should say NEED 2 MORE, got "${await text('.gnbox .pill')}"`);
  await tap('[data-cb="back"]'); await tap(`[data-cb="card:${k.plain.kind}"]`); await shot('2-card-can-candy'); await fits('card that can be candied');
  {
    const box = await text('.gnbox');
    console.log('garnish box:', box);
    check(box.includes(k.plain.perk) && box.includes(`${Math.round(k.plain.chance.plain * 100)}% → ${Math.round(k.plain.chance.worn * 100)}%`), 'the card should show the perk and plain → worn chance');
    check(!/faster|skip sooner|exit faster/i.test(box), 'the card must not promise faster exits');
    const b4 = await snap();
    await tap(`[data-gn="candy:${k.plain.kind}"]`); await wait(250); await p.screenshot({ path: `shots/garnish/${W}-2-candied.png` });
    const af = await snap();
    check(await has('.gnfan'), 'making a garnish should show the flourish');
    check(b4.drops[k.plain.kind] - (af.drops[k.plain.kind] ?? 0) === k.plain.cost, `CANDY IT took ${b4.drops[k.plain.kind] - (af.drops[k.plain.kind] ?? 0)} drops, the cost is ${k.plain.cost}`);
    check(af.made.length === 1 && af.made[0] === k.plain.kind, 'the garnish is not in save.garnishes');
    check(af.crumbs === b4.crumbs && af.other === b4.other && Object.keys(b4.drops).every(x => x === k.plain.kind || b4.drops[x] === af.drops[x]), 'CANDY IT touched something besides its own drops');
    check(!(await has('[data-gn^="candy:"]')) && /WEAR/.test(await text('.gnbox .pill')), 'a made garnish should offer WEAR, not CANDY IT again');
    // never twice, even when asked directly
    const again = await p.evaluate(async kind => { const { candyGarnish } = await import('/src/save.ts'); return candyGarnish(kind); }, k.plain.kind);
    const af2 = await snap();
    check(!again.ok && again.block === 'owned' && af2.drops[k.plain.kind] === af.drops[k.plain.kind] && af2.made.length === 1, 'a garnish could be made twice');
    await wait(3200);
  }
  // ---------- (3) the SKIP TO BOSS question: KEEP, then CANDY IT
  await tap('[data-cb="back"]'); await tap(`[data-cb="card:${k.gold.kind}"]`); await shot('3-card-warn');
  check(/⚠/.test(await text('.gnbox .pill')) && /SKIP TO BOSS/.test(await text('.gnbox')), 'the card should warn that candying breaks a SKIP TO BOSS');
  {
    const b4 = await snap();
    await tap(`[data-gn="candy:${k.gold.kind}"]`); await shot('3-ask'); await fits('CANDY IT question');
    check(await has('.cbask') && /SKIP TO BOSS/.test(await text('.cbask')) && (await text('.cbask .no')) === 'KEEP' && (await text('.cbask .yes')) === 'CANDY IT', 'the question should offer KEEP and CANDY IT');
    await tap('.cbask [data-gn="no"]');
    const kept = await snap();
    check(JSON.stringify(kept) === JSON.stringify(b4) && !(await has('.cbask')), 'KEEP changed the save or left the question up');
    check(/Kept/.test(await text('#camp .flashmsg')), 'KEEP should say the skip is safe');
    await tap(`[data-gn="candy:${k.gold.kind}"]`); await tap('.cbask [data-gn="yes"]'); await wait(250); await p.screenshot({ path: `shots/garnish/${W}-3-candied-gold.png` });
    const af = await snap();
    check(b4.drops[k.gold.kind] - (af.drops[k.gold.kind] ?? 0) === k.gold.cost && af.made.includes(k.gold.kind) && af.made.length === 2, 'CANDY IT after the question did not make it for exactly the cost');
    check(await has('.gnfan.gold') && await has('.gnbox.gold'), 'a two-star card should make a gold garnish');
    await wait(3200);
  }
  // ---------- (4) WEAR from the card; the grid's badge and who wears it
  await tap(`[data-gn="wear:${k.gold.kind}"]`); await shot('4-worn-from-card');
  check((await snap()).worn[k.sel] === k.gold.kind && (await text('.gnbox .pill')) === 'TAKE OFF' && /Worn by/.test(await text('.gnbox')), 'WEAR on the card did not put it on the selected kaiju');
  await tap('[data-cb="back"]'); await shot('4-grid-badges'); await fits('grid with badges');
  check((await p.evaluate(() => document.querySelectorAll('.gnbadge').length)) === 2 && await has('.gnbadge.gold img.fc'), 'the grid should badge both made garnishes and show the wearer on the worn one');

  // ---------- (5) the Hero tab: the slot, no power, the picker, None
  await tap('[data-tab="hero"]'); await shot('5-hero-worn'); await fits('hero tab worn');
  const slot1 = await text('.slot.gslot'), after = await power();
  console.log('slot:', slot1);
  check(slot1.includes(k.gold.drop) && slot1.includes(k.gold.perk), 'the Garnish slot should name the worn one and its perk');
  check(after.derived === before.derived, 'derive() changed after wearing a garnish: it must give no power');
  check(after.shown === before.shown, `the Hero tab's stats changed after wearing a garnish:\n  ${before.shown}\n  ${after.shown}`);
  check(await has('.portrait .gnn.gold img') && !(await has('.portrait .pgn')) && await p.evaluate(() => { const g = document.querySelector('.portrait .gnn'); const r = g.getBoundingClientRect(); return getComputedStyle(g).overflow === 'hidden' && r.width < 40 && /^width:/.test(g.querySelector('img').getAttribute('style') ?? ''); }), 'the Hero tab name line should carry the garnish badge (gold)');
  {
    const r = await p.evaluate(() => { const e = document.querySelector('.portrait .gnn'); return { w: e.getBoundingClientRect().width, title: e.title }; });
    check(r.w >= 17.5 && r.title.includes(k.gold.perk), `the name badge should be at least 18 px and carry the perk as its title: ${JSON.stringify(r)}`);
    await tap('.portrait .gnn');
    check((await text('#camp .flashmsg')).includes(k.gold.name) && (await text('#camp .flashmsg')).includes('more often'), 'tapping the name badge should show the monster and the perk');
    check((await power()).shown === before.shown, 'tapping the badge changed the stats');
  }
  // the longest kaiju name with the longest title and the badge: nothing overflows the portrait column
  {
    const long = await p.evaluate(async gold => {
      const { cookbook, titleName } = await import('/src/sim/cookbook.ts'); const { CLASSES } = await import('/src/sim/classes.ts'); const { wearGarnish } = await import('/src/save.ts');
      const s = window.__kkq.save, book = cookbook(), was = { selected: s.selected, paid: { ...s.cookbookPaid }, title: s.title ?? null, unlocked: [...s.unlocked] };
      const ids = [...book.pages.map(pg => 'w' + pg.id), 'all'].filter(id => titleName(id, book)).sort((a, b) => titleName(b, book).length - titleName(a, book).length);
      const sp = [...CLASSES].sort((a, b) => b.name.length - a.name.length)[0]; was.worn = s.heroes[sp.species].garnish ?? null;
      for (const pg of book.pages) s.cookbookPaid[pg.id] = 2;
      s.title = ids[0]; s.unlocked = [...new Set([...s.unlocked, sp.species])]; s.selected = sp.species; wearGarnish(sp.species, gold);
      window.__kkq.scene.scene.restart({});
      return { was, name: sp.name, sp: sp.species, title: titleName(ids[0], book) };
    }, k.gold.kind);
    await wait(900); await tap('[data-tab="hero"]'); await shot('5-hero-long-name');
    const r = await p.evaluate(() => { const po = document.querySelector('.portrait'), pr = po.getBoundingClientRect(); return { kids: [...po.querySelectorAll('h2, .cbtitle, .gnn')].map(e => { const q = e.getBoundingClientRect(); return { c: e.className || e.tagName, out: q.left < pr.left - 1 || q.right > pr.right + 1 || q.right > innerWidth }; }), badge: !!po.querySelector('.ttlrow .gnn'), title: po.querySelector('.cbtitle')?.textContent ?? '' }; });
    console.log('long name:', long.name, '·', long.title, JSON.stringify(r));
    check(r.badge && r.title.includes(long.title) && r.kids.every(x => !x.out), `${long.name} + "${long.title}" + badge overflows the portrait column`);
    // ...and on the stage HUD's name plate
    await p.evaluate(() => window.__kkq.play('1-2')); await wait(2500);
    const hb = await badges(p); await shot('5-hud-long-name');
    console.log('long name HUD:', hb.nameText, JSON.stringify(hb.mine), 'card', Math.round(hb.card.w), 'of', hb.screen.w);
    hudBadgeOk('long-name HUD', hb.mine, k.gold.kind, true);
    check(hb.mine && hb.mine.r <= hb.card.r && hb.mine.b <= hb.hp.t + 0.5 && hb.card.r < hb.screen.w * 0.5, 'the long-name plate: the badge should stay inside the card, above the HP bar');
    await p.evaluate(async ([long, was]) => { const { wearGarnish } = await import('/src/save.ts'); const s = window.__kkq.save; wearGarnish(long.sp, was.worn); s.selected = was.selected; s.cookbookPaid = was.paid; s.unlocked = was.unlocked; if (was.title) s.title = was.title; else delete s.title; window.__kkq.scene.scene.restart({}); }, [long, long.was]);
    await wait(900); await tap('[data-tab="hero"]');
  }
  await tap('.slot.gslot'); await shot('5-picker'); await fits('picker');
  {
    const cells = await p.evaluate(() => [...document.querySelectorAll('.gngrid button')].map(e => ({ name: e.querySelector('b').textContent, on: e.classList.contains('on'), gold: e.classList.contains('gold'), ring: !!e.querySelector('img.gn.gold') })));
    console.log('picker:', JSON.stringify(cells));
    check(cells.length === 3 && cells[0].name === 'None' && !cells[0].on, 'the picker should list None first, then the two made');
    check(cells.filter(c => c.on).length === 1 && cells.find(c => c.on)?.name === k.gold.name && cells.find(c => c.on)?.ring, 'the worn one should be marked, and gold');
    check(cells.find(c => c.name === k.plain.name) && !cells.find(c => c.name === k.plain.name).gold, 'a one-star garnish should not be gold');
  }
  await tap(`.gngrid [data-gn="wear:${k.plain.kind}"]`);
  check((await snap()).worn[k.sel] === k.plain.kind && !(await has('.gnpick')), 'picking another garnish should swap it (one per kaiju) and close the picker');
  check((await power()).derived === before.derived, 'derive() changed after swapping garnishes');
  await tap('.slot.gslot'); await tap('.gngrid [data-gn="wear:"]'); await shot('5-none');
  check((await snap()).worn[k.sel] === null && /Empty/.test(await text('.slot.gslot')), 'None should take the garnish off');
  check((await snap()).made.length === 2, 'taking a garnish off must not lose it');

  // ---------- (6) owned for good: it survives a reload
  await tap('.slot.gslot'); await tap(`.gngrid [data-gn="wear:${k.plain.kind}"]`);
  await p.evaluate(async ([other, kind]) => { const { wearGarnish } = await import('/src/save.ts'); wearGarnish(other, kind); }, [k.other, k.gold.kind]);
  await p.reload({ waitUntil: 'commit', timeout: 120000 });
  for (let i = 0; i < 480 && !await p.evaluate(() => !!window.__kkq).catch(() => false); i++) await wait(250);
  await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(1200);
  {
    const s = await snap();
    check(s.made.length === 2 && s.worn[k.sel] === k.plain.kind && s.worn[k.other] === k.gold.kind, 'garnishes made and worn should survive a reload');
  }
  // ---------- (7) a stage: on the kaiju (white), on the CPU buddy (gold), and the World knows the worn kind
  await p.evaluate(() => window.__kkq.play('1-2'));
  for (let i = 0; i < 80 && !await p.evaluate(() => !!window.__kkq.world()).catch(() => false); i++) await wait(250);
  await wait(1500);
  await p.evaluate(() => { const w = window.__kkq.world(); for (const h of w.heroes) h.inv = 9999; for (const m of w.mobs) m.x += 2500; document.getElementById('coach')?.classList.remove('on'); });
  await wait(700);
  await shot('7-stage');
  {
    const worn = await p.evaluate(() => window.__kkq.garnishes()), bd = await badges(p), humans = await p.evaluate(() => window.__kkq.world().humans);
    console.log('in the stage: world garnishes', JSON.stringify(worn), '· humans', humans, '· badges', JSON.stringify(bd));
    check(JSON.stringify(worn) === JSON.stringify([k.plain.kind]), `the World should count the player's garnish only (the CPU buddy's gives nothing): ${JSON.stringify(worn)}`);
    check(bd.onHead.length === 0, `nothing may be drawn on a kaiju head any more: ${bd.onHead}`);
    hudBadgeOk('HUD name plate', bd.mine, k.plain.kind, false);
    check(bd.mine && bd.mine.l >= bd.name.r - 1 && bd.mine.b <= bd.hp.t + 0.5 && bd.mine.r <= bd.card.r, 'the HUD badge should sit after the name and level, inside the card and above the HP bar');
    hudBadgeOk('HUD teammate row', bd.rows[0]?.badge, k.gold.kind, true);
    check(bd.rows[0]?.badge && bd.rows[0].badge.r <= bd.rows[0].row.r + 0.5 && bd.rows[0].badge.b <= bd.rows[0].row.b + 0.5, 'the teammate row badge should stay inside its row');
    tagBadgeOk('CPU buddy', bd.tags[0], k.gold.kind, true);
    // close-ups: the name plate + teammate row, and the buddy with its tag
    await p.screenshot({ path: `shots/garnish/${W}-7-hud.png`, clip: { x: 0, y: 0, width: Math.min(W, 330), height: Math.min(H, 150) } });
    const pos = await p.evaluate(() => { const s = window.__kkq.scene, cam = s.cameras.main, m = cam.getWorldPoint(0, 0), h = window.__kkq.world().heroes[1]; return { x: (h.x - m.x) * cam.zoom, y: (h.y - m.y) * cam.zoom }; });
    const sc = H / 1080;
    await p.screenshot({ path: `shots/garnish/${W}-7-buddy-tag.png`, clip: { x: Math.max(0, pos.x * sc - 80), y: Math.max(0, pos.y * sc - 140), width: 160, height: 150 } });
  }
  // a kaiju wearing nothing tells the World nothing
  await p.evaluate(async sel => { const { wearGarnish } = await import('/src/save.ts'); wearGarnish(sel, null); window.__kkq.play('1-2'); }, k.sel);
  await wait(2500);
  check((await p.evaluate(() => window.__kkq.garnishes())).length === 0 && (await badges(p)).mine === null, 'with no garnish worn the World should hold none and the name plate should show no badge');
} else {
  // ---------- online: host wears a white one, the guest a gold one; each sees the other's; the host's World holds both
  const host = await open(base, { width: 844, height: 390 }, 'host: '), guest = await open(base + '?touch', { width: 844, height: 390 }, 'guest: ');
  const setup = (p, name, sp, kind, level) => p.evaluate(async ([name, sp, kind, level]) => {
    const { cardNeeds } = await import('/src/sim/cookbook.ts'); const { wearGarnish } = await import('/src/save.ts');
    const s = window.__kkq.save; s.netName = name; s.unlocked = [...new Set([...s.unlocked, sp])]; s.selected = sp; s.heroes[sp].level = 9; s.tips = ['x'];
    for (let n = 1; n <= 5; n++) s.heroes[sp].cleared['1-' + n] = 'A';
    s.cookbook = { [kind]: cardNeeds(kind)[level - 1] }; s.garnishes = [kind];
    if (level === 3) { s.cookbookPaid = { 3: 2 }; s.title = 'w3'; } // the gold one also shows a title: the tag's second line
    const ok = wearGarnish(sp, kind);
    window.__kkq.scene.scene.restart({});
    return ok;
  }, [name, sp, kind, level]);
  const until = async (p, fn, what, ms = 25000) => { for (let t = 0; t < ms; t += 250) { if (await p.evaluate(fn).catch(() => false)) return; await wait(250); } throw new Error('timed out: ' + what); };
  const kinds = await host.evaluate(async () => { const { cookbook } = await import('/src/sim/cookbook.ts'); return cookbook().pages[0].kinds.slice(0, 2); });
  check(await setup(host, 'Pat', 0, kinds[0], 2) && await setup(guest, 'Kiddo Great', 10, kinds[1], 3), 'could not put the garnishes on');
  await wait(800);
  await host.evaluate(() => document.querySelector('[data-act=online]').click()); await wait(300);
  await host.evaluate(() => document.querySelector('[data-o=host]').click());
  await until(host, () => /^[A-Z]{4}$/.test(document.querySelector('#online .code')?.textContent ?? ''), 'room code');
  const code = await host.evaluate(() => document.querySelector('#online .code').textContent);
  await guest.evaluate(() => document.querySelector('[data-act=online]').click()); await wait(300);
  await guest.fill('[data-f=code]', code);
  await guest.evaluate(() => document.querySelector('[data-o=join]').click());
  await until(host, () => document.querySelectorAll('#online .seat:not(.empty)').length === 2, 'guest seat on host', 40000);
  await until(guest, () => document.querySelectorAll('#online .seat').length === 2, 'lobby on guest');
  await wait(800);
  // the lobby rows: both badges on both screens, white then gold, after the names, inside their seats
  for (const [who, p] of [['host', host], ['guest', guest]]) {
    const rows = await p.evaluate(() => [...document.querySelectorAll('#online .seat:not(.empty)')].map(e => { const g = e.querySelector('b .gnn'), r = e.getBoundingClientRect(), q = g?.getBoundingClientRect(); return { name: e.querySelector('b').textContent, icon: g?.querySelector('img').src.split('/').pop().replace('.webp', '').replace(/^gb-/, 'drop-') ?? null, gold: g?.classList.contains('gold') ?? null, w: q?.width ?? 0, inside: !!q && q.left >= r.left && q.right <= r.right, tip: g?.title ?? '', ttl: e.querySelector('.ttl')?.textContent ?? '' }; }));
    console.log(`${who} lobby:`, JSON.stringify(rows));
    check(rows.length === 2 && rows[0].icon === `drop-${kinds[0]}` && rows[0].gold === false && rows[1].icon === `drop-${kinds[1]}` && rows[1].gold === true, `${who}: the lobby rows should show a white and a gold garnish badge`);
    check(rows.every(r => r.w >= 17.5 && r.inside && /more often/.test(r.tip)), `${who}: lobby badges should be 18 px or more, inside the seat, with the perk as title`);
    await p.screenshot({ path: `shots/garnish/online-lobby-${who}.png` });
  }
  await host.evaluate(() => { const s = document.querySelector('[data-f=stage]'); s.value = '1-2'; s.dispatchEvent(new Event('change')); });
  await wait(600);
  await host.evaluate(() => document.querySelector('[data-o=start]').click());
  await until(guest, () => !!window.__kkq.world(), 'guest in stage'); await until(host, () => !!window.__kkq.world(), 'host in stage');
  await host.evaluate(() => { const w = window.__kkq.world(); for (const h of w.heroes) h.inv = 9999; for (const m of w.mobs) m.x += 2500; });
  await wait(2500);
  const kits = await host.evaluate(() => window.__kkq.scene.online.kits.map(x => ({ name: x.name, garnish: x.profile.garnish ?? null, gold: x.profile.garnishGold ?? null })));
  const hw = await host.evaluate(() => window.__kkq.garnishes()), gw = await guest.evaluate(() => window.__kkq.garnishes());
  console.log('kits on the host:', JSON.stringify(kits), '· host World:', JSON.stringify(hw), '· guest World:', JSON.stringify(gw));
  check(kits[0].garnish === kinds[0] && kits[0].gold === null && kits[1].garnish === kinds[1] && kits[1].gold === true, 'the kits should carry garnish and the gold flag (only when true)');
  check(JSON.stringify(hw) === JSON.stringify(kinds), 'the host\'s World (the one that rolls drops) should hold both players\' garnishes');
  for (const [who, p, mine, friend] of [['host', host, 0, 1], ['guest', guest, 1, 0]]) {
    const bd = await badges(p);
    console.log(`${who} sees:`, JSON.stringify(bd));
    check(bd.onHead.length === 0, `${who}: nothing may be drawn on a kaiju head: ${bd.onHead}`);
    hudBadgeOk(`${who} name plate`, bd.mine, kinds[mine], mine === 1);
    hudBadgeOk(`${who} teammate row`, bd.rows[0]?.badge, kinds[friend], friend === 1);
    tagBadgeOk(`${who}: friend tag`, bd.tags[0], kinds[friend], friend === 1);
    if (friend === 1) check(bd.tags[0]?.text.split('\n').length === 2, 'the friend with a title should still show it on the second line of the tag');
    await p.screenshot({ path: `shots/garnish/online-play-${who}.png` });
  }
}
console.log(errs.length ? `${errs.length} problem(s):\n` + errs.join('\n') : `garnish-shot ${ONLINE ? 'online' : W + 'x' + H}: all checks passed`);
await b.close(); process.exit(errs.length ? 1 : 0);
