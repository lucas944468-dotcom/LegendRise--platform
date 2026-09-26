import { z } from "zod";

// Tutor: current lesson + approved content + question → grounded explanation.
// Control: content grounding; explicit uncertainty/fallbacks (PRD §11.2). Phase 6.
export const PROMPT_VERSION = "tutor/v0";
export const TutorInput = z.object({
  userId: z.string(),
  lessonId: z.string(),
  lessonText: z.string(),
  question: z.string().min(1).max(2000),
});
export const TutorOutput = z.object({
  answer: z.string(),
  sources: z.array(z.string()),
  uncertain: z.boolean(),
});
export type TutorInput = z.infer<typeof TutorInput>;
export type TutorOutput = z.infer<typeof TutorOutput>;
export async function runTutor(_input: TutorInput): Promise<TutorOutput> {
  throw new Error("Phase 6: tutor not implemented");
}
