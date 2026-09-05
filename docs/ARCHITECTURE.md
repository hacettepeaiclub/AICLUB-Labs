# Architecture

## Folder structure

```
src/
├── main.tsx              Entry point
├── App.tsx               Router + page transitions
├── styles/
│   └── globals.css       Design tokens (CSS variables) + base styles
├── design/
│   ├── motion.ts         Shared animation system (durations, easings, springs, variants)
│   └── tokens.ts         TS mirror of tokens for canvas/SVG-in-JS only
├── lib/                  Pure utilities — no React, no side effects
│   ├── cn.ts             Class-name merge
│   ├── math.ts           clamp / lerp / remap / damp
│   ├── random.ts         Seedable PRNG (reproducible simulations)
│   └── format.ts         Number / duration formatting
├── hooks/                Reusable React hooks (rAF loop, canvas, sizes, storage, keys)
├── components/
│   ├── ui/               Generic primitives (Button, Badge, Kbd, LabCard)
│   ├── layout/           Site chrome (SiteHeader, SiteFooter, PageShell)
│   └── lab/              Experiment scaffolding (LabShell, ControlPanel, LabSlider)
├── pages/                Route-level components (HomePage, LabPage, NotFoundPage)
├── labs/                 THE EXPERIMENTS
│   ├── types.ts          LabMeta, categories, difficulty
│   ├── registry.ts       Central registry — the only file that knows all labs
│   └── <slug>/           One folder per experiment
│       ├── meta.ts       Static metadata (loaded eagerly, tiny)
│       ├── index.tsx     Lab component (loaded lazily, its own chunk)
│       ├── engine.ts     Pure simulation logic (optional, testable)
│       └── components/   Lab-private components (optional)
└── assets/               Shared static assets (fonts, og images)
```

## How it scales to 100+ experiments

- **Registry pattern.** `labs/registry.ts` is an array of `{ meta, Component }`. Metadata is eager (a few hundred bytes per lab, so the home grid renders instantly); components are `React.lazy`, so each lab ships as its own chunk and is downloaded only when opened.
- **One-line registration.** Adding a lab touches exactly one shared file. No route edits, no grid edits, no chunk config.
- **Isolation.** A lab may import from `lib/`, `hooks/`, `components/`, `design/` — never from another lab. Shared logic gets promoted into `lib/` or `hooks/` deliberately, not copy-pasted sideways.
- **Separation of simulation and presentation.** Complex labs keep their logic in a pure `engine.ts` (plain TypeScript, seedable via `lib/random.ts`). The React component owns only rendering and input. This keeps engines unit-testable and 60fps loops free of React re-renders.
- **Vendor chunk stability.** `vite.config.ts` pins react/framer-motion into stable chunks so shipping lab #57 doesn't bust the cache for the other 56.

## Rendering strategy per lab

| Content                       | Use                                    |
| ----------------------------- | -------------------------------------- |
| UI, controls, text            | DOM + Tailwind + Framer Motion         |
| Diagrams, < ~500 shapes       | SVG (accessible, crisp, animatable)    |
| Particles, > ~500 shapes, pixels | Canvas via `useCanvas2D`            |

Start with SVG; drop to canvas only when profiling says so.

## Naming conventions

- **Files:** Components `PascalCase.tsx`; hooks `useThing.ts`; everything else `camelCase.ts`; lab folders `kebab-case` matching their slug.
- **Components:** Named exports everywhere except lab entry points, which default-export (required by `React.lazy`).
- **Hooks:** `use` + noun/verb (`useRafLoop`, `useElementSize`).
- **Booleans:** `is/has/can/should` prefixes. Event props `onX`, handlers `handleX`.
- **Slugs & storage keys:** kebab-case; localStorage keys are `acl:<slug>:<name>`.
- **CSS:** Tailwind utilities only; no inline hex colors — tokens come from `globals.css` / `tokens.ts`.

## Code style

- TypeScript `strict` + `noUncheckedIndexedAccess`; no `any`, no non-null assertions without a comment justifying them.
- Prettier is the formatter (config committed); don't hand-format.
- Props interfaces are exported and named `<Component>Props`.
- Pure logic lives in `lib/` or a lab's `engine.ts` — if it doesn't need React, it doesn't import React.
- Comments explain constraints and intent, not mechanics.
