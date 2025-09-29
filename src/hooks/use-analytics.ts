"use client";

import { useCallback } from "react";

interface AnalyticsPayload {
  category: string;
  action: string;
  label?: string;
  metadata?: Record<string, unknown>;
}

export function useAnalytics() {
  const logEvent = useCallback(async (event: AnalyticsPayload) => {
    try {
      await fetch("/api/analytics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.error("Failed to log analytics event", error);
    }
  }, []);

  return { logEvent };
}
