import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { labs, orderedLabs, publishedLabs } from "../registry";
import { en } from "@/i18n/en";
import { tr } from "@/i18n/tr";
import { probabilityMeta } from "./meta";
import { THEORETICAL, simulate as montySimulate } from "./engine/montyHall";
import { firstAbove, sharedProbability } from "./engine/birthday";
import { analyse } from "./engine/conditional";
import { build, published } from "./engine/simpson";
import { COLUMNS, dayLabel, percent, ratio, seatOf } from "./view";

const DIR = "src/labs/probability/";
const COMPONENTS = [
  "index.tsx",
  "components/MontyStage.tsx",
  "components/BirthdayStage.tsx",
  "components/ConditionalStage.tsx",
  "components/SimpsonStage.tsx",
  "components/Prediction.tsx",
  "components/Framing.tsx",
];
const read = (path: string) => readFileSync(DIR + path, "utf8");
const stripComments = (text: string) =>
  text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");

/** A word-boundary regex built from a char code: an escape written as `\b`
 *  does not always survive whatever wrote this file, and a regex holding a
 *  control character matches nothing and passes for free. */
const B = String.fromCharCode(92) + "b";
const word = (text: string, flags = "") => new RegExp(B + text + B, flags);

// ============================================================== registry ===

describe("registry", () => {
  it("registers the lab exactly once, under the right slug", () => {
    expect(probabilityMeta.slug).toBe("probability");
    expect(labs.filter((lab) => lab.meta.slug === "probability")).toHaveLength(1);
    expect(publishedLabs().map((lab) => lab.meta.slug)).toContain("probability");
  });

  it("sits at the end of the collection", () => {
    const order = orderedLabs().map((lab) => lab.meta.slug);
    expect(order[order.length - 1]).toBe("probability");
  });

  it("declares a theory lab with a duration", () => {
    expect(probabilityMeta.category).toBe("theory");
    expect(probabilityMeta.minutes).toBeGreaterThan(0);
    expect(probabilityMeta.description.length).toBeGreaterThan(20);
  });

  it("has a drawing of its own on the home page", () => {
    expect(readFileSync("src/components/home/LabSignature.tsx", "utf8")).toMatch(
      /case "probability":/,
    );
  });

  it("never calls itself a playground", () => {
    // The name was chosen against that word; the check keeps it chosen.
    for (const dict of [en, tr]) {
      const copy = dict.labs.probability;
      expect(copy.title.toLowerCase()).not.toContain("playground");
      expect(copy.description.toLowerCase()).not.toContain("playground");
    }
    expect(probabilityMeta.title).toBe("Probability Lab");
    expect(probabilityMeta.title.toLowerCase()).not.toContain("playground");
  });
});

// ================================================================== copy ===

describe("copy", () => {
  it("exists in both languages with four recap points", () => {
    for (const dict of [en, tr]) {
      const copy = dict.labs.probability;
      expect(copy.title.length).toBeGreaterThan(3);
      expect(copy.recap.lessons).toHaveLength(4);
      expect(copy.recap.footer.length).toBeGreaterThan(60);
      expect(copy.scope.length).toBeGreaterThan(60);
    }
  });

  it("carries the four experiments and the prediction wording in both", () => {
    for (const dict of [en, tr]) {
      const copy = dict.labs.probability;
      for (const section of ["monty", "birthday", "conditional", "simpson"] as const) {
        expect(copy[section].caption.length, section).toBeGreaterThan(40);
      }
      for (const key of ["yours", "actual", "agreed", "disagreed"] as const) {
        expect(copy.prediction[key].length).toBeGreaterThan(2);
      }
    }
  });

  it("reserves the word paradox for the one that is one", () => {
    // Monty Hall, the birthday problem and the two-children problem are
    // counterintuitive results, not paradoxes. Only Simpson's is named as one.
    for (const dict of [en, tr]) {
      const copy = dict.labs.probability;
      for (const section of ["monty", "birthday", "conditional"] as const) {
        const text = JSON.stringify(copy[section]).toLowerCase();
        expect({ section, said: /paradox/.test(text) }).toEqual({ section, said: false });
      }
      expect(JSON.stringify(copy.simpson).toLowerCase()).toMatch(/paradoks|paradox/);
    }
  });

  it("says the simulation illustrates rather than proves", () => {
    for (const [name, copy] of [
      ["en", en.labs.probability],
      ["tr", tr.labs.probability],
    ] as const) {
      const all = JSON.stringify(copy).toLowerCase();
      // No claim that running an experiment establishes a theorem.
      for (const banned of ["proves", "proven", "kanıtlar", "ispatlar"]) {
        expect({ name, banned, found: word(banned, "i").test(all) }).toEqual({
          name,
          banned,
          found: false,
        });
      }
      // And the scope note says what a simulation is for.
      expect(copy.scope.toLowerCase()).toMatch(/illustrat|g[öo]sterir/);
    }
  });

  it("states each model's assumptions rather than choosing them quietly", () => {
    const en_ = en.labs.probability;
    // The host's two rules, the birthday model, the two-children assumption,
    // and the source of the Simpson numbers.
    expect(en_.monty.caption).toMatch(/never open/i);
    expect(en_.birthday.caption).toMatch(/365|leap/i);
    expect(en_.conditional.caption).toMatch(/independently|1\/2/i);
    expect(en_.simpson.caption).toMatch(/Charig|1986/);
  });
});

// ============================== nothing displayed is written down ==========

describe("the components show the engines' numbers", () => {
  it("contain no computed result as a literal", () => {
    const measured = new Set<string>();
    measured.add(percent(THEORETICAL.stay));
    measured.add(percent(THEORETICAL.switch));
    for (const n of [10, 22, 23, 40, 50, 60]) measured.add(percent(sharedProbability(n)));
    measured.add(percent(analyse("atLeastOneBoy").probability));
    measured.add(percent(analyse("firstIsBoy").probability));
    const table = published();
    measured.add(percent(table.overall.a.rate ?? 0));
    measured.add(percent(table.overall.b.rate ?? 0));
    measured.add(String(firstAbove(0.5)));

    for (const file of COMPONENTS) {
      const code = stripComments(read(file));
      for (const value of measured) {
        for (const shape of [`"${value}"`, `= ${value}`, `>${value}<`]) {
          expect({ file, shape, found: code.includes(shape) }).toEqual({
            file,
            shape,
            found: false,
          });
        }
      }
    }
  });

  it("keeps the mathematics in the engines", () => {
    for (const file of COMPONENTS) {
      const code = stripComments(read(file));
      // No component may compute a probability of its own.
      for (const banned of ["Math.pow", "365", "factorial"]) {
        expect({ file, banned, found: code.includes(banned) }).toEqual({
          file,
          banned,
          found: false,
        });
      }
    }
    // The host's rules live in one place, and it is not a component.
    const monty = stripComments(read("components/MontyStage.tsx"));
    expect(monty).toMatch(/resolve\(/);
    expect(monty).not.toMatch(/eligible/);
  });

  it("draws each experiment from its own engine", () => {
    const imports: Array<[string, RegExp]> = [
      ["components/MontyStage.tsx", /engine\/montyHall/],
      ["components/BirthdayStage.tsx", /engine\/birthday/],
      ["components/ConditionalStage.tsx", /engine\/conditional/],
      ["components/SimpsonStage.tsx", /engine\/simpson/],
    ];
    for (const [file, pattern] of imports) {
      expect(read(file), file).toMatch(pattern);
    }
  });

  it("keeps the prediction component out of shared components", () => {
    // It is local on purpose: it must never become a quiz component.
    expect(() => readFileSync("src/components/lab/Prediction.tsx", "utf8")).toThrow();
    const prediction = stripComments(read("components/Prediction.tsx"));
    // No score, nothing to retry, no persistence.
    for (const banned of ["score", "streak", "XP", "localStorage", "attempts"]) {
      expect({ banned, found: prediction.includes(banned) }).toEqual({ banned, found: false });
    }
  });

  it("carries no gamification anywhere", () => {
    const all = COMPONENTS.map(read).join(String.fromCharCode(10));
    for (const banned of ["XP", "streak", "leaderboard", "trophy", "badge", "timer", "confetti"]) {
      expect({ banned, found: word(banned, "i").test(all) }).toEqual({ banned, found: false });
    }
  });

  it("keeps its prose in the dictionary", () => {
    for (const file of COMPONENTS) {
      expect(read(file), `${file} has bare JSX prose`).not.toMatch(/>\s*[A-Z][a-z]+ [a-z]+[^<{]*</);
    }
  });

  it("runs no animation loop", () => {
    for (const file of COMPONENTS) {
      expect(stripComments(read(file))).not.toMatch(/requestAnimationFrame|setInterval/);
    }
  });
});

// ============================================ the two kinds of number ======

describe("exact and simulated are kept apart", () => {
  it("labels both columns in the Monty Hall table", () => {
    for (const dict of [en, tr]) {
      const m = dict.labs.probability.monty;
      expect(m.exactHeader.length).toBeGreaterThan(2);
      expect(m.simulatedHeader(1000).length).toBeGreaterThan(2);
      expect(m.exactHeader).not.toBe(m.simulatedHeader(1000));
    }
  });

  it("labels both rows in the birthday table", () => {
    for (const dict of [en, tr]) {
      const b = dict.labs.probability.birthday;
      expect(b.exactRow).not.toBe(b.simulatedRow(2000));
    }
  });

  it("uses the engine's threshold rather than a written-down 23", () => {
    // If the model changed, the copy would follow it.
    expect(firstAbove(0.5)).toBe(23);
    const birthday = stripComments(read("components/BirthdayStage.tsx"));
    expect(birthday).toMatch(/firstAbove\(/);
    expect(birthday).not.toMatch(word("23"));
  });

  it("simulates the Monty Hall batch rather than printing the answer", () => {
    const monty = stripComments(read("components/MontyStage.tsx"));
    expect(monty).toMatch(/simulate\(/);
    // A real run, and one that does not happen to land on the exact value.
    const tally = montySimulate(97531, 1000);
    expect(tally.rounds).toBe(1000);
    expect(tally.switchWins / tally.rounds).not.toBe(THEORETICAL.switch);
    expect(Math.abs(tally.switchWins / tally.rounds - THEORETICAL.switch)).toBeLessThan(0.05);
  });
});

// ================================================================= view ====

describe("view helpers", () => {
  it("formats probabilities finely enough to see 50.7 cross 50", () => {
    expect(percent(sharedProbability(23))).toBe("50.7%");
    expect(percent(sharedProbability(22))).toBe("47.6%");
    expect(percent(0)).toBe("0.0%");
    expect(percent(1)).toBe("100.0%");
  });

  it("prints a ratio as its two counts", () => {
    const table = published();
    expect(ratio(table.overall.a.successes, table.overall.a.trials)).toBe("273 / 350");
  });

  it("turns a day index into a date, and stays in range", () => {
    const months = en.labs.probability.birthday.months;
    expect(dayLabel(0, months)).toBe("1 Jan");
    expect(dayLabel(31, months)).toBe("1 Feb");
    expect(dayLabel(364, months)).toBe("31 Dec");
    for (let day = 0; day < 365; day++) {
      expect(dayLabel(day, months), String(day)).toMatch(/^\d{1,2} \w+$/);
    }
  });

  it("seats people in a fixed-width grid", () => {
    expect(seatOf(0)).toEqual({ row: 0, col: 0 });
    expect(seatOf(COLUMNS)).toEqual({ row: 1, col: 0 });
    expect(seatOf(COLUMNS * 2 + 3)).toEqual({ row: 2, col: 3 });
  });
});

// ========================================== the situation comes first ======

describe("a beginner can start", () => {
  it("states the rules of each situation before asking anything", () => {
    for (const dict of [en, tr]) {
      const copy = dict.labs.probability;
      for (const section of ["monty", "birthday", "conditional", "simpson"] as const) {
        const setup = copy[section].setup;
        expect(setup.length, section).toBeGreaterThanOrEqual(3);
        for (const line of setup) {
          // One fact per line, in a sentence — not a paragraph, not a label.
          expect(line.length, `${section}: ${line}`).toBeGreaterThan(20);
          expect(line.length, `${section}: ${line}`).toBeLessThan(180);
        }
      }
    }
  });

  it("renders every setup, and renders it above its experiment", () => {
    const index = read("index.tsx");
    for (const section of ["monty", "birthday", "conditional", "simpson"] as const) {
      expect(index, section).toMatch(new RegExp(`Setup rules=\\{copy\\.${section}\\.setup\\}`));
    }
    // The Setup precedes the stage it introduces, in every case.
    for (const [section, stage] of [
      ["monty", "MontyStage"],
      ["birthday", "BirthdayStage"],
      ["conditional", "ConditionalStage"],
      ["simpson", "SimpsonStage"],
    ] as const) {
      const setupAt = index.indexOf(`copy.${section}.setup`);
      const stageAt = index.indexOf(`<${stage} />`);
      expect(setupAt, section).toBeGreaterThan(-1);
      expect(stageAt, section).toBeGreaterThan(setupAt);
    }
  });

  it("does not name the result before the visitor has seen it", () => {
    // The section headings are questions and situations. "Simpson's paradox"
    // used to be the title of section 4; it is now introduced underneath the
    // table, once the reversal is on screen.
    for (const dict of [en, tr]) {
      const s = dict.labs.probability.simpson;
      expect(s.title.toLowerCase()).not.toMatch(/simpson/);
      expect(s.kicker.toLowerCase()).not.toMatch(/simpson|paradok|paradox/);
      expect(s.named.toLowerCase()).toMatch(/simpson/);
    }
    const simpson = stripComments(read("components/SimpsonStage.tsx"));
    // Shown only on the reversed reading.
    expect(simpson).toMatch(/table\.reversed && .*s\.named/s);
  });

  it("asks Monty's strategy question only after a round has been played", () => {
    const monty = stripComments(read("components/MontyStage.tsx"));
    expect(monty).toMatch(/played\.rounds > 0 && \(\s*<Prediction/);
  });

  it("lets the birthday room fill one person at a time", () => {
    const birthday = stripComments(read("components/BirthdayStage.tsx"));
    expect(birthday).toMatch(/b\.addPerson/);
    expect(birthday).toMatch(/Math\.min\(n \+ 1, MAX_PEOPLE\)/);
  });
});

// =============================== the answer waits for the guess ============

describe("nothing answers the question before it is asked", () => {
  // Monty Hall was already built this way. The other three showed their
  // result beside the guess that was still being offered, which makes the
  // guess decorative — the whole device of the lab is that you commit first.
  it("holds each experiment's answer behind its own prediction", () => {
    const gated: Array<[string, RegExp[]]> = [
      // The threshold is the answer to "where does it first pass 50%?".
      [
        "components/BirthdayStage.tsx",
        [/\{answered && \(\s*<Figure\s+label=\{b\.thresholdFigure\}/],
      ],
      // The quotient, the two-clue table, the explanation and both answer figures.
      [
        "components/ConditionalStage.tsx",
        [
          /\{answered && \(\s*<p[^>]*>\s*\{c\.fraction\(/,
          /answered \? \(/,
          /\{answered && \(\s*<>/,
        ],
      ],
      // The verdict on the table, not the table.
      ["components/SimpsonStage.tsx", [/answered \? \(/, /\{answered && \(\s*<Figure/]],
    ];
    for (const [file, patterns] of gated) {
      const code = stripComments(read(file));
      expect(code, `${file} defines the flag`).toMatch(/const answered = guess !== null;/);
      for (const pattern of patterns) {
        expect(code, `${file} :: ${pattern}`).toMatch(pattern);
      }
    }
  });

  it("says nothing through the live region either", () => {
    // A gated screen that still announces the number has only hidden it from
    // people who can see.
    for (const file of ["components/ConditionalStage.tsx", "components/SimpsonStage.tsx"]) {
      const code = stripComments(read(file));
      const at = code.indexOf("announcement=");
      expect(at, file).toBeGreaterThan(-1);
      expect(code.slice(at, at + 220), file).toMatch(/answered/);
    }
  });

  it("still asks the question while the answer is held back", () => {
    // Gate the answer, not the question: every stage keeps its Prediction.
    for (const file of [
      "components/BirthdayStage.tsx",
      "components/ConditionalStage.tsx",
      "components/SimpsonStage.tsx",
      "components/MontyStage.tsx",
    ]) {
      expect(stripComments(read(file)), file).toMatch(/<Prediction/);
    }
  });

  it("offers the thousand-round batch only once a round has been played", () => {
    const monty = stripComments(read("components/MontyStage.tsx"));
    expect(monty).toMatch(/\{played\.rounds > 0 && \(\s*<Button\s+variant="ghost"/);
  });
});

// ================================================= the coach explains ======

describe("the coach", () => {
  it("offers three questions per experiment in both languages", () => {
    for (const dict of [en, tr]) {
      const copy = dict.labs.probability;
      for (const section of ["monty", "birthday", "conditional", "simpson"] as const) {
        const coach = copy[section].coach;
        expect(Object.keys(coach), section).toHaveLength(3);
        expect(copy[section].coachLabel.length, section).toBeGreaterThan(3);
      }
    }
  });

  it("never computes a probability of its own", () => {
    // The whole architectural point: the coach explains numbers, it does not
    // produce them. Any value in an answer arrives as an argument.
    const framing = stripComments(read("components/Framing.tsx"));
    for (const banned of ["Math.", "engine/", "probability", "simulate"]) {
      expect({ banned, found: framing.includes(banned) }).toEqual({ banned, found: false });
    }
  });

  it("is fed from the engines by every stage that shows it", () => {
    for (const [file, source] of [
      ["components/MontyStage.tsx", /THEORETICAL\.stay/],
      ["components/BirthdayStage.tsx", /pairCount\(threshold\)/],
      ["components/ConditionalStage.tsx", /analyse\("atLeastOneBoy"\)\.probability/],
    ] as const) {
      const code = stripComments(read(file));
      const coachAt = code.indexOf("const coach = [");
      expect(coachAt, file).toBeGreaterThan(-1);
      expect(code.slice(coachAt, coachAt + 500), file).toMatch(source);
    }
  });
});

// ============================================= the paradox is on screen ====

describe("Simpson's table as the lab presents it", () => {
  it("opens on the published, reversed allocation", () => {
    expect(published().reversed).toBe(true);
  });

  it("stops being reversed when the sliders are levelled", () => {
    expect(build({ a: 175, b: 175 }).reversed).toBe(false);
  });
});
