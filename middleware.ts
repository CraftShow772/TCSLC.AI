import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { rateLimit } from "./src/lib/api/rateLimit";
import { corsHeaders, isCorsPreflight, shouldHandleCors } from "./src/lib/config/cors";
import { buildCsp } from "./src/lib/config/csp";
import { validateEnv } from "./src/lib/config/env";

validateEnv();

const RATE_LIMIT_CONFIG = {
  windowMs: 60_000,
  max: 60
};

function shouldRateLimit(pathname: string, method: string) {
  if (!pathname.startsWith("/api/")) return false;
  if (method.toUpperCase() === "OPTIONS") return false;
  if (pathname.startsWith("/api/health")) return false;
  return true;
}

function applyVaryHeader(headers: Headers, value: string) {
  const existing = headers.get("Vary");
  if (!existing) {
    headers.set("Vary", value);
    return;
  }
  const varyValues = existing.split(",").map((v) => v.trim());
  if (!varyValues.includes(value)) {
    headers.set("Vary", `${existing}, ${value}`);
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = request.headers.get("origin");
  const handleCors = shouldHandleCors(pathname);
  const cors = handleCors ? corsHeaders(origin) : undefined;

  if (handleCors && isCorsPreflight(request.method)) {
    const headers = new Headers(cors);
    if (cors?.Vary) {
      applyVaryHeader(headers, cors.Vary);
    }
    const status = cors && Object.keys(cors).length ? 204 : 403;
    return new Response(null, {
      status,
      headers
    });
  }

  if (shouldRateLimit(pathname, request.method)) {
    const result = rateLimit(request, RATE_LIMIT_CONFIG);
    if (!result.ok) {
      const retryAfter = Math.max(0, Math.ceil((result.reset - Date.now()) / 1000));
      const headers = new Headers({
        "Retry-After": retryAfter.toString(),
        "X-RateLimit-Limit": result.limit.toString(),
        "X-RateLimit-Remaining": result.remaining.toString(),
        "X-RateLimit-Reset": Math.ceil(result.reset / 1000).toString()
      });
      if (cors) {
        Object.entries(cors).forEach(([key, value]) => {
          if (key.toLowerCase() === "vary") {
            applyVaryHeader(headers, value);
          } else {
            headers.set(key, value);
          }
        });
      }
      return NextResponse.json(
        { error: "Too many requests" },
        {
          status: 429,
          headers
        }
      );
    }
  }

  const response = NextResponse.next();
  const csp = buildCsp();
  if (csp) {
    response.headers.set("Content-Security-Policy", csp);
  }

  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-DNS-Prefetch-Control", "off");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
  }

  if (cors) {
    Object.entries(cors).forEach(([key, value]) => {
      if (key.toLowerCase() === "vary") {
        applyVaryHeader(response.headers, value);
      } else {
        response.headers.set(key, value);
      }
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
