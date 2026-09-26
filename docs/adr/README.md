# Architecture Decision Records

Phased plan Phase 2 output. Read in order. Status changes go through the
decision register (`docs/decision-register.md`).

| ADR | Title |
|---|---|
| 0001 | Web framework & hosting (SvelteKit, self-hosted, no React) |
| 0002 | Database & ORM (local Postgres + Prisma, app-level auth) |
| 0003 | Authentication (Better Auth + Prisma adapter) |
| 0004 | File storage (Cloudflare R2, presigned private URLs) |
| 0005 | AI service boundary (7 isolated services, versioned prompts) |
| 0006 | Data-driven content model (careers as data) |
| 0007 | Venture readiness without venture UI |
| 0008 | Analytics, errors, email (PostHog, Sentry, Resend; no billing in MVP) |
