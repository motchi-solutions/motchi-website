import { expect, type Page } from "@playwright/test";

export const routes = [
  "/",
  "/websites",
  "/websites/work",
  "/consulting",
  "/products",
  "/about",
  "/contact",
  "/privacy",
] as const;

/** Opens a page once its streamed content is in place and the branded
    intro has handed over to it. */
export async function open(page: Page, path: string) {
  await page.goto(path);
  await expect(page.locator("main h1")).toBeVisible({ timeout: 15_000 });
  await expect(page.locator(".intro-experience")).toHaveCount(0, {
    timeout: 10_000,
  });
}

/** True on the mobile project, where the header shows the menu button. */
export function isMobile(page: Page) {
  return (page.viewportSize()?.width ?? 1440) < 1024;
}

/** Contact submissions never reach the mail provider in tests. */
export async function interceptContact(page: Page, status = "sent") {
  const requests: string[] = [];
  await page.route("**/api/contact", async (route) => {
    requests.push(route.request().postData() ?? "");
    await route.fulfill({
      status: 303,
      headers: { location: `/contact?status=${status}` },
    });
  });
  return requests;
}
