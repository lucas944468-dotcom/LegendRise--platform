import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { prisma } from "$lib/db";
import { requireUserId, whereUser } from "$lib/access";
import { track } from "$lib/analytics";

// FR-008: practice brief comes from the current milestone's published
// assessment task. Submit stores a versioned draft Submission (unscored);
// scoring happens on /assessment via the evaluator (FR-010).
async function currentAssessment(userId: string) {
  const prog = await prisma.progress.findFirst({
    where: { ...whereUser(userId), status: "IN_PROGRESS" },
    orderBy: { milestone: { order: "asc" } },
  });
  if (!prog) return null;
  return prisma.assessment.findFirst({ where: { milestoneId: prog.milestoneId, isPublished: true } });
}

export const load: PageServerLoad = async (event) => {
  const userId = await requireUserId(event).catch(() => null);
  if (!userId) redirect(302, "/login");
  const assessment = await currentAssessment(userId);
  if (!assessment) return { brief: null as string | null, assessmentId: null as string | null };
  await track("practice_started", userId, { assessmentId: assessment.id });
  return { brief: assessment.task, assessmentId: assessment.id };
};

export const actions: Actions = {
  submit: async (event) => {
    const userId = await requireUserId(event).catch(() => null);
    if (!userId) redirect(302, "/login");
    const data = await event.request.formData();
    const draft = String(data.get("draft") ?? "").slice(0, 20000);
    const assessmentId = String(data.get("assessmentId") ?? "");
    if (!draft || !assessmentId) return { ok: false };
    const prior = await prisma.submission.count({ where: { ...whereUser(userId), assessmentId } });
    await prisma.submission.create({
      data: { userId, assessmentId, content: draft, version: prior + 1 },
    });
    await track("practice_submitted", userId, { assessmentId, version: prior + 1 });
    redirect(303, `/assessment?aid=${assessmentId}`);
  },
};
