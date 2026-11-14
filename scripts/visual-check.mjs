// Before/after screenshots: photographs the key screens (animations frozen, a fixed save) and compares each with
// tests/visual-baseline/<name>.png. Anything that changed more than THRESHOLD of its pixels is reported, with a diff image
// (changed pixels in red) in shots/visual/<name>-diff.png.
//   node scripts/visual-check.mjs           compare with the baseline
//   node scripts/visual-check.mjs --update  accept the current look as the new baseline (after checking the diffs)
//   node scripts/visual-check.mjs --update camp-market,report   accept only these screens
//   --port N   use a dev server that is already running (otherwise one is started on 5390 and stopped again)
// The page's clock is fixed (FIXED_DAY, local time), so everything the game derives from the date (the Market's daily
// stock, the daily quests: save.ts today() is the LOCAL date, unpadded) is the same whenever and wherever this runs.
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';
const UPDATE = process.argv.includes('--update'), THRESHOLD = 0.02;
const ONLY = (a => a && !a.startsWith('--') ? a.split(',') : null)(process.argv[process.argv.indexOf('--update') + 1]); // --update <names>: only these
const FIXED_DAY = new Date(2026, 0, 15, 12, 0, 0); // local noon: the same calendar day in every time zone's own reckoning
const pi = process.argv.indexOf('--port'), OWN = pi < 0;
const PORT = OWN ? 5390 : Number(process.argv[pi + 1]), base = `http://localhost:${PORT}/?touch`;
fs.mkdirSync('tests/visual-baseline', { recursive: true }); fs.mkdirSync('shots/visual', { recursive: true });
const server = OWN ? spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' }) : null;
const wait = ms => new Promise(r => setTimeout(r, ms));
if (OWN) await wait(3000);
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const ctx = await b.newContext({ viewport: { width: 852, height: 393 }, isMobile: true, hasTouch: true });
await ctx.clock.setFixedTime(FIXED_DAY); // Date.now() / new Date() only: timers and animation frames keep running
const p = await ctx.newPage();
await p.routeWebSocket(u => /^(localhost|127.0.0.1)$/.test(new URL(u).hostname), () => {}); // no hot reloads mid-run
const errs = []; p.on('pageerror', e => errs.push(e.message));
const freeze = () => p.addStyleTag({ content: '*, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }' });
await p.goto(base, { waitUntil: 'commit', timeout: 120000 }); await p.evaluate(() => localStorage.clear()); await p.reload({ waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 720 && !await p.evaluate(() => !!window.__kkq).catch(() => false); i++) await wait(250); // a cold dev server can take minutes
await freeze(); await wait(400);
const shots = [];
const snap = async name => { await wait(500); const f = `shots/visual/${name}.png`; await p.screenshot({ path: f }); shots.push(name); };
await snap('title');
await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(1200);
// a fixed, mid-game save so every screen has content (the Market rolls its stock for FIXED_DAY: always the same)
await p.evaluate(() => {
  const s = window.__kkq.save; s.selected = 10; s.crumbs = 1234; s.unlocked = [0, 10, 11, 4, 2];
  const h = s.heroes[10]; h.level = 14; for (let n = 1; n <= 10; n++) h.cleared['1-' + n] = 'A'; h.cleared['2-1'] = 'B';
  window.__kkq.scene.scene.restart({});
});
await wait(800); await freeze();
for (const tab of ['map', 'hero', 'skills', 'bag', 'market', 'quests', 'free']) { await p.evaluate(t => document.querySelector(`[data-tab="${t}"]`)?.click(), tab); await snap(`camp-${tab}`); }
// the Monster Cookbook (Bag → Cookbook): a part-filled page, then one card opened. Set up here, after the tab shots, so they stay as they were
await p.evaluate(() => { const s = window.__kkq.save; s.drops = { bun: 7, jamhop: 2, worm: 12, ant: 1, mimic: 3 }; s.cookbook = { bun: 5, worm: 12, ant: 1, egg: 3, garlic: 1 }; });
await p.evaluate(() => document.querySelector('[data-tab="bag"]')?.click()); await p.evaluate(() => document.querySelector('[data-bag="cookbook"]')?.click()); await snap('camp-cookbook');
await p.evaluate(() => document.querySelector('[data-cb="card:bun"]')?.click()); await snap('camp-cookbook-card');
await p.evaluate(() => { const s = window.__kkq.save; delete s.drops; delete s.cookbook; document.querySelector('[data-cb="back"]')?.click(); document.querySelector('[data-bag="weapon"]')?.click(); });
await p.evaluate(() => document.querySelector('[data-tab="map"]')?.click());
await p.evaluate(() => document.querySelector('[data-act="spicyopen"]')?.click()); await snap('stage-panel');
await p.evaluate(() => document.querySelector('[data-report]')?.click()); await snap('report');
await b.close(); server?.kill();

// compare (in a fresh browser page: draw both images to canvases and count differing pixels)
const b2 = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const q = await b2.newPage();
const url = f => 'file:///' + path.resolve(f).replace(/\\/g, '/');
const changed = [];
for (const name of shots) {
  const now = `shots/visual/${name}.png`, was = `tests/visual-baseline/${name}.png`;
  if ((UPDATE && (!ONLY || ONLY.includes(name))) || !fs.existsSync(was)) { fs.copyFileSync(now, was); continue; }
  await q.setContent('<canvas id=a></canvas><canvas id=b></canvas><canvas id=d></canvas>');
  const res = await q.evaluate(async ([a, bb]) => {
    const load = src => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });
    const [ia, ib] = await Promise.all([load(a), load(bb)]);
    const w = Math.max(ia.width, ib.width), h = Math.max(ia.height, ib.height);
    const grab = (img, id) => { const c = document.getElementById(id); c.width = w; c.height = h; const x = c.getContext('2d'); x.drawImage(img, 0, 0); return x.getImageData(0, 0, w, h).data; };
    const da = grab(ia, 'a'), db = grab(ib, 'b');
    const dc = document.getElementById('d'); dc.width = w; dc.height = h; const dx = dc.getContext('2d'); dx.drawImage(ib, 0, 0); dx.fillStyle = 'rgba(0,0,0,0.6)'; dx.fillRect(0, 0, w, h);
    const out = dx.getImageData(0, 0, w, h); let n = 0;
    for (let k = 0; k < da.length; k += 4) if (Math.abs(da[k] - db[k]) + Math.abs(da[k + 1] - db[k + 1]) + Math.abs(da[k + 2] - db[k + 2]) > 60) { n++; out.data[k] = 255; out.data[k + 1] = 40; out.data[k + 2] = 40; out.data[k + 3] = 255; }
    dx.putImageData(out, 0, 0);
    return { frac: n / (w * h), diff: dc.toDataURL('image/png') };
  }, [was, now].map(f => 'data:image/png;base64,' + fs.readFileSync(f).toString('base64')));
  if (res.frac > THRESHOLD) { changed.push(`${name}: ${(res.frac * 100).toFixed(1)}% changed`); fs.writeFileSync(`shots/visual/${name}-diff.png`, Buffer.from(res.diff.split(',')[1], 'base64')); }
}
await b2.close();
console.log(UPDATE && !ONLY ? `baseline updated (${shots.length} screens)` : UPDATE && !changed.length ? `baseline updated (${ONLY.join(', ')}); the other screens are unchanged` : changed.length ? 'CHANGED:\n' + changed.join('\n') + '\n(see shots/visual/*-diff.png; if intended: node scripts/visual-check.mjs --update)' : `no visual changes (${shots.length} screens)`);
console.log(errs.length ? errs : 'no page errors');
