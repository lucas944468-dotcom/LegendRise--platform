# LegendRise™ — Phased Implementation Plan

*Derived from: LegendRise™ PRD v2.0 (Career & Venture Progression Platform), September 2026.*
*Items marked **[Implementation choice]** are concrete technical decisions the PRD leaves open.*
*Stack revision (founder decision): **local PostgreSQL + Prisma, Better Auth, Cloudflare R2, local hosting. No Supabase. No Vercel.***

## Guiding non-negotiables (apply to every phase)

1. The product is the **progression engine**, not a course library (PRD §5).
2. Every learning item connects to a **milestone + practical outcome**.
3. Assessment uses **explicit rubrics + sufficient evidence**; AI never independently marks required milestones complete (§11.2).
4. AI = **separate testable services**, never one giant prompt (§11).
5. **No invented claims** — no guaranteed jobs, salaries, funding, or market stats (§2, §16).
6. **MVP discipline:** one career pathway first; Venture = architecture only (§3, §6).
7. Payments only **after** value is proven (§23).
8. **Authorization rule (no RLS):** without Supabase Row-Level Security, **every server query MUST be scoped to the logged-in user** (`where: { userId: session.user.id }` or equivalent). No exceptions — this is checked in code review for every backend task.

## Phase overview

| # | Phase | PRD anchor |
|---|-------|-----------|
| 0 | MVP freeze & foundations | §6.1, §20 steps 1–2, §25.1 |
| 1 | Design system & UX *(ON HOLD — starts on founder signal)* | §13 |
| 2 | Architectural decisions | §14 (adapted: no Supabase/Vercel) |
| 3 | Data model & backend (Prisma + local Postgres) | §15 |
| 4 | Core journey slice (auth → roadmap → dashboard) | §7, FR-001–005, FR-013 |
| 5 | Learning & practice | §7, §10, FR-006–008 |
| 6 | AI intelligence systems | §11 |
| 7 | Assessment, evidence & portfolio | §12, FR-010–014 |
| 8 | Admin CMS + content factory | §18, §19 |
| 9 | Analytics, QA & validation | §17, §21 |
| 10 | Hardening & local go-live gate | §22 (adapted), §16 |
| 11 | Post-MVP roadmap (incl. public hosting) | §24 |

---

## Phase 0 — MVP freeze & foundations

**Goal:** lock scope so later phases can't sprawl (§25 risk #1).

- **Decide and freeze:** the ONE MVP career, target level, success metric, and first 10 learning/practice items (§20 steps 1–2; §6.1 entry gates).
- Repo setup: GitHub connected (`main`, `.gitignore`). `README.md` (purpose/scope/stack/rules per §20 step 1), `docs/decision-register.md` (§21.2, §25), PRD + this plan stored in-repo.
- Environments: local dev (this laptop) → production-like local run (`next build && next start`). Public staging deferred with hosting (Phase 11).
- **[Implementation choice]** Tooling: VS Code + GitHub + Node 22 + local PostgreSQL + Prisma + Better Auth + Cloudflare R2. (Playbook proposed Replit/Supabase/Vercel (§14) — replaced per founder decision; recorded in decision register.)
- Local Postgres setup (founder-assisted): install PostgreSQL 16/17 (EDB installer, includes pgAdmin) → create `legendrise` database + app role → connection string into `.env` (never committed). Backup routine: scheduled `pg_dump` before anything matters.
- Secret handling rule: API keys server-side only, `.env` never committed (§11.2).
- **Exit:** approved career definition + content inventory + running `npm run dev` + `prisma db push` green (§6.1 entry gates, adapted).

## Phase 1 — Design system & UX *(ON HOLD)*

> Starts only on founder signal. No design tokens, components, or screens until then.

**Goal:** premium, calm, modern education/productivity feel (§13): clean cards, clear progress states, strong typography, accessible contrast, no gradient clutter.

- Tokens: brand palette (contrast-checked), type scale, spacing, radius, elevation.
- Components: buttons, cards, milestone states (**completed / in-progress / locked / needs-attention / evidence** — visually distinct, §13.2), progress bars, rubric tables, chat bubbles, evidence tiles, empty/error states.
- Accessibility: keyboard/touch targets, labels, focus states, meaningful errors (§13.2).
- Responsive rule: core journey works on **desktop + mobile web** before any native app (§13.2).
- Screen specs for all 10 MVP screens (§20 step 3): Landing, Onboarding, Dashboard, Career Path, Lesson, Practice, Simulation, Assessment, Portfolio, AI Coach.
- Dashboard contract (§13.1): current path, level/progress, **one recommended next action**, continue-learning, upcoming assessment, coach entry, evidence snapshot.
- **Exit:** clickable prototype covering the 10-step Definition-of-Done flow (§26) tested with 5–10 users (§21).

## Phase 2 — Architectural decisions (ADRs)

**Goal:** record every load-bearing choice before code (§14 adapted + §25).

- **ADR-1 Web framework / hosting** — **[Implementation choice]** Next.js (App Router), **self-hosted on local device**: `next dev` during build, `next build && next start` for prod-like runs. No Vercel. API routes are the **server-only AI/storage gateway** (keys never reach the browser, §11.2). LAN testing via bound hostname; public URL deferred to Phase 11 (VPS).
- **ADR-2 Database + ORM** — **[Implementation choice]** Local PostgreSQL 16/17 + **Prisma** (schema + versioned migrations in `/prisma`). No Supabase. Prisma Client is the only DB access path; **no RLS — app-level scoping enforced per non-negotiable #8**, reviewed per task.
- **ADR-3 Auth** — **[Implementation choice]** **Better Auth** with Prisma adapter: email/password + email verification (via Resend). Sessions checked server-side on every protected route/API. Social logins deferred.
- **ADR-4 Storage** — **[Implementation choice]** **Cloudflare R2** (S3-compatible SDK): public bucket/prefix for lesson media; **presigned URLs** for private evidence uploads/downloads. No Supabase Storage.
- **ADR-5 AI boundary:** 7 isolated services with versioned prompts + JSON schemas (§11: career assessor, roadmap engine, tutor, simulation agent, assessment evaluator, next-step recommender, venture coach) + the 8-step request lifecycle (§11.1); deterministic rules wrap high-stakes decisions (§5). All AI calls server-side via ADR-1 API routes.
- **ADR-6 Content model:** data-driven career templates — new careers via config/content rows, never rewrites (§14.1 scalability).
- **ADR-7 Venture readiness:** `VentureProject`/`VentureEvidence` models in Prisma + nav stubs behind a feature flag; no venture UI in MVP (§3.2, FR-018).
- **ADR-8 Analytics/error/email:** event taxonomy (§17) via PostHog (free tier), Sentry before any external testing; Resend for verification/reset/notifications. Payments (Paystack) explicitly deferred (§23).
- **Exit:** ADRs merged; repo layout (`/app`, `/components`, `/lib/ai/*` per service, `/lib/db.ts`, `/lib/r2.ts`, `/prisma`, `/content`) agreed.

## Phase 3 — Data model & backend

**Goal:** implement §15 exactly in Prisma; extra models documented as extensions.

- Prisma models for: `User` (Better Auth–owned) + `Profile, CareerPath, Milestone, Lesson, Simulation, Assessment, Submission, Evidence, Progress, VentureProject, VentureEvidence, AiConversation, Subscription` with the PRD's key fields; relations + indexes on `(userId, …)` for all user-owned tables.
- Migrations versioned (`prisma migrate dev`); seed script loads one career template (Appendix A fields) with ordered milestones (Appendices A–C drive the seed shape).
- Authorization helpers: `requireSession()` + per-model `whereUser()` scoping utilities; **negative tests** (user A cannot read/patch user B's submissions/evidence/conversations) — these replace Supabase RLS tests.
- Storage wiring: R2 client, bucket layout (`lessons/`, `resources/`, `evidence/{userId}/`), presigned upload/download helpers.
- **Exit:** seed loads; negative auth tests pass; media upload→serve round-trip works.

## Phase 4 — Core journey vertical slice (FR-001–005, FR-013; CAR-01–03, CAR-10)

Better Auth sign-up/login + verification + password reset (FR-001) → onboarding (goal, level, experience, preferences, availability, FR-002) → career selection → **baseline diagnostic** (stored responses, uncertainty flagged, CAR-02) → **roadmap engine** (ordered milestones from template + profile, CAR-03) → dashboard with **one next action** (CAR-10). All server queries user-scoped (non-negotiable #8).

- **Exit:** a new user reaches their roadmap unaided in usability testing (§21).

## Phase 5 — Learning & practice (FR-006–008; CAR-04–05)

- Lesson player: text, narrated media (slides + voice-over, no face-camera per §19 — media served from R2), screen demos, resources download/open, notes, completion (CAR-04).
- Resource system (§10): guides, templates, checklists, worked examples, case studies, worksheets, download packs, tools — each with required metadata + version/owner/review-date; workflow Create → Review → Tag → Publish → Link → Track → Update/archive (§10.1).
- Practice workspace: brief, work area, hints, submission (CAR-05).
- **Exit:** lesson → practice → submission works end-to-end with events firing (`lesson_*`, `practice_*`, §17).

## Phase 6 — AI intelligence systems (§11)

Build in this order: **tutor → assessment evaluator → simulation agent → next-step recommender → career assessor/roadmap** (baseline/roadmap can start rules-based, AI-enhanced after).

- One module per service in `/lib/ai/*` with versioned prompts + Zod/JSON validation; all invoked through server API routes (ADR-1/ADR-5).
- Tutor grounded **only** in current lesson + approved curriculum (§11.2); explicit fallback/uncertainty responses; report-incorrect-output control (§16).
- Simulation: ONE high-quality workplace scenario first (§6) built to Appendix B spec (roles, hidden state, completion condition, rubric-linked feedback).
- Evaluator: rubric-authoritative scoring + evidence + improvement actions (Appendix C).
- Recommender: evidence-based next-milestone rule (§11 table).
- Version every prompt; eval-test each service; audit important decisions (§11.1–11.2).
- **Exit:** rubric-linked feedback on real submissions; simulation rated useful/realistic by users (§21).

## Phase 7 — Assessment, evidence & portfolio (FR-010–014; CAR-06–09; §12)

- Task brief → criteria → rubric levels → submission → criterion-level score → feedback → configured retry/versioning → evidence save rule (Appendix C).
- Capability states enforced in logic: Not assessed / Developing / Demonstrated / Needs review (§12.1) — progression never inferred without evidence.
- Portfolio: simple public/private evidence page — evidence record first, visuals second (§12.2); private files via presigned R2 URLs, never public links.
- **Exit:** improved resubmission after feedback (assessment-improvement metric, §17); evidence links back to source work.

## Phase 8 — Admin CMS + content factory (§18, §19)

- Admin CRUD + publish/archive + versioning for: career paths, milestones, lessons, resources, simulations, assessments, rubrics (criteria/levels/version/effective date), users, AI config (prompts + grounding sources + history), analytics views (§18 table). Admin routes role-gated (Better Auth admin flag).
- Governance: every item has owner + review status; retired content traceable; external facts carry source records; AI drafts need human review (§18.1).
- Produce the MVP content: 5–10 lessons to the §19.1 spec (objective, 5-min script, slide sequence, demo plan, worked example, practice task, scenario, 5-question check, rubric, worksheet, common mistakes, next milestone) — **content tied to milestones**, never a library dump (§5).
- **Exit:** first career path fully traversable with real content (§22 content gate).

## Phase 9 — Analytics, QA & validation (§17, §21)

- Instrument all 16 events (`signup` → `next_action_clicked`) and 8 metrics (activation, completions, improvement, click-through, WAU, path completion) via PostHog.
- Validation battery: 10–20 problem interviews; 5–10 observed onboarding usability tests; learning-value before/after comparison; simulation realism check; retention observation; **real-payment** test, not stated intent (§21 + §21.1 protocol). External testers need local-network access or Phase-11 hosting.
- Decision register updated per finding; **fix the weakest point before adding features** (§20 step 16).
- **Exit:** §6.1 exit gates all green (full flow observed, rubric feedback verified, evidence saves, next action visible, real users tested).

## Phase 10 — Hardening & local go-live gate (§22 adapted, §16)

Walk the §22 gate item by item (hosting items adapted to local): product (no manual intervention), AI (tested prompts + fallbacks), content (complete MVP path), assessment (consistent feedback), data (protected + **pg_dump backup routine verified**), analytics (events live), support (report problem/incorrect AI), payments (**off** until commercial validation), mobile (deferred), legal (privacy policy, terms, consent reviewed pre-scale).

- Privacy (§16.1): consent, access control (app-level scoping audited), conversation privacy, audit, retention/deletion rules, reporting — all acceptance-tested.
- `next build` clean; prod-like local run tested on desktop + mobile browsers (§20 steps 17, 20, adapted).
- **Exit:** local release verified; public/controlled beta waits on Phase-11 hosting.

## Phase 11 — Post-MVP (§24, in order)

1. **Public hosting** (VPS + Postgres + R2 stay; `next start` standalone output) → 2. multiple career paths + richer portfolio → 3. adaptive progression graph → 4. **Venture Lab** (problem → customer validation → market → feasibility → model → financial logic → plan → pilot, §8 + §8.1 evidence rules) → 5. employer/institutional pathways → 6. African expansion. Native mobile (Expo, same backend) after web stabilises; Paystack after payment validation (§20 steps 18–19).

## Key risks & controls (from §25, watched every phase + stack additions)

Feature sprawl → freeze MVP · unvalidated career → validate before content build · hallucination → grounding + uncertainty + tests · weak rubric → versioned rubrics · content overload → tie content to tasks · low retention → fix weakest point · premature payments → no billing code in MVP · privacy failure → **app-level scoping tests (no RLS safety net)** · vendor costs → R2/PostHog free tiers monitored · **local data loss → pg_dump routine** · no public URL → external testing blocked until Phase 11.

## MVP Definition of Done (from §26)

A new user can: create an account → choose a career → complete the baseline → receive a roadmap → complete a lesson → complete a practical task → use an AI simulation → receive rubric-based evaluation → save evidence → see a clear next action. If any of the ten fails reliably, stay in build/test — no new careers, social features, marketplace, or venture ecosystem yet.

## Founder-action checklist (things only you can do manually)

- [ ] Install PostgreSQL 16/17 (EDB installer) → create database + user → paste connection string for `.env`
- [ ] Create free Cloudflare account → R2 bucket + API token (Object Read & Write)
- [ ] Create free Resend account → API key (auth emails)
- [ ] Freeze the ONE MVP career (Phase 0 decision)
- [ ] Say the word to start Phase 1 (design)
