import { NextResponse } from "next/server";

import { logAnalyticsEvent } from "@/lib/analytics";
import { recordAuditLog } from "@/lib/audit";
import { evaluateUserInput } from "@/lib/guardrails";
import { rateLimit, getRateLimitWindow } from "@/lib/rate-limit";
import { chunkText } from "@/lib/utils";
import { searchDocuments } from "@/lib/vector-store";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
  if (!rateLimit(`assistant:${ip}`)) {
    return NextResponse.json(
      { message: "Rate limit exceeded" },
      { status: 429, headers: { "Retry-After": String(getRateLimitWindow() / 1000) } },
    );
  }

  const { message } = await request.json();
  if (!message || typeof message !== "string") {
    return NextResponse.json({ message: "Missing message" }, { status: 400 });
  }

  const guard = evaluateUserInput(message);
  if (!guard.allowed) {
    await logAnalyticsEvent({
      category: "assistant",
      action: "guardrails_triggered",
      label: guard.reason,
      metadata: { messageLength: message.length },
    });
    return NextResponse.json({ message: guard.reason }, { status: 400 });
  }

  const citations = await searchDocuments(message, 3);
  await recordAuditLog({
    actor: ip,
    action: "assistant_request",
    resource: "assistant",
    detail: { message, citations },
  });

  const bulletPoints = citations
    .map((citation) => `• ${citation.title}: ${citation.summary}`)
    .join("\n");

  const answer = `Here is what I found:\n${bulletPoints}\nIf you need deeper guidance, open the related page for full requirements or use the smart checklists below.`;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for (const chunk of chunkText(answer, 64)) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "token", value: chunk })}\n\n`),
          );
          await sleep(30);
        }
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "complete", citations })}\n\n`),
        );
        controller.close();
        await logAnalyticsEvent({
          category: "assistant",
          action: "response_sent",
          metadata: { citations: citations.map((citation) => citation.id) },
        });
      } catch (error) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "error", message: "Unable to stream response" })}\n\n`,
          ),
        );
        controller.close();
        console.error(error);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
