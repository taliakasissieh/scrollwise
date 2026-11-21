# ScrollWise testing report

Final release candidate, 20 November 2026. Updated 21 November 2026 for anonymous visit counts and the team analytics dashboard.

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
| Visit counts (analytics) | What ScrollWise asks the counter to send, campaign links, no cookies, Demo and research excluded, the Settings switch, Do Not Track, Global Privacy Control, a blocked counter, a build without a code | 36 | All passed |
| Visit counts with GoatCounter’s real script | GoatCounter’s own `count.js` on a simulated copy of the live address: the exact requests a visitor’s browser sends, one page view per page load, campaign and source names, nothing personal, reloads, referrers, research mode, the switch, Do Not Track, GPC, a blocked counter, automated browsers marked as bots | 33 | All passed |
| Team analytics dashboard | Empty until a real export is loaded, no internet connections, JSON and CSV.gz exports, every total, every day (Asia/Amman), weeks, sources, choices, activities, devices, engagement, test visits left out, date ranges, % view, keyboard tooltips, five 1920 × 1080 images, chart images, CSV files with formulas neutralised, script sentences, dark phone layout | 45 | All passed |
| **Total** | | **445** | **0 failures** |

After the site code `scrollwise` was set (21 November), the analytics tests (33 with GoatCounter’s real script and 36 with the stand-in), release QA (70), research mode (38) and the end-to-end real feed (87) were run again on that build and all passed. Their requests to GoatCounter were recorded locally and never sent, so they say nothing yet about real data reaching GoatCounter.

After the changes on 21 November, these suites were run again on the new build and all passed: end-to-end real feed (87), release QA (70), research mode (38), unseen-first sessions on the real feed (6), and the timer and layout audit (23) on a build with counting switched on and the counter unreachable. The 80-post simulated feed, the full-feed sessions and `build:final` were not re-run; the changes don’t touch the feed, sessions or the final build.

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

### Visit counts (analytics)
Two kinds of test, both without a real GoatCounter account. The first replaced GoatCounter’s script with a stand-in that records what ScrollWise asks it to send. The second used **GoatCounter’s own `count.js`** (from its open-source code) on a simulated copy of `https://taliakasissieh.github.io/scrollwise/`, and recorded the requests instead of sending them. Whether GoatCounter’s server then shows those visits can only be checked once the account exists.
- With no site code (the current published state) the page has no counter, no Settings switch and no mention in the Privacy notice, and makes no request to GoatCounter.
- With a code: exactly one page view per page load, sent as a beacon with only the page, title, campaign, referrer, screen width, a bot flag and a random cache-buster. The campaign from `?utm_campaign=poster-qr` is also sent as its source so exports keep it, then removed from the address bar. No cookies are set.
- Double counting: moving around the app sends no extra page views; a reload sends one more page view, which GoatCounter counts as the same visit (its documented 8-hour session rule); each stopping point is sent once. GoatCounter also counts each event at most once per visit.
- Automated browsers are marked as bots by GoatCounter’s script, so test runs like these never reach the statistics.
- Events for opening the feed, reaching a stopping point, each of the three choices, seeing activity suggestions, starting and completing an activity, the dashboard and About page. Only event names are sent, never post names, captions or saved data.
- Demo Mode sends only “demo-started”; research mode sends nothing, not even a page view.
- The Settings switch stops counting immediately and is remembered; Do Not Track and Global Privacy Control stop all counting.
- If the counter can’t load, the feed, timer and stopping point work normally.

### Team analytics dashboard
Tested with **made-up test exports** (kept outside the project, never published), built to GoatCounter’s export format as written in its source code. The expected numbers came from the generator, not from the dashboard.
- Shows no numbers at all until a file is chosen; its security policy blocks every internet connection; search engines are asked not to list it.
- Reads GoatCounter JSON (ZIP) and gzipped CSV exports; rejects other files with a clear message.
- Every total, every day in Asia/Amman time, weekly totals, sources (including a hostile campaign name shown as plain text), stopping-point choices, activities, devices and engagement match the test data; team test visits are left out; page loads are only shown for CSV exports.
- Date presets and custom dates, daily/weekly, % of visits, keyboard tooltips, five 1920 × 1080 PNG images, chart images, CSV files (formula-like text neutralised), script sentences and the dark 375 px phone layout work.

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
1. **The live GitHub Pages site** (published 20 November 2026) on the team’s own phones.
2. **Live visit counts**, once the GoatCounter site code is set: a phone visit with `?utm_campaign=test-setup` appears in GoatCounter’s dashboard; a real JSON export loads in the team dashboard and its totals match GoatCounter’s.
3. **Real iPhone (Safari)**: safe areas around the notch and bottom bar, swiping carousels, double-tap, adding a photo to a finished activity, Share CSV, Home Screen version.
4. **Real Android phone** (Chrome, Samsung Internet).
5. **iPad and Android tablets**, portrait and landscape.
6. **Windows laptop**: Chrome, Edge and **Firefox**. Safari on a Mac if available.
7. **Locking the phone or switching apps** during a session: simulated here, not tried on a device.
8. **Google Fonts online** (the test machine had no internet, so fallback fonts were used).
9. **Text size**: larger text settings and browser zoom on real devices.
10. **Screen readers**: VoiceOver (iPhone) and TalkBack (Android).
11. **CSV files** opening in the Excel or Google Sheets the team will use.
12. **Link previews** in chat apps, after setting `homepage`.
13. **Speed** on an older phone and on mobile data.

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
- Visit counts miss visitors who switch them off, use Do Not Track or Global Privacy Control, or block the counter; they count visits, not people. Scans of a QR code without a campaign link appear as Direct visits.
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
