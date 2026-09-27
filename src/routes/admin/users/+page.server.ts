import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/db";
import { requireAdminId } from "$lib/access";

// Phase 8: user list (access state + journey state at a glance).
export const load: PageServerLoad = async (event) => {
  await requireAdminId(event).catch(() => redirect(302, "/login"));
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { profile: true, _count: { select: { submissions: true, evidence: true } } },
  });
  return {
    users: users.map((u) => ({
      email: u.email,
      admin: u.isAdmin,
      verified: u.emailVerified,
      goal: u.profile ? `${u.profile.goalType} — ${u.profile.targetRole}` : "—",
      submissions: u._count.submissions,
      evidence: u._count.evidence,
    })),
  };
};
