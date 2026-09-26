import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

// Better Auth request handler (all /api/auth/* routes).
export const { GET, POST } = toNextJsHandler(auth);
