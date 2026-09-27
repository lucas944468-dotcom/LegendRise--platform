import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/db";
import { requireUserId, whereUser } from "$lib/access";

// FR-010/011 + Phase 7: assessment task + rubric + the user's versioned
// submissions. Scoring runs through /api/assess (evaluator service).
export const load: PageServerLoad = async (event) => {
  const userId = await requireUserId(event).catch(() => null);
  if (!userId) redirect(302, "/login");
  const aid = event.url.searchParams.get("aid");
  const assessment = aid
    ? await prisma.assessment.findFirst({ where: { id: aid, isPublished: true } })
    : await prisma.assessment.findFirst({ where: { isPublished: true }, orderBy: { createdAt: "asc" } });
  if (!assessment) return { assessment: null, rows: [], latest: null };
  const subs = await prisma.submission.findMany({
    where: { ...whereUser(userId), assessmentId: assessment.id },
    orderBy: { version: "asc" },
  });
  const rubric = assessment.rubric as { criteria?: string[] } | null;
  const criteria = Array.isArray(rubric?.criteria) ? rubric.criteria : ["Clarity", "Completeness", "Tone"];
  const latest = subs[subs.length - 1] ?? null;
  const latestScores = (latest?.score as { criterionScores?: { criterion: string; level: number }[] } | null)?.criterionScores ?? [];
  return {
    assessment: { id: assessment.id, task: assessment.task },
    rows: criteria.map((c) => ({
      criterion: c,
      levels: ["Beginning", "Developing", "Demonstrated"],
      score: latestScores.find((s) => s.criterion === c)?.level,
    })),
    latest: latest
      ? {
          version: latest.version,
          feedback: latest.feedback,
          average: (latest.score as { average?: number } | null)?.average ?? null,
        }
      : null,
    versions: subs.length,
  };
};
