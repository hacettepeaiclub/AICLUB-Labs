/**
 * Matching for the lab finder. No DOM, no React — just strings in, an ordered
 * list out, so it can be tested on its own.
 */

/**
 * Text reduced to what a person typing it would expect to match.
 *
 * Case and diacritics both go, and the dotted and dotless I are made one
 * letter. That last step is the one that matters here: this site is read in
 * Turkish, where `toLowerCase()` turns "İ" into "i̇" (an i with a combining
 * dot) and leaves "ı" as its own letter, so "olasılık" would not match a
 * query of "olasilik" and "İstatistik" would not match "istatistik". Someone
 * typing fast on an English keyboard should still find both. Decomposing
 * first and then dropping the combining marks handles ğ, ş, ç, ö, ü and İ in
 * one pass; ı has no decomposition and is mapped by hand.
 */
export function fold(text: string): string {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ı/g, "i").toLowerCase();
}

export interface Searchable {
  /** What the entry is called, in the reader's language. Ranked highest. */
  title: string;
  /**
   * Everything else worth matching — the description, the field, the English
   * name and the slug — so a query in either language finds the lab.
   */
  rest: string;
}

/**
 * How well one entry answers the query. Lower is better; `null` is no match.
 *
 * Every word of the query has to appear somewhere. Among those that match,
 * the title starting with the query beats a word in the title starting with
 * it, which beats the title merely containing it, which beats a match only in
 * the description. That order is what makes two keystrokes enough: "gr"
 * should put Gradient Descent first, not whichever lab mentions a graph.
 */
function rank(query: string, entry: Searchable): number | null {
  const title = fold(entry.title);
  const all = `${title} ${fold(entry.rest)}`;
  const words = query.split(/\s+/).filter(Boolean);
  if (!words.every((word) => all.includes(word))) return null;

  if (title.startsWith(query)) return 0;
  if (title.split(/\s+/).some((word) => word.startsWith(words[0] ?? ""))) return 1;
  if (title.includes(query)) return 2;
  return 3;
}

/**
 * The entries that match `query`, best first.
 *
 * An empty query returns everything in the order given — which is the
 * collection's own reading order, and the right answer to "show me the labs".
 * Among equally good matches that order is kept too, so the list never
 * shuffles itself for no reason the reader can see.
 */
export function search<T extends Searchable>(query: string, entries: readonly T[]): T[] {
  const q = fold(query.trim());
  if (!q) return [...entries];
  return entries
    .map((entry, index) => ({ entry, index, score: rank(q, entry) }))
    .filter((hit): hit is { entry: T; index: number; score: number } => hit.score !== null)
    .sort((a, b) => a.score - b.score || a.index - b.index)
    .map((hit) => hit.entry);
}
