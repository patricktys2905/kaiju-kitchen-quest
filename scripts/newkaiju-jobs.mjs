// Writes art-src/jobs-newkaiju.json: everything the two Act 2 kaiju need (parts sheet, gear, signature legendaries,
// mood portraits, story stills, nemesis). Avocadrake (13) and Tacowl (19).  node scripts/gem-gen.mjs art-src/jobs-newkaiju.json
import fs from 'node:fs';

const K = {
  13: {
    desc: 'an avocado dragon (Avocadrake): a halved avocado with a light green flesh face and belly, a big shiny brown pit in its belly, dark green bumpy skin around its back, small dark green bat-like dragon wings and tiny stubby feet',
    limbs: 'IMPORTANT BODY RULE: Avocadrake has NO arms and NO hands. Its only limbs are two small bat-like dragon wings and two tiny stubby feet, exactly like the reference.',
    parts: '1) the BODY (the avocado half with face, pit and stem) with NO wings or feet drawn on it, 2) one bat-like WING, 3) a second WING, 4) one small FOOT, 5) a second FOOT',
    tag: 'avo',
    weapons: ['a wooden pestle club with a little guacamole on it (Molcajete Pestle)', 'a lime-green dragon-scale mace shaped like a giant lime wedge (Lime Wedge Mace)', 'a regal staff topped with a glowing golden avocado pit (Golden Pit Staff)'],
    armors: ['a simple chest guard made of dark green avocado skin (Avocado Skin Guard)', 'a chest armour of stacked tortilla chips like dragon scales (Chip Scale Armor)', 'a gleaming jade-green dragon breastplate with a lime crest (Jade Guac Plate)'],
    charm: 'a little lime slice charm on a cord (Lime Charm)',
    intro: 'Avocadrake perches on top of a bowl of guacamole on a kitchen counter like a dragon on its hoard, puffing out its chest, a little worried glance at a brown spot on a cut avocado nearby.',
    cliff: 'Avocadrake stands at the dark rim of a giant steel kitchen sink at night, wings spread, its pit belly glowing. Down in the drain a sickly green glow and a fuzzy crown silhouette of mould rise.',
    end: 'Avocadrake curls up proudly on top of a sparkling bowl of fresh bright green guacamole at sunrise, a lime beside it, not one brown spot in sight, a big smug happy grin.',
  },
  19: {
    desc: 'a taco owl (Tacowl): a round owl whose body is a crunchy golden taco shell full of lettuce, cheese and meat, a big owl face with large eyes and a small beak, little tomato-chunk ear tufts, short wings on its sides',
    limbs: 'IMPORTANT BODY RULE: Tacowl has NO arms and NO hands. Its only limbs are its two short wings (and tiny feet if visible), exactly like the reference.',
    parts: '1) the BODY (the taco-shell owl with face, filling and tomato tufts) with NO wings or feet drawn on it, 2) one WING, 3) a second WING, 4) one small yellow owl FOOT, 5) a second FOOT',
    tag: 'owl',
    weapons: ['a spiky tortilla-chip fan held like a blade (Chip Fan)', 'a long chili-pepper spear (Chili Spear)', 'a festive striped staff topped with a little piñata star (Piñata Staff)'],
    armors: ['a woven tortilla wrap vest (Tortilla Wrap)', 'a colourful fiesta poncho armour (Fiesta Poncho)', 'a golden corn-husk armour with glowing salsa gems (Golden Husk Armor)'],
    charm: 'a little lime-and-cilantro charm (Cilantro Charm)',
    intro: 'Tacowl perches on a kitchen calendar at night by moonlight, staring in dismay at the page stuck on MONDAY (show the page blank, no letters), a sad empty taco plate below.',
    cliff: 'Tacowl hovers over the dark rim of a giant steel kitchen sink at night, eyes glowing in the dark. Down in the drain a sickly green glow and a fuzzy crown silhouette of mould rise.',
    end: 'Tacowl perches proudly at the head of a big happy taco feast table at night under string lights, a blank calendar page torn off and fluttering away, friends cheering, confetti.',
  },
};
const FACE = {
  happy: 'laughing with joy: eyes squeezed into happy arcs, a huge open-mouthed grin, bouncing with delight, little sparkles around it',
  angry: 'furious and fired up: deep scowling brows, gritted teeth, leaning forward, a little puff of angry steam above its head',
  shocked: 'totally shocked: eyes wide as saucers with tiny pupils, jaw dropped open, leaning back in surprise, a sweat drop flying off its head',
  sad: 'sad and worried: droopy teary eyes with one wobbly tear, a trembling frown, its whole body drooping',
};
const SIG = {
  13: [['Holy Guacamole Bowl', 'weapon', 'a stone molcajete bowl on a handle overflowing with glowing guacamole, used like a mace'], ['Pit of Destiny Plate', 'armor', 'a shining armour with a huge glowing golden avocado pit in the chest']],
  19: [['Taco Tuesday Calendar', 'weapon', 'a magical golden calendar page on a stick, glowing, with a taco emblem and no writing'], ['Midnight Fiesta Cape', 'armor', 'a starry night-blue cape armour with salsa-red trim and tiny shining stars']],
};
const NEM = {
  13: ['mob-nem-nacho', 'EL NACHO, a cheesy tortilla-chip luchador wrestler with a colourful wrestling mask, melted cheese dripping, flexing, wants to dip everybody'],
  19: ['mob-nem-hornet', 'SENOR STING, a red hot-sauce hornet with a tiny sombrero, a hot-sauce bottle stinger, buzzing wings, a cocky grin'],
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
fs.writeFileSync('art-src/jobs-newkaiju.json', JSON.stringify(jobs, null, 1) + '\n');
console.log(`${jobs.length} jobs`);
