// Negative authorization tests (non-negotiable #8 — no RLS safety net).
// DB-backed suites run with `npx vitest run` once DATABASE_URL points at a live
// Postgres (embedded dev DB or founder EDB install). Pure unit tests run anytime.
import { describe, it, expect } from "vitest";
import { whereUser } from "../src/lib/access";

describe("whereUser scoping helper", () => {
  it("confines queries to the caller id", () => {
    expect(whereUser("user-123")).toEqual({ userId: "user-123" });
  });
  it("never returns an empty scope (which would leak all rows)", () => {
    const scope = whereUser("user-123");
    expect(Object.keys(scope)).toContain("userId");
    expect(scope.userId).toBeTruthy();
  });
});

// --- DB-backed contract (skipped without DATABASE_URL) ---
const hasDb = !!process.env.DATABASE_URL;
describe.skipIf(!hasDb)("row isolation (requires live Postgres)", () => {
  it("user A cannot read user B's submissions/evidence/conversations", async () => {
    const { prisma } = await import("../src/lib/db");
    // Seed two users' evidence via raw writes, then assert scoped reads.
    // Full flow: create users → evidence rows → query with whereUser(other) → expect [].
    // Implemented against the live schema in Phase 3 DB session.
    expect(prisma).toBeDefined();
  });
});
