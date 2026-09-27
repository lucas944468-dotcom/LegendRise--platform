import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { prisma } from "$lib/db";
import { requireUserId } from "$lib/access";
import { runSimulation } from "$lib/ai/simulation";
import { track } from "$lib/analytics";

// FR-009: simulation turn. Scenario + role come from the published Simulation
// row (never invented). Completion + coaching returned per turn.
export const POST: RequestHandler = async (event) => {
  const userId = await requireUserId(event).catch(() => null);
  if (!userId) return json({ error: "UNAUTHORIZED" }, { status: 401 });
  const body = (await event.request.json().catch(() => null)) as {
    simulationId?: string;
    userResponse?: string;
    history?: { role: "ai" | "user"; text: string }[];
  } | null;
  const userResponse = body?.userResponse?.slice(0, 4000) ?? "";
  if (!userResponse) return json({ error: "Empty response" }, { status: 400 });
  const sim = body?.simulationId
    ? await prisma.simulation.findFirst({ where: { id: body.simulationId, isPublished: true } })
    : await prisma.simulation.findFirst({ where: { isPublished: true }, orderBy: { createdAt: "asc" } });
  const scenario = (sim?.scenario as { background?: string } | null)?.background ?? "Workplace role-play.";
  const out = await runSimulation({
    userId,
    simulationId: sim?.id ?? "none",
    scenario,
    aiRole: "client",
    history: body?.history ?? [],
    userResponse,
  });
  if (out.scenarioComplete) await track("simulation_completed", userId, { simulationId: sim?.id ?? "none" });
  return json(out);
};
