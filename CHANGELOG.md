# Changelog

## 122 more posts (21 November 2026)
- 122 new posts from 42 new creators (plus a few from existing ones), in `src/data/posts-fashion.js` (54 fashion and beauty posts: outfits, denim, streetwear, thrift, menswear, knitwear, jewellery, bags, sneakers, skincare, nails, makeup, curly hair) and `src/data/posts-more.js` (18 food and cafés, 13 travel, 12 pets, 13 hobbies, 12 everyday). The feed now has 202 posts from 69 creators. Every post has its own caption, comments, like count and photo description; 26 have carousels.
- The new posts are planned for real photographs without identifiable faces, so licensed photos (Unsplash, Pexels) or team photos can be used without putting fictional captions on real people. They stay hidden until their photo is installed: **no new photographs were added in this update**, because photo libraries can’t be reached from the environment where the update was made.
- New `photos/licensed/` folder with a simple `credits.csv`, and a generated shopping list, `photos/FIND-PHOTOS.md`, with Unsplash and Pexels search links for every post still waiting for a photo.
- Creators without a profile picture now show a close crop of their own first feed photo.
- A data check: unique post ids, captions, descriptions, search words and like counts; known creators and commenters; carousel descriptions; picture names that can’t clash.
- Tested with test pictures for all 202 posts (journey, all 26 sessions of unseen-first rotation without repeats, timer, performance on a throttled phone); the session timer, post limits, stopping point, activities, research mode and visit counts are unchanged.

## Visit counts switched on (21 November 2026)
- GoatCounter site code `scrollwise` set in `package.json`; the published website now loads GoatCounter’s counter (the offline copy still never counts). Nothing else changed.
- Automated checks on this build: GoatCounter’s own counting script on a simulated copy of the live address (33), what ScrollWise asks it to send (36), release QA (70), research mode (38), end-to-end real feed (87). All passed. A real visit reaching GoatCounter still has to be checked by hand.

## Team analytics dashboard (21 November 2026)
- The team report is now a full analytics dashboard in ScrollWise’s navy, electric blue and green: visits, visits from QR codes, opened the feed, stopping points, activities started and completed; visits over time (daily or weekly, QR vs other); sources; the stopping-point choices (stepping away vs continuing); offline activities; engagement over time (counts or % of visits); devices and countries. Date presets and custom dates, tooltips by mouse or keyboard, a table, image and CSV for every chart.
- New “For the competition video” section: five 1920 × 1080 images, script sentences written from the real numbers, CSV downloads with explanations, and what each number does and doesn’t mean (visits vs unique visitors vs page loads, QR vs direct visits, engagement vs proven impact).
- Campaign links: the campaign name is now also sent as its source, so GoatCounter’s export files keep it. Campaigns with “qr” in the name count as QR visits; names starting with “test” are left out as team tests.
- Privacy notice says “approximate location (country)”. `ANALYTICS.md` rewritten with exact GoatCounter sign-up and setup steps.
- Tested with GoatCounter’s own counting script on a simulated copy of the live address, and with test exports built from GoatCounter’s export format.

## Anonymous visit counts (21 November 2026)
- Optional, privacy-friendly analytics with GoatCounter: no cookies, no personal data, nothing stored on the device. Off until a site code is set in `package.json`.
- Counts one page view per visit (with campaign links such as `?utm_campaign=poster-qr`) and anonymous events: opening the feed, reaching a stopping point, each stopping-point choice, seeing activity suggestions, starting and completing an activity, and Demo Mode.
- Never counts research mode (not even a page view) or anything in Demo Mode. Respects Do Not Track and Global Privacy Control; visitors can switch it off in Settings. Campaign parameters are removed from the address after counting.
- New private team visit report (`/team-report/`): reads a GoatCounter CSV or JSON export in the browser only (connections blocked), with visits per day, campaigns, sources, devices, countries, stopping-point choices and activities, date ranges, tables, PNG chart export and a summary CSV. Shows nothing until a real export is loaded.
- Privacy notice, Settings, README, team guide and release checklist updated; new `ANALYTICS.md`.

## Final release candidate (20 November 2026)

### Healthy scrolling
- The session timer now shows **time left** (“4:12 left”) in the header, the session sheet and the desktop sidebar.
- **Fresh visits:** coming back after 3 hours, or on a new day, starts a new session automatically. It isn’t counted as “continuing”, and an old unfinished session no longer carries over.
- Verified that no page, tab, profile, Saved post or refresh gets around the stopping point, and that each session is recorded once.
- Average session length is now recorded with every completed session.

### Feed
- **Explore topics:** All, Friends, Food, Style, Pets, Travel, Hobbies. A topic only filters this session’s posts: the session size and stopping point stay the same, and a topic that runs out says so.
- Larger tap areas for usernames and “AI info”.

### Find Your Next Moment
- Every suggestion now shows its **first step** and a “fits your N min” reason, as well as materials, time and energy.
- New “How are these chosen?” explanation of the matching rules.

### Dashboard
- **Average session length**, and this week’s browsing time **compared with the week before** (only when there is data for it).
- Clearer labels: “Activities chosen” and “Activities completed”.

### Research mode (rebuilt)
- **Within-subjects, counterbalanced design:** every participant tries both feeds, A→B or B→A. Order can alternate automatically, be random, or be set by hand from the printed order list.
- **Mode B** asks the participant how long they’d like to browse, stops at the post limit or that time, and offers “I’m done” or “Continue intentionally: up to N more posts”.
- **Neutral questions** after each feed: a time guess, awareness of time, feeling of control, ease of stopping and overall experience, plus one “use again” question at the end.
- **Records** include order, position, intended time, whether the participant stopped by choice or reached the maximum time, whether the stopping point appeared and whether they continued.
- **Duplicate protection:** double taps save once; a code that completed both feeds can’t run again; a participant who left after one feed can finish only the missing one.
- **Overview** with charts and descriptive comparisons (per mode, paired per participant, order check), clearly marked as not proof.
- **Reliable export:** Download CSV, Share CSV (phones and tablets that support it), Copy CSV and Show CSV text. 27 documented columns.
- Fixed a timing bug that under-counted research browsing time.
- Older research records (version 1) are converted automatically.

### Pages and design
- Welcome page: clearer one-sentence explanation of the problem and the idea, and an “About the project” button.
- About page: honest originality statement, the competition theme, independence from the British Council, research method, student-led process and future applications.
- Local copy of the heading font as a fallback when Google Fonts can’t load.
- Research stop screen and order menu fit small phones.

### Publishing and documentation
- Photo **manifest** (`PHOTO-MANIFEST.md`, `photos/manifest.csv`) and exact **prompts for every missing or temporary picture** (`photos/PROMPTS-NEEDED.md`), regenerated by every build. Exact duplicate pictures are reported.
- Research guide PDF, blank results template, sample CSV structure.
- New `PUBLISHING.md` (Windows and iPhone), `TEAM-GUIDE.md`, `RELEASE-CHECKLIST.md` and this changelog; updated README, CREDITS and TESTING.
- Licence notices of bundled software are kept in `app.js`.

### Testing
- New automated tests for research mode (38 checks, including a real 3-minute maximum-time run), fresh visits, stopping-point bypasses, Explore topics, dashboard calculations, goals, reset and case-sensitive file names. See `TESTING.md`.

## Previous release (November 2026)
- GitHub Pages build in `docs/` with relative paths, favicon, app icons, web manifest and social sharing image.
- Posts per session (5, 8 or 12); “I’m done for now” at the stopping point; sample-feed notice.
- Energy level in Find Your Next Moment and five productive activities (51 in total).
- Dashboard stopping-point card and personal goals.
- First version of research mode with CSV export.
- About page and Privacy notice; accessibility and contrast fixes.
