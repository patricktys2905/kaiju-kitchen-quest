// Skill trees: structure, the rules for spending points, the loadout, the respec, and every new skill working in play.
import { describe, expect, it } from 'vitest';
import { CLASSES } from '../src/sim/classes';
import { SKILLS } from '../src/sim/skills';
import { STAGES } from '../src/sim/stages';
import { derive, newProfile, type HeroProfile } from '../src/sim/stats';
import { allActives, canLearn, loadoutOf, nodeById, pointsIn, treeOf } from '../src/sim/tree';
import { NO_INPUT } from '../src/sim/types';
import { World } from '../src/sim/world';

/** Spend points like a player would: walk down one path, row by row. */
function learnPath(p: HeroProfile, pi: number, upTo: 'skill' | 'cap' | 'all'): void {
  const path = treeOf(p.species)[pi];
  for (const n of path.nodes) {
    while (canLearn(p, n.id)) { p.skillPts--; p.tree = { ...(p.tree ?? {}), [n.id]: (p.tree?.[n.id] ?? 0) + 1 }; if (n.skill) p.skills[n.skill.id] = Math.max(1, p.skills[n.skill.id] ?? 0); }
    if (n.kind === upTo) return;
  }
}

describe('skill trees', () => {
  it('every kaiju has 3 paths of 7 rows, with a new skill, an upgrade and a capstone each', () => {
    for (const c of CLASSES) {
      const t = treeOf(c.species);
      expect(t.length, c.name).toBe(3);
      for (const path of t) {
        expect(path.nodes.map(n => n.kind)).toEqual(['stat', 'stat', 'skill', 'stat', 'mod', 'cap', 'mastery']);
        const sk = path.nodes[2].skill!;
        expect(sk.kind && sk.cd > 0 && sk.dur > 0, `${c.name} ${sk.id}`).toBeTruthy();
        expect(SKILLS[c.species].actives.some(a => a.id === path.nodes[4].mod!.skill), `${c.name} ${path.name} upgrade target`).toBe(true);
      }
      expect(new Set(allActives(c.species).map(a => a.id)).size).toBe(6);
      // a full path is 28 points: three of them plus the skills outgrow a Lv 110 kaiju, so you choose
      expect(t.reduce((a, p) => a + p.nodes.reduce((b, n) => b + n.ranks, 0), 0)).toBe(84);
    }
    const ids = CLASSES.flatMap(c => allActives(c.species).map(a => a.id));
    expect(new Set(ids).size).toBe(ids.length); // skill ids are unique across all kaiju
  });

  it('points gate the rows: in order, and enough points in the path', () => {
    const p = newProfile(10); p.level = 50; p.skillPts = 50;
    const path = treeOf(10)[0];
    expect(canLearn(p, path.nodes[2].id)).toBe(false); // the new skill needs 5 points in the path first
    expect(canLearn(p, path.nodes[1].id)).toBe(false); // row 2 needs row 1 and 2 points
    learnPath(p, 0, 'skill');
    expect(pointsIn(p, path)).toBeGreaterThanOrEqual(5);
    expect(p.tree?.[path.nodes[2].id]).toBe(1);
    expect(canLearn(p, path.nodes[5].id)).toBe(false); // capstone needs 15
    learnPath(p, 0, 'cap');
    expect(p.tree?.[path.nodes[5].id]).toBe(1);
    const none = newProfile(10); none.skillPts = 0;
    expect(canLearn(none, path.nodes[0].id)).toBe(false);
  });

  it('a learned tree skill can go on a button; an unlearned one cannot', () => {
    const p = newProfile(0); p.level = 30; p.skillPts = 30;
    const sk = treeOf(0)[2].nodes[2].skill!;
    p.loadout = [sk.id];
    expect(loadoutOf(p).map(s => s.id)).not.toContain(sk.id);
    learnPath(p, 2, 'skill');
    expect(loadoutOf(p)[0].id).toBe(sk.id);
    expect(loadoutOf(p).length).toBe(3);
    expect(derive(p).actives[0].id).toBe(sk.id);
  });

  it('tree stats and upgrades reach the kaiju', () => {
    const p = newProfile(10); p.level = 60; p.skillPts = 80;
    const before = derive(p);
    learnPath(p, 0, 'all'); learnPath(p, 1, 'all');
    const after = derive(p);
    expect(after.atk).toBeGreaterThan(before.atk);
    expect(after.maxHp).toBeGreaterThan(before.maxHp);
    const cap = treeOf(10)[0].nodes[5];
    expect(after.mods[cap.mod!.skill]?.echo).toBe(true);
  });

  it('every new skill works in play: it casts, and damaging ones hit', () => {
    const st = STAGES.find(s => s.id === '1-1')!;
    const broken: string[] = [];
    for (const c of CLASSES) for (let pi = 0; pi < 3; pi++) {
      const p = newProfile(c.species); p.level = 40; p.skillPts = 40;
      learnPath(p, pi, 'skill');
      const sk = treeOf(c.species)[pi].nodes[2].skill!;
      p.loadout = [sk.id];
      const w = new World({ ...st, mobs: [], arenas: [], hazards: [], chase: undefined, props: [], cookers: [], objective: undefined }, derive(p), 3);
      w.hero.x = 400; w.hero.face = 1;
      const mobs = [w.spawnMob('egg', 470, 20), w.spawnMob('egg', 560, 20), w.spawnMob('egg', 330, 20)];
      for (const m of mobs) m.hp = m.maxHp = 1e6;
      let cast = false;
      for (let i = 0; i < 4 && !cast; i++) for (const e of w.step({ ...NO_INPUT, skill1: true })) if (e.t === 'skill') cast = true;
      for (let i = 0; i < 150; i++) w.step(NO_INPUT);
      const hit = mobs.some(m => m.hp < 1e6);
      if (!cast) broken.push(`${c.name} ${sk.name}: did not cast`);
      else if (sk.dmg > 0 && !hit) broken.push(`${c.name} ${sk.name} (${sk.kind}): never hit`);
    }
    expect(broken).toEqual([]);
  });

  it('a Recipe Scroll respec refunds exactly the points spent', async () => {
    const { save, useScroll } = await import('../src/save');
    const p = newProfile(4); p.level = 40; p.skillPts = 39;
    learnPath(p, 0, 'cap'); learnPath(p, 1, 'skill');
    p.skills[treeOf(4)[0].nodes[2].skill!.id] = 3; p.skillPts -= 2; // levelled the new skill twice
    const spent = 39 - p.skillPts;
    save.heroes[4] = p; save.items.scroll = 1;
    expect(useScroll(4)).toBe(true);
    expect(p.skillPts).toBe(39); expect(p.tree).toEqual({}); expect(spent).toBeGreaterThan(15);
    void nodeById;
  });
});
