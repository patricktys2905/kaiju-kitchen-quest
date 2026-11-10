// Writes art-src/jobs-newkaiju.json: everything the two Act 2 kaiju need (parts sheet, gear, signature legendaries,
// mood portraits, story stills, nemesis). Bubblegumbo (9) and Velvaroo (18).  node scripts/gem-gen.mjs art-src/jobs-newkaiju.json
import fs from 'node:fs';

const K = {
  9: {
    desc: 'a pink bubblegum elephant (Bubblegumbo): a chubby glossy pink elephant made of bubblegum with drippy gum, big floppy ears, a trunk blowing a pink bubble, a little tusk, four stubby legs and a tiny tail',
    limbs: 'IMPORTANT BODY RULE: Bubblegumbo has NO arms and NO hands. Its only limbs are four stubby elephant legs, a trunk and a tiny tail, exactly like the reference.',
    parts: '1) the BODY with head, ears, trunk, tusk, tail and the two FAR-side legs drawn on it, but WITHOUT the two near-side legs, 2) the near-side FRONT LEG, 3) the near-side BACK LEG',
    tag: 'gum',
    weapons: ['a candy-cane club with a pink gum wad on top (Gum Club)', 'a spiked gumball on a chain flail (Gumball Flail)', 'a royal staff topped with a giant glowing gumball (Gumball Scepter)'],
    armors: ['a vest made of pink gum wrappers (Wrapper Vest)', 'armour made of stretchy pink gum plates (Stretch Gum Mail)', 'a golden gumball-machine armour with a glass dome chest full of gumballs (Gumball Machine Plate)'],
    charm: 'a lucky gumball on a little string (Lucky Gumball)',
    intro: 'Bubblegumbo sits on a kitchen counter next to an empty party hat and a burst balloon, scratching his head with his trunk, looking very confused, blowing a tiny sad bubble.',
    cliff: 'Bubblegumbo stands at the dark rim of a giant steel kitchen sink at night, trunk raised, blowing a brave pink bubble. Down in the drain a sickly green glow and a fuzzy crown silhouette of mould rise.',
    end: 'Bubblegumbo blows a gigantic record-breaking pink bubble at a happy backyard birthday party at sunset, balloons and bunting, little kitchen friends cheering.',
  },
  18: {
    desc: 'a red velvet cake kangaroo boxer (Velvaroo): a deep red velvet kangaroo with a white cream-cheese frosting belly and a frosting swirl on its head, red boxing gloves, big feet and a long tail',
    limbs: 'IMPORTANT BODY RULE: Velvaroo has exactly two arms with red boxing gloves, two big hind legs and one long tail, exactly like the reference.',
    parts: '1) the BODY with head, frosting swirl, frosting belly and tail but NO arms or legs drawn on it, 2) one ARM with its boxing glove, 3) a second ARM with its glove, 4) one big hind LEG with its foot, 5) a second hind LEG with its foot',
    tag: 'roo',
    weapons: ['a rolling-pin baton with red velvet stripes (Velvet Baton)', 'a cake-server spatula shaped like a sword (Cake Server Blade)', 'a golden whisk mace studded with ruby sprinkles (Champion Whisk)'],
    armors: ['a vest made of a giant cupcake liner (Cupcake Liner Vest)', 'a red velvet boxer robe (Velvet Robe)', 'a golden championship armour with a frosting crest (Champion Plate)'],
    charm: 'a tiny golden boxing-glove charm (Lucky Glove)',
    intro: 'Velvaroo shadow-boxes alone in a dusty cake-stand boxing ring on a kitchen counter, a CANCELLED bake-sale banner (blank, no letters) sagging above, an empty trophy stand.',
    cliff: 'Velvaroo stands at the dark rim of a giant steel kitchen sink at night, gloves up, ready to fight. Down in the drain a sickly green glow and a fuzzy crown silhouette of mould rise.',
    end: 'Velvaroo stands on top of a giant cake-stand boxing ring at a bake-sale fair, holding up a shining golden championship belt, confetti and cheering kitchen friends all around.',
  },
};
const FACE = {
  happy: 'laughing with joy: eyes squeezed into happy arcs, a huge open-mouthed grin, bouncing with delight, little sparkles around it',
  angry: 'furious and fired up: deep scowling brows, gritted teeth, leaning forward, a little puff of angry steam above its head',
  shocked: 'totally shocked: eyes wide as saucers with tiny pupils, jaw dropped open, leaning back in surprise, a sweat drop flying off its head',
  sad: 'sad and worried: droopy teary eyes with one wobbly tear, a trembling frown, its whole body drooping',
};
const SIG = {
  9: [['Biggest Bubble Blower', 'weapon', 'a golden bubble pipe blowing a giant shimmering pink bubble'], ['Gumball Machine Heart', 'armor', 'a shining armour with a glass gumball-machine dome in the chest full of glowing gumballs']],
  18: [['Golden Gloves', 'weapon', 'a pair of shining golden boxing gloves with frosting trim'], ['Championship Belt', 'armor', 'a gleaming golden championship belt with a cupcake emblem, worn like armour']],
};
const NEM = {
  9: ['mob-nem-mouse', 'BRITTLE, a sneaky little mouse made of peanut brittle with crunchy peanuts, a long tail and a cheeky grin, holding a peanut like a bomb'],
  18: ['mob-nem-gorilla', 'ROCKY ROAD, a big gorilla boxer made of rocky road ice cream with marshmallow and nut chunks, wearing brown boxing gloves, a cocky grin'],
};
const STILL = 'Painted storybook illustration for a cutscene in my cute 2D side-scrolling kitchen adventure game. Use the same soft painterly, warmly lit, cel-shaded style as the background reference, and draw any character EXACTLY like its reference (same shape, colours, face, outlines, same number of limbs). Cinematic composition, wide 16:9 landscape, characters small-to-medium in the frame with plenty of scenery. NO text, no letters, no writing on any labels or pages, no speech bubbles, no UI, no border, no signature, no humans.';
const slug = n => 'u-' + n.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');

const jobs = [];
for (const [sp, k] of Object.entries(K)) {
  const ref = `art-src/ref-kaiju-${sp}.png`;
  jobs.push({ name: `parts-${sp}`, newChat: true, refs: [ref], prompt: `Generate an image. This is a character from my 2D side-scrolling game (${k.desc}). I need it as a CUTOUT PUPPET PARTS SHEET so I can animate it. Draw the exact same character, same colours, outlines and shading style, but in a STRICT SIDE PROFILE facing RIGHT like a 2D platformer character (face looking right, one eye visible). Split it into SEPARATE parts laid out apart from each other with big empty gaps (no part touching another): ${k.parts}. IMPORTANT: the body piece must have NO arms, legs, wings or feet drawn on it. Each limb has a rounded complete joint end. ${k.limbs} Solid flat magenta (#FF00FF) background, no shadows, no labels, no text. Square 1:1 image.` });
  const gearStyle = 'Same style as the reference (clean dark outlines, saturated colours, glossy cel shading).';
  k.weapons.forEach((w, i) => jobs.push({ name: `w-${k.tag}${i + 1}`, newChat: true, refs: ['art-src/raw/w-peng3.png'], prompt: `Generate an image. The reference is a weapon icon from my cute 2D kitchen action RPG. ${gearStyle} A WEAPON themed for my hero ${k.desc.split(':')[0]}: ${w}. Shown diagonally with the HEAD at the TOP-LEFT and the HANDLE at the BOTTOM-RIGHT, centred, filling 80% of the frame. Solid flat magenta (#FF00FF) background, no shadow, no text, no character. Square 1:1 image.` }));
  k.armors.forEach((a, i) => jobs.push({ name: `a-${k.tag}${i + 1}`, newChat: true, refs: ['art-src/raw/a-peng3.png'], prompt: `Generate an image. The reference is an armour icon from my cute 2D kitchen action RPG. ${gearStyle} ARMOR themed for my hero ${k.desc.split(':')[0]}: ${a}, shown flat and centred, filling 80% of the frame. Solid flat magenta (#FF00FF) background, no shadow, no text, no character. Square 1:1 image.` }));
  jobs.push({ name: `k-${k.tag}`, newChat: true, refs: ['art-src/raw/k-peng.png'], prompt: `Generate an image. The reference is a charm icon from my cute 2D kitchen action RPG. ${gearStyle} A CHARM themed for my hero ${k.desc.split(':')[0]}: ${k.charm}, centred, filling 75% of the frame. Solid flat magenta (#FF00FF) background, no shadow, no text, no character. Square 1:1 image.` });
  for (const [name, slot, look] of SIG[sp]) jobs.push({ name: slug(name), newChat: true, refs: [`art-src/raw/${slot === 'weapon' ? 'w' : 'a'}-peng3.png`], prompt: `Generate an image. The reference is an item icon from my cute 2D kitchen action RPG. ${gearStyle} A LEGENDARY ${slot === 'weapon' ? 'WEAPON' : 'ARMOR'} themed for my hero ${k.desc.split(':')[0]}, called "${name}": ${look}. Make it look special and magical (a faint golden glow, sparkles), clearly fancier than the reference. ${slot === 'weapon' ? 'Shown diagonally with the HEAD at the TOP-LEFT and the HANDLE at the BOTTOM-RIGHT, centred' : 'Shown flat and centred'}, filling 80% of the frame. Solid flat magenta (#FF00FF) background, no shadow, no text, no character. Square 1:1 image.` });
  for (const [mood, how] of Object.entries(FACE)) jobs.push({ name: `face-${sp}-${mood}`, newChat: true, refs: [ref], prompt: `Generate an image. The reference is my game character, ${k.desc}. Draw THIS SAME character as a cartoon story portrait showing a strong, funny, very readable emotion: ${how}. ${k.limbs} Keep it EXACTLY on-model: same body shape and proportions, same colours, same face design, same thick dark outlines and glossy cel shading as the reference. Do not add any clothes, props, extra limbs or extra characters. Same three-quarter view and facing direction as the reference, whole body visible, centred, filling about 85% of the frame. Solid flat magenta (#FF00FF) background, no shadow, no text. Portrait 4:5 image.` });
  for (const [kind, scene] of [['intro', k.intro], ['cliff', k.cliff], ['end', k.end]]) jobs.push({ name: `still-${sp}-${kind}`, newChat: true, refs: [ref, 'art-src/ref-bg.png'], prompt: `Generate an image. The first reference is my character, ${k.desc}; the second shows the painted background style. ${STILL} ${k.limbs} Scene: ${scene}` });
  const [nname, ndesc] = NEM[sp];
  jobs.push({ name: nname, newChat: true, refs: ['art-src/raw/mob-bun.png'], prompt: `Generate an image. The reference is an enemy from my cute 2D side-scrolling action RPG set in a giant kitchen. I need a NEW story mini-boss: ${ndesc}. Draw it in exactly the same art style as the reference (clean dark outlines, saturated colours, glossy cel shading, cute but menacing). It is a MINI-BOSS, so a bit more detailed and imposing than a normal enemy, with a strong silhouette, and a few fuzzy green mould spots because the Mold Crown has corrupted it. Side view facing LEFT, whole body visible, centred, filling about 85% of the frame. IMPORTANT: a crisp dark outline all round with NO glow or haze around it. Solid flat magenta (#FF00FF) background, no shadow, no text. Square 1:1 image.` });
}
fs.writeFileSync(process.argv[2] ?? 'art-src/jobs-newkaiju2.json', JSON.stringify(jobs, null, 1) + '\n');
console.log(`${jobs.length} jobs`);
