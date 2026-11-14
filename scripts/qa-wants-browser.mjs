// QA: every story stage's wanted drops as the BROWSER generates them vs Node (vite-node): node scripts/qa-wants-browser.mjs <port>
import { chromium } from 'playwright-core'; import { execSync } from 'node:child_process'; import fs from 'node:fs';
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const p = await b.newPage(); await p.goto(`http://localhost:${process.argv[2]}/`, { waitUntil: 'commit' });
for (let i = 0; i < 200 && !await p.evaluate(() => !!window.__kkq).catch(() => false); i++) await new Promise(r => setTimeout(r, 250));
const br = await p.evaluate(async () => { const m = await import('/src/sim/stages.ts'); const o = {}; for (const s of [...m.STAGES, ...m.BONUS_STAGES]) o[s.id] = { wants: s.maps?.filter(q => q.kind === 'zone').map(q => q.goal?.wants?.map(x => x.mob).join('+')).join(' | '), foe: s.mobs[0]?.kind, n: s.mobs.length, plats: s.platforms.length, w: s.width, hz: s.hazards?.length, props: s.props?.length }; return o; });
await b.close();
fs.writeFileSync('shots/qa2/wants-browser.json', JSON.stringify(br, null, 1));
fs.writeFileSync('scripts/qa-wants-node.ts', `import { STAGES, BONUS_STAGES } from '../src/sim/stages';\nconst o: any = {}; for (const s of [...STAGES, ...BONUS_STAGES]) o[s.id] = { wants: s.maps?.filter(q => q.kind === 'zone').map(q => (q.goal as any)?.wants?.map((x: any) => x.mob).join('+')).join(' | '), foe: s.mobs[0]?.kind, n: s.mobs.length, plats: s.platforms.length, w: s.width, hz: s.hazards?.length, props: s.props?.length };\nconsole.log(JSON.stringify(o));\n`);
const nd = JSON.parse(execSync('npx vite-node scripts/qa-wants-node.ts', { encoding: 'utf8' }));
let diff = 0, n = 0; const byWorld = {};
for (const id of Object.keys(nd)) { n++; const a = JSON.stringify(nd[id]), c = JSON.stringify(br[id]); if (a !== c) { diff++; const w = id.split('-')[id.startsWith('S') ? 1 : 0]; byWorld[w] = (byWorld[w] ?? 0) + 1; if (diff <= 12 || id.startsWith('11')) console.log(id, '\n  node   ', a, '\n  browser', c); } }
console.log(`stages compared ${n}, different ${diff}`, JSON.stringify(byWorld));
