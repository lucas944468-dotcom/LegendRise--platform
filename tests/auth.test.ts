import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  env: {} as Record<string, string | undefined>,
  betterAuth: vi.fn(() => ({ handler: vi.fn(), api: { getSession: vi.fn() } })),
  prismaAdapter: vi.fn(),
}));

vi.mock("$env/dynamic/private", () => ({ env: mocks.env }));
vi.mock("better-auth", () => ({ betterAuth: mocks.betterAuth }));
vi.mock("better-auth/adapters/prisma", () => ({ prismaAdapter: mocks.prismaAdapter }));
vi.mock("../src/lib/db", () => ({ prisma: {} }));
vi.mock("../src/lib/email", () => ({ sendMail: vi.fn() }));

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  delete mocks.env.BETTER_AUTH_SECRET;
  delete mocks.env.BETTER_AUTH_URL;
});

describe("runtime authentication initialization", () => {
  it("imports without configuration or initializing Better Auth", async () => {
    const { getAuth } = await import("../src/lib/auth");
    expect(getAuth).toBeTypeOf("function");
    expect(mocks.betterAuth).not.toHaveBeenCalled();
    expect(mocks.prismaAdapter).not.toHaveBeenCalled();
  });

  it("rejects a missing secret on first use", async () => {
    const { getAuth } = await import("../src/lib/auth");
    expect(() => getAuth()).toThrow("BETTER_AUTH_SECRET");
    expect(mocks.betterAuth).not.toHaveBeenCalled();
  });

  it.each(["", "short", " ".repeat(32)])("rejects an unusable secret", async (secret) => {
    mocks.env.BETTER_AUTH_SECRET = secret;
    const { getAuth } = await import("../src/lib/auth");
    expect(() => getAuth()).toThrow("BETTER_AUTH_SECRET");
    expect(mocks.betterAuth).not.toHaveBeenCalled();
  });

  it("rejects a missing base URL on first use", async () => {
    mocks.env.BETTER_AUTH_SECRET = "test-only-not-a-real-credential".repeat(2);
    const { getAuth } = await import("../src/lib/auth");
    expect(() => getAuth()).toThrow("BETTER_AUTH_URL");
    expect(mocks.betterAuth).not.toHaveBeenCalled();
  });

  it("reads runtime configuration after import and reuses the instance", async () => {
    const { getAuth } = await import("../src/lib/auth");
    mocks.env.BETTER_AUTH_SECRET = "test-only-not-a-real-credential".repeat(2);
    mocks.env.BETTER_AUTH_URL = "https://example.test";

    const instance = getAuth();
    expect(getAuth()).toBe(instance);
    expect(mocks.betterAuth).toHaveBeenCalledTimes(1);
    expect(mocks.betterAuth).toHaveBeenCalledWith(expect.objectContaining({
      secret: mocks.env.BETTER_AUTH_SECRET,
      baseURL: mocks.env.BETTER_AUTH_URL,
      emailAndPassword: expect.objectContaining({ requireEmailVerification: true }),
      emailVerification: expect.objectContaining({ sendOnSignUp: true }),
    }));
  });
});
