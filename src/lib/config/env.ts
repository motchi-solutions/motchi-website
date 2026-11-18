import "server-only";
import { randomBytes } from "node:crypto";
import {
  ConfigurationError,
  resolveSites,
  type RuntimeMode,
} from "./resolve-sites.ts";
import { hasHeaderControls, isEmail } from "./validation.ts";
import { sites as productionSites } from "./sites.ts";
import { turnstileTestSecrets } from "../security/turnstile.ts";
export { ConfigurationError } from "./resolve-sites.ts";

function runtimeMode(): RuntimeMode {
  return process.env.NODE_ENV === "production"
    ? "production"
    : process.env.NODE_ENV === "test"
      ? "test"
      : "development";
}
export function getSites() {
  return resolveSites(runtimeMode(), {
    SOLUTIONS_URL: process.env.SOLUTIONS_URL,
  });
}
/** Search engines may index the site only on the production origin, and only
    once ALLOW_INDEXING is "true". Preview deployments also default to the
    production origin, so the origin alone is not enough. */
export function indexingAllowed(): boolean {
  return (
    process.env.ALLOW_INDEXING === "true" &&
    getSites().solutions.url === productionSites.solutions.url
  );
}
const developmentState = globalThis as typeof globalThis & {
  __motchiDevelopmentFormSecret?: string;
};
export function getFormSecret(): string {
  const secret = process.env.CONTACT_FORM_SECRET;
  if (secret) {
    if (secret.length < 32 || hasHeaderControls(secret))
      throw new ConfigurationError(["CONTACT_FORM_SECRET"]);
    return secret;
  }
  if (runtimeMode() === "production")
    throw new ConfigurationError(["CONTACT_FORM_SECRET"]);
  // A process-wide fallback makes development page/API bundles agree. Never used in production.
  developmentState.__motchiDevelopmentFormSecret ??=
    randomBytes(32).toString("hex");
  return developmentState.__motchiDevelopmentFormSecret;
}
/* Cloudflare Turnstile keys. Development and tests fall back to Cloudflare's
   public test keys (always pass, invisible); production requires real ones.
   https://developers.cloudflare.com/turnstile/troubleshooting/testing/ */
const turnstileTestKeys = {
  siteKey: "1x00000000000000000000BB",
  secretKey: "1x0000000000000000000000000000000AA",
};
export function getTurnstileSettings(): {
  siteKey: string;
  secretKey: string;
} {
  const siteKey = process.env.TURNSTILE_SITE_KEY?.trim() ?? "";
  const secretKey = process.env.TURNSTILE_SECRET_KEY?.trim() ?? "";
  if (siteKey && secretKey) {
    if (
      !/^[\w-]{10,100}$/.test(siteKey) ||
      hasHeaderControls(secretKey) ||
      secretKey.length > 200 ||
      // Cloudflare's public test keys always pass; never on the live site.
      // (Tests and CI builds use NODE_ENV=production with test keys.)
      (process.env.VERCEL_ENV === "production" &&
        (turnstileTestSecrets.has(secretKey) ||
          /^[123]x0{20}[A-F]{2}$/.test(siteKey)))
    )
      throw new ConfigurationError([
        "TURNSTILE_SITE_KEY",
        "TURNSTILE_SECRET_KEY",
      ]);
    return { siteKey, secretKey };
  }
  if (runtimeMode() === "production")
    throw new ConfigurationError([
      "TURNSTILE_SITE_KEY",
      "TURNSTILE_SECRET_KEY",
    ]);
  return turnstileTestKeys;
}
/** The public half only, for rendering the widget. */
export function getTurnstileSiteKey(): string | null {
  try {
    return getTurnstileSettings().siteKey;
  } catch {
    return null;
  }
}
/* Upstash Redis for shared rate limits, connected through the Vercel
   Marketplace (which creates KV_REST_API_URL and KV_REST_API_TOKEN, plus
   KV_URL, REDIS_URL and KV_REST_API_READ_ONLY_TOKEN that this site does not
   use: limits need write access over HTTPS). UPSTASH_REDIS_REST_URL/TOKEN
   from an Upstash account work too. Optional: without them, limits are kept
   in server memory. */
let redisWarning = false;
export function getRedisSettings(): { url: string; token: string } | null {
  const url = (
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL ||
    ""
  ).trim();
  const token = (
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    ""
  ).trim();
  const warn = (category: string) => {
    if (redisWarning) return;
    redisWarning = true;
    console.error("Shared rate limits unavailable; using server memory", {
      category,
    });
  };
  if (!url || !token) {
    if (runtimeMode() === "production") warn("REDIS_NOT_CONFIGURED");
    return null;
  }
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" || hasHeaderControls(token))
      throw new Error("Invalid Redis settings.");
    return { url: parsed.origin, token };
  } catch {
    warn("REDIS_MISCONFIGURED");
    return null;
  }
}
export type ServerEnv = {
  mode: RuntimeMode;
  sites: ReturnType<typeof getSites>;
  contact: {
    fromEmail: string;
    toEmail: string;
    apiKey: string;
    formSecret: string;
  };
};
export function getServerEnv(): ServerEnv {
  const fromEmail = process.env.CONTACT_FROM_EMAIL?.trim() ?? "";
  const toEmail = process.env.CONTACT_TO_EMAIL?.trim() ?? "";
  const apiKey = process.env.BREVO_API_KEY?.trim() ?? "";
  const invalid: string[] = [];
  if (!isEmail(fromEmail)) invalid.push("CONTACT_FROM_EMAIL");
  if (!isEmail(toEmail)) invalid.push("CONTACT_TO_EMAIL");
  if (!apiKey || hasHeaderControls(apiKey)) invalid.push("BREVO_API_KEY");
  if (invalid.length) throw new ConfigurationError(invalid);
  return {
    mode: runtimeMode(),
    sites: getSites(),
    contact: { fromEmail, toEmail, apiKey, formSecret: getFormSecret() },
  };
}
