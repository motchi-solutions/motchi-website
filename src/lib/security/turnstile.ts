/* Server-side check of a Cloudflare Turnstile token. Every submission is
   verified here; the widget alone proves nothing.

   Source: Cloudflare Turnstile, "Validate the token"
   (https://developers.cloudflare.com/turnstile/get-started/server-side-validation/):
   POST to siteverify with the secret, the token, and optionally the visitor
   IP and an idempotency key; tokens last 5 minutes, are single-use, and are
   at most 2048 characters. Check `action` and `hostname` as well as
   `success`, and retry `internal-error` with the same idempotency key. */

import { randomUUID } from "node:crypto";

export const turnstileAction = "contact";
const siteverify = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Cloudflare's published test secrets accept only the dummy token and
    report a placeholder hostname, so hostname checks are skipped for them. */
export const turnstileTestSecrets = new Set([
  "1x0000000000000000000000000000000AA",
  "2x0000000000000000000000000000000AA",
  "3x0000000000000000000000000000000AA",
]);

export type TurnstileOutcome =
  | { ok: true }
  // The visitor (or a bot) did not pass: ask them to try again.
  | { ok: false; reason: "failed" }
  // Cloudflare could not be reached or answered with an error.
  | { ok: false; reason: "unavailable" };

type Fetch = typeof fetch;

export async function verifyTurnstile(
  {
    token,
    secret,
    ip,
    hostname,
  }: { token: string; secret: string; ip?: string; hostname: string },
  fetchImpl: Fetch = fetch,
): Promise<TurnstileOutcome> {
  if (!token || token.length > 2048) return { ok: false, reason: "failed" };
  const idempotencyKey = randomUUID();
  for (let attempt = 0; attempt < 2; attempt++) {
    let body: {
      success?: boolean;
      action?: string;
      hostname?: string;
      "error-codes"?: string[];
    };
    try {
      const response = await fetchImpl(siteverify, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret,
          response: token,
          idempotency_key: idempotencyKey,
          ...(ip ? { remoteip: ip } : {}),
        }),
        signal: AbortSignal.timeout(5000),
        cache: "no-store",
      });
      body = await response.json();
    } catch {
      continue;
    }
    const codes = body["error-codes"] ?? [];
    if (body.success) {
      const testing = turnstileTestSecrets.has(secret);
      if (body.action !== turnstileAction && !testing)
        return { ok: false, reason: "failed" };
      if (body.hostname !== hostname && !testing)
        return { ok: false, reason: "failed" };
      return { ok: true };
    }
    if (codes.includes("internal-error")) continue;
    // A wrong or missing secret is our configuration, not the visitor.
    if (codes.some((code) => code.includes("input-secret")))
      return { ok: false, reason: "unavailable" };
    return { ok: false, reason: "failed" };
  }
  return { ok: false, reason: "unavailable" };
}
