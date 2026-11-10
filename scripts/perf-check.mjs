// Frame rate in busy fights with the CPU slowed down (roughly a mid-range phone), low effects off and on.
// node scripts/perf-check.mjs [cpuSlowdown=4]
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';
const SLOW = Number(process.argv[2] ?? 4);
const PORT = 5393, base = `http://localhost:${PORT}/?touch`;
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
const wait = ms => new Promise(r => setTimeout(r, ms));
await wait(3000);
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true, args: ['--enable-gpu-rasterization', '--ignore-gpu-blocklist'] });
const results = [];
for (const [stage, sp, lowFx] of [['3-7', 0, false], ['3-7', 0, true], ['9-10', 4, false], ['9-10', 4, true]]) {
  const p = await (await b.newContext({ viewport: { width: 852, height: 393 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })).newPage();
  await p.goto(base); await p.evaluate(lowFx => { localStorage.clear(); localStorage.setItem('kkq-settings', JSON.stringify({ lowFx, tips: false })); }, lowFx); await p.reload();
  for (let i = 0; i < 60 && !await p.evaluate(() => !!window.__kkq); i++) await wait(250);
  await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(800);
  await p.evaluate(([stage, sp]) => { const s = window.__kkq.save; s.selected = sp; s.storyMode = 'key'; s.unlocked = [...new Set([...s.unlocked, sp])]; const h = s.heroes[sp]; h.level = 100; h.seen.push('intro', 'w3-open', 'w9-open', 'w9-boss', 'w3-s7'); window.__kkq.play(stage); }, [stage, sp]);
  await wait(3000);
  // keep the hero alive and fighting: everything on screen at once
  await p.evaluate(() => { const w = window.__kkq.world(); w.hero.inv = 9999; for (const m of w.mobs) m.x = w.hero.x + 120 + (m.id % 7) * 30; });
  const cdp = await p.context().newCDPSession(p);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: SLOW });
  const fps = await p.evaluate(() => new Promise(done => {
    const times = []; let last = performance.now(); const end = last + 6000; let k = 0;
    const press = () => { const w = window.__kkq.world(); if (w) { w.hero.inv = 9999; w.hero.hp = w.hero.d.maxHp; } };
    const tick = now => { times.push(now - last); last = now; if (++k % 10 === 0) press(); if (now < end) requestAnimationFrame(tick); else { times.sort((a, b) => a - b); const avg = times.reduce((a, b) => a + b, 0) / times.length; done({ avg: Math.round(1000 / avg), p95: Math.round(1000 / times[Math.floor(times.length * 0.95)]), frames: times.length }); } };
    requestAnimationFrame(tick);
    // mash attacks and skills meanwhile
    const keys = ['KeyJ', 'KeyL', 'KeyI', 'KeyO', 'KeyF', 'KeyU']; let j = 0;
    const iv = setInterval(() => { const c = keys[j++ % keys.length]; dispatchEvent(new KeyboardEvent('keydown', { code: c })); setTimeout(() => dispatchEvent(new KeyboardEvent('keyup', { code: c })), 60); }, 120);
    setTimeout(() => clearInterval(iv), 6000);
  }));
  results.push(`${stage} ${lowFx ? 'low effects' : 'full effects'}: average ${fps.avg} fps, slowest 5% ${fps.p95} fps`);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  await p.context().close();
}
console.log(`CPU slowed ${SLOW}x:\n` + results.join('\n'));
await b.close(); server.kill();
