// Pure UI helpers: where a story painting stands (above the dialogue box), where the Wheel of Misfortune stands (on
// screen, clear of the boss bar and the buttons), and whether skill points still have anything to buy.
import { describe, expect, it } from 'vitest';
import { CLASSES } from '../src/sim/classes';
import { MAX_SKILL, skillsOf } from '../src/sim/skills';
import { MAX_LEVEL, canLevelSkill, newProfile, type HeroProfile } from '../src/sim/stats';
import { allActives, canLearn, treeOf } from '../src/sim/tree';
import { stillRect, wheelSafe, wheelSpot } from '../src/ui/place';
import { skillBadge, skillPointsLine, skillSpend } from '../src/ui/skillPoints';

const SCREENS: [number, number][] = [[844, 390], [667, 375], [932, 430], [740, 360], [1024, 768], [1280, 720], [390, 844]];

describe('story painting layout', () => {
  it('never runs under the dialogue box, keeps at least 93% of its height on screen, and fits the width', () => {
    for (const [w, h] of SCREENS) for (const box of [0.18, 0.21, 0.3, 0.4]) {
      const vmin = Math.min(w, h) / 100, sb = (box + 0.03) * Math.min(w, h);
      const [pw, ph, top] = stillRect(w, h, sb, vmin);
      expect(pw).toBeLessThanOrEqual(w + 0.01);
      expect(pw / ph).toBeCloseTo(16 / 9, 5);
      expect(top + ph).toBeLessThanOrEqual(h - sb + 1.5 * vmin + 0.01); // its bottom edge: tucked just behind the box's top edge
      expect(Math.max(0, -top)).toBeLessThanOrEqual(3 * vmin + 0.01); // only a strip of sky may leave the top
      if (ph > 0) expect((ph - Math.max(0, -top) - 1.5 * vmin) / ph).toBeGreaterThan(0.74);
    }
    const [, ph, top] = stillRect(844, 390, 82, 3.9); // a phone: nine tenths of the painting is in view above the box
    expect((Math.min(390 - 82, top + ph) - Math.max(0, top)) / ph).toBeGreaterThan(0.9);
  });
});

describe('Wheel of Misfortune placement', () => {
  it('is always inside the safe area, wherever the boss stands', () => {
    for (const [w, h] of SCREENS.filter(([w, h]) => w > h)) {
      const [l, t, r, b] = wheelSafe(w, h), v = Math.min(w, h) / 100;
      expect(t).toBeGreaterThan(16 * v + 8 * v); // its top edge is below the boss bar (which ends at 16vmin)
      expect(l).toBeLessThan(r);
      for (let bx = -200; bx <= w + 200; bx += 37) for (let by = -150; by <= h + 100; by += 29) for (const side of [1, -1] as const) {
        const s = wheelSpot(bx, by, 70, side, w, h);
        expect(s.x).toBeGreaterThanOrEqual(l); expect(s.x).toBeLessThanOrEqual(r);
        expect(s.y).toBeGreaterThanOrEqual(t); expect(s.y).toBeLessThanOrEqual(b);
      }
    }
  });
  it('stands beside the boss on the asked side when there is room, the other side when there is not, and points when far', () => {
    const near = wheelSpot(400, 130, 60, 1, 844, 390);
    expect(near.x).toBeGreaterThan(460); expect(near.far).toBe(false);
    expect(wheelSpot(400, 130, 60, -1, 844, 390).x).toBeLessThan(340);
    expect(wheelSpot(640, 130, 60, 1, 844, 390).x).toBeLessThan(580); // no room on the right (buttons): it goes to his left
    const high = wheelSpot(400, -40, 60, 1, 844, 390); // on the top ledge, head above the boss bar: held below the bar, with a pointer
    expect(high.y).toBe(wheelSafe(844, 390)[1]); expect(high.far).toBe(true);
  });
});

/** Spend every point that can be spent, the way a player would. */
function spendAll(p: HeroProfile): void {
  for (let guard = 0; guard < 2000; guard++) {
    const node = treeOf(p.species).flatMap(t => t.nodes).find(n => canLearn(p, n.id));
    if (node) { p.skillPts--; p.tree = { ...(p.tree ?? {}), [node.id]: (p.tree?.[node.id] ?? 0) + 1 }; if (node.skill) p.skills[node.skill.id] = Math.max(1, p.skills[node.skill.id] ?? 0); continue; }
    const sk = [...allActives(p.species), skillsOf(p.species).passive].find(s => canLevelSkill(p, s.id));
    if (!sk) return;
    p.skillPts--; p.skills[sk.id] = (p.skills[sk.id] ?? 0) + 1;
  }
}

describe('skill points with nothing left to buy', () => {
  it('a fresh kaiju with a point has something to buy: badge and "to spend"', () => {
    const p = newProfile(0); p.level = 5; p.skillPts = 2;
    expect(skillSpend(p)).toBe('now'); expect(skillBadge(p)).toBe(2); expect(skillPointsLine(p)).toEqual(['2 points to spend', true]);
    p.skillPts = 0;
    expect(skillBadge(p)).toBe(0); expect(skillPointsLine(p)).toEqual(['0 points to spend', false]);
  });
  it('at the level cap, once everything is bought, spare points show calmly and the badge goes (every kaiju)', () => {
    for (const c of CLASSES) {
      const p = newProfile(c.species); p.level = MAX_LEVEL; p.skillPts = 2000;
      spendAll(p);
      expect(p.skillPts).toBeGreaterThan(0);
      expect([...allActives(p.species), skillsOf(p.species).passive].every(s => (p.skills[s.id] ?? 0) >= MAX_SKILL)).toBe(true);
      expect(skillSpend(p)).toBe('done'); expect(skillBadge(p)).toBe(0);
      p.skillPts = 17;
      expect(skillPointsLine(p)).toEqual(['Everything learned! 17 spare points', false]);
      p.skillPts = 1;
      expect(skillPointsLine(p)[0]).toBe('Everything learned! 1 spare point');
    }
  });
  it('points that cannot be spent YET (the next ranks need a higher level) are "saved", with no badge', () => {
    const p = newProfile(0); p.level = 3; p.skillPts = 500;
    spendAll(p);
    expect(skillSpend(p)).toBe('later'); expect(skillBadge(p)).toBe(0);
    expect(skillPointsLine(p)[0]).toMatch(/saved/);
    p.level = MAX_LEVEL; // levelling up opens more: the badge is back
    expect(skillSpend(p)).toBe('now'); expect(skillBadge(p)).toBe(p.skillPts);
  });
});
