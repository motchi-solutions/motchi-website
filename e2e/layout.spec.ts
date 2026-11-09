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
