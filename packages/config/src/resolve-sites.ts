import type { Branch } from "@motchi/brand";
import { sites, type Sites } from "./sites.ts";

export type RuntimeMode = "production" | "development" | "test";
export const siteVariables = {
  solutions: "SOLUTIONS_URL",
  websites: "WEBSITES_URL",
  consulting: "CONSULTING_URL",
} as const;
export type SiteOverrides = Partial<
  Record<(typeof siteVariables)[Branch], string>
>;
export class ConfigurationError extends Error {
  readonly category = "CONFIGURATION_ERROR";
  readonly variables: readonly string[];
  constructor(variables: readonly string[]) {
    // Names are safe diagnostics; never include submitted environment values.
    super(`Invalid or missing configuration: ${variables.join(", ")}`);
    this.name = "ConfigurationError";
    this.variables = variables;
  }
}
function loopback(hostname: string): boolean {
  hostname = hostname.replace(/\.$/, "");
  return (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname === "[::1]" ||
    hostname.startsWith("127.")
  );
}
export function resolveSites(
  mode: RuntimeMode,
  overrides: SiteOverrides = {},
): Sites {
  const resolved = {} as Sites;
  for (const branch of Object.keys(sites) as Branch[]) {
    const defaults = sites[branch];
    const variable = siteVariables[branch];
    const input =
      overrides[variable]?.trim() ||
      (mode === "development" ? defaults.localUrl : defaults.url);
    try {
      const url = new URL(input);
      if (
        !["http:", "https:"].includes(url.protocol) ||
        url.username ||
        url.password ||
        url.pathname !== "/" ||
        url.search ||
        url.hash ||
        (mode === "production" &&
          (url.protocol !== "https:" || loopback(url.hostname)))
      ) {
        throw new Error("Invalid site origin");
      }
      resolved[branch] = { ...defaults, url: url.origin };
    } catch {
      throw new ConfigurationError([variable]);
    }
  }
  return resolved;
}
