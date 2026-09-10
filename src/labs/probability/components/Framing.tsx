/**
 * The two things a beginner needs around an experiment: the situation before
 * it starts, and an answer to "why" after it surprises them.
 *
 * Both are local to this lab and should stay local. They are not a teaching
 * framework; they are the smallest amount of scaffolding that lets somebody
 * who has never studied probability play with a Monty Hall stage without
 * first being told what a conditional probability is.
 */

export interface SetupProps {
  /** Two to four short lines. Each is one fact about the situation. */
  rules: readonly string[];
}

/**
 * The situation, stated before anything is asked.
 *
 * Every one of these experiments was previously introduced by a paragraph
 * that named its result — "the answer is not 1/2", "Simpson's paradox" — which
 * is the wrong order: it turns a game into a lesson before the visitor has
 * touched it. This states only the rules of play, in the fewest words that
 * make the game unambiguous, so the first surprise is theirs rather than the
 * lede's.
 *
 * Deliberately not a card and not an "info" callout: a plain list on the
 * page's own ground, no icon, no colour of its own.
 */
export function Setup({ rules }: SetupProps) {
  return (
    <ul className="mb-5 max-w-prose space-y-1.5">
      {rules.map((rule) => (
        <li key={rule} className="flex gap-2.5 text-body-sm text-fg-muted">
          {/* A rule, not a bullet point of prose: the marker is a rule number's
              worth of ink and nothing more. */}
          <span aria-hidden className="mt-2 h-px w-3 shrink-0 bg-line/30" />
          <span className="min-w-0">{rule}</span>
        </li>
      ))}
    </ul>
  );
}

export interface CoachQuestion {
  /** The question in the visitor's words, not the textbook's. */
  readonly q: string;
  /** The answer. Any number in it comes from the experiment's own engine. */
  readonly a: string;
}

export interface CoachProps {
  label: string;
  questions: readonly CoachQuestion[];
}

/**
 * The questions a beginner actually asks, answered where they are asked.
 *
 * ## Why this is not a chatbot
 *
 * It could have been, and the reason it is not is architectural rather than
 * aesthetic. Every number in this lab is produced by a deterministic engine
 * that a test can pin; a language model asked "why isn't it 50/50?" would
 * produce a number too, and there would then be two sources of truth for the
 * same quantity with no way for the page to tell which one the visitor
 * believed. The engines stay the only source of numbers.
 *
 * So the answers here are written, and the values inside them are passed in by
 * the stage from the same engine call that drew the screen. They cannot drift
 * from what is displayed, because they are what is displayed.
 *
 * `REPORT.md` in this folder records what a server-side model could add on top
 * of this without taking that guarantee away.
 *
 * ## Why <details>
 *
 * The answer is hidden until asked for, which is the point — an explanation
 * you read before you are curious is prose. The browser's own disclosure gives
 * the keyboard and screen-reader behaviour for free.
 */
export function Coach({ label, questions }: CoachProps) {
  return (
    <section aria-label={label} className="mt-6 max-w-prose">
      <h3 className="text-overline uppercase text-fg-faint">{label}</h3>
      <div className="mt-2 divide-y divide-line/10 border-y border-line/10">
        {questions.map((item) => (
          <details key={item.q} className="group">
            <summary
              className="flex min-h-11 cursor-pointer select-none items-center justify-between gap-3
                text-body-sm text-fg-muted transition-colors duration-fast hover:text-fg
                focus-visible:text-fg"
            >
              {item.q}
              <span aria-hidden className="shrink-0 text-fg-faint group-open:hidden">
                +
              </span>
              <span aria-hidden className="hidden shrink-0 text-fg-faint group-open:inline">
                −
              </span>
            </summary>
            <p className="pb-3 text-body-sm text-fg-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
