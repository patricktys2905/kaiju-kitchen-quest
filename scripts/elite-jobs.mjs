// Writes art-src/jobs-elite.json: a bespoke painting per kaiju per world for its stage-5 story beat (w{N}-elite):
// Worlds 1-5 it faces its nemesis; Worlds 6-10 the old nemesis is a friend, pointing out the world's elite brute ahead.
// 20 kaiju x 10 worlds = 200 (still-<species>-w<N>-elite). Both the kaiju and its nemesis are painted in, so the story player
// hides their portraits on these. Run one at a time (a refusal hangs gem-gen):
//   for i in $(seq 0 199); do timeout 200 node scripts/gem-gen.mjs art-src/jobs-elite.json $i 1; done   then `npm run art`
import fs from 'node:fs';

const HERO = {
  0: ['Gobzilla Jr.', 'a cute strawberry dinosaur'], 10: ['Bluebeary', 'a cute blueberry-muffin bear: a round blue muffin-top body with blueberries, sitting in a paper muffin cup'], 11: ['Pizzaraptor', 'a cute pizza raptor'],
  4: ['Mothball', 'a cute marshmallow moth'], 1: ['Squidgeon', 'a cute jelly octopus scientist'], 2: ['Crabbage', 'a cute cheese crab with a cabbage shell'],
  5: ['Toastbat', 'a cute toast bat'], 6: ['Dumplord', 'a cute dumpling lord'], 7: ['Norigon', 'a cute sushi dragon'], 8: ['Chocomunch', 'a cute chocolate golem'],
  15: ['Hotchog', 'a cute hot-dog hedgehog'], 17: ['Pengwhip', 'a cute cookies-and-cream penguin'], 13: ['Avocadrake', 'a cute avocado dragon'],
  19: ['Tacowl', 'a cute taco owl'], 9: ['Bubblegumbo', 'a cute bubblegum elephant'], 18: ['Velvaroo', 'a cute red-velvet-cake kangaroo boxer'],
  12: ['Sloba', 'a cute sleepy bubble-tea sloth: tan fur with dark tapioca-pearl spots, holding a pink straw'], 16: ['Minturtle', 'a cute mint-ice-cream turtle'], 3: ['Bloblin', 'a cute wobbly jelly blob'],
  14: ['Salmonster', 'a cute salmon-sushi river monster'],
};
// nemesis per kaiju: [name, art]
const NEM = {
  0: ['Brutus Beetroot', 'mob-nem-beet'], 10: ['Crustwing', 'mob-nem-crow'], 11: ['Pineapple Pete', 'mob-nem-pine'], 4: ['Zapsy the Bug Lamp', 'mob-nem-lamp'],
  1: ['Professor Penicillin', 'mob-nem-shroom'], 2: ['Sir Slurp', 'mob-nem-slug'], 5: ['Ricotta Rat', 'mob-nem-rat'], 6: ['Duke Fortune Cookie', 'mob-nem-cookie'],
  7: ['Gari the Ginger Serpent', 'mob-nem-ginger'], 8: ['Torchy Brulee', 'mob-nem-brulee'], 15: ['Captain Kebab', 'mob-nem-kebab'], 17: ['Finn Freezepop', 'mob-nem-shark'],
  13: ['El Nacho', 'mob-nem-nacho'], 19: ['Senor Sting', 'mob-nem-hornet'], 9: ['Brittle', 'mob-nem-mouse'], 18: ['Rocky Road', 'mob-nem-gorilla'],
  12: ['Jitters', 'mob-nem-bird'], 16: ['Hot Fudge Hare', 'mob-nem-hare'], 3: ['Grey Gelato', 'mob-nem-gelatin'], 14: ['Grizzly Grizzle', 'mob-nem-bear'],
};
// world: [stage 5 name + place, background, elite [name, art]]
const W = {
  1: ['Rotten Ridge on a giant kitchen countertop', 'bg-far', ['a Rotten Egg brute', 'mob-egg']],
  2: ['the Knight of the Brine\'s pier inside a giant fridge', 'bg-far-fridge', ['a Pickle Knight', 'mob-pickle']],
  3: ['Meatball Mountain inside a giant hot oven', 'bg-far-oven', ['a Meatball Brute', 'mob-meatball']],
  4: ['the Shield Wall on giant pantry shelves', 'bg-far-pantry', ['a Can Crusher', 'mob-can']],
  5: ['the Steel Wool Wall in a giant soapy sink', 'bg-far-sink', ['a Scrub Brute', 'mob-scrub']],
  6: ['Roast Ridge on a giant dining table', 'bg-far-dining', ['a Roast Brute', 'mob-roast']],
  7: ['Patty Plateau at a giant backyard barbecue', 'bg-far-backyard', ['a Burger Brute', 'mob-patty']],
  8: ['Gourd Guard in a giant vegetable garden', 'bg-far-garden', ['a Pumpkin Brute', 'mob-pumpkin']],
  9: ['Melon Mountain in a giant supermarket', 'bg-far-market', ['a Watermelon Brute', 'mob-melon']],
  10: ['the Knight of the Fruitcake\'s hall in the forgotten back of a giant fridge', 'bg-far-fridgeback', ['a Fruitcake Knight', 'mob-fruitknight']],
};
const STILL = 'Painted storybook illustration for a cutscene in my cute 2D side-scrolling kitchen adventure game. Use the same soft painterly, warmly lit, cel-shaded style as the background reference, and draw every character EXACTLY like its reference (same shape, colours, face, outlines, and the SAME NUMBER of arms, legs, eyes and claws: never add extra limbs or eyes). Wide 16:9 landscape, characters medium-sized with scenery around them. NO text, no letters, no writing, no signs or labels with words, no speech bubbles, no UI, no border, no signature, no humans.';
const raw = n => `art-src/raw/${n}.png`;

const jobs = [];
for (const [sp, [hero, look]] of Object.entries(HERO)) {
  const [nem, nemArt] = NEM[sp];
  for (const [w, [place, bg, [elite, eliteArt]]] of Object.entries(W)) {
    const n = Number(w);
    const scene = n <= 5
      ? `at ${place}: ${hero} (the first character reference) stands on the left, brave and ready, facing its nemesis (the second character reference, drawn exactly like it) on the right, who is smug and spoiling for a fight. A tense, funny standoff.`
      : `at ${place}: ${hero} (the first character reference) and its old nemesis (the second character reference, drawn exactly like it), now its friend, stand side by side on the left, looking up the path at ${elite} (the third character reference) waiting in the distance on the right. The old nemesis points the way, cheeky and helpful.`;
    const refs = [raw(bg), `art-src/ref-kaiju-${sp}.png`, raw(nemArt), ...(n > 5 ? [raw(eliteArt)] : [])];
    jobs.push({ name: `still-${sp}-w${w}-elite`, newChat: true, refs, prompt: `Generate an image. The first reference shows the painted background style and the place; the next ${n > 5 ? 'three are' : 'two are'} the characters (${hero} is ${look}). ${STILL} Scene ${scene}` });
  }
}
fs.writeFileSync('art-src/jobs-elite.json', JSON.stringify(jobs, null, 1) + '\n');
console.log(`${jobs.length} jobs`);
