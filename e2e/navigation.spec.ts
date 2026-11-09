import { expect, test } from "@playwright/test";
import { isMobile, open, routes } from "./support.ts";

test.describe("every public page", () => {
  for (const path of routes) {
    test(`${path} renders one main heading and no errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.locator(".intro-experience")).toHaveCount(0, {
        timeout: 10_000,
      });
      await expect(page.locator("main h1")).toHaveCount(1);
      await expect(page).toHaveTitle(/Motchi/);
      expect(
        await page.locator('meta[name="description"]').getAttribute("content"),
      ).toBeTruthy();
      expect(errors).toEqual([]);
    });
  }
});

test("retired pages redirect to the services overview", async ({ page }) => {
  for (const path of ["/services", "/businesses"]) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/#businesses$/);
  }
});

test("unknown pages return the not-found page", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.locator("main h1")).toBeVisible();
});

test("the header marks the current page and links to every section of the site", async ({
  page,
}) => {
  await open(page, "/consulting");
  if (isMobile(page)) {
    // A native <summary>, named "Open menu" / "Close menu".
    await page.getByLabel("Open menu").click();
    const menu = page.getByRole("navigation", { name: "Mobile navigation" });
    await expect(
      menu.getByRole("link", { name: "Consulting" }),
    ).toHaveAttribute("aria-current", "page");
    await menu.getByRole("link", { name: "Websites" }).click();
  } else {
    const nav = page.getByRole("navigation", { name: "Main navigation" });
    await expect(nav.getByRole("link", { name: "Consulting" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await nav.getByRole("link", { name: "Websites" }).click();
  }
  await expect(page).toHaveURL(/\/websites$/);
  await expect(page.locator("main h1")).toContainText("Websites");
});

test("the mobile menu opens, traps nothing, and closes with Escape", async ({
  page,
}) => {
  test.skip(!isMobile(page), "The menu button only shows on small screens.");
  await open(page, "/");
  const toggle = page.getByLabel("Open menu");
  await toggle.click();
  await expect(page.getByLabel("Close menu")).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  const menu = page.getByRole("navigation", { name: "Mobile navigation" });
  await expect(menu.getByRole("link", { name: "Contact" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu.getByRole("link", { name: "Contact" })).toBeHidden();
  await expect(page.getByLabel("Open menu")).toBeFocused();
});

test("the skip link moves keyboard focus to the main content", async ({
  page,
}) => {
  test.skip(isMobile(page), "Keyboard navigation is checked on desktop.");
  await open(page, "/websites");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await skip.press("Enter");
  await expect(page).toHaveURL(/#main-content$/);
});

test("the Contact call to action stays filled and marks the current page", async ({
  page,
}) => {
  test.skip(isMobile(page), "Checked in the desktop header.");
  await open(page, "/contact");
  const contact = page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Contact" });
  await expect(contact).toHaveAttribute("aria-current", "page");
  const background = await contact.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  expect(background).toBe("rgb(91, 2, 2)");
});

test("section navigation jumps to a section and marks it", async ({ page }) => {
  await open(page, "/consulting");
  await page.locator("#approach").scrollIntoViewIfNeeded();
  const handle = page.locator(".section-navigation-handle");
  await expect(handle).toBeVisible();
  await handle.click();
  const panel = page.locator(".section-navigation");
  await panel.getByRole("link", { name: "FAQs" }).click();
  await expect(page).toHaveURL(/#faq$/);
  await expect(
    page.getByRole("heading", { name: "Frequently Asked Questions" }),
  ).toBeInViewport();
});
