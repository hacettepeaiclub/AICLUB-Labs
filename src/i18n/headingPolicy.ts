/** Visible titles use the English copy in both locales. Controls and prose stay localised. */
export const isEnglishHeading = (key: string): boolean =>
  /(?:title|heading|kicker)$/i.test(key.split(".").at(-1) ?? "") ||
  key.startsWith("study.topics.") ||
  key.includes(".study.topics.") ||
  /^labMeta\.[^.]+\.term$/.test(key) ||
  key.endsWith(".coachLabel") ||
  [
    "coachLabel",
    "home.labs",
    "home.experiments",
    "home.otherLabs",
    "common.nextLab",
    "common.endOfCollection",
    "guide.tourLabel",
    "learn.dialogKicker",
    "scheduler.memory",
    "scheduler.thread",
    "sorterA",
    "sorterB",
    "liveTraining",
    "theRace",
    "guess.sectionLabel",
  ].some((part) => key === part || key.endsWith("." + part));
