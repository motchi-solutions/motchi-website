import { isEmail } from "@motchi/config/validation";
export { isEmail } from "@motchi/config/validation";
export const contactLimits = {
  name: 100,
  email: 254,
  company: 150,
  website: 500,
  messageMin: 10,
  messageMax: 5000,
} as const;
export const contactFieldErrors = {
  name: `Enter a name of up to ${contactLimits.name} characters, without line breaks.`,
  email: "Enter a valid email address.",
  company: `Use up to ${contactLimits.company} characters without line breaks.`,
  interest: "Choose an area of interest.",
  message: `Enter ${contactLimits.messageMin}–${contactLimits.messageMax.toLocaleString("en-CA")} characters.`,
  website: "Enter a complete http or https URL without account credentials.",
} as const;
export const interests = {
  solutions: [
    "Websites",
    "AI",
    "Data",
    "Cloud",
    "Automation",
    "Consulting",
    "Products",
    "Something else",
  ],
  websites: [
    "New website",
    "Website redesign",
    "Booking or integrations",
    "Maintenance",
    "Something else",
  ],
  consulting: [
    "AI",
    "Databricks",
    "Data & analytics",
    "Website & digital",
    "Technology strategy",
    "Implementation & adoption",
  ],
} as const;
export type ContactBranch = keyof typeof interests;
export type ContactInput = {
  name: string;
  email: string;
  company: string;
  interest: string;
  message: string;
  website: string;
};
export type ContactErrors = Partial<Record<keyof ContactInput, string>>;
function hasControls(value: string, multiline = false): boolean {
  return Array.from(value).some((character) => {
    const code = character.charCodeAt(0);
    return (
      (code < 32 || code === 127) && !(multiline && [9, 10, 13].includes(code))
    );
  });
}
export function validateContact(
  form: FormData,
  branch: ContactBranch,
): { input: ContactInput; errors: ContactErrors } {
  const value = (key: string) => {
    const item = form.get(key);
    return typeof item === "string"
      ? item.trim().normalize("NFC").replace(/\r\n?/g, "\n")
      : "";
  };
  const input = {
    name: value("name"),
    email: value("email"),
    company: value("company"),
    interest: value("interest"),
    message: value("message"),
    website: value("website"),
  };
  const errors: ContactErrors = {};
  if (
    !input.name ||
    input.name.length > contactLimits.name ||
    hasControls(input.name)
  )
    errors.name = contactFieldErrors.name;
  if (!isEmail(input.email)) errors.email = contactFieldErrors.email;
  if (
    input.company.length > contactLimits.company ||
    hasControls(input.company)
  )
    errors.company = contactFieldErrors.company;
  if (!(interests[branch] as readonly string[]).includes(input.interest))
    errors.interest = contactFieldErrors.interest;
  if (
    input.message.length < contactLimits.messageMin ||
    input.message.length > contactLimits.messageMax ||
    hasControls(input.message, true)
  )
    errors.message = contactFieldErrors.message;
  if (input.website) {
    try {
      const url = new URL(input.website);
      if (
        input.website.length > contactLimits.website ||
        !["https:", "http:"].includes(url.protocol) ||
        url.username ||
        url.password ||
        hasControls(input.website)
      )
        errors.website = contactFieldErrors.website;
    } catch {
      errors.website = contactFieldErrors.website;
    }
  }
  for (const field of Object.keys(input) as (keyof ContactInput)[]) {
    if (form.getAll(field).length > 1)
      errors[field] = contactFieldErrors[field];
  }
  if (branch !== "websites") input.website = "";
  return { input, errors };
}
