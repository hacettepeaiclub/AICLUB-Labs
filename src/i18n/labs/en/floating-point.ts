/** English prose for the floating-point lab. Its shape is the contract `tr/floating-point.ts` must meet. */

const copy = {
  sources: {
    title: "Sources",
    ieee754:
      "Defines the binary formats this lab computes with (float64, float32 and float16), their special values, and the default rounding: to the nearest value, ties to even. The lab's arithmetic is its own exact implementation of those rules, checked against the browser's.",
    goldberg:
      "The classic account of why most decimals have no exact binary form, why the error of a float is relative to its size, and why floating-point addition is not associative.",
    ecma262:
      "Specifies how a JavaScript number is printed: the fewest digits that convert back to the same number (Number::toString, step 5). That is why the console shows 0.30000000000000004 rather than the value actually stored.",
    bfloat16:
      "Studies bfloat16, which keeps float32's range, and reports deep-learning training in it reaching float32's results with no change to hyper-parameters, where IEEE float16 needs tuning.",
    mixedPrecision:
      "Trains networks with weights, activations and gradients stored in float16, nearly halving memory, and scales the loss to recover small gradient values that float16's narrow range loses.",
  },

  invalid: "That is not a number this lab can read. Try 0.1, -2.5e-8, 1/3 or 0,1.",
  showAll: (count: number) => `Show all ${count} digits`,
  showLess: "Fold it again",
  storedExactly: "Stored exactly: nothing was lost.",
  kinds: {
    zero: "zero",
    subnormal: "subnormal",
    normal: "normal",
    infinity: "infinity",
    nan: "not a number",
  },

  // 1 ----------------------------------------------------------------------
  store: {
    title: "What is actually stored",
    question: "Type a number. What does your computer actually keep?",
    inputLabel: "A number",
    storedAs: "Stored as",
    format: "float64, the one number type JavaScript has",
    prints: (shown: string) =>
      `Your browser prints this as ${shown}: the shortest decimal that turns back into the same stored value.`,
    tooBig: "Too large for 64 bits. It is stored as Infinity.",
    tooSmall: "Too small for 64 bits. It is stored as 0.",
    infinity: "Infinity is a value of its own, stored exactly.",
    notANumber: "NaN is stored as itself: the one value that is not equal even to itself.",
    another: "Show me another",
    caption:
      "The marked digits are where the stored value stops agreeing with what you typed. Every stored value on this page is shown exactly: the lab computes with whole numbers, never with floats.",
    figures: {
      offBy: "Off by",
      relative: "Off by, relative",
      bits: "Bits",
      bitsHint: "for every number, large or small",
    },
    announce: (stored: string) => `Stored as ${stored}.`,
  },

  // 2 ----------------------------------------------------------------------
  sum: {
    kicker: "Adding two of them",
    title: "What is 0.1 + 0.2?",
    lede: "Decide before you look. Then put in any two numbers and see the whole sum, exactly.",
    question: "What does your browser get for 0.1 + 0.2?",
    options: {
      exact: "Exactly 0.3",
      above: "A little more than 0.3",
      below: "A little less than 0.3",
    },
    yours: "Your guess",
    actual: "What happens",
    agreed: "You saw it coming.",
    disagreed: "Nearly everyone expects exactly 0.3.",
    answer:
      "A little more: 0.30000000000000004. Both numbers were stored slightly high, and their sum rounds to the stored value one step above the one 0.3 gets.",
    aLabel: "a",
    bLabel: "b",
    rows: {
      a: "a, as stored",
      b: "b, as stored",
      exact: "their exact sum",
      sum: "a + b, rounded to float64",
      target: "the true answer, stored directly",
    },
    printsAs: (shown: string) => `prints as ${shown}`,
    lineLabel: (steps: string) =>
      `The neighbouring float64 values around the answer, drawn to scale. ${steps}`,
    marks: {
      exact: "exact sum",
      truth: "true answer",
      sum: "a + b",
      target: "answer stored",
    },
    same: "Same stored value: here the sum comes out exactly as if you had typed the answer.",
    tie: "The exact sum lands exactly halfway between two float64 values. On a tie the rule is to go to the one whose last bit is 0, and here that is the upper one.",
    apart: (steps: string) =>
      `${steps} apart: the sum is not the number you get by typing the answer.`,
    steps: (n: string) => (n === "1" ? "One step" : `${n} steps`),
    reset: "Back to 0.1 + 0.2",
    caption:
      "A step is the gap between two neighbouring float64 values. Each input was rounded once when it was stored, and the sum is rounded again.",
    figures: {
      sum: "a + b",
      equals: "a + b == answer",
      apart: "Apart by",
      yes: "true",
      no: "false",
      stepUnit: (n: string) => (n === "1" ? "1 step" : `${n} steps`),
      stepSize: "One step here",
    },
    announce: (sum: string, equal: boolean) =>
      `a + b is ${sum}, ${equal ? "equal to" : "not equal to"} the answer stored directly.`,
  },

  // 3 ----------------------------------------------------------------------
  bits: {
    kicker: "Inside the bits",
    title: "Flip a bit and watch the number.",
    lede: "This is float32: the same design as float64 with half the bits, so every one of them fits. Each square is one bit. Click any of them.",
    hint: "Try the second square from the left, then the very last one.",
    groupLabel: "The 32 bits of a float32, most significant first",
    bitLabel: (position: number, field: string, value: number) =>
      `Bit ${position} of 32, ${field}, now ${value}`,
    fields: {
      sign: "sign",
      exponent: "exponent",
      fraction: "fraction",
    },
    fieldNotes: {
      sign: "0 is positive, 1 negative",
      exponent: "decides the size",
      fraction: "decides the digits",
    },
    named:
      "Three fields. The exponent moves the binary point; the fraction holds the digits after it. That is the whole design, and float64 is the same with 11 and 52.",
    formula: "Read as",
    setLabel: "Set the bits from a number",
    specials: {
      infinity: "Exponent all ones, fraction zero: this pattern means Infinity.",
      nan: "Exponent all ones, fraction not zero: this pattern means NaN, not a number.",
      zero: "Everything after the sign is zero: this is zero. With the sign set it is −0, which compares equal to 0.",
      subnormal:
        "Exponent all zeros: the hidden 1 goes away and the number is 0.fraction × 2⁻¹²⁶. These subnormals fill the gap between zero and the smallest normal number.",
    },
    caption: "With a bit focused, the arrow keys move along the row and Space flips it.",
    figures: {
      value: "Value",
      power: "Scale",
      powerHint: (field: number) => `exponent field ${field} − 127`,
      kind: "Kind",
    },
    announce: (value: string, kind: string) => `Value now ${value}, ${kind}.`,
  },

  // 4 ----------------------------------------------------------------------
  ruler: {
    kicker: "Every value it can write",
    title: "The numbers are not evenly spaced.",
    lede: "A real format holds billions of values, too many to draw. This one is the same design at toy size, so every value it can store fits on one line.",
    exponentBits: "Exponent bits",
    fractionBits: "Fraction bits",
    controlsLabel: "Format",
    pick: "Pick a value",
    pickValue: (value: string, n: number, total: number) => `${value}, value ${n} of ${total}`,
    lineLabel: (count: number, largest: string, perDoubling: number) =>
      `${count} values from 0 to ${largest}. Each doubling holds ${perDoubling} of them, so the gaps double each time.`,
    legend: {
      normal: "normal values",
      subnormal: "subnormals, evenly spaced down to 0",
      picked: "the value picked",
    },
    caption:
      "Each doubling holds the same number of values, so each one is spread twice as thin as the last. Add fraction bits and every doubling fills in; add exponent bits and the line reaches further.",
    figures: {
      values: "Values",
      largest: "Largest",
      gap: "Gap to the next",
      top: "none: it is the largest",
      perDoubling: "Per doubling",
    },
    announce: (value: string, gap: string) => `${value}, next value ${gap} above.`,
  },

  // 5 ----------------------------------------------------------------------
  gap: {
    kicker: "Zooming in",
    title: "Bigger numbers, bigger gaps.",
    lede: "Back to a real format, float32. Slide to any size of number and look at the distance to the next one it can store.",
    slider: "Size of the number",
    sliderValue: (power: string) => `about 2 to the power ${power}`,
    inputLabel: "Or type one",
    value: "This float32",
    next: "The next one up",
    plusOne: "This number + 1",
    lost: "the same number: the + 1 was lost",
    kept: "a different number",
    chartLabel: (gap: string) =>
      `Gap to the next float32 against the size of the number, both on logarithmic scales: a staircase that doubles at every power of two. The current gap is ${gap}.`,
    axes: {
      size: "size of the number",
      gap: "gap to the next",
    },
    wholeNumbers: "from 2²⁴ the gap is 2: odd whole numbers can no longer be stored",
    caption:
      "The gap grows with the number, but gap ÷ number barely moves: float32 keeps about 7 significant decimal digits wherever the number is. That is what floating means.",
    figures: {
      gap: "Gap",
      relative: "Gap ÷ number",
      relativeHint: "between 2⁻²⁴ and 2⁻²³ for every normal float32",
      plusOne: "x + 1",
      lost: "lost",
      kept: "kept",
    },
    announce: (value: string, gap: string) => `${value}, gap to the next ${gap}.`,
  },

  // 6 ----------------------------------------------------------------------
  formats: {
    kicker: "Fewer bits, for AI",
    title: "Range or precision: pick one.",
    lede: "A neural network stores billions of numbers, and a 16-bit number takes half the memory of a 32-bit one. The two 16-bit formats spend their bits differently: float16 keeps more fraction bits, bfloat16 keeps float32's exponent.",
    examplesLabel: "Example values",
    examples: {
      weight: "A weight",
      gradient: "A small gradient",
      activation: "A large activation",
      third: "One third",
    },
    inputLabel: "Or type a number",
    status: {
      exact: "exact",
      rounded: (offBy: string) => `rounded, off by ${offBy}`,
      overflow: "too large: becomes Infinity",
      underflow: "too small: becomes 0",
      special: "stored as is",
    },
    layout: (exponent: number, fraction: number) =>
      `1 sign, ${exponent} exponent and ${fraction} fraction bits`,
    table: {
      caption: "What each format can hold",
      format: "Format",
      bits: "Bits",
      largest: "Largest",
      smallest: "Smallest above 0",
      digits: "Decimal digits",
    },
    bfloatNote:
      "bfloat16 is not in IEEE 754. It has float32's layout with the fraction cut from 23 bits to 7, and the lab rounds to it as to the others: to the nearest value, ties to even.",
    caption:
      "A gradient of 2 × 10⁻⁸ survives in bfloat16, stored as 2.0023 × 10⁻⁸, and becomes 0 in float16, which reaches no lower than about 6 × 10⁻⁸. Training in bfloat16 keeps such values without extra machinery; training in float16 needs the loss scaled up so they do not vanish.",
  },

  // 7 ----------------------------------------------------------------------
  challenge: {
    kicker: "Your turn",
    title: "Three things arithmetic says cannot happen.",
    lede: "Each one is a real property of the formats on this page. The page checks your answer with the same exact arithmetic it has used all along.",
    pickLabel: "Puzzle",
    solvedLabel: "Solved",
    reset: "Start over",
    plusOne: {
      tab: "x + 1 = x",
      task: "Find a number x for which x + 1 equals x in float32.",
      hint: "Look back at where the gap reached 2.",
      xLabel: "x",
      stored: "x in float32",
      result: "x + 1 in float32",
      solved: "Solved: adding 1 changed nothing at all.",
      notYet: "Not yet: x + 1 is a different number.",
      infinite: "Infinity + 1 is Infinity, but that says nothing about gaps. Find a finite x.",
      best: (value: string) => `Smallest you have found: ${value}`,
    },
    associative: {
      tab: "(a + b) + c",
      task: "Find a, b and c for which (a + b) + c and a + (b + c) differ, in float64 like JavaScript.",
      hint: "Combine one very large number with one small one.",
      left: "(a + b) + c",
      right: "a + (b + c)",
      solved: "Solved: the order of the additions changed the answer.",
      notYet: "Not yet: both orders give the same answer.",
      notFinite:
        "One result is not a finite number. NaN equals nothing, not even itself, so that does not count: find finite a, b and c.",
    },
    exact: {
      tab: "An exact decimal",
      task: "Find a number between 0 and 1, with at most three digits after the point, that float32 stores exactly. 0.5 does not count.",
      hint: "Which fractions can binary write without a remainder?",
      inputLabel: "Your number",
      rules: {
        range: "between 0 and 1",
        places: "at most three digits after the point",
        notHalf: "not 0.5",
        exact: "stored exactly in float32",
      },
      solved: "Solved.",
      notYet: "Not yet: one of the rules above is not met.",
      reveal:
        "There are exactly seven, 0.5 among them: 0.125, 0.25, 0.375, 0.5, 0.625, 0.75 and 0.875. Every one is a whole number of eighths, because a decimal is exact in binary only when, written as a fraction in lowest terms, its denominator is a power of two.",
    },
    caption: "Solved puzzles are remembered in this browser.",
    announce: (solved: number, total: number) => `${solved} of ${total} solved.`,
  },

  recap: {
    lessons: [
      "A float keeps the nearest number it can write in a fixed number of bits, and most decimals, 0.1 among them, are not one of those numbers",
      "Every arithmetic result is rounded again, so errors add up and the order of operations can change the answer",
      "The exponent sets the size and the fraction the digits, so the gap between neighbours grows with the number while the relative error stays about the same",
      "Choosing a format is choosing between range and precision, which is why models train in bfloat16 rather than float16",
    ],
    footer:
      "In code, this is why two computed floats are compared with a tolerance rather than with ==, why money is counted in whole cents, and why a long sum can come out differently when it is added up in a different order.",
  },

  // The guided tours, one per experiment (components/lab/guide/tours.ts).
  tour: {
    intro: "Type a number and see what your computer actually keeps for it, digit by digit.",
    stages: {
      store: {
        type: "Type a number in this box. The tour typed 0.1.",
        stored:
          "What is actually stored for it. The marked digits are where it stops agreeing with what you typed.",
        offBy: "How far the stored value is from yours, as a number and relative to its size.",
        another: "This button fills in another example to try.",
      },
      sum: {
        line: "a and b as stored, their exact sum, and where float64 rounds it to.",
        type: "Put in any two numbers. The tour changed b to 0.4.",
        steps:
          "How far the rounded sum is from the true answer, counted in steps between neighbouring values.",
        reset: "This brings back 0.1 + 0.2.",
      },
      bits: {
        bits: "float32, one square per bit: sign, exponent, fraction.",
        flip: "Click a bit to flip it. The tour flipped the second one, the top of the exponent.",
        value: "The value those bits now mean, and the power of two the exponent picks.",
        set: "Or set a value here and see which bits it takes.",
      },
      ruler: {
        line: "Every value a toy format can store, on one line. Each doubling holds the same number of values.",
        pick: "Pick a value with this slider. Out here the values are spread far apart.",
        bits: "Add exponent bits and the line reaches further; add fraction bits and it fills in.",
      },
      gap: {
        chart: "float32 again: the distance from a number to the next one it can store.",
        size: "Slide to a bigger number. The tour went up towards the top of the range.",
        gap: "The gap grew with the number, but gap ÷ number hardly moved: about 7 significant digits anywhere.",
      },
      formats: {
        type: "Type a number and see it in float32, float16 and bfloat16. The tour typed a tiny gradient.",
        rows: "bfloat16 keeps it, float16 turns it into 0: same 16 bits, spent differently.",
        examples: "Try the other examples here.",
      },
      challenge: {
        pick: "Three things arithmetic says cannot happen. Pick one here.",
        work: "Find a number that makes it happen. The page checks it with exact arithmetic.",
        solved: "Solved puzzles are remembered in this browser.",
      },
    },
  },
};

export default copy;
