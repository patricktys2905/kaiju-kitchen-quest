// QA: summary of shots/qa2/play/<sp>.json  node scripts/qa-play-sum.mjs <sp>
import fs from 'node:fs';
const o = JSON.parse(fs.readFileSync(`shots/qa2/play/${process.argv[2]}.json`, 'utf8'));
for (const [id, r] of Object.entries(o.stages)) {
  if (!r.stage) { console.log(id, 'NOT STARTED', JSON.stringify(r.start)); continue; }
  const ev = r.events ?? [], c = t => ev.filter(e => e.t === t);
  console.log(`\n${id} ${r.stage.name} | attempts ${r.attempts}${r.protect ? ' PROTECTED' : ''} | hero Lv ${r.stage.heroLv} -> ${r.after?.level} (pts skill ${r.after?.skillPts} stat ${r.after?.statPts}) | objective ${r.stage.objective} | hazards ${r.stage.hazards}`);
  console.log('  wants:', r.stage.maps.map(m => m.wants ? m.wants.join('+') : m.kind).join(' | '));
  console.log('  room foes at start:', JSON.stringify(r.stage.roomFoes));
  console.log('  boss room on entry:', JSON.stringify(r.bossRoom?.mobs?.map(m => `${m.name}[${m.kind}] art=${m.key} ${m.st}${m.wake ? ' ASLEEP' : ''} ${m.wpx}x${m.hpx}px`)), 'wakeEv', JSON.stringify(r.bossRoom?.wakeEv?.map(e => e.kind + '@' + e.time)));
  console.log('  art seen:', Object.keys(r.seen ?? {}).filter(k => k.startsWith('mob:')).map(k => k.slice(4)).join(' '));
  console.log('  loot:', Object.entries(r.seen ?? {}).filter(([k]) => k.startsWith('loot:')).map(([k, v]) => k.slice(5) + '×' + v).join(' '), '| warps', c('warp').filter(e => e.hi === 0).map(e => e.to + '@' + e.time).join(' '), '| needDrops', c('needDrops').length, '| downs', c('down').length);
  console.log('  goals/objective:', [...c('goal'), ...c('objective'), ...c('objFail'), ...c('key')].sort((a, b) => a.time - b.time).map(e => `${e.time}:${e.t}:${(e.text ?? e.why ?? e.world ?? '').toString().slice(0, 70)}${e.done ? ' DONE' : ''}`).join(' || '));
  console.log('  boss moves:', Object.entries(c('nemesisMove').reduce((a, e) => (a[e.move] = (a[e.move] ?? 0) + 1, a), {})).map(([k, v]) => k + '×' + v).join(', '), '| phases', c('phase').map(e => e.n + '@' + e.time).join(' '), '| enrage', c('enrage').map(e => e.name + '@' + e.time).join(' '), '| mimic', c('mimic').length, '| hazard on', c('hazard').filter(e => e.on).length);
  console.log('  bad art:', JSON.stringify(r.bad), '| result:', (r.result ?? 'none').slice(0, 330));
}
console.log('\nfinal', JSON.stringify(o.final), 'errors', JSON.stringify(o.errs));
