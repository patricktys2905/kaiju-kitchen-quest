// Each kaiju's main story arc and nemesis scenes, in cartoon voice (docs/VOICE.md). One file per kaiju.
import type { StoryLine } from '../stories';
import * as k0 from './k0';
import * as k1 from './k1';
import * as k2 from './k2';
import * as k4 from './k4';
import * as k5 from './k5';
import * as k6 from './k6';
import * as k7 from './k7';
import * as k8 from './k8';
import * as k10 from './k10';
import * as k11 from './k11';
import * as k15 from './k15';
import * as k17 from './k17';
import * as k13 from './k13';
import * as k19 from './k19';
import * as k9 from './k9';
import * as k18 from './k18';

export interface Arc { TITLE: string; TAGLINE: string; ARC: Record<string, StoryLine[]>; NEMESIS: Record<string, StoryLine[]> }
export const ARCS: Record<number, Arc> = { 0: k0, 1: k1, 2: k2, 4: k4, 5: k5, 6: k6, 7: k7, 8: k8, 10: k10, 11: k11, 15: k15, 17: k17, 13: k13, 19: k19, 9: k9, 18: k18 };
