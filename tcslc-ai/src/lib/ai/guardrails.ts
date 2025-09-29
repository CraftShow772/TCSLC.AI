import { ChatMessage, UserContext } from "./types";

const bannedTerms = ["suicide", "kill myself", "weapon", "bomb"];

export type GuardrailResult =
  | { allowed: true; sanitizedMessages: ChatMessage[]; flags: string[] }
  | { allowed: false; reason: string };

export function enforceGuardrails(messages: ChatMessage[]): GuardrailResult {
  if (!Array.isArray(messages) || messages.length === 0) {
    return { allowed: false, reason: "No messages provided." };
  }

  const sanitized = messages.map((message) => ({
    ...message,
    content: sanitizeContent(message.content),
  }));

  const lastUser = [...sanitized].reverse().find((msg) => msg.role === "user");
  if (!lastUser) {
    return { allowed: false, reason: "A user message is required." };
  }

  const flaggedTerm = bannedTerms.find((term) => lastUser.content.toLowerCase().includes(term));
  if (flaggedTerm) {
    return {
      allowed: false,
      reason: `The request includes language (${flaggedTerm}) that we cannot assist with.`,
    };
  }

  const flags = deriveFlagsFromMessages(sanitized);

  return { allowed: true, sanitizedMessages: sanitized, flags };
}

export function buildUserContext(context: UserContext | undefined, derivedFlags: string[]): UserContext {
  return {
    ...context,
    sessionFlags: Array.from(new Set([...(context?.sessionFlags ?? []), ...derivedFlags])).filter(Boolean),
  };
}

function sanitizeContent(input: string): string {
  return input.replace(/\s+/g, " ").trim();
}

function deriveFlagsFromMessages(messages: ChatMessage[]): string[] {
  const flags = new Set<string>();
  const lastUser = [...messages].reverse().find((msg) => msg.role === "user");
  if (!lastUser) {
    return [];
  }

  const lower = lastUser.content.toLowerCase();
  if (lower.includes("join") || lower.includes("membership")) {
    flags.add("interest:membership");
  }
  if (lower.includes("volunteer")) {
    flags.add("interest:volunteer");
  }
  if (lower.includes("event")) {
    flags.add("interest:event");
  }
  return Array.from(flags);
}
