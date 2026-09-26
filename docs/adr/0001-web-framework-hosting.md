# ADR-001: Web framework & hosting

- Status: Accepted (founder decision, 2026-09-26)
- Context: PRD §14 proposed Replit + Vercel. Founder requires local-first, zero-subscription, no React.

## Decision

**SvelteKit (Svelte 5, TypeScript) with adapter-node, self-hosted on the founder's device.**
`vite dev` during build; `vite build` + `node build` for prod-like runs.
Server routes (`+server.ts`) and server `load` functions are the server-only
AI/storage gateway — keys never reach the browser (PRD §11.2).
LAN testing via bound host; public URL deferred to Phase 11 (VPS).

## Consequences

- No React anywhere in the web stack; post-MVP mobile needs a non-React choice (Expo is React-based — TBD).
- Production runs need real env vars (`.env` is dev-only; `node build` does not load it).
- Smaller bundles than React alternatives — better for mobile networks.
