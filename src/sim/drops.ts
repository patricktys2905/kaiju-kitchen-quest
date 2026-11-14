// Monster drops (MapleStory style): every monster kind drops its own item, which you pick up and keep in your bag.
// Each map of a stage asks for a number of one monster's drop to open its exit portal (they're handed in as you go
// through); holding a stage's whole set lets you skip straight to its boss room. Icons: drop-<kind> (scripts/drops-jobs.mjs).
import type { MobKind } from './types';

/** monster kind -> [drop name, what the icon shows] */
export const DROPS: Partial<Record<MobKind, [string, string]>> = {
  bun: ['Mouldy Crust', 'a chunk of bread crust with fuzzy green mould spots'], worm: ['Sour Gummy Tail', 'the striped tail end of a sugar-dusted sour gummy worm'],
  ant: ['Sugar Cube', 'a sparkly white sugar cube'], pepper: ['Pepper Seed', 'a few shiny red chilli pepper seeds'], garlic: ['Garlic Clove', 'a single plump garlic clove'],
  egg: ['Rotten Yolk', 'a wobbly greenish egg yolk'], pea: ['Frozen Pea', 'a frosty green pea with ice crystals'], yogurt: ['Yogurt Blob', 'a dollop of pink yogurt'],
  milk: ['Carton Horn', 'a little horn made from a folded milk-carton corner'], icebat: ['Frost Wing', 'a small icy blue bat wing'], carrot: ['Carrot Top', 'a leafy green carrot top'],
  pickle: ['Pickle Brine', 'a tiny corked bottle of green pickle brine'], jelly: ['Jelly Wobble', 'a wobbly cube of lime jelly'], bacon: ['Bacon Strip', 'a crispy curly bacon strip'],
  popcorn: ['Popped Kernel', 'a fluffy popped popcorn kernel'], sausage: ['Sausage Link', 'a short sizzling sausage link'], imp: ['Hot Sauce Drop', 'a glowing red drop of hot sauce'],
  kettle: ['Kettle Whistle', 'a little brass kettle whistle'], meatball: ['Meatball Crumb', 'a small saucy meatball'], marsh: ['Toasty Marshmallow', 'a golden toasted marshmallow'],
  cheerio: ['Cheerio Ring', 'a single golden cereal ring'], flour: ['Flour Puff', 'a soft puff of white flour in a tiny paper twist'], noodle: ['Dry Noodle', 'a small bundle of dry spaghetti'],
  can: ['Can Tab', 'a shiny bent soda-can pull tab'], raisin: ['Raisin', 'a wrinkly purple raisin'], soda: ['Fizz Crystal', 'a white crystal of baking soda, fizzing'],
  plate: ['Plate Shard', 'a curved piece of a white china plate with a blue rim'], bubble: ['Soap Bubble', 'a rainbow soap bubble in a little ring'], mug: ['Mug Handle', 'a broken-off mug handle'],
  eel: ['Drain Eel Fin', 'a slimy grey eel fin'], glove: ['Rubber Finger', 'the yellow fingertip of a rubber kitchen glove'], scrub: ['Steel Wool Tuft', 'a curly tuft of steel wool'],
  fork: ['Fork Prong', 'a single bent silver fork prong'], napkin: ['Napkin Scrap', 'a folded lace napkin scrap'], candle: ['Candle Wax', 'a drip of warm candle wax'],
  gravy: ['Gravy Drop', 'a glossy brown gravy droplet'], teapot: ['Tea Leaf', 'a curled green tea leaf'], roast: ['Roast Crackling', 'a crunchy piece of roast crackling'],
  beetle: ['Kebab Shell', 'a shiny grilled beetle shell plate'], wasp: ['Wasp Stinger', 'a striped yellow-black wasp stinger'], ketchup: ['Ketchup Cap', 'a red ketchup bottle cap'],
  charcoal: ['Charcoal Chunk', 'a glowing charcoal briquette'], corn: ['Corn Kernel', 'a buttery yellow corn kernel'], patty: ['Bun Top', 'a sesame-seed burger bun top'],
  snail: ['Lettuce Leaf', 'a crisp green lettuce leaf'], ladybug: ['Ladybug Spot', 'a red shell piece with a black spot'], peapod: ['Pea Pod', 'an empty green pea pod'],
  mole: ['Potato Peel', 'a curly potato peel'], tomato: ['Tomato Slice', 'a juicy tomato slice'], radish: ['Radish Root', 'a little red radish with its root'],
  pumpkin: ['Pumpkin Seed', 'a flat cream pumpkin seed'], trolley: ['Trolley Wheel', 'a tiny grey trolley wheel'], bag: ['Bag Handle', 'a plastic shopping-bag handle loop'],
  banana: ['Banana Peel', 'a spotty banana peel'], scanner: ['Barcode Sticker', 'a small barcode sticker (no readable numbers)'], can2: ['Can Lid', 'a round dented tin-can lid'],
  melon: ['Melon Seed', 'a shiny black watermelon seed'], cherrysoldier: ['Candied Cherry', 'a glossy red candied cherry'], peel: ['Candied Peel', 'a strip of orange candied peel'],
  jamhop: ['Jam Glob', 'a glossy red blob of strawberry jam'],
  salt: ['Salt Crystal', 'a sparkly white salt crystal'],
  cheesemouse: ['Cheese Crumb', 'a small wedge of holey yellow cheese'],
  icepop: ['Popsicle Stick', 'a wooden popsicle stick with a melted rainbow tip'],
  crumbcube: ['Burnt Crouton', 'a crunchy golden crouton cube'],
  mitt: ['Mitt Thread', 'a little spool of red quilted thread'],
  bee: ['Bee Wing', 'a shiny translucent bee wing'],
  cracker: ['Cracker Shard', 'a broken corner of a salted cracker'],
  duck: ['Ducky Squeaker', 'a little rubber squeaker'],
  straw: ['Straw Bit', 'a short striped bendy straw piece'],
  teacake: ['Sprinkles', 'a little pile of rainbow sprinkles'],
  ladle: ['Ladle Bowl', 'a small shiny silver ladle bowl'],
  skewer: ['Pepper Chunk', 'a chunk of grilled bell pepper'],
  firefly: ['Ember Glow', 'a glowing little ember in a tiny jar'],
  caterpillar: ['Silk Thread', 'a small bundle of silky white thread'],
  toadstool: ['Mushroom Cap', 'a red spotted mushroom cap'],
  coupon: ['Coupon Scrap', 'a torn paper coupon corner with dotted lines (no text)'],
  boxbot: ['Tape Strip', 'a curled strip of brown packing tape'],
  pudding: ['Pudding Spoon', 'a tiny silver dessert spoon with chocolate on it'],
  cracker2: ['Paper Crown', 'a folded yellow paper party crown'],
  // World 11: The Midway
  cadet: ['Paper Hat', 'a folded paper soldier hat with a red stripe'], toffee: ['Toffee Shard', 'a glossy amber shard of cracked toffee'],
  floss: ['Floss Puff', 'a small pink puff of candy floss'], snowcone: ['Syrup Drop', 'a bright blue drop of snow-cone syrup'],
  bumper: ['Rubber Bumper', 'a curved black rubber bumper strip'], churro: ['Cinnamon Sugar', 'a little heap of sparkly cinnamon sugar'],
  coconut: ['Coconut Shell', 'half a hairy brown coconut shell'], pretzel: ['Lucky Ring', 'a small golden toss ring'],
  jawbreaker: ['Jawbreaker Chip', 'a rainbow-layered chip of a jawbreaker'],
  fruitknight: ['Fruitcake Chunk', 'a chunk of dark fruitcake'], mimic: ['Lunchbox Latch', 'a blue plastic lunchbox latch'], cereal: ['Cereal Prize', 'a tiny toy prize from a cereal box'],
};
export const dropName = (k: MobKind): string => DROPS[k]?.[0] ?? 'Monster Bit';
export const dropIcon = (k: MobKind): string => `drop-${k}`;
/** How often a monster drops its item (the map's quest monster: more, and never 3 misses in a row). */
export const DROP_CHANCE = 0.2, QUEST_DROP_CHANCE = 0.55;
/** The 'never wanted' kinds (no story exit asks for their drop: shooters, healers, summoners, mimics...) drop more often,
 *  so the Monster Cookbook can be filled without a five-minute hunt. Which kinds those are is worked out from the stages
 *  in sim/cookbook.ts (`neverWantedKinds`, `baseDropChance`), so a new world is classified by itself. */
export const SPARE_DROP_CHANCE = 0.35;
