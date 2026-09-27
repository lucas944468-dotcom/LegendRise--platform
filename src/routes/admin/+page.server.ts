import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/db";
import { requireAdminId } from "$lib/access";

// Phase 8: admin home — counts + links. Gated by User.isAdmin.
export const load: PageServerLoad = async (event) => {
  await requireAdminId(event).catch(() => redirect(302, "/login"));
  const [careers, milestones, lessons, assessments, users, reports, events] = await Promise.all([
    prisma.careerPath.count(),
    prisma.milestone.count(),
    prisma.lesson.count(),
    prisma.assessment.count(),
    prisma.user.count(),
    prisma.supportReport.count({ where: { status: "OPEN" } }),
    prisma.analyticsEvent.count(),
  ]);
  return { careers, milestones, lessons, assessments, users, openReports: reports, events };
};
