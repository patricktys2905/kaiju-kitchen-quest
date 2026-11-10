// Save stress test: loads every save from shots/fuzz-saves.json (scripts/save-fuzz-gen.ts) into the real game and walks
// every screen with it, on a few phone sizes. Reports page errors, console errors and "hit a snag" tabs.
// node scripts/save-fuzz.mjs [from=0] [count=all]
import fs from 'node:fs';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';
const saves = JSON.parse(fs.readFileSync('shots/fuzz-saves.json', 'utf8'));
const from = Number(process.argv[2] ?? 0), count = Number(process.argv[3] ?? saves.length);
const PORT = 5340 + (from % 50), base = `http://localhost:${PORT}/?touch`;
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
  for (let k = 0; k < 60 && !await p.evaluate(() => !!window.__kkq).catch(() => false); k++) await wait(250);
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
