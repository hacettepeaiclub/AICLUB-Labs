# Deploying

`npm run build` produces `dist/`, and `.github/workflows/deploy.yml` runs it on
the server on every push to `main`. The server builds the next version into
`dist-next/` (`OUT_DIR`) and copies it into `dist/` with `rsync`, so a visitor
never meets a half-built site.

**`dist/` itself must never be replaced, only written into.** The site is
served by an nginx in a container that mounts `dist/`; a mount keeps the
directory it was given, so renaming a new `dist/` into place leaves that
nginx serving the deleted old one, empty, until the container restarts. This
took the site down on 2026-10-12. The front openresty proxies to that nginx,
which is also why its directory redirects came back as `http://`.

## What the build produces

```
dist/
  index.html                      the home page's head, and the app
  labs/<slug>/index.html          one per lab, same app, that lab's head
  404.html                        the app's not-found page, served with a 404
  og/…                            copied from public/, the link-preview cards
  assets/…                        the hashed bundles
  sitemap.xml
  robots.txt
```

Every one of those HTML files loads the same JavaScript. They differ only in
`<head>` — title, description, canonical, Open Graph and Twitter tags — and in
a `<noscript>` block naming the page. See `tools/prerender.mjs` for why.

## How the server is set up

Checked on 2026-10-15. Several sites share one machine.

```
browser ──https──▶ Nginx Proxy Manager (openresty, TLS)   ports 80/443, admin on 81
                        │  proxy_net
                        ▼
                   labs_site  (image nginx)               host port 8086 → 80
                        │  mounts, read-only
                        ├─ /root/labs/dist        → /usr/share/nginx/html
                        └─ /root/labs-nginx       → /etc/nginx/conf.d
```

- **Nginx Proxy Manager** terminates TLS and forwards to `labs_site`. In its
  proxy host for `labs.hacettepeaiclub.com`, the SSL tab should have **Force
  SSL** and **HTTP/2 Support** on.
- **`labs_site`** serves the files. Its configuration is
  [`deploy/labs-nginx.conf`](../deploy/labs-nginx.conf), copied to
  `/root/labs-nginx/default.conf` on the server. It turns off absolute
  redirects (see below), compresses text behind the proxy, caches the hashed
  bundles for a year and revalidates pages, answers an unknown address with
  `404.html` and a real 404, and adds HSTS, `nosniff`, `frame-ancestors
'none'`, `Referrer-Policy` and `Permissions-Policy`. The page's own `<meta>` Content-Security-Policy
  (`tools/prerender.mjs`) covers the rest.

Until 2026-10-15 `labs_site` ran nginx's default configuration, and three
things followed from it. A lab address without its trailing slash answered
`301 Location: http://…/` because this nginx only ever sees http, and that
downgrade is what made Chrome warn "this site doesn't support a secure
connection" and left the hashing lab without a secure context. Nothing but
the HTML was compressed, because nginx does not compress proxied requests
unless told to. And nothing was cached.

### Changing the nginx configuration

Edit `deploy/labs-nginx.conf`, then on the server:

```bash
cp ~/labs/deploy/labs-nginx.conf /root/labs-nginx/default.conf
docker exec labs_site nginx -t && docker exec labs_site nginx -s reload
```

### Recreating the container

If `labs_site` is ever removed, this brings it back exactly:

```bash
docker run -d --name labs_site --restart unless-stopped -p 8086:80 \
  -v /root/labs/dist:/usr/share/nginx/html:ro \
  -v /root/labs-nginx:/etc/nginx/conf.d:ro \
  nginx
docker network connect proxy_net labs_site
```

### After any change, check

```bash
curl -sI https://labs.hacettepeaiclub.com/labs/sorting | grep -i location
curl -sI -H "Accept-Encoding: gzip" https://labs.hacettepeaiclub.com/ | grep -iE "content-encoding|cache-control|strict"
```

The first must print a relative `Location: /labs/sorting/`. The second must
show `gzip`, `no-cache` and `Strict-Transport-Security`; a file under
`/assets/` must show `max-age=31536000, immutable`.

**Every page is a file, so there is no SPA fallback.** The rule is: serve the
file if it exists, then the directory's `index.html`, and otherwise answer 404
with `404.html`, which is what `try_files $uri $uri/ =404` and `error_page 404
/404.html` in `deploy/labs-nginx.conf` say. Until 2026-10-16 the last step was
`/index.html`, which answered 200 to any address at all, so search engines
could index a typo as a page and no link checker could see a broken link.
Check it:

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://labs.hacettepeaiclub.com/nonexistent
```

It must print `404`.

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
