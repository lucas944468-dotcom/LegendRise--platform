# ADR-008: Analytics, errors, email

- Status: Accepted (derives from PRD §14, §17)
- Context: The §17 event taxonomy (16 events, 8 metrics) and error monitoring must
  exist before any external testing; auth needs transactional email.

## Decision

- **Analytics:** PostHog (free tier), instrumented per the §17 taxonomy in Phase 9.
- **Errors:** Sentry before any external testing.
- **Email:** Resend for verification/reset/notifications (already wired in
  `src/lib/auth.ts` with dev logging fallback).
- **Payments:** explicitly OUT of the MVP — Paystack only after commercial
  validation (PRD §23).

## Consequences

- Free-tier usage monitored pre-launch (decision register risk row).
- No billing code exists in the MVP; adding it early is a scope violation.
