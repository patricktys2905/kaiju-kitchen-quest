// Skill trees: structure, the rules for spending points, the loadout, the respec, and every new skill working in play.
import { describe, expect, it } from 'vitest';
import { CLASSES } from '../src/sim/classes';
import { STAGES } from '../src/sim/stages';
import { MAX_SKILL, SKILLS, rankLv, skillsOf } from '../src/sim/skills';
import { MAX_LEVEL, canLevelSkill, derive, newProfile, type HeroProfile } from '../src/sim/stats';
import { MASTERY_BASE, MASTERY_ROW, ROW_LV, allActives, canLearn, loadoutOf, masteryRanks, nodeById, nodeLv, pointsIn, treeBonus, treeOf } from '../src/sim/tree';
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
      // a full path is 18 points + its mastery ranks (10, and 4 more per world past World 10): three of them plus the
      // skills outgrow a max-level kaiju, so you choose (the numbers: 'mastery ranks' below)
      expect(t.reduce((a, p) => a + p.nodes.reduce((b, n) => b + n.ranks, 0), 0)).toBe(3 * (18 + masteryRanks()));
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

/** Every point a kaiju can ever spend whose hero-level gate is open at `lv` (ignoring the order they must be bought in). */
function sinksAt(species: number, lv: number): number {
  let n = 0;
  treeOf(species).forEach(path => path.nodes.forEach((node, row) => { for (let r = 1; r <= node.ranks; r++) if (nodeLv(row, r) <= lv) n++; }));
  const sk = skillsOf(species);
  // skill ranks: the 3 originals + the passive (the first rank of the first skill is free), and ranks 2-5 of the 3 tree skills
  for (const s of [...sk.actives, sk.passive]) for (let r = 1; r <= MAX_SKILL; r++) if (rankLv(s.unlock, r) <= lv && !(s === sk.actives[0] && r === 1)) n++;
  for (const path of treeOf(species)) for (let r = 2; r <= MAX_SKILL; r++) if (rankLv(path.nodes[2].skill!.unlock, r) <= lv) n++;
  return n;
}
/** Buy anything that can be bought until nothing can (tree nodes in path order first, like the balance bot, then skill ranks). */
function buyGreedy(p: HeroProfile): void {
  const sk = skillsOf(p.species);
  for (let again = true; again;) {
    again = false;
    for (const path of treeOf(p.species)) for (const n of path.nodes) while (canLearn(p, n.id)) { p.skillPts--; p.tree = { ...(p.tree ?? {}), [n.id]: (p.tree?.[n.id] ?? 0) + 1 }; if (n.skill) p.skills[n.skill.id] = Math.max(1, p.skills[n.skill.id] ?? 0); again = true; }
    for (const s of [...allActives(p.species), sk.passive]) while (canLevelSkill(p, s.id)) { p.skills[s.id] = (p.skills[s.id] ?? 0) + 1; p.skillPts--; again = true; }
  }
}

describe('mastery ranks (skill points always have a use)', () => {
  it('the rank count follows the level cap: 10, and 4 more per world past World 10', () => {
    expect([100, 110, 111, 113, 114, 117, 119, 120, 130, 160].map(c => masteryRanks(c))).toEqual([10, 10, 11, 11, 12, 13, 13, 14, 18, 30]);
    expect(masteryRanks()).toBe(masteryRanks(MAX_LEVEL));
    for (const c of CLASSES) for (const path of treeOf(c.species)) expect(path.nodes[MASTERY_ROW].ranks).toBe(masteryRanks());
  });

  it('gates: the first 10 ranks as before (4 levels apart from Lv 34), the new ones through the levels of their world', () => {
    expect(Array.from({ length: MASTERY_BASE }, (_, i) => nodeLv(MASTERY_ROW, i + 1))).toEqual([34, 38, 42, 46, 50, 54, 58, 62, 66, 70]);
    expect([11, 12, 13, 14].map(r => nodeLv(MASTERY_ROW, r))).toEqual([111, 114, 117, 120]);
    expect([15, 16, 17, 18, 19].map(r => nodeLv(MASTERY_ROW, r))).toEqual([121, 124, 127, 130, 131]); // World 12 and on: only MAX_LEVEL changes
    for (let row = 0; row < MASTERY_ROW; row++) expect(nodeLv(row, 3)).toBe(ROW_LV[row] + 8); // other rows untouched
    // every rank of every node can be reached by the level cap
    for (const path of treeOf(10)) path.nodes.forEach((n, row) => expect(nodeLv(row, n.ranks)).toBeLessThanOrEqual(MAX_LEVEL));
    // in play: rank 11 will not take a point at Lv 110, and does at Lv 111; rank 12 waits for Lv 114
    const p = newProfile(10); p.level = 110; p.skillPts = 200;
    buyGreedy(p);
    const m = treeOf(10)[0].nodes[MASTERY_ROW];
    expect(p.tree?.[m.id]).toBe(10); expect(canLearn(p, m.id)).toBe(false);
    p.level = 111; expect(canLearn(p, m.id)).toBe(true);
    buyGreedy(p); expect(p.tree?.[m.id]).toBe(11); expect(canLearn(p, m.id)).toBe(false);
    p.level = 113; expect(canLearn(p, m.id)).toBe(false);
    p.level = MAX_LEVEL; buyGreedy(p); expect(p.tree?.[m.id]).toBe(masteryRanks());
  });

  it('a new rank is worth exactly what an old one is (no new kind of bonus)', () => {
    for (const pi of [0, 1, 2]) {
      const p = newProfile(10); p.level = MAX_LEVEL; p.skillPts = 200;
      learnPath(p, pi, 'all');
      const m = treeOf(10)[pi].nodes[MASTERY_ROW];
      const [k, per] = Object.entries(m.stat!)[0] as [keyof ReturnType<typeof treeBonus>['stat'], number];
      expect(p.tree?.[m.id]).toBe(masteryRanks());
      const full = treeBonus(p).stat[k]!;
      p.tree = { ...p.tree, [m.id]: MASTERY_BASE };
      expect(full - treeBonus(p).stat[k]!).toBeCloseTo(per * (masteryRanks() - MASTERY_BASE), 6);
    }
  });

  it('no kaiju ever holds a point it cannot spend: levelling 1..MAX_LEVEL and buying greedily leaves none', () => {
    const stuck: string[] = [];
    for (const c of CLASSES) {
      const p = newProfile(c.species); p.skillPts = 0;
      for (let lv = 1; lv <= MAX_LEVEL; lv++) {
        if (lv > 1) { p.level = lv; p.skillPts++; }
        buyGreedy(p);
        if (p.skillPts > 0) stuck.push(`${c.name} Lv ${lv}: ${p.skillPts}`);
      }
    }
    expect(stuck).toEqual([]);
  });

  it('there is always more open to buy than points earned, and a real choice at the cap', () => {
    for (const c of CLASSES) {
      for (let lv = 2; lv <= MAX_LEVEL; lv++) expect(sinksAt(c.species, lv), `${c.name} Lv ${lv}`).toBeGreaterThan(lv - 1);
      // "you choose": at the cap some ranks must stay unbought (at least as many as at the old Lv 110 cap, where it was 6)
      expect(sinksAt(c.species, MAX_LEVEL) - (MAX_LEVEL - 1)).toBeGreaterThanOrEqual(6);
      expect(sinksAt(c.species, MAX_LEVEL)).toBe(3 * (18 + masteryRanks()) + 19 + 12);
    }
  });

  it('a save from before the new ranks loads unchanged, and can then buy them', () => {
    const p = newProfile(4); p.level = 110; p.skillPts = 109;
    buyGreedy(p);
    const old = JSON.parse(JSON.stringify(p)) as HeroProfile; // what the previous release stored (mastery 10 / 10 everywhere)
    for (const path of treeOf(4)) expect(old.tree?.[path.nodes[MASTERY_ROW].id]).toBe(MASTERY_BASE);
    const before = derive(old), bonus = JSON.stringify(treeBonus(old));
    const loaded = JSON.parse(JSON.stringify(old)) as HeroProfile;
    expect(loaded.tree).toEqual(old.tree);
    expect(JSON.stringify(treeBonus(loaded))).toBe(bonus);
    expect(derive(loaded).atk).toBe(before.atk); expect(derive(loaded).maxHp).toBe(before.maxHp);
    loaded.level = 111; loaded.skillPts = 1;
    const m = treeOf(4)[0].nodes[MASTERY_ROW];
    expect(canLearn(loaded, m.id)).toBe(true);
    loaded.skillPts--; loaded.tree = { ...loaded.tree, [m.id]: 11 };
    expect(treeBonus(loaded).stat.atkPct! - JSON.parse(bonus).stat.atkPct).toBeCloseTo(0.01, 6);
  });

  it('the Recipe Scroll refunds the new ranks too', async () => {
    const { save, useScroll } = await import('../src/save');
    const p = newProfile(4); p.level = MAX_LEVEL; p.skillPts = MAX_LEVEL - 1;
    buyGreedy(p);
    expect(p.skillPts).toBe(0);
    expect(treeOf(4).reduce((a, path) => a + (p.tree?.[path.nodes[MASTERY_ROW].id] ?? 0), 0)).toBeGreaterThan(3 * MASTERY_BASE);
    save.heroes[4] = p; save.items.scroll = 1;
    expect(useScroll(4)).toBe(true);
    expect(p.skillPts).toBe(MAX_LEVEL - 1); expect(p.tree).toEqual({});
    buyGreedy(p); expect(p.skillPts).toBe(0); // and they can all be spent again
  });
});
