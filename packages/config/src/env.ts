import "server-only";
import { randomBytes } from "node:crypto";
import {
  ConfigurationError,
  resolveSites,
  type RuntimeMode,
} from "./resolve-sites.ts";
import { hasHeaderControls, isEmail } from "./validation.ts";
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
    WEBSITES_URL: process.env.WEBSITES_URL,
    CONSULTING_URL: process.env.CONSULTING_URL,
  });
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
