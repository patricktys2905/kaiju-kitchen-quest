# Elemental weaknesses: design note

Status: proposal for the Creative Director's "per monster" option. No code yet. Written 2026-11-13.
Tables are generated from the real `MOBS` / `WORLDS` / `ROOM_FOES` by `npx vite-node scripts/weak-table.ts` (it fails
loudly if a monster kind has no type; today 209 kinds, none missing).

## 1. Goal and player experience
Every monster has a soft spot and a thick skin. The stage panel says "Weak: 🔥×4 🍬×3 · Boss 🔥", so before PLAY you
look at your skills, your weapon's gear skill and your boss weapons and pick the ones that fit. In the fight the right
hit pops a big coloured number and "WEAK!"; the wrong one pops a small grey "RESIST". Nothing is ever locked: a kaiju
with the "wrong" kit plays exactly today's game, a prepared one gets a bit more.

## 2. Four elements
| Element | Icon, colour | Existing effects that count | Does NOT count |
| --- | --- | --- | --- |
| HOT | 🔥 `#ff7a3c` | `burn` (fx, `SkillDef.burn`, fire zones, salsa, Pepper Breath), burn ticks, `poison` | |
| COLD | ❄️ `#7fd4ff` | `freeze` (fx, Deep Freeze, scoop, freezing walls, Brain Freeze proc), ice / snow zones | |
| STICKY | 🍬 `#ff8af4` | `glue`, `slow` (Syrupy twists, goo, guac, frosting patch, Jam Trap, Syrup Slide), `poison` | |
| CRUNCH | 🔨 `#e8e0c8` | Guard Break (DOWN+attack, every kaiju from Lv 1), `shatter`, skills tagged in 5.2 | finisher, plain combo |

Utility, never an element: `launch`, `pull`, `heal`, `crumbs` (they keep working as today). `poison` (the 20 Mold Crown
boss weapons) counts as HOT or STICKY, whichever is better for the player: it already is burn + slow in code.
Where they live today: `GearFx` and `FX_TEXT` `src/sim/gear.ts:11,37`; `TWIST_FX` `src/sim/items.ts:37`; boss elements
`src/sim/bossgearData.ts:13`; signature `SkillMod` `items.ts:497`; tree mods `src/sim/tree.ts:55-116`; the one place
most effects land, `applyFx` `src/sim/world.ts:729-743`; statuses on the monster `world.ts:136-139`.

## 3. Rules
- **One type per monster, four types.** Melty: weak 🔥, resists ❄️. Fiery: weak ❄️, resists 🔥. Crusty: weak 🔨,
  resists 🍬. Slippery: weak 🍬, resists 🔨. Weak and resist always come in these pairs, so a player learns four
  things, not 209.
- **A weak hit is a hit that carries the element** (not "any hit on a burning monster"). The element comes from, in
  order: the skill's own tag; else the effects the hit carries (burn → HOT, freeze → COLD, glue / slow → STICKY,
  shatter → CRUNCH); Guard Break is CRUNCH. Burn ticks are HOT hits.
- **Numbers to start from** (one constant block, section 9): weak hit ×1.4 damage, and freeze / glue / slow last ×1.5
  on that monster. Resisted hit ×0.7 damage, and its status lasts ×0.5. World bosses: ×1.25 and ×0.85 (one target,
  nothing to dilute it).
- **Plain hits are unchanged**: combo, finisher, launcher, air hits, untagged skills, ultimates without an effect.
  They are never resisted and never weak.
- **Existing rules stay and stack by multiplying**: frozen +30% (`world.ts:1756`), glue + Spike Roll ×2 (`:1757`),
  boss armour `BOSS_ARMOR` (`:1761`, `mobs.ts:482`), tired ×1.25 (`:1762`), gear skills at 40% on world bosses
  (`gearVs` `world.ts:2742`; room foes are brain `nemesis` and take full gear damage), level gap, shields, guard.
  Bosses stay immune to freeze and glue as today (`world.ts:734-735,994`); the damage bonus still applies to them.
  A weak hit cracks boss armour faster only because it does more damage (`:1821`): no extra rule.
- **Co-op**: the multiplier belongs to the hit, so each player's own kit decides; everyone sees the popups. Monster HP
  scaling per player is untouched. Online panel shows the same line for the whole room.
- **Modes**: same table in Hard, Nightmare, Daily Dungeon, Endless Pantry, Boss Rush and bonus stages.

## 4. No dead ends
1. Plain hits are never resisted, and a monster resists only one element: a kaiju that ignores the system plays
   today's balance.
2. CRUNCH is in every kaiju's hands from Lv 1 (Guard Break), and it is the most common weakness on the fights that
   gate progress: 7 of 10 champions, 3 of 10 world bosses including the first and the last, 11 of 20 nemeses.
3. A nemesis is weak to an element its rival kaiju has from an original skill by Lv 4, otherwise to CRUNCH, and never
   resists such an element.
4. At most two of a kaiju's three original skills carry the same element, so everyone keeps a neutral skill.
5. No random roll is ever required. Deterministic sources: own skills, Guard Break, each kaiju's own weapon bases
   (fixed gear skill per base, `GEAR` `gear.ts:44-165`), boss weapons with a pity counter (W1 🔥, W2 ❄️, W3 🔥,
   W5 🔥/🍬, W6 🔨, W8 🍬), and the Market re-season in open question 1.

### 5.1 Access table (what each kaiju can apply)
"Skill" = applies the status today. "Tag" = proposed tag on a skill that has the flavour but no status (question 2).
Own weapons = that kaiju's 7 weapon bases with a fixed effect; any weapon can also roll a random twist.

| Kaiju | Own skills (level) | Proposed tag | Own weapons | Gap |
| --- | --- | --- | --- | --- |
| Gobzilla Jr. | 🔥 Seed Spray+ (tree, Lv 20) | 🍬 Jam Tornado (8) | 🍬 1, 🔥 1 (tier 5) | no element before Lv 8 |
| Bluebeary | ❄️ Frozen Berries (tree cap, 28) | 🔨 Muffin Quake (1) | 🍬 5 | nothing until 28 without the tag |
| Pizzaraptor | 🔥 Oven Breath (tree, 8) | | 🔥 4, 🍬 2 | only if that path is taken |
| Mothball | 🍬 Dream Dust (tree, 8) | | 🍬 3, 🔥 1 | only if that path is taken |
| Squidgeon | ❄️ Eureka! (tree cap, 28) | ❄️ Bubbling Flasks (8) | 🍬 4, ❄️ 1 | nothing until 28 without the tag |
| Crabbage | 🍬 Pickled (tree cap, 28) | 🔨 Cheddar Pounce (8) | ❄️ 2, 🍬 3 | nothing until 28 without the tag |
| Toastbat | 🔥 Crumb Dive (1), Burnt Screech (tree) | | ❄️ 1, 🍬 3, 🔥 1 | none |
| Dumplord | none (Steam Cloud does not burn) | 🔥 Steam Cloud (1) | 🔥 2 | **no elemental skill at all** |
| Norigon | 🔥 Wasabi Breath (1), Wasabi Nova (tree) | | 🔥 3, 🍬 2 | none |
| Chocomunch | none | 🔨 Choco Suplex (1) | 🍬 1, 🔥 1 (tier 5) | **no elemental skill at all** |
| Hotchog | 🍬 Mustard Glue (4), 🔥 Grill Breath (tree), 🔥 ult | | 🍬 2, 🔥 3 | none |
| Pengwhip | ❄️ Belly Slide trail (1), Deep Freeze (8), ult | | ❄️ 7 | one element only |
| Avocadrake | 🍬 Guac Pool (4), 🔥 Chili Breath (tree) | | 🍬 3, 🔥 1 | none |
| Tacowl | 🔥 Salsa Bombs (1), Salsa Twister cap | | 🔥 3, 🍬 1 | none |
| Bubblegumbo | 🍬 Sugar Rush (tree cap, 28) | 🍬 Bubble Trap (1) | 🍬 4 | nothing until 28 without the tag |
| Velvaroo | 🍬 Cupcake Bomb patch (8) | | 🍬 1 | thin: one skill, one weapon |
| Sloba | 🍬 Vine Swing (1), Sloth Time (8) | | 🍬 5 | one element only |
| Minturtle | ❄️ Scoop Lob (1), Mint Freeze (tree), ult | | ❄️ 6, 🍬 1 | none |
| Bloblin | 🍬 Jiggle Splat (1), cap, ult | | 🍬 3 | one element only |
| Salmonster | none | ❄️ Tidal Push (4) | ❄️ 2 | **no elemental skill at all** |

Findings: 3 kaiju have no elemental skill at all and 5 more have none before Lv 20-28. Nobody's own kit covers more
than two of HOT / COLD / STICKY. COLD is the scarce one: only 6 kaiju have a fixed COLD weapon base and only
Minturtle and Pengwhip have COLD skills early. So the 8 tags and the Market re-season are both needed; no new item or
consumable is proposed.

### 5.2 Tags
Each active skill gets an optional `el`. Skills that already apply a status are tagged with it. Three places need an
explicit tag because the code would guess wrong: Velvaroo's frosting patch is an `'ice'` zone (`world.ts:2568`) but is
STICKY; Pengwhip's Icicle Rain carries `slow` (`tree.ts:91`) but is COLD; Bubblegumbo's bubbles reuse `frozen`
(`world.ts:1708`) but are STICKY. The 8 new tags in the table change nothing against a neutral monster.

## 6. Assignment
Principle, in four lines a child can repeat: **melt the cold, chill the hot, crack the hard, stick the quick.**
Melty = frozen, dairy, mouldy, paper, plastic, wax, leafy. Fiery = hot, greasy, spicy, steaming, fizzy. Crusty =
shells, crockery, cans, crackers, armour. Slippery = hoppers, flyers, burrowers, chargers, wobbly things.
- **Kings and champions** inherit from their base monster. **Summons and splits** share their caller's type (one
  answer for a boss and its adds): Jelly Baby 🍬, Cheerio Bit 🔨, Sporeling 🔥, Crouton Squire 🍬, Sprout Soldier 🔥,
  Mystery Chunk ❄️, Lost Lid 🍬. Mimics: Lunchbox 🔨, Cereal Box 🔥.
- **World bosses** by theme; each world's previous boss weapon is often the answer (Toast King's 🔥 weapon melts the
  Freezer Golem, Frostbite ❄️ chills the Grease Dragon, the Gravy 🍬 weapon sticks the Tupperwraith).
- **Worlds lean, they are not solved**: a main weakness covers about half a world, every world has at least three.
  Two elements cover two thirds of the monster kinds in 79 of 100 stages, and two thirds of the monsters the exits
  make you hunt in 88 of 100.

Icon = what the monster is weak to. `*` = also met in an earlier world.

| World | Monsters | Count | Stage 5 champion | World boss |
| --- | --- | --- | --- | --- |
| 1 Countertop | Salt Shaker Gunner 🔨, Jam Blob 🍬, Moldy Bun 🔥, Sour Worm 🍬, Sugar Ant Digger 🍬, Pepper Grunt ❄️, Garlic Cleric 🔥, Rotten Egg 🔨 | 🔥2 ❄️1 🔨2 🍬3 | Rotten Egg 🔨 | Burnt Toast King 🔨, resists 🍬 |
| 2 Fridge | Melty Ice Pop 🔥, Cheese Cube Critter 🔥, Frost Pea 🔥, Yogurt Slime 🔥, Milk Carton Rammer 🍬, Brain-Freeze Bat 🍬, Carrot Sniper 🔨, Pickle Knight 🔨, Jelly Mother 🍬 | 🔥4 ❄️0 🔨2 🍬3 | Pickle Knight 🔨 | Freezer Golem 🔥, resists ❄️ |
| 3 Oven | Oven Mitt Grabber 🍬, Burnt Crouton 🔨, Sizzle Bacon ❄️, Popcorn Popper ❄️, Sausage Ram ❄️, Hot Sauce Imp ❄️, Kettle Turret ❄️, Meatball Brute 🔨, Marshmallow Medic 🔥 | 🔥1 ❄️5 🔨2 🍬1 | Meatball Brute 🔨 | Grease Dragon ❄️, resists 🔥 |
| 4 Pantry | Cracker Crawler 🔨, Honey Bee 🍬, Cheerio Blob 🔨, Flour Ghost 🍬, Noodle Lurker 🔥, Can Crusher 🔨, Raisin Sniper 🔥, Baking Soda Bomb ❄️ | 🔥2 ❄️1 🔨3 🍬2 | Can Crusher 🔨 | Cookie Jar Mimic 🔨, resists 🍬 |
| 5 Sink | Straw Snake 🔥, Rubber Ducky 🔥, Crusty Plate Knight 🔨, Soap Bubble Sprite ❄️, Mouldy Mug 🔨, Drain Eel 🍬, Grabby Glove 🔥, Scrub Brute 🔥 | 🔥4 ❄️1 🔨2 🍬1 | Scrub Brute 🔥 | The Mold Crown 🔥, resists ❄️ |
| 6 Dining Room | Ladle Lancer 🔨, Tea Cake Hopper 🍬, Fork Soldier 🔨, Napkin Ghost 🔥, Candle Imp ❄️, Gravy Boat Rammer ❄️, Teapot Nanny 🔨, Roast Brute ❄️ | 🔥1 ❄️3 🔨3 🍬1 | Roast Brute ❄️ | Sir Stale 🍬, resists 🔨 |
| 7 Backyard BBQ | Ember Firefly ❄️, Veggie Skewer Soldier 🔥, Kebab Beetle 🔨, Picnic Wasp 🍬, Ketchup Squirter ❄️, Charcoal Imp ❄️, Corn Cob Cannon 🔥, Burger Brute ❄️ | 🔥2 ❄️4 🔨1 🍬1 | Burger Brute ❄️ | Baron Brussels 🔥, resists ❄️ |
| 8 Garden | Toadstool Hopper 🍬, Leaf Caterpillar 🔥, Lettuce Snail 🔨, Ladybug Glider 🍬, Peapod Sniper ❄️, Potato Mole 🍬, Tomato Lobber ❄️, Radish Bomber 🍬, Pumpkin Brute 🔨 | 🔥1 ❄️2 🔨2 🍬4 | Pumpkin Brute 🔨 | The Mystery Meatloaf ❄️, resists 🔥 |
| 9 Supermarket | Cardboard Box Walker 🔥, Coupon Ghost 🔥, Trolley Rammer 🍬, Plastic Bag Ghost 🔥, Bruised Banana Bunch 🍬, Barcode Sniper ❄️, Dented Can Turret 🔨, Watermelon Brute 🔨 | 🔥3 ❄️1 🔨2 🍬2 | Watermelon Brute 🔨 | The Tupperwraith 🍬, resists 🔨 |
| 10 Feast | Party Cracker Bomber 🔥, Pudding Cup 🍬, Candied Cherry Soldier 🔨, Candied Peel Bat 🍬, *Fork Soldier 🔨, *Kebab Beetle 🔨, *Lettuce Snail 🔨, *Barcode Sniper ❄️, Fruitcake Knight 🔨 | 🔥1 ❄️1 🔨5 🍬2 | Fruitcake Knight 🔨 | Old Fruitcake 🔨, resists 🍬 |

Boss-room foes by stage (`ROOM_FOES`, `src/sim/stages.ts:36`; Kings inherit, minibosses are typed by their name):

| World | 1 | 2 | 3 | 4 | 6 | 7 | 8 | 9 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | King Moldy Bun 🔥 | Sir Butterknife 🔨 | Rolling Pin Rogue 🔥 | King Sour Worm 🍬 | The Toaster Tyrant ❄️ | Cutting Board Golem 🔨 | King Pepper Grunt ❄️ | Cookie Cutter Witch 🍬 |
| 2 | King Frost Pea 🔥 | Ice Cube Ogre 🔥 | Fish Finger General 🔨 | King Milk Carton Rammer 🍬 | The Cheese Wheel 🍬 | Butter Block Brute 🔥 | King Carrot Sniper 🔨 | Leftover Lasagna Lich ❄️ |
| 3 | King Sizzle Bacon ❄️ | Casserole Commander ❄️ | Pizza Peel Paladin 🔥 | King Popcorn Popper ❄️ | Muffin Tin Mortar 🔨 | Souffle Sorcerer 🍬 | King Kettle Turret ❄️ | Gingerbread Gladiator 🔨 |
| 4 | King Cheerio Blob 🔨 | Flour Sack Sumo 🍬 | Cereal Box Colossus 🔥 | King Noodle Lurker 🔥 | Honey Pot Hermit 🔨 | Peanut Butter Ogre ❄️ | King Raisin Sniper 🔥 | Spice Rack Shaman ❄️ |
| 5 | King Crusty Plate Knight 🔨 | Sponge Golem 🔥 | Plunger Paladin 🔨 | King Mouldy Mug 🔨 | Dish Soap Siren 🍬 | Scrub Brush Boar 🍬 | King Grabby Glove 🔥 | Clogged Drain Hag ❄️ |
| 6 | King Fork Soldier 🔨 | Gravy Boat Captain ❄️ | Teapot Tyrant 🔨 | King Candle Imp ❄️ | Candelabra Duchess ❄️ | Silver Cloche Knight 🔨 | King Teapot Nanny 🔨 | Napkin Ringmaster 🍬 |
| 7 | King Kebab Beetle 🔨 | Hot Coal Golem ❄️ | Spatula Sheriff 🔨 | King Ketchup Squirter ❄️ | Corn Cob Gunner 🔥 | Marshmallow Mammoth 🔥 | King Corn Cob Cannon 🔥 | Sauce Bandit 🍬 |
| 8 | King Lettuce Snail 🔨 | Snapdragon ❄️ | Watering Can Wizard ❄️ | King Tomato Lobber ❄️ | Gnome General 🔨 | Hedge Trimmer Beetle 🍬 | King Radish Bomber 🍬 | Pumpkin Scarecrow 🔥 |
| 9 | King Trolley Rammer 🍬 | Trolley Chariot 🍬 | Cash Register Golem 🔨 | King Bruised Banana Bunch 🍬 | Price Gun Paladin 🔥 | Mop Bucket Mage ❄️ | King Dented Can Turret 🔨 | Shelf Stacker Bot 🔨 |
| 10 | King Candied Cherry Soldier 🔨 | Forgotten Soup 🔥 | Banquet Butler 🔨 | King Pudding Cup 🍬 | Pudding Juggernaut 🍬 | Trifle Titan 🍬 | King Party Cracker Bomber 🔥 | Fondue Fiend ❄️ |

Nemeses (stage 5 of Worlds 1-5, in that kaiju's own story only): 🔨 Brutus Beetroot, Crustwing, Pineapple Pete,
Zapsy the Bug Lamp, Professor Penicillin, Sir Slurp, Duke Fortune Cookie, Torchy Brûlée, Finn Freezepop, Rocky Road,
Grizzly Grizzle. 🔥 Ricotta Rat (Toastbat), Gari the Ginger Serpent (Norigon), Señor Sting (Tacowl). ❄️ Hot Fudge
Hare (Minturtle). 🍬 Captain Kebab (Hotchog), El Nacho (Avocadrake), Jitters (Sloba), Grey Gelato (Bloblin), Brittle
(Bubblegumbo: needs the Bubble Trap tag, otherwise 🔨).

Totals (weak to 🔥 / ❄️ / 🔨 / 🍬): ordinary 21 / 18 / 21 / 20, minibosses 11 / 13 / 14 / 12, Kings 7 / 7 / 10 / 6,
champions 1 / 2 / 7 / 0, world bosses 3 / 2 / 3 / 2. Resists mirror these through the pairs.

## 7. UI
- **Stage panel** (`src/ui/camp.ts:202`, next to the Boss line and `dropRow` `:76`): one line,
  `Weak: 🔥×4 🍬×3 🔨×2 · Boss 🔥 (shrugs off ❄️)`, counted over the stage's spawn kinds. Each wanted-drop chip gets its
  monster's small icon. The boss icon shows even while the boss name is still "???". Same line on the Daily Dungeon
  card (`src/ui/free.ts`) and the online room (`src/ui/online.ts`).
- **Know your kit**: the element icon in front of each skill name on the Skills tab, on the gear-skill line of the Hero
  tab and item cards (`camp.ts:260,272`), and on the boss-weapon "Can drop" line. A green tick on a skill or weapon whose
  element matches the selected stage.
- **In the fight** (`GameScene.ts:639-650`): a weak hit's number takes the element's colour and the crit size; the word
  "WEAK!" pops at most once per monster per 1.5 s (multi-hit skills must not spam). A resisted hit is small and grey with
  "RESIST", same throttle. With low effects on: no numbers as today, but the first WEAK! / RESIST per monster still shows.
- **On the monster**: its weakness icon sits on the small HP bar that already appears after a hit, and one icon by the
  boss bar. **No bestiary**: the panel, the HP-bar icon and the pause menu (a "this stage" line) cover it.
- **Tip** (`src/ui/tips.ts`): one-time "WEAK! This monster hates 🔥. The stage card shows what each stage is weak to",
  on the first weak hit; one-time "RESIST: try another skill or a plain hit" on the third resisted hit in a stage.
- **The HUD must not gain**: no new button, no element picker, no swap-weapon-in-stage, no permanent icons over
  monsters, no extra bars, no element legend on screen.

## 8. Balance plan
- **Why the average is neutral**: weak and resist are symmetric (×1.4 / ×0.7 on the element share of damage only) and
  each element is weak on about as many monsters as it is resisted on (table totals), so a build that does not adapt
  gains on some monsters what it loses on others. Element hits are a minority of damage for most kaiju.
- **Players who prepare will do better than that.** Measure it: `scripts/hero-at.ts` rolls the bot a random weapon
  with a random twist (`:19-22`), and the bot presses gear and skills on cooldown (`src/sim/bot.ts:187-190`). Keep the
  bot's play unchanged (it ignores elements) and add a `prepared` build option that sets the weapon effect and loadout
  to the boss-room foe's weakness. Target: the unprepared skilled bot stays where it is today; the prepared one stays
  inside the bands (stages at most 95%, world bosses at most 80%). If prepared overshoots, lower the weak multiplier or
  raise monster HP by about half the measured gain. Do not teach the bot to target by element.
- **Sweeps to rerun** (after the art jobs finish; 20 kaiju, skilled, 8 jams): all world bosses n=200, unprepared and
  prepared; all stages n=60; per kaiju × boss table from `pass-sum.mjs` (no cell under 50%); Hard and Nightmare bosses;
  `free-balance.ts` for Boss Rush and Endless; then `kaiju-tune.mjs --dry`.
- **Risks**: (1) one-element kaiju against a resisting boss: Minturtle and Pengwhip on the Freezer Golem, the four HOT
  kaiju on the Grease Dragon and the Meatloaf; Minturtle is already the slowest. Boss resist is only ×0.85 and bosses
  never took freeze or glue anyway, but check these cells first. (2) HOT doubles up (hit and ticks both ×1.4) on Melty
  worlds 2, 5 and 9. (3) STICKY kaiju gain little damage from a weak glue; the ×1.5 duration is their payoff, watch
  for stun-locks on Slippery room foes. (4) Boss clear rates moved about 30 points for 1.5× health and 1.2× attack last pass, so
  even ×1.25 is visible: sweep before merging. (5) The bot's random weapon twist now adds seed noise per stage.

## 9. What NOT to change
The cast and the 209 monster kinds; skill ids, kinds, names and numbers (`tests/skills.test.ts` stays green); what
each effect does today (burn damage, freeze time, glue, slow, boss immunities, frozen +30%, the gear 40% boss rule,
boss armour); twist roll odds; boss weapon drops and pity; the save format (`kkq-save-v3`: no new saved field, old
items and twists keep working, the re-season writes the existing `Item.twist.fx`); the snapshot layout (`snapshot.ts`
index tables are append-only; this design needs no new monster state, only two optional fields on the `hit` event,
which guests already receive through `ev`); `RunStats` keys; rank and style rules; the difficulty targets.

## 10. Open questions for the Creative Director
1. **Market "Re-season"**: pay crumbs to set an ordinary weapon's twist effect to 🔥, ❄️ or 🍬 (keeps its style; not
   for signature or boss weapons). Recommended: **yes**. COLD is otherwise a random roll for 14 kaiju, and this is what
   turns twists into a choice without farming.
2. **Eight flavour tags** on skills that apply no status today (table 5.1). Recommended: **yes**. Without them 3 kaiju
   have no elemental skill ever and 5 more wait until Lv 20-28.
3. **CRUNCH as the fourth element** (Guard Break for everyone, plus `shatter`). Recommended: **yes**. It is the
   no-dead-end guarantee and gives Guard Break a reason beyond shields. The alternative is three elements and a new
   consumable for the kaiju with gaps.

## 11. Task split (no two roles edit the same file)
| Role | Owns | Work |
| --- | --- | --- |
| Gameplay engineer | new `src/sim/elements.ts`; `world.ts`, `types.ts`, `skills.ts`, `tree.ts`, `gear.ts`, `items.ts`, `save.ts`; new `tests/elements.test.ts` | Element type, monster type table (copy from `scripts/weak-table.ts`), fx-to-element map, `el` tags; element passed into `damageMob` and applied beside `world.ts:1756`; burn ticks (`:1898`); status duration scaling in `applyFx` and the direct status writes; `hit` event gains `el` and `w`; re-season function. Tests: every `MobKind` typed, pairs hold, Kings and champions inherit, plain hits unchanged, boss numbers, a no-dead-end test per kaiju and nemesis, old saves load. |
| UI engineer | `src/ui/camp.ts`, `free.ts`, `online.ts`, `tips.ts`, `style.ts`; `src/scenes/GameScene.ts`, `src/hud.ts`; `scripts/panel-shot.mjs`, visual baseline | Panel line and chips, kit icons and ticks, popups with throttle, HP-bar and boss-bar icon, pause line, two tips, Market re-season button. Reads `elements.ts`, never edits it. |
| Balance designer | new `src/sim/elementTune.ts` (the six multipliers, imported by `elements.ts`); `src/sim/mobs.ts` `TUNE`, `src/sim/kaijuTune.ts`, `src/sim/stages.ts` `mobPow`; `scripts/hero-at.ts`, `scripts/weak-*.ts`, `src/sim/bot.ts`; `docs/STUDIO-LOG.md` | `prepared` build option, the sweeps in section 8, multiplier and HP adjustments, type changes requested through the gameplay engineer. |

Order: gameplay lands `elements.ts` with the table and the event fields first (UI can start against it the same day);
balance starts when `damageMob` applies the multiplier.
