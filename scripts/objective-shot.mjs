// Objectives in play: node scripts/objective-shot.mjs → shots/obj-escort.png, obj-fetch.png, obj-survive.png, obj-card.png
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';
const PORT = 5318, url = `http://localhost:${PORT}/?touch`;
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
const wait = ms => new Promise(r => setTimeout(r, ms));
await wait(3000);
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const ctx = await b.newContext({ viewport: { width: 844, height: 390 }, deviceScaleFactor: Number(process.argv[2] ?? 1), isMobile: true, hasTouch: true });
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', e => errs.push(e.message));
await p.goto(url);
await p.evaluate(() => localStorage.clear());
await p.reload();
for (let i = 0; i < 60; i++) { if (await p.evaluate(() => !!window.__kkq).catch(() => false)) break; await wait(250); }
await p.evaluate(() => document.querySelector('#title .play')?.click());
await wait(600);
await p.evaluate(() => { const s = window.__kkq.save; s.heroes[0].level = 12; for (const id of ['1-1', '1-2', '1-3', '1-4', '1-5', '1-6', '1-7']) s.heroes[0].cleared[id] = 'A'; });
const shot = async (id, setup, name, ms = 2200) => {
  await p.evaluate(id => window.__kkq.play(id), id);
  await wait(1500);
  await p.evaluate(setup);
  await wait(ms);
  await p.screenshot({ path: `shots/${name}.png` });
};
await shot('1-4', () => { const w = window.__kkq.world(); w.hero.inv = 99; w.hero.x = 700; w.npc.x = 620; w.npc.hp = w.npc.maxHp * 0.6; }, 'obj-escort', 900);
await shot('1-6', () => { const w = window.__kkq.world(); w.hero.inv = 99; w.hero.x = w.scroll.x - 160; w.hero.face = 1; }, 'obj-fetch', 900);
await shot('1-8', () => { const w = window.__kkq.world(); w.hero.inv = 99; w.hero.x = 900; for (const m of w.mobs) { m.hp = 0; m.state = 'dead'; } }, 'obj-survive', 5200);
await p.evaluate(() => { window.__kkq.scene.scene.restart({}); });
await wait(1000);
await p.evaluate(() => document.querySelector('[data-node="1-6"]')?.click());
await wait(400);
await p.screenshot({ path: 'shots/obj-card.png' });
console.log(errs.length ? errs : 'no errors');
await b.close();
server.kill();
process.exit(0);
