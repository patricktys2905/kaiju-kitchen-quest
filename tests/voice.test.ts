// Story text should sound like cartoon characters talking (docs/VOICE.md), not machine-written prose.
import { describe, expect, it } from 'vitest';
import { CLASSES } from '../src/sim/classes';
import { TAUNTS } from '../src/story/banter';
import { QUIPS } from '../src/story/more';
import { STORIES } from '../src/story/stories';

const BANNED = /\b(indeed|truly|quietly|perhaps|merely|whilst|journey|embrace|testament)\b/i;
function allLines(): { where: string; text: string }[] {
  const out: { where: string; text: string }[] = [];
  for (const c of CLASSES) {
    const s = STORIES[c.species];
    out.push({ where: `${c.name} tagline`, text: s.tagline });
    for (const [beat, lines] of Object.entries(s.beats)) for (const [, text] of lines) out.push({ where: `${c.name} ${beat}`, text });
    for (const [kind, lines] of Object.entries(QUIPS[c.species] ?? {})) for (const text of lines) out.push({ where: `${c.name} quip ${kind}`, text });
  }
  for (const [kind, lines] of Object.entries(TAUNTS)) for (const text of lines ?? []) out.push({ where: `taunt ${kind}`, text });
  return out;
}

describe('cartoon voice', () => {
  it('no em dashes, semicolons or stiff words anywhere in the story text', () => {
    const bad = allLines().filter(l => /[—;]/.test(l.text) || BANNED.test(l.text)).map(l => `${l.where}: ${l.text}`);
    expect(bad).toEqual([]);
  });
  it('scenes go easy on the "..." pauses (two at most)', () => {
    const heavy: string[] = [];
    for (const c of CLASSES) for (const [beat, lines] of Object.entries(STORIES[c.species].beats)) {
      const n = lines.reduce((a, [, t]) => a + (t.match(/\.\.\./g)?.length ?? 0), 0);
      if (n > 2) heavy.push(`${c.name} ${beat} (${n})`);
    }
    expect(heavy).toEqual([]);
  });
  it('nobody opens a line by announcing the stage name like a signpost ("Crumb Trail. Crumbs everywhere.")', async () => {
    const { STAGES } = await import('../src/sim/stages');
    const names = [...new Set(STAGES.map(s => s.name))];
    const bad = allLines().filter(l => names.some(n => l.text.startsWith(`${n}.`))).map(l => `${l.where}: ${l.text}`);
    expect(bad).toEqual([]);
  });
  it('no kaiju says the same long line twice (no copy-paste scenes)', () => {
    const dup: string[] = [];
    for (const c of CLASSES) {
      const seen = new Set<string>();
      for (const [beat, lines] of Object.entries(STORIES[c.species].beats)) for (const [, t] of lines) {
        if (t.length < 30) continue;
        if (seen.has(t)) dup.push(`${c.name} ${beat}: ${t}`); seen.add(t);
      }
    }
    expect(dup).toEqual([]);
  });
  it('every story still ends World 4 on the Sink cliffhanger, with the Mold Crown speaking', () => {
    for (const c of CLASSES) {
      const end = STORIES[c.species].beats['w4-after'];
      expect(end.some(([who]) => who === 'mold'), c.name).toBe(true);
      expect(end[end.length - 1], c.name).toEqual(['n', 'To be continued in World 5: The Sink.']);
    }
  });
});
