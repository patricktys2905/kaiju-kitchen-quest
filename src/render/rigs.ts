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
  /** a real flyer: floats higher and keeps flapping */
  fly?: boolean;
  /** Gear attachment points. hand = where the front arm's paw is, as a 0..1 point in the arm piece image;
   *  chest (apron), neck (charm) and back (pot lid) are parts-sheet coords on the body. */
  gear: { hand: [number, number]; chest: [number, number]; neck: [number, number]; back: [number, number]; size: number };
  /** which part holds the weapon (default 'arm') */
  holder?: Role;
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
    root: [335, 456],
    scale: 0.21,
    parts: [
      { piece: 1, role: 'tail', joint: [222, 285], pivot: [0.86, 0.86], depth: -4, rest: 0 },
      { piece: 5, role: 'armBack', joint: [400, 258], pivot: [0.15, 0.25], depth: -3, tint: 0xc8b0a8 },
      { piece: 3, role: 'legB', joint: [268, 312], pivot: [0.55, 0.1], depth: -2, tint: 0xd8c0b8 },
      { piece: 2, role: 'legA', joint: [362, 308], pivot: [0.45, 0.1], depth: -1 },
      { piece: 0, role: 'body', joint: [341, 350], pivot: [0.5, 0.98], depth: 0 },
      { piece: 4, role: 'arm', joint: [414, 248], pivot: [0.1, 0.3], depth: 1 },
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
    root: [352, 362],
    scale: 0.24,
    legs: 'dangle',
    hover: true,
    fly: true,
    parts: [
      { piece: 1, role: 'wingBack', joint: [300, 205], pivot: [0.93, 0.55], depth: -4, tint: 0xc8b8d8, rest: 0.25 },
      { piece: 1, role: 'wing', joint: [290, 215], pivot: [0.93, 0.55], depth: -3, rest: -0.05 },
      { piece: 0, role: 'body', joint: [355, 346], pivot: [0.5, 1], depth: 0 },
      { piece: 3, role: 'arm', joint: [398, 272], pivot: [0.5, 0.12], depth: 1 },
    ],
  },
  // Squidgeon: body 198x225@40,15; tentacles @372,205 / @307,355 / @205,240 / @59,262 (the front pair walk, the others are arms)
  1: {
    gear: { hand: [0.5, 0.9], chest: [170, 178], neck: [182, 150], back: [72, 120], size: 1 },
    root: [139, 352],
    scale: 0.25,
    legs: 'swing',
    parts: [
      { piece: 2, role: 'armBack', joint: [118, 222], pivot: [0.5, 0.06], depth: -3, tint: 0xb8d8f0, rest: 0.2 },
      { piece: 4, role: 'legB', joint: [102, 226], pivot: [0.5, 0.06], depth: -2, tint: 0xc8e0f0 },
      { piece: 3, role: 'legA', joint: [160, 228], pivot: [0.5, 0.06], depth: -1 },
      { piece: 0, role: 'body', joint: [139, 238], pivot: [0.5, 0.98], depth: 0 },
      { piece: 1, role: 'arm', joint: [190, 214], pivot: [0.5, 0.06], depth: 1, rest: -0.2 },
    ],
  },
  // Crabbage: body 235x219@17,10; claws 178x113@163,265 / 202x93@285,138 (pincers to the right); leg sets @353,347 / @23,339
  2: {
    gear: { hand: [0.82, 0.5], chest: [205, 190], neck: [215, 150], back: [95, 80], size: 1 },
    root: [148, 330],
    scale: 0.25,
    legs: 'swing',
    parts: [
      { piece: 1, role: 'armBack', joint: [196, 188], pivot: [0.06, 0.5], depth: -3, tint: 0xd8c890, rest: -0.25 },
      { piece: 4, role: 'legB', joint: [118, 214], pivot: [0.5, 0.1], depth: -2, tint: 0xd8c890 },
      { piece: 3, role: 'legA', joint: [182, 214], pivot: [0.5, 0.1], depth: -1 },
      { piece: 0, role: 'body', joint: [148, 226], pivot: [0.56, 0.98], depth: 0 },
      { piece: 2, role: 'arm', joint: [212, 178], pivot: [0.05, 0.55], depth: 1, rest: -0.3 },
    ],
  },
  // Toastbat: body 288x248@143,113; toast wings @44,66 / @176,51; tiny feet @329,399 / @160,403. Holds its weapon in a foot.
  5: {
    gear: { hand: [0.5, 0.75], chest: [372, 292], neck: [385, 240], back: [235, 185], size: 0.9 },
    holder: 'legA',
    root: [287, 394],
    scale: 0.23,
    legs: 'dangle',
    hover: true,
    parts: [
      { piece: 3, role: 'wingBack', joint: [262, 150], pivot: [0.6, 0.92], depth: -4, tint: 0xd0b890, rest: 0.25 },
      { piece: 1, role: 'wing', joint: [238, 158], pivot: [0.65, 0.92], depth: -3, rest: -0.2 },
      { piece: 5, role: 'legB', joint: [232, 352], pivot: [0.5, 0.1], depth: -2, tint: 0xd8c0a0 },
      { piece: 4, role: 'legA', joint: [330, 352], pivot: [0.5, 0.1], depth: 1 },
      { piece: 0, role: 'body', joint: [287, 361], pivot: [0.5, 1], depth: 0 },
    ],
  },
  // Dumplord: body 193x266@158,67 (its feet are part of the body, so it hops); arms 63x96 @66,284 / @384,284
  6: {
    gear: { hand: [0.5, 0.88], chest: [292, 252], neck: [300, 200], back: [190, 205], size: 1 },
    root: [255, 333],
    scale: 0.3,
    legs: 'none',
    parts: [
      { piece: 1, role: 'armBack', joint: [238, 222], pivot: [0.5, 0.12], depth: -3, tint: 0xd8c8b0, rest: 0.15 },
      { piece: 0, role: 'body', joint: [255, 333], pivot: [0.5, 1], depth: 0 },
      { piece: 2, role: 'arm', joint: [300, 228], pivot: [0.5, 0.12], depth: 1, rest: -0.1 },
    ],
  },
};
