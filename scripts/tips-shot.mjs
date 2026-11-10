// First-time tips on a brand-new save: each one shows and moves on when done. node scripts/tips-shot.mjs → shots/tips-*.png
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';
const PORT = 5392, base = `http://localhost:${PORT}/`;
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
const wait = ms => new Promise(r => setTimeout(r, ms));
await wait(3000);
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const p = await (await b.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(base); await p.evaluate(() => localStorage.clear()); await p.reload();
for (let i = 0; i < 60 && !await p.evaluate(() => !!window.__kkq); i++) await wait(250);
await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(800);
await p.evaluate(() => { const s = window.__kkq.save; s.storyMode = 'key'; s.heroes[0].seen.push('intro', 'w1-open'); window.__kkq.play('1-1'); }); await wait(2500);
const coach = () => p.evaluate(() => document.querySelector('#coach.on span')?.textContent ?? '');
const seen = [];
const note = async () => { const c = await coach(); if (c && seen.at(-1) !== c) seen.push(c); };
await note(); await p.screenshot({ path: 'shots/tips-1.png' });
await p.keyboard.down('ArrowRight'); await wait(1200); await p.keyboard.up('ArrowRight'); await wait(1500); await note();
await p.keyboard.down('Space'); await wait(300); await p.keyboard.up('Space'); await wait(1600); await note();
for (let i = 0; i < 4; i++) { await p.keyboard.press('KeyJ'); await wait(150); } await wait(1600); await note();
await p.keyboard.press('ArrowLeft'); await wait(60); await p.keyboard.press('ArrowLeft'); await wait(1800); await note();
await p.screenshot({ path: 'shots/tips-2.png' });
for (let i = 0; i < 3; i++) { await p.keyboard.press('KeyL'); await wait(900); await note(); }
console.log('tips seen in order:\n- ' + seen.join('\n- '));
console.log('remembered:', await p.evaluate(() => window.__kkq.save.tips.join(',')));
console.log(errs.length ? errs : 'no errors');
await b.close(); server.kill();
