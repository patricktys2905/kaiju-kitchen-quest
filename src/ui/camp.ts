// Camp (hub) menus as an HTML overlay: world MAP, HERO (stats + equipment), SKILLS, BAG (gear tabs + compare,
// consumables + quick bag), MARKET, BOXES (gacha). Also the stage result panel. Reads/writes src/save.ts.
import { CLASSES, type Stat } from '../sim/classes';
import { CONSUMABLES, type ConsumableId, QUICK_SLOTS } from '../sim/consumables';
import { BASES, GRADES, GRADE_CSS, GRADE_MUL, type Item, MAX_PLUS, RARITY_CSS, RARITY_NAMES, type Slot, fortChance, fortCost, fortMul, fortRisky, gradeOf, itemLines, itemName, lineText, salvageValue } from '../sim/items';
import { TIER_NAMES, clearCount, likelyTier } from '../sim/loot';
import { SKILLS, MAX_SKILL, type SkillKind, skillsOf } from '../sim/skills';
import { STAGES, WORLDS } from '../sim/stages';
import { STAT_INFO, STATS, derive, xpFor } from '../sim/stats';
import type { BoxTier, LootBox, StageDef } from '../sim/types';
import { HARD_LV } from '../sim/world';
import {
  RANK_ORDER, type ClearResult, type Rank, SHOP_BOXES, SHOP_ITEMS, autoStats, buyBox, buyConsumable, buyGear, canFortify, compare, equip, equipBest, fortify, regrade,
  gearPrice, hero, isLocked, levelSkill, openBox, persist, resetStats, salvage, salvageWorse, save, setQuick, shopStock, spendStat, toggleLock,
  unequip, useScroll, useSugar,
} from '../save';
import { UI_CSS } from './style';
import { isMuted, sfx, toggleMute } from '../audio';

type Tab = 'map' | 'hero' | 'skills' | 'bag' | 'market' | 'boxes';
type BagTab = Slot | 'items';
const RANK_CSS: Record<Rank, string> = { S: '#ffd23c', A: '#7ee87e', B: '#7ac0ff', C: '#d8c8d8', D: '#a89898' };
const TIER_CSS: Record<BoxTier, string> = { 1: '#e0c09a', 2: '#7ee87e', 3: '#7ac0ff', 4: '#ffd23c', 5: '#ff8af4' };
export const SKILL_ICON: Record<SkillKind, string> = { cone: '💥', slam: '🌋', dash: '⚡', bolt: '✨', spin: '🌀', uppercut: '⤴️', mines: '🫐', buff: '🛡️', nova: '🌟', fan: '🎐', heal: '🥟' };
const SLOT_NAMES: Record<Slot, string> = { weapon: 'Weapon', armor: 'Armor', charm: 'Charm' };
const SKILL_NAME: Record<string, string> = Object.fromEntries(Object.values(SKILLS).flatMap(s => [...s.actives, s.passive].map(a => [a.id, a.name])));

/** Stage dots on the world map (percent of the map image), in stage order. */
const MAP_POS: Record<string, [number, number]> = {
  '1-1': [4, 88], '1-2': [12.5, 82], '1-3': [15.5, 70], '1-4': [19.5, 57], '1-5': [21, 45], '1-6': [27, 33], '1-7': [36.5, 30], '1-8': [43, 23], '1-9': [46, 15], '1-10': [49, 9],
  '2-1': [52, 77], '2-2': [61, 67], '2-3': [69, 61], '2-4': [75, 54], '2-5': [79, 46], '2-6': [77, 38], '2-7': [81, 30], '2-8': [79, 22], '2-9': [83, 15], '2-10': [85, 7],
};

let el: HTMLElement;
let tab: Tab = 'map';
let bagTab: BagTab = 'weapon';
let selItem: number | null = null;
let selStage: string | null = null;
let selConsumable: ConsumableId | null = null;
let onPlay: (stageId: string) => void = () => {};
let flash = '';
let useSafety = true;

export function initCamp(play: (stageId: string) => void): void {
  onPlay = play;
  const st = document.createElement('style');
  st.textContent = UI_CSS + CAMP_CSS;
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
  ? `<div class="icon" style="--rc:${RARITY_CSS[it.rarity]};background-image:url(art/${BASES[it.base].icon}.webp)" ${extra}>${it.skill ? '<span class="sk">⭐</span>' : ''}${it.plus ? `<b>+${it.plus}</b>` : ''}${isLocked(it.id) ? '<span class="lk">🔒</span>' : ''}<span class="gr" style="color:${GRADE_CSS[gradeOf(it)]}">${GRADES[gradeOf(it)]}</span>${badge}</div>`
  : `<div class="icon" ${extra}></div>`;
/** ▲ / ▼ versus what the current hero wears. */
function badgeFor(it: Item): string {
  const c = compare(save.selected, it).pct;
  if (Math.abs(c) < 0.5) return '<span class="cmp eq">=</span>';
  return c > 0 ? '<span class="cmp up">▲</span>' : '<span class="cmp dn">▼</span>';
}
const cIcon = (id: ConsumableId) => `art/${CONSUMABLES[id].icon}.webp`;

export function stageUnlocked(s: StageDef): boolean {
  const i = STAGES.indexOf(s);
  return i === 0 || !!save.cleared[STAGES[i - 1].id];
}
export function hardUnlocked(world: number): boolean { return !!save.cleared[`${world}-10`]; }

function render(): void {
  const p = hero();
  const tabs: [Tab, string, number][] = [['map', 'Map', 0], ['hero', 'Hero', p.statPts], ['skills', 'Skills', p.skillPts], ['bag', 'Bag', 0], ['market', 'Market', 0], ['boxes', 'Boxes', save.boxes.length]];
  el.innerHTML = `
    <div class="side">${CLASSES.map(c => { const h = save.heroes[c.species]; return `<button class="hp ${c.species === save.selected ? 'on' : ''} ${h.statPts + h.skillPts ? 'pts' : ''}" data-hero="${c.species}" title="${c.name}" style="background-image:url(art/kaiju-${c.species}.webp)"><i></i><b>${h.level}</b></button>`; }).join('')}</div>
    <div class="main">
      <div class="top"><h1>Kaiju Kitchen Quest</h1><span class="chip"><img src="art/icon-crumb.webp"> ${save.crumbs}</span><span class="chip">🎁 ${save.boxes.length}</span><button class="chip" data-act="mute">${isMuted() ? '🔇' : '🔊'}</button></div>
      <div class="tabs">${tabs.map(([k, n, c]) => `<button class="${tab === k ? 'on' : ''}" data-tab="${k}">${n}${c ? `<em>${c}</em>` : ''}</button>`).join('')}</div>
      <div class="page ${tab === 'map' ? 'mappage' : ''}">${page()}</div>
    </div>
    ${flash ? `<div class="flashmsg">${flash}</div>` : ''}`;
  flash = '';
}

function page(): string {
  switch (tab) {
    case 'map': return mapPage();
    case 'hero': return heroPage();
    case 'skills': return skillsPage();
    case 'bag': return bagPage();
    case 'market': return marketPage();
    case 'boxes': return boxesPage();
  }
}

// ---------- map ----------
function rewardLine(s: StageDef): string {
  const lv = s.lv[1] + (save.hard ? HARD_LV : 0);
  const tier = likelyTier(lv, 'A', !!s.boss), n = clearCount(lv);
  return `<span class="rw"><img src="art/box-${tier}.webp"> ${TIER_NAMES[tier]}${n > 1 ? ` ×${n}` : ''}</span>`;
}

function mapPage(): string {
  const p = hero();
  // default selection: the furthest unlocked stage
  if (!selStage || !STAGES.some(s => s.id === selStage)) selStage = [...STAGES].reverse().find(stageUnlocked)?.id ?? '1-1';
  const sel = STAGES.find(s => s.id === selStage)!;
  const pts = (w: number) => STAGES.filter(s => s.world === w).map(s => MAP_POS[s.id]).map(([x, y]) => `${x},${y}`).join(' ');
  const done = (w: number) => STAGES.filter(s => s.world === w && save.cleared[s.id]).map(s => MAP_POS[s.id]);
  const hardOk = hardUnlocked(sel.world);
  if (save.hard && !hardOk) { save.hard = false; persist(); }
  const rank = (save.hard ? save.hardCleared : save.cleared)[sel.id] as Rank | undefined;
  const lv = (n: number) => n + (save.hard ? HARD_LV : 0);
  const low = p.level < lv(sel.rec) - 1;
  return `<div class="map">
    <div class="mapimg">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        ${WORLDS.map(w => `<polyline points="${pts(w.id)}" class="path"/>${done(w.id).length > 1 ? `<polyline points="${done(w.id).map(([x, y]) => `${x},${y}`).join(' ')}" class="path done"/>` : ''}`).join('')}
      </svg>
      ${WORLDS.map(w => { const [x, y] = MAP_POS[`${w.id}-1`]; return `<div class="wlabel" style="left:${x}%;top:${y + 7}%">World ${w.id}: ${w.name}</div>`; }).join('')}
      ${STAGES.map(s => {
        const [x, y] = MAP_POS[s.id];
        const open = stageUnlocked(s), r = (save.hard ? save.hardCleared : save.cleared)[s.id] as Rank | undefined;
        return `<button class="node ${open ? '' : 'locked'} ${s.boss ? 'boss' : ''} ${s.id === selStage ? 'sel' : ''} ${save.cleared[s.id] ? 'done' : ''}" data-node="${s.id}" style="left:${x}%;top:${y}%">
          ${s.boss ? '👑' : s.id.split('-')[1]}${r ? `<i style="color:${RANK_CSS[r]}">${r}</i>` : ''}${s.id === selStage ? `<img class="me" src="art/kaiju-${p.species}.webp">` : ''}</button>`;
      }).join('')}
    </div>
    <div class="info">
      <div class="num">${sel.num}${sel.boss ? ' · BOSS' : sel.id.endsWith('-5') ? ' · ELITE' : ''}</div>
      <div class="nm">${sel.name}</div>
      <div class="lv">Monsters Lv ${lv(sel.lv[0])}${sel.lv[1] !== sel.lv[0] ? '–' + lv(sel.lv[1]) : ''}</div>
      <div class="lv" style="color:${low ? '#ff8a8a' : '#a8f0a8'}">Recommended Lv ${lv(sel.rec)} (you: ${p.level})</div>
      <div class="lv">Clear: ${rewardLine(sel)}</div>
      ${rank ? `<div class="lv">Best: <b style="color:${RANK_CSS[rank]}">${rank}</b></div>` : ''}
      <button class="pill go big" data-play="${sel.id}" ${stageUnlocked(sel) ? '' : 'disabled'}>${stageUnlocked(sel) ? '▶ PLAY' : '🔒 LOCKED'}</button>
      <label class="hard ${hardOk ? '' : 'off'}"><input type="checkbox" data-act="hard" ${save.hard ? 'checked' : ''} ${hardOk ? '' : 'disabled'}> HARD MODE ${hardOk ? `(+${HARD_LV} monster levels, better boxes)` : '— beat this world\'s boss'}</label>
    </div>
  </div>
  <p class="hint">Tip: double-tap ← or → to <b>dodge roll</b> through attacks. Beat every monster, then walk to the EXIT. Stage 5 has an elite, stage 10 the world boss.</p>`;
}

// ---------- hero ----------
function heroPage(): string {
  const p = hero(), d = derive(p);
  const cls = d.cls;
  const need = xpFor(p.level);
  const sugar = save.items.sugar ?? 0;
  const statRow = (s: Stat) => `<div><span>${s.toUpperCase()} <b>${d.prim[s]}</b><small>${STAT_INFO[s]}</small></span><span>${sugar ? `<button class="plus gold" data-sugar="${s}" title="Golden Sugar Cube">🧊</button>` : ''}<button class="plus" data-stat="${s}" ${p.statPts ? '' : 'disabled'}>+</button></span></div>`;
  const pct = (v: number) => `${Math.round(v * 100)}%`;
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
    <button class="pill go" data-act="best" style="margin-top:1.2vmin">⚡ EQUIP BEST</button>
    ${selItem !== null && Object.values(p.equip).some(i => i?.id === selItem) ? detail(Object.values(p.equip).find(i => i?.id === selItem)!, true) : ''}</div>
  </div>`;
}

function skillText(it: Item): string { return it.skill!.id === 'all' ? `+${it.skill!.n} to all skills` : `+${it.skill!.n} ${SKILL_NAME[it.skill!.id] ?? it.skill!.id}`; }

function skillsPage(): string {
  const p = hero(), d = derive(p), sk = skillsOf(p.species);
  const card = (s: { id: string; name: string; desc: string; unlock: number }, icon: string, extra: string) => {
    const learned = p.skills[s.id] ?? 0, eff = d.skillLv[s.id] ?? 0;
    const locked = p.level < s.unlock;
    const can = !locked && p.skillPts > 0 && learned < MAX_SKILL;
    const pips = Array.from({ length: Math.max(MAX_SKILL, eff) }, (_, i) => `<i class="${i < learned ? 'on' : i < eff ? 'bonus' : ''}"></i>`).join('');
    return `<div class="skill ${locked ? 'locked' : ''}"><div class="ic">${icon}</div><div class="t"><b>${s.name}</b> ${learned ? `Lv ${eff}` : ''}<span>${s.desc}</span><span>${locked ? `🔒 Unlocks at hero Lv ${s.unlock}` : learned ? extra : 'Not learned yet — spend a point'}</span><div class="pips">${pips}</div></div>
      <button class="pill ${can ? 'go' : ''}" data-skill="${s.id}" ${can ? '' : 'disabled'}>+</button></div>`;
  };
  return `<div class="h3">Skills ${p.skillPts ? `<span style="color:#ff8a8a">· ${p.skillPts} points</span>` : ''}
      ${save.items.scroll ? `<button class="pill" data-act="scroll" style="font-size:1.8vmin;padding:0.6vmin 1.4vmin">📜 USE RECIPE SCROLL (refund points) ×${save.items.scroll}</button>` : ''}
      <small style="color:#b8a8b8;font-family:Nunito;font-size:1.8vmin">1 point per level. Each skill level: +20% damage, -4% cooldown. ⭐ gear adds bonus levels (blue).</small></div>
    <div class="skills">${sk.actives.map((a, i) => card(a, SKILL_ICON[a.kind], `Button ${i + 1} · ${a.kind === 'buff' ? `${a.buff?.t}s buff` : a.kind === 'heal' ? 'heal' : `${Math.round(a.dmg * 100)}% dmg`} · ${a.cd}s cooldown`)).join('')}
    ${card(sk.passive, '💗', 'Passive: always on')}</div>`;
}

// ---------- bag ----------
function sortedBag(slot: Slot): Item[] {
  return save.bag.filter(i => BASES[i.base].slot === slot).sort((a, b) => b.rarity - a.rarity || b.ilvl - a.ilvl || b.plus - a.plus || b.id - a.id);
}

function bagPage(): string {
  const counts: Record<BagTab, number> = { weapon: 0, armor: 0, charm: 0, items: Object.values(save.items).reduce((a, b) => a + (b ?? 0), 0) };
  for (const it of save.bag) counts[BASES[it.base].slot]++;
  const sub = `<div class="subtabs">${(['weapon', 'armor', 'charm', 'items'] as BagTab[]).map(t => `<button class="${bagTab === t ? 'on' : ''}" data-bag="${t}">${t === 'items' ? 'Items' : SLOT_NAMES[t as Slot] + 's'} <small>${counts[t]}</small></button>`).join('')}
    <span style="flex:1"></span><button class="pill" data-act="best">⚡ EQUIP BEST</button><button class="pill" data-act="salvage-worse">🍪 SALVAGE WORSE</button></div>`;
  if (bagTab === 'items') return sub + itemsTab();
  const bag = sortedBag(bagTab);
  const sel = bag.find(i => i.id === selItem) ?? bag[0];
  if (sel) selItem = sel.id;
  return sub + (bag.length ? `<div class="bagwrap"><div><div class="legend">▲ better / ▼ worse than what <b>${CLASSES.find(c => c.species === save.selected)!.name}</b> wears · 🔒 locked items are never salvaged</div>
    <div class="grid">${bag.map(it => iconHtml(it, `data-item="${it.id}" style="--rc:${RARITY_CSS[it.rarity]};background-image:url(art/${BASES[it.base].icon}.webp);${it.id === selItem ? 'outline:3px solid #fff' : ''}"`, badgeFor(it))).join('')}</div></div>
    ${sel ? detail(sel, false) : ''}</div>` : `<div class="empty">No ${SLOT_NAMES[bagTab].toLowerCase()}s yet. Open boxes or visit the Market!</div>`);
}

function itemsTab(): string {
  const owned = (Object.keys(CONSUMABLES) as ConsumableId[]).filter(id => (save.items[id] ?? 0) > 0);
  return `<div class="h3">Quick bag <small style="color:#b8a8b8;font-family:Nunito;font-size:1.8vmin">4 slots you can tap in stages (keys 1-4). Pick an item, then tap a slot.</small></div>
    <div class="qslots">${Array.from({ length: QUICK_SLOTS }, (_, i) => { const id = save.quick[i]; return `<button class="qs ${selConsumable ? 'pick' : ''}" data-qslot="${i}">${id ? `<img src="${cIcon(id)}"><b>${save.items[id] ?? 0}</b>` : '<span>empty</span>'}<i>${i + 1}</i></button>`; }).join('')}</div>
    <div class="h3" style="margin-top:1.6vmin">Items</div>
    ${owned.length ? `<div class="clist">${owned.map(id => { const c = CONSUMABLES[id]; return `<button class="citem ${selConsumable === id ? 'on' : ''}" data-cons="${id}"><img src="${cIcon(id)}"><div><b>${c.name} ×${save.items[id]}</b><span>${c.desc}</span><span class="${c.quick ? 'ok' : 'cmp'}">${c.quick ? 'Quick bag item' : id === 'revive' ? 'Works automatically' : 'Use at camp (Hero / Skills)'}</span></div></button>`; }).join('')}</div>` : '<div class="empty">No items. Buy potions at the Market!</div>'}`;
}

function detail(it: Item, equipped: boolean): string {
  const p = hero();
  const slot = BASES[it.base].slot;
  const cur = p.equip[slot];
  const fc = fortCost(it), chance = Math.round(fortChance(it.plus) * 100);
  const cmp = equipped ? null : compare(save.selected, it);
  return `<div class="detail"><div style="display:flex;gap:1.2vmin;align-items:center">${iconHtml(it)}<div><h3 style="color:${RARITY_CSS[it.rarity]}">${esc(itemName(it))}</h3>${RARITY_NAMES[it.rarity]} ${SLOT_NAMES[slot]} · iLv ${it.ilvl} · Grade <b style="color:${GRADE_CSS[gradeOf(it)]}">${GRADES[gradeOf(it)]}</b> <small>(×${GRADE_MUL[gradeOf(it)]})</small></div></div>
    <div style="margin-top:1vmin">${itemLines(it).map(l => `<div class="ln">${lineText(l)}</div>`).join('')}${it.skill ? `<div class="skl">⭐ ${skillText(it)}</div>` : ''}</div>
    ${cmp ? `<div class="cmpbox"><div class="${cmp.pct >= 0 ? 'up' : 'dn'}">${cmp.pct >= 0.5 ? '▲' : cmp.pct <= -0.5 ? '▼' : '='} ${cmp.pct >= 0 ? '+' : ''}${cmp.pct.toFixed(1)}% overall vs ${cur ? esc(itemName(cur)) : 'nothing'}</div>
      ${cmp.diff.map(d => `<span class="${d.v > 0 ? 'up' : 'dn'}">${d.k.replace(/^(\w+) Lv$/, (_, id) => (SKILL_NAME[id] ?? id) + ' Lv')} ${d.v > 0 ? '+' : ''}${d.v}${d.pct ? '%' : ''}</span>`).join('')}</div>` : ''}
    <div class="btns">
      ${equipped ? `<button class="pill" data-act="unequip" data-slot="${slot}">UNEQUIP</button>` : `<button class="pill go" data-act="equip" data-id="${it.id}">EQUIP</button>`}
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
    </div></div>`;
}

// ---------- market ----------
function marketPage(): string {
  const stock = shopStock();
  return `<div class="market">
    <div><div class="h3">Pantry Market <small style="color:#b8a8b8;font-family:Nunito;font-size:1.8vmin">Monsters drop crumbs 🍪. Gear restocks every day.</small></div>
      <div class="clist">${SHOP_ITEMS.map(id => { const c = CONSUMABLES[id]; return `<div class="citem"><img src="${cIcon(id)}"><div><b>${c.name}</b> <small>(own ${save.items[id] ?? 0})</small><span>${c.desc}</span></div><button class="pill ${save.crumbs >= c.price ? 'go' : ''}" data-buy="${id}" ${save.crumbs >= c.price ? '' : 'disabled'}>🍪 ${c.price}</button></div>`; }).join('')}
      ${SHOP_BOXES.map((b, i) => `<div class="citem"><img src="art/box-${b.tier}.webp"><div><b>${TIER_NAMES[b.tier]}</b><span>Loot box (gear at your progress level)</span></div><button class="pill ${save.crumbs >= b.price ? 'go' : ''}" data-buybox="${i}" ${save.crumbs >= b.price ? '' : 'disabled'}>🍪 ${b.price}</button></div>`).join('')}</div></div>
    <div><div class="h3">Today's gear</div>
      ${stock.length ? stock.map(it => { const c = compare(save.selected, it); const price = gearPrice(it); return `<div class="gearoffer">${iconHtml(it, '', badgeFor(it))}<div class="t"><b style="color:${RARITY_CSS[it.rarity]}">${esc(itemName(it))}</b><span>${RARITY_NAMES[it.rarity]} ${SLOT_NAMES[BASES[it.base].slot]} · iLv ${it.ilvl}</span><span class="ln">${itemLines(it).map(lineText).join(' · ')}${it.skill ? ` · ⭐ ${skillText(it)}` : ''}</span><span class="${c.pct >= 0 ? 'up' : 'dn'}">${c.pct >= 0 ? '+' : ''}${c.pct.toFixed(1)}% for ${CLASSES.find(x => x.species === save.selected)!.name}</span></div><button class="pill ${save.crumbs >= price ? 'go' : ''}" data-buygear="${it.id}" ${save.crumbs >= price ? '' : 'disabled'}>🍪 ${price}</button></div>`; }).join('') : '<div class="empty">Sold out! Come back tomorrow.</div>'}
    </div></div>`;
}

function boxesPage(): string {
  if (!save.boxes.length) return '<div class="empty">No boxes. Beat monsters in stages: they drop boxes, and clearing a stage gives more!</div>';
  const tiers = [5, 4, 3, 2, 1] as BoxTier[];
  return `<div class="h3">Loot boxes <button class="pill go" data-act="open-all" style="font-size:2vmin;padding:0.8vmin 1.8vmin">OPEN ALL (${save.boxes.length})</button></div>
    <div class="boxes">${tiers.filter(t => save.boxes.some(b => b.tier === t)).map(t => `<button class="boxcard" data-box="${t}" style="--tc:${TIER_CSS[t]}"><img src="art/box-${t}.webp"><div class="n">×${save.boxes.filter(b => b.tier === t).length}</div><div class="nm">${TIER_NAMES[t]}</div></button>`).join('')}</div>
    <p style="color:#b8a8b8;font-size:2vmin">Better boxes roll rarer gear: Common → Uncommon → Rare → Epic → Legendary. Epic and Legendary gear can boost skills. Item level follows the monsters that dropped it.</p>`;
}

function onClick(e: MouseEvent): void {
  const t = (e.target as HTMLElement).closest<HTMLElement>('[data-tab],[data-hero],[data-node],[data-play],[data-stat],[data-sugar],[data-skill],[data-item],[data-act],[data-box],[data-eqslot],[data-bag],[data-cons],[data-qslot],[data-buy],[data-buybox],[data-buygear]');
  if (!t || (t as HTMLButtonElement).disabled) return;
  sfx('click');
  const sp = save.selected;
  const ds = t.dataset;
  if (ds.tab) { tab = ds.tab as Tab; selItem = null; }
  else if (ds.hero) { save.selected = Number(ds.hero); persist(); }
  else if (ds.node) selStage = ds.node;
  else if (ds.play) { const s = STAGES.find(x => x.id === ds.play)!; if (stageUnlocked(s)) { hideCamp(); onPlay(s.id); } return; }
  else if (ds.stat) spendStat(sp, ds.stat as Stat);
  else if (ds.sugar) { if (useSugar(sp, ds.sugar as Stat)) flash = `Golden Sugar Cube: +1 ${ds.sugar.toUpperCase()} forever!`; }
  else if (ds.skill) levelSkill(sp, ds.skill);
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
      case 'lock': toggleLock(Number(ds.id)); break;
      case 'salvage': salvage(Number(ds.id)); selItem = null; break;
      case 'salvage-worse': { const r = salvageWorse(); flash = r.n ? `Salvaged ${r.n} item${r.n > 1 ? 's' : ''} worse than every hero's gear: +🍪${r.crumbs}` : 'Nothing to salvage: every item beats someone\'s gear (or is locked)'; selItem = null; break; }
      case 'best': { const n = equipBest(sp); flash = n ? `Equipped ${n} better item${n > 1 ? 's' : ''}` : 'Already wearing the best gear in your bag'; break; }
      case 'scroll': if (useScroll(sp)) flash = 'Skill points refunded!'; break;
      case 'hard': save.hard = !save.hard; persist(); break;
      case 'mute': toggleMute(); break;
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
    const it = res.item, rc = RARITY_CSS[it.rarity];
    const cmp = compare(save.selected, it);
    g.className = 'kq on';
    g.style.setProperty('--gc', rc);
    g.innerHTML = `<div class="rays"></div><div class="left">${left ? `${left} more` : ''}</div>
      <img class="bx shake" src="art/box-${tier}.webp">
      <div class="card"><div class="icon" style="--rc:${rc};background-image:url(art/${BASES[it.base].icon}.webp)"></div>
        <div class="rar">${RARITY_NAMES[it.rarity].toUpperCase()} · GRADE <span style="color:${GRADE_CSS[gradeOf(it)]}">${GRADES[gradeOf(it)]}</span></div><h3>${esc(itemName(it))}</h3>
        ${itemLines(it).map(l => `<div class="ln">${lineText(l)}</div>`).join('')}${it.skill ? `<div class="skl">⭐ ${skillText(it)}</div>` : ''}
        <div class="cr">iLv ${it.ilvl} ${SLOT_NAMES[BASES[it.base].slot]} · +🍪${res.crumbs} crumbs${res.extra.length ? ' · ' + res.extra.join(' · ') : ''}</div>
        <div class="cr" style="color:${cmp.pct >= 0 ? '#a8f0a8' : '#ff9a9a'}">${cmp.pct >= 0.5 ? '▲' : cmp.pct <= -0.5 ? '▼' : '='} ${cmp.pct >= 0 ? '+' : ''}${cmp.pct.toFixed(1)}% for ${CLASSES.find(c => c.species === save.selected)!.name}</div></div>
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
        btns.innerHTML = `<button class="pill go" data-g="next">${left ? 'NEXT BOX ▶' : 'DONE'}</button><button class="pill" data-g="equip">EQUIP ON ${CLASSES.find(c => c.species === save.selected)!.name.toUpperCase()}</button>${left > 1 ? '<button class="pill" data-g="skip">SKIP ALL</button>' : ''}`;
        btns.querySelector('[data-g=next]')!.addEventListener('click', next);
        btns.querySelector('[data-g=equip]')!.addEventListener('click', () => { equip(save.selected, it.id); next(); });
        btns.querySelector('[data-g=skip]')?.addEventListener('click', () => { while (left > 0 && save.boxes.length) { left--; openBox(0); } g.className = 'kq'; tab = 'bag'; render(); });
      }, 220);
    }, shakeMs);
  };
  next();
}

// ---------- stage result ----------
export function showResult(o: { stage: StageDef; res: ClearResult | null; time: number; hits: number; combo: number; xp: number; levels: number; failed: boolean; crumbs: number; hard: boolean },
  act: (a: 'boxes' | 'next' | 'camp' | 'retry') => void): void {
  const r = document.getElementById('result')!;
  const nextStage = STAGES[STAGES.indexOf(o.stage) + 1];
  const res = o.res;
  r.className = 'kq on';
  r.innerHTML = `<div class="panel">
    <h2>${o.failed ? 'KNOCKED OUT!' : o.stage.boss ? 'BOSS DEFEATED!' : 'STAGE CLEAR!'}${o.hard ? ' <span style="color:#ff7a6a">(HARD)</span>' : ''}</h2>
    ${res ? `<div class="rk" style="color:${RANK_CSS[res.rank]}">${res.rank}</div>` : '<div style="font-size:9vmin;margin:1vmin">😵</div>'}
    <div class="st"><div>Time<b>${Math.floor(o.time / 60)}:${String(Math.floor(o.time % 60)).padStart(2, '0')}</b></div><div>Hits taken<b>${o.hits}</b></div><div>Best combo<b>${o.combo}</b></div><div>XP<b>+${o.xp}</b></div><div>Crumbs<b>+${o.crumbs}</b></div></div>
    ${o.levels ? `<div class="note">LEVEL UP ×${o.levels}! Spend your new stat and skill points at camp.</div>` : '<div class="note"></div>'}
    ${res ? `<div class="gots">${res.boxes.map((b: LootBox, i) => `<img src="art/box-${b.tier}.webp" title="${TIER_NAMES[b.tier]}" class="${i < res.upgraded ? 'up' : ''}">`).join('')}</div>
    <div class="note">${res.upgraded ? `Rank ${res.rank} upgraded ${res.upgraded} box${res.upgraded > 1 ? 'es' : ''}! ` : ''}${res.firstClear ? 'First clear bonus box!' : ''}${res.firstClear && o.stage.boss ? ' +1 Golden Sugar Cube!' : ''}</div>` : '<div class="note">Boxes you found are lost (crumbs are kept). Level up, gear up, bring Jam Jars and try again!</div>'}
    <div class="btns">
      ${res ? `<button class="pill go" data-r="boxes">OPEN BOXES (${save.boxes.length})</button>` : `<button class="pill go" data-r="retry">RETRY</button>`}
      ${res && nextStage && stageUnlocked(nextStage) ? `<button class="pill" data-r="next">NEXT: ${nextStage.num} ▶</button>` : ''}
      ${res ? '<button class="pill" data-r="retry">REPLAY</button>' : ''}
      <button class="pill" data-r="camp">CAMP</button>
    </div></div>`;
  r.querySelectorAll<HTMLElement>('[data-r]').forEach(b => b.addEventListener('click', () => { r.className = 'kq'; act(b.dataset.r as 'boxes'); }));
}

export function rankBetter(a: Rank, b: Rank): boolean { return RANK_ORDER.indexOf(a) > RANK_ORDER.indexOf(b); }

const CAMP_CSS = `
#camp .side { width: 11vmin; overflow-y: auto; gap: 1vmin; }
#camp .side .hp { width: 9.4vmin; height: 9.4vmin; flex-shrink: 0; }
#camp .chip img { width: 2.6vmin; height: 2.6vmin; vertical-align: -0.4vmin; }
#camp .page.mappage { padding: 1.2vmin; }
.kq .map { display: flex; gap: 1.4vmin; height: 100%; }
.kq .mapimg { position: relative; flex: 1; aspect-ratio: 16 / 9; max-height: 64vmin; background: url(art/map-world.webp) center/100% 100% no-repeat; border-radius: 2vmin; border: 2px solid #ffd27a66; align-self: flex-start; }
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
.kq .map .info { width: 30vmin; background: #1a1020d8; border-radius: 2vmin; padding: 1.6vmin; display: flex; flex-direction: column; gap: 0.6vmin; align-self: flex-start; }
.kq .map .info .num { font-family: 'Luckiest Guy', sans-serif; color: #ffb347; font-size: 3vmin; }
.kq .map .info .nm { font-size: 2.8vmin; }
.kq .map .info .lv { font-size: 2vmin; color: #d8c8d8; }
.kq .rw img { width: 3.4vmin; height: 3.4vmin; object-fit: contain; vertical-align: middle; }
.kq .pill.big { font-size: 3.4vmin; padding: 1.6vmin; margin-top: 0.6vmin; }
.kq .hard { font-size: 1.8vmin; color: #ff9a8a; display: flex; gap: 0.6vmin; align-items: center; }
.kq .hard.off { color: #8a7a8a; }
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
#camp .flashmsg { position: absolute; left: 50%; bottom: 3vmin; transform: translateX(-50%); background: #3a2448f0; border: 2px solid #ffd27a; border-radius: 2vmin; padding: 1vmin 2.4vmin; font-size: 2.4vmin; animation: tst 2.4s forwards; pointer-events: none; z-index: 5; }
@keyframes tst { 0% { opacity: 0; transform: translate(-50%, 1vmin); } 10%, 80% { opacity: 1; transform: translate(-50%, 0); } 100% { opacity: 0; } }
`;
