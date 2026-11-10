// Every kaiju has its own story through the same kitchen. Shared backdrop: the Head Chef is missing and the
// Mold Crown is souring the kitchen; each world boss is a corrupted resident who is "cured" when beaten.
// Speakers: 'me' = the kaiju whose story it is, 'boss' = this world's boss, 'n' = narrator, 'mold' = the Mold's voice,
// or a species number for a cameo. Beats: intro (before 1-1), w{N}-open (before N-1), w{N}-elite (before N-5),
// w{N}-boss (before N-10), w{N}-after (after N-10), ending (after the last world). Bosses stay the same for everyone.

import { ARCS } from './arcs';
import { MORE_BEATS } from './more';

export type Speaker = 'me' | 'boss' | 'n' | 'mold' | 'foe' | number;
export type StoryLine = [Speaker, string];
/** Story twists on normal stages (bosses never change). */
export type Variant = 'swarm' | 'ambush' | 'night';
export interface Story {
  title: string;
  tagline: string;
  beats: Record<string, StoryLine[]>;
  variants: Record<string, Variant>;
}

export const VARIANT_INFO: Record<Variant, { name: string; icon: string; desc: string }> = {
  swarm: { name: 'Swarm', icon: '🐜', desc: 'Half again as many monsters, each a bit weaker' },
  ambush: { name: 'Ambush', icon: '⚔️', desc: 'An extra elite lies in wait' },
  night: { name: 'Night', icon: '🌙', desc: 'Lights out: monsters +1 level, better drops' },
};

export const STORIES: Record<number, Story> = {
  0: {
    title: 'Junior Goes Big', tagline: 'A small strawberry with very big dreams.',
    variants: { '1-3': 'swarm', '1-7': 'ambush', '2-4': 'night', '2-8': 'swarm', '3-3': 'ambush', '4-6': 'night' },
    beats: {}, // filled from src/story/arcs + src/story/more
  },
  10: {
    title: 'The Lost Crumblets', tagline: 'A gruff muffin bear gathering up the little ones.',
    variants: { '1-4': 'ambush', '1-8': 'night', '2-3': 'swarm', '2-7': 'ambush', '3-6': 'swarm', '4-4': 'ambush' },
    beats: {}, // filled from src/story/arcs + src/story/more
  },
  11: {
    title: '30 Minutes or Less', tagline: 'A delivery raptor with one very important order.',
    variants: { '1-2': 'swarm', '1-6': 'night', '2-5': 'ambush', '2-9': 'swarm', '3-7': 'night', '4-3': 'swarm' },
    beats: {}, // filled from src/story/arcs + src/story/more
  },
  4: {
    title: 'Chasing the Moon', tagline: 'A dreamy moth following the light.',
    variants: { '1-5': 'night', '1-8': 'night', '2-6': 'night', '3-4': 'swarm', '3-8': 'night', '4-7': 'night' },
    beats: {}, // filled from src/story/arcs + src/story/more
  },
  1: {
    title: 'The Antidote', tagline: 'A jelly scientist hunting a cure.',
    variants: { '1-3': 'ambush', '1-6': 'swarm', '2-4': 'swarm', '2-7': 'night', '3-5': 'swarm', '4-8': 'ambush' },
    beats: {}, // filled from src/story/arcs + src/story/more
  },
  2: {
    title: 'Get Off My Patch', tagline: 'A grumpy hermit crab who wants his garden back.',
    variants: { '1-4': 'swarm', '1-7': 'swarm', '2-3': 'ambush', '2-8': 'night', '3-6': 'ambush', '4-5': 'swarm' },
    beats: {}, // filled from src/story/arcs + src/story/more
  },
  5: {
    title: 'The Golden Butter', tagline: 'A night thief after the greatest treasure in the kitchen.',
    variants: { '1-2': 'night', '1-5': 'night', '2-6': 'night', '2-9': 'ambush', '3-3': 'night', '4-7': 'swarm' },
    beats: {}, // filled from src/story/arcs + src/story/more
  },
  6: {
    title: 'The Lord of Leftovers', tagline: 'A very important dumpling in search of subjects.',
    variants: { '1-3': 'swarm', '1-8': 'ambush', '2-2': 'swarm', '2-7': 'swarm', '3-5': 'night', '4-3': 'ambush' },
    beats: {}, // filled from src/story/arcs + src/story/more
  },
  7: {
    title: 'The Last Roll Dragon', tagline: 'An ancient sushi dragon seeking the Wasabi Flame.',
    variants: { '1-4': 'night', '1-7': 'swarm', '2-5': 'night', '2-8': 'ambush', '3-4': 'ambush', '4-6': 'swarm' },
    beats: {}, // filled from src/story/arcs + src/story/more
  },
  8: {
    title: 'Don\'t Melt', tagline: 'A chocolate golem who is very, very afraid of heat.',
    variants: { '1-2': 'ambush', '1-6': 'swarm', '2-3': 'night', '2-6': 'swarm', '3-2': 'swarm', '4-4': 'night' },
    beats: {}, // filled from src/story/arcs + src/story/more
  },
  15: {
    title: 'Grill Champion', tagline: 'A shy hedgehog chasing the perfect grill.',
    variants: { '1-5': 'swarm', '1-8': 'swarm', '2-4': 'ambush', '2-9': 'night', '3-6': 'swarm', '4-8': 'swarm' },
    beats: {}, // filled from src/story/arcs + src/story/more
  },
  17: {
    title: 'Long Way Home', tagline: 'A homesick penguin who slid much too far.',
    variants: { '1-3': 'swarm', '1-6': 'ambush', '2-2': 'night', '2-5': 'swarm', '3-7': 'swarm', '4-6': 'ambush' },
    beats: {}, // filled from src/story/arcs + src/story/more
  },
};

/** Which story beat (if any) plays before a stage, and after it. */
export function beatBefore(stageId: string, firstEver: boolean): string[] {
  const [w, n] = stageId.split('-').map(Number);
  const out: string[] = [];
  if (stageId === '1-1' && firstEver) out.push('intro');
  if (n === 1) out.push(`w${w}-open`);
  if (n === 5) out.push(`w${w}-elite`);
  if (n === 10) out.push(`w${w}-boss`);
  if ([2, 3, 4, 6, 7, 8, 9].includes(n)) out.push(`w${w}-s${n}`); // short scene before every other stage
  return out;
}
/** Short between-stage scenes (skipped when the story setting is "key scenes only"). */
export const isMinorBeat = (b: string) => /^w\d-s\d$/.test(b);
export function beatAfter(stageId: string): string[] {
  const [w, n] = stageId.split('-').map(Number);
  return n === 10 ? [`w${w}-after`] : [];
}

// each kaiju's arc (intro, world openings, bosses, endings) and nemesis scenes (src/story/arcs/k<species>.ts)
for (const [sp, a] of Object.entries(ARCS)) { const st = STORIES[Number(sp)]; if (!st) continue; st.title = a.TITLE; st.tagline = a.TAGLINE; Object.assign(st.beats, a.ARC, a.NEMESIS); }
// and a short scene before every other stage (src/story/more/k<species>.ts)
for (const [sp, b] of Object.entries(MORE_BEATS)) if (STORIES[Number(sp)]) Object.assign(STORIES[Number(sp)].beats, b);

/** Painted still behind a story line (art name in public/art), or null for the plain background + portraits.
 *  Per kaiju: the intro and the World 4 cliffhanger (from the Mold's first line on). Shared, since bosses are the
 *  same for everyone: each world's opening vista, boss reveal and the cured boss afterwards. Elite beats have none. */
export function stillFor(species: number, beat: string, lineIndex: number): string | null {
  if (beat === 'intro') return `still-${species}-intro`;
  const m = /^w(\d)-(open|boss|after)$/.exec(beat);
  if (!m) return null;
  const w = Number(m[1]);
  if (m[2] !== 'after') return `still-w${w}-${m[2]}`;
  if (w === 4) {
    const lines = STORIES[species]?.beats[beat] ?? [];
    const firstMold = lines.findIndex(([who]) => who === 'mold');
    return firstMold >= 0 && lineIndex >= firstMold ? `still-${species}-cliff` : 'still-w4-cure';
  }
  return `still-w${w}-cure`;
}

/** Every still the stories can show (the art test checks they all exist). */
export function allStills(): string[] {
  const out = new Set<string>();
  for (const [sp, s] of Object.entries(STORIES))
    for (const [beat, lines] of Object.entries(s.beats)) lines.forEach((_, i) => { const k = stillFor(Number(sp), beat, i); if (k) out.add(k); });
  return [...out].sort();
}
