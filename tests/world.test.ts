import { describe, expect, it } from 'vitest';
import { Bot } from '../src/sim/bot';
import { CLASSES } from '../src/sim/classes';
import { BASES, rollItem } from '../src/sim/items';
import { clearCount, clearRewards, rollTier } from '../src/sim/loot';
import { MOBS } from '../src/sim/mobs';
import { SKILLS, skillsOf } from '../src/sim/skills';
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
    expect(STAGES.length).toBe(20);
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
    expect(e.maxHp).toBeGreaterThan(n.maxHp * 4);
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
