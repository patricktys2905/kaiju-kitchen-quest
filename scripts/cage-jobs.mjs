// Writes art-src/jobs-cage.json: the Crumblet cage and the mould nest props of map stages (Prop kinds 'cage' / 'nest').
import fs from 'node:fs';
const STYLE = 'in exactly the same art style as the reference (clean dark outlines, saturated colours, glossy cel shading). Front view, whole object visible, centred, filling about 85% of the frame. Solid flat magenta (#FF00FF) background, no shadow, no text. Square 1:1 image.';
const jobs = [
  { name: 'ob-cage', newChat: true, refs: ['art-src/raw/npc-crumblet.png'], prompt: `Generate an image. The reference is a little Crumblet (a tiny blueberry muffin creature) from my cute 2D kitchen action RPG. Draw a PROP: that same little Crumblet trapped inside a small round birdcage made of bent forks and spoons, with a mouldy green padlock, looking sad and hopeful. ${STYLE}` },
  { name: 'ob-nest', newChat: true, refs: ['art-src/raw/ob-crate.png'], prompt: `Generate an image. The reference is a prop from my cute 2D kitchen action RPG. Draw a NEW PROP: a MOULD NEST, a lumpy mound of fuzzy green-and-purple kitchen mould growing out of a cracked old jam jar lid, with a few glowing spore bubbles and little egg-like pods on top (monsters hatch from it). ${STYLE}` },
];
fs.writeFileSync('art-src/jobs-cage.json', JSON.stringify(jobs, null, 1) + '\n');
console.log(jobs.length, 'jobs');
