# ScrollWise team guide

A short guide for the student team: how to keep ScrollWise working, update it and use its most important features.

## The three rules
1. **Respect people’s time.** Never add infinite scrolling, autoplay, streaks, red badges, guilt messages or anything designed to keep people scrolling.
2. **Be honest.** Don’t invent statistics, testimonials or research results. Keep the “sample feed”, “fictional creator” and “AI info” labels. Don’t claim ScrollWise is proven to work, the first of its kind, or endorsed by the British Council.
3. **Protect privacy.** No accounts, names, emails or tracking. Research uses anonymous codes only, and results never go into this repository.
4. **Keep the address.** The live site is https://taliakasissieh.github.io/scrollwise/ and it’s printed on the poster as a QR code. Never rename or delete the `scrollwise` repository or change its Pages settings; always publish updates to the same repository.

## Set-up (once per computer)
1. Install [Node.js](https://nodejs.org) (the LTS version).
2. Open a terminal in the ScrollWise folder (Windows: right-click the folder → **Open in Terminal**).
3. Run `npm install`.

## Everyday tasks

| I want to… | Do this |
| --- | --- |
| Change text on a page | Edit the file in `src/views/` (for example `About.jsx` or `Landing.jsx`). Only change words between the tags. |
| Change the main message | `MAIN_MESSAGE` at the top of `src/views/About.jsx` (used on the welcome page too). |
| Edit a post’s caption or comments | `src/data/posts.js`. Captions and comments are fictional, so keep them friendly and suitable for teenagers. |
| Add or edit an activity | `src/data/activities.js`. Copy an existing activity and change every field. Each needs clear steps, materials, a time, an energy level, moods and interests. |
| Add or replace a photo | Follow “Replacing photographs” in `README.md`. Check `PHOTO-MANIFEST.md` for the file name. |
| Change colours | The tokens at the top of `src/styles.css`. Check text is still easy to read in light **and** dark mode. |
| See your change | `npm run dev`, then open `dist/scrollwise.html` and refresh after each save. |
| Publish the change | `npm run build`, then upload `docs/` (see `PUBLISHING.md`). |

## Before publishing a change
- [ ] `npm run build` finishes without errors.
- [ ] The feed reaches its stopping point after the chosen number of posts.
- [ ] “I’m done for now”, “Find Your Next Moment” and “Continue intentionally” all work.
- [ ] Find Your Next Moment shows suggestions; the dashboard shows your test session.
- [ ] Checked on a phone and a computer, in light and dark mode.
- [ ] No placeholder text, broken pictures or spelling mistakes.

Then reset your test data: Settings → Reset data.

## Using the key features in a presentation
1. **Welcome page:** read the main message, then tap **Start Exploring**.
2. **Session settings:** tap the timer at the top. Choose 5 posts so the demo is quick.
3. **Feed:** like, comment, save, open a profile, swipe a carousel, try an Explore topic.
4. **Stopping point:** show that nothing else loads, then the three choices.
5. **Find Your Next Moment:** pick a mood, energy and time, and show why each suggestion matches.
6. **Dashboard:** show the stopping-point card and goals.
7. **Research mode:** Settings → About and privacy → Research mode. Explain Mode A vs Mode B and the counterbalanced order. Only show anonymous results.

Tip: **Demo Mode** (Settings) gives a two-minute guided tour with throwaway data, so your real stats stay clean.

## Visit counts
- Turn counting **off on every team device** (Settings → About and privacy → Anonymous visit counts), so tests don’t count as visitors.
- Live numbers: the GoatCounter dashboard (the adult who made the account has the login).
- Charts, video images (1920 × 1080) and script sentences: export from GoatCounter (Settings → Export/Import → Export to JSON), then open `…/scrollwise/team-report/` and choose the file.
- New posters, videos or posts link to `…/scrollwise/?utm_campaign=NAME` so their visits can be counted separately. Put `qr` in the name for QR codes (`poster-qr`). Names starting with `test` are left out as team tests.
- Everything is explained in `ANALYTICS.md`.

## Research
Read `research/ScrollWise-Research-Guide.pdf` before testing anyone. School approval first; voluntary, supervised and anonymous; export the CSV after every session and delete the results from the device.

## Who does what (suggestion)
| Role | Looks after |
| --- | --- |
| Content | Posts, activities, About page wording |
| Photos | `PHOTO-MANIFEST.md`, new pictures, credits |
| Testing | The checklists above and in `TESTING.md` |
| Research | Recruitment, sessions, data export, results |
| Numbers | Visit counts, campaign links, charts for the video |
| Publishing | Builds, GitHub, the release checklist |

## Getting help
Each file starts with a short comment explaining what it does. `README.md` explains the structure; `PUBLISHING.md`, `PHOTOS.md` and the research guide cover their topics step by step.
