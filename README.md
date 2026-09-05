# AI Club Labs

Premium interactive experiences that teach Computer Science and AI — inspired by the craft of Neal.fun, Linear, and Stripe. Not a clone: every lab is an original experiment where you learn by pulling levers.

**New here? Start with [docs/OVERVIEW.md](docs/OVERVIEW.md)** — what we're building, why, and the bar a lab has to clear.

## Stack

React 18 · TypeScript (strict) · Vite · Tailwind CSS · Framer Motion · SVG / Canvas

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

| Command             | Purpose                       |
| ------------------- | ----------------------------- |
| `npm run dev`       | Dev server with HMR           |
| `npm run build`     | Type-check + production build |
| `npm run typecheck` | Type-check only               |
| `npm run format`    | Prettier over `src/`          |
