export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export type UserContext = {
  geo?: string;
  route?: string;
  sessionFlags?: string[];
};

export type ToolCall =
  | { name: "content.search"; args: { q: string } }
  | { name: "link.out"; args: { url: string; label?: string } }
  | { name: "calc.fees"; args: { type: string; params: Record<string, unknown> } };

export type Citation = { title: string; url?: string; slug?: string; snippet?: string };

export type AssistantChunk =
  | { type: "start" }
  | { type: "meta"; system: string }
  | { type: "tool"; tool: ToolCall; result?: unknown }
  | { type: "token"; value: string }
  | { type: "citations"; items: Citation[] }
  | { type: "done"; lowConfidence?: boolean };
