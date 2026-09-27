import { prisma } from "./db";

// Rules-based roadmap engine v0 (Phase 4; AI enhancement in Phase 6).
// Sequences the published career template into per-user Progress rows:
// first milestone IN_PROGRESS, rest LOCKED. Idempotent per user.
export async function ensureRoadmap(userId: string): Promise<void> {
  const existing = await prisma.progress.count({ where: { userId } });
  if (existing > 0) return;
  const path = await prisma.careerPath.findFirst({
    where: { isPublished: true },
    orderBy: { createdAt: "asc" },
    include: { milestones: { orderBy: { order: "asc" } } },
  });
  if (!path || path.milestones.length === 0) throw new Error("No published career template");
  await prisma.progress.createMany({
    data: path.milestones.map((m, i) => ({
      userId,
      milestoneId: m.id,
      status: i === 0 ? "IN_PROGRESS" : "LOCKED",
    })),
  });
}

// Evidence-based next action v0: first IN_PROGRESS milestone, else first LOCKED
// unlocked by completion (completion transitions arrive in Phase 7).
export async function nextAction(userId: string): Promise<{ milestoneId: string; title: string } | null> {
  const row = await prisma.progress.findFirst({
    where: { userId, status: "IN_PROGRESS" },
    orderBy: { milestone: { order: "asc" } },
    include: { milestone: true },
  });
  if (!row) return null;
  return { milestoneId: row.milestoneId, title: row.milestone.title };
}
