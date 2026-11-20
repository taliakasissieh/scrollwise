Put AI-generated pictures for the feed in this folder.

Name each file after its slot, for example:
  post-mirror-fit.jpg      (a post)
  post-mirror-fit-2.jpg    (2nd carousel photo of that post)
  avatar-jun.wears.jpg     (a profile picture)
  activity-dance-break.jpg (an activity cover)

.jpg, .png and .webp all work, at any size: the build resizes and compresses them.
Names are forgiving (capitals, spaces, underscores, no "post-" prefix), and
sub-folders or a whole .zip file dropped in here are read too.

Then run: npm run build
Posts appear in the feed as soon as they have a picture, labelled "AI info".

prompts.csv lists every slot with its file name, shape and a ready-made prompt.
batches.md splits them into 23 batches to paste into an image generator.
missing.csv (written by every build) lists only the pictures still missing.
PHOTOS.md (in the main folder) explains everything step by step.
