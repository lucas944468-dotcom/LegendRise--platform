# ADR-007: Venture readiness without venture UI

- Status: Accepted (derives from PRD §3.2, FR-018)
- Context: MVP builds ONE career pathway; the venture experience ships in Phase 3
  (PRD) but the architecture must not block it.

## Decision

Ship `VentureProject` / `VentureEvidence` Prisma models + navigation stubs behind
a feature flag in the MVP. **No venture UI, no venture logic** until Phase 3.

## Consequences

- Venture evidence rules (§8.1: assumptions ≠ evidence, sourced facts, scenario
  financials, plan-from-evidence) are enforced when the Lab is built, not before.
