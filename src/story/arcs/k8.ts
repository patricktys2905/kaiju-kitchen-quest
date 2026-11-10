// Chocomunch: main story arc and nemesis scenes (cartoon voice, see docs/VOICE.md).
import type { StoryLine } from '../stories';

export const TITLE = "Don't Melt";
export const TAGLINE = "He's big! He's tough! He's... made of chocolate. Uh-oh!";
/** same keys as STORIES[8].beats except the w{N}-elite and w{N}-s{n} ones */
export const ARC: Record<string, StoryLine[]> = {
  "intro": [["me", "Me Chocomunch! Me strong! Me punch real good! POW!"], ["me", "Me only scared of ONE thing. *gulp* Melting."], ["n", "Uh-oh! The Head Chef left Chocomunch a note: \"Meet me at the Oven.\""], ["me", "OVEN?! Me never go near oven! ...Okay. Me go. Chef is friend."]],
  "w1-open": [["me", "Countertop sunny. Me feel a little soft. Me okay! Me TOTALLY okay!"]],
  "w1-boss": [["boss", "MY BURNERS WILL MELT YOU, CHOCOLATE!"], ["me", "Eep! Me no like this boss. Me PUNCH this boss!"]],
  "w1-after": [["boss", "Wha? Where am I? You fought right next to a burner, little guy? Brave chocolate!"], ["me", "Me VERY scared! Me do it anyway! Hehe!"]],
  "w2-open": [["me", "FRIDGE! Me LOVE fridge! Me nice and crunchy here! Yay!"]],
  "w2-boss": [["boss", "STAY HERE! STAY COLD! STAY FOREVERRRR!"], ["me", "Ooh, tempting. But Chef need Chocomunch! Sorry, big guy!"]],
  "w2-after": [["boss", "Ugh, my head. Here, take some ice with you. For the Oven."], ["me", "Ooh, ice! Me still scared. But me go!"]],
  "w3-open": [["me", "Oven. Hot hot HOT. Me count to ten. One, two, uh, TEN! Okay, me go!"]],
  "w3-boss": [["boss", "FONDUE! I'LL MAKE FONDUE OUT OF YOU!"], ["me", "NO FONDUE! NEVER FONDUE!"]],
  "w3-after": [["n", "Chocomunch is a little drippy round the edges, but still standing!"], ["me", "Me did it! Me in Oven! Me not scared no more! Well, teeny bit scared."], ["boss", "Oof, sorry about the fire breath. The Chef was here, but went up to the Pantry. Hurry!"]],
  "w4-open": [["me", "Ahh, Pantry cool! Me firm again! Me READY!"]],
  "w4-boss": [["boss", "CHOCOLATE COOKIE! THE BEST KIND! CHOMP CHOMP!"], ["me", "Me no cookie! Me FIST! POW!"]],
  "w4-after": [["n", "Look! A note from the Chef: \"Chocomunch, I knew you could do it! Now come to the Sink.\""], ["me", "Sink? Water? Hah! Me okay with water. Water not hot!"], ["mold", "Hehehe... HOT water, little golem. Very hot water."], ["me", "*gulp* Me scared. Me go anyway!"], ["n", "To be continued in World 5: The Sink."]],
};
export const NEMESIS: Record<"w1-elite" | "w2-elite" | "w3-elite" | "w4-elite", StoryLine[]> = {
  "w1-elite": [["foe", "A CHOCOLATE golem? Ooh, this'll be fun! Say hello to my little blowtorch! FWOOSH!"], ["me", "Yikes! Me no like torch!"], ["foe", "Nobody likes the torch, sweetie. That's what makes it FUN! Mwahaha!"]],
  "w2-elite": [["foe", "Cold fridge, hot torch! You can't hide in here forever, golem!"], ["me", "Me no hiding! Me waiting. And now me PUNCHING!"]],
  "w3-elite": [["foe", "The OVEN! Home sweet home! And look, you're already soft, golem! Hehehe!"], ["me", "Me soft. Me still punch! POW!"]],
  "w4-elite": [["foe", "Why aren't you melting?! Everything melts! Even crème brûlée melts!"], ["me", "Me scared of melting. Me MORE scared of friends getting hurt!"], ["foe", "Ugh! That's so annoyingly brave! This isn't over, golem!"]],
};
