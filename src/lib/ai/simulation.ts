import { z } from "zod";
import { chatJson } from "../openai";

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
export async function runSimulation(input: SimulationInput): Promise<SimulationOutput> {
  const ai = await chatJson<SimulationOutput>([
    {
      role: "system",
      content: `You role-play this character and nothing else: ${input.aiRole}. Scenario: ${input.scenario}. Reply ONLY as JSON: {reply: string (in character, max 120 words), scenarioComplete: boolean, coaching: string (one sentence of feedback on the user's last message)}. Never break character inside reply.`,
    },
    ...input.history.map((h) => ({
      role: (h.role === "ai" ? "assistant" : "user") as "assistant" | "user",
      content: h.text,
    })),
    { role: "user" as const, content: input.userResponse },
  ]);
  if (ai?.reply)
    return { reply: ai.reply, scenarioComplete: !!ai.scenarioComplete, coaching: ai.coaching };
  // v0 scripted fallback.
  const turns = input.history.filter((h) => h.role === "user").length + 1;
  const done = turns >= 4 || /thank|agree|deal|monday|confirm/i.test(input.userResponse);
  return {
    reply: done
      ? "Alright. Monday 10am. I will hold you to it."
      : "Hmm. And what exactly happens if it slips again? Give me something concrete.",
    scenarioComplete: done,
    coaching: done
      ? "You closed with a commitment — good. Name the mitigation earlier next time."
      : "Push for specifics: dates, owners, mitigations.",
  };
}
