import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Phase-3 seed skeleton: one DRAFT career path shell so migrations +
// relations can be verified. Real milestone/lesson content arrives in Phase 8
// (content factory) after the MVP career freeze (Phase 0).
async function main() {
  const path = await prisma.careerPath.upsert({
    where: { name: "MVP Career (TBD — Phase 0 freeze)" },
    update: {},
    create: {
      name: "MVP Career (TBD — Phase 0 freeze)",
      description: "Placeholder replaced by the frozen MVP career template.",
      levels: { levels: [] },
      isPublished: false,
    },
  });
  console.log(`Seed OK — careerPath ${path.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
