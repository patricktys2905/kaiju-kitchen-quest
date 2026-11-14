// World 11 "The Midway" in the menus and the scene: node scripts/w11-ui-shot.mjs [WxH] [sections] [port]
//   WxH: 844x390 (default) or 667x375. sections: comma list of map,cards,story,fight,boss,credits,book (default: all).
//   port: a DEV server that is already running (debug hooks need dev, not `vite preview`); without it the script starts its own.
// → shots/w11/ui-<W>-*.png, and a line per check (FAIL: ... when something is off).
import fs from 'node:fs';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';
const [W, H] = (process.argv[2] ?? '844x390').split('x').map(Number);
const only = process.argv[3] && process.argv[3] !== 'all' ? process.argv[3].split(',') : null, want = s => !only || only.includes(s);
const own = !process.argv[4], PORT = Number(process.argv[4] ?? 5351), url = `http://localhost:${PORT}/?touch`;
const server = own ? spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' }) : null;
const wait = ms => new Promise(r => setTimeout(r, ms));
fs.mkdirSync('shots/w11', { recursive: true });
if (own) await wait(3000);
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const p = await (await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })).newPage();
const errs = []; p.on('pageerror', e => errs.push('page error: ' + e.message));
p.on('console', m => { if (m.type() === 'error' && !/favicon|Failed to load resource/.test(m.text())) errs.push('console: ' + m.text().slice(0, 200)); });
const fail = m => { errs.push(m); console.log('FAIL:', m); };
const shot = async name => { await p.screenshot({ path: `shots/w11/ui-${W}-${name}.png` }); };
const ready = async () => { for (let i = 0; i < 480 && !await p.evaluate(() => !!window.__kkq).catch(() => false); i++) await wait(250); };
await p.goto(url, { waitUntil: 'commit', timeout: 120000 }); await p.evaluate(() => localStorage.clear()); await p.reload({ waitUntil: 'commit', timeout: 120000 });
await ready();
await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(900);
/** a Lv 115 kaiju that has cleared Worlds 1..upTo (all of 10 opens the Midway) */
const setup = upTo => p.evaluate(n => {
  const s = window.__kkq.save, h = s.heroes[0];
  h.level = 115; s.storyMode = 'all'; h.cleared = {}; s.tips = ['move', 'jump', 'attack', 'dodge', 'skill', 'gear', 'weak', 'resist', 'ladder', 'drop', 'arena', 'hazard', 'sponge', 'potion', 'escort', 'fetch', 'boss', 'cookbook', 'exit'];
  for (let w = 1; w <= n; w++) for (let k = 1; k <= 10; k++) h.cleared[`${w}-${k}`] = 'A';
  if (!h.seen.includes('intro')) h.seen.push('intro');
  window.__kkq.scene.scene.restart({});
}, upTo);
const camp = async () => { await p.evaluate(() => { const r = document.querySelector('#result.on [data-r="camp"]'); if (r) r.click(); else window.__kkq.scene.scene.restart({}); }); await wait(900); };
const play = async id => { await p.evaluate(i => { document.getElementById('coach')?.classList.remove('on'); window.__kkq.play(i); }, id); await wait(1800); };
const kq = fn => p.evaluate(fn);
/** the camp map on the Midway page */
const midway = async () => { await p.evaluate(() => [...document.querySelectorAll('[data-mappage]')].pop()?.click()); await wait(400); };
const safe = 'const w = window.__kkq.world(); for (const h of w.heroes) { h.inv = 9999; h.hp = h.d.maxHp; }';
/** taps through a story scene if one is open: returns how many lines it had (0 = no scene); shoots the first line */
const throughStory = async name => {
  let n = 0;
  for (; n < 60 && await p.evaluate(() => !!document.querySelector('#story.on')); n++) {
    await wait(700);
    const t = await p.evaluate(() => ({ text: document.querySelector('#story .cnt')?.innerText.replace(/\s+/g, ' ').trim() ?? '', still: document.querySelector('#story .still')?.innerHTML.match(/still-[\w-]+/)?.[0] ?? null }));
    if (!t.text || /undefined|NaN/.test(t.text)) fail(`${name}: story line ${n + 1} is empty or broken: "${t.text}"`);
    if (n === 0) { console.log(`${name}: story opens with "${t.text.slice(0, 110)}" (painting: ${t.still})`); await shot(`story-${name}`); }
    await p.locator('#story').click({ position: { x: Math.round(W / 2), y: 150 } }); await wait(250);
    if (await p.evaluate(() => !!document.querySelector('#story.on'))) { await p.locator('#story').click({ position: { x: Math.round(W / 2), y: 150 } }); await wait(250); }
  }
  return n;
};
/** anything unprintable on screen? */
const noJunk = async where => { const t = await p.evaluate(() => document.body.innerText); if (/undefined|NaN|\[object/.test(t)) fail(`${where}: "undefined"/NaN on screen`); };

// ---- the map: the tab row with an 11th tab (locked, then open), the Midway page, its nodes
if (want('map')) {
  await setup(9); await wait(900);
  const tabs = () => p.evaluate(() => { const row = document.querySelector('.mappages'), bs = [...row.children].map(e => e.getBoundingClientRect()); return { n: bs.length, rows: new Set(bs.map(r => Math.round(r.top))).size, right: Math.round(Math.max(...bs.map(r => r.right))), rowRight: Math.round(row.getBoundingClientRect().right), scroll: row.scrollWidth - row.clientWidth, vw: innerWidth, last: row.lastElementChild.textContent, lastOff: row.lastElementChild.disabled }; });
  let t = await tabs(); console.log('tabs, World 10 not cleared:', JSON.stringify(t));
  if (!t.lastOff || !/🔒/.test(t.last)) fail('the Midway tab should be locked before 10-10 is cleared');
  await shot('map-locked');
  await setup(10); await wait(900);
  t = await tabs(); console.log('tabs, World 10 cleared:', JSON.stringify(t));
  if (t.n !== 10) fail(`expected 10 map tabs, got ${t.n}`);
  if (t.rows > 1) fail('the map tabs wrap onto a second row');
  if (t.lastOff) fail('the Midway tab should be open once 10-10 is cleared');
  await p.locator('.mappages button').last().scrollIntoViewIfNeeded(); await p.locator('.mappages button').last().tap(); await wait(700);
  const vis = await p.evaluate(() => { const r = document.querySelector('.mappages').lastElementChild.getBoundingClientRect(), m = document.querySelector('.mappages').getBoundingClientRect(); return r.left >= m.left - 1 && r.right <= Math.min(innerWidth, m.right) + 1; });
  if (!vis) fail('the Midway tab is not fully on screen after tapping it');
  const nodes = await p.evaluate(() => {
    const ns = [...document.querySelectorAll('.node')].map(e => ({ id: e.dataset.node, r: e.getBoundingClientRect(), locked: e.classList.contains('locked') })), lab = document.querySelector('.wlabel').getBoundingClientRect(), img = document.querySelector('.mapimg').getBoundingClientRect();
    const hit = (a, c) => a.left < c.right && c.left < a.right && a.top < c.bottom && c.top < a.bottom, bad = [];
    for (let i = 0; i < ns.length; i++) { for (let j = i + 1; j < ns.length; j++) if (hit(ns[i].r, ns[j].r)) bad.push(`${ns[i].id} overlaps ${ns[j].id}`); if (hit(ns[i].r, lab)) bad.push(`${ns[i].id} overlaps the world label`); if (ns[i].r.left < img.left || ns[i].r.right > img.right || ns[i].r.top < img.top || ns[i].r.bottom > img.bottom) bad.push(`${ns[i].id} sticks out of the map`); }
    return { n: ns.length, open: ns.filter(x => !x.locked).map(x => x.id), bad, label: document.querySelector('.wlabel').textContent };
  });
  console.log('Midway page:', JSON.stringify(nodes));
  if (nodes.n !== 10) fail(`expected 10 nodes on the Midway page, got ${nodes.n}`);
  for (const x of nodes.bad) fail(x);
  await shot('map'); await noJunk('map');
}
// ---- stage cards: 11-1 (Weak row, drops), 11-5 (the champion), 11-10 (the boss and his weapon)
if (want('cards')) {
  await setup(11); await wait(900); await midway();
  for (const id of ['11-1', '11-5', '11-10']) {
    await p.evaluate(i => document.querySelector(`[data-node="${i}"]`)?.click(), id); await wait(500);
    console.log(`card ${id}:`, (await p.evaluate(() => document.querySelector('.map .info')?.innerText.replace(/\s+/g, ' ').trim() ?? '')).slice(0, 330));
    const over = await p.evaluate(() => { const i = document.querySelector('.map .info'); return [...i.querySelectorAll('*')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.right > innerWidth + 1; }).length; });
    if (over) fail(`card ${id}: ${over} elements run off the right edge`);
    await shot(`card-${id}`); await noJunk(`card ${id}`);
  }
}
// ---- story: PLAY on 11-1, 11-5 and 11-10, then clearing 11-10. With no World 11 beats written it goes straight in and
//      straight to the result screen; once beats exist, each scene is tapped through (first line shot, no empty box)
if (want('story')) {
  await setup(10); await wait(900);
  await p.evaluate(() => { const h = window.__kkq.save.heroes[0]; for (let k = 1; k <= 9; k++) h.cleared[`11-${k}`] = 'A'; window.__kkq.scene.scene.restart({}); }); await wait(900);
  for (const id of ['11-1', '11-5', '11-10']) {
    await midway();
    await p.evaluate(i => document.querySelector(`[data-node="${i}"]`)?.click(), id); await wait(300);
    await p.evaluate(i => document.querySelector(`.playrow [data-play="${i}"]`)?.click(), id); await wait(900);
    const lines = await throughStory(id); await wait(1500);
    const st = await p.evaluate(() => ({ lines: window.__lines, story: !!document.querySelector('#story.on'), stage: window.__kkq.world()?.stage.id ?? null, camp: getComputedStyle(document.getElementById('camp')).display !== 'none' }));
    console.log(`PLAY ${id}:`, JSON.stringify(st));
    console.log(`  ${id}: ${lines ? lines + ' story lines before the stage' : 'no story scene: straight into the stage'}`);
    if (st.story) fail(`${id}: the story box is still open`);
    if (st.stage !== id) fail(`${id}: the stage did not start`);
    await wait(1200); if (id === '11-1') await shot('start-11-1'); await noJunk(`start ${id}`);
    if (id !== '11-10') await camp();
  }
  // finish 11-10: at the boss, one hit left (every toast is noted as it appears)
  await p.evaluate(() => { window.__toasts = []; new MutationObserver(ms => { for (const m of ms) for (const n of m.addedNodes) if (n.nodeType === 1 && /toast/i.test(n.className + (n.parentElement?.id ?? '') + (n.parentElement?.className ?? ''))) window.__toasts.push(n.textContent); }).observe(document.body, { childList: true, subtree: true }); });
  await kq(`${safe} w.skipToBoss();`); await wait(600);
  for (let i = 0; i < 100 && !await kq(() => !!window.__kkq.world().boss); i++) { await kq(`${safe} if (!w.boss) w.hero.x += 60;`); await wait(150); }
  await wait(1200);
  await kq(`${safe} for (const m of w.mobs) if (m !== w.boss) { m.hp = 0; m.state = 'dead'; } w.boss.hp = 1; w.boss.armor = 0; w.hero.x = w.boss.x - 70; w.hero.face = 1;`);
  for (let i = 0; i < 12 && await kq(() => window.__kkq.world().boss?.hp > 0 && window.__kkq.world().boss.state !== 'dead'); i++) { await kq(`${safe} w.boss.hp = 1; w.hero.x = w.boss.x - 70; w.hero.face = 1;`); await p.keyboard.down('KeyJ'); for (let k = 0; k < 9 && !await p.evaluate(() => window.__toasts.some(t => /FALLS/.test(t))); k++) await wait(25); await p.keyboard.up('KeyJ'); if (await p.evaluate(() => window.__toasts.some(t => /FALLS/.test(t)))) { await shot('boss-falls'); break; } }
  const falls = await p.evaluate(() => window.__toasts.filter(t => /FALLS/.test(t)));
  console.log('boss-fall toast seen:', JSON.stringify(falls)); if (!falls.some(t => /^THE GREAT FLOSSO FALLS!$/.test(t))) fail('no "THE GREAT FLOSSO FALLS!" toast');
  for (let i = 0; i < 60 && !await p.evaluate(() => !!document.querySelector('#story.on') || getComputedStyle(document.getElementById('result') ?? document.body).display !== 'none' && !!document.getElementById('result')?.innerHTML); i++) { await kq(`const w = window.__kkq.world(); if (w && w.portal) { w.hero.x = w.exitX; w.hero.y = w.stage.groundY; }`).catch(() => {}); await wait(400); }
  const after = await throughStory('after-11-10'); console.log(`  after 11-10: ${after ? after + ' story lines' : 'no story scene: straight to the result screen'}`);
  await wait(1500);
  const end = await p.evaluate(() => ({ story: !!document.querySelector('#story.on'), credits: !!document.getElementById('credits'), result: (document.getElementById('result')?.innerText ?? '').replace(/\s+/g, ' ').slice(0, 200), cleared: window.__kkq.save.heroes[0].cleared['11-10'] ?? null }));
  console.log('after 11-10:', JSON.stringify(end));
  if (end.story || end.credits) fail('11-10: a story box or the credits is still open after the scene');
  if (!end.cleared) fail('11-10 was not recorded as cleared');
  await shot('result-11-10'); await noJunk('result 11-10');
  // the paintings that will sit behind the three big beats once they are written
  const stills = await p.evaluate(async () => { const m = await import('/src/story/stories.ts'); const out = {}; for (const bt of ['w11-open', 'w11-boss', 'w11-after']) { const k = m.stillFor(0, bt, 0); out[bt] = [k, await fetch(`art/${k}.webp`).then(r => r.ok && /image/.test(r.headers.get('content-type') ?? ''))]; } return out; });
  console.log('stills:', JSON.stringify(stills));
  for (const [bt, [k, ok]] of Object.entries(stills)) if (!ok) fail(`${bt}: painting ${k} is missing`);
  await camp();
}
// ---- a fight with the Caramel Drip firing, then its puddle
if (want('fight')) {
  await setup(11); await wait(900);
  let found = null;
  for (const id of ['11-1', '11-2', '11-3']) { await play(id); const n = await kq(() => window.__kkq.world().hazards.filter(z => z.kind === 'wax' && !z.phase2).length); console.log(`${id}: ${n} Caramel Drip hazards`); if (n) { found = id; break; } }
  if (!found) fail('no stage of 11-1..11-3 has a Caramel Drip');
  else {
    await p.evaluate(() => { window.__kkq.save.tips = window.__kkq.save.tips.filter(t => t !== 'hazard-skin'); });
    await kq(`${safe} const z = w.hazards.find(z => z.kind === 'wax' && !z.phase2); w.hero.x = z.x - 90; w.hero.y = w.stage.groundY; w.hero.face = 1; window.__z = z;`);
    for (const state of ['warn', 'on']) { for (let i = 0; i < 200 && !await p.evaluate(s => window.__z.state === s, state); i++) { await kq(`${safe} w.hero.x = window.__z.x - 90;`); await wait(40); } await wait(state === 'warn' ? 250 : 120); await shot(`caramel-${state}`); }
    console.log('tip:', await p.evaluate(() => document.querySelector('#coach.on')?.textContent ?? '(none)'));
    for (let i = 0; i < 200 && !await kq(() => window.__z.state === 'off' && window.__kkq.world().puddles.some(q => Math.abs(q.x - window.__z.x) < 10)); i++) await wait(40);
    await wait(200); await shot('caramel-puddle');
    await noJunk('fight');
  }
  await camp();
}
// ---- the boss room: before / after the tint, Sugar Shower, the three Wheel of Misfortune symbols
if (want('boss')) {
  await setup(11); await wait(900);
  await play('11-10');
  await shot('bigtop-walk-in');
  await kq(`${safe} w.skipToBoss();`); await wait(600);
  for (let i = 0; i < 100 && !await kq(() => !!window.__kkq.world().boss); i++) { await kq(`${safe} if (!w.boss) w.hero.x += 60;`); await wait(150); }
  await wait(1500);
  const hold = `${safe} const b = w.boss; b.hp = b.maxHp; b.tired = 0; b.weak = 0; for (const m of w.mobs) if (m !== b && !m.parent) { m.hp = 0; m.state = 'dead'; }`;
  console.log('boss room:', JSON.stringify(await kq(() => { const s = window.__kkq.scene, w = window.__kkq.world(); return { boss: w.boss?.kind, far: s.far?.texture.key, tint: s.far?.tintTopLeft?.toString(16), music: 'see WORLD_MUSIC' }; })));
  // before: the painted tent as it is
  await kq(`${hold} b.state = 'walk'; b.t = 0; b.x = w.hero.x + 230; b.face = -1; window.__kkq.scene.far.clearTint(); window.__kkq.scene.mid?.setVisible(true);`); await wait(120);
  await shot('boss-untinted');
  await camp(); await play('11-10'); await kq(`${safe} w.skipToBoss();`); await wait(600);
  for (let i = 0; i < 100 && !await kq(() => !!window.__kkq.world().boss); i++) { await kq(`${safe} if (!w.boss) w.hero.x += 60;`); await wait(150); }
  await wait(1500);
  await kq(`${hold} b.state = 'walk'; b.t = 0; b.x = w.hero.x + 230; b.face = -1;`); await wait(120);
  await shot('boss-tinted');
  // Sugar Shower in the air
  await kq(`${hold} b.state = 'windup'; b.move = 'rain'; b.t = 0; b.x = w.hero.x + 230;`);
  for (let i = 0; i < 120 && !await kq(() => { const v = window.__kkq.scene.cameras.main.worldView; return window.__kkq.world().shots.filter(s => s.kind === 'icicle' && s.y > v.y + 70 && s.x > v.x && s.x < v.right).length >= 3; }); i++) { await kq(safe); await wait(30); }
  await shot('sugar-shower');
  console.log('shower shots:', await kq(() => window.__kkq.world().shots.filter(s => s.kind === 'icicle').length));
  // the wheel: mid-spin, then landed on each symbol
  for (const pick of ['rain', 'summon', 'roar']) {
    await kq(`${hold} for (const s of w.shots) s.t = 99;`); await wait(700);
    await p.evaluate(k => { const w = window.__kkq.world(), bo = w.boss; for (const h of w.heroes) h.inv = 9999; bo.hp = bo.maxHp; bo.state = 'windup'; bo.move = 'wheel-' + k; bo.t = 0; bo.x = w.hero.x + 230; w.events.push({ t: 'nemesisMove', name: 'The Great Flosso', move: 'Wheel of Misfortune: ' + ({ rain: 'Sugar Shower', summon: 'Floss Wisps', roar: 'Shockwave' })[k] }); }, pick);
    if (pick === 'rain') { await wait(180); await shot('wheel-spin'); await wait(420); } else await wait(650);
    await shot(`wheel-${pick}`);
    console.log(`wheel ${pick}:`, JSON.stringify(await kq(() => { const w = window.__kkq.world(), v = window.__kkq.scene.mobViews.get(w.boss.id).wheel; return { state: w.boss.state, move: w.boss.move, shown: v?.root.visible, label: v?.label.text, y: Math.round(v?.root.y - window.__kkq.scene.cameras.main.worldView.y) }; })));
    await wait(1100);
  }
  // a real one: the boss's own final-phase pattern picks it (the sim's event and timing, nothing forced but the queue)
  await kq(`${hold} for (const s of w.shots) s.t = 99; b.hp = Math.round(b.maxHp * 0.2);`); await wait(1500);
  await kq(`${safe} const b = w.boss; b.tired = 0; b.state = 'walk'; b.t = 0; b.queue = ['wheel']; b.x = w.hero.x + 230;`);
  let t0 = 0, seen = 0;
  for (let i = 0; i < 150; i++) { const s = await kq(() => { const w = window.__kkq.world(); for (const h of w.heroes) h.inv = 9999; return { st: w.boss.state, mv: w.boss.move }; }); if (s.mv.startsWith('wheel-') && s.st === 'windup') { if (!t0) { t0 = Date.now(); await wait(60); await shot('wheel-real-callout'); } seen = Date.now() - t0; } else if (t0) break; await wait(30); }
  console.log(`real wheel wind-up on screen for about ${seen} ms`); if (!t0) fail('the boss never wound up the wheel'); else if (seen < 900) fail('the wheel wind-up was shorter than 0.9 s');
  await noJunk('boss'); await camp();
}
// ---- the Act 2 credits: bosses of Worlds 6-10 only
if (want('credits')) {
  await setup(11); await wait(900);
  await p.evaluate(() => import('/src/ui/story.ts').then(m => m.playStory(3, ['credits2'], () => {}))); await wait(800);
  const names = await p.evaluate(() => { const hs = [...document.querySelectorAll('#credits h2')], i = hs.findIndex(h => h.textContent === 'The Bosses'); const out = []; for (let e = hs[i].nextElementSibling; e && e.tagName !== 'H2'; e = e.nextElementSibling) out.push(e.textContent.trim()); return out; });
  console.log('Act 2 credits, The Bosses:', JSON.stringify(names));
  if (names.length !== 5 || names.some(n => /Flosso|Midway/.test(n))) fail('the Act 2 credits should list the five bosses of Worlds 6-10 only');
  await p.evaluate(() => { const r = document.querySelector('#credits .roll'), hs = [...document.querySelectorAll('#credits h2')].find(h => h.textContent === 'The Bosses'); r.style.transition = 'none'; window.__cy = hs.offsetTop; });
  for (let i = 0; i < 400; i++) { const ok = await p.evaluate(() => { const h = [...document.querySelectorAll('#credits h2')].find(x => x.textContent === 'The Bosses'); return h.getBoundingClientRect().top < innerHeight * 0.08; }); if (ok) break; await p.mouse.move(100, 100); await p.evaluate(() => document.getElementById('credits').dispatchEvent(new PointerEvent('pointerdown'))); await wait(120); }
  await shot('credits-act2');
  await p.evaluate(() => document.querySelector('#credits .skip')?.click()); await wait(500);
}
// ---- the Cookbook's page 11
if (want('book')) {
  await setup(11); await wait(900);
  await p.evaluate(() => { const s = window.__kkq.save; s.drops = { ...(s.drops ?? {}), cadet: 4, toffee: 2, floss: 7, bumper: 1 }; window.__kkq.scene.scene.restart({}); }); await wait(900);
  await p.locator('[data-tab="bag"]').first().tap(); await wait(300); await p.locator('[data-bag="cookbook"]').first().tap(); await wait(500);
  const chips = await p.evaluate(() => [...document.querySelectorAll('[data-cb^="page:"]')].map(e => ({ cb: e.dataset.cb, w: e.querySelector('b')?.textContent, right: Math.round(e.getBoundingClientRect().right), top: Math.round(e.getBoundingClientRect().top) })));
  console.log('Cookbook pages:', chips.map(c => c.w).join(' '), '| rows:', new Set(chips.map(c => c.top)).size, '| rightmost:', Math.max(...chips.map(c => c.right)), 'of', W);
  const c11 = chips.find(c => c.w === '11');
  if (!c11) fail('the Cookbook has no page 11'); else { await p.locator(`[data-cb="${c11.cb}"]`).first().tap(); await wait(600); }
  if (chips.some(c => c.right > W + 1)) fail('a Cookbook page chip runs off the right edge');
  console.log('page 11:', (await p.evaluate(() => document.querySelector('.cb')?.innerText.replace(/\s+/g, ' ').trim() ?? '')).slice(0, 300));
  await shot('cookbook-11'); await noJunk('cookbook');
}
console.log(errs.length ? `${errs.length} problem(s):\n  ` + errs.join('\n  ') : 'no errors');
await b.close(); server?.kill(); process.exit(errs.length ? 1 : 0);
