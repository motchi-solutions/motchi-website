import { expect, test } from "@playwright/test";
import { open } from "./support.ts";

type Manifest = {
  name: string;
  start_url: string;
  display: string;
  icons: { src: string; sizes: string; purpose: string }[];
  shortcuts: { url: string }[];
  screenshots: { src: string; sizes: string; form_factor: string }[];
};

/* Installability: a complete manifest whose icons, shortcuts and screenshots
   all load. Runs once (the files are the same for every device). */
test.describe("app manifest", () => {
  test.skip(({ isMobile }) => isMobile, "Checked once.");

  test("describes an installable app with working icons and shortcuts", async ({
    request,
  }) => {
    const manifest = (await (
      await request.get("/manifest.webmanifest")
    ).json()) as Manifest;
    expect(manifest.name).toBe("Motchi Solutions");
    expect(manifest.start_url).toBe("/");
    expect(manifest.display).toBe("standalone");

    const purposes = manifest.icons.map(
      (icon) => `${icon.sizes} ${icon.purpose}`,
    );
    expect(purposes).toEqual(
      expect.arrayContaining([
        "192x192 any",
        "512x512 any",
        "192x192 maskable",
        "512x512 maskable",
      ]),
    );

    for (const file of [...manifest.icons, ...manifest.screenshots]) {
      const response = await request.get(file.src);
      expect(response.status(), file.src).toBe(200);
    }
    expect(manifest.screenshots.map((shot) => shot.form_factor).sort()).toEqual(
      ["narrow", "wide"],
    );
    for (const shortcut of manifest.shortcuts)
      expect((await request.get(shortcut.url)).status(), shortcut.url).toBe(
        200,
      );
  });

  test("the service worker is never cached and the offline page is not indexed", async ({
    request,
  }) => {
    const worker = await request.get("/sw.js");
    expect(worker.headers()["cache-control"]).toContain("no-store");
    expect(worker.headers()["content-type"]).toContain("javascript");
    const offline = await (await request.get("/offline")).text();
    expect(offline).toContain("noindex");
  });
});

/* The service worker registers on production builds only (see
   ServiceWorker), so these run in CI or with CI=1 locally. */
test.describe("offline support", () => {
  test.skip(!process.env.CI, "Runs against the production build.");

  test("an offline navigation shows the offline page, then recovers", async ({
    page,
    context,
  }) => {
    await open(page, "/");
    await page.evaluate(() => navigator.serviceWorker.ready);
    // Reload so the now-active worker controls the page.
    await page.reload();
    await expect
      .poll(() => page.evaluate(() => !!navigator.serviceWorker.controller))
      .toBe(true);

    await context.setOffline(true);
    await page.goto("/about").catch(() => {});
    await expect(
      page.getByRole("heading", { name: "You're offline" }),
    ).toBeVisible();

    await context.setOffline(false);
    await page.getByRole("button", { name: /Try again/ }).click();
    await expect(page.locator("main h1")).not.toHaveText("You're offline");
  });

  test("the contact API is never served from the cache", async ({ page }) => {
    await open(page, "/");
    await page.evaluate(() => navigator.serviceWorker.ready);
    const cached = await page.evaluate(async () => {
      const keys = await caches.keys();
      const urls: string[] = [];
      for (const key of keys)
        for (const request of await (await caches.open(key)).keys())
          urls.push(new URL(request.url).pathname);
      return urls;
    });
    expect(cached).toContain("/offline");
    expect(cached.some((url) => url.startsWith("/api/"))).toBe(false);
    // Pages are never cached, so nobody sees a stale page.
    expect(
      cached.filter((url) => !url.startsWith("/_next/") && url !== "/offline"),
    ).toEqual(
      cached.filter(
        (url) => url.startsWith("/brand/") || url.startsWith("/icons/"),
      ),
    );
  });
});
