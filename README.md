# AI Club Labs

Premium interactive experiences that teach Computer Science and AI — inspired by the craft of Neal.fun, Linear, and Stripe. Not a clone: every lab is an original experiment where you learn by pulling levers.

**New here? Start with [docs/OVERVIEW.md](docs/OVERVIEW.md)** — what we're building, why, and the bar a lab has to clear.

## Stack

React 18 · TypeScript (strict) · Vite · Tailwind CSS · SVG / Canvas

## Quick start

```bash
npm install
npm run dev
```

## Adding an experiment

1. Create `src/labs/<slug>/` with:
   - `meta.ts` — exports a `LabMeta` object (title, description, category, difficulty, minutes)
   - `index.tsx` — default-exports the lab component
2. Register it in `src/labs/registry.ts` (one line).

That's it — routing (`/labs/<slug>`), the home grid, and code-splitting all derive from the registry. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/GUIDELINES.md](docs/GUIDELINES.md) before building your first lab.

## Docs

| Document                                | What it answers                                                    |
| --------------------------------------- | ------------------------------------------------------------------ |
| [OVERVIEW.md](docs/OVERVIEW.md)         | What this is, why it exists, what's shipped, what a lab must clear |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | How the code is organized and how it scales to 100+ labs           |
| [GUIDELINES.md](docs/GUIDELINES.md)     | How every lab must look, move, and behave                          |

## Scripts

| Command                | Purpose                                                     |
| ---------------------- | ----------------------------------------------------------- |
| `npm run dev`          | Dev server with HMR                                         |
| `npm run build`        | Type-check, production build, and a page per route          |
| `npm run typecheck`    | Type-check only                                             |
| `npm run lint`         | ESLint, no warnings allowed                                 |
| `npm test`             | Vitest, once                                                |
| `npm run format`       | Prettier over `src/`                                        |
| `npm run format:check` | Prettier, checking only                                     |
| `npm run size`         | Gzipped sizes against the budget in `tools/bundle-size.mjs` |

## Analytics

Visits are counted with [Umami](https://cloud.umami.is): no cookies and no
personal data. Only `labs.hacettepeaiclub.com` is counted, so dev servers,
previews and forks are not, and browsers that send Do Not Track are skipped.
Beyond page views, the site sends a few named events
([`src/app/analytics.ts`](src/app/analytics.ts)):

| Event                                    | Properties                 | What it answers                                     |
| ---------------------------------------- | -------------------------- | --------------------------------------------------- |
| `lab_open`                               | `lab`, `from`              | Which labs are opened, and from where               |
| `lab_end`                                | `lab`                      | How many people read a lab to the end               |
| `finder_open`                            | `via`                      | Whether the ⌘K finder is used, by key or button     |
| `finder_empty`                           | `query`                    | What visitors search for that the collection lacks  |
| `filter`                                 | `field`                    | Which fields people browse                          |
| `game_start`, `game_stop`, `game_finish` | `seconds`, `best` (finish) | Whether the game in the mark is played and finished |
| `language`, `theme`                      | `to`                       | Which preferences people change                     |

`from` is one of `grid`, `continue`, `finder`, `next`, `game`, `link` or
`direct`. Comparing `lab_end` with `lab_open` for the same lab gives its
completion rate.

## Checks

Every pull request runs typecheck, lint, format check, tests, the build and
the size budget ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)). A
push to `main` runs the same checks and deploys only if they pass. Run them
locally before pushing; `npm run size` prints the table CI uses.
