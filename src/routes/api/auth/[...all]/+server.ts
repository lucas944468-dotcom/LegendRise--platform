import { auth } from "$lib/auth";

// Better Auth endpoint (all /api/auth/* routes) — server-only (ADR-1).
export async function GET({ request }: { request: Request }) {
  return auth.handler(request);
}

export async function POST({ request }: { request: Request }) {
  return auth.handler(request);
}
