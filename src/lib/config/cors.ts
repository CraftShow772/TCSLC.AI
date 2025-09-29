const DEFAULT_ORIGINS = [
  "https://tcslc.com",
  "https://www.tcslc.com"
];

function getDynamicOrigins() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const previewUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : undefined;
  return [appUrl, previewUrl].filter(Boolean) as string[];
}

const LOCAL_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000"
];

function allowedOrigins() {
  const origins = new Set<string>([
    ...DEFAULT_ORIGINS,
    ...getDynamicOrigins()
  ]);
  if (process.env.NODE_ENV !== "production") {
    LOCAL_ORIGINS.forEach((origin) => origins.add(origin));
  }
  return origins;
}

const ALLOWED_METHODS = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "OPTIONS"
];

const ALLOWED_HEADERS = [
  "Content-Type",
  "Authorization",
  "Accept",
  "X-Requested-With",
  "X-CSRF-Token"
];

export function isCorsPreflight(method: string) {
  return method.toUpperCase() === "OPTIONS";
}

export function resolveAllowedOrigin(origin: string | null | undefined) {
  if (!origin) return "";
  const normalized = origin.toLowerCase();
  const origins = allowedOrigins();
  if (origins.has(normalized)) {
    return origin;
  }
  if (normalized.endsWith(".tcslc.com")) {
    return origin;
  }
  return "";
}

export function corsHeaders(origin: string | null | undefined) {
  const allowedOrigin = resolveAllowedOrigin(origin);
  if (!allowedOrigin) {
    return {} as Record<string, string>;
  }

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": ALLOWED_METHODS.join(", "),
    "Access-Control-Allow-Headers": ALLOWED_HEADERS.join(", "),
    "Vary": "Origin"
  } satisfies Record<string, string>;
}

export function shouldHandleCors(pathname: string) {
  return pathname.startsWith("/api/");
}
