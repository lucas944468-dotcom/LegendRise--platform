// Deterministic v0 unit tests (Phase 6). No OPENAI_API_KEY is set in test, so
// every service must take its documented fallback path — never throw, never
// invent credentials, always flag uncertainty where required.
import { describe, it, expect } from "vitest";
import { runTutor } from "../src/lib/ai/tutor";
import { runEvaluator } from "../src/lib/ai/evaluator";
import { runSimulation } from "../src/lib/ai/simulation";
import { PROMPT_VERSION as tutorV } from "../src/lib/ai/tutor";
import { PROMPT_VERSION as evalV } from "../src/lib/ai/evaluator";

describe("tutor v0 fallback", () => {
  it("answers from lesson text and flags uncertainty", async () => {
    const out = await runTutor({
      userId: "u",
      lessonId: "l",
      lessonText: "A status update leads with the outcome. Name an owner for every next step.",
      question: "What should a status update lead with?",
    });
    expect(out.answer).toMatch(/outcome/i);
    expect(out.uncertain).toBe(true);
  });
  it("says so when the lesson has no answer", async () => {
    const out = await runTutor({
      userId: "u",
      lessonId: "l",
      lessonText: "Completely unrelated content about gardening.",
      question: "What should a status update lead with?",
    });
    expect(out.uncertain).toBe(true);
  });
});

describe("evaluator v0 fallback", () => {
  it("scores against criteria and never invents outcomes", async () => {
    const out = await runEvaluator({
      userId: "u",
      assessmentId: "a",
      task: "Draft an update.",
      rubric: { criteria: ["Clarity", "Completeness", "Tone"] },
      submission:
        "We shipped the migration on Friday because testing passed. Next we will monitor errors and I will own the rollout. The risk is load spikes and we will mitigate with caching. Thank you.",
    });
    expect(out.criterionScores).toHaveLength(3);
    expect(["NOT_ASSESSED", "DEVELOPING", "DEMONSTRATED"]).toContain(out.suggestedStatus);
    expect(out.feedback).not.toMatch(/guarantee|salary|hired/i);
  });
});

describe("simulation v0 fallback", () => {
  it("stays in character and eventually completes", async () => {
    let history: { role: "ai" | "user"; text: string }[] = [];
    let done = false;
    for (let i = 0; i < 5 && !done; i++) {
      const out = await runSimulation({
        userId: "u",
        simulationId: "s",
        scenario: "Unhappy client.",
        aiRole: "client",
        history,
        userResponse: "We will deliver Monday 10am, thank you for your patience.",
      });
      history = [...history, { role: "user", text: "x" }, { role: "ai", text: out.reply }];
      done = out.scenarioComplete;
      expect((out.coaching ?? "").length).toBeGreaterThan(0);
    }
    expect(done).toBe(true);
  });
});

describe("prompt versions", () => {
  it("are pinned strings", () => {
    expect(tutorV).toMatch(/^tutor\//);
    expect(evalV).toMatch(/^evaluator\//);
  });
});
