import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { prisma } from "$lib/db";
import { requireUserId } from "$lib/access";
import { runTutor } from "$lib/ai/tutor";
import { track } from "$lib/analytics";

// FR-015: contextual tutor grounded in the current lesson. Persists the
// exchange to AiConversation (private to the user).
export const POST: RequestHandler = async (event) => {
  const userId = await requireUserId(event).catch(() => null);
  if (!userId) return json({ error: "UNAUTHORIZED" }, { status: 401 });
  const body = (await event.request.json().catch(() => null)) as {
    lessonId?: string;
    question?: string;
  } | null;
  const question = body?.question?.slice(0, 2000) ?? "";
  if (!question) return json({ error: "Empty question" }, { status: 400 });
  const lesson = body?.lessonId
    ? await prisma.lesson.findFirst({ where: { id: body.lessonId, isPublished: true } })
    : await prisma.lesson.findFirst({ where: { isPublished: true }, orderBy: { createdAt: "asc" } });
  const lessonText = lesson?.text ?? "No lesson content published yet.";
  const out = await runTutor({ userId, lessonId: lesson?.id ?? "none", lessonText, question });
  await prisma.aiConversation.create({
    data: {
      userId,
      contextType: "coach",
      contextId: lesson?.id,
      messages: [
        { role: "user", text: question },
        { role: "ai", text: out.answer },
      ],
    },
  });
  await track("ai_coach_opened", userId, { lessonId: lesson?.id ?? "none" });
  return json(out);
};
