// Gobzilla Jr.: main story arc and nemesis scenes (cartoon voice, see docs/VOICE.md).
import type { StoryLine } from '../stories';

export const TITLE = "Junior Goes Big";
export const TAGLINE = "A teeny strawberry with a GREAT BIG RAWR!";
/** same keys as STORIES[0].beats except the w{N}-elite and w{N}-s{n} ones */
export const ARC: Record<string, StoryLine[]> = {
  "intro": [
    ["n", "Meanwhile, in the kitchen... the Head Chef is GONE, and something sour is creeping in!"],
    ["me", "Rawr! Big brother says I'm too small to be a real kaiju."],
    ["me", "Hah! If I find the Chef, everybody's gotta call me Gobzilla SENIOR! Okay, okay. Gobzilla Medium."],
  ],
  "w1-open": [
    ["me", "The Countertop! Big brother crossed this whole thing in ONE stomp!"],
    ["me", "So that's like two hundred of my stomps. Easy peasy! Let's go!"],
  ],
  "w1-boss": [
    ["boss", "WHO DARES CLIMB MY STOVETOP?! I AM THE BURNT TOAST KING!"],
    ["me", "King? You're BREAKFAST, buddy! Rawr!"],
    ["boss", "SILENCE, CRUMB! BOW BEFORE MY CRUST!"],
  ],
  "w1-after": [
    ["boss", "Ooh, my head... was I shouting? I used to be such a nice slice!"],
    ["boss", "Then this green fuzz crawled all over my crust. Blech!"],
    ["me", "The Mold Crown! Where'd it come from?"],
    ["boss", "From the cold. The Fridge! Brrr."],
    ["me", "Then that's where I'm stomping next! Rawr!"],
  ],
  "w2-open": [
    ["me", "Brrr! My leaves are shivering! Real kaiju don't shiver!"],
    ["me", "Um, real kaiju wear scarves. Probably. Anybody got a scarf?"],
  ],
  "w2-boss": [
    ["boss", "COLD! SO COLD! EVERYBODY STAYS FROZEN! FOREVERRR!"],
    ["me", "Nope! Strawberries are best FRESH!"],
  ],
  "w2-after": [
    ["boss", "Drip, drip! Hey, the ice is melting outta my brain!"],
    ["boss", "That mold wanted me to freeze the WHOLE kitchen. Sorry, kiddo."],
    ["me", "It's okay! Did you see the Head Chef?"],
    ["boss", "Just a hat, floating off toward the warm glow of the Oven."],
    ["me", "A hat clue! Ooh, I'm a detective now too!"],
  ],
  "w3-open": [
    ["me", "Whoa, it's so hot in here my seeds are popping! Pop! Pop!"],
    ["me", "Big brother would just roar at the heat. RAWR! ...Nope, still hot."],
  ],
  "w3-boss": [
    ["boss", "A SNACK! A TINY SWEET SNACK FOR THE GREASE DRAGON! SLUUURP!"],
    ["me", "TINY?! I'm Gobzilla Jr., and I'm here to STOMP!"],
  ],
  "w3-after": [
    ["boss", "Phew! The grease is out of my eyes. You're pretty brave for a berry!"],
    ["me", "*sniff* Nobody ever called me brave before!"],
    ["boss", "The mold went up into the Pantry. Be careful, little one. Er, BIG one!"],
    ["me", "Didja hear that? BIG one! Rawr!"],
  ],
  "w4-open": [
    ["me", "The Pantry! Smells like old cereal and ADVENTURE!"],
    ["me", "Big brother never got this far. Hey... does that make ME the big one now?"],
  ],
  "w4-boss": [
    ["boss", "COOOKIES! ALL MINE! YOU'LL BE A COOKIE TOO! NOM NOM NOM!"],
    ["me", "Hey! The Chef's hat is inside that jar! Spit it out!"],
  ],
  "w4-after": [
    ["boss", "Hic! Thank you! I was keeping the Chef's hat safe, and then the mold got into my lid."],
    ["mold", "Hehehe... little berry. The Mold Crown waits in the Sink. Come and wear it."],
    ["me", "Big brother, if you can hear me, I'm going to the Sink! And I'm NOT scared!"],
    ["me", "Okay, medium scared."],
    ["n", "To be continued in World 5: The Sink."],
  ],
  "w5-open": [
    ["me", "The Sink! Big brother says this is where dishes go to get SCARED. Rawr!"],
    ["me", "Whoa, that faucet's taller than a skyscraper. Medium kaiju can swim, right? Right?!"],
  ],
  "w5-boss": [
    ["boss", "Hehehe... the little berry came all this way. Your big brother never would. He's too SMART!"],
    ["me", "Hey! Nobody picks on big brother except ME!"],
    ["boss", "Wear the Crown, shrimp. You'll be BIG forever. Big and green and fuzzy!"],
    ["me", "No thanks! I'm growing the regular way! One STOMP at a time! RAAAWR!"],
  ],
  "w5-after": [
    ["boss", "Squeak! Okay, okay! I'm just a little science project! Somebody grew me in the back of the fridge and FORGOT me!"],
    ["me", "Who?! Tell me who!"],
    ["boss", "Not telling! Squeeeak! SLUUURP!"],
    ["n", "GLUG! Down the drain it goes! And up floats a note: \"Safe and sound, little hero. Love, the Head Chef.\""],
    ["me", "Little HERO! Did ya hear that? The Chef's okay and I did it! Me!"],
    ["me", "Whoa, look at my shadow on the wall! It's GIGANTIC! Rawr! RAWR!"],
    ["foe", "Hmph. Not bad, shr... I mean, not bad, Gobzilla."],
    ["me", "Gobzilla MEDIUM! Say it! Everybody say it! Hey, big brother, guess who's the big one now?!"],
  ],
  "w6-open": [
    ["n", "Act 2: Beyond the Kitchen! A few days later..."],
    ["me", "Big brother says saving one kitchen only makes ya Gobzilla Medium. LARGE is a whole HOUSE thing!"],
    ["me", "Hey, what's this? A trail of stale crumbs, going out the door to the Dining Room! Ew, crunchy!"],
    ["lo", "Hmph. Forgotten, like a little brother. Come and find us, berry. If ya can."],
    ["me", "Nobody forgets Gobzilla! Stomp count back to zero. Gobzilla LARGE, here I come! RAWR!"],
  ],
  "w6-boss": [
    ["boss", "Halt, varlet! I am SIR STALE, aged to perfection! Have at thee!"],
    ["me", "Aged? You're a crusty old baguette with a moustache!"],
    ["boss", "STALE?! I am VINTAGE! Forsooth, I shall make thee a crouton!"],
    ["me", "Croutons are tiny! I'm LARGE now! Almost! RAWR!"],
  ],
  "w6-after": [
    ["n", "SNAP! Sir Stale's butter-knife lance breaks clean in two!"],
    ["boss", "My lance! Unhand me, varlet! Out the window I go! Baron Brussels shall grill thee in the Backyard!"],
    ["me", "Didja hear that? A whole BACKYARD! That's like a gazillion stomps!"],
    ["me", "Big brother, I'm gonna be Gobzilla EXTRA LARGE! Okay, okay. Large first. RAWR!"],
  ],
  "w7-open": [
    ["me", "The Backyard! Whoa, the grass is taller than big brother! Stomp count, back to zero. AGAIN!"],
    ["me", "Sniff sniff. Somebody's grilling! Big brother says BBQs are for BIG kaiju. Gobzilla Large, reporting for snacks!"],
    ["lo2", "Hah! Baron Brussels awaits thee atop the Grill, berry. Thou art TOAST!"],
    ["me", "Strawberries don't toast, ya crusty breadstick! RAWR!"],
  ],
  "w7-boss": [
    ["boss", "ATTEN-TION! I am BARON BRUSSELS! Drop and give me twenty, you squishy little berry!"],
    ["me", "Twenty STOMPS? Easy! Pee-yew, though! Did somebody sit on a stinkbug?"],
    ["boss", "That is my COLOGNE! Sprout Soldiers, FORM UP! Nobody leaves this grill till they finish their SPROUTS!"],
    ["me", "Big brother never finishes his sprouts either! Stomp count: ONE! RAWR!"],
  ],
  "w7-after": [
    ["n", "SIZZLE-POP! Baron Brussels bounces off the grill and goes rolling across the lawn!"],
    ["boss", "Retreat! Always left on the PLATE! The Mystery Meatloaf awaits you in the Garden, berry!"],
    ["me", "Mystery Meatloaf? What's in him?"],
    ["boss", "Nobody knows! Not even HIM! Sprout Soldiers, forward MARCH! Hmph!"],
    ["me", "A mystery?! Gobzilla Large cracks mysteries! Okay, ALMOST large. But look at my shadow in the sunset! RAWR!"],
  ],
  "w8-open": [
    ["me", "The Garden! Whoa, these sunflowers are taller than big brother standing on big brother! Stomp count, back to zero. AGAIN!"],
    ["me", "Sniff sniff. Ah-ah-ACHOO! Pollen! Real kaiju don't sneeze! ACHOO! Okay, they do."],
    ["lo2", "Hah! The Mystery Meatloaf awaits thee on the Mystery Heap, berry! Even HE knoweth not what he is!"],
    ["me", "A mystery? Then Gobzilla Large, kaiju detective, is on the case! RAWR!"],
  ],
  "w8-boss": [
    ["boss", "Who goes there?! I'm THE MYSTERY MEATLOAF! Made of, uh... huh, a TOY WHEEL?"],
    ["me", "You don't know what you're made of? I'm made of strawberry and RAWR!"],
    ["boss", "Am I beef? Am I lentils? WHO AM I?! Nobody EVER wanted seconds!"],
    ["me", "I'll give ya seconds! Second STOMP! Stomp count: TWO! RAWR!"],
  ],
  "w8-after": [
    ["n", "SPLORT! The Mystery Meatloaf wobbles off the heap, dropping peas everywhere!"],
    ["boss", "Huh, a SOCK? Hmph! To the Supermarket! The Tupperwraith haunts the back aisles. Nobody's opened HIM in years!"],
    ["me", "A ghost?! In a TUB?! I'm not scared! ...Okay, medium scared."],
    ["me", "Big brother, look! My shadow on the greenhouse goes all the way to the roof! Gobzilla LARGE! Almost! RAWR!"],
  ],
  "w9-open": [
    ["me", "The Supermarket! Whoa, the cereal boxes are like skyscrapers! Stomp count, back to zero. AGAIN!"],
    ["me", "Big brother says the supermarket's where grown-ups get BIG stuff. Gobzilla Large is on the shopping list!"],
    ["lo2", "Hah! The Tupperwraith awaits thee in the Back Aisle, berry! Thou art past thy sell-by date!"],
    ["me", "Strawberries are FRESH, ya crusty breadstick! Clean-up on aisle YOU! RAWR!"],
  ],
  "w9-boss": [
    ["boss", "Woooo! Who disturbs the BACK AISLE?! I am THE TUPPERWRAITH! Woooo!"],
    ["me", "A g-g-ghost! In a tub! Um, what's inside you, anyway?"],
    ["boss", "Nobody remembers! Not even ME! And don't you DARE say \"just throw it out\"! Wooooo!"],
    ["me", "Wasn't gonna! I was gonna say STOMP! Stomp count: THREE! RAWR!"],
  ],
  "w9-after": [
    ["n", "POP! The Tupperwraith's lid flies off, and out spills a whole hoard of stolen treasure!"],
    ["me", "Crabbage's cabbage! Toastbat's Golden Butter! And a teeny bib?! It says \"GOBZILLA JR.\" on it!"],
    ["boss", "Woooo! That's the big one's old bib! He was a Junior once too, ya know! Hmph! I'm floating HOME!"],
    ["lo", "Bring the little berry to the House, wraith. The Feast of the Forgotten is about to begin. Hehehe..."],
    ["me", "Big brother was a JUNIOR?! *sniff* Then Juniors get BIG! See ya at the House, Fruitcake! RAWR!"],
  ],
  "w10-open": [
    ["me", "The back of the Fridge! Brrr! Stomp count, back to zero. AGAIN! Last time, I promise!"],
    ["me", "Big brother wore that teeny bib once, and look how big HE got! Gobzilla LARGE, here I come!"],
    ["lo", "Hehehe. Come in, little berry. Back here, everybody gets forgotten. Even big brothers."],
    ["me", "Nobody forgets a RAWR this loud! RAWR!"],
  ],
  "w10-boss": [
    ["boss", "So! The berry who wants to be LARGE! I am OLD FRUITCAKE, King of the Leftovers!"],
    ["me", "Whoa, you're HUGE! And lumpy! Are those cherries? Can I have one?"],
    ["boss", "Every year I'm wrapped, re-gifted and shoved to the back! Nobody ever CUTS me! So NOBODY gets a feast!"],
    ["me", "Then I'll cut ya down to size! Stomp count: FOUR! RAWR!"],
  ],
  "w10-after": [
    ["boss", "Oof! My crown! It's just a dented old cake tin. It always was."],
    ["boss", "I never wanted to wreck the feasts, kid. I just wanted somebody to invite me. Just once!"],
    ["boss", "Every Christmas it's \"Ooh, fruitcake! Put it in the back.\" *sniff*"],
    ["me", "Well, I'M inviting ya! And Sir Stale, and the Baron, and Meatloaf, and the Wraith! Everybody!"],
    ["me", "Big brother! You came! Look, Mr. Fruitcake, he's cutting you a slice! A LARGE one!"],
    ["foe", "Save the second slice for the beet! I'm a GUEST now! Hmph!"],
    ["me", "And big brother says I'm Gobzilla LARGE now! He said it with his mouth full, but it COUNTS! RAWR!"],
  ],
};
export const NEMESIS: Record<"w1-elite" | "w2-elite" | "w3-elite" | "w4-elite" | "w5-elite" | "w6-elite" | "w7-elite" | "w8-elite" | "w9-elite" | "w10-elite", StoryLine[]> = {
  "w1-elite": [
    ["foe", "Well, well! If it isn't Gobzilla JUNIOR! Lost your big brother, shrimp?"],
    ["me", "Brutus Beetroot! I'm a STRAWBERRY, ya big turnip!"],
    ["foe", "Same diff! Small and squishy! C'mon, shrimp, stomp ME! Hah!"],
  ],
  "w2-elite": [
    ["foe", "YOU again?! I froze my roots off getting here just to squash ya!"],
    ["me", "Then you came a looong way to lose, Brutus!"],
  ],
  "w3-elite": [
    ["foe", "Hah! The mold made me STRONGER, shrimp! Check out these roots!"],
    ["me", "Big brother says bullies are just scared kaiju with loud voices!"],
    ["foe", "I'm NOT SCARED! RAAAAH!"],
  ],
  "w4-elite": [
    ["foe", "Huff, puff! Every time! You get back up EVERY time! Why?!"],
    ["me", "'Cause real kaiju don't stay down! Even the medium ones!"],
    ["foe", "Hmph. Fine. One last round. And if you win... you can just call me Brutus, okay?"],
  ],
  "w5-elite": [
    ["foe", "Huff, puff! Check it out, shrimp! Steel wool roots! I'm a BEET-ZILLA now!"],
    ["me", "Hey! Zilla's MY family name, ya big turnip!"],
    ["foe", "Grrr! Beet me one more time and fine, I'll quit the bully stuff. MAYBE! Don't get excited!"],
    ["me", "Too late! I'm SO excited! RAWR!"],
  ],
  "w6-elite": [
    ["foe", "Psst, Gobzilla! Roast Brute up the ridge. Way bigger than me. And I was BIG."],
    ["me", "Brutus! You came all this way to help?!"],
    ["foe", "Just warning ya! Nobody beets my favorite rival except ME. Hmph!"],
  ],
  "w7-elite": [
    ["foe", "Psst, Gobzilla! Burger Brute up on the plateau. Three patties tall! I counted. Twice."],
    ["me", "Brutus! You came to the BBQ too?!"],
    ["foe", "Beets never get invited to BBQs. Just squash it, okay? Not that I'm ROOTING for ya. Hmph!"],
  ],
  "w8-elite": [
    ["foe", "Psst, Gobzilla! Welcome to MY patch! Pumpkin Brute up ahead. Rounder than me. Orange-er too."],
    ["me", "Brutus! Is THIS where beets come from?!"],
    ["foe", "Born and raised in that dirt right there! Go squash it. Okay, FINE, I'm rooting for ya. I'm a ROOT! Hmph!"],
  ],
  "w9-elite": [
    ["foe", "Psst, Gobzilla! Watermelon Brute up on Melon Mountain. Big, green, and it spits SEEDS!"],
    ["me", "Brutus! What are YOU doing in a supermarket?!"],
    ["foe", "Beets are on sale, two for one! Go squash it before it spits on ME! Not that I'm worried! Hmph!"],
  ],
  "w10-elite": [
    ["foe", "Psst, Gobzilla! Fruitcake Knight up ahead. Big, crumbly, and totally nuts. Like YOU!"],
    ["me", "Brutus! You came to the FINAL fight?!"],
    ["foe", "Heard there's a feast after. Save me a seat, okay? NOT next to the sprouts! Hmph!"],
  ],
};
