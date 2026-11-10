// Every kaiju has its own story through the same kitchen. Shared backdrop: the Head Chef is missing and the
// Mold Crown is souring the kitchen; each world boss is a corrupted resident who is "cured" when beaten.
// Speakers: 'me' = the kaiju whose story it is, 'boss' = this world's boss, 'n' = narrator, 'mold' = the Mold's voice,
// or a species number for a cameo. Beats: intro (before 1-1), w{N}-open (before N-1), w{N}-elite (before N-5),
// w{N}-boss (before N-10), w{N}-after (after N-10), ending (after the last world). Bosses stay the same for everyone.

import { NEMESIS_BEATS } from './nemesis';

export type Speaker = 'me' | 'boss' | 'n' | 'mold' | 'foe' | number;
export type StoryLine = [Speaker, string];
/** Story twists on normal stages (bosses never change). */
export type Variant = 'swarm' | 'ambush' | 'night';
export interface Story {
  title: string;
  tagline: string;
  beats: Record<string, StoryLine[]>;
  variants: Record<string, Variant>;
}

export const VARIANT_INFO: Record<Variant, { name: string; icon: string; desc: string }> = {
  swarm: { name: 'Swarm', icon: '🐜', desc: 'Half again as many monsters, each a bit weaker' },
  ambush: { name: 'Ambush', icon: '⚔️', desc: 'An extra elite lies in wait' },
  night: { name: 'Night', icon: '🌙', desc: 'Lights out: monsters +1 level, better drops' },
};

export const STORIES: Record<number, Story> = {
  0: {
    title: 'Junior Goes Big', tagline: 'A small strawberry with very big dreams.',
    variants: { '1-3': 'swarm', '1-7': 'ambush', '2-4': 'night', '2-8': 'swarm', '3-3': 'ambush', '4-6': 'night' },
    beats: {
      intro: [['n', 'The Head Chef has vanished, and something sour is creeping through the kitchen.'], ['me', 'Rawr! My big brother always says I\'m too small to be a real kaiju.'], ['me', 'If I find the Chef, everyone will have to call me Gobzilla SENIOR. Well... Gobzilla Medium.']],
      'w1-open': [['me', 'The Countertop! Big brother crossed this in one stomp.'], ['me', 'It\'ll take me about... two hundred stomps. Let\'s go!']],
      'w1-elite': [['n', 'A huge Rotten Egg blocks the ridge, reeking of old fridge.'], ['me', 'Rawr! I\'m not scared! (I\'m a little scared.)']],
      'w1-boss': [['boss', 'WHO DARES CLIMB MY STOVETOP? I AM THE BURNT TOAST KING!'], ['me', 'You\'re not a king, you\'re breakfast! Rawr!']],
      'w1-after': [['boss', 'Ugh... my head... I was a nice bit of toast once. A green fuzz crept over my crust.'], ['me', 'The Mold Crown...? Where did it come from?'], ['boss', 'From the cold. From the Fridge.'], ['me', 'Then that\'s where I\'m stomping next!']],
      'w2-open': [['me', 'Brrr! My leaves are shivering. Real kaiju don\'t shiver.'], ['me', '...Real kaiju wear scarves. Probably.']],
      'w2-elite': [['n', 'A Pickle Knight raises its toothpick sword.'], ['me', 'A knight! Big brother fought a knight once. He won. So will I!']],
      'w2-boss': [['boss', 'COLD... SO COLD... STAY... FROZEN...'], ['me', 'Nope! Strawberries are best fresh!']],
      'w2-after': [['boss', 'The ice is melting from my mind. The mould wanted me to freeze the whole kitchen.'], ['me', 'Did you see the Head Chef?'], ['boss', 'Only a hat, floating toward the warm glow of the Oven.']],
      'w3-open': [['me', 'It\'s so hot in here my seeds are popping!'], ['me', 'Big brother would just roar at the heat. RAWR! ...Nope, still hot.']],
      'w3-elite': [['n', 'A Meatball Brute flexes its saucy fists.'], ['me', 'You\'re big. But I\'m... determined!']],
      'w3-boss': [['boss', 'A SNACK! A TINY SWEET SNACK FOR THE GREASE DRAGON!'], ['me', 'I\'m not tiny! I\'m Gobzilla Jr. and I\'m HERE TO STOMP!']],
      'w3-after': [['boss', 'Phew... the grease cleared from my eyes. You\'re brave for a berry.'], ['me', '*sniff* Nobody\'s ever called me brave before.'], ['boss', 'The mould\'s trail goes up into the Pantry. Be careful, little one... no. Big one.']],
      'w4-open': [['me', 'The Pantry. It smells like old cereal and adventure.'], ['me', 'Big brother never came this far. Maybe I\'m the big one now.']],
      'w4-elite': [['n', 'A wall of Can Crushers raises its lids.'], ['me', 'Shields? I\'ll just stomp AROUND you!']],
      'w4-boss': [['boss', 'COOOOKIES... ALL MINE... YOU WILL BE A COOKIE TOO!'], ['me', 'The Chef\'s hat is inside that jar! Let it go!']],
      'w4-after': [['boss', 'Thank you... I was holding the Chef\'s hat for safekeeping. The mould got into my lid.'], ['mold', 'Hehehe... little berry. The Mold Crown sits in the Sink. Come and wear it.'], ['me', 'Big brother, if you can hear me... I\'m going to the Sink. And I\'m not scared.'], ['n', 'To be continued in World 5: The Sink.']],
    },
  },
  10: {
    title: 'The Lost Crumblets', tagline: 'A gruff muffin bear gathering up the little ones.',
    variants: { '1-4': 'ambush', '1-8': 'night', '2-3': 'swarm', '2-7': 'ambush', '3-6': 'swarm', '4-4': 'ambush' },
    beats: {
      intro: [['n', 'When the Head Chef vanished, the muffin tin tipped over and the little Crumblets scattered everywhere.'], ['me', 'Hmph. Six little Crumblets, out there with mouldy monsters.'], ['me', 'I\'m not worried. I\'m just... going for a very long walk. In every direction.']],
      'w1-open': [['me', 'Crumblets! Come out! ...No? Then I\'ll clear the way until you do.']],
      'w1-elite': [['n', 'A Rotten Egg sits on something small and crumbly.'], ['me', 'Get. Off. My. Crumblet.']],
      'w1-boss': [['boss', 'A MUFFIN! BUTTER IT! TOAST IT!'], ['me', 'You\'ve got two of my Crumblets in your crown. That was a mistake.']],
      'w1-after': [['boss', 'Sorry... I thought they were croutons. The mould makes everything blurry.'], ['me', 'Hmph. Two found. Four to go.'], ['boss', 'I saw little ones rolling toward the cold.']],
      'w2-open': [['me', 'Cold. Crumblets hate the cold. Their blueberries go hard.'], ['me', 'Hold on, little ones.']],
      'w2-elite': [['n', 'A Pickle Knight guards a shivering Crumblet.'], ['me', 'Knight. Move. Now.']],
      'w2-boss': [['boss', 'FROZEN... TREATS... MINE...'], ['me', 'They\'re not treats. They\'re family.']],
      'w2-after': [['boss', 'They were cold, so I kept them in my ice. I thought I was helping.'], ['me', '...You were. A bit. Thank you.'], ['n', 'Four Crumblets found. The last two were seen near the Oven.']],
      'w3-open': [['me', 'The Oven. Muffins belong in here... for twenty minutes. Not forever.']],
      'w3-elite': [['n', 'Popcorn bursts everywhere. Something small squeaks under a muffin tin.'], ['me', 'Hold still, little one. Papa Bluebeary\'s coming.']],
      'w3-boss': [['boss', 'BAKED GOODS! I SHALL HOARD THEM ALL!'], ['me', 'Hoard THIS.']],
      'w3-after': [['boss', 'Ow... sorry. Dragons hoard things. Mouldy dragons hoard silly things.'], ['me', 'Five. One more.'], ['boss', 'The last one crawled into the Pantry, toward a big cookie jar.']],
      'w4-open': [['me', 'Last Crumblet. Then home. Then a very long nap.']],
      'w4-elite': [['n', 'Can Crushers have built a tin wall.'], ['me', 'Walls don\'t stop bears.']],
      'w4-boss': [['boss', 'NOM NOM NOM... ONE LITTLE MUFFIN LEFT TO EAT...'], ['me', 'Spit. Them. OUT.']],
      'w4-after': [['n', 'The jar coughs up the last Crumblet, safe and sticky.'], ['me', 'All six. ...Stop hugging me. Fine. Five more seconds.'], ['mold', 'Such a sweet family. The Mold Crown in the Sink would love to meet them.'], ['me', 'Over my frosting.'], ['n', 'To be continued in World 5: The Sink.']],
    },
  },
  11: {
    title: '30 Minutes or Less', tagline: 'A delivery raptor with one very important order.',
    variants: { '1-2': 'swarm', '1-6': 'night', '2-5': 'ambush', '2-9': 'swarm', '3-7': 'night', '4-3': 'swarm' },
    beats: {
      intro: [['n', 'One large pepperoni, extra cheese, for the Head Chef. Delivery time: thirty minutes.'], ['me', 'Raptor Express never misses a delivery!'], ['n', 'The Head Chef has gone missing.'], ['me', '...The clock is still ticking. Let\'s go!']],
      'w1-open': [['me', 'Shortcut across the Countertop. Keep the box level, keep the cheese hot!']],
      'w1-elite': [['me', 'Out of the way, eggy! I\'ve got a pizza with a deadline!']],
      'w1-boss': [['boss', 'I SMELL... PIZZA. HAND IT OVER.'], ['me', 'Are you the Head Chef? No? Then no pizza for you!']],
      'w1-after': [['boss', 'Ow. That pizza smelled amazing. The Chef went toward the Fridge, I think.'], ['me', 'Fridge? My cheese will go cold! Faster!']],
      'w2-open': [['me', 'Brrr. Pizza box, stay warm. Think warm thoughts.']],
      'w2-elite': [['me', 'A knight? Sorry, no time for duels. Signature here please. Thanks!']],
      'w2-boss': [['boss', 'EVERYTHING... WILL BE... FROZEN PIZZA...'], ['me', 'Frozen pizza is a crime!']],
      'w2-after': [['boss', 'The mould is gone... The Chef? They followed a delicious smell into the Oven.'], ['me', 'An oven! Perfect for reheating. Go go go!']],
      'w3-open': [['me', 'Reheating complete. Now WHERE is my customer?']],
      'w3-elite': [['me', 'Sauce on my shoes. Unacceptable. Moving on!']],
      'w3-boss': [['boss', 'THE PIZZA... GIVE ME THE PIZZA... DRAGONS LOVE PIZZA!'], ['me', 'Dragons also love tipping. Do you tip? Didn\'t think so.']],
      'w3-after': [['boss', 'Fine, fine. The Chef\'s hat went up into the Pantry. Take the stairs on the left.'], ['me', 'Thanks! Five-star review!']],
      'w4-open': [['me', 'Overtime. Way overtime. But Raptor Express NEVER gives up.']],
      'w4-elite': [['me', 'Shields? I\'ll deliver my claws AROUND them.']],
      'w4-boss': [['boss', 'COOOKIES... AND NOW... PIZZA...'], ['me', 'Not for you, you overgrown biscuit tin!']],
      'w4-after': [['n', 'Inside the jar: only the Chef\'s hat and a note. "Gone to the Sink to stop the Mold Crown."'], ['me', 'New delivery address... the Sink. Box is still warm. Mostly.'], ['mold', 'Bring the pizza, little raptor. The Crown is hungry.'], ['n', 'To be continued in World 5: The Sink.']],
    },
  },
  4: {
    title: 'Chasing the Moon', tagline: 'A dreamy moth following the light.',
    variants: { '1-5': 'night', '1-8': 'night', '2-6': 'night', '3-4': 'swarm', '3-8': 'night', '4-7': 'night' },
    beats: {
      intro: [['n', 'Every night the kitchen moon shone through the window. Then the Head Chef vanished, and the moon went dark.'], ['me', 'Oh, moon... where did you go?'], ['me', 'I\'ll find you. I always find the light.']],
      'w1-open': [['me', 'The countertop is so bright today. But it isn\'t moonlight.']],
      'w1-elite': [['me', 'A stinky egg is blocking my light. Shoo, shoo...']],
      'w1-boss': [['boss', 'THE BURNER IS MY THRONE! ITS GLOW IS MINE!'], ['me', 'Your glow is too hot and too cross. I\'m sorry, but you must cool down.']],
      'w1-after': [['boss', 'A soft little light... thank you. The green fuzz is gone.'], ['me', 'Have you seen the moon? Pale and round and gentle?'], ['boss', 'Try the Fridge. It glows when you open the door.']],
      'w2-open': [['me', 'A cold light... is this the moon? No. Too blue.']],
      'w2-elite': [['me', 'A brave knight. Please let a little moth pass?']],
      'w2-boss': [['boss', 'ALL... LIGHT... WILL FREEZE...'], ['me', 'Not my light. Not ever.']],
      'w2-after': [['boss', 'Warmth... I remember warmth. Your moon is the Oven lamp, little one. It went out when the Chef left.']],
      'w3-open': [['me', 'The Oven is so warm. I can feel the moon somewhere above.']],
      'w3-elite': [['me', 'Popping, sizzling... it\'s too loud to dream in here.']],
      'w3-boss': [['boss', 'MOTHS ARE DRAWN TO FLAME! COME CLOSER, LITTLE SNACK!'], ['me', 'I\'m drawn to the moon. Not to you.']],
      'w3-after': [['n', 'The Oven lamp flickers back on, pale and round.'], ['me', 'My moon! ...But it\'s so dim.'], ['boss', 'The Mold Crown is drinking the kitchen\'s light. It hides in the Pantry, then deeper.']],
      'w4-open': [['me', 'Dark shelves, dusty air. My wings will light the way.']],
      'w4-elite': [['me', 'Shields cast big shadows. I\'ll fly over the shadows.']],
      'w4-boss': [['boss', 'NO LIGHT IN MY JAR... ONLY COOKIES...'], ['me', 'Let the light out!']],
      'w4-after': [['n', 'The jar breaks open and a beam of moonlight pours across the Pantry.'], ['me', 'There you are.'], ['mold', 'Enjoy it while it lasts, moth. In the Sink, there is no light at all.'], ['me', 'Then I\'ll bring some.'], ['n', 'To be continued in World 5: The Sink.']],
    },
  },
  1: {
    title: 'The Antidote', tagline: 'A jelly scientist hunting a cure.',
    variants: { '1-3': 'ambush', '1-6': 'swarm', '2-4': 'swarm', '2-7': 'night', '3-5': 'swarm', '4-8': 'ambush' },
    beats: {
      intro: [['me', 'Lab journal, day one. The kitchen is infected with a fungal agent I am calling the Mold Crown.'], ['me', 'Symptoms: grumpiness, fuzz, and attempting to eat everyone.'], ['me', 'Hypothesis: with enough samples, I can brew an antidote. Colander helmet: on.']],
      'w1-open': [['me', 'Sample site one: the Countertop. Collecting spores... with extreme prejudice.']],
      'w1-elite': [['me', 'Fascinating! A fully mouldy egg. Hold still, I need a swab.']],
      'w1-boss': [['boss', 'NO EXPERIMENTS ON THE KING!'], ['me', 'Subject is hostile. Switching to tentacle-based science.']],
      'w1-after': [['boss', 'What... what happened?'], ['me', 'You were infected. Now you\'re cured. Mostly. Please report any fuzz.'], ['me', 'Journal: the spores are thickest toward the Fridge.']],
      'w2-open': [['me', 'Low temperatures slow mould growth. So why is it thriving here? Curious...']],
      'w2-elite': [['me', 'A pickled specimen! Brine should be antifungal. Let me test that theory.']],
      'w2-boss': [['boss', 'SCIENCE... WILL... FREEZE...'], ['me', 'Actually, science will un-freeze you.']],
      'w2-after': [['me', 'Journal: the golem\'s core contained a spore cluster shaped like a tiny crown.'], ['boss', 'It came from the Oven... no, it passed through the Oven. Going up.']],
      'w3-open': [['me', 'Heat should kill spores. These ones are... thriving. Uh oh.']],
      'w3-elite': [['me', 'Meatball specimen. Sauce is acidic. Hmm, a possible ingredient.']],
      'w3-boss': [['boss', 'BURN THE JELLY!'], ['me', 'Jelly doesn\'t burn. Jelly MELTS. Which is worse for you, actually.']],
      'w3-after': [['me', 'Journal: final ingredient needed. A sample from the source.'], ['boss', 'The source is in the Pantry. The cookie jar has been acting strange.']],
      'w4-open': [['me', 'Antidote at 90%. One more sample.']],
      'w4-elite': [['me', 'Metal shields. Clever. But not jelly-proof.']],
      'w4-boss': [['boss', 'NO SCIENCE IN MY JAR!'], ['me', 'Everything is science. Especially you.']],
      'w4-after': [['me', 'Antidote: complete. Effect: cures all mould... within a small radius.'], ['mold', 'Little chemist. My Crown grows in the Sink, faster than you can brew.'], ['me', 'Then I\'ll brew faster. Journal: next stop, the Sink.'], ['n', 'To be continued in World 5: The Sink.']],
    },
  },
  2: {
    title: 'Get Off My Patch', tagline: 'A grumpy hermit crab who wants his garden back.',
    variants: { '1-4': 'swarm', '1-7': 'swarm', '2-3': 'ambush', '2-8': 'night', '3-6': 'ambush', '4-5': 'swarm' },
    beats: {
      intro: [['n', 'Crabbage lived alone in a perfect little cabbage patch by the sink drain. Then the green fuzz arrived.'], ['me', 'Mould. In MY patch. On MY cabbages.'], ['me', 'I\'m going to find whoever did this and pinch them very, very hard.']],
      'w1-open': [['me', 'Sideways. Always sideways. Faster that way.']],
      'w1-elite': [['me', 'You smell like my ruined cabbages. You\'ll do for a start.']],
      'w1-boss': [['boss', 'BOW TO THE KING!'], ['me', 'Crabs don\'t bow. We pinch.']],
      'w1-after': [['boss', 'Ow! OW! Okay! The mould came from somewhere cold!'], ['me', 'Hmph. Fine. Don\'t follow me.']],
      'w2-open': [['me', 'The Fridge. Cold, crowded, and full of vegetables that aren\'t mine.']],
      'w2-elite': [['me', 'A pickle. My cabbage could\'ve been a pickle one day. You disgust me.']],
      'w2-boss': [['boss', 'STAY... FOREVER...'], ['me', 'I\'ve got a patch to get back to.']],
      'w2-after': [['boss', 'You fought... for a garden? That\'s rather sweet.'], ['me', 'It is NOT sweet. It\'s cabbage. Where\'s the mould going?'], ['boss', 'Up. Through the Oven.']],
      'w3-open': [['me', 'Too hot. My cheese is sweating. I hate this. Onward.']],
      'w3-elite': [['me', 'You can try to crush me, meatball. My shell says no.']],
      'w3-boss': [['boss', 'A CHEESY CRAB! DELICIOUS!'], ['me', 'Everyone wants to eat me. Nobody wants to help with the weeding.']],
      'w3-after': [['boss', 'I\'ll help with the weeding. If you want.'], ['me', '...Hmph. Maybe. The Pantry next?'], ['boss', 'The Pantry next.']],
      'w4-open': [['me', 'Nearly done. Then back to my patch. Alone. Probably.']],
      'w4-elite': [['me', 'Shields. Finally, someone who understands armour.']],
      'w4-boss': [['boss', 'COOKIES... NOT... CABBAGES...'], ['me', 'Cabbages are BETTER.']],
      'w4-after': [['n', 'A crowd gathers: the Toast King, the Golem, even the Dragon, all carrying seeds for a new patch.'], ['me', 'What\'s all this? ...You want to help? Fine. Don\'t step on the sprouts.'], ['mold', 'The drain is mine now, crab. The Sink belongs to the Mold Crown.'], ['me', 'That drain was next to MY patch. Now it\'s personal.'], ['n', 'To be continued in World 5: The Sink.']],
    },
  },
  5: {
    title: 'The Golden Butter', tagline: 'A night thief after the greatest treasure in the kitchen.',
    variants: { '1-2': 'night', '1-5': 'night', '2-6': 'night', '2-9': 'ambush', '3-3': 'night', '4-7': 'swarm' },
    beats: {
      intro: [['n', 'Legend says the Head Chef kept a single pat of Golden Butter, the richest treasure in the kitchen.'], ['me', 'And now the Chef is gone. Nobody\'s guarding it.'], ['me', 'Heh. Time for the heist of the century.']],
      'w1-open': [['me', 'Stay in the shadows, wings tucked. Nobody notices a bit of toast.']],
      'w1-elite': [['me', 'A guard egg. Nothing personal, pal.']],
      'w1-boss': [['boss', 'A THIEF! IN MY KINGDOM!'], ['me', 'Thief is such a harsh word. I prefer "treasure enthusiast".']],
      'w1-after': [['boss', 'The Butter? The mould is after it too. It\'ll rot the whole kitchen with it.'], ['me', '...Then I\'d better get there first.']],
      'w2-open': [['me', 'The Fridge. Where butter lives. I can almost smell it.']],
      'w2-elite': [['me', 'A knight guarding the dairy shelf. Classic.']],
      'w2-boss': [['boss', 'THE BUTTER... MUST STAY... FROZEN...'], ['me', 'Frozen butter is hard to spread. Let it go, big guy.']],
      'w2-after': [['boss', 'It isn\'t here. The Chef hid it somewhere warm.'], ['me', 'Warm, huh? The Oven it is.']],
      'w3-open': [['me', 'Too hot for butter in here... unless someone\'s keeping it safe.']],
      'w3-elite': [['me', 'Bacon guards. You know you\'re in a fancy vault when the guards sizzle.']],
      'w3-boss': [['boss', 'THE GOLDEN BUTTER IS MINE! MY HOARD!'], ['me', 'Finders keepers. Except you didn\'t find it. You stole it. Like a thief!']],
      'w3-after': [['n', 'Toastbat finds an empty butter dish and a note: "Kept safe. -Chef. Pantry, top shelf."'], ['me', 'Of course it\'s in the Pantry.']],
      'w4-open': [['me', 'Last vault. And for some reason... I\'m not sure I want it for myself any more.']],
      'w4-elite': [['me', 'Tin shields. Heh. I\'ve cracked tougher safes.']],
      'w4-boss': [['boss', 'NOBODY TOUCHES MY COOKIES! OR MY BUTTER!'], ['me', 'It\'s not yours. And maybe it isn\'t mine either.']],
      'w4-after': [['n', 'The Golden Butter glows in Toastbat\'s paws. Where it shines, the mould melts away.'], ['me', 'Huh. It\'s a cure. The Chef was keeping it to heal the kitchen.'], ['mold', 'Give it to me, little thief. In the Sink, everything sours.'], ['me', 'Sorry. Just this once, I\'m giving something back.'], ['n', 'To be continued in World 5: The Sink.']],
    },
  },
  6: {
    title: 'The Lord of Leftovers', tagline: 'A very important dumpling in search of subjects.',
    variants: { '1-3': 'swarm', '1-8': 'ambush', '2-2': 'swarm', '2-7': 'swarm', '3-5': 'night', '4-3': 'ambush' },
    beats: {
      intro: [['me', 'Hear ye! With the Head Chef gone, the kitchen needs a ruler!'], ['me', 'Clearly that is me, Dumplord, Lord of All Leftovers.'], ['n', 'Nobody answered.'], ['me', '...My loyal subjects must simply be shy. I shall go and collect them.']],
      'w1-open': [['me', 'Citizens of the Countertop! Your lord has arrived! ...Why are they attacking?']],
      'w1-elite': [['me', 'You, egg! Kneel before your lord! ...Kneeling refused. Very well.']],
      'w1-boss': [['boss', 'THERE IS ONLY ONE KING HERE!'], ['me', 'Excellent, then you can be my first duke.']],
      'w1-after': [['boss', 'Duke? I suppose... you did free me from that horrible fuzz.'], ['me', 'Splendid! One subject! Onward to recruit more!']],
      'w2-open': [['me', 'Ah, the Northern Provinces. Chilly, but full of potential citizens.']],
      'w2-elite': [['me', 'A knight! Just what my royal guard needs. After you stop stabbing me.']],
      'w2-boss': [['boss', 'NO... RULERS... ONLY... ICE...'], ['me', 'Every kingdom needs ice. For drinks. Join me!']],
      'w2-after': [['boss', 'I will guard your kingdom\'s freezer, Lord Dumplord.'], ['me', 'Two subjects! I am practically an empire.']],
      'w3-open': [['me', 'The Southern Steam Lands. I feel right at home.']],
      'w3-elite': [['me', 'Meatball! You and I are practically cousins. Stop punching your cousin!']],
      'w3-boss': [['boss', 'BOW TO THE DRAGON!'], ['me', 'A dragon! Every empire needs a dragon!']],
      'w3-after': [['boss', 'You fought me to make me your... friend?'], ['me', 'Subject. Friend. Is there a difference?'], ['boss', '...Yes. But I like "friend" better.'], ['me', 'Oh. ...Me too, actually.']],
      'w4-open': [['me', 'My friends are waiting. A lord should bring snacks.']],
      'w4-elite': [['me', 'Shields up? Then I shall simply out-steam you.']],
      'w4-boss': [['boss', 'NO SHARING! ALL COOKIES ARE MINE!'], ['me', 'A good ruler shares! I only learned that recently, but it\'s TRUE!']],
      'w4-after': [['n', 'The cookies are shared out. The whole kitchen eats together.'], ['me', 'I came for subjects and found friends. A much better deal.'], ['mold', 'A lovely little court. The Mold Crown will rule it all from the Sink.'], ['me', 'There is only room for one crown here, and mine is made of dough!'], ['n', 'To be continued in World 5: The Sink.']],
    },
  },
  7: {
    title: 'The Last Roll Dragon', tagline: 'An ancient sushi dragon seeking the Wasabi Flame.',
    variants: { '1-4': 'night', '1-7': 'swarm', '2-5': 'night', '2-8': 'ambush', '3-4': 'ambush', '4-6': 'swarm' },
    beats: {
      intro: [['n', 'Long ago, Roll Dragons breathed green Wasabi Flame. Only one remains, and his fire has gone out.'], ['me', 'Without the Chef\'s blessing, my flame is a flicker.'], ['me', 'I will walk the old dragon road and kindle it again. This is the way of the Roll.']],
      'w1-open': [['me', 'The countertop of my ancestors. Humbler than the legends.']],
      'w1-elite': [['me', 'A spoiled egg. In my day, we wasted nothing. Forgive me.']],
      'w1-boss': [['boss', 'A DRAGON? HAH! ONLY A SNACK ROLL!'], ['me', 'Even a small flame can make toast.']],
      'w1-after': [['boss', 'Your flame... it flickered when you hit me.'], ['me', 'Battle with honour stirs the fire. The road continues.']],
      'w2-open': [['me', 'The Frozen Shrine. My ancestors slept here between battles.']],
      'w2-elite': [['me', 'Knight, I salute you. Now draw your toothpick.']],
      'w2-boss': [['boss', 'SLEEP... FOREVER... LIKE THE OLD DRAGONS...'], ['me', 'The old dragons slept. They did not surrender.']],
      'w2-after': [['boss', 'Your fire is warming, dragon. Seek the Oven. The Flame was born there.']],
      'w3-open': [['me', 'The Oven. The forge where my ancestors were rolled.']],
      'w3-elite': [['me', 'Meat and sauce. A fine meal for a warrior. Or a fine opponent.']],
      'w3-boss': [['boss', 'I AM THE LAST DRAGON THAT MATTERS!'], ['me', 'Then let two last dragons decide it.']],
      'w3-after': [['n', 'The two dragons breathe together. Green fire roars back to life.'], ['me', 'The Wasabi Flame. It returns.'], ['boss', 'Use it well. The mould fears fire, and it hides in the Pantry.']],
      'w4-open': [['me', 'With flame restored, I owe this kitchen a debt. I will pay it.']],
      'w4-elite': [['me', 'Shields of tin. Fire goes around shields.']],
      'w4-boss': [['boss', 'NO FIRE NEAR MY COOKIES!'], ['me', 'Then you should not have stolen them.']],
      'w4-after': [['n', 'The Wasabi Flame burns away the last of the mould in the Pantry.'], ['mold', 'Fire, old dragon? In the Sink, all fires drown.'], ['me', 'A Roll Dragon is born of rice and sea. Water does not frighten me.'], ['n', 'To be continued in World 5: The Sink.']],
    },
  },
  8: {
    title: 'Don\'t Melt', tagline: 'A chocolate golem who is very, very afraid of heat.',
    variants: { '1-2': 'ambush', '1-6': 'swarm', '2-3': 'night', '2-6': 'swarm', '3-2': 'swarm', '4-4': 'night' },
    beats: {
      intro: [['me', 'Me, Chocomunch. Me strong. Me punch good.'], ['me', 'Me afraid of ONE thing: melting.'], ['n', 'The Head Chef left a note for Chocomunch: "Meet me at the Oven." Chocomunch has never been near an oven.'], ['me', '...Me go anyway. Chef is friend.']],
      'w1-open': [['me', 'Countertop. Sunny. Me a little soft. Me okay.']],
      'w1-elite': [['me', 'Big egg. Me punch big egg. Easy.']],
      'w1-boss': [['boss', 'MY BURNERS WILL MELT YOU!'], ['me', '...Me not like this boss.']],
      'w1-after': [['boss', 'You fought next to a burner? Brave chocolate.'], ['me', 'Me VERY scared. Me do it anyway.']],
      'w2-open': [['me', 'FRIDGE! Me love fridge! Me firm and crunchy here!']],
      'w2-elite': [['me', 'Pickle knight. Me punch. Me crunchy. Good day.']],
      'w2-boss': [['boss', 'STAY... HERE... WHERE IT\'S... COLD...'], ['me', 'Tempting. But Chef needs Chocomunch.']],
      'w2-after': [['boss', 'Take some ice with you. For the Oven.'], ['me', 'Me... still scared. But me go.']],
      'w3-open': [['me', 'Oven. Hot. Very hot. Me count to ten. ...Me go.']],
      'w3-elite': [['me', 'Me melting a little. Me punch faster before more melting.']],
      'w3-boss': [['boss', 'FONDUE! I\'LL MAKE FONDUE OF YOU!'], ['me', 'NO FONDUE!']],
      'w3-after': [['n', 'Chocomunch is a little melty around the edges, but still standing.'], ['me', 'Me did it. Me in Oven. Me not scared any more. ...Little bit scared.'], ['boss', 'The Chef was here, but went up to the Pantry. Hurry.']],
      'w4-open': [['me', 'Pantry cool. Me firm again. Me ready.']],
      'w4-elite': [['me', 'Shields? Me punch through shields.']],
      'w4-boss': [['boss', 'CHOCOLATE COOKIE! THE BEST KIND!'], ['me', 'Me not cookie. Me FIST.']],
      'w4-after': [['n', 'The Chef\'s note: "Chocomunch, I knew you could do it. Now come to the Sink."'], ['me', 'Water? Me okay with water. Water not hot.'], ['mold', 'Hot water, little golem. Very hot water.'], ['me', '...Me scared. Me go anyway.'], ['n', 'To be continued in World 5: The Sink.']],
    },
  },
  15: {
    title: 'Grill Champion', tagline: 'A shy hedgehog chasing the perfect grill.',
    variants: { '1-5': 'swarm', '1-8': 'swarm', '2-4': 'ambush', '2-9': 'night', '3-6': 'swarm', '4-8': 'swarm' },
    beats: {
      intro: [['n', 'Every summer the kitchen held a grand cookout. Without the Head Chef there\'s no cookout, and no Grill Champion.'], ['me', 'I-I\'ve practised all year. I was going to enter.'], ['me', 'If I find the perfect grill at Broiler Peak, maybe I can bring the cookout back.']],
      'w1-open': [['me', 'Okay. Deep breath. Spikes out. You can do this, Hotchog.']],
      'w1-elite': [['me', 'S-sorry, egg, could you please move? ...No? Spike roll it is.']],
      'w1-boss': [['boss', 'A HOT DOG! ON MY STOVE! I\'LL GRILL YOU!'], ['me', 'I-I\'m the one who does the grilling!']],
      'w1-after': [['boss', 'Not bad, little sausage. You\'d make a fine champion.'], ['me', 'R-really? ...Thanks!']],
      'w2-open': [['me', 'The Fridge. Where the hot dogs wait. I don\'t want to wait any more.']],
      'w2-elite': [['me', 'A knight! I-I\'ll be brave. Like a champion.']],
      'w2-boss': [['boss', 'NO... COOKOUTS... ONLY... COLD...'], ['me', 'Everybody deserves a cookout!']],
      'w2-after': [['boss', 'I\'d like to come to your cookout. If I may.'], ['me', 'Y-yes! Bring ice! For the drinks!']],
      'w3-open': [['me', 'Broiler Peak is up there. The perfect grill. I can feel it.']],
      'w3-elite': [['me', 'Bacon and meatballs. A whole menu. Not today!']],
      'w3-boss': [['boss', 'BROILER PEAK IS MY LAIR!'], ['me', 'Th-then let\'s see whose grilling is better!']],
      'w3-after': [['n', 'At the top of Broiler Peak, the perfect grill glows.'], ['boss', 'Take it. You earned it, Champion.'], ['me', 'Champion... I like that.']],
      'w4-open': [['me', 'Now I need the Chef\'s secret sauce recipe. It\'s in the Pantry.']],
      'w4-elite': [['me', 'Tin cans! Good for baked beans. Bad for blocking my way.']],
      'w4-boss': [['boss', 'NO SAUCE! NO RECIPE! ALL MINE!'], ['me', 'A cookout is for EVERYONE!']],
      'w4-after': [['n', 'The recipe is found. The whole kitchen comes to the cookout, and Hotchog is crowned Grill Champion.'], ['mold', 'A party? How sweet. The Sink will wash it all away.'], ['me', 'N-not if the Champion has anything to say about it!'], ['n', 'To be continued in World 5: The Sink.']],
    },
  },
  17: {
    title: 'Long Way Home', tagline: 'A homesick penguin who slid much too far.',
    variants: { '1-3': 'swarm', '1-6': 'ambush', '2-2': 'night', '2-5': 'swarm', '3-7': 'swarm', '4-6': 'ambush' },
    beats: {
      intro: [['n', 'When the Head Chef vanished, the freezer door was left open, and a little penguin went sliding out... and out... and out.'], ['me', 'Wheeee— oh no. Where am I?'], ['me', 'Home is the freezer. Up and across. I can slide there! Probably!']],
      'w1-open': [['me', 'Warm countertop! My cream is going soft. Slide faster!']],
      'w1-elite': [['me', 'An egg! Eggs live in the fridge, so we\'re basically neighbours. Why so cross?']],
      'w1-boss': [['boss', 'A PENGUIN? ON MY STOVE? YOU\'LL MELT!'], ['me', 'Not if I slide fast enough!']],
      'w1-after': [['boss', 'You\'re a long way from home, little one.'], ['me', 'I know! The Fridge is that way. I think.']],
      'w2-open': [['me', 'The Fridge! It\'s so cold and lovely! Almost home!']],
      'w2-elite': [['me', 'A pickle knight is guarding the way up. Excuse me, coming through!']],
      'w2-boss': [['boss', 'NO... ONE... LEAVES... THE FREEZER...'], ['me', 'But I\'m trying to get IN!']],
      'w2-after': [['n', 'The freezer door swings open. Home at last.'], ['me', 'Home! ...It\'s so quiet. Everyone I met out there needs help.'], ['me', 'Maybe home can wait a little.']],
      'w3-open': [['me', 'The Oven. The opposite of home. I must be brave, or very silly.']],
      'w3-elite': [['me', 'Popcorn! It pops like snow, but hot. Weird.']],
      'w3-boss': [['boss', 'ICE CREAM! MY FAVOURITE DESSERT!'], ['me', 'I\'m cookies AND cream, thank you very much!']],
      'w3-after': [['boss', 'You came all this way for others? You\'re no ordinary penguin.'], ['me', 'Nope! I\'m an adventurer now. Pantry next!']],
      'w4-open': [['me', 'Dusty and dry. I miss the snow. But my friends are counting on me.']],
      'w4-elite': [['me', 'Tin shields! Can I slide under them? Let\'s find out!']],
      'w4-boss': [['boss', 'COOKIES AND CREAM! THE PERFECT DUNK!'], ['me', 'Nobody dunks THIS penguin!']],
      'w4-after': [['n', 'With the Pantry saved, the kitchen\'s creatures send Pengwhip home in style.'], ['me', 'Home isn\'t just the freezer. It\'s all of you.'], ['mold', 'Then you\'ll want to save it from the Sink, little penguin.'], ['me', 'Water! I\'m a penguin! That\'s MY turf!'], ['n', 'To be continued in World 5: The Sink.']],
    },
  },
};

/** Which story beat (if any) plays before a stage, and after it. */
export function beatBefore(stageId: string, firstEver: boolean): string[] {
  const [w, n] = stageId.split('-').map(Number);
  const out: string[] = [];
  if (stageId === '1-1' && firstEver) out.push('intro');
  if (n === 1) out.push(`w${w}-open`);
  if (n === 5) out.push(`w${w}-elite`);
  if (n === 10) out.push(`w${w}-boss`);
  return out;
}
export function beatAfter(stageId: string): string[] {
  const [w, n] = stageId.split('-').map(Number);
  return n === 10 ? [`w${w}-after`] : [];
}

// each kaiju's stage-5 beats are its own nemesis's (src/story/nemesis.ts)
for (const [sp, b] of Object.entries(NEMESIS_BEATS)) if (STORIES[Number(sp)]) Object.assign(STORIES[Number(sp)].beats, b);

/** Painted still behind a story line (art name in public/art), or null for the plain background + portraits.
 *  Per kaiju: the intro and the World 4 cliffhanger (from the Mold's first line on). Shared, since bosses are the
 *  same for everyone: each world's opening vista, boss reveal and the cured boss afterwards. Elite beats have none. */
export function stillFor(species: number, beat: string, lineIndex: number): string | null {
  if (beat === 'intro') return `still-${species}-intro`;
  const m = /^w(\d)-(open|boss|after)$/.exec(beat);
  if (!m) return null;
  const w = Number(m[1]);
  if (m[2] !== 'after') return `still-w${w}-${m[2]}`;
  if (w === 4) {
    const lines = STORIES[species]?.beats[beat] ?? [];
    const firstMold = lines.findIndex(([who]) => who === 'mold');
    return firstMold >= 0 && lineIndex >= firstMold ? `still-${species}-cliff` : 'still-w4-cure';
  }
  return `still-w${w}-cure`;
}

/** Every still the stories can show (the art test checks they all exist). */
export function allStills(): string[] {
  const out = new Set<string>();
  for (const [sp, s] of Object.entries(STORIES))
    for (const [beat, lines] of Object.entries(s.beats)) lines.forEach((_, i) => { const k = stillFor(Number(sp), beat, i); if (k) out.add(k); });
  return [...out].sort();
}
