// QA: which World 11 scenes really play through the stage card (FULL STORY vs KEY SCENES ONLY), and after 11-10.
//   node scripts/qa-story-flow.mjs [port=5611] [species=16]
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const PORT = Number(process.argv[2] ?? 5611), SP = Number(process.argv[3] ?? 16), W = 844, H = 390;
fs.mkdirSync('shots/qa2/story-flow', { recursive: true });
const wait = ms => new Promise(r => setTimeout(r, ms));
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const errs = [];
for (const mode of ['full', 'key']) {
  const p = await (await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1, isMobile: true, hasTouch: true })).newPage();
  p.on('pageerror', e => errs.push(mode + ' page error: ' + e.message));
  await p.goto(`http://localhost:${PORT}/?touch`, { waitUntil: 'commit', timeout: 120000 }); await p.evaluate(() => localStorage.clear()); await p.reload({ waitUntil: 'commit', timeout: 120000 });
  for (let i = 0; i < 480 && !await p.evaluate(() => !!window.__kkq).catch(() => false); i++) await wait(250);
  await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(900);
  await p.evaluate(([sp, mode]) => {
    const s = window.__kkq.save; s.unlocked = [...new Set([...s.unlocked, sp])]; s.selected = sp; const h = s.heroes[sp];
    h.level = 115; s.storyMode = mode; h.cleared = {}; h.seen = ['intro'];
    s.tips = ['move', 'jump', 'attack', 'dodge', 'skill', 'gear', 'weak', 'resist', 'ladder', 'drop', 'arena', 'hazard', 'sponge', 'potion', 'escort', 'fetch', 'boss', 'cookbook', 'exit', 'hazard-skin'];
    for (let w = 1; w <= 10; w++) for (let k = 1; k <= 10; k++) h.cleared[`${w}-${k}`] = 'A';
    for (let k = 1; k <= 9; k++) h.cleared[`11-${k}`] = 'A';
    window.__kkq.scene.scene.restart({});
  }, [SP, mode]); await wait(1000);
  const beatsOf = lines => p.evaluate(async ([sp, lines]) => { const st = await import('/src/story/stories.ts'); const bs = st.STORIES[sp].beats, out = []; for (const t of lines) { const hit = Object.entries(bs).find(([, ls]) => ls.some(l => l[1] === t)); const k = hit ? hit[0] : '??'; if (out[out.length - 1] !== k) out.push(k); } return out; }, [SP, lines]);
  const through = async tag => {
    const lines = [], stills = new Set();
    for (let n = 0; n < 80 && await p.evaluate(() => !!document.querySelector('#story.on')); n++) {
      await p.evaluate(() => document.getElementById('story').click()); await wait(120); // finish typing
      const t = await p.evaluate(() => ({ text: document.querySelector('#story .tx')?.textContent ?? '', still: document.querySelector('#story .still i:not(.out)')?.style.backgroundImage.match(/still-[\w-]+/)?.[0] ?? null }));
      lines.push(t.text); stills.add(t.still);
      if (n === 0) await p.screenshot({ path: `shots/qa2/story-flow/${mode}-${tag}.jpg`, type: 'jpeg', quality: 70 });
      await p.evaluate(() => document.getElementById('story').click()); await wait(150);
    }
    return { n: lines.length, beats: await beatsOf(lines), stills: [...stills] };
  };
  const camp = async () => { await p.evaluate(() => window.__kkq.scene.scene.restart({})); await wait(900); };
  const tapPlay = async id => {
    await p.evaluate(() => [...document.querySelectorAll('[data-mappage]')].pop()?.click()); await wait(400);
    await p.evaluate(i => document.querySelector(`[data-node="${i}"]`)?.click(), id); await wait(350);
    await p.evaluate(i => document.querySelector(`.playrow [data-play="${i}"]`)?.click(), id); await wait(900);
  };
  for (const id of ['11-1', '11-2', '11-5', '11-9', '11-10']) {
    await tapPlay(id);
    const s = await through('before-' + id); await wait(1800);
    const st = await p.evaluate(() => ({ stage: window.__kkq.world()?.stage.id ?? null, story: !!document.querySelector('#story.on') }));
    console.log(`[${mode}] PLAY ${id}: ${s.n} lines, beats ${JSON.stringify(s.beats)}, paintings ${JSON.stringify(s.stills)}, stage started: ${st.stage}`);
    if (id !== '11-10') {
      await camp();
      await tapPlay(id); // PLAY again: nothing should replay
      const again = await through('again-' + id); await wait(1200);
      console.log(`[${mode}]   second PLAY ${id}: ${again.n} lines ${JSON.stringify(again.beats)}`);
      await camp();
    }
  }
  // finish 11-10 (boss at one hit, the way scripts/w11-ui-shot.mjs does it)
  const kq = fn => p.evaluate(fn);
  const safe = 'const w = window.__kkq.world(); for (const h of w.heroes) { h.inv = 9999; h.hp = h.d.maxHp; }';
  await kq(`${safe} w.skipToBoss();`); await wait(600);
  for (let i = 0; i < 100 && !await kq(() => !!window.__kkq.world().boss); i++) { await kq(`${safe} if (!w.boss) w.hero.x += 60;`); await wait(150); }
  await wait(1200);
  for (let i = 0; i < 40 && await kq(() => { const w = window.__kkq.world(); return !!w && !!w.boss && w.boss.hp > 0 && w.boss.state !== 'dead'; }); i++) {
    await kq(`${safe} for (const m of w.mobs) if (m !== w.boss) { m.hp = 0; m.state = 'dead'; } w.boss.hp = 1; w.boss.armor = 0; w.hero.x = w.boss.x - 70; w.hero.y = w.boss.y; w.hero.face = 1;`);
    await p.keyboard.down('KeyJ'); await wait(220); await p.keyboard.up('KeyJ'); await wait(120);
  }
  for (let i = 0; i < 80 && !await p.evaluate(() => !!document.querySelector('#story.on') || !!document.querySelector('#result.on')); i++) { await kq(`const w = window.__kkq.world(); if (w && w.portal) { w.hero.x = w.exitX; w.hero.y = w.stage.groundY; }`).catch(() => {}); await wait(400); }
  const order = await p.evaluate(() => ({ story: !!document.querySelector('#story.on'), result: !!document.querySelector('#result.on') }));
  const a = await through('after-11-10'); await wait(1500);
  const end = await p.evaluate(sp => ({ story: !!document.querySelector('#story.on'), credits: !!document.getElementById('credits') && getComputedStyle(document.getElementById('credits')).display !== 'none', result: !!document.querySelector('#result.on'), cleared: window.__kkq.save.heroes[sp].cleared['11-10'] ?? null, seen: window.__kkq.save.heroes[sp].seen.filter(x => /^w11/.test(x)) }), SP);
  await p.screenshot({ path: `shots/qa2/story-flow/${mode}-end.jpg`, type: 'jpeg', quality: 70 });
  console.log(`[${mode}] after 11-10: first on screen ${JSON.stringify(order)}; ${a.n} lines, beats ${JSON.stringify(a.beats)}, paintings ${JSON.stringify(a.stills)}; then ${JSON.stringify(end)}`);
  await p.close();
}
console.log('errors:', errs.length ? errs : 'none');
await b.close(); process.exit(0);
