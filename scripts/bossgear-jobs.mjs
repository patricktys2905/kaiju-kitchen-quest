// Boss signature weapons: every world boss drops one weapon made for each kaiju (10 bosses x 20 kaiju = 200), each with
// its own gear skill (src/sim/bossgear.ts). Icons: art-src/jobs-bossgear.json (bw-<boss>-<ref>).
// Run: node scripts/bossgear-jobs.mjs && sh scripts/gem-batch.sh art-src/jobs-bossgear.json shots/gem-bossgear.log
import fs from 'node:fs';
import { REF } from './gear3-jobs.mjs';

// kaiju: [weapon noun, what its weapons look like]
export const FORM = {
  0: ['Club', 'a chunky club'], 10: ['Hammer', 'a heavy round-headed hammer'], 11: ['Blade', 'a curved blade'], 4: ['Wand', 'an elegant wand'],
  1: ['Staff', 'a science staff topped with a flask'], 2: ['Pincers', 'a pair of big crab pincers'], 5: ['Daggers', 'a pair of curved daggers'], 6: ['Paddle', 'a flat bao-paddle staff'],
  7: ['Glaive', 'a long sushi-chef glaive'], 8: ['Gauntlets', 'a pair of huge gauntlets'], 15: ['Lance', 'a long barbecue lance'], 17: ['Lance', 'an icy cone lance'],
  13: ['Spear', 'a dragon spear'], 19: ['Wand', 'a party wand with a star tip'], 9: ['Mace', 'a candy mace'], 18: ['Gloves', 'a pair of boxing gloves'],
  12: ['Bo Staff', 'a long bo staff'], 16: ['Shield', 'a round turtle-shell shield'], 3: ['Whip', 'a wobbly whip'], 14: ['Harpoon', 'a harpoon'],
};
// boss: [name prefix, what it's made of / looks like]
export const BOSSW = {
  toast: ['Toast King\'s', 'made of charred black toast with glowing ember cracks and a little golden crown motif'],
  golem: ['Frostbite', 'carved from blue freezer ice with frost crystals and a snowflake gem'],
  dragon: ['Grease Dragon', 'with red dragon scales, a flame-shaped edge and a drip of glowing grease'],
  jar: ['Cookie Jar', 'with a cookie-jar lid, chocolate-chip studs and a toothy jar-mouth motif'],
  moldking: ['Mold Crown', 'in purple and toxic green, with a tiny jagged crown and glowing spore bumps'],
  stale: ['Stale Knight', 'made of hard stale baguette with silver knightly armour plates'],
  brussels: ['Baron\'s', 'with brussels-sprout leaves, a little general\'s medal and green military trim'],
  meatloaf: ['Mystery', 'made of glossy meatloaf with a gravy swirl and a mysterious question-mark gem'],
  tupper: ['Tupperwraith', 'made of ghostly translucent tupperware with snapping lids and a wispy pale glow'],
  fruitcake: ['Fruitcake', 'made of rich fruitcake studded with candied cherries and a holly sprig'],
};
export const BOSS_ORDER = ['toast', 'golem', 'dragon', 'jar', 'moldking', 'stale', 'brussels', 'meatloaf', 'tupper', 'fruitcake'];

if (process.argv[1]?.endsWith('bossgear-jobs.mjs')) {
  const STYLE = 'Same style (clean dark outlines, saturated colours, glossy cel shading). A LEGENDARY boss weapon: ornate and special, but no glow aura or sparkles around it. Solid flat magenta (#FF00FF) background, no shadow, no text, no character, nobody holding it. Square 1:1 image.';
  const jobs = [];
  for (const boss of BOSS_ORDER) for (const [sp, [noun, look]] of Object.entries(FORM)) {
    const [pre, mat] = BOSSW[boss], r = REF[sp];
    jobs.push({ name: `bw-${boss}-${r}`, newChat: true, refs: [`art-src/raw/w-${r}3.png`],
      prompt: `Generate an image. The reference is a weapon icon from my cute 2D kitchen action RPG. Draw a NEW WEAPON icon called "${pre} ${noun}": ${look} ${mat}. Keep the same kind of weapon as the reference. Shown diagonally with the HEAD at the TOP-LEFT and the HANDLE at the BOTTOM-RIGHT (round items simply centred), filling 80% of the frame. ${STYLE}` });
  }
  fs.writeFileSync('art-src/jobs-bossgear.json', JSON.stringify(jobs, null, 1) + '\n');
  console.log(`${jobs.length} jobs`);
}
