import type { RequestEvent } from "@sveltejs/kit";
import { auth } from "./auth";

// Central authorization helpers (non-negotiable #8 — no RLS safety net).
// RULE: every server load / API route on user-owned data must call
// requireUserId(event) and scope its Prisma query with `where: { userId }`.

export async function requireUserId(event: RequestEvent): Promise<string> {
  const session = await auth.api.getSession({ headers: event.request.headers });
  if (!session?.user) throw new Error("UNAUTHORIZED");
  return session.user.id;
}

/** Spread into Prisma `where` to confine rows to the caller. */
export function whereUser(userId: string) {
  return { userId } as const;
}

export async function requireAdminId(event: RequestEvent): Promise<string> {
  const session = await auth.api.getSession({ headers: event.request.headers });
  const user = session?.user as { id: string; isAdmin?: boolean } | undefined;
  if (!user || user.isAdmin !== true) throw new Error("FORBIDDEN");
  return user.id;
}
