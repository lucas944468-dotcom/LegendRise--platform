import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { prisma } from "$lib/db";
import { requireUserId, whereUser } from "$lib/access";
import { track } from "$lib/analytics";

// FR-006: lesson from the DB (current milestone's published lesson, else first
// published). Completion records lesson_completed and moves to practice.
async function currentLesson(userId: string) {
  const prog = await prisma.progress.findFirst({
    where: { ...whereUser(userId), status: "IN_PROGRESS" },
    orderBy: { milestone: { order: "asc" } },
  });
  const byMilestone = prog
    ? await prisma.lesson.findFirst({ where: { milestoneId: prog.milestoneId, isPublished: true } })
    : null;
  return (
    byMilestone ?? (await prisma.lesson.findFirst({ where: { isPublished: true }, orderBy: { createdAt: "asc" } }))
  );
}

export const load: PageServerLoad = async (event) => {
  const userId = await requireUserId(event).catch(() => null);
  if (!userId) redirect(302, "/login");
  const lesson = await currentLesson(userId);
  if (!lesson) return { lesson: null };
  await track("lesson_started", userId, { lessonId: lesson.id });
  return {
    lesson: {
      id: lesson.id,
      title: lesson.title,
      text: lesson.text ?? "",
      mediaUrl: lesson.mediaUrl,
      resources: (lesson.resources as { items?: string[] } | null)?.items ?? [],
    },
  };
};

export const actions: Actions = {
  complete: async (event) => {
    const userId = await requireUserId(event).catch(() => null);
    if (!userId) redirect(302, "/login");
    const lesson = await currentLesson(userId);
    await track("lesson_completed", userId, { lessonId: lesson?.id ?? "none" });
    redirect(303, "/practice");
  },
};
