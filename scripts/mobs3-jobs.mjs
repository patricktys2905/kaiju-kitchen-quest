// Writes art-src/jobs-mobs3.json: 20 new monsters (2 per world, so early stages have more kinds to hunt) and their drops.
// Game data: src/sim/mobs.ts (MOBS3 block), src/sim/drops.ts. Run: sh scripts/gem-batch.sh art-src/jobs-mobs3.json shots/gem-mobs3.log
import fs from 'node:fs';

// [kind, world, monster look, drop name, drop look]
export const MOBS3 = [
  ['jamhop', 'COUNTERTOP', 'a JAM BLOB HOPPER: a bouncy blob of strawberry jam with a toothy grin and a jam-jar lid stuck on its head like a hat', 'Jam Glob', 'a glossy red blob of strawberry jam'],
  ['salt', 'COUNTERTOP', 'a SALT SHAKER GUNNER: a grumpy glass salt shaker on little legs that fires salt grains from its holes', 'Salt Crystal', 'a sparkly white salt crystal'],
  ['cheesemouse', 'FRIDGE', 'a CHEESE CUBE CRITTER: a small hopping cube of yellow cheese with mouse ears and holes', 'Cheese Crumb', 'a small wedge of holey yellow cheese'],
  ['icepop', 'FRIDGE', 'a MELTY ICE POP: a dripping rainbow ice lolly on a stick that waddles on two little feet', 'Popsicle Stick', 'a wooden popsicle stick with a melted rainbow tip'],
  ['crouton', 'OVEN', 'a BURNT CROUTON: a tiny angry blackened bread cube with smoke puffing off it, hopping', 'Burnt Crouton', 'a crunchy golden crouton cube'],
  ['mitt', 'OVEN', 'an OVEN MITT GRABBER: a charging quilted oven mitt with a cheeky face and a burn mark', 'Mitt Thread', 'a little spool of red quilted thread'],
  ['bee', 'PANTRY', 'a HONEY BEE: a round fuzzy bee with a honey-dipper stinger, flying', 'Bee Wing', 'a shiny translucent bee wing'],
  ['cracker', 'PANTRY', 'a CRACKER CRAWLER: a square salted cracker walking on crumb legs with a shield-like face', 'Cracker Shard', 'a broken corner of a salted cracker'],
  ['duck', 'SINK', 'a RUBBER DUCKY: a yellow rubber duck with angry eyebrows that squirts soapy water from its beak', 'Ducky Squeaker', 'a little rubber squeaker'],
  ['straw', 'SINK', 'a STRAW SNAKE: a bendy striped drinking straw slithering like a snake with a tiny tongue', 'Straw Bit', 'a short striped bendy straw piece'],
  ['teacake', 'DINING ROOM', 'a TEA CAKE HOPPER: a frosted fairy cake with sprinkles and a cherry, hopping on a doily', 'Sprinkles', 'a little pile of rainbow sprinkles'],
  ['ladle', 'DINING ROOM', 'a LADLE LANCER: a silver soup ladle walking upright, charging with its handle like a lance', 'Ladle Bowl', 'a small shiny silver ladle bowl'],
  ['skewer', 'BACKYARD BBQ', 'a VEGGIE SKEWER SOLDIER: a kebab skewer of pepper, onion and mushroom chunks marching like a soldier', 'Pepper Chunk', 'a chunk of grilled bell pepper'],
  ['firefly', 'BACKYARD BBQ', 'an EMBER FIREFLY: a glowing orange firefly with a little coal-ember body, flying', 'Ember Glow', 'a glowing little ember in a tiny jar'],
  ['caterpillar', 'GARDEN', 'a LEAF CATERPILLAR: a chubby green caterpillar munching a leaf, with tiny boots', 'Silk Thread', 'a small bundle of silky white thread'],
  ['toadstool', 'GARDEN', 'a TOADSTOOL HOPPER: a red-and-white spotted mushroom with a grumpy face, hopping', 'Mushroom Cap', 'a red spotted mushroom cap'],
  ['coupon', 'SUPERMARKET', 'a COUPON GHOST: a floating paper coupon with dotted cut lines and spooky eyes (no readable text)', 'Coupon Scrap', 'a torn paper coupon corner with dotted lines (no text)'],
  ['boxbot', 'SUPERMARKET', 'a CARDBOARD BOX WALKER: a walking cardboard box with tape, a cheeky face and little arms', 'Tape Strip', 'a curled strip of brown packing tape'],
  ['pudding', 'FEAST OF THE FORGOTTEN', 'a PUDDING CUP: a wobbly chocolate pudding in a little cup, hopping, with a spoon stuck in it', 'Pudding Spoon', 'a tiny silver dessert spoon with chocolate on it'],
  ['cracker2', 'FEAST OF THE FORGOTTEN', 'a PARTY CRACKER BOMBER: a red-and-gold Christmas cracker with a fuse, running to explode', 'Paper Crown', 'a folded yellow paper party crown'],
];
if (process.argv[1]?.endsWith('mobs3-jobs.mjs')) {
  const STYLE = 'in exactly the same art style as the reference (clean dark outlines, saturated colours, glossy cel shading, cute but a little mischievous, with a few fuzzy green mould spots because the Mold Crown has corrupted it). Side view facing LEFT, whole body visible, centred, filling about 85% of the frame. Solid flat magenta (#FF00FF) background, no shadow, no text. Square 1:1 image.';
  const DSTYLE = 'Same style as the reference (clean dark outlines, saturated colours, glossy cel shading, cute). A small collectible item icon, shown centred, filling about 75% of the frame. Solid flat magenta (#FF00FF) background, no shadow, no text, no character. Square 1:1 image.';
  const jobs = [];
  for (const [kind, world, look, dname, dlook] of MOBS3) {
    jobs.push({ name: `mob-${kind}`, newChat: true, refs: ['art-src/raw/mob-bun.png'], prompt: `Generate an image. The reference is an enemy from my cute 2D side-scrolling action RPG set in a giant kitchen and house. I need a NEW ENEMY for the ${world} world: ${look}. Draw it ${STYLE}` });
    jobs.push({ name: `drop-${kind}`, newChat: true, refs: ['art-src/raw/c-bean.png'], prompt: `Generate an image. The reference is an item icon from my cute 2D kitchen action RPG. Draw a NEW ITEM icon, a monster drop called "${dname}": ${dlook}. ${DSTYLE}` });
  }
  fs.writeFileSync('art-src/jobs-mobs3.json', JSON.stringify(jobs, null, 1) + '\n');
  console.log(jobs.length, 'jobs');
}
