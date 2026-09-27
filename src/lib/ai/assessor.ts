import { z } from "zod";
import { chatJson } from "../openai";

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
export async function runAssessor(input: AssessorInput): Promise<AssessorOutput> {
  const answers = input.responses.map((r) => r.answer).join("\n");
  const ai = await chatJson<AssessorOutput>([
    {
      role: "system",
      content:
        "You assess a learner's starting level from diagnostic answers. Reply ONLY as JSON: {currentLevel: string, gaps: string[], uncertainties: string[]}. Never invent credentials or promise outcomes.",
    },
    {
      role: "user",
      content: `Goal: ${input.goalType} ${input.targetRole ?? ""}\nExperience: ${input.experience ?? ""}\nAnswers:\n${answers}`,
    },
  ]);
  if (ai?.currentLevel) return AssessorOutput.parse(ai);
  // v0 deterministic fallback.
  const text = (answers + " " + (input.experience ?? "")).toLowerCase();
  const experienced = /often|daily|years|confident|advanced/.test(text);
  return {
    currentLevel: experienced ? "Developing" : "Starting",
    gaps: ["Workplace communication basics", "Tool workflows"],
    uncertainties: ["Self-reported — confirm with first practical task"],
  };
}
