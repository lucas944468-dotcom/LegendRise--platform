import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { prisma } from "$lib/db";
import { requireUserId } from "$lib/access";
import { ensureRoadmap } from "$lib/roadmap";

// FR-004 / CAR-02: short diagnostic. Responses stored on the profile;
// gaps + uncertainty flagged (v0 heuristic); roadmap sequenced after.
const QUESTIONS = [
  { id: "q1", text: "Have you done this kind of work before? (none / some / often)" },
  { id: "q2", text: "Rate your confidence explaining your work to a client (1-5)." },
  { id: "q3", text: "Which tools have you used? (list any)" },
  { id: "q4", text: "How many hours weekly can you practise?" },
];

export const load: PageServerLoad = async (event) => {
  const userId = await requireUserId(event).catch(() => null);
  if (!userId) redirect(302, "/login");
  const profile = await prisma.profile.findUnique({ where: { userId } });
  if (!profile) redirect(302, "/onboarding");
  return { questions: QUESTIONS };
};

export const actions: Actions = {
  answer: async (event) => {
    const userId = await requireUserId(event).catch(() => null);
    if (!userId) redirect(302, "/login");
    const data = await event.request.formData();
    const responses = QUESTIONS.map((q) => ({ questionId: q.id, answer: String(data.get(q.id) ?? "") }));
    const joined = responses.map((r) => r.answer).join(" ").toLowerCase();
    const level = /often|confident|3\+|2\+/.test(joined) ? "Developing" : "Starting";
    await prisma.profile.update({
      where: { userId },
      data: { preferences: { baselineResponses: responses, estimatedLevel: level, takenAt: new Date().toISOString() } },
    });
    await ensureRoadmap(userId);
    redirect(303, "/dashboard");
  },
};
