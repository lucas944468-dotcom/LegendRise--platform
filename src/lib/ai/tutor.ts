import { z } from "zod";
import { chatText } from "../openai";

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
export async function runTutor(input: TutorInput): Promise<TutorOutput> {
  const ai = await chatText([
    {
      role: "system",
      content:
        "You are a LegendRise tutor. Answer ONLY from the lesson text below. If the answer is not in it, say so explicitly. Be concise.",
    },
    { role: "user", content: `LESSON:\n${input.lessonText}\n\nQUESTION: ${input.question}` },
  ]);
  if (ai) return { answer: ai, sources: ["current lesson"], uncertain: false };
  // v0 extractive fallback: lesson sentences sharing question words.
  const words = new Set(
    input.question.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 3),
  );
  const hits = input.lessonText
    .split(/(?<=[.!?])\s+/)
    .filter((s) => {
      const l = s.toLowerCase();
      let n = 0;
      words.forEach((w) => {
        if (l.includes(w)) n++;
      });
      return n >= 2;
    })
    .slice(0, 3);
  if (hits.length === 0)
    return {
      answer: "I can't find that in this lesson yet — try asking about something the lesson covers.",
      sources: [],
      uncertain: true,
    };
  return { answer: hits.join(" "), sources: ["current lesson (matched passages)"], uncertain: true };
}
