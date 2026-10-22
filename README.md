# Dacity Labs — multi-page static website

No npm install, build command, framework, API key, or database is required.

## Preview
Open `index.html` in a browser. For local HTTP preview, run `python3 -m http.server 8000` in this folder and visit http://localhost:8000.

## Upload to your existing GitHub repository
1. Extract this ZIP.
2. Upload the **contents** of the extracted folder to the root of your `dacity-labs` repository. Do not upload the ZIP or put the site inside another folder.
3. Keep `index.html`, `discoveries.html`, `lab.html`, `build-log.html`, `token.html`, `flight-mode.html`, all `file-*.html` pages, `site-config.js`, and the `assets` folder together.
4. Include `CNAME`, which contains `dacitylabs.fun`. Include `.nojekyll` if your upload method shows hidden files; the site does not depend on it.
5. Replace the existing `index.html`. Keep any unrelated files or deployment settings you use.
6. Existing GitHub Pages settings should remain `main` and `/ (root)`. Your registrar DNS must already point at GitHub Pages.

## Configure your confirmed project details
Edit `site-config.js`. Empty contract, buy URL, and social URLs intentionally remain hidden or show not announced. Supported external links use https://. Update token text in `token.html` if the role, distribution, or launch status changes. DLABS is a proposed ticker, not a verified launched token.

## Pages and interactions
- Home with separate desktop/mobile hero images.
- Discoveries: instant search, categories, sort, saved-only view, and two-file comparison.
- Six individual source-note pages.
- The Lab: Tools/Games filters, archive explorer, and Flight Mode.
- Flight Mode: keyboard/touch flying prototype, pause/resume, local best score, and copy score.
- Build Log: this release and proposed next work.
- Token: configurable details, working copy address once configured, and optional official links.

## Data and limitations
Bookmarks and personal best scores use browser localStorage. They are not shared across devices. The site has no accounts, community submissions, wallet connections, transactions, prize payouts, global leaderboard, or backend. All current tools are free.

All visual art is original concept illustration. It is not a game screenshot or a reconstruction of official map geography. Source URLs are inside individual files. The Dacity observation is labeled as reported; other short notes cite Rockstar's official site. Archive seed data also lives in `assets/discoveries.json` for reference; pages are static HTML and editing the JSON alone will not update their text.

This is an independent project, not affiliated with Rockstar Games, Take-Two Interactive, or Dacity Coin.

## Header and menu update
The homepage and Lab headers now overlay their hero artwork with a black top gradient. The homepage badge has been removed. Hero buttons share a row on mobile. Desktop navigation includes the X icon; mobile navigation has an edge-to-edge black panel, large menu links without dividers, a low-opacity vector airplane, and @dacitylabs. Menu Escape, focus looping, background scroll locking, and resize cleanup are included.

Upload the whole extracted package into the same repository root, replacing matching files and merging the assets folder. Every HTML page changed because the navigation is shared. No DNS changes are needed. Cache revision parameters are included for the updated styles and navigation code.

Validation: local link and asset checks; JavaScript syntax checks; interaction logic tested in a DOM harness, including menu open/close and scroll restoration. Visual testing in a real browser remains outstanding in this environment.
