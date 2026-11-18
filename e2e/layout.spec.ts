import { expect, test } from "@playwright/test";
import { open, routes } from "./support.ts";

/* Responsive layout at the widths AGENTS.md asks us to check: no sideways
   page scroll, readable text, and comfortable touch targets. Runs once (the
   desktop project) and sets each width itself. */
const widths = [320, 375, 430, 768, 1024, 1366, 1536, 1920, 2560];

test.describe("layout", () => {
  test.skip(({ isMobile }) => isMobile, "Widths are set explicitly.");

  for (const path of routes) {
    test(`${path} fits every width without sideways scrolling`, async ({
      page,
    }) => {
      await open(page, path);
      for (const width of widths) {
        await page.setViewportSize({ width, height: 900 });
        const overflow = await page.evaluate(() => {
          const limit = document.documentElement.clientWidth;
          const wide = [
            ...document.querySelectorAll<HTMLElement>(
              "main *, header *, footer *",
            ),
          ]
            .filter((element) => {
              const box = element.getBoundingClientRect();
              if (
                !box.width ||
                !element.checkVisibility({
                  visibilityProperty: true,
                  opacityProperty: true,
                })
              )
                return false;
              // Off-canvas panels (fixed) and content inside a horizontal
              // scroller are meant to extend past the page edge.
              for (
                let node: HTMLElement | null = element;
                node;
                node = node.parentElement
              ) {
                if (getComputedStyle(node).position === "fixed") return false;
              }
              for (
                let node = element.parentElement;
                node;
                node = node.parentElement
              ) {
                const style = getComputedStyle(node);
                if (/(auto|scroll|hidden|clip)/.test(style.overflowX))
                  return false;
              }
              return box.right > limit + 1 || box.left < -1;
            })
            .map(
              (element) =>
                element.className.toString().slice(0, 50) || element.tagName,
            );
          return {
            page: document.documentElement.scrollWidth > limit,
            elements: [...new Set(wide)].slice(0, 5),
          };
        });
        expect(overflow, `${path} at ${width}px`).toEqual({
          page: false,
          elements: [],
        });
      }
    });
  }

  test("body text never renders below 14px, at any width", async ({ page }) => {
    for (const path of routes) {
      await open(page, path);
      for (const width of [375, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        const small = await page.evaluate(() =>
          [...document.querySelectorAll<HTMLElement>("main p, main li")]
            .filter(
              (element) =>
                element.checkVisibility() && element.textContent?.trim(),
            )
            .map((element) => ({
              text: element.textContent?.trim().slice(0, 40),
              size: Number.parseFloat(getComputedStyle(element).fontSize),
            }))
            .filter((item) => item.size < 14),
        );
        expect(small, `${path} at ${width}px`).toEqual([]);
      }
    }
  });
});

/* Touch targets are checked on the phone profile, where the coarse pointer
   enlarges controls such as the form help icons. */
test.describe("touch", () => {
  test.skip(({ isMobile }) => !isMobile, "Runs on the phone profile.");

  test("touch targets are at least 44px tall", async ({ page }) => {
    for (const path of routes) {
      await open(page, path);
      const small = await page.evaluate(() =>
        [
          ...document.querySelectorAll<HTMLElement>(
            "main a, main button, header a, header summary, footer a",
          ),
        ]
          .filter(
            (element) =>
              element.checkVisibility() &&
              !element.closest("p, li:not([class])"),
          )
          .map((element) => ({
            name: (
              element.getAttribute("aria-label") ??
              element.textContent ??
              ""
            )
              .trim()
              .slice(0, 30),
            height: Math.round(element.getBoundingClientRect().height),
          }))
          .filter((item) => item.height > 0 && item.height < 44),
      );
      expect(small, path).toEqual([]);
    }
  });
});

test.describe("browser zoom", () => {
  test.skip(({ isMobile }) => isMobile, "Sizes are set explicitly.");

  test("on short windows (200%+ zoom) sticky bars scroll away; laptops keep the sticky header", async ({
    page,
  }) => {
    const position = (selector: string) =>
      page
        .locator(selector)
        .first()
        .evaluate((el) => getComputedStyle(el).position);
    await page.setViewportSize({ width: 1440, height: 900 });
    await open(page, "/products");
    expect(await position(".site-header")).toBe("sticky");

    // 200% zoom on a 1440 x 900 laptop.
    await page.setViewportSize({ width: 720, height: 450 });
    expect(await position(".site-header")).not.toBe("sticky");
    expect(await position("[role=tablist]")).not.toBe("sticky");
  });

  test("the home headline stays clear of the ribbon at tablet widths", async ({
    page,
  }) => {
    // The ribbon shares the headline's burgundy and fills the right side of
    // the hero, so the headline keeps to the left seven of twelve columns.
    await open(page, "/");
    for (const width of [640, 720, 768, 900, 1000]) {
      await page.setViewportSize({ width, height: 900 });
      const share = await page.evaluate(() => {
        const headline = document.querySelector("#solutions-title");
        const grid = headline?.parentElement;
        if (!headline || !grid) return 1;
        const box = grid.getBoundingClientRect();
        const lines = [...headline.querySelectorAll("span")].map((span) => {
          const range = document.createRange();
          range.selectNodeContents(span);
          return Math.max(
            ...[...range.getClientRects()].map((rect) => rect.right),
          );
        });
        return (Math.max(...lines) - box.left) / box.width;
      });
      expect(share, `${width}px`).toBeLessThanOrEqual(7 / 12 + 0.02);
    }
  });

  test("at 400% zoom the product gate keeps its size, nothing overlaps, and the intro text does not collide", async ({
    page,
  }) => {
    // 400% zoom on a 1440 x 900 laptop.
    await page.setViewportSize({ width: 360, height: 225 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    const intro = page.locator(".intro-experience");
    await expect(intro.locator(".intro-skip-hint")).toBeVisible();
    await expect(intro.locator(".intro-family-caption")).toBeHidden();

    await page.emulateMedia({ reducedMotion: "reduce" });
    await open(page, "/products");
    const gate = page.getByRole("button", { name: /See what's inside/ });
    await gate.scrollIntoViewIfNeeded();
    const stage = page.locator("[data-product-swipe][data-open]");
    const closedHeight = (await stage.boundingBox())?.height;

    // Opened, the album card and its controls never overlap.
    await gate.click();
    await expect(
      page.getByRole("button", { name: /Back to gate/ }),
    ).toBeVisible();
    const overlaps = await page.evaluate(() => {
      const visible = (suffix: string) =>
        [...document.querySelectorAll<HTMLElement>("[class]")].find(
          (element) =>
            [...element.classList].some((name) => name.endsWith(suffix)) &&
            element.checkVisibility(),
        );
      const parts = [
        visible("_albumPage"),
        visible("_albumCount"),
        visible("_gateBack"),
        document.getElementById("product-browse-hint"),
      ]
        .filter(
          (element): element is HTMLElement => !!element?.checkVisibility(),
        )
        .map((element) => element.getBoundingClientRect());
      let hits = 0;
      for (let i = 0; i < parts.length; i++)
        for (let j = i + 1; j < parts.length; j++) {
          const [a, b] = [parts[i], parts[j]];
          if (
            a.left < b.right &&
            b.left < a.right &&
            a.top < b.bottom &&
            b.top < a.bottom
          )
            hits++;
        }
      return hits;
    });
    expect(overlaps).toBe(0);
    // The gate is as large closed as the album is open.
    expect((await stage.boundingBox())?.height).toBe(closedHeight);
  });
});
