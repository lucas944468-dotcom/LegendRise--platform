import { z } from "zod";
// (rules-based; no model call)

// Roadmap engine: starting profile + career template → ordered milestones + actions.
// Control: approved pathway data only (PRD §11). Implemented in Phase 6.
export const PROMPT_VERSION = "roadmap/v0";
export const RoadmapInput = z.object({
  userId: z.string(),
  careerPathId: z.string(),
  currentLevel: z.string(),
  gaps: z.array(z.string()),
});
export const RoadmapOutput = z.object({
  milestones: z.array(z.object({ milestoneId: z.string(), order: z.number(), reason: z.string() })),
});
export type RoadmapInput = z.infer<typeof RoadmapInput>;
export type RoadmapOutput = z.infer<typeof RoadmapOutput>;
export async function runRoadmap(input: RoadmapInput): Promise<RoadmapOutput> {
  const { prisma } = await import("../db");
  const milestones = await prisma.milestone.findMany({
    where: { careerPathId: input.careerPathId },
    orderBy: { order: "asc" },
  });
  return {
    milestones: milestones.map((m) => ({
      milestoneId: m.id,
      order: m.order,
      reason: input.gaps.length > 0 ? `Stage ${m.order}: targets gap area` : `Stage ${m.order} of pathway`,
    })),
  };
}
