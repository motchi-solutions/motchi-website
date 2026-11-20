import { defineConfig, devices } from "@playwright/test";
import process from "node:process";

/* Browser tests (end-to-end, accessibility, responsive layout). They use the
   installed Google Chrome, so no browser download is needed, and never send
   real mail: contact submissions are intercepted in the tests.

   Locally the suite reuses a running `npm run dev` on port 3000 (or starts
   one). In CI it builds and serves the production app. */
const port = Number(process.env.E2E_PORT ?? 3000);
const baseURL = `http://localhost:${port}`;
const ci = Boolean(process.env.CI);

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: ci,
  retries: ci ? 1 : 0,
  workers: ci ? 2 : undefined,
  reporter: ci ? [["list"], ["html", { open: "never" }]] : "list",
  timeout: 45_000,
  expect: { timeout: 7_500 },
  use: {
    baseURL,
    channel: "chrome",
    // Motion is tested on purpose in motion.spec.ts; elsewhere it only slows
    // the suite and makes timing less predictable.
    reducedMotion: "reduce",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "mobile",
      use: {
        ...devices["Pixel 7"],
        // Pixel 7 defaults to Chromium; keep the installed Chrome channel.
        channel: "chrome",
      },
    },
  ],
  webServer: {
    command: ci
      ? `npm run build && npx next start --port ${port}`
      : `npm run dev -- --port ${port}`,
    url: baseURL,
    reuseExistingServer: !ci,
    timeout: 240_000,
    env: {
      NEXT_TELEMETRY_DISABLED: "1",
      // A throwaway signing secret so the production build can render the
      // contact form in CI. It signs nothing outside the test run.
      CONTACT_FORM_SECRET:
        process.env.CONTACT_FORM_SECRET ?? "e2e-only-contact-form-secret-0000",
      // Cloudflare's public Turnstile test keys (always pass). The widget
      // itself is stubbed in the tests, so nothing reaches Cloudflare.
      TURNSTILE_SITE_KEY: "1x00000000000000000000BB",
      TURNSTILE_SECRET_KEY: "1x0000000000000000000000000000000AA",
      // Placeholder email settings so the form opens. These override any
      // real values in .env.local, and every submission is intercepted.
      ...(ci
        ? {
            BREVO_API_KEY: "e2e-placeholder-not-a-key",
            CONTACT_FROM_EMAIL: "e2e-sender@example.com",
            CONTACT_TO_EMAIL: "e2e-inbox@example.com",
          }
        : {}),
      // Production builds reject loopback origins, so a local .env.local
      // meant for `npm run dev` must not leak into the production test build.
      // Process variables take precedence over Next's .env files.
      ...(ci
        ? {
            SITE_URL: process.env.SITE_URL ?? "https://www.motchi.ca",
          }
        : {}),
    },
  },
});
