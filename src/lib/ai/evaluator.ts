import { z } from "zod";
import { chatJson } from "../openai";

// Assessment evaluator: submission + rubric → score + evidence + feedback.
// Control: rubric authoritative (PRD §11). Implemented in Phase 6.
export const PROMPT_VERSION = "evaluator/v0";
export const EvaluatorInput = z.object({
  userId: z.string(),
  assessmentId: z.string(),
  task: z.string(),
  rubric: z.unknown(),
  submission: z.string().min(1),
});
export const EvaluatorOutput = z.object({
  criterionScores: z.array(z.object({ criterion: z.string(), level: z.number(), evidence: z.string() })),
  feedback: z.string(),
  suggestedStatus: z.enum(["NOT_ASSESSED", "DEVELOPING", "DEMONSTRATED", "NEEDS_REVIEW"]),
});
export type EvaluatorInput = z.infer<typeof EvaluatorInput>;
export type EvaluatorOutput = z.infer<typeof EvaluatorOutput>;
function criteriaOf(rubric: unknown): string[] {
  const r = rubric as { criteria?: unknown };
  if (r && Array.isArray(r.criteria)) return r.criteria.map(String);
  return ["Clarity", "Completeness", "Tone"];
}

export async function runEvaluator(input: EvaluatorInput): Promise<EvaluatorOutput> {
  const crits = criteriaOf(input.rubric);
  const ai = await chatJson<{
    scores: { criterion: string; level: number; evidence: string }[];
    feedback: string;
  }>([
    {
      role: "system",
      content: `Score the submission against each criterion as level 0, 1, or 2. Reply ONLY as JSON: {scores: [{criterion, level, evidence (short quote)}], feedback: string (2 sentences, actionable)}. Task: ${input.task}`,
    },
    { role: "user", content: `Criteria: ${crits.join(", ")}\n\nSUBMISSION:\n${input.submission}` },
  ]);
  if (ai?.scores?.length) {
    const clean = ai.scores.map((s) => ({
      criterion: String(s.criterion),
      level: Math.max(0, Math.min(2, Math.round(Number(s.level) || 0))),
      evidence: String(s.evidence ?? ""),
    }));
    const avg = clean.reduce((a, s) => a + s.level, 0) / clean.length;
    return {
      criterionScores: clean,
      feedback: String(ai.feedback ?? ""),
      suggestedStatus: avg >= 1.5 ? "DEMONSTRATED" : avg >= 0.75 ? "DEVELOPING" : "NOT_ASSESSED",
    };
  }
  // v0 deterministic heuristic — labelled provisional in feedback.
  const text = input.submission.toLowerCase();
  const words = text.split(/\s+/).filter(Boolean).length;
  const has = (...ks: string[]) => ks.some((k) => text.includes(k));
  const lv = (ok: boolean, strong: boolean) => (strong ? 2 : ok ? 1 : 0);
  const criterionScores = [
    { criterion: crits[0] ?? "Clarity", level: lv(words > 20, words > 80), evidence: `${words} words` },
    {
      criterion: crits[1] ?? "Completeness",
      level: lv(has("next", "will", "plan"), has("risk", "block", "mitigat") && has("next", "will")),
      evidence: "keyword coverage",
    },
    {
      criterion: crits[2] ?? "Tone",
      level: lv(!has("fault", "blame", "stupid"), has("please", "thank", "apolog") || has("we will", "i will")),
      evidence: "tone markers",
    },
  ];
  const avg = criterionScores.reduce((a, s) => a + s.level, 0) / criterionScores.length;
  return {
    criterionScores,
    feedback: "Provisional v0 score (deterministic heuristic). A rubric-authored review upgrades it.",
    suggestedStatus: avg >= 1.5 ? "DEMONSTRATED" : avg >= 0.75 ? "DEVELOPING" : "NOT_ASSESSED",
  };
}
