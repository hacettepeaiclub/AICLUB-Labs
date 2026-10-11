import type { ReactNode } from "react";

/**
 * `text`, with the first occurrence of `word` marked as English.
 *
 * For an English word inside a Turkish sentence: the example sentence the
 * attention lab works on, or a name like "JavaScript". Two things go wrong
 * when it is not marked. Set in capitals, Turkish rules turn `i` into `İ`, so
 * "it" became "İT" and "JavaScript" became "JAVASCRİPT". And a screen reader
 * reads the word with a Turkish voice. Marking the word alone, not the whole
 * line, keeps the Turkish around it capitalised the Turkish way.
 *
 * On an English page the mark changes nothing; returns `text` untouched when
 * `word` is not in it.
 */
export function markEnglish(text: string, word: string): ReactNode {
  const at = word ? text.indexOf(word) : -1;
  if (at === -1) return text;
  return (
    <>
      {text.slice(0, at)}
      <span lang="en">{word}</span>
      {text.slice(at + word.length)}
    </>
  );
}
