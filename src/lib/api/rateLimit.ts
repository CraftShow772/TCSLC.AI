import type { NextRequest } from "next/server";

export interface RateLimitConfig {
  windowMs: number;
  max: number;
}

export interface RateLimitResult {
  ok: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

interface Counter {
  count: number;
  expires: number;
}

const counters = new Map<string, Counter>();

function now() {
  return Date.now();
}

function cleanup(key: string, entry: Counter) {
  if (entry.expires <= now()) {
    counters.delete(key);
  }
}

function getKey(request: NextRequest) {
  const forwarded = request.headers
    .get("x-forwarded-for")
    ?.split(",")[0]
    .trim();
  const fallback = request.ip || request.nextUrl.hostname;
  return forwarded || fallback || "anonymous";
}

export function rateLimit(
  request: NextRequest,
  config: RateLimitConfig
): RateLimitResult {
  const key = getKey(request);
  const current = counters.get(key);
  const timestamp = now();
  const windowStart = timestamp + config.windowMs;

  if (!current || current.expires <= timestamp) {
    const entry = { count: 1, expires: windowStart } satisfies Counter;
    counters.set(key, entry);
    return {
      ok: true,
      limit: config.max,
      remaining: config.max - 1,
      reset: windowStart
    };
  }

  if (current.count >= config.max) {
    cleanup(key, current);
    return {
      ok: false,
      limit: config.max,
      remaining: 0,
      reset: current.expires
    };
  }

  current.count += 1;
  return {
    ok: true,
    limit: config.max,
    remaining: config.max - current.count,
    reset: current.expires
  };
}
