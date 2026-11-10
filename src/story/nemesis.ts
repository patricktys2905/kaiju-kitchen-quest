// Each kaiju's personal rival: met at stage 5 of World 1, returning stronger at stage 5 of every world.
// These beats replace the old generic elite beats. Speaker 'foe' = this kaiju's nemesis (mobs.ts nem.species).
import type { StoryLine } from './stories';

type Beats = Record<'w1-elite' | 'w2-elite' | 'w3-elite' | 'w4-elite', StoryLine[]>;

export const NEMESIS_BEATS: Record<number, Beats> = {
  0: { // Gobzilla Jr. vs Brutus Beetroot, the bully
    'w1-elite': [['foe', 'Well, well. If it isn\'t Gobzilla JUNIOR. Lost your big brother, shrimp?'], ['me', 'Brutus Beetroot! I\'m not a shrimp, I\'m a strawberry!'], ['foe', 'Same thing. Small and squishy. Let\'s see you stomp ME.']],
    'w2-elite': [['foe', 'You again? I froze my roots off getting here just to squash you.'], ['me', 'Then you came a long way to lose, Brutus!']],
    'w3-elite': [['foe', 'The mould made me STRONGER, shrimp. Look at these roots!'], ['me', 'Big brother says bullies are just scared kaiju with loud voices.'], ['foe', 'I\'m NOT SCARED! ...RAAAH!']],
    'w4-elite': [['foe', 'Every time... every time you get back up. Why?'], ['me', 'Because real kaiju don\'t stay down. Even the medium-sized ones.'], ['foe', '...Fine. One last round. Then maybe... you can call me Brutus instead of bully.']],
  },
  10: { // Bluebeary vs Crustwing, the crumb crow
    'w1-elite': [['foe', 'Caw! Shiny crumbs, crumbly crumbs! Finders keepers!'], ['me', 'Those "crumbs" are my Crumblets, bird.'], ['foe', 'Then come and take them back, fuzzy! Caw-caw!']],
    'w2-elite': [['foe', 'Caw! Your little ones are frozen solid. Easier to carry!'], ['me', 'Put. Them. Down.']],
    'w3-elite': [['foe', 'The hot oven crisps my crusts. I\'m faster than ever!'], ['me', 'Faster doesn\'t matter. I\'ll still be standing between you and them.']],
    'w4-elite': [['foe', 'Last nest, fuzzy. Last chance to give up your crumbs.'], ['me', 'They\'re not crumbs. They\'re family. You wouldn\'t understand.'], ['foe', '...Caw. Nobody ever came looking for me.']],
  },
  11: { // Pizzaraptor vs Pineapple Pete, the rival courier
    'w1-elite': [['foe', 'Pineapple Pete Express! Fastest wheels in the kitchen! That pizza is MINE to deliver!'], ['me', 'Raptor Express doesn\'t share routes, Pete!']],
    'w2-elite': [['foe', 'I\'ve put pineapple on your delivery route. Slippery, isn\'t it?'], ['me', 'Pineapple on pizza is a crime. Pineapple on the FLOOR is war.']],
    'w3-elite': [['foe', 'Thirty minutes are nearly up, raptor! Tick tock!'], ['me', 'I always deliver. Always. Out of my lane!']],
    'w4-elite': [['foe', 'The mould promised me every delivery in the kitchen if I stopped you.'], ['me', 'The mould doesn\'t tip, Pete. Trust me.'], ['foe', '...Huh. It really doesn\'t.']],
  },
  4: { // Mothball vs Zapsy the Bug Lamp
    'w1-elite': [['foe', 'Bzzzt. Little moth. Come to the light. My light. Only my light.'], ['me', 'You\'re bright... but you\'re not the moon.'], ['foe', 'I can be your moon. Closer... closerrr... BZZT!']],
    'w2-elite': [['foe', 'Even in the cold, moths come to me. They always come.'], ['me', 'Not this one. I know the difference now.']],
    'w3-elite': [['foe', 'The oven glows. I glow brighter. Look at me, moth!'], ['me', 'I\'m not looking. I\'m dreaming of moonlight.']],
    'w4-elite': [['foe', 'Why won\'t you love my light?! Everyone loves my light!'], ['me', 'Your light only wants to catch things. The moon just shines.'], ['foe', 'Bzz... bzz... I only wanted company.']],
  },
  1: { // Squidgeon vs Professor Penicillin
    'w1-elite': [['foe', 'Ah, a colleague! Professor Penicillin. I study the Mold Crown too. I simply... prefer it to WIN.'], ['me', 'That\'s not science, that\'s cheating!']],
    'w2-elite': [['foe', 'My spores thrive in the cold. Your antidote is a lovely little hypothesis.'], ['me', 'Hypotheses are tested. Prepare to be tested, Professor.']],
    'w3-elite': [['foe', 'Peer review time! My mushrooms would like a word.'], ['me', 'Your methodology is flawed and your minions are mouldy.']],
    'w4-elite': [['foe', 'One sample of your antidote and I can make the Mold unstoppable!'], ['me', 'Results: rejected. Conclusion: you\'re going down.'], ['foe', 'Fascinating... and slightly painful.']],
  },
  2: { // Crabbage vs Sir Slurp, the garden slug
    'w1-elite': [['foe', 'Slurrrp. Ah, the cabbage crab. Your patch was DELICIOUS.'], ['me', 'YOU. You\'re the one who ate my sprouts.'], ['foe', 'And I\'ll eat your shell next. Slurrrp.']],
    'w2-elite': [['foe', 'The fridge drawer has lettuce. Lettuce! But I\'d rather have YOU.'], ['me', 'Stay out of my garden. Stay out of my LIFE.']],
    'w3-elite': [['foe', 'Hot in here. My slime is bubbling. Mind your step, crab.'], ['me', 'I walk sideways. Your slime trail goes forwards. Think about it.']],
    'w4-elite': [['foe', 'Every garden, every patch, every leaf: mine! The Mold promised!'], ['me', 'A garden isn\'t yours because you ate it. It\'s yours because you grow it.'], ['foe', '...I never grew anything.']],
  },
  5: { // Toastbat vs Ricotta Rat, the rival thief
    'w1-elite': [['foe', 'Well, if it isn\'t the toast with wings. Heading for the Golden Butter too?'], ['me', 'Ricotta Rat. Last time I saw you, you stole my crust.'], ['foe', 'And this time I\'m stealing your heist.']],
    'w2-elite': [['foe', 'The vault\'s in the cold, bat. And I already have the map.'], ['me', 'Maps are for amateurs. I fly.']],
    'w3-elite': [['foe', 'Mousetraps everywhere. Professional courtesy, of course.'], ['me', 'Cute. I\'ve seen better traps in a cereal box.']],
    'w4-elite': [['foe', 'The Butter is mine. The Mold Crown pays double for it!'], ['me', 'It\'s a cure, Ricotta. Some things you don\'t sell.'], ['foe', '...Since when do YOU have a heart?']],
  },
  6: { // Dumplord vs Duke Fortune Cookie
    'w1-elite': [['foe', 'Halt, commoner dumpling! I, Duke Fortune Cookie, am the rightful heir of the kitchen!'], ['me', 'Rightful? I\'m Dumplord, Lord of All Leftovers!'], ['foe', 'My fortune says: "You will lose." Guards!']],
    'w2-elite': [['foe', 'My fortune says: "Cold days ahead for dumplings." Ha!'], ['me', 'Mine says: "Your shell will crack." I wrote it myself.']],
    'w3-elite': [['foe', 'Bow before your Duke! My crumbling shell is impenetrable!'], ['me', 'A crumbling shell is the opposite of impenetrable, Your Grace.']],
    'w4-elite': [['foe', 'The Mold Crown will crown ME! Me! Not some... soggy dumpling!'], ['me', 'A crown isn\'t worth much if your kingdom is all mould.'], ['foe', '...My fortune says: "Listen to the dumpling." Bah.']],
  },
  7: { // Norigon vs Gari the Ginger Serpent
    'w1-elite': [['foe', 'Ssso. The last Roll Dragon still crawls. I am Gari. I swallowed your flame\'s last ember.'], ['me', 'Then I will take it back, serpent.']],
    'w2-elite': [['foe', 'Cold, isn\'t it, old dragon? Without your fire.'], ['me', 'A dragon\'s heart is warm without fire.']],
    'w3-elite': [['foe', 'The oven feeds my pink flame. Your green one is a memory.'], ['me', 'Memories are where the Roll keeps its strength.']],
    'w4-elite': [['foe', 'Take your ember, then! If you can pull it from my coils!'], ['me', 'This is the way of the Roll.'], ['foe', 'Ssss... it burns... it was always yours.']],
  },
  8: { // Chocomunch vs Torchy Brûlée
    'w1-elite': [['foe', 'A CHOCOLATE golem? Oh, I\'m going to enjoy this. Meet my blowtorch.'], ['me', 'Me... no like torch.'], ['foe', 'Nobody likes the torch. That\'s what makes it fun!']],
    'w2-elite': [['foe', 'Cold fridge, warm torch. You can\'t hide in here forever.'], ['me', 'Me not hiding. Me waiting. Now me punching.']],
    'w3-elite': [['foe', 'The OVEN! My home! You\'re already soft, golem!'], ['me', 'Me soft. Me still punch.']],
    'w4-elite': [['foe', 'Why aren\'t you melting?! Everything melts!'], ['me', 'Me scared of melting. Me more scared of friends getting hurt.'], ['foe', '...That\'s annoyingly brave.']],
  },
  15: { // Hotchog vs Captain Kebab, the rival grill champion
    'w1-elite': [['foe', 'Captain Kebab, five-time Grill Champion! And you are... a sausage with spikes?'], ['me', 'I-I\'m Hotchog. And I\'m entering the cookout.'], ['foe', 'Then let\'s see if you can take the heat!']],
    'w2-elite': [['foe', 'No grill in the fridge, little dog. You\'re out of your element.'], ['me', 'A champion grills anywhere. Even here.']],
    'w3-elite': [['foe', 'Broiler Peak is MY grill. You\'re just a snack on a skewer.'], ['me', 'I practised all year. I\'m n-not scared of you!']],
    'w4-elite': [['foe', 'Five titles! FIVE! And the Mold promised me a sixth!'], ['me', 'Titles don\'t mean anything without a cookout to share them with.'], ['foe', '...You really believe that, kid? Huh. Show me.']],
  },
  17: { // Pengwhip vs Finn Freezepop
    'w1-elite': [['foe', 'A penguin? Out HERE? You\'re in my waters now, birdie!'], ['me', 'There\'s no water here! It\'s a countertop!'], ['foe', 'Everywhere is water if you believe hard enough! CHOMP!']],
    'w2-elite': [['foe', 'The freezer was MY kingdom while you were gone, birdie.'], ['me', 'Kingdom? It\'s my HOME. And it\'s cold for everyone.']],
    'w3-elite': [['foe', 'Brrr-oil! It\'s hot! I\'m melting! It\'s your fault somehow!'], ['me', 'Then let\'s finish this quick and get you somewhere cold!']],
    'w4-elite': [['foe', 'Last slide, birdie. Winner gets the freezer.'], ['me', 'How about we share it? There\'s room for a shark AND a penguin.'], ['foe', '...Share? Nobody ever asked me to share before.']],
  },
};
