// Writes art-src/jobs-gear3.json: late-game gear, two more weapon and armour tiers per kaiju (tier 4 from item level 40,
// tier 5 from 75): w-<ref>4, w-<ref>5, a-<ref>4, a-<ref>5. Item data: src/sim/items.ts (BASES "late-game tiers").
// Run: sh scripts/gem-batch.sh art-src/jobs-gear3.json shots/gem-gear3.log
import fs from 'node:fs';

export const REF = { 0: 'gob', 10: 'blue', 11: 'pizza', 4: 'moth', 1: 'squid', 2: 'crab', 5: 'toast', 6: 'dump', 7: 'nori', 8: 'choco', 15: 'hog', 17: 'peng', 13: 'avo', 19: 'owl', 9: 'gum', 18: 'roo', 12: 'slo', 16: 'mint', 3: 'blob', 14: 'fish' };
// kaiju: [[tier-4 weapon, look], [tier-5 weapon, look], [tier-4 armour, look], [tier-5 armour, look]]
export const GEAR3 = {
  0: [['Thorn Vine Flail', 'a flail of twisted thorny strawberry vines with a big glossy berry head'], ['Jam Dragon Cleaver', 'a huge cleaver of crystallised red jam with a strawberry-leaf hilt'],
      ['Berry Patch Plate', 'a sturdy plate armour of layered strawberry slices with leaf pauldrons'], ['Ruby Jam Armour', 'a grand armour of glossy ruby-red jam crystal with golden seed studs']],
  10: [['Blueberry Bomb Hammer', 'a big hammer whose head is a cluster of shiny blueberries bound in a muffin-tin band'], ['Golden Muffin Maul', 'a giant maul shaped like a golden muffin top with blueberry gems'],
      ['Crumble Knight Plate', 'a knightly plate armour with a crumbly streusel texture and blueberry buttons'], ['Royal Muffin Mail', 'a royal armour of golden muffin-cup pleats with a blueberry crown crest']],
  11: [['Cheese Wheel Saw', 'a round saw blade made of a hard cheese wheel with pepperoni teeth'], ['Inferno Pizza Blade', 'a long curved sword of fiery pizza crust with a molten-cheese edge'],
      ['Mozzarella Mail', 'a stretchy chain mail of woven mozzarella strands with a basil-leaf clasp'], ['Wood-Fired Plate', 'a dark heavy plate armour like a wood-fired oven with glowing ember cracks']],
  4: [['Starlight Whisk', 'an elegant wand made of a silver whisk with a glowing star in its wires'], ['Moonmallow Scepter', 'a scepter topped with a glowing crescent-moon marshmallow'],
      ['Spun Sugar Robe', 'a flowing robe of spun sugar threads in pastel lilac'], ['Nebula Silk Gown', 'a starry deep-purple silk gown with marshmallow-puff shoulders']],
  1: [['Bubbling Beaker Staff', 'a staff topped with a round beaker of bubbling blue potion'], ['Tentacle Tesla Rod', 'a rod coiled with jelly tentacles and crackling blue sparks'],
      ['Reef Plate', 'a plate armour of pink and blue coral'], ['Abyssal Lab Armour', 'a deep-sea armour with glowing jellyfish lanterns and brass gauges']],
  2: [['Parmesan Pincers', 'a pair of crab pincers carved from hard parmesan cheese'], ['Cabbage King Claw', 'a giant regal claw of layered cabbage leaves with a gold rim'],
      ['Cheddar Bulwark', 'a thick round armour of orange cheddar with a red wax trim'], ['Aged Gouda Fortress', 'a massive fortress-like armour of aged golden gouda with wax towers']],
  5: [['Crouton Daggers', 'two curved daggers made of crunchy golden croutons'], ['Burnt Toast Reaper', 'a dark scythe with a blade of blackened toast and glowing embers'],
      ['Sourdough Shadow Cloak', 'a hooded shadowy cloak with a sourdough crust texture'], ['Midnight Brioche Mantle', 'a midnight-blue mantle with golden brioche plates'],],
  6: [['Bao Moon Staff', 'a staff topped with a round white bao bun like a full moon'], ['Imperial Wok Shield', 'a grand round wok used as a weapon with a dragon motif'],
      ['Jade Steamer Robe', 'a jade-green robe with woven bamboo steamer panels'], ['Emperor Dumpling Armour', 'an imperial armour of golden dumpling-pleat scales']],
  7: [['Salmon Fin Katana', 'a sleek katana with a salmon-pink blade and a nori-wrapped hilt'], ['Wasabi Dragon Glaive', 'a long glaive with a glowing green wasabi dragon blade'],
      ['Tamago Plate', 'a plate armour of folded yellow tamago omelette layers'], ['Dragon Roll Armour', 'a grand armour shaped like a dragon sushi roll with avocado scales']],
  8: [['Brownie Brick Gauntlets', 'heavy gauntlets made of fudgy brownie bricks'], ['Molten Lava Cake Hammer', 'a hammer with a lava-cake head oozing glowing chocolate'],
      ['Truffle Plate', 'a dark chocolate truffle plate armour with cocoa dust'], ['Cocoa Titan Armour', 'a massive cocoa-bean titan armour with gold-foil trim']],
  15: [['Kebab Lance', 'a long lance threaded with grilled kebab chunks'], ['Flaming Grill Fork', 'a giant barbecue fork with flaming prongs'],
      ['Grill Mesh Mail', 'a chain mail of blackened grill mesh with mustard-yellow trim'], ['Barbecue Champion Plate', 'a champion plate armour with grill bars and a golden sausage emblem']],
  17: [['Frozen Cone Lance', 'a lance shaped like a long frozen ice-cream cone with icy swirls'], ['Blizzard Sundae Staff', 'a staff topped with a swirling blizzard sundae and a cherry'],
      ['Cookie Crust Plate', 'a plate armour of black-and-white cookie crust'], ['Glacier Tux Armour', 'an icy tuxedo-style armour of glacier blue with cookie buttons']],
  13: [['Nacho Spear', 'a spear with a big triangular nacho chip blade and salsa'], ['Golden Avocado Staff', 'a staff topped with a gleaming golden avocado half and its pit'],
      ['Guac Shell Armour', 'a tough green avocado-skin shell armour'], ['Fiesta Dragon Plate', 'a festive dragon plate armour with papel-picado colours'],],
  19: [['Churro Wand', 'a wand made of a sugary churro with a star tip'], ['Pinata Thunder Staff', 'a staff topped with a colourful pinata star crackling with sparks'],
      ['Tortilla Feather Mantle', 'a feathered mantle of golden tortilla strips'], ['Night Fiesta Armour', 'a midnight armour with glowing fiesta-light trims and owl motifs']],
  9: [['Jawbreaker Mace', 'a mace with a layered rainbow jawbreaker head'], ['Bubble Blaster', 'a big candy-pink blaster that blows giant bubblegum bubbles'],
      ['Taffy Armour', 'a stretchy pastel taffy armour with candy-wrapper trims'], ['Rock Candy Fortress', 'a crystal armour of glittering rock candy']],
  18: [['Fudge Knuckles', 'boxing knuckles made of glossy fudge'], ['Champion Cake Gloves', 'golden champion boxing gloves with red velvet cake layers'],
      ['Velvet Boxer Robe', "a deep-red velvet boxer's robe with gold trim"], ['Grand Champion Belt Armour', 'an armour with a huge golden champion belt and frosting layers']],
  12: [['Boba Bo Staff', 'a long bo staff like a tall bubble-tea straw with tapioca pearls'], ['Dream Pillow Hammer', 'a hammer with a big fluffy cloud-pillow head'],
      ['Tea Leaf Wrap', 'a wrap armour of layered tea leaves with a boba button'], ['Sleepy Moon Robe', 'a cosy dark-blue robe with sleepy moons and stars']],
  16: [['Mint Crystal Shield', 'a round shield of clear mint crystal with chocolate chips'], ['Glacier Scoop Staff', 'a staff topped with a giant ice-cream scoop of glacier mint'],
      ['Waffle Shell Plate', 'a heavy armour like a waffle-cone turtle shell'], ['Frozen Fortress Shell', 'a massive frozen shell armour of mint ice and dark chocolate']],
  3: [['Gelatin Whip', 'a wobbly whip of clear rainbow gelatin'], ['Jelly Crown Sceptre', 'a sceptre topped with a wobbly jelly crown and a cherry'],
      ['Wobble Mail', 'a mail armour of little jelly cubes in many colours'], ['Royal Jelly Armour', 'a regal armour of golden royal jelly with honeycomb trims']],
  14: [['Salmon Harpoon', 'a harpoon with a salmon-pink head and a seaweed-wrapped shaft'], ['River King Trident', 'a grand trident with a leaping-salmon motif and a lemon gem'],
      ['Riverstone Scale Mail', 'a scale mail of smooth grey river stones and salmon scales'], ['Sushi Emperor Armour', 'an emperor armour with nigiri shoulder plates and a wasabi gem']],
};
if (process.argv[1]?.endsWith('gear3-jobs.mjs')) {
  const STYLE = 'Same style (clean dark outlines, saturated colours, glossy cel shading). A strong high-level item (a little more ornate than the reference, but no glow or sparkles). Solid flat magenta (#FF00FF) background, no shadow, no text, no character, nobody wearing or holding it. Square 1:1 image.';
  const jobs = [];
  for (const [sp, [[w4, l4], [w5, l5], [a4, la4], [a5, la5]]] of Object.entries(GEAR3)) {
    const r = REF[sp];
    for (const [name, look, icon, ref, what] of [[w4, l4, `w-${r}4`, `w-${r}3`, 'WEAPON'], [w5, l5, `w-${r}5`, `w-${r}3`, 'WEAPON'], [a4, la4, `a-${r}4`, `a-${r}3`, 'ARMOUR'], [a5, la5, `a-${r}5`, `a-${r}3`, 'ARMOUR']])
      jobs.push({ name: icon, newChat: true, refs: [`art-src/raw/${ref}.png`], prompt: `Generate an image. The reference is a ${what.toLowerCase()} icon from my cute 2D kitchen action RPG. Draw a NEW ${what} icon called "${name}": ${look}. ${what === 'WEAPON' ? 'Shown diagonally with the HEAD at the TOP-LEFT and the HANDLE at the BOTTOM-RIGHT (round items simply centred)' : 'Shown flat and centred'}, filling 80% of the frame. ${STYLE}` });
  }
  fs.writeFileSync('art-src/jobs-gear3.json', JSON.stringify(jobs, null, 1) + '\n');
  console.log(`${jobs.length} jobs`);
}
