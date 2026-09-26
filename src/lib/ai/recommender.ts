import { z } from "zod";

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
export async function runRecommender(_input: RecommenderInput): Promise<RecommenderOutput> {
  throw new Error("Phase 6: recommender not implemented");
}
