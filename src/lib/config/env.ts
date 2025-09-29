/**
 * Minimal environment validation without external deps.
 * Throw fast on missing required variables for production.
 */

const REQUIRED = [
  "OPENAI_API_KEY",
  // External payment base URL can be optional in dev, required in prod.
  "MEG_PAYMENT_BASE_URL",
  // Optional in dev, recommended in prod
  "ANALYTICS_WRITE_KEY"
] as const;

export type EnvKeys = (typeof REQUIRED)[number];

function isProd() {
  return process.env.NODE_ENV === "production";
}

export function validateEnv() {
  const missing: string[] = [];
  for (const k of REQUIRED) {
    const val = process.env[k];
    // allow empty ANALYTICS_WRITE_KEY; require others
    if (!val && (k !== "ANALYTICS_WRITE_KEY" || isProd())) {
      missing.push(k);
    }
  }
  if (missing.length && isProd()) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
}

export function getEnv(key: EnvKeys) {
  const v = process.env[key];
  if (!v) return "";
  return v;
}
