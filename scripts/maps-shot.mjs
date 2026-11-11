// The skill tree screen on a phone: learn down a path, unlock its new skill, put it on a button.
// node scripts/tree-shot.mjs → shots/tree-*.png
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';
const PORT = 5399, base = `http://localhost:${PORT}/?touch`;
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
const wait = ms => new Promise(r => setTimeout(r, ms));
await wait(3000);
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const p = await (await b.newContext({ viewport: { width: 852, height: 393 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })).newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(base); await p.evaluate(() => localStorage.clear()); await p.reload();
for (let i = 0; i < 60 && !await p.evaluate(() => !!window.__kkq); i++) await wait(250);
await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(800);
// Map stages in play: the camp, a zone, the boss room; and the stage panel's challenges. node scripts/maps-shot.mjs
await p.evaluate(() => { const s = window.__kkq.save; s.selected = 0; s.storyMode = 'key'; const h = s.heroes[0]; h.level = 20; h.seen.push('intro', 'w1-open', 'w2-open', 'w2-s3'); s.tips = ['move', 'jump', 'attack', 'dodge', 'skill', 'gear', 'ladder', 'drop', 'arena', 'hazard', 'sponge', 'potion', 'escort', 'fetch', 'boss', 'exit']; });
const stay = 'const w = window.__kkq.world(); w.hero.inv = 9999; w.hero.hp = w.hero.d.maxHp;';
await p.evaluate(st => window.__kkq.play(st), '2-3'); await wait(3000);
await p.evaluate(new Function(stay + 'const z = w.stage.maps[0]; w.drops[z.goal.wants[0].mob] = 2; w.hero.x = z.portals[0].x - 10; for (let i = 0; i < 4; i++) w.pickups.push({ id: 9000 + i, kind: z.goal.wants[i % z.goal.wants.length].mob, x: w.hero.x - 200 - i * 40, y: 470, vy: 0, ground: true, t: 1 });')); await wait(900);
await p.screenshot({ path: 'shots/map-camp.png' });
await p.evaluate(new Function(stay + 'const z = w.stage.maps[1]; w.hero.x = z.x0 + 1300;')); await wait(1500);
await p.screenshot({ path: 'shots/map-zone.png' });
await p.evaluate(new Function(stay + 'const z = w.stage.maps[2]; w.hero.x = z.x0 + 900;')); await wait(1500);
await p.screenshot({ path: 'shots/map-zone2.png' });
await p.evaluate(() => { window.__kkq.scene.scene.restart({}); }); await wait(900);
await p.evaluate(() => { const s = window.__kkq.save; s.drops = { yogurt: 30, pea: 30, milk: 30, icebat: 30, carrot: 30 }; document.querySelector('[data-tab="map"]')?.click(); }); await wait(500);
await p.screenshot({ path: 'shots/map-panel.png' });
console.log(errs.length ? errs : 'no errors'); await b.close(); server.kill();
