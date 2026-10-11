/** English prose for the hash-tables lab. Its shape is the contract `tr/hash-tables.ts` must meet. */

const copy = {
  sources: {
    title: "Sources",
    peterson:
      "One of the first studies of storing records at an address computed from their key, and of how the length of a search grows as the storage fills.",
    linearProbing:
      "Analyses linear probing exactly and recovers Knuth's costs for it: ½(1 + 1/(1 − α)) probes to find a stored key and ½(1 + 1/(1 − α)²) for a search that misses, which is what an insertion is.",
    birthday:
      "Generalises the birthday problem to more than two people sharing a day. For two it gives the classic answer: 23 people make a shared birthday more likely than not.",
    amortized:
      "Sets out amortized analysis: judging an operation by its average cost over a whole sequence. That is the sense in which doubling makes insertion constant time despite its occasional large step.",
    javaApi:
      "Specifies the hash this lab uses, s[0]·31^(n−1) + … + s[n−1] in int arithmetic, and HashMap's defaults: 16 buckets, a load factor of 0.75, and about twice the buckets on each rehash.",
  },

  percent: (value: string) => `${value}%`,

  // 1 ----------------------------------------------------------------------
  address: {
    title: "A computed address",
    question: "Type a word. Where does it go, and how do you find it again?",
    inputLabel: "A key",
    emptyWord: "Type any word to see where it lands.",
    workingCaption: "The hash, one character at a time.",
    columns: { char: "Character", code: "Code", hash: "Running hash" },
    wrapped: "wraps to 32 bits:",
    bucketLine: (hash: string, m: number) => `${hash} mod ${m} =`,
    tableLabel: (n: number) => `A table of 16 buckets holding ${n} keys.`,
    bucketName: (i: number, keys: string) => (keys ? `Bucket ${i}: ${keys}` : `Bucket ${i}: empty`),
    put: "Put it in",
    already: "Already in the table",
    reset: "Start over",
    caption:
      "The hash is the one Java uses for its strings: multiply by 31, add the next character, keep 32 bits. The remainder by 16 is the bucket. Two words in one bucket share it as a short list.",
    announce: (word: string, bucket: number, present: boolean, looks: number) =>
      present
        ? `${word} is in bucket ${bucket}, found after ${looks} comparison${looks === 1 ? "" : "s"}.`
        : `${word} belongs in bucket ${bucket}. It is not there yet.`,
    figures: {
      bucket: "Bucket",
      looks: "Comparisons",
      found: "to find it",
      absent: "to know it is not there",
      list: "In a plain list",
      listHint: "comparisons, checking word by word",
    },
  },

  // 2 ----------------------------------------------------------------------
  birthday: {
    kicker: "Collisions",
    title: "Two keys in one bucket, sooner than you think.",
    lede: "Every bucket equally likely, no bucket full yet, and still a collision arrives early. Decide first how early.",
    question:
      "A table has 365 buckets and every key lands in a random one. How many keys until two sharing a bucket is more likely than not?",
    answer:
      "23. That is the birthday problem: in a room of 23 people, a shared birthday is more likely than not, with more than 340 days still unused.",
    guess: {
      yours: "Your guess",
      actual: "The answer",
      agreed: "You knew it.",
      disagreed: "Almost everyone guesses far higher.",
    },
    caption:
      "The curve is exact: the chance that n keys all miss each other is (1 − 1/m)(1 − 2/m)…(1 − (n−1)/m). It falls fast because every new key has to miss every key already there.",
    announce: (keys: number, chance: string) =>
      `With ${keys} keys, a shared bucket has probability ${chance}.`,
    curveTitle: (m: number) => `Chance of a shared bucket, ${m} buckets`,
    curveLabel: (m: number, half: number) =>
      `The chance of at least one shared bucket against the number of keys, for ${m} buckets. It passes one half at ${half} keys.`,
    axis: "keys",
    gridTitle: (m: number) => `One trial, ${m} buckets`,
    gridLabel: (n: number, m: number) =>
      `Keys thrown into ${m} buckets until the first shared one: it took ${n}.`,
    gridEmpty:
      "Throw keys to watch one trial: each lands in a random bucket until one lands on another.",
    trialLine: (n: number, empty: number) =>
      `Key ${n} landed on a bucket already used, with ${empty} buckets still empty.`,
    keysLabel: "Keys",
    throw: "Throw keys until one collides",
    sizeLabel: "Buckets",
    secondaryLabel: "Change the number of buckets",
    figures: {
      chance: "Chance",
      chanceHint: (n: number) => `of a shared bucket with ${n} keys`,
      even: "Even odds at",
      evenHint: (m: number) => `keys, for ${m} buckets`,
      trials: "Your trials",
      trialsHint: (half: number) => `collided by key ${half}`,
    },
  },

  // 3 ----------------------------------------------------------------------
  probe: {
    kicker: "Open addressing",
    title: "No lists: a key that finds its slot taken steps right.",
    lede: "One array of 32 slots. Each key has a home slot; if that is taken it tries the next, and the next, until one is free. Add keys and watch the walks get longer.",
    caption:
      "Each filled slot shows the home its key wanted. The amber outline is every slot the newest key tried. Runs of full slots grow by joining, and every key that lands on a run walks to its end and makes it longer.",
    announce: (count: number, home: number, slot: number, probes: number) =>
      `Key ${count} wanted slot ${home}, landed in ${slot} after ${probes} probe${probes === 1 ? "" : "s"}.`,
    tableLabel: (count: number, m: number) => `A table of ${m} slots holding ${count} keys.`,
    slotFull: (slot: number, home: number) => `Slot ${slot}: a key whose home is ${home}`,
    slotEmpty: (slot: number) => `Slot ${slot}: empty`,
    pathLine: (home: number, slot: number, probes: number) =>
      probes === 1
        ? `The newest key went straight into its home, slot ${home}.`
        : `The newest key wanted slot ${home}, found it taken, and walked to slot ${slot}: ${probes} probes.`,
    emptyLine: "An empty table. Add a key.",
    clusterLine: (lengths: string) => `Runs of full slots: ${lengths}.`,
    noClusters: "No runs yet.",
    add: "Add a key",
    full: "The table is full",
    addFour: "Add 4",
    restart: "Empty it, with new homes",
    secondaryLabel: "Start again",
    figures: {
      load: "Full",
      loadHint: (alpha: string) => `load factor α = ${alpha}`,
      last: "Last insert",
      lastHint: "probes",
      mean: "To find a key",
      meanHint: "probes, on average",
      longest: "Longest run",
    },
  },

  // 4 ----------------------------------------------------------------------
  compare: {
    kicker: "Lists against steps",
    title: "Both are fast, until the table is nearly full.",
    lede: "The cost of finding a stored key, for chaining and for linear probing, as the load factor α grows. The lines are the formulas; the dots are real tables of 1,024 slots.",
    caption:
      "Chaining costs 1 + α/2: it degrades in a straight line and can even run past α = 1. Linear probing costs ½(1 + 1/(1 − α)), which is fine at half full and blows up near full; inserting is worse still, ½(1 + 1/(1 − α)²), and leaves the chart before α = 0.8.",
    announce: (alpha: string, chain: string, linear: string) =>
      `At load ${alpha}, chaining needs ${chain} comparisons on average and linear probing ${linear}.`,
    chartLabel:
      "Average probes to find a key against the load factor: a straight line for chaining, a curve that rises steeply near 1 for linear probing, and a steeper dashed curve for inserting into it. Dots are measured on random tables.",
    axis: "load factor α",
    legend: {
      chain: "Chaining, find",
      linear: "Linear probing, find",
      insert: "Linear probing, insert",
      dots: "measured",
    },
    loadLabel: "Load factor α",
    loadValue: (value: string) => `α is ${value}`,
    dragHint:
      "Press or drag anywhere on the chart to set the load factor. The rings mark where it crosses each curve.",
    again: "Measure on new tables",
    secondaryLabel: "Measure again",
    figures: {
      chain: "Chaining",
      linear: "Linear probing",
      insert: "Inserting",
      insertHint: "probes, linear probing",
    },
  },

  // 5 ----------------------------------------------------------------------
  resize: {
    kicker: "Staying fast",
    title: "When it gets full, move to a table twice the size.",
    lede: "Java's HashMap starts with 16 buckets and doubles whenever it is three quarters full, copying every key across. Each move is expensive. Add keys and see what that costs on average.",
    caption:
      "Each bar is the work one insertion did: 1 for the key, and every key copied if it set off a move. The moves get bigger, but they get rarer just as fast, so the average stays under 3: the copies always add up to less than twice the keys.",
    announce: (n: number, capacity: number, average: string) =>
      `${n} keys in ${capacity} buckets. Average work per insertion ${average}.`,
    chartLabel: (n: number, resizes: number, average: string) =>
      `Work per insertion for ${n} keys: mostly 1, with ${resizes} tall spikes where the table doubled. The average is ${average}.`,
    averageTitle: "Average work per insertion so far",
    averageLabel: (average: string) =>
      `The running average of work per insertion, staying under the dashed line at 3. Now ${average}.`,
    axis: "keys inserted",
    legend: {
      insert: "an ordinary insertion",
      resize: "an insertion that moved the table",
      average: "average so far",
    },
    keysLabel: "Keys inserted",
    keysValue: (n: number) => `${n} keys inserted`,
    dragHint: "Press or drag along the chart to insert more keys, or take some back.",
    figures: {
      capacity: "Buckets",
      capacityHint: (threshold: number) => `moves again past ${threshold} keys`,
      resizes: "Moves",
      average: "Average work",
      averageHint: "per insertion, always under 3",
    },
  },

  // 6 ----------------------------------------------------------------------
  modulus: {
    kicker: "Bad keys",
    title: "Evenly spaced keys can use only a few buckets.",
    lede: "IDs that go up in eights, prices in tens, addresses aligned to 64: keys often share a step. Pick a table size and a step and see how many buckets they reach.",
    caption:
      "Keys 0, s, 2s, … reach exactly m / gcd(s, m) buckets, whatever else is true. A power of two with an even step is the worst case; a prime has no factor to share. HashMap uses powers of two, which is why it mixes a hash's high bits into its low ones before choosing a bucket.",
    announce: (used: number, m: number, most: number) =>
      `The keys reach ${used} of ${m} buckets; the fullest holds ${most}.`,
    keysLine: (step: number, keys: number) =>
      `${keys} keys: 0, ${step}, ${2 * step}, ${3 * step}, …`,
    chartLabel: (m: number, used: number, most: number) =>
      `Keys per bucket across ${m} buckets. ${used} buckets are used, the fullest has ${most}.`,
    axis: "bucket",
    mLabel: "Buckets m",
    stepLabel: "Step s",
    figures: {
      used: "Buckets used",
      most: "Fullest bucket",
      mostHint: (even: string) => `keys; ${even} if spread evenly`,
    },
  },

  // 7 ----------------------------------------------------------------------
  challenge: {
    kicker: "Your turn",
    title: "Three things to make a hash table do.",
    lede: "Each asks for a property, not an answer. Anything with the property passes.",
    caption:
      "Every verdict is computed with the same hash and the same tables as the rest of the page. There is no answer key.",
    announce: (solved: number, total: number) => `${solved} of ${total} challenges solved.`,
    pickLabel: "Challenge",
    reset: "Forget my progress",
    solvedLabel: "Solved",
    collide: {
      tab: "Collide",
      task: "Find two different strings with exactly the same Java hash.",
      hint: "Two characters are enough. Each step multiplies by 31: what if the first character goes up by one and the second down by 31?",
      first: "First string",
      second: "Second string",
      hashOf: (hash: string) => `hash ${hash}`,
      sameString: "Those are the same string. It has to be two different ones.",
      solved:
        "Solved. Two different keys, one hash: no table can tell them apart, and no hash that turns long strings into 32 bits can avoid this.",
      notYetPlain: "Not yet: the two hashes differ.",
    },
    size: {
      tab: "Size",
      task: "These 16 keys go up in tens: 0, 10, 20, …, 150. Choose a table size from 16 to 32 that puts every one in its own bucket.",
      hint: "Keys spaced by 10 reach m / gcd(10, m) buckets. You need that to be at least 16.",
      label: "Table size m",
      range: "A whole number from 16 to 32.",
      chartLabel: (distinct: number) => `Each key and its bucket: ${distinct} different buckets.`,
      notYet: (distinct: number, total: number) =>
        `Not yet: ${total} keys reach only ${distinct} buckets.`,
      solved:
        "Solved. Sixteen keys, sixteen buckets: m / gcd(10, m) is at least 16, so the keys run out before their buckets start to repeat.",
      notYetPlain: "Not yet.",
    },
    perfect: {
      tab: "Perfect",
      task: "Choose eight different words that land in all eight buckets of a table of 8, one each.",
      hint: "Each word shows its bucket. Change the ones that clash until every bucket is used once.",
      word: (i: number) => `Word ${i}`,
      bucket: (b: number, clash: boolean) => (clash ? `bucket ${b}, shared` : `bucket ${b}`),
      rules: {
        filled: "Eight words",
        unique: "All different",
        spread: "One word in every bucket",
      },
      solved:
        "Solved. A perfect fit: no collisions at all. Chance would manage it about twice in a thousand tries, which is why tables leave room instead.",
      notYetPlain: "Not yet: check the three conditions.",
    },
  },

  recap: {
    lessons: [
      "A hash table computes a key's address instead of searching for it",
      "Collisions come early: 23 keys in 365 buckets make one more likely than not",
      "Chaining keeps a list per bucket; finding a key costs about 1 + α/2",
      "Linear probing steps to the next free slot; runs of full slots grow by merging",
      "Near full, probing explodes: ½(1 + 1/(1 − α)) to find, ½(1 + 1/(1 − α)²) to insert",
      "Doubling when the table fills keeps insertion constant on average",
      "Keys that share a step with the table size crowd into m / gcd(s, m) buckets",
    ],
    footer:
      "Python's dictionaries, JavaScript's Map and Set, Java's HashMap: underneath each of them is this array, this remainder and this load factor.",
  },
};

export default copy;
