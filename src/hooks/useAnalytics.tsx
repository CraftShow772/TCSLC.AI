"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type AnalyticsPayload = Record<string, unknown> | undefined;

type AnalyticsEvent = {
  name: string;
  payload?: AnalyticsPayload;
  timestamp: number;
};

type AnalyticsContextValue = {
  track: (name: string, payload?: AnalyticsPayload) => void;
  pageview: (path?: string) => void;
  flushQueue: () => void;
};

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

function pushToDataLayer(event: AnalyticsEvent) {
  if (typeof window === "undefined") {
    return;
  }

  const layer = (window as typeof window & { dataLayer?: AnalyticsEvent[] }).dataLayer ?? [];
  layer.push(event);
  (window as typeof window & { dataLayer?: AnalyticsEvent[] }).dataLayer = layer;
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const queueRef = useRef<AnalyticsEvent[]>([]);
  const [pageviewTracked, setPageviewTracked] = useState(false);

  const flushQueue = useCallback(() => {
    if (queueRef.current.length === 0) {
      return;
    }

    const snapshot = [...queueRef.current];
    queueRef.current = [];
    snapshot.forEach((event) => pushToDataLayer(event));
  }, []);

  const track = useCallback(
    (name: string, payload?: AnalyticsPayload) => {
      const event: AnalyticsEvent = {
        name,
        payload,
        timestamp: Date.now(),
      };

      queueRef.current = [...queueRef.current, event];
      if (process.env.NODE_ENV !== "production") {
        console.info("[analytics]", event);
      }
      flushQueue();
    },
    [flushQueue]
  );

  const pageview = useCallback(
    (path?: string) => {
      const resolved =
        path ?? (typeof window !== "undefined" ? window.location.pathname : "unknown");
      track("page_view", { path: resolved });
    },
    [track]
  );

  useEffect(() => {
    if (!pageviewTracked) {
      pageview();
      setPageviewTracked(true);
    }
  }, [pageview, pageviewTracked]);

  useEffect(() => {
    const id = setInterval(() => flushQueue(), 2000);
    return () => clearInterval(id);
  }, [flushQueue]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        flushQueue();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [flushQueue]);

  const value = useMemo<AnalyticsContextValue>(() => ({ track, pageview, flushQueue }), [track, pageview, flushQueue]);

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }

  return context;
}
