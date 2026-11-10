# New kaiju story brief: Avocadrake (13) and Tacowl (19)

Two new playable kaiju join the cast. Like every kaiju they start at 1-1 and have their OWN full story through Worlds 1-6.
Write a complete story file pair for your kaiju, the same size and shape as the existing ones.

**Read first, in this order:** `docs/VOICE.md` (rules, enforced by `tests/voice.test.ts` and `tests/banter.test.ts`),
`docs/WORLD5-BRIEF.md` and `docs/WORLD6-BRIEF.md` (what happens in Worlds 5 and 6), `src/story/finale.ts`, then one complete
existing kaiju as a model: `src/story/arcs/k8.ts` + `src/story/more/k8.ts` (and skim `k17.ts` for a second example).
Match their structure, line counts and energy exactly. Stage-by-stage features (escort on x-4, fetch on x-6, survive on x-8,
arenas x-3/x-7/x-9, the rolling-pin chase on x-2, the secret chest with the World key on x-7, bouncy sponges, levers,
pressure cookers) are the same in every world; world themes: 1 Countertop, 2 Fridge, 3 Oven, 4 Pantry, 5 Sink, 6 Dining Room.
Bosses (speaker `"boss"`): W1 Burnt Toast King, W2 Freezer Golem, W3 Grease Dragon, W4 Cookie Jar Mimic (all corrupted
by mould, cured and goofy after being beaten), W5 the Mold Crown (beaten, squeaks that it was a "science project" grown in
the back of the fridge, slurped down the drain), W6 Sir Stale of the Leftovers (beaten, flees out the window to the Backyard).
The Head Chef is missing in Act 1 (never on screen, never speaks; notes, the hat, the narrator). `"mold"` is the Mold
Crown's creepy voice (World 4 cliffhanger and World 5 hints).

## Your files (replace the placeholders completely)
`src/story/arcs/k<sp>.ts`: `TITLE`, `TAGLINE`, `ARC` with `intro`, `w1-open`..`w6-open`, `w1-boss`..`w6-boss`,
`w1-after`..`w6-after`, and `NEMESIS` with `w1-elite`..`w6-elite` (type it like k8.ts). Rules from the tests:
- `w4-after` must END with exactly `["n", "To be continued in World 5: The Sink."]` and include a `"mold"` line.
- `w5-after`: the shrunken Mold Crown (`"boss"`) squeaks about being a science project and is slurped away, the Chef is safe
  (narrator / note), then the kaiju's personal ending (matching the ENDING painting below), ending on a warm funny line.
  The first `"me"` line after the last `"boss"` line is where the ending painting appears.
- `w5-elite` is the final nemesis showdown (nemesis softens: "MAYBE!"); `w6-elite` is the nemesis as a grudging friend.
- `w6-open` opens Act 2 (Leftovers loose; a fresh personal reason to go on); `w6-boss`/`w6-after` are Sir Stale.

`src/story/more/k<sp>.ts`: `BEATS` with `w{N}-s{n}` for N = 1..6 and n = 2,3,4,6,7,8,9 (1-3 lines each, max 130 chars a
line, speakers `"me"`, `"n"`, `"foe"`, `"mold"`, `"lo"`, `"lo2"` or a kaiju species number for a cameo; x-4 usually has
Bluebeary (10) asking you to walk a Crumblet). `QUIPS`: 3 lines each (max 55 chars) for combo, lowhp, perfect, levelup,
secret, boom, mimic, objective.

## Avocadrake (13): avocado dragon, "guac guardian"
Look: a halved avocado, light-green face and belly with a big shiny brown pit in the belly, bumpy dark skin, small bat-like
dragon wings, tiny feet. Skills: Pit Hurl (bouncing pit), Guac Pool (heals friends, slows monsters), Wing Gust,
ultimate Holy Guacamole. Voice: see VOICE.md (wannabe-ancient dragon, "BEHOLD!", voice cracks, terrified of BROWNING).
Arc (suggested, make it yours): he has guarded his bowl of guac "for centuries" (since Tuesday) and fears turning brown now
the Chef is gone; the Chef's legendary Lime of Freshness keeps guac green, so he sets out to find the Chef (and the lime).
Nemesis (speaker `"foe"`): **El Nacho**, a cheesy tortilla-chip luchador wrestler who wants to DIP him ("Chips and guac,
amigo, we're DESTINY!"), wrestling catchphrases, signature move Queso Yank.
ENDING painting (`still-13-end`): curled up proudly on top of a sparkling bowl of fresh bright-green guac at sunrise, a lime
beside it, not one brown spot. Intro painting: perched on a guac bowl like a dragon on its hoard, glancing worriedly at a
brown spot on a cut avocado. Suggested title: "Holy Guacamole" (or better).

## Tacowl (19): taco owl, night flyer
Look: a round owl whose body is a crunchy taco shell full of lettuce, cheese and meat, big owl eyes, small beak, little
tomato ear tufts, short wings. Skills: Salsa Bombs (dropped from above), Night Screech (stun), Chip Volley, ultimate
Midnight Fiesta. Voice: see VOICE.md (night-owl party host / DJ, "WHOOO's ready?!", Taco Tuesday obsessed).
Arc (suggested): since the Chef vanished, the kitchen calendar has been stuck on MONDAY, so Taco Tuesday never comes;
the owl sets out to bring the Chef back and with them Taco Tuesday.
Nemesis: **Señor Sting**, a cocky hot-sauce hornet in a tiny sombrero who says the owl's tacos are BLAND and wants to
drown everything in sauce; signature move Triple Sting.
ENDING painting (`still-19-end`): perched at the head of a big happy taco feast at night under string lights, the Monday
calendar page torn off and fluttering away, friends cheering. Intro painting: perched on the calendar stuck on Monday,
by moonlight, an empty taco plate below.

## When done
Run `npx tsc --noEmit` and `npx vitest run tests/voice.test.ts tests/banter.test.ts tests/world.test.ts tests/world5.test.ts tests/world6.test.ts tests/nemesis.test.ts`.
Failures about ART (missing images) or RIGS are expected and not yours; story/voice/banter failures naming your kaiju must
be fixed. Only edit your two files. Don't commit.
