// old vs new stage facts after the shuffle fix: node scripts/fy-diff.mjs
import fs from 'node:fs';
const o = JSON.parse(fs.readFileSync('shots/fy/wants-old.json', 'utf8')), n = JSON.parse(fs.readFileSync('shots/fy/wants-new.json', 'utf8'));
const byW = {}; let foeMoved = 0;
for (const id of Object.keys(o)) {
  const w = id.startsWith('S') ? 'S' : id.split('-')[0];
  byW[w] ??= { stages: 0, wantsMoved: 0, sameSet: 0, ids: [] }; byW[w].stages++;
  if (o[id].foe !== n[id].foe) { foeMoved++; console.log('FOE MOVED', id, o[id].foe, n[id].foe); }
  if (o[id].wants !== n[id].wants) { byW[w].wantsMoved++; byW[w].ids.push(id); }
}
console.log('boss-room foes that changed:', foeMoved);
for (const [w, v] of Object.entries(byW)) console.log(`world ${w}: ${v.wantsMoved} of ${v.stages} stages have different wanted drops`);
const full = process.argv[2];
for (const id of Object.keys(o)) if ((full === 'all' || id.startsWith((full ?? '11') + '-')) ) console.log(`${id.padEnd(6)} ${o[id].wants === n[id].wants ? 'same   ' : 'CHANGED'}  old: ${o[id].wants}\n${''.padEnd(15)}  new: ${n[id].wants}`);
