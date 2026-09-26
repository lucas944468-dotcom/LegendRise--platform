import { PrismaClient } from "@prisma/client";

// Singleton Prisma Client (dev hot-reload safe).
// ONLY access path to the database (ADR-2). Every query on a user-owned
// model must add `where: { userId }` — see $lib/access.ts (non-negotiable #8).
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
