import { expect, test } from "@playwright/test";
import { isMobile, open } from "./support.ts";

test.describe("Consulting services", () => {
  test("a service tab shows its detail and links to a preselected enquiry", async ({
    page,
  }) => {
    await open(page, "/consulting");
    const tab = page.getByRole("tab", { name: /Technology Strategy/ });
    await tab.click();
    await expect(tab).toHaveAttribute("aria-selected", "true");
    const panel = page.getByRole("tabpanel", { name: /Technology Strategy/ });
    await expect(panel).toBeVisible();
    await panel
      .getByRole("link", { name: "Talk to us about Technology Strategy" })
      .click();
    await expect(page).toHaveURL(/\/contact\?branch=consulting&service=/);
    await expect(
      page.getByRole("checkbox", { name: "Technology Strategy" }),
    ).toBeChecked();
  });

  test("arrow keys move between services", async ({ page }) => {
    test.skip(isMobile(page), "Keyboard support is checked on desktop.");
    await open(page, "/consulting");
    const first = page.getByRole("tab").first();
    await first.focus();
    await page.keyboard.press("ArrowDown");
    await expect(
      page.getByRole("tab", { name: /Data & Analytics/ }),
    ).toBeFocused();
    await page.keyboard.press("End");
    await expect(
      page.getByRole("tab", { name: /Website & Digital/ }),
    ).toHaveAttribute("aria-selected", "true");
  });

  test("a link to one service opens it", async ({ page }) => {
    await open(page, "/consulting#databricks");
    await expect(page.getByRole("tab", { name: /Databricks/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(page.locator("#capabilities")).toBeInViewport();
  });
});

test.describe("How We Work carousel", () => {
  const rail = (page: import("@playwright/test").Page) =>
    page.getByRole("tablist", { name: "Engagement stages" });

  test("the rail moves the carousel and Next moves focus with it", async ({
    page,
  }) => {
    await open(page, "/consulting");
    await rail(page).getByRole("tab").nth(2).click();
    const implementation = page.getByRole("tabpanel", {
      name: /Implementation/,
    });
    await expect(implementation).toBeInViewport({ ratio: 0.6 });
    await implementation
      .getByRole("button", { name: /Next: Adoption/ })
      .click();
    await expect(rail(page).getByRole("tab").nth(3)).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(
      page.getByRole("tabpanel", { name: /Adoption/ }),
    ).toBeFocused();
  });

  test("swiping the carousel selects the stage that comes into view", async ({
    page,
  }) => {
    await open(page, "/consulting");
    const track = page.locator("[data-track]");
    await track.evaluate((element) => {
      const last = element.querySelectorAll<HTMLElement>("[role=tabpanel]")[4];
      element.scrollTo({ left: last.offsetLeft, behavior: "instant" });
    });
    await expect(rail(page).getByRole("tab").nth(4)).toHaveAttribute(
      "aria-selected",
      "true",
    );
    // The stage rail never needs its own horizontal scroll.
    expect(
      await rail(page).evaluate(
        (element) => element.scrollWidth <= element.clientWidth,
      ),
    ).toBe(true);
  });

  test("a mouse drag moves one stage and does not click through", async ({
    page,
  }) => {
    test.skip(isMobile(page), "Mouse dragging is a desktop interaction.");
    await open(page, "/consulting");
    const track = page.locator("[data-track]");
    await track.scrollIntoViewIfNeeded();
    const box = await track.boundingBox();
    if (!box) throw new Error("Carousel not rendered");
    const y = box.y + 120;
    await page.mouse.move(box.x + box.width * 0.7, y);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.4, y, { steps: 8 });
    await page.mouse.up();
    await expect(rail(page).getByRole("tab").nth(1)).toHaveAttribute(
      "aria-selected",
      "true",
    );
    // A short drag snaps back to the same stage.
    await page.mouse.move(box.x + box.width * 0.5, y);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.5 - 20, y, { steps: 4 });
    await page.mouse.up();
    await expect(rail(page).getByRole("tab").nth(1)).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });
});

test("FAQ answers open and close, and closed answers are inert", async ({
  page,
}) => {
  await open(page, "/consulting");
  const question = page.getByRole("button", {
    name: "What happens after delivery?",
  });
  const panel = page.locator(
    `#${await question.getAttribute("aria-controls")}`,
  );
  const height = () => panel.evaluate((element) => element.clientHeight);
  await expect(panel).toHaveAttribute("inert", "");
  expect(await height()).toBe(0);
  await question.click();
  await expect(question).toHaveAttribute("aria-expanded", "true");
  await expect(panel).not.toHaveAttribute("inert", "");
  await expect.poll(height).toBeGreaterThan(20);
  await expect(panel).toContainText("We prepare documentation and handover");
  await question.click();
  await expect(question).toHaveAttribute("aria-expanded", "false");
  await expect(panel).toHaveAttribute("inert", "");
});

test.describe("enquiry", () => {
  test("arriving from the hero shows no error until Continue", async ({
    page,
  }) => {
    await open(page, "/consulting");
    await page.getByRole("link", { name: "Start a Conversation" }).click();
    await expect(page).toHaveURL(/#enquiry$/);
    const enquiry = page.locator("#enquiry");
    // Passing through the empty group must not raise an error.
    await page.getByRole("checkbox").first().focus();
    await page.locator("#enquiry h2").click();
    await expect(enquiry.getByText(/Please select a service/)).toHaveCount(0);

    await enquiry
      .getByRole("button", { name: /Continue to project details/ })
      .click();
    await expect(enquiry.getByText(/Please select a service/)).toBeVisible();
    await expect(page.getByRole("checkbox").first()).toBeFocused();

    await page.getByRole("checkbox", { name: "Databricks" }).check();
    await expect(enquiry.getByText(/Please select a service/)).toHaveCount(0);
    await enquiry
      .getByRole("button", { name: /Continue to project details/ })
      .click();
    // The full form opens at project details with the choice carried over.
    await expect(page).toHaveURL(
      /\/contact\?.*branch=consulting.*service=Databricks/,
    );
    await expect(page.getByRole("button", { name: "Back" })).toBeVisible();
    await page.getByRole("button", { name: "Back" }).click();
    await expect(
      page.getByRole("checkbox", { name: "Databricks" }),
    ).toBeChecked();
  });
});
