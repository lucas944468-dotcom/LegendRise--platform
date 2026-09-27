import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { requireUserId } from "$lib/access";
import { track, EVENTS, type AnalyticsEventName, type EventProps } from "$lib/analytics";

// Minimal analytics ingest (Phase 9). Clients POST {event, props}.
// Event names are allow-listed; the caller is always the session user.
export const POST: RequestHandler = async (event) => {
  const userId = await requireUserId(event).catch(() => null);
  if (!userId) return json({ error: "UNAUTHORIZED" }, { status: 401 });
  const body = (await event.request.json().catch(() => null)) as {
    event?: string;
    props?: EventProps;
  } | null;
  if (!body?.event || !(EVENTS as readonly string[]).includes(body.event))
    return json({ error: "Unknown event" }, { status: 400 });
  await track(body.event as AnalyticsEventName, userId, body.props);
  return json({ ok: true });
};
