import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { prisma } from "$lib/db";
import { requireAdminId } from "$lib/access";

// Phase 8 content CMS: publish toggles + minimal create forms for the
// career template chain (career → milestone → lesson/assessment).
export const load: PageServerLoad = async (event) => {
  await requireAdminId(event).catch(() => redirect(302, "/login"));
  const careers = await prisma.careerPath.findMany({
    include: {
      milestones: {
        orderBy: { order: "asc" },
        include: { lessons: true, assessments: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });
  return { careers };
};

async function gate(event: { request: Request }): Promise<void> {
  await requireAdminId(event).catch(() => redirect(302, "/login"));
}

export const actions: Actions = {
  toggleCareer: async (event) => {
    await gate(event);
    const d = await event.request.formData();
    const id = String(d.get("id"));
    const cur = await prisma.careerPath.findUniqueOrThrow({ where: { id } });
    await prisma.careerPath.update({ where: { id }, data: { isPublished: !cur.isPublished } });
  },
  addCareer: async (event) => {
    await gate(event);
    const d = await event.request.formData();
    const name = String(d.get("name") ?? "").trim();
    if (!name) return;
    await prisma.careerPath.create({
      data: { name, description: String(d.get("description") ?? ""), levels: { levels: [] } },
    });
  },
  addMilestone: async (event) => {
    await gate(event);
    const d = await event.request.formData();
    const careerPathId = String(d.get("careerPathId"));
    const title = String(d.get("title") ?? "").trim();
    if (!careerPathId || !title) return;
    const count = await prisma.milestone.count({ where: { careerPathId } });
    await prisma.milestone.create({
      data: { careerPathId, order: count + 1, level: String(d.get("level") ?? ""), title, objectives: {} },
    });
  },
  addLesson: async (event) => {
    await gate(event);
    const d = await event.request.formData();
    const milestoneId = String(d.get("milestoneId"));
    const title = String(d.get("title") ?? "").trim();
    if (!milestoneId || !title) return;
    await prisma.lesson.create({
      data: { milestoneId, title, text: String(d.get("text") ?? ""), isPublished: false },
    });
  },
  toggleLesson: async (event) => {
    await gate(event);
    const d = await event.request.formData();
    const cur = await prisma.lesson.findUniqueOrThrow({ where: { id: String(d.get("id")) } });
    await prisma.lesson.update({ where: { id: cur.id }, data: { isPublished: !cur.isPublished } });
  },
  addAssessment: async (event) => {
    await gate(event);
    const d = await event.request.formData();
    const milestoneId = String(d.get("milestoneId"));
    const task = String(d.get("task") ?? "").trim();
    if (!milestoneId || !task) return;
    await prisma.assessment.create({
      data: { milestoneId, task, rubric: { criteria: ["Clarity", "Completeness", "Tone"] }, isPublished: false },
    });
  },
  toggleAssessment: async (event) => {
    await gate(event);
    const d = await event.request.formData();
    const cur = await prisma.assessment.findUniqueOrThrow({ where: { id: String(d.get("id")) } });
    await prisma.assessment.update({ where: { id: cur.id }, data: { isPublished: !cur.isPublished } });
  },
};
