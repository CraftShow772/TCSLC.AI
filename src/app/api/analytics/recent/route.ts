import { NextRequest, NextResponse } from "next/server";
import { AnalyticsEvent } from "@/lib/analytics/events";

declare global {
  // eslint-disable-next-line no-var
  var __TCSLC_ANALYTICS_EVENTS__: AnalyticsEvent[] | undefined;
}

function getEventStore(): AnalyticsEvent[] {
  if (!globalThis.__TCSLC_ANALYTICS_EVENTS__) {
    globalThis.__TCSLC_ANALYTICS_EVENTS__ = [];
  }

  return globalThis.__TCSLC_ANALYTICS_EVENTS__!;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const limitParam = searchParams.get("limit") ?? "100";
  const limit = Number.parseInt(limitParam, 10);
  const normalizedLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 500) : 100;

  const store = getEventStore();
  const startIndex = Math.max(store.length - normalizedLimit, 0);
  const recentEvents = store.slice(startIndex).reverse();

  return NextResponse.json({
    events: recentEvents,
    total: store.length,
  });
}

export const dynamic = "force-dynamic";
