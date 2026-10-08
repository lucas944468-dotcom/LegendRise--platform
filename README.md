# LegendRise--platform
LegendRise™ is a capability development and venture progression platform that connects assessment, learning, practice, simulation, evidence and progression.

## Stack (founder-decided; see IMPLEMENTATION_PLAN.md Phase 2)
- **Web:** SvelteKit (Svelte 5, TypeScript) + adapter-node, self-hosted locally (`vite dev` / `node build`) — no React, no Vercel
- **Database:** local PostgreSQL + Prisma ORM/migrations — no Supabase
- **Auth:** Better Auth (Prisma adapter), email/password + verification
- **Storage:** Cloudflare R2 (S3-compatible) — public `lessons/` + `resources/`, private `evidence/{userId}/` via presigned URLs
- **Email:** Resend (auth verification/reset)

## Quickstart (after founder manual setup)
1. Install PostgreSQL 16/17 → create `legendrise` DB → copy `.env.example` to `.env` and fill values (pick **UTF8** encoding at install; avoids WIN1252 character errors)
2. `npm install`
3. `npm run prisma:migrate` (applies migrations) — seed runs automatically
4. `npm run dev` → http://localhost:5173

## Deploy (Netlify)
- `netlify.toml` pins build `npm run build`, publish `build`, Node 22
- Set environment variables in the Netlify dashboard under Site configuration →
  Environment variables. The comments in `netlify.toml` do not assign values, and
  variable names in a deploy log do not confirm usable values.
- Set `BETTER_AUTH_SECRET` to a strong, randomly generated secret of at least 32
  characters. Generate it locally with `openssl rand -base64 32` and enter it
  directly into Netlify; never commit it or share it in logs or support messages.
  Keep it stable across deploys rather than generating a new secret during builds.
- Set `BETTER_AUTH_URL` to the site's public HTTPS origin. Both auth variables
  must be available to the Functions scope in the deployed context. Authentication
  initializes on the first runtime request using `$env/dynamic/private`, not
  during build-time module analysis. Missing values still fail closed at runtime.
- Set `DATABASE_URL` for the existing Prisma database connection, including the
  Functions scope for server-side queries. `DIRECT_URL` is not referenced by the
  current Prisma schema and does not resolve the authentication-secret error.
- After saving the variables, trigger a new deploy. If authentication reports a
  configuration error, check for empty or default values and deploy-context
  overrides on `BETTER_AUTH_SECRET`, and confirm that its Functions scope is enabled.
- Optional until used: `RESEND_API_KEY`, `EMAIL_FROM`, `R2_*`, `OPENAI_API_KEY`

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
- `docs/adr/` — architecture decision records (Phase 2)
