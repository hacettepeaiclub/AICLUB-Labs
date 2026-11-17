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
    // Functional checks exclude decorative WebGL and entrance animations.
    contextOptions: { reducedMotion: "reduce" },
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      testIgnore: ["motion.e2e.ts", "mobile.e2e.ts"],
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "chromium-motion",
      testMatch: "motion.e2e.ts",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 960, height: 720 },
        contextOptions: { reducedMotion: "no-preference" },
      },
    },
    {
      name: "chromium-mobile",
      testMatch: "mobile.e2e.ts",
      use: { ...devices["Pixel 7"] },
    },
    {
      name: "webkit-mobile",
      testMatch: "mobile.e2e.ts",
      use: { ...devices["iPhone 13"] },
    },
    // Failed module preloads recover differently in WebKit; keep that path covered in CI.
    { name: "webkit", testMatch: "errors.e2e.ts", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: {
    command: "npm run preview -- --port 4173 --strictPort",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
