import { expect, test } from "@playwright/test";
import { isMobile, open } from "./support.ts";

test.describe("Websites", () => {
  test("a pricing button scrolls to the enquiry with its tier selected", async ({
    page,
  }) => {
    await open(page, "/websites");
    await page.locator("[data-enquiry-tier=Business]").click();
    await expect(page).toHaveURL(/#enquiry$/);
    await expect(page.getByRole("radio", { name: "Business" })).toBeChecked();
    await expect(page.locator("#enquiry")).toBeInViewport();
    // "Compare pricing" returns to the tiers.
    await page.getByRole("link", { name: /Compare pricing/ }).click();
    await expect(page).toHaveURL(/#pricing$/);
  });

  test("the hero leads with the contact call to action", async ({ page }) => {
    await open(page, "/websites");
    const actions = page.locator("#overview").getByRole("link");
    await expect(
      actions.filter({ hasText: "Start a Project" }),
    ).toHaveAttribute("href", "#enquiry");
    const labels = await actions.allTextContents();
    expect(
      labels.findIndex((text) => text.includes("Start a Project")),
    ).toBeLessThan(
      labels.findIndex((text) => text.includes("Explore Our Work")),
    );
  });

  test("What We Build layers open one at a time", async ({ page }) => {
    await open(page, "/websites");
    const layers = page.locator("#services h3 button[aria-expanded]");
    await layers.nth(1).click();
    await expect(layers.nth(1)).toHaveAttribute("aria-expanded", "true");
    await layers.nth(2).click();
    await expect(layers.nth(2)).toHaveAttribute("aria-expanded", "true");
    await expect(layers.nth(1)).toHaveAttribute("aria-expanded", "false");
  });

  test("How We Build stages show their detail", async ({ page }) => {
    await open(page, "/websites");
    const stage = page
      .locator("#process h3 button")
      .filter({ hasText: "Plan" });
    await stage.click();
    await expect(stage).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#process")).toContainText("Step 2 of 5");
  });

  test("project links open the live site in a new tab", async ({ page }) => {
    await open(page, "/websites/work");
    const visits = page.getByRole("link", { name: /^Visit Site/ });
    expect(await visits.count()).toBeGreaterThan(0);
    for (const link of await visits.all()) {
      await expect(link).toHaveAttribute("target", "_blank");
      expect(await link.getAttribute("rel")).toMatch(/noopener/);
    }
  });
});

test.describe("Products", () => {
  test("the product tabs and gate respond to clicks and arrow keys", async ({
    page,
  }) => {
    await open(page, "/products");
    const tabs = page.getByRole("tablist", {
      name: "Choose a product to explore",
    });
    await tabs.getByRole("tab").nth(1).click();
    await expect(tabs.getByRole("tab").nth(1)).toHaveAttribute(
      "aria-selected",
      "true",
    );
    if (!isMobile(page)) {
      // Phones swipe the gate instead of showing arrow buttons.
      await page.getByRole("button", { name: "Previous product" }).click();
      await expect(tabs.getByRole("tab").first()).toHaveAttribute(
        "aria-selected",
        "true",
      );
    }
    const gate = page.getByRole("button", { name: /^See what's inside/ });
    await gate.click();
    await expect(gate).toBeHidden();
  });
});

test.describe("About", () => {
  test("the values tabs switch their panel", async ({ page }) => {
    await open(page, "/about");
    const tablist = page.getByRole("tablist");
    const second = tablist.getByRole("tab").nth(1);
    await second.click();
    await expect(second).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tabpanel")).toBeVisible();
    if (!isMobile(page)) {
      await second.press("ArrowRight");
      await expect(tablist.getByRole("tab").nth(2)).toBeFocused();
    }
  });
});

test.describe("Home", () => {
  test("the services overview links to both service sites", async ({
    page,
  }) => {
    await open(page, "/");
    const overview = page.locator("#businesses");
    await expect(
      overview.locator('a[href^="/websites"]').first(),
    ).toBeVisible();
    await expect(
      overview.locator('a[href^="/consulting"]').first(),
    ).toBeVisible();
  });
});

test("Websites FAQ answers pricing and support questions", async ({ page }) => {
  await open(page, "/websites");
  const question = page.getByRole("button", {
    name: "How much does a website cost?",
  });
  await question.click();
  await expect(question).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#faq")).toContainText("Prices are in CAD");
});

test("links to another page's section land on that section", async ({
  page,
}) => {
  await open(page, "/");
  await page
    .getByRole("link", { name: "How consulting projects work" })
    .click();
  await expect(page).toHaveURL(/\/consulting#approach$/);
  await expect(
    page.getByRole("heading", { name: "How We Work Together" }),
  ).toBeInViewport();
});
