// Pizzaraptor: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop
  "w1-s2": [["n", "Crumb Trail is packed with monsters. Rush hour."], ["me", "Traffic! Minute four and I'm already stuck in a monster jam."], ["me", "Fine. Raptor Express doesn't sit in traffic. Raptor Express IS the traffic."]],
  "w1-s3": [["me", "Minute seven. Gummy Gully. Do NOT get gummy on the box."], ["me", "Ladle lever up top? Rolling pin, delivered straight to their door. No signature needed."]],
  "w1-s4": [["n", "A little Crumblet tugs at the pizza box. It's lost."], ["me", "Aw, kiddo, I'm on the clock. ...Ugh. Fine. One small passenger. Mind the cheese."], ["me", "Pressure cookers ahead. Hot, angry, about to pop. Kinda like my manager."]],
  "w1-s6": [["n", "The lights go out over the Spice Shelf. Monsters grow bolder in the dark."], ["me", "Pick-up order: one Recipe Scroll, far end, seventy-five seconds. Night surcharge applies."]],
  "w1-s7": [["me", "Minute eighteen. Pepper Pass. Pepperoni's cousins live here. Awkward."], ["me", "Secret key up on a sponge ledge? Shortcuts are basically a delivery raptor's religion."]],
  "w1-s8": [["me", "Hold out forty-five seconds? I do thirty MINUTES for a living."], [5, "Nice box, raptor. Shame if someone... borrowed it."], ["me", "Hands off, Toastbat! Paying customers only!"]],
  "w1-s9": [["me", "Minute twenty-six. Burners ahead. Great for warm cheese. Terrible for raptors."], ["mold", "Mmm... pizza. Leave it out a while, little courier. Let it grow a nice green crust."], ["me", "Ew! That's a one-star review from me!"]],

  // World 2: The Fridge
  "w2-s2": [["me", "Minute thirty-one. Officially late. First time in my whole career."], ["me", "It's fine. The customer is missing. Technically the customer is later than me."]],
  "w2-s3": [["me", "Frosty Shelf. If this box freezes, I'm delivering a pizza-shaped skateboard."], ["me", "Watch the lunchboxes. Anything that wants to be opened this badly is suspicious."]],
  "w2-s4": [["n", "Another lost Crumblet, shivering on Pickle Jar Pier."], ["me", "Kid! Sit on the box, it's warm. Don't eat it. Seriously. Don't eat it."], ["me", "Exit's past the pressure cookers. Escort service at no extra charge. Just this once."]],
  "w2-s6": [["me", "Recipe Scroll pick-up on Egg Carton Cliffs. Seventy-five seconds there, then guard it for 25."], ["me", "Maybe the Chef wrote their address on it. A raptor can dream."]],
  "w2-s7": [["me", "Butter Bridge. Slippery. Perfect for drifting. Wheee— focus, raptor."], ["me", "There's a key to a secret stage on a high ledge. Secret stages are just secret shortcuts. Probably."]],
  "w2-s8": [["me", "Ketchup Canyon. Lots of sauce, zero pizza. Wrong condiment entirely."], [6, "Halt, courier! Is that pizza a tribute for your Lord of Leftovers?"], ["me", "Only if you're the Head Chef, Your Doughiness. Now help me hold this canyon!"]],
  "w2-s9": [["n", "The Ice Tray Steps are swarming. There's a monster on every cube."], ["me", "Like delivering to a whole stadium. Fine. Everybody gets a slice. A slice of CLAW."]],

  // World 3: The Oven
  "w3-s2": [["me", "The Oven! Box on the rack, cheese bubbling. Reheat complete."], ["me", "Minute fifty-eight. I've stopped telling Dispatch."]],
  "w3-s3": [["me", "Muffin Tin Maze. Twelve identical cups. Who designs these addresses?!"], ["me", "If a cereal box says \"part of a balanced breakfast\", it's lying. And it bites."]],
  "w3-s4": [["n", "A Crumblet waves a tiny flag on Casserole Cliffs. It needs a lift."], ["me", "Raptor Express Kids' Edition, back by popular demand! Stay low, the cookers are hot."]],
  "w3-s6": [["foe", "Pineapple Pete Express is grabbing that scroll first, raptor! Tropical speed!"], ["me", "You lost at Meatball Mountain, Pete! Go home and think about your toppings!"]],
  "w3-s7": [["n", "The oven light flickers and dies. Roasting Pan Pass goes dark as burnt crust."], ["me", "No headlights, no problem. I can smell the route. Pepperoni: left. Monster: right."], ["me", "And somewhere up there, a key. Sponge-jumping in the dark. Love that for me."]],
  "w3-s8": [["me", "PIZZA STONE STEPPE. This is basically my ancestral homeland."], ["me", "Forty-five seconds. Lure them into the pressure cookers. Pizza party, monster edition."]],
  "w3-s9": [["me", "Top Rack. Something up there keeps rumbling \"pizza\" in a deep dragon voice."], ["mold", "Every hungry thing in this kitchen is mine, little courier. Even the dragons."], ["me", "Then it can wait in line like everybody else."]],

  // World 4: The Pantry
  "w4-s2": [["me", "Minute one hundred and twelve. If anyone asks, it was a very slow oven."], ["me", "Cereal Canyon. Breakfast food, at dinner time, with a lunch order. My schedule is chaos."]],
  "w4-s3": [["n", "Flour Drifts. The powder crawls with a whole swarm of monsters."], ["me", "Flour, rolling pin, a pile of monsters? That's not a fight. That's a pizza base."]],
  "w4-s4": [["n", "One last lost Crumblet, sitting on a tin can."], ["me", "Climb on, kiddo. Fourth passenger this trip. I'm thinking of buying a bus."], ["me", "Rule of the road: pressure cookers have right of way. They also explode."]],
  "w4-s6": [["me", "Spice Rack Ridge. Oregano, basil, chilli flakes... this is a pizza's spice rack. I'm home."], ["foe", "Psst. Raptor. Scroll's that way. ...What? Even a rival can give directions."], ["me", "Huh. Thanks, Pete. Five-star rival."]],
  "w4-s7": [["me", "Pasta Jar Peaks. Pizza and pasta, together at last. The dream team."], ["me", "Last secret key's up on a sponge ledge. Raptor Express delivers to hard-to-reach places."]],
  "w4-s8": [["me", "Honey Hollow. Forty-five seconds of waves. In honey. My claws are going to be SO sticky."], [10, "Hmph. You're still carrying that box?"], ["me", "A delivery's a promise, Bluebeary. Like you and your Crumblets."]],
  "w4-s9": [["me", "Top Shelf. Minute... I've lost count. Let's say \"thirty\" and never speak of it."], ["me", "Box: warm-ish. Customer: missing. Raptor: still running. Up we go."]],
};

export const QUIPS: Record<QuipKind, string[]> = {
  combo: ["Express combo! Extra cheese!", "Hot and fresh, coming through!", "Slice, slice, SLICE!"],
  lowhp: ["Box is fine! I'm... less fine!", "Pit stop! Sauce leak!", "Keep the cheese hot... ugh..."],
  perfect: ["Swerve! Traffic dodged!", "Missed me! I'm EXPRESS!", "Pothole avoided!"],
  levelup: ["Promotion! Senior Raptor!", "Faster wheels! Er, feet!", "Level up! Tip jar's growing!"],
  secret: ["Bonus tip! Don't mind if I do!", "Secret stash! Shortcuts pay!", "Ooh, a hidden drop-off!"],
  boom: ["Special delivery: KABOOM!", "Rolled flatter than a crust!", "Delivered! Splat on arrival!"],
  mimic: ["This box isn't pizza! Gross!", "Return to sender! It BITES!", "Wrong order! Wrong ORDER!"],
  objective: ["Delivered! Sign here!", "Order complete! Five stars!", "Under thirty sec- er, DONE!"],
};
