# ADR-002: Database & ORM

- Status: Accepted (founder decision, 2026-09-26)
- Context: PRD §14 proposed Supabase (hosted Postgres + RLS). Founder requires local Postgres, no subscriptions.

## Decision

**Local PostgreSQL 16/17 + Prisma ORM.** Schema + versioned migrations in `/prisma`
implementing every PRD §15 entity. Prisma Client (`src/lib/db.ts`) is the ONLY
database access path.

## Consequences

- **No row-level security.** Replaced by app-level rule (non-negotiable #8):
  every server query on user-owned data is scoped to the session user
  (`where: { userId }` via `src/lib/access.ts`), checked in review + negative tests.
- Founder operates backups: `scripts/backup.ps1` (pg_dump, 14-copy retention).
- Schema changes flow through `prisma migrate dev`; seed via `prisma/seed.ts`.
