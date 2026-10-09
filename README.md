# Saurabh Kaul's personal website

A personal introduction with a restrained Y2K aesthetic: one static HTML page, with no framework, build step, or external dependencies.

Site: https://saurabhkaul.github.io/

## Project analysis

Before this reset, the local checkout was on an outdated `main` commit. The origin's default branch was `gh-pages`, which contained the Jekyll blog matching the live site. Remote `main` contained another Jekyll version, including checked-in `_site` output. Neither branch contained a deployment workflow. The `gh-pages` CNAME file was empty.

The reset replaces the old blog on `gh-pages` with `index.html` and `.nojekyll`, retaining the existing license. Previous content remains in Git history; the last pre-reset deployment commit is `fb922e98eec56dab8e07b9fa0f524f627249b514`. Other remote branches are untouched.

## Deployment

Continue using the existing GitHub Pages deployment. Push changes to `gh-pages`:

```sh
git push origin gh-pages
```

The intended Pages source is `gh-pages`, folder `/ (root)`, with **Deploy from a branch** selected in repository Settings → Pages. The live content identifies `gh-pages` as the serving branch; the private Pages settings API could not be inspected with the available account. `.nojekyll` makes the page publish as static HTML.

## Local preview

Open `index.html` directly in a browser. No installation is needed.

## Rebuild plan

1. Deploy and verify the static baseline at the existing URL (completed).
2. Decide the site's purpose, content, and navigation before choosing a framework.
3. Build the design and content incrementally, starting with the homepage; check mobile layouts, accessibility, and links as pages are added.
4. Keep using static hosting. If a build tool becomes necessary, add a Pages build workflow and publish generated artifacts instead of committing build output.
5. Once the new site is stable, decide whether to retire the old branches or consolidate development onto `main`. This reset does not change branch settings or delete history.
