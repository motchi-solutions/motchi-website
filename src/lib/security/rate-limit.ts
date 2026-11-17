/* Fixed-window rate limits for the contact form.

   Production uses Upstash Redis over its REST API (plain fetch, no client
   library), because serverless instances do not share memory and restart
   often. Without Upstash settings, or if Upstash is unreachable, limits fall
   back to this process's memory so real visitors are never blocked by an
   outage. Keys are HMAC-scrambled before storage: no raw IP address or email
   address leaves the server.

   Sources: Upstash Redis REST API, /multi-exec transactions
   (https://upstash.com/docs/redis/features/restapi); Redis INCR rate-limiter
   pattern (https://redis.io/docs/latest/commands/incr/). */

export type LimitResult = { allowed: boolean; retryAfterMs: number };

export type RedisSettings = { url: string; token: string };

type Window = { count: number; expires: number };

const memory = new Map<string, Window>();
const memoryLimit = 5000;

export function memoryHit(
  key: string,
  limit: number,
  windowMs: number,
  now = Date.now(),
): LimitResult {
  for (const [entry, window] of memory)
    if (window.expires <= now) memory.delete(entry);
  const window = memory.get(key);
  if (window) {
    window.count++;
    return {
      allowed: window.count <= limit,
      retryAfterMs: window.count <= limit ? 0 : window.expires - now,
    };
  }
  // A full table means something is flooding the form; refuse new keys
  // rather than grow without bound.
  if (memory.size >= memoryLimit)
    return { allowed: false, retryAfterMs: windowMs };
  memory.set(key, { count: 1, expires: now + windowMs });
  return { allowed: limit >= 1, retryAfterMs: 0 };
}

export function resetMemoryLimits() {
  memory.clear();
  claims.clear();
}

type Fetch = typeof fetch;

async function redisHit(
  redis: RedisSettings,
  key: string,
  limit: number,
  windowMs: number,
  fetchImpl: Fetch,
): Promise<LimitResult> {
  const response = await fetchImpl(`${redis.url}/multi-exec`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${redis.token}`,
      "Content-Type": "application/json",
    },
    // INCR counts the attempt; PEXPIRE NX starts the window on the first
    // one only; PTTL says how long until the window resets.
    body: JSON.stringify([
      ["INCR", key],
      ["PEXPIRE", key, windowMs, "NX"],
      ["PTTL", key],
    ]),
    signal: AbortSignal.timeout(2500),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Upstash returned ${response.status}.`);
  const results = (await response.json()) as { result?: unknown }[];
  const count = Number(results[0]?.result);
  const ttl = Number(results[2]?.result);
  if (!Number.isFinite(count)) throw new Error("Unexpected Upstash reply.");
  const allowed = count <= limit;
  return {
    allowed,
    retryAfterMs: allowed ? 0 : ttl > 0 ? ttl : windowMs,
  };
}

/** Counts one attempt against `key` and reports whether it is within
    `limit` per `windowMs`. */
export async function hit(
  key: string,
  limit: number,
  windowMs: number,
  redis: RedisSettings | null,
  fetchImpl: Fetch = fetch,
): Promise<LimitResult> {
  if (redis) {
    try {
      return await redisHit(redis, key, limit, windowMs, fetchImpl);
    } catch {
      console.error("Rate limit store unavailable; using memory", {
        category: "RATE_LIMIT_STORE_ERROR",
      });
    }
  }
  return memoryHit(key, limit, windowMs);
}

/* Duplicate-send guard: one record per signed form, holding its outcome
   ("pending", "sent", or "partial") so a repeated submission gets the same
   answer instead of a second email. */
const claims = new Map<string, { state: string; expires: number }>();

async function redisCommand(
  redis: RedisSettings,
  command: (string | number)[],
  fetchImpl: Fetch,
): Promise<unknown> {
  const response = await fetchImpl(redis.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${redis.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    signal: AbortSignal.timeout(2500),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Upstash returned ${response.status}.`);
  const { result } = (await response.json()) as { result?: unknown };
  return result;
}

/** Claims `key` for `windowMs`. Returns null when newly claimed, or the
    existing outcome when this form was already submitted. */
export async function claim(
  key: string,
  windowMs: number,
  redis: RedisSettings | null,
  fetchImpl: Fetch = fetch,
): Promise<string | null> {
  if (redis) {
    try {
      // SET ... NX GET sets only if absent and returns the previous value.
      const previous = await redisCommand(
        redis,
        ["SET", key, "pending", "NX", "GET", "PX", windowMs],
        fetchImpl,
      );
      return typeof previous === "string" ? previous : null;
    } catch {
      console.error("Duplicate guard store unavailable; using memory", {
        category: "RATE_LIMIT_STORE_ERROR",
      });
    }
  }
  const now = Date.now();
  for (const [entry, record] of claims)
    if (record.expires <= now) claims.delete(entry);
  const existing = claims.get(key);
  if (existing) return existing.state;
  if (claims.size >= memoryLimit) return "pending";
  claims.set(key, { state: "pending", expires: now + windowMs });
  return null;
}

/** Records the outcome of a claimed submission. */
export async function settle(
  key: string,
  state: "sent" | "partial",
  windowMs: number,
  redis: RedisSettings | null,
  fetchImpl: Fetch = fetch,
): Promise<void> {
  const existing = claims.get(key);
  if (existing) existing.state = state;
  if (!redis) return;
  try {
    await redisCommand(
      redis,
      ["SET", key, state, "XX", "PX", windowMs],
      fetchImpl,
    );
  } catch {
    // The pending record expires on its own; a retry is answered "busy".
  }
}

/** Releases a claim so a failed send can be retried with the same form. */
export async function release(
  key: string,
  redis: RedisSettings | null,
  fetchImpl: Fetch = fetch,
): Promise<void> {
  claims.delete(key);
  if (!redis) return;
  try {
    await redisCommand(redis, ["DEL", key], fetchImpl);
  } catch {
    // The claim expires on its own.
  }
}
