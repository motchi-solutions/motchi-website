import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { family } from "@motchi/brand";
import { createLimiter, signToken, verifyToken } from "./abuse.ts";
import { acknowledgement, notification } from "./templates.ts";
import { type ContactBranch, isEmail, validateContact } from "./validation.ts";

const emailLimit = createLimiter(3, 3_600_000);
const globalLimit = createLimiter(60, 3_600_000);
const submissions = new Map<
  string,
  { expires: number; state: "pending" | "sent" | "partial" }
>();
const localSecret = randomBytes(32).toString("hex");
function formSecret(): string {
  const secret = process.env.CONTACT_FORM_SECRET;
  if (secret && secret.length >= 32) return secret;
  if (process.env.NODE_ENV === "production")
    throw new Error("CONTACT_FORM_SECRET must contain at least 32 characters.");
  return localSecret;
}
export function createContactToken(): string {
  return signToken(formSecret(), Date.now(), randomBytes(16).toString("hex"));
}
async function sendMail(payload: object): Promise<void> {
  const key = process.env.BREVO_API_KEY;
  if (!key) throw new Error("Brevo is not configured.");
  const result = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": key,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(10_000),
    cache: "no-store",
  });
  if (!result.ok) throw new Error(`Brevo returned status ${result.status}.`);
}
async function limitedForm(request: Request): Promise<FormData> {
  if (
    !request.headers
      .get("content-type")
      ?.startsWith("application/x-www-form-urlencoded")
  )
    throw new Error("Invalid form encoding.");
  if (Number(request.headers.get("content-length")) > 24_000)
    throw new Error("Form too large.");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("Empty form.");
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > 24_000) {
      await reader.cancel();
      throw new Error("Form too large.");
    }
    chunks.push(value);
  }
  const params = new URLSearchParams(Buffer.concat(chunks).toString("utf8"));
  const form = new FormData();
  for (const [key, value] of params) form.append(key, value);
  return form;
}
export async function handleContact(
  request: Request,
  branch: ContactBranch,
): Promise<Response> {
  const site = family[branch];
  const origin =
    process.env.NODE_ENV === "production"
      ? site.domain
      : new URL(request.url).origin;
  const finish = (status: string, fields = "") => {
    const url = new URL("/contact", origin);
    url.searchParams.set("status", status);
    if (fields) url.searchParams.set("fields", fields);
    url.hash = "contact-form";
    return new Response(null, {
      status: 303,
      headers: { Location: url.toString(), "Cache-Control": "no-store" },
    });
  };
  if (
    request.headers.get("origin") !== origin ||
    request.headers.get("sec-fetch-site") === "cross-site"
  )
    return finish("invalid");
  let form: FormData;
  try {
    form = await limitedForm(request);
  } catch {
    return finish("invalid");
  }
  if (form.get("fax")) return finish("sent");
  const token = form.get("token");
  try {
    if (typeof token !== "string" || !verifyToken(formSecret(), token))
      return finish("expired");
  } catch {
    return finish("unavailable");
  }
  const { input, errors } = validateContact(form, branch);
  if (Object.keys(errors).length)
    return finish("invalid", Object.keys(errors).join(","));
  const id = createHash("sha256").update(String(token)).digest("hex");
  for (const [key, item] of submissions)
    if (item.expires <= Date.now()) submissions.delete(key);
  const prior = submissions.get(id);
  if (prior) return finish(prior.state === "pending" ? "busy" : prior.state);
  if (submissions.size >= 2000) return finish("busy");
  const emailHash = createHash("sha256")
    .update(input.email.toLowerCase())
    .digest("hex");
  if (!emailLimit(emailHash) || !globalLimit("all")) return finish("limited");
  const from = process.env.CONTACT_FROM_EMAIL ?? "";
  const to = process.env.CONTACT_TO_EMAIL ?? "";
  if (!isEmail(from) || !isEmail(to) || !process.env.BREVO_API_KEY)
    return finish("unavailable");
  submissions.set(id, { expires: Date.now() + 3_600_000, state: "pending" });
  const sender = { email: from, name: site.name };
  try {
    await sendMail({
      sender,
      to: [{ email: to }],
      replyTo: { email: input.email, name: input.name },
      ...notification(input, site.name),
      headers: { "Idempotency-Key": `enquiry-${id}` },
    });
  } catch {
    submissions.delete(id);
    console.error("Contact notification failed", {
      branch,
      reference: id.slice(0, 12),
    });
    return finish("unavailable");
  }
  submissions.set(id, { expires: Date.now() + 3_600_000, state: "partial" });
  try {
    await sendMail({
      sender,
      to: [{ email: input.email, name: input.name }],
      replyTo: { email: to, name: site.name },
      ...acknowledgement(input.name, site.name),
      headers: { "Idempotency-Key": `ack-${id}` },
    });
    submissions.set(id, { expires: Date.now() + 3_600_000, state: "sent" });
    return finish("sent");
  } catch {
    console.error("Contact acknowledgement failed", {
      branch,
      reference: id.slice(0, 12),
    });
    return finish("partial");
  }
}
