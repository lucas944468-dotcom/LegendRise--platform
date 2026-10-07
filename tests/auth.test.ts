import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  env: { BETTER_AUTH_SECRET: "", BETTER_AUTH_URL: "" },
  betterAuth: vi.fn(() => ({ handler: vi.fn(), api: {} })),
}));

vi.mock("$env/dynamic/private", () => ({ env: mocks.env }));
vi.mock("better-auth", () => ({ betterAuth: mocks.betterAuth }));
vi.mock("better-auth/adapters/prisma", () => ({ prismaAdapter: vi.fn() }));
vi.mock("../src/lib/db", () => ({ prisma: {} }));
vi.mock("../src/lib/email", () => ({ sendMail: vi.fn() }));

describe("runtime authentication initialization", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    mocks.env.BETTER_AUTH_SECRET = "";
    mocks.env.BETTER_AUTH_URL = "";
  });

  it("imports without initializing authentication or requiring secrets", async () => {
    await import("../src/lib/auth");
    expect(mocks.betterAuth).not.toHaveBeenCalled();
  });

  it("rejects authentication requests without a runtime secret", async () => {
    const { getAuth } = await import("../src/lib/auth");
    expect(() => getAuth()).toThrow("BETTER_AUTH_SECRET is required");
    expect(mocks.betterAuth).not.toHaveBeenCalled();
  });

  it("rejects authentication requests without a runtime base URL", async () => {
    mocks.env.BETTER_AUTH_SECRET = crypto.randomUUID();
    const { getAuth } = await import("../src/lib/auth");
    expect(() => getAuth()).toThrow("BETTER_AUTH_URL is required");
    expect(mocks.betterAuth).not.toHaveBeenCalled();
  });

  it("uses runtime configuration and reuses the authentication instance", async () => {
    const { getAuth } = await import("../src/lib/auth");
    mocks.env.BETTER_AUTH_SECRET = crypto.randomUUID();
    mocks.env.BETTER_AUTH_URL = "https://example.com";
    const auth = getAuth();
    expect(getAuth()).toBe(auth);
    expect(mocks.betterAuth).toHaveBeenCalledTimes(1);
    expect(mocks.betterAuth).toHaveBeenCalledWith(expect.objectContaining({
      secret: mocks.env.BETTER_AUTH_SECRET,
      baseURL: mocks.env.BETTER_AUTH_URL,
    }));
  });
});
