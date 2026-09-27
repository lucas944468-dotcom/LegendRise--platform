import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { prisma } from "$lib/db";
import { requireUserId, whereUser } from "$lib/access";
import { runEvaluator } from "$lib/ai/evaluator";
import { track } from "$lib/analytics";

// FR-010/011 + Phase 7 progression: score submission via rubric-authoritative
// evaluator → versioned Submission row → Evidence on DEMONSTRATED → milestone
// COMPLETED + next LOCKED unlocked. All rows user-scoped (non-negotiable #8).
export const POST: RequestHandler = async (event) => {
  const userId = await requireUserId(event).catch(() => null);
  if (!userId) return json({ error: "UNAUTHORIZED" }, { status: 401 });
  const body = (await event.request.json().catch(() => null)) as {
    assessmentId?: string;
    submission?: string;
  } | null;
  const submissionText = body?.submission?.slice(0, 20000) ?? "";
  if (!body?.assessmentId || !submissionText)
    return json({ error: "assessmentId and submission required" }, { status: 400 });

  const assessment = await prisma.assessment.findFirst({
    where: { id: body.assessmentId, isPublished: true },
    include: { milestone: true },
  });
  if (!assessment) return json({ error: "Unknown assessment" }, { status: 404 });

  const prior = await prisma.submission.count({
    where: { ...whereUser(userId), assessmentId: assessment.id },
  });
  const result = await runEvaluator({
    userId,
    assessmentId: assessment.id,
    task: assessment.task,
    rubric: assessment.rubric ?? {},
    submission: submissionText,
  });
  const avg =
    result.criterionScores.reduce((a, s) => a + s.level, 0) /
    Math.max(1, result.criterionScores.length);

  const submission = await prisma.submission.create({
    data: {
      userId,
      assessmentId: assessment.id,
      content: submissionText,
      score: { criterionScores: result.criterionScores, average: avg },
      feedback: result.feedback,
      version: prior + 1,
    },
  });

  let evidenceId: string | null = null;
  let unlocked: string | null = null;
  if (result.suggestedStatus === "DEMONSTRATED") {
    const ev = await prisma.evidence.create({
      data: {
        userId,
        type: "ASSESSMENT",
        title: `Assessment — ${assessment.milestone.title}`,
        source: `submission ${submission.id} v${submission.version}`,
        status: "DEMONSTRATED",
      },
    });
    evidenceId = ev.id;
    await prisma.progress.updateMany({
      where: { ...whereUser(userId), milestoneId: assessment.milestoneId },
      data: { status: "COMPLETED", score: avg, completedAt: new Date() },
    });
    const next = await prisma.progress.findFirst({
      where: { ...whereUser(userId), status: "LOCKED" },
      include: { milestone: true },
      orderBy: { milestone: { order: "asc" } },
    });
    if (next) {
      await prisma.progress.update({
        where: { id: next.id },
        data: { status: "IN_PROGRESS" },
      });
      unlocked = next.milestone.title;
    }
    await track("portfolio_item_created", userId, { evidenceId });
  }
  await track("assessment_submitted", userId, {
    assessmentId: assessment.id,
    version: submission.version,
    status: result.suggestedStatus,
  });
  return json({ ...result, average: avg, version: submission.version, evidenceId, unlocked });
};
