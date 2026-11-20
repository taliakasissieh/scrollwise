// Sample creators and posts for the ScrollWise feed. Every creator and post here is fictional.
//
// Pictures: the feed only shows photographs. A post appears once a picture exists for it:
//   - a licensed photo listed in photos/credits.json (set `photo: 'its-id'`), or
//   - an image file named after the post in photos/ai/, e.g. photos/ai/post-mirror-fit.jpg
//     (extra carousel photos: post-mirror-fit-2.jpg, post-mirror-fit-3.jpg …).
// Posts without a picture are skipped, so the feed never shows a drawing. See PHOTOS.md.
//
// Each post has:
//   cat    which section it belongs to (see CATEGORIES). The feed mixes the sections evenly.
//   ratio  '4:5' (default, portrait), '1:1' (square) or '3:2' (landscape)
//   more   how many extra carousel photos it can have (each one is optional), described in `slides`
// Posting times ("2 hours ago") are worked out from each post's place in the feed.
import { photo } from '../lib/library.js';

export const CATEGORIES = {
  friends: 'Friends & everyday',
  style: 'Fashion & beauty',
  food: 'Food & cafés',
  pets: 'Pets & funny moments',
  travel: 'Travel & lifestyle',
  hobbies: 'Sports, music & hobbies',
};

// avatar: [photo id, x %, y %, zoom] crops a licensed photo into a profile picture.
// Otherwise a profile picture comes from photos/ai/avatar-<username>.jpg, or shows the creator's initial.
export const CREATORS = {
  'jun.wears': { name: 'Jun Park', topic: 'Fashion', hue: 18, bio: 'fit pics, thrift hauls and an unreasonable number of jackets' },
  'chloe.styled': { name: 'Chloé Martin', topic: 'Style', hue: 350, bio: 'vintage bags, good coats, bad weather' },
  'glambyrania': { name: 'Rania Saleh', topic: 'Beauty', hue: 330, bio: 'makeup, nails and hair experiments. GRWM every friday' },
  'omar.fades': { name: 'Omar Saidi', topic: 'Barber', hue: 210, bio: 'barber. fades, beards and terrible jokes. chair’s open saturdays' },
  'lina.reads': { name: 'Lina Petrova', topic: 'Books', hue: 32, avatar: ['cat', 35, 42, 1.7], bio: 'english lit student. full-time assistant to biscuit the cat' },
  'zaid.eats': { name: 'Zaid Mansour', topic: 'Food', hue: 8, avatar: ['coffee', 47, 36, 1.5], bio: 'will travel 40 minutes for a good croissant. café reviews nobody asked for' },
  'mei.eats.out': { name: 'Mei Lin', topic: 'Food', hue: 12, bio: 'eating my way across the city, one noodle at a time. ratings are final' },
  'priya.bakes': { name: 'Priya Nair', topic: 'Baking', hue: 36, bio: 'home baker. 60% success rate. the other 40% still gets eaten' },
  'wild.atlas': { name: 'Noor Haddad', topic: 'Travel', hue: 200, avatar: ['summer-palace', 26, 38, 1.8], bio: 'carry-on only. 23 countries, 1 suitcase' },
  'aisha.abroad': { name: 'Aisha Bello', topic: 'Travel', hue: 170, bio: 'slow travel, long train rides and too many photos of windows' },
  'goldenhour.gabe': { name: 'Gabe Silva', topic: 'Sunsets', hue: 28, bio: 'i just post the sky. that’s it. that’s the account' },
  'greenhouse.ivy': { name: 'Ivy Chen', topic: 'Plants', hue: 140, avatar: ['dahlia', 47, 50, 1.7], bio: '31 houseplants, 1 tiny flat, zero floor space' },
  'orbit.notes': { name: 'Elif Arslan', topic: 'Space', hue: 240, avatar: ['deep-field', 50, 55, 1.6], bio: 'space facts + NASA and public-domain pictures. watches every launch live' },
  'kai.hoops': { name: 'Kai Nakamura', topic: 'Basketball', hue: 24, bio: 'pickup runs, sneaker talk, 6\'1" on a good day' },
  'matchday.dani': { name: 'Dani Russo', topic: 'Football', hue: 350, bio: 'home and away. scarf collection is getting out of hand' },
  'waffles.the.corgi': { name: 'Waffles the Corgi', topic: 'Pets', hue: 40, bio: 'short legs, big opinions. run by my human @its.hana.k' },
  'pepper.and.plum': { name: 'Pepper & Plum', topic: 'Pets', hue: 265, bio: 'two cats, one box, constant conflict. human: sara' },
  'ellis.drives': { name: 'Ellis Grant', topic: 'Cars', hue: 160, bio: 'old cars, night drives, sunday car meets' },
  'low.tide.audio': { name: 'Theo Brennan', topic: 'Music', hue: 270, bio: 'gig photos, record digging, bass in a band you haven\'t heard of yet' },
  'sofs.room': { name: 'Sofia Lind', topic: 'Home', hue: 30, bio: 'tiny flat, big plans. secondhand furniture and fairy lights' },
  'amara.ok': { name: 'Amara Mensah', topic: 'Friends', hue: 290, bio: 'photo dumps, birthdays and general chaos with the girls' },
  'yasmin.daily': { name: 'Yasmin Aziz', topic: 'Everyday', hue: 300, bio: 'uni, iced coffee, running late. in that order' },
  'the.lucas.files': { name: 'Lucas Moreno', topic: 'Everyday', hue: 100, bio: 'three roommates, one frying pan. documenting the chaos' },
  'sam.ortiz': { name: 'Sam Ortiz', topic: 'Beach', hue: 190, bio: 'surf at dawn, tacos at dusk' },
  'mira.lens': { name: 'Mira Okafor', topic: 'City', hue: 220, bio: 'the city after dark. shooting film when i can afford it' },
  'reel.ben': { name: 'Ben Kowalski', topic: 'Movies', hue: 0, bio: 'watches too many movies and ranks every single one' },
  'its.hana.k': { name: 'Hana Kim', topic: 'Everyday', hue: 50, bio: 'professional overthinker. owner of @waffles.the.corgi' },
};

export const DEFAULT_FOLLOWS = ['amara.ok', 'lina.reads', 'zaid.eats', 'its.hana.k', 'kai.hoops', 'yasmin.daily'];

export const ALL_POSTS = [
  /* ---------------- friends & everyday (20) ---------------- */
  {
    id: 'birthday-dinner', cat: 'friends', user: 'amara.ok', more: 2, likes: 1840,
    caption: 'another year older, zero years wiser 🎂 thank you for the best night, i love you all. swipe for the cake situation',
    alt: 'Four friends laughing around a candlelit table while a young woman with box braids blows out the candles on a sprinkle birthday cake',
    slides: ['A homemade sprinkle birthday cake with candles', 'Gold and pink balloons taped to a living room wall'],
    comments: [['its.hana.k', 'happy birthday!! 🎉'], ['amara.ok', '@its.hana.k you made the cake, you’re not allowed to roast it'], ['sofs.room', 'best night ever 😍']],
  },
  {
    id: 'ferris-wheel', cat: 'friends', user: 'amara.ok', more: 1, place: 'Summer fair', likes: 2388,
    caption: 'the screaming you can’t hear in this photo is all him 🎡 he said the ferris wheel was “too high”',
    alt: 'Three friends squeezed into a selfie at a fairground at dusk with a lit-up ferris wheel behind them, one pulling a face',
    slides: ['Two friends sharing pink candy floss at the fair'],
    comments: [['its.hana.k', 'the face 😭'], ['amara.ok', '@its.hana.k i have video of the whole ride'], ['kai.hoops', 'next time invite me']],
  },
  {
    id: 'karaoke', cat: 'friends', user: 'amara.ok', likes: 1977,
    caption: 'we were not good. we were LOUD. there’s a difference 🎤',
    alt: 'Two friends singing into microphones in a karaoke room lit with pink and blue lights',
    comments: [['yasmin.daily', 'the high note at 1am 💀'], ['low.tide.audio', 'hire me as your bassist']],
  },
  {
    id: 'picnic', cat: 'friends', user: 'yasmin.daily', more: 1, place: 'Hill Park', likes: 1204,
    caption: 'everyone brought “just snacks” and somehow we had enough food for 30 people',
    alt: 'A picnic blanket in a park covered in fruit, crisps and drinks, with friends’ legs and hands around it',
    slides: ['Friends lying on the grass laughing, seen from above'],
    comments: [['amara.ok', 'the strawberries were elite'], ['priya.bakes', 'did the lemon bars survive?'], ['yasmin.daily', '@priya.bakes they did not survive. they were eaten in 3 minutes']],
  },
  {
    id: 'study-night', cat: 'friends', user: 'yasmin.daily', likes: 866,
    caption: 'library at 10pm. three coffees in. essay is 40% done and so am i',
    alt: 'A library desk at night with an open laptop, highlighted notes and a paper coffee cup',
    comments: [['lina.reads', 'solidarity'], ['the.lucas.files', 'go home yasmin']],
  },
  {
    id: 'roommate-dinner', cat: 'friends', user: 'the.lucas.files', ratio: '3:2', likes: 2310,
    caption: 'three roommates, one frying pan, zero plan. somehow it was edible',
    alt: 'Three young men squeezed into a tiny kitchen cooking together, steam rising from a frying pan',
    comments: [['zaid.eats', 'what were you making'], ['the.lucas.files', '@zaid.eats we called it “stir fry”. it was not stir fry']],
  },
  {
    id: 'game-night', cat: 'friends', user: 'the.lucas.files', ratio: '1:1', likes: 1145,
    caption: 'game night ended friendships. we’re all still here though',
    alt: 'Friends playing cards around a coffee table covered in snacks and drinks',
    comments: [['yasmin.daily', 'you cheated and you know it'], ['the.lucas.files', '@yasmin.daily allegedly']],
  },
  {
    id: 'beach-jump', cat: 'friends', user: 'amara.ok', ratio: '3:2', place: 'Shell Bay', likes: 3022,
    caption: 'took 41 tries to get everyone in the air at the same time. worth it',
    alt: 'Four friends jumping in the air on a beach at golden hour, the sea behind them',
    comments: [['sam.ortiz', 'perfect timing'], ['goldenhour.gabe', 'that light 🧡']],
  },
  {
    id: 'bonfire', cat: 'friends', user: 'sam.ortiz', ratio: '3:2', likes: 2156,
    caption: 'someone brought a guitar and only knew half of one song. we sang it six times',
    alt: 'Friends sitting around a small bonfire on a beach at night, faces lit orange',
    comments: [['low.tide.audio', 'which half'], ['amara.ok', 'best night of the summer']],
  },
  {
    id: 'first-snow', cat: 'friends', user: 'its.hana.k', likes: 1789,
    caption: 'first snow. i am 100% the person who stops to take a photo every single time',
    alt: 'A quiet residential street covered in fresh snow with footprints and a glowing streetlight',
    comments: [['waffles.the.corgi', 'i ate some'], ['mira.lens', 'gorgeous']],
  },
  {
    id: 'new-keys', cat: 'friends', user: 'sofs.room', likes: 3410,
    caption: 'got the keys!! tiny flat, slightly crooked door, all mine 🗝️',
    alt: 'A hand holding a set of keys in front of a wooden apartment door',
    comments: [['greenhouse.ivy', 'plant delivery incoming'], ['amara.ok', 'housewarming when'], ['sofs.room', '@amara.ok when i own a second chair']],
  },
  {
    id: 'sunday-market', cat: 'friends', user: 'sofs.room', likes: 998,
    caption: 'went for bread, came back with flowers. every single sunday',
    alt: 'Buckets of bright tulips and peonies at an outdoor flower stall',
    comments: [['greenhouse.ivy', 'the peonies!!'], ['chloe.styled', 'this is the way']],
  },
  {
    id: 'laundromat', cat: 'friends', user: 'its.hana.k', likes: 1350,
    caption: 'laundromat at 11pm hits different. main character energy, minus the plot',
    alt: 'A laundromat at night with rows of round washing machines and fluorescent lights',
    comments: [['reel.ben', 'this is a movie opening shot'], ['mira.lens', 'love the colours']],
  },
  {
    id: 'bowling', cat: 'friends', user: 'yasmin.daily', ratio: '3:2', likes: 742,
    caption: 'scored 64. got a strike once and celebrated like i won the lottery',
    alt: 'A bowling alley lane with friends cheering as the ball rolls towards the pins',
    comments: [['the.lucas.files', '64 is a respectable number'], ['kai.hoops', 'rematch']],
  },
  {
    id: 'dahlia', cat: 'friends', user: 'greenhouse.ivy', photo: 'dahlia', ratio: '3:2', likes: 1121,
    caption: 'the dahlia i was told would never bloom: bloomed. announced it to the entire flat like breaking news 🌸',
    alt: 'A peach-coloured dahlia in front of dark green leaves',
    comments: [['sofs.room', 'as you should'], ['lina.reads', 'congratulations to the plant']],
  },
  {
    id: 'room-glowup', cat: 'friends', user: 'sofs.room', more: 2, likes: 4120,
    caption: 'room before & after 🛋️ everything except the bed was secondhand. total spend: less than my phone bill',
    alt: 'A cosy bedroom corner with fairy lights, a rattan chair, plants and framed prints above a made bed',
    slides: ['The same bedroom before: bare walls and moving boxes on the floor', 'A thrifted lamp and a stack of books on a wooden nightstand'],
    comments: [['greenhouse.ivy', 'needs more plants tbh'], ['sofs.room', '@greenhouse.ivy you say this about every room'], ['amara.ok', 'moving in']],
  },
  {
    id: 'cinema', cat: 'friends', user: 'reel.ben', ratio: '1:1', likes: 902,
    caption: 'two hours forty-seven minutes. no regrets. the popcorn did not survive the trailers',
    alt: 'A big tub of popcorn and two paper cinema tickets on a red velvet seat',
    comments: [['lina.reads', 'review??'], ['reel.ben', '@lina.reads 8.5/10. a bit long. the soundtrack was unreal'], ['its.hana.k', 'you finished the popcorn in the ads didn’t you']],
  },
  {
    id: 'book-haul', cat: 'friends', user: 'lina.reads', more: 1, likes: 1903,
    caption: 'went in for one book. you know how this ends',
    alt: 'A stack of new books on a white duvet with a tabby cat’s paw reaching into the frame',
    slides: ['A cosy bookshop aisle with tall wooden shelves and a reading chair'],
    comments: [['reel.ben', 'any of these getting movies?'], ['lina.reads', '@reel.ben two of them, and i will be complaining about both']],
  },
  {
    id: 'plant-shelf', cat: 'friends', user: 'greenhouse.ivy', likes: 1309,
    caption: 'new shelf, new plants, same amount of floor space (none)',
    alt: 'A sunny window shelf packed with houseplants in terracotta pots',
    comments: [['sofs.room', 'jungle core'], ['greenhouse.ivy', '@sofs.room it’s a lifestyle']],
  },
  {
    id: 'movie-marathon', cat: 'friends', user: 'reel.ben', ratio: '3:2', likes: 1276,
    caption: 'three movies, one blanket fort, zero plans. ranking them in the comments',
    alt: 'A living room at night lit by the TV, a blanket fort on the sofa and snacks on the coffee table',
    comments: [['its.hana.k', 'blanket fort supremacy'], ['reel.ben', '1. the heist one 2. the space one 3. the one where the dog was in it for six seconds']],
  },

  /* ---------------- fashion & beauty (15) ---------------- */
  {
    id: 'mirror-fit', cat: 'style', user: 'jun.wears', more: 2, likes: 2210,
    caption: 'fit check before the gallery thing tonight. the jacket was $14 at the flea market and i am still not over it',
    alt: 'Mirror selfie of a young man in a brown suede jacket, white tee and wide grey trousers',
    slides: ['Close-up of chunky white sneakers on a wooden floor', 'The suede jacket hanging on the back of a bedroom door'],
    comments: [['glambyrania', '$14??? where'], ['jun.wears', '@glambyrania sunday market, back corner, the guy with all the hats'], ['amara.ok', 'serving']],
  },
  {
    id: 'thrift-haul', cat: 'style', user: 'jun.wears', ratio: '1:1', likes: 1688,
    caption: 'thrift haul 🧥 the cardigan was in the "damaged" bin and it has ONE loose button',
    alt: 'Clothes on hangers held up in a thrift shop: a chunky green cardigan, a striped shirt and a denim jacket',
    comments: [['sofs.room', 'the cardigan!!'], ['glambyrania', 'how do you always find the good stuff']],
  },
  {
    id: 'layers', cat: 'style', user: 'jun.wears', likes: 1532,
    caption: 'it was 9 degrees so naturally i wore four layers and still complained',
    alt: 'A young man walking down an autumn street in a long coat, hoodie and scarf, leaves on the pavement',
    comments: [['chloe.styled', 'the coat 👏'], ['mira.lens', 'candid king']],
  },
  {
    id: 'grwm', cat: 'style', user: 'glambyrania', more: 1, likes: 3412,
    caption: 'soft glam for a friday that did not deserve this much effort ✨ products in the comments if anyone wants them',
    alt: 'Close-up selfie of a young woman with soft brown eyeshadow, glossy lips and a sleek bun in warm window light',
    slides: ['Makeup products and a claw clip scattered on a bathroom counter'],
    comments: [['amara.ok', 'SKIN'], ['glambyrania', '@amara.ok it is 90% the lighting not gonna lie'], ['jun.wears', 'the bun is so clean']],
  },
  {
    id: 'nails', cat: 'style', user: 'glambyrania', ratio: '1:1', likes: 1529,
    caption: 'new set. yes i will be typing like this for three weeks 💅',
    alt: 'A hand with glossy chrome almond nails holding a cup of iced coffee',
    comments: [['amara.ok', 'chrome era'], ['zaid.eats', 'the iced coffee is also a 10']],
  },
  {
    id: 'red-lip', cat: 'style', user: 'glambyrania', likes: 2870,
    caption: 'tried a red lip for the first time in a year and remembered why i love it 💋',
    alt: 'A smiling young woman with a classic red lip and soft winged liner, photographed in daylight by a window',
    comments: [['chloe.styled', 'classic for a reason'], ['yasmin.daily', 'teach me']],
  },
  {
    id: 'curls', cat: 'style', user: 'glambyrania', likes: 2244,
    caption: 'wash day results. 2 hours, 4 products, 1 diffuser, 0 patience. they behaved though',
    alt: 'The back of a young woman’s head with defined, bouncy curly hair in soft daylight',
    comments: [['amara.ok', 'the definition!!'], ['glambyrania', '@amara.ok it took a whole podcast episode']],
  },
  {
    id: 'skincare-shelf', cat: 'style', user: 'glambyrania', ratio: '1:1', likes: 1018,
    caption: 'shelf reset. yes i will use all of these. no i will not be taking questions',
    alt: 'A tidy bathroom shelf with glass skincare bottles, a small plant and a rolled towel',
    comments: [['sofs.room', 'so satisfying'], ['greenhouse.ivy', 'the plant approves']],
  },
  {
    id: 'sunday-fit', cat: 'style', user: 'chloe.styled', more: 2, place: 'Old Town', likes: 3655,
    caption: 'dimanche. long coat, loafers, and a croissant somewhere out of frame 🥐',
    alt: 'A young woman in a camel coat, white shirt and loafers walking past a café on a cobbled street',
    slides: ['Close-up of brown leather loafers and white socks on cobblestones', 'A small leather shoulder bag on a café table next to a coffee'],
    comments: [['jun.wears', 'the coat!!'], ['zaid.eats', 'which café is that'], ['chloe.styled', '@zaid.eats the one with the blue awning, obviously']],
  },
  {
    id: 'vintage-bag', cat: 'style', user: 'chloe.styled', ratio: '1:1', likes: 2103,
    caption: 'flea market find of the year. the man said “it’s old” and i said “perfect”',
    alt: 'A vintage brown leather handbag held up at a flea market stall full of second-hand bags',
    comments: [['jun.wears', 'jealous'], ['amara.ok', 'how much??'], ['chloe.styled', '@amara.ok i will never tell']],
  },
  {
    id: 'sunnies', cat: 'style', user: 'chloe.styled', likes: 1890,
    caption: 'new sunglasses, same face. the beach did most of the work',
    alt: 'A young woman in oval sunglasses and a striped shirt smiling on a sunny beach promenade',
    comments: [['sam.ortiz', 'which beach'], ['goldenhour.gabe', 'that sky']],
  },
  {
    id: 'rings', cat: 'style', user: 'jun.wears', ratio: '1:1', likes: 977,
    caption: 'ring count went from 2 to 7 this year and i have no plans to stop',
    alt: 'Close-up of a hand wearing several chunky silver rings resting on a denim jacket',
    comments: [['chloe.styled', 'the stacking 👌'], ['omar.fades', 'clean']],
  },
  {
    id: 'dress-fitting', cat: 'style', user: 'amara.ok', more: 1, likes: 2561,
    caption: 'wedding guest dilemma. left or right? (swipe) be honest, i can take it',
    alt: 'A young woman taking a mirror selfie in a changing room wearing a green satin dress',
    slides: ['The same young woman in the changing room mirror wearing a navy floral dress'],
    comments: [['glambyrania', 'GREEN'], ['yasmin.daily', 'green, no question'], ['chloe.styled', 'green, with gold earrings']],
  },
  {
    id: 'fresh-cut', cat: 'style', user: 'omar.fades', likes: 1432,
    caption: 'fresh fade friday ✂️ he came in asking for “a trim”. we did not trim',
    alt: 'A young man in a barber chair seen in the mirror with a sharp fresh fade haircut',
    comments: [['kai.hoops', 'booking for saturday'], ['omar.fades', '@kai.hoops 11am, don’t be late again']],
  },
  {
    id: 'barber-chair', cat: 'style', user: 'omar.fades', ratio: '3:2', likes: 688,
    caption: 'monday morning, shop’s quiet, coffee’s on. the calm before the saturday storm',
    alt: 'An empty vintage barber chair in a sunny barbershop with mirrors and combs on the counter',
    comments: [['zaid.eats', 'what coffee are we talking'], ['ellis.drives', 'love that chair']],
  },

  /* ---------------- food & cafés (15) ---------------- */
  {
    id: 'espresso', cat: 'food', user: 'zaid.eats', photo: 'coffee', ratio: '3:2', likes: 731,
    caption: 'new café rating system: if the table wobbles but the espresso is perfect, it’s a 9/10. this one’s a 9/10 ☕',
    alt: 'A small espresso cup on a red saucer on a wooden café table',
    comments: [['lina.reads', 'drop the name 👀'], ['zaid.eats', '@lina.reads gatekeeping this one, sorry']],
  },
  {
    id: 'pasta-night', cat: 'food', user: 'zaid.eats', more: 1, likes: 2240,
    caption: 'the waiter said “trust me” and i did. best decision of my week 🍝 swipe for dessert',
    alt: 'A plate of rigatoni in red sauce with basil and parmesan on a checked tablecloth',
    slides: ['A tiramisu in a small glass dish dusted with cocoa'],
    comments: [['amara.ok', 'need this now'], ['zaid.eats', '@amara.ok friday? my treat (you’re paying)']],
  },
  {
    id: 'latte-art', cat: 'food', user: 'zaid.eats', ratio: '1:1', likes: 1180,
    caption: 'the barista drew a heart. i drew a conclusion: i live here now',
    alt: 'A latte with a heart in the foam in a white cup on a marble café table',
    comments: [['yasmin.daily', 'cutest'], ['priya.bakes', 'and no pastry? suspicious']],
  },
  {
    id: 'croissants', cat: 'food', user: 'zaid.eats', likes: 1764,
    caption: 'bought one croissant for now and one for later. there is no later',
    alt: 'Golden flaky croissants in an open paper bag on a bakery counter',
    comments: [['chloe.styled', 'there is never a later'], ['priya.bakes', 'the lamination 😮']],
  },
  {
    id: 'ramen', cat: 'food', user: 'mei.eats.out', likes: 3320,
    caption: 'rating: 9.5/10. lost half a point because i burned my tongue, which is my fault, but still',
    alt: 'A steaming bowl of ramen with a soft egg, pork, spring onions and nori on a wooden counter',
    comments: [['zaid.eats', 'where??'], ['mei.eats.out', '@zaid.eats tiny place by the station, 8 seats, worth the queue']],
  },
  {
    id: 'dumplings', cat: 'food', user: 'mei.eats.out', ratio: '1:1', likes: 2014,
    caption: 'ordered 12 dumplings “to share”. did not share',
    alt: 'Dumplings in a bamboo steamer with chopsticks and a small dish of dipping sauce',
    comments: [['the.lucas.files', 'valid'], ['amara.ok', 'sharing is overrated']],
  },
  {
    id: 'night-market', cat: 'food', user: 'mei.eats.out', place: 'Night market', likes: 2675,
    caption: 'night market loop: skewers, bao, something fried on a stick i couldn’t identify. all 10/10',
    alt: 'A busy night market food stall with skewers grilling over flames and warm hanging lights',
    comments: [['wild.atlas', 'the atmosphere!!'], ['mei.eats.out', '@wild.atlas the smoke is half the flavour']],
  },
  {
    id: 'tacos', cat: 'food', user: 'sam.ortiz', ratio: '3:2', likes: 1590,
    caption: 'post-surf tacos are a food group',
    alt: 'Three tacos with lime wedges on a paper plate at a food truck counter at sunset',
    comments: [['mei.eats.out', 'the salsa looks perfect'], ['zaid.eats', 'adding to the list']],
  },
  {
    id: 'sourdough', cat: 'food', user: 'priya.bakes', likes: 1412,
    caption: 'attempt #11. it has an ear. it has a crumb. i am emotional 🍞',
    alt: 'A rustic sourdough loaf cut open on a wooden board showing an open crumb',
    comments: [['zaid.eats', 'that crumb!!'], ['priya.bakes', '@zaid.eats attempts 1–10 are not up for discussion']],
  },
  {
    id: 'cinnamon-rolls', cat: 'food', user: 'priya.bakes', ratio: '1:1', likes: 1987,
    caption: 'house smells incredible. roommates have formed a queue',
    alt: 'A baking tray of gooey cinnamon rolls with icing dripping down the sides',
    comments: [['the.lucas.files', 'can i join the queue'], ['yasmin.daily', 'save me one PLEASE']],
  },
  {
    id: 'cake-decorating', cat: 'food', user: 'priya.bakes', more: 1, likes: 2380,
    caption: 'my sister’s birthday cake, mid-build. swipe for the finished thing (and the frosting on my elbow)',
    alt: 'Hands piping pink buttercream onto a layer cake on a turntable in a home kitchen',
    slides: ['The finished pink layer cake with fresh berries on top, on a kitchen counter'],
    comments: [['amara.ok', 'the piping!!'], ['glambyrania', 'make me one'], ['priya.bakes', '@glambyrania what flavour 👀']],
  },
  {
    id: 'brunch', cat: 'food', user: 'yasmin.daily', more: 1, likes: 1655,
    caption: 'brunch with the girls = 2 hours of talking and 15 minutes of eating',
    alt: 'Overhead view of a café table with pancakes, avocado toast, eggs and iced coffees, hands reaching in',
    slides: ['A stack of pancakes with berries and syrup'],
    comments: [['amara.ok', 'best morning'], ['zaid.eats', 'the pancakes look perfect']],
  },
  {
    id: 'iced-matcha', cat: 'food', user: 'yasmin.daily', likes: 1022,
    caption: 'iced matcha by the window. i am pretending to study',
    alt: 'An iced matcha latte in a glass by a café window, an open notebook blurred behind',
    comments: [['lina.reads', 'pretending is half the work'], ['zaid.eats', 'how was it'], ['yasmin.daily', '@zaid.eats 8/10, a bit sweet']],
  },
  {
    id: 'burger-night', cat: 'food', user: 'the.lucas.files', ratio: '3:2', likes: 1433,
    caption: 'diner burger at 11pm with the boys. cardiologist, look away',
    alt: 'A cheeseburger with fries and a milkshake on a diner table with red booth seats',
    comments: [['mei.eats.out', 'rating?'], ['the.lucas.files', '@mei.eats.out 8/10, the milkshake carried']],
  },
  {
    id: 'pizza-floor', cat: 'food', user: 'the.lucas.files', ratio: '1:1', likes: 1290,
    caption: 'moved the sofa out, forgot to move it back in. pizza on the floor it is',
    alt: 'Open pizza boxes on a living room floor with friends sitting around them',
    comments: [['sofs.room', 'interior design?'], ['the.lucas.files', '@sofs.room minimalism']],
  },

  /* ---------------- pets & funny moments (10) ---------------- */
  {
    id: 'biscuit-judges', cat: 'pets', user: 'lina.reads', photo: 'cat', ratio: '3:2', likes: 6103,
    caption: 'biscuit has reviewed my reading list and would like to speak to the manager',
    alt: 'Close-up of a tabby cat with green eyes',
    comments: [['its.hana.k', 'the side eye 😭'], ['waffles.the.corgi', 'respectfully, woof'], ['reel.ben', 'a critic. a true critic.']],
  },
  {
    id: 'zoomies', cat: 'pets', user: 'waffles.the.corgi', place: 'Shell Bay', likes: 8924,
    caption: 'first time at the beach. ran directly into the sea. regrets nothing 🌊🐾',
    alt: 'A corgi sprinting across wet sand at the edge of the waves, ears flapping',
    comments: [['sam.ortiz', 'surf buddy?? 🏄'], ['its.hana.k', 'he was sandy for three days'], ['lina.reads', 'biscuit could never']],
  },
  {
    id: 'bath-day', cat: 'pets', user: 'waffles.the.corgi', ratio: '1:1', likes: 9530,
    caption: 'bath day. i have been betrayed by the people i love most',
    alt: 'A damp corgi wrapped in a striped towel looking sulky on a bathroom floor',
    comments: [['lina.reads', 'protect him'], ['its.hana.k', 'he got a treat after, he is being dramatic']],
  },
  {
    id: 'stolen-sock', cat: 'pets', user: 'waffles.the.corgi', likes: 7012,
    caption: 'found a sock. it is my sock now. this is not up for debate',
    alt: 'A corgi lying on a rug proudly holding a striped sock in its mouth',
    comments: [['pepper.and.plum', 'amateur. we steal hair ties'], ['its.hana.k', 'that is my FAVOURITE sock']],
  },
  {
    id: 'one-box', cat: 'pets', user: 'pepper.and.plum', ratio: '1:1', likes: 6640,
    caption: 'we were given two boxes. we chose one. together. aggressively',
    alt: 'A black cat and a grey cat squeezed into one small cardboard box on a wooden floor',
    comments: [['waffles.the.corgi', 'i would also fit'], ['lina.reads', 'biscuit would never share']],
  },
  {
    id: 'laptop-cat', cat: 'pets', user: 'pepper.and.plum', likes: 4385,
    caption: 'sara had a deadline. plum had other plans',
    alt: 'A grey cat asleep across a laptop keyboard on a desk',
    comments: [['yasmin.daily', 'this is my life'], ['pepper.and.plum', '@yasmin.daily plum says you’re welcome']],
  },
  {
    id: 'ice-cream', cat: 'pets', user: 'its.hana.k', likes: 3150,
    caption: 'me vs the sun. the sun won',
    alt: 'A hand holding a waffle cone of strawberry ice cream melting down the wrist on a sunny street',
    comments: [['zaid.eats', 'rip'], ['sam.ortiz', 'lick faster'], ['amara.ok', 'iconic']],
  },
  {
    id: 'movie-nap', cat: 'pets', user: 'its.hana.k', likes: 5011,
    caption: 'my dad picked the movie. my dad fell asleep 11 minutes in. every single time',
    alt: 'A man asleep on a sofa with a blanket half on him, lit by the glow of the TV in a dark living room',
    comments: [['reel.ben', 'what movie'], ['its.hana.k', '@reel.ben HE CHOSE IT BEN'], ['waffles.the.corgi', 'i was also asleep']],
  },
  {
    id: 'umbrella', cat: 'pets', user: 'its.hana.k', likes: 2780,
    caption: 'my umbrella lasted 40 seconds. a personal best',
    alt: 'A hand holding an umbrella blown inside out on a windy, rainy street',
    comments: [['mira.lens', 'rain photoshoot gone wrong'], ['the.lucas.files', 'rip umbrella']],
  },
  {
    id: 'pigeon', cat: 'pets', user: 'the.lucas.files', ratio: '3:2', likes: 3904,
    caption: 'looked away for one second. one second.',
    alt: 'A pigeon on a park bench pulling a chip out of a paper cone of fries',
    comments: [['mei.eats.out', 'the pigeon has taste'], ['its.hana.k', 'he looks so proud']],
  },

  /* ---------------- travel & lifestyle (10) ---------------- */
  {
    id: 'palace-view', cat: 'travel', user: 'wild.atlas', photo: 'summer-palace', ratio: '3:2', place: 'Summer Palace, Beijing', likes: 5276,
    caption: 'climbed every single step to the top for this view. legs: gone. worth it 🏯 #beijing #travel',
    alt: 'A red and green tiered tower on a wooded hill above a lake',
    comments: [['mira.lens', 'the colours on that roof!!'], ['jun.wears', 'okay this is going on my list'], ['wild.atlas', '@jun.wears go in spring, way fewer crowds']],
  },
  {
    id: 'tram', cat: 'travel', user: 'wild.atlas', place: 'Lisbon', likes: 4812,
    caption: 'rode the yellow tram up the hill four times just because. would do it again tomorrow',
    alt: 'A vintage yellow tram climbing a narrow cobbled street between pastel buildings',
    comments: [['mira.lens', 'the light!!'], ['sam.ortiz', 'pastel buildings are my weakness']],
  },
  {
    id: 'window-seat', cat: 'travel', user: 'wild.atlas', likes: 2560,
    caption: 'window seat, always. i will climb over you to get to the bathroom and i’m sorry in advance',
    alt: 'The view from a plane window over a wing and fluffy clouds lit by the afternoon sun',
    comments: [['aisha.abroad', 'window seat gang'], ['goldenhour.gabe', 'the clouds!']],
  },
  {
    id: 'rain-street', cat: 'travel', user: 'mira.lens', place: 'Old Town', likes: 2501,
    caption: 'rain + neon = free photoshoot 🌧️',
    alt: 'A rainy street at night with neon shop signs reflected in puddles and someone crossing with an umbrella',
    comments: [['wild.atlas', 'so cinematic'], ['low.tide.audio', 'this is an album cover']],
  },
  {
    id: 'pier-sunset', cat: 'travel', user: 'goldenhour.gabe', likes: 4401,
    caption: 'every sunset here looks fake and every single one is real',
    alt: 'A wooden pier stretching into the sea at sunset under an orange and purple sky',
    comments: [['wild.atlas', 'adding this to the list'], ['waffles.the.corgi', 'pier walk tomorrow?']],
  },
  {
    id: 'rooftops', cat: 'travel', user: 'goldenhour.gabe', ratio: '3:2', likes: 3120,
    caption: '7:42pm. rooftops doing their thing 🧡',
    alt: 'Terracotta city rooftops and a church dome glowing in warm sunset light',
    comments: [['aisha.abroad', 'which city?'], ['goldenhour.gabe', '@aisha.abroad not telling, it’s already busy enough']],
  },
  {
    id: 'balcony-coffee', cat: 'travel', user: 'goldenhour.gabe', likes: 2241,
    caption: 'sunrise coffee on the balcony. the only time i’m a morning person is on holiday',
    alt: 'A cup of coffee on a small balcony table overlooking the sea at sunrise',
    comments: [['zaid.eats', 'the coffee + the view'], ['chloe.styled', 'take me there']],
  },
  {
    id: 'alpine-lake', cat: 'travel', user: 'aisha.abroad', ratio: '3:2', likes: 5890,
    caption: 'hiked 2 hours for this lake and the water was actually this colour. my photos don’t even do it justice',
    alt: 'A turquoise mountain lake surrounded by pine trees and rocky peaks under a clear sky',
    comments: [['sam.ortiz', 'did you swim'], ['aisha.abroad', '@sam.ortiz for 4 seconds. it was ice']],
  },
  {
    id: 'lantern-alley', cat: 'travel', user: 'aisha.abroad', likes: 3340,
    caption: 'got lost in the old market for an hour and found the best mint tea of my life',
    alt: 'A narrow market alley hung with colourful lanterns, rugs and brass lamps',
    comments: [['wild.atlas', 'the lanterns 😍'], ['mei.eats.out', 'what did you eat'], ['aisha.abroad', '@mei.eats.out everything']],
  },
  {
    id: 'train-window', cat: 'travel', user: 'aisha.abroad', ratio: '3:2', likes: 1875,
    caption: '6 hours on a train, 0 hours bored. this is my favourite way to travel',
    alt: 'The view from a train window of green rolling hills and a small village, a coffee cup on the ledge',
    comments: [['lina.reads', 'perfect reading spot'], ['wild.atlas', 'train > plane']],
  },

  /* ---------------- sports, music & hobbies (10) ---------------- */
  {
    id: 'pickup-run', cat: 'hobbies', user: 'kai.hoops', place: 'Riverside Courts', likes: 1154,
    caption: 'lost 21–18 and i am choosing to blame the wind. rematch friday',
    alt: 'Friends playing basketball on an outdoor court under floodlights at dusk, one player mid jump shot',
    comments: [['matchday.dani', 'the wind 💀'], ['kai.hoops', '@matchday.dani it was VERY windy'], ['ellis.drives', 'i was there. it was not windy']],
  },
  {
    id: 'new-kicks', cat: 'hobbies', user: 'kai.hoops', ratio: '1:1', likes: 1033,
    caption: 'new hoop shoes. first game in them tonight. if i lose it’s their fault',
    alt: 'A pair of new white and orange basketball shoes on the painted lines of an outdoor court',
    comments: [['jun.wears', 'clean'], ['matchday.dani', 'blaming the shoes already 😭']],
  },
  {
    id: 'matchday', cat: 'hobbies', user: 'matchday.dani', ratio: '3:2', more: 1, place: 'Northgate Park', likes: 2045,
    caption: 'last-minute winner, three strangers hugged me, i hugged them back. football is the best thing ever invented ⚽',
    alt: 'Football fans in striped scarves celebrating in the stands of a packed stadium under floodlights',
    slides: ['The floodlit pitch seen from the stands before kickoff'],
    comments: [['kai.hoops', 'the energy!!'], ['matchday.dani', '@kai.hoops come to the next home game'], ['ellis.drives', 'i was screaming at my phone for that goal']],
  },
  {
    id: 'dawn-surf', cat: 'hobbies', user: 'sam.ortiz', ratio: '3:2', likes: 3866,
    caption: 'dawn patrol. water like glass and nobody else out. don’t ask me where this is',
    alt: 'A lone surfer paddling out on calm water at sunrise under an orange and pink sky',
    comments: [['waffles.the.corgi', 'can i come'], ['wild.atlas', 'okay where is this'], ['sam.ortiz', '@wild.atlas nice try']],
  },
  {
    id: 'front-row', cat: 'hobbies', user: 'low.tide.audio', more: 1, place: 'The Warehouse', likes: 2730,
    caption: 'barrier. sweaty. lost my voice by song four. 10/10 would get squashed again',
    alt: 'View from the crowd at a small concert: a singer under purple and orange stage lights, raised hands in front',
    slides: ['Blurry shot of the crowd jumping with confetti in the air'],
    comments: [['amara.ok', 'jealous jealous jealous'], ['low.tide.audio', '@amara.ok next one we go together'], ['mira.lens', 'the lighting in this!!']],
  },
  {
    id: 'record-shop', cat: 'hobbies', user: 'low.tide.audio', likes: 688,
    caption: 'two hours crate digging, came out with one record with no sleeve notes. best purchase of the month',
    alt: 'Hands flipping through vinyl records in a wooden crate at a record shop',
    comments: [['mira.lens', 'mystery records are the best records']],
  },
  {
    id: 'car-meet', cat: 'hobbies', user: 'ellis.drives', more: 2, place: 'Sunday car meet', likes: 1987,
    caption: 'cleanest little boxy hatchback at the meet this morning. mint green, original paint. the owner let me sit in it and i nearly cried',
    alt: 'A mint-green 1980s hatchback with chrome bumpers parked among other classic cars on a sunny morning',
    slides: ['The retro dashboard and thin steering wheel inside the car', 'A row of classic cars lined up at the morning meet'],
    comments: [['jun.wears', 'the colour 😮‍💨'], ['ellis.drives', '@jun.wears factory mint. they don’t make them like this anymore'], ['reel.ben', 'feels like a movie car']],
  },
  {
    id: 'night-drive', cat: 'hobbies', user: 'ellis.drives', ratio: '3:2', likes: 1460,
    caption: '2am drive, windows down, same four songs on repeat',
    alt: 'Driver’s-seat view at night: a glowing dashboard and blurred city lights through the windscreen',
    comments: [['low.tide.audio', 'which four songs'], ['ellis.drives', '@low.tide.audio one of them is yours, don’t let it go to your head']],
  },
  {
    id: 'deep-field', cat: 'hobbies', user: 'orbit.notes', photo: 'deep-field', likes: 7420,
    caption: 'space fact #212: nearly every dot in this hubble picture is a whole galaxy, not a star. photo: NASA (public domain) 🌌',
    alt: 'Thousands of tiny galaxies scattered across black space',
    comments: [['lina.reads', 'i need to lie down'], ['sam.ortiz', 'tiny galaxies, huge feelings']],
  },
  {
    id: 'launch', cat: 'hobbies', user: 'orbit.notes', photo: 'launch-pad', ratio: '3:2', likes: 3866,
    caption: 'launch pad at blue hour, waiting for the countdown. who else watches launches live? photo: SpaceX (public domain) 🚀',
    alt: 'A white rocket standing on a launch pad at dusk with lights glowing',
    comments: [['kai.hoops', 'every single one'], ['ellis.drives', 'the scale of these things']],
  },
];

/* ---------------- feed order ---------------- */
// The feed opens with these, then mixes the sections evenly (so a session of 8 posts feels varied)
// and avoids showing the same creator twice in a row.
const FEED_START = ['palace-view', 'mirror-fit', 'zoomies', 'birthday-dinner'];

function mixFeed(posts) {
  const start = FEED_START.map((id) => posts.find((p) => p.id === id)).filter(Boolean);
  const groups = {};
  posts.filter((p) => !start.includes(p)).forEach((p) => (groups[p.cat] = groups[p.cat] || []).push(p));
  const keys = Object.keys(groups);
  const weight = Object.fromEntries(keys.map((k) => [k, groups[k].length]));
  const total = keys.reduce((n, k) => n + weight[k], 0);
  const credit = Object.fromEntries(keys.map((k) => [k, 0]));
  const out = [...start];
  while (out.length < posts.length) {
    // Smooth weighted round robin: bigger sections come up more often, but never in a clump.
    keys.forEach((k) => (credit[k] += weight[k]));
    const open = keys.filter((k) => groups[k].length);
    const k = open.reduce((a, b) => (credit[b] > credit[a] ? b : a));
    credit[k] -= total;
    const last = out[out.length - 1];
    const i = Math.max(0, groups[k].findIndex((p) => !last || p.user !== last.user));
    out.push(groups[k].splice(i, 1)[0]);
  }
  return out;
}

// Posting time from the post's place in the feed: the first posts are from minutes ago,
// later ones from hours, days and weeks ago.
function timeFor(i) {
  if (i < 3) return `${12 + i * 17}m`;
  if (i < 22) return `${Math.min(23, i - 2)}h`;
  if (i < 64) return `${Math.min(6, 1 + Math.floor((i - 22) / 7))}d`;
  return `${1 + Math.floor((i - 64) / 8)}w`;
}


// The picture slots a post uses: its main photo, then any carousel photos that exist.
export function postSlides(post) {
  const extra = [];
  for (let i = 2; i <= (post.more || 0) + 1; i++) {
    const p = photo(`post-${post.id}-${i}`);
    if (p) extra.push({ photo: p, alt: (post.slides && post.slides[i - 2]) || `${post.alt}, photo ${i}` });
  }
  return extra;
}
export const hasPhoto = (post) => !!(photo(post.photo) || photo(`post-${post.id}`));

// The live feed, in order: only posts that have a photo, mixed so sections alternate and the
// same creator never appears twice in a row (worked out again whenever pictures are added).
export const POSTS = mixFeed(ALL_POSTS.filter(hasPhoto)).map((p, i) => ({ ...p, time: p.time || timeFor(i) }));
export const POST_BY_ID = Object.fromEntries(POSTS.map((p) => [p.id, p]));
export const FEED_CREATORS = [...new Set(POSTS.map((p) => p.user))];
