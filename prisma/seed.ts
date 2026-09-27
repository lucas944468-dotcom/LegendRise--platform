import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Phase-3 seed skeleton: one DRAFT career path shell so migrations +
// relations can be verified. Real milestone/lesson content arrives in Phase 8
// (content factory) after the MVP career freeze (Phase 0).
// Phase 4 extension: placeholder milestones + one lesson + one assessment so the
// rules-based roadmap (src/lib/roadmap.ts) has something to sequence.
async function main() {
  const path = await prisma.careerPath.upsert({
    where: { name: "MVP Career (TBD — Phase 0 freeze)" },
    update: { isPublished: true },
    create: {
      name: "MVP Career (TBD — Phase 0 freeze)",
      description: "Placeholder replaced by the frozen MVP career template.",
      levels: { levels: ["Entry", "Junior"] },
      isPublished: true,
    },
  });
  const titles = [
    "Foundations: workplace communication",
    "Core tools and workflows",
    "First supervised tasks",
    "Independent delivery",
    "Portfolio & readiness review",
  ];
  for (let i = 0; i < titles.length; i++) {
    const m = await prisma.milestone.upsert({
      where: { careerPathId_order: { careerPathId: path.id, order: i + 1 } },
      update: { title: titles[i] },
      create: {
        careerPathId: path.id,
        order: i + 1,
        level: i < 2 ? "Entry" : "Junior",
        title: titles[i],
        objectives: { objectives: [] },
      },
    });
    if (i === 2) {
      await prisma.lesson.upsert({
        where: { id: `placeholder-lesson-m3` },
        update: {},
        create: {
          id: `placeholder-lesson-m3`,
          milestoneId: m.id,
          title: "Lesson 3.1 — Writing a clear status update",
          text: "Prototype lesson body (Phase 5/8 replace with factory content).",
          isPublished: true,
        },
      });
      await prisma.assessment.upsert({
        where: { id: `placeholder-assess-m3` },
        update: {},
        create: {
          id: `placeholder-assess-m3`,
          milestoneId: m.id,
          task: "Draft a max-150-word client status update.",
          rubric: { criteria: ["Clarity", "Completeness", "Tone"] },
          isPublished: true,
        },
      });
    }
  }
  console.log(`Seed OK — careerPath ${path.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
