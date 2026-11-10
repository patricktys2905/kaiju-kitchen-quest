// The newer gear styles in play: node scripts/gearstyle-shot.mjs → shots/gs-*.png (trap, burst, boomerang)
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';
const PORT = 5337, base = `http://localhost:${PORT}/`;
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
const wait = ms => new Promise(r => setTimeout(r, ms));
await wait(3000);
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const p = await (await b.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(base); await p.evaluate(() => localStorage.clear()); await p.reload();
for (let i = 0; i < 60 && !await p.evaluate(() => !!window.__kkq); i++) await wait(250);
await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(1000);
for (const [name, base, sp, delay] of [['trap', 'w-bluea', 10, 250], ['burst', 'w-goba', 0, 120], ['boomerang', 'w-gobb', 0, 350]]) {
  await p.evaluate(([base, sp]) => { const s = window.__kkq.save; s.selected = sp; s.unlocked = [...new Set([...s.unlocked, sp])]; s.storyMode = 'key'; for (const k of ['intro', 'w1-open', 'w1-s2']) if (!s.heroes[sp].seen.includes(k)) s.heroes[sp].seen.push(k);
    s.heroes[sp].equip.weapon = { id: 900, base, rarity: 3, ilvl: 3, plus: 0, lines: [{ k: 'atk', v: 8 }] }; window.__kkq.play('1-2'); }, [base, sp]);
  await wait(2500);
  await p.evaluate(() => { const w = window.__kkq.world(); w.hero.inv = 999; for (const m of w.mobs) m.x = Math.max(m.x, w.hero.x + 260); });
  await p.keyboard.press('KeyF'); await wait(delay);
  await p.screenshot({ path: `shots/gs-${name}.png` });
}
console.log(errs.length ? errs : 'no errors');
await b.close(); server.kill();
