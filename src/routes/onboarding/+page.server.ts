import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { prisma } from "$lib/db";
import { requireUserId } from "$lib/access";
import { track } from "$lib/analytics";

// FR-002: collect goal, level, experience, preferences, availability.
// Redirects to /baseline (roadmap is sequenced after the diagnostic).
export const load: PageServerLoad = async (event) => {
  const userId = await requireUserId(event).catch(() => null);
  if (!userId) redirect(302, "/login");
  const profile = await prisma.profile.findUnique({ where: { userId } });
  if (!profile) await track("signup", userId);
  return { profile };
};

export const actions: Actions = {
  save: async (event) => {
    const userId = await requireUserId(event).catch(() => null);
    if (!userId) redirect(302, "/login");
    const data = await event.request.formData();
    const goalType = String(data.get("goal") ?? "CAREER") === "VENTURE" ? "VENTURE" : "CAREER";
    await prisma.profile.upsert({
      where: { userId },
      update: {
        goalType,
        targetRole: String(data.get("target") ?? ""),
        currentLevel: String(data.get("level") ?? ""),
        experience: String(data.get("experience") ?? ""),
        availabilityHoursPerWeek: Number(data.get("hours") ?? 0) || null,
      },
      create: {
        userId,
        goalType,
        targetRole: String(data.get("target") ?? ""),
        currentLevel: String(data.get("level") ?? ""),
        experience: String(data.get("experience") ?? ""),
        availabilityHoursPerWeek: Number(data.get("hours") ?? 0) || null,
      },
    });
    redirect(303, "/baseline");
  },
};
