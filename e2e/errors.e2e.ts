import { expect, test, type Page } from "@playwright/test";

/**
 * The error screens, driven by real failures.
 *
 * Every failure here is made by blocking or rewriting a network request, as
 * a bad connection or a broken file would; nothing in the app has a switch
 * for it. Each test sets up its own failure and depends on no other.
 */

test.beforeEach(async ({ page, browserName }) => {
  // A test run is not a visit: the analytics script never loads.
  await page.route("**/cloud.umami.is/**", (route) => route.abort());
  // The built pages' security policy says `upgrade-insecure-requests`, right
  // for the real site on https. Chromium exempts localhost from it; WebKit
  // does not, and would ask https://localhost for every file of this plain
  // http preview. Only here, only in WebKit, the page arrives without it.
  if (browserName === "webkit") {
    await page.route(
      (url) => url.hostname === "localhost",
      async (route) => {
        if (route.request().resourceType() !== "document") return route.fallback();
        const response = await route.fetch();
        const body = (await response.text()).replace(/upgrade-insecure-requests;?\s*/g, "");
        return route.fulfill({ response, body });
      },
    );
  }
  await page.addInitScript(() => {
    localStorage.setItem("aiclub-labs-language", "en");
  });
});

/**
 * The learning guide's list of resources: a worker script, in the build
 * (`assets/guide.worker-*.js`) and on the dev server (`guide.worker.ts`).
 */
const GUIDE_WORKER = /\/guide\.worker[^/]*\.(js|ts)(\?.*)?$/;
/** The PCA lab's English words, its own chunk. */
const PCA_COPY = /\/assets\/pca-[^/?]+\.js$/;
/** The home page, its own chunk: blocked, the whole page fails, not one lab. */
const HOME_CHUNK = /\/assets\/HomePage-[^/?]+\.js(\?.*)?$/;

/** From a lab, go to the home page while its chunk cannot be downloaded. */
async function openHomeThatCannotLoad(page: Page) {
  await page.goto("/labs/pca/");
  await expect(page.getByRole("heading", { level: 1, name: "The Widest Shadow" })).toBeVisible();
  await page.route(HOME_CHUNK, (route) => route.abort());
  await page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "All labs" })
    .click();
}

/** A mark on the page that only survives if the page is never reloaded. */
const markDocument = (page: Page) =>
  page.evaluate(() => {
    (window as unknown as { sameDocument: boolean }).sameDocument = true;
  });
const isSameDocument = (page: Page) =>
  page.evaluate(() => (window as unknown as { sameDocument?: boolean }).sameDocument === true);

/** Open the PCA lab and move a slider off its starting value. */
async function openLabAndChangeInput(page: Page) {
  await page.goto("/labs/pca/");
  const slider = page.getByRole("slider", { name: "v, around" });
  await slider.focus();
  for (let i = 0; i < 4; i++) await slider.press("ArrowRight");
  const value = await slider.inputValue();
  expect(value).not.toBe("20");
  return { slider, value };
}

const guideSection = (page: Page) =>
  page.locator("section", {
    has: page.getByRole("heading", { name: "Take this lab's ideas further" }),
  });

/**
 * Answer the site's "are you there?" check (a HEAD request for the home
 * address) slowly and with a failure, counting the requests and how many
 * were open at once.
 */
async function serverCheckFails(page: Page, delay = 1500) {
  const probes = { count: 0, open: 0, maxOpen: 0 };
  await page.route(
    (url) => url.pathname === "/",
    async (route) => {
      if (route.request().method() !== "HEAD") return route.continue();
      probes.count++;
      probes.open++;
      probes.maxOpen = Math.max(probes.maxOpen, probes.open);
      await new Promise((resolve) => setTimeout(resolve, delay));
      probes.open--;
      return route.fulfill({ status: 503, body: "" });
    },
  );
  return probes;
}

test("a learning guide that cannot download says so in its own section, and the lab keeps its state", async ({
  page,
  context,
}) => {
  const { slider, value } = await openLabAndChangeInput(page);
  await markDocument(page);
  // Context-wide, so the worker's own script request is covered too.
  await context.route(GUIDE_WORKER, (route) => route.abort());

  await page.getByRole("button", { name: "Open the learning guide" }).click();

  const section = guideSection(page);
  await expect(section.getByRole("alert")).toHaveText(
    "The learning guide couldn't load. You can try again.",
  );
  await expect(section.getByRole("button", { name: "Try again" })).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  // The lab is untouched: its title, its controls and what was set in them.
  await expect(page.getByRole("heading", { level: 1, name: "The Widest Shadow" })).toBeVisible();
  await expect(slider).toHaveValue(value);
  expect(await isSameDocument(page)).toBe(true);
});

test("retrying the learning guide downloads it again and opens it, without reloading the page", async ({
  page,
  context,
}) => {
  const { slider, value } = await openLabAndChangeInput(page);
  await markDocument(page);
  await context.route(GUIDE_WORKER, (route) => route.abort());
  await page.getByRole("button", { name: "Open the learning guide" }).click();
  await expect(guideSection(page).getByRole("alert")).not.toBeEmpty();

  // The network recovers. The retry must really ask for the file again.
  await context.unroute(GUIDE_WORKER);
  const requests: string[] = [];
  await context.route(GUIDE_WORKER, (route) => {
    requests.push(route.request().url());
    return route.continue();
  });
  await guideSection(page).getByRole("button", { name: "Try again" }).click();

  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog").getByRole("link").first()).toBeVisible();
  expect(requests).toHaveLength(1);
  await expect(guideSection(page).getByRole("alert")).toBeEmpty();
  await expect(slider).toHaveValue(value);
  expect(await isSameDocument(page)).toBe(true);
});

test("pressing the guide's retry repeatedly starts one download, and says it is trying", async ({
  page,
  context,
}) => {
  await openLabAndChangeInput(page);
  await context.route(GUIDE_WORKER, (route) => route.abort());
  await page.getByRole("button", { name: "Open the learning guide" }).click();
  await expect(guideSection(page).getByRole("alert")).not.toBeEmpty();

  // The next download works, slowly enough to press the button during it.
  await context.unroute(GUIDE_WORKER);
  const requests: string[] = [];
  await context.route(GUIDE_WORKER, async (route) => {
    requests.push(route.request().url());
    const response = await route.fetch();
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return route.fulfill({ response });
  });
  const button = guideSection(page).getByRole("button", { name: /Try again|Trying…/ });
  await button.evaluate((element: HTMLButtonElement) => {
    for (let i = 0; i < 5; i++) element.click();
  });
  await expect(button).toHaveText("Trying…");
  await expect(button).toHaveAttribute("aria-disabled", "true");

  await expect(page.getByRole("dialog")).toBeVisible();
  expect(requests).toHaveLength(1);
});

test("offline, a lab not downloaded yet says there is no connection, and loads once it is back", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await context.setOffline(true);

  await page.locator('a[href="/labs/pca/"]').first().click();
  await expect(page.getByRole("heading", { name: "No connection." })).toBeVisible();
  await expect(page.getByText("[ waiting ]")).toBeVisible();
  await expect(page.getByRole("button", { name: "Try again" })).toBeVisible();

  // Back online: the page checks the site answers, then loads the lab itself.
  const reloaded = page.waitForEvent("load");
  await context.setOffline(false);
  await reloaded;
  await expect(page).toHaveURL(/\/labs\/pca\/$/);
  await expect(page.getByRole("heading", { level: 1, name: "The Widest Shadow" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "No connection." })).toHaveCount(0);
});

test("a recovery whose reload still fails reloads once, then leaves it to the visitor", async ({
  page,
  context,
}) => {
  test.setTimeout(45_000);
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await context.setOffline(true);
  await page.locator('a[href="/labs/pca/"]').first().click();
  await expect(page.getByRole("heading", { name: "No connection." })).toBeVisible();

  // The site answers again, but the lab's words still cannot be downloaded.
  await context.route(PCA_COPY, (route) => route.abort());
  let loads = 0;
  page.on("load", () => loads++);
  await context.setOffline(false);

  await expect(page.getByRole("heading", { name: "The lab couldn't load." })).toBeVisible({
    timeout: 15_000,
  });
  // Long enough for every automatic retry there is; none may reload again.
  await page.waitForTimeout(15_000);
  expect(loads).toBe(1);
  await expect(page.getByRole("heading", { name: "The lab couldn't load." })).toBeVisible();
  await expect(page.getByRole("button", { name: "Try again" })).toBeVisible();
});

test("a page that cannot load has an h1 title, and pressing retry repeatedly makes one attempt at a time", async ({
  page,
}) => {
  await openHomeThatCannotLoad(page);
  // The whole page failed, so its error title is the page's h1.
  await expect(
    page.getByRole("heading", { level: 1, name: "The page couldn't load." }),
  ).toBeVisible();
  // The site's header and navigation are still there.
  await expect(
    page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "All labs" }),
  ).toBeVisible();

  const probes = await serverCheckFails(page);
  const retry = page.getByRole("button", { name: /Try again|Trying…/ });
  await retry.evaluate((button: HTMLButtonElement) => {
    for (let i = 0; i < 5; i++) button.click();
  });
  await expect(retry).toHaveText("Trying…");
  await expect(retry).toHaveAttribute("aria-disabled", "true");

  await expect(page.getByText("Still can't reach the site.")).toBeVisible();
  await expect(retry).toHaveText("Try again");
  await expect(retry).not.toHaveAttribute("aria-disabled");
  expect(probes.count).toBe(1);
  expect(probes.maxOpen).toBe(1);
});

test("the connection flapping starts one recovery at a time, and it stops after a few tries", async ({
  page,
  context,
}) => {
  test.setTimeout(45_000);
  await openHomeThatCannotLoad(page);
  await expect(page.getByRole("heading", { name: "The page couldn't load." })).toBeVisible();
  const probes = await serverCheckFails(page, 0);

  await context.setOffline(true);
  await expect(page.getByRole("heading", { name: "No connection." })).toBeVisible();
  await context.setOffline(false);
  await expect.poll(() => probes.count).toBeGreaterThan(0);
  await context.setOffline(true);
  await expect(page.getByRole("heading", { name: "No connection." })).toBeVisible();
  await context.setOffline(false);

  // One loop asks a few times over about thirteen seconds, then gives up.
  await expect(page.getByText("Still can't reach the site.")).toBeVisible();
  await page.waitForTimeout(15_000);
  const settled = probes.count;
  expect(settled).toBeGreaterThanOrEqual(2);
  expect(settled).toBeLessThanOrEqual(4);
  expect(probes.maxOpen).toBe(1);
  await page.waitForTimeout(4_000);
  expect(probes.count).toBe(settled);
});

test("an experiment that breaks can be restarted, and says so when the restart breaks too", async ({
  page,
}) => {
  // The lab's words are served through a stand-in that throws when the first
  // stage reads them, for as long as the page's `breakPca` flag is set.
  await page.addInitScript(() => {
    (window as unknown as { breakPca: boolean }).breakPca = true;
  });
  await page.route(PCA_COPY, (route) => {
    const real = `${new URL(route.request().url()).pathname}?real`;
    return route.fulfill({
      contentType: "text/javascript",
      body: `import real from "${real}";
export default new Proxy(real, {
  get(target, key, receiver) {
    if (key === "turn" && window.breakPca) throw new Error("the first stage broke");
    return Reflect.get(target, key, receiver);
  },
});`,
    });
  });

  await page.goto("/labs/pca/");
  // Inside the lab, its own title stays the h1 and the failure is an h2.
  await expect(
    page.getByRole("heading", { level: 2, name: "Something went wrong." }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { level: 1, name: "The Widest Shadow" })).toBeVisible();
  await markDocument(page);

  const restart = page.getByRole("button", { name: "Restart the experiment" });
  await restart.click();
  await expect(page.getByText("It stopped again. You can try reloading the page.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Reload page" })).toBeVisible();

  await page.evaluate(() => {
    (window as unknown as { breakPca: boolean }).breakPca = false;
  });
  await restart.click();
  await expect(page.getByRole("slider", { name: "v, around" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Something went wrong." })).toHaveCount(0);
  expect(await isSameDocument(page)).toBe(true);
});

test("leaving a failed lab during preload recovery does not reload the new page", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await context.setOffline(true);
  await page.locator('a[href="/labs/pca/"]').first().click();
  await expect(page.getByRole("heading", { name: "No connection." })).toBeVisible();

  let release!: () => void;
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  let started!: () => void;
  const warming = new Promise<void>((resolve) => {
    started = resolve;
  });
  let finished!: () => void;
  const warmed = new Promise<void>((resolve) => {
    finished = resolve;
  });
  await context.route(PCA_COPY, async (route) => {
    const response = await route.fetch();
    started();
    await held;
    await route.fulfill({ response });
    finished();
  });

  await context.setOffline(false);
  try {
    await warming;
    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "All labs" })
      .click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await markDocument(page);
    let navigations = 0;
    page.on("framenavigated", (frame) => {
      if (frame === page.mainFrame()) navigations++;
    });
    release();
    await warmed;
    // A stale recovery would navigate as soon as the held response arrives.
    await page.waitForTimeout(1000);
    expect(navigations).toBe(0);
    expect(await isSameDocument(page)).toBe(true);
  } finally {
    release();
  }
});
