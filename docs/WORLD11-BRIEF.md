# World 11 story brief: THE MIDWAY, the first world of Act 3 (for writers)

Five writers, four kaiju each, 11 scenes per kaiju, 220 scenes in all. This file is the only thing you need besides
`docs/VOICE.md`, `docs/stage-facts.md` (World 11 section) and your own kaiju's two files. Read your kaiju's
`src/story/arcs/k<sp>.ts` and `src/story/more/k<sp>.ts` end to end before you type a line. Checked against the code and
all 20 `w10-after` endings on 2026-11-14.

If this brief and `docs/ACT3-OUTLINE.md` disagree, this brief wins for World 11 (it was checked against the stages as
built). If this brief and `docs/stage-facts.md` disagree about a stage, stage-facts wins: tell the lead.

---

## 1. The world in six lines

1. **Premise.** The golden envelope from the end of Act 2 has brought all 20 kaiju, their old rivals and the five
   Leftovers to THE GREAT FOOD FESTIVAL, a giant fair on a sunny green hill. World 11 is its front door: the Midway, a
   fairground of game stalls and rides. "Step right up! Everybody's a winner. Mostly."
2. **Tone.** Bright, loud, warm afternoon sun after the cold gloom of World 10: striped tents, bunting, barkers,
   jingles, prizes. Same cartoon, same voices, same ham-fisted puns. It is a day out. Everybody is excited.
3. **What is new about the foes.** Act 1 monsters were sick and got cured. Act 2 villains were bitter and got invited.
   Act 3 foes are NEITHER. They are rival contestants, stallholders and showmen, and their games are rigged. Nobody is
   mouldy, nobody is sad, nobody needs saving or inviting. They cheat, they brag, they lose, they sulk. The kaiju are
   the new kids and the underdogs.
4. **What the player has just done.** Beat Old Fruitcake, invited him and the Leftovers to a real feast, and (post
   credits) found a golden envelope on the doorstep, left by a shiny delivery van. The Leftovers are FRIENDS now and
   came along as "Team Leftovers", the entries nobody expects to win.
5. **Where this world ends.** The Great Flosso, the showman who runs the Midway games, is beaten in his big top. He
   shrinks to a tiny wisp, gives up the FIRST RIBBON (a rosette, left lying in the spotlight), and hops off to tell on
   the kaiju. The festival goes on. Next stop: the Blue Ribbon Barn.
6. **What may be hinted, and no more.**
   - ALLOWED: Flosso answers to somebody he calls **"the Showstopper"** ("she", "her"). He is scared of her. The rigging
     is "house rules". In `w11-after` he (or the rosette's tag) may name the next round: **the Blue Ribbon Barn**, and
     its judge **Granny Crumble**, who judges "by the book". That is all anyone knows.
   - NOT ALLOWED in World 11: the name Dame Fondant. That the Showstopper is a cake, what she looks like, that she has
     never been cut, that she has won for 99 years, that SHE sent the envelopes or why. The names Monsieur Zest and
     Mr. Sample. What Granny Crumble looks like or says. Who drives the shiny van (never shown, never named, all act).
     No kaiju works out that the whole festival is a trap. They only know the Midway games were fixed.
   - The act's question is "does a feast need a winner?". World 11 only plants it: one ribbon, lots of friends, and a
     joke about who gets to hold it. No speeches, no moral (see section 6).

---

## 2. Cast notes for the new characters

### The Great Flosso (world boss, speaker `"boss"` in `w11-boss` and `w11-after` ONLY)
A huge pink candy-floss cloud on a striped paper cone, top hat, curly moustache, twirling a cone for a cane. Half
carnival barker, half stage magician. He runs every rigged game on the Midway and judges "showmanship". He is the
Showstopper's showman, NOT one of her judges. All fluff: light, floaty, vain, and scared of getting wet.

- **Voice.** Non-stop patter. He sells you your own defeat. "Step right up!", "Laaadies and gentle-snacks!",
  "Abracadabra-cadabra!", "Ta-daa!", "Everybody's a winner! Mostly ME!", "Fluff 'em!" (to his Floss Wisps), "My boy!",
  "My dear!". He is NOT a corrupted boss, so no all-caps shouting: capitals only on the word he is selling.
- **His tricks (name them, never explain them).** Cone Cane, Sticky Floss, Sugar Shower, Floss Wisps, Pick a Card (a
  fan of wafer cards), Up-and-Away, Ta-daa!, and his big number, the **Wheel of Misfortune**: the prize wheel behind
  him spins and calls out Sugar Shower, Floss Wisps or Shockwave before it lands. In story he brags that the wheel
  "always lands on bad luck". Do not tell the player what to do about it.
- **How he loses.** He deflates. Beaten, he is a teeny wisp on a great big cone with a teeny squeaky voice. He is a
  SORE LOSER: not cured, not sorry, not evil, not invited to join the team. He flings down the ribbon, says the
  Showstopper will hear about this, and hops out of the tent. Nobody chases him.
- **Where he speaks.** `"boss"` works already (the story player takes the name and portrait from the beat's world:
  "The Great Flosso", `boss-flosso`). No new speaker code is needed. BUT `"boss"` is not a legal speaker in the short
  scenes (`w11-s2`..`s9`). Before the big top he is only a voice on the loudspeaker, narrator-quoted:
  `["n", "The loudspeaker crackles: \"Step right up, tiny berry!\""]`. Use that at stage 9 (Big Wheel Climb), where he
  heckles every kaiju, and at most ONE other short scene.

Sample lines (do not reuse them: Gobzilla's writer owns the ones in section 8):
- `["boss", "Step right up, my dear! Three throws for a ticket! The cans are glued, the hoops are small, and the fun is REAL!"]`
- `["boss", "Showmanship, my dear! It isn't cheating if you do it with a FLOURISH! Abracadabra-cadabra!"]`
- `["boss", "Round and round she goes! The Wheel of Misfortune never lands on YOUR lucky day! Ta-daa!"]`
- Beaten: `["boss", "Eep! My fluff! I'm all cone! Take your silly ribbon. The Showstopper will hear about this! Toodle-oo!"]`

### Sir Stale: the Team Leftovers spotlight (speaker `"lo2"`)
Same Sir Stale: a pompous stale baguette knight with a moustache and a lance, "Forsooth!", "Have at thee!", "varlet",
"thou / thee / thy", "-eth". Reformed since the feast, and exactly as silly. **The gag of this world: he is certain the
fair is a JOUSTING TOURNAMENT.** The coconut shy is the lists, the ring toss is "tilting at the rings", carousel ponies
are "noble steeds", the ribbon is "the favour of the tourney". Nobody can talk him out of it, and nobody should manage to.
He is on the kaiju's side now: he heckles and cheers, and his insults have turned into terrible encouragement. He still
uses his old pet name for your kaiju (section 5).

- **Where, and how often.** REQUIRED in `w11-s8` (The Coconut Shy: "Have at thee, coconut!"), for every kaiju. That is
  his scene. He may appear in ONE more beat, picked from `w11-open`, `w11-s3` (Ring Toss Row) or `w11-after`. Hard
  limits per kaiju: 2 beats, 3 `"lo2"` lines. Never in `w11-elite` (that is the nemesis's scene), never in `w11-boss`.
- **He does not turn bad, does not win, and does not learn it is a fair.**
- Do not describe his lance beyond "lance" (it was snapped and mended in different ways in different stories).

Sample lines:
- `["lo2", "Have at thee, coconut! Forsooth, 'tis the mightiest foe I have faced since the bread bin!"]`
- `["lo2", "Stand fast, sausage! We hold the lists together! Which way do the lists face?"]`
- `["lo2", "A ring upon a peg! 'Tis tilting at the rings, and I am FIVE and nought! I have hit nothing!"]`
- `["lo2", "Huzzah! Thou hast won the favour of the tourney! 'Twas a tourney, yes?"]`

**The other four Leftovers** (Old Fruitcake, Baron Brussels, the Mystery Meatloaf, the Tupperwraith) are at the fair,
whole, well and happy to be invited. Their spotlights come in Worlds 12-15, so here they are background: at most ONE
mention per kaiju, narrator-quoted or simply named ("Old Fruitcake's holding the coats"). **Do NOT use the `"lo"`
speaker in World 11**: its portrait is a dark villain silhouette with glowing eyes (see section 7, engineer flags).
Old Fruitcake must never be described as sliced, eaten or smaller. Never say WHERE the Act 2 feast was held: each kaiju
held it somewhere different. Say "the feast".

### The friendly nemesis cameo (stage 5, `w11-elite`, speaker `"foe"`)
Same pattern as Worlds 6-10: three lines, `foe / me / foe`. The old rival opens with its own greeting ("Psst,
Gobzilla!", "Caw! Fuzzy!", "Colleague!"), tips the kaiju off about the champion waiting at Test Your Strength (the
**Jawbreaker Strongman**: name him), the kaiju is surprised or touched in its own way, and the rival signs off gruff
and fond. **New for Act 3: the rival now RUNS A STALL or WORKS THE KAIJU'S CORNER** (section 5 says which, built on
what it promised to bring to the feast). A painting of your kaiju and its rival at that stall fills the screen, so keep
the scene AT the stall: two characters, one stall, one tip. No fight with the nemesis, no third speaker.

### The Jawbreaker Strongman (champion, stage 5)
A huge jawbreaker in a leopard-print leotard with a curly moustache and a strength-test mallet. Old-time circus
strongman: talks about himself in the third person, flexes between sentences, has never once been cracked. Moves:
Mallet Smash, Ring the Bell, Sugar Shell, Flex! He has NO speaker code. He is described by the nemesis or
narrator-quoted, at most one line:
- `["n", "DING! Up at the bell, a voice booms: \"The Jawbreaker lifts! The Jawbreaker flexes! Nobody cracks the Jawbreaker!\""]`
- Nemesis: "He rings that bell with ONE finger!", "Layers, kid. He's got LAYERS.", "Hard outside, harder inside."

### Monsters, minibosses and Kings (one-line personalities)
Use these when a scene names a stage's boss-room foe, and (Writer A) for the taunts. None of them speaks in scenes
except through the narrator.

| Kind (taunt key) | Name | Personality in one line | Drop |
| --- | --- | --- | --- |
| `cadet` | Corn Dog Cadet | Toy-soldier corn dog in a paper hat. Marches, salutes, takes the ticket gate VERY seriously. "Hup, two, three, DIP!" | Paper Hat |
| `toffee` | Toffee Apple Bouncer | Shiny toffee apple pogo-hopping on its stick. A nightclub bouncer: "Not on the list!" | Toffee Shard |
| `floss` | Floss Wisp | Tiny giggly candy-floss cloud, Flosso's fan club. Swoops, squeaks, sticks to everything. | Floss Puff |
| `snowcone` | Snow Cone Slinger | Grumpy snow cone flicking syrupy ice balls. Cold shoulder, brain-freeze threats. | Syrup Drop |
| `bumper` | Bumper Cupcake | Cupcake in a bumper-car case. Road rage, no steering, honks, dizzy after hitting a wall. | Rubber Bumper |
| `churro` | Whack-a-Churro | Pops out of the ground like a whack-a-mole peg. Cheeky: "Missed me!" | Cinnamon Sugar |
| `coconut` | Coconut Shy Lobber | A coconut on a stand that throws the coconuts BACK. Fed up after years of being thrown at. Not shy at all. | Coconut Shell |
| `pretzel` | Ring Toss Pretzel | Twisty stallholder. Lines up a throw, then flings a ring. "Step up, try your luck!" Salty. | Lucky Ring |
| `jawbreaker` | Jawbreaker Strongman | See above. | Jawbreaker Chip |

| Stage | Boss-room foe | Personality in one line |
| --- | --- | --- |
| 11-1 | King Corn Dog Cadet | The cadets' parade marshal, twice the size, crown on his paper hat. "Atten-SHUN!", "Fall In!" |
| 11-2 | Pretzel Contortionist (miniboss) | A giant soft pretzel acrobat who ties itself in knots and shows off. Knot Whirl, Pretzel Lasso, Salty Slap. |
| 11-3 | Gumball Gunner (miniboss) | A walking gumball machine. Greedy for coins, goes "Ka-Chunk!", sprays gumballs. |
| 11-4 | King Bumper Cupcake | King of the dodgems. Honk!, Dodgem Dash, Spin Out. Thinks every crash is the other driver's fault. |
| 11-5 | Jawbreaker Strongman (champion) | See above. |
| 11-6 | Fry Basket Brawler (miniboss) | A deep-fryer stall on legs spitting hot oil, shouting "Order Up!" and calling Corn Dog Cadets. Hot-tempered short-order cook. |
| 11-7 | Carousel Macaron Pony (miniboss) | A carousel pony made of macarons, pole and all. Prissy, proud, gallops in circles. "Whinny!" |
| 11-8 | King Coconut Shy Lobber | The biggest coconut on the biggest stand. "Roll Up, Roll Up!" Coconut Mortar, Husk Guard. |
| 11-9 | Bonbon the Cannonball (miniboss) | A wrapped chocolate bonbon in a crash helmet, fired from a circus cannon. Daredevil stunt act, loves a drum roll. |
| 11-10 | The Great Flosso | See above. |

---

## 3. What to deliver PER KAIJU: 11 scenes

Line budget: **32 to 35 lines per kaiju, hard cap 36** (about 660 for the world). Measured: World 9 came to 669 lines
and World 10, the finale, to 721 (averages there: open 3.1, short scenes 2.6, elite 3.0, boss 4.0, after 7.6). World 11
is an opener, so the ending is shorter than World 10's. Every line 130 characters or fewer, in ALL beats.

**Paintings.** Every scene plays over a painting. Except at stage 5, the painting is shared by all 20 kaiju and your
kaiju is NOT in it: its portrait stands in front, filling the LEFT THIRD of the screen, and a cameo or rival portrait
stands on the right. So never write "look at me on the big wheel" as if the picture shows it, and never rely on a
detail of the painting other than the ones listed here.

### In `src/story/arcs/k<sp>.ts`, object `ARC` (add after `"w10-after"`)

| Beat id | Plays | Lines | Speakers | Painting | Must establish |
| --- | --- | --- | --- | --- | --- |
| `"w11-open"` | before 11-1 The Ticket Gate | 3-4 | `"n"` (first line), `"me"`, optional `"lo2"` or one cameo number | `still-w11-open`: arriving at the sunny fairground, nobody painted in | Line 1 is the narrator and starts **`Act 3: The Great Food Festival!`** followed by a few words of your own about this kaiju (as every `w6-open` did for Act 2). Then: the kaiju arrives with its golden envelope, picks up its thread from `w10-after`, states its FESTIVAL GOAL (section 5), and gets its first whiff that the games are not fair. May name the Corn Dog Cadets at the gate. |
| `"w11-boss"` | before 11-10 The Big Top | 4 (3-5) | `"boss"`, `"me"` only | `still-w11-boss`: Flosso in his big top with the prize wheel (he is painted in) | Flosso opens with patter and needles THIS kaiju's goal. The kaiju calls out the cheating it has seen. Flosso brags and names the **Wheel of Misfortune**. The kaiju answers with its catchphrase and its counter (section 5). Order: boss, me, boss, me. |
| `"w11-after"` | after 11-10 | 5-7 | `"boss"` first (1-2 lines), then `"me"`, optional one `"n"`, `"foe"`, `"lo2"` or cameo | `still-w11-cure` for the whole scene: tiny Flosso hopping out of the tent, a ribbon rosette lying in the spotlight | Flosso, tiny and squeaky, gives up the ribbon and leaves (ALL his lines first: after them he is gone, and nobody talks to him). The kaiju picks up its FIRST RIBBON and pays off this world's version of its goal. One light seed for World 12 (the Blue Ribbon Barn / Granny Crumble) from Flosso or the ribbon's tag. End on a big funny line in character. No "To be continued", no moral. It is only the first ribbon and the fair has barely started: do not wrap up the kaiju's whole Act 3 goal. |

### In the same file, object `NEMESIS` (the one holding `"w10-elite"`)

| Beat id | Plays | Lines | Speakers | Painting | Must establish |
| --- | --- | --- | --- | --- | --- |
| `"w11-elite"` | before 11-5 Test Your Strength | 3 | `"foe"`, `"me"`, `"foe"` | `still-<sp>-w11-elite`: your kaiju AND its rival at the rival's stall (both painted in, no portraits) | See "The friendly nemesis cameo" above. Names the Jawbreaker Strongman. |

**You must also add `| "w11-elite"` to the key list in the `NEMESIS` type on the line `export const NEMESIS:
Record<"w1-elite" | ... | "w10-elite", StoryLine[]>`, or `tsc` fails.**

### In `src/story/more/k<sp>.ts`, object `BEATS` (add after `"w10-s9"`, under the comment `// World 11: The Midway.`)

Seven short scenes, **1-3 lines each (aim for 2 or 3)**, 17-19 lines in all. Speakers: `"me"`, `"n"`, `"foe"`,
`"lo2"`, or a species number for a cameo. NOT `"boss"`, NOT `"lo"`, NOT `"mold"`. Each plays over a shared painting
`still-w11-s<n>` of that stage. Players can switch short scenes off ("key scenes only"), so nothing the main beats
need may happen ONLY in a short scene.

| Beat id | Before stage | Lines | Must establish |
| --- | --- | --- | --- |
| `"w11-s2"` | 11-2 Bunting Boulevard | 2-3 | First go at a stall, first proof it is rigged (kaiju's own flavour). Names the Pretzel Contortionist. |
| `"w11-s3"` | 11-3 Ring Toss Row | 2-3 | Names the Gumball Gunner. May mention a prize box that bites (the mimic) and Whack-a-Churros popping up. |
| `"w11-s4"` | 11-4 Bumper Car Bay | 3 | A Crumblet is lost in the crowd and must be walked to the exit. Bluebeary (`10`) hands it over, as in every world (his own story: section 5). Names King Bumper Cupcake or the Bumper Cupcakes. |
| `"w11-s6"` | 11-6 Helter-Skelter Heights | 2-3 | A Recipe Scroll high up, to be grabbed before time runs out. Names the Fry Basket Brawler. |
| `"w11-s7"` | 11-7 Hall of Mirrors | 2-3 | Funny mirrors (kaiju's own vanity or worry), the secret key chest on a hidden ledge, the Carousel Macaron Pony. |
| `"w11-s8"` | 11-8 The Coconut Shy | 3 | **Sir Stale's scene** (`"lo2"`, 1-2 lines). Monsters pour in and the kaiju has to hold out. Names King Coconut Shy Lobber. |
| `"w11-s9"` | 11-9 Big Wheel Climb | 2-3 | Flosso heckles THIS kaiju over the loudspeaker (narrator-quoted, one line). Names Bonbon the Cannonball. Sets up the big top. |

### QUIPS and TAUNTS
- **QUIPS: nothing to add.** `QUIPS` has eight fixed moments with three lines each and no per-world entries. Leave it.
- **TAUNTS: Writer A only** (section 7). Nine keys in `src/story/banter.ts`, three taunts each, 27 lines: `cadet`,
  `toffee`, `floss`, `snowcone`, `bumper`, `churro`, `coconut`, `pretzel`, `jawbreaker`. Minibosses, Kings, the
  champion and the boss have NO taunts (the test skips them). Nobody else opens `banter.ts`.

---

## 4. The ten stages (from `docs/stage-facts.md`, regenerated for World 11)

How every stage works, so you never contradict it: 2-3 small maps with ladders and platforms (stages 1-3 and 10 have
two). Monsters respawn. Each map's exit opens when you hand in the drops it wants. The last map is the BOSS ROOM, with
the boss-room foe ASLEEP inside until you arrive. World hazard everywhere: **Caramel Drip** (hot caramel drips from
toffee-apple dipping racks and leaves a sticky puddle).

Only five drops are ever WANTED by an exit in this world: Paper Hat, Toffee Shard, Floss Puff, Rubber Bumper and
Jawbreaker Chip. Syrup Drop, Cinnamon Sugar, Coconut Shell and Lucky Ring are real drops but no exit asks for them:
a kaiju may pocket one for a joke, never "need" one.

| Stage | Name | Boss-room foe | Drops wanted | Objective / feature | A scene MAY mention | A scene must NOT claim |
| --- | --- | --- | --- | --- | --- | --- |
| 11-1 | The Ticket Gate | King Corn Dog Cadet | Paper Hat, Floss Puff, Rubber Bumper, Toffee Shard | none (arrival, `w11-open`) | The gate, tickets, Corn Dog Cadets on parade, Toffee Apple Bouncers "on the door", Floss Wisps overhead | That a ticket is checked or needed to play. That the kaiju is turned away. |
| 11-2 | Bunting Boulevard | Pretzel Contortionist | Paper Hat, Toffee Shard, Floss Puff | none | Flags and stalls, a first rigged game seen in passing, Snow Cone Slingers and Bumper Cupcakes joining in, the Contortionist napping in a knot | Anything chasing the kaiju. A game the player has to win. |
| 11-3 | Ring Toss Row | Gumball Gunner | Paper Hat, Toffee Shard, Floss Puff | a Lunchbox Mimic in map 1 (looks like a loot box) | Ring toss stalls, a prize box that bites, Whack-a-Churros popping up underfoot, the Gunner going Ka-Chunk | Ring Toss Pretzels (they only arrive at stage 5). Lucky Rings being needed. |
| 11-4 | Bumper Car Bay | King Bumper Cupcake | Paper Hat, Toffee Shard, Floss Puff | ESCORT: a lost Crumblet follows you and must not get hurt too badly. It hides in the boss room. | The Crumblet lost in the crowd, holding hands, cupcakes that cannot steer, Coconut Shy Lobbers on their stands | A cage or a rescue. That the Crumblet fights. That anybody RIDES a bumper car. |
| 11-5 | Test Your Strength | Jawbreaker Strongman (champion) | Paper Hat, Toffee Shard, Rubber Bumper, Jawbreaker Chip | none (`w11-elite`) | The bell, the mallet, the Strongman, the rival's stall, Ring Toss Pretzels lining up throws | A fight with the nemesis. That hitting the bell is something the player does. |
| 11-6 | Helter-Skelter Heights | Fry Basket Brawler | Paper Hat, Toffee Shard, Jawbreaker Chip, Rubber Bumper, Floss Puff | RACE: grab the Recipe Scroll high up in map 2 within 140 seconds | The cone-shaped slide, a scroll way up high, a ticking clock, the Brawler's hot oil and "Order Up!" | A hold-out after the scroll (World 10 had one, this stage does not). Sliding as something the player does. Whose recipe it is (Granny Crumble's book is World 12's story). |
| 11-7 | Hall of Mirrors | Carousel Macaron Pony | Paper Hat, Toffee Shard, Floss Puff, Rubber Bumper, Jawbreaker Chip | a Lunchbox Mimic in map 1. SECRET: a bouncy sponge past the end of map 2 leads to a hidden ledge with a key chest (the World 11 Key) | Wobbly mirrors, a key chest up on a ledge, a bouncy sponge, a biting prize box, the Pony | Mirror copies that fight. A maze. Exactly where the sponge is. |
| 11-8 | The Coconut Shy | King Coconut Shy Lobber | Paper Hat, Rubber Bumper, Toffee Shard, Floss Puff, Jawbreaker Chip | HOLD OUT: monsters pour in for 45 seconds in map 2 | Coconuts thrown BACK, a crowd of monsters, holding out, Sir Stale "jousting" | Any number of seconds. That Sir Stale fights in the stage. Coconut Shells being needed. |
| 11-9 | Big Wheel Climb | Bonbon the Cannonball | Floss Puff, Toffee Shard, Paper Hat, Rubber Bumper, Jawbreaker Chip | a Lunchbox Mimic in map 1 | The giant doughnut wheel, climbing, Flosso on the loudspeaker, the big top in sight, Bonbon and his cannon | That the wheel turns or is ridden. That Flosso appears in person. |
| 11-10 | The Big Top | The Great Flosso | Floss Puff, Rubber Bumper, Toffee Shard, Paper Hat | world boss (`w11-boss`, `w11-after`) | The sawdust ring, spotlights, the prize wheel, the candy-floss machine, Floss Wisps, caramel dripping when he gets cross | A crowd in the stands (they are empty). Water as a way to beat him. Dame Fondant. |

**Never, in any scene:** rolling pins that chase you, levers, switches, arenas, cages, nests, locked doors, a "survive"
stage other than 11-8, a timer other than 11-6. Earlier worlds had some of these and their scenes had to be rewritten.
**Fair flavour is free:** stalls, rides, prizes, queues, candy, height signs and glued-down cans may be SEEN and joked
about in passing. Never promise the player will ride, play or win one. A monster may be named from the stage its drop
is first wanted or it first appears: Cadet, Bouncer, Wisp, Bumper Cupcake from 11-1. Slinger from 11-2. Churro from
11-3. Lobber from 11-4. Ring Toss Pretzel and Strongman from 11-5.
**Twists** (Swarm, Ambush, Night) are announced by a toast in the game. World 11 has none assigned in story. Do not
mention them, and it is AFTERNOON all world: no night, no fireworks going off.
**A skipped scene must still make sense:** every scene stands alone. No "as I said at the ring toss".
The bonus stage (Secret Prize Tent) has no scene.

---

## 5. The 20 kaiju: threads to carry on (checked against every `w10-after`)

"Stale's name" is what Sir Stale calls the kaiju, and what it calls him if it has a pet name. "Rival's stall" is the
`w11-elite` setting. Numbers are the EXACT next value: do not skip or repeat.

| # | Kaiju | Festival goal in World 11 | Gags and counters, with their exact state | Rival, voice tags, and the stage 5 stall | Stale's name | Pun seed | Don't |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | **Gobzilla Jr.** (he) | He is Gobzilla LARGE now (big brother said so, mouth full). Still too short for the big rides. New goal: Gobzilla EXTRA LARGE. | Boss stomp count goes ONE (W7) to FOUR (W10): Flosso is **"Stomp count: FIVE!"**. "Medium scared". "High is my worst direction". Big brother is talked about, never speaks. | **Brutus Beetroot**: "Psst, Gobzilla!", "Hmph!", beet and root puns, asked for a seat NOT next to the sprouts. Runs a beet juice stall. | "berry" / "ya crusty breadstick" | "one leaf short", "berry big deal" | No "stomp count back to zero" (he promised World 10 was the last time). Never "Medium" or "almost Large" again: Large is done. |
| 10 | **Bluebeary** ("Papa Bluebeary", he) | Six Crumblets loose at a fair (five plus the Littlest, who rides on his ear). Head counts, the lost-and-found tent, and no nap in sight. | Head counts must add up to SIX. The nap he was promised at the end of World 10 still has not happened. The Littlest gave its blankie to Old Fruitcake. "Hmph.", "Grrr." | **Crustwing**: "Caw!", calls him "Fuzzy", loves SHINY things, is the babysitter. Minds the lost-and-found tent, badly (the prizes are shiny). | "bear" / "breadstick" | "fair's fair", "bear with me" | He never gets the nap. Never cheerful out loud. On 11-4 the lost Crumblet is HIS OWN: no `10` cameo in his `w11-s4`. Do not recount the ten strays. |
| 11 | **Pizzaraptor** | A festival-size order, and that shiny delivery van is a RIVAL courier. The judges hand out stars and he wants five. | The Act 2 order was delivered at minute forty-five. NEW order, clock restarts: **"Minute one!"** in `w11-open`, climbing through the scenes, no higher than minute nine by `w11-after`. "Beep beep!", "Raptor Express", tips, receipts. | **Pineapple Pete**: "Raptor! Traffic alert!", times him, "Pineapple side, obviously!". Runs a traffic-and-pineapple-fritter stand. | "courier" | "fare's fair", "ride-through window" | Never show, name or describe who drives the van. Flosso gives NO stars: the stars joke stays open. |
| 4 | **Mothball** | Chasing the fair lights and the bulbs on the big wheel, waiting for the fireworks. Might be the moon. | "Ooooh, shiny...", "Is that the moon? Nope." The moon nightlight now lives with Old Fruitcake (Mr. Wraith gets it on Tuesdays). "Flap flap!" | **Zapsy the Bug Lamp**: "Bzzt!", "No zapping. Okay, ONE sparkle." Does the party lights on a stall. | "moth" | "light entertainment", "bulb-tastic" | It is a sunny afternoon: the fireworks do NOT go off and the moon is NOT found in this world. Avoid he/she (the files never say). |
| 1 | **Squidgeon** | Running tests on the gold ink of the invitation and proving the games are rigged. For SCIENCE. | "Lab notes, FINAL edition" was World 10 and the Mold Crown case is CLOSED: open a new book (e.g. "Lab notes, FINAL edition, volume two!"). "Note to self:", "EUREKA!", colander helmet. | **Professor Penicillin**: "Colleague!", "Free data:", a study update every world (cheese, then compost), promised a lightly mouldy cheese platter. Runs a cheese stall, "for SCIENCE". | "jelly" | "rig-orous testing", "peg-reviewed" | Nobody is sick: no cure, no antidote, no spores. The ink test stays inconclusive ("Result: FANCY!"): Squidgeon must not find out who sent the envelope. |
| 2 | **Crabbage** | Carrying Sweetheart, the prize cabbage, across the fair to enter her in the giant vegetable show, and yelling at the crowd to get off the grass. | "Seed count: twelve. Cabbage count: one." Walks SIDEWAYS. "Hmph! Kids these days." He let everybody ON his lawn "just this once". | **Sir Slurp** (a slug): "Slurrrp!", "gardeners stick together", grew a radish for the feast. Has a prize radish to enter and a radish stall. | "crab" / "crumb-bum" | "lettuce through", "no turnip for the books" | The vegetable show is in the Barn, World 12: Sweetheart is NOT weighed or judged here, and NOT stolen again. |
| 5 | **Toastbat** (he) | Retired after his "last job". Just LOOKING at the grand prize. Spots every con on the Midway because he knows how they are done. | "Heh.", heist talk, "ladies and gentle-crumbs", Grandma. The Golden Butter is safe: do not say where. | **Ricotta Rat**: "Squeak!", "Crossing guard Ricotta", "STOP!", he calls Ricotta "cheese-face". On crowd duty at the strength game. | "thief", "varlet" / "Sir Snitch-a-lot" | "con-fection", "the old switch-a-roll" | No new "last job of my career" unless the line is the joke ("I'm retired. This is a hobby."). He wins the ribbon FAIR, and it bothers him. He steals nothing. |
| 6 | **Dumplord** (the royal "We") | Thinks the golden envelope is a royal summons and expects a crown. Gets a ribbon. | Decrees: World 10 ended on Forty-Seven. **Next is "Decree Number Forty-Eight"**, then up one at a time in stage order, no higher than Fifty-Four in this world. "Hear ye, hear ye!". He dubbed Sir Stale "Sir Fresh", once. | **Duke Fortune Cookie**: "Bah!", "My fortune says:", writes his own fortunes, is called "Your Grace". Runs a fortune stall. | "dumpling", "little king" | "royal flush of ribbons", "crown-ing glory" | No skipped or repeated decree number, and always spelled out. Nobody follows the decrees. |
| 7 | **Norigon** (he) | Says he came to the very FIRST festival, 900 years ago. Runs a sushi stall with Gari. Proverbs about queues. | "Hrrm.", "Proverb:", "This is the way of the Roll! Hup hup!", soy sauce from 1611. He wrote gold-ink invitations himself in World 10: somebody has copied his ink. | **Gari the Ginger Serpent**: "Ssso, dragon!", "Sss-hehe!", "old friend". He calls Gari "pickled noodle". They share the sushi stall. | "old dragon" (age jokes) / "breadstick" | "queue the music", "wasabi with you" | Every proverb must go wrong or turn out to be about food or queues. No real wisdom. |
| 8 | **Chocomunch** | Wants a ribbon to frame next to the Chef note (framed in chocolate). It is sunny. "Me no like hot." | Always "Me ...", never "I". "Me scared AND me go!" His ice cube pal is **Cubey Three**: in this sun, a Cubey Four is fair game. | **Torchy Brûlée**: "Psst, golem!", "Ugh, FINE!", "Mwahaha! Ahem.", his "spoon buddy". Runs a crème brûlée stall and keeps the torch pointed away. | "varlet", "little sweet" | "ribbon in chocolate", "sun-dae driver" | He worries about melting and never actually melts. No oven. |
| 15 | **Hotchog** (he) | The Grill Champion has a real cook-off coming and is sizing up the competition. Meets the Corn Dog Cadets: "C-cousins?!" | Announcer voice: "Folks!", "In this corner!", "Ding ding!". **The stammer is gone**: one surprised "C-cousins?!" is the only stammer allowed in the whole world. | **Captain Kebab**: "Kid!", "Hrmph!", five trophies, judged the feast-off. Runs a kebab stall and coaches. | "sausage" / "pal" | "frank-ly", "top dog" | The cook-off is World 14: it does not happen here. The Fry Basket Brawler (11-6) is a rival fryer, not the cook-off. |
| 17 | **Pengwhip** | A holiday! The helter-skelter has no brakes either. Sends postcards home to the freezer. | "Long way home" ENDED at part seven, at home, in the ice-cube tray bed. New gag: postcards ("Dear freezer,"). "Wheee!", cannot brake, ice puns. | **Finn Freezepop**: "Birdie!", "Duh-dun, duh-dun!", freezer share, promised ice lollies. Runs an ice lolly cart. | "bird" | "slide show", "cone-gratulations" | No "Long way home, part..." ever again. Not homesick-sad: the freezer is fine and waiting. |
| 13 | **Avocadrake** | Entering "Freshest in Show", in full sun. Guac-and-chips stand with El Nacho. | The catchphrase is now **"Am I browning? Who cares!"** (he learned it from Old Fruitcake). Limes. "BEHOLD!", "Guac and roll!", "One scoop each, from the edge!". The voice squeak: at most once in the world. | **El Nacho**: "Psst, amigo!", "OHHH YEAH!", tag team. They share the guac-and-chips stand. | "dip" / "crusty" | "pit stop", "ripe for the ribbon" | No going back to full browning panic: judges may fuss about it, he mostly does not. He is a DRAGON. "Freshest in Show" is not judged in this world. |
| 19 | **Tacowl** | Wants the main-stage DJ slot. | Mixtape: World 10 ended on Track forty-eight. **Next is "Mixtape Track forty-nine"** (at most two new tracks in this world). "WHOOO's ready to party?!", Taco Tuesday, "Wise owl says:" lines that are about snacks. | **Señor Sting**: "Bzzzt!", "Pfft!", hot sauce "on the SIDE, amigo". Runs a hot sauce stall. | "owl", "feathered taco" | "spin the wheel, spin the decks", "nacho average fair" | The DJ slot is NOT won in World 11 (Flosso's big top is not the main stage). |
| 9 | **Bubblegumbo** (he) | Has forgotten where he put his ticket. Brittle is holding it. Thinks the gumball machines are cousins. | "Elephants never forget!" (he forgets everything, except Brittle's name, which he now gets right). He writes notes on his ears, trunk and tummy and has run out of room. *POP*. The Gumball Gunner (11-3) is a "cousin". | **Brittle** (a little mouse): "Squeak!", calls him "Gumbo", "Friends share! Hehehe!". Has the ticket and a pen. Runs a peanut brittle stall. | "pink beast" | "gum one, gum all", "stick around" | He does not find the ticket himself: Brittle produces it at stage 5. No mean jokes about his memory. |
| 18 | **Velvaroo** (she) | "Champ of the whole house" wants the festival belt too. Rocky Road is her corner man. | Act 2 record ended five and zero. **"Act 3 record: zero and zero"** at the open, **"one and zero"** in `w11-after`. "In THIS corner!", "Ding ding!", the cake knife is for feasts. Hotchog does her ring announcements. | **Rocky Road**: "Champ!", sprinkles, cold is his turf. Works her corner with a stool, a towel and a sprinkle shaker. | "marsupial" | "ribbon-weight champion", "the bell of the ball" | The title defence is World 13: no belt here. The Strongman is a warm-up, not a title fight. |
| 12 | **Sloba** (she) | This is her "once a year" rush. Looking for the quiet tea tent and napping in every queue. | "Heyyy... duuude...", *yaaawn*, "Been here since lunch", "No pressure, just tea-sure", MEGA SNOOZE. She said "Never again. Okay, once a year": this is the once. | **Jitters**: "SLOTH!", zips, "Hurry! I mean, no rush! I mean, GO!", promised decaf. Runs a decaf stall, at top speed. | "sloth" | "queue-t nap", "steep right up" | Never in a hurry, almost no exclamation marks. She never gets a full nap in this world. |
| 16 | **Minturtle** | Hunting for shade and the snow-cone stand. Sundae stall with Hot Fudge Hare on sauce duty. | "Stay frosty.", "Cool, cool, cool.", Waffle Wall, "Up high! With my foot!". **Drip count** was zero indoors: in the sun it starts again at **"Drip count: one"** and stays in single figures all world. | **Hot Fudge Hare**: "Slowpoke!", keeps saying "slowly" by accident ("Ugh, I said it AGAIN!"). On sauce duty at their sundae stall. | "frosty knave" | "shade-y business", "cone of silence" | The oven knob story is over. He only ever panics about melting. Snow Cone Slingers are not friends. |
| 3 | **Bloblin** | Got a real invitation in the post for the first time EVER. Has framed it, and is cheering for everybody, rivals included. | "Wibble wobble!", "Gimme an F!" cheers that go wrong, name flags and a crayon, *jiggle jiggle*. Bloblin offered Sir Stale a name flag in World 10 ("Okay, after!"): **hand it over in `w11-s8`**. | **Grey Gelato**: "Wobbles", "darling", snooty and chic, "SO last Christmas". Runs a gelato cart. | "wobbly knave" | "jelly good show", "set for the win" | Bloblin never boos anybody, not even Flosso. Gelato says "darling" once at most (a later villain owns that word). |
| 14 | **Salmonster** | Wants to win every midway game the HARD way (backwards, blindfolded, uphill), then take both teams to dinner. | "Bro", "Let's GOOO!", upstream, backwards, tail first, fish puns. On the Chef's list as FRIEND, not dinner. Team dinner is the promise. | **Grizzly Grizzle**: "Here, fishy fishy! KIDDING!", brought veggie buns. Runs a veggie burger grill. | "fish", "fishy" | "reel deal", "o-fish-al rules" | Doing it the hard way is what beats the rigging: never say so out loud. The team dinner is promised, not held. |

**Cameos between kaiju** (a species number as speaker) are welcome in short scenes, one per scene, two lines at most.
Write the guest from its row above and its voice sheet in `docs/VOICE.md`, and from where it is at the fair. The
standing one: Bluebeary (`10`) in `w11-s4`, who opens with "Hmph." and his name for your kaiju (copy it from your
`w10-s4`).

---

## 6. Rules of the house

**Voice (`docs/VOICE.md`, read all of it):**
- Full spoken cartoon sentences that an actor could shout. Characters react, interrupt, brag, panic and cheer.
- Interjections and sound effects: "Whoa!", "Yikes!", "Aw, nuts!", STOMP!, FWOOSH!, KA-BLAM!, *gulp*.
- Catchphrases and running gags come back with a twist. Never explain them.
- Ham up the pun. Deliver it with gusto or let somebody groan at it.
- No em dashes and no semicolons, anywhere. Use "!" or a new line. At most ONE "..." per scene.
- No staccato three-fragment rhythm. No "Not X. Y." and no "It's not X, it's Y.". No tidy lists of three.
- No dry narrator punchlines ("It did not."). The narrator is a cartoon announcer: at most one line in a scene, and
  not in most scenes ("Meanwhile...", "Uh-oh!", "Step right up!").
- No characters explaining their feelings or the moral. In Act 3 that means: nobody says "winning isn't everything"
  or "the real prize was...". Show it with a joke or an action.
- Banned words: indeed, truly, simply, quietly, perhaps, merely, whilst, journey, embrace, testament, resolve.
- Do not start several lines in a row with the kaiju's name or with "I".
- Do not open a line with the stage's name and a full stop ("Ring Toss Row. Rings everywhere.").
- **No long line may repeat.** A test fails if a kaiju says any line of 30 characters or more twice, across ALL its
  worlds. World 11 lines must be new: do not paste an old line and change the place name.

**Mechanics:**
- Scenes never explain controls, buttons, elements, weaknesses or how to beat anything.
- Name only real foes, drops and stage names, spelled exactly as in sections 2 and 4.
- Each kaiju sounds like itself and nobody else. If you can swap the speaker and the line still works, rewrite it.
- Do not redesign, rename, re-gender or change anybody. Bluebeary is "Papa Bluebeary" (he). Sloba and Velvaroo are she.
- Portrait moods are read from words (`src/story/mood.ts`): "Whoa", "Wait", "?!" look shocked. "sorry", "lost",
  "scared", "ugh", "ow" look sad. "Hmph", "smash", "stop", "outta" look angry. "Hah", "yay", "love", "ready", "fun", a
  final "!" look happy. Check your funniest line does not land on the sad face by accident.
- Flosso is `"boss"` in `w11-boss` and `w11-after` only. Sir Stale is `"lo2"`. Do not use `"lo"` or `"mold"`.
- Add to existing files only. Do not touch another writer's kaiju, any test, `stories.ts`, or (unless you are Writer A)
  `banter.ts`. No commits.

---

## 7. Who writes what, and how to hand in

| Writer | Kaiju (species id: files `arcs/k<id>.ts` and `more/k<id>.ts`) | Also owns |
| --- | --- | --- |
| **A** (lead) | Gobzilla Jr. (0), Bluebeary (10), Pizzaraptor (11), Mothball (4) | Places and may polish the Gobzilla example in section 8. **All 27 TAUNTS in `src/story/banter.ts`** (nobody else edits that file). These four arc files are laid out one line per row, the other sixteen one beat per row: keep each file's own layout. |
| **B** | Squidgeon (1), Crabbage (2), Toastbat (5), Dumplord (6) | |
| **C** | Norigon (7), Chocomunch (8), Hotchog (15), Pengwhip (17) | |
| **D** | Avocadrake (13), Tacowl (19), Bubblegumbo (9), Velvaroo (18) | |
| **E** | Sloba (12), Minturtle (16), Bloblin (3), Salmonster (14) | |

The groups are balanced: each writer's four kaiju hold 111 to 116 thousand characters of existing story to read.
`src/story/stories.ts` needs NO change for World 11 (no new speaker code). Nobody edits it.

**Taunts (Writer A).** Add one block under a comment `// World 11: The Midway` with ALL nine keys in a single edit
(the moment one key exists, the test demands all nine). Three taunts each, about 60 characters at most, a food pun in
each, in the personalities of section 2. Example: `bumper: ["Honk honk! Out of my LANE!", ...]`.

**Before handing in, every writer runs:**
```
npx tsc --noEmit
npx vitest run tests/voice.test.ts tests/banter.test.ts tests/mood.test.ts
npx vitest run tests/world.test.ts -t "full story"
```

**Why these will be red until everybody is done, and what to do meanwhile.** Two tests let World 11 off ONLY while it
is completely empty: `tests/world.test.ts` ("every kaiju has a full story") excuses a world while NO kaiju has any
`w11-` beat, and `tests/banter.test.ts` ("every normal monster has a taunt") excuses the nine monsters while NONE has a
taunt. The moment the first beat lands, all 20 kaiju need `w11-open`, `-elite`, `-boss` and `-after`. So a failure that
names somebody else's kaiju is expected. A failure that names YOUR kaiju is yours.

Also know that NO shared test checks World 11's short scenes yet (the loop in `tests/banter.test.ts` stops at World
10), so check them yourself. Make a temporary test with a unique name, `tests/tmp-w11-<your letter>.test.ts`, run it
with `npx vitest run tests/tmp-w11-<your letter>.test.ts`, and DELETE it before you hand in:

```ts
import { expect, it } from 'vitest';
import { STORIES } from '../src/story/stories';
import { STAGES } from '../src/sim/stages';
const MINE = [0, 10, 11, 4]; // your four species ids
const KEY = ['open', 'elite', 'boss', 'after'], SHORT = [2, 3, 4, 6, 7, 8, 9].map(n => `s${n}`);
it('my World 11 scenes follow the brief', () => {
  const bad: string[] = [], names = [...new Set(STAGES.map(s => s.name))];
  for (const sp of MINE) {
    const beats = STORIES[sp].beats, seen = new Set<string>(); let total = 0;
    for (const [b, lines] of Object.entries(beats)) for (const [, t] of lines) {
      if (t.length >= 30 && seen.has(t)) bad.push(`${sp} ${b} repeats: ${t}`); seen.add(t);
    }
    for (const k of [...KEY, ...SHORT]) {
      const id = `w11-${k}`, lines = beats[id];
      if (!lines?.length) { bad.push(`${sp} ${id} missing`); continue; }
      total += lines.length;
      const short = SHORT.includes(k), ok = short ? ['me', 'n', 'foe', 'lo2'] : ['me', 'n', 'foe', 'lo2', 'boss'];
      if (short && lines.length > 3) bad.push(`${sp} ${id}: more than 3 lines`);
      if (lines.reduce((a, [, t]) => a + (t.match(/\.\.\./g)?.length ?? 0), 0) > 1) bad.push(`${sp} ${id}: more than one "..."`);
      for (const [who, t] of lines) {
        if (typeof who !== 'number' && !ok.includes(who)) bad.push(`${sp} ${id}: speaker ${who}`);
        if (who === 'boss' && !['boss', 'after'].includes(k)) bad.push(`${sp} ${id}: Flosso speaks too early`);
        if (t.length > 130) bad.push(`${sp} ${id}: ${t.length} chars: ${t}`);
        if (/[—;]/.test(t) || /\b(indeed|truly|simply|quietly|perhaps|merely|whilst|journey|embrace|testament|resolve)\b/i.test(t)) bad.push(`${sp} ${id}: ${t}`);
        if (names.some(n => t.startsWith(`${n}.`))) bad.push(`${sp} ${id}: signpost: ${t}`);
      }
    }
    if (!beats['w11-open']?.[0]?.[1].startsWith('Act 3: The Great Food Festival!')) bad.push(`${sp}: w11-open must open with the Act 3 narrator line`);
    if (!beats['w11-s8']?.some(([who]) => who === 'lo2')) bad.push(`${sp}: Sir Stale is missing from w11-s8`);
    if (total > 36) bad.push(`${sp}: ${total} lines, cap is 36`);
  }
  expect(bad).toEqual([]);
});
```

**Flags for an engineer (not for writers to fix):**
1. **Paintings block the art test.** `tests/world.test.ts` ("every item, monster, consumable, stage background and rig has its art") asks for every painting a story can
   show. Only `still-w11-open`, `-boss` and `-cure` exist. The first short scene and the first stage 5 scene to land
   will make that test fail until `still-w11-s2, s3, s4, s6, s7, s8, s9` (7) and `still-<sp>-w11-elite` (20) are in
   `public/art/manifest.json`. The game itself is fine without them (it falls back to portraits).
2. **Short scenes are untested for World 11.** Add `11` to the world list in `tests/banter.test.ts` line 14 once all
   writers are done.
3. **`"lo"` still looks like a villain.** Old Fruitcake's portrait is a dark silhouette with glowing eyes and both
   Leftover speakers get the purple villain text box. This brief keeps `"lo"` out of World 11. He needs his real
   portrait (`boss-fruitcake`) before his World 15 spotlight. Sir Stale (`"lo2"`) already shows his real art, in the
   purple box.
4. **No post-boss tease exists.** The outline counts "one shared villain tease", but `beatAfter('11-10')` plays only
   `w11-after`. This brief puts the seed inside each `w11-after`. If a shared `w11-hook` is wanted, it needs a `HOOK3`
   in `finale.ts`, a line in `beatAfter` and a painting. Suggested text, inside the limits of section 1:
   `["n", "Meanwhile, at the very top of the hill, in the biggest tent of all..."]`,
   `["n", "A teeny pink wisp squeaks: \"They beat the wheel, Showstopper! ALL my games!\""]`,
   `["n", "A grand voice sighs from the dark: \"Then send them to the Barn. Granny Crumble does things by the BOOK.\""]`.
5. The Act 2 credits list every world with an id above 5, so World 11 shows up in them (already noted in the outline).

---

## 8. One complete example: Gobzilla Jr. (species 0), all 11 scenes

This is the quality bar and the exact data format. Writer A places it (and may polish it). Everybody else: match the
length, the rhythm and the way each scene names real things from section 4, then sound like YOUR kaiju instead.
His thread: he is Large, he is one leaf too short for the rides, and the rosette on his head fixes that.

`src/story/arcs/k0.ts`, inside `ARC`, after `"w10-after"`:

```ts
  "w11-open": [
    ["n", "Act 3: The Great Food Festival! One golden envelope later, on a sunny hill covered in striped tents..."],
    ["me", "WHOA! A doughnut as big as the SKY, and it's a RIDE! Gobzilla LARGE is going on EVERYTHING! RAWR!"],
    ["me", "Hey, a sign! \"You must be THIS tall to ride.\" Aw, nuts! I'm one leaf too short! And big brother's already up there WAVING!"],
    ["me", "Fine! I'll win so many prizes they'll HAVE to call me Gobzilla EXTRA LARGE! Outta my way, corn dogs!"],
  ],
  "w11-boss": [
    ["boss", "Laaadies and gentle-snacks! Step right up to THE GREAT FLOSSO'S big top, where everybody's a winner! Mostly ME!"],
    ["me", "You're the cheater! Fat pegs! Glued cans! And I SAW that height sign scoot up when I walked over!"],
    ["boss", "Showmanship, my boy! Now watch the Wheel of Misfortune! It only ever lands on BAD luck! Abracadabra-cadabra!"],
    ["me", "Then I'm un-rigging it with my FEET! Stomp count: FIVE! RAWR!"],
  ],
  "w11-after": [
    ["boss", "Eep! My fluff! I'm all cone! Take your silly ribbon, then! First prize, Midway games. Hmph!"],
    ["boss", "But the Showstopper's gonna hear about THIS! And wait till Granny Crumble gets you in the Blue Ribbon Barn! Toodle-oo!"],
    ["n", "Hop, hop, hop! One teeny wisp of candy floss bounces out of the big top, squeaking all the way!"],
    ["me", "A RIBBON! My first one EVER! Big brother, look, look, LOOK! I'm pinning it right on top of my leaves!"],
    ["lo2", "Huzzah, berry! Thou hast won the favour of the tourney! 'Twas a tourney, yes?"],
    ["me", "Hey! With the ribbon on top, I'm as tall as the SIGN! Gobzilla EXTRA LARGE! Almost!"],
    ["me", "Everybody gets a turn wearing it! AFTER my ride. To the doughnut wheel, big brother! RAWR!"],
  ],
```

Same file, in `NEMESIS` (and add `| "w11-elite"` to its type):

```ts
  "w11-elite": [
    ["foe", "Psst, Gobzilla! Beet juice, two tickets! Kidding, yours is free. Jawbreaker Strongman up ahead. Rings that bell with ONE finger!"],
    ["me", "Brutus! You've got your own STALL?! And I can't even lift the mallet. I'm too short for this whole fair!"],
    ["foe", "So was I, till I grew roots! Go crack him, okay? I saved ya a stool. NOT next to the sprouts. Hmph!"],
  ],
```

`src/story/more/k0.ts`, inside `BEATS`, after `"w10-s9"`:

```ts

  // World 11: The Midway.
  "w11-s2": [["me", "Flags! Stalls! Knock down the cans and win a prize! One ball, please! Hup! ...Hey! These cans are GLUED down!"], ["n", "Step right up! At the end of the boulevard, a Pretzel Contortionist ties itself in a knot and snores!"], ["me", "A cheater's fair AND a bendy pretzel? I'm gonna stomp that knot out STRAIGHT! RAWR!"]],
  "w11-s3": [["me", "Ring toss! Big brother wins a goldfish EVERY time. My ring just bounced off! That peg's way too fat!"], ["me", "And the prize box at the front BURPED at me. Bad lunchbox! Gumball Gunner, you're next! Ka-STOMP!"]],
  "w11-s4": [[10, "Hmph. Strawberry. Head count says five. One of mine chased a balloon into Bumper Car Bay."], ["me", "Gobzilla Large, babysitter class, FESTIVAL edition! Hold my leaf, little guy. Those Bumper Cupcakes can't steer!"], [10, "Large. I said it at home and I'll say it here. Now walk."]],
  "w11-s6": [["me", "A slide shaped like an ice-cream cone! And a Recipe Scroll way up near the pointy bit! Race ya, clock!"], ["me", "High's STILL my worst direction, but Large kaiju climb fast! Then the Fry Basket Brawler gets stomped extra crispy!"]],
  "w11-s7": [["me", "Whoa! In THIS mirror I'm taller than big brother! In that one I'm a pancake. I like the first one better."], ["me", "Tall Mirror Me says there's a key chest up on a ledge! Boing! And a pony made of MACARONS? Giddy-up! RAWR!"]],
  "w11-s8": [["lo2", "Have at thee, coconut! Forsooth, berry, 'tis the finest jousting tournament in all the land!"], ["me", "It's a coconut shy, ya big baguette! The coconuts throw BACK, and their King's the worst one! Here comes a whole crowd!"], ["lo2", "Then we hold the field together! Team Leftovers, CHAAARGE! Which way is the field?"]],
  "w11-s9": [["me", "The doughnut wheel! No sign, no line, no problem! I'm climbing it my OWN way! Hup! Hup!"], ["n", "The loudspeaker crackles: \"Step right up, tiny berry! Nobody beats the Great Flosso's games! Abracadabra-cadabra!\""], ["me", "TINY?! I'm LARGE, mister! Wait, is that a bonbon in a crash helmet? In a CANNON?! Medium scared! Still climbing!"]],
```

Count: 4 + 4 + 7 + 3 + (3 + 2 + 3 + 2 + 2 + 3 + 3) = 36 lines, right on the cap. Trim `w11-after` to six if a
polish adds a line elsewhere.

Why it works, scene by scene:
- **Open:** narrator line as required, one goal (the rides), one obstacle (the sign), the new title (EXTRA LARGE), the
  cadets named. No reset of the stomp count.
- **Short scenes:** each one names its stage's boss-room foe and its objective in a breath (the Crumblet, the scroll
  and the clock, the key chest, the crowd), with no seconds, no controls and nothing the stage does not have. The
  rigging shows up as things he SEES (glued cans, fat pegs, the sign that scoots).
- **Stage 5:** three lines, at Brutus's stall, the Strongman named, the "sprouts" callback from World 10.
- **Sir Stale:** `w11-s8` plus one more beat (`w11-after`), three `"lo2"` lines, still sure it is a joust.
- **Boss:** boss, me, boss, me. Flosso needles the height. The wheel is named, not explained. "Stomp count: FIVE!"
- **After:** Flosso's lines first, then he is gone. The rosette from the painting becomes the punchline (it makes him
  tall enough). "The Showstopper", "Granny Crumble" and "the Blue Ribbon Barn" and nothing more. The act's question is
  one throwaway joke about taking turns.
