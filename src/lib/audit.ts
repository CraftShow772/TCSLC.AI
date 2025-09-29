import { prisma } from "@/lib/prisma";

export interface AuditLogInput {
  actor: string;
  action: string;
  resource: string;
  detail?: Record<string, unknown>;
}

export async function recordAuditLog(entry: AuditLogInput): Promise<void> {
  await prisma.auditLog.create({
    data: {
      actor: entry.actor,
      action: entry.action,
      resource: entry.resource,
      detail: entry.detail ?? null,
    },
  });
}
