import { z } from "zod";

// Venture coach: venture stage + evidence → next experiment/decision.
// Control: evidence/assumption distinction (PRD §8.1, §11). Implemented with the
// Venture Lab (plan Phase 3 / PRD Phase 3) — architecture only until then.
export const PROMPT_VERSION = "venture/v0";
export const VentureInput = z.object({
  userId: z.string(),
  projectId: z.string(),
  stage: z.string(),
  evidenceSummary: z.string(),
});
export const VentureOutput = z.object({
  nextExperiment: z.string(),
  assumptionToTest: z.string(),
});
export type VentureInput = z.infer<typeof VentureInput>;
export type VentureOutput = z.infer<typeof VentureOutput>;
export async function runVentureCoach(_input: VentureInput): Promise<VentureOutput> {
  throw new Error("Venture Lab not implemented (PRD Phase 3)");
}
