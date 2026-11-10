// Writes art-src/jobs-props.json: interactive stage props + the escort NPC. Run: node scripts/gem-gen.mjs art-src/jobs-props.json
import fs from 'node:fs';
const STYLE = 'in exactly the same art style as the reference (clean dark outlines, saturated colours, glossy cel shading, cute). Side view, whole object visible, centred, filling about 85% of the frame. Solid flat magenta (#FF00FF) background, no shadow, no text, no letters. Square 1:1 image.';
const P = [
  ['ob-crate', 'a small wooden kitchen crate full of vegetables peeking out, nailed shut, that can be smashed open'],
  ['ob-jar', 'a round glass storage jar with a cork lid, full of colourful sweets, that can be smashed'],
  ['ob-sponge', 'a thick bouncy yellow-and-green kitchen sponge lying flat, squishy, used as a springy bounce pad'],
  ['ob-cooker', 'a RUNAWAY PRESSURE COOKER: a dented steel pressure cooker with tiny legs, a wild face, steam whistling from its valve and a red warning glow, about to explode, facing LEFT'],
  ['ob-lever', 'a big wooden kitchen lever made from a soup ladle stuck in a little brass base, like a switch'],
  ['ob-chest', 'a fancy secret treasure chest shaped like an ornate golden bento box with gems, slightly glowing, closed'],
  ['icon-key', 'an ornate golden key whose bow is shaped like a star anise spice, glowing softly, an item icon'],
  ['npc-crumblet', 'a tiny lost blueberry-muffin crumb child with big worried eyes and stubby legs, very cute, facing RIGHT'],
];
const jobs = P.map(([name, desc]) => ({ name, newChat: true, refs: ['art-src/raw/mob-bun.png'],
  prompt: `Generate an image. The reference shows the art style of my cute 2D side-scrolling action RPG set in a giant kitchen. Draw ${desc}, ${STYLE}` }));
fs.writeFileSync('art-src/jobs-props.json', JSON.stringify(jobs, null, 1) + '\n');
console.log(`${jobs.length} jobs`);
