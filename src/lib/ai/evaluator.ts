import { z } from "zod";

// Assessment evaluator: submission + rubric → score + evidence + feedback.
// Control: rubric authoritative (PRD §11). Implemented in Phase 6.
export const PROMPT_VERSION = "evaluator/v0";
export const EvaluatorInput = z.object({
  userId: z.string(),
  assessmentId: z.string(),
  task: z.string(),
  rubric: z.record(z.string(), z.unknown()),
  submission: z.string().min(1),
});
export const EvaluatorOutput = z.object({
  criterionScores: z.array(z.object({ criterion: z.string(), level: z.number(), evidence: z.string() })),
  feedback: z.string(),
  suggestedStatus: z.enum(["NOT_ASSESSED", "DEVELOPING", "DEMONSTRATED", "NEEDS_REVIEW"]),
});
export type EvaluatorInput = z.infer<typeof EvaluatorInput>;
export type EvaluatorOutput = z.infer<typeof EvaluatorOutput>;
export async function runEvaluator(_input: EvaluatorInput): Promise<EvaluatorOutput> {
  throw new Error("Phase 6: evaluator not implemented");
}
