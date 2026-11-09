// Writes art-src/jobs-mobs2.json: 12 new monsters (3 per world). Run: node scripts/gem-gen.mjs art-src/jobs-mobs2.json
import fs from 'node:fs';

const STYLE = 'in exactly the same art style as the reference (clean dark outlines, saturated colours, glossy cel shading, cute but a little mischievous, with a few fuzzy green mould spots because the Mold Crown has corrupted it). Side view facing LEFT, whole body visible, centred, filling about 85% of the frame. Solid flat magenta (#FF00FF) background, no shadow, no text. Square 1:1 image.';
const M = [
  ['mob-garlic', 'COUNTERTOP', 'a GARLIC CLERIC: a plump garlic-bulb monk holding a little wooden spoon staff topped with a glowing green leaf, it heals other monsters'],
  ['mob-ant', 'COUNTERTOP', 'a SUGAR ANT DIGGER: a chunky ant made of sugar cubes with big shovel-like digging claws and a miner\'s bottle-cap helmet'],
  ['mob-mimic', 'COUNTERTOP', 'a LUNCHBOX MIMIC: a blue-and-orange plastic lunchbox monster with its lid wide open as a mouth full of jagged teeth and a long licorice tongue, little stubby legs'],
  ['mob-carrot', 'FRIDGE', 'a CARROT SNIPER: a lean carrot with leafy hair, one squinting eye behind a frosty monocle, holding a long drinking-straw blowgun'],
  ['mob-milk', 'FRIDGE', 'a MILK CARTON RAMMER: a milk carton bull with two little horns, head lowered, stamping hooves, ready to charge'],
  ['mob-jelly', 'FRIDGE', 'a JELLY MOTHER: a big wobbly lime-green jelly mould dessert with a gentle-looking but sinister face and several tiny baby jellies visible floating inside it'],
  ['mob-kettle', 'OVEN', 'a KETTLE TURRET: a short stout copper kettle that sits on the ground with no legs, its spout aimed forward like a cannon, angry steam puffing from the lid'],
  ['mob-sausage', 'OVEN', 'a SAUSAGE RAM: a sizzling sausage link wearing a tin-cup helmet, leaning forward with stubby legs, ready to charge'],
  ['mob-marsh', 'OVEN', 'a MARSHMALLOW MEDIC: a toasted golden-brown marshmallow wearing a little nurse cap, leaning on a roasting stick like a cane, carrying a tiny first-aid tin'],
  ['mob-noodle', 'PANTRY', 'a NOODLE LURKER: a tangle of dry spaghetti strands shaped like a creepy crawling creature, with two meatball eyes and grabbing noodle tendrils'],
  ['mob-raisin', 'PANTRY', 'a RAISIN SNIPER: a small wrinkly purple raisin with a squinting eye, holding a rubber-band slingshot made from a fork'],
  ['mob-cereal', 'PANTRY', 'a CEREAL BOX MIMIC: a plain colourful cereal box monster with only a simple smiling sun shape on its front (NO bird, NO animal mascot, NO letters or words anywhere) whose top flaps open as a mouth full of jagged teeth with cereal hoops spilling out, little stubby legs'],
];
const jobs = M.map(([name, world, desc]) => ({ name, newChat: true, refs: ['art-src/raw/mob-bun.png'],
  prompt: `Generate an image. The reference is an enemy from my cute 2D side-scrolling action RPG set in a giant kitchen. I need a NEW ENEMY for the ${world} world: ${desc}. Draw it ${STYLE}` }));
fs.writeFileSync('art-src/jobs-mobs2.json', JSON.stringify(jobs, null, 1) + '\n');
console.log(`${jobs.length} jobs`);
