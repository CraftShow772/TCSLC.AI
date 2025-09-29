export type AnalyticsEventName =
  | "assistant_opened"
  | "assistant_message_sent"
  | "intent_resolved"
  | "portal_redirect"
  | "flow_completed"
  | "escalation_requested"
  | "intent_unknown";

export type AnalyticsEvent = {
  id: string;
  name: AnalyticsEventName;
  ts: number; // Date.now()
  payload?: Record<string, unknown>;
  // optional user/session identifiers can be added later
};

export function isAnalyticsEvent(obj: any): obj is AnalyticsEvent {
  return obj && typeof obj.name === "string" && typeof obj.ts === "number";
}
