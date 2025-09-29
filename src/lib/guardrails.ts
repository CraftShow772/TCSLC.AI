const BLOCKED_PHRASES = [
  "fraud",
  "hack",
  "exploit",
];

export interface GuardrailResult {
  allowed: boolean;
  reason?: string;
}

export function evaluateUserInput(message: string): GuardrailResult {
  const sanitized = message.toLowerCase();
  if (sanitized.length > 1_000) {
    return {
      allowed: false,
      reason: "The request is too long. Please shorten your question.",
    };
  }
  const blocked = BLOCKED_PHRASES.find((phrase) => sanitized.includes(phrase));
  if (blocked) {
    return {
      allowed: false,
      reason: `The request cannot include the term "${blocked}".`,
    };
  }
  return { allowed: true };
}
