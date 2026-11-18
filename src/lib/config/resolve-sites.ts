import { sites, type Sites } from "./sites.ts";

export type RuntimeMode = "production" | "development" | "test";
export type SiteOverrides = { SOLUTIONS_URL?: string };
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
  const input =
    overrides.SOLUTIONS_URL?.trim() ||
    (mode === "development" ? sites.solutions.localUrl : sites.solutions.url);
  let origin: string;
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
    )
      throw new Error("Invalid site origin");
    origin = url.origin;
  } catch {
    throw new ConfigurationError(["SOLUTIONS_URL"]);
  }
  return Object.fromEntries(
    Object.entries(sites).map(([branch, site]) => [
      branch,
      { ...site, url: origin + (branch === "solutions" ? "" : `/${branch}`) },
    ]),
  ) as Sites;
}
