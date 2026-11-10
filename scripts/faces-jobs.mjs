// Writes art-src/jobs-faces.json: expression portraits for story scenes (node scripts/gem-gen.mjs art-src/jobs-faces.json).
// face-<sp>-<mood> for every kaiju; the neutral portrait stays kaiju-<sp>. Moods: happy, angry, shocked, sad.
import fs from 'node:fs';

const K = {
  0: 'a little strawberry kaiju dinosaur (Gobzilla Jr.)',
  10: 'a gruff blueberry-muffin bear (Bluebeary)',
  11: 'a pizza raptor dinosaur made of melty cheesy pizza with pepperoni (Pizzaraptor)',
  4: 'a fluffy marshmallow moth (Mothball)',
  1: 'a blue jelly octopus scientist wearing a metal colander as a helmet (Squidgeon)',
  2: 'a grumpy cheese crab with a cabbage-leaf shell (Crabbage)',
  5: 'a little loaf-bread bat with toast-slice wings and a butter pat on its head (Toastbat)',
  6: 'a plump steamed dumpling lord with a little steam curl on top (Dumplord)',
  7: 'a teal sushi-roll dragon with pink spikes and a salmon belly (Norigon)',
  8: 'a chocolate-bar golem made of chocolate blocks (Chocomunch)',
  15: 'a shy hedgehog sitting in a hot-dog bun with mustard and ketchup on its spikes (Hotchog)',
  17: 'a cookies-and-cream penguin with a cherry on its head (Pengwhip)',
};
export const MOODS = {
  happy: 'laughing with joy: eyes squeezed into happy arcs, a huge open-mouthed grin, arms or paws (or wings, tentacles, claws) thrown up in celebration',
  angry: 'furious and fired up: deep scowling brows, gritted teeth, fists or claws clenched and raised, leaning forward, a little puff of angry steam above its head',
  shocked: 'totally shocked: eyes wide as saucers with tiny pupils, jaw dropped open, leaning back in surprise, a sweat drop flying off its head',
  sad: 'sad and worried: droopy teary eyes with one wobbly tear, a trembling frown, shoulders slumped and arms hanging down',
};

const jobs = [];
for (const [sp, desc] of Object.entries(K)) for (const [mood, how] of Object.entries(MOODS)) {
  jobs.push({
    name: `face-${sp}-${mood}`, newChat: true, refs: [`art-src/ref-kaiju-${sp}.png`],
    prompt: `Generate an image. The reference is my game character, ${desc}. Draw THIS SAME character as a cartoon story portrait showing a strong, funny, very readable emotion: ${how}. Keep it EXACTLY on-model: same body shape and proportions, same colours, same face design, same thick dark outlines and glossy cel shading as the reference. Do not add any clothes, props, extra limbs or extra characters that are not in the reference. Same three-quarter view and facing direction as the reference, whole body visible, centred, filling about 85% of the frame. Solid flat magenta (#FF00FF) background, no shadow, no text. Portrait 4:5 image.`,
  });
}
fs.writeFileSync('art-src/jobs-faces.json', JSON.stringify(jobs, null, 1) + '\n');
console.log(`${jobs.length} jobs`);
