import { describe, expect, it } from 'vitest';
import { Bot } from '../src/sim/bot';
import { CLASSES } from '../src/sim/classes';
import { BASES, GRADE_MUL, fortChance, fortMul, itemLines, rollGrade, rollItem } from '../src/sim/items';
import { clearCount, clearRewards, rollTier } from '../src/sim/loot';
import { MOBS } from '../src/sim/mobs';
import { SKILLS, ULTS, applyBranch, branchesFor, skillsOf } from '../src/sim/skills';
import { STAGES } from '../src/sim/stages';
import { type HeroProfile, derive, gainXp, newProfile } from '../src/sim/stats';
import { type Input, NO_INPUT, type StageDef } from '../src/sim/types';
import { GRAVITY, World, rankOf } from '../src/sim/world';

const flat: StageDef = {
  id: 't', world: 1, num: 't', name: 't', bg: 'bg-far', mid: '', tile: 'tile-ground', platTint: 0xffffff, width: 2000, groundY: 400, lv: [1, 1], par: 60, rec: 1,
  platforms: [{ x: 300, y: 300, w: 200 }, { x: 560, y: 300, w: 120 }], ladders: [{ x: 600, top: 300, bottom: 400 }], mobs: [],
};

/** A hero profile at a level with every unlocked skill learned. */
function prof(species: number, level = 1): HeroProfile {
  const p = newProfile(species);
  p.level = level;
  for (const s of [...skillsOf(species).actives, skillsOf(species).passive]) if (level >= s.unlock) p.skills[s.id] = 1;
  return p;
}
const mk = (species = 0, level = 1, seed = 1, st = flat) => new World(st, derive(prof(species, level)), seed);

function run(w: World, inp: Partial<Input>, frames: number) {
  const evs = [];
  for (let i = 0; i < frames; i++) evs.push(...w.step({ ...NO_INPUT, ...inp }));
  return evs;
}

describe('hero movement', () => {
  it('runs, jumps onto a one-way platform and drops back through', () => {
    const w = mk();
    w.hero.x = 250;
    run(w, { right: true }, 5);
    expect(w.hero.x).toBeGreaterThan(250);
    run(w, { right: true, jump: true }, 30);
    run(w, {}, 60);
    expect(w.hero.y).toBe(300);
    run(w, { down: true, jump: true }, 1);
    run(w, {}, 60);
    expect(w.hero.y).toBe(400);
  });

  it('climbs a ladder up onto a platform', () => {
    const w = mk();
    w.hero.x = 600;
    run(w, { up: true }, 1);
    expect(w.hero.state).toBe('climb');
    run(w, { up: true }, 60);
    expect(w.hero.y).toBe(300);
    expect(w.hero.state).toBe('move');
  });

  it('every hero can jump 95px up (stage steps are ≤ 90px)', () => {
    for (const c of CLASSES) expect(c.jump * c.jump / (2 * GRAVITY), c.name).toBeGreaterThan(95);
  });
});

describe('stages', () => {
  it('every platform is reachable: within a jump of the ground, a ladder, or another platform', () => {
    const minJump = Math.min(...CLASSES.map(c => c.jump * c.jump / (2 * GRAVITY))) - 8;
    for (const st of STAGES) {
      const reach = new Set<number>();
      let grew = true;
      while (grew) {
        grew = false;
        st.platforms.forEach((p, i) => {
          if (reach.has(i)) return;
          const fromGround = st.groundY - p.y <= minJump;
          const byLadder = st.ladders.some(l => l.top === p.y && l.x >= p.x && l.x <= p.x + p.w);
          const fromPlat = [...reach].some(j => { const q = st.platforms[j]; return q.y - p.y <= minJump && q.y > p.y && q.x < p.x + p.w + 120 && p.x < q.x + q.w + 120; });
          if (fromGround || byLadder || fromPlat) { reach.add(i); grew = true; }
        });
      }
      expect(reach.size, st.id).toBe(st.platforms.length);
    }
  });

  it('every monster stands on the ground or on a platform, and the last stage is a boss', () => {
    for (const st of STAGES) for (const m of st.mobs) {
      if (m.y === undefined) continue;
      expect(st.platforms.some(p => p.y === m.y && m.x >= p.x && m.x <= p.x + p.w), `${st.id} ${m.kind}@${m.x}`).toBe(true);
    }
    for (const st of STAGES) {
      const n = Number(st.id.split('-')[1]);
      expect(!!st.boss, st.id).toBe(n === 10);
      if (n === 10) expect(st.mobs.some(m => MOBS[m.kind].brain === 'boss')).toBe(true);
      if (n === 5) expect(st.mobs.some(m => m.elite)).toBe(true);
    }
    expect(STAGES.length).toBe(40);
  });
});

describe('combat', () => {
  it('chains a 3-hit combo when attack is pressed in rhythm', () => {
    const w = mk();
    const steps: number[] = [];
    for (let i = 0; i < 90; i++) for (const e of w.step({ ...NO_INPUT, attack: i % 10 === 0 })) if (e.t === 'swing') steps.push(e.step);
    expect(steps.slice(0, 3)).toEqual([0, 1, 2]);
  });

  it('killing a monster gives XP and can drop a box that can be picked up', () => {
    let dropped = false;
    for (let seed = 1; seed < 40 && !dropped; seed++) {
      const w = mk(0, 1, seed);
      const m = w.spawnMob('bun', 200, 1);
      m.hp = 1;
      w.hero.x = 150;
      const evs = run(w, { attack: true }, 20);
      expect(evs.some(e => e.t === 'xp')).toBe(true);
      if (evs.some(e => e.t === 'drop')) {
        dropped = true;
        w.hero.x = w.boxes[0].x;
        run(w, {}, 60);
        expect(w.loot.length).toBe(1);
        expect(w.loot[0].ilvl).toBe(1);
      }
    }
    expect(dropped).toBe(true);
  });

  it('every skill of every hero fires at level 10 and goes on cooldown', () => {
    for (const c of CLASSES) {
      const keys = ['skill1', 'skill2', 'skill3'] as const;
      skillsOf(c.species).actives.forEach((sk, i) => {
        const w = mk(c.species, 10);
        w.spawnMob('bun', w.hero.x + 60, 1);
        const evs = run(w, { [keys[i]]: true }, 1);
        expect(evs.some(e => e.t === 'skill'), sk.name).toBe(true);
        expect(w.hero.cds[i]).toBeGreaterThan(0);
        if (sk.kind !== 'buff' && sk.kind !== 'mines' && sk.kind !== 'heal') {
          const all = [...evs, ...run(w, {}, 90)];
          expect(all.some(e => e.t === 'hit' && e.target === 'mob'), sk.name).toBe(true);
        }
      });
    }
  });

  it('locked skills do nothing', () => {
    const w = mk(0, 1);
    expect(run(w, { skill3: true }, 1).some(e => e.t === 'skill')).toBe(false);
  });

  it('monsters hurt the hero when standing still, more at higher monster level', () => {
    const dmg = (lv: number) => { const w = mk(0, 1, 3); w.spawnMob('bun', 220, lv); w.hero.x = 150; run(w, {}, 200); return w.run.dmgTaken; };
    expect(dmg(1)).toBeGreaterThan(0);
    expect(dmg(8)).toBeGreaterThan(dmg(1));
  });

  it('pepper grunts shoot from range and worms leap', () => {
    const w = mk(10, 5, 2);
    w.spawnMob('pepper', 400, 3);
    w.hero.x = 150;
    run(w, {}, 240);
    expect(w.run.hitsTaken).toBeGreaterThan(0);
    const w2 = mk(10, 5, 2);
    const worm = w2.spawnMob('worm', 300, 3);
    w2.hero.x = 150;
    let airborne = false;
    for (let i = 0; i < 200; i++) { w2.step(NO_INPUT); if (!worm.ground && worm.state === 'attack') airborne = true; }
    expect(airborne).toBe(true);
  });

  it('clearing every monster opens the exit; reaching it clears the stage', () => {
    const w = mk();
    const m = w.spawnMob('bun', 300, 1);
    m.hp = 1;
    w.hero.x = 260;
    const evs = run(w, { attack: true }, 30);
    run(w, {}, 60);
    expect(evs.some(e => e.t === 'portal') || w.portal).toBe(true);
    w.hero.x = w.exitX - 100;
    const evs2 = run(w, { right: true }, 120);
    expect(evs2.some(e => e.t === 'clear')).toBe(true);
    expect(rankOf(w.run, 60).rank).toMatch(/[SABCD]/);
  });
});

describe('boss', () => {
  it('the Burnt Toast King attacks, staggers and calls helpers', () => {
    const boss = STAGES.find(s => s.boss)!;
    const p = prof(10, 12);
    p.alloc.str = 33; // a levelled hero spends its stat points
    const w = new World(boss, derive(p), 5);
    w.hero.hp = w.hero.d.maxHp = 1e6;
    const king = w.boss!;
    king.hp = king.maxHp * 0.7; // start near the first summon threshold
    const bot = new Bot(w, { dodgeSkill: 0, reaction: 1, potionAt: 0 }, 3);
    const kinds = new Set<string>();
    let staggered = false, summoned = false;
    for (let i = 0; i < 60 * 120 && !(staggered && summoned && kinds.size >= 2); i++) {
      for (const e of w.step(bot.think())) {
        if (e.t === 'mobAttack') kinds.add(e.kind);
        if (e.t === 'stagger') staggered = true;
        if (e.t === 'summon') summoned = true;
      }
    }
    expect(kinds.size).toBeGreaterThanOrEqual(2);
    expect(staggered).toBe(true);
    expect(summoned).toBe(true);
  });
});

describe('progression', () => {
  it('levels give stat and skill points; stats raise the numbers', () => {
    const p = newProfile(0);
    const lv = gainXp(p, 2000);
    expect(lv).toBeGreaterThan(2);
    expect(p.statPts).toBe(lv * 3);
    expect(p.skillPts).toBe(lv);
    const before = derive(p);
    p.alloc.str += 5;
    expect(derive(p).atk).toBeGreaterThan(before.atk);
    p.alloc.vit += 5;
    expect(derive(p).maxHp).toBeGreaterThan(before.maxHp);
  });

  it('skills unlock with level; passives scale', () => {
    const p = prof(10, 1);
    expect(derive(p).skillLv.mines).toBe(0);
    const p2 = prof(10, 8);
    expect(derive(p2).skillLv.mines).toBe(1);
    const base = derive(p2).maxHp;
    p2.skills.thick = 3;
    expect(derive(p2).maxHp).toBeGreaterThan(base * 1.1);
  });

  it('gear adds stats, and skill-boost gear raises skill level', () => {
    const p = prof(0, 5);
    const it = rollItem(1, 3, 5, () => 0.1, ['seed']);
    p.equip[BASES[it.base].slot] = it;
    expect(derive(p).atk).toBeGreaterThanOrEqual(derive(prof(0, 5)).atk);
    p.equip.charm = { id: 2, base: 'cookie', rarity: 5, ilvl: 5, plus: 0, lines: [{ k: 'crit', v: 5 }], skill: { id: 'seed', n: 2 } };
    expect(derive(p).skillLv.seed).toBe(3);
  });

  it('better boxes roll rarer gear; higher drop level rolls better boxes', () => {
    let s = 7;
    const rand = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    const ids = Object.values(SKILLS).flatMap(x => x.actives.map(a => a.id));
    const avg = (tier: 1 | 5) => { let t = 0; for (let i = 0; i < 500; i++) t += rollItem(i, tier, 1, rand, ids).rarity; return t / 500; };
    expect(avg(5)).toBeGreaterThan(avg(1) + 2);
    const tavg = (lvl: number) => { let t = 0; for (let i = 0; i < 4000; i++) t += rollTier(lvl, rand); return t / 4000; };
    expect(tavg(3)).toBeGreaterThan(tavg(1) + 0.2);
  });

  it('clear boxes scale with stage level, rank and boss', () => {
    let s = 11;
    const rand = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    const avg = (lv: number, rank: 'S' | 'A' | 'D', boss = false) => { let tot = 0, n = 0; for (let i = 0; i < 1500; i++) for (const b of clearRewards(lv, rank, boss, false, rand)) { tot += b; n++; } return tot / n; };
    expect(avg(7, 'A')).toBeGreaterThan(avg(1, 'A') + 0.25);
    expect(avg(4, 'S')).toBeGreaterThan(avg(4, 'D') + 0.3);
    expect(avg(10, 'A', true)).toBeGreaterThan(avg(10, 'A'));
    expect(clearCount(10)).toBeGreaterThan(clearCount(2));
    expect(clearRewards(2, 'A', false, true, rand).length).toBe(clearCount(2) + 1); // first clear bonus
  });

  it('item lines scale with rarity and item level', () => {
    const one = () => 0.5;
    const lo = rollItem(1, 1, 1, () => 0.01, []), hi = rollItem(2, 5, 10, () => 0.99, []);
    expect(hi.rarity).toBeGreaterThan(lo.rarity);
    expect(hi.lines.length).toBeGreaterThan(lo.lines.length);
    void one;
  });
});

describe('quick bag, dodge, revive', () => {
  it('a Jam Jar heals, uses one up and starts the shared cooldown', () => {
    const w = new World(flat, derive(prof(0, 3)), 1, [{ id: 'jam', n: 2 }, { id: 'pepper', n: 1 }, null, null]);
    w.hero.hp = 10;
    const evs = run(w, { item1: true }, 1);
    expect(evs.some(e => e.t === 'use')).toBe(true);
    expect(w.hero.hp).toBeGreaterThan(10);
    expect(w.hero.bag[0]!.n).toBe(1);
    run(w, {}, 1);
    expect(run(w, { item2: true }, 1).some(e => e.t === 'use')).toBe(false); // cooldown
    run(w, {}, 200);
    run(w, { item2: true }, 1);
    expect(w.hero.boosts.atk).toBeTruthy();
  });

  it('double-tapping a direction dodge-rolls with brief invincibility', () => {
    const w = mk();
    w.hero.x = 500;
    run(w, { right: true }, 2); run(w, {}, 3);
    const evs = run(w, { right: true }, 1);
    expect(evs.some(e => e.t === 'dodge')).toBe(true);
    expect(w.hero.inv).toBeGreaterThan(0);
    const x0 = w.hero.x; run(w, { right: true }, 15);
    expect(w.hero.x - x0).toBeGreaterThan(90);
  });

  it('Second Helping revives once instead of being knocked out', () => {
    const w = new World(flat, derive(prof(0, 1)), 3, [], 1);
    w.spawnMob('egg', 200, 20);
    w.hero.x = 150; w.hero.hp = 1;
    const evs = run(w, {}, 600);
    expect(evs.some(e => e.t === 'revive')).toBe(true);
    expect(w.hero.revives).toBe(0);
  });
});

describe('world 2 monsters', () => {
  it('flyers hover above the ground and swoop down to hit', () => {
    const w = mk(0, 15, 4);
    const bat = w.spawnMob('icebat', 400, 13);
    w.hero.x = 250; w.hero.hp = w.hero.d.maxHp = 1e6;
    let minY = 1e9, maxY = 0;
    for (let i = 0; i < 600; i++) { w.step(NO_INPUT); minY = Math.min(minY, bat.y); maxY = Math.max(maxY, bat.y); }
    expect(minY).toBeLessThan(flat.groundY - 50);
    expect(w.run.hitsTaken).toBeGreaterThan(0);
    void maxY;
  });

  it('elites have much more HP and drop two boxes', () => {
    const w = mk(0, 10, 2);
    const e = w.spawnMob('egg', 300, 6, undefined, true), n = w.spawnMob('egg', 600, 6);
    expect(e.maxHp).toBeGreaterThan(n.maxHp * 3.5); // 4x (every elite also rolls a modifier)
    e.hp = 1; w.hero.x = 260;
    const evs = run(w, { attack: true }, 30);
    expect(evs.filter(x => x.t === 'drop').length).toBe(2);
  });

  it('the Freezer Golem rains icicles', () => {
    const st = STAGES.find(s => s.id === '2-10')!;
    const w = new World(st, derive(prof(10, 24)), 9);
    w.hero.hp = w.hero.d.maxHp = 1e6;
    let rain = false;
    for (let i = 0; i < 60 * 60 && !rain; i++) for (const e of w.step(NO_INPUT)) if (e.t === 'mobAttack' && e.kind === 'rain') rain = true;
    expect(rain).toBe(true);
  });
});

describe('grading and fortification', () => {
  it('grade and fortify level scale an item\'s stats', () => {
    const it = rollItem(1, 3, 10, () => 0.4, []);
    const base = itemLines({ ...it, grade: 1, plus: 0 })[0].v;
    expect(itemLines({ ...it, grade: 4, plus: 0 })[0].v).toBeGreaterThan(base * 1.3);
    expect(itemLines({ ...it, grade: 1, plus: 10 })[0].v).toBeGreaterThan(base * 1.5);
    expect(fortMul(15)).toBeCloseTo(2.1);
    expect(GRADE_MUL[0]).toBeLessThan(1);
  });

  it('fortify chances fall with level; golden re-grades never go down', () => {
    for (let p = 1; p < 15; p++) expect(fortChance(p)).toBeLessThanOrEqual(fortChance(p - 1));
    expect(fortChance(15)).toBe(0);
    let s = 3;
    const rand = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    for (let i = 0; i < 300; i++) expect(rollGrade(rand, 2, 3)).toBeGreaterThanOrEqual(3);
    const avg = (r: 1 | 5) => { let t = 0; for (let i = 0; i < 2000; i++) t += rollGrade(rand, r); return t / 2000; };
    expect(avg(5)).toBeGreaterThan(avg(1));
  });
});

describe('ultimates, branches, sets, named legendaries', () => {
  it('the ultimate needs Lv 15 and a full gauge, then fires and makes you invincible', () => {
    const w = mk(0, 20);
    w.spawnMob('bun', w.hero.x + 80, 1);
    expect(run(w, { ult: true }, 1).some(e => e.t === 'ult')).toBe(false); // gauge empty
    run(w, {}, 1);
    w.hero.ult = 100;
    const evs = run(w, { ult: true }, 1);
    expect(evs.some(e => e.t === 'ult')).toBe(true);
    expect(w.hero.inv).toBeGreaterThan(1);
    expect(Object.keys(ULTS).length).toBe(CLASSES.length);
  });

  it('every active skill has two branches that change it', () => {
    for (const c of CLASSES) for (const sk of skillsOf(c.species).actives) {
      const [a, b] = branchesFor(sk);
      expect(JSON.stringify(applyBranch(sk, 'a')), sk.name + ' ' + a.name).not.toBe(JSON.stringify(sk));
      expect(JSON.stringify(applyBranch(sk, 'b')), sk.name + ' ' + b.name).not.toBe(JSON.stringify(sk));
    }
  });

  it('a 2-piece set raises stats and the Phoenix Apron survives one knockout', () => {
    const p = prof(0, 10);
    const base = derive(p).atk;
    p.equip.weapon = { id: 1, base: 'spoon', rarity: 3, ilvl: 5, plus: 0, lines: [], set: 'champ' };
    p.equip.charm = { id: 2, base: 'cookie', rarity: 3, ilvl: 5, plus: 0, lines: [], set: 'champ' };
    expect(derive(p).atk).toBeGreaterThan(base);
    p.equip.armor = { id: 3, base: 'apron', rarity: 5, ilvl: 5, plus: 0, lines: [], unique: 'phoenix' };
    const w = new World(flat, derive(p), 2);
    w.spawnMob('egg', 200, 30);
    w.hero.x = 150; w.hero.hp = 1;
    const evs = run(w, {}, 300);
    expect(evs.some(e => e.t === 'revive')).toBe(true);
  });
});

describe('art', () => {
  it('every item, monster, consumable, stage background and rig has its art', async () => {
    // @ts-ignore node types aren't in this project's tsconfig (tests run in Node)
    const fs = await import('node:fs');
    const have = new Set<string>(JSON.parse(fs.readFileSync('public/art/manifest.json', 'utf8')));
    const { CONSUMABLES } = await import('../src/sim/consumables');
    const { RIGS } = await import('../src/render/rigs');
    const { allStills } = await import('../src/story/stories');
    const need = [
      ...Object.values(BASES).map(b => b.icon), ...Object.values(MOBS).map(m => m.art), ...Object.values(CONSUMABLES).map(c => c.icon),
      ...STAGES.flatMap(s => [s.bg, s.tile, ...(s.mid ? [s.mid] : [])]), ...CLASSES.map(c => `kaiju-${c.species}`),
      ...Object.entries(RIGS).flatMap(([sp, r]) => r.parts.map(p => `parts-${sp}-${p.piece}`)), 'map-world', 'map-oven', 'map-pantry', 'title-key', ...allStills(),
    ];
    expect(need.filter(k => !have.has(k))).toEqual([]);
  });
});

describe('kaiju-specific gear', () => {
  it('weapons always belong to one kaiju, every kaiju has 3 weapon tiers and an armor, charms are for everyone', async () => {
    const { OWNERS, canWear, rollBase } = await import('../src/sim/items');
    for (const c of CLASSES) {
      const ws = Object.values(BASES).filter(b => b.slot === 'weapon' && b.for === c.species);
      expect(ws.map(w => w.tier).sort(), c.name).toEqual([1, 2, 3]);
      expect(Object.values(BASES).some(b => b.slot === 'armor' && b.for === c.species), c.name).toBe(true);
    }
    expect(OWNERS.length).toBe(CLASSES.length);
    expect(Object.values(BASES).filter(b => b.slot === 'weapon').every(b => b.for !== undefined)).toBe(true);
    expect(Object.values(BASES).filter(b => b.slot === 'charm').every(b => b.for === undefined || b.set === `sig${b.for}`)).toBe(true);
    expect(Object.values(BASES).filter(b => b.slot === 'charm' && b.for === undefined).length).toBeGreaterThanOrEqual(5);
    // drops: only ~1 in 3 of kaiju gear is for the hero you're playing
    let s = 9;
    const rand = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    let mine = 0, kaijuGear = 0;
    for (let i = 0; i < 4000; i++) { const b = BASES[rollBase(20, rand, 0)]; if (b.for !== undefined) { kaijuGear++; if (b.for === 0) mine++; } }
    expect(mine / kaijuGear).toBeGreaterThan(0.2);
    expect(mine / kaijuGear).toBeLessThan(0.45);
    const it = rollItem(1, 3, 5, () => 0.01, ['seed']);
    void canWear; void it;
  });
});

describe('stories, recruits and kaiju quests', () => {
  it('every kaiju has a full story; twists never touch boss stages', async () => {
    const { STORIES } = await import('../src/story/stories');
    const { WORLDS } = await import('../src/sim/stages');
    for (const c of CLASSES) {
      const st = STORIES[c.species];
      expect(st, c.name).toBeTruthy();
      expect(st.beats.intro?.length, c.name).toBeGreaterThan(0);
      for (const w of WORLDS) for (const b of ['open', 'elite', 'boss', 'after']) expect(st.beats[`w${w.id}-${b}`]?.length, `${c.name} w${w.id}-${b}`).toBeGreaterThan(0);
      for (const id of Object.keys(st.variants)) {
        const s = STAGES.find(x => x.id === id);
        expect(s, `${c.name} ${id}`).toBeTruthy();
        expect(s!.boss, `${c.name} ${id}`).toBeFalsy();
      }
    }
  });

  it('boss stages are identical for every kaiju, and variants change normal stages', () => {
    const boss = STAGES.find(s => s.id === '1-10')!;
    const a = new World(boss, derive(prof(0, 10)), 1, [], 0, false, 'swarm');
    const b = new World(boss, derive(prof(0, 10)), 1);
    expect(a.mobs.length).toBe(b.mobs.length);
    expect(a.variant).toBeUndefined();
    const st = STAGES.find(s => s.id === '1-3')!;
    expect(new World(st, derive(prof(0, 3)), 1, [], 0, false, 'swarm').mobs.length).toBeGreaterThan(new World(st, derive(prof(0, 3)), 1).mobs.length);
    expect(new World(st, derive(prof(0, 3)), 1, [], 0, false, 'ambush').mobs.some(m => m.elite)).toBe(true);
  });

  it('every kaiju has a quest line and every locked kaiju has a recruit challenge', async () => {
    const { UNLOCKS, kaijuQuests } = await import('../src/story/kaijuQuests');
    for (const c of CLASSES) expect(kaijuQuests(c.species).length, c.name).toBe(8);
    const starters = [0, 10, 11, 4];
    for (const c of CLASSES) if (!starters.includes(c.species)) expect(UNLOCKS.some(u => u.species === c.species), c.name).toBe(true);
  });
});
