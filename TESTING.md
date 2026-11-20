# ScrollWise testing report

Final release candidate, 20 November 2026.

**Read this first:** every automated check below ran in **Google Chrome (Chromium engine) on Linux**, with phones and tablets **emulated** by screen size and touch. Nothing has been tested yet on a real iPhone, Android phone, iPad, Safari or Firefox, or on the live GitHub Pages site. Those checks are listed in section 4 and need the team.

## 1. Summary

| Test suite | What it covers | Checks | Result |
| --- | --- | ---: | --- |
| End-to-end, real feed (22 posts) | Feed, interactions, carousels, stopping point, continue, Find Your Next Moment, activities, dashboard, saved data, demo, reset | 87 | All passed |
| End-to-end, simulated full feed (80 posts) | The same test with test pictures for every post (not part of the project) | 87 | All passed |
| Unseen-first sessions, real feed | 22 posts over three sessions, no repeats, then “all caught up” | 6 | All passed |
| Unseen-first sessions, full feed | 80 posts over 10 sessions, no repeats, then oldest-first | 16 | All passed |
| Timer and layout audit | Timer counting and pausing, limits, reminders; 9 screens at 7 sizes incl. 320 px, landscape, tablet, desktop, dark | 23 | All passed |
| Release QA | Subfolder hosting, timing on refresh/background/freeze, limits, stopping point, decisions, fresh visits, bypasses, Explore topics, dashboard maths, goals, reset, energy matching, research separation, accessibility, file names, fonts | 70 | All passed |
| Research mode | Counterbalancing, records, answers, duplicates, resuming, CSV download/copy/show, deleting, real-time timer accuracy, 3-minute maximum | 38 | All passed |
| Final build (`build:final`) | Builds without drafts; 7-post feed works | 4 | All passed |
| **Total** | | **331** | **0 failures** |

The tests were run again after every fix; the numbers above are from the final run.

## 2. Verified by automated tests (Chrome only)

### Publishing and GitHub Pages
- The built `docs/` folder was served from a **subfolder** (`/scrollwise/`), as GitHub Pages does. All 42 site files load; no request leaves the subfolder except Google Fonts.
- Every file referenced by the page, styles, picture list and manifest exists with **exactly** that name (GitHub Pages is case-sensitive).
- Direct addresses and refresh work (`#feed`, `#moments`, `#you`, `#about`, `#privacy`, `#research`, `#challenge-…`).
- Title, description, favicon, app icons, manifest and social-sharing tags are present.
- No secret keys, passwords, tokens, debugging code or development branding in the source or the built site.

### Feed
- Likes, double-tap, comments, bookmarks, follows, profiles, carousels (order and swiping), Saved, browser Back.
- Every image loads and has alt text.
- Unseen posts first; no repeats until everything has been seen.
- Explore topics only filter the current session; the session size and stopping point don’t change, and an empty topic says so.
- The sample-feed notice is shown; your own comments are marked “only visible to you”.

### Healthy scrolling
- 5 posts per session → stops after exactly 5. The time limit ends a session by itself.
- 10 s of browsing counted as 10.0–10.9 s. 6 s in a background tab added nothing. A 7 s frozen page added at most 3 s. Time on other pages isn’t counted.
- A refresh keeps the session and its time; the timer keeps running afterwards.
- After the stopping point nothing loads, by scrolling, by switching pages, by refreshing or through Following. Profiles can’t open posts not yet seen.
- Each session is recorded once (one history entry, one count).
- “Continue intentionally” requires choosing a new limited session and starts with an unseen post; “I’m done for now” opens the dashboard.
- Coming back 4 hours later or the next day starts a fresh session (not counted as continuing); 10 minutes later still shows the stopping point.

### Find Your Next Moment
- All 51 activities open, each with its own illustration.
- Low energy + relaxed → calm activities; lots of energy + energetic → active ones; different inputs give different top picks.

### Dashboard and data
- New visitors see zeros and empty states, never invented numbers, and no “NaN” or “undefined”.
- Sessions, stops, continues and average session length match what was done; the week comparison appears only when there is earlier data.
- Goals can be changed and are saved. Reset asks first, then clears everything.
- Research results never change the normal dashboard.

### Research mode
- First participant A→B, second B→A (alternating); manual and random orders also available.
- Mode A keeps loading posts and shows no timer; Mode B needs a chosen time, stops after the post limit, and “Continue intentionally” adds exactly that many posts.
- Records hold order, position, intended time, duration, posts, how it ended, stopping point reached, continues and answers; the final question is stored once.
- Double-tapping saves one record; a completed code can’t run again (upper or lower case); a participant who left after one feed can finish only the missing one, in the same order.
- Timer accuracy in real time: 10.0 s recorded for 10 s; a 3-minute maximum ended the feed at 180 s.
- CSV: correct file name, header plus one row per feed, 27 columns, commas and quotes escaped, formula-like comments neutralised. Copy CSV and Show CSV text work.

### Accessibility and layout
- Every control has an accessible name; every image has alt text.
- No tap target is smaller than 24 × 24 px except links inside running text; most buttons are 34–44 px tall.
- Keyboard: Tab moves through controls with a visible focus ring; Enter activates them.
- Reduced motion on the device switches animations off.
- No sideways scrolling at 320 px wide or on a 1440 px desktop, on any page.
- The local heading font loads when Google Fonts can’t be reached.

## 3. Also checked by inspection
- Screenshots of the main screens reviewed in light and dark mode, on phone, tablet and desktop sizes. Fixed: the research stopping screen was too wide on small phones, and the order menu was cut off.
- Text colour contrast calculated against WCAG AA (4.5 : 1) for light and dark mode.
- The research guide PDF pages were rendered and reviewed.
- `PHOTO-MANIFEST.md` was generated from the files actually installed.
- Spot check: in a 12-post session on both the real and the full feed, no creator appeared twice in a row.
- Size: `app.js` is 549 KB (about 169 KB compressed, as GitHub Pages sends it) and `app.css` 83 KB (16 KB compressed). The whole site is 3.4 MB, mostly photos of up to 170 KB each.

## 4. Needs manual testing (not yet done)
1. **The live GitHub Pages site**, once published.
2. **Real iPhone (Safari)**: safe areas around the notch and bottom bar, swiping carousels, double-tap, adding a photo to a finished activity, Share CSV, Home Screen version.
3. **Real Android phone** (Chrome, Samsung Internet).
4. **iPad and Android tablets**, portrait and landscape.
5. **Windows laptop**: Chrome, Edge and **Firefox**. Safari on a Mac if available.
6. **Locking the phone or switching apps** during a session: simulated here, not tried on a device.
7. **Google Fonts online** (the test machine had no internet, so fallback fonts were used).
8. **Text size**: larger text settings and browser zoom on real devices.
9. **Screen readers**: VoiceOver (iPhone) and TalkBack (Android).
10. **CSV files** opening in the Excel or Google Sheets the team will use.
11. **Link previews** in chat apps, after setting `homepage`.
12. **Speed** on an older phone and on mobile data.

### Quick manual checklist (about 5 minutes per device)
- [ ] Welcome page loads with photos and the ScrollWise fonts
- [ ] Start Exploring → the sample-feed notice shows; Explore topics work
- [ ] Like, comment, save and follow a post; open a profile; swipe a carousel
- [ ] Set 5 posts per session → the feed stops after 5 posts; the countdown shows time left
- [ ] Lock the phone for 30 seconds during a session → that time isn’t counted
- [ ] Refresh during a session → same session and time
- [ ] At the stopping point try all three choices
- [ ] Find Your Next Moment → mood, energy, time → start an activity
- [ ] Dashboard shows the session; Saved shows the saved post
- [ ] About and Privacy open; Settings → Reset data asks first, then clears
- [ ] Research mode: one practice participant (both feeds), export the CSV and open it, then delete the practice record
- [ ] Dark mode and reduced motion on the device

## 5. Known limitations (not bugs)
- Small sample feed (see section 6), so Research Mode A repeats posts sooner and sessions are short.
- Data stays in one browser on one device; Safari may delete it after about a week without a visit.
- Research results are descriptive only.
- The feed is a simulation: fictional creators, no real social interaction.

## 6. Missing assets
From `PHOTO-MANIFEST.md` at this release:

| | Main post pictures | Carousel photos |
| --- | ---: | ---: |
| Licensed photos | 6 | 0 |
| Final AI images | 1 | 0 |
| Temporary drafts (enlarged from small previews, to replace) | 15 | 5 |
| **Missing** | **58** | **15** |
| Total | 80 | 20 |

Exact prompts for all 93 missing or temporary pictures are in `photos/PROMPTS-NEEDED.md`. Profile pictures (optional) are in `photos/ai/prompts.csv`.

## 7. Actual publication blockers
1. **Photographs.** Only 22 of 80 posts can appear, and most of them are temporary drafts. By the project’s own rule (“do not publish an incomplete or misleading final feed”), the final feed isn’t ready until the pictures are complete, unless Talia decides to publish it as a clearly labelled prototype (see `RELEASE-CHECKLIST.md`).
2. **Approval.** Talia’s approval is needed before anything is published to GitHub.
3. **Real-device checks** in section 4, at least on one iPhone, one Android phone and one Windows laptop.

There are no known technical blockers: the build, tests and GitHub Pages structure are ready.
