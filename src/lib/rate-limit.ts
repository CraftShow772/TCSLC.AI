const WINDOW_MS = 60_000;
const MAX_REQUESTS = 60;

interface Entry {
  count: number;
  expiresAt: number;
}

const bucket = new Map<string, Entry>();

export function rateLimit(key: string): boolean {
  const now = Date.now();
  const entry = bucket.get(key);
  if (!entry || entry.expiresAt < now) {
    bucket.set(key, { count: 1, expiresAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_REQUESTS) {
    return false;
  }
  entry.count += 1;
  return true;
}

export function getRateLimitWindow(): number {
  return WINDOW_MS;
}
