// Story portraits change expression with the line.
import { describe, expect, it } from 'vitest';
import { moodOf } from '../src/story/mood';
import { STORIES } from '../src/story/stories';

describe('story moods', () => {
  it('reads obvious lines right', () => {
    expect(moodOf('Yay! We did it!')).toBe('happy');
    expect(moodOf('WHAT?! The Chef is gone?!')).toBe('shocked');
    expect(moodOf('*sniff* I miss my moon.')).toBe('sad');
    expect(moodOf('Hmph! Me PUNCH you! POW!')).toBe('angry');
    expect(moodOf('Grab the scroll at the far end.')).toBe('neutral');
    expect(moodOf("Don't worry, I've got this!")).toBe('happy');
  });
  it('every kaiju gets a mix of expressions across its story', () => {
    for (const [sp, s] of Object.entries(STORIES)) {
      const seen = new Set(Object.values(s.beats).flat().filter(([w]) => w === 'me').map(([, t]) => moodOf(t)));
      expect(seen.size, `kaiju ${sp}`).toBeGreaterThanOrEqual(4);
    }
  });
});
