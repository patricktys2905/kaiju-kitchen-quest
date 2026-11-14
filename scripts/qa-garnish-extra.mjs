// QA extras for the Garnish, in a real browser against a DEV server:  node scripts/qa-garnish-extra.mjs <port> [W] [H] [sections]
// sections: persist,stats,picker,w11,states,odd (default all) → shots/qa2/garnish/x<W>-*.png and a log line per check.
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const PORT = Number(process.argv[2] ?? 5611), W = Number(process.argv[3] ?? 844), H = Number(process.argv[4] ?? 390);
const only = process.argv[5] ? process.argv[5].split(',') : null, want = s => !only || only.includes(s);
const base = `http://localhost:${PORT}/?touch`, KEY = 'kkq-save-v3';
fs.mkdirSync('shots/qa2/garnish', { recursive: true });
const wait = ms => new Promise(r => setTimeout(r, ms));
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const p = await (await b.newContext({ viewport: { width: W, height: H }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })).newPage();
let errs = [];
p.on('pageerror', e => errs.push('page error: ' + e.message));
p.on('console', m => { if (m.type() === 'error' && !/favicon|Failed to load resource/.test(m.text())) errs.push('console: ' + m.text().slice(0, 200)); });
const fails = [];
const check = (ok, what) => { console.log((ok ? 'ok   ' : 'FAIL ') + what); if (!ok) fails.push(what); return ok; };
const shot = async name => { await wait(300); await p.screenshot({ path: `shots/qa2/garnish/x${W}-${name}.png` }); };
const boot = async () => {
  await p.reload({ waitUntil: 'commit', timeout: 120000 });
  for (let i = 0; i < 480 && !await p.evaluate(() => !!window.__kkq).catch(() => false); i++) await wait(250);
  await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(1000);
  for (let i = 0; i < 3; i++) await p.evaluate(() => document.querySelector('#story .skip, #story [data-skip]')?.click());
  await wait(400);
};
const tap = async sel => { try { await p.locator(sel).first().tap({ timeout: 4000 }); await wait(200); return true; } catch { check(false, `could not tap ${sel}`); return false; } };
const tapIf = async sel => { if (await p.evaluate(s => !!document.querySelector(s), sel)) await tap(sel); };
const text = sel => p.evaluate(s => document.querySelector(s)?.textContent?.replace(/\s+/g, ' ').trim() ?? '', sel);
await p.goto(base, { waitUntil: 'commit', timeout: 120000 }); await p.evaluate(() => localStorage.clear()); await boot();
/** a progressed save: worlds 1..11 cleared on kaiju 0, a few kaiju unlocked, cards with stars, drops in the bag */
const seed = () => p.evaluate(async () => {
  const { cookbook, cardNeeds } = await import('/src/sim/cookbook.ts');
  const s = window.__kkq.save, book = cookbook();
  s.unlocked = [...new Set([...s.unlocked, 0, 10, 19, 16])]; s.selected = 0;
  for (const sp of [0, 10, 19, 16]) { const h = s.heroes[sp]; h.level = 115; for (let w = 1; w <= 11; w++) for (let n = 1; n <= 10; n++) h.cleared[`${w}-${n}`] = 'A'; h.seen = [...new Set([...(h.seen ?? []), 'intro'])]; }
  s.storyMode = 'key'; s.tips = ['move', 'jump', 'attack', 'dodge', 'skill', 'gear', 'weak', 'resist', 'ladder', 'drop', 'arena', 'hazard', 'sponge', 'potion', 'escort', 'fetch', 'boss', 'cookbook', 'exit', 'x']; s.crumbs = 5000;
  s.drops = {}; s.cookbook = {}; s.cookbookPaid = {}; delete s.garnishes; for (const x of Object.values(s.heroes)) delete x.garnish;
  for (const k of book.pages.flatMap(q => q.kinds)) { s.cookbook[k] = cardNeeds(k)[1]; s.drops[k] = 40; }
  s.cookbook.floss = cardNeeds('floss')[2];
  window.__kkq.scene.scene.restart({});
  return { spare: [...book.spare], w11: book.pages[10].kinds };
});
const info = await seed(); await wait(900);
const sv = () => p.evaluate(() => { const s = window.__kkq.save; return { drops: { ...s.drops }, made: [...(s.garnishes ?? [])], worn: Object.fromEntries(Object.entries(s.heroes).filter(([, h]) => h.garnish).map(([k, h]) => [k, h.garnish])) }; });
const openCard = async kind => { await tap('[data-tab="bag"]'); await tap('[data-bag="cookbook"]'); const pg = await p.evaluate(async k => { const { cookbook } = await import('/src/sim/cookbook.ts'); return cookbook().pageOf[k].id; }, kind); await tap(`[data-cb="page:${pg}"]`); await tap(`[data-cb="card:${kind}"]`); };
const answerAsk = async () => { if (await p.evaluate(() => !!document.querySelector('.cbask'))) { await tap('.cbask [data-gn="yes"]'); return true; } return false; };

if (want('w11')) {
  // World 11 cards: a wanted kind (cadet, 10) and a never-wanted kind (snowcone, 6) and the two-star gold one (floss)
  for (const kind of ['cadet', 'snowcone', 'floss']) {
    await openCard(kind);
    const box = await text('.gnbox'), b4 = await sv();
    console.log(`card ${kind}: ${box}`);
    await shot(`w11-card-${kind}`);
    const cost = info.spare.includes(kind) ? 6 : 10;
    check(new RegExp(`Costs ${cost} `).test(box) || new RegExp(`· ${cost}`).test(box), `${kind}: the card names the cost ${cost}`);
    check(/no fighting power/.test(box), `${kind}: the card says no fighting power`);
    check(info.spare.includes(kind) ? /35% → 50%/.test(box) && !/except/.test(box) : /20% → 35%/.test(box) && /except while an exit is collecting it/.test(box), `${kind}: the right chance and wording`);
    await tap(`[data-gn="candy:${kind}"]`); const asked = await answerAsk(); await wait(300);
    const af = await sv();
    check(b4.drops[kind] - (af.drops[kind] ?? 0) === cost, `${kind}: CANDY IT took exactly ${cost} (took ${b4.drops[kind] - (af.drops[kind] ?? 0)}; skip question shown: ${asked})`);
    check(af.made.includes(kind), `${kind}: owned after CANDY IT`);
    await shot(`w11-candied-${kind}`);
    await wait(3000);
    const fits = await p.evaluate(() => [...document.querySelectorAll('.cb *')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.right > innerWidth + 1 || r.left < -1 || (e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).overflow === 'hidden' && e.children.length === 0)); }).map(e => (e.className || e.tagName) + ':' + e.textContent.slice(0, 30)).slice(0, 6));
    check(!fits.length, `${kind}: nothing on the card sticks out or is cut (${fits.join(' | ')})`);
    await tap('[data-cb="back"]');
  }
  await shot('w11-page');
}
if (want('persist')) {
  // wear cadet on kaiju 0 from the card, floss on kaiju 19 from the Hero tab; reload; still owned, still worn, drops still reduced
  if (!(await sv()).made.includes('cadet')) await p.evaluate(async () => { const { candyGarnish } = await import('/src/save.ts'); candyGarnish('cadet'); candyGarnish('floss'); candyGarnish('snowcone'); });
  await openCard('cadet'); await tap('[data-gn="wear:cadet"]');
  await p.evaluate(() => { window.__kkq.save.selected = 19; window.__kkq.scene.scene.restart({}); }); await wait(900);
  await tap('[data-tab="hero"]'); await tap('.slot.gslot'); await shot('picker-3'); await tap('.gnpick [data-gn="wear:floss"]'); await tapIf('.gnpick [data-gn="close"]');
  await shot('hero-19-floss-gold');
  const b4 = await sv();
  check(b4.worn[0] === 'cadet' && b4.worn[19] === 'floss', `each kaiju keeps its own garnish: ${JSON.stringify(b4.worn)}`);
  const stored = await p.evaluate(k => { const s = JSON.parse(localStorage.getItem(k)); return { made: s.garnishes, w0: s.heroes[0].garnish, w19: s.heroes[19].garnish, gold: Object.values(s.heroes).some(h => 'garnishGold' in h) }; }, KEY);
  check(JSON.stringify(stored.made) === JSON.stringify(b4.made) && stored.w0 === 'cadet' && stored.w19 === 'floss' && !stored.gold, `written to localStorage without tapping anything else: ${JSON.stringify(stored)}`);
  await boot();
  const af = await sv();
  check(JSON.stringify(af) === JSON.stringify(b4), `after a reload: same owned list, same worn, same drops (${JSON.stringify(af.made)} ${JSON.stringify(af.worn)})`);
  // same garnish on two kaiju
  const two = await p.evaluate(async () => { const { wearGarnish } = await import('/src/save.ts'); const ok = wearGarnish(10, 'cadet'); const s = window.__kkq.save; return { ok, w0: s.heroes[0].garnish, w10: s.heroes[10].garnish }; });
  check(two.ok && two.w0 === 'cadet' && two.w10 === 'cadet', 'two kaiju can wear the same garnish');
  // a locked kaiju / an unowned kind through the API
  const odd = await p.evaluate(async () => { const { wearGarnish, candyGarnish } = await import('/src/save.ts'); return { unowned: wearGarnish(0, 'toffee'), junk: wearGarnish(0, 'nope'), again: candyGarnish('cadet') }; });
  check(odd.unowned === false && odd.junk === false && !odd.again.ok, `cannot wear an unowned or unknown kind, cannot candy twice: ${JSON.stringify(odd)}`);
  await p.evaluate(() => { window.__kkq.save.selected = 0; window.__kkq.scene.scene.restart({}); }); await wait(900);
}
if (want('stats')) {
  await p.evaluate(async () => { const { candyGarnish, wearGarnish } = await import('/src/save.ts'); candyGarnish('cadet'); candyGarnish('floss'); wearGarnish(0, null); window.__kkq.save.selected = 0; window.__kkq.scene.scene.restart({}); }); await wait(900);
  const read = async () => { await tap('[data-tab="skills"]'); await tap('[data-tab="hero"]'); return p.evaluate(async () => { const { derive } = await import('/src/sim/stats.ts'); const s = window.__kkq.save; const c = document.querySelector('.hero').cloneNode(true); c.querySelectorAll('.gslot, .pgn, .gnpick').forEach(e => e.remove()); return { shown: c.textContent.replace(/\s+/g, ' ').trim(), derived: JSON.stringify(derive(s.heroes[s.selected]), (k, v) => (k === 'cls' || typeof v === 'function' ? undefined : v)), slot: document.querySelector('.gslot')?.textContent.replace(/\s+/g, ' ').trim(), port: !!document.querySelector('.portrait .pgn') }; }); };
  const none = await read();
  await p.evaluate(async () => { const { wearGarnish } = await import('/src/save.ts'); wearGarnish(0, 'cadet'); });
  const white = await read(); await shot('hero-white');
  await p.evaluate(async () => { const { wearGarnish } = await import('/src/save.ts'); wearGarnish(0, 'floss'); });
  const gold = await read(); await shot('hero-gold');
  console.log('hero tab text (no garnish, garnish parts removed):', none.shown.slice(0, 400));
  console.log('slot white:', white.slot, '| slot gold:', gold.slot, '| portrait badge:', none.port, white.port, gold.port);
  check(none.shown === white.shown && none.shown === gold.shown, 'Hero tab text outside the Garnish slot is identical with none / white / gold');
  check(none.derived === white.derived && none.derived === gold.derived, 'derive() of the selected kaiju is identical with none / white / gold');
  const pr = await p.evaluate(() => { const e = document.querySelector('.portrait'); const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: Math.min(r.height, innerHeight - r.y) }; });
  await p.screenshot({ path: `shots/qa2/garnish/x${W}-portrait-gold.png`, clip: pr });
}
if (want('picker')) {
  // every garnish owned: does the picker fit, scroll, and can the last one and DONE be tapped
  await p.evaluate(async () => { const { cookbook } = await import('/src/sim/cookbook.ts'); const s = window.__kkq.save; s.garnishes = cookbook().pages.flatMap(q => q.kinds); s.selected = 0; window.__kkq.scene.scene.restart({}); }); await wait(900);
  await tap('[data-tab="hero"]'); await tap('.slot.gslot'); await shot('picker-all');
  const g = await p.evaluate(() => { const d = document.querySelector('.gnpick > div').getBoundingClientRect(), gr = document.querySelector('.gngrid'), done = document.querySelector('.gnpick [data-gn="close"]').getBoundingClientRect(); return { n: gr.children.length, dialogTop: Math.round(d.top), dialogBottom: Math.round(d.bottom), vh: innerHeight, scrolls: gr.scrollHeight > gr.clientHeight + 2, gridH: Math.round(gr.clientHeight), doneBottom: Math.round(done.bottom), cellH: Math.round(gr.children[1].getBoundingClientRect().height) }; });
  console.log('picker with every garnish:', JSON.stringify(g));
  check(g.n === 92, `the picker lists None + 91 garnishes (${g.n})`);
  check(g.dialogTop >= 0 && g.dialogBottom <= g.vh && g.doneBottom <= g.vh, 'the picker and its DONE button are on screen');
  check(g.gridH >= g.cellH * 1.5, `the picker's grid shows at least a row and a half (${g.gridH}px of grid, a cell is ${g.cellH}px)`);
  const last = await p.evaluate(() => document.querySelector('.gngrid').lastElementChild.dataset.gn);
  await p.locator('.gngrid > :last-child').scrollIntoViewIfNeeded(); await tap('.gngrid > :last-child'); await shot('picker-all-last');
  const w = await sv(); check('wear:' + w.worn[0] === last, `the last garnish in the grid can be scrolled to and worn (${last}, worn ${w.worn[0]})`);
  if (!await p.evaluate(() => !!document.querySelector('.gnpick'))) await tap('.slot.gslot'); await tap('.gnpick [data-gn="wear:"]'); const w2 = await sv(); check(!w2.worn[0], 'None takes it off');
  await tapIf('.gnpick [data-gn="close"]');
  await tap('[data-tab="bag"]'); await tap('[data-bag="cookbook"]'); await tap('[data-cb="page:11"]'); await shot('page11-all-owned');
}
if (want('states')) {
  // in a stage, with a buddy: real hero states
  await p.evaluate(async () => { const { cookbook, cardNeeds } = await import('/src/sim/cookbook.ts'); const s = window.__kkq.save; s.garnishes = ['cadet', 'floss', 'bumper']; s.cookbook.floss = cardNeeds('floss')[2]; s.selected = 0; s.heroes[0].garnish = 'cadet'; s.heroes[10].garnish = 'floss'; s.buddy = 10; window.__kkq.play('11-1'); });
  await wait(2500);
  const clipHero = async (name, i = 0) => { const q = await p.evaluate(i => { const s = window.__kkq.scene, cam = s.cameras.main, m = cam.getWorldPoint(0, 0), h = window.__kkq.world().heroes[i]; return { x: (h.x - m.x) * cam.zoom, y: (h.y - m.y) * cam.zoom }; }, i); const sc = H / 1080; await p.screenshot({ path: `shots/qa2/garnish/x${W}-state-${name}.png`, clip: { x: Math.max(0, Math.min(W - 170, q.x * sc - 85)), y: Math.max(0, q.y * sc - 130), width: 170, height: 150 } }); };
  const head = i => p.evaluate(i => { const s = window.__kkq.scene; if (i === 0) { const e = document.querySelector('#hud .card .gnb') ?? document.querySelector('.card .gnb'); if (!e || !e.classList.contains('on')) return null; const r = e.getBoundingClientRect(); return { icon: e.firstElementChild.src.match(/drop-[a-z0-9]+/)?.[0], color: e.classList.contains('gold') ? 0xffc83c : 0xffffff, visible: r.width > 4 && r.right <= innerWidth, px: Math.round(r.width) }; } const m = s.mates.find(m => m.i === i), b = m?.badge; return b ? { icon: b.img.texture.key, color: b.ring.strokeColor, visible: b.img.visible && b.ring.visible } : null; }, i);
  await p.evaluate(() => { const w = window.__kkq.world(); for (const h of w.heroes) h.inv = 9999; for (const m of w.mobs) m.x += 2500; w.hero.x += 300; document.getElementById('coach')?.classList.remove('on'); });
  await wait(800); await shot('stage-11-1'); await clipHero('idle'); await clipHero('buddy-idle', 1);
  const h0 = await head(0), h1 = await head(1);
  console.log('heads:', JSON.stringify(h0), JSON.stringify(h1), 'world garnishes', JSON.stringify(await p.evaluate(() => window.__kkq.garnishes())));
  check(h0?.icon === 'drop-cadet' && h0.color === 0xffffff && h0.visible, 'hero wears a white-outlined Paper Hat in 11-1');
  check(h1?.icon === 'drop-floss' && h1.color === 0xffc83c && h1.visible, 'buddy wears a gold-outlined Floss Puff');
  check(JSON.stringify(await p.evaluate(() => window.__kkq.garnishes())) === '["cadet"]', 'the World counts only the player\'s garnish, not the buddy\'s');
  // dodge (double tap right), jump, attack, skill, ult by keys
  await p.keyboard.press('ArrowRight', { delay: 30 }); await wait(40); await p.keyboard.down('ArrowRight'); await wait(120); await clipHero('dodge'); console.log('state at dodge shot:', await p.evaluate(() => window.__kkq.world().hero.state)); await p.keyboard.up('ArrowRight'); await wait(500);
  await p.keyboard.down('Space'); await wait(160); await clipHero('jump'); await p.keyboard.up('Space'); await wait(700);
  await p.keyboard.down('KeyJ'); await wait(120); await clipHero('attack'); await p.keyboard.up('KeyJ'); await wait(500);
  await p.keyboard.down('KeyL'); await wait(200); await clipHero('skill'); console.log('state at skill shot:', await p.evaluate(() => window.__kkq.world().hero.state)); await p.keyboard.up('KeyL'); await wait(900);
  await p.evaluate(() => { const h = window.__kkq.world().hero; h.ult = h.d.ultMax ?? 100; if ('ultCharge' in h) h.ultCharge = 1; });
  await p.keyboard.down('KeyU'); await wait(250); await clipHero('ult'); console.log('state at ult shot:', await p.evaluate(() => { const h = window.__kkq.world().hero; return h.state + '/' + (h.skill?.id ?? ''); })); await p.keyboard.up('KeyU'); await wait(1200);
  // ladder
  const lad = await p.evaluate(() => { const w = window.__kkq.world(), h = w.hero, l = w.stage.ladders.filter(l => l.x > h.x - 200).sort((a, b) => a.x - b.x)[0]; if (!l) return null; h.x = l.x; h.y = l.bottom; return l; });
  if (lad) { await wait(200); await p.keyboard.down('ArrowUp'); await wait(600); await clipHero('climb'); console.log('state at climb shot:', await p.evaluate(() => window.__kkq.world().hero.state)); await p.keyboard.up('ArrowUp'); await p.keyboard.press('Space'); await wait(800); }
  // hurt and down for real
  await p.evaluate(() => { const w = window.__kkq.world(), h = w.hero; h.inv = 0; h.hp = 1; const m = w.mobs.find(m => m.state !== 'dead'); if (m) { m.x = h.x + 40; m.y = h.y; } });
  for (let i = 0; i < 120 && await p.evaluate(() => window.__kkq.world().hero.state !== 'down'); i++) { await p.evaluate(() => { const w = window.__kkq.world(), h = w.hero; h.inv = 0; h.hp = Math.min(h.hp, 1); const m = w.mobs.find(m => m.state !== 'dead'); if (m && Math.abs(m.x - h.x) > 60) { m.x = h.x + 40; m.y = h.y; } }); await wait(100); }
  await wait(500); await clipHero('down'); console.log('state at down shot:', await p.evaluate(() => window.__kkq.world().hero.state), JSON.stringify(await head(0)));
  await shot('stage-down');
  await p.evaluate(() => window.__kkq.scene.scene.restart({})); await wait(900);
}
if (want('odd')) {
  // old and odd saves through the real loader, then every tab, a Cookbook card, the picker, and a stage
  const good = await p.evaluate(k => { window.__kkq.scene.scene.restart({}); return localStorage.getItem(k); }, KEY);
  const mk = fn => { const s = JSON.parse(good); fn(s); return JSON.stringify(s); };
  const cases = {
    'old-no-fields': mk(s => { delete s.garnishes; for (const h of Object.values(s.heroes)) delete h.garnish; }),
    'pre-cookbook-save': mk(s => { delete s.garnishes; delete s.cookbook; delete s.cookbookPaid; delete s.title; delete s.drops; for (const h of Object.values(s.heroes)) delete h.garnish; }),
    'unknown-kind': mk(s => { s.garnishes = ['nope', 'cadet']; s.heroes[0].garnish = 'nope'; }),
    'worn-not-owned': mk(s => { s.garnishes = ['cadet']; s.heroes[0].garnish = 'toffee'; }),
    'list-string': mk(s => { s.garnishes = 'cadet'; s.heroes[0].garnish = 'cadet'; }),
    'list-null': mk(s => { s.garnishes = null; s.heroes[0].garnish = 'cadet'; }),
    'list-object': mk(s => { s.garnishes = { cadet: 1 }; s.heroes[0].garnish = 'cadet'; }),
    'list-number': mk(s => { s.garnishes = 7; s.heroes[0].garnish = 7; }),
    'dupes-junk': mk(s => { s.garnishes = ['cadet', 'cadet', 5, null, {}, [], 'toString', '__proto__', 'constructor', 'floss']; s.heroes[0].garnish = 'constructor'; s.heroes[10].garnish = { a: 1 }; s.heroes[19].garnish = ['cadet']; }),
    'huge-list': mk(s => { s.garnishes = Array.from({ length: 20000 }, (_, i) => (i % 3 ? 'cadet' : 'junk' + i)); s.heroes[0].garnish = 'cadet'; }),
    'locked-kaiju-wears': mk(s => { s.garnishes = ['cadet']; s.heroes[3].garnish = 'cadet'; s.unlocked = s.unlocked.filter(x => x !== 3); }),
    'boss-kind': mk(s => { s.garnishes = ['flosso', 'toast', 'cadet']; s.heroes[0].garnish = 'flosso'; }),
    'gold-flag-no-stars': mk(s => { s.garnishes = ['cadet']; s.cookbook.cadet = 0; s.heroes[0].garnish = 'cadet'; s.heroes[0].garnishGold = true; }),
    'owned-card-never-found': mk(s => { s.garnishes = ['cadet', 'floss']; delete s.cookbook.cadet; delete s.cookbook.floss; s.drops = {}; s.heroes[0].garnish = 'cadet'; }),
    'odd-drops-with-garnish': mk(s => { s.garnishes = ['cadet']; s.heroes[0].garnish = 'cadet'; s.drops = { cadet: -5, floss: 'x', toffee: 1e99, nope: 3, bumper: null, snowcone: 5.5 }; s.cookbook = { cadet: 'x', floss: -1, toffee: 1e9 }; }),
    'buddy-wears-junk': mk(s => { s.garnishes = ['cadet']; s.buddy = 10; s.heroes[10].garnish = 'cadet'; s.heroes[10].garnishGold = 'yes'; }),
  };
  for (const [name, raw] of Object.entries(cases)) for (let attempt = 0; attempt < 3; attempt++) { try {
    errs = [];
    await p.evaluate(([k, raw]) => { localStorage.setItem(k, raw); }, [KEY, raw]);
    await boot();
    const st = await p.evaluate(() => { const s = window.__kkq.save; return { garnishes: Array.isArray(s.garnishes) ? (s.garnishes.length > 6 ? s.garnishes.length + ' items' : s.garnishes) : s.garnishes === undefined ? 'absent' : typeof s.garnishes, worn: Object.fromEntries(Object.entries(s.heroes).filter(([, h]) => 'garnish' in h).map(([k, h]) => [k, h.garnish])), gold: Object.values(s.heroes).filter(h => 'garnishGold' in h).length, sel: s.selected }; });
    const bad = [];
    const look = async where => { const t = await p.evaluate(() => document.getElementById('camp')?.innerText ?? ''); if (/hit a snag/.test(t)) bad.push(`${where}: hit a snag: ${t.match(/hit a snag[^\n]*\n[^\n]*/)?.[0]}`); if (/undefined|NaN|\[object/.test(t)) bad.push(`${where}: "${t.match(/.{0,30}(undefined|NaN|\[object).{0,30}/)?.[0]}"`); };
    for (const t of ['map', 'free', 'hero', 'skills', 'bag', 'market', 'boxes', 'quests']) { await p.evaluate(t => document.querySelector(`[data-tab="${t}"]`)?.click(), t); await wait(180); await look(t); }
    await p.evaluate(() => document.querySelector('[data-tab="hero"]')?.click()); await wait(150);
    await p.evaluate(() => document.querySelector('.slot.gslot')?.click()); await wait(200); await look('picker');
    const pick = await p.evaluate(() => document.querySelectorAll('.gngrid > *').length);
    await p.evaluate(() => document.querySelector('.gnpick [data-gn="close"]')?.click()); await wait(120);
    await p.evaluate(() => document.querySelector('[data-tab="bag"]')?.click()); await wait(150);
    await p.evaluate(() => document.querySelector('[data-bag="cookbook"]')?.click()); await wait(200); await look('cookbook');
    await p.evaluate(() => document.querySelector('[data-cb="page:11"]')?.click()); await wait(200); await look('cookbook page 11');
    await p.evaluate(() => document.querySelector('[data-cb="card:cadet"]')?.click()); await wait(200); await look('card cadet');
    const box = await text('.gnbox');
    if (name === 'owned-card-never-found' || name === 'gold-flag-no-stars' || name === 'odd-drops-with-garnish') await shot(`odd-${name}`);
    await p.evaluate(() => { document.getElementById('coach')?.classList.remove('on'); window.__kkq.play('11-1'); }); await wait(2200);
    const stg = await p.evaluate(() => { const w = window.__kkq.world(); const e = document.querySelector('.card .gnb'); return { stage: w?.stage.id ?? null, world: window.__kkq.garnishes(), head: e?.classList.contains('on') ? e.firstElementChild.src.match(/drop-[a-z0-9]+/)?.[0] + '/' + (e.classList.contains('gold') ? 'gold' : 'white') : null, hud: /undefined|NaN/.test(document.getElementById('hud')?.innerText ?? '') }; }).catch(e => ({ err: e.message }));
    await p.evaluate(() => window.__kkq.scene.scene.restart({})); await wait(600);
    const ok = !bad.length && !errs.length && stg.stage === '11-1' && !stg.hud;
    console.log(`${ok ? 'ok   ' : 'FAIL '}odd save ${name}: after load ${JSON.stringify(st)} · picker cells ${pick} · card box "${box.slice(0, 90)}" · stage ${JSON.stringify(stg)}${bad.length ? ' · ' + bad.join(' ; ') : ''}${errs.length ? ' · ' + errs.join(' ; ') : ''}`);
    if (!ok) fails.push('odd save ' + name);
    break;
  } catch (e) { console.log('retry ' + name + ' (' + String(e.message).slice(0, 80) + ')'); await wait(1500); } }
  errs = [];
}
console.log(errs.length ? 'page/console errors:\n' + errs.join('\n') : 'no page errors (outside the odd-save loop, which lists its own)');
console.log(fails.length ? `${fails.length} FAIL(s):\n` + fails.join('\n') : 'all checks passed');
await b.close(); process.exit(0);
