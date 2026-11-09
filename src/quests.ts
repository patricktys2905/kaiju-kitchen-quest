// Daily quests (3 a day, picked by date) and tiered achievements. Progress comes from track(); rewards are claimed in camp.
import { CLASSES } from './sim/classes';
import type { ConsumableId } from './sim/consumables';
import type { BoxTier } from './sim/types';
import { persist, save, today } from './save';

export type StatKey = 'kills' | 'bossKills' | 'eliteKills' | 'clears' | 'rankA' | 'rankS' | 'boxes' | 'fortifies' | 'dodges' | 'potions' | 'ults'
  | 'legendaries' | 'maxPlus' | 'crumbs' | 'heroClear';

export interface Reward { crumbs?: number; items?: Partial<Record<ConsumableId, number>>; box?: BoxTier }

interface QuestDef { id: string; stat: StatKey; goal: number; text: string; reward: Reward; hero?: boolean }
const QUEST_POOL: QuestDef[] = [
  { id: 'kill', stat: 'kills', goal: 60, text: 'Defeat 60 monsters', reward: { crumbs: 150, items: { fstone: 2 } } },
  { id: 'clear', stat: 'clears', goal: 3, text: 'Clear 3 stages', reward: { crumbs: 120, box: 2 } },
  { id: 'rank', stat: 'rankA', goal: 2, text: 'Get A rank or better twice', reward: { crumbs: 120, items: { fstone: 3 } } },
  { id: 'box', stat: 'boxes', goal: 5, text: 'Open 5 loot boxes', reward: { crumbs: 100, items: { gstone: 1 } } },
  { id: 'fort', stat: 'fortifies', goal: 2, text: 'Try to fortify gear twice', reward: { items: { fstone: 3 } } },
  { id: 'dodge', stat: 'dodges', goal: 15, text: 'Dodge-roll 15 times', reward: { crumbs: 100, items: { jam: 3 } } },
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
  { id: 'ult', stat: 'ults', name: 'Ultimate Chef', tiers: [1, 25, 100], reward: t => ({ crumbs: 400 * (t + 1) }) },
];

// ---------- state in the save ----------
interface QState { id: string; prog: number; claimed: boolean; hero?: number }
interface QSave { stats: Partial<Record<StatKey, number>>; daily: { day: string; q: QState[]; bonus: boolean }; ach: Record<string, number> }
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
export function track(stat: StatKey, n = 1, heroSpecies?: number): void {
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

export function statOf(k: StatKey): number { return qs().stats[k] ?? 0; }

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
  return d + b + achievements().filter(a => a.done).length;
}
