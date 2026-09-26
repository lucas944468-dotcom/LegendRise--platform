// Prototype-only mock data (Phase 1). Real data arrives via Prisma in Phase 3+.
// Career is a PLACEHOLDER until the Phase 0 freeze (content/career-definition.md).
import type { RubricRow } from "$lib/components/RubricTable.svelte";
import type { ChatMessage } from "$lib/components/ChatThread.svelte";

export type MilestoneState = "completed" | "in-progress" | "locked" | "needs-attention" | "evidence";

export const mockCareer = {
  name: "Example Career (placeholder — pending Phase 0 freeze)",
  level: "Entry → Junior",
  progress: 40,
  nextAction: { title: "Complete Practice: Draft a client status update", href: "/practice" },
  upcomingAssessment: "Workplace writing assessment — unlocks after Practice 2",
};

export const mockMilestones: { order: number; title: string; state: MilestoneState }[] = [
  { order: 1, title: "Foundations: workplace communication", state: "completed" },
  { order: 2, title: "Core tools and workflows", state: "completed" },
  { order: 3, title: "First supervised tasks", state: "in-progress" },
  { order: 4, title: "Independent delivery", state: "locked" },
  { order: 5, title: "Portfolio & readiness review", state: "locked" },
];

export const mockLesson = {
  title: "Lesson 3.1 — Writing a clear status update",
  body: "A good status update answers three questions: what changed, what is next, and what is blocked. Keep it under 150 words. Lead with the outcome, not the activity.",
  resources: ["Status-update template (download)", "Worked example: good vs vague update"],
};

export const mockPractice = {
  title: "Practice 3.1 — Draft a client status update",
  brief: "Your client asked for a Friday update on theHandsontable migration. Draft ≤150 words covering: progress, next steps, one risk.",
  hints: ["Lead with the outcome.", "Name an owner for every next step.", "Risks need a mitigation, not just a warning."],
};

export const mockSimulation = {
  scenario: "You are meeting Mrs. Adeyemi, a busy client. She is unhappy the delivery slipped by two days. Keep her trust without over-promising.",
  messages: [
    { role: "ai", text: "Good afternoon. I was told delivery would land Wednesday. It is Friday. Explain." },
    { role: "user", text: "Good afternoon ma. You are right — we slipped by two days because testing caught a data issue. The fix is in and delivery is confirmed for Monday 10am." },
    { role: "ai", text: "Monday 10am. And if it slips again? I have my own customers waiting." },
  ] as ChatMessage[],
  feedback: "Strong ownership + concrete time. Next time, add the mitigation (what prevents a repeat) before she has to ask.",
};

export const mockRubric: RubricRow[] = [
  { criterion: "Clarity", levels: ["Vague", "Mostly clear", "Crisp and scannable"], score: 2 },
  { criterion: "Completeness", levels: ["Missing parts", "Covers most", "Progress + next + risk"], score: 1 },
  { criterion: "Tone", levels: ["Defensive", "Neutral", "Owning and calm"], score: 2 },
];

export const mockEvidence = [
  { title: "Practice 2.3 — Support ticket triage", type: "Project", source: "Practice submission", status: "evidence" as const },
  { title: "Simulation — Angry client call", type: "Simulation", source: "AI role-play", status: "evidence" as const },
  { title: "Lesson 2.2 knowledge check", type: "Assessment", source: "Quiz 4/5", status: "in-progress" as const },
];

export const mockCoach: ChatMessage[] = [
  { role: "ai", text: "I am your LegendRise coach. I answer from your current lesson and approved materials. What are you stuck on?" },
];
