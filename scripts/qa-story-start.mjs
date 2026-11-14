// QA: selected story scenes as first seen (about 1 s in, the slow zoom barely started), at 844x390 and 667x375
//   node scripts/qa-story-start.mjs [port=5611] → shots/qa2/story-start/<W>-<sp>-<beat>-<line>.jpg
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const PORT = Number(process.argv[2] ?? 5611);
const LIST = [[0, 'w11-open', 0], [0, 'w11-s2', 0], [0, 'w11-s3', 0], [0, 'w11-s4', 0], [10, 'w11-s4', 0], [0, 'w11-elite', 0], [0, 'w11-s6', 0], [0, 'w11-s7', 0], [18, 'w11-s7', 0], [0, 'w11-s8', 0], [0, 'w11-s9', 0], [0, 'w11-boss', 0], [0, 'w11-after', 0], [0, 'w11-after', 4], [18, 'w11-after', 2], [9, 'w11-elite', 0], [16, 'w11-elite', 0]];
fs.mkdirSync('shots/qa2/story-start', { recursive: true });
const wait = ms => new Promise(r => setTimeout(r, ms));
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
for (const [W, H] of [[844, 390], [667, 375]]) {
  const p = await (await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })).newPage();
  await p.goto(`http://localhost:${PORT}/?touch`, { waitUntil: 'commit', timeout: 120000 }); await p.evaluate(() => localStorage.clear()); await p.reload({ waitUntil: 'commit', timeout: 120000 });
  for (let i = 0; i < 480 && !await p.evaluate(() => !!window.__kkq).catch(() => false); i++) await wait(250);
  await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(900);
  for (const [sp, beat, line] of LIST) {
    // preload the painting so the fade-in starts with the picture there
    await p.evaluate(async ([sp, beat]) => { const st = await import('/src/story/stories.ts'); const k = st.stillFor(sp, beat, 0); await new Promise(r => { const im = new Image(); im.onload = im.onerror = r; im.src = `art/${k}.webp`; }); }, [sp, beat]);
    await p.evaluate(([sp, beat]) => import('/src/ui/story.ts').then(m => m.playStory(sp, [beat], () => {})), [sp, beat]);
    for (let i = 0; i < line; i++) { await p.evaluate(() => { const s = document.getElementById('story'); s.click(); }); await wait(60); await p.evaluate(() => document.getElementById('story').click()); await wait(60); }
    await p.evaluate(() => document.getElementById('story').click()); // finish typing
    await wait(1000);
    await p.screenshot({ path: `shots/qa2/story-start/${W}-${sp}-${beat}-${line}.jpg`, type: 'jpeg', quality: 75 });
    await p.evaluate(() => document.querySelector('#story .skip')?.click()); await wait(200);
  }
  await p.close();
}
await b.close(); console.log('done'); process.exit(0);
