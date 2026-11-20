# Final release checklist

**Status:** a public beta was published with Talia’s approval on 20 November 2026 at https://taliakasissieh.github.io/scrollwise/ (repository `taliakasissieh/scrollwise`, `main` branch, `/docs` folder). Keep publishing future updates to the same repository so the poster’s QR code keeps working. The checklist below still applies to the final release.

Tick everything before ScrollWise is published or presented. Items marked **Blocker** must be resolved (or consciously accepted by Talia) first.

## 1. Decisions that need Talia
- [ ] **Blocker: approval to publish.** Nothing is published to GitHub without Talia’s approval.
- [ ] **Blocker: photographs.** Check `PHOTO-MANIFEST.md`. At this release, 22 of 80 posts have a main picture, and 15 of those (plus 5 carousel photos) are temporary drafts enlarged from small previews. Posts without a picture stay hidden, so the feed is short and mostly “Friends & everyday”. Choose one:
  - [ ] Complete the pictures first (recommended for the final release): prompts are in `photos/PROMPTS-NEEDED.md`.
  - [ ] Publish now as a clearly labelled prototype with the current 22-post sample feed, and say in the presentation that the photo set is still being completed.
  - (`npm run build:final` removes the drafts, but leaves only 7 posts, which is too few for a good demo.)
- [ ] **AI image sources recorded.** For every AI-generated picture, note which tool made it and check that its terms allow publishing.

## 2. Real-device testing (cannot be done automatically)
Use the 5-minute checklist in `TESTING.md` on each:
- [ ] iPhone (Safari), including the Home Screen version
- [ ] Android phone (Chrome)
- [ ] iPad or Android tablet
- [ ] Windows laptop (Chrome or Edge, and Firefox)
- [ ] Locking the phone during a session doesn’t count as browsing time
- [ ] Research CSV downloads (or shares) and opens in Excel or Google Sheets
- [ ] VoiceOver or TalkBack can read the main screens (optional but recommended)

## 3. Content
- [ ] About page, Privacy notice and welcome page read correctly; no endorsement by the British Council is implied.
- [ ] Creator names, captions and comments are fictional and suitable for teenagers.
- [ ] No placeholder text, broken pictures or spelling mistakes.
- [ ] Photo credits in Settings match `CREDITS.md`.

## 4. Technical
- [ ] `npm run build` finishes without errors (warnings about missing pictures are expected until the photos are complete).
- [ ] `"homepage"` in `package.json` is set to the real GitHub Pages address, then rebuilt (for link previews).
- [ ] The whole `docs` folder is uploaded, including `assets/fonts/` and `photos/`.
- [ ] Settings → Pages: **main** branch, **/docs** folder.
- [ ] No research CSV files, personal data, passwords or keys are in the repository.

## 5. After publishing
- [ ] The live address opens on a phone and a computer.
- [ ] Direct links work after a refresh: add `#about`, `#moments` or `#you` to the address.
- [ ] Link preview checked by sending the address in a chat app (after setting `homepage`).
- [ ] Test data cleared on the presentation device (Settings → Reset data; Research mode → Delete all results).

## 6. Research (before testing anyone)
- [ ] School approval and any required parental consent.
- [ ] Research guide read by everyone running sessions.
- [ ] Order list and recording sheets printed (`research/ScrollWise-Results-Template.pdf`).
