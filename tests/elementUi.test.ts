// The player-facing weakness line and the green tick (src/ui/elementUi.ts): pure text helpers over elements.ts.
import { describe, expect, it } from 'vitest';
import { ELEMENTS, ELEMENT_INFO, type StageElements, stageElements } from '../src/sim/elements';
import { BONUS_STAGES, STAGES } from '../src/sim/stages';
import { dailyStage } from '../src/sim/free';
import { elsHtml, tickHtml, weakCounts, weakHtml, weakText } from '../src/ui/elementUi';

const se = (weak: Partial<StageElements['weak']>, boss?: StageElements['boss']): StageElements => {
  const w = { HOT: 0, COLD: 0, STICKY: 0, CRUNCH: 0, ...weak };
  return { kinds: [], weak: w, order: ELEMENTS.map(el => ({ el, n: w[el] })).filter(x => x.n > 0).sort((a, b) => b.n - a.n), boss };
};
const I = (e: keyof typeof ELEMENT_INFO) => ELEMENT_INFO[e].icon;

describe('weakness line', () => {
  it('reads like the design note: counts biggest first, then the boss and what it shrugs off', () => {
    const s = se({ HOT: 4, STICKY: 3, CRUNCH: 2 }, { kind: 'golem', weakTo: 'HOT', resists: 'COLD', worldBoss: true });
    expect(weakCounts(s)).toBe(`${I('HOT')}×4 ${I('STICKY')}×3 ${I('CRUNCH')}×2`);
    expect(weakText(s)).toBe(`Weak: ${I('HOT')}×4 ${I('STICKY')}×3 ${I('CRUNCH')}×2 · Boss ${I('HOT')} (shrugs off ${I('COLD')})`);
  });
  it('copes with a stage that is only a boss, only monsters, or nothing', () => {
    expect(weakText(se({}, { kind: 'toast', weakTo: 'CRUNCH', resists: 'STICKY', worldBoss: true }))).toBe(`Weak: Boss ${I('CRUNCH')} (shrugs off ${I('STICKY')})`);
    expect(weakText(se({ COLD: 2 }))).toBe(`Weak: ${I('COLD')}×2`);
    expect(weakText(se({}))).toBe('');
    expect(weakHtml(se({}))).toBe('');
  });
  it('every story, bonus and daily stage gives a line whose HTML says the same as its text', () => {
    const strip = (h: string) => h.replace(/<[^>]+>/g, '');
    for (const st of [...STAGES, ...BONUS_STAGES, dailyStage(20000, 20)]) {
      const s = stageElements(st, 0), text = weakText(s);
      expect(text, st.id).toMatch(/^Weak: /);
      expect(strip(weakHtml(s)), st.id).toBe(text);
    }
  });
});

describe('the green tick', () => {
  const s = se({ HOT: 4, STICKY: 3 }, { kind: 'toast', weakTo: 'CRUNCH', resists: 'STICKY', worldBoss: true });
  it('marks a kit that hits the boss or the most common weakness, and nothing else', () => {
    expect(tickHtml(['CRUNCH'], s)).toContain('✓');
    expect(tickHtml(['HOT'], s)).toContain('✓');
    expect(tickHtml(['STICKY'], s)).toBe('');
    expect(tickHtml(['COLD'], s)).toBe('');
    expect(tickHtml([], s)).toBe('');
    expect(tickHtml(['HOT'], null)).toBe('');
  });
  it('a plain skill gets no icon', () => {
    expect(elsHtml([])).toBe('');
    expect(elsHtml(['HOT', 'STICKY'])).toContain(I('HOT'));
    expect(elsHtml(['HOT', 'STICKY'])).toContain(I('STICKY'));
  });
});
