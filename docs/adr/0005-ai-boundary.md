# ADR-005: AI service boundary

- Status: Accepted (derives from PRD §5, §11)
- Context: PRD forbids "one giant prompt". Seven AI functions share inputs/outputs
  but must stay independently testable, grounded, and wrapped in deterministic rules.

## Decision

**One module per service in `src/lib/ai/`**, each owning:

1. `PROMPT_VERSION` constant (bumped on every prompt change),
2. zod input/output schemas (validated at runtime),
3. a single `run*()` entry point implementing the §11.1 lifecycle
   (context → approved retrieval → structured call → schema validate →
   deterministic rules → store + audit → uncertainty → report channel).

Services: assessor, roadmap, tutor, simulation, evaluator, recommender, venture
(see `src/lib/ai/index.ts`). All invoked through server routes (ADR-001);
model keys server-side only. Phase 2 ships contracts/stubs; Phase 6 implements.

## Consequences

- High-stakes calls (milestone completion, capability status) go through
  deterministic, evidence-based rules around the model — never bare model output.
- Prompt versions + audit trail make feedback evaluable per service.
