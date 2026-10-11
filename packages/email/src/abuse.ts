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
export function createLimiter(limit: number, windowMs: number, maxKeys = 2000) {
  const entries = new Map<string, { count: number; expires: number }>();
  return (key: string, now = Date.now()): boolean => {
    for (const [entry, record] of entries)
      if (record.expires <= now) entries.delete(entry);
    const existing = entries.get(key);
    if (existing) {
      if (existing.count >= limit) return false;
      existing.count++;
      return true;
    }
    if (entries.size >= maxKeys) return false;
    entries.set(key, { count: 1, expires: now + windowMs });
    return true;
  };
}
