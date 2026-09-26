import { svelteKitHandler } from "better-auth/svelte-kit";
import { building } from "$app/environment";
import { auth } from "$lib/auth";
import type { Handle } from "@sveltejs/kit";

// Better Auth request handler for all /api/auth/* routes (ADR-3).
export const handle: Handle = async ({ event, resolve }) => {
  return svelteKitHandler({ event, resolve, auth, building });
};
