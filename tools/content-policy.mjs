import ts from "typescript";
import fs from "node:fs";
import path from "node:path";

export { isEnglishHeading } from "../src/i18n/headingPolicy.ts";
import { isEnglishHeading } from "../src/i18n/headingPolicy.ts";
export function properties(file) {
  const source = ts.createSourceFile(
    file,
    fs.readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
  );
  const result = new Map();
  function walk(node, keys = []) {
    if (ts.isPropertyAssignment(node)) {
      const key = [...keys, node.name.text ?? node.name.getText(source)].join(".");
      result.set(key, { node: node.initializer, source });
      if (ts.isObjectLiteralExpression(node.initializer))
        node.initializer.properties.forEach((n) => walk(n, key.split(".")));
      return;
    }
    ts.forEachChild(node, (n) => walk(n, keys));
  }
  walk(source);
  return result;
}
export function rewrite(file, changes) {
  let text = fs.readFileSync(file, "utf8");
  const props = properties(file),
    edits = [];
  for (const [key, value] of Object.entries(changes)) {
    const entry = props.get(key);
    if (!entry) throw Error(`${file}: missing ${key}`);
    edits.push([entry.node.getStart(entry.source), entry.node.end, value]);
  }
  for (const [start, end, value] of edits.sort((a, b) => b[0] - a[0]))
    text = text.slice(0, start) + value + text.slice(end);
  fs.writeFileSync(file, text);
}
export function syncHeadings() {
  const pairs = [
    ["src/i18n/en.ts", "src/i18n/tr.ts"],
    ...fs
      .readdirSync("src/i18n/labs/en")
      .filter((f) => f.endsWith(".ts") && f !== "index.ts")
      .map((f) => [`src/i18n/labs/en/${f}`, `src/i18n/labs/tr/${f}`]),
  ];
  for (const [english, turkish] of pairs) {
    const changes = {},
      source = properties(english),
      target = properties(turkish);
    for (const [key, { node, source: ast }] of source)
      if (isEnglishHeading(key) && target.has(key) && !ts.isObjectLiteralExpression(node))
        changes[key] = node.getText(ast);
    rewrite(turkish, changes);
  }
}
if (process.argv.includes("--sync")) syncHeadings();
if (process.argv.includes("--inventory")) {
  for (const file of fs
    .readdirSync("src/i18n/labs/tr")
    .filter((f) => f.endsWith(".ts") && f !== "index.ts")) {
    console.log("\nFILE", file);
    for (const [key, { node, source }] of properties(path.join("src/i18n/labs/tr", file)))
      if (
        !isEnglishHeading(key) &&
        /(?:lede|question|honesty|scope|caption|footer|hint|intro|note)$/i.test(
          key.split(".").at(-1),
        ) &&
        node.getText(source).length > 55
      )
        console.log(key + ": " + node.getText(source));
  }
}
