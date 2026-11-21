# Visit counts and the team analytics dashboard

ScrollWise can count its visits anonymously with **GoatCounter**, a free, open-source analytics service built for privacy. The team can use the numbers to show ScrollWise's real reach and how people use it, without collecting anything about the people who visit.

**Status (21 November 2026):** the GoatCounter account exists and the site code `scrollwise` is set, so the published website counts visits (dashboard: `https://scrollwise.goatcounter.com`). The first real visit still has to be checked by hand (section 8). To switch counting off for everyone, set the code back to `""` in `package.json` and publish again.

---

## 1. How it works

```
visitor's browser ──(anonymous count)──▶ GoatCounter ──(export file)──▶ team dashboard (in your browser)
```

- **ScrollWise** sends one count per page load and a few anonymous events (section 3) to GoatCounter.
- **GoatCounter** keeps aggregated statistics. Its own dashboard at `https://YOUR-CODE.goatcounter.com` needs a sign-in, so it is private.
- **The team dashboard** at `https://taliakasissieh.github.io/scrollwise/team-report/` turns a GoatCounter export file into ScrollWise-styled charts, video images and CSV files. It reads the file only on your device and can't connect to the internet. It isn't linked from the app and shows nothing until a real export is loaded.

The dashboard can't fetch live data by itself: that would need a GoatCounter API key in a public web page, which would be a secret anyone could copy. Downloading an export takes about a minute and keeps everything private.

## 2. Turning it on (one adult, about 5 minutes)

GoatCounter needs an email address and a password, so a **teacher or parent** should create the account. Nobody else needs one. Never send the password to anyone, including Claude.

1. Go to **https://www.goatcounter.com** and choose **Sign up**.
2. Fill in the form:
   - **Account name:** `scrollwise` (if it's taken, try `scrollwise-team` or similar). This becomes your private address, `https://scrollwise.goatcounter.com`, and it is the **site code** ScrollWise needs.
   - **Site domain** (optional): `taliakasissieh.github.io`
   - **Email address** and **Password** (at least 8 characters)
   - **Fill in 9 here:** type `9` (a simple anti-spam check)
3. Confirm the email GoatCounter sends.
4. In GoatCounter, open **Settings** and check:
   - **Dashboard viewable by:** *Only logged in users* (the default). Keep it that way.
   - **Data collection:** untick **Region**, so only the country is kept. Keep **Sessions** ticked: it is what stops reloads counting as new visits.
5. Send the **site code only** (for example `scrollwise`) to whoever maintains the website, or set it yourself:
   - in `package.json`, set `"analytics": { "goatcounter": "scrollwise" }`;
   - run `npm run build` and publish the new `docs` folder.
6. Check it works (section 8).
7. **Turn counting off on every team member's own devices** (section 6).

## 3. What is counted

**One count per page load.** GoatCounter turns these into **visits**: the first page load of a device in a session of up to 8 hours. Reloading the page or coming back within 8 hours on the same device doesn't add a visit. Each count includes the date, where the visitor came from (another website, or a campaign link such as the poster's), browser, operating system, screen width and approximate location. GoatCounter works the location out from the IP address without storing the address.

**A few anonymous events**, each counted at most once per visit:

| Event name | Meaning |
| --- | --- |
| `view-feed` | Opened the feed |
| `stopping-point-reached` | Reached a stopping point (post limit or time limit) |
| `choice-done` | Chose "I'm done for now" |
| `choice-moment` | Chose "Find Your Next Moment" |
| `choice-continue` | Chose "Continue intentionally" |
| `view-moments` | Opened Find Your Next Moment |
| `moment-suggestions-shown` | Saw offline activity suggestions |
| `activity-started` | Started an offline activity |
| `activity-completed` | Completed an offline activity (tapped Done) |
| `view-dashboard`, `view-about` | Opened the dashboard / About page |
| `demo-started` | Started Demo Mode |

**Never counted or sent:** names, emails, accounts, which posts were viewed, likes, comments, saved posts, personal stats and goals, which activity was chosen, anything in Demo Mode (apart from the fact it was started), and **anything in research mode**, not even a page view. Research data stays separate, exactly as before.

**Not counted at all:** visitors who switch counting off in Settings, browsers that send Do Not Track or Global Privacy Control, the offline copy (`dist/scrollwise.html`), automated browsers (GoatCounter marks them as bots) and anyone whose browser blocks the counter. The timer, the stopping point and research mode work exactly the same whether counting is on, off or blocked.

GoatCounter sets no cookies and stores nothing on the visitor's device. The code is in `src/lib/analytics.js`, with the rules explained at the top.

## 4. Visits, unique visitors and page loads

| Term | What it means | Shown? |
| --- | --- | --- |
| **Visits** | One device opening ScrollWise in a session of up to 8 hours | Yes: the main number |
| **Unique visitors (different people)** | Would need a way to recognise people across days, which ScrollWise deliberately avoids | **Not measured** |
| **Page loads** | Every time the page loaded, including reloads | Only with a CSV export |

So "350 visits" never means "350 people". The same person on two days counts as two visits. People sharing one network and an identical phone and browser version within 8 hours can count as one visit. Visit numbers are therefore approximate. They are more likely to be a little low than too high, unless team testing is counted (section 6).

## 5. QR codes and campaign links

### The printed poster

If the printed QR code opens `https://taliakasissieh.github.io/scrollwise/` exactly (no `?` part), its scans **cannot** be told apart from other visits. They appear as **"Direct"** visits, together with people who typed the address, used a bookmark or opened it from some apps. Nothing on the website can change that after printing, and the old code keeps working.

To check what the printed code contains, point a phone camera at it: the address appears before you open it.

**What you can honestly say about it:** "N direct visits, which include poster scans". Never "N QR scans".

### Counting QR codes from now on

Add a campaign link to every new QR code, sticker, flyer or post:

| Where | Link |
| --- | --- |
| Poster QR code (new prints or a sticker) | `https://taliakasissieh.github.io/scrollwise/?utm_campaign=poster-qr` |
| Flyers | `…/scrollwise/?utm_campaign=flyer-qr` |
| Competition video (QR on screen) | `…/scrollwise/?utm_campaign=video-qr` |
| Instagram bio or story | `…/scrollwise/?utm_campaign=instagram` |
| School newsletter or email | `…/scrollwise/?utm_campaign=school-email` |

The rules:

- **Put `qr` in the name of every campaign used in a QR code.** The dashboard counts campaigns with "qr" in their name as **QR code visits**, and all others as other tracked links.
- Use lowercase letters, numbers and hyphens only.
- **Campaign names starting with `test`** (for example `?utm_campaign=test-setup`) are treated as team tests: the dashboard leaves them out of every number.
- ScrollWise reads the campaign once, then removes it from the address bar. If a visitor copies and shares the address, the next person isn't counted as a poster visit too.
- ScrollWise also copies the campaign name into `utm_source`. GoatCounter's export files keep only the source name, so this is what lets the dashboard tell `poster-qr` apart from `video-qr`.
- Scan every new code once with a phone before printing.

## 6. Keeping the numbers honest: team devices

On **every phone, tablet and laptop** the team uses for testing or presenting, open ScrollWise and go to **Settings → About and privacy → Anonymous visit counts → off**. The switch is remembered on that device and browser. Check the GoatCounter dashboard after a team testing session: if visits went up, a device was missed.

## 7. Seeing the numbers

**Live numbers.** Sign in at `https://YOUR-CODE.goatcounter.com`. GoatCounter's own dashboard shows visits per day, pages and events, referrers, **Campaigns**, browsers, systems, screen sizes and locations. Choose the dates at the top. To let teammates look without their own login, an adult can set **Dashboard viewable by** to *Logged in users or with secret token* and share the secret link with the team only. The data is anonymous either way.

**The team dashboard (charts for the video):**

1. In GoatCounter, open **Settings → Export/Import**. Under **Export to JSON**, choose **Start export**.
2. When it's ready (GoatCounter also emails you), download it from **Last 10 exports**. CSV exports work too, but only contain visits made after "Individual pageviews" was switched on.
3. Open `https://taliakasissieh.github.io/scrollwise/team-report/` and choose the file.

The dashboard shows:

- **Totals:** visits, visits from QR codes, opened the feed, reached a stopping point, activities started and completed.
- **Visits over time,** daily or weekly, split into QR-code visits and all other visits.
- **Where visits came from:** each campaign, Direct, and other websites.
- **The stopping point:** how often the feed was paused, and which choice people made (stepping away vs continuing).
- **Offline activities:** suggestions, then started, then completed.
- **Engagement over time:** as counts or as a percentage of visits.
- **Devices and countries.**

Pick a date range (all dates, last 7 or 30 days, or your own), and switch between daily and weekly. Hover over or tab to any bar or line to see its numbers. Every chart has a table view, a **Save image** button and a **CSV** button.

## 8. Checking that it works (after the code is set)

1. On a phone that isn't a team testing device, open `https://taliakasissieh.github.io/scrollwise/?utm_campaign=test-setup`.
2. Within a minute or two, the GoatCounter dashboard should show a visit, with `test-setup` under Campaigns.
3. Optional: download a JSON export and load it into the team dashboard. The visit is listed under "team test visits left out", so it never inflates the real numbers.
4. Then switch counting off on that phone if it belongs to the team.

## 9. Using the numbers in the competition video

The dashboard's **For the competition video** section has:

- **Video-ready images (1920 × 1080 PNG):** total visits, QR code visits, the stopping point, offline activities and engagement over time, in ScrollWise's navy and blue, with the source and dates on each.
- **Sentences for the script,** written from the real numbers, with Copy buttons.
- **CSV downloads:** a summary with an explanation of every number, plus daily and weekly figures.
- **What the numbers mean (and don't).**

Do:
- name the source and dates: "GoatCounter (anonymous, cookieless), 1 December 2026 – 15 January 2027";
- say "visits", not "people" or "users";
- call only campaign-link visits with "qr" in the name "QR" or "poster" visits;
- describe engagement as how ScrollWise was used: "in 120 visits, someone chose 'I'm done for now'";
- check the dashboard's totals against GoatCounter's own dashboard before recording.

Don't:
- add, round up or estimate numbers, or show a screenshot of test data;
- claim the numbers prove that ScrollWise improves well-being. That needs a study, such as your research-mode results;
- count team testing (switch it off on team devices first).

## 10. Privacy notice and consent

The Privacy notice in the app (Settings → Privacy notice) explains visit counts in plain words and how to switch them off. It only mentions them once a code is set. GoatCounter uses no cookies, stores nothing on the visitor's device and doesn't store personal data, and its makers state that no GDPR consent notice is needed. So no cookie banner is shown. Visitors can still switch counting off, and Do Not Track and Global Privacy Control are respected.

Rules differ between countries and schools, and many visitors are teenagers: ask your teacher whether your school wants anything extra. If it prefers opt-in, set `ON_BY_DEFAULT = false` in `src/lib/analytics.js`. Counting then stays off until a visitor switches it on in Settings (and the numbers will be much smaller).

To delete all collected data, the account owner can use GoatCounter's **Settings → Delete account**.
