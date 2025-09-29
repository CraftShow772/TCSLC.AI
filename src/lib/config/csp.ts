import { getEnv } from "./env";

type DirectiveMap = Record<string, string[]>;

const SELF = "'self'";
const INLINE_STYLE = "'unsafe-inline'";
const DATA = "data:";

function analyticsEndpoints() {
  const hasAnalytics = Boolean(getEnv("ANALYTICS_WRITE_KEY"));
  if (!hasAnalytics) return [] as string[];
  return [
    "https://cdn.segment.com",
    "https://api.segment.io"
  ];
}

function paymentEndpoint() {
  const baseUrl = getEnv("MEG_PAYMENT_BASE_URL");
  return baseUrl ? [baseUrl] : [];
}

function baseDirectives(): DirectiveMap {
  const connectSrc = new Set<string>([
    SELF,
    "https://api.openai.com",
    ...analyticsEndpoints(),
    ...paymentEndpoint()
  ]);

  const directives: DirectiveMap = {
    "default-src": [SELF],
    "base-uri": [SELF],
    "font-src": [SELF, DATA, "https://fonts.gstatic.com"],
    "img-src": [SELF, DATA, "https://www.googletagmanager.com"],
    "script-src": [SELF, "https://www.googletagmanager.com"],
    "style-src": [SELF, INLINE_STYLE, "https://fonts.googleapis.com"],
    "connect-src": Array.from(connectSrc),
    "frame-ancestors": ["'none'"],
    "form-action": [SELF],
    "object-src": ["'none'"],
    "upgrade-insecure-requests": []
  };

  const paymentFrames = paymentEndpoint();
  if (paymentFrames.length) {
    directives["frame-src"] = paymentFrames;
  }

  return directives;
}

export function buildCsp(): string {
  const directives = baseDirectives();
  return Object.entries(directives)
    .map(([key, value]) => {
      if (!value.length) {
        return key;
      }
      return `${key} ${value.join(" ")}`;
    })
    .join("; ");
}

export function appendNonce(header: string, nonce?: string) {
  if (!nonce) return header;
  const nonceValue = `'nonce-${nonce}'`;
  const parts = header.split("; ").map((directive) => {
    if (directive.startsWith("script-src")) {
      return `${directive} ${nonceValue}`;
    }
    return directive;
  });
  return parts.join("; ");
}
