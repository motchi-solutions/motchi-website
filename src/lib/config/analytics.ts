/* Vercel Web Analytics: cookie-free, anonymous page-view counts. Visitors are
   counted with a hash of the request that Vercel discards after 24 hours.
   https://vercel.com/docs/analytics/privacy-policy

   Runs only on Vercel Production deployments (VERCEL_ENV is set by Vercel at
   build time), so local development, tests, and previews send nothing. The
   privacy policy's "Visitor statistics" section describes this; keep them in
   step. */
export function analyticsEnabled(
  environment: string | undefined = process.env.VERCEL_ENV,
): boolean {
  return environment === "production";
}

/** Campaign tags kept for source tracking, such as client-site footer links
    (utm_source=<client>&utm_medium=referral&utm_campaign=client-footer). */
export const campaignParams = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

/** Keeps the page path and any campaign tags. Every other query parameter and
    the fragment are dropped, because they can carry contact results and
    references (?status=...&ref=...). Tag values are trimmed and capped at 64
    characters so they cannot smuggle in longer data. */
export function anonymousPageUrl(url: string): string {
  const parsed = new URL(url);
  const kept = new URLSearchParams();
  for (const key of campaignParams) {
    const value = parsed.searchParams.get(key)?.trim();
    if (value) kept.set(key, value.slice(0, 64));
  }
  const query = kept.toString();
  return `${parsed.origin}${parsed.pathname}${query ? `?${query}` : ""}`;
}
