// QA: reads shots/qa2/story-measure-<W>.json and lists layout / wiring problems
import fs from 'node:fs';
for (const W of [844, 667]) {
  const { meta, out, imgOk } = JSON.parse(fs.readFileSync(`shots/qa2/story-measure-${W}.json`, 'utf8'));
  const bad = []; let n = 0, maxBox = 0, maxBoxAt = '', hist = {};
  const expectStill = (sp, beat) => beat === 'w11-elite' ? `art/still-${sp}-w11-elite.webp` : beat === 'w11-after' ? 'art/still-w11-cure.webp' : `art/still-${beat.replace('w11-', 'w11-')}.webp`;
  for (const r of out) {
    if (!r.closed) bad.push(`${r.sp} ${r.beat}: scene did not close after its last line`);
    r.lines.forEach((m, i) => {
      n++; const id = `${r.name}(${r.sp}) ${r.beat} #${i + 1}`, [who, text] = r.raw[i];
      if (m.text !== text) bad.push(`${id}: text shown differs from data`);
      const lines = Math.round((m.tx.b - m.tx.t) / (0.03 * Math.min(m.vw, m.vh) * 1.35)); hist[lines] = (hist[lines] ?? 0) + 1;
      if (m.box.h > maxBox) { maxBox = m.box.h; maxBoxAt = id + ` (${lines} text lines, ${text.length} chars)`; }
      if (m.box.b > m.vh || m.box.l < 0 || m.box.r > m.vw) bad.push(`${id}: box off screen ${JSON.stringify(m.box)}`);
      if (m.tx.b > m.box.b - 2 || m.tx.r > m.box.r - 2 || m.tx.l < m.box.l || m.tx.t < m.box.t) bad.push(`${id}: text outside box tx=${JSON.stringify(m.tx)} box=${JSON.stringify(m.box)}`);
      if (m.boxScroll[0] > m.boxScroll[1] + 1 || m.boxScroll[2] > m.boxScroll[3] + 1) bad.push(`${id}: box scrolls ${m.boxScroll}`);
      if (m.whoShown && (m.whoR.r > m.box.r || m.whoR.h > 0.075 * m.vh * 1.4)) bad.push(`${id}: name tag ${JSON.stringify(m.whoR)} "${m.who}"`);
      if (m.next && m.tx.b > m.next.t + 2 && m.tx.r > m.next.l) bad.push(`${id}: text runs under the "tap" marker tx=${JSON.stringify(m.tx)} next=${JSON.stringify(m.next)}`);
      if (m.ttl.r > m.skip.l && m.ttl.b > m.skip.t && m.ttl.t < m.skip.b) bad.push(`${id}: title overlaps SKIP ttl=${JSON.stringify(m.ttl)} skip=${JSON.stringify(m.skip)}`);
      if (m.small && m.small.r > m.skip.l) bad.push(`${id}: subtitle overlaps SKIP`);
      if (m.box.t < m.vh * 0.55) bad.push(`${id}: box is tall: top at ${m.box.t} of ${m.vh}`);
      const es = expectStill(r.sp, r.beat);
      if (m.still.length !== 1 || m.still[0] !== es) bad.push(`${id}: painting ${JSON.stringify(m.still)} expected ${es}`);
      // speakers
      const expName = who === 'me' ? r.name : who === 'boss' ? 'The Great Flosso' : who === 'lo2' ? 'Sir Stale' : who === 'foe' ? meta[r.sp].nemesisName : typeof who === 'number' ? meta[who].name : null;
      if (who === 'n') { if (m.whoShown) bad.push(`${id}: narrator shows a name tag`); } else if (m.who.trim() !== expName) bad.push(`${id}: name "${m.who}" expected "${expName}"`);
      if (!['me', 'n', 'boss', 'foe', 'lo2'].includes(who) && typeof who !== 'number') bad.push(`${id}: speaker ${who}`);
      if (who === 'boss' && !/w11-(boss|after)/.test(r.beat)) bad.push(`${id}: boss speaks in ${r.beat}`);
      const elite = r.beat === 'w11-elite', bossP = /boss|after/.test(r.beat);
      if (elite ? m.left : !m.left) bad.push(`${id}: left portrait ${m.left}`);
      if (!elite && m.left && !new RegExp(`art/(kaiju|face)-${r.sp}[.-]`).test(m.left)) bad.push(`${id}: left portrait is ${m.left}`);
      const expRight = who === 'lo2' ? 'art/boss-stale.webp' : typeof who === 'number' ? new RegExp(`art/(kaiju|face)-${who}[.-]`) : who === 'foe' && !elite ? /art\// : who === 'boss' && !bossP ? 'art/boss-flosso.webp' : null;
      if (expRight ? !(m.right && (typeof expRight === 'string' ? m.right === expRight : expRight.test(m.right))) : m.right) bad.push(`${id}: right portrait ${m.right} (speaker ${who})`);
      if (who === 'boss' && m.chip !== 'art/boss-flosso.webp') bad.push(`${id}: boss chip ${m.chip}`);
      if (who === 'foe' && !m.chip) bad.push(`${id}: foe has no chip`);
      if (who === 'me' && !new RegExp(`art/(kaiju|face)-${r.sp}[.-]`).test(m.chip ?? '')) bad.push(`${id}: my chip ${m.chip}`);
    });
  }
  console.log(`== ${W}: ${out.length} scenes, ${n} lines; text-line histogram ${JSON.stringify(hist)}; tallest box ${maxBox}px at ${maxBoxAt}`);
  console.log('images:', Object.keys(imgOk).length, 'failed:', Object.entries(imgOk).filter(([, v]) => v === 'FAILED').length);
  console.log(bad.length ? bad.join('\n') : 'no problems measured');
}
