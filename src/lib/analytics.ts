import { prisma } from "@/lib/prisma";

export interface AnalyticsEventInput {
  category: string;
  action: string;
  label?: string;
  metadata?: Record<string, unknown>;
}

export async function logAnalyticsEvent(event: AnalyticsEventInput): Promise<void> {
  await prisma.analyticsEvent.create({
    data: {
      category: event.category,
      action: event.action,
      label: event.label ?? null,
      metadata: event.metadata ?? null,
    },
  });
}
