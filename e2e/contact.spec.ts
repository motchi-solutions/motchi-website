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

test("Continue explains what is missing in a focused summary", async ({
  page,
}) => {
  await open(page, "/contact");
  await page.getByRole("button", { name: "Continue" }).click();
  // Wide screens show a side rail; narrower ones an inline summary.
  const summary = page.locator("[role=alert]:focus");
  await expect(summary).toBeVisible();
  await expect(summary).toContainText(/Please (complete|check) these answers/);
  await expect(
    summary.getByRole("link", { name: "Enquiry type" }),
  ).toBeVisible();
  await expect(
    form(page).getByText("Please choose Websites, Consulting, or Products."),
  ).toBeVisible();
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
  const summary = page.locator("[role=alert]:focus");
  await summary.getByRole("link", { name: "Name" }).click();
  await expect(name).toBeFocused();
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
