import { prisma } from "./db";

// Phase 9 analytics (§17 taxonomy). Local-first: every tracked event is stored
// in AnalyticsEvent. PostHog forwarding plugs in here when a key exists.
export const EVENTS = [
  "signup",
  "assessment_started",
  "assessment_completed",
  "roadmap_viewed",
  "lesson_started",
  "lesson_completed",
  "practice_started",
  "practice_submitted",
  "simulation_started",
  "simulation_completed",
  "assessment_submitted",
  "portfolio_item_created",
  "ai_coach_opened",
  "next_action_clicked",
] as const;
export type AnalyticsEventName = (typeof EVENTS)[number];
export type EventProps = Record<string, string | number | boolean | null>;

export async function track(event: AnalyticsEventName, userId?: string, props?: EventProps): Promise<void> {
  try {
    await prisma.analyticsEvent.create({ data: { event, userId: userId ?? null, props: props ?? {} } });
  } catch (e) {
    console.warn("[analytics] track failed", event, e);
  }
}
