// Camp (hub) menus as an HTML overlay: world MAP, HERO (stats + equipment), SKILLS, BAG (gear tabs + compare,
// consumables + quick bag), MARKET, BOXES (gacha). Also the stage result panel. Reads/writes src/save.ts.
import { MOBS as MOB_DEFS, nemesisOf } from '../sim/mobs';
import type { Spicy } from '../sim/types';
import { CLASSES, type Stat } from '../sim/classes';
import { CONSUMABLES, type ConsumableId, QUICK_SLOTS } from '../sim/consumables';
import { BASES, PROCS, SETS, UNIQUES, itemIcon, canWear, ownerOf, GRADES, GRADE_CSS, GRADE_MUL, type Item, MAX_PLUS, RARITY_CSS, RARITY_NAMES, type Slot, fortChance, fortCost, fortMul, fortRisky, gradeOf, itemLines, itemName, lineText, salvageValue } from '../sim/items';
import { TIER_NAMES, clearCount, likelyTier } from '../sim/loot';
import { BRANCH_LV, SKILLS, MAX_SKILL, rankLv, type SkillDef, type SkillKind, ULTS, ULT_LV, branchesFor, skillsOf } from '../sim/skills';
import { STAGES, WORLDS, BONUS_STAGES, stageById } from '../sim/stages';
import { type Derived, type HeroProfile, STAT_INFO, STATS, derive, xpFor } from '../sim/stats';
import type { BoxTier, LootBox, StageDef } from '../sim/types';
import { HARD_LV } from '../sim/world';
import {
  RANK_ORDER, type ClearResult, type Rank, chooseBranch, SHOP_BOXES, SHOP_ITEMS, autoStats, buyBox, buyConsumable, buyGear, canFortify, compare, equip, equipBest, fortify, regrade,
  gearPrice, hero, isLocked, levelSkill, learnNode, setLoadout, openBox, persist, resetStats, salvage, salvageWorse, save, setQuick, shopStock, spendStat, toggleLock,
  unequip, useScroll, useSugar, worldStars } from '../save';
import { UI_CSS } from './style';
import { freePage, startFree } from './free';
import type { FreeMode } from '../sim/free';
import { gearSkillOf, gearText } from '../sim/gear';
import { type TreeNode, type TreePath, allActives, canLearn, nodeById, nodeLv, pointsIn, rankOf, skillUnlocked, statText, treeOf, loadoutOf } from '../sim/tree';
import { logError } from './report';
import { isTouchDevice } from '../touch';
import { ACHIEVEMENTS, DAILY_BONUS, achievements, checkUnlocks, claimAch, claimBonus, claimKaijuQuest, claimQuest, claimable, dailyQuests, kaijuQuestState, rewardText, track, unlockProgress } from '../quests';
import { STORIES, VARIANT_INFO, beatBefore, isMinorBeat } from '../story/stories';
import { playStory } from './story';
import { fsButton } from './title';
import { STARS_FOR_SECRET, challengesFor } from '../sim/challenges';
import { GEAR } from '../sim/gear';
import { bossWeaponFor } from '../sim/bossgearData';
import { dropName } from '../sim/drops';
import type { MobKind } from '../sim/types';
import { isMuted, sfx, toggleMute } from '../audio';
import { ELEMENT_INFO, type Element, GUARD_BREAK_ELEMENT, RESEASON_ELEMENTS, type StageElements, canReseason, elementsOfGear, elementsOfGearSkill, elementsOfSkill, reseasonCost, reseasonItem, stageElements, weakOf } from '../sim/elements';
import { ELEMENT_CSS, elHtml, elsHtml, tickHtml, weakHtml } from './elementUi';
import { applyBranch, applyMod } from '../sim/skills';
import { findWeapon, reseason, reseasonBlock } from '../save';

type Tab = 'map' | 'free' | 'hero' | 'skills' | 'bag' | 'market' | 'boxes' | 'quests';
type BagTab = Slot | 'items';
const RANK_CSS: Record<Rank, string> = { S: '#ffd23c', A: '#7ee87e', B: '#7ac0ff', C: '#d8c8d8', D: '#a89898' };
const TIER_CSS: Record<BoxTier, string> = { 1: '#e0c09a', 2: '#7ee87e', 3: '#7ac0ff', 4: '#ffd23c', 5: '#ff8af4' };
export const SKILL_ICON: Record<SkillKind, string> = { jiggle: '🟢', clones: '👯', wobble: '🫨', upstream: '🐟', tide: '🌊', salmon: '🐠', jellyquake: '💥', salmonrun: '🎏', swing: '🌿', nap: '😴', slowtime: '🐌', wall: '🧇', scoop: '🍨', chipstorm: '🍫', snooze: '💤', sundae: '🍨', bubbletrap: '🫧', gumball: '🍬', trumpet: '🎺', hops: '🦘', flurry: '🥊', cakebomb: '🧁', megabubble: '🎈', tko: '💫', pitbounce: '🥑', guac: '🥣', gust: '🌬️', drop: '🌶️', screech: '🦉', volley: '🌮', guacflood: '🌊', fiesta: '🪅', cone: '💥', slam: '🌋', dash: '⚡', bolt: '✨', spin: '🌀', uppercut: '⤴️', mines: '🫐', buff: '🛡️', nova: '🌟', fan: '🎐', heal: '🥟',
  vortex: '🌪️', boomerang: '🍕', whip: '🦑', pull: '🪝', geyser: '⚗️', counter: '🦀', pounce: '🧀', swoop: '🦇', blink: '👤', rain: '🍞', zone: '♨️', drain: '🍜', breath: '🔥', orbit: '🍙', twister: '🌀', throw: '🤼', bulldoze: '🐂', roll: '🦔', goo: '🌭', radial: '📍', slide: '🐧', snowball: '⛄', freeze: '🧊',
  rampage: '🍓', meteor: '☄️', slashall: '🔪', beam: '🌙', tremor: '🌋', homing: '🎯', wave: '🍫', firefloor: '♨️', blizzard: '🌨️' };
const SLOT_NAMES: Record<Slot, string> = { weapon: 'Weapon', armor: 'Armor', charm: 'Charm' };
const SKILL_NAME: Record<string, string> = Object.fromEntries(Object.values(SKILLS).flatMap(s => [...s.actives, s.passive].map(a => [a.id, a.name])));

/** Stage dots on the world map (percent of the map image), in stage order. */
const MAP_POS: Record<string, [number, number]> = {
  '1-1': [4, 88], '1-2': [12.5, 82], '1-3': [15.5, 70], '1-4': [19.5, 57], '1-5': [21, 45], '1-6': [27, 33], '1-7': [36.5, 30], '1-8': [43, 23], '1-9': [46, 15], '1-10': [49, 9],
  '3-1': [27, 87], '3-2': [36, 77], '3-3': [46, 68], '3-4': [60, 62], '3-5': [45, 52], '3-6': [55, 42], '3-7': [73, 48], '3-8': [46, 20], '3-9': [62, 32], '3-10': [77, 23],
  '4-1': [21, 83], '4-2': [27, 74], '4-3': [31, 63], '4-4': [36, 60], '4-5': [39, 50], '4-6': [44, 40], '4-7': [52, 43], '4-8': [61, 43], '4-9': [68, 37], '4-10': [76, 22],
  '5-1': [5, 87], '5-2': [14, 77], '5-3': [26, 74], '5-4': [38, 82], '5-5': [47, 76], '5-6': [50, 52], '5-7': [62, 61], '5-8': [70, 45], '5-9': [84, 56], '5-10': [77, 75],
  '6-1': [11, 86], '6-2': [23, 80], '6-3': [36, 82], '6-4': [43, 66], '6-5': [53, 56], '6-6': [62, 56], '6-7': [70, 52], '6-8': [74, 38], '6-9': [81, 33], '6-10': [87, 22],
  '7-1': [5, 92], '7-2': [15, 85], '7-3': [28, 84], '7-4': [40, 82], '7-5': [50, 72], '7-6': [62, 70], '7-7': [79, 64], '7-8': [82, 48], '7-9': [77, 36], '7-10': [86, 28],
  '8-1': [12, 88], '8-2': [24, 80], '8-3': [33, 68], '8-4': [46, 62], '8-5': [54, 54], '8-6': [48, 42], '8-7': [56, 32], '8-8': [66, 30], '8-9': [72, 22], '8-10': [79, 14],
  '9-1': [28, 74], '9-2': [40, 70], '9-3': [62, 72], '9-4': [72, 58], '9-5': [60, 47], '9-6': [50, 30], '9-7': [36, 46], '9-8': [24, 40], '9-9': [28, 22], '9-10': [75, 20],
  '10-1': [14, 86], '10-2': [30, 88], '10-3': [46, 84], '10-4': [58, 72], '10-5': [46, 55], '10-6': [62, 47], '10-7': [40, 32], '10-8': [60, 33], '10-9': [76, 38], '10-10': [82, 16],
  '2-1': [52, 77], '2-2': [61, 67], '2-3': [69, 61], '2-4': [75, 54], '2-5': [79, 46], '2-6': [77, 38], '2-7': [81, 30], '2-8': [79, 22], '2-9': [83, 15], '2-10': [85, 7],
};

/** Map pages: which painted map shows which worlds. */
const MAPS = [{ img: 'map-world', name: 'Kitchen', worlds: [1, 2] }, { img: 'map-oven', name: 'Oven', worlds: [3] }, { img: 'map-pantry', name: 'Pantry', worlds: [4] }, { img: 'map-sink', name: 'Sink', worlds: [5] }, { img: 'map-dining', name: 'Dining Room', worlds: [6] }, { img: 'map-backyard', name: 'Backyard', worlds: [7] }, { img: 'map-garden', name: 'Garden', worlds: [8] }, { img: 'map-market', name: 'Supermarket', worlds: [9] }, { img: 'map-fridgeback', name: 'The Feast', worlds: [10] }];

let el: HTMLElement;
let tab: Tab = 'map';
let bagTab: BagTab = 'weapon';
let selItem: number | null = null;
let selStage: string | null = null;
let selConsumable: ConsumableId | null = null;
let onPlay: (stageId: string, skip?: boolean) => void = () => {};
let onOnline: () => void = () => {};
let flash = '';
let useSafety = true;
let bagMine = true;

/** The drops a stage's map exits want, added up: one icon each with have / need (the title says which monster drops it). */
function dropRow(st: StageDef): string {
  const need = new Map<MobKind, number>();
  for (const m of st.maps ?? []) if (m.goal?.kind === 'collect') for (const q of m.goal.wants) need.set(q.mob, (need.get(q.mob) ?? 0) + q.n);
  if (!need.size) return '';
  return `<div class="lv dropreq">Drops: ${[...need].map(([k, n]) => { const have = save.drops?.[k] ?? 0; return `<span class="${have >= n ? 'ok' : ''}" title="${dropName(k)} from ${MOB_DEFS[k].name} (weak to ${ELEMENT_INFO[weakOf(k)].name})"><img src="art/drop-${k}.webp" onerror="this.style.display='none'">${elHtml(weakOf(k))} ${Math.min(have, n)}/${n}</span>`; }).join('')}</div>`;
}
/** What the stage picked on the map is weak to (with this kaiju's nemesis at stage 5): the green ticks in the kit screens use it. */
function selStageEl(): { st: StageDef; se: StageElements } {
  const st = STAGES.find(s => s.id === selStage) ?? [...STAGES].reverse().find(stageUnlocked) ?? STAGES[0];
  return { st, se: stageElements(st, save.selected) };
}
/** A skill as it is cast: its upgrade choice and tree / signature upgrades applied (its element can come from those). */
const castOf = (d: Derived, a: SkillDef): SkillDef => applyMod(applyBranch(a, d.branch[a.id]), d.mods[a.id]);
/** The small "what does the tick mean" line for the kit screens. */
function fitNote(): string {
  const { st, se } = selStageEl(), line = weakHtml(se);
  return line ? `<div class="fitnote weakln">${st.num} ${esc(st.name)} · ${line} · <abbr class="eltick">✓</abbr> = fits it</div>` : '';
}
export function initCamp(play: (stageId: string, skip?: boolean) => void, online: () => void = () => {}): void {
  onPlay = play; onOnline = online;
  const st = document.createElement('style');
  st.textContent = UI_CSS + CAMP_CSS + ELEMENT_CSS;
  document.head.appendChild(st);
  el = document.createElement('div');
  el.id = 'camp';
  el.className = 'kq';
  el.style.backgroundImage = 'url(art/bg-far.webp)';
  document.body.appendChild(el);
  for (const id of ['gacha', 'result']) { const d = document.createElement('div'); d.id = id; d.className = 'kq'; document.body.appendChild(d); }
  el.addEventListener('click', onClick);
}

export function showCamp(t?: Tab): void {
  if (t) tab = t;
  el.classList.add('on');
  render();
}
export function hideCamp(): void { el.classList.remove('on'); }

const esc = (s: string) => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
const iconHtml = (it: Item | undefined, extra = '', badge = '') => it
  ? `<div class="icon" style="--rc:${RARITY_CSS[it.rarity]};background-image:url(art/${itemIcon(it)}.webp)" ${extra}>${it.skill ? '<span class="sk">⭐</span>' : ''}${it.plus ? `<b>+${it.plus}</b>` : ''}${isLocked(it.id) ? '<span class="lk">🔒</span>' : ''}<span class="gr" style="color:${GRADE_CSS[gradeOf(it)]}">${GRADES[gradeOf(it)]}</span>${it.set ? '<span class="setm">SET</span>' : ''}${it.unique ? '<span class="uqm">✦</span>' : ''}${elementsOfGear(it).map(e => `<span class="elb">${ELEMENT_INFO[e].icon}</span>`).join('')}${badge}</div>`
  : `<div class="icon" ${extra}></div>`;
/** ▲ / ▼ versus what the current hero wears. */
function badgeFor(it: Item): string {
  const o = ownerOf(it);
  if (o !== undefined && o !== save.selected) return `<img class="own" src="art/kaiju-${o}.webp" title="For ${CLASSES.find(c => c.species === o)?.name}">`;
  const c = compare(save.selected, it).pct;
  if (Math.abs(c) < 0.5) return '<span class="cmp eq">=</span>';
  return c > 0 ? '<span class="cmp up">▲</span>' : '<span class="cmp dn">▼</span>';
}
const ownerName = (it: Item) => { const o = ownerOf(it); return o === undefined ? '' : CLASSES.find(c => c.species === o)?.name ?? ''; };
const cIcon = (id: ConsumableId) => `art/${CONSUMABLES[id].icon}.webp`;

export function stageUnlocked(s: StageDef): boolean {
  if (s.id.startsWith('S-')) return (save.keys ?? []).includes(s.world);
  const i = STAGES.indexOf(s);
  return i === 0 || !!hero().cleared[STAGES[i - 1].id];
}
export function hardUnlocked(world: number): boolean { return !!hero().cleared[`${world}-10`]; }

function render(): void {
  const p = hero();
  const tabs: [Tab, string, number][] = [['map', 'Map', 0], ['free', 'Free Play', 0], ['hero', 'Hero', p.statPts], ['skills', 'Skills', p.skillPts], ['bag', 'Bag', 0], ['market', 'Market', 0], ['boxes', 'Boxes', save.boxes.length], ['quests', 'Quests', claimable()]];
  el.innerHTML = `
    <div class="side">${CLASSES.map(c => { const h = save.heroes[c.species], open = save.unlocked.includes(c.species); return `<button class="hp ${c.species === save.selected ? 'on' : ''} ${open && h.statPts + h.skillPts ? 'pts' : ''} ${open ? '' : 'lockd'}" data-hero="${c.species}" title="${c.name}" style="background-image:url(art/kaiju-${c.species}.webp)"><i></i>${open ? `<b>${h.level}</b>` : '<u>🔒</u>'}</button>`; }).join('')}</div>
    <div class="main">
      <div class="top"><h1>Kaiju Kitchen Quest</h1><span class="chip"><img src="art/icon-crumb.webp"> ${save.crumbs}</span><span class="chip">🎁 ${save.boxes.length}</span><button class="chip" data-act="mute">${isMuted() ? '🔇' : '🔊'}</button><button class="chip" data-settings title="Settings">⚙</button><button class="chip" data-report title="Report a bug">🐞</button>${fsButton()}</div>
      <div class="tabs">${tabs.map(([k, n, c]) => `<button class="${tab === k ? 'on' : ''}" data-tab="${k}">${n}${c ? `<em>${c}</em>` : ''}</button>`).join('')}</div>
      <div class="page ${tab === 'map' ? 'mappage' : ''}">${safePage()}</div>
    </div>
    ${flash ? `<div class="flashmsg">${flash}</div>` : ''}`;
  flash = '';
}

/** A tab that fails to draw shows what went wrong (to screenshot) instead of silently doing nothing. */
function safePage(): string {
  try { return page(); } catch (e) {
    console.error(e); logError(`tab ${tab}: ${(e as Error)?.message ?? e}`);
    const err = e instanceof Error ? `${e.name}: ${e.message} @ ${(e.stack ?? '').split('\n')[1]?.trim() ?? ''}` : String(e);
    return `<div class="freeinfo">😵 This tab hit a snag and couldn't open.<br><small style="color:#ff9a8a">${err.replace(/[<>&]/g, '')}</small><br><small>Version ${__APP_VERSION__} · tab ${tab} · kaiju ${save.selected}</small><br>Please send a screenshot of this message.</div>`;
  }
}

function page(): string {
  switch (tab) {
    case 'map': return mapPage();
    case 'free': return freePage();
    case 'hero': return heroPage();
    case 'skills': return skillsPage();
    case 'bag': return bagPage();
    case 'market': return marketPage();
    case 'boxes': return boxesPage();
    case 'quests': return questsPage();
  }
}

// ---------- map ----------
function rewardLine(s: StageDef): string {
  const lv = s.lv[1] + (save.hard ? HARD_LV : 0);
  const tier = likelyTier(lv, 'A', !!s.boss), n = clearCount('A', !!s.boss);
  return `<span class="rw"><img src="art/box-${tier}.webp"> ${TIER_NAMES[tier]}${n > 1 ? ` ×${n}` : ''}</span>`;
}

function mapPage(): string {
  const p = hero();
  // default selection: the furthest unlocked stage
  if (!selStage || !STAGES.some(s => s.id === selStage)) selStage = [...STAGES].reverse().find(stageUnlocked)?.id ?? '1-1';
  const sel = STAGES.find(s => s.id === selStage)!;
  const mp = MAPS.find(m => m.worlds.includes(sel.world)) ?? MAPS[0];
  const pts = (w: number) => STAGES.filter(s => s.world === w).map(s => MAP_POS[s.id]).map(([x, y]) => `${x},${y}`).join(' ');
  const done = (w: number) => STAGES.filter(s => s.world === w && hero().cleared[s.id]).map(s => MAP_POS[s.id]);
  const hardOk = hardUnlocked(sel.world);
  const nightmareOk = !!hero().hardCleared[`${sel.world}-10`];
  if (save.hard && !hardOk) { save.hard = false; persist(); }
  const rank = (save.hard ? hero().hardCleared : hero().cleared)[sel.id] as Rank | undefined;
  const lv = (n: number) => n + (save.hard ? HARD_LV : 0);
  const low = p.level < lv(sel.rec) - 1;
  const se = stageElements(sel, p.species);
  return `<div class="mappages">${MAPS.map((m, i) => { const open = m.worlds.some(w => stageUnlocked(STAGES.find(s => s.id === `${w}-1`)!)); return `<button class="${m === mp ? 'on' : ''}" data-mappage="${i}" ${open ? '' : 'disabled'}>${open ? '' : '🔒 '}${m.name}</button>`; }).join('')}</div>
  <div class="map">
    <div class="mapimg" style="background-image:url(art/${mp.img}.webp)">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        ${WORLDS.filter(w => mp.worlds.includes(w.id)).map(w => `<polyline points="${pts(w.id)}" class="path"/>${done(w.id).length > 1 ? `<polyline points="${done(w.id).map(([x, y]) => `${x},${y}`).join(' ')}" class="path done"/>` : ''}`).join('')}
      </svg>
      ${WORLDS.filter(w => mp.worlds.includes(w.id)).map(w => { const [x, y] = MAP_POS[`${w.id}-1`]; return `<div class="wlabel" style="left:${x}%;top:${y + 7}%">World ${w.id}: ${w.name}</div>`; }).join('')}
      ${STAGES.filter(s => mp.worlds.includes(s.world)).map(s => {
        const [x, y] = MAP_POS[s.id];
        const open = stageUnlocked(s), r = (save.hard ? hero().hardCleared : hero().cleared)[s.id] as Rank | undefined;
        return `<button class="node ${open ? '' : 'locked'} ${s.boss ? 'boss' : ''} ${s.id === selStage ? 'sel' : ''} ${hero().cleared[s.id] ? 'done' : ''}" data-node="${s.id}" style="left:${x}%;top:${y}%">
          ${s.boss ? '👑' : s.id.split('-')[1]}${r ? `<i style="color:${RANK_CSS[r]}">${r}</i>` : ''}${STORIES[p.species]?.variants[s.id] ? `<em class="vt">${VARIANT_INFO[STORIES[p.species].variants[s.id]].icon}</em>` : ''}${s.id === selStage ? `<img class="me" src="art/kaiju-${p.species}.webp">` : ''}</button>`;
      }).join('')}
    </div>
    <div class="info">
      <div class="num">${sel.num}${sel.boss ? ' · BOSS' : sel.id.endsWith('-5') && sel.world <= 5 && nemesisOf(p.species) ? ' · NEMESIS' : sel.id.endsWith('-5') ? ' · ELITE' : ''}</div>
      <div class="nm">${sel.name}</div>
      <div class="lv">Monsters Lv ${lv(sel.lv[0])}${sel.lv[1] !== sel.lv[0] ? '–' + lv(sel.lv[1]) : ''} · <span style="color:${low ? '#ff8a8a' : '#a8f0a8'}">you Lv ${p.level}${low ? ' (low!)' : ''}</span></div>
      <div class="lv">Reward: ${rewardLine(sel)}</div>
      ${sel.boss ? (() => { const bw = bossWeaponFor(WORLDS[sel.world - 1].boss, p.species); return bw ? `<div class="lv" style="color:#ffb347" title="${bw.skill}">⚔ Can drop: <img src="art/${bw.base}.webp" style="height:1.3em;vertical-align:middle"> ${elsHtml(elementsOfGearSkill(GEAR[bw.base]))}${bw.name}</div>` : ''; })() : ''}
      ${(l => l ? `<div class="lv weakln">${l}</div>` : '')(weakHtml(sel.maps ? { ...se, boss: undefined } : se))}
      ${sel.maps ? `<div class="lv" style="color:#ff9a6a">☠ Boss: ${!hero().cleared[sel.id] ? '???' : sel.id.endsWith('-5') && sel.world <= 5 && nemesisOf(p.species) ? MOB_DEFS[nemesisOf(p.species)!].name : sel.mobs[0] ? MOB_DEFS[sel.mobs[0].kind].name : '???'}${se.boss ? ` · weak ${elHtml(se.boss.weakTo)} <small class="shrug">(shrugs off ${elHtml(se.boss.resists)})</small>` : ''}</div>${dropRow(sel)}` : ''}
      ${sel.objective ? `<div class="lv" style="color:#ffd27a">${({ escort: '🧁 Escort the lost Crumblet', fetch: `📜 Grab the Recipe Scroll in ${sel.objective.t}s`, survive: `⏱ Hold out for ${sel.objective.t}s` })[sel.objective.kind]} · bonus box</div>` : ''}
      ${STORIES[p.species]?.variants[sel.id] ? (() => { const v = VARIANT_INFO[STORIES[p.species].variants[sel.id]]; return `<div class="lv vtx">${v.icon} Story twist: <b>${v.name}</b> — ${v.desc}</div>`; })() : ''}
      <div class="lv story">📖 ${STORIES[p.species]?.title ?? ''}${beatBefore(sel.id, sel.id === '1-1').some(b => p.seen.includes(b)) || (sel.boss && p.seen.includes(`w${sel.world}-after`)) ? ` <button class="mini" data-replay="${sel.id}" title="Replay this stage's scenes">↻</button>` : ''} <button class="mini" data-act="storymode" title="Story scenes: every stage, or only the big ones">${save.storyMode === 'key' ? 'Key scenes' : 'All scenes'}</button></div>
      ${rank ? `<div class="lv">Best: <b style="color:${RANK_CSS[rank]}">${rank}</b></div>` : ''}
      ${challengesFor(sel.id).length ? `<details class="lv chal"><summary>${challengesFor(sel.id).map(c => (save.challenges?.[sel.id] ?? []).includes(c.id) ? '★' : '☆').join('')} Challenges <small>▸</small></summary>${challengesFor(sel.id).map(c => { const ok = (save.challenges?.[sel.id] ?? []).includes(c.id); return `<span class="${ok ? 'ok' : ''}">${ok ? '★' : '☆'} ${c.name}: <small>${c.desc}</small></span>`; }).join('')}<small class="stars">World stars ${worldStars(sel.world)}/${STARS_FOR_SECRET} open the secret stage</small></details>` : ''}
      ${(save.keys ?? []).includes(sel.world) ? (() => { const b = BONUS_STAGES[sel.world - 1]; return `<button class="pill big secret" data-play="${b.id}">🗝 ${b.name} <small>Lv ${b.lv[0]}–${b.lv[1]}</small></button>`; })() : sel.id.endsWith('-7') ? '<div class="lv" style="color:#ffd27a">🗝 A secret chest here hides this world\'s key</div>' : ''}
      <div class="lv buddy">🤝 Buddy <button class="pill" data-act="buddy">${save.buddy != null && save.buddy !== p.species && save.unlocked.includes(save.buddy) ? `<img src="art/kaiju-${save.buddy}.webp"> ${CLASSES.find(c => c.species === save.buddy)!.name}` : 'None'} ▸</button></div>
      <div class="playrow"><button class="pill go big" data-play="${sel.id}" ${stageUnlocked(sel) ? '' : 'disabled'}>${stageUnlocked(sel) ? '▶ PLAY' : '🔒 LOCKED'}</button><button class="pill online" data-act="online">🌐 ONLINE</button>${sel.maps && stageUnlocked(sel) && canSkip(sel) ? `<button class="pill skip" data-skip="${sel.id}" title="Hand in the drops for every map's exit and start in the boss room">⚡ SKIP TO BOSS</button><small class="skipinfo">no chillies · no stars · best rank A</small>` : ''}</div>
      ${(() => {
        const mode = save.nightmare && nightmareOk ? 'nm' : save.hard ? 'hard' : 'normal';
        return `<div class="diff"><button class="${mode === 'normal' ? 'on' : ''}" data-act="diff-normal">Normal</button><button class="${mode === 'hard' ? 'on' : ''} ${hardOk ? '' : 'locked'}" data-act="diff-hard">${hardOk ? '' : '🔒 '}Hard</button><button class="nmb ${mode === 'nm' ? 'on' : ''} ${nightmareOk ? '' : 'locked'}" data-act="diff-nm">${nightmareOk ? '💀' : '🔒'} Nightmare</button></div>`
          + (mode === 'hard' ? `<div class="lv dnote">Monsters +${HARD_LV} levels · better boxes</div>` : mode === 'nm' ? '<div class="lv dnote">Smarter, tougher monsters · a Golden Cloche every clear</div>' : '');
      })()}
      ${hero().cleared['1-10'] || (save.spicy ?? []).length ? (() => {
        const n = (save.spicy ?? []).length;
        return `<button class="mini chal ${n ? 'on' : ''}" data-act="spicyopen">🌶 Challenges${n ? ` (${n} on: +${n} box${n > 1 ? 'es' : ''}, +${25 * n}% crumbs)` : ''} ${spicyOpen ? '▾' : '▸'}</button>`
          + (spicyOpen ? `<div class="spicy">${SPICY_LIST.map(([k, ic, nm, ds]) => `<button class="chili ${(save.spicy ?? []).includes(k) ? 'on' : ''}" data-spicy="${k}" title="${ds}">${ic} ${nm}</button>`).join('')}<small>Optional: make a stage harder for an extra box and crumbs each.</small>${n && sel.maps && stageUnlocked(sel) && canSkip(sel) ? '<small class="skipwarn">Chillies don\'t apply when you skip to the boss</small>' : ''}</div>` : '');
      })() : ''}
    </div>
  </div>
  <p class="hint">Tip: double-tap ← or → to <b>dodge roll</b> through attacks. Beat every monster, then walk to the EXIT. Long stages mix arenas, climbs, ambushes, gates and miniboss rooms; stage 5 ends with an elite, stage 10 with the world boss.</p>`;
}

/** Challenges (spicy) row folded open in the stage panel? */
let spicyOpen = false;

const SPICY_LIST: [Spicy, string, string, string][] = [
  ['nopots', '🚫', 'No potions', 'The quick bag is locked for this stage'],
  ['glass', '💥', 'Glass jaw', 'You take double damage'],
  ['clock', '⏱', 'Beat the clock', 'Clear it within the par time or you lose'],
];

// ---------- hero ----------
function heroPage(): string {
  const p = hero(), d = derive(p);
  const cls = d.cls;
  const need = xpFor(p.level);
  const sugar = save.items.sugar ?? 0;
  const statRow = (s: Stat) => `<div><span>${s.toUpperCase()} <b>${d.prim[s]}</b><small>${STAT_INFO[s]}</small></span><span>${sugar ? `<button class="plus gold" data-sugar="${s}" title="Golden Sugar Cube">🧊</button>` : ''}<button class="plus" data-stat="${s}" ${p.statPts ? '' : 'disabled'}>+</button></span></div>`;
  const pct = (v: number) => `${Math.round(v * 100)}%`;
  const fit = selStageEl();
  return `<div class="hero">
    <div class="portrait"><img src="art/kaiju-${p.species}.webp"><h2>${cls.name}</h2><div class="role">${cls.role}</div>
      <div style="font-size:2.4vmin;margin-top:1vmin">Level ${p.level}</div><div class="bar"><i style="width:${Math.min(100, p.xp / need * 100)}%"></i></div><div style="font-size:1.7vmin;color:#b8a8b8">${p.xp} / ${need} XP</div></div>
    <div><div class="h3">Stats ${p.statPts ? `<span style="color:#ff8a8a">· ${p.statPts} points</span>` : ''}${sugar ? ` <span style="color:#ffd27a;font-size:1.8vmin">· ${sugar} Golden Sugar Cube${sugar > 1 ? 's' : ''} (gold button)</span>` : ''}</div>
      <div class="rows">${STATS.map(statRow).join('')}</div>
      <div style="display:flex;gap:1vmin;margin-top:1.2vmin"><button class="pill" data-act="auto" ${p.statPts ? '' : 'disabled'}>AUTO</button><button class="pill" data-act="reset">RESET</button></div>
      <div class="rows" style="margin-top:1.4vmin">
        <div><span>Attack</span><b>${d.atk}</b></div><div><span>Max HP</span><b>${d.maxHp}</b></div>
        <div><span>Defence</span><b>${d.def} <small style="display:inline">(-${pct(d.dr)})</small></b></div>
        <div><span>Crit</span><b>${d.crit.toFixed(1)}% × ${d.critDmg.toFixed(2)}</b></div>
        <div><span>Skill damage</span><b>${pct(d.skillDmg)}</b></div><div><span>Cooldowns</span><b>-${pct(d.cdr)}</b></div><div><span>Move speed</span><b>${pct(d.speed)}</b></div>
      </div></div>
    <div><div class="h3">Equipment <small style="color:#b8a8b8;font-family:Nunito;font-size:1.7vmin">worn in stages!</small></div><div class="slots">${(['weapon', 'armor', 'charm'] as Slot[]).map(s => {
      const it = p.equip[s];
      return `<button class="slot" data-eqslot="${s}">${iconHtml(it)}<div class="t">${it ? `<span style="color:${RARITY_CSS[it.rarity]};display:inline;font-size:2.1vmin">${esc(itemName(it))}</span><span>${itemLines(it).map(lineText).join(' · ')}${it.skill ? ` · ⭐ ${skillText(it)}` : ''}</span>` : `${SLOT_NAMES[s]}<span>Empty — tap to pick from the Bag</span>`}</div></button>`;
    }).join('')}</div>
    ${Object.entries(d.sets).filter(([, n]) => n >= 2).map(([k, n]) => `<div class="st" style="margin-top:1vmin"><b>${SETS[k].name}</b> ${n}/3: <span class="on">${SETS[k].two}</span>${n >= 3 ? ` · <span class="on">${SETS[k].three}</span>` : ''}</div>`).join('')}
    ${d.gear ? `<div class="gs">🗡 GEAR SKILL ${elsHtml(elementsOfGearSkill(d.gear))}<b>${d.gear.name}</b>${tickHtml(elementsOfGearSkill(d.gear), fit.se, fit.st.num)}: ${gearText(d.gear)} <small>(${isTouchDevice ? 'GEAR button' : 'F'}, ${d.gear.cd}s)</small></div>` : '<div class="gs">🗡 Equip a weapon to get a GEAR SKILL (its own button)</div>'}
    ${d.uniques.map(u => `<div class="uq">✦ ${UNIQUES[u].name}: ${UNIQUES[u].effect}</div>`).join('')}
    ${d.procs.map(k => `<div class="pr">⚡ ${PROCS[k].name}: ${PROCS[k].effect}</div>`).join('')}
    <button class="pill go" data-act="best" style="margin-top:1.2vmin">⚡ EQUIP BEST</button>
    ${selItem !== null && Object.values(p.equip).some(i => i?.id === selItem) ? detail(Object.values(p.equip).find(i => i?.id === selItem)!, true) : ''}</div>
  </div>`;
}

/** Set and named-legendary lines for an item. */
function specialHtml(it: Item): string {
  let out = '';
  const g = BASES[it.base].slot === 'weapon' ? gearSkillOf(it) : undefined;
  if (g) { const els = elementsOfGearSkill(g), fit = selStageEl(); out += `<div class="gs">🗡 Gear skill ${elsHtml(els)}<b>${g.name}</b>${tickHtml(els, fit.se, fit.st.num)}: ${gearText(g)}</div>`; }
  if (it.unique) { const u = UNIQUES[it.unique]; out += `<div class="uq">✦ ${u.for !== undefined ? `${CLASSES.find(c => c.species === u.for)?.name ?? ''} signature: ` : ''}${u.effect}</div>`; }
  if (it.proc) out += `<div class="pr">⚡ ${PROCS[it.proc].name}: ${PROCS[it.proc].effect}</div>`;
  if (it.set) {
    const set = SETS[it.set], worn = derive(hero()).sets[it.set] ?? 0;
    out += `<div class="st"><b>${set.name}</b> set (${worn}/3 worn)<br><span class="${worn >= 2 ? 'on' : ''}">2 pcs: ${set.two}</span><br><span class="${worn >= 3 ? 'on' : ''}">3 pcs: ${set.three}</span></div>`;
  }
  return out;
}

function skillText(it: Item): string { return it.skill!.id === 'all' ? `+${it.skill!.n} to all skills` : `+${it.skill!.n} ${SKILL_NAME[it.skill!.id] ?? it.skill!.id}`; }

/** Skills tab: the tree, or the skills list with the button loadout. */
let skillView: 'tree' | 'skills' = 'tree';
let selNode: string | null = null;
let pickSlot: number | null = null;
/** The element a tree node gives: a new skill's own, or the one an upgrade adds to its skill (Seed Spray+ starts to burn). */
function nodeEls(species: number, n: TreeNode): Element[] {
  if (n.kind === 'skill' && n.skill) return elementsOfSkill(n.skill);
  const base = n.mod && allActives(species).find(a => a.id === n.mod!.skill);
  if (!base) return [];
  const was = elementsOfSkill(base);
  return elementsOfSkill(base, n.mod!.mod).filter(e => !was.includes(e));
}
function treeHtml(p: HeroProfile): string {
  const paths = treeOf(p.species);
  const sel = selNode ? nodeById(p.species, selNode) : null;
  const col = (t: TreePath) => {
    const pts = pointsIn(p, t);
    return `<div class="tpath ${t.arch}"><div class="tph">${t.icon} ${t.name}<small>${pts} pts</small></div>${t.nodes.map((n, row) => {
      const r = rankOf(p, n.id), can = canLearn(p, n.id), open = (row === 0 || rankOf(p, t.nodes[row - 1].id) > 0) && pts >= n.need;
      return `<button class="tnode ${n.kind} ${r ? 'got' : ''} ${r >= n.ranks ? 'max' : ''} ${can ? 'can' : ''} ${open ? '' : 'shut'} ${selNode === n.id ? 'sel' : ''}" data-tnode="${n.id}"><i>${open ? n.icon : '🔒'}</i><b>${elsHtml(nodeEls(p.species, n))}${n.name}</b><u>${r}/${n.ranks}</u></button>`;
    }).join('')}</div>`;
  };
  const detail = sel ? (() => {
    const { node: n, path, row } = sel, r = rankOf(p, n.id), can = canLearn(p, n.id);
    const why = r >= n.ranks ? 'Maxed out' : p.level < nodeLv(row, r + 1) ? `Needs hero Lv ${nodeLv(row, r + 1)}` : p.skillPts <= 0 ? 'No points to spend (you get 1 per level)' : pointsIn(p, path) < n.need ? `Needs ${n.need} points in ${path.name} (you have ${pointsIn(p, path)})` : row > 0 && !rankOf(p, path.nodes[row - 1].id) ? `Learn ${path.nodes[row - 1].name} first` : '';
    return `<div class="tdetail"><b>${n.icon} ${elsHtml(nodeEls(p.species, n))}${n.name}</b> <small>${n.kind === 'skill' ? 'NEW SKILL' : n.kind === 'cap' ? 'CAPSTONE' : n.kind === 'mod' ? 'UPGRADE' : n.kind === 'mastery' ? 'MASTERY' : 'BOOST'} · rank ${r}/${n.ranks}</small><span>${n.desc}${n.stat && r ? ` <em>(now: ${statText(n.stat, n.kind === 'cap' ? 1 : r)})</em>` : ''}</span>
      <button class="pill ${can ? 'go' : ''}" data-learn="${n.id}" ${can ? '' : 'disabled'}>${can ? 'LEARN +1' : why}</button></div>`;
  })() : '<div class="tdetail hint">Tap a node to see what it does. Each path gets stronger the more points you put in it: its new skill opens at 5 points, its capstone at 15.</div>';
  return `<div class="tree">${paths.map(col).join('')}</div>${detail}`;
}

function skillsPage(): string {
  const p = hero(), d = derive(p), sk = skillsOf(p.species);
  const fit = selStageEl();
  const elsOf = (a: SkillDef) => elementsOfSkill(castOf(d, a));
  const mark = (els: Element[]) => tickHtml(els, fit.se, fit.st.num);
  const card = (s: { id: string; name: string; desc: string; unlock: number; kind?: SkillKind }, icon: string, extra: string, els: Element[] = []) => {
    const learned = p.skills[s.id] ?? 0, eff = d.skillLv[s.id] ?? 0;
    const locked = p.level < s.unlock;
    const nextLv = rankLv(s.unlock, learned + 1);
    const can = !locked && p.skillPts > 0 && learned < MAX_SKILL && p.level >= nextLv;
    const pips = Array.from({ length: Math.max(MAX_SKILL, eff) }, (_, i) => `<i class="${i < learned ? 'on' : i < eff ? 'bonus' : ''}"></i>`).join('');
    const br = s.kind ? branchesFor(s as SkillDef) : null, chosen = p.branch?.[s.id];
    const branchHtml = br ? (chosen ? `<span class="brc">⑂ ${br[chosen === 'a' ? 0 : 1].name}: ${br[chosen === 'a' ? 0 : 1].desc}</span>` : learned >= BRANCH_LV ? `<span class="brpick">Choose an upgrade: ${br.map(b => `<button class="pill go" data-branch="${s.id}:${b.id}">${b.name} <small>${b.desc}</small></button>`).join('')}</span>` : `<span class="brlock">⑂ Upgrade choice at skill Lv ${BRANCH_LV}: ${br[0].name} or ${br[1].name}</span>`) : '';
    return `<div class="skill ${locked ? 'locked' : ''}"><div class="ic">${icon}</div><div class="t"><b>${elsHtml(els)}${s.name}</b>${mark(els)} ${learned ? `Lv ${eff}` : ''}<span>${s.desc}</span><span>${locked ? `🔒 Unlocks at hero Lv ${s.unlock}` : learned ? extra : 'Not learned yet — spend a point'}${!locked && learned < MAX_SKILL && p.level < nextLv ? ` · next rank at hero Lv ${nextLv}` : ''}</span>${branchHtml}<div class="pips">${pips}</div></div>
      <button class="pill ${can ? 'go' : ''}" data-skill="${s.id}" ${can ? '' : 'disabled'}>+</button></div>`;
  };
  const head = `<div class="subtabs"><button class="${skillView === 'tree' ? 'on' : ''}" data-act="sv-tree">🌳 TREE</button><button class="${skillView === 'skills' ? 'on' : ''}" data-act="sv-skills">⚔ SKILLS</button>
      <span class="pts ${p.skillPts ? 'has' : ''}">${p.skillPts} point${p.skillPts === 1 ? '' : 's'} to spend</span>
      ${save.items.scroll ? `<button class="pill" data-act="scroll" style="font-size:1.7vmin;padding:0.5vmin 1.2vmin">📜 RESET POINTS ×${save.items.scroll}</button>` : ''}</div>`;
  if (skillView === 'tree') return head + treeHtml(p);
  const lo = d.actives, mine = allActives(p.species).filter(a => skillUnlocked(p, a.id));
  const loadout = `<div class="loadout"><span>Buttons:</span>${lo.map((a, i) => `<button class="slot ${pickSlot === i ? 'on' : ''}" data-slot="${i}"><i>${i + 1}</i>${SKILL_ICON[a.kind] ?? '★'} ${elsHtml(elsOf(a))}${a.name}${mark(elsOf(a))}</button>`).join('')}
      ${pickSlot !== null ? `<div class="pick">Put on button ${pickSlot + 1}: ${mine.map(a => `<button class="pill ${lo[pickSlot!]?.id === a.id ? 'go' : ''}" data-equipskill="${a.id}">${SKILL_ICON[a.kind] ?? '★'} ${elsHtml(elsOf(a))}${a.name}${mark(elsOf(a))}</button>`).join('')}</div>` : '<small>Tap a button to swap in another skill. New skills come from the 🌳 tree.</small>'}</div>
    ${fitNote()}<div class="fitnote">${elHtml(GUARD_BREAK_ELEMENT)} Guard Break (hold DOWN and attack) is ${ELEMENT_INFO[GUARD_BREAK_ELEMENT].name}: every kaiju has it${mark([GUARD_BREAK_ELEMENT])}</div>`;
  const line = (a: SkillDef) => `${lo.includes(a) ? `Button ${lo.indexOf(a) + 1}` : 'Not on a button'} · ${a.kind === 'buff' ? `${a.buff?.t}s buff` : a.kind === 'heal' ? 'heal' : `${Math.round(a.dmg * 100)}% dmg`} · ${a.cd}s cooldown`;
  return `${head}${loadout}
    <div class="skills">${mine.map(a => card(a, SKILL_ICON[a.kind] ?? '★', line(a), elsOf(a))).join('')}
    ${card(sk.passive, '💗', 'Passive: always on')}
    ${ULTS[p.species] ? `<div class="skill ult ${p.level < ULT_LV ? 'locked' : ''}"><div class="ic">🔥</div><div class="t"><b>${elsHtml(elementsOfSkill(ULTS[p.species]))}ULTIMATE: ${ULTS[p.species].name}</b>${mark(elementsOfSkill(ULTS[p.species]))}<span>${ULTS[p.species].desc}</span><span>${p.level < ULT_LV ? `🔒 Unlocks at hero Lv ${ULT_LV}` : 'Fill the gauge by landing and taking hits, then press ULT (key U). Invincible while it plays.'}</span></div></div>` : ''}</div>`;
}

// ---------- bag ----------
function sortedBag(slot: Slot): Item[] {
  return save.bag.filter(i => BASES[i.base].slot === slot && (!bagMine || canWear(i, save.selected))).sort((a, b) => b.rarity - a.rarity || b.ilvl - a.ilvl || b.plus - a.plus || b.id - a.id);
}

function bagPage(): string {
  const counts: Record<BagTab, number> = { weapon: 0, armor: 0, charm: 0, items: Object.values(save.items).reduce((a, b) => a + (b ?? 0), 0) + Object.values(save.drops ?? {}).reduce((a: number, b) => a + (b ?? 0), 0) };
  for (const it of save.bag) counts[BASES[it.base].slot]++;
  const sub = `<div class="subtabs">${(['weapon', 'armor', 'charm', 'items'] as BagTab[]).map(t => `<button class="${bagTab === t ? 'on' : ''}" data-bag="${t}">${t === 'items' ? 'Items' : SLOT_NAMES[t as Slot] + 's'} <small>${counts[t]}</small></button>`).join('')}
    <label class="mine"><input type="checkbox" data-act="mine" ${bagMine ? 'checked' : ''}> Only ${CLASSES.find(c => c.species === save.selected)!.name}'s gear</label>
    <span style="flex:1"></span><button class="pill" data-act="best">⚡ EQUIP BEST</button><button class="pill" data-act="salvage-worse">🍪 SALVAGE WORSE</button></div>`;
  if (bagTab === 'items') return sub + itemsTab();
  const bag = sortedBag(bagTab);
  const sel = bag.find(i => i.id === selItem) ?? bag[0];
  if (sel) selItem = sel.id;
  return sub + (bag.length ? `<div class="bagwrap"><div><div class="legend">▲ better / ▼ worse than what <b>${CLASSES.find(c => c.species === save.selected)!.name}</b> wears · 🔒 locked items are never salvaged</div>
    <div class="grid">${bag.map(it => iconHtml(it, `data-item="${it.id}" style="--rc:${RARITY_CSS[it.rarity]};background-image:url(art/${itemIcon(it)}.webp);${it.id === selItem ? 'outline:3px solid #fff' : ''}"`, badgeFor(it))).join('')}</div></div>
    ${sel ? detail(sel, false) : ''}</div>` : `<div class="empty">No ${SLOT_NAMES[bagTab].toLowerCase()}s yet. Open boxes or visit the Market!</div>`);
}

/** Monster drops in the bag (map exits take them; a stage's full set skips it to the boss). */
function dropsHtml(): string {
  const d = Object.entries(save.drops ?? {}).filter(([, n]) => (n ?? 0) > 0) as [MobKind, number][];
  return `<div class="h3" style="margin-top:1.6vmin">Monster drops <small style="color:#b8a8b8;font-family:Nunito;font-size:1.8vmin">map exits ask for them · a stage's whole set skips it to the boss</small></div>${d.length ? `<div class="dlist">${d.map(([k, n]) => `<span><img src="art/drop-${k}.webp" onerror="this.style.visibility='hidden'"><b>${dropName(k)} ×${n}</b><small>${MOB_DEFS[k].name}</small></span>`).join('')}</div>` : '<div class="empty">None yet: monsters drop them in stages.</div>'}`;
}
/** Do you hold every map exit's drops for this stage? */
function canSkip(s: StageDef): boolean {
  if (!s.maps) return false;
  const need: Record<string, number> = {};
  for (const m of s.maps) if (m.goal?.kind === 'collect') for (const q of m.goal.wants) need[q.mob] = (need[q.mob] ?? 0) + q.n;
  return Object.keys(need).length > 0 && Object.entries(need).every(([k, v]) => (save.drops?.[k] ?? 0) >= v);
}
function itemsTab(): string {
  const owned = (Object.keys(CONSUMABLES) as ConsumableId[]).filter(id => (save.items[id] ?? 0) > 0);
  return `<div class="h3">Quick bag <small style="color:#b8a8b8;font-family:Nunito;font-size:1.8vmin">4 slots you can tap in stages (keys 1-4). Pick an item, then tap a slot.</small></div>
    <div class="qslots">${Array.from({ length: QUICK_SLOTS }, (_, i) => { const id = save.quick[i]; return `<button class="qs ${selConsumable ? 'pick' : ''}" data-qslot="${i}">${id ? `<img src="${cIcon(id)}"><b>${save.items[id] ?? 0}</b>` : '<span>empty</span>'}<i>${i + 1}</i></button>`; }).join('')}</div>
    <div class="h3" style="margin-top:1.6vmin">Items</div>
    ${dropsHtml()}
    ${owned.length ? `<div class="clist">${owned.map(id => { const c = CONSUMABLES[id]; return `<button class="citem ${selConsumable === id ? 'on' : ''}" data-cons="${id}"><img src="${cIcon(id)}"><div><b>${c.name} ×${save.items[id]}</b><span>${c.desc}</span><span class="${c.quick ? 'ok' : 'cmp'}">${c.quick ? 'Quick bag item' : id === 'revive' ? 'Works automatically' : 'Use at camp (Hero / Skills)'}</span></div></button>`; }).join('')}</div>` : '<div class="empty">No items. Buy potions at the Market!</div>'}`;
}

function detail(it: Item, equipped: boolean): string {
  const p = hero();
  const slot = BASES[it.base].slot;
  const cur = p.equip[slot];
  const fc = fortCost(it), chance = Math.round(fortChance(it.plus) * 100);
  const cmp = equipped ? null : compare(save.selected, it);
  return `<div class="detail"><div style="display:flex;gap:1.2vmin;align-items:center">${iconHtml(it)}<div><h3 style="color:${RARITY_CSS[it.rarity]}">${esc(itemName(it))}</h3>${RARITY_NAMES[it.rarity]} ${SLOT_NAMES[slot]}${ownerOf(it) !== undefined ? ` · <b class="for">For ${ownerName(it)}</b>` : ' · any kaiju'} · iLv ${it.ilvl} · Grade <b style="color:${GRADE_CSS[gradeOf(it)]}">${GRADES[gradeOf(it)]}</b> <small>(×${GRADE_MUL[gradeOf(it)]})</small></div></div>
    <div style="margin-top:1vmin">${itemLines(it).map(l => `<div class="ln">${lineText(l)}</div>`).join('')}${it.skill ? `<div class="skl">⭐ ${skillText(it)}</div>` : ''}${specialHtml(it)}</div>
    ${cmp && cmp.pct !== -Infinity ? `<div class="cmpbox"><div class="${cmp.pct >= 0 ? 'up' : 'dn'}">${cmp.pct >= 0.5 ? '▲' : cmp.pct <= -0.5 ? '▼' : '='} ${cmp.pct >= 0 ? '+' : ''}${cmp.pct.toFixed(1)}% overall vs ${cur ? esc(itemName(cur)) : 'nothing'}</div>
      ${cmp.diff.map(d => `<span class="${d.v > 0 ? 'up' : 'dn'}">${d.k.replace(/^(\w+) Lv$/, (_, id) => (SKILL_NAME[id] ?? id) + ' Lv')} ${d.v > 0 ? '+' : ''}${d.v}${d.pct ? '%' : ''}</span>`).join('')}</div>` : ''}
    <div class="btns">
      ${equipped ? `<button class="pill" data-act="unequip" data-slot="${slot}">UNEQUIP</button>` : (canWear(it, save.selected) ? `<button class="pill go" data-act="equip" data-id="${it.id}">EQUIP</button>` : `<button class="pill" disabled>ONLY ${ownerName(it).toUpperCase()}</button>`)}
      ${equipped ? '' : `<button class="pill" data-act="lock" data-id="${it.id}">${isLocked(it.id) ? '🔓 UNLOCK' : '🔒 LOCK'}</button><button class="pill" data-act="salvage" data-id="${it.id}" ${isLocked(it.id) ? 'disabled' : ''}>SALVAGE +🍪${salvageValue(it)}</button>`}
    </div>
    <div class="forge">
      <div class="h3" style="font-size:2.2vmin;margin:0">⚒ Fortify <small>+${it.plus} → +${Math.min(MAX_PLUS, it.plus + 1)} · stats ×${fortMul(it.plus).toFixed(2)} → ×${fortMul(Math.min(MAX_PLUS, it.plus + 1)).toFixed(2)}</small></div>
      ${it.plus >= MAX_PLUS ? '<div class="up">Maxed at +15!</div>' : `<div><b class="${chance >= 80 ? 'up' : chance >= 40 ? '' : 'dn'}">${chance}% success</b>${fortRisky(it.plus) ? ' · <span class="dn">fail = drop to +' + (it.plus - 1) + '</span>' : ' · fail = nothing lost but materials'}</div>
      <div class="fbtns"><button class="pill ${canFortify(it) ? 'go' : ''}" data-act="fortify" data-id="${it.id}" ${canFortify(it) ? '' : 'disabled'}>FORTIFY 🍪${fc.crumbs} + 🪨${fc.stones}</button>
      ${fortRisky(it.plus) ? `<label class="safe"><input type="checkbox" data-act="safety" ${useSafety ? 'checked' : ''} ${save.items.safety ? '' : 'disabled'}> Safety Charm (${save.items.safety ?? 0})</label>` : ''}</div>
      <div class="have">You have 🪨 ${save.items.fstone ?? 0} Fortify Stones</div>`}
      <div class="h3" style="font-size:2.2vmin;margin:1vmin 0 0">💎 Grade <small>D ×0.85 · C ×1 · B ×1.12 · A ×1.25 · S ×1.4</small></div>
      <div class="fbtns"><button class="pill" data-act="regrade" data-id="${it.id}" ${save.items.gstone ? '' : 'disabled'}>RE-GRADE (${save.items.gstone ?? 0}) <small>can go down</small></button>
      <button class="pill ${save.items.ggstone ? 'go' : ''}" data-act="regrade-gold" data-id="${it.id}" ${save.items.ggstone && gradeOf(it) < 4 ? '' : 'disabled'}>GOLDEN (${save.items.ggstone ?? 0}) <small>never down</small></button></div>
      ${reseasonHtml(it)}
    </div></div>`;
}

// ---------- re-season (Market tab and the weapon's item card) ----------
/** the element picked for the weapon being looked at (nothing is paid until RE-SEASON is tapped) */
let reEl: Element | null = null, reFor: number | null = null;
/** Market: which weapon is picked */
let reItem: number | null = null;
let marketView: 'shop' | 'reseason' = 'shop';
const RESEASON_LINE = `Give an ordinary weapon's gear skill a new element: ${RESEASON_ELEMENTS.map(e => ELEMENT_INFO[e].icon).join(' ')}. Its stats stay the same.`;
/** Pick an element, see the new name and gear skill and the price, then pay. Weapons only ('' for armour and charms). */
function reseasonHtml(it: Item): string {
  if (BASES[it.base].slot !== 'weapon') return '';
  if (reFor !== it.id) { reFor = it.id; reEl = null; }
  const head = '<div class="h3" style="font-size:2.2vmin;margin:1vmin 0 0">🧂 Re-season <small>a new element for its gear skill · stats stay</small></div>';
  if (!canReseason(it)) return `${head}<div class="have">Not for ${it.unique ? 'named legendaries' : 'boss weapons'}: their gear skill is their own.</div>`;
  if (reEl && reseasonBlock(it, reEl) === 'same') reEl = null;
  const pick = RESEASON_ELEMENTS.map(e => {
    const same = reseasonBlock(it, e) === 'same', i = ELEMENT_INFO[e];
    return `<button class="pill ${reEl === e ? 'go' : ''}" data-reel="${e}" ${same ? 'disabled' : ''}>${same ? `already ${i.icon}` : `${i.icon} ${i.name}`}</button>`;
  }).join('');
  let pv = `<div class="have">Pick an element to see the new skill and the price.</div>`;
  if (reEl) {
    const after: Item = JSON.parse(JSON.stringify(it)); reseasonItem(after, reEl);
    const g = gearSkillOf(after), els = elementsOfGearSkill(g), fit = selStageEl();
    const cost = reseasonCost(it), short = reseasonBlock(it, reEl) === 'crumbs';
    pv = `<div class="repv">Becomes <b style="color:${RARITY_CSS[it.rarity]}">${esc(itemName(after))}</b><br>🗡 ${elsHtml(els)}<b>${g?.name ?? ''}</b>${tickHtml(els, fit.se, fit.st.num)}: ${g ? gearText(g) : ''}</div>
      <div class="fbtns"><button class="pill ${short ? '' : 'go'}" data-act="reseason" data-id="${it.id}" data-el="${reEl}" ${short ? 'disabled' : ''}>${short ? `Need 🍪 ${cost - save.crumbs} more crumbs` : `RE-SEASON 🍪 ${cost}`}</button>${short ? `<span class="have">costs 🍪 ${cost}</span>` : ''}</div>`;
  }
  return `${head}<div class="fbtns">${pick}</div>${pv}`;
}
/** Market: your ordinary weapons (the one you wear first), pick one, then the same block as on its item card. */
function reseasonPage(): string {
  const worn = hero().equip.weapon;
  const list = [...(worn && canReseason(worn) ? [worn] : []), ...sortedBag('weapon').filter(i => canReseason(i))];
  const it = list.find(i => i.id === reItem) ?? list[0];
  reItem = it?.id ?? null;
  const g = it ? gearSkillOf(it) : undefined;
  return `<div class="purse">You have <b>🍪 ${save.crumbs}</b> crumbs. ${RESEASON_LINE} Named legendaries and boss weapons keep their own.</div>
    ${it ? `<div class="reswrap"><div><div class="grid">${list.map(w => iconHtml(w, `data-reitem="${w.id}" style="--rc:${RARITY_CSS[w.rarity]};background-image:url(art/${itemIcon(w)}.webp);${w.id === it.id ? 'outline:3px solid #fff' : ''}"`, w === worn ? '<span class="cmp eq">worn</span>' : '')).join('')}</div></div>
      <div class="detail"><div style="display:flex;gap:1.2vmin;align-items:center">${iconHtml(it)}<div><h3 style="color:${RARITY_CSS[it.rarity]}">${esc(itemName(it))}</h3>${RARITY_NAMES[it.rarity]} Weapon · iLv ${it.ilvl}${it === worn ? ' · worn' : ''}</div></div>
        ${g ? `<div class="gs">🗡 Now: ${elsHtml(elementsOfGearSkill(g))}<b>${g.name}</b>: ${gearText(g)}</div>` : ''}
        <div class="forge">${reseasonHtml(it)}</div></div></div>` : `<div class="empty">No ordinary weapons for ${CLASSES.find(c => c.species === save.selected)!.name} to re-season yet. Open boxes or buy one in the shop.</div>`}`;
}

// ---------- market ----------
function marketPage(): string {
  const stock = shopStock();
  const sub = `<div class="subtabs"><button class="${marketView === 'shop' ? 'on' : ''}" data-act="mv-shop">🛒 SHOP</button><button class="${marketView === 'reseason' ? 'on' : ''}" data-act="mv-reseason">🧂 RE-SEASON</button></div>`;
  if (marketView === 'reseason') return sub + reseasonPage();
  return `${sub}<div class="market">
    <div><div class="h3">Pantry Market <small style="color:#b8a8b8;font-family:Nunito;font-size:1.8vmin">Gear restocks every day.</small></div>
      <div class="purse">You have <b>🍪 ${save.crumbs}</b> crumbs. Earn more by beating monsters, clearing stages and salvaging gear.</div>
      <div class="clist">${SHOP_ITEMS.map(id => { const c = CONSUMABLES[id]; return `<div class="citem"><img src="${cIcon(id)}"><div><b>${c.name}</b> <small>(own ${save.items[id] ?? 0})</small><span>${c.desc}</span></div><button class="pill ${save.crumbs >= c.price ? 'go' : ''}" data-buy="${id}" data-price="${c.price}">🍪 ${c.price}</button></div>`; }).join('')}
      ${SHOP_BOXES.map((b, i) => `<div class="citem"><img src="art/box-${b.tier}.webp"><div><b>${TIER_NAMES[b.tier]}</b><span>Loot box (gear at your progress level)</span></div><button class="pill ${save.crumbs >= b.price ? 'go' : ''}" data-buybox="${i}" data-price="${b.price}">🍪 ${b.price}</button></div>`).join('')}</div></div>
    <div><div class="h3">Today's gear</div>
      ${stock.length ? stock.map(it => { const c = compare(save.selected, it); const price = gearPrice(it); return `<div class="gearoffer">${iconHtml(it, '', badgeFor(it))}<div class="t"><b style="color:${RARITY_CSS[it.rarity]}">${elsHtml(elementsOfGear(it))}${esc(itemName(it))}</b><span>${RARITY_NAMES[it.rarity]} ${SLOT_NAMES[BASES[it.base].slot]} · iLv ${it.ilvl}</span><span class="ln">${itemLines(it).map(lineText).join(' · ')}${it.skill ? ` · ⭐ ${skillText(it)}` : ''}</span>${c.pct === -Infinity ? `<span class="for">For ${ownerName(it)}</span>` : `<span class="${c.pct >= 0 ? 'up' : 'dn'}">${c.pct >= 0 ? '+' : ''}${c.pct.toFixed(1)}% for ${CLASSES.find(x => x.species === save.selected)!.name}</span>`}</div><button class="pill ${save.crumbs >= price ? 'go' : ''}" data-buygear="${it.id}" data-price="${price}">🍪 ${price}</button></div>`; }).join('') : '<div class="empty">Sold out! Come back tomorrow.</div>'}
    </div></div>`;
}

const C_NAMES: Record<string, string> = Object.fromEntries(Object.entries(CONSUMABLES).map(([k, v]) => [k, v.name]));
function questsPage(): string {
  const qs = dailyQuests();
  const allDone = qs.every(q => q.claimed);
  const me = CLASSES.find(c => c.species === save.selected)!;
  const kq = kaijuQuestState(save.selected);
  checkUnlocks();
  return `<div class="quests"><div><div class="h3">${me.name}'s quests <small>${STORIES[me.species]?.tagline ?? ''}</small></div>
    ${kq.map(q => { const done = q.prog >= q.goal; return `<div class="quest ${q.claimed ? 'claimed' : ''}"><div class="t"><b>${q.title}</b> <span>${q.text}</span><div class="bar"><i style="width:${q.prog / q.goal * 100}%"></i></div><span>${q.prog} / ${q.goal} · ${q.reward.sigCharm ? '⭐ Signature charm + ' : ''}${rewardText({ crumbs: q.reward.crumbs, box: q.reward.box, items: { fstone: q.reward.fstone ?? 0, gstone: q.reward.gstone ?? 0, ggstone: q.reward.ggstone ?? 0 } }, C_NAMES)}</span></div>
      <button class="pill ${done && !q.claimed ? 'go' : ''}" data-claimk="${q.id}" ${done && !q.claimed ? '' : 'disabled'}>${q.claimed ? '✓' : 'CLAIM'}</button></div>`; }).join('')}
    <div class="h3" style="margin-top:1.6vmin">Daily quests <small>new ones every day</small></div>
    ${qs.map((q, i) => { const done = q.prog >= q.def.goal; return `<div class="quest ${q.claimed ? 'claimed' : ''}"><div class="t"><b>${q.text}</b><div class="bar"><i style="width:${q.prog / q.def.goal * 100}%"></i></div><span>${q.prog} / ${q.def.goal} · ${rewardText(q.def.reward, C_NAMES)}</span></div>
      <button class="pill ${done && !q.claimed ? 'go' : ''}" data-claimq="${i}" ${done && !q.claimed ? '' : 'disabled'}>${q.claimed ? '✓' : 'CLAIM'}</button></div>`; }).join('')}
    <div class="quest bonus"><div class="t"><b>⭐ Finish all 3</b><span>${rewardText(DAILY_BONUS, C_NAMES)}</span></div><button class="pill ${allDone ? 'go' : ''}" data-act="bonus" ${allDone ? '' : 'disabled'}>CLAIM</button></div></div>
    <div><div class="h3">Recruit kaiju <small>finish a challenge to unlock a new kaiju (starts at 1-1)</small></div>
    ${unlockProgress().map(u => `<div class="quest ${u.done ? 'claimed' : ''}"><img class="rq" src="art/kaiju-${u.species}.webp"><div class="t"><b>${CLASSES.find(c => c.species === u.species)!.name}</b> <span>${u.text}</span><div class="bar"><i style="width:${u.prog / u.goal * 100}%"></i></div><span>${u.done ? 'Unlocked!' : `${u.prog} / ${u.goal}`}</span></div></div>`).join('')}
    <div class="h3" style="margin-top:1.6vmin">Achievements</div>${achievements().map(x => `<div class="quest ${x.maxed ? 'claimed' : ''}"><div class="t"><b>${x.a.name} ${'★'.repeat(x.claimed)}${'☆'.repeat(x.a.tiers.length - x.claimed)}</b>
      ${x.maxed ? '<span>Complete!</span>' : `<div class="bar"><i style="width:${Math.min(100, x.prog / x.goal * 100)}%"></i></div><span>${Math.min(x.prog, x.goal)} / ${x.goal} · ${rewardText(x.a.reward(x.claimed), C_NAMES)}</span>`}</div>
      <button class="pill ${x.done ? 'go' : ''}" data-claima="${x.a.id}" ${x.done ? '' : 'disabled'}>${x.maxed ? '✓' : 'CLAIM'}</button></div>`).join('')}</div></div>`;
}
void ACHIEVEMENTS;

function boxesPage(): string {
  if (!save.boxes.length) return '<div class="empty">No boxes. Beat monsters in stages: they drop boxes, and clearing a stage gives more!</div>';
  const tiers = [5, 4, 3, 2, 1] as BoxTier[];
  return `<div class="h3">Loot boxes <button class="pill go" data-act="open-all" style="font-size:2vmin;padding:0.8vmin 1.8vmin">OPEN ALL (${save.boxes.length})</button></div>
    <div class="boxes">${tiers.filter(t => save.boxes.some(b => b.tier === t)).map(t => `<button class="boxcard" data-box="${t}" style="--tc:${TIER_CSS[t]}"><img src="art/box-${t}.webp"><div class="n">×${save.boxes.filter(b => b.tier === t).length}</div><div class="nm">${TIER_NAMES[t]}</div></button>`).join('')}</div>
    <p style="color:#b8a8b8;font-size:2vmin">Better boxes roll rarer gear: Common → Uncommon → Rare → Epic → Legendary. Epic and Legendary gear can boost skills. Item level follows the monsters that dropped it.</p>`;
}

/** Every data attribute the camp's one click handler answers to. A button whose attribute is left out of this list looks
 *  fine and does nothing (the Challenges chillies and SKIP TO BOSS were dead that way): tests/camp-clicks.test.ts checks
 *  that every `ds.<name>` the handler reads is listed here. */
const CLICKABLE = '[data-tab],[data-hero],[data-node],[data-play],[data-stat],[data-sugar],[data-skill],[data-item],[data-act],[data-box],[data-eqslot],[data-bag],[data-cons],[data-qslot],[data-buy],[data-buybox],[data-buygear],[data-branch],[data-mappage],[data-claimq],[data-claima],[data-replay],[data-claimk],[data-free],[data-tnode],[data-learn],[data-slot],[data-equipskill],[data-reel],[data-reitem],[data-spicy],[data-skip]';
function onClick(e: MouseEvent): void {
  const t = (e.target as HTMLElement).closest<HTMLElement>(CLICKABLE);
  if (!t || (t as HTMLButtonElement).disabled) return;
  sfx('click');
  const sp = save.selected;
  const ds = t.dataset;
  if (ds.tab) { tab = ds.tab as Tab; selItem = null; }
  else if (ds.hero) {
    const sp = Number(ds.hero);
    if (save.unlocked.includes(sp)) { save.selected = sp; selStage = null; persist(); }
    else { const u = unlockProgress().find(x => x.species === sp); flash = `🔒 ${CLASSES.find(c => c.species === sp)!.name}: ${u?.text} (${u?.prog}/${u?.goal})`; }
  }
  else if (ds.claimq) { const r = claimQuest(Number(ds.claimq)); if (r) { flash = 'Quest reward: ' + r; sfx('levelup'); } }
  else if (ds.claima) { const r = claimAch(ds.claima); if (r) { flash = 'Achievement reward: ' + r; sfx('reveal3'); } }
  else if (ds.free) { hideCamp(); startFree(ds.free as FreeMode); return; }
  else if (ds.node) selStage = ds.node;
  else if (ds.mappage) { const m = MAPS[Number(ds.mappage)]; selStage = [...STAGES].reverse().find(x => m.worlds.includes(x.world) && stageUnlocked(x))?.id ?? `${m.worlds[0]}-1`; }
  else if (ds.skip) { const s = stageById(ds.skip); if (stageUnlocked(s) && canSkip(s)) { hideCamp(); onPlay(s.id, true); } return; }
  else if (ds.play) {
    const s = stageById(ds.play);
    if (!stageUnlocked(s)) return;
    const p = hero();
    const beats = beatBefore(s.id, !p.seen.includes('intro')).filter(b => !p.seen.includes(b) && !(save.storyMode === 'key' && isMinorBeat(b)));
    p.seen.push(...beats); persist();
    playStory(p.species, beats, () => { hideCamp(); onPlay(s.id); });
    return;
  }
  else if (ds.replay) { const [id, sp] = [ds.replay, save.selected]; playStory(sp, [...beatBefore(id, id === '1-1'), ...(id.endsWith('-10') ? [`w${id.split('-')[0]}-after`] : [])].filter(b => hero().seen.includes(b)), () => render()); return; }
  else if (ds.claimk) { const r = claimKaijuQuest(save.selected, ds.claimk); if (r) { flash = 'Quest reward: ' + r; sfx('reveal3'); } }
  else if (ds.stat) spendStat(sp, ds.stat as Stat);
  else if (ds.spicy) { const k = ds.spicy as Spicy, cur = save.spicy ?? []; save.spicy = cur.includes(k) ? cur.filter(x => x !== k) : [...cur, k]; persist(); }
  else if (ds.sugar) { if (useSugar(sp, ds.sugar as Stat)) flash = `Golden Sugar Cube: +1 ${ds.sugar.toUpperCase()} forever!`; }
  else if (ds.skill) levelSkill(sp, ds.skill);
  else if (ds.tnode) selNode = selNode === ds.tnode ? null : ds.tnode;
  else if (ds.learn) { const f = nodeById(sp, ds.learn); if (learnNode(sp, ds.learn)) { sfx('levelup'); if (f?.node.skill) { flash = loadoutOf(hero()).some(s => s.id === f.node.skill!.id) ? `New skill: ${f.node.skill.name}! It's on your buttons (swap them in ⚔ SKILLS)` : `New skill: ${f.node.skill.name}! Put it on a button in ⚔ SKILLS`; } } }
  else if (ds.slot) pickSlot = pickSlot === Number(ds.slot) ? null : Number(ds.slot);
  else if (ds.equipskill) { if (pickSlot !== null && setLoadout(sp, pickSlot, ds.equipskill)) { flash = 'Skill set on the button'; pickSlot = null; } }
  else if (ds.branch) { const [id, b] = ds.branch.split(':'); if (chooseBranch(sp, id, b as 'a' | 'b')) flash = 'Upgrade chosen! (A Recipe Scroll resets it)'; }
  else if (ds.reel) reEl = reEl === ds.reel ? null : ds.reel as Element;
  else if (ds.reitem) reItem = Number(ds.reitem);
  else if (ds.item) selItem = Number(ds.item);
  else if (ds.bag) { bagTab = ds.bag as BagTab; selItem = null; }
  else if (ds.cons) selConsumable = selConsumable === ds.cons ? null : ds.cons as ConsumableId;
  else if (ds.qslot) {
    const i = Number(ds.qslot);
    if (selConsumable && CONSUMABLES[selConsumable].quick) { setQuick(i, selConsumable); selConsumable = null; }
    else if (selConsumable) { flash = `${CONSUMABLES[selConsumable].name} can't go in the quick bag`; selConsumable = null; }
    else setQuick(i, null);
  }
  else if (ds.eqslot) { const it = hero().equip[ds.eqslot as Slot]; selItem = it ? it.id : null; if (!it) { tab = 'bag'; bagTab = ds.eqslot as Slot; } }
  else if (ds.box) { const i = save.boxes.findIndex(b => b.tier === Number(ds.box)); if (i >= 0) runGacha([i]); return; }
  else if ((ds.buy || ds.buybox || ds.buygear) && save.crumbs < Number(ds.price ?? 0)) flash = `Not enough crumbs: need 🍪 ${Number(ds.price) - save.crumbs} more. Beat monsters and clear stages to earn them.`;
  else if (ds.buy) { if (buyConsumable(ds.buy as ConsumableId)) flash = `Bought ${CONSUMABLES[ds.buy as ConsumableId].name}`; }
  else if (ds.buybox) { if (buyBox(Number(ds.buybox))) flash = 'Box bought! Open it in Boxes'; }
  else if (ds.buygear) { if (buyGear(Number(ds.buygear))) flash = 'Bought! It is in your Bag'; }
  else if (ds.act) {
    const find = (id: number) => save.bag.find(i => i.id === id) ?? Object.values(hero().equip).find(i => i?.id === id);
    switch (ds.act) {
      case 'auto': autoStats(sp); break;
      case 'reset': resetStats(sp); break;
      case 'equip': equip(sp, Number(ds.id)); break;
      case 'unequip': unequip(sp, ds.slot as Slot); break;
      case 'fortify': {
        const it = find(Number(ds.id));
        const r = it && fortify(it, useSafety);
        if (r) { track('fortifies'); track('maxPlus', r.to); }
        if (r) { flash = r.ok ? `⚒ SUCCESS! Now +${r.to}` : r.saved ? 'Failed... the Safety Charm kept your level' : r.to < r.from ? `💥 Failed! Dropped to +${r.to}` : 'Failed... (materials used)'; sfx(r.ok ? 'levelup' : 'fail'); }
        break;
      }
      case 'safety': useSafety = !useSafety; break;
      case 'regrade': case 'regrade-gold': {
        const it = find(Number(ds.id));
        const r = it && regrade(it, ds.act === 'regrade-gold');
        if (r) { flash = r.to > r.from ? `💎 Grade up! ${GRADES[r.from]} → ${GRADES[r.to]}` : r.to < r.from ? `Grade down... ${GRADES[r.from]} → ${GRADES[r.to]}` : `Grade stayed ${GRADES[r.to]}`; sfx(r.to > r.from ? 'reveal3' : 'click'); }
        break;
      }
      case 'reseason': {
        const paid = reseason(Number(ds.id), ds.el as Element), it = findWeapon(Number(ds.id));
        if (paid && it) { flash = `🧂 Re-seasoned for 🍪 ${paid}: now ${esc(itemName(it))}`; sfx('levelup'); reEl = null; }
        break;
      }
      case 'mv-shop': marketView = 'shop'; break;
      case 'mv-reseason': marketView = 'reseason'; break;
      case 'lock': toggleLock(Number(ds.id)); break;
      case 'salvage': salvage(Number(ds.id)); selItem = null; break;
      case 'salvage-worse': { const r = salvageWorse(); flash = r.n ? `Salvaged ${r.n} item${r.n > 1 ? 's' : ''} worse than every hero's gear: +🍪${r.crumbs}` : 'Nothing to salvage: every item beats someone\'s gear (or is locked)'; selItem = null; break; }
      case 'best': { const n = equipBest(sp); flash = n ? `Equipped ${n} better item${n > 1 ? 's' : ''}` : 'Already wearing the best gear in your bag'; break; }
      case 'scroll': if (useScroll(sp)) flash = 'Skill points refunded!'; break;
      case 'hard': save.hard = !save.hard; if (!save.hard) save.nightmare = false; persist(); break;
      case 'diff-normal': save.hard = false; save.nightmare = false; persist(); break;
      case 'diff-hard': {
        const w = stageById(selStage ?? '1-1').world;
        if (!hardUnlocked(w)) { flash = `🔒 Hard: beat World ${w}'s boss first`; break; }
        save.hard = true; save.nightmare = false; persist(); break;
      }
      case 'diff-nm': {
        const w = stageById(selStage ?? '1-1').world;
        if (!hero().hardCleared[`${w}-10`]) { flash = `🔒 Nightmare: beat World ${w}'s boss on Hard first`; break; }
        save.hard = true; save.nightmare = true; persist(); break;
      }
      case 'spicyopen': spicyOpen = !spicyOpen; break;
      case 'nightmare': save.nightmare = !save.nightmare; if (save.nightmare) save.hard = true; persist(); break;
      case 'online': hideCamp(); onOnline(); return;
      case 'buddy': { // cycle: none → each unlocked kaiju except the one you're playing → none
        const opts: (number | null)[] = [null, ...save.unlocked.filter(s => s !== save.selected)];
        const i = opts.indexOf(save.buddy ?? null);
        save.buddy = opts[(i + 1) % opts.length]; persist();
        flash = save.buddy == null ? 'Going solo' : `${CLASSES.find(c => c.species === save.buddy)!.name} will fight beside you (CPU). Monsters get a bit tougher.`;
        break;
      }
      case 'storymode': save.storyMode = save.storyMode === 'key' ? 'full' : 'key'; persist(); flash = save.storyMode === 'key' ? 'Story: only the big scenes (stage 1, your nemesis, the boss)' : 'Story: a short scene before every stage'; break;
      case 'mine': bagMine = !bagMine; selItem = null; break;
      case 'bonus': { const r = claimBonus(); if (r) { flash = 'Daily bonus: ' + r; sfx('reveal5'); } break; }
      case 'mute': toggleMute(); break;
      case 'sv-tree': skillView = 'tree'; break;
      case 'sv-skills': skillView = 'skills'; pickSlot = null; break;
      case 'open-all': runGacha(save.boxes.map((_, i) => i)); return;
    }
  }
  render();
}

// ---------- gacha ----------
/** Opens boxes one by one with a shake → burst → card reveal. Highest tiers first. */
export function runGacha(indices: number[]): void {
  const g = document.getElementById('gacha')!;
  let left = indices.length;
  const next = () => {
    if (left <= 0 || !save.boxes.length) { g.className = 'kq'; render(); return; }
    left--;
    let bi = 0;
    save.boxes.forEach((b, i) => { if (b.tier > save.boxes[bi].tier) bi = i; });
    const tier = save.boxes[bi].tier;
    const res = openBox(bi)!;
    track('boxes');
    if (res.item.rarity === 5) track('legendaries');
    const it = res.item, rc = RARITY_CSS[it.rarity];
    const cmp = compare(save.selected, it);
    g.className = 'kq on';
    g.style.setProperty('--gc', rc);
    g.innerHTML = `<div class="rays"></div><div class="left">${left ? `${left} more` : ''}</div>
      <img class="bx shake" src="art/box-${tier}.webp">
      <div class="card"><div class="icon" style="--rc:${rc};background-image:url(art/${itemIcon(it)}.webp)"></div>
        <div class="rar">${RARITY_NAMES[it.rarity].toUpperCase()} · GRADE <span style="color:${GRADE_CSS[gradeOf(it)]}">${GRADES[gradeOf(it)]}</span></div><h3>${esc(itemName(it))}</h3>
        ${itemLines(it).map(l => `<div class="ln">${lineText(l)}</div>`).join('')}${it.skill ? `<div class="skl">⭐ ${skillText(it)}</div>` : ''}${specialHtml(it)}
        <div class="cr">${ownerOf(it) !== undefined ? `<b style="color:#ffd27a">For ${ownerName(it)}</b> · ` : ''}iLv ${it.ilvl} ${SLOT_NAMES[BASES[it.base].slot]} · +🍪${res.crumbs} crumbs${res.extra.length ? ' · ' + res.extra.join(' · ') : ''}</div>
        ${cmp.pct === -Infinity ? '' : `<div class="cr" style="color:${cmp.pct >= 0 ? '#a8f0a8' : '#ff9a9a'}">${cmp.pct >= 0.5 ? '▲' : cmp.pct <= -0.5 ? '▼' : '='} ${cmp.pct >= 0 ? '+' : ''}${cmp.pct.toFixed(1)}% for ${CLASSES.find(c => c.species === save.selected)!.name}</div>`}</div>
      <div class="flash"></div><div class="btns"></div>`;
    const bx = g.querySelector('.bx')!;
    const shakeMs = 500 + it.rarity * 160;
    for (let k = 0; k < shakeMs; k += 140) setTimeout(() => sfx('shake'), k);
    setTimeout(() => {
      bx.classList.remove('shake'); bx.classList.add('pop');
      g.querySelector('.flash')!.classList.add('go');
      sfx(it.rarity >= 5 ? 'reveal5' : it.rarity >= 3 ? 'reveal3' : 'reveal1');
      setTimeout(() => {
        g.classList.add('burst', 'reveal');
        const btns = g.querySelector('.btns')!;
        btns.innerHTML = `<button class="pill go" data-g="next">${left ? 'NEXT BOX ▶' : 'DONE'}</button>${canWear(it, save.selected) ? `<button class="pill" data-g="equip">EQUIP ON ${CLASSES.find(c => c.species === save.selected)!.name.toUpperCase()}</button>` : ''}${left > 1 ? '<button class="pill" data-g="skip">SKIP ALL</button>' : ''}`;
        btns.querySelector('[data-g=next]')!.addEventListener('click', next);
        btns.querySelector('[data-g=equip]')?.addEventListener('click', () => { equip(save.selected, it.id); next(); });
        btns.querySelector('[data-g=skip]')?.addEventListener('click', () => { while (left > 0 && save.boxes.length) { left--; openBox(0); } g.className = 'kq'; tab = 'bag'; render(); });
      }, 220);
    }, shakeMs);
  };
  next();
}

// ---------- stage result ----------
export function showResult(o: { stage: StageDef; res: ClearResult | null; time: number; hits: number; combo: number; xp: number; levels: number; failed: boolean; crumbs: number; hard: boolean; unlocked?: string[]; online?: boolean; /** SKIP TO BOSS was used: the rank stops at A */ skipped?: boolean },
  act: (a: 'boxes' | 'next' | 'camp' | 'retry') => void): void {
  const r = document.getElementById('result')!;
  const nextStage = STAGES[STAGES.indexOf(o.stage) + 1];
  const res = o.res;
  r.className = 'kq on';
  r.innerHTML = `<div class="panel">
    <h2>${o.failed ? 'KNOCKED OUT!' : o.stage.boss ? 'BOSS DEFEATED!' : 'STAGE CLEAR!'}${o.hard ? ' <span style="color:#ff7a6a">(HARD)</span>' : ''}</h2>
    ${res ? `<div class="rk" style="color:${RANK_CSS[res.rank]}">${res.rank}</div>` : '<div style="font-size:9vmin;margin:1vmin">😵</div>'}
    <div class="st"><div>Time<b>${Math.floor(o.time / 60)}:${String(Math.floor(o.time % 60)).padStart(2, '0')}</b></div><div>Hits taken<b>${o.hits}</b></div><div>Best combo<b>${o.combo}</b></div><div>XP<b>+${o.xp}</b></div><div>Crumbs<b>+${o.crumbs}</b></div></div>
    ${o.skipped && res ? '<div class="note skipnote">⚡ Skipped to the boss: best rank A, no chillies, no stars</div>' : ''}
    ${o.unlocked?.length ? `<div class="note" style="color:#7ee8c8">🎉 NEW KAIJU UNLOCKED: ${o.unlocked.join(', ')}! (starts at 1-1)</div>` : ''}
    ${o.levels ? `<div class="note">LEVEL UP ×${o.levels}! Spend your new stat and skill points at camp.</div>` : '<div class="note"></div>'}
    ${res ? `<div class="gots">${res.boxes.map((b: LootBox, i) => `<img src="art/box-${b.tier}.webp" title="${TIER_NAMES[b.tier]}" class="${i < res.upgraded ? 'up' : ''}">`).join('')}</div>
    <div class="note">${res.upgraded ? `Rank ${res.rank} upgraded ${res.upgraded} box${res.upgraded > 1 ? 'es' : ''}! ` : ''}${res.firstClear ? 'First clear bonus box!' : ''}${res.firstClear && o.stage.boss ? ' +1 Golden Sugar Cube!' : ''}${res.newChallenges?.length ? `<br>★ ${res.newChallenges.join(' · ')} (+${res.crumbs} crumbs, +${res.newChallenges.length} box${res.newChallenges.length > 1 ? 'es' : ''})` : ''}${res.secretOpened ? '<br>🗝 Enough stars: this world\'s secret stage is open!' : ''}${res.bossWeapon ? `<br><b style="color:#ffb347">⚔ BOSS WEAPON: ${BASES[res.bossWeapon.base].name}</b> (gear skill: ${GEAR[res.bossWeapon.base]?.name ?? ''}) is in your bag!` : ''}</div>` : '<div class="note">Boxes you found are lost (crumbs are kept). Level up, gear up, bring Jam Jars and try again!</div>'}
    <div class="btns">${o.online ? `${res && save.boxes.length ? `<button class="pill" data-r="boxes">OPEN BOXES (${save.boxes.length})</button>` : ''}<button class="pill go" data-r="camp">BACK TO ROOM</button>` : `
      ${res ? `<button class="pill go" data-r="boxes">OPEN BOXES (${save.boxes.length})</button>` : `<button class="pill go" data-r="retry">RETRY</button>`}
      ${res && nextStage && stageUnlocked(nextStage) ? `<button class="pill" data-r="next">NEXT: ${nextStage.num} ▶</button>` : ''}
      ${res ? '<button class="pill" data-r="retry">REPLAY</button>' : ''}
      <button class="pill" data-r="camp">CAMP</button>`}
    </div></div>`;
  r.querySelectorAll<HTMLElement>('[data-r]').forEach(b => b.addEventListener('click', () => { r.className = 'kq'; act(b.dataset.r as 'boxes'); }));
}

export function rankBetter(a: Rank, b: Rank): boolean { return RANK_ORDER.indexOf(a) > RANK_ORDER.indexOf(b); }

const CAMP_CSS = `
.kq .fitnote { font-size: 1.9vmin; color: #c8b8c8; margin: 0 0 0.8vmin; }
.kq .reswrap { display: grid; grid-template-columns: 36vmin 1fr; gap: 2vmin; align-items: start; } .kq .reswrap .detail h3 { font-size: 2.6vmin; }
.kq .icon .elb { position: absolute; left: 0.2vmin; top: 50%; transform: translateY(-50%); font-size: 1.7vmin; filter: drop-shadow(0 0 1px #000); } .kq .icon .elb + .elb { top: 78%; }
.kq .repv { margin: 0.6vmin 0; color: #ffd27a; line-height: 1.35; } .kq .forge .fbtns .have { margin: 0; }
.kq .map .info abbr.el { display: inline-block; font-size: 1.18em; line-height: 1.22; margin: -0.2em 0; padding: 0 0.06em; border-radius: 1em; background: color-mix(in srgb, var(--ec) 42%, #1a1020); box-shadow: inset 0 0 0 1px var(--ec); vertical-align: middle; }
.kq .playrow .skipinfo { width: 100%; font-size: 1.6vmin; color: #ffd27a; margin-top: -0.4vmin; } .kq .spicy small.skipwarn { color: #ffd27a; }
.kq .shrug { color: #b8a8b8; white-space: nowrap; }
.kq .lv.dropreq abbr.el { font-size: 0.88em; margin-left: 0; padding: 0; } .kq .lv.dropreq { column-gap: 1vmin; }
.kq .gs { color: #ffd27a; font-size: 1.9vmin; margin-top: 0.6vmin; } .kq .gs small { color: #b8a8b8; }
.kq .pr { color: #9fe8ff; font-size: 1.9vmin; margin-top: 0.4vmin; }
.kq .purse { font-size: 2vmin; color: #ffe9c7; background: #2a1a30; border-radius: 1.2vmin; padding: 0.6vmin 1.2vmin; margin: 0.4vmin 0 0.8vmin; }
.kq .purse b { color: #ffd27a; }
.kq .playrow { display: flex; gap: 1.2vmin; flex-wrap: wrap; align-items: center; }
.kq .pill.online { background: linear-gradient(#5a8aff, #3a5ad8); color: #fff; }
#camp .side { width: 11vmin; overflow-y: auto; gap: 1vmin; }
#camp .side .hp { width: 9.4vmin; height: 9.4vmin; flex-shrink: 0; }
#camp .chip img { width: 2.6vmin; height: 2.6vmin; vertical-align: -0.4vmin; }
#camp .page.mappage { padding: 1.2vmin; }
.kq .map { display: flex; gap: 1.4vmin; height: 100%; }
.kq .mapimg { position: relative; flex: 1; aspect-ratio: 16 / 9; max-height: 64vmin; background: center/100% 100% no-repeat; border-radius: 2vmin; border: 2px solid #ffd27a66; align-self: flex-start; }
.kq .mapimg svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.kq .mapimg .path { fill: none; stroke: #fff8e8; stroke-width: 0.5; stroke-dasharray: 1.2 1; opacity: 0.85; vector-effect: non-scaling-stroke; stroke-width: 3px; }
.kq .mapimg .path.done { stroke: #ffd23c; stroke-dasharray: none; opacity: 1; stroke-width: 4px; }
.kq .node { position: absolute; transform: translate(-50%, -50%); width: 5vmin; height: 5vmin; border-radius: 50%; background: #3a2448; border: 3px solid #ffd27a; color: #fff; font-family: 'Luckiest Guy', sans-serif; font-size: 2.2vmin; display: flex; align-items: center; justify-content: center; box-shadow: 0 0.5vmin 0 #0007; padding: 0; }
.kq .node.done { background: #8a5a20; }
.kq .node.boss { width: 6.4vmin; height: 6.4vmin; background: #a02030; font-size: 3vmin; }
.kq .node.sel { box-shadow: 0 0 0 0.6vmin #fff, 0 0 3vmin #ffd27a; z-index: 2; }
.kq .node.locked { filter: grayscale(1) brightness(0.55); }
.kq .node i { position: absolute; right: -1.2vmin; top: -1.4vmin; font-style: normal; font-size: 2.4vmin; text-shadow: 0 0.3vmin 0 #000; }
.kq .node .me { position: absolute; bottom: 4.4vmin; left: 50%; transform: translateX(-50%); width: 7vmin; height: 7vmin; object-fit: contain; filter: drop-shadow(0 0.6vmin 0.6vmin #000a); animation: bob 1s ease-in-out infinite alternate; pointer-events: none; }
@keyframes bob { to { transform: translate(-50%, -0.8vmin); } }
.kq .wlabel { position: absolute; transform: translateX(-10%); font-family: 'Luckiest Guy', sans-serif; font-size: 2vmin; color: #fff; text-shadow: 0 0.3vmin 0.4vmin #000, 0 0 1vmin #000; white-space: nowrap; pointer-events: none; }
.kq .map .info { width: 30vmin; background: #1a1020d8; border-radius: 2vmin; padding: 1.6vmin; display: flex; flex-direction: column; gap: 0.6vmin; align-self: flex-start; max-height: 100%; overflow-y: auto; box-sizing: border-box; scrollbar-width: thin; }
.kq .map .info .num { font-family: 'Luckiest Guy', sans-serif; color: #ffb347; font-size: 3vmin; }
.kq .map .info .nm { font-size: 2.8vmin; }
.kq .map .info .lv { font-size: 2vmin; color: #d8c8d8; }
.kq .rw img { width: 3.4vmin; height: 3.4vmin; object-fit: contain; vertical-align: middle; }
.kq .pill.big { font-size: 3.4vmin; padding: 1.6vmin; margin-top: 0.6vmin; }
.kq .pill.secret { background: linear-gradient(#6a4ab0, #3a2a70); color: #ffe8a0; border-color: #ffd27a; margin-bottom: 0.8vmin; }
.kq .buddy { display: flex; align-items: center; gap: 0.6vmin; color: #a8e8ff; }
.kq .buddy .pill { font-size: 1.6vmin; padding: 0.3vmin 1vmin; display: inline-flex; align-items: center; gap: 0.5vmin; }
.kq .buddy img { height: 2.6vmin; }
.kq .spicy { font-size: 1.7vmin; color: #ffb38a; display: flex; flex-wrap: wrap; gap: 0.6vmin; align-items: center; margin: 0.6vmin 0; }
.kq .spicy .chili { font: inherit; font-weight: 800; padding: 0.4vmin 1vmin; border-radius: 1.2vmin; border: 2px solid #ff7a4a66; background: #2a1a20; color: #d8b0a0; cursor: pointer; }
.kq .spicy .chili.on { background: #c8401a; color: #fff4e4; border-color: #ffb347; box-shadow: 0 0 1.2vmin #ff6a2a; }
.kq .spicy small { width: 100%; color: #b89888; }
.kq .diff { display: flex; gap: 0.5vmin; margin-top: 0.6vmin; }
.kq .diff button { flex: 1 1 auto; font: inherit; font-weight: 800; font-size: 1.6vmin; padding: 0.7vmin 0.5vmin; border-radius: 1.2vmin; border: 2px solid #ffd27a44; background: #1a1020; color: #d8c8d8; cursor: pointer; white-space: nowrap; }
.kq .diff button.on { background: #ff9a3a; color: #3a1408; border-color: #ffe0a0; }
.kq .diff button.nmb.on { background: #7a4ad8; color: #fff; border-color: #c8a8ff; }
.kq .diff button.locked { opacity: 0.5; }
.kq .dnote { font-size: 1.7vmin; color: #ffb38a; }
.kq .mini { font: inherit; font-weight: 800; font-size: 1.6vmin; padding: 0.3vmin 1vmin; border-radius: 1vmin; border: 2px solid #ffd27a55; background: #2a1a30; color: #ffd27a; cursor: pointer; }
.kq .mini.chal { align-self: flex-start; color: #ffb38a; border-color: #ff7a4a55; margin-top: 0.4vmin; }
.kq .mini.chal.on { background: #5a1a10; color: #ffd0b0; }
.kq .story { display: flex; flex-wrap: wrap; align-items: center; gap: 0.6vmin; }
.kq .hard { font-size: 1.8vmin; color: #ff9a8a; display: flex; gap: 0.6vmin; align-items: center; }
.kq .hard.off { color: #8a7a8a; }
.kq .hard.nm { color: #c8a8ff; }
.kq .hard input { width: 3vmin; height: 3vmin; }
.kq .hint { color: #b8a8b8; font-size: 1.9vmin; margin: 1vmin 0 0; }
.kq .subtabs { display: flex; gap: 1vmin; align-items: center; margin-bottom: 1.2vmin; flex-wrap: wrap; }
.kq .subtabs > button:not(.pill) { font-family: 'Luckiest Guy', sans-serif; font-size: 2.2vmin; padding: 0.8vmin 1.8vmin; border-radius: 1.4vmin; background: #1a1020c0; color: #c8b8c8; }
.kq .subtabs > button.on { background: #ffb347; color: #3a1408; }
.kq .subtabs small { font-family: Nunito; font-size: 1.6vmin; opacity: 0.8; }
.kq .subtabs .pill { font-size: 1.8vmin; padding: 0.7vmin 1.4vmin; }
.kq .legend { font-size: 1.8vmin; color: #b8a8b8; margin-bottom: 1vmin; }
.kq .icon .cmp { position: absolute; left: 0.2vmin; bottom: 0; font-size: 2.2vmin; font-style: normal; text-shadow: 0 1px 2px #000; }
.kq .icon .cmp.up { color: #6aff6a; } .kq .icon .cmp.dn { color: #ff6a6a; } .kq .icon .cmp.eq { color: #ddd; }
.kq .icon .lk { position: absolute; right: 0.2vmin; top: 0; font-size: 1.6vmin; }
.kq .cmpbox { margin-top: 1vmin; background: #0006; border-radius: 1.2vmin; padding: 0.8vmin 1vmin; font-size: 1.8vmin; display: flex; flex-wrap: wrap; gap: 0.4vmin 1.2vmin; }
.kq .cmpbox > div { width: 100%; font-weight: 900; font-size: 2vmin; }
.kq .up { color: #7ef07e; } .kq .dn { color: #ff8a8a; }
.kq .qslots { display: flex; gap: 1.4vmin; }
.kq .qs { position: relative; width: 11vmin; height: 11vmin; border-radius: 2vmin; background: #1a1020c0; border: 2px dashed #ffd27a88; }
.kq .qs.pick { border-style: solid; border-color: #ffd27a; box-shadow: 0 0 2vmin #ffd27a66; }
.kq .qs img { width: 80%; height: 80%; object-fit: contain; }
.kq .qs b { position: absolute; right: 0.6vmin; bottom: 0.2vmin; font-size: 2.2vmin; }
.kq .qs i { position: absolute; left: 0.8vmin; top: 0.2vmin; font-style: normal; font-size: 1.8vmin; color: #b8a8b8; }
.kq .qs span { font-size: 1.8vmin; color: #8a7a8a; }
.kq .clist { display: grid; grid-template-columns: 1fr 1fr; gap: 1vmin; }
.kq .citem { display: flex; gap: 1.2vmin; align-items: center; background: #1a1020c0; border-radius: 1.6vmin; padding: 0.8vmin 1.2vmin; border: 2px solid #fff2; text-align: left; }
.kq .citem.on { border-color: #ffd27a; }
.kq .citem img { width: 7vmin; height: 7vmin; object-fit: contain; flex-shrink: 0; }
.kq .citem > div { flex: 1; font-size: 1.9vmin; }
.kq .citem b { font-size: 2.2vmin; }
.kq .citem span { display: block; color: #c8b8c8; font-weight: 700; }
.kq .citem span.ok { color: #a8f0a8; } .kq .citem span.cmp { color: #ffd27a; }
.kq .citem .pill { font-size: 2vmin; padding: 0.8vmin 1.4vmin; white-space: nowrap; }
.kq .market { display: grid; grid-template-columns: 1.3fr 1fr; gap: 2vmin; }
.kq .gearoffer { display: flex; gap: 1.2vmin; align-items: center; background: #1a1020c0; border-radius: 1.6vmin; padding: 1vmin; margin-bottom: 1vmin; }
.kq .gearoffer .t { flex: 1; font-size: 1.8vmin; }
.kq .gearoffer .t span { display: block; }
.kq .gearoffer .t .ln { color: #a8f0a8; }
.kq .gearoffer .pill { font-size: 2vmin; padding: 0.8vmin 1.4vmin; white-space: nowrap; }
.kq .rows .plus.gold { background: #ffe27a; margin-right: 0.8vmin; font-size: 2.4vmin; }
.kq .icon .gr { position: absolute; right: 0.3vmin; top: 0; font-family: 'Luckiest Guy', sans-serif; font-size: 1.9vmin; text-shadow: 0 1px 2px #000, 0 0 2px #000; }
.kq .icon .lk { right: auto; left: 2.2vmin; }
.kq .forge { margin-top: 1.2vmin; background: #0006; border-radius: 1.4vmin; padding: 1vmin 1.2vmin; font-size: 1.9vmin; }
.kq .forge small { font-family: Nunito; font-size: 1.6vmin; color: #b8a8b8; }
.kq .forge .fbtns { display: flex; gap: 1vmin; align-items: center; flex-wrap: wrap; margin-top: 0.6vmin; }
.kq .forge .pill { font-size: 1.9vmin; padding: 0.8vmin 1.4vmin; }
.kq .forge .safe { display: flex; gap: 0.5vmin; align-items: center; color: #a8f0a8; }
.kq .forge .have { color: #b8a8b8; margin-top: 0.4vmin; }
.kq .skill .brc { color: #7ac0ff; }
.kq .pts { font-size: 2vmin; color: #b8a8b8; font-family: Nunito; font-weight: 800; } .kq .pts.has { color: #ff9a8a; }
.kq .tree { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1vmin; }
.kq .tpath { background: #1a1020aa; border: 2px solid #ffd27a33; border-radius: 1.6vmin; padding: 0.8vmin; display: flex; flex-direction: column; gap: 0.5vmin; }
.kq .tpath.power { border-color: #ff8a6a55; } .kq .tpath.guard { border-color: #7ac0ff55; } .kq .tpath.craft { border-color: #c8a8ff55; }
.kq .tph { font-family: 'Luckiest Guy', sans-serif; font-size: 2.4vmin; color: #ffd27a; display: flex; justify-content: space-between; align-items: baseline; }
.kq .tph small { font-family: Nunito; font-size: 1.7vmin; color: #b8a8b8; }
.kq .tnode { display: grid; grid-template-columns: 3.4vmin 1fr auto; align-items: center; gap: 0.6vmin; font: inherit; font-weight: 800; font-size: 1.8vmin; text-align: left; padding: 0.5vmin 0.8vmin; border-radius: 1vmin; border: 2px solid #ffffff22; background: #24142a; color: #c8b8c8; cursor: pointer; }
.kq .tnode i { font-style: normal; font-size: 2.4vmin; text-align: center; } .kq .tnode u { text-decoration: none; color: #8a7a9a; font-size: 1.6vmin; }
.kq .tnode.got { color: #ffe9c7; border-color: #ffd27a77; } .kq .tnode.got u { color: #ffd27a; } .kq .tnode.max { background: #3a2a18; }
.kq .tnode.can { box-shadow: 0 0 0 2px #7ae87a inset; } .kq .tnode.shut { opacity: 0.45; } .kq .tnode.sel { outline: 2px solid #fff; }
.kq .tnode.skill b, .kq .tnode.cap b { color: #ffd27a; } .kq .tnode.skill { background: #2a2a14; } .kq .tnode.cap { background: #3a1a28; }
.kq .tdetail { margin-top: 1vmin; display: flex; flex-wrap: wrap; align-items: center; gap: 0.6vmin 1.4vmin; background: #1a1020; border: 2px solid #ffd27a55; border-radius: 1.4vmin; padding: 1vmin 1.4vmin; font-size: 2vmin; color: #e8d8f0; }
.kq .tdetail b { font-family: 'Luckiest Guy', sans-serif; font-size: 2.6vmin; color: #ffd27a; } .kq .tdetail small { color: #b8a8b8; } .kq .tdetail span { flex-basis: 100%; } .kq .tdetail em { color: #7ae87a; font-style: normal; }
.kq .tdetail.hint { color: #b8a8b8; }
.kq .loadout { display: flex; flex-wrap: wrap; align-items: center; gap: 0.8vmin; margin-bottom: 1vmin; font-size: 2vmin; color: #ffe9c7; }
.kq .loadout .slot { font: inherit; font-weight: 800; padding: 0.6vmin 1.2vmin; border-radius: 1.2vmin; border: 2px solid #7ac0ff88; background: #1a2a3a; color: #e8f4ff; cursor: pointer; }
.kq .loadout .slot i { font-style: normal; background: #7ac0ff; color: #0a1a2a; border-radius: 50%; padding: 0 0.6vmin; margin-right: 0.5vmin; } .kq .loadout .slot.on { border-color: #fff; background: #2a4a6a; }
.kq .loadout .pick { flex-basis: 100%; display: flex; flex-wrap: wrap; gap: 0.6vmin; align-items: center; } .kq .loadout .pick .pill { font-size: 1.8vmin; padding: 0.5vmin 1vmin; }
.kq .loadout small { color: #b8a8b8; }
.kq .skill .brlock { color: #8a7a9a; font-size: 1.7vmin; }
.kq .skill .brpick { display: flex; gap: 0.8vmin; flex-wrap: wrap; margin-top: 0.4vmin; color: #ffd27a; align-items: center; }
.kq .skill .brpick .pill { font-size: 1.7vmin; padding: 0.5vmin 1vmin; }
.kq .skill.ult { grid-column: 1 / -1; border-color: #ffd27a88; background: linear-gradient(90deg, #3a1a30c0, #1a1020c0); }
.kq .uq { color: #ffb02e; font-weight: 900; font-size: 2vmin; margin-top: 0.4vmin; }
.kq .st { color: #b8a8b8; font-size: 1.8vmin; }
.kq .st b { color: #7ee8c8; }
.kq .st .on { color: #7ee8c8; }
.kq .icon .setm { position: absolute; left: 50%; bottom: -0.2vmin; transform: translateX(-50%); font-size: 1.3vmin; font-weight: 900; color: #7ee8c8; text-shadow: 0 1px 2px #000; }
.kq .icon .uqm { position: absolute; left: 50%; top: -0.4vmin; transform: translateX(-50%); color: #ffb02e; font-size: 2vmin; text-shadow: 0 0 4px #000; }
.kq .mappages { display: flex; gap: 1vmin; margin-bottom: 0.8vmin; }
.kq .mappages button { font-family: 'Luckiest Guy', sans-serif; font-size: 2vmin; padding: 0.5vmin 1.6vmin; border-radius: 1.2vmin; background: #1a1020c0; color: #c8b8c8; }
.kq .mappages button.on { background: #ffb347; color: #3a1408; }
.kq .mappages button:disabled { opacity: 0.4; }
.kq .quests { display: grid; grid-template-columns: 1fr 1fr; gap: 2vmin; }
.kq .quests small { font-family: Nunito; font-size: 1.7vmin; color: #b8a8b8; }
.kq .quest { display: flex; gap: 1.2vmin; align-items: center; background: #1a1020c0; border-radius: 1.6vmin; padding: 1vmin 1.2vmin; margin-bottom: 1vmin; border: 2px solid #fff2; }
.kq .quest .t { flex: 1; font-size: 1.9vmin; }
.kq .quest .t span { color: #c8b8c8; }
.kq .quest .bar { margin: 0.5vmin 0; }
.kq .quest.claimed { opacity: 0.5; }
.kq .quest.bonus { border-color: #ffd27a88; }
.kq .quest .pill { font-size: 2vmin; padding: 0.8vmin 1.4vmin; }
.kq .icon .own { position: absolute; left: -0.6vmin; bottom: -0.6vmin; width: 4.6vmin; height: 4.6vmin; object-fit: contain; filter: drop-shadow(0 0 2px #000); }
.kq .for { color: #ffd27a; }
.kq .mine { font-size: 1.8vmin; display: flex; gap: 0.5vmin; align-items: center; color: #d8c8d8; }
#camp .side .hp.lockd { filter: grayscale(1) brightness(0.45); }
#camp .side .hp u { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 3.6vmin; text-decoration: none; filter: none; }
.kq .node .vt { position: absolute; left: -1.4vmin; top: -1.6vmin; font-style: normal; font-size: 2.2vmin; }
.kq .vtx { color: #c8a8ff !important; }
.kq .lv.dropreq { display: flex; flex-wrap: wrap; align-items: center; gap: 0.4vmin 1.4vmin; } .kq .lv.dropreq span { color: #ffd27a; white-space: nowrap; } .kq .lv.dropreq span.ok { color: #a8f0a8; } .kq .lv.dropreq img { height: 1.5em; vertical-align: middle; } .kq details.chal summary { cursor: pointer; list-style: none; } .kq details.chal summary::-webkit-details-marker { display: none; } .kq details.chal[open] summary small { display: none; }
.kq .pill.skip { background: linear-gradient(#ffe27a, #ffb347); color: #3a1a08; }
.kq .dlist { display: grid; grid-template-columns: repeat(auto-fill, minmax(22vmin, 1fr)); gap: 0.8vmin; } .kq .dlist span { display: flex; align-items: center; gap: 0.8vmin; background: #2a1a30; border-radius: 1vmin; padding: 0.6vmin; } .kq .dlist img { width: 5vmin; height: 5vmin; object-fit: contain; } .kq .dlist b { font-size: 1.9vmin; } .kq .dlist small { color: #b8a8c8; font-size: 1.5vmin; margin-left: auto; }
.kq .lv.chal { display: flex; flex-direction: column; gap: 0.3vmin; font-size: 0.92em; } .kq .lv.chal span { color: #c8b8d8; } .kq .lv.chal span.ok { color: #ffd23c; } .kq .lv.chal small { opacity: 0.85; } .kq .lv.chal small.stars { color: #9fe8ff; }
.kq .quest .rq { width: 7vmin; height: 7vmin; object-fit: contain; }
#camp .flashmsg { position: absolute; left: 50%; bottom: 3vmin; transform: translateX(-50%); background: #3a2448f0; border: 2px solid #ffd27a; border-radius: 2vmin; padding: 1vmin 2.4vmin; font-size: 2.4vmin; animation: tst 2.4s forwards; pointer-events: none; z-index: 5; }
@keyframes tst { 0% { opacity: 0; transform: translate(-50%, 1vmin); } 10%, 80% { opacity: 1; transform: translate(-50%, 0); } 100% { opacity: 0; } }
`;
