import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * The two server-side files that have each taken the site down or made it
 * unsafe once. Neither runs in a test, so these read them and hold the lines
 * that matter. docs/DEPLOY.md says why each one is there.
 */

const nginx = readFileSync("deploy/labs-nginx.conf", "utf8").replace(/#[^\n]*/g, "");
const deploy = readFileSync(".github/workflows/deploy.yml", "utf8")
  .split("\n")
  .filter((line) => !line.trim().startsWith("#"))
  .join("\n");

describe("the nginx that serves the site", () => {
  it("keeps https when it adds a trailing slash", () => {
    expect(nginx).toMatch(/absolute_redirect\s+off;/);
  });

  it("compresses text, including behind the proxy", () => {
    expect(nginx).toMatch(/gzip\s+on;/);
    expect(nginx).toMatch(/gzip_proxied\s+any;/);
    expect(nginx).toMatch(/application\/javascript/);
    expect(nginx).toMatch(/text\/css/);
  });

  it("caches the hashed bundles for a year and revalidates pages", () => {
    const assets = nginx.slice(nginx.indexOf("location /assets/"));
    expect(assets).toMatch(/max-age=31536000, immutable/);
    const pages = nginx.slice(nginx.indexOf("location / {"));
    expect(pages).toMatch(/Cache-Control "no-cache"/);
  });

  it("serves the prerendered page, and a real 404 for an address with none", () => {
    // Every route is a file, so there is nothing to fall back to: the old
    // `/index.html` fallback answered 200 to any address at all.
    expect(nginx).toMatch(/try_files \$uri \$uri\/ =404;/);
    expect(nginx).not.toMatch(/try_files[^;]*\/index\.html;/);
    expect(nginx).toMatch(/error_page 404 \/404\.html;/);
  });

  it("sends the security headers from every location", () => {
    // An add_header inside a location drops every inherited one, so each
    // location has to carry its own.
    for (const location of ["location /assets/", "location / {"]) {
      const block = nginx.slice(nginx.indexOf(location)).split("}")[0] ?? "";
      expect({ location, hsts: /Strict-Transport-Security/.test(block) }).toEqual({
        location,
        hsts: true,
      });
      expect({ location, nosniff: /X-Content-Type-Options "nosniff"/.test(block) }).toEqual({
        location,
        nosniff: true,
      });
      expect({
        location,
        referrer: /Referrer-Policy "strict-origin-when-cross-origin"/.test(block),
      }).toEqual({
        location,
        referrer: true,
      });
      expect({ location, permissions: /Permissions-Policy "camera=\(\)/.test(block) }).toEqual({
        location,
        permissions: true,
      });
    }
  });
});

describe("the deploy", () => {
  it("writes into dist/ and never replaces it", () => {
    // The web server's container mounts dist/; a renamed-in directory is one
    // the container cannot see, which took the site down on 2026-10-12.
    expect(deploy).toMatch(/rsync -a --delete-after dist-next\/ dist\//);
    expect(deploy).not.toMatch(/mv\s+dist-next\s+dist/);
    expect(deploy).not.toMatch(/mv\s+dist\s/);
    expect(deploy).not.toMatch(/rm -rf dist(\s|$)/m);
  });

  it("ships the build CI checked, and builds nothing on the server", () => {
    expect(deploy).toMatch(/needs: checks/);
    expect(deploy).toMatch(/actions\/download-artifact@v4/);
    expect(deploy).not.toMatch(/npm (ci|install|run)/);
    expect(deploy).not.toMatch(/git pull/);
    expect(deploy).toMatch(/set -e/);
  });

  it("refuses an unknown host key", () => {
    expect(deploy).toMatch(/StrictHostKeyChecking=yes/);
    expect(deploy).toMatch(/SSH_KNOWN_HOSTS/);
  });
});
