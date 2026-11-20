# Publishing ScrollWise on GitHub Pages

> **ScrollWise is published at https://taliakasissieh.github.io/scrollwise/** (repository `taliakasissieh/scrollwise`, branch `main`, folder `/docs`). This address is on the printed poster’s QR code. **Don’t create a second repository, rename this one, delete it or change its Pages settings.** To publish improvements, follow “Updating the site later” below: the address stays the same.

GitHub Pages hosts the website for free from the **`docs`** folder. Nothing needs to be installed to publish: the site is already built.

> **Before you publish:** get Talia’s approval and go through [`RELEASE-CHECKLIST.md`](RELEASE-CHECKLIST.md). In particular, decide what to do about the photographs that are still missing or temporary (see `PHOTO-MANIFEST.md`).

---

## On a Windows laptop

### 1. Create the repository
1. Go to [github.com](https://github.com) and sign in (a free account is fine).
2. Click **+** (top right) → **New repository**.
3. Name it, for example `scrollwise`. Choose **Public** (GitHub Pages needs a public repository on a free account). Don’t tick “Add a README”. Click **Create repository**.

### 2. Unzip the project
Right-click **ScrollWise.zip** → **Extract All…** → **Extract**. Open the new `ScrollWise` folder.

### 3. Upload the files (choose A or B)

**A. In the browser (Chrome or Edge)**

GitHub accepts up to 100 files per upload, so upload in rounds:

1. On the new repository page, click **uploading an existing file**.
2. **Round 1:** drag the **`docs`** folder from File Explorer onto the page. Wait until every file has finished, then click **Commit changes**.
3. **Round 2:** click **Add file → Upload files**. Drag in `src`, `public`, `research` and all the files in the main folder (`README.md`, `package.json`, `build.mjs` and the other `.md` files, `.gitignore`). Click **Commit changes**.
4. **Round 3:** **Add file → Upload files**, drag in the **`photos`** folder, then **Commit changes**.

Don’t upload `node_modules` or `dist` if you have them: they aren’t needed.

**B. With GitHub Desktop (easier for later updates)**

1. Install [GitHub Desktop](https://desktop.github.com) and sign in.
2. **File → Add local repository…**, choose the `ScrollWise` folder. When asked, click **create a repository**, then **Create repository**.
3. Click **Publish repository**. Untick **Keep this code private**, then **Publish repository**.

### 4. Turn on GitHub Pages
1. In the repository on github.com, click **Settings**.
2. In the left sidebar, under **Code, planning, and automation**, click **Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Under **Branch**, choose **main**, then choose the folder **/docs**. Click **Save**.
5. Wait a minute or two and refresh the page. The address appears at the top, for example `https://your-name.github.io/scrollwise/`. Progress is shown in the **Actions** tab (“pages build and deployment”).

### 5. Check the site
Open the address on the laptop and on a phone, then go through the quick checklist in [`TESTING.md`](TESTING.md).

### 6. Optional: link previews
WhatsApp, iMessage and similar apps need the full address of the preview picture.
1. In `package.json`, set `"homepage": "https://your-name.github.io/scrollwise/"`.
2. Run `npm run build` and upload the new `docs` folder (or commit it in GitHub Desktop).

No Node.js? Open `docs/index.html` on github.com (pencil icon), replace `content="social-card.png"` in the `og:image` and `twitter:image` lines with `content="https://your-name.github.io/scrollwise/social-card.png"`, and click **Commit changes**.

### Updating the site later
1. Change files in `src/` (see [`TEAM-GUIDE.md`](TEAM-GUIDE.md)).
2. Run `npm run build`.
3. Upload the changed files, or in GitHub Desktop write a short summary and click **Commit to main**, then **Push origin**.
4. The site updates within a few minutes.

---

## On an iPhone

An iPhone can do everything **except uploading the project folder**: Safari can only pick single files, not folders, so the folder structure would be lost. Do steps 1–3 above on a computer first (a school computer works too), then use the iPhone for the rest.

### Turn on GitHub Pages from an iPhone
1. Open **Safari**, go to [github.com](https://github.com) and sign in.
2. Open the repository. If you can’t see **Settings**, tap **aA** in the address bar → **Request Desktop Website**.
3. Tap **Settings → Pages**.
4. Set **Source** to **Deploy from a branch**, **Branch** to **main** and the folder to **/docs**. Tap **Save**.
5. After a minute or two, refresh. Tap the address shown at the top to open the site.

### Check and use the site on the iPhone
- Check that publishing worked: repository → **Actions** → “pages build and deployment” has a green tick.
- Test the site with the checklist in [`TESTING.md`](TESTING.md).
- Add it to the Home Screen: in Safari tap **Share → Add to Home Screen**. ScrollWise opens like an app, with its own icon.
- Small text fixes (for example in `README.md`): open the file on github.com, tap the pencil icon, edit, then **Commit changes**. Changes to the website itself need `npm run build` on a computer.

---

## Troubleshooting

| Problem | What to check |
| --- | --- |
| GitHub’s “404” page | Wait a few minutes. Check Settings → Pages shows branch **main** and folder **/docs**, and that `docs/index.html` exists in the repository. |
| Blank page | Check that `docs/assets/app.js` and `docs/assets/app.css` were uploaded. |
| Missing pictures | Check `docs/photos/` was uploaded completely. File names are case-sensitive: don’t rename them. |
| Old version still showing | Wait up to 10 minutes, then reload (on a computer: Ctrl + F5). |
| No Settings tab | Only the repository owner (or an admin) can see it. |
| Pages not available | The repository must be public on a free account. |

GitHub Pages is free for public repositories. ScrollWise needs no paid services, databases or API keys.
