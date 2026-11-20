# Pictures in ScrollWise

The feed shows **photographs only**. A post appears once it has a picture; until then it is skipped, so the feed never shows a drawing, an empty box or a file name. Every build lists the posts that are still waiting.

There are **80 posts** from 27 fictional creators, in six sections:

| Section | Posts |
| --- | --- |
| Friends & everyday | 20 |
| Fashion & beauty | 15 |
| Food & cafés | 15 |
| Pets & funny moments | 10 |
| Travel & lifestyle | 10 |
| Sports, music & hobbies | 10 |

**6 posts** already use real, licensed photos. The other **74 posts**, plus 20 optional carousel photos and 22 profile pictures, each have a ready-made prompt for an AI image generator.

**Start with the manifest.** Every build writes three files from the pictures that are really installed:

- **`PHOTO-MANIFEST.md`** (and `photos/manifest.csv` for spreadsheets): all 80 posts and their carousel photos, with file name, section, description, size needed, status (licensed, final AI image, temporary draft or missing), source and licence, and what still has to be done.
- **`photos/PROMPTS-NEEDED.md`**: the exact prompt for every picture that is missing or only a temporary draft, main post pictures first.
- **`photos/ai/missing.csv`** and **`photos/ai/replace.csv`**: the same lists in CSV form.

**The full prompt list: `photos/ai/prompts.csv`.** It has one row per picture, with the file name, shape, size and the complete prompt ready to paste (or to feed to a generator that takes a list).

Every build also writes **`photos/ai/missing.csv`**: the same list, but only the pictures that are still missing. Work from that one and it shrinks as you go.

Each complete prompt has up to five parts:
1. **The scene** for that post (listed below).
2. **The recurring person**, when one of the creators appears in the picture (see *Recurring people*).
3. **The photography style of its section** (listed at the top of each section below): editorial for fashion, appetising commercial-quality for food, breathtaking travel photography for destinations, dynamic action photography for sports, natural lifestyle photography for friends and everyday moments.
4. **The quality rules**, the same for every picture: *Photorealistic, professional camera quality, realistic textures, accurate anatomy with natural hands and believable faces, no excessive retouching, no text, no logos, no watermark, no illustration, cartoon or 3D-render look.*
5. **The shape**, e.g. *Vertical 4:5 aspect ratio (1080 × 1350).*

There are two ways to give a post its picture:

- **A. An AI-generated image** (quickest): drop it into `photos/ai/`. No credits file needed.
- **B. A licensed photo** from Unsplash or Pexels: put it in `photos/` and credit it in `photos/credits.json`.

## A. Adding AI-generated images

1. **Generate it** from the post's complete prompt in `prompts.csv`, using an image generator whose terms let you publish the images.
2. **Choose the best result.** It should look like a high-quality photo from a popular Instagram creator: beautiful light, sharp detail, natural colours and a real person, place or plate of food. Zoom in on hands, faces, teeth, reflections and anything that looks like writing or a logo, and generate again if anything is off. Skip results that look like illustrations, 3D renders or heavily retouched adverts. Across the feed, no two pictures should look like the same model, the same room or the same shoot, except where a recurring creator appears on purpose.
3. **Keep the shape.** Use the aspect ratio given for the post. The exact size doesn't matter: the build resizes and compresses every picture automatically, so a big PNG straight from the generator is fine.

   | Shape | Good size |
   | --- | --- |
   | 4:5 portrait | 1080 × 1350 |
   | 1:1 square | 1080 × 1080 |
   | 3:2 landscape | 1080 × 720 |
   | Profile picture | 400 × 400 |

4. **Name it as listed** (for example `post-mirror-fit.jpg`) and put it in `photos/ai/`. Names are forgiving: `.png`, `.webp`, capitals, spaces and underscores all work, `mirror-fit.png` without the `post-` is fine, and so is a sub-folder or a whole `.zip` file dropped in as it is. A file whose name matches nothing is skipped with a warning, never shown.
5. **Rebuild** with `npm run build`. The post now appears in the feed with a small **AI info** label next to the creator's name, the way Instagram labels AI images. Settings → Photo credits shows how many pictures are AI-generated.

Carousel photos (`-2`, `-3`) are optional: a post shows whichever of its photos exist. To keep a carousel looking like one occasion, generate its photos together, or give the generator the post's first photo as a reference.

**Please keep it honest:**
- Don't ask for a real or famous person, a real brand, or a real team. All creators are fictional, and their profiles say so.
- Don't use photos of real people (friends, classmates) as creator pictures unless they have said yes.
- Keep AI images in `photos/ai/` so they stay labelled. Don't move them into `photos/` with a credit that says someone photographed them.

## Temporary drafts

`photos/ai/temporary/` holds low-resolution stand-in pictures, so a post can appear before its final picture is ready. They were enlarged from small previews, so they look softer than a real photo on a phone, and `photos/ai/temporary/notes.csv` says what each final version should fix.

To replace one, put the final picture with the **same name** in `photos/ai/` (not in `temporary/`) and rebuild. The final picture always wins; the build then says the draft can be deleted. Every build writes **`photos/ai/replace.csv`**: the prompts for the drafts still waiting for a final version.

## Recurring people

Some creators (and pets) appear in several photos. Their prompts all include the same description, so they look like the same person or animal. For the best match, generate their profile picture first and give it to the generator as a reference image (many generators call this a "character reference" or "use this person").

| Person | Description | Pictures |
| --- | --- | --- |
| Jun | a slim man in his early twenties with short black hair and a clean-shaven face | `post-mirror-fit.jpg`, `post-layers.jpg`, `post-rings.jpg`, `avatar-jun.wears.jpg` |
| Rania | a woman in her mid-twenties with long dark curly hair, warm olive skin and brown eyes | `post-grwm.jpg`, `post-red-lip.jpg`, `post-curls.jpg`, `post-nails.jpg`, `avatar-glambyrania.jpg` |
| Chloé | a woman in her late twenties with a short brown bob, fair skin and light freckles | `post-sunday-fit.jpg`, `post-sunnies.jpg`, `avatar-chloe.styled.jpg` |
| Amara | a woman in her early twenties with long box braids, deep brown skin and a wide smile | `post-birthday-dinner.jpg`, `post-dress-fitting.jpg`, `post-dress-fitting-2.jpg`, `post-karaoke.jpg`, `post-ferris-wheel.jpg`, `post-beach-jump.jpg`, `avatar-amara.ok.jpg` |
| Lucas | a man in his early twenties with messy light-brown hair and a short beard | `post-roommate-dinner.jpg`, `post-game-night.jpg`, `avatar-the.lucas.files.jpg` |
| Kai | a tall, athletic man in his early twenties with short black hair | `post-pickup-run.jpg`, `avatar-kai.hoops.jpg` |
| Sam | a man in his mid-twenties with sun-bleached shoulder-length hair and a light tan | `post-dawn-surf.jpg`, `avatar-sam.ortiz.jpg` |
| Hana | a woman in her early twenties with a straight black shoulder-length bob and bangs | `post-umbrella.jpg`, `avatar-its.hana.k.jpg` |
| Dani | a woman in her twenties with a long dark ponytail | `post-matchday.jpg`, `avatar-matchday.dani.jpg` |
| Yasmin | a woman in her early twenties with long wavy dark-brown hair | `avatar-yasmin.daily.jpg` |
| Waffles | a red-and-white Pembroke Welsh corgi with a white chest and white paws | `post-zoomies.jpg`, `post-bath-day.jpg`, `post-stolen-sock.jpg`, `avatar-waffles.the.corgi.jpg` |
| Pepper and Plum | a sleek black cat with yellow eyes and a fluffy grey cat with green eyes | `post-one-box.jpg`, `avatar-pepper.and.plum.jpg` |
| Plum | a fluffy grey cat with green eyes | `post-laptop-cat.jpg` |

## How big the site gets

The build makes two versions:

- `docs/`: the website (for GitHub Pages). Pictures are separate 1080 px files in `docs/photos/` that load as you scroll, so it stays fast however many posts there are.
- `dist/scrollwise.html`: an offline copy in one file, with every picture inside it (resized to 828 px wide). With pictures for all 80 posts it comes to about 9–10 MB.

`npm run build:final` builds both without the temporary drafts in `photos/ai/temporary/` (posts whose only picture is a draft are then hidden).

## B. Adding licensed photos

1. **Find a photo you are allowed to use.** Good sources: [Unsplash](https://unsplash.com/license) and [Pexels](https://www.pexels.com/license/). Do not take photos from Google Images or Instagram.
2. **Download it** (any size; the build compresses it).
3. **Name it after the slot** (for example `post-tram.jpg`) and put it in `photos/`.
4. **Add a credit entry** to `photos/credits.json`, inside the `"photos"` list:

   ```json
   {
     "id": "post-tram",
     "file": "post-tram.jpg",
     "alt": "A yellow tram on a steep cobbled street",
     "author": "Photographer's name",
     "license": "Unsplash License",
     "link": "https://unsplash.com/photos/the-photo-page"
   }
   ```

   Optional extras: `"focus": "40% 50%"` moves the crop centre, `"changes": "cropped"` notes edits.
5. **Rebuild:** `npm run build`. Settings → Photo credits lists it automatically.

A file in `photos/` without an entry in `credits.json` is skipped on purpose, so nothing unlicensed slips in.

## Changing posts

Posts, captions, comments and creators live in `src/data/posts.js`, grouped by section. The feed mixes the sections evenly, so every session of 8 posts feels varied, and never shows the same creator twice in a row. Posting times ("3 hours ago") are worked out from each post's place in the feed. `ratio` sets the shape (`'4:5'`, `'1:1'` or `'3:2'`) and `more: 2` allows two extra carousel photos. A new post just needs a matching picture to appear.

Each new session shows only posts you haven't seen yet, and is never bigger than the number of new posts left, so posts aren't recycled while new ones remain. Once you've seen them all, Continue intentionally says you're all caught up, and only if you carry on does it show earlier posts again, oldest first.

## Friends & everyday (20)

**Style for this section:** *Natural lifestyle photography as shared by a popular Instagram creator: authentic, unposed moment, genuine expressions, soft flattering natural light, gentle shallow depth of field, rich but natural colours, clean and well-composed frame.*

### `birthday-dinner` · amara.ok · 4:5 portrait

> another year older, zero years wiser 🎂 thank you for the best night, i love you all. swipe for the cake situation

- **`post-birthday-dinner.jpg`**: Four young adult friends laughing around a small dining table at an evening birthday dinner at home while one leans in to blow out the candles on a cake; warm string lights, glasses and plates on the table, eye-level shot across the table. *(recurring person: Amara)*
- **`post-birthday-dinner-2.jpg`** *(carousel, optional)*: A homemade layer cake with white frosting, colourful sprinkles and lit candles on a kitchen counter, frosting slightly uneven, warm candlelight glow, three-quarter angle close-up.
- **`post-birthday-dinner-3.jpg`** *(carousel, optional)*: Gold and blush-pink balloons and a paper garland arranged on a living-room wall above a sofa, evening lamp light, straight-on wide shot.

### `ferris-wheel` · amara.ok · 4:5 portrait

> the screaming you can’t hear in this photo is all him 🎡 he said the ferris wheel was “too high”

- **`post-ferris-wheel.jpg`**: Three young adult friends squeezed together for a selfie at a fairground at dusk, laughing, one pulling a funny face, an illuminated ferris wheel glowing behind them, arm’s-length angle. *(recurring person: Amara)*
- **`post-ferris-wheel-2.jpg`** *(carousel, optional)*: Two friends sharing a big cloud of pink candy floss at a fair at night, colourful ride lights forming bokeh behind them, medium shot.

### `karaoke` · amara.ok · 4:5 portrait

> we were not good. we were LOUD. there’s a difference 🎤

- **`post-karaoke.jpg`**: Two young women singing dramatically into microphones in a small private karaoke room, pink and blue neon light, a third friend laughing on the sofa, wide shot from the doorway. *(recurring person: Amara)*

### `picnic` · yasmin.daily · 4:5 portrait

> everyone brought “just snacks” and somehow we had enough food for 30 people

- **`post-picnic.jpg`**: Top-down view of a gingham picnic blanket in a park covered with strawberries, sandwiches, crisps and drinks, friends’ legs, sneakers and hands reaching in from the edges, dappled afternoon sunlight through trees.
- **`post-picnic-2.jpg`** *(carousel, optional)*: Three friends lying on the grass in a park laughing, photographed from directly above, sunglasses and summer clothes, bright warm light.

### `study-night` · yasmin.daily · 4:5 portrait

> library at 10pm. three coffees in. essay is 40% done and so am i

- **`post-study-night.jpg`**: A university library desk at night with an open laptop, handwritten notes with yellow highlighter and a takeaway coffee cup, a warm desk lamp pooling light, rows of bookshelves softly out of focus behind; screen and notes not legible.

### `roommate-dinner` · the.lucas.files · 3:2 landscape

> three roommates, one frying pan, zero plan. somehow it was edible

- **`post-roommate-dinner.jpg`**: Three young men in their early twenties cooking together in a tiny flat kitchen, one stirring a steaming frying pan, one laughing, one holding a spatula, counter full of ingredients, warm overhead light, wide shot. *(recurring person: Lucas)*

### `game-night` · the.lucas.files · 1:1 square

> game night ended friendships. we’re all still here though

- **`post-game-night.jpg`**: Friends sitting on the floor around a coffee table playing a card game at night, snacks and drinks everywhere, one person mid-laugh holding their cards, warm lamp light, high angle; cards not legible. *(recurring person: Lucas)*

### `beach-jump` · amara.ok · 3:2 landscape

> took 41 tries to get everyone in the air at the same time. worth it

- **`post-beach-jump.jpg`**: Four friends jumping into the air at the same moment on a sandy beach at golden hour, arms raised, the sea and low sun behind them, wide shot from a low angle. *(recurring person: Amara)*

### `bonfire` · sam.ortiz · 3:2 landscape

> someone brought a guitar and only knew half of one song. we sang it six times

- **`post-bonfire.jpg`**: Friends in hoodies sitting around a small bonfire on a beach at night, one holding an acoustic guitar, faces lit warm orange, sparks rising, deep blue sky and dark sea behind.

### `first-snow` · its.hana.k · 4:5 portrait

> first snow. i am 100% the person who stops to take a photo every single time

- **`post-first-snow.jpg`**: A quiet residential street at blue hour covered in fresh snow, a single line of footprints, a glowing streetlight and snowflakes falling, cosy houses with lit windows, eye-level view down the street.

### `new-keys` · sofs.room · 4:5 portrait

> got the keys!! tiny flat, slightly crooked door, all mine 🗝️

- **`post-new-keys.jpg`**: A hand holding a set of new keys in front of a slightly worn wooden apartment door with a brass handle, soft daylight, close-up with the door gently out of focus.

### `sunday-market` · sofs.room · 4:5 portrait

> went for bread, came back with flowers. every single sunday

- **`post-sunday-market.jpg`**: Buckets of bright tulips and pink peonies at an outdoor Sunday flower stall, a wicker basket with a baguette in the corner of the frame, soft morning light, close-up at flower height; no price signs.

### `laundromat` · its.hana.k · 4:5 portrait

> laundromat at 11pm hits different. main character energy, minus the plot

- **`post-laundromat.jpg`**: A laundromat at night with a long row of round front-loading washing machines, one spinning, cool fluorescent light and a single plastic chair, symmetrical cinematic composition; no signs.

### `bowling` · yasmin.daily · 3:2 landscape

> scored 64. got a strike once and celebrated like i won the lottery

- **`post-bowling.jpg`**: A bowling alley lane seen from behind the bowler as the ball rolls toward the pins, friends cheering in the foreground with arms up, colourful lane lights; no screens visible.

### `dahlia` · greenhouse.ivy · 3:2 landscape

> the dahlia i was told would never bloom: bloomed. announced it to the entire flat like breaking news 🌸

✓ Uses the licensed photo **dahlia** (see Settings → Photo credits). Nothing to do.

### `room-glowup` · sofs.room · 4:5 portrait

> room before & after 🛋️ everything except the bed was secondhand. total spend: less than my phone bill

- **`post-room-glowup.jpg`**: A cosy small bedroom corner in the evening: a neatly made bed with linen bedding, warm fairy lights along the wall, a rattan armchair, a few plants and framed prints above the bed, a vintage rug, interior-magazine style but lived-in.
- **`post-room-glowup-2.jpg`** *(carousel, optional)*: The same small bedroom before decorating: bare white walls, a mattress on the floor and stacked cardboard moving boxes, flat daylight, same viewpoint as an interior shot.
- **`post-room-glowup-3.jpg`** *(carousel, optional)*: A vintage brass table lamp and a stack of books on a wooden nightstand, warm lamp light, close-up; book spines not legible.

### `cinema` · reel.ben · 1:1 square

> two hours forty-seven minutes. no regrets. the popcorn did not survive the trailers

- **`post-cinema.jpg`**: A large striped tub of popcorn and two paper cinema tickets resting on a red velvet cinema seat, the dark auditorium lit by the glow of the screen; tickets not legible.

### `book-haul` · lina.reads · 4:5 portrait

> went in for one book. you know how this ends

- **`post-book-haul.jpg`**: A stack of new paperback books on a white duvet with a tabby cat’s paw reaching into the frame to touch them, soft window light, top-down view; titles not legible.
- **`post-book-haul-2.jpg`** *(carousel, optional)*: A cosy independent bookshop aisle with tall wooden shelves full of books and a worn leather reading armchair, warm light, eye-level view down the aisle; titles not legible.

### `plant-shelf` · greenhouse.ivy · 4:5 portrait

> new shelf, new plants, same amount of floor space (none)

- **`post-plant-shelf.jpg`**: A sunny window shelf in a small flat packed with houseplants in terracotta pots, trailing pothos and a small brass watering can, morning light streaming in.

### `movie-marathon` · reel.ben · 3:2 landscape

> three movies, one blanket fort, zero plans. ranking them in the comments

- **`post-movie-marathon.jpg`**: A living room at night lit by the TV glow and fairy lights, a blanket fort built over the sofa, snacks and drinks on the coffee table, wide shot; nothing legible on the screen.

## Fashion & beauty (15)

**Style for this section:** *Editorial fashion and beauty photography: flattering directional light, crisp detail in fabric, hair and skin, natural skin texture with visible pores and minimal retouching, refined composition, premium magazine quality.*

### `mirror-fit` · jun.wears · 4:5 portrait

> fit check before the gallery thing tonight. the jacket was $14 at the flea market and i am still not over it

- **`post-mirror-fit.jpg`**: Mirror selfie in a stylish bedroom: a young man holding his phone in front of his face, wearing a brown suede jacket, plain white t-shirt, wide grey trousers and chunky white sneakers, warm evening lamp light, full-length framing. *(recurring person: Jun)*
- **`post-mirror-fit-2.jpg`** *(carousel, optional)*: Chunky white sneakers and the hem of wide grey trousers on a light wooden floor, seen from above, natural daylight, crisp laces and texture.
- **`post-mirror-fit-3.jpg`** *(carousel, optional)*: A brown suede jacket hanging on a hook on the back of a white bedroom door, soft afternoon window light raking across the suede texture.

### `thrift-haul` · jun.wears · 1:1 square

> thrift haul 🧥 the cardigan was in the "damaged" bin and it has ONE loose button

- **`post-thrift-haul.jpg`**: Three second-hand clothes held up on hangers in front of a colourful thrift-shop rail: a chunky green knit cardigan, a striped button-up shirt and a faded denim jacket; no tags legible.

### `layers` · jun.wears · 4:5 portrait

> it was 9 degrees so naturally i wore four layers and still complained

- **`post-layers.jpg`**: A young man with black hair walking down an autumn street in a long charcoal coat over a grey hoodie and a knitted scarf, fallen leaves on the pavement, soft overcast light, street-style shot from across the road. *(recurring person: Jun)*

### `grwm` · glambyrania · 4:5 portrait

> soft glam for a friday that did not deserve this much effort ✨ products in the comments if anyone wants them

- **`post-grwm.jpg`**: Close-up beauty selfie of a young woman with soft brown eyeshadow, glossy lips and a sleek low bun, warm golden window light on her face, small gold hoop earrings, bathroom shelf softly out of focus behind. *(recurring person: Rania)*
- **`post-grwm-2.jpg`** *(carousel, optional)*: Flat lay of makeup on a white marble bathroom counter: an eyeshadow palette, lip gloss, a brush, a tortoiseshell claw clip and a few gold rings, soft morning light; no brand names.

### `nails` · glambyrania · 1:1 square

> new set. yes i will be typing like this for three weeks 💅

- **`post-nails.jpg`**: Close-up of a hand with glossy chrome almond-shaped nails holding an iced coffee in a clear cup, café table and window light behind. *(recurring person: Rania)*

### `red-lip` · glambyrania · 4:5 portrait

> tried a red lip for the first time in a year and remembered why i love it 💋

- **`post-red-lip.jpg`**: Beauty portrait of a smiling young woman with dark curly hair pinned up, classic red lipstick and soft winged eyeliner, gold stud earrings, soft daylight from a large window. *(recurring person: Rania)*

### `curls` · glambyrania · 4:5 portrait

> wash day results. 2 hours, 4 products, 1 diffuser, 0 patience. they behaved though

- **`post-curls.jpg`**: The back of a young woman’s head showing long, bouncy, well-defined dark curly hair, backlit by a bright window so the curls glow at the edges. *(recurring person: Rania)*

### `skincare-shelf` · glambyrania · 1:1 square

> shelf reset. yes i will use all of these. no i will not be taking questions

- **`post-skincare-shelf.jpg`**: A tidy white bathroom shelf with glass skincare bottles and jars, a small trailing plant and a rolled linen towel, soft morning light; no labels.

### `sunday-fit` · chloe.styled · 4:5 portrait

> dimanche. long coat, loafers, and a croissant somewhere out of frame 🥐

- **`post-sunday-fit.jpg`**: A young woman with a short brown bob walking past a small café on a cobbled street, wearing a long camel coat, white shirt, straight jeans and brown loafers, street-style shot from across the street, soft overcast light. *(recurring person: Chloé)*
- **`post-sunday-fit-2.jpg`** *(carousel, optional)*: Brown leather loafers and white socks on old cobblestones, seen from above, soft light, crisp leather detail.
- **`post-sunday-fit-3.jpg`** *(carousel, optional)*: A small brown leather shoulder bag on a round café table next to a cappuccino and a croissant, window light, close-up.

### `vintage-bag` · chloe.styled · 1:1 square

> flea market find of the year. the man said “it’s old” and i said “perfect”

- **`post-vintage-bag.jpg`**: A hand holding up a vintage cognac leather handbag at a flea-market stall full of second-hand bags and silk scarves, outdoor daylight; no logos.

### `sunnies` · chloe.styled · 4:5 portrait

> new sunglasses, same face. the beach did most of the work

- **`post-sunnies.jpg`**: A young woman with a short brown bob wearing oval sunglasses and a blue-and-white striped shirt, smiling on a sunny seaside promenade, the sea behind her, medium shot. *(recurring person: Chloé)*

### `rings` · jun.wears · 1:1 square

> ring count went from 2 to 7 this year and i have no plans to stop

- **`post-rings.jpg`**: Close-up of a man’s hand wearing several chunky silver rings, resting on the knee of faded blue jeans, natural daylight showing the metal texture. *(recurring person: Jun)*

### `dress-fitting` · amara.ok · 4:5 portrait

> wedding guest dilemma. left or right? (swipe) be honest, i can take it

- **`post-dress-fitting.jpg`**: A young woman with long box braids taking a mirror selfie in a boutique changing room, wearing an emerald-green satin midi dress, curtain and hooks with clothes behind her, flattering warm light. *(recurring person: Amara)*
- **`post-dress-fitting-2.jpg`** *(carousel, optional)*: The same changing-room mirror selfie with the young woman now wearing a navy floral midi dress, same warm light and framing. *(recurring person: Amara)*

### `fresh-cut` · omar.fades · 4:5 portrait

> fresh fade friday ✂️ he came in asking for “a trim”. we did not trim

- **`post-fresh-cut.jpg`**: A young man sitting in a barber chair seen in the mirror, showing a sharp fresh skin fade, the barber’s hand holding a hand mirror behind his head, warm barbershop light.

### `barber-chair` · omar.fades · 3:2 landscape

> monday morning, shop’s quiet, coffee’s on. the calm before the saturday storm

- **`post-barber-chair.jpg`**: An empty vintage leather barber chair in a sunlit small barbershop with large mirrors, combs, clippers and a coffee cup on the counter, wide shot; no signs.

## Food & cafés (15)

**Style for this section:** *Appetising commercial-quality food photography: soft window light with gentle shadows, sharp mouth-watering textures, rich natural colours, styled but believable setting, shallow depth of field.*

### `espresso` · zaid.eats · 3:2 landscape

> new café rating system: if the table wobbles but the espresso is perfect, it’s a 9/10. this one’s a 9/10 ☕

✓ Uses the licensed photo **coffee** (see Settings → Photo credits). Nothing to do.

### `pasta-night` · zaid.eats · 4:5 portrait

> the waiter said “trust me” and i did. best decision of my week 🍝 swipe for dessert

- **`post-pasta-night.jpg`**: A plate of rigatoni in rich red tomato sauce with fresh basil and grated parmesan on a red-and-white checked tablecloth in a small trattoria, a glass of water beside it, warm evening light, 45-degree angle.
- **`post-pasta-night-2.jpg`** *(carousel, optional)*: A tiramisu in a small glass dish dusted with cocoa, a spoon beside it on a restaurant table, warm light, close-up.

### `latte-art` · zaid.eats · 1:1 square

> the barista drew a heart. i drew a conclusion: i live here now

- **`post-latte-art.jpg`**: A latte with a perfect heart in the milk foam in a white ceramic cup on a marble café table, a teaspoon beside it, soft window light, shot from directly above.

### `croissants` · zaid.eats · 4:5 portrait

> bought one croissant for now and one for later. there is no later

- **`post-croissants.jpg`**: Golden, flaky croissants spilling out of an open brown paper bag on a bakery counter, crumbs scattered, warm morning light, close-up.

### `ramen` · mei.eats.out · 4:5 portrait

> rating: 9.5/10. lost half a point because i burned my tongue, which is my fault, but still

- **`post-ramen.jpg`**: A steaming bowl of ramen with a halved soft-boiled egg, sliced pork, spring onions and nori on a wooden counter in a small noodle bar, chopsticks resting on the bowl, steam rising, slightly above eye level.

### `dumplings` · mei.eats.out · 1:1 square

> ordered 12 dumplings “to share”. did not share

- **`post-dumplings.jpg`**: Chopsticks lifting a dumpling from a bamboo steamer, a small dish of soy dipping sauce beside it, steam rising, dark restaurant table.

### `night-market` · mei.eats.out · 4:5 portrait

> night market loop: skewers, bao, something fried on a stick i couldn’t identify. all 10/10

- **`post-night-market.jpg`**: A busy outdoor night-market food stall with skewers grilling over open flames, smoke rising into warm hanging bulbs, people queuing in the background; no signs.

### `tacos` · sam.ortiz · 3:2 landscape

> post-surf tacos are a food group

- **`post-tacos.jpg`**: Three tacos with lime wedges and fresh salsa on a paper plate on a food-truck counter at sunset, the beach softly out of focus behind.

### `sourdough` · priya.bakes · 4:5 portrait

> attempt #11. it has an ear. it has a crumb. i am emotional 🍞

- **`post-sourdough.jpg`**: A rustic sourdough loaf cut in half on a wooden board, showing an open airy crumb and crisp crust, flour dusting and a bread knife, kitchen window light.

### `cinnamon-rolls` · priya.bakes · 1:1 square

> house smells incredible. roommates have formed a queue

- **`post-cinnamon-rolls.jpg`**: A baking tray of freshly baked cinnamon rolls with white icing dripping down the sides, one already missing, shot from directly above on a kitchen counter.

### `cake-decorating` · priya.bakes · 4:5 portrait

> my sister’s birthday cake, mid-build. swipe for the finished thing (and the frosting on my elbow)

- **`post-cake-decorating.jpg`**: Hands piping pink buttercream onto a layer cake on a turntable in a bright home kitchen, bowls and sprinkles around, close-up.
- **`post-cake-decorating-2.jpg`** *(carousel, optional)*: A finished pink layer cake topped with fresh raspberries and blueberries on a cake stand in a kitchen, soft light, eye level.

### `brunch` · yasmin.daily · 4:5 portrait

> brunch with the girls = 2 hours of talking and 15 minutes of eating

- **`post-brunch.jpg`**: Overhead view of a café table crowded with pancakes, avocado toast, poached eggs, iced coffees and a small vase of flowers, several friends’ hands reaching in with forks, bright morning light.
- **`post-brunch-2.jpg`** *(carousel, optional)*: A tall stack of fluffy pancakes with berries and maple syrup dripping down the sides, close-up at plate level.

### `iced-matcha` · yasmin.daily · 4:5 portrait

> iced matcha by the window. i am pretending to study

- **`post-iced-matcha.jpg`**: An iced matcha latte in a clear glass on a café window ledge, sunlight through the glass, an open notebook and pen softly out of focus behind.

### `burger-night` · the.lucas.files · 3:2 landscape

> diner burger at 11pm with the boys. cardiologist, look away

- **`post-burger-night.jpg`**: A cheeseburger with fries and a chocolate milkshake on a diner table with red vinyl booth seats, warm neon-tinged light, three-quarter angle.

### `pizza-floor` · the.lucas.files · 1:1 square

> moved the sofa out, forgot to move it back in. pizza on the floor it is

- **`post-pizza-floor.jpg`**: Open plain pizza boxes on a living-room floor with friends sitting cross-legged around them holding slices, warm evening lamp light, shot from above; no logos.

## Pets & funny moments (10)

**Style for this section:** *Natural lifestyle photography of a genuine, funny everyday moment: tack-sharp focus on the subject (crisp fur and bright eyes when an animal is shown), soft natural light, warm natural colours, playful but clean composition.*

### `biscuit-judges` · lina.reads · 3:2 landscape

> biscuit has reviewed my reading list and would like to speak to the manager

✓ Uses the licensed photo **cat** (see Settings → Photo credits). Nothing to do.

### `zoomies` · waffles.the.corgi · 4:5 portrait

> first time at the beach. ran directly into the sea. regrets nothing 🌊🐾

- **`post-zoomies.jpg`**: A corgi sprinting along wet sand at the edge of small waves, ears flapping, mouth open in joy, water droplets frozen in the air, low angle at dog height. *(recurring person: Waffles)*

### `bath-day` · waffles.the.corgi · 1:1 square

> bath day. i have been betrayed by the people i love most

- **`post-bath-day.jpg`**: A damp corgi wrapped in a striped bath towel sitting on a bathroom floor, looking sulky and betrayed, fur wet and spiky, eye-level close-up. *(recurring person: Waffles)*

### `stolen-sock` · waffles.the.corgi · 4:5 portrait

> found a sock. it is my sock now. this is not up for debate

- **`post-stolen-sock.jpg`**: A corgi lying on a living-room rug proudly holding a colourful striped sock in its mouth, looking straight at the camera, dog-height angle. *(recurring person: Waffles)*

### `one-box` · pepper.and.plum · 1:1 square

> we were given two boxes. we chose one. together. aggressively

- **`post-one-box.jpg`**: A black cat and a grey cat squeezed together into one small cardboard box on a wooden floor, an empty second box right next to them. *(recurring person: Pepper and Plum)*

### `laptop-cat` · pepper.and.plum · 4:5 portrait

> sara had a deadline. plum had other plans

- **`post-laptop-cat.jpg`**: A grey cat asleep sprawled across a laptop keyboard on a home desk, a mug and notebook nearby, afternoon window light; screen not visible. *(recurring person: Plum)*

### `ice-cream` · its.hana.k · 4:5 portrait

> me vs the sun. the sun won

- **`post-ice-cream.jpg`**: A hand holding a waffle cone of strawberry ice cream melting and dripping down the wrist on a sunny street, bright summer light, close-up.

### `movie-nap` · its.hana.k · 4:5 portrait

> my dad picked the movie. my dad fell asleep 11 minutes in. every single time

- **`post-movie-nap.jpg`**: A middle-aged man asleep on a living-room sofa with his mouth slightly open, a blanket half on him and a bowl of popcorn tipping on his lap, lit by the cool glow of the TV in a dark room.

### `umbrella` · its.hana.k · 4:5 portrait

> my umbrella lasted 40 seconds. a personal best

- **`post-umbrella.jpg`**: A person on a windy, rainy city street holding a black umbrella blown completely inside out, raindrops frozen in the air, medium shot. *(recurring person: Hana)*

### `pigeon` · the.lucas.files · 3:2 landscape

> looked away for one second. one second.

- **`post-pigeon.jpg`**: A pigeon on a park bench pulling a chip out of a paper cone of fries, a person’s hand reaching in too late from the edge of the frame, sunny park.

## Travel & lifestyle (10)

**Style for this section:** *Breathtaking travel photography: beautiful natural light, wide dynamic range, sharp detail from foreground to background, rich true-to-life colours, strong composition with depth and a clear focal point.*

### `palace-view` · wild.atlas · 3:2 landscape

> climbed every single step to the top for this view. legs: gone. worth it 🏯 #beijing #travel

✓ Uses the licensed photo **summer-palace** (see Settings → Photo credits). Nothing to do.

### `tram` · wild.atlas · 4:5 portrait

> rode the yellow tram up the hill four times just because. would do it again tomorrow

- **`post-tram.jpg`**: A vintage yellow tram climbing a steep, narrow cobbled street between pastel-coloured old buildings with small balconies, bright afternoon sun; no legible signs.

### `window-seat` · wild.atlas · 4:5 portrait

> window seat, always. i will climb over you to get to the bathroom and i’m sorry in advance

- **`post-window-seat.jpg`**: The view from an aeroplane window over the wing and a sea of fluffy white clouds in warm late-afternoon sun, part of the window frame visible.

### `rain-street` · mira.lens · 4:5 portrait

> rain + neon = free photoshoot 🌧️

- **`post-rain-street.jpg`**: A narrow city street at night in the rain, neon shop signs glowing and reflected in puddles, one person with a black umbrella crossing, moody cinematic street scene; signs not legible.

### `pier-sunset` · goldenhour.gabe · 4:5 portrait

> every sunset here looks fake and every single one is real

- **`post-pier-sunset.jpg`**: A long wooden pier stretching into a calm sea at sunset, orange and violet sky reflected in the water, a few silhouettes at the far end, low-angle leading lines.

### `rooftops` · goldenhour.gabe · 3:2 landscape

> 7:42pm. rooftops doing their thing 🧡

- **`post-rooftops.jpg`**: Terracotta city rooftops and an old church dome glowing in warm sunset light, seen from a high viewpoint.

### `balcony-coffee` · goldenhour.gabe · 4:5 portrait

> sunrise coffee on the balcony. the only time i’m a morning person is on holiday

- **`post-balcony-coffee.jpg`**: A cup of coffee on a small mosaic balcony table overlooking a calm sea at sunrise, a wrought-iron railing, soft pink light.

### `alpine-lake` · aisha.abroad · 3:2 landscape

> hiked 2 hours for this lake and the water was actually this colour. my photos don’t even do it justice

- **`post-alpine-lake.jpg`**: A turquoise alpine lake surrounded by pine forest and rocky mountain peaks under a clear blue sky, a hiker’s boots on a rock in the foreground.

### `lantern-alley` · aisha.abroad · 4:5 portrait

> got lost in the old market for an hour and found the best mint tea of my life

- **`post-lantern-alley.jpg`**: A narrow old market alley hung with colourful glass lanterns, woven rugs and brass lamps, shoppers walking through, warm glowing light; no signs.

### `train-window` · aisha.abroad · 3:2 landscape

> 6 hours on a train, 0 hours bored. this is my favourite way to travel

- **`post-train-window.jpg`**: The view from a train window of green rolling hills and a small village, a coffee cup on the window ledge, soft reflections on the glass.

## Sports, music & hobbies (10)

**Style for this section:** *Dynamic, high-energy photography: fast shutter that freezes the action, dramatic natural, stadium or stage lighting, crisp detail on the subject, rich natural colours, bold composition.*

### `pickup-run` · kai.hoops · 4:5 portrait

> lost 21–18 and i am choosing to blame the wind. rematch friday

- **`post-pickup-run.jpg`**: An outdoor basketball court at dusk under floodlights, young adults playing a pickup game, one player frozen mid jump shot, chain-link fence and city buildings behind; no logos. *(recurring person: Kai)*

### `new-kicks` · kai.hoops · 1:1 square

> new hoop shoes. first game in them tonight. if i lose it’s their fault

- **`post-new-kicks.jpg`**: A pair of new white and orange basketball shoes standing on the painted lines of an outdoor court, very low angle, late-afternoon sun; no brand marks.

### `matchday` · matchday.dani · 3:2 landscape

> last-minute winner, three strangers hugged me, i hugged them back. football is the best thing ever invented ⚽

- **`post-matchday.jpg`**: Football fans in striped scarves celebrating in the stands of a packed stadium at night, arms raised, strangers hugging, floodlights flaring; no club badges. *(recurring person: Dani)*
- **`post-matchday-2.jpg`** *(carousel, optional)*: A floodlit football pitch seen from high in the stands before kickoff, vivid green grass and white lines, crowd filling the stands, deep blue evening sky.

### `dawn-surf` · sam.ortiz · 3:2 landscape

> dawn patrol. water like glass and nobody else out. don’t ask me where this is

- **`post-dawn-surf.jpg`**: A lone surfer riding a small, clean glassy wave at sunrise, spray frozen in the air, orange and pink sky reflected on the water, telephoto view from the shore. *(recurring person: Sam)*

### `front-row` · low.tide.audio · 4:5 portrait

> barrier. sweaty. lost my voice by song four. 10/10 would get squashed again

- **`post-front-row.jpg`**: View from inside the crowd at an intimate indoor concert: a singer at the microphone under purple and orange stage lights, haze in the air, raised hands silhouetted in the foreground.
- **`post-front-row-2.jpg`** *(carousel, optional)*: A concert crowd jumping as confetti falls through coloured stage lights, energy and movement, wide shot from the side of the stage.

### `record-shop` · low.tide.audio · 4:5 portrait

> two hours crate digging, came out with one record with no sleeve notes. best purchase of the month

- **`post-record-shop.jpg`**: Hands flipping through vinyl records in a wooden crate at a small record shop, shelves of records behind, warm light, close-up; album covers not legible.

### `car-meet` · ellis.drives · 4:5 portrait

> cleanest little boxy hatchback at the meet this morning. mint green, original paint. the owner let me sit in it and i nearly cried

- **`post-car-meet.jpg`**: A mint-green boxy 1980s hatchback with chrome bumpers parked at a sunny morning classic-car meet, other vintage cars and people behind, low three-quarter angle with crisp reflections; no badges, blank number plates.
- **`post-car-meet-2.jpg`** *(carousel, optional)*: Inside an old 1980s car: a simple retro dashboard, thin steering wheel and worn seats, sunlight through the windscreen.
- **`post-car-meet-3.jpg`** *(carousel, optional)*: A row of colourful classic cars lined up at an outdoor morning car meet, people walking between them; no badges, blank number plates.

### `night-drive` · ellis.drives · 3:2 landscape

> 2am drive, windows down, same four songs on repeat

- **`post-night-drive.jpg`**: From the passenger seat at night: the driver’s hands on the steering wheel, a softly glowing dashboard and city lights streaking past through the windscreen.

### `deep-field` · orbit.notes · 4:5 portrait

> space fact #212: nearly every dot in this hubble picture is a whole galaxy, not a star. photo: NASA (public domain) 🌌

✓ Uses the licensed photo **deep-field** (see Settings → Photo credits). Nothing to do.

### `launch` · orbit.notes · 3:2 landscape

> launch pad at blue hour, waiting for the countdown. who else watches launches live? photo: SpaceX (public domain) 🚀

✓ Uses the licensed photo **launch-pad** (see Settings → Photo credits). Nothing to do.

## Profile pictures

Square, about 400 × 400, saved as `photos/ai/avatar-<username>.jpg`. Creators without one show the first letter of their name. Five creators already use a crop of a licensed photo (lina.reads, zaid.eats, wild.atlas, greenhouse.ivy, orbit.notes).

All of these people are fictional.

**Style:** *Professional-quality square profile photo: flattering natural light, sharp focus on the subject, natural skin texture, clean simple background, centred composition that still reads as a small circle.*

- **`avatar-jun.wears.jpg`** (Jun Park, Fashion): A young man in a black jacket taking a mirror selfie, the phone covering most of his face, plain light wall behind. *(recurring person: Jun)*
- **`avatar-chloe.styled.jpg`** (Chloé Martin, Style): A young woman with a short brown bob in a camel coat on a city street, face partly turned away from the camera. *(recurring person: Chloé)*
- **`avatar-glambyrania.jpg`** (Rania Saleh, Beauty): Close-up of a young woman with glossy lips and gold hoop earrings, half her face in warm window light. *(recurring person: Rania)*
- **`avatar-omar.fades.jpg`** (Omar Saidi, Barber): A barber in a black apron holding clippers in his barbershop, face partly out of frame.
- **`avatar-mei.eats.out.jpg`** (Mei Lin, Food): Chopsticks lifting noodles from a steaming bowl of ramen.
- **`avatar-priya.bakes.jpg`** (Priya Nair, Baking): Flour-dusted hands shaping bread dough on a wooden board.
- **`avatar-aisha.abroad.jpg`** (Aisha Bello, Travel): A young woman in a sun hat seen from behind, looking out over mountains.
- **`avatar-goldenhour.gabe.jpg`** (Gabe Silva, Sunsets): A bright orange sun setting over the sea.
- **`avatar-kai.hoops.jpg`** (Kai Nakamura, Basketball): A young man with a basketball on his shoulder on an outdoor court at golden hour, smiling, cap shading his face. *(recurring person: Kai)*
- **`avatar-matchday.dani.jpg`** (Dani Russo, Football): A young woman in a striped football scarf cheering in a stadium crowd at night. *(recurring person: Dani)*
- **`avatar-waffles.the.corgi.jpg`** (Waffles the Corgi, Pets): A happy corgi face, tongue out, green park behind. *(recurring person: Waffles)*
- **`avatar-pepper.and.plum.jpg`** (Pepper & Plum, Pets): A black cat and a grey cat sitting side by side on a sunny windowsill. *(recurring person: Pepper and Plum)*
- **`avatar-ellis.drives.jpg`** (Ellis Grant, Cars): The chrome side mirror of an old mint-green car reflecting a sunny street.
- **`avatar-low.tide.audio.jpg`** (Theo Brennan, Music): A young man playing bass guitar on a small stage in purple light, face partly in shadow.
- **`avatar-sofs.room.jpg`** (Sofia Lind, Home): A warm, fairy-lit bedroom corner with a rattan chair and a plant.
- **`avatar-amara.ok.jpg`** (Amara Mensah, Friends): A young woman laughing in sunglasses at a summer fair. *(recurring person: Amara)*
- **`avatar-yasmin.daily.jpg`** (Yasmin Aziz, Everyday): A young woman holding an iced coffee up so it covers half her face, smiling. *(recurring person: Yasmin)*
- **`avatar-the.lucas.files.jpg`** (Lucas Moreno, Everyday): A young man with messy hair laughing in a small kitchen. *(recurring person: Lucas)*
- **`avatar-sam.ortiz.jpg`** (Sam Ortiz, Beach): A surfer carrying a board along the beach at sunset, seen from behind. *(recurring person: Sam)*
- **`avatar-mira.lens.jpg`** (Mira Okafor, City): A young woman holding a film camera to her eye on a rainy street at night, the camera hiding most of her face.
- **`avatar-reel.ben.jpg`** (Ben Kowalski, Movies): A young man in a dark cinema lit by the screen, side profile, holding popcorn.
- **`avatar-its.hana.k.jpg`** (Hana Kim, Everyday): A young woman and her corgi side by side in the sun, both squinting happily; the corgi is Waffles, a red-and-white Pembroke Welsh corgi with a white chest and white paws. *(recurring person: Hana)*

## Activity pictures (optional)

Find Your Next Moment uses its own pictures, separate from the feed: the 46 real-life activities use illustrations drawn by ScrollWise. To use a photo instead, name it `activity-<id>.jpg`: put an AI image in `photos/ai/`, or a licensed photo in `photos/` with a `credits.json` entry. Landscape, about 1080 × 720.

| File name | Activity | What to show |
| --- | --- | --- |
| `activity-three-photo-quest.jpg` | The 3-Photo Quest | phone camera polaroid flat lay |
| `activity-color-hunt.jpg` | The Color Hunt | colorful objects rainbow flat lay |
| `activity-fashion-studio.jpg` | The Fashion Studio | outfit flat lay clothes |
| `activity-mini-artist.jpg` | The Mini Artist | sketchbook pencils drawing |
| `activity-conversation-spark.jpg` | The Conversation Spark | two friends talking cafe |
| `activity-nature-detective.jpg` | The Nature Detective | leaf texture close up |
| `activity-movement-mission.jpg` | The Movement Mission | stretching at home yoga mat |
| `activity-six-sentence-story.jpg` | The Six-Sentence Story | notebook pen writing desk |
| `activity-creative-reuse.jpg` | The Creative Reuse Challenge | upcycled jar pencil holder |
| `activity-sound-explorer.jpg` | The Sound Explorer | headphones notebook outdoors |
| `activity-cloud-gallery.jpg` | Cloud Gallery | clouds blue sky |
| `activity-playlist-portrait.jpg` | Playlist Portrait | phone music headphones |
| `activity-kitchen-remix.jpg` | Kitchen Remix | toast avocado plate top view |
| `activity-ten-page-escape.jpg` | Ten-Page Escape | reading book blanket tea |
| `activity-stair-climb.jpg` | The Stair Climb | stairs steps sneakers |
| `activity-dance-break.jpg` | One-Song Dance Break | dancing bedroom music |
| `activity-family-recipe.jpg` | Family Recipe Hunt | handwritten recipe card kitchen |
| `activity-macro-world.jpg` | Macro World | macro texture close up |
| `activity-blind-contour.jpg` | Blind Contour Portrait | line drawing pen paper |
| `activity-paper-plane-lab.jpg` | Paper Plane Lab | paper airplanes |
| `activity-windowsill-regrow.jpg` | Windowsill Regrow | green onions regrow water glass |
| `activity-neighborhood-map.jpg` | Neighborhood Map | hand drawn map |
| `activity-ten-words.jpg` | Ten Words, New Language | language learning notebook |
| `activity-handwritten-note.jpg` | Handwritten Note | handwritten card envelope |
| `activity-box-breathing.jpg` | Box Breathing Reset | calm sea horizon |
| `activity-slow-stretch.jpg` | Slow Stretch Flow | yoga mat stretching floor |
| `activity-mini-zine.jpg` | Make a Mini Zine | zine handmade booklet |
| `activity-room-glow-up.jpg` | Ten-Minute Room Glow-Up | tidy desk shelf styling |
| `activity-tiny-concert.jpg` | Tiny Concert | acoustic guitar playing |
| `activity-kitchen-percussion.jpg` | Kitchen Percussion | pots wooden spoons kitchen |
| `activity-sky-watch.jpg` | Sky Watch | sunset sky time lapse |
| `activity-game-revival.jpg` | Game Night Revival | board game cards family |
| `activity-color-wheel-outfit.jpg` | Color Wheel Outfit | color wheel fabric swatches |
| `activity-style-swap.jpg` | Style Swap | friends swapping clothes |
| `activity-leaf-rubbings.jpg` | Leaf Rubbings | leaf rubbing crayon art |
| `activity-shadow-studio.jpg` | Shadow Studio | dramatic shadow photography lamp |
| `activity-question-jar.jpg` | Question Jar | jar of paper notes |
| `activity-offline-rabbit-hole.jpg` | Offline Rabbit Hole | encyclopedia book notes |
| `activity-balance-lab.jpg` | Balance Lab | balancing stones cairn |
| `activity-jump-rounds.jpg` | Jump Rounds | jump rope sneakers |
| `activity-energy-bites.jpg` | No-Bake Energy Bites | energy balls oats snack |
| `activity-star-spotter.jpg` | Star Spotter | night sky stars |
| `activity-time-capsule.jpg` | Photo Time Capsule | polaroid photos box memories |
| `activity-compliment-mission.jpg` | Compliment Mission | sticky notes kind messages |
| `activity-plant-check-in.jpg` | Plant Check-In | houseplant watering can |
| `activity-window-poem.jpg` | Window Poem | window view notebook |
