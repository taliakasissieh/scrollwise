// The real-life activity library behind "Find Your Next Moment".
// Each activity: duration in minutes (5, 10, 15 or 30), moods and interests it fits,
// a category, where it happens, materials, steps and a cover picture.
// Covers are drawn scenes (src/lib/scenes/index.js) unless a licensed photo named
// activity-<id> is added in photos/ (see PHOTOS.md).

export const MOODS = [
  { id: 'creative', label: 'Creative', hint: 'Make something new', icon: 'pen', tone: 'lav' },
  { id: 'energetic', label: 'Energetic', hint: 'Get moving', icon: 'bolt', tone: 'blue' },
  { id: 'relaxed', label: 'Relaxed', hint: 'Slow things down', icon: 'wave', tone: 'mint' },
  { id: 'bored', label: 'Bored', hint: 'Anything but this', icon: 'dice', tone: 'lav' },
  { id: 'social', label: 'Social', hint: 'Do it with someone', icon: 'users', tone: 'mint' },
  { id: 'curious', label: 'Curious', hint: 'Figure something out', icon: 'search', tone: 'blue' },
];

export const TIMES = [
  { v: 5, hint: 'Quick reset' },
  { v: 10, hint: 'A proper break' },
  { v: 15, hint: 'Something real' },
  { v: 30, hint: 'Go all in' },
];

export const INTERESTS = [
  { id: 'art', icon: 'palette', label: 'Art' },
  { id: 'drawing', icon: 'pen', label: 'Drawing' },
  { id: 'photography', icon: 'camera', label: 'Photography' },
  { id: 'fashion', icon: 'shirt', label: 'Fashion' },
  { id: 'crafts', icon: 'scissors', label: 'Crafts' },
  { id: 'music', icon: 'music', label: 'Music' },
  { id: 'reading', icon: 'book', label: 'Reading' },
  { id: 'nature', icon: 'leaf', label: 'Nature' },
  { id: 'fitness', icon: 'dumbbell', label: 'Fitness' },
  { id: 'cooking', icon: 'utensils', label: 'Cooking' },
  { id: 'learning', icon: 'bulb', label: 'Learning' },
  { id: 'social', icon: 'users', label: 'Social activities' },
];

export const CATEGORIES = ['Creativity', 'Movement', 'Relaxation', 'Exploration', 'Learning', 'Connection', 'Productive'];

// How much energy an activity asks for. Matched against the energy level picked in Find Your Next Moment.
export const ENERGY = [
  { id: 'low', label: 'Low', hint: 'Calm and cosy', icon: 'batteryLow' },
  { id: 'medium', label: 'Some', hint: 'Up for a little', icon: 'batteryMid' },
  { id: 'high', label: 'Lots', hint: 'Ready to move', icon: 'batteryFull' },
];
export const ENERGY_LABEL = { low: 'Low energy', medium: 'Some energy', high: 'Lots of energy' };

export const MOOD_LABEL = Object.fromEntries(MOODS.map((m) => [m.id, m.label]));
export const INTEREST_LABEL = Object.fromEntries(INTERESTS.map((i) => [i.id, i.label]));

export const ACTIVITIES = [
  {
    id: 'three-photo-quest', title: 'The 3-Photo Quest', mins: 10, difficulty: 'Easy', category: 'Creativity', where: 'Anywhere',
    blurb: 'Find three ordinary things and photograph them so they tell a tiny story with a beginning, middle and end.',
    materials: ['Phone or camera'], moods: ['creative', 'bored', 'curious'], interests: ['photography', 'art'],
    steps: ['Pick a story word: lost, waiting, escape or surprise.', 'Find three everyday objects that could act it out.', 'Shoot each one from a low or unusual angle, with one clear subject per frame.', 'Put the three photos in order and give your story a title.'],
    art: ['photoquest', 101],
  },
  {
    id: 'color-hunt', title: 'The Color Hunt', mins: 5, difficulty: 'Easy', category: 'Exploration', where: 'Anywhere',
    blurb: 'Pick a color and track down five objects that match it, then line them up for one final shot.',
    materials: ['Phone (optional)'], moods: ['bored', 'curious', 'creative'], interests: ['photography', 'art'],
    steps: ['Choose a color before you look around.', 'Find five objects in that color, each from a different spot.', 'Arrange them from lightest to darkest.', 'Take one photo of the lineup.'],
    art: ['colorhunt', 102],
  },
  {
    id: 'fashion-studio', title: 'The Fashion Studio', mins: 15, difficulty: 'Easy', category: 'Creativity', where: 'Indoors',
    blurb: "Build a new outfit from clothes you already own, starting with one piece you never wear.",
    materials: ['Your wardrobe', 'A mirror'], moods: ['creative', 'bored'], interests: ['fashion', 'photography'],
    steps: ["Pull out one item you haven't worn in months.", 'Build an outfit around it using only what you have.', 'Swap one accessory to change the whole vibe.', 'Take a mirror photo and give the look a name.'],
    art: ['fashion', 103],
  },
  {
    id: 'mini-artist', title: 'The Mini Artist', mins: 10, difficulty: 'Easy', category: 'Creativity', where: 'Indoors',
    blurb: 'Sketch an ordinary object from an angle nobody ever draws it from.',
    materials: ['Paper', 'Pencil'], moods: ['creative', 'relaxed', 'bored'], interests: ['drawing', 'art'],
    steps: ['Pick an object within arm’s reach: a mug, a shoe, a key.', 'Put it on the floor or hold it above your head to change the view.', 'Draw only the outline first, without lifting your pencil for 60 seconds.', 'Add shadow on one side and sign it.'],
    art: ['miniartist', 104],
  },
  {
    id: 'conversation-spark', title: 'The Conversation Spark', mins: 10, difficulty: 'Easy', category: 'Connection', where: 'Anywhere',
    blurb: 'Ask someone close to you a question they have never been asked before.',
    materials: ['Another person'], moods: ['social', 'curious', 'bored'], interests: ['social'],
    steps: ["Pick a question: “What did you want to be at my age?” or “What smell takes you straight back?”", 'Ask a friend or family member, in person or on a call.', 'Ask one follow-up question about their answer.', 'Share your own answer too.'],
    art: ['conversation', 105],
  },
  {
    id: 'nature-detective', title: 'The Nature Detective', mins: 15, difficulty: 'Easy', category: 'Exploration', where: 'Outdoors',
    blurb: 'Find three patterns in nature: spirals, stripes, cracks, veins or repeats.',
    materials: ['Phone or notebook'], moods: ['curious', 'relaxed'], interests: ['nature', 'photography', 'learning'],
    steps: ['Head outside, or to a window with plants.', 'Look closely at bark, leaves, stones and clouds.', 'Find three different patterns and name each one.', 'Photograph or sketch your favorite.'],
    art: ['naturedetective', 106],
  },
  {
    id: 'movement-mission', title: 'The Movement Mission', mins: 5, difficulty: 'Easy', category: 'Movement', where: 'Indoors',
    blurb: 'Five quick moves, done your way and at your own pace.',
    materials: ['A bit of floor space'], moods: ['energetic', 'bored'], interests: ['fitness'],
    steps: ['Reach high and stretch side to side for 30 seconds.', 'March or step in place for 60 seconds.', 'Do 10 slow squats or sit-to-stands from a chair.', 'Hold a wall push or plank for 20 seconds.', 'Finish with five slow, deep breaths.'],
    art: ['movement', 107],
  },
  {
    id: 'six-sentence-story', title: 'The Six-Sentence Story', mins: 10, difficulty: 'Medium', category: 'Creativity', where: 'Anywhere',
    blurb: 'Write a story in exactly six sentences, inspired by something you can see right now.',
    materials: ['Paper or a notes app'], moods: ['creative', 'curious', 'relaxed'], interests: ['reading', 'learning'],
    steps: ['Look around and pick one object as your main character.', 'Sentences 1–2: where it is and what it wants.', 'Sentences 3–4: what goes wrong.', 'Sentences 5–6: how it ends. Read it out loud once.'],
    art: ['story', 108],
  },
  {
    id: 'creative-reuse', title: 'The Creative Reuse Challenge', mins: 30, difficulty: 'Medium', category: 'Creativity', where: 'Indoors',
    blurb: 'Turn a safe household item that was heading for the recycling into something useful.',
    materials: ['A clean jar, box or bottle', 'Tape or glue', 'Scissors'], moods: ['creative', 'bored'], interests: ['crafts', 'art'],
    steps: ['Find something clean that was headed for the recycling.', 'Decide what it becomes: a pen holder, a plant pot, an organizer.', 'Cut, wrap or decorate it. Ask before using sharp tools.', 'Put it to work somewhere in your room.'],
    art: ['reuse', 109],
  },
  {
    id: 'sound-explorer', title: 'The Sound Explorer', mins: 5, difficulty: 'Easy', category: 'Relaxation', where: 'Anywhere',
    blurb: 'Sit still and count every sound you can hear, near and far.',
    materials: ['Nothing at all'], moods: ['relaxed', 'curious'], interests: ['music', 'nature'],
    steps: ['Sit somewhere comfortable and close your eyes.', 'Count the sounds you hear for two minutes.', 'Sort them: near, middle distance, far away.', 'Pick the most unexpected sound and describe it in three words.'],
    art: ['sound', 110],
  },
  {
    id: 'cloud-gallery', title: 'Cloud Gallery', mins: 10, difficulty: 'Easy', category: 'Relaxation', where: 'Outdoors',
    blurb: 'Find three shapes hiding in the clouds and sketch the one that surprised you most.',
    materials: ['A window or open sky', 'Paper and pencil (optional)'], moods: ['relaxed', 'creative', 'bored'], interests: ['nature', 'drawing', 'art'],
    steps: ['Find a spot where you can see a good stretch of sky.', 'Spend two minutes just watching the clouds move.', 'Spot three shapes and name each one.', 'Sketch the best one in under three minutes.'],
    art: ['cloudgallery', 111],
  },
  {
    id: 'playlist-portrait', title: 'Playlist Portrait', mins: 15, difficulty: 'Easy', category: 'Connection', where: 'Anywhere',
    blurb: 'Build a five-song playlist that describes someone you know, then send it to them.',
    materials: ['Your music app'], moods: ['social', 'creative'], interests: ['music', 'social'],
    steps: ['Pick a person: a friend, a cousin, a teacher you like.', 'Choose five songs that match their personality, not just their taste.', 'Give the playlist a title only they would understand.', 'Send it with one line explaining song number three.'],
    art: ['playlist', 112],
  },
  {
    id: 'kitchen-remix', title: 'Kitchen Remix', mins: 15, difficulty: 'Easy', category: 'Creativity', where: 'Indoors',
    blurb: "Make a snack from three ingredients and plate it like it's on a restaurant menu.",
    materials: ['Three ingredients you already have', 'A plate'], moods: ['creative', 'bored', 'social'], interests: ['cooking', 'photography'],
    steps: ['Ask before raiding the kitchen and stick to no-cook or toaster-level ideas.', "Pick three ingredients you wouldn't usually combine.", 'Plate it with height, one color pop and a clean rim.', 'Give the dish a dramatic menu name, then eat it.'],
    art: ['kitchenremix', 113],
  },
  {
    id: 'ten-page-escape', title: 'Ten-Page Escape', mins: 15, difficulty: 'Easy', category: 'Relaxation', where: 'Anywhere',
    blurb: 'Read ten pages of something with zero interruptions. Just you and the story.',
    materials: ['A book, comic or e-reader'], moods: ['relaxed', 'curious', 'bored'], interests: ['reading'],
    steps: ['Put your phone face down somewhere else.', 'Get comfortable: blanket, floor, outside, anywhere.', 'Read ten pages, or one full chapter.', 'Write down one line you want to remember.'],
    art: ['tenpage', 114],
  },
  {
    id: 'stair-climb', title: 'The Stair Climb', mins: 10, difficulty: 'Medium', category: 'Movement', where: 'Indoors',
    blurb: 'A few rounds up and down the stairs at your own steady pace.',
    materials: ['A staircase or a sturdy step'], moods: ['energetic'], interests: ['fitness'],
    steps: ['Hold the handrail and warm up with one slow round.', 'Do three rounds at a steady pace, resting 30 seconds in between.', 'Want it gentler? Do step-ups on the bottom stair instead.', 'Cool down with a slow walk and a calf stretch.'],
    art: ['stairs', 115],
  },
  {
    id: 'dance-break', title: 'One-Song Dance Break', mins: 5, difficulty: 'Easy', category: 'Movement', where: 'Indoors',
    blurb: 'Pick one song and dance through the whole thing. No skipping to the chorus.',
    materials: ['One song you love', 'A little space'], moods: ['energetic', 'bored', 'social'], interests: ['music', 'fitness'],
    steps: ["Choose a song with a beat you can't ignore.", 'Clear a small space and turn it up (politely).', 'Dance through the entire song, even the slow bit.', 'Invite whoever is nearby for the last chorus.'],
    art: ['dance', 116],
  },
  {
    id: 'family-recipe', title: 'Family Recipe Hunt', mins: 15, difficulty: 'Easy', category: 'Connection', where: 'Indoors',
    blurb: 'Ask a family member about a dish they grew up with and write the recipe down in their words.',
    materials: ['A notebook or notes app', 'Someone to ask'], moods: ['social', 'curious'], interests: ['cooking', 'social', 'learning'],
    steps: ['Ask: “What did you eat as a kid that you still miss?”', 'Get the ingredients and steps, including the “a bit of this” parts.', 'Write down one story connected to the dish.', 'Pick a day to cook it together.'],
    art: ['recipe', 117],
  },
  {
    id: 'macro-world', title: 'Macro World', mins: 15, difficulty: 'Easy', category: 'Exploration', where: 'Anywhere',
    blurb: 'Photograph five things so close up that nobody can guess what they are.',
    materials: ['Phone camera'], moods: ['curious', 'creative', 'social'], interests: ['photography', 'nature'],
    steps: ['Find textures: a sponge, a leaf, a zipper, a towel, toast.', 'Get as close as your camera can still focus.', 'Shoot five mystery photos in good light.', 'Quiz someone and count how many they guess.'],
    art: ['macro', 118],
  },
  {
    id: 'blind-contour', title: 'Blind Contour Portrait', mins: 5, difficulty: 'Easy', category: 'Creativity', where: 'Anywhere',
    blurb: "Draw a face without looking at the paper. It will be weird, and that's the fun part.",
    materials: ['Paper', 'A pen'], moods: ['creative', 'social', 'bored'], interests: ['drawing', 'art', 'social'],
    steps: ['Sit across from someone, or use a mirror.', 'Put your pen on the paper and look only at their face.', 'Draw slowly for two minutes without lifting the pen or peeking.', 'Reveal it together and give it a title.'],
    art: ['blindcontour', 119],
  },
  {
    id: 'paper-plane-lab', title: 'Paper Plane Lab', mins: 15, difficulty: 'Easy', category: 'Learning', where: 'Anywhere',
    blurb: 'Fold three plane designs and run a fair test to crown a champion.',
    materials: ['Three sheets of paper', 'Tape measure (optional)'], moods: ['curious', 'energetic', 'bored'], interests: ['crafts', 'learning'],
    steps: ['Fold three designs: a dart, a glider and one you invent.', 'Mark a launch line and throw each plane three times.', 'Measure or pace out every distance.', "Tweak the winner's wings and try to beat its record."],
    art: ['planes', 120],
  },
  {
    id: 'windowsill-regrow', title: 'Windowsill Regrow', mins: 10, difficulty: 'Easy', category: 'Learning', where: 'Indoors',
    blurb: 'Regrow green onions from kitchen scraps and watch them shoot up in days.',
    materials: ['Green onion ends or seeds', 'A cup or jar', 'Water'], moods: ['curious', 'relaxed'], interests: ['nature', 'cooking', 'learning'],
    steps: ['Save the white root ends of green onions, about 3 cm long.', 'Stand them roots-down in a cup with a little water.', 'Put the cup in a sunny window.', 'Change the water every two days and track the growth.'],
    art: ['regrow', 121],
  },
  {
    id: 'neighborhood-map', title: 'Neighborhood Map', mins: 30, difficulty: 'Medium', category: 'Exploration', where: 'Outdoors',
    blurb: 'Take a short walk, then draw a map of everything you noticed.',
    materials: ['Paper', 'A pen', 'Comfortable shoes'], moods: ['curious', 'energetic'], interests: ['nature', 'drawing', 'art'],
    steps: ['Tell someone where you are going and stick to familiar streets.', 'Walk a loop of about 15 minutes, noticing details.', 'Back home, draw the route from memory.', 'Add five landmarks only you would notice.'],
    art: ['map', 122],
  },
  {
    id: 'ten-words', title: 'Ten Words, New Language', mins: 15, difficulty: 'Medium', category: 'Learning', where: 'Anywhere',
    blurb: "Learn ten useful words in a language you don't speak, then use three of them today.",
    materials: ['A dictionary or translation app'], moods: ['curious'], interests: ['learning'],
    steps: ["Pick a language you've always been curious about.", 'Choose ten everyday words: hello, thanks, water, friend…', 'Say each one out loud three times.', 'Use three of them today and teach one to someone.'],
    art: ['tenwords', 123],
  },
  {
    id: 'handwritten-note', title: 'Handwritten Note', mins: 10, difficulty: 'Easy', category: 'Connection', where: 'Anywhere',
    blurb: 'Write a short handwritten note to someone and deliver it yourself.',
    materials: ['Paper', 'A pen'], moods: ['social', 'relaxed'], interests: ['social', 'art'],
    steps: ['Pick someone who did something kind recently.', 'Write three sentences: what they did, why it mattered, and a wish for them.', 'Decorate the edges if you like.', "Hand it over, or leave it where they'll find it."],
    art: ['note', 124],
  },
  {
    id: 'box-breathing', title: 'Box Breathing Reset', mins: 5, difficulty: 'Easy', category: 'Relaxation', where: 'Anywhere',
    blurb: 'A simple four-count breathing pattern that slows everything down.',
    materials: ['A quiet spot'], moods: ['relaxed'], interests: ['fitness', 'learning'],
    steps: ['Sit tall and let your shoulders drop.', 'Breathe in for 4 counts, then hold for 4.', 'Breathe out for 4 counts, then hold for 4.', 'Repeat for six rounds, then stretch.'],
    art: ['breathing', 125],
  },
  {
    id: 'slow-stretch', title: 'Slow Stretch Flow', mins: 10, difficulty: 'Easy', category: 'Movement', where: 'Indoors',
    blurb: 'A short run of gentle stretches for your back, neck and legs.',
    materials: ['Floor space', 'A mat or towel (optional)'], moods: ['relaxed', 'energetic'], interests: ['fitness'],
    steps: ['Roll your neck slowly, five times each way.', 'Reach up tall, then fold forward and hang loose.', 'Hold a gentle side stretch on each side for 20 seconds.', 'Finish with a seated twist and a long exhale.'],
    art: ['stretch', 126],
  },
  {
    id: 'mini-zine', title: 'Make a Mini Zine', mins: 30, difficulty: 'Medium', category: 'Creativity', where: 'Indoors',
    blurb: 'Fold one sheet into an eight-page booklet and fill it about one thing you love.',
    materials: ['One sheet of paper', 'Scissors', 'Pens or markers'], moods: ['creative', 'bored'], interests: ['crafts', 'art', 'reading', 'drawing'],
    steps: ['Fold the sheet into eight panels, cut the middle slit and fold it into a booklet.', 'Choose a topic: your favorite snack, your street, your cat.', 'Fill each page with drawings, lists or short facts.', 'Design a bold cover and give it to someone.'],
    art: ['zine', 127],
  },
  {
    id: 'room-glow-up', title: 'Ten-Minute Room Glow-Up', mins: 10, difficulty: 'Easy', category: 'Creativity', where: 'Indoors',
    blurb: 'Reset one corner of your room and style it like a photo shoot.',
    materials: ['Your room'], moods: ['bored', 'energetic'], interests: ['crafts', 'fashion', 'art'],
    steps: ['Pick one small area: a desk, a shelf or a bedside table.', 'Clear everything off and put back only what you love.', 'Group objects in threes and add one surprise item.', 'Take a before-and-after photo.'],
    art: ['glowup', 128],
  },
  {
    id: 'tiny-concert', title: 'Tiny Concert', mins: 15, difficulty: 'Medium', category: 'Creativity', where: 'Indoors',
    blurb: 'Learn the opening of a song by ear and perform it for one person.',
    materials: ['Any instrument, or your voice'], moods: ['creative', 'social'], interests: ['music', 'social'],
    steps: ['Pick a song you know by heart.', 'Work out the first line on an instrument, by humming or by beatboxing.', 'Practice it five times in a row.', 'Perform it for one person. Bowing is mandatory.'],
    art: ['concert', 129],
  },
  {
    id: 'kitchen-percussion', title: 'Kitchen Percussion', mins: 5, difficulty: 'Easy', category: 'Creativity', where: 'Indoors',
    blurb: 'Build a drum kit from kitchen things and play a 30-second beat.',
    materials: ['Pots or containers', 'Wooden spoons'], moods: ['energetic', 'creative', 'bored'], interests: ['music'],
    steps: ['Ask first, then borrow two pots, a container and two wooden spoons.', 'Find the low, middle and high sounds.', 'Make up a simple beat and repeat it four times.', 'Record 30 seconds and give your band a name.'],
    art: ['percussion', 130],
  },
  {
    id: 'sky-watch', title: 'Sky Watch', mins: 10, difficulty: 'Easy', category: 'Relaxation', where: 'Outdoors',
    blurb: 'Watch the sky for ten minutes and catch how much it changes.',
    materials: ['A window or open sky', 'Phone (optional)'], moods: ['relaxed'], interests: ['nature', 'photography'],
    steps: ['Find a view with as much sky as possible.', 'Take one photo every two minutes from the same spot.', 'In between, just watch: colors, birds, planes, clouds.', 'Line up your five photos and compare them.'],
    art: ['skywatch', 131],
  },
  {
    id: 'game-revival', title: 'Game Night Revival', mins: 30, difficulty: 'Easy', category: 'Connection', where: 'Indoors',
    blurb: 'Dig out a game nobody has played in ages and play one full round.',
    materials: ['A board game or a deck of cards', 'One or more people'], moods: ['social', 'bored'], interests: ['social', 'learning'],
    steps: ['Find a game in a cupboard, or grab a deck of cards.', "Invite whoever's around.", 'Learn or re-learn the rules together.', 'Play one full round. The winner picks the next game.'],
    art: ['games', 132],
  },
  {
    id: 'color-wheel-outfit', title: 'Color Wheel Outfit', mins: 15, difficulty: 'Medium', category: 'Learning', where: 'Indoors',
    blurb: 'Use color theory to build an outfit from complementary or neighboring colors.',
    materials: ['Your wardrobe'], moods: ['creative', 'curious'], interests: ['fashion', 'art', 'learning'],
    steps: ['Picture a color wheel: complementary colors sit opposite each other.', 'Pick a base piece and find its opposite, or its neighbors.', 'Build the outfit with one main color and one accent.', 'Photograph it and label the color rule you used.'],
    art: ['colorwheel', 133],
  },
  {
    id: 'style-swap', title: 'Style Swap', mins: 10, difficulty: 'Easy', category: 'Connection', where: 'Anywhere',
    blurb: 'Trade one clothing item with a friend or sibling for a week.',
    materials: ['One item to trade', 'A friend or sibling'], moods: ['social', 'creative'], interests: ['fashion', 'social'],
    steps: ['Agree on one item each to swap.', 'Style the borrowed piece your own way.', 'Take a photo wearing it.', 'Swap back in a week, or keep negotiating.'],
    art: ['swap', 134],
  },
  {
    id: 'leaf-rubbings', title: 'Leaf Rubbings', mins: 15, difficulty: 'Easy', category: 'Creativity', where: 'Outdoors',
    blurb: 'Collect leaves with strong veins and turn them into rubbing prints.',
    materials: ['A few fallen leaves', 'Paper', 'Crayons or soft pencils'], moods: ['creative', 'relaxed'], interests: ['nature', 'art', 'crafts'],
    steps: ['Collect five fallen leaves with different shapes.', 'Place one vein-side up under a sheet of paper.', 'Rub the side of a crayon gently over it until the pattern appears.', 'Layer colors and arrange the leaves into a print.'],
    art: ['rubbings', 135],
  },
  {
    id: 'shadow-studio', title: 'Shadow Studio', mins: 10, difficulty: 'Easy', category: 'Creativity', where: 'Indoors',
    blurb: 'Use one light and everyday objects to make dramatic shadow photos.',
    materials: ['A lamp or flashlight', 'Small objects', 'Phone camera'], moods: ['creative', 'curious', 'bored'], interests: ['photography', 'art'],
    steps: ['Dim the room and set a lamp low and to the side.', 'Place objects between the light and a wall.', 'Move the light to stretch and shrink the shadows.', 'Photograph the shadow that looks least like its object.'],
    art: ['shadows', 136],
  },
  {
    id: 'question-jar', title: 'Question Jar', mins: 15, difficulty: 'Easy', category: 'Connection', where: 'Indoors',
    blurb: 'Write ten good questions, fold them into a jar and bring it to dinner.',
    materials: ['Paper strips', 'A jar or cup'], moods: ['social', 'creative'], interests: ['social', 'crafts'],
    steps: ['Write ten questions, like “What skill would you learn instantly?”', 'Fold the strips and drop them in a jar.', 'Decorate the jar with a label.', 'At the next meal, everyone draws one and answers.'],
    art: ['questionjar', 137],
  },
  {
    id: 'offline-rabbit-hole', title: 'Offline Rabbit Hole', mins: 15, difficulty: 'Medium', category: 'Learning', where: 'Anywhere',
    blurb: 'Pick a topic and dig up five surprising facts without a screen.',
    materials: ['A book, encyclopedia or someone who knows'], moods: ['curious'], interests: ['learning', 'reading'],
    steps: ['Choose a topic: octopuses, volcanoes, an old family photo.', 'Look it up in a book, or interview someone who knows.', 'Write down five facts that surprised you.', 'Teach your favorite fact to someone today.'],
    art: ['rabbithole', 138],
  },
  {
    id: 'balance-lab', title: 'Balance Lab', mins: 5, difficulty: 'Easy', category: 'Movement', where: 'Indoors',
    blurb: 'Run a few quick balance tests and find out which side of you is steadier.',
    materials: ['Floor space', 'A wall nearby'], moods: ['energetic', 'curious', 'bored'], interests: ['fitness', 'learning'],
    steps: ['Stand next to a wall for support.', 'Balance on one foot for 30 seconds, then switch.', 'Try again with your eyes closed, hand near the wall.', 'Note which side was steadier and try to beat your time.'],
    art: ['balance', 139],
  },
  {
    id: 'jump-rounds', title: 'Jump Rounds', mins: 10, difficulty: 'Medium', category: 'Movement', where: 'Outdoors',
    blurb: 'Three short rounds of skipping or jumping jacks, with breaks in between.',
    materials: ['Jump rope (optional)', 'Some space outside'], moods: ['energetic'], interests: ['fitness'],
    steps: ['Warm up by marching on the spot for one minute.', 'Round 1: skip or do jumping jacks for 45 seconds.', 'Rest for 45 seconds, then repeat two more rounds.', 'Count your jumps in the last round and write the number down.'],
    art: ['jump', 140],
  },
  {
    id: 'energy-bites', title: 'No-Bake Energy Bites', mins: 30, difficulty: 'Medium', category: 'Creativity', where: 'Indoors',
    blurb: 'Mix, roll and chill a batch of snack bites with no oven needed.',
    materials: ['Oats', 'Honey or chopped dates', 'Nut or seed butter', 'A bowl'], moods: ['creative', 'social', 'energetic'], interests: ['cooking'],
    steps: ['Check for allergies and ask before using the kitchen.', 'Mix 1 cup oats, ½ cup nut or seed butter and ⅓ cup honey or dates.', 'Roll into small balls and add extras: cocoa, coconut or raisins.', 'Chill for 20 minutes, then share them.'],
    art: ['energybites', 141],
  },
  {
    id: 'star-spotter', title: 'Star Spotter', mins: 15, difficulty: 'Easy', category: 'Exploration', where: 'Outdoors',
    blurb: 'Find three bright stars or planets and learn what you were looking at.',
    materials: ['A clear night sky', 'A warm layer'], moods: ['curious', 'relaxed'], interests: ['nature', 'learning'],
    steps: ['Go somewhere safe and as dark as possible, with permission.', 'Let your eyes adjust for five minutes.', 'Find the three brightest points and sketch where they are.', 'Later, match them to a star chart and name them.'],
    art: ['stars', 142],
  },
  {
    id: 'time-capsule', title: 'Photo Time Capsule', mins: 10, difficulty: 'Easy', category: 'Creativity', where: 'Anywhere',
    blurb: 'Take five photos of your ordinary day for future you to find.',
    materials: ['Phone camera'], moods: ['relaxed', 'curious', 'creative'], interests: ['photography'],
    steps: ['Photograph your shoes, your desk and the view from your window.', 'Add one photo of someone you live with (ask first).', "Add one photo of something you'll probably forget.", 'Put them in an album called “Open in 5 years”.'],
    art: ['timecapsule', 143],
  },
  {
    id: 'compliment-mission', title: 'Compliment Mission', mins: 5, difficulty: 'Easy', category: 'Connection', where: 'Anywhere',
    blurb: 'Give three specific, genuine compliments to three different people today.',
    materials: ['Nothing at all'], moods: ['social'], interests: ['social'],
    steps: ['Skip “nice shirt”. Aim for something specific.', 'Compliment a skill, an idea or something kind they did.', 'Give the first one within the next hour.', 'Get all three done by tonight.'],
    art: ['compliments', 144],
  },
  {
    id: 'plant-check-in', title: 'Plant Check-In', mins: 5, difficulty: 'Easy', category: 'Relaxation', where: 'Indoors',
    blurb: 'Give a houseplant five minutes of proper attention.',
    materials: ['A houseplant', 'Water', 'A damp cloth'], moods: ['relaxed'], interests: ['nature'],
    steps: ['Feel the soil and water only if the top 2 cm are dry.', 'Wipe the dust off the leaves with a damp cloth.', 'Turn the pot a quarter so it grows evenly.', "If it doesn't have a name yet, give it one."],
    art: ['plantcare', 145],
  },
  {
    id: 'window-poem', title: 'Window Poem', mins: 5, difficulty: 'Easy', category: 'Creativity', where: 'Anywhere',
    blurb: "Write a short poem about exactly what's outside your window right now.",
    materials: ['Paper or a notes app'], moods: ['creative', 'relaxed', 'curious'], interests: ['reading', 'art'],
    steps: ['Look outside for one minute without writing anything.', 'Write five lines, each starting with something you can see.', "Cut every word you don't need.", 'Read it out loud once.'],
    art: ['windowpoem', 146],
  },
  {
    id: 'brain-dump', title: 'Brain Dump & Top Three', mins: 10, difficulty: 'Easy', category: 'Productive', where: 'Anywhere',
    blurb: 'Empty every to-do and worry onto paper, then circle the three that matter today.',
    materials: ['Paper', 'A pen'], moods: ['relaxed', 'bored', 'curious'], interests: ['learning', 'reading'], energy: 'low',
    steps: ['Write down everything on your mind for four minutes: homework, plans, things you keep forgetting.', 'Cross out anything that isn’t yours to do today.', 'Circle the three things that matter most.', 'Do five minutes of the first one, or put what you need for it in your bag.'],
    art: ['braindump', 141],
  },
  {
    id: 'desk-reset', title: 'Desk Reset Sprint', mins: 10, difficulty: 'Easy', category: 'Productive', where: 'Indoors',
    blurb: 'Clear and set up your desk so tomorrow-you can start straight away.',
    materials: ['A cloth', 'A bag for rubbish'], moods: ['energetic', 'bored'], interests: ['learning', 'art'], energy: 'medium',
    steps: ['Take everything off the desk and put it on the bed or floor.', 'Wipe the surface and throw away anything you don’t need.', 'Put back only what you use: a pen pot, your planner, a lamp.', 'Leave tomorrow’s first task out, ready to go.'],
    art: ['deskreset', 142],
  },
  {
    id: 'focus-sprint', title: 'Paper-Only Focus Sprint', mins: 30, difficulty: 'Medium', category: 'Productive', where: 'Indoors',
    blurb: 'Do 25 minutes of homework, reading or practice with your phone in another room, then take a real break.',
    materials: ['Homework, a book or an instrument', 'A clock or kitchen timer'], moods: ['curious', 'energetic', 'bored'], interests: ['learning', 'reading', 'music'], energy: 'medium',
    steps: ['Pick one task you can make progress on in 25 minutes.', 'Put your phone in another room and set a clock or kitchen timer.', 'Work until the timer ends. If a thought pops up, jot it on paper and carry on.', 'Take a five-minute break away from screens: stretch, drink water, look outside.'],
    art: ['focussprint', 143],
  },
  {
    id: 'fix-it', title: 'Fix-It Fifteen', mins: 15, difficulty: 'Easy', category: 'Productive', where: 'Indoors',
    blurb: 'Fix one small thing that has been bugging you: a loose button, a torn page, a tangled drawer.',
    materials: ['Needle and thread, tape or glue', 'An adult to ask first'], moods: ['bored', 'curious', 'relaxed'], interests: ['crafts', 'fashion'], energy: 'medium',
    steps: ['Choose one small thing that’s broken or annoying.', 'Gather what you need, and ask an adult before using a needle, glue or tools.', 'Fix it slowly and carefully. If you get stuck, ask someone to show you.', 'Put it back where it belongs and enjoy using it again.'],
    art: ['mendit', 144],
  },
  {
    id: 'week-planner', title: 'Plan Your Week on Paper', mins: 15, difficulty: 'Easy', category: 'Productive', where: 'Anywhere',
    blurb: 'Sketch your week on one page: school, plans, rest and one thing to look forward to each day.',
    materials: ['Paper or a notebook', 'Coloured pens (optional)'], moods: ['relaxed', 'creative', 'curious'], interests: ['learning', 'drawing', 'art'], energy: 'low',
    steps: ['Draw seven boxes, one for each day.', 'Add the fixed things first: school, practice, family plans.', 'Add one small task per day so homework and chores don’t pile up.', 'Give every day one thing to look forward to.'],
    art: ['weekplan', 145],
  },
];

// Energy level for each of the original activities (new ones set `energy` themselves).
const ENERGY_OF = {
  low: ['sound-explorer', 'cloud-gallery', 'ten-page-escape', 'box-breathing', 'sky-watch', 'plant-check-in', 'window-poem', 'handwritten-note', 'six-sentence-story', 'mini-artist', 'star-spotter', 'time-capsule', 'offline-rabbit-hole', 'slow-stretch', 'playlist-portrait', 'windowsill-regrow'],
  high: ['movement-mission', 'stair-climb', 'dance-break', 'jump-rounds', 'kitchen-percussion', 'neighborhood-map', 'paper-plane-lab', 'balance-lab'],
};
ACTIVITIES.forEach((a) => {
  if (!a.energy) a.energy = ENERGY_OF.low.includes(a.id) ? 'low' : ENERGY_OF.high.includes(a.id) ? 'high' : 'medium';
});

export const ACT_BY_ID = Object.fromEntries(ACTIVITIES.map((a) => [a.id, a]));
