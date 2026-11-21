# Visit counts (analytics)

ScrollWise can count its visitors anonymously with **GoatCounter**, a free, open-source analytics service built for privacy. The team can then show real, measurable interest in the competition video, without collecting anything about the people who visit.

**Status:** the code is built in and tested, but counting stays **off** until the team creates a GoatCounter account and sets its site code (section 2). Until then, nothing is counted or sent.

---

## 1. Why GoatCounter

| | GoatCounter (chosen) | Umami Cloud (free Hobby) | Google Analytics 4 |
| --- | --- | --- | --- |
| Cost | Free for non-commercial use | Free up to 100,000 events a month | Free |
| Cookies | None | None | Yes, so a consent banner is needed |
| Data kept on the free plan | Aggregated statistics | 6 months, then deleted | Yes |
| Events (stopping point etc.) | Yes | Yes | Yes |
| Campaign links | Yes (`utm_campaign`) | Yes | Yes |
| Export | CSV and JSON | Yes | Yes |
| Good fit for a teenage audience | Yes | Yes | No: cookies, profiling, more personal data |

GoatCounter doesn’t use cookies and doesn’t store IP addresses. To tell visits apart it keeps a hash of the site, browser and IP address in memory for 8 hours, and never writes it to disk. Its makers state that no GDPR consent notice is needed. Umami Cloud would also work; its free plan deletes data after 6 months, which is too short for a competition that runs into 2027.

## 2. Turning it on (one adult, about 5 minutes)

GoatCounter needs an email address and a password, so a teacher or parent should create the account. Nobody else on the team needs one.

1. Go to **https://www.goatcounter.com** and sign up.
2. As the **site code**, choose `scrollwise` if it’s free. Your private dashboard will then be at `https://scrollwise.goatcounter.com`. Any other code works too.
3. Confirm the email GoatCounter sends.
4. In GoatCounter’s settings, look at the data-collection options and switch off anything you don’t need (for example the region within a country).
5. Set the site code in ScrollWise:
   - in `package.json`, set `"analytics": { "goatcounter": "scrollwise" }` (your code, not the full address);
   - run `npm run build` and publish the new `docs` folder.

   Or send the code to whoever maintains the site (Claude can do this step too).
6. Check it works: open the website on a phone, then look at the GoatCounter dashboard. A visit should appear within a minute or two.
7. **Turn counting off on every team member’s own devices** (section 5), so testing doesn’t inflate the numbers.

## 3. What is counted

**One count per visit** (page load): the date, where the visitor came from (another website, or a campaign link such as the poster’s), browser, operating system, screen size and country. GoatCounter works out the country from the IP address without storing it.

**A few anonymous actions**, each counted at most once per visitor per visit:

| Event name | Meaning |
| --- | --- |
| `view-feed` | Opened the feed |
| `stopping-point-reached` | Reached a stopping point (post limit or time limit) |
| `choice-done` | Chose “I’m done for now” |
| `choice-moment` | Chose “Find Your Next Moment” |
| `choice-continue` | Chose “Continue intentionally” |
| `view-moments` | Opened Find Your Next Moment |
| `moment-suggestions-shown` | Saw offline activity suggestions |
| `activity-started` | Started an offline activity |
| `activity-completed` | Completed an offline activity |
| `view-dashboard`, `view-about` | Opened the dashboard / About page |
| `demo-started` | Started Demo Mode |

**Never counted or sent:** names, accounts, which posts were viewed, likes, comments, saved posts, personal stats and goals, anything in Demo Mode (apart from the fact it was started), and **anything in research mode**, not even a page view. Research data stays separate, exactly as before.

**Not counted at all:** visitors who switch counting off in Settings, browsers that send Do Not Track or Global Privacy Control, the offline copy (`dist/scrollwise.html`), and anyone whose browser blocks the counter. The timer, the stopping point and research mode work exactly the same whether counting is on, off or blocked.

The code is in `src/lib/analytics.js`, with the rules explained at the top.

## 4. The poster’s QR code

**Important:** if the printed QR code opens `https://taliakasissieh.github.io/scrollwise/` exactly (no `?` part), its scans **cannot be told apart** from other visits. They appear as **“Direct”** visits, together with people who typed the address, used a bookmark or opened it from some apps. Nothing on the website can change that after printing.

To check what the printed code contains, point a phone camera at it: the address appears before you open it. If it starts with a different website (a QR-code service), that service may have its own scan counter worth checking.

**What you can honestly say from the printed code:** the number of Direct visits, described as “visits with no referrer, which include poster scans”, never as “QR scans”.

**To count poster visits reliably from now on** (the old code keeps working forever):

- For new prints, stickers over the old code, or a second code on the poster, use:
  `https://taliakasissieh.github.io/scrollwise/?utm_campaign=poster-qr`
- Use a different name for each place, so you can compare them:

  | Where | Link |
  | --- | --- |
  | Poster QR code | `…/scrollwise/?utm_campaign=poster-qr` |
  | Competition video | `…/scrollwise/?utm_campaign=video` |
  | Instagram bio or story | `…/scrollwise/?utm_campaign=instagram` |
  | School newsletter or email | `…/scrollwise/?utm_campaign=school-email` |

- Visits from these links appear under **Campaigns** in GoatCounter and in blue in the team report.
- ScrollWise reads the campaign once, then removes it from the address bar, so if a visitor copies and shares the link, the next person isn’t counted as a poster visit too.
- Test the new code once from a phone before printing.

## 5. Keeping the numbers honest: team devices

On **every phone, tablet and laptop** the team uses for testing or presenting: open ScrollWise → **Settings → About and privacy → Anonymous visit counts → off**. The switch is remembered on that device. Check the GoatCounter dashboard after a team testing session: if visits went up, a device was missed.

## 6. The private dashboards

**GoatCounter dashboard (live numbers):** `https://YOUR-CODE.goatcounter.com`, sign-in needed, so it’s private. It shows visits per day, campaigns, referrers, browsers, systems, screen sizes, locations and the events above. Choose the date range at the top. Whoever has the login can show it to the team; if you want teammates to have their own logins, GoatCounter’s settings let you add users.

**Team visit report (charts for the video):** `https://taliakasissieh.github.io/scrollwise/team-report/`

1. In GoatCounter’s settings, open **Export** and create an export (the JSON export is recommended; a CSV export only contains visits made after “Individual pageviews” was switched on in GoatCounter’s settings).
2. Download the file, open the team report and choose the file.
3. The report shows visits, visits per day, campaign visits, where visits came from, devices, countries, the stopping-point choices and the offline activities, with tables for each chart.
4. Pick a date range, then use **Save as image** on a chart (a sharp PNG for the video), **Download summary (CSV)** for a spreadsheet, or **Print or save as PDF**.

The report reads the file **only in your browser**: the page is technically unable to send data anywhere, it isn’t linked from the app, and it shows nothing until a real export is loaded. It never shows sample numbers.

## 7. Using the numbers in the competition video

Do:
- name the source and dates: “GoatCounter (cookieless), 1 December 2026 – 15 January 2027”;
- say “visits”, not “people”: one person on one device counts once per visit of up to 8 hours;
- call only campaign-link visits “poster” or “QR” visits;
- compare things that are comparable, for example “X% of visits that opened the feed reached a stopping point”;
- check the team report against the GoatCounter dashboard before recording.

Don’t:
- add or estimate numbers, or show a screenshot of test data;
- claim the numbers prove ScrollWise improves well-being (that needs research, see the research guide);
- count team testing (switch it off on team devices first).

## 8. Privacy notice and consent

The Privacy notice in the app (Settings → Privacy notice) explains visit counts in plain words and how to switch them off. It only mentions them once a code is set. Because GoatCounter uses no cookies, stores nothing on the visitor’s device and doesn’t store personal data, no cookie banner is shown. Visitors can still switch counting off, and Do Not Track and Global Privacy Control are respected. Rules differ between countries and schools: ask your teacher whether your school wants anything extra. If it prefers opt-in, set `ON_BY_DEFAULT = false` in `src/lib/analytics.js`: counting then stays off until a visitor switches it on.
