import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Handle } from "@sveltejs/kit";

const mocks = vi.hoisted(() => ({
  environment: { building: true },
  getAuth: vi.fn(() => ({ handler: vi.fn(), api: {} })),
  svelteKitHandler: vi.fn(),
}));

vi.mock("$app/environment", () => mocks.environment);
vi.mock("$lib/auth", () => ({ getAuth: mocks.getAuth }));
vi.mock("better-auth/svelte-kit", () => ({ svelteKitHandler: mocks.svelteKitHandler }));

describe("authentication request hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.environment.building = true;
  });

  it("resolves build-time requests without initializing authentication", async () => {
    const { handle } = await import("../src/hooks.server");
    const response = new Response();
    const event = {} as Parameters<Handle>[0]["event"];
    const resolve = vi.fn(async () => response);
    expect(await handle({ event, resolve })).toBe(response);
    expect(resolve).toHaveBeenCalledWith(event);
    expect(mocks.getAuth).not.toHaveBeenCalled();
    expect(mocks.svelteKitHandler).not.toHaveBeenCalled();
  });

  it("initializes authentication for runtime requests", async () => {
    mocks.environment.building = false;
    const { handle } = await import("../src/hooks.server");
    const response = new Response();
    const event = {} as Parameters<Handle>[0]["event"];
    const resolve = vi.fn(async () => response);
    mocks.svelteKitHandler.mockResolvedValue(response);
    expect(await handle({ event, resolve })).toBe(response);
    expect(mocks.getAuth).toHaveBeenCalledTimes(1);
    expect(mocks.svelteKitHandler).toHaveBeenCalledWith({
      event,
      resolve,
      auth: mocks.getAuth.mock.results[0].value,
      building: false,
    });
  });
});
