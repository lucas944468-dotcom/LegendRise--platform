import type { Actions } from "./$types";
import { prisma } from "$lib/db";
import { requireUserId } from "$lib/access";

// Phase 10 support gate: problem + incorrect-AI-feedback reports → admin queue.
export const actions: Actions = {
  report: async (event) => {
    const userId = await requireUserId(event).catch(() => null);
    const data = await event.request.formData();
    const message = String(data.get("message") ?? "").slice(0, 5000).trim();
    if (!message) return { ok: false };
    await prisma.supportReport.create({
      data: {
        userId,
        kind: String(data.get("kind") ?? "other"),
        context: String(data.get("context") ?? "").slice(0, 500),
        message,
      },
    });
    return { ok: true };
  },
};
