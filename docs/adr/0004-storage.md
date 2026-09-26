# ADR-004: File storage

- Status: Accepted (founder decision, 2026-09-26)
- Context: Lesson media, downloadable resources, evidence attachments need a home. No Supabase Storage.

## Decision

**Cloudflare R2 (S3-compatible) via aws-sdk** (`src/lib/r2.ts`), server-side only.

- Bucket layout: `lessons/*` (public), `resources/*` (public),
  `evidence/{userId}/*` (PRIVATE).
- Public media served via `R2_PUBLIC_URL`; private evidence ONLY via short-lived
  presigned URLs (never public links) — PRD §12/§16.
- Browser uploads go direct-to-R2 via presigned PUT URLs (no file bytes via server).

## Consequences

- Founder provisions: free Cloudflare account → bucket → API token (Read & Write).
- 10 GB free tier + zero egress fees suit media-heavy lessons.
