import { NextRequest, NextResponse } from "next/server";
import { assistantSystemPrompt } from "../../../../lib/ai/systemPrompt";
import { buildUserContext, enforceGuardrails } from "../../../../lib/ai/guardrails";
import { AssistantChunk, ChatMessage, Citation, ToolCall, UserContext } from "../../../../lib/ai/types";
import { runContentSearch } from "../../../../lib/tools/contentSearch";
import { createLinkOutSuggestion } from "../../../../lib/tools/linkOut";
import { estimateFees } from "../../../../lib/tools/calcFees";

type ChatRequestBody = {
  messages: ChatMessage[];
  context?: UserContext;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ChatRequestBody;
    const guardrailResult = enforceGuardrails(body.messages);

    if (!guardrailResult.allowed) {
      return buildStreamedResponse({
        system: assistantSystemPrompt,
        responseText: guardrailResult.reason,
        citations: [],
        toolChunks: [],
        lowConfidence: true,
      });
    }

    const context = buildUserContext(body.context, guardrailResult.flags);
    const orchestration = await orchestrateAssistant(guardrailResult.sanitizedMessages, context);

    return buildStreamedResponse({
      system: assistantSystemPrompt,
      responseText: orchestration.text,
      citations: orchestration.citations,
      toolChunks: orchestration.tools,
      lowConfidence: orchestration.lowConfidence,
    });
  } catch (error) {
    console.error("assistant.chat", error);
    return NextResponse.json({ error: "Unable to process request." }, { status: 500 });
  }
}

type StreamConfig = {
  system: string;
  responseText: string;
  citations: Citation[];
  toolChunks: { tool: ToolCall; result?: unknown }[];
  lowConfidence?: boolean;
};

function buildStreamedResponse(config: StreamConfig) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const push = (chunk: AssistantChunk) => {
        controller.enqueue(encoder.encode(`${JSON.stringify(chunk)}\n`));
      };

      try {
        push({ type: "start" });
        push({ type: "meta", system: config.system });

        for (const toolChunk of config.toolChunks) {
          push({ type: "tool", tool: toolChunk.tool, result: toolChunk.result });
        }

        const tokens = tokenize(config.responseText);
        for (const token of tokens) {
          push({ type: "token", value: token });
        }

        if (config.citations.length > 0) {
          push({ type: "citations", items: config.citations });
        }

        push({ type: "done", lowConfidence: config.lowConfidence });
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Cache-Control": "no-store",
    },
  });
}

async function orchestrateAssistant(messages: ChatMessage[], context: UserContext) {
  const lastUser = [...messages].reverse().find((message) => message.role === "user");
  const lower = lastUser?.content.toLowerCase() ?? "";

  const toolChunks: { tool: ToolCall; result?: unknown }[] = [];
  let citations: Citation[] = [];
  const responseParts: string[] = [];

  responseParts.push(
    `Thanks for reaching out to TCSLC${context.route ? ` while browsing ${context.route}` : ""}. I’m here to help.`
  );

  if (context.sessionFlags?.includes("interest:membership")) {
    responseParts.push("It sounds like you’re exploring membership, so let me share a quick overview.");
  }
  if (context.sessionFlags?.includes("interest:volunteer")) {
    responseParts.push("We love welcoming new volunteers—here’s how to plug in fast.");
  }

  if (lower.includes("fee") || lower.includes("cost") || lower.includes("price")) {
    const toolCall: ToolCall = {
      name: "calc.fees",
      args: { type: "membership", params: { duration: 12 } },
    };
    const result = estimateFees(toolCall.args);
    toolChunks.push({ tool: toolCall, result });
    responseParts.push(
      `Typical membership dues land around $${result.estimate.toFixed(0)} ${result.currency}. ${result.description}.`
    );
    citations.push({
      title: "Membership Guide",
      url: "https://www.tcslc.com/membership",
      snippet: "Overview of TCSLC membership options and dues.",
    });
  }

  if (lower.includes("program") || lower.includes("grant") || lower.includes("resource") || context.sessionFlags?.includes("interest:event")) {
    const toolCall: ToolCall = {
      name: "content.search",
      args: { q: lastUser?.content ?? "programs" },
    };
    const result = await runContentSearch(toolCall.args);
    toolChunks.push({ tool: toolCall, result });
    if (result.matches.length > 0) {
      const highlight = result.matches.slice(0, 2).map((match) => match.title).join(" and ");
      responseParts.push(`You might explore ${highlight}—I’ve shared quick links below.`);
      citations = dedupeCitations([...citations, ...result.matches]);
    }
  }

  if (lower.includes("contact") || lower.includes("call") || lower.includes("talk")) {
    const toolCall: ToolCall = {
      name: "link.out",
      args: { url: "https://www.tcslc.com/contact", label: "Connect with TCSLC" },
    };
    const result = createLinkOutSuggestion(toolCall.args);
    toolChunks.push({ tool: toolCall, result });
    responseParts.push(`If you’d like to speak with our team directly, use the contact link I’ve included.`);
    citations.push({
      title: result.label,
      url: result.url,
      snippet: "Reach a TCSLC team member for tailored support.",
    });
  }

  if (responseParts.length === 1) {
    responseParts.push(
      "Tell me a bit more about what you need—program guidance, membership help, or event planning—and I’ll surface the right resources."
    );
  }

  const lowConfidence = responseParts.length <= 2;

  return {
    text: responseParts.join(" "),
    citations: dedupeCitations(citations),
    tools: toolChunks,
    lowConfidence,
  };
}

function tokenize(message: string) {
  return message.split(/(\s+)/).filter(Boolean);
}

function dedupeCitations(citations: Citation[]) {
  const seen = new Set<string>();
  const result: Citation[] = [];
  for (const citation of citations) {
    const key = citation.url ?? citation.title;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(citation);
    }
  }
  return result;
}
