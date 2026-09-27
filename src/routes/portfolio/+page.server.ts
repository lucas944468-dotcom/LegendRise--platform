import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/db";
import { requireUserId, whereUser } from "$lib/access";

// FR-014 / Phase 7: evidence record first — every item traces to source work.
export const load: PageServerLoad = async (event) => {
  const userId = await requireUserId(event).catch(() => null);
  if (!userId) redirect(302, "/login");
  const rows = await prisma.evidence.findMany({
    where: whereUser(userId),
    orderBy: { createdAt: "desc" },
  });
  return {
    items: rows.map((e) => ({
      title: e.title,
      type: e.type,
      source: e.source ?? "",
      status: (e.status === "DEMONSTRATED" ? "evidence" : e.status === "NEEDS_REVIEW" ? "needs-attention" : "in-progress") as
        | "evidence"
        | "needs-attention"
        | "in-progress",
    })),
  };
};
