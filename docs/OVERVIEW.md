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

Two labs, covering two of the six categories.

| Lab                                                 | Category        | Difficulty   | Time  | Shipped    |
| --------------------------------------------------- | --------------- | ------------ | ----- | ---------- |
| [Hash Playground](../src/labs/hash-playground/)     | Systems         | intro        | 3 min | 2026-07-22 |
| [Neural Playground](../src/labs/neural-playground/) | Neural networks | intermediate | 6 min | 2026-09-04 |

### Hash Playground — "Change one character. Watch everything change."

Teaches the **avalanche effect** and the four defining properties of a
cryptographic hash.

The whole experience derives from a single piece of state: the string in the
input box. Every section below it is a different view of the current digest, the
previous digest, and the difference between them.

- Real SHA-256 via the Web Crypto API — not a simulation of one.
- The digest as a **16×16 grid of 256 bits**. Flipped bits pulse in a ripple that
  spreads from the centroid of the change, so every edit reads as an impact.
- A **collision challenge** that invites you to find two inputs with the same hash,
  scoring your longest matching prefix. Each additional matching character is 16×
  less likely — the challenge is a probability lesson disguised as a game, and
  losing it is the point.

### Neural Playground — "Draw two kinds of dots. Watch a network learn to tell them apart."

Teaches how a neural network actually learns: forward pass, loss,
backpropagation, gradient descent.

The engine is a multi-layer perceptron written from scratch in plain TypeScript
([`engine.ts`](../src/labs/neural-playground/engine.ts)) — flat `Float64Array`
weights, hand-written backprop, mini-batch SGD, every buffer allocated once so a
training frame allocates nothing. Every visual on the page reads from that one
engine, so nothing on screen can drift from the mathematics it claims to explain.

Seven sections, ordered deliberately — watch a whole network learn first, then
take it apart:

1. **The playground.** A network trains in real time against points you can draw on
   the canvas yourself. Live decision boundary, four datasets, adjustable depth,
   width, activation, learning rate and regularization.
2. **The network diagram.** Each node is a live thumbnail of _that neuron's own_
   response across the input square, so you can watch simple stripes in the first
   hidden layer get folded into the final shape at the output. All thumbnails share
   one grid sweep and land on one canvas.
3. **One neuron.** Three sliders and a squash — and the discovery that no
   combination of them ever bends the line.
4. **Why layers.** XOR, run side by side: no hidden layer plateaus near a coin flip
   (~61%), one hidden layer reaches 100%. Same data, same learning rate, same
   epochs. The single cleanest demonstration in the subject, so the lab lets you
   run it rather than asserting it.
5. **Gradient descent.** A ball on a bumpy loss curve, with a tangent line showing
   the only information each step actually gets. Too small a learning rate crawls;
   too large overshoots; neither ever sees the whole landscape.
6. **The challenge.** Beat the spiral using as few hidden neurons as you can.
7. **Recap.**

The spiral's difficulty is **calibrated, not guessed**. Its angular sweep (7.2 rad)
was tuned by measurement so the frontier lands where the lesson is: six neurons
fail, eight barely pass, and — the payoff — **two layers of four beat one layer of
eight at the same neuron budget**. Depth beats width, and the challenge is
structured so you discover that rather than read it.

---

## 5. How the platform delivers it

Full detail in [ARCHITECTURE.md](ARCHITECTURE.md). The three decisions that matter
most to the mission:

**Registry pattern.** Metadata is eager and tiny; components are `React.lazy`. The
home grid renders instantly at any catalogue size, and opening lab #57 downloads
only lab #57.

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

These are measured, not aspirational. Current numbers from `npm run build`:

| Chunk                  | Raw      | Gzipped     |
| ---------------------- | -------- | ----------- |
| Hash Playground        | 29.6 KB  | **9.9 KB**  |
| Neural Playground      | 41.5 KB  | **14.5 KB** |
| App shell              | 31.7 KB  | 11.0 KB     |
| Vendor: react + router | 163.5 KB | 53.4 KB     |
| Vendor: framer-motion  | 120.0 KB | 40.2 KB     |

Both labs sit at roughly **10% of the 150 KB per-lab budget**, which is the
headroom we want before the catalogue grows. Vendor chunks are pinned separately
in `vite.config.ts`, so shipping lab #57 does not invalidate the framework bundle
for the other 56.

Also standing:

- **TypeScript `strict` + `noUncheckedIndexedAccess`.** No `any`. No non-null
  assertion without a comment justifying it.
- **60fps is a feature.** Per-frame data lives in refs and engines and is drawn
  imperatively; React state changes at most a few times per second during a
  simulation.
- **Views that hold a still image don't burn frames.** Paused canvases skip their
  work until something actually changes.
- **Accessibility is not a later pass.** Focus rings are never disabled, every
  canvas has a text alternative, and async results are announced in a live region.

---

## 8. What's next

Two of six categories are covered. **Nothing below is committed** — it is a
candidate list, recorded so the next session starts with options rather than a
blank page.

| Candidate                   | Category         | The idea it would have to earn                                                    |
| --------------------------- | ---------------- | --------------------------------------------------------------------------------- |
| Sorting Race                | Algorithms       | Four algorithms on one array, comparison and swap counters running live.          |
| Pathfinding                 | Algorithms       | Draw walls, then watch BFS / Dijkstra / A\* spread. Heuristic weight on a slider. |
| Big-O Sandbox               | Theory           | Drag the input size; measure real running time and watch it fit the curve.        |
| Data structure visualizer   | Data structures  | Insert and delete on a tree or a hash table; watch the structure rebalance.       |
| Tokenizer / embedding space | Machine learning | Type a sentence, see it split and placed.                                         |

Selection criteria, in order: does it pass the "interaction IS the lesson" test;
does it fill an uncovered category; can it reach its aha in under ten seconds.

---

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
