import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { isMobile, open, routes } from "./support.ts";

/* WCAG 2.2 A/AA plus best-practice rules, on every page and on the main
   interactive states. The Next.js development overlay is not part of the
   site and is excluded. */
async function scan(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags([
      "wcag2a",
      "wcag2aa",
      "wcag21a",
      "wcag21aa",
      "wcag22aa",
      "best-practice",
    ])
    .exclude("nextjs-portal")
    .analyze();
  return results.violations.map((violation) => ({
    rule: violation.id,
    impact: violation.impact,
    help: violation.help,
    targets: violation.nodes.slice(0, 5).map((node) => node.target.join(" ")),
  }));
}

for (const path of routes) {
  test(`${path} has no detectable accessibility violations`, async ({
    page,
  }) => {
    await open(page, path);
    expect(await scan(page)).toEqual([]);
  });
}

test("open states stay accessible: menu, FAQ, tabs, and enquiry errors", async ({
  page,
}) => {
  await open(page, "/consulting");
  if (isMobile(page)) {
    await page.getByLabel("Open menu").click();
    expect(await scan(page)).toEqual([]);
    await page.keyboard.press("Escape");
  }
  await page
    .getByRole("button", {
      name: "Do we need a technical brief to get started?",
    })
    .click();
  await page.getByRole("tab", { name: /Databricks/ }).click();
  await page
    .getByRole("button", { name: /Continue to project details/ })
    .click();
  await expect(page.locator("#enquiry")).toContainText("Please select");
  expect(await scan(page)).toEqual([]);
});

test("the contact form steps stay accessible, including errors", async ({
  page,
}) => {
  await open(page, "/contact");
  await page.getByRole("button", { name: "Continue" }).click();
  expect(await scan(page)).toEqual([]);
});

/* Final accessibility pass: structure, keyboard, high contrast, enlarged
   text, and motion. Desktop only, since phones have no Tab key and these
   checks do not depend on the device. */
test.describe("structure and keyboard", () => {
  test.skip(({ isMobile }) => isMobile, "Runs on desktop.");

  for (const path of routes) {
    test(`${path} has one of each landmark, named navigation, and ordered headings`, async ({
      page,
    }) => {
      await open(page, path);
      for (const role of ["banner", "main", "contentinfo"] as const)
        await expect(page.getByRole(role), `${path} ${role}`).toHaveCount(1);

      const navNames = await page
        .getByRole("navigation")
        .evaluateAll((navs) =>
          navs
            .filter((nav) => nav.checkVisibility())
            .map(
              (nav) =>
                nav.getAttribute("aria-label") ??
                document.getElementById(
                  nav.getAttribute("aria-labelledby") ?? "",
                )?.textContent ??
                "",
            ),
        );
      expect(navNames.every(Boolean), `${path} unnamed nav`).toBe(true);
      expect(new Set(navNames).size, `${path} duplicate nav names`).toBe(
        navNames.length,
      );

      const levels = await page
        .locator("main :is(h1, h2, h3, h4, h5, h6)")
        .evaluateAll((headings) =>
          headings
            .filter((heading) => heading.checkVisibility())
            .map((heading) => Number(heading.tagName[1])),
        );
      expect(levels[0], `${path} starts with h1`).toBe(1);
      const skips = levels.filter(
        (level, index) => index > 0 && level > levels[index - 1] + 1,
      );
      expect(skips, `${path} skipped heading levels`).toEqual([]);

      // VoiceOver in Safari reads each block-level piece of a heading as a
      // separate item, so headings hold inline content (or one control).
      const split = await page
        .locator("main :is(h1, h2, h3)")
        .evaluateAll((headings) =>
          headings
            .filter((heading) =>
              [...heading.querySelectorAll("*")].some(
                (child) =>
                  // A button or link is read as one item whatever its layout
                  // (WAI-ARIA accordion headings wrap a button).
                  !child.closest("button, a") &&
                  child.checkVisibility() &&
                  !!child.textContent?.trim() &&
                  /^(block|flex|grid|list-item|table)$/.test(
                    getComputedStyle(child).display,
                  ),
              ),
            )
            .map((heading) => heading.textContent?.trim().slice(0, 40)),
        );
      expect(split, `${path} headings split into blocks`).toEqual([]);
    });

    test(`${path} can be walked by keyboard with a visible focus indicator`, async ({
      page,
    }) => {
      await open(page, path);
      expect(
        await page
          .locator("[tabindex]:not([tabindex='0'], [tabindex='-1'])")
          .count(),
        "positive tabindex reorders focus",
      ).toBe(0);

      const problems: string[] = [];
      const seen = new Set<string>();
      for (let step = 0; step < 250; step++) {
        await page.keyboard.press("Tab");
        const focus = await page.evaluate(() => {
          const element = document.activeElement as HTMLElement | null;
          if (!element || element === document.body) return null;
          // A radio or checkbox inside an option card may hand its focus
          // ring to the card (AGENTS.md: Interactive controls).
          const shows = (target: Element) => {
            const style = getComputedStyle(target);
            return (
              (style.outlineStyle !== "none" &&
                Number.parseFloat(style.outlineWidth) >= 1) ||
              style.boxShadow !== "none"
            );
          };
          const label =
            element instanceof HTMLInputElement
              ? element.closest("label")
              : null;
          const ringed = shows(element) || (!!label && shows(label));
          const box = element.getBoundingClientRect();
          const name =
            `${element.tagName.toLowerCase()} ${element.getAttribute("aria-label") ?? element.textContent?.trim().slice(0, 40) ?? ""} @${Math.round(box.top + scrollY)}`.trim();
          const indicator = ringed;
          return {
            name,
            visible:
              element.checkVisibility({ opacityProperty: true }) &&
              box.width > 0 &&
              box.height > 0,
            inViewport: box.bottom > 0 && box.top < innerHeight,
            indicator,
            inert: !!element.closest("[inert], [aria-hidden='true']"),
          };
        });
        if (!focus) break;
        if (seen.has(focus.name)) break;
        seen.add(focus.name);
        if (!focus.visible) problems.push(`hidden: ${focus.name}`);
        if (focus.inert) problems.push(`inside hidden region: ${focus.name}`);
        if (!focus.inViewport) problems.push(`off screen: ${focus.name}`);
        if (!focus.indicator)
          problems.push(`no focus indicator: ${focus.name}`);
      }
      expect(seen.size, `${path} focusable elements`).toBeGreaterThan(5);
      expect(problems).toEqual([]);
    });
  }

  test("focus stays visible in Windows High Contrast (forced colors)", async ({
    page,
  }) => {
    await page.emulateMedia({ forcedColors: "active" });
    const problems: string[] = [];
    for (const path of ["/", "/consulting", "/contact"]) {
      await open(page, path);
      for (let step = 0; step < 25; step++) {
        await page.keyboard.press("Tab");
        const focus = await page.evaluate(() => {
          const element = document.activeElement as HTMLElement | null;
          if (!element || element === document.body) return null;
          const shows = (target: Element) => {
            const style = getComputedStyle(target);
            return (
              (style.outlineStyle !== "none" &&
                Number.parseFloat(style.outlineWidth) >= 1) ||
              style.boxShadow !== "none"
            );
          };
          const label =
            element instanceof HTMLInputElement
              ? element.closest("label")
              : null;
          const ringed = shows(element) || (!!label && shows(label));
          return {
            name: `${element.tagName} ${element.textContent?.trim().slice(0, 30)}`,
            outline: ringed,
          };
        });
        if (!focus) break;
        if (!focus.outline) problems.push(`${path}: ${focus.name}`);
      }
    }
    expect(problems).toEqual([]);
  });
});

test.describe("enlarged and respaced text", () => {
  test.skip(({ isMobile }) => isMobile, "Widths are set explicitly.");

  /* WCAG 1.4.4 (200% text) and 1.4.12 (text spacing): nothing clipped and no
     sideways scrolling. */
  const stress = {
    "200% text": "html { font-size: 200% !important; }",
    "text spacing":
      "* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } p { margin-bottom: 2em !important; }",
  };

  for (const [label, css] of Object.entries(stress)) {
    test(`${label}: every page stays readable at laptop and phone widths`, async ({
      page,
    }) => {
      const problems: string[] = [];
      for (const path of routes) {
        await open(page, path);
        await page.addStyleTag({ content: css });
        for (const width of [1280, 375]) {
          await page.setViewportSize({ width, height: 900 });
          const found = await page.evaluate(() => {
            const issues: string[] = [];
            const root = document.documentElement;
            if (root.scrollWidth > root.clientWidth + 1)
              issues.push(`page scrolls sideways (${root.scrollWidth}px)`);
            for (const element of document.querySelectorAll<HTMLElement>(
              "main *, header *, footer *",
            )) {
              if (!element.checkVisibility() || element.closest("[inert]"))
                continue;
              const style = getComputedStyle(element);
              const clips = /(hidden|clip)/.test(
                style.overflowX + style.overflowY,
              );
              if (!clips || element.clientWidth <= 2) continue;
              const ownText = [...element.childNodes].some(
                (node) =>
                  node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
              );
              if (
                ownText &&
                (element.scrollHeight > element.clientHeight + 2 ||
                  element.scrollWidth > element.clientWidth + 2)
              )
                issues.push(
                  `clipped: ${element.tagName.toLowerCase()} "${element.textContent?.trim().slice(0, 40)}"`,
                );
            }
            return issues;
          });
          problems.push(...found.map((issue) => `${path} @${width}: ${issue}`));
        }
      }
      expect(problems).toEqual([]);
    });
  }
});

test("reduced motion leaves no endless animation running", async ({ page }) => {
  for (const path of routes) {
    await open(page, path);
    const endless = await page.evaluate(() =>
      document
        .getAnimations()
        .filter(
          (animation) =>
            animation.playState === "running" &&
            animation.effect?.getComputedTiming().iterations === Infinity,
        )
        .map((animation) =>
          animation instanceof CSSAnimation
            ? animation.animationName
            : "script animation",
        ),
    );
    expect(endless, path).toEqual([]);
  }
});

test("other states are accessible: offline, not found, contact results, privacy contents", async ({
  page,
}) => {
  const states = [
    "/offline",
    "/no-such-page",
    "/contact?status=sent#contact-form",
    "/contact?status=partial#contact-form",
    "/contact?status=unavailable#contact-form",
    "/privacy#your-rights",
  ];
  for (const path of states) {
    await page.goto(path);
    await expect(page.locator("main h1, main h2").first()).toBeVisible();
    expect(await scan(page), path).toEqual([]);
  }
});
