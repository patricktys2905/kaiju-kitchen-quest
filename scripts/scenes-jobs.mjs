// Writes art-src/jobs-scenes.json: a painted scene for every short story moment (beats w{N}-s{n}: stages 2, 3, 4, 6, 7, 8, 9
// of every world), shared by all kaiju. The left foreground is left open: the story player shows YOUR kaiju's portrait there.
// Run (one at a time, a refusal hangs gem-gen):  for i in $(seq 0 69); do timeout 180 node scripts/gem-gen.mjs art-src/jobs-scenes.json $i 1; done
// then `npm run art`. Shown by stillFor() in src/story/stories.ts.
import fs from 'node:fs';

// world: [place, background art, three of its own monsters [art, name, look], the boss [art, name]]
const W = {
  1: ['The Countertop, a giant sunny kitchen countertop', 'bg-far', [['mob-bun', 'Moldy Buns'], ['mob-worm', 'Sour Worms'], ['mob-ant', 'Sugar Ants']], ['boss-toast', 'the Burnt Toast King']],
  2: ['The Fridge, a giant chilly refrigerator', 'bg-far-fridge', [['mob-pea', 'Pea Shooters'], ['mob-yogurt', 'Yogurt Blobs'], ['mob-milk', 'Milk Carton Bulls']], ['boss-golem', 'the Freezer Golem']],
  3: ['The Oven, a giant hot oven with glowing racks', 'bg-far-oven', [['mob-bacon', 'Bacon Strips'], ['mob-popcorn', 'Popcorn Kernels'], ['mob-sausage', 'Sausage Links']], ['boss-dragon', 'the Grease Dragon']],
  4: ['The Pantry, giant dusty pantry shelves', 'bg-far-pantry', [['mob-cheerio', 'Cheerio Rings'], ['mob-flour', 'Flour Ghosts'], ['mob-noodle', 'Noodle Monsters']], ['boss-jar', 'the Cookie Jar Mimic']],
  5: ['The Sink, a giant soapy kitchen sink', 'bg-far-sink', [['mob-plate', 'Crusty Plates'], ['mob-bubble', 'Soap Bubbles'], ['mob-mug', 'Grumpy Mugs']], ['boss-mold', 'the Mold Crown']],
  6: ['The Dining Room, a giant fancy dining table', 'bg-far-dining', [['mob-fork', 'Fork Soldiers'], ['mob-napkin', 'Napkin Ghosts'], ['mob-candle', 'Candle Imps']], ['boss-stale', 'Sir Stale']],
  7: ['The Backyard BBQ, a giant sunny backyard barbecue', 'bg-far-backyard', [['mob-beetle', 'Kebab Beetles'], ['mob-wasp', 'Picnic Wasps'], ['mob-ketchup', 'Ketchup Bottles']], ['boss-brussels', 'Baron Brussels']],
  8: ['The Garden, a giant vegetable garden', 'bg-far-garden', [['mob-snail', 'Lettuce Snails'], ['mob-ladybug', 'Tomato Ladybugs'], ['mob-peapod', 'Peapod Snipers']], ['boss-meatloaf', 'the Mystery Meatloaf']],
  9: ['The Supermarket, giant supermarket aisles', 'bg-far-market', [['mob-trolley', 'Runaway Trolleys'], ['mob-bag', 'Plastic Bag Ghosts'], ['mob-banana', 'Banana Bunches']], ['boss-tupper', 'the Tupperwraith']],
  10: ['the forgotten back of a giant old fridge, a frosty gloomy kingdom', 'bg-far-fridgeback', [['mob-cherrysoldier', 'Candied Cherry Soldiers'], ['mob-peel', 'Candied Peel Bats'], ['mob-fruitknight', 'Fruitcake Knights']], ['boss-fruitcake', 'Old Fruitcake']],
};
// the stage names (src/sim/stages.ts WORLDS names), for stages 2, 3, 4, 6, 7, 8, 9
const NAMES = {
  1: ['Crumb Trail', 'Gummy Gully', 'Toaster Hills', 'Spice Shelf', 'Pepper Pass', 'Cutting Board Bluffs', 'Burner Approach'],
  2: ['Dairy Lane', 'Frosty Shelf', 'Pickle Jar Pier', 'Egg Carton Cliffs', 'Butter Bridge', 'Ketchup Canyon', 'Ice Tray Steps'],
  3: ['Bottom Rack', 'Muffin Tin Maze', 'Casserole Cliffs', 'Cookie Sheet Plains', 'Roasting Pan Pass', 'Pizza Stone Steppe', 'Top Rack Ascent'],
  4: ['Cereal Canyon', 'Flour Drifts', 'Tin Can Alley', 'Spice Rack Ridge', 'Pasta Jar Peaks', 'Honey Hollow', 'Top Shelf Climb'],
  5: ['Suds Slide', 'Sponge Shoals', 'Dish Rack Ridge', 'Bubble Bay', 'Plughole Pass', 'Greasy Pan Pits', 'Drain Descent'],
  6: ['Placemat Plains', 'Candelabra Crossing', 'Gravy Boat Bay', 'Teacup Terrace', 'Napkin Fold Fort', 'Silverware Siege', 'Chandelier Climb'],
  7: ['Hose Highway', 'Sprinkler Springs', 'Paddling Pool Pier', 'Picnic Table Peak', 'Flowerpot Fort', 'Cooler Canyon', 'Charcoal Climb'],
  8: ['Watering Can Run', 'Sunflower Grove', 'Pumpkin Patch Path', 'Beanstalk Heights', 'Compost Keep', 'Scarecrow Stand', 'Greenhouse Steps'],
  9: ['Trolley Track', 'Cereal Aisle', 'Fruit and Veg', 'Bakery Bluff', 'Canned Goods Keep', 'Checkout Chaos', 'The Frozen Aisle'],
  10: ['Jam Jar Junction', 'Takeaway Towers', 'Frost Drawer Falls', 'Paper Chain Pass', 'The Forgotten Shelf', 'The Last Stand', 'The Long Table'],
};
const STILL = 'Painted storybook illustration for a cutscene in my cute 2D side-scrolling kitchen adventure game. Use the same soft painterly, warmly lit, cel-shaded style as the background reference, and draw any character EXACTLY like its reference (same shape, colours, face, outlines, same number of limbs). Wide 16:9 landscape, characters small-to-medium in the frame with plenty of scenery. IMPORTANT: keep the LEFT third of the picture free of characters (just open floor and scenery there: the hero will stand there). NO text, no letters, no words written anywhere (not on the floor, banners, labels or signs), no speech bubbles, no UI, no border, no signature, no humans.';
const raw = n => `art-src/raw/${n}.png`;

const jobs = [];
for (const [wid, [place, bg, mobs, [bossArt, boss]]] of Object.entries(W)) {
  const [m1, m2, m3] = mobs, nm = NAMES[wid];
  const at = i => `${nm[i]}, in ${place}`;
  const scenes = {
    2: [[m1, m2], `a long downhill stretch in ${place}. At the top of the slope a GIANT wooden rolling pin is just starting to roll down, about to chase whoever is below. A few ${m1[1]} and ${m2[1]} (draw them exactly like the references) wait along the way, looking smug.`],
    3: [[m1, m2], `${at(1)}: a wide open arena walled in by two tall wooden ladle pillars; a gang of ${m1[1]} and ${m2[1]} (exactly like the references) gathers in the middle, ready to fight. A big lever sticks out of the floor nearby.`],
    4: [['npc-crumblet', m1], `${at(2)}: a tiny lost CRUMBLET (draw it exactly like the first character reference: a small cute crumb creature) hides and trembles behind a big object, peeking out, hoping to be rescued. In the distance a ${m1[1].replace(/s$/, '')} (like the second reference) prowls about.`],
    6: [['c-scroll', m1], `${at(3)}: far away at the end of the path, the glowing RECIPE SCROLL (exactly like the reference) rests on a high spot, golden light and sparkles around it. ${m1[1]} (like the reference) stand guard along the path.`],
    7: [['ob-chest', m2], `${at(4)}: a treasure chest (exactly like the reference) glints on a high hidden ledge above the path, out of easy reach; a few ${m2[1]} (like the reference) patrol below.`],
    8: [[m1, m3], `${at(5)}: a big horde of ${m1[1]} and ${m3[1]} (exactly like the references) pours in from the right, dramatic and exciting, the place about to be overrun. Hold the line!`],
    9: [[[bossArt, boss]], `the last climb of ${at(6)}. Far ahead and high up looms the lair of ${boss}: its shape (like the reference, but dark, distant and half hidden) at the top, ominous light and long shadows. The final fight is near.`],
  };
  for (const [n, [chars, text]] of Object.entries(scenes)) {
    const refs = [raw(bg), ...chars.map(c => raw(Array.isArray(c) ? c[0] : c))];
    jobs.push({ name: `still-w${wid}-s${n}`, newChat: true, refs, prompt: `Generate an image. The first reference shows the painted background style and the place.${chars.length ? ' The other references are characters/objects to include.' : ''} ${STILL} Scene: ${text}` });
  }
}
fs.writeFileSync('art-src/jobs-scenes.json', JSON.stringify(jobs, null, 1) + '\n');
console.log(`${jobs.length} jobs`);
