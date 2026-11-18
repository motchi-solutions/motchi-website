import { createHmac, timingSafeEqual } from "node:crypto";
export function signToken(
  secret: string,
  timestamp: number,
  nonce: string,
): string {
  const payload = `${timestamp}.${nonce}`;
  return `${payload}.${createHmac("sha256", secret).update(payload).digest("hex")}`;
}
export function verifyToken(
  secret: string,
  token: string,
  now = Date.now(),
): boolean {
  if (!/^\d{13}\.[a-f0-9]{32}\.[a-f0-9]{64}$/.test(token)) return false;
  const [time, nonce] = token.split(".");
  const age = now - Number(time);
  if (age < 2000 || age > 3_600_000) return false;
  const expected = signToken(secret, Number(time), nonce);
  return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}
