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

/** Keeps only the page path. Query strings and fragments can carry contact
    results and references (?status=...&ref=...), so they are never sent. */
export function anonymousPageUrl(url: string): string {
  const parsed = new URL(url);
  return `${parsed.origin}${parsed.pathname}`;
}
