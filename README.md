# Hayes Creative: portfolio of Nicki Hayes

A static portfolio site: plain HTML, CSS and vanilla JS. There's no build step and no framework. Open `index.html` directly, or deploy the folder as-is.

```
index.html                         Home: hero → work → toolkit → about → credentials → contact
work/teal-way.html                 Case study: Tealway ABA (social media)
work/luqsee.html                   Case study: Luqsee (SEO & content)
work/animal-shelter.html           Case study: Mel's Farm Animal Sanctuary (campaign)
assets/site.css                    All styles (tokens → components)
assets/site.js                     Mobile nav, scroll reveal, lightbox
assets/img/                        Web-optimised images (WebP)
assets/docs/                       Downloads (empty in v1)
assets/favicon.svg
.nojekyll                          Tells GitHub Pages to serve files as-is
CONTENT_MAP.md                     Where every asset and number comes from
OPEN_QUESTIONS.md                  What Nicki must confirm before sharing the link
REVIEW.md                          Review findings and their resolution
```

`Resources/` holds the original source files. It's not referenced by the site; exclude it from the public repo if you'd rather keep the originals private (see below).

## Deploy to GitHub Pages

1. Create a public GitHub repo (e.g. `hayes-creative`), push this folder to `main`.
2. Repo **Settings → Pages → Build and deployment → Source: Deploy from a branch → `main` / `/ (root)`** → Save.
3. Live within ~1–2 minutes at `https://<username>.github.io/hayes-creative/`.
4. (Later) custom domain: add a `CNAME` file and DNS records; no rebuild needed.

```bash
git init
git add .
git commit -m "Hayes Creative v1"
git branch -M main
git remote add origin https://github.com/<username>/hayes-creative.git
git push -u origin main
```

`.gitignore` keeps `Resources/` (the original client files), the spec and the working notes (`CONTENT_MAP.md`, `OPEN_QUESTIONS.md`, `REVIEW.md`) out of the public repo.

**Live URL:** https://laird777.github.io/hayes-creative/. Canonical tags, `og:url`/`og:image`, `sitemap.xml` and `robots.txt` all use this address. If the site moves to a custom domain, search and replace it across the HTML files, `sitemap.xml` and `robots.txt`.

### Alternative: Netlify drag-and-drop

Make a folder containing only `index.html`, `work/`, `assets/` and `.nojekyll`. Go to <https://app.netlify.com/drop> and drag that folder onto the page. Don't drag the whole project folder, or `Resources/` and the notes will be published too.
It's live immediately on a `*.netlify.app` URL, which you can rename in Site settings.

## Editing

- **Email:** `nickihayes20@gmail.com`. To change it, search and replace it in all four HTML files.
- **Headshot:** `assets/img/nicki-hayes.webp` (from her LinkedIn profile photo). To change it, replace that file.
- **New case study:** copy any `work/*.html` page, change the content, then add a card to the `.work-grid` in `index.html` and update the "Next project" links.
- **Social links:** LinkedIn is in each footer and the contact block. Add Instagram or others alongside it.
- Every number on the site must trace to `CONTENT_MAP.md`. Add a row there when you add a metric.
