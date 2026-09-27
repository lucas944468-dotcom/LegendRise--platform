import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/db";
import { requireUserId } from "$lib/access";
import { nextAction } from "$lib/roadmap";

// FR-013 / CAR-10: dashboard from live data — progress, ONE next action,
// upcoming assessment, evidence snapshot.
export const load: PageServerLoad = async (event) => {
  const userId = await requireUserId(event).catch(() => null);
  if (!userId) redirect(302, "/login");
  const profile = await prisma.profile.findUnique({ where: { userId } });
  if (!profile) redirect(302, "/onboarding");
  const progress = await prisma.progress.findMany({
    where: { userId },
    include: { milestone: true },
  });
  if (progress.length === 0) redirect(302, "/baseline");
  const done = progress.filter((p) => p.status === "COMPLETED").length;
  const pct = Math.round((done / progress.length) * 100);
  const next = await nextAction(userId);
  const upcoming = next
    ? await prisma.assessment.findFirst({ where: { milestoneId: next.milestoneId, isPublished: true } })
    : null;
  const evidence = await prisma.evidence.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 2,
  });
  return {
    careerName: profile.targetRole || "Your career path",
    level: profile.currentLevel || "",
    pct,
    next,
    upcomingTask: upcoming?.task ?? null,
    evidence: evidence.map((e) => ({ title: e.title, type: e.type, source: e.source ?? "", status: "evidence" as const })),
  };
};
