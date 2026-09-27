import { z } from "zod";
// (deterministic, evidence-based; no model call)

// Next-step recommender: progress + scores + unfinished tasks → next milestone + reason.
// Control: evidence-based rule (PRD §11). Implemented in Phase 6.
export const PROMPT_VERSION = "recommender/v0";
export const RecommenderInput = z.object({
  userId: z.string(),
  progress: z.array(z.object({ milestoneId: z.string(), status: z.string(), score: z.number().nullable() })),
  unfinishedTaskIds: z.array(z.string()),
});
export const RecommenderOutput = z.object({
  nextMilestoneId: z.string(),
  reason: z.string(),
});
export type RecommenderInput = z.infer<typeof RecommenderInput>;
export type RecommenderOutput = z.infer<typeof RecommenderOutput>;
export async function runRecommender(input: RecommenderInput): Promise<RecommenderOutput> {
  const pick =
    input.progress.find((p) => p.status === "IN_PROGRESS") ??
    input.progress.find((p) => p.status === "LOCKED");
  if (!pick) throw new Error("No milestones available");
  const { prisma } = await import("../db");
  const m = await prisma.milestone.findUnique({ where: { id: pick.milestoneId } });
  const name = m?.title ?? pick.milestoneId;
  return {
    nextMilestoneId: pick.milestoneId,
    reason:
      pick.status === "IN_PROGRESS" ? `Continue current work: ${name}` : `Next stage unlocked: ${name}`,
  };
}
