import { headers } from "next/headers";
import { auth } from "./auth";

// Central authorization helpers (non-negotiable #8 — no RLS safety net).
// RULE: every API route / server action on user-owned data must call
// requireUserId() and scope its Prisma query with `where: { userId }`.

export async function requireUserId(): Promise<string> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("UNAUTHORIZED");
  return session.user.id;
}

/** Spread into Prisma `where` to confine rows to the caller. */
export function whereUser(userId: string) {
  return { userId } as const;
}

export async function requireAdminId(): Promise<string> {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user as { id: string; isAdmin?: boolean } | undefined;
  if (!user || user.isAdmin !== true) throw new Error("FORBIDDEN");
  return user.id;
}
