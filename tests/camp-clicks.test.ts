// The camp has one click handler (src/ui/camp.ts onClick): it finds the tapped element with a selector list (CLICKABLE)
// and then branches on its data attributes. A branch whose attribute is missing from the list can never run: the button
// draws fine and does nothing. That is how the Challenges chillies (data-spicy) and SKIP TO BOSS (data-skip) were dead.
// camp.ts needs a browser, so this reads its source.
import fs from 'node:fs';
import { describe, expect, it } from 'vitest';

const src = fs.readFileSync(new URL('../src/ui/camp.ts', import.meta.url), 'utf8');
const listed = new Set([...(src.match(/const CLICKABLE = '([^']*)'/)?.[1] ?? '').matchAll(/\[data-([a-z]+)\]/g)].map(m => m[1]));
const handler = src.slice(src.indexOf('function onClick('), src.indexOf('// ---------- gacha'));

describe('camp click handler', () => {
  it('finds its selector list and its handler', () => {
    expect(listed.size).toBeGreaterThan(20);
    expect(handler.length).toBeGreaterThan(1000);
  });
  it('every attribute the handler branches on is in the selector list', () => {
    // `if (ds.x)`, `else if (ds.x)`, `(ds.a || ds.b) && ...`: the names read at the start of a branch
    const branches = [...handler.matchAll(/^\s*(?:else )?if \(([^{]*?)\)\s/gm)].flatMap(m => [...m[1].matchAll(/\bds\.([a-z]+)\b/g)].map(x => x[1]));
    const used = new Set(branches.filter(n => !['price', 'id', 'el'].includes(n))); // payload on a button that is found by another attribute
    expect(used.size).toBeGreaterThan(20);
    expect([...used].filter(n => !listed.has(n))).toEqual([]);
  });
  it('the two that were dead stay listed', () => {
    expect(listed.has('spicy')).toBe(true);
    expect(listed.has('skip')).toBe(true);
  });
});
