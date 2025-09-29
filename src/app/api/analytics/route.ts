import { NextResponse } from "next/server";

import { logAnalyticsEvent } from "@/lib/analytics";
import { env } from "@/lib/env";
import { recordAuditLog } from "@/lib/audit";
import { getRateLimitWindow, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
  if (!rateLimit(`analytics:${ip}`)) {
    return NextResponse.json(
      { message: "Rate limit exceeded" },
      { status: 429, headers: { "Retry-After": String(getRateLimitWindow() / 1000) } },
    );
  }

  const payload = await request.json();
  await logAnalyticsEvent(payload);
  await recordAuditLog({
    actor: ip,
    action: "analytics_event",
    resource: payload.category,
    detail: payload,
  });

  return NextResponse.json({ ok: true, site: env.NEXT_PUBLIC_SITE_URL });
}
