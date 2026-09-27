// Grant admin flag (Phase 8). Usage: npx tsx scripts/make-admin.ts you@example.com
// Requires DATABASE_URL in shell or .env.
import { prisma } from "../src/lib/db";

const email = process.argv[2];
if (!email) throw new Error("Usage: npx tsx scripts/make-admin.ts you@example.com");
const u = await prisma.user.update({ where: { email }, data: { isAdmin: true } });
console.log(`Admin granted: ${u.email}`);
await prisma.$disconnect();
