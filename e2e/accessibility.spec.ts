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
