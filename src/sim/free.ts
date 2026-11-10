// Free mode: play any kaiju outside the story.
//  - DAILY DUNGEON: one generated stage per day (same layout for everyone that day), at your level. Bonus box once a day.
//  - ENDLESS PANTRY: arena floors one after another, harder each floor; pick a perk after every floor; a boss every 10th.
//  - BOSS RUSH: every world boss you've beaten, back to back, health carrying over. Best time per kaiju.
// Monsters scale to the hero's level (StageDef.power), so free mode never touches story progress.
import { MOBS } from './mobs';
import { WORLDS, genStage } from './stages';
import type { Derived } from './stats';
import type { BoxTier, MobKind, MobSpawn, StageDef } from './types';

export type FreeMode = 'daily' | 'endless' | 'rush';

/** Monster strength for a level (the story worlds' curve, smoothly in between). */
export function powerFor(lv: number): number {
  const pts = WORLDS.map(w => [w.baseLv, w.power] as const);
  if (lv <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) if (lv <= pts[i][0]) { const [a, pa] = pts[i - 1], [b, pb] = pts[i]; return pa + (pb - pa) * (lv - a) / (b - a); }
  return pts[pts.length - 1][1];
}

/** Today's date as a seed (local day), e.g. 20261110. */
export function dayKey(d = new Date()): number { return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate(); }

/** The Daily Dungeon: a world theme and stage shape picked by the date, monsters at your level. */
export function dailyStage(day: number, heroLv: number): StageDef {
  const w = WORLDS[day % WORLDS.length];
  const n = [2, 3, 6, 7, 8, 9][Math.floor(day / 7) % 6];
  const lv = Math.max(1, heroLv - 1);
  const st = genStage(w, n, { seed: day * 7 + 3, lv, id: `D-${day}`, name: `Daily: ${w.names[n - 1]}` });
  return { ...st, num: 'DAILY', power: powerFor(lv), props: (st.props ?? []).map(p => ({ ...p, key: false })) };
}

/** Endless Pantry floor: one arena room (2-3 waves) from a world that changes every 3 floors; every 10th floor a boss. */
export function endlessFloor(floor: number, heroLv: number, seed: number): StageDef {
  const w = WORLDS[Math.floor((floor - 1) / 3) % WORLDS.length];
  const lv = Math.max(1, heroLv - 2 + Math.floor(floor * 0.8));
  const power = powerFor(lv) * (1 + 0.02 * floor); // deeper floors hit harder than their level alone
  const id = `E-${floor}`, name = `Endless Pantry: Floor ${floor}`;
  if (floor % 10 === 0) { const st = genStage(w, 10, { lv: lv - 2, id, name }); return { ...st, num: `F${floor}`, power, mobs: st.mobs.map(m => ({ ...m, lv })) }; }
  let s = (seed + floor * 7919) >>> 0 || 1;
  const r = () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; };
  const kinds = w.pool.map(([, k]) => k).filter(k => MOBS[k].brain !== 'turret');
  const pick = (): MobKind => kinds[Math.floor(r() * kinds.length)];
  const waves: MobSpawn[][] = [];
  const nWaves = floor < 4 ? 2 : 3;
  for (let i = 0; i < nWaves; i++) {
    const n = 3 + Math.min(4, Math.floor(floor / 4)) + i;
    waves.push(Array.from({ length: n }, (_, j) => ({ kind: pick(), lv, x: 260 + Math.round(((j + 0.5) / n) * 900 + (r() - 0.5) * 60) })));
  }
  if (floor % 5 === 0) waves[waves.length - 1].push({ kind: w.elite, lv: lv + 1, x: 900, elite: true });
  return {
    id, world: w.id, num: `F${floor}`, name, bg: w.bg, mid: w.mid, tile: w.tile, platTint: w.platTint, width: 1500, groundY: 470,
    lv: [lv, lv + 1], par: 60 + nWaves * 15, rec: lv, power,
    platforms: [{ x: 300, y: 382, w: 240 }, { x: 960, y: 382, w: 240 }], ladders: [], mobs: [],
    arenas: [{ x0: 60, x1: 1440, waves }],
  };
}

/** Boss Rush bosses are this strong compared with the story (tuned with scripts/free-balance.ts). */
export const RUSH_POWER = 0.8;
/** Boss Rush: the bosses of every world this kaiju has beaten, in order, at its level. */
export function rushStages(beaten: number[], heroLv: number): StageDef[] {
  return WORLDS.filter(w => beaten.includes(w.id)).map((w, i) => {
    const lv = heroLv + 1;
    const st = genStage(w, 10, { lv: lv - 2, id: `R-${w.id}`, name: `Boss Rush ${i + 1}: ${MOBS[w.boss].name}` });
    // a little gentler than the story fight: these come back to back with only half your health back in between
    return { ...st, num: `RUSH ${i + 1}`, power: powerFor(lv) * RUSH_POWER, mobs: st.mobs.map(m => ({ ...m, lv })) };
  });
}

// ---------- Endless perks ----------
export interface Perk { id: string; name: string; icon: string; text: string }
export const PERKS: Perk[] = [
  { id: 'atk', name: 'Hot Sauce', icon: '🌶', text: '+12% attack' },
  { id: 'hp', name: 'Second Helping', icon: '🍲', text: '+15% max HP' },
  { id: 'heal', name: 'Picnic Break', icon: '🧺', text: 'Heal 60% of your HP now' },
  { id: 'crit', name: 'Lucky Fork', icon: '🍴', text: '+8% crit chance' },
  { id: 'cdr', name: 'Egg Timer', icon: '⏲', text: '-10% skill cooldowns' },
  { id: 'speed', name: 'Espresso', icon: '☕', text: '+8% move speed' },
  { id: 'gear', name: 'Sharpened Edge', icon: '🗡', text: '+35% gear skill damage' },
  { id: 'leech', name: 'Snack Attack', icon: '🍪', text: 'Kills heal 2% max HP' },
];
/** Three different perks to choose from (seeded per floor). */
export function perkChoices(floor: number, seed: number): Perk[] {
  let s = (seed * 31 + floor * 101) >>> 0 || 1;
  const pool = [...PERKS];
  const out: Perk[] = [];
  while (out.length < 3) { s = (s * 16807) % 2147483647; out.push(pool.splice(s % pool.length, 1)[0]); }
  return out;
}
/** Stats with the run's perks on top (heal is instant, so it isn't here). */
export function withPerks(d: Derived, perks: string[]): Derived {
  const n = (id: string) => perks.filter(p => p === id).length;
  if (!perks.length) return d;
  return {
    ...d,
    atk: Math.round(d.atk * (1 + 0.12 * n('atk'))),
    maxHp: Math.round(d.maxHp * (1 + 0.15 * n('hp'))),
    crit: Math.min(85, d.crit + 8 * n('crit')),
    cdr: Math.min(0.6, d.cdr + 0.1 * n('cdr')),
    speed: d.speed * (1 + 0.08 * n('speed')),
    lifeOnKill: d.lifeOnKill + 0.02 * n('leech'),
    gear: d.gear && { ...d.gear, power: d.gear.power * (1 + 0.35 * n('gear')) },
  };
}

// ---------- rewards ----------
/** Endless: a box every floor cleared (better every 5th), so a deeper run is always worth it. */
export function endlessReward(floor: number): BoxTier { return (floor % 10 === 0 ? 5 : floor % 5 === 0 ? 4 : floor >= 15 ? 3 : 2) as BoxTier; }
