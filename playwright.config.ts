import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end checks, in a real browser, against the built site.
 *
 * They exist for what unit tests cannot see: a lab that throws on load, a
 * guided tour that no longer matches the stages on the page, a learning guide
 * that does not open. `npm run e2e` builds nothing itself: it serves `dist/`,
 * so run `npm run build` first (CI does).
 */
export default defineConfig({
  testDir: "e2e",
  testMatch: "**/*.e2e.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: "http://localhost:4173",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run preview -- --port 4173 --strictPort",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
