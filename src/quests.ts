// Daily quests (3 a day, picked by date) and tiered achievements. Progress comes from track(); rewards are claimed in camp.
import { CLASSES } from './sim/classes';
import type { ConsumableId } from './sim/consumables';
import type { BoxTier } from './sim/types';
import { lastClearSkipped, persist, save, today } from './save';
import { BASES, rollItem } from './sim/items';
import { S_RANK_KEY, UNLOCKS, kaijuQuests } from './story/kaijuQuests';

export type StatKey = 'kills' | 'bossKills' | 'eliteKills' | 'clears' | 'rankA' | 'rankS' | 'boxes' | 'fortifies' | 'dodges' | 'potions' | 'ults'
  | 'legendaries' | 'maxPlus' | 'crumbs' | 'heroClear' | 'perfects' | 'interrupts' | 'spicy';

export interface Reward { crumbs?: number; items?: Partial<Record<ConsumableId, number>>; box?: BoxTier }

interface QuestDef { id: string; stat: StatKey; goal: number; text: string; reward: Reward; hero?: boolean }
const QUEST_POOL: QuestDef[] = [
  { id: 'kill', stat: 'kills', goal: 60, text: 'Defeat 60 monsters', reward: { crumbs: 150, items: { fstone: 2 } } },
  { id: 'clear', stat: 'clears', goal: 3, text: 'Clear 3 stages', reward: { crumbs: 120, box: 2 } },
  { id: 'rank', stat: 'rankA', goal: 2, text: 'Get A rank or better twice', reward: { crumbs: 120, items: { fstone: 3 } } },
  { id: 'box', stat: 'boxes', goal: 5, text: 'Open 5 loot boxes', reward: { crumbs: 100, items: { gstone: 1 } } },
  { id: 'fort', stat: 'fortifies', goal: 2, text: 'Try to fortify gear twice', reward: { items: { fstone: 3 } } },
  { id: 'dodge', stat: 'dodges', goal: 15, text: 'Dodge-roll 15 times', reward: { crumbs: 100, items: { jam: 3 } } },
  { id: 'perfect', stat: 'perfects', goal: 5, text: 'Land 5 perfect dodges', reward: { crumbs: 150, items: { bean: 1 } } },
  { id: 'interrupt', stat: 'interrupts', goal: 8, text: 'Interrupt 8 monster attacks', reward: { crumbs: 120, items: { fstone: 2 } } },
  { id: 'spicy', stat: 'spicy', goal: 1, text: 'Clear a stage with a Spicy chilli on', reward: { crumbs: 150, box: 3 } },
  { id: 'pot', stat: 'potions', goal: 3, text: 'Use 3 quick-bag items', reward: { crumbs: 80, items: { bigjam: 1 } } },
  { id: 'elite', stat: 'eliteKills', goal: 1, text: 'Defeat an elite or a boss', reward: { crumbs: 150, box: 3 } },
  { id: 'hero', stat: 'heroClear', goal: 1, text: 'Clear a stage with', reward: { crumbs: 150, items: { fstone: 2 } }, hero: true },
];
const BONUS: Reward = { box: 4, items: { gstone: 1 } };

interface AchDef { id: string; stat: StatKey; name: string; tiers: number[]; reward: (tier: number) => Reward }
export const ACHIEVEMENTS: AchDef[] = [
  { id: 'hunter', stat: 'kills', name: 'Monster Hunter', tiers: [100, 500, 2000, 5000], reward: t => ({ crumbs: 200 * (t + 1), items: { fstone: 3 + t * 2 } }) },
  { id: 'boss', stat: 'bossKills', name: 'Boss Slayer', tiers: [1, 3, 10, 25], reward: t => ({ box: Math.min(5, 3 + t) as BoxTier, items: { ggstone: t >= 2 ? 1 : 0 } }) },
  { id: 'clears', stat: 'clears', name: 'Adventurer', tiers: [10, 30, 100, 250], reward: t => ({ crumbs: 300 * (t + 1), box: Math.min(5, 2 + t) as BoxTier }) },
  { id: 'perfect', stat: 'rankS', name: 'Perfectionist', tiers: [1, 10, 30, 60], reward: t => ({ items: { gstone: 1 + t, safety: t } }) },
  { id: 'collector', stat: 'legendaries', name: 'Collector', tiers: [1, 5, 15], reward: t => ({ items: { ggstone: 1 + t } }) },
  { id: 'smith', stat: 'maxPlus', name: 'Master Smith', tiers: [5, 10, 13, 15], reward: t => ({ items: { fstone: 5 + t * 5, safety: 1 + t } }) },
  { id: 'opener', stat: 'boxes', name: 'Box Fiend', tiers: [20, 100, 300], reward: t => ({ crumbs: 300 * (t + 1), box: Math.min(5, 3 + t) as BoxTier }) },
  { id: 'nimble', stat: 'dodges', name: 'Nimble Kaiju', tiers: [50, 300, 1000], reward: t => ({ items: { bean: 2 + t * 2, revive: t } }) },
  { id: 'justmissed', stat: 'perfects', name: 'Just Missed', tiers: [20, 150, 600], reward: t => ({ crumbs: 300 * (t + 1), items: { revive: t } }) },
  { id: 'chilli', stat: 'spicy', name: 'Chilli Head', tiers: [5, 30, 100], reward: t => ({ box: Math.min(5, 3 + t) as BoxTier, items: { gstone: 1 + t } }) },
  { id: 'ult', stat: 'ults', name: 'Ultimate Chef', tiers: [1, 25, 100], reward: t => ({ crumbs: 400 * (t + 1) }) },
];

// ---------- state in the save ----------
interface QState { id: string; prog: number; claimed: boolean; hero?: number }
interface QSave { stats: Record<string, number>; daily: { day: string; q: QState[]; bonus: boolean }; ach: Record<string, number> }
function qs(): QSave {
  const s = save as unknown as { quest?: QSave };
  if (!s.quest) s.quest = { stats: {}, daily: { day: '', q: [], bonus: false }, ach: {} };
  return s.quest;
}

/** Today's 3 quests (rolled from the date). */
export function dailyQuests(): (QState & { def: QuestDef; text: string })[] {
  const d = qs().daily;
  if (d.day !== today()) {
    let seed = [...today()].reduce((a, c) => (a * 33 + c.charCodeAt(0)) >>> 0, 11) || 1;
    const rand = () => { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; return ((seed >>> 0) % 100000) / 100000; };
    const pool = [...QUEST_POOL];
    const picks: QState[] = [];
    while (picks.length < 3) { const def = pool.splice(Math.floor(rand() * pool.length), 1)[0]; picks.push({ id: def.id, prog: 0, claimed: false, hero: def.hero ? CLASSES[Math.floor(rand() * CLASSES.length)].species : undefined }); }
    qs().daily = { day: today(), q: picks, bonus: false };
    persist();
  }
  return qs().daily.q.map(q => {
    const def = QUEST_POOL.find(x => x.id === q.id)!;
    return { ...q, def, text: def.hero ? `${def.text} ${CLASSES.find(c => c.species === q.hero)?.name}` : def.text };
  });
}

/** Record progress. heroSpecies is used by "clear with <hero>" quests. */
/** What a SKIP TO BOSS clear does not count for: rank quests, the Toastbat unlock, Perfectionist, the chilli quests. */
const NOT_ON_SKIP = new Set<string>(['rankA', 'rankS', 'spicy']);
const skipBlocks = (key: string) => lastClearSkipped && (NOT_ON_SKIP.has(key) || key === 'nohit' || key.startsWith('clear:'));

export function track(stat: StatKey, n = 1, heroSpecies?: number): void {
  if (skipBlocks(stat)) return;
  const st = qs();
  if (stat === 'maxPlus') st.stats.maxPlus = Math.max(st.stats.maxPlus ?? 0, n);
  else st.stats[stat] = (st.stats[stat] ?? 0) + n;
  dailyQuests();
  for (const q of st.daily.q) {
    const def = QUEST_POOL.find(x => x.id === q.id)!;
    if (def.stat !== stat || q.claimed) continue;
    if (def.hero && heroSpecies !== q.hero) continue;
    q.prog = Math.min(def.goal, q.prog + n);
  }
  persist();
}

export function statOf(k: StatKey | string): number { return qs().stats[k] ?? 0; }

/** Any account-wide counter (e.g. 'kill:worm'). */
export function trackKey(key: string, n = 1): void { const st = qs().stats; st[key] = (st[key] ?? 0) + n; persist(); }

/** A kaiju's own counter; max = keep the best value instead of adding. */
export function trackHero(species: number, key: string, n = 1, max = false): void {
  if (skipBlocks(key)) return; // a kaiju's "clear 1-5 with an A" is about the whole stage
  const p = save.heroes[species];
  p.stats[key] = max ? Math.max(p.stats[key] ?? 0, n) : (p.stats[key] ?? 0) + n;
  persist();
}

// ---------- kaiju unlocks ----------
export function unlockProgress() {
  return UNLOCKS.map(u => ({ ...u, prog: Math.min(u.goal, statOf(u.key)), done: save.unlocked.includes(u.species) }));
}
/** Unlock every kaiju whose challenge is complete; returns the newly unlocked. */
export function checkUnlocks(): number[] {
  const got: number[] = [];
  for (const u of UNLOCKS) if (!save.unlocked.includes(u.species) && statOf(u.key) >= u.goal) { save.unlocked.push(u.species); got.push(u.species); }
  if (got.length) persist();
  return got;
}

// ---------- each kaiju's quest line ----------
export function kaijuQuestState(species: number) {
  const p = save.heroes[species];
  // S_RANK_KEY is not a counter: 1 once this kaiju's saved best ranks (Normal or Hard) hold an S on any stage
  const hasS = () => ([...Object.values(p.cleared ?? {}), ...Object.values(p.hardCleared ?? {})].includes('S') ? 1 : 0);
  return kaijuQuests(species).map(q => ({ ...q, prog: Math.min(q.goal, q.key === S_RANK_KEY ? hasS() : p.stats[q.key] ?? 0), claimed: p.kq.includes(q.id) }));
}
export function claimKaijuQuest(species: number, id: string): string | null {
  const q = kaijuQuestState(species).find(x => x.id === id);
  if (!q || q.claimed || q.prog < q.goal) return null;
  save.heroes[species].kq.push(id);
  const r = q.reward, parts: string[] = [];
  if (r.crumbs) { save.crumbs += r.crumbs; parts.push(`🍪${r.crumbs}`); }
  for (const k of ['fstone', 'gstone', 'ggstone'] as const) if (r[k]) { save.items[k] = (save.items[k] ?? 0) + r[k]!; parts.push(`${r[k]}× ${k}`); }
  if (r.box) { save.boxes.push({ tier: r.box, ilvl: save.heroes[species].level }); parts.push('a box'); }
  if (r.sigCharm) {
    // this kaiju's signature charm, Epic, at its level
    const key = Object.keys(BASES).find(k => BASES[k].slot === 'charm' && BASES[k].for === species);
    if (key) {
      let it = rollItem(save.nextId++, 4, Math.max(12, save.heroes[species].level), Math.random, [], species);
      it = { ...it, base: key, rarity: Math.max(4, it.rarity) as 4 | 5, set: BASES[key].set };
      save.bag.push(it); parts.push(`${BASES[key].name} (signature charm)`);
    }
  }
  persist();
  return parts.join(', ');
}
export function kaijuQuestsClaimable(species: number): number { return kaijuQuestState(species).filter(q => !q.claimed && q.prog >= q.goal).length; }

function give(r: Reward): string {
  const parts: string[] = [];
  if (r.crumbs) { save.crumbs += r.crumbs; parts.push(`🍪${r.crumbs}`); }
  for (const [id, n] of Object.entries(r.items ?? {})) if (n) { save.items[id as ConsumableId] = (save.items[id as ConsumableId] ?? 0) + n; parts.push(`${n}× ${id}`); }
  if (r.box) { save.boxes.push({ tier: r.box, ilvl: Math.max(1, ...Object.values(save.heroes).map(h => h.level)) }); parts.push('a box'); }
  persist();
  return parts.join(', ');
}
export function rewardText(r: Reward, names: Record<string, string>): string {
  const p: string[] = [];
  if (r.crumbs) p.push(`🍪 ${r.crumbs}`);
  for (const [id, n] of Object.entries(r.items ?? {})) if (n) p.push(`${n}× ${names[id] ?? id}`);
  if (r.box) p.push(['', 'Paper Bag', 'Lunchbox', 'Bento', 'Golden Cloche', 'Rainbow Cake Box'][r.box]);
  return p.join(' + ');
}

export function claimQuest(i: number): string | null {
  const q = qs().daily.q[i], def = q && QUEST_POOL.find(x => x.id === q.id);
  if (!q || !def || q.claimed || q.prog < def.goal) return null;
  q.claimed = true;
  return give(def.reward);
}
export function claimBonus(): string | null {
  const d = qs().daily;
  if (d.bonus || !d.q.every(q => q.claimed)) return null;
  d.bonus = true;
  return give(BONUS);
}
export const DAILY_BONUS = BONUS;

/** Achievements: next unclaimed tier and whether it is reached. */
export function achievements() {
  return ACHIEVEMENTS.map(a => {
    const claimed = qs().ach[a.id] ?? 0;
    const goal = a.tiers[claimed];
    return { a, claimed, goal, prog: statOf(a.stat), done: goal !== undefined && statOf(a.stat) >= goal, maxed: goal === undefined };
  });
}
export function claimAch(id: string): string | null {
  const x = achievements().find(e => e.a.id === id);
  if (!x || !x.done) return null;
  qs().ach[id] = x.claimed + 1;
  return give(x.a.reward(x.claimed));
}
/** Anything waiting to be claimed (for the tab badge). */
export function claimable(): number {
  const d = dailyQuests().filter(q => !q.claimed && q.prog >= q.def.goal).length;
  const b = !qs().daily.bonus && qs().daily.q.every(q => q.claimed) ? 1 : 0;
  return d + b + achievements().filter(a => a.done).length + kaijuQuestsClaimable(save.selected);
}
