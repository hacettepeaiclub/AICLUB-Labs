# Design & Interaction Guidelines

Every lab must feel like it belongs to the same product. These rules are how.

## Design principles

1. **The interaction IS the lesson.** If removing the interactivity loses nothing, the lab isn't ready. Aim for an "aha" within 10 seconds of the first input.
2. **One idea per lab.** A lab teaches exactly one concept. Depth comes from parameters, not from more concepts.
3. **Direct manipulation over configuration.** Prefer dragging a data point over typing its value; prefer scrubbing over play-only.
4. **Show, then name.** Let the visitor feel the behavior first; introduce terminology after they've seen it.
5. **Calm luxury.** Dark surfaces, restrained accent color, generous whitespace. The simulation is the loudest thing on the page — the chrome never competes.

## Color

- Page background `ink-950`, panels `ink-800`, hover `ink-700`. Text `fg` / `fg-muted` / `fg-faint`.
- Accent (violet) is for: primary actions, the "current focus" of a simulation, links. Never for large fills.
- `signal-*` colors are categorical: lab categories, data series, algorithm states (comparing = amber, sorted = green, active = accent…). Use them consistently within a lab.
- Never hardcode a hex value. DOM → Tailwind classes; canvas/SVG-in-JS → `color()` from `design/tokens.ts`.

## Typography

- `font-display` (Sora) for `display-*` and `title` sizes only. `font-body` (Inter) for everything else. `font-mono` for numbers that update live, code, and keyboard hints.
- Use the named scale (`text-display-xl` … `text-overline`) — never arbitrary sizes.
- Line length for prose ≤ `max-w-prose` (65ch).

## Spacing

- Everything sits on the 4px grid (Tailwind defaults). Component-internal gaps: 2–6 units. Between components: 8–16. Between page sections: `py-section` (fluid 64–128px).
- When unsure, add more space, not less.

## Motion

- Import everything from `design/motion.ts` — never inline duration/easing literals.
- UI chrome: ≤ 450ms, `ease.out` or `spring.snappy`. Entrances: `fadeUp` + `staggerChildren`. Hover states must respond within 150ms.
- Simulations run on `useRafLoop` / `useCanvas2D` with framerate-independent math (`damp`, `dt`-scaled steps) — never `setInterval` for animation.
- **Reduced motion is non-negotiable:** every entrance uses `fadeUp(reduced)`; autoplaying simulations start paused when `useReducedMotion()` is true and offer a manual play button. CSS animations are globally clamped in `globals.css`.
- Motion communicates causality: when the user changes a parameter, the thing that changed is what animates.

## Interaction

- Every simulation control set includes: play/pause, reset (re-seeds to the same seed by default), and speed where relevant.
- Keyboard: `Space` play/pause, `R` reset — bind via `useKeyPress`, advertise with `<Kbd>`. Never intercept modifier combinations.
- All interactive targets ≥ 40×40px on touch. Sliders use `LabSlider`; grouped controls use `ControlPanel`.
- State the user created is precious: persist meaningful progress with `useLocalStorage` (`acl:<slug>:<name>`).
- Simulations must be reproducible: seed randomness with `lib/random.ts` so "reset" tells the same story twice.

## Accessibility

- Semantic HTML first; ARIA only to fill gaps. One `h1` per page (LabShell provides it).
- Every interactive element is reachable and operable by keyboard; focus styles come from the global `:focus-visible` ring — never disable them.
- Canvas/SVG visualizations get a text alternative: `role="img"` + `aria-label` describing the current state, or an adjacent live region (`aria-live="polite"`) summarizing what's happening.
- Never encode information in color alone — pair with shape, label, or position.
- Contrast: body text ≥ 4.5:1, large text ≥ 3:1 (the token palette already satisfies this on `ink-*` surfaces).
- Announce async results (e.g. "sorted in 214 comparisons") in a live region.

## Performance

- 60fps is a feature. Keep per-frame allocation near zero; reuse arrays/objects in engines.
- React state changes at most a few times per second during simulation; per-frame data lives in refs or the engine, drawn imperatively.
- Each lab chunk ≤ ~150KB gzipped; heavy datasets load on demand.

## Assets

- Shared assets in `src/assets/` (fonts, brand). Lab-specific assets inside the lab's folder.
- Prefer code-drawn (SVG/canvas) visuals over image files. Images that do exist: compressed, with width/height set, `alt` text mandatory.
- Fonts self-hosted with `font-display: swap`.
