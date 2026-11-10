// Compact snapshots for online co-op. The host's World is the only real simulation; each guest keeps a World for the
// same stage purely for drawing and copies every snapshot into it. Arrays of rounded numbers keep messages small
// (the backup MQTT route is slow). Index tables are append-only: change them only with the app version.
import { MOBS } from '../sim/mobs';
import { SKILLS, ULTS } from '../sim/skills';
import type { BoxTier, MobKind } from '../sim/types';
import type { HeroState, Mob, World } from '../sim/world';

const HERO_STATES: HeroState[] = ['move', 'attack', 'air', 'skill', 'climb', 'hurt', 'down', 'dodge'];
const MOB_STATES: Mob['state'][] = ['walk', 'windup', 'attack', 'hurt', 'dead', 'stagger'];
const KINDS = Object.keys(MOBS) as MobKind[];
const HAZ = ['off', 'warn', 'on'] as const;
const RUN_KEYS = ['time', 'hitsTaken', 'dmgTaken', 'maxCombo', 'kills', 'crumbs', 'revived', 'stones', 'perfects', 'interrupts', 'styleSum', 'styleTime', 'stylePeak'] as const;
const r = Math.round;
const r1 = (v: number) => Math.round(v * 10) / 10;
const r2 = (v: number) => Math.round(v * 100) / 100;
const b = (v: boolean | number) => (v ? 1 : 0);

export interface Snapshot {
  w: number[];          // time, portal, cleared, failed, combo, style, slowmo, objTimer, holdout, objDone, runTime, crumbs
  h: (number | string)[][]; // heroes
  m: (number | string)[][]; // monsters
  s: (number | string)[][]; // shots
  bx: number[][];       // boxes
  pr: number[][];       // props [hp, cd>0]
  ck: number[][];       // cookers
  pl: number[];         // moving tray x positions (by platform index, others 0)
  hz: number[];         // hazard states
  z: (number | string)[][]; // skill zones
  pu: (number | string)[][]; // puddles
  mi: (number | string)[][]; // mines [id, x, y, gear-trap icon]
  npc: number[] | null;
  sc: number;           // scroll got
  ar: number[][];       // arenas [locked, done, wave]
  ch: number[] | null;  // chase [x, on, done]
  lo: number[][][];     // each player's loot [tier, ilvl]
  run: number[];        // RunStats values (RUN_KEYS order)
  bg?: number[][];      // each hero's quick-bag counts, then Second Helpings left
}

export function makeSnapshot(w: World): Snapshot {
  return {
    w: [r2(w.time), b(w.portal), b(w.cleared), b(w.failed), w.combo, r(w.style), r2(w.slowmo), r1(w.objTimer), r1(w.holdout), b(w.objDone), r1(w.run.time), w.run.crumbs],
    h: w.heroes.map(h => [r(h.x), r(h.y), r(h.vx), r(h.vy), h.face, HERO_STATES.indexOf(h.state), r2(h.t), h.step, b(h.ground), h.skill?.id ?? '', b(h.gliding), r2(h.inv), r(h.hp), h.d.maxHp, b(!!h.buff), r2(h.counter), r(h.ult), r2(h.revT), h.orbs ? h.orbs.n : 0, h.on ?? -9, r1(h.cds[0]), r1(h.cds[1]), r1(h.cds[2]), r1(h.cds[3] ?? 0), r(h.shield)]),
    m: w.mobs.map(m => [m.id, KINDS.indexOf(m.kind), r(m.x), r(m.y), r(m.vx), m.face, MOB_STATES.indexOf(m.state), r2(m.t), m.move, r(m.hp), m.maxHp, m.lv,
      b(m.elite) | b(m.under) << 1 | b(m.disguised) << 2 | b(m.enraged) << 3 | b(m.frozen > 0) << 4 | b(m.glued > 0) << 5 | b(m.burn > 0) << 6 | b(m.tired > 0) << 7 | b(m.weak > 0) << 8 | b(m.shellT > 0) << 9 | b(m.guardT > 0) << 10,
      m.mods.join(','), r(m.aimX), r(m.aimY), r2(m.flash), r1(m.hurtShown), r2(m.deadT), r2(m.armor), m.arena, m.bossPhase]),
    s: w.shots.map(s => [s.id, s.kind ?? '', r(s.x), r(s.y), r(s.vx), r(s.vy), s.r ?? 0, s.tx ?? -1, s.ty ?? -1, s.from === 'hero' ? 1 : 0, s.icon ?? '', s.t < 0 ? 1 : 0]),
    bx: w.boxes.map(x => [x.id, x.tier, r(x.x), r(x.y), b(x.ground), x.owner ?? 0]),
    pr: w.props.map(p => [p.hp, b(p.cd > 0)]),
    ck: w.cookers.map(c => [r(c.x), c.face, r2(c.fuse), r1(c.gone)]),
    pl: w.stage.platforms.map(p => (p.move ? r(p.x) : 0)),
    hz: w.hazards.map(z => HAZ.indexOf(z.state)),
    z: w.zones.map(z => [z.id, r(z.x), r(z.y), r(z.w), r1(z.t), z.kind]),
    pu: w.puddles.map(p => [r(p.x), r(p.y), r1(p.t), p.kind ?? '', p.w ?? 0]),
    mi: w.mines.map(x => [x.id, r(x.x), r(x.y), x.icon ?? '']),
    npc: w.npc ? [r(w.npc.x), r(w.npc.y), r(w.npc.hp), w.npc.maxHp, w.npc.face, r2(w.npc.hurt)] : null,
    sc: b(!!w.scroll?.got),
    ar: w.arenas.map(a => [b(a.locked), b(a.done), a.wave]),
    ch: w.chase ? [r(w.chase.x), b(w.chase.on), b(w.chase.done)] : null,
    lo: w.lootOf.map(l => l.map(x => [x.tier, x.ilvl])),
    run: RUN_KEYS.map(k => r1(w.run[k])),
    bg: w.heroes.map(h => [...h.bag.map(q => q?.n ?? 0), h.revives]),
  };
}

/** Copies a host snapshot into a guest's drawing-only World (same stage, same party). */
export function applySnapshot(w: World, s: Snapshot): void {
  const [time, portal, cleared, failed, combo, style, slowmo, objTimer, holdout, objDone, runTime, crumbs] = s.w;
  Object.assign(w, { time, portal: !!portal, cleared: !!cleared, failed: !!failed, combo, style, slowmo, objTimer, holdout, objDone: !!objDone });
  w.run.time = runTime; w.run.crumbs = crumbs;
  s.h.forEach((a, i) => {
    const h = w.heroes[i]; if (!h) return;
    const [x, y, vx, vy, face, st, t, step, ground, skill, gliding, inv, hp, , buff, counter, ult, revT, orbs, on] = a as number[];
    Object.assign(h, { x, y, vx, vy, face, state: HERO_STATES[st], t, step, ground: !!ground, gliding: !!gliding, inv, hp, counter, ult, revT, on: on === -9 ? null : on });
    const sid = (a[9] as string) || '';
    h.skill = sid ? [...(SKILLS[h.d.cls.species]?.actives ?? []), ULTS[h.d.cls.species]].find(k => k?.id === sid) ?? null : null;
    void skill;
    h.buff = buff ? (h.buff ?? { atk: 0, def: 0, speed: 0, armor: false, t: 1 }) : null;
    h.orbs = orbs ? (h.orbs ?? { t: 1, n: orbs, dmg: 0, cd: new Map() }) : null;
    if (h.orbs) h.orbs.n = orbs;
    h.cds = [Number(a[20]) || 0, Number(a[21]) || 0, Number(a[22]) || 0, Number(a[23]) || 0];
    h.shield = Number(a[24]) || 0;
  });
  // monsters: update by id, create newcomers, drop the gone
  const byId = new Map(w.mobs.map(m => [m.id, m]));
  const next: Mob[] = [];
  for (const a of s.m) {
    const [id, k, x, y, vx, face, st, t, move, hp, maxHp, lv, flags, mods, aimX, aimY, flash, hurtShown, deadT, armor, arena, bossPhase] = a as never as [number, number, number, number, number, 1 | -1, number, number, string, number, number, number, number, string, number, number, number, number, number, number, number, number];
    let m = byId.get(id);
    if (!m) {
      const before = w.mobs.length;
      m = w.spawnMob(KINDS[k], x, lv, y, !!(flags & 1));
      w.mobs.splice(before, 1); // spawnMob added it; it goes into \`next\` instead
      m.id = id;
    }
    Object.assign(m, { x, y, vx, face, state: MOB_STATES[st], t, move, hp, maxHp, lv, aimX, aimY, flash, hurtShown, deadT, armor, arena, bossPhase,
      elite: !!(flags & 1), under: !!(flags & 2), disguised: !!(flags & 4), enraged: !!(flags & 8), frozen: flags & 16 ? 1 : 0, glued: flags & 32 ? 1 : 0,
      burn: flags & 64 ? 1 : 0, tired: flags & 128 ? 1 : 0, weak: flags & 256 ? 1 : 0, shellT: flags & 512 ? 1 : 0, guardT: flags & 1024 ? 1 : 0,
      mods: mods ? (mods as string).split(',') : [] });
    next.push(m);
  }
  w.mobs = next;
  w.shots = s.s.map(a => { const [id, kind, x, y, vx, vy, rr, tx, ty, fromHero, icon, early] = a as never as [number, string, number, number, number, number, number, number, number, number, string, number];
    return { id, kind: kind || undefined, x, y, vx, vy, r: rr || undefined, tx: tx < 0 ? undefined : tx, ty: ty < 0 ? undefined : ty, from: fromHero ? 'hero' : 'mob', t: 0, dmg: 0, hit: new Set<number>(), kx: 0, ky: 0, pierce: false, icon: icon || undefined, ...(early ? { t: -1 } : {}) }; });
  w.boxes = s.bx.map(([id, tier, x, y, ground, owner]) => ({ id, tier: tier as BoxTier, x, y, ground: !!ground, owner, vy: 0, t: 1, ilvl: 1 }));
  s.pr.forEach(([hp, cd], i) => { const p = w.props[i]; if (p) { p.hp = hp; p.cd = cd ? 1 : 0; } });
  s.ck.forEach(([x, face, fuse, gone], i) => { const c = w.cookers[i]; if (c) Object.assign(c, { x, face, fuse, gone }); });
  s.pl.forEach((x, i) => { const p = w.stage.platforms[i]; if (p?.move && x) p.x = x; });
  s.hz.forEach((st, i) => { const z = w.hazards[i]; if (z) z.state = HAZ[st] ?? 'off'; });
  w.zones = s.z.map(a => { const [id, x, y, ww, t, kind] = a as never as [number, number, number, number, number, 'steam']; return { id, x, y, w: ww, t, kind, tick: 1, next: 1, dmg: 0 }; });
  w.puddles = s.pu.map(a => { const [x, y, t, kind, ww] = a as never as [number, number, number, string, number]; return { x, y, t, kind: (kind || undefined) as 'slow' | undefined, w: ww || undefined }; });
  w.mines = s.mi.map(([id, x, y, icon]) => ({ id: id as number, x: x as number, y: y as number, t: 1, dmg: 0, kx: 0, ky: 0, icon: (icon as string) || undefined }));
  if (w.npc && s.npc) { const [x, y, hp, maxHp, face, hurt] = s.npc; Object.assign(w.npc, { x, y, hp, maxHp, face, hurt }); }
  if (w.scroll) w.scroll.got = !!s.sc;
  s.ar.forEach(([locked, done, wave], i) => { const a = w.arenas[i]; if (a) Object.assign(a, { locked: !!locked, done: !!done, wave }); });
  if (w.chase && s.ch) { const [x, on, done] = s.ch; Object.assign(w.chase, { x, on: !!on, done: !!done }); }
  s.lo.forEach((l, i) => { if (w.lootOf[i]) w.lootOf[i] = l.map(([tier, ilvl]) => ({ tier: tier as BoxTier, ilvl })); });
  RUN_KEYS.forEach((k, i) => { w.run[k] = s.run[i] ?? 0; });
  s.bg?.forEach((a, i) => {
    const h = w.heroes[i]; if (!h) return;
    h.bag.forEach((q, k) => { if (q) q.n = a[k] ?? q.n; });
    h.revives = a[a.length - 1] ?? h.revives;
  });
}
