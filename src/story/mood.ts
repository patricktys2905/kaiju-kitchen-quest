// Which expression portrait a story line gets (face-<sp>-<mood>), read from the words and punctuation of the line.
// Each mood scores its cue words; the highest wins (ties go shocked > sad > angry > happy); no cues = neutral.
export type Mood = 'happy' | 'angry' | 'shocked' | 'sad' | 'neutral';
export const MOODS: Exclude<Mood, 'neutral'>[] = ['happy', 'angry', 'shocked', 'sad'];

const CUES: [Exclude<Mood, 'neutral'>, RegExp][] = [
  ['shocked', /\?!|!\?|\b(what|wha|whoa|woah|huh|eep|eek|yikes|uh-oh|wait|gasp|oh no|no way|who said|who say|seriously|really\?)\b|\*gulp\*|\*gasp\*/gi],
  ['sad', /\b(sorry|sad|miss|missing|sniff|sob|alone|lonely|lost|cry|crying|scared|afraid|worried|ugh|oof|ow|ouch|tired|sigh|gone|melting|drippy|eww|poor|help me)\b|\*sniff\*|\*sigh\*/gi],
  ['angry', /\b(punch|punching|pow|smash|crush|grr+|hmph|how dare|enough|stop|fight|bonk|snap|snip|pay for|get out|back off|outta|clobber|squash|wallop|thump|bring it|come at me|going down|no more|growl|bully|bullies|whap)\b/gi],
  ['happy', /\b(ha|hah|haha|hahaha|hehe|yay|yes|woo|woohoo|yum|yummy|love|nice|did it|easy|fancy|best|hooray|thanks|thank you|awesome|great|perfect|ta-da|cool|ready|fun|friend|friends|home)\b/gi],
];

export function moodOf(text: string): Mood {
  text = text.replace(/don'?t worry|no worries|not scared/gi, '');
  let best: Mood = 'neutral', top = 0;
  for (const [m, re] of CUES) {
    const n = (text.match(re) ?? []).length;
    if (n > top) { top = n; best = m; }
  }
  if (best === 'neutral' && /!$/.test(text.trim())) return 'happy';
  return best;
}
