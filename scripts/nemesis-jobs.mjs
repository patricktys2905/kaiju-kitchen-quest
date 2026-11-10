// Writes art-src/jobs-nemesis.json: one story nemesis per kaiju. Run: node scripts/gem-gen.mjs art-src/jobs-nemesis.json
import fs from 'node:fs';
const STYLE = 'in exactly the same art style as the reference (clean dark outlines, saturated colours, glossy cel shading, cute but menacing). It is a MINI-BOSS, so make it a bit more detailed and imposing than a normal enemy, with a strong silhouette, and a few fuzzy green mould spots because the Mold Crown has corrupted it. Side view facing LEFT, whole body visible, centred, filling about 85% of the frame. Solid flat magenta (#FF00FF) background, no shadow, no text. Square 1:1 image.';
const N = [
  ['nem-beet', 'BRUTUS BEETROOT, a big muscular beetroot bully with leafy hair, a smug grin and his fists up, ready to bully a small dinosaur'],
  ['nem-crow', 'CRUSTWING, a scruffy crow whose feathers are made of burnt bread crusts, flying with wings spread, carrying a little sack of stolen crumbs'],
  ['nem-pine', 'PINEAPPLE PETE, a cocky pineapple delivery courier on roller skates with a cap, holding a pineapple ring like a frisbee'],
  ['nem-lamp', 'ZAPSY THE BUG LAMP, a sinister glowing desk-lamp creature with a purple bug-zapper bulb head that crackles with electricity, standing on its base'],
  ['nem-shroom', 'PROFESSOR PENICILLIN, a mouldy blue-cheese mushroom scientist with round goggles and a lab coat, holding a bubbling flask of spores'],
  ['nem-slug', 'SIR SLURP, a giant slimy garden slug wearing a tiny knight helmet made of a bottle cap, leaving a shiny slime trail, eyes on stalks'],
  ['nem-rat', 'RICOTTA RAT, a sly cheese-white rat thief with a bandit mask and a little cape, holding a butter knife, ready to pounce'],
  ['nem-cookie', 'DUKE FORTUNE COOKIE, a pompous fortune cookie nobleman with a curled paper fortune like a moustache, a monocle and a tiny royal sash'],
  ['nem-ginger', 'GARI THE GINGER SERPENT, a long coiled pink pickled-ginger serpent dragon with thin slice-like scales and glowing pink fire in its mouth'],
  ['nem-brulee', 'TORCHY BRULEE, a creme brulee ramekin creature with a cracked caramel top, holding a kitchen blowtorch that shoots a blue flame'],
  ['nem-kebab', 'CAPTAIN KEBAB, a swaggering grill champion made of stacked kebab chunks on a long skewer, wearing a chef bandana, holding a big skewer like a spear'],
  ['nem-shark', 'FINN FREEZEPOP, a shark made of a frozen ice pop with a wooden stick tail, frosty breath, sliding on its belly with a big toothy grin'],
];
const jobs = N.map(([name, desc]) => ({ name: `mob-${name}`, newChat: true, refs: ['art-src/raw/mob-bun.png'],
  prompt: `Generate an image. The reference is an enemy from my cute 2D side-scrolling action RPG set in a giant kitchen. I need a NEW story mini-boss: ${desc}. Draw it ${STYLE}` }));
fs.writeFileSync('art-src/jobs-nemesis.json', JSON.stringify(jobs, null, 1) + '\n');
console.log(`${jobs.length} jobs`);
