import "server-only";
import { createHash, createHmac, randomBytes } from "node:crypto";
import {
  ConfigurationError,
  getFormSecret,
  getRedisSettings,
  getServerEnv,
  getSites,
  getTurnstileSettings,
  type ServerEnv,
} from "../config/env.ts";
import { claim, hit, release, settle } from "../security/rate-limit.ts";
import { verifyTurnstile } from "../security/turnstile.ts";
import { type ContactStatus, referencedStatuses } from "./feedback.ts";
import { signToken, verifyToken } from "./abuse.ts";
import { acknowledgement, notification } from "./templates.ts";
import { type ContactBranch, validateContact } from "./validation.ts";

/* Contact pipeline, cheapest checks first:
   origin -> body size -> honeypot -> signed form token (also a minimum fill
   time) -> per-IP limits -> field validation -> duplicate guard ->
   Cloudflare Turnstile -> per-email and site-wide limits -> Brevo.

   Limits (fixed windows): per IP 5 per 10 minutes and 20 per day; per email
   3 per hour (plus-tag variants share it); site-wide 40 per hour and 110 per
   day. Each enquiry sends two emails, so the site uses at most 220 of the
   Brevo account's 300 free daily emails and leaves about 75 for the other
   Motchi sites on the same account. Raise siteDay only with the Brevo plan. */
const minute = 60_000;
const limits = {
  ipShort: { limit: 5, window: 10 * minute },
  ipDay: { limit: 20, window: 24 * 60 * minute },
  email: { limit: 3, window: 60 * minute },
  siteHour: { limit: 40, window: 60 * minute },
  siteDay: { limit: 110, window: 24 * 60 * minute },
};

/** Checks everything sending needs before the form is shown, so visitors
    never fill in a form that cannot be sent. Returns null (and logs why)
    when online sending is unavailable; the form then offers email instead. */
export function prepareContactForm(
  branch: ContactBranch,
): { token: string; siteKey: string } | null {
  try {
    getServerEnv();
    const { siteKey } = getTurnstileSettings();
    getRedisSettings();
    return { token: createContactToken(), siteKey };
  } catch (error) {
    console.error("Contact form unavailable", {
      branch,
      category:
        error instanceof ConfigurationError ? error.category : "INTERNAL_ERROR",
      // Variable names only, never their values.
      variables:
        error instanceof ConfigurationError ? error.variables : undefined,
    });
    return null;
  }
}

export function createContactToken(): string {
  return signToken(
    getFormSecret(),
    Date.now(),
    randomBytes(16).toString("hex"),
  );
}

/** Brevo answered with an error: the message was definitely not accepted. */
class ProviderRejected extends Error {}

async function sendMail(payload: object, key: string): Promise<void> {
  // A timeout or network failure throws as-is: Brevo may or may not have
  // accepted the message.
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
  if (!result.ok)
    throw new ProviderRejected(`Brevo returned status ${result.status}.`);
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

/** The visitor's IP. On Vercel, x-real-ip is set by the platform and cannot
    be supplied by the visitor
    (https://vercel.com/docs/headers/request-headers). */
function clientIp(request: Request): string {
  return (
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

/** A keyed, one-way code, so stored rate-limit keys reveal nothing. */
function scramble(kind: string, value: string): string {
  return createHmac("sha256", getFormSecret())
    .update(`${kind}:${value}`)
    .digest("hex")
    .slice(0, 32);
}

function newReference(): string {
  return randomBytes(6)
    .toString("base64")
    .replace(/[^A-Za-z0-9]/g, "")
    .toUpperCase()
    .padEnd(8, "X")
    .slice(0, 8);
}

async function submitContact(
  request: Request,
  branch: ContactBranch,
): Promise<Response> {
  const site = getSites()[branch];
  const origin = site.url;
  const finish = (
    status: ContactStatus,
    extra: { fields?: string; retryMs?: number; reference?: string } = {},
    relative = false,
  ) => {
    const url = new URL("/contact", origin);
    url.searchParams.set("status", status);
    if (extra.fields) url.searchParams.set("fields", extra.fields);
    if (extra.retryMs)
      url.searchParams.set("retry", String(Math.ceil(extra.retryMs / minute)));
    if (extra.reference && referencedStatuses.includes(status))
      url.searchParams.set("ref", extra.reference);
    url.hash = "contact-form";
    // A rejected origin gets a relative redirect, so the browser stays on the
    // origin it came from instead of following a cross-origin Location that
    // the page's connect-src policy blocks.
    const location = relative
      ? `${url.pathname}${url.search}${url.hash}`
      : url.toString();
    return new Response(null, {
      status: 303,
      headers: { Location: location, "Cache-Control": "no-store" },
    });
  };
  const reference = newReference();
  const log = (message: string, category: string) =>
    console.error(message, { branch, category, reference });

  if (
    request.headers.get("origin") !== origin ||
    request.headers.get("sec-fetch-site") === "cross-site"
  ) {
    if (process.env.NODE_ENV === "development")
      console.warn(
        `Contact form rejected: request origin ${request.headers.get("origin") ?? "(none)"} does not match the configured site origin ${origin}. Check SITE_URL in .env.local.`,
      );
    return finish("invalid", {}, true);
  }
  let form: FormData;
  try {
    form = await limitedForm(request);
  } catch {
    return finish("invalid");
  }
  if (form.getAll("token").length !== 1 || form.getAll("fax").length > 1)
    return finish("invalid");
  // Honeypot: bots that fill every field are told it worked.
  if (form.get("fax")) return finish("sent");
  const token = form.get("token");
  try {
    if (typeof token !== "string" || !verifyToken(getFormSecret(), token))
      return finish("expired");
  } catch {
    log("Contact configuration unavailable", "CONFIGURATION_ERROR");
    return finish("configuration", { reference });
  }

  const redis = getRedisSettings();
  const ip = clientIp(request);
  const ipKey = scramble("ip", ip);

  for (const [name, rule] of [
    ["ip10m", limits.ipShort],
    ["ipday", limits.ipDay],
  ] as const) {
    const result = await hit(
      `contact:${name}:${ipKey}`,
      rule.limit,
      rule.window,
      redis,
    );
    if (!result.allowed)
      return finish("limited", { retryMs: result.retryAfterMs });
  }

  const { input, errors } = validateContact(form, branch);
  if (Object.keys(errors).length)
    return finish("invalid", { fields: Object.keys(errors).join(",") });

  let environment: ServerEnv;
  let turnstile: ReturnType<typeof getTurnstileSettings>;
  try {
    environment = getServerEnv();
    turnstile = getTurnstileSettings();
  } catch (error) {
    log(
      "Contact configuration unavailable",
      error instanceof ConfigurationError ? error.category : "INTERNAL_ERROR",
    );
    return finish("configuration", { reference });
  }
  // One send per signed form token. Checked before Turnstile, whose token
  // is single-use, so a repeated submission gets its original outcome.
  const submission = `contact:sent:${createHash("sha256").update(String(token)).digest("hex").slice(0, 32)}`;
  const previous = await claim(submission, 60 * minute, redis);
  if (previous === "sent" || previous === "partial") return finish(previous);
  if (previous) return finish("busy");
  const human = await verifyTurnstile({
    token: String(form.get("cf-turnstile-response") ?? ""),
    secret: turnstile.secretKey,
    ip: ip === "unknown" ? undefined : ip,
    hostname: new URL(origin).hostname,
  });
  if (!human.ok) {
    await release(submission, redis);
    if (human.reason === "failed") return finish("verification");
    log("Bot check unavailable", "VERIFICATION_PROVIDER_ERROR");
    return finish("failed", { reference });
  }

  // Per-email and site-wide limits count only submissions that passed the
  // bot check, so unverified traffic cannot lock out an address or the form.
  // Plus-tag variants (name+1@...) reach the same mailbox, so share a budget.
  const [local, domain] = input.email.toLowerCase().split("@");
  const emailKey = scramble("email", `${local.split("+")[0]}@${domain}`);
  for (const [key, rule] of [
    [`contact:email:${emailKey}`, limits.email],
    ["contact:site:hour", limits.siteHour],
    ["contact:site:day", limits.siteDay],
  ] as const) {
    const result = await hit(key, rule.limit, rule.window, redis);
    if (!result.allowed) {
      await release(submission, redis);
      return finish("limited", { retryMs: result.retryAfterMs });
    }
  }

  const { fromEmail: from, toEmail: to, apiKey } = environment.contact;
  const homeUrl = environment.sites.solutions.url;
  const sender = { email: from, name: site.name };
  try {
    await sendMail(
      {
        sender,
        to: [{ email: to, contactPixelTrackingConsent: false }],
        replyTo: { email: input.email, name: input.name },
        ...notification(input, site.name, homeUrl),
      },
      apiKey,
    );
  } catch (error) {
    if (error instanceof ProviderRejected) {
      // Definitely not sent: let the visitor try again with this form.
      await release(submission, redis);
      log("Contact notification rejected", "EMAIL_PROVIDER_ERROR");
      return finish("failed", { reference });
    }
    // Unknown outcome: keep the claim so a retry cannot send it twice.
    log("Contact notification unconfirmed", "EMAIL_PROVIDER_TIMEOUT");
    return finish("unavailable", { reference });
  }
  try {
    await sendMail(
      {
        sender,
        to: [
          {
            email: input.email,
            name: input.name,
            // Opens and clicks are counted only anonymously, never tied to the
            // person (the privacy policy promises this). Source: Brevo API
            // changelog, 2026-07-21, contactPixelTrackingConsent on POST /smtp/email.
            contactPixelTrackingConsent: false,
          },
        ],
        replyTo: { email: to, name: site.name },
        ...acknowledgement(input.name, site.name, homeUrl),
      },
      apiKey,
    );
    await settle(submission, "sent", 60 * minute, redis);
    return finish("sent");
  } catch {
    await settle(submission, "partial", 60 * minute, redis);
    log("Contact acknowledgement failed", "EMAIL_PROVIDER_ERROR");
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
    const reference = newReference();
    console.error("Contact request failed", {
      branch,
      category:
        error instanceof ConfigurationError ? error.category : "INTERNAL_ERROR",
      reference,
    });
    // Source-controlled production fallback avoids reflecting an untrusted request Host.
    const { sites } = await import("../config/sites.ts");
    const url = new URL("/contact", sites[branch].url);
    const status =
      error instanceof ConfigurationError ? "configuration" : "failed";
    url.searchParams.set("status", status);
    url.searchParams.set("ref", reference);
    url.hash = "contact-form";
    return new Response(null, {
      status: 303,
      headers: { Location: url.href, "Cache-Control": "no-store" },
    });
  }
}
