// The Great Flosso's Wheel of Misfortune telegraph, photographed and measured in a real melee fight (11-10's boss room,
// the balance bot plays a Lv-cap kaiju at normal speed, hits landing; the boss is held in his last phase).
//   node scripts/wheel-shot.mjs [--port 5733] [--size 844x390] [--species 0] [--per 3] [--out shots/fix/wheel] [--ledge 1]
//   --per    photographs this many wind-ups of each pick (rain / summon / roar)
//   --ledge  1 = also lift the boss onto the top ledge as each second wind-up begins (position forced, the rest is not),
//            so the "boss high up, under the boss bar" case is always covered
// → <out>/<W>-<pick>-<n>-<a|b|c>.png (a: spinning, b: landed, c: late in the wind-up) and <out>/wheel-<W>.json.
// Each frame is checked: the wheel must be showing, wholly on screen, and clear of the boss bar, the hero card, the
// combo counter, the pause/bag buttons and the touch buttons; problems are printed and the script exits 1.
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i >= 0 ? process.argv[i + 1] : d; };
const PORT = Number(arg('port', 5733)), [W, H] = arg('size', '844x390').split('x').map(Number), SP = Number(arg('species', 0)), PER = Number(arg('per', 3)), OUT = arg('out', 'shots/fix/wheel'), LEDGE = arg('ledge', '1') === '1';
fs.mkdirSync(OUT, { recursive: true });
const wait = ms => new Promise(r => setTimeout(r, ms));
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const p = await (await b.newContext({ viewport: { width: W, height: H }, isMobile: true, hasTouch: true })).newPage();
await p.routeWebSocket(u => /^(localhost|127\.0\.0\.1)$/.test(new URL(u).hostname), () => {}); // no hot reloads mid-run
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(`http://localhost:${PORT}/?touch`, { waitUntil: 'commit', timeout: 120000 }); await p.evaluate(() => localStorage.clear()); await p.reload({ waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 720 && !await p.evaluate(() => !!window.__kkq).catch(() => false); i++) await wait(250);
await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(900);
await p.evaluate(async sp => {
  window.process ??= { env: {} };
  const m = await import('/scripts/hero-at.ts'), stats = await import('/src/sim/stats.ts'), st = await import('/src/sim/stages.ts');
  const prof = m.heroFor(sp, stats.MAX_LEVEL, 1), s = window.__kkq.save;
  s.unlocked = [...new Set([...s.unlocked, sp])]; s.selected = sp;
  const h = s.heroes[sp] ?? (s.heroes[sp] = prof);
  Object.assign(h, { level: prof.level, xp: 0, alloc: prof.alloc, skills: prof.skills, equip: prof.equip, tree: prof.tree, loadout: prof.loadout, skillPts: 0, statPts: 0 });
  for (const x of st.STAGES) h.cleared[x.id] = 'A';
  s.storyMode = 'key'; h.seen = Object.keys((await import('/src/story/stories.ts')).STORIES[sp].beats);
  s.tips = ['move', 'jump', 'attack', 'dodge', 'skill', 'gear', 'weak', 'resist', 'ladder', 'drop', 'arena', 'hazard', 'hazard-skin', 'sponge', 'potion', 'escort', 'fetch', 'boss', 'cookbook', 'exit'];
  window.__kkq.scene.scene.restart({ stage: '11-10', skip: true }); // SKIP TO BOSS: straight into the boss room
}, SP);
await wait(2500);
for (let i = 0; i < 20 && await p.evaluate(() => !!document.querySelector('#story.on')); i++) { await p.evaluate(() => document.querySelector('#story .skip')?.click()); await wait(400); }
for (let i = 0; i < 200 && !await p.evaluate(() => !!window.__kkq.world()?.boss).catch(() => false); i++) await wait(250);
// the bot fights (real hits, at normal speed); the hero is kept alive and the boss kept in his last phase
await p.evaluate(async () => {
  const { Bot, SKILLED } = await import('/src/sim/bot.ts');
  const w = window.__kkq.world(), bot = new Bot(w, SKILLED, 3, 0), orig = w.step.bind(w);
  window.__wheel = []; window.__lift = false;
  w.step = inputs => {
    inputs[0] = bot.think();
    const h = w.heroes[0]; if (h.hp < h.d.maxHp * 0.5) h.hp = h.d.maxHp;
    if (w.boss && w.boss.hp < w.boss.maxHp * 0.12) w.boss.hp = w.boss.maxHp * 0.12;
    if (w.boss && w.boss.hp > w.boss.maxHp * 0.3) w.boss.hp = w.boss.maxHp * 0.3; // get to the last phase (the wheel) quickly
    const evs = orig(inputs);
    for (const e of evs) if (e.t === 'nemesisMove' && /Wheel/.test(e.move)) {
      window.__wheel.push({ time: w.time, move: e.move });
      if (window.__lift) { // stand him on the room's highest ledge for this wind-up
        const m = w.mapAt(w.boss.x), plats = (w.stage.platforms ?? []).filter(pl => w.mapAt(pl.x + pl.w / 2) === m).sort((a, b) => a.y - b.y);
        const pl = plats[0]; if (pl) { w.boss.x = Math.max(pl.x + 60, Math.min(pl.x + pl.w - 60, w.boss.x)); w.boss.y = pl.y; w.boss.vy = 0; window.__lifted = true; }
      }
    }
    return evs;
  };
});
const look = () => p.evaluate(() => {
  const R = e => { if (!e) return null; const r = e.getBoundingClientRect(); return r.width && r.height ? { l: Math.round(r.left), t: Math.round(r.top), r: Math.round(r.right), b: Math.round(r.bottom) } : null; };
  const w = window.__kkq.world(), boss = w.boss, el = document.querySelector('#hud .wheel');
  const parts = ['.wd', '.wl'].map(s => R(el.querySelector(s))).filter(Boolean);
  const box = parts.length ? { l: Math.min(...parts.map(r => r.l)), t: Math.min(...parts.map(r => r.t)) - 8, r: Math.max(...parts.map(r => r.r)), b: Math.max(...parts.map(r => r.b)) } : null;
  const hud = { bossbar: R(document.querySelector('#hud .boss')), card: R(document.querySelector('#hud .card')), combo: R(document.querySelector('#hud .combo.on')), right: R(document.querySelector('#hud .right')), style: R(document.querySelector('#hud .style')), mates: R(document.querySelector('#hud .mates')) };
  const touch = [...document.querySelectorAll('#tc .btn')].filter(e => getComputedStyle(e).display !== 'none' && getComputedStyle(e).visibility !== 'hidden').map(R).filter(Boolean);
  const shapes = parts.map((r, i) => i === 0 ? { ...r, t: r.t - 8 } : r); // the disc (with its pin) and the name plate, each on its own
  const hit = (a, c) => a && c && a.l < c.r && a.r > c.l && a.t < c.b && a.b > c.t;
  const cam = window.__kkq.scene.cameras.main.worldView, gy = w.stage.groundY;
  return { on: el.classList.contains('on'), cls: el.className, label: el.querySelector('.wl span').textContent, box, state: boss.state, move: boss.move, heroDist: Math.round(Math.abs(boss.x - w.heroes[0].x)), bossUp: Math.round(gy - boss.y), bossScreenY: Math.round((boss.y - cam.y) / cam.height * innerHeight),
    over: Object.entries(hud).filter(([, r]) => shapes.some(s => hit(s, r))).map(([k]) => k).concat(touch.some(r => shapes.some(s => hit(s, r))) ? ['touch buttons'] : []), off: !box || box.l < 0 || box.t < 0 || box.r > innerWidth || box.b > innerHeight,
    toasts: [...document.querySelectorAll('#hud .toast')].map(t => t.textContent), hits: w.combo };
});
const seen = { rain: 0, summon: 0, roar: 0 }, out = [], bad = [];
let n = 0; const t0 = Date.now();
while (Date.now() - t0 < 600000 && Object.values(seen).some(v => v < PER)) {
  const evs = await p.evaluate(i => window.__wheel.slice(i), n); n += evs.length;
  for (const e of evs) {
    const k = /Sugar/.test(e.move) ? 'rain' : /Wisps/.test(e.move) ? 'summon' : 'roar';
    if (seen[k] >= PER) continue;
    seen[k]++;
    const lifted = await p.evaluate(() => { const v = !!window.__lifted; window.__lifted = false; return v; });
    for (const [tag, ms] of [['a', 0], ['b', 420], ['c', 380]]) {
      await wait(ms);
      const file = `${OUT}/${W}-${k}-${seen[k]}-${tag}.png`;
      const m = await look(); await p.screenshot({ path: file });
      out.push({ pick: k, n: seen[k], tag, lifted, file, ...m });
      const id = `${W} ${k} #${seen[k]}${tag}${lifted ? ' (on the top ledge)' : ''}`;
      if (m.state === 'windup' && /^wheel-/.test(m.move)) {
        if (!m.on) bad.push(`${id}: the wheel is not showing`);
        else { if (m.off) bad.push(`${id}: the wheel is partly off screen ${JSON.stringify(m.box)}`); if (m.over.length) bad.push(`${id}: the wheel overlaps ${m.over.join(', ')}`); }
      }
    }
    await p.evaluate(v => { window.__lift = v; }, LEDGE && seen[k] >= 1 && seen[k] < PER); // every pick's later wind-ups: on the top ledge
  }
  await wait(60);
}
fs.writeFileSync(`${OUT}/wheel-${W}.json`, JSON.stringify(out, null, 1));
for (const o of out) console.log(`${W} ${o.pick} #${o.n}${o.tag}${o.lifted ? ' LEDGE' : ''}: ${o.state}/${o.move} wheel ${o.on ? o.cls.replace('wheel on', '').trim() || 'spinning' : 'OFF'} "${o.label}" box ${o.box ? `${o.box.l},${o.box.t}-${o.box.r},${o.box.b}` : '-'} boss ${o.bossUp}px up (screen y ${o.bossScreenY}) hero ${o.heroDist}px away, combo ${o.hits}${o.over.length ? ' OVER ' + o.over.join(',') : ''}${o.toasts.length ? ' toasts: ' + o.toasts.join(' | ') : ''}`);
console.log('picks photographed:', JSON.stringify(seen));
if (Object.values(seen).some(v => v < PER)) bad.push('not every pick came up in ten minutes: ' + JSON.stringify(seen));
console.log(bad.length ? 'PROBLEMS:\n' + bad.join('\n') : 'the wheel was showing, on screen and clear of the HUD in every wind-up frame');
console.log(errs.length ? errs : 'no page errors');
await b.close(); process.exit(bad.length || errs.length ? 1 : 0);
