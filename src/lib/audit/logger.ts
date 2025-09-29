import type { AuditLog } from "@prisma/client";

import { calculateConfidence, type ConfidenceSignal, type ConfidenceSummary } from "../ai/confidence";

import { auditDb } from "./db";
import { redactConversation, type AuditMessage } from "./redact";

export interface ToolInvocation {
  name: string;
  arguments?: unknown;
  result?: unknown;
  durationMs?: number;
  success?: boolean;
}

export interface AuditLogInput {
  route: string;
  userContext?: Record<string, unknown>;
  messages: AuditMessage[];
  response: string;
  tools?: ToolInvocation[];
  confidence?: number;
  confidenceSignals?: ConfidenceSignal[];
  fallbackConfidence?: number;
}

export interface AuditLogResult {
  record: AuditLog;
  redactions: number;
  confidenceSummary: ConfidenceSummary;
}

const clampConfidence = (value: number) => {
  if (!Number.isFinite(value)) {
    return 0.6;
  }

  return Math.min(Math.max(value, 0), 1);
};

const MAX_RESPONSE_LENGTH = 4000;

const trimResponse = (response: string) => {
  if (response.length <= MAX_RESPONSE_LENGTH) {
    return response;
  }

  return `${response.slice(0, MAX_RESPONSE_LENGTH - 1)}…`;
};

export async function writeAuditLog(input: AuditLogInput): Promise<AuditLogResult> {
  const { messages: redactedMessages, totalRedactions } = redactConversation(input.messages);
  const trimmedResponse = trimResponse(input.response);
  const fallbackConfidence = typeof input.fallbackConfidence === "number" ? input.fallbackConfidence : 0.6;
  const summaryFromSignals = calculateConfidence(input.confidenceSignals ?? [], fallbackConfidence);
  const resolvedConfidence =
    typeof input.confidence === "number" ? clampConfidence(input.confidence) : summaryFromSignals.score;

  const confidenceSummary: ConfidenceSummary =
    typeof input.confidence === "number"
      ? {
          ...summaryFromSignals,
          score: resolvedConfidence,
          rawScore: input.confidence,
        }
      : summaryFromSignals;

  try {
    const record = await auditDb.auditLog.create({
      data: {
        route: input.route,
        userContext: input.userContext ?? {},
        messages: redactedMessages,
        response: trimmedResponse,
        tools: input.tools ?? [],
        piiRedactions: totalRedactions,
        confidence: resolvedConfidence,
      },
    });

    return {
      record,
      redactions: totalRedactions,
      confidenceSummary,
    };
  } catch (error) {
    console.error("Failed to write audit log", error);
    throw error;
  }
}
