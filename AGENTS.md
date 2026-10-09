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
- The Nintendo DS console layout and the elaborate desktop/taskbar layout were superseded. Do not restore them unless requested.

## Navigation and accessibility

- Header links switch visibly between About, Current work, and Links. Preserve the selected-link indicator.
- Keep `#about`, `#now`, and `#links` working as direct URLs, including on reload and browser Back/Forward.
- Preserve native link behavior for modified clicks, keyboard activation, visible focus, and focus transfer to the selected section heading.
- Without JavaScript, all sections remain readable and normal anchor navigation works.
- Keep layouts free of horizontal overflow on narrow screens.

## Content

- Write short, direct, factual copy. Avoid sentimental language, welcome messages, and generic personal-brand slogans.
- Preserve approved biography and project descriptions unless the task asks to change them. Ask the user when personal facts or employer links are uncertain.
- Keep both explained, linked projects under one Current work heading. Gossip Glomers carries `(WIP)`.
- Employer links: ShowSeeker → https://www.showseeker.com/; Quantumlabs → https://quantumlabs.us/ (confirmed by the user); Paytm Insider → https://insider.in/.
- Social links: GitHub → https://github.com/saurabhkaul; LinkedIn → https://www.linkedin.com/in/saurabh-kaul-807a12125/; Twitter → https://x.com/saurabhkaul5.
- The footer contains View source; do not reintroduce the removed “Personal website” label.
- Keep `README.md` limited to `# Saurabhs personal website`, a blank line, and `https://saurabhkaul.github.io/`. Put project guidance here instead.

## Implementation and deployment

- Use static HTML, CSS, and small amounts of vanilla JavaScript. Keep the site dependency-free unless the user requests a different approach.
- Preserve `.nojekyll`. GitHub Pages serves the repository root on `gh-pages`; origin is `saurabhkaul/saurabhkaul.github.io`.
- Preserve Git history and unrelated branches. Use regular commits rather than force pushes or history resets.
- Before publishing UI changes, inspect desktop and mobile layouts and test changed interactions. For navigation changes, test actual clicks, keyboard activation, direct section URLs, and Back/Forward.
- Run `git diff --check`. Documentation-only changes need no browser tests.
- When deployment is requested or already authorized, push `gh-pages` and verify the public HTML matches the intended page. Report any deployment failure accurately.
