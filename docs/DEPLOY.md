# Deploying

`npm run build` produces `dist/`, and `.github/workflows/deploy.yml` runs it on
the server on every push to `main`. The server builds the next version into
`dist-next/` (`OUT_DIR`) and swaps it in with two renames, so a visitor never
meets a half-built site.

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

The live server (openresty, behind the hosting panel) was checked on
2026-10-12 against what follows. Four things were wrong, and the first is why
some visitors saw Chrome's "this site doesn't support a secure connection":

1. **An https request could be redirected to http.** Asking for
   `https://…/labs/sorting` (no trailing slash) answered `301 Location:
http://…/labs/sorting/`. nginx adds the slash for a directory and, when it
   builds the absolute address, used the plain scheme. A browser set to always
   use secure connections treats a downgrade like that as "https does not
   work here" and shows the warning; a visitor who clicks through gets the
   page over http, where the hashing lab cannot run. `absolute_redirect off`
   makes nginx send a relative `Location`, which keeps whatever scheme the
   request came in on. The site now also links every lab with its slash
   (`src/lib/paths.ts`), so it never asks for that redirect itself.
2. **http was served as is**, never sent to https, and there was no HSTS.
3. **Nothing but the HTML was compressed**, and nothing was cached: the
   bundles went out at full size on every visit, about 400 KB more than
   needed on the first one.
4. **HTTP/1.1 only**, so the two dozen files of a lab page queued six at a
   time.

The page carries its own Content-Security-Policy and referrer policy as
`<meta>` tags (`tools/prerender.mjs`). The headers below repeat the parts a
`<meta>` cannot set: `frame-ancestors`, `X-Content-Type-Options`, HSTS.

nginx / openresty, the whole site:

```nginx
server {
    listen 80;
    server_name labs.hacettepeaiclub.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    http2 on;                       # older nginx: `listen 443 ssl http2;`
    server_name labs.hacettepeaiclub.com;
    # ssl_certificate … as the panel already has it

    root /home/<user>/labs/dist;

    # Keep the scheme when adding a directory's trailing slash.
    absolute_redirect off;

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml
               application/xml text/plain application/manifest+json;
    gzip_min_length 1024;

    # One place for the headers, because an `add_header` inside a location
    # replaces every `add_header` inherited from outside it.
    set $hsts "max-age=31536000; includeSubDomains";

    location / {
        try_files $uri $uri/ /index.html;
        add_header Strict-Transport-Security $hsts always;
        add_header X-Content-Type-Options nosniff always;
        add_header Content-Security-Policy "frame-ancestors 'none'" always;
        add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
        add_header Cache-Control "no-cache";
    }

    # The bundles are content-hashed, so they can be cached forever.
    location /assets/ {
        try_files $uri =404;
        add_header Strict-Transport-Security $hsts always;
        add_header X-Content-Type-Options nosniff always;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

`Cache-Control: no-cache` on everything outside `/assets/` is deliberate: an
`index.html` kept from yesterday points at bundles today's build deleted.
`no-cache` still lets the browser keep the file and revalidate it with the
ETag, which costs a 304 and a few hundred bytes.

**The SPA fallback must not shadow the prerendered files.** The rule is: serve
the file if it exists, then the directory's `index.html`, and only then fall
back to `/index.html`, which is what `try_files $uri $uri/ /index.html` says.

After changing it, check from any machine:

```bash
curl -sI http://labs.hacettepeaiclub.com/ | grep -i location
curl -sI https://labs.hacettepeaiclub.com/labs/sorting | grep -i location
curl -sI -H "Accept-Encoding: gzip" https://labs.hacettepeaiclub.com/assets/ | head -n 1
```

The first must print `https://…`, the second a relative `/labs/sorting/`, and
every bundle under `/assets/` must come back with `Content-Encoding: gzip` and
the year-long `Cache-Control`.

**Old lab addresses should answer with a 301.** The slugs were renamed on
2026-10-03 (`src/labs/renamed.ts` lists them). The build already writes a page
at each old address that forwards the browser, so nothing breaks without this;
a real 301 is better, because it tells search engines to move the ranking too:

```nginx
location = /labs/hash-playground        { return 301 /labs/cryptographic-hashing/; }
location = /labs/hash-table             { return 301 /labs/hash-tables/; }
location = /labs/sorting-race           { return 301 /labs/sorting/; }
location = /labs/pathfinding            { return 301 /labs/graph-search/; }
location = /labs/tokenizer              { return 301 /labs/tokenization/; }
location = /labs/neural-playground      { return 301 /labs/multilayer-perceptrons/; }
location = /labs/reward-playground      { return 301 /labs/reinforcement-learning/; }
location = /labs/embedding-universe     { return 301 /labs/word-embeddings/; }
location = /labs/embedding-universe-3d  { return 301 /labs/word-embeddings-3d/; }
```

A `try_files $uri /index.html` that omits `$uri/` will serve the home page's
head for every lab, which is the bug this whole arrangement exists to fix.
After deploying, check one:

```bash
curl -s https://labs.hacettepeaiclub.com/labs/tokenization/ | grep -o '<title>[^<]*'
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

`public/og/*.jpg` are generated and committed, so a deploy never has to build
images. They are 1200×630 JPEGs because WhatsApp and LinkedIn do not reliably
render WebP. They come from two places:

- **A specimen photograph**, for the labs that have one
  (`src/assets/specimens/`): `tools/og-images.mjs`.
- **The lab's own plate** — the diagram beside its title — for every lab
  without one: `tools/og-plates.mjs` opens the built site and captures it at
  the card's resolution.

A lab with neither has no card of its own. The prerender step notices the
missing file and points that lab's `og:image` at the collection's card,
`og/home.jpg`, instead of at a picture that would 404; the build log says how
many routes are borrowing it. Drafts are left to borrow it on purpose.

Regenerate after adding a lab or reshooting a specimen:

```bash
npm i -D sharp && npm run og && npm un sharp

npm run build
npm i -D sharp playwright && npx playwright install chromium
node tools/og-plates.mjs && npm un sharp playwright
```

Then check the result against a validator before announcing anything:
<https://developers.facebook.com/tools/debug/> and
<https://www.linkedin.com/post-inspector/>. Both cache aggressively; the
inspector is also how you clear that cache.

## Icons

Everything in `public/` that a browser or a search engine shows as the site's
icon — the favicons, the `.ico`, the Apple touch icon, the Android and
maskable icons — is made by `tools/icons.mjs` from
`src/assets/aiclub-mark-white.webp`, the same file the header draws. There is
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
