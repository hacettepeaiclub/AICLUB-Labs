/**
 * Checks every resource in the learning guide (src/labs/learning.ts) is still
 * where it says it is.
 *
 * YouTube entries are asked of YouTube's own oEmbed endpoint, which answers
 * with the video's current title and channel: a removed video fails, and a
 * renamed one is reported. Everything else is requested directly.
 *
 * Run by hand, every few months: `node tools/check-learning.mjs`. It is not
 * part of CI, because a site being briefly down is not a broken build.
 */

import { createServer } from "vite";

const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
});
const { RESOURCES } = await server.ssrLoadModule("/src/labs/learning.ts");
await server.close();

// Asked as a browser would ask: several publishers refuse anything else.
const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/pdf;q=0.9,*/*;q=0.8",
};

/** Lowercase words, for telling a renamed video from a tidied-up title. */
const words = (s) => new Set(s.toLowerCase().match(/[a-z0-9]+/g) ?? []);

let problems = 0;
for (const [id, r] of Object.entries(RESOURCES)) {
  try {
    if (r.url.includes("youtube.com/watch")) {
      const res = await fetch(
        `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(r.url)}`,
      );
      if (!res.ok) throw new Error(`oEmbed ${res.status}`);
      const { title, author_name: channel } = await res.json();
      // Our titles add the course and term in brackets; YouTube's do not.
      const ours = words(r.title.replace(/\s*\([^)]*\)$/, ""));
      const shared = [...ours].filter((w) => words(title).has(w)).length;
      if (shared < ours.size / 2) console.log(`~ ${id}: now titled "${title}" (${channel})`);
    } else {
      const res = await fetch(r.url, { redirect: "follow", headers });
      // A publisher turning away a script is not a missing page.
      if (res.status === 403 || res.status === 429)
        console.log(`? ${id}: ${res.status}, check by hand`);
      else if (!res.ok) throw new Error(`HTTP ${res.status}`);
    }
  } catch (error) {
    problems++;
    console.log(`✗ ${id}: ${r.url} (${error.message})`);
  }
}
console.log(
  problems ? `${problems} problem(s).` : `All ${Object.keys(RESOURCES).length} resources answered.`,
);
process.exitCode = problems ? 1 : 0;
