// Writes art-src/jobs-sigs.json: icons for the 24 signature legendaries (u-<slug>), same style as the kaiju gear.
// node scripts/gem-gen.mjs art-src/jobs-sigs.json && node scripts/process-art.mjs u-
import fs from 'node:fs';

const HERO = { 0: 'Gobzilla Jr. (a strawberry dinosaur)', 10: 'Bluebeary (a blueberry-muffin bear)', 11: 'Pizzaraptor (a pizza raptor)', 4: 'Mothball (a marshmallow moth)', 1: 'Squidgeon (a jelly octopus scientist)', 2: 'Crabbage (a cheese crab with a cabbage shell)', 5: 'Toastbat (a toast bat)', 6: 'Dumplord (a dumpling lord)', 7: 'Norigon (a sushi dragon)', 8: 'Chocomunch (a chocolate golem)', 15: 'Hotchog (a hot-dog hedgehog)', 17: 'Pengwhip (a cookies-and-cream penguin)' };
const REF = { 0: 'gob', 10: 'blue', 11: 'pizza', 4: 'moth', 1: 'squid', 2: 'crab', 5: 'toast', 6: 'dump', 7: 'nori', 8: 'choco', 15: 'hog', 17: 'peng' };
// [name, slot, kaiju, what it looks like]
const SIGS = [
  ['Jam Crown Scepter', 'weapon', 0, 'a royal scepter topped with a glowing strawberry-jam crown, dripping sticky red jam'],
  ['Hot Seedpod Shell', 'armor', 0, 'a chest armour made of a big glossy red strawberry pod, its seeds glowing like hot embers'],
  ['Berry Bomb Basket', 'weapon', 10, 'a woven picnic basket on a stick handle, overflowing with fizzing blueberry bombs with little fuses'],
  ['Brain-Freeze Bonnet', 'armor', 10, 'a frosty muffin-cup bonnet armour with icy blue frosting and icicles, cold mist around it'],
  ['Deep-Dish Disc', 'weapon', 11, 'a thick round deep-dish pizza used as a spinning throwing disc, a sharp pizza-cutter wheel rim, steaming hot'],
  ['Hot Delivery Bag', 'armor', 11, 'a red insulated pizza delivery backpack armour with flame decals and a little lightning bolt, steam puffing out'],
  ['Moonbeam Fan', 'weapon', 4, 'an elegant folding hand fan made of glowing moon-white marshmallow and silver threads, with a crescent moon charm'],
  ['Lantern Heart', 'armor', 4, 'a soft lilac silk robe armour with a glowing heart-shaped paper lantern set in its chest'],
  ['Eight-Arm Gauntlet', 'weapon', 1, 'a big blue jelly gauntlet with eight curling suction-cup tentacle fingers, a tiny colander on the knuckles'],
  ['Bubbling Flask Belt', 'armor', 1, 'a lab-coat style armour with a belt of bubbling glass science flasks full of icy blue liquid'],
  ['Gouda Grand Claw', 'weapon', 2, 'a giant golden gouda-cheese crab claw weapon with a wax-red rim and holes in the cheese'],
  ['Cabbage Crown', 'armor', 2, 'a regal armour made of layered cabbage leaves with a little crown of curled leaves, oozing melted cheddar'],
  ['Toaster Fangs', 'weapon', 5, 'a silver toaster-shaped knuckle weapon with toast-slice fangs popping out, glowing orange heat coils'],
  ['Crumb Cloak', 'armor', 5, 'a dark hooded cloak made of golden toast crusts and crumbs, with a butter-pat clasp'],
  ['Bamboo Steamer Crown', 'weapon', 6, 'a royal staff topped by a stacked bamboo dumpling steamer basket shaped like a crown, hot steam billowing'],
  ['Royal Soup Ladle', 'armor', 6, 'a ceremonial armour with a big golden soup ladle crest and a jade soup-bowl breastplate, steaming broth'],
  ['Wasabi Heart Blade', 'weapon', 7, 'a curved sushi-chef blade with a glowing green wasabi gem in the hilt, green flames along the edge'],
  ['Onigiri Halo', 'armor', 7, 'a nori seaweed armour with a ring of floating rice balls (onigiri) circling it like a halo'],
  ['Golden Bar Gauntlets', 'weapon', 8, 'a pair of huge gauntlets made of shiny gold-foil-wrapped chocolate bars'],
  ['Molten Fudge Core', 'armor', 8, 'a chocolate-block chest plate with a glowing core of bubbling molten fudge in the middle, dripping'],
  ['Picnic Net Launcher', 'weapon', 15, 'a ketchup-and-mustard squeeze-bottle launcher that fires a red-checkered picnic tablecloth net'],
  ['Grillmaster Apron', 'armor', 15, 'a heavy barbecue apron armour with grill-bar stripes, red-hot glowing spikes on the shoulders'],
  ['Sundae Scepter', 'weapon', 17, 'a scepter made of a tall ice-cream sundae glass with swirls of cookies-and-cream, whipped cream and a cherry, frosty mist'],
  ['Cherry Bomb Vest', 'armor', 17, 'a puffy cookies-and-cream vest with a row of cherry bombs on fuses across the chest'],
];
const slug = n => 'u-' + n.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');
const jobs = SIGS.map(([name, slot, sp, look]) => ({
  name: slug(name), newChat: true, refs: [`art-src/raw/${slot === 'weapon' ? 'w' : 'a'}-${REF[sp]}3.png`],
  prompt: `Generate an image. The reference is an item icon from my cute 2D kitchen action RPG. Same style (clean dark outlines, saturated colours, glossy cel shading). A LEGENDARY ${slot === 'weapon' ? 'WEAPON' : 'ARMOR'} themed for my hero ${HERO[sp]}, called "${name}": ${look}. Make it look special and magical (a faint golden glow, sparkles), clearly fancier than the reference. ${slot === 'weapon' ? 'Shown diagonally with the HEAD at the TOP-LEFT and the HANDLE at the BOTTOM-RIGHT, centred' : 'Shown flat and centred'}, filling 80% of the frame. Solid flat magenta (#FF00FF) background, no shadow, no text, no character. Square 1:1 image.`,
}));
fs.writeFileSync('art-src/jobs-sigs.json', JSON.stringify(jobs, null, 1) + '\n');
console.log(`${jobs.length} jobs`);
