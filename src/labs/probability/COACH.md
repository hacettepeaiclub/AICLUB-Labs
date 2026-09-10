# The probability coach, and where an LLM could go

## What is built

`components/Framing.tsx` exports `Coach`: three questions per experiment,
written in the words a beginner uses ("Two doors are left. Why isn't it
50/50?"), each opening to a written answer. It ships in EN and TR.

No model is involved. The answers are prose in the dictionary, and every
**number** inside one is passed in by the stage from the same engine call that
drew the screen:

| Experiment  | Value in the answer                    | Where it comes from                     |
| ----------- | -------------------------------------- | --------------------------------------- |
| Monty Hall  | 33.3% / 66.7%                          | `THEORETICAL.stay` / `.switch`          |
| Birthday    | the pair count at the 50% threshold    | `pairCount(firstAbove(0.5))`            |
| Conditional | the probability given "at least one"   | `analyse("atLeastOneBoy").probability`  |
| Simpson     | none — the answer is structural        | —                                       |

`lab.test.ts` pins this: `Framing.tsx` may not contain `Math.`, `probability`,
`simulate` or an engine import, and each stage's `coach` array must be built
from the engine call named above. A coach answer therefore cannot drift from
the number printed beside it, because it *is* that number.

## Why no live model, for now

A real LLM helper needs a key. A key in the frontend bundle is a published
key — it would be extractable from the JS by anyone who opened devtools, and
billable by anyone who found it. There is no backend in this project: the site
is a static Vite build served as files. So a live model means new
infrastructure, and the brief was explicit that infrastructure should not be
added unless genuinely necessary. It is not necessary to answer "why isn't it
50/50?", which has the same answer every time it is asked.

## If it is added later

The rule that must survive is the one already enforced above: **the engines
own the numbers.** A model that answers "so what are the odds?" with its own
arithmetic creates a second source of truth for a quantity the page is already
displaying, and the visitor has no way to tell which one is the lab's.

A design that keeps the guarantee:

1. **A serverless function** (Vercel/Netlify/Cloudflare) holds the API key.
   The browser never sees it. This is the only new infrastructure required.
2. **The client sends state, not questions alone.** The current experiment,
   the visitor's parameters, and the values the engines just produced, as a
   small typed payload — the same objects the stage rendered from.
3. **The system prompt forbids arithmetic.** The model explains, paraphrases,
   analogises and answers "why"; every numeral it may use is supplied in the
   payload, and it is told to use those and compute nothing.
4. **The response is checked before it renders.** Extract the numerals from
   the reply; if any is not in the payload, drop the reply and fall back to the
   written answer for that question. This is cheap, deterministic, and it turns
   the guarantee from a prompt-instruction (a request) into a property of the
   client (a rule).
5. **The written answers stay** as the offline path and the fallback. A lab
   that stops explaining anything when a third-party API is slow, rate-limited,
   or down is worse than one that never called it.
6. **Streaming, and a strict token cap.** These answers are three sentences.

What that buys over what exists: a visitor could ask in their own words, and
follow up. What it costs: a deployment target, a key to rotate, a per-question
bill, latency on a page that currently has none, and a new failure mode in a
lab whose whole claim is that you can check every number on screen.

Worth doing when somebody asks a question the three written answers do not
cover. Not before.
