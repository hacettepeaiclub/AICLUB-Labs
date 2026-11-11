export const isEnglishHeading = (key: string): boolean =>
  key === "home.title" || /^labMeta\.[^.]+\.title$/.test(key);
