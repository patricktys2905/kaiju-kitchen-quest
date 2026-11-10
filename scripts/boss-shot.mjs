// A boss fight mid-string: node scripts/boss-shot.mjs [stage] → shots/boss-*.png (tired window, armour bar, armour break)
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';
const PORT = 5321, url = `http://localhost:${PORT}/?touch`, stage = process.argv[2] ?? '1-10';
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
const wait = ms => new Promise(r => setTimeout(r, ms));
await wait(3000);
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const p = await (await b.newContext({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true })).newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(url); await p.evaluate(() => localStorage.clear()); await p.reload();
for (let i = 0; i < 60; i++) { if (await p.evaluate(() => !!window.__kkq).catch(() => false)) break; await wait(250); }
await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(600);
await p.evaluate(id => { window.__kkq.save.heroes[0].level = 14; window.__kkq.play(id); }, stage);
await wait(1800);
await p.evaluate(() => { const w = window.__kkq.world(); w.hero.inv = 9999; w.hero.x = w.boss.x - 130; });
// wait for the boss to finish a string and tire
for (let i = 0; i < 80; i++) { if (await p.evaluate(() => window.__kkq.world().boss.tired > 1.2)) break; await wait(100); }
await wait(150);
await p.screenshot({ path: 'shots/boss-tired.png' });
await p.evaluate(() => { const w = window.__kkq.world(); w.boss.armor = 0.02; w.hero.x = w.boss.x - 60; w.hero.face = 1; });
await p.keyboard.down('KeyS'); await p.keyboard.press('KeyJ'); await p.keyboard.up('KeyS');
await wait(450);
await p.screenshot({ path: 'shots/boss-break.png' });
console.log(errs.length ? errs : 'no errors'); await b.close(); server.kill(); process.exit(0);
