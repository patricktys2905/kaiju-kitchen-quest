// Phone screenshots (844x390) of story scenes with their painted stills.
// Usage: node scripts/story-shot.mjs [dpr] [species] [beats...]   e.g. node scripts/story-shot.mjs 2 0 intro w1-open w4-after
// Saves shots/story-<species>-<n>.png, one per line shown.
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';
const PORT = 5312, url = `http://localhost:${PORT}/?touch`;
const [dpr = '1', sp = '0', ...beatArgs] = process.argv.slice(2);
const beats = beatArgs.length ? beatArgs : ['intro', 'w1-open', 'w1-boss', 'w1-after'];
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
const wait = ms => new Promise(r => setTimeout(r, ms));
await wait(3000);
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const ctx = await b.newContext({ viewport: { width: 844, height: 390 }, deviceScaleFactor: Number(dpr), isMobile: true, hasTouch: true });
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', e => errs.push(e.message));
p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
await p.goto(url);
for (let i = 0; i < 60; i++) { if (await p.evaluate(() => !!window.__kkq).catch(() => false)) break; await wait(250); }
await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(700); // dismiss the title screen
await wait(800);
await p.evaluate(({ sp, beats }) => import('/src/ui/story.ts').then(m => { window.__storyDone = false; m.playStory(sp, beats, () => { window.__storyDone = true; }); }), { sp: Number(sp), beats });
let n = 0;
while (!(await p.evaluate(() => window.__storyDone)) && n < 40) {
  await wait(2600); // fade-in + typing out the longest lines
  await p.screenshot({ path: `shots/story-${sp}-${n}.png` });
  n++;
  await p.locator('#story').click({ position: { x: 420, y: 150 } });
}
console.log(`${n} shots`, errs.length ? errs : 'no errors');
await b.close();
server.kill();
process.exit(0);
