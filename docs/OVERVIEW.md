# AI Club Labs — Overview

> The what and the why. [ARCHITECTURE.md](ARCHITECTURE.md) covers how the code is
> organized; [GUIDELINES.md](GUIDELINES.md) covers how it should look and feel.
> This document is the one that says what we are actually trying to do.

---

## 1. The thesis

**Computer science is taught as description. It should be taught as behavior.**

A textbook can tell you that a hash function has the avalanche property. A lecture
can tell you that a single neuron can only draw a straight line. Both statements
are true, both are forgettable, and neither survives contact with an exam three
weeks later — because the reader was never in a position to _disbelieve_ them.

AI Club Labs builds the other thing: small, self-contained experiments where the
claim is something you do rather than something you are told. You type a
character and watch 128 bits flip. You drag a weight slider to its limit and
discover that the boundary stays straight no matter what you do. The
understanding arrives as a consequence of your own action, which is the only kind
that sticks.

Every lab is an original experiment. We take craft cues from Neal.fun, Linear,
and Stripe — density of ideas, restraint in chrome, motion that means something —
but we are not cloning anyone's work.

---

## 2. Why this exists

The default ways to learn these ideas each fail in a specific way:

| Format                 | What it gets right      | Where it fails                                                                                |
| ---------------------- | ----------------------- | --------------------------------------------------------------------------------------------- |
| Lectures and textbooks | Precision, completeness | Passive. Nothing you did produced the result, so nothing anchors it.                          |
| Video explainers       | Pacing, narrative       | You watch someone else have the insight. The lever is in their hand.                          |
| Coding exercises       | Genuine agency          | The learning is dominated by syntax and tooling; the _idea_ is the smallest part of the hour. |
| Existing playgrounds   | Real interactivity      | Usually one-off. No shared language, no design system, no path from one idea to the next.     |

The gap we are aiming at is the fourth row. Interactive explanations exist and
some are excellent. What barely exists is a _coherent body_ of them — dozens of
experiments that feel like one product, share one visual language, and can be
built by different people without the collection turning into a junk drawer.

That is a design and architecture problem as much as a teaching one, which is why
this repo has an opinionated design system and a registry pattern before it has
its tenth lab.

---

## 3. What a lab is

A lab is the unit of work: one folder, one idea, one page, its own route and its
own JavaScript chunk.

### The non-negotiable rule

> **The interaction IS the lesson.**
> If you can remove the interactivity and lose nothing, the lab isn't ready.

This is the rule that does the most work, and it is stricter than it sounds. An
animation that plays on scroll is not an interaction. A slider that changes a
number in a paragraph is not an interaction. The test is whether the visitor can
_ask a question the author didn't anticipate_ and get a truthful answer from the
simulation.

### The bar a lab must clear before it ships

- [ ] **One idea.** Depth comes from parameters, not from a second concept.
- [ ] **Aha within ~10 seconds** of the first input.
- [ ] **Direct manipulation** over configuration — drag the point, don't type its coordinates.
- [ ] **Show, then name.** The visitor feels the behavior before meeting the terminology.
- [ ] **Honest mechanism.** The visualization reads from the real computation, never from a
      pre-baked animation of what the computation would have done.
- [ ] **Reproducible.** Randomness is seeded (`lib/random.ts`), so "reset" tells the same
      story twice and two people can compare the same run.
- [ ] **Reduced-motion complete**, not merely tolerable: autoplay starts paused, and there is a
      manual way to advance.
- [ ] **Keyboard operable**, with a text alternative for every canvas and SVG.
- [ ] **60fps**, with per-frame allocation near zero.
- [ ] **Under budget**: ≤ ~150 KB gzipped for the lab's chunk.

### Anatomy

```
src/labs/<slug>/
├── meta.ts        Title, category, difficulty, minutes  (eager — a few hundred bytes)
├── index.tsx      The lab component                     (lazy — its own chunk)
├── engine.ts      Pure simulation logic, no React       (optional, testable)
└── components/    Lab-private components                (optional)
```

Registering it is one line in [`src/labs/registry.ts`](../src/labs/registry.ts).
Routing, the home grid, and code-splitting all derive from that array — there is
no second place to update, which is the property that has to hold if this is
going to reach a hundred labs without collapsing.

---

## 4. What's shipped

Twelve labs across five of the six categories, listed in the order the home
page reads them (`LAB_ORDER` in [`registry.ts`](../src/labs/registry.ts)): what a
function does to its input, how a number is stored, what an algorithm costs,
how a search explores, how text is cut up — and then the machine learning that
stands on all of it.

| Lab                                                       | Category         | Difficulty   | Time   | Shipped    |
| --------------------------------------------------------- | ---------------- | ------------ | ------ | ---------- |
| [Hash Playground](../src/labs/hash-playground/)           | Systems          | intro        | 3 min  | 2026-07-22 |
| [Floating Point](../src/labs/floating-point/)             | Systems          | intermediate | 8 min  | 2026-10-02 |
| [Sorting Race](../src/labs/sorting-race/)                 | Algorithms       | intermediate | 6 min  | 2026-09-06 |
| [Pathfinding](../src/labs/pathfinding/)                   | Algorithms       | intermediate | 6 min  | 2026-09-05 |
| [Tokenizer Lab](../src/labs/tokenizer/)                   | Machine learning | intermediate | 8 min  | 2026-09-07 |
| [Gradient Descent](../src/labs/gradient-descent/)         | Machine learning | intermediate | 7 min  | 2026-09-06 |
| [Neural Playground](../src/labs/neural-playground/)       | Neural networks  | intermediate | 6 min  | 2026-09-04 |
| [Attention Playground](../src/labs/attention/)            | Machine learning | intro        | 5 min  | 2026-09-07 |
| [Reward Playground](../src/labs/reward-playground/)       | Machine learning | intro        | 6 min  | 2026-09-08 |
| [Embedding Universe](../src/labs/embedding-universe/)     | Machine learning | intermediate | 6 min  | 2026-09-10 |
| [Hypothesis Testing](../src/labs/hypothesis-testing/)     | Theory           | intermediate | 7 min  | 2026-09-11 |
| [Probability Lab](../src/labs/probability/)               | Theory           | intro        | 12 min | 2026-09-12 |

A thirteenth, `embedding-universe-3d`, is a draft: routable by link, kept off
the grid, and marked `noindex`.

Every lab cites what its theory rests on in a Sources section at the bottom of
its page. The bibliography is one file,
[`labs/sources.ts`](../src/labs/sources.ts), and every DOI, year and venue in it
was read from the DOI registry, the arXiv API or the publication itself, then
pinned by a test so a later edit cannot quietly break a citation.

### Two worth reading as examples

**Neural Playground** — the engine is a multi-layer perceptron written from
scratch ([`engine.ts`](../src/labs/neural-playground/engine.ts)), with every
buffer allocated once so a training frame allocates nothing. Its spiral
challenge is calibrated, not guessed: six neurons fail, eight barely pass, and
two layers of four beat one layer of eight at the same neuron budget, so depth
beating width is something the visitor finds rather than reads.

**Floating Point** — every value on the page is exact. The engine
([`engine.ts`](../src/labs/floating-point/engine.ts)) never uses a float: it
computes with BigInt rationals and rounds once, to nearest with ties to even,
for float64, float32, float16, bfloat16 and toy formats alike. Its tests hold
it to the browser value for value — `parseFloat`, `String(n)`, `Math.fround`,
and V8's `Math.f16round` — and pin each fact the page states, down to the
detail that the exact sum of the stored 0.1 and 0.2 lands precisely halfway
between two doubles, a tie that ties-to-even sends one step past 0.3.

## 5. How the platform delivers it

Full detail in [ARCHITECTURE.md](ARCHITECTURE.md). The three decisions that matter
most to the mission:

**Registry pattern.** Metadata is eager and tiny; components are `React.lazy`. The
home grid renders instantly at any catalogue size, and opening lab #57 downloads
lab #57 — plus, the first time any lab is opened, the collection's prose in the
visitor's language.

**Simulation separated from presentation.** Complex labs keep their logic in a pure
`engine.ts` with no React import. This keeps engines unit-testable, keeps 60fps
loops free of re-renders, and — most importantly for a teaching product — makes it
possible to _verify the thing being taught is true_ independently of how it's drawn.

**Isolation.** A lab may import from `lib/`, `hooks/`, `components/`, `design/` —
never from another lab. Shared logic is promoted deliberately, not copy-pasted
sideways. This is what keeps lab #40 from breaking lab #12.

---

## 6. The design language

Full detail in [GUIDELINES.md](GUIDELINES.md). In one line: **calm luxury — the
simulation is the loudest thing on the page, and the chrome never competes.**

- Dark surfaces (`ink-*`), restrained navy blue accent, generous whitespace.
- The accent color marks primary actions and the current focus of a simulation —
  never large fills. `signal-*` colors are categorical and used consistently
  _within_ a lab (comparing = amber, sorted = green, active = accent).
- Never a hardcoded hex. DOM uses Tailwind classes; canvas and SVG-in-JS use
  `color()` from `design/tokens.ts`. Both read the same CSS custom properties, so
  a chip in the legend and a pixel on the canvas cannot disagree.
- All motion comes from `design/motion.ts`. No inline duration or easing literals.
  Motion communicates causality: when you change a parameter, the thing that
  changed is what animates.
- Information is never encoded in color alone — always paired with shape, label,
  or position. (In Neural Playground: class A is a circle, class B is a square.)

---

## 7. Engineering commitments

These are measured, not aspirational. Numbers from `npm run build`:

| Chunk                                   | Raw      | Gzipped     |
| --------------------------------------- | -------- | ----------- |
| App shell (entry)                       | 86.1 KB  | **31.3 KB** |
| Vendor: react + router                  | 159.8 KB | 52.2 KB     |
| Lab prose, English (loaded with a lab)  | 117.8 KB | 40.9 KB     |
| Lab prose, Turkish (loaded with a lab)  | 126.9 KB | 44.1 KB     |
| Largest lab: Probability (with physics) | 129.3 KB | **40.3 KB** |
| Floating Point                          | 39.3 KB  | 12.6 KB     |
| Smallest lab: Hash Playground           | 13.2 KB  | 4.4 KB      |

First-load JavaScript is about 83 KB gzipped: the shell and React, nothing else.
No animation library ships at all — page and banner motion is CSS — and the
teaching prose for every lab is its own chunk, fetched with the first lab
rather than with the home page. The largest lab sits at about a quarter of the
150 KB per-lab budget; most are under a tenth.

Also standing:

- **TypeScript `strict` + `noUncheckedIndexedAccess`.** No `any`. No non-null
  assertion without a comment justifying it.
- **60fps is a feature.** Per-frame data lives in refs and engines and is drawn
  imperatively; React state changes at most a few times per second during a
  simulation.
- **Views that hold a still image don't burn frames.** Paused canvases skip their
  work until something actually changes.
- **Every canvas is cleared in device pixels** (`lib/canvas.ts`), because on a
  fractional screen density a clear in CSS pixels leaves the last column
  standing.
- **Accessibility is not a later pass.** Focus rings are never disabled, every
  canvas has a text alternative, and async results are announced in a live region.
- **Every page has its own head.** `tools/prerender.mjs` writes one HTML file per
  route with its title, description, canonical URL and link-preview card, so a
  lab shared in a group chat shows what it is. See `docs/DEPLOY.md`.

## 8. What's next

**Nothing below is committed** — it is a candidate list, so the next session
starts with options rather than a blank page. Selection criteria, in order:
does it pass the "interaction IS the lesson" test; does it fill a thin or empty
category; can it reach its aha in under ten seconds.

| Candidate            | Category         | The idea it would have to earn                                                                     |
| -------------------- | ---------------- | -------------------------------------------------------------------------------------------------- |
| Race Condition       | Systems          | You are the scheduler: step two threads through `counter++` and lose an update with your own hand. |
| Cache Locality       | Systems          | Same sum, same work, rows against columns — 17× apart when measured, and then on your own CPU.     |
| Convolution Lab      | Neural networks  | Draw a stroke, edit a 3×3 kernel, and watch one set of weights detect it anywhere it moves.        |
| Sum of Hinges        | Neural networks  | Fit a curve with ReLUs and see each neuron add exactly one bend.                                   |
| Backprop by Hand     | Neural networks  | Nudge a weight by ε and watch the loss move by exactly gradient × ε.                               |
| Hash Table           | Data structures  | Push the load factor towards 1 and watch probe lengths explode. The category has no lab yet.       |

## 9. Contributing a lab

1. Read [GUIDELINES.md](GUIDELINES.md) first. It is short, and it is the difference
   between a lab that belongs here and one that merely works.
2. Create `src/labs/<slug>/` with `meta.ts` and `index.tsx`. Put simulation logic in
   `engine.ts` if it is non-trivial — and if it doesn't need React, it must not
   import React.
3. Register one line in `src/labs/registry.ts`.
4. Verify the claim, not just the render. If your lab asserts that X beats Y, run
   the engine headlessly and confirm it does. A teaching product that teaches
   something false is worse than no product.
5. Run `npm run typecheck`, `npm run format`, and `npm run build`, and check your
   chunk against the budget.
6. Walk the bar in §3 as an actual checklist before calling it done.
