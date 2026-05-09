// Simple in-memory token bucket / sliding window limiter.
// Per Vercel instance (not shared across regions). For a public landing-page
// form this is sufficient to stop scripted abuse from a single IP.
// Migrate to Upstash/Vercel KV if we ever need cross-region or DDoS-grade protection.

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 10_000;

export function rateLimit(opts: {
  key: string;
  limit: number;
  windowMs: number;
}): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  // periodic GC: if we've grown too large, drop the oldest 20%
  if (buckets.size > MAX_BUCKETS) {
    const sortedKeys = [...buckets.entries()]
      .sort((a, b) => a[1].resetAt - b[1].resetAt)
      .slice(0, Math.floor(MAX_BUCKETS * 0.2))
      .map(([k]) => k);
    for (const k of sortedKeys) buckets.delete(k);
  }

  const existing = buckets.get(opts.key);
  if (!existing || existing.resetAt < now) {
    buckets.set(opts.key, { count: 1, resetAt: now + opts.windowMs });
    return { ok: true, retryAfterSec: 0 };
  }
  if (existing.count >= opts.limit) {
    return { ok: false, retryAfterSec: Math.ceil((existing.resetAt - now) / 1000) };
  }
  existing.count++;
  return { ok: true, retryAfterSec: 0 };
}

export function getClientIp(req: Request): string {
  // Vercel sets x-forwarded-for with the originating IP first
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}
