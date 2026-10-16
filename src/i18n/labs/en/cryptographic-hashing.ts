/** English prose for the cryptographic-hashing lab. Its shape is the contract `tr/cryptographic-hashing.ts` must meet. */

const copy = {
  sources: {
    title: "Sources",
    sha2: "Defines SHA-256, the digest this lab asks the browser's Web Crypto implementation for. The lab does not implement the hash itself.",
  },
  inputLabel: "Your message",
  inputPlaceholder: "hello world",
  copy: "Copy",
  copied: "Copied",
  copyHash: "Copy digest",
  hashCopied: "Digest copied",

  /**
   * When the browser will not hash.
   *
   * Two causes, two sentences: the lab says the one it actually detected
   * rather than blaming HTTPS for every failure. Nothing here is faked —
   * without the real SHA-256 there is no experiment to show.
   */
  unavailable: {
    title: "This lab cannot run here.",
    insecureContext:
      "This lab needs a secure connection (HTTPS) to compute hashes in your browser. Opening this page over https:// should fix it.",
    unsupported:
      "Your browser did not make its hashing built-in (Web Crypto) available, so there is no digest to show. It may be disabled by a setting or an extension.",
    note: "Nothing is faked here: without the browser's real SHA-256 there is nothing honest to display.",
  },

  figures: {
    messageLength: "Message",
    characters: "characters in",
    digestLength: "Digest",
    hexChars: "hex characters out",
    digestBits: "Bits",
    alwaysBits: "however long the message",
    bitsChanged: "Bits changed",
    percentChanged: "Of the digest",
    expectedHalf: "about half is expected",
    charsChanged: "Hex characters changed",
    ofSixtyFour: "of 64",
  },

  hero: {
    title: "What comes out",
    question: "Can two different messages produce the same length of output?",
    digestLabel: "SHA-256 digest",
    caption:
      "Type anything at all. However long the message, exactly 64 hex characters come back, and none of the message is in them.",
    help: "Type a message. Its SHA-256 digest appears below the field and updates as you type.",
    announce: (start: string) => `Digest updated, now starting ${start}.`,
  },

  determinism: {
    kicker: "Same message, same digest",
    title: "It answers the same way every time.",
    lede: "Hash the message again. Nothing is cached and nothing is copied from the run before: each press is a fresh call to SHA-256 on the same string.",
    hashAgain: "Hash it again",
    enough: "That is enough runs",
    empty: "No runs yet. Press the button to hash this message.",
    run: (n: number) => `Run ${n}`,
    runsLabel: "Runs",
    distinctLabel: "Distinct digests",
    distinctHint: "however many runs",
    caption:
      "Editing the message clears the list, because a run of the old message says nothing about the new one.",
    announce: (runs: number, distinct: number) =>
      `${runs} runs, ${distinct} distinct digest${distinct === 1 ? "" : "s"}.`,
  },

  avalanche: {
    kicker: "One tiny change",
    title: "One keystroke rewrites everything.",
    lede: "Change a single character and compare the two digests. Every character that differs is marked in both: struck through in the one that is gone, underlined in the one that replaced it.",
    before: "Before",
    after: "After",
    fieldLabel: "Change one character",
    help: "Edit the message. The digest before your edit and the digest after it are compared character by character above.",
    editPrompt: "Change a character in the message to compare two digests.",
    caption:
      "The count is measured across the two real digests, bit by bit, not estimated, and not animated towards a number.",
    announce: (changed: number, total: number, percent: number) =>
      `${changed} of ${total} bits changed, ${percent} percent of the digest.`,
  },

  bits: {
    gridLabel: (total: number, ones: number, zeros: number, flipped: number) =>
      `The ${total} bits of the current digest as a 16 by 16 grid. ${ones} are 1, ${zeros} are 0. ${flipped} changed in the last edit.`,
    legendOne: "bit is 1",
    legendZero: "bit is 0",
    legendChanged: "changed",
  },

  challenge: {
    kicker: "The challenge",
    title: "Can you make two different messages produce the same digest?",
    lede: "Not the whole digest. Start with its first character. Each round asks for one more, and each round is sixteen times less likely than the one before. That curve is the heart of collision resistance, and this is the only honest way to feel it: no collision is found here, and none is faked.",
    inputA: "Message A",
    inputB: "Message B",
    identical:
      "Both messages are identical, so the digests match by definition. A collision needs two different messages.",
    target: (round: number, odds: string) =>
      `Round ${round}: share the first ${round} hex character${round === 1 ? "" : "s"}. Odds per guess: 1 in ${odds}.`,
    nextRound: (round: number) => `Round ${round}, sixteen times harder`,
    keepTrying: "Keep trying",
    maxRound: "That is where people stop",
    matchedLabel: "Shared prefix",
    roundLabelFull: "Round",
    oddsHint: (odds: string) => `1 in ${odds} per guess`,
    bestLabel: "Best so far",
    attemptsLabel: "Attempts",
    ladderLabel: (matched: number, total: number, round: number) =>
      `Shared prefix: ${matched} of ${total} hex characters match. This round needs ${round}.`,
    caption:
      "Matching all 64 characters by chance is 1 in 2^256. Even the birthday shortcut needs about 2^128 hashes: hashing a trillion per second, roughly 10^19 years.",
    announce: (matched: number, total: number, best: number, round: number) =>
      `${matched} of ${total} leading characters match. Best so far ${best}. Round ${round} needs ${round}.`,
  },

  usage: {
    kicker: "In the wild",
    title: "Where digests turn up.",
    lede: "The same fixed-size fingerprint, used five different ways.",
    items: {
      git: {
        label: "Git",
        body: "Git identifies each commit by hashing its content and its parent's hash. Rewrite any line in history and every hash after it changes, tampering is visible.",
      },
      passwords: {
        label: "Passwords",
        body: "Servers store a salted password hash, so a leaked database holds hashes rather than passwords. The function is not SHA-256 though: password storage uses a deliberately slow hash such as Argon2id, scrypt, bcrypt or PBKDF2, so that guessing stays expensive.",
      },
      https: {
        label: "HTTPS",
        body: "TLS uses hashes to fingerprint certificates and to verify that data was not altered in transit. A single flipped byte breaks the hash.",
      },
      blockchain: {
        label: "Blockchain",
        body: "A block contains the previous block's hash, chaining them together. Change an old block and every later hash breaks, which is what makes the ledger tamper-evident.",
      },
      signatures: {
        label: "Signatures",
        body: "A digital signature is made over a document's hash rather than the document. Anyone can re-hash the document and check the signature.",
      },
    },
  },

  recap: {
    lessons: [
      "The same message always produces the same digest, and the digest is the same length whatever went in",
      "Changing one character changes about half of the 256 bits: the avalanche effect, measured here rather than asserted",
      "Each extra hex character two digests share is sixteen times less likely, which is why matching all 64 is out of reach",
    ],
    footer:
      'Nothing on this page is stored or simulated: every digest is crypto.subtle.digest("SHA-256", …) on what you typed, computed in your browser.',
  },

  // The guided tours, one per experiment (components/lab/guide/tours.ts).
  tour: {
    intro:
      "Whatever you type turns into 64 hex characters. You change one character and count how much of the result changes.",
    stages: {
      digest: {
        type: "Type anything in this box. The tour added an exclamation mark to the end.",
        digest: "One character more, and about half of the digest's bits changed.",
        length: "The message can be any length; the digest is always 64 hex characters, 256 bits.",
      },
      determinism: {
        again: "Hash the same message again. Each press is a fresh SHA-256 call.",
        runs: "Every run lands in this list, and every one is the same digest.",
        distinct: "Runs so far, and how many different digests they gave: always one.",
      },
      avalanche: {
        edit: "Change the message here. The tour added one letter.",
        compare: "The digest before and after. Every character that differs is marked in both.",
        count: "Bits changed, counted one by one across the two real digests: about half.",
      },
      collision: {
        fields: "Two messages, two digests. The goal is for their first characters to match.",
        type: "Change the second message and try again. The tour added a letter.",
        rounds:
          "Each round asks for one more matching character, and is sixteen times harder than the last.",
      },
    },
  },

  // The learning guide (src/labs/learning.ts): idea names, and why each resource is here.
  study: {
    topics: {
      digest: "Fixed length, same answer every time",
      collision: "Collision resistance",
    },
    notes: {
      "paar-hash": "A university lecture on what a hash function must guarantee.",
      "mit-6046-hash": "MIT's lecture on cryptographic hash functions and their properties.",
      "cp-birthday": "Why collisions come sooner than expected, and what that means for a digest.",
      "3b1b-256bit": "How large 2²⁵⁶ really is, and why searching it is out of reach.",
    },
  },
};

export default copy;
