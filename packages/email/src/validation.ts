export const interests = {
  solutions: ["Websites", "Consulting", "Products", "Something else"],
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
export function isEmail(value: string): boolean {
  if (value.length > 254 || hasControls(value)) return false;
  const parts = value.split("@");
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  if (
    local.length > 64 ||
    !/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*$/i.test(
      local,
    )
  )
    return false;
  const labels = domain.split(".");
  return (
    labels.length >= 2 &&
    labels.every(
      (label) =>
        label.length <= 63 && /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(label),
    )
  );
}
export function validateContact(
  form: FormData,
  branch: ContactBranch,
): { input: ContactInput; errors: ContactErrors } {
  const value = (key: string) => {
    const item = form.get(key);
    return typeof item === "string" ? item.trim() : "";
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
  if (!input.name || input.name.length > 100 || hasControls(input.name))
    errors.name = "Enter a name of up to 100 characters.";
  if (!isEmail(input.email)) errors.email = "Enter a valid email address.";
  if (input.company.length > 150 || hasControls(input.company))
    errors.company = "Use up to 150 characters without line breaks.";
  if (!(interests[branch] as readonly string[]).includes(input.interest))
    errors.interest = "Choose an area of interest.";
  if (
    input.message.length < 10 ||
    input.message.length > 5000 ||
    hasControls(input.message, true)
  )
    errors.message = "Enter a message between 10 and 5,000 characters.";
  if (input.website) {
    try {
      const url = new URL(input.website);
      if (
        input.website.length > 500 ||
        !["https:", "http:"].includes(url.protocol) ||
        url.username ||
        url.password ||
        hasControls(input.website)
      )
        errors.website = "Enter an http or https website URL.";
    } catch {
      errors.website = "Enter a complete website URL, including https://.";
    }
  }
  if (branch !== "websites") input.website = "";
  return { input, errors };
}
