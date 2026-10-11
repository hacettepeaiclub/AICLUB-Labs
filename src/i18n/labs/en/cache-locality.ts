/** English prose for the cache-locality lab. Its shape is the contract `tr/cache-locality.ts` must meet. */

/** 2nd, 4th, 32nd: the strides this lab offers, as English ordinals. */
const ordinal = (n: number) => {
  const tens = n % 100;
  if (tens >= 11 && tens <= 13) return `${n}th`;
  return `${n}${({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[n % 10] ?? "th"}`;
};

const copy = {
  sources: {
    title: "Sources",
    drepper:
      "Supports the account of cache lines, of why sequential access is cheap and strided access is not, and of the prefetching that makes real processors depart from the simple model.",
    memoryWall:
      "Supports why this matters more each year: processors have grown faster much more quickly than the memory that feeds them.",
    blocked:
      "Supports the matrix product in section 4: loop order and stride decide how often a cache is missed, and reordering the loops is a standard remedy.",
    locality:
      "Supports the principle the lab is named for: programs tend to reuse what they used recently and what lies near it, which is why caches work at all.",
  },

  race: {
    title: "The same sum, twice",
    question:
      "Two loops add up the same four million numbers. One reads them row by row, the other column by column. Will the order matter?",
    rowLabel: "Row by row",
    columnLabel: "Column by column",
    rowHow: "Each number sits next to the last one read.",
    columnHow: "Each number is a whole row, 16 KB, away from the last one read.",
    ms: (value: string) => `${value} ms`,
    run: "Time both on this computer",
    again: "Time them again",
    running: "Measuring…",
    gridNote: (n: string) =>
      `A ${n} × ${n} grid of numbers, 32 MB, timed on your own processor. Each order runs five times; the fastest run counts.`,
    caption: (count: string) =>
      `Both loops add the same ${count} numbers and arrive at the same sum. Only the order of reading differs.`,
    announce: (row: string, column: string, ratio: string) =>
      `Row by row took ${row} milliseconds, column by column ${column}: ${ratio} slower for the same sum.`,
    error: "The measurement could not run in this browser. Try reloading the page.",
    figures: {
      ratio: "Columns took",
      ratioHint: "the time rows did, on this computer",
      sum: "Sum",
      sumHint: "the same in both orders",
      sumSame: "identical in both orders",
      sumDiffers: "the orders disagree, which they should not",
    },
  },

  line: {
    kicker: "Cache lines",
    title: "Memory arrives a line at a time.",
    lede: "The processor keeps a few recently used pieces of memory close by, in its cache. It never fetches a single number: it fetches the whole line around it, 64 bytes, eight numbers. Read the eight neighbours next and seven of them are already there.",
    caption:
      "Each row of this grid is exactly one line. The cache holds four lines; when it is full, the line used longest ago is pushed out. • is a hit, × is a miss.",
    orderLabel: "Read the grid",
    orders: { rows: "Row by row", columns: "Column by column", own: "Your order" },
    sizeLabel: "Cache size",
    size: (lines: number) => `${lines} lines`,
    secondaryLabel: "Order and cache size",
    scrub: "Read so far",
    replay: "Again",
    clear: "Clear and start over",
    lineChip: (line: number) => `line ${line}`,
    emptySlot: "empty",
    cacheLabel: (lines: number) => `In the cache (${lines} lines, newest first):`,
    startHint: "Press Run, or drag the slider, to read the grid one number at a time.",
    ownHint: "Click the numbers in any order you like. Each click is one read.",
    hitLine: (row: number, col: number, line: number) =>
      `Row ${row}, column ${col}: hit. Line ${line} was already in the cache.`,
    missLine: (row: number, col: number, line: number, evicted: number | null) =>
      evicted === null
        ? `Row ${row}, column ${col}: miss. Line ${line} is fetched, all eight of its numbers.`
        : `Row ${row}, column ${col}: miss. Line ${line} is fetched, and line ${evicted} is pushed out to make room.`,
    gridLabel: (reads: number, misses: number, hits: number, held: number) =>
      `An 8 by 8 grid of numbers. ${reads} read so far: ${misses} misses, ${hits} hits. ${held} lines in the cache.`,
    cellButton: (row: number, col: number, seen: boolean | undefined) =>
      `Read row ${row}, column ${col}${seen === undefined ? "" : seen ? ", last read a hit" : ", last read a miss"}`,
    announce: (reads: number, misses: number, hits: number) =>
      `${reads} reads: ${misses} misses, ${hits} hits.`,
    figures: {
      reads: "Reads",
      misses: "Misses",
      missesHint: "lines fetched from memory",
      hits: "Hits",
      hitsHint: "already in the cache",
    },
  },

  stride: {
    kicker: "Stride",
    title: "The further apart, the dearer, up to a line.",
    lede: "Read every number once, but leave a gap between reads: every 2nd, every 4th, every 8th, then come back for the ones skipped. Same work at every stride. Below, the model's misses per read; above, what your processor charges for each read.",
    run: "Measure on this computer",
    again: "Measure again",
    running: "Measuring…",
    chooseLabel: "Show a stride",
    secondaryLabel: "Stride shown in the strip",
    stripLabel: (stride: number) =>
      stride === 1
        ? "One pass at stride 1 reads every number:"
        : `One pass at stride ${stride} reads every ${ordinal(stride)} number:`,
    stripNote: (fraction: string) => `In the model, that is a miss on ${fraction}.`,
    everyRead: "every read",
    oneIn: (n: number) => `1 read in ${n}`,
    axisNote:
      "Bars: nanoseconds per read on this computer. Under each stride: the model's misses per read. In the model the climb stops at 8, one line; real processors also fetch the next line ahead, so their climb often stops later and can even fall back.",
    ns: (value: string) => `${value} ns`,
    caption: (length: string) =>
      `${length} numbers, 32 MB, each read exactly once at every stride. Only the distance between consecutive reads changes.`,
    announce: (first: string, dearest: number, dearestNs: string) =>
      `Stride 1 cost ${first} nanoseconds per read. The dearest stride on this computer was ${dearest}, at ${dearestNs} nanoseconds per read.`,
    error: "The measurement could not run in this browser. Try reloading the page.",
    tableCaption: "Cost per read at each stride",
    strideHeader: "Stride",
    nsHeader: "Nanoseconds per read, measured",
    modelHeader: "Misses per read, model",
    figures: {
      first: "Stride 1",
      firstHint: "per read, neighbours in a row",
      dearest: "Dearest stride",
      dearestHint: (ratio: string) => `${ratio} the cost of stride 1`,
      dearestEmpty: "measure to find out",
      model: "Model",
      modelHint: (stride: number) => `misses at stride ${stride}`,
    },
  },

  order: {
    kicker: "Your turn",
    title: "Three loops, six orders, one product.",
    lede: "A matrix product is the same arithmetic whichever way its three loops are nested. Pick an order, see how its innermost loop walks each matrix, then time it on your computer and set it against the model.",
    orderLabel: "Loop order",
    secondaryLabel: "Pick a loop order",
    walkLabel: "How the innermost loop walks each matrix",
    walk: { row: "along a row", column: "down a column", still: "stays put" },
    legendModel: "model: misses per step",
    legendMeasured: "measured on this computer",
    measure: (order: string) => `Time ${order}`,
    measureAll: "Time all six",
    running: "Measuring…",
    ms: (value: string) => `${value} ms`,
    rowLabel: (order: string, model: string, ms: string | null) =>
      `${order}: model ${model} misses per step${ms === null ? ", not timed yet" : `, measured ${ms} milliseconds`}`,
    chartNote:
      "The model runs a 16 × 16 product through a cache of eight lines. The stopwatch runs a 512 × 512 product, 2 MB per matrix, on your processor. Timing all six can take a minute on a phone.",
    caption: (n: string) =>
      `Every order does the same ${n} × ${n} × ${n} multiplications and adds. A column walk is a whole row apart on every step; a row walk reads neighbours.`,
    announceOne: (order: string, ms: string) =>
      `${order} took ${ms} milliseconds on this computer.`,
    announceAgree:
      "All six timed. Your computer ranks the three pairs as the model does: inner j fastest, then inner k, then inner i.",
    announceDisagree:
      "All six timed. Your computer does not rank the pairs exactly as the model does.",
    error: "The measurement could not run in this browser. Try reloading the page.",
    figures: {
      model: "Model",
      modelHint: "misses per step, this order",
      fastest: "Your fastest",
      fastestHint: (ms: string) => `${ms} ms on this computer`,
      fastestEmpty: "time an order to start",
      verdict: "Against the model",
      agree: "Agrees",
      disagree: "Differs",
      pending: "Time all six",
      verdictHint: "inner j, then k, then i",
    },
  },

  recap: {
    lessons: [
      "Adding the same numbers in a different order can take several times longer, with exactly the same arithmetic.",
      "Memory reaches the processor a line at a time, 64 bytes, so a number's neighbours arrive with it.",
      "Reading neighbours next makes most reads hits; jumping a long way makes each read a fresh miss.",
      "A cache only helps while what you reuse still fits: give it room for every line and the slow order catches up.",
      "When loops can be reordered, put the one that walks along rows innermost.",
    ],
    footer:
      "The numbers are your processor's own. Real caches have several levels, limited ways and a prefetcher that guesses ahead, so they bend the model's clean steps, but not its direction: near is cheap, far is not.",
  },
};

export default copy;
