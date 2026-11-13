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
  // The toast never covers the button needed to try again.
  const [toastBox, sendBox] = await Promise.all([
    toast.boundingBox(),
    send.boundingBox(),
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
