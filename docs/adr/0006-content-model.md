# ADR-006: Data-driven content model

- Status: Accepted (derives from PRD §14.1, §19)
- Context: New careers must ship without application rewrites; content needs
  ownership, versioning, and review states.

## Decision

**Careers are data, not code.** `CareerPath → Milestone → Lesson / Simulation /
Assessment` rows (seeded from the Appendix A template) drive the roadmap engine
and UI. Rubrics carry criteria/levels/version/effective-date. AI config
(prompts + grounding sources + history) is admin-managed data (Phase 8).

## Consequences

- Phase 2 acceptance: a new career ships via content rows only.
- Content factory (§19) output lands as versioned rows, never hard-coded screens.
