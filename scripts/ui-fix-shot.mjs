// Small UI states that are easy to break and hard to reach by playing, photographed and checked:
//   the level cap (Hero tab, Skills tab line and badge, result screen XP), the result screen after a secret stage
//   (no NEXT), and a garnish that is owned while its Cookbook card is not discovered (an odd save).
//   node scripts/ui-fix-shot.mjs [--port 5733] [--size 844x390] [--out shots/fix/misc]
// → <out>/<W>-*.png; prints each check, exits 1 if one fails. Needs a running dev server.
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i >= 0 ? process.argv[i + 1] : d; };
const PORT = Number(arg('port', 5733)), [W, H] = arg('size', '844x390').split('x').map(Number), OUT = arg('out', 'shots/fix/misc');
fs.mkdirSync(OUT, { recursive: true });
const wait = ms => new Promise(r => setTimeout(r, ms));
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const p = await (await b.newContext({ viewport: { width: W, height: H }, isMobile: true, hasTouch: true })).newPage();
await p.routeWebSocket(u => /^(localhost|127\.0\.0\.1)$/.test(new URL(u).hostname), () => {}); // no hot reloads mid-run
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(`http://localhost:${PORT}/?touch`, { waitUntil: 'commit', timeout: 120000 }); await p.evaluate(() => localStorage.clear()); await p.reload({ waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 720 && !await p.evaluate(() => !!window.__kkq).catch(() => false); i++) await wait(250);
await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(900);
for (let i = 0; i < 3; i++) await p.evaluate(() => document.querySelector('#story .skip')?.click());
const bad = [], ok = (name, pass, detail) => { console.log(`${pass ? 'ok  ' : 'FAIL'} ${name}${detail !== undefined ? ': ' + (typeof detail === 'string' ? detail : JSON.stringify(detail)) : ''}`); if (!pass) bad.push(name); };
const shot = name => p.screenshot({ path: `${OUT}/${W}-${name}.png` });
const click = sel => p.evaluate(s => document.querySelector(s)?.click(), sel);
const tabText = t => p.evaluate(t => document.querySelector(`[data-tab="${t}"]`)?.textContent.trim(), t);

// ---- a kaiju at the level cap: first the balance bot's build (it leaves the tree skills at rank 1, so points can
//      still be spent), then with every point spent that can be ----
const cap = await p.evaluate(async () => {
  window.process ??= { env: {} };
  const m = await import('/scripts/hero-at.ts'), stats = await import('/src/sim/stats.ts'), st = await import('/src/sim/stages.ts');
  const prof = m.heroFor(0, stats.MAX_LEVEL, 1), s = window.__kkq.save, h = s.heroes[0];
  Object.assign(h, { level: prof.level, xp: 0, alloc: prof.alloc, skills: prof.skills, equip: prof.equip, tree: prof.tree, loadout: prof.loadout, skillPts: prof.skillPts, statPts: 0 });
  for (const x of st.STAGES) h.cleared[x.id] = 'A';
  s.selected = 0; window.__kkq.scene.scene.restart({});
  return { max: stats.MAX_LEVEL, bot: prof.skillPts };
});
await wait(900);
await click('[data-tab="skills"]'); await wait(200);
ok(`bot build at Lv ${cap.max}: ${cap.bot} points and ranks still to buy, so the badge and "to spend" stay`, (await p.evaluate(() => document.querySelector('.subtabs .pts')?.textContent)) === `${cap.bot} points to spend` && (await tabText('skills')) === `Skills${cap.bot}`, await tabText('skills'));
cap.spare = await p.evaluate(async () => {
  const sv = await import('/src/save.ts'), tr = await import('/src/sim/tree.ts'), sk = await import('/src/sim/skills.ts');
  const h = sv.save.heroes[0];
  for (let g = 0; g < 500; g++) { const n = tr.treeOf(0).flatMap(t => t.nodes).find(n => sv.learnNode(0, n.id)); if (n) continue; if (![...tr.allActives(0), sk.skillsOf(0).passive].some(s => sv.levelSkill(0, s.id))) break; }
  return h.skillPts;
});
console.log(`after buying everything: ${cap.spare} spare points`);
await click('[data-tab="hero"]'); await wait(200); await shot('cap-hero');
const heroTxt = await p.evaluate(() => document.querySelector('.hero .portrait')?.innerText.replace(/\s+/g, ' '));
ok('Hero tab at the cap says MAX LEVEL, no "0 / N XP"', /MAX LEVEL/.test(heroTxt) && !/\d+ \/ \d+ XP/.test(heroTxt), heroTxt);
await click('[data-tab="skills"]'); await wait(200); await shot('cap-skills');
const line = await p.evaluate(() => document.querySelector('.subtabs .pts')?.textContent), hot = await p.evaluate(() => document.querySelector('.subtabs .pts')?.classList.contains('has'));
ok(`Skills line with ${cap.spare} unspendable points`, new RegExp(`^Everything learned! ${cap.spare} spare point`).test(line) && !hot, line);
ok('Skills tab has no badge', (await tabText('skills')) === 'Skills', await tabText('skills'));
ok('the kaiju picker shows no "has points" dot', await p.evaluate(() => !document.querySelector('.side .hp.on.pts')));
await click('[data-act="sv-skills"]'); await wait(200); await shot('cap-skills-list');
ok('no skill + button is live', await p.evaluate(() => !document.querySelector('.skill .pill.go[data-skill]')));
// a lower level with points to spend: the badge and the old line are back
await p.evaluate(() => { const h = window.__kkq.save.heroes[0]; h.level = 30; h.skillPts = 3; h.tree = {}; }); await click('[data-tab="hero"]'); await click('[data-tab="skills"]'); await wait(200);
ok('with something to buy: "3 points to spend" and the badge', (await p.evaluate(() => document.querySelector('.subtabs .pts')?.textContent)) === '3 points to spend' && /3/.test(await tabText('skills')), await tabText('skills'));
await shot('lv30-skills');
await p.evaluate(async () => { const stats = await import('/src/sim/stats.ts'); window.__kkq.save.heroes[0].level = stats.MAX_LEVEL; });

// ---- result screens ----
const result = (id, o = {}) => p.evaluate(async ([id, o]) => {
  const camp = await import('/src/ui/camp.ts'), st = await import('/src/sim/stages.ts');
  camp.showResult({ stage: st.stageById(id), res: { rank: 'A', boxes: [], upgraded: 0, firstClear: false, crumbs: 0 }, time: 131, hits: 4, combo: 31, xp: 15765, levels: 0, failed: false, crumbs: 900, hard: false, ...o }, () => {});
  const r = document.getElementById('result');
  return { stats: r.querySelector('.st').innerText.replace(/\s+/g, ' '), btns: [...r.querySelectorAll('.btns button')].map(x => x.textContent.trim()) };
}, [id, o]);
const bonusIds = await p.evaluate(async () => (await import('/src/sim/stages.ts')).BONUS_STAGES.map(s => s.id));
let r = await result(bonusIds[bonusIds.length - 1]); await wait(150); await shot('result-secret');
ok(`secret stage ${bonusIds[bonusIds.length - 1]}: no NEXT button`, !r.btns.some(t => /NEXT/.test(t)), r.btns);
ok('at the cap the result says XP MAX, not a number', /XP ?MAX/.test(r.stats) && !/15765/.test(r.stats), r.stats);
for (const id of bonusIds) { const x = await result(id); if (x.btns.some(t => /NEXT/.test(t))) ok(`secret stage ${id}: no NEXT`, false, x.btns); }
r = await result('11-4'); await wait(150); await shot('result-normal');
ok('a normal stage still offers NEXT: 11-5', r.btns.some(t => /NEXT: 11-5/.test(t)), r.btns);
r = await result('11-10');
ok('the last stage offers no NEXT', !r.btns.some(t => /NEXT/.test(t)), r.btns);
await p.evaluate(() => { window.__kkq.save.heroes[0].level = 57; });
r = await result('3-4'); ok('below the cap the XP number shows', /\+15765/.test(r.stats), r.stats);
r = await result('3-4', { levels: 1 }); ok('a run that levelled up shows its XP', /\+15765/.test(r.stats), r.stats);
await p.evaluate(() => { document.getElementById('result').className = 'kq'; });

// ---- an owned garnish whose Cookbook card is not discovered ----
await p.evaluate(() => { const s = window.__kkq.save; s.cookbook = {}; s.drops = {}; s.garnishes = ['bun']; for (const h of Object.values(s.heroes)) delete h.garnish; });
await click('[data-tab="bag"]'); await click('[data-bag="cookbook"]'); await wait(250); await shot('garnish-odd-book');
ok('Cookbook page draws with the odd garnish', await p.evaluate(() => !!document.querySelector('[data-cb="card:bun"]')));
await click('[data-cb="card:bun"]'); await wait(250); await shot('garnish-odd-card');
const box = await p.evaluate(() => { const g = document.querySelector('.gnbox'); return g ? { text: g.innerText.replace(/\s+/g, ' '), btn: g.querySelector('button')?.textContent } : null; });
ok('the undiscovered card shows the owned garnish with WEAR', !!box && /WEAR/.test(box.btn ?? ''), box);
await click('.gnbox [data-gn^="wear:"]'); await wait(250);
ok('WEAR from that card works', await p.evaluate(() => window.__kkq.save.heroes[window.__kkq.save.selected].garnish === 'bun'));
ok('and the card now offers TAKE OFF', /TAKE OFF/.test(await p.evaluate(() => document.querySelector('.gnbox button')?.textContent ?? '')));
await click('[data-cb="back"]'); await click('[data-tab="hero"]'); await wait(250); await shot('garnish-odd-hero');
ok('Hero tab shows it in the garnish slot', /Garnish/.test(await p.evaluate(() => document.querySelector('.gslot')?.innerText ?? '')), await p.evaluate(() => document.querySelector('.gslot')?.innerText.replace(/\s+/g, ' ')));
await click('[data-gn="pick"]'); await wait(250); await shot('garnish-odd-picker');
ok('the picker lists it', await p.evaluate(() => !!document.querySelector('.gnpick [data-gn="wear:bun"]')));
await click('[data-gn="wear:"]'); await wait(200);
ok('"None" takes it off', await p.evaluate(() => !window.__kkq.save.heroes[window.__kkq.save.selected].garnish));
ok('no page errors', !errs.length, errs);
console.log(bad.length ? `${bad.length} FAILED` : 'all checks passed');
await b.close(); process.exit(bad.length ? 1 : 0);
