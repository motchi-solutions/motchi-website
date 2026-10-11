import "server-only";
import { createHash, randomBytes } from "node:crypto";
import {
  ConfigurationError,
  getFormSecret,
  getServerEnv,
  getSites,
  type ServerEnv,
} from "@motchi/config/env";
import type { ContactStatus } from "./feedback.ts";
import { createLimiter, signToken, verifyToken } from "./abuse.ts";
import { acknowledgement, notification } from "./templates.ts";
import { type ContactBranch, validateContact } from "./validation.ts";

const emailLimit = createLimiter(3, 3_600_000);
const globalLimit = createLimiter(60, 3_600_000);
const submissions = new Map<
  string,
  { expires: number; state: "pending" | "sent" | "partial" }
>();
export function createContactToken(): string {
  return signToken(
    getFormSecret(),
    Date.now(),
    randomBytes(16).toString("hex"),
  );
}
async function sendMail(payload: object, key: string): Promise<void> {
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
async function submitContact(
  request: Request,
  branch: ContactBranch,
): Promise<Response> {
  const site = getSites()[branch];
  const origin = site.url;
  const finish = (status: ContactStatus, fields = "") => {
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
  if (form.getAll("token").length !== 1 || form.getAll("fax").length > 1)
    return finish("invalid");
  if (form.get("fax")) return finish("sent");
  const token = form.get("token");
  try {
    if (typeof token !== "string" || !verifyToken(getFormSecret(), token))
      return finish("expired");
  } catch {
    console.error("Contact configuration unavailable", {
      branch,
      category: "CONFIGURATION_ERROR",
    });
    return finish("configuration");
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
  let environment: ServerEnv;
  try {
    environment = getServerEnv();
  } catch (error) {
    console.error("Contact configuration unavailable", {
      branch,
      category:
        error instanceof ConfigurationError ? error.category : "INTERNAL_ERROR",
    });
    return finish("configuration");
  }
  const { fromEmail: from, toEmail: to, apiKey } = environment.contact;
  const homeUrl = environment.sites.solutions.url;
  submissions.set(id, { expires: Date.now() + 3_600_000, state: "pending" });
  const sender = { email: from, name: site.name };
  try {
    await sendMail(
      {
        sender,
        to: [{ email: to }],
        replyTo: { email: input.email, name: input.name },
        ...notification(input, site.name, homeUrl),
        headers: { "Idempotency-Key": `enquiry-${id}` },
      },
      apiKey,
    );
  } catch {
    submissions.delete(id);
    console.error("Contact notification failed", {
      branch,
      category: "EMAIL_PROVIDER_ERROR",
      reference: id.slice(0, 12),
    });
    return finish("unavailable");
  }
  submissions.set(id, { expires: Date.now() + 3_600_000, state: "partial" });
  try {
    await sendMail(
      {
        sender,
        to: [{ email: input.email, name: input.name }],
        replyTo: { email: to, name: site.name },
        ...acknowledgement(input.name, site.name, homeUrl),
        headers: { "Idempotency-Key": `ack-${id}` },
      },
      apiKey,
    );
    submissions.set(id, { expires: Date.now() + 3_600_000, state: "sent" });
    return finish("sent");
  } catch {
    console.error("Contact acknowledgement failed", {
      branch,
      category: "EMAIL_PROVIDER_ERROR",
      reference: id.slice(0, 12),
    });
    return finish("partial");
  }
}

export async function handleContact(
  request: Request,
  branch: ContactBranch,
): Promise<Response> {
  try {
    return await submitContact(request, branch);
  } catch (error) {
    console.error("Contact request failed", {
      branch,
      category:
        error instanceof ConfigurationError ? error.category : "INTERNAL_ERROR",
      reference: randomBytes(6).toString("hex"),
    });
    // Source-controlled production fallback avoids reflecting an untrusted request Host.
    const { sites } = await import("@motchi/config/sites");
    const url = new URL("/contact", sites[branch].url);
    url.searchParams.set(
      "status",
      error instanceof ConfigurationError ? "configuration" : "unavailable",
    );
    url.hash = "contact-form";
    return new Response(null, {
      status: 303,
      headers: { Location: url.href, "Cache-Control": "no-store" },
    });
  }
}
