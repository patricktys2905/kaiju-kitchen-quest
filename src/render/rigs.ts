// Cutout rigs: which piece of a parts sheet (public/art/parts-N-<i>.webp) is which body part,
// where its joint sits, and its draw order. Coordinates are parts-sheet pixels (half-size sheet,
// as written to parts-N.json). `root` is the point between the feet; everything is relative to it.
// Tune with: npm run rig-shot (writes shots/rig-*.png showing every pose).

export type Role = 'body' | 'arm' | 'armBack' | 'legA' | 'legB' | 'tail' | 'wing' | 'wingBack';

export interface PartDef {
  piece: number;
  role: Role;
  /** Joint position on the sheet (where this part attaches to the body). */
  joint: [number, number];
  /** Joint position inside the piece image, 0..1 (Phaser origin). */
  pivot: [number, number];
  depth: number;      // draw order (body = 0)
  tint?: number;      // e.g. darken the far limbs a little
  flip?: boolean;     // mirror the piece horizontally
  rest?: number;      // resting rotation (radians)
}

export interface RigDef {
  root: [number, number];
  /** World pixels per sheet pixel. */
  scale: number;
  parts: PartDef[];
}

export const RIGS: Record<number, RigDef> = {
  // Gobzilla Jr.: body 227x281@169,52; tail @39,281; legs @306,326 / @199,340; arm @399,230
  0: {
    root: [282, 392],
    scale: 0.26,
    parts: [
      { piece: 1, role: 'tail', joint: [205, 318], pivot: [0.9, 0.45], depth: -3, rest: -0.15 },
      { piece: 3, role: 'legB', joint: [248, 328], pivot: [0.5, 0.2], depth: -2, tint: 0xd8c0c4 },
      { piece: 2, role: 'legA', joint: [318, 328], pivot: [0.5, 0.2], depth: -1 },
      { piece: 0, role: 'body', joint: [282, 335], pivot: [0.5, 1], depth: 0 },
      { piece: 4, role: 'arm', joint: [342, 252], pivot: [0.18, 0.25], depth: 1, rest: 0.1 },
    ],
  },
  // Pizzaraptor: body 312x300@185,56; tail @16,125; legs @329,321 / @180,329; arms @224,61 / @142,122
  11: {
    root: [335, 480],
    scale: 0.205,
    parts: [
      { piece: 1, role: 'tail', joint: [222, 285], pivot: [0.86, 0.86], depth: -4, rest: 0 },
      { piece: 5, role: 'armBack', joint: [440, 250], pivot: [0.2, 0.2], depth: -3, tint: 0xc8b0a8 },
      { piece: 3, role: 'legB', joint: [262, 340], pivot: [0.55, 0.08], depth: -2, tint: 0xd8c0b8 },
      { piece: 2, role: 'legA', joint: [372, 336], pivot: [0.45, 0.08], depth: -1 },
      { piece: 0, role: 'body', joint: [341, 350], pivot: [0.5, 0.98], depth: 0 },
      { piece: 4, role: 'arm', joint: [452, 238], pivot: [0.15, 0.25], depth: 1 },
    ],
  },
  // Bluebeary: body 223x279@143,64; arms @394,178 / @23,178; feet @77,365 / @361,365
  10: {
    root: [255, 405],
    scale: 0.23,
    parts: [
      { piece: 2, role: 'armBack', joint: [182, 212], pivot: [0.7, 0.12], depth: -3, tint: 0xc8d0e8 },
      { piece: 3, role: 'legB', joint: [222, 336], pivot: [0.5, 0.15], depth: -2, tint: 0xc8d0e8 },
      { piece: 4, role: 'legA', joint: [292, 336], pivot: [0.5, 0.15], depth: -1 },
      { piece: 0, role: 'body', joint: [254, 343], pivot: [0.5, 1], depth: 0 },
      { piece: 1, role: 'arm', joint: [330, 212], pivot: [0.3, 0.12], depth: 1 },
    ],
  },
  // Mothball: body 164x257@55,77; wings @367,133 / @235,133; legs @94,372 / @149,371; arm @202,252
  4: {
    root: [140, 440],
    scale: 0.24,
    parts: [
      { piece: 1, role: 'wingBack', joint: [110, 215], pivot: [0.95, 0.4], depth: -4, flip: true, tint: 0xd8c8e0, rest: 0.1 },
      { piece: 2, role: 'wing', joint: [100, 225], pivot: [0.95, 0.4], depth: -3, flip: true, rest: -0.1 },
      { piece: 3, role: 'legB', joint: [118, 325], pivot: [0.5, 0.12], depth: -2, tint: 0xd8d0e8 },
      { piece: 4, role: 'legA', joint: [160, 325], pivot: [0.5, 0.12], depth: -1 },
      { piece: 0, role: 'body', joint: [137, 334], pivot: [0.5, 1], depth: 0 },
      { piece: 5, role: 'arm', joint: [178, 258], pivot: [0.3, 0.15], depth: 1 },
    ],
  },
};
