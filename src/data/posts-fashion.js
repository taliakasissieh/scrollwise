// More fashion & beauty posts (added 21 November 2026). Every creator and post here is fictional.
//
// These pictures are planned so they can be real, licensed photos or photos the team takes:
// outfits are shown neck-down, from behind or as mirror selfies with the phone covering the face,
// and the rest are flat lays, details, shops and places. No identifiable faces are needed, so no real
// person is ever shown with a fictional name or caption. `find` holds search words for a licensed
// photo (Unsplash / Pexels); photos/FIND-PHOTOS.md turns them into search links.
// A post stays hidden until its picture is installed (see PHOTOS.md).

export const FASHION_CREATORS = {
  'thread.and.tea': { name: 'Maya Collins', topic: 'Style', hue: 24, bio: 'capsule wardrobe, 30 pieces, endless outfits. tea in hand, always' },
  'denim.diaries': { name: 'Leo Ferreira', topic: 'Denim', hue: 215, bio: 'raw denim, honest fades and a lot of patience' },
  'nadia.layers': { name: 'Nadia Karim', topic: 'Modest fashion', hue: 20, bio: 'modest fits, soft colours, layering everything' },
  'kofi.kicks': { name: 'Kofi Asante', topic: 'Sneakers', hue: 145, bio: 'sneaker rotation, cleaning tips and zero hype' },
  'secondhand.saskia': { name: 'Saskia de Vries', topic: 'Thrift', hue: 95, bio: 'everything i wear is secondhand. ask me where' },
  'tomas.tailored': { name: 'Tomás Rivera', topic: 'Menswear', hue: 205, bio: 'tailoring on a student budget' },
  'ava.knits': { name: 'Ava Lindqvist', topic: 'Knitwear', hue: 40, bio: 'knitting my own jumpers, very slowly. owner of @sir.hops.a.lot' },
  'street.study': { name: 'Ren Takahashi', topic: 'Streetwear', hue: 260, bio: 'streetwear, skate shoes and city corners' },
  'gold.and.grain': { name: 'Leila Farouk', topic: 'Jewellery', hue: 45, bio: 'small gold jewellery, mostly thrifted, all loved' },
  'isla.in.linen': { name: 'Isla Murphy', topic: 'Summer style', hue: 55, bio: 'linen everything, all year round' },
  'outfit.repeater': { name: 'Hugo Bernard', topic: 'Slow fashion', hue: 120, bio: 'wearing the same clothes on purpose. 1 jacket, 40 outfits' },
  'bags.by.bea': { name: 'Beatriz Costa', topic: 'Bags', hue: 10, bio: 'bag collector. mostly vintage, all repaired by me' },
  'cozy.carmen': { name: 'Carmen Ruiz', topic: 'Cosy style', hue: 28, bio: 'big scarves, warm drinks, autumn forever' },
  'fit.check.farah': { name: 'Farah Qureshi', topic: 'Uni outfits', hue: 315, bio: 'what i wore to uni this week. faces optional, outfits mandatory' },
  'archie.vintage': { name: 'Archie Walsh', topic: 'Vintage', hue: 30, bio: '90s jackets, faded tees, flea markets every sunday' },
  'skin.by.selin': { name: 'Selin Demir', topic: 'Skincare', hue: 340, bio: 'simple skincare and honest reviews. sunscreen every single day' },
  'nails.by.noa': { name: 'Noa Levi', topic: 'Nails', hue: 300, bio: 'nail art on my own hands. 2-hour sets, zero regrets' },
  'tara.glows': { name: 'Tara Okonkwo', topic: 'Makeup', hue: 15, bio: 'soft glam, small bags, budget finds' },
  'curl.club.jade': { name: 'Jade Thompson', topic: 'Curly hair', hue: 280, bio: 'curly hair routines that actually work' },
};

export const FASHION_POSTS = [
  /* ---------------- capsule & everyday style ---------------- */
  {
    id: 'capsule-30', cat: 'style', user: 'thread.and.tea', more: 2, likes: 6420,
    caption: '30 pieces, 3 months, zero panic buys. this is the whole autumn capsule 🍂 swipe for the rail',
    alt: 'A neatly folded capsule wardrobe laid out on a pale wooden floor: cream knit, white shirts, blue jeans, a beige trench, black trousers, loafers and white sneakers',
    slides: ['The same pieces hanging on a slim clothing rail against a white wall', 'An open notebook with simple outfit sketches beside a cup of tea'],
    find: 'capsule wardrobe flat lay neutral clothes',
    comments: [['nadia.layers', 'the colour palette is so calming'], ['outfit.repeater', 'this is the way 🙌'], ['thread.and.tea', '@outfit.repeater learnt from the best'], ['yasmin.daily', 'i own 30 hoodies and nothing else']],
  },
  {
    id: 'trench-weather', cat: 'style', user: 'thread.and.tea', likes: 3890, place: 'Old town',
    caption: 'trench coat weather finally arrived and i’ve been ready since august ☕',
    alt: 'Neck-down outfit on a city pavement: a beige trench coat over a grey hoodie, straight blue jeans and white sneakers, one hand holding a takeaway cup',
    find: 'beige trench coat outfit street style',
    comments: [['cozy.carmen', 'the hoodie under the trench 👌'], ['chloe.styled', 'trench season is the best season'], ['thread.and.tea', '@chloe.styled agreed, no notes']],
  },
  {
    id: 'one-blazer', cat: 'style', user: 'thread.and.tea', more: 2, likes: 5175,
    caption: 'one blazer, three ways. it was 12 euros at a charity shop and it’s carrying my entire wardrobe',
    alt: 'A navy blazer on a wooden hanger against a white wall',
    slides: ['The navy blazer over a white t-shirt and jeans, neck-down', 'The navy blazer over a knit dress with black boots, neck-down'],
    find: 'navy blazer hanger minimal',
    comments: [['secondhand.saskia', '12 euros?! where'], ['thread.and.tea', '@secondhand.saskia the one by the station. there were two'], ['secondhand.saskia', 'running']],
  },

  /* ---------------- denim ---------------- */
  {
    id: 'raw-fades', cat: 'style', user: 'denim.diaries', likes: 2187,
    caption: '8 months of daily wear and the fades are finally showing. yes i wash them now. occasionally.',
    alt: 'Close-up of well-worn dark raw denim jeans showing faded creases behind the knee, sitting on a wooden bench',
    find: 'raw denim fades close up',
    comments: [['archie.vintage', 'those honeycombs 😮‍💨'], ['denim.diaries', '@archie.vintage took me forever'], ['jun.wears', 'patience of a saint']],
  },
  {
    id: 'double-denim', cat: 'style', user: 'denim.diaries', likes: 1964,
    caption: 'double denim isn’t a crime if the washes are different. that’s the rule. i made it up.',
    alt: 'Neck-down outfit against a red brick wall: a light-wash denim jacket over a white t-shirt with dark straight-leg jeans and brown boots',
    find: 'double denim outfit brick wall',
    comments: [['street.study', 'rules are made by people with good fits'], ['kofi.kicks', 'the boots tho'], ['denim.diaries', '@kofi.kicks resoled twice already']],
  },
  {
    id: 'hemming', cat: 'style', user: 'denim.diaries', likes: 984,
    caption: 'learnt to hem my own jeans this weekend and now i’m unstoppable. how-to in my stories 🧵',
    alt: 'Hands pinning the hem of a pair of jeans on an ironing board, with a pin cushion and a tape measure',
    find: 'hemming jeans sewing pins',
    comments: [['outfit.repeater', 'saving this'], ['ava.knits', 'next step: knitting your own socks'], ['denim.diaries', '@ava.knits one hobby at a time']],
  },

  /* ---------------- modest & layered ---------------- */
  {
    id: 'soft-neutrals', cat: 'style', user: 'nadia.layers', likes: 7240, place: 'City park',
    caption: 'soft neutrals on repeat. this coat goes with literally everything i own 🤎',
    alt: 'Neck-down modest outfit in an autumn park: a long camel coat over a cream knit maxi dress with white sneakers',
    find: 'camel coat maxi dress autumn outfit',
    comments: [['cozy.carmen', 'camel coat supremacy'], ['thread.and.tea', 'this palette is everything'], ['nadia.layers', '@thread.and.tea we have the same brain']],
  },
  {
    id: 'scarf-ways', cat: 'style', user: 'nadia.layers', more: 2, likes: 4655,
    caption: '4 scarves, 12 ways to wear them. part one 👇 which colour first?',
    alt: 'Four folded silk scarves in dusty pink, sage, cream and navy on a white bed',
    slides: ['A sage silk scarf tied around the handle of a canvas tote bag', 'A navy scarf knotted at the collar of a camel coat, close-up'],
    find: 'silk scarves folded bed',
    comments: [['gold.and.grain', 'sage!! obviously'], ['bags.by.bea', 'the tote bag trick is genius'], ['amara.ok', 'stealing the coat one']],
  },
  {
    id: 'long-over-wide', cat: 'style', user: 'nadia.layers', likes: 3312,
    caption: 'layering 101: long over wide, short over long. trust the process',
    alt: 'Neck-down outfit in a bright hallway: a long olive shirt dress layered over wide cream trousers, with a cropped knit vest on top',
    find: 'layered outfit shirt dress wide trousers',
    comments: [['fit.check.farah', 'saving for my uni fits'], ['nadia.layers', '@fit.check.farah tag me when you try it!']],
  },

  /* ---------------- sneakers ---------------- */
  {
    id: 'sneaker-rotation', cat: 'style', user: 'kofi.kicks', likes: 8740,
    caption: 'current rotation. which pair would you steal? 👟',
    alt: 'Six pairs of clean sneakers lined up on wooden stairs, from white leather to green suede',
    find: 'sneakers lined up stairs',
    comments: [['kai.hoops', 'the green ones, no question'], ['street.study', 'third from the left is a classic'], ['kofi.kicks', '@kai.hoops you’d play ball in them, absolutely not'], ['jun.wears', 'all of them tbh']],
  },
  {
    id: 'sneaker-clean', cat: 'style', user: 'kofi.kicks', more: 1, likes: 6110,
    caption: 'saturday reset: 20 minutes, warm water, a soft brush and patience. no fancy kit needed',
    alt: 'A muddy white sneaker next to a freshly cleaned one on a towel, with a soft brush and a bowl of soapy water',
    slides: ['Close-up of a soft brush scrubbing the sole of a white sneaker'],
    find: 'cleaning white sneakers brush',
    comments: [['outfit.repeater', 'cleaning > buying new 🙌'], ['the.lucas.files', 'mine are past saving'], ['kofi.kicks', '@the.lucas.files send pics, nothing is past saving']],
  },
  {
    id: 'puddle-kicks', cat: 'style', user: 'kofi.kicks', likes: 3048,
    caption: 'the only pair i trust in november ☔',
    alt: 'Low shot of black waterproof sneakers stepping past a puddle on a wet city pavement, street lights reflected in the water',
    find: 'sneakers puddle rain street',
    comments: [['mira.lens', 'that reflection'], ['kofi.kicks', '@mira.lens learnt from you']],
  },

  /* ---------------- thrift & repair ---------------- */
  {
    id: 'thrift-rail', cat: 'style', user: 'secondhand.saskia', likes: 5120,
    caption: 'the green corduroy jacket called my name from across the shop. 8 euros. we’re soulmates 💚',
    alt: 'A long rail of colourful secondhand coats and jackets in a charity shop, a hand pulling out a green corduroy jacket',
    find: 'thrift store clothing rail jackets',
    comments: [['archie.vintage', 'a true find'], ['thread.and.tea', 'that green!!'], ['secondhand.saskia', '@thread.and.tea it matches nothing and everything']],
  },
  {
    id: 'saturday-thrift', cat: 'style', user: 'secondhand.saskia', more: 2, likes: 4402,
    caption: 'today’s haul cost less than one new jumper. prices in the comments ↓',
    alt: 'A secondhand haul on a white duvet: a striped shirt, a brown leather belt, a grey wool cardigan and a pair of loafers',
    slides: ['Close-up of the wooden buttons on the grey cardigan', 'The loafers on a doormat'],
    find: 'thrift haul flat lay clothes',
    comments: [['secondhand.saskia', 'shirt 4, belt 3, cardigan 7, loafers 9 ✨'], ['bags.by.bea', 'the loafers are a steal'], ['yasmin.daily', 'i need you to take me shopping']],
  },
  {
    id: 'visible-mending', cat: 'style', user: 'secondhand.saskia', likes: 2877,
    caption: 'visible mending > throwing it away. this jumper has another 10 years in it',
    alt: 'Hands sewing a colourful patch onto the elbow of a grey wool jumper, thread and scissors on a wooden table',
    find: 'visible mending sewing patch sweater',
    comments: [['ava.knits', 'the colour choice 😍'], ['outfit.repeater', 'repair is the new new']],
  },

  /* ---------------- menswear ---------------- */
  {
    id: 'first-suit', cat: 'style', user: 'tomas.tailored', likes: 3604,
    caption: 'first proper suit for my cousin’s wedding. the tailor took the sleeves up 2cm and it changed everything',
    alt: 'Neck-down: a charcoal grey suit with a white shirt and no tie, hands in pockets, standing in a sunlit doorway',
    find: 'charcoal suit no tie',
    comments: [['jun.wears', 'tailoring really is everything'], ['omar.fades', 'and the haircut? 👀'], ['tomas.tailored', '@omar.fades booked with you obviously']],
  },
  {
    id: 'shoe-shine', cat: 'style', user: 'tomas.tailored', ratio: '1:1', likes: 1450,
    caption: 'sunday ritual: shoe polish and a podcast',
    alt: 'Brown leather brogues being polished with a cloth, a small round tin of polish and a brush beside them',
    find: 'polishing leather shoes',
    comments: [['archie.vintage', 'old shoes, new shine'], ['tomas.tailored', '@archie.vintage these were my grandad’s']],
  },
  {
    id: 'knit-tie', cat: 'style', user: 'tomas.tailored', likes: 2093,
    caption: 'the knit tie is the most underrated accessory and i will die on this hill',
    alt: 'Close-up of a navy knit tie on a light blue oxford shirt under a grey wool blazer',
    find: 'knit tie oxford shirt close up',
    comments: [['denim.diaries', 'with jeans too?'], ['tomas.tailored', '@denim.diaries especially with jeans']],
  },

  /* ---------------- knitwear ---------------- */
  {
    id: 'handmade-jumper', cat: 'style', user: 'ava.knits', more: 1, likes: 7310,
    caption: '6 weeks, 9 balls of wool, 1 dropped stitch you’ll never find. it’s DONE 🧶',
    alt: 'A chunky hand-knitted cream jumper laid flat on a wooden floor beside balls of wool and knitting needles',
    slides: ['The cream jumper worn with jeans by a sunny window, neck-down'],
    find: 'hand knitted sweater flat lay yarn',
    comments: [['cozy.carmen', 'i would pay you'], ['ava.knits', '@cozy.carmen i’ll teach you instead!'], ['secondhand.saskia', 'heirloom piece']],
  },
  {
    id: 'yarn-colours', cat: 'style', user: 'ava.knits', ratio: '1:1', likes: 2580,
    caption: 'help me pick the next project colour 🍂 rust, mustard or olive?',
    alt: 'Wicker baskets of yarn in rust, mustard, olive and cream on a wooden shelf',
    find: 'yarn baskets autumn colours',
    comments: [['nadia.layers', 'olive!'], ['thread.and.tea', 'rust, always rust'], ['clay.days', 'mustard to match my mugs']],
  },

  /* ---------------- streetwear ---------------- */
  {
    id: 'skate-fit', cat: 'style', user: 'street.study', likes: 4892,
    caption: 'comfiest fit i own. the shoes have seen things',
    alt: 'Neck-down streetwear outfit in a concrete skatepark: an oversized grey hoodie, loose cargo trousers and worn skate shoes, one foot on a skateboard',
    find: 'skater outfit hoodie cargo skateboard',
    comments: [['dina.rolls', 'see you at the park'], ['kofi.kicks', 'those shoes deserve a medal'], ['street.study', '@kofi.kicks they deserve a rest']],
  },
  {
    id: 'cargo-night', cat: 'style', user: 'street.study', likes: 3377,
    caption: 'how many pockets is too many? asking for me',
    alt: 'Low-angle neck-down shot of black cargo trousers and chunky boots on a city crossing at night, lit by colourful shop lights',
    find: 'cargo pants boots night street',
    comments: [['mira.lens', 'the neon 💜'], ['denim.diaries', 'never too many']],
  },
  {
    id: 'cap-wall', cat: 'style', user: 'street.study', ratio: '1:1', likes: 1920,
    caption: 'cap wall finally done. no logos, just colours',
    alt: 'Five plain baseball caps in different colours hanging on wall hooks above a white desk',
    find: 'baseball caps hanging wall hooks',
    comments: [['the.lucas.files', 'the orange one 🔥'], ['street.study', '@the.lucas.files my favourite too']],
  },

  /* ---------------- jewellery & accessories ---------------- */
  {
    id: 'gold-stack', cat: 'style', user: 'gold.and.grain', likes: 4380,
    caption: 'thrifted, gifted, and one i bought myself after exams ✨',
    alt: 'Close-up of a hand with stacked thin gold rings and a delicate chain bracelet resting on a cream knit sleeve',
    find: 'gold rings stack hand close up',
    comments: [['jun.wears', 'the stack is perfect'], ['gold.and.grain', '@jun.wears coming from the ring king 👑'], ['nails.by.noa', 'and the nails match!']],
  },
  {
    id: 'earring-dish', cat: 'style', user: 'gold.and.grain', ratio: '1:1', likes: 2263,
    caption: 'the earring dish is chaos and i love it',
    alt: 'A small ceramic dish holding mismatched gold hoops and pearl earrings on a bedside table in morning light',
    find: 'earrings ceramic dish jewelry',
    comments: [['clay.days', 'is that one of my dishes?? 🥹'], ['gold.and.grain', '@clay.days of course it is']],
  },
  {
    id: 'pearl-mix', cat: 'style', user: 'gold.and.grain', more: 1, likes: 3155,
    caption: 'pearls + black turtleneck = instant “i have my life together”',
    alt: 'Close-up of a pearl necklace layered with a thin gold chain over a black turtleneck',
    slides: ['The two necklaces laid out on a linen cloth'],
    find: 'pearl necklace black turtleneck',
    comments: [['chloe.styled', 'timeless'], ['tara.glows', 'the illusion of having it together 😂']],
  },

  /* ---------------- summer & linen ---------------- */
  {
    id: 'linen-set', cat: 'style', user: 'isla.in.linen', likes: 5530, place: 'Seaside town',
    caption: 'linen season never really ends if you’re brave enough ☀️',
    alt: 'Neck-down: a loose white linen shirt and matching linen trousers with flat leather sandals on a sunny stone terrace',
    find: 'white linen outfit summer sandals',
    comments: [['island.time.tia', 'ferry outfit inspo'], ['isla.in.linen', '@island.time.tia wore it on one, wrinkled in 5 minutes'], ['thread.and.tea', 'wrinkles are part of the look']],
  },
  {
    id: 'straw-bag', cat: 'style', user: 'isla.in.linen', ratio: '1:1', likes: 2765,
    caption: 'beach bag essentials: towel, sunnies, book, snacks. that’s it',
    alt: 'A woven straw bag with a folded striped towel, a paperback and sunglasses on a wooden boardwalk',
    find: 'straw beach bag towel sunglasses',
    comments: [['lina.reads', 'what’s the book?'], ['isla.in.linen', '@lina.reads a mystery, no spoilers']],
  },
  {
    id: 'sundress', cat: 'style', user: 'isla.in.linen', likes: 3930,
    caption: 'packed 3 dresses, wore this one 6 times. no regrets',
    alt: 'A yellow floral sundress hanging on a wooden door in a sunlit holiday apartment',
    find: 'yellow dress hanging door sunlight',
    comments: [['passport.and.pastries', 'holiday dress energy'], ['outfit.repeater', 'outfit repeating icon']],
  },

  /* ---------------- slow fashion ---------------- */
  {
    id: 'one-jacket', cat: 'style', user: 'outfit.repeater', more: 2, likes: 9860,
    caption: 'day 40 of wearing the same jacket. people noticed on day 38. outfit repeating is a personality now',
    alt: 'A dark green work jacket on a hanger against a white wall',
    slides: ['The green jacket over a hoodie and jeans, neck-down', 'The green jacket over a white shirt and chinos, neck-down'],
    find: 'green chore jacket hanger',
    comments: [['thread.and.tea', 'the most relatable account on here'], ['denim.diaries', 'day 41 when'], ['outfit.repeater', '@denim.diaries tomorrow, same jacket']],
  },
  {
    id: 'whole-wardrobe', cat: 'style', user: 'outfit.repeater', likes: 4168,
    caption: 'this is every piece of clothing i own. ask me anything',
    alt: 'A small open wardrobe with a short rail of about 25 neutral-coloured clothes and shoes lined up underneath',
    find: 'minimalist wardrobe neutral clothes rail',
    comments: [['yasmin.daily', 'where are the other 400 hoodies'], ['outfit.repeater', '@yasmin.daily donated 🫡']],
  },
  {
    id: 'repair-cafe', cat: 'style', user: 'outfit.repeater', likes: 2318,
    caption: 'repair café saturdays are the best free thing in this city. fixed this pocket in 15 minutes',
    alt: 'Hands guiding a torn jacket pocket through a sewing machine at a community repair café table',
    find: 'sewing machine repair jacket hands',
    comments: [['secondhand.saskia', 'love this place'], ['tomas.tailored', 'sewing machine skills unlocked']],
  },

  /* ---------------- bags ---------------- */
  {
    id: 'bag-shelf', cat: 'style', user: 'bags.by.bea', likes: 3970,
    caption: 'the collection has grown. please don’t tell my mum',
    alt: 'Five vintage leather handbags in brown, burgundy and black lined up on a wooden shelf',
    find: 'vintage leather handbags shelf',
    comments: [['chloe.styled', 'the burgundy one 😮'], ['bags.by.bea', '@chloe.styled flea market, 1980s, 20 euros'], ['gold.and.grain', 'dream shelf']],
  },
  {
    id: 'whats-in-my-bag', cat: 'style', user: 'bags.by.bea', ratio: '1:1', likes: 5240,
    caption: 'what’s in my uni bag. the lip balm count is not a mistake',
    alt: 'Flat lay of a tote bag’s contents: a book, an earphones case, three lip balms, keys, a small notebook, a reusable bottle and a hair clip',
    find: 'whats in my bag flat lay',
    comments: [['fit.check.farah', 'three lip balms is the correct number'], ['uni.with.idris', 'where are the snacks'], ['bags.by.bea', '@uni.with.idris already eaten']],
  },
  {
    id: 'new-handle', cat: 'style', user: 'bags.by.bea', likes: 1689,
    caption: 'gave this 30-year-old bag a new handle. good as new (better, honestly)',
    alt: 'Close-up of hands restitching a worn brown leather bag handle with waxed thread',
    find: 'leather bag repair stitching hands',
    comments: [['outfit.repeater', 'repair queen'], ['secondhand.saskia', 'teach a class pls']],
  },

  /* ---------------- cosy autumn ---------------- */
  {
    id: 'big-scarf', cat: 'style', user: 'cozy.carmen', likes: 6075,
    caption: 'the scarf is bigger than me and that’s the point 🧣',
    alt: 'Neck-down: an oversized checked wool scarf wrapped over a navy coat, hands holding a cup of hot chocolate on a cold street',
    find: 'oversized scarf coat hot chocolate',
    comments: [['ava.knits', 'i could knit you a bigger one'], ['cozy.carmen', '@ava.knits please do'], ['nadia.layers', 'the cosiest fit']],
  },
  {
    id: 'boot-season', cat: 'style', user: 'cozy.carmen', ratio: '1:1', likes: 2810,
    caption: 'boot season has officially started 🍁',
    alt: 'Brown leather ankle boots standing on a carpet of orange autumn leaves',
    find: 'brown ankle boots autumn leaves',
    comments: [['waffles.the.corgi', 'are those leaves for jumping in'], ['cozy.carmen', '@waffles.the.corgi yes, obviously']],
  },
  {
    id: 'jumper-drawer', cat: 'style', user: 'cozy.carmen', likes: 3365,
    caption: 'jumper drawer finally sorted. 7 is a normal number of jumpers',
    alt: 'A pile of folded chunky knit jumpers in cream, rust and forest green on a bed next to a mug of tea',
    find: 'folded knit sweaters pile bed',
    comments: [['outfit.repeater', '7 is a lot of jumpers'], ['cozy.carmen', '@outfit.repeater 7 is a cosy amount']],
  },

  /* ---------------- uni outfits ---------------- */
  {
    id: 'uni-week', cat: 'style', user: 'fit.check.farah', more: 3, likes: 9120,
    caption: 'what i wore to uni this week (thursday was pyjamas, we don’t talk about thursday)',
    alt: 'Mirror selfie with the phone held in front of the face: an oversized cream blazer, white t-shirt, wide blue jeans and loafers, in a bedroom',
    slides: ['Monday: a grey hoodie and black trousers, mirror selfie with the phone covering the face', 'Wednesday: a striped shirt and straight jeans, mirror selfie with the phone covering the face', 'Friday: a long black coat over a knit and trainers, mirror selfie with the phone covering the face'],
    find: 'mirror selfie outfit phone covering face',
    comments: [['yasmin.daily', 'thursday is my every day'], ['nadia.layers', 'the blazer one!!'], ['fit.check.farah', '@nadia.layers blazer was 15 euros secondhand'], ['uni.with.idris', 'we have the same 9am, why do you look like this']],
  },
  {
    id: 'exam-fit', cat: 'style', user: 'fit.check.farah', likes: 6380,
    caption: 'exam season dress code: whatever has the most pockets for snacks',
    alt: 'Mirror selfie with the phone held in front of the face: a big comfy sweatshirt, joggers and fluffy socks in a messy bedroom',
    find: 'cozy sweatshirt joggers mirror selfie',
    comments: [['uni.with.idris', 'finally an outfit i understand'], ['morning.pages.ella', 'good luck with exams! take breaks 💛']],
  },

  /* ---------------- vintage ---------------- */
  {
    id: 'flea-jacket', cat: 'style', user: 'archie.vintage', likes: 3802, place: 'Sunday flea market',
    caption: 'found it. 90s leather jacket, 15 euros, slightly haunted',
    alt: 'A worn brown leather jacket laid on a flea market table among old records and brass objects',
    find: 'vintage leather jacket flea market',
    comments: [['bags.by.bea', 'see you there next sunday'], ['denim.diaries', 'the patina 😮‍💨'], ['archie.vintage', '@denim.diaries 30 years of patina']],
  },
  {
    id: 'faded-tee', cat: 'style', user: 'archie.vintage', ratio: '1:1', likes: 1632,
    caption: 'the cracks make it better',
    alt: 'A faded black vintage t-shirt with a cracked sun graphic laid flat on a wooden floor',
    find: 'faded vintage t-shirt flat lay',
    comments: [['street.study', 'that fade can’t be faked'], ['archie.vintage', '@street.study it can, but it shouldn’t be']],
  },

  /* ---------------- existing style creators ---------------- */
  {
    id: 'puffer-day', cat: 'style', user: 'jun.wears', likes: 4510,
    caption: 'it’s -2 and i chose fashion AND warmth for once',
    alt: 'Neck-down outfit on a snowy street: a black puffer jacket, grey hoodie, black trousers and white sneakers',
    find: 'black puffer jacket outfit snow street',
    comments: [['north.by.nils', '-2 is spring where i am'], ['jun.wears', '@north.by.nils respectfully no']],
  },
  {
    id: 'coat-rail', cat: 'style', user: 'chloe.styled', likes: 3740,
    caption: 'the coat situation is getting serious. pick one for tomorrow 🧥',
    alt: 'Three wool coats in camel, grey and navy hanging on hooks in a bright hallway',
    find: 'wool coats hanging hooks hallway',
    comments: [['cozy.carmen', 'camel, always camel'], ['thread.and.tea', 'grey with the white sneakers'], ['chloe.styled', '@thread.and.tea grey it is']],
  },

  /* ---------------- beauty ---------------- */
  {
    id: 'spf-shelf', cat: 'style', user: 'skin.by.selin', likes: 6830,
    caption: 'the whole routine. 4 steps. sunscreen is the most important one, every day, even when it’s cloudy ☁️',
    alt: 'A tidy bathroom shelf with plain unlabelled skincare bottles, a jade roller and a small plant',
    find: 'skincare bottles bathroom shelf minimal',
    comments: [['glambyrania', 'sunscreen preacher 🙏'], ['tara.glows', 'the plant is a nice touch'], ['skin.by.selin', '@tara.glows it’s the 5th step']],
  },
  {
    id: 'two-minute-routine', cat: 'style', user: 'skin.by.selin', more: 1, likes: 4255,
    caption: '2-minute morning routine for people who are always late (me)',
    alt: 'Hands pumping a plain white cleanser bottle over a bathroom sink in soft morning light',
    slides: ['A plain tube of sunscreen squeezed onto two fingers'],
    find: 'skincare routine hands sink',
    comments: [['yasmin.daily', 'finally something i have time for'], ['skin.by.selin', '@yasmin.daily you can do it on the bus too']],
  },
  {
    id: 'autumn-nails', cat: 'style', user: 'nails.by.noa', likes: 5895,
    caption: 'autumn set 🍁 took 2 hours, will last 6 days, worth it',
    alt: 'Close-up of a hand with glossy nails in rust, olive and cream holding a ceramic coffee cup',
    find: 'autumn nails manicure coffee cup',
    comments: [['glambyrania', 'the olive!!'], ['gold.and.grain', 'perfect with gold rings'], ['nails.by.noa', '@gold.and.grain that was the plan']],
  },
  {
    id: 'chrome-nails', cat: 'style', user: 'nails.by.noa', ratio: '1:1', likes: 3720,
    caption: 'chrome nails at home. the trick is a thin base coat and patience',
    alt: 'Close-up of short nails with a silver chrome finish resting on a white fluffy rug',
    find: 'chrome nails close up',
    comments: [['tara.glows', 'looks like a salon did it'], ['nails.by.noa', '@tara.glows my kitchen table is my salon']],
  },
  {
    id: 'small-makeup-bag', cat: 'style', user: 'tara.glows', ratio: '1:1', likes: 4980,
    caption: 'everything in my makeup bag fits in one hand. minimal era',
    alt: 'Flat lay of an open makeup bag with a few unbranded products: a lipstick, mascara, a compact and a brush',
    find: 'makeup bag flat lay minimal',
    comments: [['glambyrania', 'i could never 😂'], ['skin.by.selin', 'love a minimal bag']],
  },
  {
    id: 'blush-swatch', cat: 'style', user: 'tara.glows', likes: 3141,
    caption: 'which one for this weekend: 1, 2 or 3?',
    alt: 'Close-up of three blush shades swatched on a forearm in soft daylight',
    find: 'blush swatches arm',
    comments: [['glambyrania', '2 forever'], ['curl.club.jade', '3!'], ['tara.glows', 'it’s a tie, i’m wearing both']],
  },
  {
    id: 'wash-day', cat: 'style', user: 'curl.club.jade', ratio: '1:1', likes: 3847,
    caption: 'wash day essentials. the microfibre towel changed my curls’ life',
    alt: 'A shower shelf with a wide-tooth comb, a rolled microfibre towel, hair clips and plain unlabelled bottles',
    find: 'curly hair products wide tooth comb towel',
    comments: [['glambyrania', 'same towel gang'], ['curl.club.jade', '@glambyrania it’s a cult and we’re in it']],
  },
  {
    id: 'day-three-curls', cat: 'style', user: 'curl.club.jade', likes: 5465,
    caption: 'day 3 curls still holding on 🙏',
    alt: 'Close-up from behind of defined dark curly hair in golden afternoon light',
    find: 'curly hair from behind sunlight',
    comments: [['tara.glows', 'the definition!!'], ['curl.club.jade', '@tara.glows silk pillowcase, that’s the secret']],
  },
  {
    id: 'brush-wash', cat: 'style', user: 'glambyrania', likes: 2690,
    caption: 'reminder to wash your brushes. this is your sign',
    alt: 'Clean makeup brushes drying bristles-down on a white towel',
    find: 'makeup brushes drying towel',
    comments: [['tara.glows', 'doing it tonight, promise'], ['glambyrania', '@tara.glows i’ll be checking']],
  },
  {
    id: 'barber-tools', cat: 'style', user: 'omar.fades', likes: 2215,
    caption: 'tools of the trade. cleaned after every single client',
    alt: 'A barber’s station with clippers, combs, scissors and a spray bottle neatly laid on a towel',
    find: 'barber tools clippers combs scissors',
    comments: [['tomas.tailored', 'the precision 🙌'], ['omar.fades', '@tomas.tailored see you saturday']],
  },
];
