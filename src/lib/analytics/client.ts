import { AnalyticsEvent, AnalyticsEventName } from "./events";

type AnalyticsEventInput = {
  name: AnalyticsEventName;
  payload?: Record<string, unknown>;
  ts?: number;
  id?: string;
};

function createEvent(input: AnalyticsEventInput): AnalyticsEvent {
  const id =
    typeof input.id === "string" && input.id.length > 0
      ? input.id
      : (globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2));

  return {
    id,
    name: input.name,
    ts: typeof input.ts === "number" ? input.ts : Date.now(),
    payload: input.payload,
  };
}

export async function logAnalyticsEvent(input: AnalyticsEventInput): Promise<void> {
  if (typeof fetch !== "function") {
    return;
  }

  const event = createEvent(input);

  try {
    const response = await fetch("/api/analytics/log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
      keepalive: true,
    });

    if (!response.ok && process.env.NODE_ENV !== "production") {
      console.error("Failed to log analytics event", response.statusText);
    }
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Analytics logging error", error);
    }
  }
}
