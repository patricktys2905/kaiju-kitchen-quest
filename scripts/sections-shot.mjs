// The skill tree screen on a phone: learn down a path, unlock its new skill, put it on a button.
// node scripts/tree-shot.mjs → shots/tree-*.png
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';
const PORT = 5397, base = `http://localhost:${PORT}/?touch`;
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
const wait = ms => new Promise(r => setTimeout(r, ms));
await wait(3000);
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const p = await (await b.newContext({ viewport: { width: 852, height: 393 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })).newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(base); await p.evaluate(() => localStorage.clear()); await p.reload();
for (let i = 0; i < 60 && !await p.evaluate(() => !!window.__kkq); i++) await wait(250);
await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(800);
// The new long-stage sections in play: node scripts/sections-shot.mjs → shots/sec-*.png
await p.evaluate(() => { const s = window.__kkq.save; s.selected = 0; s.storyMode = 'key'; const h = s.heroes[0]; h.level = 20; h.seen.push('intro', 'w1-open', 'w1-s3', 'w1-s7', 'w2-open', 'w2-s5', 'w2-elite'); s.tips = ['move', 'jump', 'attack', 'dodge', 'skill', 'gear', 'ladder', 'drop', 'arena', 'hazard', 'sponge', 'potion', 'escort', 'fetch', 'boss', 'exit']; });
const go = async (stage, setup, name, ms = 1200) => {
  await p.evaluate(st => window.__kkq.play(st), stage); await wait(2600);
  await p.evaluate(setup); await wait(ms);
  await p.screenshot({ path: `shots/sec-${name}.png` });
};
const stay = 'const w = window.__kkq.world(); w.hero.inv = 9999; w.hero.hp = w.hero.d.maxHp;';
await go('1-7', new Function(stay + 'const d = w.stage.darks[0]; w.hero.x = d.x0 + 500;'), 'dark', 2000);
await go('1-7', new Function(stay + 'const g = w.gates[0]; w.hero.x = g.x - 420;'), 'gate');
await go('1-7', new Function(stay + 'const a = w.arenas.find(a => a.waves.length === 1); w.hero.x = (a.x0 + a.x1) / 2;'), 'mini', 2200);
await go('1-3', new Function(stay + 'const m = w.mobs.find(m => m.wake && m.y < 0); w.hero.x = m.wake + 5;'), 'ambush', 900);
await go('2-5', new Function(stay + 'const l = w.stage.ladders.find(l => l.top === 200); w.hero.x = l.x - 200;'), 'tower');
console.log(errs.length ? errs : 'no errors'); await b.close(); server.kill();
