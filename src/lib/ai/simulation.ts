import { z } from "zod";

// Simulation agent: scenario + role + rubric + user response → role reply + state.
// Control: scenario boundaries (PRD §11). Implemented in Phase 6.
export const PROMPT_VERSION = "simulation/v0";
export const SimulationInput = z.object({
  userId: z.string(),
  simulationId: z.string(),
  scenario: z.string(),
  aiRole: z.string(),
  history: z.array(z.object({ role: z.enum(["ai", "user"]), text: z.string() })),
  userResponse: z.string().min(1).max(4000),
});
export const SimulationOutput = z.object({
  reply: z.string(),
  scenarioComplete: z.boolean(),
  coaching: z.string().optional(),
});
export type SimulationInput = z.infer<typeof SimulationInput>;
export type SimulationOutput = z.infer<typeof SimulationOutput>;
export async function runSimulation(_input: SimulationInput): Promise<SimulationOutput> {
  throw new Error("Phase 6: simulation not implemented");
}
