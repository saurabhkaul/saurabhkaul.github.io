# Project checkpoint

Saurabh Kaul's personal website: https://saurabhkaul.github.io/

These guidelines apply throughout this repository. Follow newer explicit user instructions when they change this checkpoint.

## Approved design

Use the minimal Y2K / Win95 browser-window design in `index.html`. Commit `c7f5589` is the approved visual and navigation reference.

- One centered window, approximately 660px wide, with a responsive layout.
- Square corners, a silver `#c0c0c0` frame, subtle beveled borders, and a small shadow.
- A navy-to-blue horizontal title-bar gradient (`#000080` to `#346baf`).
- A flat pale grey-blue page background (`#e3e6eb`) and white content area.
- Tahoma/Verdana body text, a Georgia name heading, and small Courier New labels.
- Plain blue underlined links, restrained spacing, and simple browser chrome.
- Keep the design minimal. Avoid glossy title bars, rounded metallic frames, heavy gradients, dashboard cards, decorative slogans, badges, or extra desktop windows.
- The Nintendo DS console layout, elaborate desktop/taskbar layout, and Currently Reading 2 experiment were retired. Do not restore them unless requested.

## Navigation and accessibility

- Header links switch visibly between About, Personal Projects, Currently Reading, and Links. Preserve the selected-link indicator.
- Keep `#about`, `#now`, `#reading`, and `#links` working as direct URLs, including on reload and browser Back/Forward.
- Preserve native link behavior for modified clicks, keyboard activation, visible focus, and focus transfer to the selected section heading.
- Without JavaScript, all sections remain readable and normal anchor navigation works.
- Keep layouts free of horizontal overflow on narrow screens.

## Content

- Write short, direct, factual copy. Avoid sentimental language, welcome messages, and generic personal-brand slogans.
- Preserve approved biography and project descriptions unless the task asks to change them. Ask the user when personal facts or employer links are uncertain.
- Keep both explained, linked projects under one Personal Projects heading. Gossip Glomers carries `(WIP)`.
- The reading section is titled `Currently Reading` and lists books the user is reading or has finished. Each book links to its own static review page, with a review of 200 words or fewer.
- Sort the reading list from started to finished: DDIA, Rust Atomics and Locks, then Rust for Rustaceans. Their confirmed statuses are Started, Mostly finished, and Finished respectively.
- Show progress bars only on individual book review pages, not on the Currently Reading list. Use small classic Windows 95/98 progress bars: a square, two-pixel sunken frame, silver-grey track, and consistently spaced navy blocks. Show only the bars, without visible status labels, percentages, or “Reading stage” text; retain qualitative reading statuses as accessible labels. Until chapter counts are supplied, fill levels represent stages, not exact completion percentages. Keep the review-page statuses consistent with the user-confirmed reading status. Never invent chapter counts or exact progress.
- Use only book titles, authors, and review opinions supplied or approved by the user. An empty list is preferable to invented reading history or reviews.
- Review pages share the main site's frame, typography, colors, and navigation, and link back to `/#reading`. Keep simple author labels and one book cover on each review page, using locally stored images from official book/author sources or an ISBN-matched library cover with a Book details link. Avoid cards or cover galleries in the book list. Show `Review coming soon.` until the user supplies a review; do not invent opinions or show a misleading word count.
- Employer links: ShowSeeker → https://www.showseeker.com/; Quantumlabs → https://quantumlabs.us/ (confirmed by the user); Paytm Insider → https://insider.in/.
- Social links: GitHub → https://github.com/saurabhkaul; LinkedIn → https://www.linkedin.com/in/saurabh-kaul-807a12125/; Twitter → https://x.com/saurabhkaul5.
- The footer contains View source; do not reintroduce the removed “Personal website” label.
- Keep `README.md` limited to `# Saurabhs personal website`, a blank line, and `https://saurabhkaul.github.io/`. Put project guidance here instead.

## Implementation and deployment

- Use static HTML, CSS, and small amounts of vanilla JavaScript. Keep the site dependency-free unless the user requests a different approach.
- Shared visual styles live in `assets/site.css`; use this stylesheet on the homepage and review pages to keep the design consistent.
- Preserve `.nojekyll`. GitHub Pages serves the repository root on `gh-pages`; origin is `saurabhkaul/saurabhkaul.github.io`.
- Preserve Git history and unrelated branches. Use regular commits rather than force pushes or history resets.
- Before publishing UI changes, inspect desktop and mobile layouts and test changed interactions. For navigation changes, test actual clicks, keyboard activation, direct section URLs, and Back/Forward.
- Run `git diff --check`. Documentation-only changes need no browser tests.
- When deployment is requested or already authorized, push `gh-pages` and verify the public HTML matches the intended page. Report any deployment failure accurately.

## Adding a book review

- Start with `templates/book-review.html` and save the completed page as `reading/<book-slug>.html`. The template is an authoring scaffold, not a book-list entry.
- Replace every `{{...}}` placeholder, escape titles/authors as HTML, and use paragraph elements for the user's review. Keep the review body at 200 words or fewer. Add the cover to `assets/covers/` and fill its filename, actual dimensions, descriptive alt text, and official source link.
- Add one `<li>` to the homepage's `.book-list`: link the book title to `reading/<book-slug>.html`, then include its author in a `.book-author` span.
- Use `Review coming soon.` for user-supplied books whose reviews have not been written. Do not add invented books or review text to the live list.
- Check the book-list link, direct review URL, return link to `/#reading`, and word count before publishing.

### Cover sources

- Rust for Rustaceans — Jon Gjengset: https://rust-for-rustaceans.com/RustforRustaceans_cover.png
- Rust Atomics and Locks — Mara Bos: https://mara.nl/atomics/cover.jpg
- Designing Data-Intensive Applications — Martin Kleppmann (original edition): https://covers.openlibrary.org/b/isbn/9781449373320-L.jpg?default=false
