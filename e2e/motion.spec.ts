import { expect, test } from "@playwright/test";

/* With motion allowed, the intro plays and hands over to the page, and the
   Consulting hero drawing finishes. With reduced motion (the suite default),
   both are skipped. */
test.describe("full motion", () => {
  test.use({ reducedMotion: "no-preference" });

  test("the intro plays, can be skipped with Escape, and reveals the page", async ({
    page,
  }) => {
    await page.goto("/consulting");
    const intro = page.locator(".intro-experience");
    await expect(intro).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(intro).toHaveCount(0);
    await expect(page.locator("main h1")).toBeVisible();
  });

  test("the Consulting hero drawing finishes after the intro", async ({
    page,
  }) => {
    await page.goto("/consulting");
    await page.keyboard.press("Escape");
    await expect
      .poll(
        () =>
          page.evaluate(() =>
            document
              .querySelector("#overview figure")
              ?.getAnimations({ subtree: true })
              .some((animation) => animation.playState === "running"),
          ),
        { timeout: 8_000 },
      )
      .toBe(false);
    const outcome = page.locator("[data-outcome]").first();
    await expect(outcome).toHaveCSS("opacity", "1");
  });
});

test("reduced motion skips the intro and shows the finished drawing", async ({
  page,
}) => {
  await page.goto("/consulting");
  await expect(page.locator(".intro-experience")).toHaveCount(0);
  await expect(page.locator("[data-outcome]").first()).toHaveCSS(
    "opacity",
    "1",
  );
});
