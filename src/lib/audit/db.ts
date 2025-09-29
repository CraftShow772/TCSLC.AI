import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prismaAudit: PrismaClient | undefined;
}

const prismaClientSingleton = () =>
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

export type AuditDatabaseClient = PrismaClient;

const client = globalThis.prismaAudit ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaAudit = client;
}

export const auditDb = client;
