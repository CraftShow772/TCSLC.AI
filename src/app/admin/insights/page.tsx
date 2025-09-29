"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, BarChart3, Clock, RefreshCw } from "lucide-react";

import { AnalyticsEvent, AnalyticsEventName } from "@/lib/analytics/events";

type RecentEventsResponse = {
  events: AnalyticsEvent[];
  total: number;
};

const POLL_INTERVAL = 5000;

const EVENT_DETAILS: Record<AnalyticsEventName, { label: string; description: string }> = {
  assistant_opened: {
    label: "Assistant opened",
    description: "Visitors engaging with the assistant entry point.",
  },
  assistant_message_sent: {
    label: "Messages sent",
    description: "Outbound assistant responses delivered to visitors.",
  },
  intent_resolved: {
    label: "Intent resolved",
    description: "Conversations that reached a successful resolution.",
  },
  portal_redirect: {
    label: "Portal redirect",
    description: "Users redirected to the member self-service portal.",
  },
  flow_completed: {
    label: "Flow completed",
    description: "Automated flows completed without escalation.",
  },
  escalation_requested: {
    label: "Escalation requested",
    description: "Conversations escalated to a human expert.",
  },
  intent_unknown: {
    label: "Intent unknown",
    description: "Moments where the assistant could not classify the request.",
  },
};

const EVENT_ORDER: AnalyticsEventName[] = [
  "assistant_opened",
  "assistant_message_sent",
  "intent_resolved",
  "flow_completed",
  "portal_redirect",
  "escalation_requested",
  "intent_unknown",
];

function formatRelativeTime(timestamp: number) {
  const now = Date.now();
  const diff = Math.max(0, now - timestamp);

  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatTimestamp(timestamp: number) {
  return new Date(timestamp).toLocaleString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  });
}

function renderPayload(payload: AnalyticsEvent["payload"]) {
  if (!payload) return "—";

  try {
    const stringified = JSON.stringify(payload);
    if (!stringified || stringified === "{}") {
      return "—";
    }

    return stringified;
  } catch {
    return "—";
  }
}

export default function InsightsPage() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [totalEvents, setTotalEvents] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshToken((token) => token + 1);
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();

    const load = async () => {
      setIsRefreshing(true);
      try {
        const response = await fetch("/api/analytics/recent?limit=200", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to load analytics (${response.status})`);
        }

        const data = (await response.json()) as RecentEventsResponse;
        if (!isActive) return;

        setEvents(data.events ?? []);
        setTotalEvents(data.total ?? data.events?.length ?? 0);
        setError(null);
        setLastUpdated(Date.now());
      } catch (err) {
        if (!isActive) return;

        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }

        setError("Unable to load analytics data. Please try again.");
      } finally {
        if (isActive) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    };

    load();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [refreshToken]);

  const handleManualRefresh = () => {
    setRefreshToken((token) => token + 1);
  };

  const eventCounts = useMemo(() => {
    return events.reduce<Record<AnalyticsEventName, number>>((acc, event) => {
      acc[event.name] = (acc[event.name] ?? 0) + 1;
      return acc;
    }, {} as Record<AnalyticsEventName, number>);
  }, [events]);

  const latestEvent = events[0];

  const topEvent = useMemo(() => {
    return EVENT_ORDER.reduce<
      { name: AnalyticsEventName; count: number } | null
    >((current, name) => {
      const count = eventCounts[name] ?? 0;
      if (!current || count > current.count) {
        return { name, count };
      }
      return current;
    }, null);
  }, [eventCounts]);

  const stabilityScore = useMemo(() => {
    const escalations = eventCounts.escalation_requested ?? 0;
    const resolved = eventCounts.intent_resolved ?? 0;
    const totalHandled = resolved + escalations;
    if (totalHandled === 0) return 1;
    const ratio = resolved / totalHandled;
    return Number.isFinite(ratio) ? Math.max(0, Math.min(1, ratio)) : 0;
  }, [eventCounts]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Assistant insights
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Monitor real-time engagement signals from the AI assistant and surface
            opportunities to optimize customer journeys.
          </p>
        </div>
        <button
          type="button"
          onClick={handleManualRefresh}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Refreshing" : "Refresh"}
        </button>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Total activity</p>
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <p className="mt-4 text-3xl font-semibold text-foreground">{totalEvents}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            {latestEvent ? `Last event ${formatRelativeTime(latestEvent.ts)}` : "Awaiting activity"}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Top signal</p>
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <p className="mt-4 text-2xl font-semibold text-foreground">
            {topEvent ? EVENT_DETAILS[topEvent.name].label : "—"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {topEvent ? `${topEvent.count} events in the last window` : "No signals captured yet"}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Resolution health</p>
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <p className="mt-4 text-2xl font-semibold text-foreground">
            {`${Math.round(stabilityScore * 100)}%`}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Resolved intents vs escalations
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,3fr]">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Signal breakdown</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Distribution of assistant events across the active monitoring window.
          </p>
          <div className="mt-6 space-y-4">
            {EVENT_ORDER.map((name) => {
              const count = eventCounts[name] ?? 0;
              const percentage = totalEvents ? Math.round((count / totalEvents) * 100) : 0;
              return (
                <div key={name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{EVENT_DETAILS[name].label}</span>
                    <span>{count}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary/80 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{EVENT_DETAILS[name].description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Recent activity</h2>
            <span className="text-xs text-muted-foreground">
              {lastUpdated ? `Updated ${formatRelativeTime(lastUpdated)}` : "Updating..."}
            </span>
          </div>
          <div className="mt-4 overflow-hidden rounded-lg border border-border">
            <table className="min-w-full divide-y divide-border text-left text-sm">
              <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Event</th>
                  <th className="px-4 py-3 font-medium">When</th>
                  <th className="px-4 py-3 font-medium">Payload</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {events.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-center text-sm text-muted-foreground">
                      {isLoading ? "Listening for events…" : "No activity captured yet."}
                    </td>
                  </tr>
                ) : (
                  events.map((event) => (
                    <tr key={event.id} className="bg-background/60 hover:bg-muted/60">
                      <td className="px-4 py-3 align-top">
                        <div className="font-medium text-foreground">
                          {EVENT_DETAILS[event.name]?.label ?? event.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {EVENT_DETAILS[event.name]?.description ?? "Custom signal"}
                        </div>
                      </td>
                      <td className="px-4 py-3 align-top text-sm text-muted-foreground">
                        <div>{formatTimestamp(event.ts)}</div>
                        <div>{formatRelativeTime(event.ts)}</div>
                      </td>
                      <td className="break-words px-4 py-3 align-top text-xs font-mono text-muted-foreground">
                        {renderPayload(event.payload)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
