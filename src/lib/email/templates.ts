import { palette } from "../brand.ts";
import { firstCall, organization, sites } from "../config/sites.ts";
import type { ContactInput } from "./validation.ts";

/* Transactional email for the contact form. Email clients ignore site CSS, so
   these templates use tables and inline styles with the approved palette and
   the semantic tokens from src/styles/tokens.css. Every message has a
   plain-text alternative with the same content. Escape every value that came
   from the form; never place form values in attributes other than escaped,
   validated href values. */
const colors = {
  ...palette,
  muted: "#514B45",
  border: "#D7CFC1",
  surface: "#FCFAF5",
} as const;
const font = "'Helvetica Neue',Helvetica,Arial,sans-serif";

export function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ] ?? character,
  );
}
const paragraph = (html: string) =>
  `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:${colors.charcoal}">${html}</p>`;
const heading = (text: string) =>
  `<h2 style="margin:28px 0 12px;font-size:17px;line-height:1.35;font-weight:700;color:${colors.charcoal}">${escapeHtml(text)}</h2>`;
// Table-based so the burgundy fill survives Outlook and other older clients.
const button = (href: string, label: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 8px"><tr><td bgcolor="${colors.burgundy}" style="background:${colors.burgundy}"><a href="${escapeHtml(href)}" style="display:inline-block;padding:14px 24px;font-family:${font};font-size:15px;font-weight:700;line-height:1.2;color:${colors.cream};text-decoration:none">${escapeHtml(label)}</a></td></tr></table>`;
const link = (href: string, label: string) =>
  `<a href="${escapeHtml(href)}" style="color:${colors.burgundy};text-decoration:underline">${escapeHtml(label)}</a>`;

function shell({
  title,
  preheader,
  eyebrow,
  branchName,
  body,
  footer,
}: {
  title: string;
  preheader: string;
  eyebrow: string;
  branchName: string;
  body: string;
  footer: string;
}): string {
  const branch = branchName.replace(/^Motchi\s+/i, "").toUpperCase();
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"><title>${escapeHtml(title)}</title></head><body style="margin:0;padding:0;background:${colors.cream};font-family:${font};color:${colors.charcoal}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${colors.cream}">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${colors.cream}" style="background:${colors.cream}"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px">
<tr><td style="padding:0 4px 20px;font-family:${font}">
<p style="margin:0;font-size:15px;line-height:1.2;font-weight:700;letter-spacing:4px;color:${colors.charcoal}">MOTCHI</p>
<p style="margin:4px 0 0;font-size:11px;line-height:1.2;font-weight:700;letter-spacing:3px;color:${colors.burgundy}">${escapeHtml(branch)}</p>
</td></tr>
<tr><td bgcolor="${colors.surface}" style="background:${colors.surface};border:1px solid ${colors.border};border-top:2px solid ${colors.gold};border-radius:0 24px 0 0;padding:32px 32px 28px;font-family:${font}">
<p style="margin:0 0 8px;font-size:12px;line-height:1.4;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${colors.burgundy}">${escapeHtml(eyebrow)}</p>
<h1 style="margin:0 0 20px;font-size:26px;line-height:1.25;font-weight:700;color:${colors.burgundy}">${escapeHtml(title)}</h1>
${body}
</td></tr>
<tr><td style="padding:20px 4px 0;font-family:${font};font-size:13px;line-height:1.6;color:${colors.muted}">${footer}</td></tr>
</table></td></tr></table></body></html>`;
}

/* The wizard sends one "Label: value" line per answer, then an optional
   "Additional details:" block of free text. Treat the parsed rows as display
   formatting only: they are still visitor input. */
function splitMessage(message: string) {
  const lines = message.split("\n");
  const marker = lines.indexOf("Additional details:");
  const summary = marker === -1 ? lines : lines.slice(0, marker);
  const rows = summary
    .map((line) => /^([A-Za-z][A-Za-z /()]{1,40}): (.+)$/.exec(line))
    .filter((match): match is RegExpExecArray => match !== null)
    .map((match) => [match[1], match[2]] as const);
  // Plain messages (not from the wizard) stay whole.
  if (rows.length !== summary.filter((line) => line.trim()).length)
    return { rows: [] as (readonly [string, string])[], details: message };
  return {
    rows,
    details: marker === -1 ? "" : lines.slice(marker + 1).join("\n"),
  };
}

export function notification(
  input: ContactInput,
  branchName: string,
  homeUrl: string = sites.solutions.url,
) {
  const { rows: answers, details } = splitMessage(input.message);
  const phone = answers.find(([label]) => label === "Phone")?.[1];
  const contactRows: (readonly [string, string, string?])[] = [
    ["Name", input.name],
    ["Email", input.email, `mailto:${input.email}`],
    ...(phone
      ? [["Phone", phone, `tel:${phone.replace(/[^\d+]/g, "")}`] as const]
      : []),
    ["Company", input.company || "Not provided"],
    // Only the validated website field becomes a link; a website mentioned
    // in the message stays plain text.
    input.website
      ? (["Website", input.website, input.website] as const)
      : ([
          "Website",
          answers.find(([label]) => label === "Website")?.[1] ?? "Not provided",
        ] as const),
  ];
  const enquiryRows = [
    ["Interest", input.interest] as const,
    // The wizard repeats the budget in its own answers; show it once.
    ...(input.budget && !answers.some(([label]) => label.startsWith("Budget"))
      ? [["Website budget (CAD)", input.budget] as const]
      : []),
    ...answers.filter(([label]) => label !== "Phone" && label !== "Website"),
  ];
  const table = (rows: readonly (readonly [string, string, string?])[]) =>
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="table-layout:fixed;border-collapse:collapse;font-size:15px;line-height:1.5">${rows
      .map(
        ([label, value, href]) =>
          `<tr><td style="width:36%;padding:10px 12px 10px 0;border-top:1px solid ${colors.border};vertical-align:top;color:${colors.muted};font-weight:600">${escapeHtml(label)}</td><td style="padding:10px 0;border-top:1px solid ${colors.border};vertical-align:top;color:${colors.charcoal};word-break:break-word;overflow-wrap:anywhere">${href ? link(href, value) : escapeHtml(value)}</td></tr>`,
      )
      .join("")}</table>`;
  const firstName = input.name.trim().split(/\s+/)[0];
  const text = [
    `New ${input.interest} enquiry from ${input.name}`,
    `${branchName} contact form`,
    "",
    "CONTACT",
    ...contactRows.map(([label, value]) => `${label}: ${value}`),
    "",
    "ENQUIRY",
    ...enquiryRows.map(([label, value]) => `${label}: ${value}`),
    ...(details.trim() ? ["", "MESSAGE", details.trim()] : []),
    "",
    `Reply to this email to respond to ${input.name}.`,
  ].join("\n");
  return {
    subject: `New enquiry - ${branchName} - ${input.interest}`,
    textContent: text,
    htmlContent: shell({
      title: `New enquiry from ${input.name}`,
      preheader: `${input.interest} enquiry from ${input.name}, via ${branchName}.`,
      eyebrow: `${input.interest} enquiry`,
      branchName,
      body: `${heading("Contact")}${table(contactRows)}${button(`mailto:${input.email}?subject=${encodeURIComponent(`Re: Your ${branchName} enquiry`)}`, `Reply to ${firstName}`)}${heading("Enquiry")}${table(enquiryRows)}${
        details.trim()
          ? `${heading("Message")}<div style="padding:16px 18px;background:${colors.cream};font-size:15px;line-height:1.65;color:${colors.charcoal};word-break:break-word;overflow-wrap:anywhere">${escapeHtml(details.trim()).replace(/\n/g, "<br>")}</div>`
          : ""
      }`,
      footer: `Sent from the contact form on ${link(homeUrl, new URL(homeUrl).host)}. Replying to this email goes to ${escapeHtml(input.name)}.`,
    }),
  };
}

/* Sent to the address typed into the form, so it never repeats the visitor's
   message: that would let the form relay arbitrary text to anyone. */
export function acknowledgement(
  name: string,
  branchName: string,
  homeUrl: string = sites.solutions.url,
) {
  const host = new URL(homeUrl).host;
  const steps = [
    "We read your enquiry and think about how we can help.",
    "We reply within 2-3 business days with next steps or an initial quote.",
    `If it helps, we start with a free ${firstCall.length} intro call. There's no commitment.`,
  ];
  const text = [
    `Hello ${name},`,
    "",
    `Thank you for contacting ${branchName}. Your enquiry has arrived.`,
    "",
    "WHAT HAPPENS NEXT",
    ...steps.map((step, index) => `${index + 1}. ${step}`),
    ...(firstCall.url ? ["", `Book a free call: ${firstCall.url}`] : []),
    "",
    "Need to add something? Just reply to this email.",
    "",
    organization.displayName,
    `${organization.locationLabel} | ${homeUrl}`,
    "",
    `You're receiving this because this address was entered on the contact form at ${host}. If that wasn't you, you can ignore this email.`,
  ].join("\n");
  return {
    subject: `We've received your enquiry - ${branchName}`,
    textContent: text,
    htmlContent: shell({
      title: "Thanks for getting in touch",
      preheader: "We usually reply within 2-3 business days.",
      eyebrow: "Enquiry received",
      branchName,
      body: `${paragraph(`Hello ${escapeHtml(name)},`)}${paragraph(`Thank you for contacting ${escapeHtml(branchName)}. Your enquiry has arrived.`)}${heading("What happens next")}<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">${steps
        .map(
          (step, index) =>
            `<tr><td style="width:40px;padding:0 0 14px;vertical-align:top"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td width="28" height="28" align="center" bgcolor="${colors.burgundy}" style="width:28px;height:28px;border-radius:14px;background:${colors.burgundy};color:${colors.cream};font-size:13px;font-weight:700;line-height:28px;font-family:${font}">${index + 1}</td></tr></table></td><td style="padding:3px 0 14px;font-size:16px;line-height:1.55;color:${colors.charcoal}">${escapeHtml(step)}</td></tr>`,
        )
        .join(
          "",
        )}</table>${firstCall.url ? button(firstCall.url, "Book a Free Call") : ""}${paragraph(`Need to add something? Just reply to this email.`)}<p style="margin:24px 0 0;font-size:16px;line-height:1.6;color:${colors.charcoal}">${escapeHtml(organization.displayName)}</p>`,
      footer: `${escapeHtml(organization.displayName)} | ${escapeHtml(organization.locationLabel)} | ${link(homeUrl, host)}<br>You're receiving this because this address was entered on the contact form at ${escapeHtml(host)}. If that wasn't you, you can ignore this email.`,
    }),
  };
}
