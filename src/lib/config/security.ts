const development = process.env.NODE_ENV !== "production";
// Next's static hydration scripts require inline scripts. See docs/AUDIT.md
// for the nonce-based CSP option when accepting dynamic rendering.
// Cloudflare Turnstile (contact form bot check) needs its script and iframe:
// https://developers.cloudflare.com/turnstile/reference/content-security-policy/
const turnstile = "https://challenges.cloudflare.com";
export const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  // No other site's window may keep a handle on ours.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // HTTPS only for two years. Vercel sends the same header; stating it here
  // keeps it on any other host. See docs/AUDIT.md before adding
  // includeSubDomains or preload.
  ...(development
    ? []
    : [{ key: "Strict-Transport-Security", value: "max-age=63072000" }]),
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      "manifest-src 'self'",
      "worker-src 'self'",
      `script-src 'self' 'unsafe-inline' ${turnstile}${development ? " 'unsafe-eval'" : ""}`,
      `frame-src ${turnstile}`,
      "style-src 'self' 'unsafe-inline'",
      `connect-src 'self'${development ? " ws: wss:" : ""}`,
      ...(development ? [] : ["upgrade-insecure-requests"]),
    ].join("; "),
  },
];
