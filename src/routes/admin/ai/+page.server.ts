import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/db";
import { requireAdminId } from "$lib/access";
import { PROMPT_VERSION as assessor } from "$lib/ai/assessor";
import { PROMPT_VERSION as roadmap } from "$lib/ai/roadmap";
import { PROMPT_VERSION as tutor } from "$lib/ai/tutor";
import { PROMPT_VERSION as simulation } from "$lib/ai/simulation";
import { PROMPT_VERSION as evaluator } from "$lib/ai/evaluator";
import { PROMPT_VERSION as recommender } from "$lib/ai/recommender";
import { PROMPT_VERSION as venture } from "$lib/ai/venture";

// Phase 8: AI configuration view — service prompt versions + usage counts.
export const load: PageServerLoad = async (event) => {
  await requireAdminId(event).catch(() => redirect(302, "/login"));
  const conversations = await prisma.aiConversation.count();
  const groq = !!process.env.GROQ_API_KEY;
  const openai = !!process.env.OPENAI_API_KEY;
  const status = groq
    ? "configured (Groq)"
    : openai
      ? "configured (OpenAI)"
      : "NOT configured — deterministic v0 fallbacks active";
  return {
    services: [
      { name: "assessor", version: assessor },
      { name: "roadmap", version: roadmap },
      { name: "tutor", version: tutor },
      { name: "simulation", version: simulation },
      { name: "evaluator", version: evaluator },
      { name: "recommender", version: recommender },
      { name: "venture", version: venture },
    ],
    conversations,
    openai: status,
  };
};
