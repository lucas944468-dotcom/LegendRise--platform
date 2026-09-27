import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { prisma } from "$lib/db";
import { requireAdminId } from "$lib/access";

// Phase 10 support queue: user problem / incorrect-AI-feedback reports.
export const load: PageServerLoad = async (event) => {
  await requireAdminId(event).catch(() => redirect(302, "/login"));
  const reports = await prisma.supportReport.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  return { reports };
};

export const actions: Actions = {
  resolve: async (event) => {
    await requireAdminId(event).catch(() => redirect(302, "/login"));
    const d = await event.request.formData();
    await prisma.supportReport.update({
      where: { id: String(d.get("id")) },
      data: { status: "RESOLVED" },
    });
  },
};
