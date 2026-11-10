// Pengwhip: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop. Lost, warm, and no brakes.
  "w1-s2": [["me", "Crumbs! Terrible for sliding. Wonderful for snacking."], ["me", "Excuse me, which way to the freezer? ...Nobody? Okay. Up and across. Up and across."]],
  "w1-s3": [["n", "Gummy Gully is wriggling. Sour worms, sugar ants, mouldy buns: a whole swarm."], ["me", "That's a lot of friends who aren't my friends!"], ["me", "Ooh, a ladle lever! One tug, one big rolling pin. Penguin bowling!"]],
  "w1-s4": [["me", "Oh! A little Crumblet! Are you lost too? Me too! Let's be lost together."], ["me", "Just one rule: I can't stop when I slide, so DON'T stand in front of me."]],
  "w1-s6": [["me", "The Chef's Recipe Scroll? If I fetch it, maybe someone will point me home!"], ["n", "Behind the cinnamon, something big is waiting. An extra elite."], ["me", "...Or maybe I fetch it VERY quickly."]],
  "w1-s7": [["me", "Achoo! Pepper Pass is the least snowy place I have ever been."], ["me", "A key in a hidden chest? Keys open doors. Maybe the FREEZER door! Sponge, here I come!"]],
  "w1-s8": [["me", "Hold my ground for forty-five seconds? But I don't HAVE brakes!"], ["me", "Okay. I'll slide in circles. Circles count as standing still. I've decided."]],
  "w1-s9": [["me", "Burners ahead. My whipped cream is drooping. Do penguins sweat? I'm finding out."], ["mold", "Such a long way from the cold, little bird. Stay. Melt. Rest."], ["me", "Nope! Resting is for after the slide!"]],
  // World 2: The Fridge. Almost home.
  "w2-s2": [["n", "The fridge light blinks out. Dairy Lane goes pitch-dark, and the monsters grow bolder."], ["me", "Dark and cold? That's just a normal Tuesday at home! I'm not scared."], ["me", "...The glowing eyes are new, though."]],
  "w2-s3": [["me", "Frost! Real, proper frost! I'm going to slide on ALL of it!"], ["me", "That lunchbox has teeth marks on the INSIDE. Don't open it. ...I'm going to open it."]],
  "w2-s4": [["me", "Another lost Crumblet! I know a great place for lost things: the freezer. Follow me!"], ["me", "Wait, no, that's where leftovers go. The exit, then. Mind the hissing pots!"]],
  "w2-s6": [["me", "Recipe Scroll, then the freezer! I can smell the frost from here. It smells like... ice."], ["me", "Seventy-five seconds? I could slide round the whole fridge twice in that. Probably."]],
  "w2-s7": [["me", "Butter Bridge! Butter is the second-best thing to slide on. First is ice. Third is also ice."], [5, "Psst, penguin. Chest on the high ledge. Key inside. I'd nick it myself, but I'm busy."], ["me", "Thanks, Toastbat! ...Wait, busy doing WHAT?"]],
  "w2-s8": [["me", "Ketchup Canyon. Red and gloopy. Nothing like snow. I miss snow."], ["me", "The freezer is RIGHT up there. Forty-five seconds. Hold. Hold. Hoooold."]],
  "w2-s9": [["me", "Ice Tray Steps! Ice cubes! I can see my house from here!"], ["foe", "Hey, birdie! I've been using your bed as a snack drawer. Hurry up, you're missing it!"], ["me", "FINN! That's a NEST, not a drawer!"]],
  // World 3: The Oven. The opposite of home, for the sake of friends.
  "w3-s2": [["me", "Home will still be there when I'm done. I hope it saves me a snowball."], ["me", "Even the bottom rack is warmer than my whole life so far. Slide fast!"]],
  "w3-s3": [["me", "Muffin tins! Twelve little cups, twelve wrong turns. I'm sliding into every one."], ["me", "That cereal box moves when I'm not looking. Lever first, questions later."]],
  "w3-s4": [["me", "Little Crumblet! Stay in my shadow. It's the only cool spot in the whole Oven."], ["me", "And remember: hissing pots are monster traps, not hot tubs."]],
  "w3-s6": [["me", "A flat cookie sheet! Perfect sliding! Ow! Ow! Hot! STILL PERFECT SLIDING!"], ["me", "Grab the scroll and hold out. It's warm, but so is a hug. Think hug thoughts."]],
  "w3-s7": [["n", "The roasting pan is packed with monsters, sizzling shoulder to shoulder."], ["me", "That's a lot of hot stuff in one pan! Somebody turn it down!"], ["me", "The key chest is up a sponge somewhere. I'll slide under the crowd. Tummy first!"]],
  "w3-s8": [["me", "Forty-five seconds on a pizza stone. I'm going to come out a waffle cone."], [6, "Courage, small penguin! I, Dumplord, have been steamed for HOURS. It builds character!"]],
  "w3-s9": [["me", "Top rack. So hot my cookie bits are extra crunchy. Still... I'm glad I came."], ["me", "Out here everyone says \"thanks, Pengwhip.\" At home they mostly say \"shut the door.\""]],
  // World 4: The Pantry. Dry, dusty, and finally learning to stop.
  "w4-s2": [["me", "Dusty and dry. Not a snowflake for miles. I wrote the freezer a postcard anyway."], ["me", "\"Dear Freezer: I'm in a canyon made of cereal. Wish you were here. Bring ice.\""]],
  "w4-s3": [["me", "SNOW! Real snow! Snowdrifts as far as I can—"], ["me", "...It's flour. It's flour, isn't it."], ["me", "Still slides like snow! I'm counting it!"]],
  "w4-s4": [["me", "Hello again, little Crumblet! You're good at following me. And I'm good at STOPPING now."], ["me", "See? Brakes! ...Mostly. Stay clear of the pressure cookers."]],
  "w4-s6": [["n", "On the ridge, a big shadow is waiting behind the nutmeg. An extra elite."], ["foe", "Thought you'd want a warm-up before our rematch, birdie. Say hi to my pal!"], ["me", "Finn! Since when do sharks have pals THAT big?!"]],
  "w4-s7": [["me", "Pasta Jar Peaks. Spaghetti makes terrible skis. I've tried."], ["me", "One more key in one more chest. I've bounced so much I'm basically a sponge myself."]],
  "w4-s8": [["me", "Honey Hollow. Sticky floor. No sliding. Uh-oh. I'm a penguin standing still."], ["me", "Forty-five seconds of waddling. Okay. Waddle mode: ACTIVATE."]],
  "w4-s9": [["me", "The top shelf! From up here I can see the freezer AND all my friends below."], ["mold", "Look the other way, little penguin. The Sink is dripping. Drip. Drip."], ["me", "Whoever's dripping, please stop. Some of us are having a heartwarming moment."]],
};

export const QUIPS: Record<QuipKind, string[]> = {
  combo: ["Slide, slide, SLIDE!", "Bowling for baddies!", "Strike! Penguin style!"],
  lowhp: ["I'm melting! Wrong way!", "Need... a freezer... nap...", "My cream is curdling!"],
  perfect: ["Wheee! Missed me!", "Can't hit what slides!", "Slippery when cool!"],
  levelup: ["Extra whipped! Level up!", "Fancy penguin unlocked!", "Bigger, colder, cooler!"],
  secret: ["Ooh! A souvenir for home!", "Bouncy sponge for the win!", "Treasure! Is it cold?"],
  boom: ["KABOOM! Avalanche!", "Rolled flat like pastry!", "Ice to meet you! Bye!"],
  mimic: ["That box has TEETH!", "Not a present! NOT!", "Lunch tried to eat ME?!"],
  objective: ["Done! Freezer, here I come!", "Nailed it! Sliding on!", "That's one cool job done!"],
};
