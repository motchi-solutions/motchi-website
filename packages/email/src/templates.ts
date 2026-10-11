import { palette as colors } from "@motchi/brand";
import { organization, sites } from "@motchi/config/sites";
import type { ContactInput } from "./validation.ts";

export function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ] ?? character,
  );
}
function shell(title: string, body: string, homeUrl: string): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)}</title></head><body style="margin:0;background:${colors.cream};font-family:Arial,Helvetica,sans-serif;color:${colors.charcoal}"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:24px 12px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-top:4px solid ${colors.gold}"><tr><td style="padding:28px"><p style="font-size:14px;color:${colors.burgundy};font-weight:bold">${escapeHtml(organization.displayName.toUpperCase())}</p><h1 style="font-size:24px;line-height:1.3">${escapeHtml(title)}</h1>${body}<p style="font-size:13px;line-height:1.6;margin-top:28px">Technology without the complexity.<br><a style="color:${colors.burgundy}" href="${escapeHtml(homeUrl)}">${escapeHtml(new URL(homeUrl).host)}</a></p></td></tr></table></td></tr></table></body></html>`;
}
export function notification(
  input: ContactInput,
  branchName: string,
  homeUrl: string = sites.solutions.url,
) {
  const rows = [
    ["Name", input.name],
    ["Email", input.email],
    ["Company", input.company || "Not provided"],
    ["Interest", input.interest],
    ["Existing website", input.website || "Not provided"],
  ];
  return {
    subject: `New enquiry · ${branchName} · ${input.interest}`,
    textContent: `${branchName} enquiry\n\n${rows.map(([key, value]) => `${key}: ${value}`).join("\n")}\n\nMessage:\n${input.message}`,
    htmlContent: shell(
      "A new conversation",
      `<p>${escapeHtml(branchName)} enquiry</p><table width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;line-height:1.6;table-layout:fixed">${rows.map(([key, value]) => `<tr><th scope="row" style="text-align:left;vertical-align:top;padding:8px 8px 8px 0;width:35%">${key}</th><td style="padding:8px 0;overflow-wrap:anywhere">${escapeHtml(value)}</td></tr>`).join("")}</table><h2 style="font-size:18px">Message</h2><p style="line-height:1.7;overflow-wrap:anywhere">${escapeHtml(input.message).replace(/\n/g, "<br>")}</p>`,
      homeUrl,
    ),
  };
}
export function acknowledgement(
  name: string,
  branchName: string,
  homeUrl: string = sites.solutions.url,
) {
  const text = `Hello ${name},\n\nThank you for contacting ${branchName}. We have received your enquiry. We typically respond with next steps or an initial quote within 2–3 business days.\n\nIf you need to add anything, reply to this email.\n\n${organization.displayName}\n${homeUrl}`;
  return {
    subject: `We received your enquiry · ${branchName}`,
    textContent: text,
    htmlContent: shell(
      "Thanks for getting in touch",
      `<p style="line-height:1.7">Hello ${escapeHtml(name)},</p><p style="line-height:1.7">Thank you for contacting ${escapeHtml(branchName)}. We have received your enquiry.</p><p style="line-height:1.7">We typically respond with next steps or an initial quote within <strong>2–3 business days</strong>.</p><p style="line-height:1.7">If you need to add anything, reply to this email.</p>`,
      homeUrl,
    ),
  };
}
