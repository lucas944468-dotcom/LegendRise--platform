import { PrismaClient } from "@prisma/client";

// Singleton Prisma Client (dev hot-reload safe).
// ONLY access path to the database (ADR-2). Every query on a user-owned
// model must add `where: { userId }` — see $lib/access.ts (non-negotiable #8).
//
// Build-safe: `vite build` on Netlify must succeed BEFORE DATABASE_URL is
// configured in the dashboard. Construction is deferred/guarded so importing
// this module at build time never throws; first real query throws a clear
// message instead of a cryptic Prisma panic.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient(): PrismaClient {
  try {
    const client = new PrismaClient();
    return client;
  } catch (err) {
    console.warn("[db] PrismaClient init deferred (DATABASE_URL missing at build?)", err);
    // Minimal stub: surfaces a clear error only if actually queried.
    return new Proxy({} as PrismaClient, {
      get(_t, prop) {
        if (prop === "then") return undefined;
        throw new Error(
          "DATABASE_URL is not configured. Set it in .env locally or in Netlify Site settings → Environment variables, then redeploy.",
        );
      },
    });
  }
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
