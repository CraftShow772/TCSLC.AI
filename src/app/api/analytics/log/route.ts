import { NextRequest, NextResponse } from "next/server";
import { AnalyticsEvent, AnalyticsEventName } from "@/lib/analytics/events";

declare global {
  // eslint-disable-next-line no-var
  var __TCSLC_ANALYTICS_EVENTS__: AnalyticsEvent[] | undefined;
}

const MAX_EVENTS = 500;

function getEventStore(): AnalyticsEvent[] {
  if (!globalThis.__TCSLC_ANALYTICS_EVENTS__) {
    globalThis.__TCSLC_ANALYTICS_EVENTS__ = [];
  }

  return globalThis.__TCSLC_ANALYTICS_EVENTS__!;
}

function isValidEventName(name: unknown): name is AnalyticsEventName {
  return (
    typeof name === "string" &&
    [
      "assistant_opened",
      "assistant_message_sent",
      "intent_resolved",
      "portal_redirect",
      "flow_completed",
      "escalation_requested",
      "intent_unknown",
    ].includes(name as AnalyticsEventName)
  );
}

function sanitizePayload(payload: unknown): Record<string, unknown> | undefined {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return undefined;
  }

  const entries = Object.entries(payload).filter(([key]) => typeof key === "string");
  return Object.fromEntries(entries);
}

export async function POST(request: NextRequest) {
  let rawBody: unknown;

  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  if (!rawBody || typeof rawBody !== "object") {
    return NextResponse.json({ error: "Malformed analytics event" }, { status: 400 });
  }

  const incoming = rawBody as Partial<AnalyticsEvent> & {
    name?: unknown;
    payload?: unknown;
  };

  if (!isValidEventName(incoming.name)) {
    return NextResponse.json({ error: "Unknown analytics event" }, { status: 422 });
  }

  const event: AnalyticsEvent = {
    id:
      typeof incoming.id === "string" && incoming.id.length > 0
        ? incoming.id
        : globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2),
    name: incoming.name,
    ts: typeof incoming.ts === "number" ? incoming.ts : Date.now(),
    payload: sanitizePayload(incoming.payload),
  };

  const store = getEventStore();
  store.push(event);

  if (store.length > MAX_EVENTS) {
    store.splice(0, store.length - MAX_EVENTS);
  }

  return NextResponse.json({ success: true, event });
}

export const dynamic = "force-dynamic";
