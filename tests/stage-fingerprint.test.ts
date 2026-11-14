// Stage layouts are "seeded per stage, the same for everyone": the same in Node (tests, balance sweeps, docs/stage-facts.md)
// as in every browser, and for an online host and its guests. They once were not: genMaps shuffled with
// `sort(() => r() - 0.5)`, whose order AND number of RNG calls depend on the JavaScript engine, so all 121 stages differed
// between Node and Edge. This file pins a fingerprint of everything the generators lay out.
//
// A failure here means stage layouts MOVED. If that was not meant: find what changed. If it was meant: re-pin with
//   npx vite-node scripts/stage-fingerprint.ts --write
// then regenerate docs/stage-facts.md, re-check the story scenes against it, re-run the sweeps, and run the browser check
//   node scripts/stage-fingerprint-browser.mjs <dev-server-port>      (Node and the browser must be identical)
import { readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { fingerprints, fnv } from '../scripts/stage-fingerprint';
import { shuffle } from '../src/sim/shuffle';
import pinned from './stage-fingerprints.json';

const files = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? files(`${dir}/${e.name}`) : /\.ts$/.test(e.name) ? [`${dir}/${e.name}`] : []);

describe('stage fingerprints (engine-independent generation)', () => {
  it('all 121 stages, the boss rooms and the Daily / Endless samples are laid out exactly as pinned', () => {
    const now = fingerprints();
    expect(Object.keys(now).filter(k => /^\d+-\d+$/.test(k)).length).toBe(110);
    expect(Object.keys(now).filter(k => /^S-\d+$/.test(k)).length).toBe(11);
    expect(Object.keys(now).sort()).toEqual(Object.keys(pinned).sort());
    const moved = Object.keys(now).filter(k => now[k] !== (pinned as Record<string, string>)[k]).map(k => `${k}: pinned ${(pinned as Record<string, string>)[k]} | now ${now[k]}`);
    expect(moved, 'stage layouts moved: see the top of this file').toEqual([]);
  });

  it('the hash is plain integer maths (FNV-1a), the same everywhere', () => {
    expect(fnv('')).toBe('811c9dc5'); expect(fnv('a')).toBe('e40c292c'); expect(fnv('foobar')).toBe('bf9cf968');
  });

  it('shuffle is a Fisher-Yates with a fixed number of RNG calls (length - 1), whatever the engine', () => {
    for (const n of [0, 1, 2, 6, 9, 31]) {
      let calls = 0, s = 12345;
      const r = () => { calls++; s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; };
      const a = Array.from({ length: n }, (_, i) => i), out = shuffle(a, r);
      expect(out).toBe(a); expect(calls).toBe(Math.max(0, n - 1));
      expect([...out].sort((p, q) => p - q)).toEqual(Array.from({ length: n }, (_, i) => i));
    }
    // pinned orders (hand-checkable): the same seed always gives the same order
    const seeded = (seed: number) => { let s = seed; return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; }; };
    expect(shuffle(['terraces', 'towers', 'steps', 'islands', 'deck', 'valley'], seeded(11048))).toEqual(shuffle(['terraces', 'towers', 'steps', 'islands', 'deck', 'valley'], seeded(11048)));
    expect(shuffle([1, 2, 3, 4, 5, 6], () => 0)).toEqual([2, 3, 4, 5, 6, 1]);
    expect(shuffle([1, 2, 3, 4, 5, 6], () => 0.999999)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(shuffle([1, 2, 3], () => 1)).toEqual([1, 2, 3]); // a bad RNG returning 1 stays in range
  });

  it('nothing in src/ sorts with a random comparator or calls Math.random in the simulation', () => {
    for (const f of files('src')) {
      const src = readFileSync(f, 'utf8').replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, ''); // code only, no comments
      // a comparator that takes no arguments cannot compare: it is a "random sort" (engine-dependent order and RNG use)
      expect(/\.sort\(\s*\(\s*\)\s*=>/.test(src) || /\.sort\(\s*function\s*\(\s*\)/.test(src), `${f}: sort with a comparator that ignores its arguments`).toBe(false);
      // (free.ts dayKey(d = new Date()) is the one clock read: the caller's date picks the Daily Dungeon)
      if (f.startsWith('src/sim/')) expect(/Math\.random|Date\.now|new Date\(/.test(src.replace('dayKey(d = new Date())', '')), `${f}: the simulation must not read the clock or Math.random`).toBe(false);
    }
  });
});
