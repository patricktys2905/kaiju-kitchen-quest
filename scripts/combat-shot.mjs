// Phone screenshots of the combat features: modifier plates, red wind-up, sniper laser, burner hazard,
// style meter, a disguised mimic, a perfect dodge, a boss enrage. Usage: node scripts/combat-shot.mjs [dpr]
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';
const PORT = 5313, url = `http://localhost:${PORT}/?touch`;
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
const wait = ms => new Promise(r => setTimeout(r, ms));
await wait(3000);
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const ctx = await b.newContext({ viewport: { width: 844, height: 390 }, deviceScaleFactor: Number(process.argv[2] ?? 1), isMobile: true, hasTouch: true });
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', e => errs.push(e.message));
p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
await p.goto(url);
await p.evaluate(() => localStorage.clear());
await p.reload();
for (let i = 0; i < 60; i++) { if (await p.evaluate(() => !!window.__kkq).catch(() => false)) break; await wait(250); }
await p.evaluate(() => document.querySelector('#title .play')?.click());
await wait(800);
const kq = (fn, arg) => p.evaluate(fn, arg);
// a strong hero so nothing dies mid-shot
await kq(() => { const h = window.__kkq.save.heroes[0]; h.level = 12; window.__kkq.save.spicy = ['glass']; });

// 1) stage 1-7: burner flaring, elite with a modifier winding up a red slam, a sniper aiming, style meter up
await kq(() => window.__kkq.play('1-7'));
await wait(1600);
await kq(() => {
  const w = window.__kkq.world(), h = w.hero, z = w.hazards[0];
  for (const m of w.mobs) m.hp = 0, m.state = 'dead', m.deadT = 0.69;
  h.x = z.x - 110; h.face = 1; h.hp = h.d.maxHp; h.inv = 99;
  w.time = Math.ceil(w.time / z.period) * z.period - z.offset + z.period * 2 + 0.25; // burner on
  const e = w.spawnMob('egg', h.x + 230, 8, undefined, true); e.mods = ['spiky']; e.face = -1; e.state = 'windup'; e.move = 'brute'; e.t = 0;
  const s = w.spawnMob('carrot', h.x - 150, 8); s.face = 1; s.state = 'windup'; s.move = 'snipe'; s.t = 0.2;
  const g = w.spawnMob('garlic', h.x + 330, 8); g.face = -1;
  w.style = 66;
});
await wait(350);
await p.screenshot({ path: 'shots/combat-new.png' });

// 2) perfect dodge: a bun bites into the start of a roll
await kq(() => {
  const w = window.__kkq.world(), h = w.hero;
  h.inv = 0; h.state = 'dodge'; h.t = 0.02; h.perfectDone = false;
  const m = w.spawnMob('bun', h.x + 30, 8); m.face = -1; m.state = 'attack'; m.move = 'walker'; m.t = 0;
});
await wait(250);
await p.screenshot({ path: 'shots/combat-perfect.png' });

// 3) stage 4-3: a cereal-box mimic sitting among the loot, a noodle lurker popping up
await kq(() => window.__kkq.play('4-3'));
await wait(1600);
await kq(() => {
  const w = window.__kkq.world(), h = w.hero;
  h.inv = 99; h.hp = h.d.maxHp;
  for (const m of w.mobs) if (m.kind !== 'cereal') { m.hp = 0; m.state = 'dead'; m.deadT = 0.69; }
  const mim = w.mobs.find(m => m.kind === 'cereal');
  h.x = (mim?.x ?? 900) - 220; h.face = 1;
  w.boxes.push({ id: 99901, tier: 3, ilvl: 40, x: h.x + 120, y: w.stage.groundY, vy: 0, ground: true, t: 1 });
  const n = w.spawnMob('noodle', h.x + 60, 40); n.state = 'windup'; n.move = 'pop'; n.t = 0;
});
await wait(1200);
await p.screenshot({ path: 'shots/combat-mimic.png' });

// 4) boss phase 2: Toast King enraged with burners lit
await kq(() => window.__kkq.play('1-10'));
await wait(1800);
await kq(() => { const w = window.__kkq.world(), h = w.hero, b = w.boss; h.inv = 99; b.hp = Math.round(b.maxHp * 0.45); b.enraged = true; h.x = b.x - 230; h.face = 1; });
await wait(2600);
await p.screenshot({ path: 'shots/combat-enrage.png' });

// 5) Bluebeary lobbing Berry Mines (second skill, key I)
await kq(() => { const s = window.__kkq.save; s.selected = 10; s.heroes[10].level = 8; s.heroes[10].skills.mines = 2; s.spicy = []; window.__kkq.play('1-1'); });
await wait(1800);
await p.keyboard.press('KeyI'); await wait(260);
await p.screenshot({ path: 'shots/combat-berries.png' });
await wait(700);
await p.screenshot({ path: 'shots/combat-berries2.png' });

// 6) camp map with the Spicy chillies
await kq(() => window.__kkq.play(''));
await kq(() => { window.__kkq.scene.scene.restart({}); });
await wait(1200);
await p.screenshot({ path: 'shots/camp-spicy.png' });
console.log(errs.length ? errs : 'no errors');
await b.close();
server.kill();
process.exit(0);
