// Writes art-src/jobs-gear2.json: icons for 20 new kaiju armours (a-<ref>x, each with a built-in effect) and 8 new charms
// (eq-<name>). Item data: src/sim/items.ts (BASES "gear variety 2", PROCS). Run: sh scripts/gem-batch.sh art-src/jobs-gear2.json
import fs from 'node:fs';

export const REF = { 0: 'gob', 10: 'blue', 11: 'pizza', 4: 'moth', 1: 'squid', 2: 'crab', 5: 'toast', 6: 'dump', 7: 'nori', 8: 'choco', 15: 'hog', 17: 'peng', 13: 'avo', 19: 'owl', 9: 'gum', 18: 'roo', 12: 'slo', 16: 'mint', 3: 'blob', 14: 'fish' };
// [kaiju, name, what it looks like]
export const ARMOURS = [
  [0, 'Seed Spike Vest', 'a red strawberry-skin vest covered in pointy golden seed spikes'],
  [10, 'Honey Glaze Coat', 'a glossy coat of dripping golden honey glaze with a little honeycomb pattern'],
  [11, 'Pizza Box Plate', 'a chest plate made from a folded cardboard pizza box with a red-checkered lining'],
  [4, 'Silk Cocoon Cloak', 'a soft pale-lilac cloak spun from fluffy silk threads like a cocoon'],
  [1, 'Lab Coat of Pockets', 'a little white lab coat with lots of pockets holding test tubes and tools'],
  [2, 'Rind Shell Armour', 'a sturdy armour made of thick yellow cheese rind with a red wax trim'],
  [5, 'Crust Wing Cape', 'a short cape made of golden toast crust shaped like bat wings'],
  [6, 'Bamboo Steamer Vest', 'a vest made of woven bamboo like a dumpling steamer basket, a puff of steam'],
  [7, 'Nori Wrap Mail', 'a scale-mail armour made of dark green nori seaweed sheets with rice-grain studs'],
  [8, 'Waffle Plate Armour', 'a chunky chest plate shaped like a golden waffle with a chocolate drizzle'],
  [15, 'Bun Bomber Jacket', 'a puffy bomber jacket made of soft hot-dog bun with a mustard zigzag stripe'],
  [17, 'Wafer Tux', 'a tiny smart tuxedo made of crisp vanilla wafer with a cookie bow tie'],
  [13, 'Guac Shell Vest', 'a vest made of a hard avocado-skin shell with a creamy green guacamole lining'],
  [19, 'Taco Shell Mantle', 'a shoulder mantle made of a crunchy yellow taco shell with lettuce trim'],
  [9, 'Gum Bubble Vest', 'a round pink bubblegum vest with a big shiny bubble on the chest'],
  [18, 'Frosting Robe', "a boxer's robe made of red velvet cake with white cream-cheese frosting trim"],
  [12, 'Cozy Boba Hoodie', 'a cozy tan hoodie with tapioca-pearl polka dots and a straw-shaped drawstring'],
  [16, 'Cone Shell Armour', 'a round armour made of a crispy waffle cone with a swirl of mint ice cream on top'],
  [3, 'Jelly Armour', 'a wobbly translucent green jelly breastplate with a cherry emblem'],
  [14, 'River Scale Mail', 'a scale-mail armour made of shiny pink salmon scales with a seaweed belt'],
];
// [icon name, item name, what it looks like]
export const CHARMS = [
  ['eq-kernel', 'Popcorn Kernel', 'a charm made of one big fluffy popped popcorn kernel on a little string loop'],
  ['eq-meringue', 'Meringue Kiss', 'a charm made of a swirled white meringue kiss with a pink tip, on a ribbon'],
  ['eq-maple', 'Maple Leaf', 'a charm shaped like a golden maple leaf dripping a bead of syrup'],
  ['eq-chili', 'Chili Charm', 'a charm made of a little red chili pepper with a curly green stem, glowing warm'],
  ['eq-scoop', 'Ice Cream Scoop', 'a charm shaped like a tiny silver ice-cream scoop holding a pink scoop'],
  ['eq-watch', 'Pocket Watch', 'a charm made of a little brass pocket watch with a cookie for its face'],
  ['eq-cherry', 'Cherry Pit', 'a charm made of a shiny red cherry with a heart-shaped pit showing, on a stem loop'],
  ['eq-magnet', 'Crumb Magnet', 'a charm shaped like a red horseshoe magnet with crumbs stuck to its tips'],
];
if (process.argv[1]?.endsWith('gear2-jobs.mjs')) {
  const STYLE = 'Same style (clean dark outlines, saturated colours, glossy cel shading). A normal (not legendary) item: no glow or sparkles. Shown flat and centred, filling 80% of the frame. Solid flat magenta (#FF00FF) background, no shadow, no text, no character, nobody wearing it. Square 1:1 image.';
  const jobs = [
    ...ARMOURS.map(([sp, name, look]) => ({ name: `a-${REF[sp]}x`, newChat: true, refs: [`art-src/raw/a-${REF[sp]}3.png`],
      prompt: `Generate an image. The reference is an armour icon from my cute 2D kitchen action RPG. Draw a NEW armour icon called "${name}": ${look}. ${STYLE}` })),
    ...CHARMS.map(([icon, name, look]) => ({ name: icon, newChat: true, refs: ['art-src/raw/eq-cookie.png'],
      prompt: `Generate an image. The reference is a charm icon from my cute 2D kitchen action RPG. Draw a NEW charm icon called "${name}": ${look}. ${STYLE}` })),
  ];
  fs.writeFileSync('art-src/jobs-gear2.json', JSON.stringify(jobs, null, 1) + '\n');
  console.log(`${jobs.length} jobs`);
}
