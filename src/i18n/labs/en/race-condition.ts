/** English prose for the race-condition lab. Its shape is the contract `tr/race-condition.ts` must meet. */

const copy = {
  sources: {
    title: "Sources",
    ostep:
      "Supports the lab's central example: counter++ compiles to a load, an add and a store, and an interrupt between them loses an update. Also the account of locks and atomic instructions as the remedy.",
    mutex:
      "Supports the idea behind the lock in section 4: the problem of letting only one process at a time into a critical section, posed and solved here for the first time.",
    concurrencyBugs:
      "Supports the claim in section 5 that races in real software are mostly broken atomicity or broken order, and that most appear only under one particular order of a handful of memory accesses, which is what makes them hard to catch in testing.",
    therac:
      "Supports why rare is not harmless: race conditions in a radiation therapy machine's software, which surfaced only under particular timing, contributed to fatal overdoses.",
  },

  scheduler: {
    name: (t: 0 | 1) => (t === 0 ? "A" : "B"),
    thread: (name: string) => `Thread ${name}`,
    run: (name: string) => `Run ${name}`,
    undo: "Undo",
    reset: "Start over",
    register: "r",
    memory: "Shared memory",
    lockFree: "free",
    lockHeld: (name: string) => `held by ${name}`,
    status: { waiting: "waiting for m", done: "done" },
    orderLabel: "The order you chose",
    orderEmpty: "Nothing has run yet.",
    said: {
      load: (who: string, v: string, value: number) =>
        `${who} read ${v} into its own register: r = ${value}.`,
      add: (who: string, value: number) =>
        `${who} added 1 in its register: r = ${value}. Memory has not changed.`,
      store: (who: string, v: string, value: number) => `${who} wrote ${value} to ${v}.`,
      lock: (who: string) =>
        `${who} took the lock m. Until it lets go, the other thread must wait.`,
      unlock: (who: string) => `${who} released the lock m.`,
      atomicAdd: (who: string, v: string, before: number, after: number) =>
        `${who} added 1 to ${v} in one indivisible step: ${before} → ${after}.`,
      checkPass: (who: string, value: number) =>
        `${who} checked the balance: ${value}. Enough, so it will withdraw.`,
      checkFail: (who: string, value: number) =>
        `${who} checked the balance: ${value}. Not enough, so it pays nothing.`,
      withdraw: (who: string, before: number, after: number) =>
        `${who} withdrew 100 and paid it out: balance ${before} → ${after}.`,
    },
  },

  game: {
    title: "Two threads, one counter",
    question:
      "Two threads each add 1 to a counter that starts at 0. Each runs counter++ exactly once. Can the counter end at 1?",
    hint: "You are the scheduler: press a thread's button to run its next step. Try to make the counter end at 1.",
    caption:
      "Each thread turns counter++ into three steps, as a processor does: read memory into its own register, add 1 there, write it back. Keys: A and B run a step, U undoes, R starts over.",
    lost: "The counter ended at 1. Both threads read 0 before either wrote, so both wrote 1, and the second write erased the first. One increment vanished, though both ran.",
    kept: "The counter ended at 2. One thread wrote before the other read, so nothing was lost. Undo a few steps and try running both reads first.",
    figures: {
      counter: "Counter",
      counterHint: "in shared memory, right now",
      lostHint: "an update was lost",
      keptHint: "both updates landed",
      expected: "Expected",
      expectedHint: "two threads, one increment each",
    },
  },

  orders: {
    kicker: "Every order",
    title: "Most orders lose.",
    lede: "Your order was one of twenty. Two threads with three steps each can be interleaved in exactly twenty ways, and the scheduler is free to pick any of them. Here is every one, with the counter it leaves behind.",
    caption:
      "A card is an order of the six steps, A's and B's, left to right. Pick one to see its trace: what each register and the counter held after every step.",
    announce: (order: string, counter: number) => `Order ${order}: the counter ends at ${counter}.`,
    cardLabel: (order: string, counter: number) => `Order ${order}, counter ends at ${counter}`,
    traceCaption: "The chosen order, one step per row",
    stepHeader: "Step",
    regHeader: (name: string) => `${name}'s r`,
    whyLost:
      "Both threads read the counter before either wrote it back. Whatever happens after, both write the same 1.",
    whyRight:
      "One thread finished before the other read anything. These two are the only orders that leave 2.",
    figures: {
      orders: "Orders",
      ordersHint: "6 steps, 3 of them A's",
      lost: "Lose an update",
      lostHint: "the counter ends at 1",
      right: "Come out right",
      rightHint: "one thread entirely first",
    },
  },

  odds: {
    kicker: "Rare, not absent",
    title: "Why it passes the tests.",
    lede: "If most orders lose, why does code like this ever work? Because a real scheduler does not pick orders evenly. It lets a thread run for a while before switching, and a switch has to land inside those three steps to do harm. Here the two threads count higher, two hundred times over.",
    caption:
      "Each dot is one complete run. The scheduler switches at random, on average once per the number of steps set above. The model is deliberately simple; what matters is how finely the two threads' steps interleave.",
    announce: (right: number, runs: number, worst: string, slice: string) =>
      `${right} of ${runs} runs came out right with a switch about every ${slice} steps. The worst run lost ${worst} updates.`,
    setup: (k: string, target: string, slice: string) =>
      `Each thread runs counter++ ${k} times, so a right answer is ${target}. The scheduler switches about every ${slice} steps.`,
    dotsLabel: (right: number, total: number) => `${right} of ${total} runs came out right.`,
    legendRight: (target: string) => `ended at ${target}`,
    legendShort: "ended short",
    running: "Running…",
    runningShort: "Running…",
    allRight:
      "Every run came out right. Ship it? The bug is still there: those three steps can still be split, it just did not happen in two hundred tries.",
    noneRight:
      "Not one run came out right. With switches this frequent, or this much counting, the gap between read and write is hit every time.",
    someRight:
      "Some runs are right and some are not, with the same code and the same input. That is what makes a race hard to find: a test can pass today and fail tomorrow.",
    sliceLabel: "Switch, on average, every",
    sliceValue: (n: string) => `${n} steps`,
    again: (runs: number) => `Run ${runs} more`,
    incrementsLabel: "Increments per thread",
    secondaryLabel: "How much each thread counts",
    figures: {
      right: "Right",
      rightHint: "runs that lost nothing",
      worst: "Worst run",
      worstHint: "updates lost in one run",
      mean: "Lost on average",
      meanHint: "updates per run",
    },
  },

  fix: {
    kicker: "Closing the gap",
    title: "Lock it, or make it one step.",
    lede: "The race lives between the read and the write. There are two standard ways to close that gap: a lock, which lets only one thread at a time into the three steps, and an atomic add, which the processor performs as a single step. Try to lose an update now.",
    hint: {
      none: "No protection: the same three steps as before. You already know how to lose one here.",
      lock: "Run A's first step, then try to slip B in. Its button tells you why you can't.",
      atomic: "One step each. There is nothing to slip between.",
    },
    caption:
      "The lock m is a value in memory too, but only one thread can hold it. A thread that reaches lock(m) while the other holds it waits there.",
    kept: {
      none: "The counter ended at 2 this time. Not because the code is safe: try both reads first.",
      lock: "The counter ended at 2. While one thread held the lock, the other could not even start: the scheduler chose only who went first.",
      atomic:
        "The counter ended at 2. Each add was a single step, so there was never a moment between a read and its write.",
    },
    lost: "The counter ended at 1. Unprotected, both threads read 0 before either wrote.",
    fixLabel: "Protection",
    fixes: { none: "None", lock: "Lock", atomic: "Atomic add" },
    secondaryLabel: "Choose the protection",
    figures: {
      counter: "Counter",
      counterHint: "in shared memory, right now",
      finalHint: "after both threads finished",
      lost: "Orders that lose",
      lostHint: "of every order the scheduler has",
      steps: "Steps per thread",
      stepsHint: "what the protection costs",
    },
  },

  atm: {
    kicker: "Your turn",
    title: "Make the bank pay twice.",
    lede: "Two cash machines share one account with 100 in it, and each tries to withdraw 100. This time every step is already indivisible, the withdrawal included. Can you still get 200 out of an account that holds 100?",
    hint: {
      none: "Each machine checks the balance, then withdraws if there was enough. Find the order that pays out 200.",
      lock: "Now the check and the withdrawal sit inside one lock. Try the same trick.",
    },
    caption:
      "withdraw(100) takes 100 from the balance and pays it out in one indivisible step. The race is not inside any step; it is between two of them.",
    overdrawn:
      "The bank paid out 200 from an account that held 100. Both machines checked while the balance was still 100, then both acted on a check that was no longer true. Every step was atomic, and it still raced.",
    safe: {
      none: "Paid out 100, as it should. The second machine checked after the first had withdrawn. Try letting both check first.",
      lock: "Paid out 100. With the check and the withdrawal under one lock, the second machine checked only after the first was done, and found 0.",
    },
    guardLabel: "Protection",
    guards: { none: "None", lock: "Lock around both" },
    secondaryLabel: "Choose the protection",
    figures: {
      paid: "Paid out",
      paidHint: "the account held 100",
      paidOver: "more than the account held",
      over: "Orders that overpay",
      overHint: "of every order the scheduler has",
    },
  },

  recap: {
    lessons: [
      "A step that looks like one line of code, counter++, is several steps to the processor: read, change, write.",
      "When two threads share memory, the result can depend on the order the scheduler picks, not on the code alone.",
      "Most orders of two unprotected increments lose one; only the orders where one thread finishes first are right.",
      "A race can pass test after test and still be there: how often it shows depends on timing, not on correctness.",
      "A lock or an atomic instruction closes the gap, but only if it covers the whole check-then-act, not each step alone.",
    ],
    footer:
      "The lab simulates the scheduler, because a web page cannot share a plain variable between threads without special browser settings. For two threads and a few steps that loses nothing: a race is a property of the order, and every order is listed exactly.",
  },

  // The guided tours, one per experiment (components/lab/guide/tours.ts).
  tour: {
    intro:
      "Two threads each add 1 to the same counter. You decide which one runs next, and try to lose an update.",
    stages: {
      game: {
        threads:
          "Threads A and B each run counter++ once, in three steps: read, add 1, write. Each button runs its thread's next step.",
        readA: "A reads the counter: 0 goes into its own register.",
        readB: "B reads it too, before A has written, so it also has 0.",
        goal: "From here, in whatever order you finish them, the counter ends at 1, not 2. Finish them and check.",
      },
      orders: {
        cards:
          "All twenty ways to interleave the six steps, each with the counter it leaves behind.",
        open: "Open a card to see its order step by step.",
        count: "Most orders lose an update.",
      },
      odds: {
        runs: "Two threads count to a large number many times. Each run is one dot.",
        slice:
          "How long a thread runs before the scheduler switches. Shorter slices mean more chances to land mid-step.",
        result: "How many runs came out right, the worst one, and the average.",
      },
      fix: {
        threads: "The same game, with a fix in place.",
        lock: "Choose the protection. The tour put a lock around the three steps.",
        run: "Run A's first step, then try to slip B in: its button says why it has to wait.",
        atomic: "Or try an atomic add: one step each, with nothing to slip between.",
      },
      atm: {
        machines: "Two cash machines share one account holding 100. Each wants to withdraw 100.",
        run: "Every step is indivisible, yet the order still matters. Run them and try to get 200 out.",
        options: "The fix is here when you have found the problem.",
      },
    },
  },

  // The learning guide (src/labs/learning.ts): idea names, and why each resource is here.
  study: {
    topics: {
      steps: "counter++ is three steps",
      fix: "Locks and atomic instructions",
      check: "Check, then act",
    },
    notes: {
      "cp-race": "Race conditions acted out at human scale.",
      "ostep-threads": "The same shared counter as the lab, and why it loses updates.",
      "spanning-race": "Protecting the critical section, with Dekker's algorithm.",
      "ostep-locks": "How locks are built, from atomic hardware instructions up.",
      "ostep-bugs": "Atomicity violations in real software (32.2 Non-Deadlock Bugs).",
    },
  },
};

export default copy;
