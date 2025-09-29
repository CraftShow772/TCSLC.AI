export type PrimitiveMessageContent = string;
export type RichMessageSegment = {
  type: string;
  text?: string;
  [key: string]: unknown;
};

export type MessageContent = PrimitiveMessageContent | RichMessageSegment[];

export interface AuditMessage {
  role: string;
  content: MessageContent;
  name?: string;
  id?: string;
  metadata?: Record<string, unknown>;
}

export interface RedactionBreakdown {
  [pattern: string]: number;
}

export interface RedactTextResult {
  text: string;
  redactions: number;
  breakdown: RedactionBreakdown;
}

export interface RedactedConversation {
  messages: AuditMessage[];
  totalRedactions: number;
  breakdown: RedactionBreakdown;
}

type RedactionRule = {
  name: string;
  regex: RegExp;
  placeholder: string;
};

const REDACTION_RULES: RedactionRule[] = [
  {
    name: "email",
    regex: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi,
    placeholder: "[redacted-email]",
  },
  {
    name: "phone",
    regex: /(?:(?:\+?\d{1,3}[\s.-]?)?(?:\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4})/g,
    placeholder: "[redacted-phone]",
  },
  {
    name: "ssn",
    regex: /\b\d{3}-\d{2}-\d{4}\b/g,
    placeholder: "[redacted-ssn]",
  },
  {
    name: "creditCard",
    regex: /\b(?:\d[ -]*?){13,16}\b/g,
    placeholder: "[redacted-card]",
  },
  {
    name: "apiKey",
    regex: /(sk|pk|tok|ghp)_[A-Za-z0-9]{16,}/g,
    placeholder: "[redacted-secret]",
  },
  {
    name: "url",
    regex: /https?:\/\/[^\s]+/gi,
    placeholder: "[redacted-url]",
  },
];

const clamp = (value: number) => (Number.isFinite(value) ? value : 0);

export function redactText(input: string): RedactTextResult {
  let text = input;
  const breakdown: RedactionBreakdown = {};

  for (const rule of REDACTION_RULES) {
    const matches = text.match(rule.regex);
    if (!matches) {
      continue;
    }

    breakdown[rule.name] = (breakdown[rule.name] ?? 0) + matches.length;
    text = text.replace(rule.regex, rule.placeholder);
  }

  const redactions = Object.values(breakdown).reduce((total, value) => total + clamp(value), 0);

  return {
    text,
    redactions,
    breakdown,
  };
}

function mergeBreakdowns(target: RedactionBreakdown, addition: RedactionBreakdown) {
  for (const [key, value] of Object.entries(addition)) {
    target[key] = (target[key] ?? 0) + clamp(value);
  }
}

function redactRichContent(segments: RichMessageSegment[]): {
  segments: RichMessageSegment[];
  redactions: number;
  breakdown: RedactionBreakdown;
} {
  const sanitizedSegments: RichMessageSegment[] = [];
  const breakdown: RedactionBreakdown = {};
  let redactions = 0;

  for (const segment of segments) {
    if (typeof segment.text === "string") {
      const { text, redactions: segmentRedactions, breakdown: segmentBreakdown } = redactText(segment.text);
      sanitizedSegments.push({ ...segment, text });
      mergeBreakdowns(breakdown, segmentBreakdown);
      redactions += segmentRedactions;
    } else {
      sanitizedSegments.push({ ...segment });
    }
  }

  return { segments: sanitizedSegments, redactions, breakdown };
}

function sanitizeMessage(message: AuditMessage): {
  message: AuditMessage;
  redactions: number;
  breakdown: RedactionBreakdown;
} {
  if (typeof message.content === "string") {
    const { text, redactions, breakdown } = redactText(message.content);
    return {
      message: { ...message, content: text },
      redactions,
      breakdown,
    };
  }

  if (Array.isArray(message.content)) {
    const { segments, redactions, breakdown } = redactRichContent(message.content);
    return {
      message: { ...message, content: segments },
      redactions,
      breakdown,
    };
  }

  return {
    message: { ...message },
    redactions: 0,
    breakdown: {},
  };
}

export function redactConversation(messages: AuditMessage[]): RedactedConversation {
  const sanitizedMessages: AuditMessage[] = [];
  const breakdown: RedactionBreakdown = {};
  let totalRedactions = 0;

  for (const message of messages) {
    const { message: sanitizedMessage, redactions, breakdown: messageBreakdown } = sanitizeMessage(message);
    sanitizedMessages.push(sanitizedMessage);
    mergeBreakdowns(breakdown, messageBreakdown);
    totalRedactions += redactions;
  }

  return {
    messages: sanitizedMessages,
    totalRedactions,
    breakdown,
  };
}
