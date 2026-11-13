// Elemental weaknesses, in the fight: WEAK! / RESIST popups (and their throttle, with low effects on and off), the weakness
// icon on the small HP bar and by the boss bar, the pause menu line, and the two one-time tips.
// Needs a dev server already running:  node scripts/weak-fight-shot.mjs [port=5471] [width=844] [height=390]  → shots/weak/<width>-fight-*.png
// The kaiju is Dumplord (Steam Cloud is HOT): a Moldy Bun is weak to it, a Pepper Grunt resists it.
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
const shot = name => p.screenshot({ path: `shots/weak/${W}-fight-${name}.png` });
const until = async (fn, what, ms = 15000) => { for (let t = 0; t < ms; t += 50) { if (await p.evaluate(fn).catch(() => false)) return true; await wait(50); } console.log('TIMED OUT:', what); errs.push('timed out: ' + what); return false; };
const OTHER_TIPS = ['move', 'jump', 'attack', 'dodge', 'skill', 'gear', 'ladder', 'drop', 'arena', 'hazard', 'sponge', 'potion', 'escort', 'fetch', 'boss', 'exit'];
/** start 1-2 as a low-level Dumplord and put one tough monster of each kind next to it */
let first = true;
const start = async kinds => {
  await p.evaluate(([tips, first]) => {
    const s = window.__kkq.save; s.unlocked = [...new Set([...s.unlocked, 6])]; s.selected = 6; s.storyMode = 'key';
    const h = s.heroes[6]; h.level = 6; h.cleared['1-1'] = 'A'; h.seen.push('intro', 'w1-open');
    if (first) s.tips = tips;
    window.__kkq.play('1-2');
  }, [OTHER_TIPS, first]);
  first = false;
  await until(() => !!window.__kkq.world() && window.__kkq.world().stage.id === '1-2', 'stage 1-2 running');
  await wait(1500);
  await p.evaluate(kinds => {
    const k = window.__kkq, w = k.world(), h = w.hero;
    k.words = []; k.nums = 0;
    if (!k.wrapped) { // count the popups and the damage numbers the scene makes
      k.wrapped = true;
      const orig = k.scene.callout.bind(k.scene); k.scene.callout = (x, y, text, ...r) => { k.words.push(text); orig(x, y, text, ...r); };
      const add = k.scene.add.text.bind(k.scene.add); k.scene.add.text = (x, y, text, ...r) => { if (/^[0-9]+$/.test(String(text))) k.nums++; return add(x, y, text, ...r); };
    }
    for (const m of w.mobs) m.x += 4000; // the stage's own monsters step aside
    kinds.forEach((kind, i) => { const m = w.spawnMob(kind, h.x + 70 + i * 60, 14, h.y); m.hp = m.maxHp = 1e6; m.atk = 0; });
    h.inv = 1e6; h.face = 1;
  }, kinds);
};
const words = () => p.evaluate(() => { const c = {}; for (const t of window.__kkq.words) if (t === 'WEAK!' || t === 'RESIST') c[t] = (c[t] ?? 0) + 1; return c; });
const cast = async () => { await p.keyboard.down('KeyL'); await wait(120); await p.keyboard.up('KeyL'); };
const frozen = async (fn) => { await p.evaluate(() => { window.__kkq.scene.tweens.pauseAll(); }); await fn(); await p.evaluate(() => { window.__kkq.scene.tweens.resumeAll(); }); };

// 1. a weak monster: WEAK! popup, the coloured number, the icon by its HP bar, then the first tip
await start(['bun']);
await cast();
await until(() => window.__kkq.words.includes('WEAK!'), 'a WEAK! popup');
await wait(160); await frozen(() => shot('weak'));
console.log('damage numbers made so far, normal effects:', await p.evaluate(() => window.__kkq.nums));
await until(() => /WEAK!/.test(document.querySelector('#coach.on span')?.textContent ?? ''), 'the first-weak-hit tip', 8000);
console.log('tip 1:', await p.evaluate(() => document.querySelector('#coach.on span')?.textContent ?? '(none)'));
await shot('tip-weak');
// the pause menu line
await p.evaluate(() => document.querySelector('#hud .menu:not(.bagb)')?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })));
await wait(300); await shot('pause');
console.log('pause line:', await p.evaluate(() => document.querySelector('#pause .weakln')?.textContent ?? '(none)'));
console.log('pause fits:', await p.evaluate(() => { const r = [...document.querySelectorAll('#pause > *')].map(e => e.getBoundingClientRect()); return `top ${Math.round(Math.min(...r.map(x => x.top)))} bottom ${Math.round(Math.max(...r.map(x => x.bottom)))} of ${innerHeight}`; }));
await p.evaluate(() => document.querySelector('#pause [data-a=resume]')?.click());
// throttle: steam ticks for several seconds on one monster
await p.evaluate(() => { window.__kkq.words.length = 0; });
for (let i = 0; i < 3; i++) { await cast(); await wait(2200); }
console.log('normal effects, ~7 s of Steam Cloud on one weak monster:', JSON.stringify(await words()), '(hits landed:', await p.evaluate(() => window.__kkq.world().run.hits ?? '?'), ')');

// 2. a resisting monster: RESIST popup, small grey number, then the third-resisted-hit tip
await start(['pepper']);
await cast();
await until(() => window.__kkq.words.includes('RESIST'), 'a RESIST popup');
await wait(160); await frozen(() => shot('resist'));
for (let i = 0; i < 2; i++) { await wait(1800); await cast(); }
await until(() => /RESIST/.test(document.querySelector('#coach.on span')?.textContent ?? ''), 'the third-resisted-hit tip', 12000);
console.log('tip 2:', await p.evaluate(() => document.querySelector('#coach.on span')?.textContent ?? '(none)'));
await shot('tip-resist');
console.log('tips remembered:', await p.evaluate(() => window.__kkq.save.tips.filter(t => t === 'weak' || t === 'resist').join(',')));

// 3. both at once plus a world boss (the boss bar's icon)
await start(['bun', 'pepper', 'golem']);
await cast();
await until(() => window.__kkq.words.includes('WEAK!') && window.__kkq.words.includes('RESIST'), 'both popups');
await wait(120); await frozen(() => shot('both-boss'));
console.log('boss bar:', await p.evaluate(() => document.querySelector('#hud .boss .t')?.textContent ?? '(none)'));

// 4. low effects: no numbers, but the first WEAK! / RESIST per monster still shows (once)
await p.evaluate(() => localStorage.setItem('kkq-settings', JSON.stringify({ lowFx: true }))); await p.reload({ waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 480 && !await p.evaluate(() => !!window.__kkq).catch(() => false); i++) await wait(250);
await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(1200);
await start(['bun', 'pepper']);
await cast();
await until(() => window.__kkq.words.includes('WEAK!') && window.__kkq.words.includes('RESIST'), 'both popups with low effects');
await wait(120); await frozen(() => shot('lowfx'));
for (let i = 0; i < 2; i++) { await wait(2200); await cast(); }
await wait(600);
console.log('damage numbers made with low effects (crits only):', await p.evaluate(() => window.__kkq.nums));
await wait(1600);
console.log('low effects, ~7 s on one weak + one resisting monster:', JSON.stringify(await words()));
console.log(errs.length ? errs : 'no errors');
await b.close(); process.exit(errs.length ? 1 : 0);
