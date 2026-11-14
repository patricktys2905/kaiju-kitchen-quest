// Save stress test: loads every save from shots/fuzz-saves.json (scripts/save-fuzz-gen.ts) into the real game and walks
// every screen with it, on a few phone sizes. Reports page errors, console errors and "hit a snag" tabs.
// node scripts/save-fuzz.mjs [from=0] [count=all]   (FUZZ_PORT=5345 to pick the dev server port when the default is taken)
import fs from 'node:fs';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';
const saves = JSON.parse(fs.readFileSync('shots/fuzz-saves.json', 'utf8'));
const from = Number(process.argv[2] ?? 0), count = Number(process.argv[3] ?? saves.length);
const PORT = Number(process.env.FUZZ_PORT) || 5340 + (from % 50), base = `http://localhost:${PORT}/?touch`;
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
const wait = ms => new Promise(r => setTimeout(r, ms));
await wait(3000);
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const SIZES = [[852, 393], [667, 375], [1280, 720]];
const problems = [];
for (let i = from; i < Math.min(saves.length, from + count); i++) {
  const { kind, save } = saves[i];
  const [w, h] = SIZES[i % SIZES.length];
  const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: w < 1000, hasTouch: true });
  const p = await ctx.newPage();
  let where = 'load';
  const report = msg => problems.push(`save ${i} (${kind}, ${w}x${h}) at ${where}: ${msg}`);
  p.on('pageerror', e => report('page error: ' + e.message));
  p.on('console', m => { if (m.type() === 'error' && !/favicon|Failed to load resource/.test(m.text())) report('console: ' + m.text().slice(0, 200)); });
  await p.goto(base);
  await p.evaluate(s => localStorage.setItem('kkq-save-v3', JSON.stringify(s)), save);
  await p.reload();
  for (let k = 0; k < 240 && !await p.evaluate(() => !!window.__kkq).catch(() => false); k++) await wait(250);
  // a save the game cannot start with must not pass quietly (every step below tolerates a missing element)
  if (!await p.evaluate(() => !!window.__kkq).catch(() => false)) { report('the game did not start'); await ctx.close(); process.stdout.write(`${i}! `); continue; }
  await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(900);
  const snag = async () => { const t = await p.evaluate(() => document.body.innerText.match(/hit a snag[^\n]*\n?[^\n]*/)?.[0]); if (t) report('snag: ' + t.replace(/\s+/g, ' ')); };
  const click = sel => p.evaluate(sel => { const el = document.querySelector(sel); el?.click(); return !!el; }, sel);
  // every tab
  for (const tab of ['map', 'free', 'hero', 'skills', 'bag', 'market', 'boxes', 'quests']) { where = `tab ${tab}`; await click(`[data-tab="${tab}"]`); await wait(250); await snag(); }
  // every unlocked kaiju, on the hero and map tabs
  for (const sp of save.unlocked) {
    where = `kaiju ${sp}`; await click(`[data-hero="${sp}"]`); await wait(120);
    await click('[data-tab="hero"]'); await wait(120); await snag();
    await click('[data-tab="map"]'); await wait(120); await snag();
  }
  // map pages and a spread of stages (the stage panel: difficulty, challenges, story buttons)
  where = 'map pages';
  const pages = await p.evaluate(() => document.querySelectorAll('[data-mappage]').length);
  for (let k = 0; k < pages; k++) { await click(`[data-mappage="${k}"]`); await wait(150); await snag(); for (const n of [1, 5, 10]) { where = `map page ${k} node ${n}`; await p.evaluate(n => [...document.querySelectorAll('[data-node]')].find(b => b.dataset.node.endsWith('-' + n))?.click(), n); await wait(100); await snag(); } }
  for (const act of ['diff-hard', 'diff-nm', 'diff-normal', 'spicyopen', 'buddy', 'storymode']) { where = `stage panel ${act}`; await click(`[data-act="${act}"]`); await wait(100); await snag(); }
  // bag: each sub tab and a few items; market buys; boxes
  await click('[data-tab="bag"]'); await wait(150);
  where = 'bag items';
  for (let k = 0; k < 4; k++) { await p.evaluate(k => [...document.querySelectorAll('[data-item]')][k * 3]?.click(), k); await wait(100); await snag(); }
  // the Monster Cookbook: every page, a card opened, a hand-in from the grid (KEEP if it asks), hand in all spares, the title picker
  where = 'cookbook'; await click('[data-tab="bag"]'); await click('[data-bag="cookbook"]'); await wait(150); await snag();
  if (!await p.evaluate(() => !!document.querySelector('.cb .cbpages'))) report('the Cookbook did not draw');
  const cbPages = await p.evaluate(() => [...document.querySelectorAll('.cbpages [data-cb]')].map(e => e.dataset.cb));
  for (const pg of cbPages) {
    where = `cookbook ${pg}`; await click(`[data-cb="${pg}"]`); await wait(60); await snag();
    if (!await p.evaluate(() => document.querySelectorAll('.cbcard').length)) report('a Cookbook page with no cards');
    await click('.cbcard'); await wait(50); await snag(); await click('.cbdetail [data-cb^="hand:"]'); await wait(50); await click('.cbask [data-cb="no"]');
    // the Garnish on the opened card: CANDY IT (KEEP if it asks; on every other page CANDY IT), then WEAR / TAKE OFF
    where = `cookbook ${pg} garnish`; await click('.gnbox [data-gn^="candy:"]'); await wait(50); await snag(); await click(cbPages.indexOf(pg) % 2 ? '.cbask [data-gn="no"]' : '.cbask [data-gn="yes"]'); await wait(50); await snag();
    await click('.gnbox [data-gn^="wear:"]'); await wait(50); await snag();
    await click('[data-cb="back"]'); await wait(40); await snag();
    if (cbPages.indexOf(pg) % 3 === 0) { await click('.cbcard [data-cb^="hand:"]'); await wait(50); await click('.cbask [data-cb="yes"]'); await click('[data-cb^="spares:"]:not([disabled])'); await wait(60); await snag(); }
  }
  where = 'cookbook titles'; await click('.cbpick'); await wait(60); await snag(); await click('.cbtitles [data-cb^="title:"]:last-child'); await wait(60); await snag();
  { const bad = await p.evaluate(() => { const s = window.__kkq.save; if (!document.querySelector('#camp.on')) return true; return [s.crumbs, ...Object.values(s.drops ?? {}), ...Object.values(s.cookbook ?? {})].some(n => !Number.isFinite(n) || n < 0); }); if (bad) report('the Cookbook left a bad number in the save (or the camp is gone)'); }
  // the Hero tab's Garnish slot and its picker: open it, wear the last one, open it again, None
  where = 'garnish picker'; await click('[data-tab="hero"]'); await wait(80); await snag();
  if (!await p.evaluate(() => !!document.querySelector('.slot.gslot'))) report('the Hero tab has no Garnish slot');
  await click('.slot.gslot'); await wait(60); await snag(); if (!await p.evaluate(() => !!document.querySelector('.gnpick .gngrid button'))) report('the Garnish picker did not draw');
  await click('.gngrid button:last-child'); await wait(60); await snag(); await click('.slot.gslot'); await wait(60); await click('.gngrid button:first-child'); await wait(60); await snag();
  await click('.slot.gslot'); await wait(40); await click('.gngrid button:last-child'); await wait(40); await click('.gnpick [data-gn="close"]');
  { const bad = await p.evaluate(() => { const s = window.__kkq.save; return !document.querySelector('#camp.on') || Object.values(s.drops ?? {}).some(n => !Number.isFinite(n) || n < 0) || (s.garnishes ?? []).some(k => typeof k !== 'string') || Object.values(s.heroes).some(h => h.garnish !== undefined && !(s.garnishes ?? []).includes(h.garnish)); }); if (bad) report('the garnish screens left the save in a bad state'); }
  await click('[data-tab="map"]'); await wait(80); await snag();
  await click('[data-tab="market"]'); await wait(150); where = 'market buy'; await click('[data-buy]'); await click('[data-buybox]'); await click('[data-buygear]'); await wait(150); await snag();
  await click('[data-tab="boxes"]'); await wait(150); where = 'boxes'; await snag();
  // a stage: start the selected one, play a moment, leave
  where = 'stage';
  await click('[data-tab="map"]'); await wait(150);
  const started = await p.evaluate(() => { const b = document.querySelector('[data-play]:not([disabled])'); b?.click(); return !!b; });
  if (started) {
    await wait(1200);
    for (let k = 0; k < 4; k++) await p.evaluate(() => document.querySelector('#story.on .skip, #story.on [data-skip]')?.click());
    await wait(1500);
    await p.evaluate(() => window.__kkq.scene.scene.restart({})); await wait(500);
  }
  await ctx.close();
  process.stdout.write(`${i} `);
}
console.log(`\n${problems.length ? problems.join('\n') : 'no problems'}`);
await b.close(); server.kill();
