// The save stress test's saves (shots/fuzz-saves.json from scripts/save-fuzz-gen.ts) against the screens save-fuzz.mjs does
// not open: the Market's RE-SEASON view (every weapon, every element, nothing is paid), the Skills list with a loadout
// button open, and the pause menu's weakness line in a stage. A screenshot is kept for each problem.
// Needs a dev server already running:  node scripts/weak-fuzz-shot.mjs [port=5471]  → shots/weak/fuzz-<n>.png on trouble
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const PORT = Number(process.argv[2] ?? 5471), base = `http://localhost:${PORT}/?touch`;
const saves = JSON.parse(fs.readFileSync('shots/fuzz-saves.json', 'utf8'));
fs.mkdirSync('shots/weak', { recursive: true });
const wait = ms => new Promise(r => setTimeout(r, ms));
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const SIZES = [[844, 390], [667, 375]];
const problems = [];
let weapons = 0, previews = 0;
for (let i = 0; i < saves.length; i++) {
  const { kind, save } = saves[i], [w, h] = SIZES[i % SIZES.length];
  const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  let where = 'load', bad = false;
  const report = msg => { bad = true; problems.push(`save ${i} (${kind}, ${w}x${h}) at ${where}: ${msg}`); };
  p.on('pageerror', e => report('page error: ' + e.message));
  p.on('console', m => { if (m.type() === 'error' && !/favicon|Failed to load resource/.test(m.text())) report('console: ' + m.text().slice(0, 200)); });
  await p.goto(base, { waitUntil: 'commit', timeout: 120000 });
  await p.evaluate(s => localStorage.setItem('kkq-save-v3', JSON.stringify(s)), save);
  await p.reload({ waitUntil: 'commit', timeout: 120000 });
  process.stdout.write(`${i} `);
  for (let k = 0; k < 480 && !await p.evaluate(() => !!window.__kkq).catch(() => false); k++) await wait(250);
  if (!await p.evaluate(() => !!window.__kkq).catch(() => false)) { report('the game did not start within 2 minutes'); await ctx.close(); continue; }
  await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(800);
  const snag = async () => { const t = await p.evaluate(() => document.body.innerText.match(/hit a snag[^\n]*\n?[^\n]*/)?.[0]); if (t) report('snag: ' + t.replace(/\s+/g, ' ')); };
  const click = sel => p.evaluate(sel => { const el = document.querySelector(sel); el?.click(); return !!el; }, sel);
  const wide = async () => { if (await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)) report('the page is wider than the screen'); };
  for (const sp of (save.unlocked ?? []).slice(0, 4)) {
    where = `kaiju ${sp} re-season`; await click(`[data-hero="${sp}"]`); await click('[data-tab="market"]'); await click('[data-act="mv-reseason"]'); await wait(80); await snag(); await wide();
    const n = await p.evaluate(() => document.querySelectorAll('[data-reitem]').length);
    for (let k = 0; k < Math.min(n, 6); k++) {
      await p.evaluate(k => document.querySelectorAll('[data-reitem]')[k]?.click(), k); weapons++;
      for (const el of ['HOT', 'COLD', 'STICKY']) { if (await click(`[data-reel="${el}"]:not([disabled])`)) previews++; await snag(); }
    }
    where = `kaiju ${sp} skills`; await click('[data-tab="skills"]'); await click('[data-act="sv-skills"]'); await click('[data-slot="0"]'); await wait(60); await snag(); await wide();
    await click('[data-act="sv-tree"]'); await p.evaluate(() => document.querySelector('.tnode.mod')?.click()); await snag();
    where = `kaiju ${sp} hero`; await click('[data-tab="hero"]'); await click('[data-eqslot="weapon"]'); await wait(60); await snag(); await wide();
    where = `kaiju ${sp} free`; await click('[data-tab="free"]'); await snag();
  }
  await click('[data-tab="market"]'); await click('[data-act="mv-shop"]');
  // a stage: the pause menu line
  where = 'pause in 1-1';
  await p.evaluate(() => window.__kkq.play('1-1'));
  for (let k = 0; k < 60 && !await p.evaluate(() => !!window.__kkq.world()).catch(() => false); k++) await wait(250);
  await wait(500);
  await p.evaluate(() => document.querySelector('#hud .menu:not(.bagb)')?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))); await wait(150);
  if (!/^This stage · Weak: /.test(await p.evaluate(() => document.querySelector('#pause.on .weakln')?.textContent ?? ''))) report('no weakness line in the pause menu');
  if (bad) await p.screenshot({ path: `shots/weak/fuzz-${i}.png` });
  await ctx.close();
}
console.log(`${saves.length} saves · ${weapons} weapons opened in RE-SEASON · ${previews} previews`);
console.log(problems.length ? problems.join('\n') : 'no problems');
await b.close(); process.exit(problems.length ? 1 : 0);
