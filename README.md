# LegendRise--platform
LegendRise™ is a capability development and venture progression platform that connects assessment, learning, practice, simulation, evidence and progression.

## Stack (founder-decided; see IMPLEMENTATION_PLAN.md Phase 2)
- **Web:** SvelteKit (Svelte 5, TypeScript) + adapter-node, self-hosted locally (`vite dev` / `node build`) — no React, no Vercel
- **Database:** local PostgreSQL + Prisma ORM/migrations — no Supabase
- **Auth:** Better Auth (Prisma adapter), email/password + verification
- **Storage:** Cloudflare R2 (S3-compatible) — public `lessons/` + `resources/`, private `evidence/{userId}/` via presigned URLs
- **Email:** Resend (auth verification/reset)

## Quickstart (after founder manual setup)
1. Install PostgreSQL 16/17 → create `legendrise` DB → copy `.env.example` to `.env` and fill values
2. `npm install`
3. `npm run prisma:migrate` (applies migrations) — seed runs automatically
4. `npm run dev` → http://localhost:5173

## Rules (PRD non-negotiables)
- The product is the progression engine, not the course library
- Every server query on user-owned data is scoped by session (`lib/access.ts`) — no RLS safety net
- AI = separate testable services in `lib/ai/*` (Phase 6); keys server-side only
- No invented career/salary/funding claims anywhere
- `.env` is never committed

## Docs
- `IMPLEMENTATION_PLAN.md` — phased build plan
- `LegendRise™ PRD.docx` — product requirements (source of truth)
- `PRD.md` — same requirements as markdown (renders on GitHub, with figures)
- `docs/decision-register.md` — open decisions & validation status
