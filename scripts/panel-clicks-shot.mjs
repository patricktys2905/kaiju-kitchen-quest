// The stage panel's Challenges chillies and SKIP TO BOSS, tapped for real (both were dead until the camp's click selector
// listed data-spicy and data-skip): each chilli toggles and shows as on, the run starts with those rules and the result
// pays the bonus boxes; with a stage's full drop set SKIP TO BOSS starts in the boss room, spends the drops, and the
// result screen says the rank stops at A. Needs a dev server already running:
//   node scripts/panel-clicks-shot.mjs [port=5471]  → shots/weak/clicks-*.png
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const PORT = Number(process.argv[2] ?? 5471), base = `http://localhost:${PORT}/?touch`;
fs.mkdirSync('shots/weak', { recursive: true });
const wait = ms => new Promise(r => setTimeout(r, ms));
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const p = await (await b.newContext({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })).newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
const fail = m => { errs.push(m); console.log('FAIL:', m); };
await p.goto(base, { waitUntil: 'commit', timeout: 120000 }); await p.evaluate(() => localStorage.clear()); await p.reload({ waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 480 && !await p.evaluate(() => !!window.__kkq).catch(() => false); i++) await wait(250);
await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(1200);
const shot = name => p.screenshot({ path: `shots/weak/clicks-${name}.png` });
const until = async (fn, what, ms = 20000) => { for (let t = 0; t < ms; t += 100) { if (await p.evaluate(fn).catch(() => false)) return true; await wait(100); } fail('timed out: ' + what); return false; };
const tap = sel => p.evaluate(s => { const el = document.querySelector(s); el?.click(); return !!el; }, sel);
// World 1 cleared (the chillies open after 1-10), story scenes out of the way, and exactly the drops 1-4's exits ask for plus one spare of each
const need = await p.evaluate(async () => {
  const { stageById } = await import('/src/sim/stages.ts');
  const s = window.__kkq.save, h = s.heroes[s.selected];
  for (let n = 1; n <= 10; n++) h.cleared['1-' + n] = 'B';
  h.level = 14; h.seen.push('intro', 'w1-open'); s.storyMode = 'key'; s.tips = ['x']; s.boxes = [];
  const need = {};
  for (const m of stageById('1-4').maps) if (m.goal?.kind === 'collect') for (const q of m.goal.wants) need[q.mob] = (need[q.mob] ?? 0) + q.n;
  s.drops = Object.fromEntries(Object.entries(need).map(([k, n]) => [k, n + 1]));
  window.__kkq.scene.scene.restart({});
  return need;
});
await wait(900);
await tap('[data-node="1-4"]'); await wait(200);
console.log('1-4 exits want:', JSON.stringify(need));

// ---- (a) the three chillies
await tap('[data-act=spicyopen]'); await wait(200);
const kinds = await p.evaluate(() => [...document.querySelectorAll('[data-spicy]')].map(e => e.dataset.spicy));
if (kinds.length !== 3) fail(`expected 3 chillies, found ${kinds.length}`);
for (const k of kinds) {
  await tap(`[data-spicy="${k}"]`); await wait(120);
  const on = await p.evaluate(k => ({ saved: (window.__kkq.save.spicy ?? []).includes(k), shown: document.querySelector(`[data-spicy="${k}"]`)?.classList.contains('on') }), k);
  await tap(`[data-spicy="${k}"]`); await wait(120);
  const off = await p.evaluate(k => ({ saved: (window.__kkq.save.spicy ?? []).includes(k), shown: document.querySelector(`[data-spicy="${k}"]`)?.classList.contains('on') }), k);
  console.log(`chilli ${k}: tap → on ${JSON.stringify(on)}, tap again → ${JSON.stringify(off)}`);
  if (!on.saved || !on.shown || off.saved || off.shown) fail(`chilli ${k} does not toggle`);
  await tap(`[data-spicy="${k}"]`); await wait(120); // leave it on
}
console.log('panel says:', await p.evaluate(() => document.querySelector('[data-act=spicyopen]')?.textContent?.trim()));
await shot('chillies-on');

// ---- (b) SKIP TO BOSS, with all three chillies on: a skipped run ignores the chillies, earns no stars and stops at rank A
const panel = await p.evaluate(() => ({ skipInfo: document.querySelector('.playrow .skipinfo')?.textContent ?? '(none)', warn: document.querySelector('.spicy .skipwarn')?.textContent ?? '(none)', playBottom: Math.round(document.querySelector('.map .info [data-play]:not(.secret)').getBoundingClientRect().bottom), screen: innerHeight }));
console.log('panel:', JSON.stringify(panel));
if (panel.skipInfo !== 'no chillies · no stars · best rank A') fail('the line by SKIP TO BOSS is missing');
if (!/don't apply when you skip/.test(panel.warn)) fail('no warning by the chillies while a skip is on offer');
if (panel.playBottom > panel.screen) fail('PLAY is off the screen');
const starsBefore = await p.evaluate(() => JSON.stringify(window.__kkq.save.challenges?.['1-4'] ?? []));
if (!await p.evaluate(() => !!document.querySelector('[data-skip="1-4"]'))) fail('no SKIP TO BOSS button with the full drop set');
await p.evaluate(() => document.querySelector('.map .info').scrollTo(0, 1e4)); await shot('skip-button');
await tap('[data-skip="1-4"]');
await until(() => window.__kkq.world()?.stage.id === '1-4', 'the stage starts from SKIP TO BOSS');
await wait(1500);
const start = await p.evaluate(() => {
  const w = window.__kkq.world(), maps = w.stage.maps, h = w.hero;
  return { spicy: w.spicy, map: w.mapAt(h.x), bossMap: maps.length - 1, skipped: !!w.run.skipped, dropsInStage: w.drops, dropsSaved: window.__kkq.save.drops, hud: document.querySelector('#hud .stage')?.textContent, spicySaved: (window.__kkq.save.spicy ?? []).length, quickLocked: w.spicy.includes('nopots') };
});
console.log('in the stage:', JSON.stringify(start));
if (start.spicy.length) fail('a skipped run still has chilli rules');
if (/🌶|⏱/.test(start.hud ?? '')) fail('the HUD shows chillies or the clock on a skipped run');
if (start.spicySaved !== 3) fail('the chillies were switched off in the save');
if (start.map !== start.bossMap) fail('SKIP TO BOSS did not start in the boss room');
if (!start.skipped) fail('the run is not marked as skipped');
for (const [k, n] of Object.entries(need)) if ((start.dropsSaved[k] ?? 0) !== 1) fail(`drop ${k}: had ${n + 1}, ${n} should be spent leaving 1, the save has ${start.dropsSaved[k]}`);
await shot('boss-room');
// win it: the room's foe goes down, then walk into the exit
await p.evaluate(() => { const w = window.__kkq.world(); w.hero.inv = 1e6; for (const m of w.mobs) if (w.mapAt(m.x) === w.stage.maps.length - 1) { m.hp = 0; m.state = 'dead'; m.deadT = 0; } });
await until(() => window.__kkq.world().portal, 'the exit opens', 15000);
await p.evaluate(() => { const w = window.__kkq.world(), h = w.hero; h.x = w.exitX; h.y = w.stage.groundY; h.vx = h.vy = 0; h.ground = true; h.on = -1; });
await until(() => document.querySelector('#result.on'), 'the result screen', 20000);
await wait(600); await shot('result');
const res = await p.evaluate(() => ({ title: document.querySelector('#result h2')?.textContent, rank: document.querySelector('#result .rk')?.textContent, stats: document.querySelector('#result .st')?.innerText.replace(/\n/g, ' '), skipNote: document.querySelector('#result .skipnote')?.textContent ?? '(none)', boxes: document.querySelectorAll('#result .gots img').length, buttons: [...document.querySelectorAll('#result [data-r]')].map(x => x.textContent.trim()), savedBoxes: window.__kkq.save.boxes.map(x => x.tier) }));
console.log('result:', JSON.stringify(res));
if (res.skipNote === '(none)') fail('no "Skipped to the boss" note on the result');
if (res.rank === 'S') fail('a skipped run ranked S');
if (!/best rank A, no chillies, no stars/.test(res.skipNote)) fail('the result note does not say what a skip costs');
if (res.savedBoxes.filter(t => t === 5).length >= 3) fail('the skipped run paid the chilli boxes');
const after = await p.evaluate(() => ({ stars: JSON.stringify(window.__kkq.save.challenges?.['1-4'] ?? []), notes: [...document.querySelectorAll('#result .note')].map(n => n.textContent).join(' | '), spicy: window.__kkq.save.spicy }));
console.log('after:', JSON.stringify(after), 'stars before:', starsBefore);
if (after.stars !== starsBefore || /★/.test(after.notes)) fail('a skipped run earned challenge stars');
if ((after.spicy ?? []).length !== 3) fail('the chillies are not still on for the next full run');
await tap('#result [data-r=camp]'); await until(() => document.querySelector('#camp')?.classList.contains('on'), 'back at camp'); await wait(300);
console.log('back at camp:', await p.evaluate(() => document.querySelector('#camp')?.classList.contains('on')), '· SKIP still offered (1 spare of each left, should not be):', await p.evaluate(() => { document.querySelector('[data-node="1-4"]')?.click(); return !!document.querySelector('[data-skip]'); }));
// a normal (not skipped) result has no note
console.log(errs.length ? errs : 'no errors');
await b.close(); process.exit(errs.length ? 1 : 0);
