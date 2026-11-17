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
  await stubTurnstile(page);
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

/* Cloudflare Turnstile never loads in tests: this stand-in hands the form
   Cloudflare's published dummy token, and counts resets. */
const turnstileStub = `
  (() => {
    const widgets = {};
    let count = 0;
    window.__turnstileResets = 0;
    const issue = (id) =>
      setTimeout(() => widgets[id]?.callback?.("XXXX.DUMMY.TOKEN.XXXX"), 0);
    window.turnstile = {
      render(_container, options) {
        const id = "widget-" + ++count;
        widgets[id] = options;
        issue(id);
        return id;
      },
      reset(id) {
        window.__turnstileResets++;
        issue(id);
      },
      remove(id) {
        delete widgets[id];
      },
    };
  })();
`;
export async function stubTurnstile(page: Page) {
  await page.route("https://challenges.cloudflare.com/**", (route) =>
    route.fulfill({ contentType: "text/javascript", body: turnstileStub }),
  );
}

/** Contact submissions never reach the mail provider in tests. */
export async function interceptContact(
  page: Page,
  status = "sent",
  extra: Record<string, string> = {},
) {
  const requests: string[] = [];
  await page.route("**/api/contact", async (route) => {
    requests.push(route.request().postData() ?? "");
    await route.fulfill({
      status: 303,
      headers: {
        location: `/contact?${new URLSearchParams({ status, ...extra })}`,
      },
    });
  });
  return requests;
}
