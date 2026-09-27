import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/db";
import { requireUserId } from "$lib/access";

// CAR-03: roadmap from live Progress rows (sequenced by ensureRoadmap).
export const load: PageServerLoad = async (event) => {
  const userId = await requireUserId(event).catch(() => null);
  if (!userId) redirect(302, "/login");
  const profile = await prisma.profile.findUnique({ where: { userId } });
  if (!profile) redirect(302, "/onboarding");
  const progress = await prisma.progress.findMany({
    where: { userId },
    include: { milestone: true },
    orderBy: { milestone: { order: "asc" } },
  });
  if (progress.length === 0) redirect(302, "/baseline");
  return {
    careerName: profile.targetRole || "Your career path",
    milestones: progress.map((p) => ({
      order: p.milestone.order,
      title: p.milestone.title,
      state:
        p.status === "COMPLETED"
          ? ("completed" as const)
          : p.status === "IN_PROGRESS"
            ? ("in-progress" as const)
            : p.status === "NEEDS_ATTENTION"
              ? ("needs-attention" as const)
              : ("locked" as const),
    })),
  };
};
