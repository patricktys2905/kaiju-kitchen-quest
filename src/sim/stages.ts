// Stage layouts. Coordinates: x right, y down; a platform's y is its walkable top.
// Reach: the lowest jumper (Bluebeary) rises ~105 px, so platform steps are ≤ 90 px apart; ladders for more.
import type { MobKind, MobSpawn, StageDef } from './types';

const G = 470; // ground line for every stage
const m = (kind: MobKind, x: number, lv: number, y?: number): MobSpawn => ({ kind, x, lv, y });

export const WORLDS = [{ id: 1, name: 'The Countertop', blurb: 'Where the leftovers went bad.' }];

export const STAGES: StageDef[] = [
  {
    id: '1-1', world: 1, num: '1-1', name: 'Countertop Meadow', bg: 'bg-far', width: 2400, groundY: G, lv: [1, 2], par: 55, rec: 1,
    platforms: [
      { x: 360, y: 380, w: 260 }, { x: 700, y: 290, w: 300 }, { x: 1150, y: 380, w: 260 },
      { x: 1500, y: 290, w: 340 }, { x: 1950, y: 380, w: 280 },
    ],
    ladders: [{ x: 780, top: 290, bottom: G }, { x: 1600, top: 290, bottom: G }],
    mobs: [
      m('bun', 600, 1), m('bun', 900, 1), m('bun', 820, 1, 290), m('bun', 1300, 2),
      m('bun', 1700, 2, 290), m('bun', 1750, 1), m('bun', 2100, 2), m('bun', 2050, 2, 380),
    ],
  },
  {
    id: '1-2', world: 1, num: '1-2', name: 'Gummy Gully', bg: 'bg-far', width: 2800, groundY: G, lv: [3, 4], par: 75, rec: 3,
    platforms: [
      { x: 300, y: 380, w: 220 }, { x: 560, y: 300, w: 220 }, { x: 820, y: 220, w: 300 },
      { x: 1250, y: 380, w: 320 }, { x: 1650, y: 300, w: 260 }, { x: 1980, y: 380, w: 220 },
      { x: 2250, y: 290, w: 330 },
    ],
    ladders: [{ x: 900, top: 220, bottom: G }, { x: 2350, top: 290, bottom: G }],
    mobs: [
      m('bun', 500, 3), m('worm', 760, 3), m('worm', 950, 3, 220), m('bun', 1100, 3),
      m('worm', 1400, 4, 380), m('bun', 1500, 4), m('worm', 1750, 4, 300), m('worm', 1900, 4),
      m('bun', 2150, 4), m('worm', 2400, 4, 290), m('worm', 2550, 4),
    ],
  },
  {
    id: '1-3', world: 1, num: '1-3', name: 'Spice Shelf', bg: 'bg-far', width: 3000, groundY: G, lv: [5, 7], par: 100, rec: 5,
    platforms: [
      { x: 250, y: 380, w: 260 }, { x: 550, y: 290, w: 260 }, { x: 850, y: 200, w: 380 },
      { x: 1300, y: 380, w: 300 }, { x: 1700, y: 290, w: 400 }, { x: 2200, y: 380, w: 260 },
      { x: 2500, y: 290, w: 380 },
    ],
    ladders: [{ x: 950, top: 200, bottom: G }, { x: 1800, top: 290, bottom: G }],
    mobs: [
      m('worm', 600, 5), m('pepper', 680, 5, 290), m('worm', 900, 5), m('pepper', 1000, 6, 200),
      m('egg', 1250, 6), m('pepper', 1450, 6, 380), m('worm', 1600, 6), m('pepper', 1900, 6, 290),
      m('worm', 2050, 6), m('egg', 2350, 7), m('pepper', 2650, 7, 290), m('worm', 2700, 7), m('egg', 2850, 7),
    ],
  },
  {
    id: '1-4', world: 1, num: '1-4', name: 'Stovetop Throne', bg: 'bg-far-stove', width: 1500, groundY: G, lv: [10, 10], par: 120, rec: 8, boss: true,
    platforms: [{ x: 180, y: 382, w: 240 }, { x: 1080, y: 382, w: 240 }, { x: 520, y: 294, w: 460 }],
    ladders: [],
    mobs: [m('toast', 1150, 10)],
  },
];

export function stageById(id: string): StageDef { return STAGES.find(s => s.id === id) ?? STAGES[0]; }
