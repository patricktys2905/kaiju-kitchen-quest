// Writes art-src/jobs-minis.json: 20 new minibosses, 2 per world, guarding the miniboss rooms of long stages.
// Game data: src/sim/mobs.ts (the MINIS block, kinds m<world><a|b>). Run: sh scripts/gem-batch.sh art-src/jobs-minis.json shots/gem-minis.log
import fs from 'node:fs';

// [kind, world, name, look]
export const MINIS = [
  ['m1a', 'COUNTERTOP', 'Sir Butterknife', 'a SIR BUTTERKNIFE: a proud stick of butter standing upright like a knight, a butter-knife sword in one hand and a crumpet shield in the other, a little foil-wrapper cape'],
  ['m1b', 'COUNTERTOP', 'The Toaster Tyrant', 'a TOASTER TYRANT: a grumpy chrome toaster on stubby legs with an angry face on its side, two slices of burnt toast poking out of its top slots like horns, little lever arm'],
  ['m2a', 'FRIDGE', 'Ice Cube Ogre', 'an ICE CUBE OGRE: a hulking brute made of stacked frosty ice cubes with a grumpy face, huge ice-cube fists, a frozen pea stuck in its brow'],
  ['m2b', 'FRIDGE', 'The Cheese Wheel', 'a CHEESE WHEEL ROLLER: a big round wheel of yellow cheese standing on its edge with holes for eyes and a grinning mouth, tiny legs, ready to roll'],
  ['m3a', 'OVEN', 'Casserole Commander', 'a CASSEROLE COMMANDER: a bossy orange casserole dish general with oven-mitt hands, a lid tilted like a helmet, steam puffing out, a wooden-spoon baton'],
  ['m3b', 'OVEN', 'Muffin Tin Mortar', 'a MUFFIN TIN MORTAR: a dark metal muffin tin walking on little legs, its cups loaded with flaming hot muffins like cannons, a smug face on the front'],
  ['m4a', 'PANTRY', 'Flour Sack Sumo', 'a FLOUR SACK SUMO: a huge round paper flour sack shaped like a sumo wrestler, flour puffing out of a tear, a twine belt, big stomping stance'],
  ['m4b', 'PANTRY', 'Honey Pot Hermit', 'a HONEY POT HERMIT: an old clay honey pot with a sly face and a honey dipper staff, honey dripping down its sides, a couple of tiny angry bees buzzing round it'],
  ['m5a', 'SINK', 'Sponge Golem', 'a SPONGE GOLEM: a big chunky yellow-and-green kitchen sponge golem full of holes, dripping soapy water, bubbles floating off it, heavy fists'],
  ['m5b', 'SINK', 'Dish Soap Siren', 'a DISH SOAP SIREN: a curvy green dish-soap bottle shaped like a mermaid with a pump-top crown and a bubbly tail, holding a scrub-brush trident'],
  ['m6a', 'DINING ROOM', 'Gravy Boat Captain', 'a GRAVY BOAT CAPTAIN: a white porcelain gravy boat with a pirate captain hat and eyepatch, brown gravy sloshing inside, a ladle hook for a hand'],
  ['m6b', 'DINING ROOM', 'Candelabra Duchess', 'a CANDELABRA DUCHESS: a tall silver candelabra lady with three lit candles as a crown, dripping wax, an elegant haughty face and a lace napkin shawl'],
  ['m7a', 'BACKYARD BBQ', 'Hot Coal Golem', 'a HOT COAL GOLEM: a chunky golem made of glowing charcoal briquettes with orange cracks of fire, grill-grate chest plate, smoke rising off its head'],
  ['m7b', 'BACKYARD BBQ', 'Corn Cob Gunner', 'a CORN COB GUNNER: a tall corn-on-the-cob soldier with husk leaves like a cape, a popcorn-popper blaster, a buttery shine and a cocky grin'],
  ['m8a', 'GARDEN', 'Snapdragon', 'a SNAPDRAGON: a big venus-flytrap plant monster in a terracotta pot, jaws lined with soft spikes, curling vine arms, leafy collar'],
  ['m8b', 'GARDEN', 'Gnome General', 'a GNOME GENERAL: a grumpy chipped garden gnome with a tall red hat, a curly white beard, a little shovel as a sword and medals on his chest'],
  ['m9a', 'SUPERMARKET', 'Trolley Chariot', 'a TROLLEY CHARIOT: a shopping trolley monster with a snarling face on its basket, wobbly wheels, a bent handle like horns, loaded with cans'],
  ['m9b', 'SUPERMARKET', 'Price Gun Paladin', 'a PRICE GUN PALADIN: a knight made of a cardboard box with a price-tag shield and a label price-gun, a SALE sticker-shaped plume (no readable letters)'],
  ['m10a', 'FEAST OF THE FORGOTTEN', 'Forgotten Soup', 'a FORGOTTEN SOUP GHOST: a wispy ghost rising out of an old chipped soup bowl, made of pale green soup steam, sad droopy eyes, a soggy crouton floating in it'],
  ['m10b', 'FEAST OF THE FORGOTTEN', 'Pudding Juggernaut', 'a PUDDING JUGGERNAUT: a huge stale christmas-pudding brute with a sprig of holly on its head, raisins for eyes, cracked brandy-butter armour, big round fists'],
];
if (process.argv[1]?.endsWith('minis-jobs.mjs')) {
  const STYLE = 'in exactly the same art style as the reference (clean dark outlines, saturated colours, glossy cel shading, cute but a little menacing, with a few fuzzy green mould spots because the Mold Crown has corrupted it). It is a MINIBOSS: a bit bigger, tougher and more detailed than a normal enemy. Side view facing LEFT, whole body visible, centred, filling about 85% of the frame. Solid flat magenta (#FF00FF) background, no shadow, no text. Square 1:1 image.';
  const jobs = MINIS.map(([kind, world, , desc]) => ({ name: `mob-${kind}`, newChat: true, refs: ['art-src/raw/mob-bun.png'],
    prompt: `Generate an image. The reference is an enemy from my cute 2D side-scrolling action RPG set in a giant kitchen and house. I need a NEW MINIBOSS for the ${world} world: ${desc}. Draw it ${STYLE}` }));
  fs.writeFileSync('art-src/jobs-minis.json', JSON.stringify(jobs, null, 1) + '\n');
  console.log(`${jobs.length} jobs`);
}
