// Writes art-src/jobs-weapons2.json: icons for 40 new kaiju weapons (2 per kaiju, w-<ref>a / w-<ref>b), same style as the
// kaiju's tier-3 weapon. node scripts/gem-gen.mjs art-src/jobs-weapons2.json && npm run art
// The item data lives in src/sim/items.ts (BASES, "new weapon types") and src/sim/gear.ts (GEAR).
import fs from 'node:fs';

export const HERO = {
  0: 'Gobzilla Jr. (a strawberry dinosaur)', 10: 'Bluebeary (a blueberry-muffin bear)', 11: 'Pizzaraptor (a pizza raptor)', 4: 'Mothball (a marshmallow moth)',
  1: 'Squidgeon (a jelly octopus scientist)', 2: 'Crabbage (a cheese crab with a cabbage shell)', 5: 'Toastbat (a toast bat)', 6: 'Dumplord (a dumpling lord)',
  7: 'Norigon (a sushi dragon)', 8: 'Chocomunch (a chocolate golem)', 15: 'Hotchog (a hot-dog hedgehog)', 17: 'Pengwhip (a cookies-and-cream penguin)',
  13: 'Avocadrake (an avocado dragon)', 19: 'Tacowl (a taco owl)', 9: 'Bubblegumbo (a bubblegum elephant)', 18: 'Velvaroo (a red-velvet-cake kangaroo boxer)',
  12: 'Sloba (a sleepy matcha sloth)', 16: 'Minturtle (a mint-ice-cream turtle)', 3: 'Bloblin (a wobbly jelly blob)', 14: 'Salmonster (a salmon-sushi river monster)',
};
export const REF = { 0: 'gob', 10: 'blue', 11: 'pizza', 4: 'moth', 1: 'squid', 2: 'crab', 5: 'toast', 6: 'dump', 7: 'nori', 8: 'choco', 15: 'hog', 17: 'peng', 13: 'avo', 19: 'owl', 9: 'gum', 18: 'roo', 12: 'slo', 16: 'mint', 3: 'blob', 14: 'fish' };
// [kaiju, a|b, name, what it looks like]
export const NEW = [
  [0, 'a', 'Seed Slingshot', 'a wooden slingshot whose frame is a forked strawberry stem with green leaves, loaded with a shiny strawberry seed'],
  [0, 'b', 'Stem Boomerang', 'a curved boomerang made of a thick green strawberry stem with little leaves and a red berry tip'],
  [10, 'a', 'Muffin Tin Shield', 'a round shield made from a silver muffin baking tin, with blueberry studs and a frosting swirl emblem'],
  [10, 'b', 'Honeycomb Club', 'a chunky club made of golden honeycomb dripping honey, on a wooden honey-dipper handle'],
  [11, 'a', 'Pepperoni Chakram', 'a round throwing ring made of a big pepperoni slice with a sharp cheese-crust edge'],
  [11, 'b', 'Crust Sabre', 'a curved sabre made of golden-brown pizza crust with a melted-cheese blade edge and a pepper hilt'],
  [4, 'a', 'Lantern Staff', 'a slim staff with a glowing paper lantern hanging from a curled marshmallow top, soft lilac light'],
  [4, 'b', "S'more Scepter", "a scepter made of a stacked s'more (graham cracker, chocolate, toasted marshmallow) on a stick, glowing warmly"],
  [1, 'a', 'Test Tube Slinger', 'a sling made of a lab rubber tube holding a bubbling blue test tube, with tiny bubbles'],
  [1, 'b', 'Coral Boomerang', 'a cute curved toy boomerang painted pink like sea coral, decorated with round blue bubble dots'],
  [2, 'a', 'Cheese Wheel Buckler', 'a round buckler shield made of a whole yellow cheese wheel with a red wax rim and holes'],
  [2, 'b', 'Cabbage Flail', 'a flail with a round green cabbage head on a chain and a wooden handle'],
  [5, 'a', 'Breadstick Darts', 'a bundle of three crunchy golden breadsticks with sharp tips and sesame seeds, tied with a ribbon'],
  [5, 'b', 'Jam Knife', 'a butter knife coated in shiny red jam, with a curved blade like a boomerang'],
  [6, 'a', 'Soup Spoon Staff', 'a cute long wooden staff with a big white ceramic soup spoon at the top end, a little golden soup inside'],
  [6, 'b', 'Bao Bun Mace', 'a mace whose head is a fluffy white bao bun with a pleated top, steam puffing out, on a bamboo handle'],
  [7, 'a', 'Chopstick Boomerang', 'two lacquered red chopsticks joined in a V shape like a boomerang, with a little gold band'],
  [7, 'b', 'Soy Sauce Staff', 'a staff topped with a small glass soy sauce bottle with a red cap, dark sauce sloshing inside'],
  [8, 'a', 'Cocoa Pod Club', 'a heavy club made of a ribbed orange-brown cocoa pod split open showing cocoa beans'],
  [8, 'b', 'Truffle Flail', 'a flail with a dusted round chocolate truffle head on a chain of chocolate links'],
  [15, 'a', 'Mustard Bottle', 'a yellow mustard squeeze bottle held like a blaster, mustard drip at the nozzle'],
  [15, 'b', 'Bun Boomerang', 'a curved hot-dog bun shaped like a boomerang, toasted golden with grill marks'],
  [17, 'a', 'Ice Skate Blade', 'a single ice-skate blade used as a short sword, a black-and-white cookie hilt, frost sparkles'],
  [17, 'b', 'Wafer Fan', 'a folding fan made of crisp vanilla wafer sheets with cookies-and-cream swirls'],
  [13, 'a', 'Tortilla Shield', 'a round shield made of a big golden tortilla with a green guacamole emblem in the middle'],
  [13, 'b', 'Lime Boomerang', 'a curved boomerang made of a bright green lime wedge with a white pith edge'],
  [19, 'a', 'Salsa Shaker', 'a maraca made of a red chili pepper with a wooden handle, salsa splashes'],
  [19, 'b', 'Feather Fan Blade', 'a fan-shaped blade made of brown owl feathers with a gold taco-shell rim'],
  [9, 'a', 'Gum Wrapper Whip', 'a whip made of a long stretchy pink bubblegum strand with a colourful gum-wrapper handle'],
  [9, 'b', 'Jawbreaker Flail', 'a flail with a big shiny rainbow jawbreaker candy ball on a chain'],
  [18, 'a', 'Cake Boxing Mitt', 'a boxing glove made of red velvet cake with a white cream-cheese frosting cuff'],
  [18, 'b', 'Red Velvet Boomerang', 'a curved boomerang made of a red velvet cake slice with cream-cheese frosting layers'],
  [12, 'a', 'Pillow Mace', 'a soft mace whose head is a fluffy green matcha-coloured pillow with a tassel, on a bamboo handle'],
  [12, 'b', 'Bamboo Boomerang', 'a boomerang made of two bent green bamboo stalks tied with string, with a little leaf'],
  [16, 'a', 'Waffle Cone Shield', 'a shield made of a crispy waffle-cone pattern with a scoop of mint ice cream as the boss in the middle'],
  [16, 'b', 'Choc-Chip Flail', 'a flail with a round mint-choc-chip ice-cream scoop head on a chain, frosty mist'],
  [3, 'a', 'Jelly Spoon', 'a big wobbly spoon made of clear green jelly with a cherry on the handle end'],
  [3, 'b', 'Gummy Ring', 'a throwing ring made of a sugary rainbow gummy ring candy'],
  [14, 'a', 'Fishing Rod', 'a bamboo fishing rod with a red-and-white bobber and a hook on the line'],
  [14, 'b', 'Roe Bomb Pouch', 'a little net pouch full of glossy orange salmon-roe bombs with tiny fuses'],
];
if (process.argv[1]?.endsWith('weapons2-jobs.mjs')) {
  const jobs = NEW.map(([sp, ab, name, look]) => ({
    name: `w-${REF[sp]}${ab}`, newChat: true, refs: [`art-src/raw/w-${REF[sp]}3.png`],
    prompt: `Generate an image. The reference is a weapon icon from my cute 2D kitchen action RPG. Draw a NEW weapon icon in exactly the same style (clean dark outlines, saturated colours, glossy cel shading), themed for my hero ${HERO[sp]}, called "${name}": ${look}. A normal (not legendary) weapon: no glow or sparkles. Shown diagonally with the HEAD at the TOP-LEFT and the HANDLE at the BOTTOM-RIGHT (round or flat items simply centred), filling 80% of the frame. Solid flat magenta (#FF00FF) background, no shadow, no text, no character. Square 1:1 image.`,
  }));
  fs.writeFileSync('art-src/jobs-weapons2.json', JSON.stringify(jobs, null, 1) + '\n');
  console.log(`${jobs.length} jobs`);
}
