# ScrollWise

**Less scroll. More life.**

**Live site (public beta):** https://taliakasissieh.github.io/scrollwise/

> “We don’t need to stop using social media. We need to stop social media from controlling how we use our time.”

ScrollWise is a working prototype of a social feed with a finish line. You choose how long you want to browse and how many posts you want to see. When you reach the end, nothing else loads: ScrollWise stops, shows you what you just did, and helps you find something worth doing offline, matched to your mood, energy, time and interests.

Created by **Talia Kassissieh** with a student team aged 14–17, for the **British Council Your World 2026–27** competition, theme **“Healthy Habits in a Digital World”**. It supports **UN Sustainable Development Goal 3: Good Health and Well-being**.

ScrollWise is an independent student project and is not made, approved or endorsed by the British Council. It is a functional prototype, not a real social network: the creators and posts in the feed are fictional samples, and likes, comments and follows are simulated on your own device.

---

## Contents

1. [How it works](#how-it-works)
2. [Features](#features)
3. [Technologies](#technologies)
4. [Project structure](#project-structure)
5. [Running it on your computer](#running-it-on-your-computer)
6. [Replacing photographs](#replacing-photographs)
7. [Publishing on GitHub Pages](#publishing-on-github-pages)
8. [Research mode](#research-mode)
9. [Privacy](#privacy)
10. [Credits and licences](#credits-and-licences)
11. [Known limitations](#known-limitations)
12. [Maintenance](#maintenance)

---

## How it works

**Browse → Stop → Choose → Do**

1. **Browse** a short, finite feed. You pick the session length (5, 10, 15 or 20 minutes) and the number of posts (5, 8 or 12).
2. **Stop** at a clear stopping point: “You’ve reached the end of your feed.” Nothing loads by itself.
3. **Choose** one of three options: **I’m done for now**, **Find Your Next Moment**, or **Continue intentionally**, which means choosing another limited session on purpose.
4. **Do** something real, with simple first steps, and follow your own habits on the dashboard.

## Features

### A familiar social feed, without the trap
- Photo posts from 27 fictional creators: friends, food, style, pets, travel, sport, music and hobbies.
- Likes, double-tap to like, comments, bookmarks, follows, creator profiles, multi-photo carousels and a Saved page.
- **Explore** has topic filters (Friends, Food, Style, Pets, Travel, Hobbies). They only change which of this session’s posts you see: the session keeps the same size and the same stopping point.
- Posts you haven’t seen come first in every new session. Nothing repeats until you’ve seen everything available.
- A notice explains that creators are fictional and interactions are simulated. Your own comments are marked “only visible to you”. Posts with AI-generated pictures carry an **AI info** label.
- No infinite scroll, no autoplay, no streaks, no red badges, no “are you sure?” tricks.

### Healthy scrolling
- **You set the limits:** minutes and posts per session.
- **Time left and progress** are always visible, as a countdown and a row of dots.
- **Gentle reminders** (optional): halfway through longer sessions and with a minute to go.
- **A real stopping point:** the feed never loads more by itself, and no page, tab, profile or refresh gets around it. Profiles only open posts you’ve already seen.
- **Accurate timing:** only time spent looking at the feed counts. The timer pauses on other pages, in background tabs and when the screen is off, and a refresh keeps the session.
- **A fresh start:** coming back after 3 hours or on a new day starts a new session, which isn’t counted as “continuing”.
- Every session is recorded once.

### Find Your Next Moment
- 51 offline activities in seven groups: creativity, movement, relaxation, connection, exploration, learning and productive.
- Matched to your **mood**, **energy level**, **available time** (5–30 minutes) and **interests**. Each suggestion shows its picture, time, energy needed, what you’ll need, a first step and why it matches you.
- “How are these chosen?” explains the matching in plain words. Recently shown activities score lower, so returning gives new ideas.

### Digital well-being dashboard
- Browsing time today and this week (compared with the week before, once there’s data), sessions completed, average session length and posts viewed.
- How often you stopped at the stopping point and how often you chose to continue.
- Offline activities chosen and completed, a 7-day chart and personal goals with progress bars.
- Everything comes from your own use. New visitors see empty states, never invented numbers. Reset needs a confirmation.

### Research mode
- A supervised comparison of **Mode A** (a conventional feed that keeps loading) and **Mode B** (the ScrollWise feed with a stopping point).
- Every participant tries both, in a counterbalanced order (A→B or B→A), with the same posts, design and maximum time.
- Anonymous codes, neutral questions, duplicate protection, an overview with descriptive comparisons and CSV export (download, share or copy).
- Separate from normal use and from the dashboard. Reached from Settings → About and privacy → Research mode.

### Also included
- A concise welcome page, About page and plain-language Privacy notice.
- Two-minute Demo Mode with throwaway sample data.
- Light and dark mode (follows the device), reduced-motion support, keyboard navigation, visible focus, alt text, large touch targets.

## Technologies

- **HTML, CSS and JavaScript**, with **React 19** for the interface, bundled by **esbuild** into a static website.
- Plain CSS (no framework), with colour and spacing tokens at the top of `src/styles.css`.
- **localStorage** for everything saved. No accounts, server, database, API keys or paid services.
- **IntersectionObserver** to count a post as viewed once half of it is on screen.
- **sharp** (optional, build only) to resize and compress pictures.
- Fonts: Bricolage Grotesque, Figtree and Caveat from Google Fonts, with a local copy of Bricolage Grotesque and system fonts as fallbacks.
- Hosted as a static site on **GitHub Pages**.

## Project structure

```
ScrollWise/
├── docs/                  ← the finished website (GitHub Pages publishes this folder)
│   ├── index.html
│   ├── assets/            app.js, app.css, fonts/
│   ├── photos/            compressed feed pictures
│   └── favicon, app icons, site.webmanifest, social-card.png
├── src/                   ← the source code you edit
│   ├── App.jsx            app shell, navigation, timer
│   ├── store.js           sessions, limits, saved data
│   ├── styles.css         all styles
│   ├── views/             one file per screen
│   ├── data/              posts.js (feed), activities.js (51 activities)
│   ├── lib/               recommendations, research data, drawings
│   └── fonts/             local fallback font + licence
├── photos/                original pictures, credits.json, manifest.csv, PROMPTS-NEEDED.md
│   └── ai/                AI-generated pictures (temporary/ holds drafts)
├── public/                favicon, icons, social card (copied into docs/)
├── research/              research guide PDF, blank results template, sample CSV
├── build.mjs              the build script
├── package.json
├── README.md · PUBLISHING.md · TEAM-GUIDE.md · TESTING.md · RELEASE-CHECKLIST.md
└── CHANGELOG.md · CREDITS.md · PHOTOS.md · PHOTO-MANIFEST.md
```

Where to change things:

| What you want to change | File |
| --- | --- |
| Feed posts, captions, comments, creators | `src/data/posts.js` |
| The 51 activities | `src/data/activities.js` |
| How activities are matched | `src/lib/recommend.js` (rules explained at the top) |
| Session length, posts per session, unseen-first order, fresh sessions, goals | `src/store.js` |
| Colours, fonts, spacing | `src/styles.css` |
| Welcome page | `src/views/Landing.jsx` |
| About page, Privacy notice, main message | `src/views/About.jsx` |
| Feed, Explore topics, timer, comments, profiles | `src/views/Feed.jsx` |
| Stopping point and Continue sheet | `src/views/Pause.jsx` |
| Find Your Next Moment | `src/views/Discover.jsx` |
| Dashboard, Saved, Settings | `src/views/Dashboard.jsx`, `Saved.jsx`, `Settings.jsx` |
| Research mode screens / data and CSV | `src/views/Research.jsx` / `src/lib/research.js` |

## Running it on your computer

You need [Node.js](https://nodejs.org) 20 or newer (free).

```bash
npm install          # once; also installs sharp, which compresses pictures
npm run build        # builds docs/ (the website) and dist/scrollwise.html (offline copy)
npm run dev          # rebuilds every time you save a file in src/
npm run build:final  # builds without the temporary draft pictures
```

To look at the result, open `dist/scrollwise.html` (a single offline file), or serve the `docs` folder with any local web server, for example `npx serve docs` and open the address it prints.

## Replacing photographs

The feed shows photographs only. A post appears once its main picture exists; until then it stays hidden.

1. Open **`PHOTO-MANIFEST.md`** to see the status of every picture, and **`photos/PROMPTS-NEEDED.md`** for the exact prompt of every missing or temporary picture.
2. Create the picture (or find a licensed photo), check it closely and save it in `photos/ai/` with the exact file name shown, for example `photos/ai/post-mirror-fit.jpg`. A final picture automatically replaces a draft with the same name in `photos/ai/temporary/`.
3. Run `npm run build`. The build resizes and compresses the picture, updates the manifest and tells you what’s still missing.
4. Licensed photos go in `photos/` and must be credited in `photos/credits.json`.

Full instructions, sizes and rules are in [`PHOTOS.md`](PHOTOS.md).

## Publishing on GitHub Pages

ScrollWise is published at **https://taliakasissieh.github.io/scrollwise/** from the repository `taliakasissieh/scrollwise` (branch `main`, folder `/docs`). This address is printed on the competition poster as a QR code, so **never rename the repository, delete it or change the Pages settings**. To update the site, build and push to the same repository: the address stays the same.

The finished site is in `docs/`. GitHub Pages publishes it for free from the repository’s `main` branch and `/docs` folder. Every path is relative, so it works at `https://your-name.github.io/scrollwise/`.

**Step-by-step instructions for a Windows laptop and an iPhone are in [`PUBLISHING.md`](PUBLISHING.md).**

Short version: create a public repository, upload the project (the `docs` folder first), then **Settings → Pages → Deploy from a branch → `main` / `/docs` → Save**.

## Research mode

Research mode helps the team test one question: **does an intentional stopping point change how teenagers browse?**

1. Get school approval and follow your school’s rules on parental consent.
2. Read **`research/ScrollWise-Research-Guide.pdf`** and print the sheets in `research/ScrollWise-Results-Template.pdf`.
3. Open **Settings → About and privacy → Research mode**. Keep the recommended settings (5 minutes per feed, 8 posts, order “Alternate”).
4. For each volunteer: enter their code (P001…), tick the confirmations and hand over the device. They try both feeds and answer a few optional questions.
5. After each session, export the CSV (Download, Share or Copy), save it in a school account, and delete the results from the device.

The overview shows descriptive results only. A small study gives early signals, not proof: the guide explains how to report results honestly.

## Privacy

- No sign-up, passwords, names or email addresses.
- No analytics, advertising or tracking.
- Settings, likes, saved posts, stats, goals and photos you add are stored only in your browser (localStorage). Settings → Reset deletes them.
- Research results are stored separately in the same browser until the team exports and deletes them. They never change anyone’s normal stats.
- The only outside requests are Google Fonts, and photo credit links if you open them.

## Credits and licences

See **[CREDITS.md](CREDITS.md)**: licensed photo credits (CC0, CC BY 2.0, public domain), AI-generated images, fonts (SIL Open Font License) and software (React and esbuild: MIT, sharp: Apache 2.0). Licence notices for React are kept at the end of `docs/assets/app.js`, and the font licence is in `docs/assets/fonts/OFL.txt`.

## Known limitations

- **Photographs are incomplete.** 22 of the 80 posts currently have a main picture, and 15 of those (plus 5 carousel photos) are temporary drafts enlarged from small previews. Posts without a picture stay hidden, so the feed is short and mostly “Friends & everyday”. See `PHOTO-MANIFEST.md`. `npm run build:final` builds without the drafts (7 posts).
- **It’s a prototype.** There’s no real social network: creators, posts and comments are fictional, and nobody else sees your interactions.
- **Data stays in one browser** on one device. Private windows forget it, and Safari may delete a site’s data if it isn’t opened for about a week.
- **Research mode isn’t proof.** It gives descriptive results from small groups. Mode A repeats posts once the available ones run out.
- **Real-device testing is still needed.** Automated tests ran in Chrome only. See [`TESTING.md`](TESTING.md).
- **Fonts need the internet** for the full look. Offline, a local copy of the heading font and the device’s own fonts are used.

## Maintenance

**[`TEAM-GUIDE.md`](TEAM-GUIDE.md)** is the short guide for the student team: how to change text, posts and activities, add pictures, run research mode, test changes and publish updates. Before a release, go through **[`RELEASE-CHECKLIST.md`](RELEASE-CHECKLIST.md)**. What changed in each version is in **[`CHANGELOG.md`](CHANGELOG.md)**.

Project by Talia Kassissieh and the ScrollWise student team. AI tools helped with parts of the code and with some sample images; the team chose the idea, the features and the content, and reviewed the results.
