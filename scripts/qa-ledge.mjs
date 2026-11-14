// QA: 11-7 secret ledge: jump onto the sponge with real keys, land on the ledge, then walk off left: where does the hero stand?
import { chromium } from 'playwright-core';
const PORT = process.argv[2], SP = Number(process.argv[3] ?? 0); const wait = ms => new Promise(r => setTimeout(r, ms));
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const p = await (await b.newContext({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })).newPage();
p.on('pageerror', e => console.log('PAGEERROR', e.message));
await p.goto(`http://localhost:${PORT}/?touch`, { waitUntil: 'commit' }); await p.evaluate(() => localStorage.clear()); await p.reload({ waitUntil: 'commit' });
for (let i = 0; i < 200 && !await p.evaluate(() => !!window.__kkq).catch(() => false); i++) await wait(250);
await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(900);
await p.evaluate(sp => { const s = window.__kkq.save; s.unlocked = [...new Set([...s.unlocked, sp])]; s.selected = sp; s.heroes[sp] ??= JSON.parse(JSON.stringify(s.heroes[0])); s.heroes[sp].species = sp; s.heroes[sp].level = 118; s.tips = ['move', 'jump', 'attack', 'dodge', 'skill', 'gear', 'weak', 'resist', 'ladder', 'drop', 'arena', 'hazard', 'hazard-skin', 'sponge', 'potion', 'escort', 'fetch', 'boss', 'cookbook', 'exit']; window.__kkq.play('11-7'); }, SP); await wait(2500);
const st = () => p.evaluate(() => { const w = window.__kkq.world(), h = w.heroes[0]; const pl = h.on !== null && h.on >= 0 ? w.stage.platforms[h.on] : null; return { x: Math.round(h.x), y: Math.round(h.y), ground: h.ground, on: h.on, plat: pl && { x: Math.round(pl.x), y: pl.y, w: pl.w, secret: !!pl.secret }, state: h.state }; });
const info = await p.evaluate(() => { const w = window.__kkq.world(); for (const h of w.heroes) h.inv = 99999; for (const m of w.mobs) if (!m.wake) { m.hp = 0; m.state = 'dead'; } const ch = w.props.find(q => q.kind === 'chest' && q.key), sp = w.props.filter(q => q.kind === 'sponge').sort((a, c) => Math.abs(a.x - ch.x) - Math.abs(c.x - ch.x))[0]; window.__ch = ch; window.__sp = sp; w.heroes[0].x = sp.x - 110; w.heroes[0].y = w.stage.groundY; return { ch: [ch.x, ch.y], sp: [sp.x, sp.y], near: w.stage.platforms.filter(q => Math.abs(q.x - ch.x) < 900).map(q => [Math.round(q.x), q.y, q.w, q.secret ? 'secret' : '']) }; });
console.log('chest, sponge, platforms nearby:', JSON.stringify(info));
await wait(800); await p.screenshot({ path: 'shots/qa2/extra/ledge-0.png' });
// walk right onto the sponge (no jump)
await p.keyboard.down('ArrowRight'); await wait(700); await p.keyboard.up('ArrowRight'); console.log('walked over the sponge without jumping:', JSON.stringify(await st()));
// now jump onto it
await p.evaluate(() => { const w = window.__kkq.world(); w.heroes[0].x = window.__sp.x - 70; w.heroes[0].y = w.stage.groundY; }); await wait(300);
await p.keyboard.down('ArrowRight'); await p.keyboard.down('Space'); await wait(120); await p.keyboard.up('Space');
let top = 999; for (let i = 0; i < 80; i++) { const s = await st(); top = Math.min(top, s.y); if (s.x > info.ch[0] - 40 && s.y < 200) { await p.keyboard.up('ArrowRight'); } if (i === 12) await p.screenshot({ path: 'shots/qa2/extra/ledge-1-bounce.png' }); if (s.ground && s.y < 200) break; await wait(40); }
await p.keyboard.up('ArrowRight'); await wait(300);
console.log('after jumping onto the sponge: highest y', top, JSON.stringify(await st())); await p.screenshot({ path: 'shots/qa2/extra/ledge-2-landed.png' });
if (!(await st()).ground || (await st()).y > 200) { await p.evaluate(() => { const h = window.__kkq.world().heroes[0]; h.x = window.__ch.x - 40; h.y = window.__ch.y; h.vy = 0; }); await wait(400); console.log('placed on the ledge:', JSON.stringify(await st())); }
// walk off to the left
await p.keyboard.down('ArrowLeft'); const trace = []; for (let i = 0; i < 60; i++) { const s = await st(); if (i % 4 === 0) trace.push(`${s.x},${s.y},${s.ground ? 'G' : 'air'},on${s.on}${s.plat ? '[' + s.plat.x + ',' + s.plat.y + ',' + s.plat.w + ']' : ''}`); if (i === 30) await p.screenshot({ path: 'shots/qa2/extra/ledge-3-walking-left.png' }); await wait(60); }
await p.keyboard.up('ArrowLeft'); console.log('walking left off the ledge:', trace.join(' | '));
await p.screenshot({ path: 'shots/qa2/extra/ledge-4-after.png' }); console.log('end:', JSON.stringify(await st()));
// and to the right, off the ledge
await p.evaluate(() => { const h = window.__kkq.world().heroes[0]; h.x = window.__ch.x + 30; h.y = window.__ch.y; h.vy = 0; }); await wait(300);
await p.keyboard.down('ArrowRight'); const tr2 = []; for (let i = 0; i < 40; i++) { const s = await st(); if (i % 4 === 0) tr2.push(`${s.x},${s.y},${s.ground ? 'G' : 'air'}`); await wait(60); } await p.keyboard.up('ArrowRight'); console.log('walking right off the ledge:', tr2.join(' | ')); await p.screenshot({ path: 'shots/qa2/extra/ledge-5-right.png' });
// drop through with down + jump
await p.evaluate(() => { const h = window.__kkq.world().heroes[0]; h.x = window.__ch.x - 30; h.y = window.__ch.y; h.vy = 0; }); await wait(300);
await p.keyboard.down('ArrowDown'); await p.keyboard.down('Space'); await wait(150); await p.keyboard.up('Space'); await p.keyboard.up('ArrowDown'); await wait(1500); console.log('down+jump from the ledge:', JSON.stringify(await st()));
await b.close();
