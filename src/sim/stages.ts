// Stage layouts. Coordinates: x right, y down; a platform's y is its walkable top.
import type { StageDef } from './types';

export const STAGES: StageDef[] = [
  {
    id: 'meadow-1', name: 'Countertop Meadow', width: 2400, groundY: 470, respawn: 6,
    platforms: [
      { x: 360, y: 360, w: 260 },
      { x: 700, y: 270, w: 300 },
      { x: 1150, y: 340, w: 260 },
      { x: 1500, y: 250, w: 340 },
      { x: 1950, y: 350, w: 280 },
    ],
    ladders: [
      { x: 780, top: 270, bottom: 470 },
      { x: 1600, top: 250, bottom: 470 },
    ],
    mobs: [
      { kind: 'bun', x: 600 }, { kind: 'bun', x: 900 }, { kind: 'bun', x: 820, y: 270 },
      { kind: 'bun', x: 1300 }, { kind: 'bun', x: 1650, y: 250 }, { kind: 'bun', x: 1750 },
      { kind: 'bun', x: 2100 }, { kind: 'bun', x: 2050, y: 350 },
    ],
  },
];
