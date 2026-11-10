// Gear skills / procs / signature legendaries: node scripts/gear-shot.mjs → shots/gear-hero.png, gear-item.png, gear-throw.png, gear-lob.png
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';
const PORT = 5329, url = `http://localhost:${PORT}/?touch`;
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
const wait = ms => new Promise(r => setTimeout(r, ms));
await wait(3000);
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const p = await (await b.newContext({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })).newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(url); await p.evaluate(() => localStorage.clear()); await p.reload();
for (let i = 0; i < 60; i++) { if (await p.evaluate(() => !!window.__kkq).catch(() => false)) break; await wait(250); }
await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(600);
// Bluebeary, Lv 14, Berry Bomb Basket (sig weapon on the Honey Dipper Mace) + Bubble Wrap armour + Static Whisk charm
await p.evaluate(() => {
  const s = window.__kkq.save, sp = 10, h = s.heroes[sp];
  s.unlocked = [...new Set([...s.unlocked, sp])]; s.selected = sp; h.level = 14; s.storyMode = 'key';
  for (let n = 1; n <= 6; n++) h.cleared['1-' + n] = 'A';
  h.seen.push('intro', 'w1-open', 'w1-s2', 'w1-s3', 'w1-s4');
  h.equip = {
    weapon: { id: 9001, base: 'w-blue2', rarity: 5, ilvl: 14, plus: 3, grade: 3, lines: [{ k: 'atk', v: 30 }, { k: 'hp', v: 40 }], unique: 'berrybasket' },
    armor: { id: 9002, base: 'a-blue2', rarity: 4, ilvl: 14, plus: 0, grade: 2, lines: [{ k: 'def', v: 9 }, { k: 'hp', v: 60 }], proc: 'bubble' },
    charm: { id: 9003, base: 'k-blue', rarity: 3, ilvl: 14, plus: 0, grade: 2, lines: [{ k: 'hp', v: 40 }], proc: 'zap' },
  };
  window.__kkq.scene.scene.restart({});
});
await wait(900);
await p.evaluate(() => document.querySelector('[data-tab=hero]')?.click()); await wait(400);
await p.screenshot({ path: 'shots/gear-hero.png' });
await p.evaluate(() => document.querySelector('[data-eqslot=weapon]')?.click()); await wait(400);
await p.screenshot({ path: 'shots/gear-item.png' });
await p.evaluate(() => window.__kkq.play('1-3')); await wait(1500);
await p.evaluate(() => { const w = window.__kkq.world(); w.hero.inv = 9999; w.hero.x = 700; w.hero.face = 1; const m = w.spawnMob('bun', 900, 3); m.hp = m.maxHp = 9999; });
await wait(300);
await p.keyboard.down('KeyF'); await wait(80); await p.keyboard.up('KeyF'); await wait(380);
await p.screenshot({ path: 'shots/gear-lob.png' });
// a thrower: Pizzaraptor's skewer
await p.evaluate(() => { const w = window.__kkq.world(); w.hero.d.gear = { ...w.hero.d.gear, style: 'throw', icon: 'eq-skewer', name: 'Skewer Toss', fx: undefined }; w.hero.cds[3] = 0; });
await p.keyboard.down('KeyF'); await wait(80); await p.keyboard.up('KeyF'); await wait(220);
await p.screenshot({ path: 'shots/gear-throw.png' });
console.log(errs.length ? errs : 'no errors'); await b.close(); server.kill(); process.exit(0);
