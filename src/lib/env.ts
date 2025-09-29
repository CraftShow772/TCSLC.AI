import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .min(1)
    .default("file:./prisma/data.db"),
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .min(1)
    .default("http://localhost:3000"),
  ANALYTICS_WRITE_KEY: z.string().optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

type EnvValues = z.infer<typeof envSchema>;

declare global {
  // eslint-disable-next-line no-var
  var __envCache: EnvValues | undefined;
}

export function getEnv(): EnvValues {
  if (!global.__envCache) {
    const parsed = envSchema.safeParse(process.env);
    if (!parsed.success) {
      console.error("Invalid environment configuration", parsed.error.format());
      throw new Error("Environment validation failed");
    }
    global.__envCache = parsed.data;
  }
  return global.__envCache;
}

export const env = getEnv();
