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
  /** swing = walking legs; shuffle = little feet slide; dangle = hovering (Mothball); none = legless, hops along (Bluebeary) */
  legs?: 'swing' | 'shuffle' | 'dangle' | 'none';
  hover?: boolean;
  /** Gear attachment points. hand = where the front arm's paw is, as a 0..1 point in the arm piece image;
   *  chest (apron), neck (charm) and back (pot lid) are parts-sheet coords on the body. */
  gear: { hand: [number, number]; chest: [number, number]; neck: [number, number]; back: [number, number]; size: number };
  root: [number, number];
  /** World pixels per sheet pixel. */
  scale: number;
  parts: PartDef[];
}

export const RIGS: Record<number, RigDef> = {
  // Gobzilla Jr.: body 227x281@169,52; tail @39,281; legs @306,326 / @199,340; arm @399,230
  0: {
    gear: { hand: [0.8, 0.75], chest: [318, 268], neck: [330, 212], back: [205, 222], size: 1 },
    root: [282, 392],
    legs: 'swing',
    scale: 0.26,
    parts: [
      { piece: 1, role: 'tail', joint: [205, 318], pivot: [0.9, 0.45], depth: -3, rest: -0.15 },
      { piece: 4, role: 'armBack', joint: [318, 250], pivot: [0.2, 0.3], depth: -2.5, tint: 0xc89aa0, rest: 0.3 },
      { piece: 3, role: 'legB', joint: [248, 328], pivot: [0.5, 0.2], depth: -2, tint: 0xd8c0c4 },
      { piece: 2, role: 'legA', joint: [318, 328], pivot: [0.5, 0.2], depth: -1 },
      { piece: 0, role: 'body', joint: [282, 335], pivot: [0.5, 1], depth: 0 },
      { piece: 4, role: 'arm', joint: [336, 256], pivot: [0.2, 0.3], depth: 1, rest: 0.15 },
    ],
  },
  // Pizzaraptor: body 312x300@185,56; tail @16,125; legs @329,321 / @180,329; arms @224,61 / @142,122
  11: {
    gear: { hand: [0.85, 0.85], chest: [430, 262], neck: [455, 195], back: [300, 140], size: 1 },
    root: [335, 480],
    scale: 0.205,
    parts: [
      { piece: 1, role: 'tail', joint: [222, 285], pivot: [0.86, 0.86], depth: -4, rest: 0 },
      { piece: 5, role: 'armBack', joint: [432, 252], pivot: [0.2, 0.2], depth: -3, tint: 0xc8b0a8 },
      { piece: 3, role: 'legB', joint: [262, 340], pivot: [0.55, 0.08], depth: -2, tint: 0xd8c0b8 },
      { piece: 2, role: 'legA', joint: [372, 336], pivot: [0.45, 0.08], depth: -1 },
      { piece: 0, role: 'body', joint: [341, 350], pivot: [0.5, 0.98], depth: 0 },
      { piece: 4, role: 'arm', joint: [440, 245], pivot: [0.12, 0.3], depth: 1 },
    ],
  },
  // Bluebeary (side profile, legless: hops on its muffin cup): body 264x310@201,51; arms 69x97 @40,263 / @138,263
  10: {
    gear: { hand: [0.5, 0.88], chest: [358, 262], neck: [392, 222], back: [240, 200], size: 1 },
    root: [323, 361],
    scale: 0.27,
    legs: 'none',
    parts: [
      { piece: 2, role: 'armBack', joint: [300, 232], pivot: [0.5, 0.12], depth: -3, tint: 0xb8c4e8, rest: 0.15 },
      { piece: 0, role: 'body', joint: [323, 361], pivot: [0.46, 1], depth: 0 },
      { piece: 1, role: 'arm', joint: [352, 238], pivot: [0.5, 0.12], depth: 1, rest: -0.1 },
    ],
  },
  // Mothball (side profile): body 179x342@266,46; wing 203x222@71,70 (root on its right edge, reused twice);
  // leg 51x82@157,366 (reused twice); arm 51x79@59,286
  4: {
    gear: { hand: [0.5, 0.88], chest: [378, 300], neck: [395, 232], back: [296, 262], size: 0.9 },
    root: [352, 452],
    scale: 0.22,
    legs: 'dangle',
    hover: true,
    parts: [
      { piece: 1, role: 'wingBack', joint: [300, 205], pivot: [0.93, 0.55], depth: -4, tint: 0xc8b8d8, rest: 0.25 },
      { piece: 1, role: 'wing', joint: [290, 215], pivot: [0.93, 0.55], depth: -3, rest: -0.05 },
      { piece: 2, role: 'legB', joint: [335, 372], pivot: [0.5, 0.12], depth: -2, tint: 0xd0c8e0 },
      { piece: 2, role: 'legA', joint: [372, 372], pivot: [0.5, 0.12], depth: -1 },
      { piece: 0, role: 'body', joint: [355, 388], pivot: [0.5, 1], depth: 0 },
      { piece: 3, role: 'arm', joint: [398, 272], pivot: [0.5, 0.12], depth: 1 },
    ],
  },
};
