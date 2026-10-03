# Deploying

`npm run build` produces `dist/`, and `.github/workflows/deploy.yml` runs it on
the server on every push to `main`.

## What the build produces

```
dist/
  index.html                      the home page's head, and the app
  labs/<slug>/index.html          one per lab, same app, that lab's head
  og/…                            copied from public/, the link-preview cards
  assets/…                        the hashed bundles
  sitemap.xml
  robots.txt
```

Every one of those HTML files loads the same JavaScript. They differ only in
`<head>` — title, description, canonical, Open Graph and Twitter tags — and in
a `<noscript>` block naming the page. See `tools/prerender.mjs` for why.

## What the server has to do

**The SPA fallback must not shadow the prerendered files.** The rule is: serve
the file if it exists, then the directory's `index.html`, and only then fall
back to `/index.html`.

nginx:

```nginx
root /home/<user>/labs/dist;

location / {
    try_files $uri $uri/ /index.html;
}

# The bundles are content-hashed, so they can be cached forever.
location /assets/ {
    try_files $uri =404;
    add_header Cache-Control "public, max-age=31536000, immutable";
}

# The HTML is not. A stale index.html serves a bundle that no longer exists.
location ~* \.html$ {
    add_header Cache-Control "no-cache";
}
```

**Old lab addresses should answer with a 301.** The slugs were renamed on
2026-10-03 (`src/labs/renamed.ts` lists them). The build already writes a page
at each old address that forwards the browser, so nothing breaks without this;
a real 301 is better, because it tells search engines to move the ranking too:

```nginx
location = /labs/hash-playground        { return 301 /labs/cryptographic-hashing; }
location = /labs/hash-table             { return 301 /labs/hash-tables; }
location = /labs/sorting-race           { return 301 /labs/sorting; }
location = /labs/pathfinding            { return 301 /labs/graph-search; }
location = /labs/tokenizer              { return 301 /labs/tokenization; }
location = /labs/neural-playground      { return 301 /labs/multilayer-perceptrons; }
location = /labs/reward-playground      { return 301 /labs/reinforcement-learning; }
location = /labs/embedding-universe     { return 301 /labs/word-embeddings; }
location = /labs/embedding-universe-3d  { return 301 /labs/word-embeddings-3d; }
```

A `try_files $uri /index.html` that omits `$uri/` will serve the home page's
head for every lab, which is the bug this whole arrangement exists to fix.
After deploying, check one:

```bash
curl -s https://labs.hacettepeaiclub.com/labs/tokenization | grep -o '<title>[^<]*'
```

It must print `Cheap Words · BPE tokenization — AI Club Labs`, not `AI Club Labs`.

## The site's address

`tools/prerender.mjs` writes absolute URLs, which Open Graph requires. The
address comes from `VITE_SITE_URL`, defaulting to
`https://labs.hacettepeaiclub.com` (see `src/app/siteMeta.ts`). A staging host
should set it so it does not advertise production URLs in its own cards:

```bash
VITE_SITE_URL=https://staging.example.com npm run build
```

## Link preview cards

`public/og/*.jpg` are generated from the specimen photographs and committed, so
a deploy never has to build images. They are 1200×630 JPEGs because WhatsApp
and LinkedIn do not reliably render WebP.

A lab with no specimen photograph yet has no card of its own. The prerender
step notices the missing file and points that lab's `og:image` at the
collection's card, `og/home.jpg`, instead of at a picture that would 404; the
build log says how many routes are borrowing it.

Regenerate after adding a lab or reshooting a specimen:

```bash
npm i -D sharp && npm run og && npm un sharp
```

Then check the result against a validator before announcing anything:
<https://developers.facebook.com/tools/debug/> and
<https://www.linkedin.com/post-inspector/>. Both cache aggressively; the
inspector is also how you clear that cache.

## Icons

Everything in `public/` that a browser or a search engine shows as the site's
icon — the favicons, the `.ico`, the Apple touch icon, the Android and
maskable icons — is made by `tools/icons.mjs` from
`src/assets/aiclub-mark-white.png`, the same file the header draws. There is
one logo; change that file and regenerate:

```bash
npm i -D sharp && npm run icons && npm un sharp
```

The tab icon is `favicon.svg`: the deer alone, no ground, white when the
browser is dark and navy when it is light (`prefers-color-scheme` inside the
SVG). `favicon.ico` is the navy fallback for whatever does not draw SVG. At
those sizes the mark is a solid silhouette, because its strands are thinner
than a pixel. Home-screen icons cannot be transparent, so they are the white
deer on the site's own near-black. The tool explains each choice.

A search engine caches a site's icon and refreshes it on its own schedule.
To see what Google currently holds:

```bash
curl -s -o /dev/null -w "%{http_code}\n" "https://www.google.com/s2/favicons?domain=labs.hacettepeaiclub.com&sz=64"
```

`404` means it has none yet. Requesting indexing of the home page in Search
Console is the way to hurry it.
