// QA: 11-7 secret ledge, properly: stand on the sponge, tap jump (real key), ride the bounce, open the chest, come down three ways.
import { chromium } from 'playwright-core';
const PORT = process.argv[2], SP = Number(process.argv[3] ?? 0); const wait = ms => new Promise(r => setTimeout(r, ms));
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const p = await (await b.newContext({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })).newPage();
p.on('pageerror', e => console.log('PAGEERROR', e.message));
await p.goto(`http://localhost:${PORT}/?touch`, { waitUntil: 'commit' }); await p.evaluate(() => localStorage.clear()); await p.reload({ waitUntil: 'commit' });
for (let i = 0; i < 200 && !await p.evaluate(() => !!window.__kkq).catch(() => false); i++) await wait(250);
await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(900);
await p.evaluate(sp => { const s = window.__kkq.save; s.unlocked = [...new Set([...s.unlocked, sp])]; s.selected = sp; s.heroes[sp].level = 118; s.tips = ['move', 'jump', 'attack', 'dodge', 'skill', 'gear', 'weak', 'resist', 'ladder', 'drop', 'arena', 'hazard', 'hazard-skin', 'sponge', 'potion', 'escort', 'fetch', 'boss', 'cookbook', 'exit']; window.__kkq.play('11-7'); }, SP); await wait(2500);
const st = () => p.evaluate(() => { const w = window.__kkq.world(), h = w.heroes[0]; return { x: Math.round(h.x), y: Math.round(h.y), ground: h.ground, on: h.on, state: h.state }; });
await p.evaluate(() => { const w = window.__kkq.world(); for (const h of w.heroes) h.inv = 99999; for (const m of w.mobs) if (!m.wake) { m.hp = 0; m.state = 'dead'; } const ch = w.props.find(q => q.kind === 'chest' && q.key), sp = w.props.filter(q => q.kind === 'sponge').sort((a, c) => Math.abs(a.x - ch.x) - Math.abs(c.x - ch.x))[0]; window.__ch = ch; window.__sp = sp; w.heroes[0].x = sp.x - 200; w.heroes[0].y = w.stage.groundY; });
await wait(500);
// walk to the sponge with the key, stop on it, tap jump
await p.keyboard.down('ArrowRight'); for (let i = 0; i < 200 && await p.evaluate(() => window.__kkq.world().heroes[0].x < window.__sp.x - 14); i++) await wait(16); await p.keyboard.up('ArrowRight'); await wait(300);
console.log('standing on the sponge:', JSON.stringify(await st()), 'sponge x', await p.evaluate(() => window.__sp.x));
await p.screenshot({ path: 'shots/qa2/extra/ledge2-0-on-sponge.png' });
await p.keyboard.down('Space'); await wait(100); await p.keyboard.up('Space');
let top = 999, landed = null; for (let i = 0; i < 120; i++) { const s = await st(); top = Math.min(top, s.y); if (i === 25) await p.screenshot({ path: 'shots/qa2/extra/ledge2-1-air.png' }); if (i > 10 && s.ground) { landed = s; break; } await wait(30); }
console.log('tap jump on the sponge: highest y', top, 'landed', JSON.stringify(landed));
if (landed && landed.y > 200) { // the hop landed back on the sponge: wait for the bounce
  top = 999; landed = null; for (let i = 0; i < 150; i++) { const s = await st(); top = Math.min(top, s.y); if (i === 20) await p.screenshot({ path: 'shots/qa2/extra/ledge2-1b-bounce.png' }); if (i > 10 && s.ground) { landed = s; break; } await wait(30); }
  console.log('second flight: highest y', top, 'landed', JSON.stringify(landed));
}
await wait(300); await p.screenshot({ path: 'shots/qa2/extra/ledge2-2-landed.png' });
const onLedge = landed && landed.y < 200;
console.log('ON THE LEDGE by real keys:', !!onLedge);
if (onLedge) {
  // face the chest and hit it
  await p.keyboard.down('ArrowRight'); await wait(120); await p.keyboard.up('ArrowRight');
  await p.evaluate(() => { window.__keys = []; });
  for (let i = 0; i < 20 && !(await p.evaluate(() => (window.__kkq.save.keys ?? []).includes(11) || window.__kkq.world().props.find(q => q.kind === 'chest' && q.key)?.hp <= 0)); i++) { await p.keyboard.down('KeyJ'); await wait(90); await p.keyboard.up('KeyJ'); await wait(180); }
  await wait(400); await p.screenshot({ path: 'shots/qa2/extra/ledge2-3-chest.png' });
  console.log('chest:', JSON.stringify(await p.evaluate(() => { const c = window.__kkq.world().props.find(q => q.kind === 'chest' && q.key); return { hp: c.hp, keys: window.__kkq.save.keys ?? null }; })));
  // down 1: walk off the left end
  await p.keyboard.down('ArrowLeft'); let s; for (let i = 0; i < 100; i++) { s = await st(); if (s.ground && s.y > 300) break; await wait(40); } await p.keyboard.up('ArrowLeft'); console.log('walk off left →', JSON.stringify(s));
  await wait(1200); s = await st(); console.log('  1.2 s later (fell onto the sponge? bounced again?):', JSON.stringify(s));
  for (let i = 0; i < 60; i++) { s = await st(); if (s.ground) break; await wait(50); } console.log('  settled:', JSON.stringify(s));
}
await b.close();
