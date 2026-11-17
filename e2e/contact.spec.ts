import { expect, test, type Page } from "@playwright/test";
import { interceptContact, open } from "./support.ts";

const form = (page: Page) => page.locator("#contact-form");
const errorsIn = (page: Page) => form(page).locator("[id$='-error']:visible");

async function chooseFirst(page: Page, group: string) {
  await page.locator(`label:has(#${group}-0)`).click();
}

async function completeServices(page: Page) {
  await chooseFirst(page, "enquiryType");
  await chooseFirst(page, "services");
  await page.getByRole("button", { name: "Continue" }).click();
}

async function completeProject(page: Page) {
  for (const group of ["business", "stage", "timeline"])
    await chooseFirst(page, group);
  await page.getByRole("button", { name: "Continue" }).click();
}

test("Continue moves to the first missing answer and lists what is missing", async ({
  page,
}) => {
  await open(page, "/contact");
  await page.getByRole("button", { name: "Continue" }).click();
  // Focus lands on the first answer that needs attention, scrolled into view.
  const firstOption = page.locator("#enquiryType-0");
  await expect(firstOption).toBeFocused();
  await expect(firstOption).toBeInViewport();
  await expect(
    form(page).getByText("Please choose Websites, Consulting, or Products."),
  ).toBeVisible();
  // The focused answer announces its own error...
  await expect(firstOption).toHaveAttribute("aria-invalid", "true");
  await expect(firstOption).toHaveAccessibleDescription(/Please choose/);
  // ...so no live region says anything else (VoiceOver read each in turn).
  const spoken = await page
    .locator(
      "[role=alert], [role=status], [aria-live=polite], [aria-live=assertive]",
    )
    .evaluateAll((regions) =>
      regions.map((region) => region.textContent?.trim()).filter(Boolean),
    );
  expect(spoken).toEqual([]);
  // Wide screens also show a side rail; narrower ones an inline summary.
  await expect(
    page.getByRole("link", { name: "Enquiry type" }).filter({ visible: true }),
  ).toHaveCount(1);
});

test("project details require each answer before continuing", async ({
  page,
}) => {
  await open(page, "/contact");
  await completeServices(page);
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(errorsIn(page)).toHaveCount(3);
  await completeProject(page);
  await expect(page.getByRole("textbox", { name: /^Name/ })).toBeVisible();
});

test("contact details: no error for an untouched field, a clear error for a malformed one", async ({
  page,
}) => {
  await open(page, "/contact");
  await completeServices(page);
  await completeProject(page);
  const name = page.getByRole("textbox", { name: /^Name/ });
  const email = page.getByRole("textbox", { name: /^Email/ });
  await name.focus();
  await email.focus();
  await expect(form(page).getByText(/Please enter/)).toHaveCount(0);

  await email.fill("not-an-email");
  await name.focus();
  await expect(
    form(page).getByText("Please enter a valid email address."),
  ).toBeVisible();
  await email.fill("mo@example.com");
  await expect(
    form(page).getByText("Please enter a valid email address."),
  ).toHaveCount(0);

  await page.getByRole("button", { name: "Review enquiry" }).click();
  await expect(form(page).getByText("Please enter your name.")).toBeVisible();
  await expect(name).toBeFocused();
  await expect(name).toBeInViewport();
});

test("a complete enquiry reaches review and sends (delivery intercepted)", async ({
  page,
}) => {
  const requests = await interceptContact(page);
  await open(page, "/contact");
  await completeServices(page);
  await completeProject(page);
  await page.getByRole("textbox", { name: /^Name/ }).fill("Test Person");
  await page.getByRole("textbox", { name: /^Email/ }).fill("test@example.com");
  await page.getByRole("button", { name: "Review enquiry" }).click();

  const review = form(page);
  await expect(review).toContainText("Test Person");
  await expect(review).toContainText("test@example.com");
  const send = page.getByRole("button", { name: "Send enquiry" });
  await expect(send).toBeEnabled();
  await send.click();
  await expect(
    page.getByRole("heading", { name: /Thank you|sent|received/i }),
  ).toBeVisible();
  expect(requests).toHaveLength(1);
  const sent = new URLSearchParams(requests[0]);
  expect(sent.get("email")).toBe("test@example.com");
  expect(sent.get("name")).toBe("Test Person");
  expect(sent.get("message")).toContain("Selected services:");
  // The bot-check token travels with the enquiry.
  expect(sent.get("cf-turnstile-response")).toBe("XXXX.DUMMY.TOKEN.XXXX");
});

test("an autofilled international phone is split and formatted", async ({
  page,
}) => {
  const requests = await interceptContact(page);
  await open(page, "/contact");
  await completeServices(page);
  await completeProject(page);
  await page.getByRole("textbox", { name: /^Name/ }).fill("Test Person");
  await page.getByRole("textbox", { name: /^Email/ }).fill("test@example.com");
  // Browser autofill arrives as one change event, like fill().
  const number = page.locator("#phone");
  await number.fill("+14112223333");
  await expect(page.locator("#phone-country-code")).toHaveValue("1");
  await page.getByRole("textbox", { name: /^Email/ }).focus();
  await expect(number).toHaveValue("(411) 222-3333");
  await page.getByRole("button", { name: "Review enquiry" }).click();
  await expect(form(page)).toContainText("+1 (411) 222-3333");
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(
    page.getByRole("heading", { name: /Thank you|sent|received/i }),
  ).toBeVisible();
  expect(new URLSearchParams(requests[0]).get("message")).toContain(
    "Phone: +1 (411) 222-3333",
  );
});

test("review edits one answer and returns to review", async ({ page }) => {
  await open(page, "/contact");
  await completeServices(page);
  await completeProject(page);
  await page.getByRole("textbox", { name: /^Name/ }).fill("Test Person");
  await page.getByRole("textbox", { name: /^Email/ }).fill("test@example.com");
  await page.getByRole("button", { name: "Review enquiry" }).click();
  await page.getByRole("button", { name: "Edit email" }).click();
  const email = page.getByRole("textbox", { name: /^Email/ });
  await expect(email).toBeFocused();
  await email.fill("new@example.com");
  await page.getByRole("button", { name: "Back to review" }).click();
  await expect(
    page.getByRole("heading", { name: "Review your enquiry" }),
  ).toBeVisible();
  await expect(form(page)).toContainText("new@example.com");
});

test("an unsent enquiry shows a visible error toast and keeps answers", async ({
  page,
}) => {
  await interceptContact(page, "unavailable");
  await open(page, "/contact");
  await completeServices(page);
  await completeProject(page);
  await page.getByRole("textbox", { name: /^Name/ }).fill("Test Person");
  await page.getByRole("textbox", { name: /^Email/ }).fill("test@example.com");
  await page.getByRole("button", { name: "Review enquiry" }).click();
  const send = page.getByRole("button", { name: "Send enquiry" });
  await send.click();
  const toast = page.locator("[data-toast=error]");
  await expect(toast).toBeInViewport();
  await expect(toast).toContainText("Your enquiry wasn't sent");
  await expect(toast.getByRole("link", { name: "Email Motchi" })).toBeVisible();
  // Delivery is unknown, so sending locks for this visit (nothing is sent
  // twice), and the toast never covers the form's actions.
  const locked = page.getByRole("button", { name: "Sending unavailable" });
  await expect(locked).toBeDisabled();
  const [toastBox, sendBox] = await Promise.all([
    toast.boundingBox(),
    locked.boundingBox(),
  ]);
  expect(toastBox && sendBox && toastBox.y + toastBox.height <= sendBox.y).toBe(
    true,
  );
  await page.keyboard.press("Escape");
  await expect(toast).toHaveCount(0);
  await expect(form(page)).toContainText("test@example.com");
});

test("progress is saved only when asked, and offered again after a reload", async ({
  page,
}) => {
  await open(page, "/contact");
  await chooseFirst(page, "enquiryType");
  await chooseFirst(page, "services");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("checkbox", { name: "Save my progress" }).check();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Continue your contact form" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Continue form" }).click();
  await expect(page.locator("#business-0")).toBeVisible();
});

test("links from the service pages preselect the right answers", async ({
  page,
}) => {
  await open(page, "/contact?branch=websites&tier=Business");
  await expect(page.getByRole("radio", { name: "Business" })).toBeChecked();
  await open(page, "/contact?branch=consulting&service=AI%20Adoption");
  await expect(page.getByRole("radio", { name: /Consulting/ })).toBeChecked();
  await expect(
    page.getByRole("checkbox", { name: "AI Adoption" }),
  ).toBeChecked();
});

async function reachReview(page: Page) {
  await open(page, "/contact");
  await completeServices(page);
  await completeProject(page);
  await page.getByRole("textbox", { name: /^Name/ }).fill("Test Person");
  await page.getByRole("textbox", { name: /^Email/ }).fill("test@example.com");
  await page.getByRole("button", { name: "Review enquiry" }).click();
}

test("each kind of failure explains what to do next", async ({ page }) => {
  const toast = page.locator("[data-toast=error]");
  const send = page.getByRole("button", { name: "Send enquiry" });

  // Too many attempts: say how long to wait.
  await interceptContact(page, "limited", { retry: "7" });
  await reachReview(page);
  await send.click();
  await expect(toast).toContainText("try again in about 7 minutes");
  await page.keyboard.press("Escape");

  // A failed bot check: a fresh check runs for the retry.
  await page.unroute("**/api/contact");
  await interceptContact(page, "verification");
  const resets = await page.evaluate(
    () =>
      (window as unknown as { __turnstileResets: number }).__turnstileResets,
  );
  await send.click();
  await expect(toast).toContainText(
    "couldn't confirm this was sent by a person",
  );
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as unknown as { __turnstileResets: number })
            .__turnstileResets,
      ),
    )
    .toBeGreaterThan(resets);
  await page.keyboard.press("Escape");

  // Our side failed: a reference the visitor can quote by email.
  await page.unroute("**/api/contact");
  await interceptContact(page, "failed", { ref: "AB12CD34" });
  await send.click();
  await expect(toast).toContainText("problem on our side");
  await expect(toast).toContainText("Reference AB12CD34");
  await expect(
    toast.getByRole("link", { name: "Email Motchi" }),
  ).toHaveAttribute(
    "href",
    /subject=Website%20enquiry%20\(reference%20AB12CD34\)/,
  );
  // Answers survive every failure.
  await expect(form(page)).toContainText("test@example.com");
});

test("when sending is switched off, the form says so and stops further attempts", async ({
  page,
}) => {
  await interceptContact(page, "configuration", { ref: "ZX98YW76" });
  await reachReview(page);
  const send = page.getByRole("button", { name: "Send enquiry" });
  await send.click();
  const toast = page.locator("[data-toast=error]");
  await expect(toast).toContainText("temporarily unavailable");
  await expect(toast).toContainText("Reference ZX98YW76");
  // Sending is locked for this visit, and the reason is shown in the form.
  await expect(
    page.getByRole("button", { name: "Sending unavailable" }),
  ).toBeDisabled();
  await expect(form(page)).toContainText(
    "Online enquiries are temporarily unavailable",
  );
  const emailUs = form(page).getByRole("link", { name: "email us" });
  await expect(emailUs).toHaveAttribute("href", /^mailto:/);
  // The link flows inside the sentence instead of becoming its own column.
  const notice = emailUs.locator("xpath=ancestor::p[1]");
  const sentence = await notice.evaluate((element) => ({
    flexItems: element.children.length,
    width: element.getBoundingClientRect().width,
    textWidth: element.firstElementChild?.getBoundingClientRect().width ?? 0,
  }));
  expect(sentence.flexItems).toBe(1);
  expect(sentence.textWidth).toBeGreaterThan(sentence.width * 0.7);
});

test("a sent enquiry shows its result and a notice that counts down, pauses, and closes", async ({
  page,
}) => {
  await interceptContact(page);
  await reachReview(page);
  await page.getByRole("button", { name: "Send enquiry" }).click();
  // The result replaces the form and is scrolled into view.
  await expect(
    page.getByRole("heading", { name: /Thank you|sent|received/i }),
  ).toBeInViewport();
  const toast = page.locator("[data-toast=success]");
  await expect(toast).toBeVisible();
  await expect(
    toast.getByRole("button", { name: "Dismiss notification" }),
  ).toBeVisible();
  // Hovering pauses the countdown: the notice outlives its 6 seconds.
  await toast.hover();
  await expect(toast).toHaveAttribute("data-paused", "true");
  await page.waitForTimeout(7000);
  await expect(toast).toBeVisible();
  // Leaving resumes it, and it closes on its own (also with reduced motion).
  await page.mouse.move(0, 0);
  await expect(toast).toHaveAttribute("data-paused", "false");
  await expect(toast).toHaveCount(0, { timeout: 9000 });
});

test("product questions can include a company and website, but not a phone", async ({
  page,
}) => {
  await open(page, "/contact");
  await page.locator("label:has(#enquiryType-2)").click();
  await chooseFirst(page, "services");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(
    page.getByRole("textbox", { name: /Business \/ organization/ }),
  ).toBeVisible();
  await expect(page.getByRole("textbox", { name: /^Website/ })).toBeVisible();
  await expect(page.locator("#phone")).toHaveCount(0);
});

test("with full motion, the sent notice stays on screen below the header", async ({
  page,
}) => {
  // The page entrance animation transforms an ancestor; the notice must still
  // be fixed to the window, not scroll away with the page.
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await interceptContact(page);
  await reachReview(page);
  await page.getByRole("button", { name: "Send enquiry" }).click();
  const toast = page.locator("[data-toast=success]");
  await expect(toast).toBeInViewport({ ratio: 1 });
  const box = await toast.boundingBox();
  const header = await page.locator("header").first().boundingBox();
  expect(box && header && box.y >= header.y + header.height - 1).toBe(true);
});

test("free-call booking links open Google Calendar in a new tab", async ({
  page,
}) => {
  const name = "Book a Free Call (opens in a new tab)";
  for (const path of ["/", "/contact"]) {
    await page.goto(path);
    const link = page.getByRole("link", { name, exact: true });
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noopener/);
    await expect(link).toHaveAttribute(
      "href",
      /^https:\/\/calendar\.app\.google\//,
    );
  }
});
