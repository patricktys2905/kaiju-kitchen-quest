# Act 3 outline: The Great Food Festival

**APPROVED 2026-11-13** by the Creative Director, with these decisions:
1. **Villain:** Dame Fondant, the Showstopper. Monsieur Zest and Mr. Sample are two of her judges.
2. **Act length:** five worlds, 11-15, levels 111-160. Dame Fondant is the World 15 finale.
3. **World 11 size:** full (about 80 images, 220 scenes). No tier 6 gear.
4. **Nemeses:** friendly stage 5 cameos, plus one friendly exhibition bout in World 13 (a small rule change, built with
   World 13, nothing in World 11).

Outline only: nothing here is built yet. We build World 11 only this round.
Checked against the code and story files on 2026-11-13 (`stages.ts`, `mobs.ts`, `finale.ts`, all 20 `arcs/k*.ts` endings).

## 1. Act 3 in five lines

1. **Premise.** The golden envelope from the end of Act 2 takes all 20 kaiju, their old rivals and the Leftovers out of
   the house for the first time, to a giant fair on a hill where every food in the land competes for the top ribbon.
2. **Tone.** Same cartoon, same voices, same puns (`docs/VOICE.md`). Bright, loud and sunny after the cold, gloomy
   Feast of the Forgotten: carnival barkers, rigged games, snooty judges, ribbons and jingles.
3. **The central question.** Act 2 ended with "everybody gets a seat". The festival says "only one dish gets the
   ribbon". So: **does a feast need a winner?**
4. **How it differs.** Act 1 monsters were sick and got cured. Act 2 villains were bitter and got invited. Act 3 foes
   are neither: they are rival contestants, showmen and judges, and the contests are rigged. The kaiju are visitors and
   underdogs for the first time, and last act's villains are now on their team.
5. **Shape.** Five worlds. Each is one part of the festival and ends with a ribbon won from the showman or judge who
   runs it. The last world is the final judging, where the kaiju have to decide what to do with a prize that only one of them can hold.

## 2. The villain (decided: option A)

| | Who | Why fun to fight and hear | Link to the invitation |
| --- | --- | --- | --- |
| **A (chosen)** | **Dame Fondant, the Showstopper**: a towering five-tier show cake, festival champion 99 years running. She has never been cut, because she is "too perfect to eat". | A diva: "Darling!", "Flawless!", gasps at a single crumb out of place. Her tiers come apart as the fight goes on. She is the mirror of Old Fruitcake: nobody cuts him because nobody wanted him, nobody cuts her because nobody dares. | Word got out about a feast where a FRUITCAKE got the best seat. She sent the golden envelopes herself, to beat that feast in public, in contests she has rigged. |
| B | **Monsieur Zest, the critic**: a sour lemon with a notebook who gives everything ONE star. | Scathing mini-reviews mid-fight ("Derivative! Undercooked! ONE STAR!"). His stickers turn contestants sour. Pizzaraptor lives for five-star reviews. | He invited the "feast everyone is talking about" in order to review it and shut it down. |
| C | **Mr. Sample, the display model**: a shiny plastic shop-window burger who never goes off and has never been tasted. | Salesman patter, squeaky plastic, "Not for consumption!". Wants to swap real food for perfect fakes that last forever. | He invited the kaiju to take moulds of them for his display. |

**Decided: A.** She gives the act its question, a finale that needs Old Fruitcake without changing him (he is the one
guest who knows how she feels), and a boss whose look drives her fight. B and C sit on her judges' table: Mr. Sample
judges LOOKS (World 13) and Monsieur Zest judges TASTE (World 14). A third, new judge, **Granny Crumble**, judges
TRADITION (World 12, see section 3). The Great Flosso (World 11) is not a judge: he is her showman, who runs the games.

**The Leftovers** stay reformed, with the same personalities. They come along as fellow contestants ("Team Leftovers",
the entries nobody expects to win), heckle and cheer from the sidelines, and none of them turns bad again. Five
Leftovers, five worlds, one spotlight each:

| World | Leftover | Why here |
| --- | --- | --- |
| 11 The Midway | Sir Stale | Thinks the fair is a jousting tournament. "Have at thee, coconut!" |
| 12 The Blue Ribbon Barn | The Mystery Meatloaf | The judge wants every entry made by the book. Nobody knows what is in him. |
| 13 The Night Market | The Tupperwraith | A ghostly old tub among shiny plastic display food. "Cousins?" |
| 14 Cook-Off Row | Baron Brussels | Back at a grill, and cooking for a critic who hates sprouts. |
| 15 The Showstopper Tent | Old Fruitcake | The cake nobody cut meets the cake nobody dares to cut. |

Speakers `lo` (Old Fruitcake) and `lo2` (Sir Stale) already exist. The other three are narrator-quoted, as in World 10.

**The old nemeses** stay friends. As in Worlds 6-10, each turns up in its kaiju's stage 5 scene (`w<N>-elite`), now
running a stall or working the kaiju's corner (most promised in their `w10-elite` lines to bring something to the feast:
hot sauce, decaf, sprinkles, ice lollies, veggie buns). No nemesis fights in World 11. World 13 has one friendly
exhibition bout (decision 4).

## 3. Act shape: five worlds (decided)

Levels carry on from 110, ten per world, as before (`MAX_LEVEL` in `stats.ts` goes up by 10 with each world shipped).
The festival runs over two days: afternoon (11), the barn (12), night (13), the next morning's cook-off (14), the
final judging (15).

| # | World | Hook | Boss | Levels | New to play (all reuse existing systems unless flagged) |
| --- | --- | --- | --- | --- | --- |
| 11 | **The Midway** (fairground games and rides) | "Step right up!" Every game is rigged and the kaiju are the new kids. | **The Great Flosso**, candy-floss showman | 111-120 | Caramel-drip hazard (the `wax` mechanic, new look). A boss whose prize wheel shows his next big move. First world built with weak-to / resists types (provisional, see section 4). |
| 12 | **The Blue Ribbon Barn** (home baking, jams and the giant vegetable show: hay bales, gingham, shelves of jars, weighing scales) | Every entry must match the recipe book to the letter, and the scales are fixed. Crabbage's cabbage and the Meatloaf are both in trouble. | **Granny Crumble**, judge of Tradition (new): a prize apple crumble in a gingham bonnet with a wooden spoon. Sweet old lady voice, ruthless: "That's not how MY recipe goes, dearie. DISQUALIFIED!" | 121-130 | Falling-jar hazard (`drop` mechanic, new look). The stage 6 Recipe Scroll race gets the story spotlight: it is HER recipe book. Bombers return. |
| 13 | **The Night Market** (lanterns, display stalls, the Champions' Ring) | Velvaroo defends her title. Nothing on the stalls is real. | **Mr. Sample**, judge of Looks | 131-140 | The whole world uses the existing Night twist. Stage 5 is a friendly exhibition bout with your old nemesis (existing nemesis fight, today limited to Worlds 1-5: **small rule change, approved in principle, built with World 13**). |
| 14 | **Cook-Off Row** (open-air grills, woks and stalls) | The cook-off Hotchog has been promising: the semi-final. Baron Brussels enters too. | **Monsieur Zest**, judge of Taste | 141-150 | "One-star" monsters: a few ordinary monsters carry an elite modifier on Normal (`ELITE_MODS`, today used on Hard). Steam hazard (`vent` mechanic). |
| 15 | **The Showstopper Tent** (the final judging) | One ribbon, twenty kaiju, five Leftovers. | **Dame Fondant** | 151-160 | Her armour breaks knock off a tier that fights on as a summon (`BOSS_ARMOR` + `summon`). The boss room uses the hazards of Worlds 11-14, like Old Fruitcake used every lieutenant's trick. |

**Where it ends.** Dame Fondant loses, and somebody finally cuts her a slice. The ribbon gets shared out, in each
kaiju's own way. **Left open:** who drives the shiny delivery van (never seen); the judges' table now has three empty
chairs, so who judges next year; and the festival packing up to go on tour, with a seat saved for the kaiju.

## 4. World 11 in detail: The Midway

**Blurb:** "Step right up! Everybody's a winner. Mostly." **Who can enter:** any kaiju that has cleared 10-10 (the same
rule as every earlier world). No new kaiju unlocks: `UNLOCKS` already recruits all 16 non-starters by World 9.

### Look (for the art director)
The opposite of World 10's cold blue gloom: warm afternoon sun, candy pink, teal and cream stripes, seen from a food
kaiju's height. Rules from the pipeline: prompts must not name places or characters, and signs must have no lettering.

| Image | Key (suggested) | Description |
| --- | --- | --- |
| Far backdrop | `bg-far-midway` | A fairground on a green hill: striped tents, bunting, a big wheel built like a giant doughnut, a helter-skelter shaped like an ice-cream cone, balloons, soft summer sky. No characters. |
| Mid layer | `bg-mid-midway` | A row of game stalls and snack carts with striped awnings, lollipop lamp posts, strings of bulbs. |
| Ground tile | `tile-midway` | Trampled grass with wooden boardwalk planks and scattered confetti. |
| Boss room | `bg-far-bigtop` | Inside a huge striped tent: a sawdust ring, spotlights, a big prize wheel with picture symbols, a giant candy-floss machine in the middle, empty stands. |
| World-map page | `map-midway` | A hand-drawn paper fair map: a winding path of ten stops from a ticket gate at the bottom up to the big tent at the top. |

### Ordinary monsters (9, all new; brains are existing ones from `mobs.ts`)
The last column uses the four monster types of `docs/WEAKNESS-DESIGN.md`: Melty (weak HOT, resists COLD), Fiery (weak
COLD, resists HOT), Crusty (weak CRUNCH, resists STICKY), Slippery (weak STICKY, resists CRUNCH). **Provisional:** that
system is still waiting for final approval of three details, so these types may change with it.

| From stage | Monster | Look | Brain | Drop item | Weak to / resists |
| --- | --- | --- | --- | --- | --- |
| 1 | Corn Dog Cadet | A corn dog on a stick marching like a toy soldier in a paper hat | walker | Paper Hat | Fiery (fresh from the fryer): weak COLD, resists HOT |
| 1 | Toffee Apple Bouncer | A shiny toffee apple pogo-hopping on its own stick | hopper | Toffee Shard | Fiery (dipped in hot caramel): weak COLD, resists HOT |
| 1 | Floss Wisp | A small pink candy-floss cloud on a paper cone that drifts and swoops | flyer | Floss Puff | Melty (spun sugar): weak HOT, resists COLD |
| 2 | Snow Cone Slinger | A grumpy snow cone flicking syrupy ice balls | ranged | Syrup Drop | Melty (ice): weak HOT, resists COLD |
| 2 | Bumper Cupcake | A cupcake whose paper case is a bumper car. Rushes, and is dazed when it hits a wall | charger | Rubber Bumper | Slippery (charger): weak STICKY, resists CRUNCH |
| 3 | Whack-a-Churro | A churro that pops up out of the ground like a whack-a-mole peg | burrower | Cinnamon Sugar | Fiery (hot and greasy): weak COLD, resists HOT |
| 4 | Coconut Shy Lobber | A coconut on a stand that throws the coconuts BACK | turret | Coconut Shell | Crusty (shell): weak CRUNCH, resists STICKY |
| 5 | Ring Toss Pretzel | A pretzel stallholder who lines up a throw, then flings a ring | sniper | Lucky Ring | Fiery (served hot): weak COLD, resists HOT |
| 7 | Jawbreaker Strongman | A huge jawbreaker in a leopard-print leotard with a curly moustache and a strength-test mallet. Armoured, carries a shield | brute | Jawbreaker Chip | Crusty (armour): weak CRUNCH, resists STICKY |

Spread (weak to): COLD 4, HOT 2, CRUNCH 2, STICKY 1. The world leans COLD (fried and hot fair food) and has all four.
With World 11 the ordinary-monster totals become HOT 23, COLD 22, CRUNCH 23, STICKY 21, so COLD, the rarest today,
catches up. Loot-box mimic: reuse the Lunchbox Mimic (`mimic`, Crusty), no new art.

### Boss-room foes (order follows `ROOM_FOES`: King, mini, mini, King, champion, mini, mini, King, mini)

| Stage | Foe | Notes (moves named from the existing nemesis move list) | Weak to (provisional) |
| --- | --- | --- | --- |
| 11-1 | **King Corn Dog Cadet** | Crowned monster. `slash`, `charge`, `summon` (Corn Dog Cadets), `roar` | COLD (inherits) |
| 11-2 | **Pretzel Contortionist** (miniboss) | A giant soft pretzel acrobat that ties itself in knots. `spin`, `leap`, `yank`, `slash` | STICKY (bendy, Slippery) |
| 11-3 | **Gumball Gunner** (miniboss) | A walking gumball machine. `fanshot`, `lob`, `rain`, `roar` | CRUNCH (glass globe, Crusty) |
| 11-4 | **King Bumper Cupcake** | Crowned monster. `charge`, `boomhop`, `spin`, `roar` | STICKY (inherits) |
| 11-5 | **Jawbreaker Strongman** (champion) | The world's champion: the brute as a named foe, as in every world | CRUNCH (inherits) |
| 11-6 | **Fry Basket Brawler** (miniboss) | A deep-fryer stall on legs spitting hot oil. `heatwave`, `puddle`, `lob`, `summon` (Corn Dog Cadets, same type) | COLD (Fiery) |
| 11-7 | **Carousel Macaron Pony** (miniboss) | A carousel pony built of macarons, pole and all. `charge`, `boomhop`, `leap`, `roar` | STICKY (charger, Slippery) |
| 11-8 | **King Coconut Shy Lobber** | Crowned monster. `lob`, `rain`, `shell`, `roar` | CRUNCH (inherits) |
| 11-9 | **Bonbon the Cannonball** (miniboss) | A wrapped chocolate bonbon in a crash helmet, fired from a circus cannon. `dive`, `leap`, `charge`, `trap` | HOT (chocolate, Melty) |

Room foes weak to: COLD 2, STICKY 3, CRUNCH 3, HOT 1. Every foe that summons calls monsters of its own type, as the
weakness rules ask (which is why King Coconut Shy Lobber no longer calls Floss Wisps).

### World hazard: Caramel Drip
Reuses the **`wax`** mechanic from World 6 exactly (a drip falls, then leaves a sticky puddle), drawn as hot caramel
dripping from a toffee-apple dipping rack. Hazards are drawn in code, so this needs a new hazard name and drawing, no
generated image. It switches on in the boss room when the boss enrages, as in every world.

### World boss: The Great Flosso
A huge pink candy-floss cloud on a striped paper cone, top hat, curly moustache, a twirling cone for a cane. Half
carnival barker, half stage magician ("Step right up!", "Abracadabra-cadabra!"). He runs the Midway's rigged games and
judges "showmanship". He is all fluff: light, floaty, and scared of getting wet. Beaten, he shrinks to a tiny wisp with
a tiny voice, hands over the first ribbon and scurries off to warn "the Showstopper". Not cured and not evil: a sore loser.

**Type (provisional):** Melty, weak to HOT, resists COLD (spun sugar melts). His Floss Wisps share it, so one answer
covers the boss and his adds. Suggested element for his 20 boss weapons: STICKY.

Moves, in `BOSS_PATTERNS` words:
- `slash` Cone Cane (close swipe) and `puddle` Sticky Floss (a patch that slows you).
- `rain` Sugar Shower and `summon` "Fluff 'em!" (calls Floss Wisps, so no extra summon art).
- Phase 2 adds `leap` (a slow, floaty Up-and-Away drop) and `fanshot` Pick a Card (a fan of wafer cards).
- Final phase adds `roar` Ta-daa! and the **one new signature move, Wheel of Misfortune**: the prize wheel behind him
  spins and stops on one of three symbols (shower, wisps, shockwave), then he does that move at double size. The wheel is
  the warning. It is built from three moves he already has plus a new telegraph, so it is small new code.

### Stages

| Stage | Name | Identity |
| --- | --- | --- |
| 11-1 | The Ticket Gate | Arrival (`w11-open`). 2 maps of Cadets, Bouncers and Wisps. |
| 11-2 | Bunting Boulevard | Slingers and Bumper Cupcakes join in. |
| 11-3 | Ring Toss Row | Whack-a-Churros underfoot. Mimic in the first map. |
| 11-4 | Bumper Car Bay | **Keeps the escort objective**: a Crumblet is lost in the crowd. |
| 11-5 | Test Your Strength | The champion (`w11-elite`: your old rival runs a stall here and tips you off). |
| 11-6 | Helter-Skelter Heights | **Keeps the Recipe Scroll race.** |
| 11-7 | Hall of Mirrors | Mimic, and the secret ledge with the World 11 Key. |
| 11-8 | The Coconut Shy | **Keeps the hold-out waves.** |
| 11-9 | Big Wheel Climb | Flosso heckles over the loudspeaker. Mimic. |
| 11-10 | The Big Top | The Great Flosso (`w11-boss`, `w11-after`). |

### What the 20 kaiju are doing at the festival (seeds for the writers)
Each picks up from its own `w10-after`. Numbers that were counting in Act 2 carry on from where they stopped.

| Kaiju | At the festival |
| --- | --- |
| Gobzilla Jr. | Now "Gobzilla LARGE", and still too short for the big rides. New goal: Gobzilla EXTRA LARGE. |
| Squidgeon | Running tests on the gold ink of the invitation and proving the games are rigged. For SCIENCE. |
| Crabbage | Entering the prize cabbage in the giant vegetable show, and yelling at the crowd to get off the grass. |
| Bloblin | Got a real invitation in the post for the first time ever. Has framed it and is cheering for everybody. |
| Mothball | Chasing the fair lights and the big wheel, waiting for the fireworks. Might be the moon. |
| Toastbat | Retired after his "last job". Just LOOKING at the grand prize. Spots a con because he knows one. |
| Dumplord | Thinks the invitation is a royal summons and expects a crown. Decrees carry on from Number Forty-Eight. |
| Norigon | Says he came to the very first festival 900 years ago. Sushi stall with Gari, proverbs about queues. |
| Chocomunch | Wants a ribbon to frame next to the Chef note. It is sunny. Me no like hot. |
| Bubblegumbo | Has forgotten where he put his ticket. Brittle is holding it. Thinks the gumball machines are cousins. |
| Bluebeary | Six Crumblets loose at a fair. Head counts, the lost-and-found tent, and no nap in sight. |
| Pizzaraptor | That shiny delivery van is a RIVAL courier. Festival-size orders, and judges who hand out stars. |
| Sloba | This is her "once a year" rush. Looking for the quiet tea tent and napping in every queue. |
| Avocadrake | Entering "Freshest in Show" in full sun. Guac-and-chips stand with El Nacho. |
| Salmonster | Wants to win every midway game the hard way, then take both teams to dinner. |
| Hotchog | The Grill Champion has a real cook-off coming (World 14). Meets the corn dogs: "C-cousins?!" |
| Minturtle | Hunting for shade and the snow-cone stand. Sundae stall with Hot Fudge Hare on sauce duty. |
| Pengwhip | The helter-skelter has no brakes either. Sends postcards home to the freezer. |
| Velvaroo | "Champ of the whole house" wants the festival belt too. Rocky Road is her corner man. |
| Tacowl | Wants the main-stage DJ slot. The mixtape carries on from Track forty-nine. |

### Progression and gear
- `MAX_LEVEL` 110 to 120. That touches the XP curve, the skill-tree point budget ("more points than a max-level kaiju
  earns" must stay true), `TUNE.treeRamp`, Hard (+6 levels) and Nightmare. World settings: `baseLv` 111, `power` about
  5.4 (each Act 2 world added 0.4), `mobPow` found by sweep.
- **Boss weapons:** yes. 20 new `bw-flosso-<kaiju>` icons, one per kaiju, as for every earlier boss.
- **Gear tier 6:** none in World 11 (decided). There are 5 tiers (`TIER_LV`, the last starts at item level 75), and
  Worlds 8-10 shipped without a new one because item stats already grow with item level. A tier 6 would be 40 more
  icons (weapon + armour for 20 kaiju). It can be looked at again for the act's last world.

## 5. Production estimate for World 11 (full version, as decided)

**Art (one Gemini image each):**

| Type | Count |
| --- | --- |
| Backdrops (far, mid, tile, boss room, map page) | 5 |
| Ordinary monsters | 9 |
| Minibosses | 5 |
| Kings (only if Kings get their own art: today they are the base monster at double size with a crown) | 0 or 3 |
| World boss | 1 |
| Drop icons (one per ordinary monster) | 9 |
| World paintings (`still-w11-open`, `-boss`, `-cure`) | 3 |
| Short-scene paintings (`still-w11-s2, s3, s4, s6, s7, s8, s9`) | 7 |
| Stage 5 paintings, one per kaiju (`still-<sp>-w11-elite`) | 20 |
| Boss weapon icons | 20 |
| **Total** | **79 to 82** (no tier 6 gear) |

**Story:** 11 scenes per kaiju (`w11-open`, `-elite`, `-boss`, `-after`, and 7 short scenes) x 20 kaiju = **220 scenes**,
about 600 lines. Plus first-sight taunts for the new monsters, one shared villain tease, and `docs/WORLD11-BRIEF.md`
written against a regenerated `docs/stage-facts.md`.

**Code:** one `WorldDef`; about 19 monster entries (9 monsters, 5 minibosses, 3 Kings, champion, boss); `ROOM_FOES[11]`;
boss pattern and armour; the wheel move; the caramel hazard name and drawing; 9 drops; 20 boss weapons; level cap 120;
an 11th map page in camp; `w11` story keys; a World 11 tune or reuse of an existing one; tests.
Found on the way: the Act 2 credits list every world with an id above 5, so World 11 would show up in them until fixed.

**Balance:** `power` / `mobPow` sweep, 9 boss-room foes tuned one by one, Flosso into the 57-80% clear band, all 20
kaiju re-checked at levels 111-120, then Hard and Nightmare.

**Not chosen, kept as a fallback if art runs late: a smaller version (about 36 images):** 6 new monsters plus 3 returning ones, as World 10 did (saves 6 images);
no stage 5 paintings (those scenes fall back to portraits, and the art test needs a small change: saves 20); boss
weapons in a follow-up (saves 20); drop the wheel move. Story could go to KEY SCENES first (4 scenes x 20 = 80) with
the 140 short scenes after.

## 6. Decisions (made 2026-11-13)

All four are settled and listed at the top of this file. For the record, the options were: villain A / B / C (A chosen,
with B and C as judges); act length 3 / 4 / 5 worlds (5 chosen, one more than recommended, which added the Blue Ribbon
Barn and Granny Crumble); World 11 size full / no stage 5 paintings / small (full chosen); nemeses cameo only / one
bout in World 13 / bouts everywhere (one bout in World 13 chosen).

Still open, outside this outline: the three details of the weakness system (`docs/WEAKNESS-DESIGN.md`, section 10).
