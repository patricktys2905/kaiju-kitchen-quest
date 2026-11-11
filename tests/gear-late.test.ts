// Late-game gear: weapon and armour tiers 4 (item level 40) and 5 (75) for every kaiju, with gear skills and icons.
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { CLASSES } from '../src/sim/classes';
import { BASES, rollBase } from '../src/sim/items';
import { GEAR } from '../src/sim/gear';

const manifest = fs.readFileSync('public/art/manifest.json', 'utf8');
const rng = (s: number) => () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);

describe('late-game gear tiers', () => {
  it('every kaiju has a tier 4 and 5 weapon (with a gear skill) and armour, with art', () => {
    for (const c of CLASSES) for (const slot of ['weapon', 'armor'] as const) for (const [tier, lv] of [[4, 40], [5, 75]]) {
      const e = Object.entries(BASES).find(([, b]) => b.for === c.species && b.slot === slot && b.tier === tier);
      expect(e, `${c.name} ${slot} tier ${tier}`).toBeTruthy();
      const [k, b] = e!;
      expect(b.minLv).toBe(lv);
      expect(b.set).toBe(`sig${c.species}`);
      expect(manifest.includes(`"${b.icon}`) || manifest.includes(`/${b.icon}.`), `${k} icon`).toBe(true);
      if (slot === 'weapon') expect(GEAR[k], `${k} gear skill`).toBeTruthy();
      // a higher tier is stronger on its main line than the tier below
      const prev = Object.values(BASES).find(x => x.for === c.species && x.slot === slot && x.tier === tier - 1 && x.main[0].k === b.main[0].k)!;
      expect(b.main[0].v, `${k} beats tier ${tier - 1}`).toBeGreaterThan(prev.main[0].v);
    }
  });

  it('tiers 4 and 5 only drop from their item level on, and then turn up often', () => {
    const count = (ilvl: number, tier: number) => { const r = rng(7); let n = 0; for (let i = 0; i < 4000; i++) if (BASES[rollBase(ilvl, r)].tier === tier) n++; return n; };
    expect(count(39, 4)).toBe(0);
    expect(count(40, 4)).toBeGreaterThan(400);
    expect(count(74, 5)).toBe(0);
    expect(count(80, 5)).toBeGreaterThan(400);
  });
});
