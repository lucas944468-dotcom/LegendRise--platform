import { z } from "zod";

// Career assessor: goal + responses + experience → starting profile + gaps.
// Control: defined scoring/uncertainty (PRD §11). Implemented in Phase 6.
export const PROMPT_VERSION = "assessor/v0";
export const AssessorInput = z.object({
  userId: z.string(),
  goalType: z.enum(["CAREER", "VENTURE"]),
  targetRole: z.string().optional(),
  responses: z.array(z.object({ questionId: z.string(), answer: z.string() })),
  experience: z.string().optional(),
});
export const AssessorOutput = z.object({
  currentLevel: z.string(),
  gaps: z.array(z.string()),
  uncertainties: z.array(z.string()),
});
export type AssessorInput = z.infer<typeof AssessorInput>;
export type AssessorOutput = z.infer<typeof AssessorOutput>;
export async function runAssessor(_input: AssessorInput): Promise<AssessorOutput> {
  throw new Error("Phase 6: assessor not implemented");
}
