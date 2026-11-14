// World 11 (The Midway) story paintings, batch 2b: images only.
//   node scripts/w11-stills-jobs.mjs scenes  -> art-src/jobs-w11sc.json  7 shared short-scene paintings still-w11-s2,3,4,6,7,8,9
//   node scripts/w11-stills-jobs.mjs elite   -> art-src/jobs-w11el.json  20 per-kaiju stage-5 paintings still-<sp>-w11-elite
// Run: sh scripts/gem-batch.sh art-src/jobs-w11sc.json shots/w11/gem-w11sc.log ; node scripts/process-art.mjs still-w11-s
//      sh scripts/gem-batch.sh art-src/jobs-w11el.json shots/w11/gem-w11el.log ; node scripts/process-art.mjs still-<sp>-w11-elite (each)
// Redo one: move art-src/raw/<name>.png to art-src/rejected, add a line to FIX below (appended to the prompt), re-run.
// Unlike scenes-jobs.mjs (Worlds 1-10: rolling pin, arena, levers), each scene shows what the stage really has
// (docs/stage-facts.md): its boss-room foe at its stall or ride, with the stage's feature in view.
import fs from 'node:fs';

const raw = n => `art-src/raw/${n}.png`;
const FAR = raw('bg-far-midway');
const FIX = {
  'still-10-w11-elite': 'The strength tester tower is plain red and gold with only a simple sliding marker in a groove: absolutely NO letters, NO words and NO numbers on it anywhere.',
  'still-4-w11-elite': 'The lamp has NO arms and NO hands and must not grow any: it shows the way ONLY by bending its lamp head so that its shade faces the strongman, with a friendly smiling face on the shade.',
  'still-2-w11-elite': 'The slug is drawn exactly like its reference: a slimy slug wearing its tiny silver knight helmet, its body only smooth slime with NO arms, NO hands and NO fingers anywhere. It stands on the right of the crab, between the crab and the strongman, smiling, and only leans and looks towards the strongman with its two eye stalks. The round yellow body of the crab hero shows only a smiling mouth: NO eyes on the body.',
  'still-3-w11-elite': 'The gelato scoop is ONLY a grey scoop on a waffle cone, exactly like its reference: the point of its cone rests on the grass, and it has NO arms, NO hands, NO legs and NO feet anywhere. It is HAPPY: its eyes are cheerful curved arcs and under its moustache is a big open smile (no frown, no angry eyebrows); it tilts towards the strongman. The hero jelly blob has NO legs and NO feet: its flat jelly bottom rests on the grass, and it has only two tiny stubby nubs at its sides.',
  'still-15-w11-elite': 'The kebab pirate is HAPPY: laughing with a big open-mouthed grin and raised cheerful eyebrows (no frown, no scowl, no angry eyebrows), and it holds its spear out level with the tip aimed across at the strongman, like someone pointing. The hot-dog hedgehog smiles bravely.',
  'still-19-w11-elite': 'The hornet hovers BESIDE the owl as a friend, both facing right towards the strongman; the hornet smiles cheekily and points one front leg AWAY from the owl, to the right at the strongman (never at the owl). Its face is friendly, not angry.',
  'still-17-w11-elite': 'The ice-lolly shark keeps the exact shape of its reference: a small shark lying horizontally, floating in the air beside the penguin, with the wooden lolly stick sticking out at its tail end. It does NOT stand upright and has NO arms and NO hands: it points with the tip of one small fin and has a friendly toothy smile.',
  'still-12-w11-elite': 'The sloth holds exactly ONE pink straw (a single straight straw, not two, not crossed), standing on the grass and leaning on it like a walking staff.',
  'still-w11-s8': 'LAYOUT: the booth, the crowned coconut and EVERY corn dog soldier are in the RIGHT two thirds of the picture. The LEFT third holds NO characters, NO stalls and NO tents at all: only the grassy slope, the path and the sky. The corn dog soldiers come from the right edge, from behind the booth and out of the barrels and crates next to it.',
  'still-w11-s9': 'LAYOUT: the toffee-apple rack stands on the RIGHT of the round stage, between the stage and the doughnut wheel, NOT on the left. The LEFT third holds only the grassy hillside, the start of the boardwalk and the sky. NO signboard, NO notice board and NO fence in the foreground.',
};
const fx = n => (FIX[n] ? ' ' + FIX[n] : '');

const STILL = 'Painted storybook illustration for a cutscene in my cute 2D side-scrolling food-monster adventure game. Use the same soft painterly, warmly lit, cel-shaded style as the background reference, and draw any character EXACTLY like its reference (same shape, colours, face, outlines, same number of limbs; do not redesign it). Cinematic composition, wide 16:9 landscape, characters small-to-medium in the frame with plenty of scenery. NO text, no letters, no numbers, no writing on any banners, labels or signs (every sign, banner and board is blank or striped), no speech bubbles, no UI, no border, no signature, no humans.';
const LEFT = 'The left side of the picture is quiet: only open grass, a plain path and soft blue sky there, no characters and nothing important (a hero will be placed there later). It is ONE continuous painting from edge to edge: NO dividing line, NO panels, NO pole, post or wall splitting the picture, NO frame.';
const FAIR = 'a summer funfair on a green hill on a warm sunny afternoon, seen from tiny-creature height';
const RACK = 'a toffee-apple dipping rack: a simple wooden frame as tall as a stall, with a row of glossy dark-red toffee apples hanging from it by their sticks, thick amber caramel dripping slowly off them into a sticky golden puddle on the ground (the apples are plain sweets with NO faces)';

// stage: [extra references, scene]
const SCENES = {
  2: [['mob-m11a'], `a wide grassy avenue at ${FAIR}, with many strings of colourful triangular bunting flags criss-crossing overhead and little food carts with teal and cream striped awnings along the far side. Right of the middle stands a small round wooden acrobat podium painted in red and cream stripes, about as high as a cart wheel; on top of it the pretzel acrobat (the character reference: a big knotted soft pretzel with a smug face, a striped collar, exactly two doughy arms and exactly two doughy legs) strikes a showy contortionist pose, smug, blocking the way. It is about as tall as a cart counter. At the far right edge stands ${RACK}.`],
  3: [['mob-m11b'], `a row of ring-toss game stalls at ${FAIR}: three wooden booths side by side in the right half, under teal and cream striped awnings, their counters covered with rows of wooden pegs and glass bottles with wooden hoops hooked over some of them, more hoops hanging on hooks, plush toy prizes dangling from the awning. In front of the nearest booth stands guard a walking gumball machine (the character reference: a red metal gumball machine with a pale blue glass globe full of colourful gumballs, an angry face on the globe, a chute like a gun barrel, exactly two short metal legs and NO arms), about as tall as the booth counter, its chute aimed along the path to the left; a few colourful gumballs lie scattered on the grass in front of it.`],
  4: [['mob-kbumper', 'npc-crumblet'], `a bumper-car rink at ${FAIR}: in the right two thirds, a low open-sided pavilion with a striped roof on slim corner posts, a wire-mesh ceiling with little sparks, a smooth shiny floor ringed by a low black rubber kerb, strings of light bulbs, and four empty little round bumper cars (red, yellow, blue, green) parked at odd angles. Deep inside the rink on the right waits the crowned bumper-car cupcake (the first character reference: a frosted cupcake sitting in a teal bumper car, wearing its gold crown and little red cape exactly like the reference, an angry gritted-teeth face, NO arms and NO legs), glaring, ready to charge. In the middle foreground, just outside the rink, a tiny lost muffin creature (the second character reference: a small round blue blueberry-muffin bear cub in a paper muffin cup, worried teary eyes) hides behind a stack of spare black rubber tyres, trembling and peeking out, hoping to be rescued. The little muffin is only half as tall as the cupcake in its car. Exactly one cupcake and one little muffin.`],
  6: [['mob-m11c', 'c-scroll'], `the foot of a tall helter-skelter slide at ${FAIR}: the helter-skelter is a tower shaped like a giant ice-cream cone with a spiral slide winding round it, standing in the right half of the picture and rising out of the top of the frame. Against it leans a very tall prize stall: a wooden rack of shelves like a ladder, five shelves high, crowded with plush toys and striped boxes; alone on the very TOP shelf, high above everything, lies the rolled-up recipe scroll (the second reference, drawn exactly like it), glowing with golden light and sparkles. On the stall counter at the bottom stands a big wooden sand hourglass, as tall as the monster, with most of its golden sand already run down: time is running out. In front of the stall stands guard the deep-fryer bruiser (the first character reference: a boxy steel deep fryer full of bubbling golden oil with a wire basket of fries on its head, a snarling face on its steel front, exactly two thick steel arms with big fists and exactly two short legs), fists raised. Exactly one monster and one scroll.`],
  7: [['mob-m11d', 'ob-chest'], `a carousel in front of a hall of mirrors at ${FAIR}. In the background across the right two thirds runs the front of the mirror hall: a long low wooden building painted lilac and gold with a row of tall funhouse mirrors in curly gold frames, their wavy glass showing stretched, wobbly reflections of sky, bunting and balloons, and a flat roof with a wide ledge along its top. In front of it, right of the middle, stands a small merry-go-round with a striped canopy and twisted gold poles; on its round platform rears the macaron carousel pony (the first character reference: a merry-go-round horse built of stacked pastel macarons, mint, lemon and lilac, with a cream mane, a gold pole through its back, exactly four legs and NO arms), wild-eyed and ready to charge; the other poles of the carousel are empty. High up on the roof ledge of the mirror hall, at the top right, half hidden behind a bunch of balloons, glints a secret treasure chest (the second reference, drawn exactly like it), clearly out of easy reach; on the grass below it sits a big springy yellow kitchen sponge like a trampoline. Exactly one pony and one chest.`],
  8: [['mob-kcoconut', 'mob-cadet'], `a coconut shy at ${FAIR}: in the right half, a wide open-fronted booth with red and cream striped canvas walls and a scalloped awning; inside it a row of five plain hairy brown coconuts sits in cups on top of red and white striped wooden posts, with a wicker basket of wooden throwing balls on the grass in front. In the middle of the row, taller than the rest, is the crowned coconut (the first character reference: a hairy brown coconut with a fierce face sitting in a cup on a striped post, wearing its gold crown and red royal cape exactly like the reference, exactly two hairy arms and NO legs), smirking, one arm raised holding a small coconut ready to throw. It is an AMBUSH closing in: five or six corn dog soldiers (the second character reference: an upright battered corn dog with a folded blank paper hat, a mustard sash, two small arms and two short legs in black boots; each about half as tall as the crowned coconut on its post) are creeping out from hiding places in the right half and the background: peeking round the sides of the booth, climbing out of barrels and crates, marching in from behind the far stalls, all sneaking towards the middle with sly grins. Tense and funny, the trap about to spring.`],
  9: [['mob-m11e'], `the top of the funfair hill on a warm sunny late afternoon, seen from tiny-creature height. A boardwalk path climbs from the lower left to the upper right. Close behind, filling the whole upper right of the picture and rising out of the frame, LOOMS the big top: a huge candy pink and cream striped circus tent, so near that only part of it fits in the picture, its tall dark entrance flap glowing with warm spotlight from inside, pennants on its peaks. Partly in view at the right edge is the rim of a big wheel built like a giant pink glazed doughnut with sprinkles. On the path between us and the tent, right of the middle, stands a low round wooden show stage painted with red and cream stripes; on it sits a short red circus cannon on two wheels with its mouth pointing up and to the LEFT, and bursting out of the cannon mouth with a puff of smoke is the cannonball bonbon (the character reference: a round chocolate bonbon in a gold and red twisted foil wrapper, a white crash helmet with a red star and goggles, a fearless grin, exactly two small arms and exactly two short legs), about as big as the cannon barrel. Beside the path in the middle distance stands ${RACK}. Exactly one bonbon and one cannon. The last stretch before the final fight: exciting, a little ominous but still sunny.`],
};

// ---- the 20 stage-5 paintings: the kaiju and its old nemesis (now a friend) look at the Jawbreaker Strongman ----
// Species, looks and nemesis art exactly as scripts/elite-jobs.mjs; body rules from scripts/faces-jobs.mjs LIMBS (names removed).
const HERO = {
  0: 'a cute strawberry dinosaur', 10: 'a cute blueberry-muffin bear: a round blue muffin-top body with blueberries, sitting in a paper muffin cup', 11: 'a cute pizza raptor',
  4: 'a cute marshmallow moth', 1: 'a cute jelly octopus scientist', 2: 'a cute cheese crab with a cabbage shell',
  5: 'a cute toast bat', 6: 'a cute dumpling lord', 7: 'a cute sushi dragon', 8: 'a cute chocolate golem',
  15: 'a cute hot-dog hedgehog', 17: 'a cute cookies-and-cream penguin', 13: 'a cute avocado dragon',
  19: 'a cute taco owl', 9: 'a cute bubblegum elephant', 18: 'a cute red-velvet-cake kangaroo boxer',
  12: 'a cute sleepy bubble-tea sloth: tan fur with dark tapioca-pearl spots, holding a pink straw', 16: 'a cute mint-ice-cream turtle', 3: 'a cute wobbly jelly blob',
  14: 'a cute salmon-sushi river monster',
};
const LIMBS = {
  10: 'IMPORTANT BODY RULE: the hero has NO arms, NO hands and NO paws at all. It is only a round blueberry-bear head and body sitting in a paper muffin cup.',
  2: 'IMPORTANT BODY RULE: the hero has exactly TWO big claws (both raised at the sides) and a few short pointed crab legs, exactly like the reference: never extra claws, arms or hands. Its ONLY two eyes sit on top of its two long eye stalks; its round body has NO eyes and NO eyebrows on it, only a mouth. The two claws are always crab pincers with two jaws (never fists or fingers).',
  5: 'IMPORTANT BODY RULE: the hero has NO arms and NO hands at all. Its only limbs are its two toast-slice wings on its back and tiny stubby feet, exactly like the reference.',
  3: 'IMPORTANT BODY RULE: the hero has NO legs and NO real arms, only two tiny stubby jelly nubs, exactly like the reference.',
  14: 'IMPORTANT BODY RULE: the hero has NO arms, NO hands and NO legs. Its only limbs are two side fins and its tail fin, exactly like the reference.',
  16: 'IMPORTANT BODY RULE: the hero has NO arms and NO hands. Its only limbs are four stubby turtle legs and a little tail, exactly like the reference.',
  9: 'IMPORTANT BODY RULE: the hero has NO arms and NO hands. Its only limbs are four stubby elephant legs, a trunk and a tiny tail, exactly like the reference.',
  13: 'IMPORTANT BODY RULE: the hero has NO arms and NO hands. Its only limbs are two small bat-like dragon wings and two tiny stubby feet, exactly like the reference.',
  19: 'IMPORTANT BODY RULE: the hero has NO arms and NO hands. Its only limbs are its two short wings (and tiny feet if visible), exactly like the reference. It FLIES: it hovers in the air just above the grass.',
  15: 'IMPORTANT BODY RULE: the hero stays lying down INSIDE its hot-dog bun, exactly like the reference: it never sits up or stands, and it has NO arms or hands.',
  4: 'IMPORTANT BODY RULE: the hero FLIES: it hovers in the air on its two pairs of moth wings, just above the grass, exactly like the reference.',
  12: 'IMPORTANT BODY RULE: the hero is a sloth with exactly two long arms and two legs, holding its one big pink bubble-tea straw like a staff, exactly like the reference.',
};
// nemesis per kaiju: [art, what it is + its real limbs, how it shows the way]
const NEM = {
  0: ['mob-nem-beet', 'a muscular beetroot bruiser with exactly two arms and two legs', 'points with one arm'],
  10: ['mob-nem-crow', 'a brown bread-crust bird with two wings and NO arms', 'points with one wing'],
  11: ['mob-nem-pine', 'a pineapple in a red cap on roller skates, with exactly two arms and two legs', 'points with one arm'],
  4: ['mob-nem-lamp', 'a purple bug-zapper desk lamp on a brass stand, with NO arms and NO legs', 'bends its lamp head towards the strongman like a pointing finger'],
  1: ['mob-nem-shroom', 'a mushroom professor in goggles and a lab coat, with exactly two arms and two legs', 'points with one arm'],
  2: ['mob-nem-slug', 'a slimy slug knight in a tiny helmet, with NO arms and NO legs', 'points with its two eye stalks and a nod of its head'],
  5: ['mob-nem-rat', 'a plump masked cheese rat in a red cape, with exactly two arms and two legs', 'points with one paw'],
  6: ['mob-nem-cookie', 'a round fortune cookie gentleman with a monocle and a moustache, on tiny feet', 'nods and leans towards the strongman'],
  7: ['mob-nem-ginger', 'a coiled pink pickled-ginger serpent with NO arms and NO legs', 'points with the tip of its tail'],
  8: ['mob-nem-brulee', 'a creme brulee in a ramekin with a tiny blowtorch, small arms and small legs', 'points with one arm'],
  15: ['mob-nem-kebab', 'a kebab-skewer pirate in a striped bandana with a spear, exactly two arms and two legs', 'points with its spear'],
  17: ['mob-nem-shark', 'a blue ice-lolly shark on a lolly stick, with fins and NO arms and NO legs', 'points with one fin'],
  13: ['mob-nem-nacho', 'a nacho-chip wrestler in a wrestling mask, with exactly two arms and two legs', 'points with one arm'],
  19: ['mob-nem-hornet', 'a red hornet in a little sombrero, flying on its wings', 'points with one front leg'],
  9: ['mob-nem-mouse', 'a peanut-brittle mouse with a tiny crown, with four paws and a long tail', 'points with one paw'],
  18: ['mob-nem-gorilla', 'a rocky-road chocolate gorilla with exactly two arms and two legs', 'points with one arm'],
  12: ['mob-nem-bird', 'a coffee-bean hummingbird with a long beak, flying on its wings, NO arms', 'points with its long beak'],
  16: ['mob-nem-hare', 'a dark chocolate fudge hare with long ears and four paws', 'points with one front paw'],
  3: ['mob-nem-gelatin', 'a grey gelato scoop with a moustache on a waffle cone, with NO arms and NO legs', 'tilts and looks towards the strongman'],
  14: ['mob-nem-bear', 'a grilled bear with a tiny crown and a fishing rod, exactly two arms and two legs', 'points with one paw'],
};
const ESTILL = 'Painted storybook illustration for a cutscene in my cute 2D side-scrolling food-monster adventure game. Use the same soft painterly, warmly lit, cel-shaded style as the background reference, and draw every character EXACTLY like its reference (same shape, colours, face, outlines, and the SAME NUMBER of arms, legs, eyes and claws: never add extra limbs or eyes, never redesign a character). Wide 16:9 landscape, characters medium-sized with scenery around them. NO text, no letters, no numbers, no writing, no signs or labels with words (every board and banner is blank or striped), no speech bubbles, no UI, no border, no signature, no humans. ONE continuous painting, no panels, no dividing line.';
const CHAMP = 'a jawbreaker strongman (the third character reference: a big round white jawbreaker sweet with coloured speckles and a chipped rainbow patch, a big curly black moustache and a stern face, a leopard-print strongman leotard, exactly two muscular arms holding a wooden mallet and a round metal shield, exactly two short legs)';

const mode = process.argv[2];
if (mode === 'scenes') {
  const jobs = Object.entries(SCENES).map(([n, [chars, text]]) => ({
    name: `still-w11-s${n}`, newChat: true, refs: [FAR, ...chars.map(raw)],
    prompt: `Generate an image. The first reference shows the painted background style and the look of this world (a funfair; do not copy its layout). The other ${chars.length > 1 ? 'references are characters or objects' : 'reference is a character'} to include. ${STILL} Scene: ${text} ${LEFT}${fx(`still-w11-s${n}`)}`,
  }));
  fs.writeFileSync('art-src/jobs-w11sc.json', JSON.stringify(jobs, null, 1) + '\n');
  console.log(`${jobs.length} scene jobs`);
}
if (mode === 'elite') {
  const jobs = Object.entries(HERO).map(([sp, look]) => {
    const [nemArt, nemLook, how] = NEM[sp];
    const name = `still-${sp}-w11-elite`;
    return {
      name, newChat: true, refs: [FAR, `art-src/ref-kaiju-${sp}.png`, raw(nemArt), raw('mob-jawbreaker')],
      prompt: `Generate an image. The first reference shows the painted background style and the place; the next three are the characters: the first character reference is the hero (${look}), the second is its old rival (${nemLook}), the third is a strongman. ${ESTILL} Scene at a "ring the bell" strength-test attraction at a sunny summer funfair on a green hill, with striped stalls, bunting and balloons behind: on the right stands the strength tester, a tall narrow red and gold tower with a brass bell at its top and a round padded target pad at its foot, about three times as tall as the strongman. The hero (the first character reference) and its old rival (the second character reference, drawn exactly like it), who is now its FRIEND, stand side by side on the grass on the left, both looking across at ${CHAMP}, who waits in the distance on the right beside the tower, flexing and showing off smugly. The old rival ${how}, warning the hero about the strongman: cheeky, friendly and helpful, with a friendly grin (NOT angry, even if its reference looks grumpy). The hero looks brave and ready. The hero and the old rival are about the same size as in a team photo; the strongman is a little bigger than the hero but drawn smaller because he is further away. Exactly ONE hero, ONE old rival and ONE strongman: three characters in the whole picture.${LIMBS[sp] ? ' ' + LIMBS[sp] : ''}${fx(name)}`,
    };
  });
  fs.writeFileSync('art-src/jobs-w11el.json', JSON.stringify(jobs, null, 1) + '\n');
  console.log(`${jobs.length} elite jobs`);
}
