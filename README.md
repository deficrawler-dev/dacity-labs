# Dacity Labs — clean URLs update

## Upload
Extract the ZIP and upload ALL files and folders inside it to the root of the existing repository. Replace matching files and merge the assets folder. Include the new discoveries, lab, build-log, token and flight-mode folders. Do not upload only index.html. Keep the old top-level HTML pages: they forward old links to the new clean addresses.

GitHub Pages remains main / (root). The CNAME remains dacitylabs.fun. No DNS changes are needed.

## Preview
Run python3 -m http.server 8000 in this folder, then open http://localhost:8000/. Preview through HTTP so root-relative links work correctly.

## Clean page addresses
Home: /
Discoveries: /discoveries/
The Lab: /lab/
Build Log: /build-log/
Token: /token/
Flight Mode: /flight-mode/
Discovery files: /discoveries/dacity-detail/, /discoveries/leonida/, and equivalent named folders.

Each clean address is backed by a real folder containing index.html, so reloads and direct links work. Old .html URLs redirect in JavaScript and preserve query parameters and fragments. If JavaScript is disabled, legacy pages remain readable. Home, navigation, breadcrumbs, cards, related files, comparisons and score-sharing use the clean routes.

## Editing
The served pages are now the index.html files inside the named folders. Edit token/index.html for token copy, lab/index.html for the Lab, discoveries/index.html for the archive, and the root index.html for Home. site-config.js holds the confirmed contract, status, ticker, buy URL and social links. Token details have not been finalized. Keep legacy pages consistent if changing their contents later.

## Existing functionality
Search, category filters, saved files, two-file comparisons, original Flight Mode prototype, keyboard/touch controls, pause/resume and local best score. Mobile full-screen menu, airplane watermark, X links, blended hero header, side-by-side mobile buttons, and the new tagline are retained. Bookmarks and scores are local to the browser; there is no backend or global leaderboard.

Original concept artwork is illustrative, not a game screenshot or verified game map. Dacity Labs is independent from Rockstar Games and Dacity Coin.

## Checks
Local URLs and assets are checked for both root and nested pages. Direct routes and refreshes are checked through a local HTTP server. JavaScript syntax and interaction logic are checked. Visual browser testing remains outstanding.
