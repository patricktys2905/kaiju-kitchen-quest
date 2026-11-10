// The end of Act 1, shared by every kaiju: after its own ending and the credits, a post-credits tease of Act 2's villains,
// THE LEFTOVERS (forgotten foods from the back of the Fridge). 'lo' = Old Fruitcake (their leader), 'lo2' = Sir Stale.
import type { StoryLine } from './stories';

export const HOOK: StoryLine[] = [
  ['n', 'Meanwhile, way at the back of the Fridge, behind the takeaway boxes nobody opens...'],
  ['lo2', 'Boss! BOSS! The Mold Crown got flushed! Our little science project went right down the drain!'],
  ['lo', "Hmph. I've been sittin' back here since LAST Christmas, Sir Stale. I can wait a little longer."],
  ['lo2', 'Yeah! Nobody ever eats the fruitcake! Hahaha! Oh. Oh no. Sorry, boss.'],
  ['lo', 'They pushed us to the back. They forgot all about us. Well, now the whole kitchen is gonna remember...'],
  ['lo', 'THE LEFTOVERS! Mwahahaha!'],
  ['n', 'The adventure continues in Act 2: Beyond the Kitchen!'],
];

/** The end of Act 2: the post-credits tease of what comes next. */
export const HOOK2: StoryLine[] = [
  ['n', 'The next morning, a shiny delivery van rumbles up to the house...'],
  ['n', 'On the doorstep: a golden envelope. "You are invited to... THE GREAT FOOD FESTIVAL!"'],
  ['me', 'A festival?! With MORE food? And MORE friends? Count me in!'],
  ['n', 'The adventure continues! Maybe. Probably. Definitely! THE END of Act 2.'],
];

/** Who says what in the tease (shown as dark silhouettes). */
export const LEFTOVER_NAMES: Record<string, string> = { lo: 'Old Fruitcake', lo2: 'Sir Stale' };
