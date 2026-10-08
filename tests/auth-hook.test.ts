import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Handle } from "@sveltejs/kit";

const mocks = vi.hoisted(() => ({
  environment: { building: false },
  getAuth: vi.fn(() => ({})),
  svelteKitHandler: vi.fn(),
}));

vi.mock("$app/environment", () => mocks.environment);
vi.mock("$lib/auth", () => ({ getAuth: mocks.getAuth }));
vi.mock("better-auth/svelte-kit", () => ({ svelteKitHandler: mocks.svelteKitHandler }));

beforeEach(() => {
  vi.clearAllMocks();
  mocks.environment.building = false;
});

describe("authentication hook", () => {
  it("resolves build-time requests without initializing authentication", async () => {
    mocks.environment.building = true;
    const { handle } = await import("../src/hooks.server");
    const event = {} as Parameters<Handle>[0]["event"];
    const response = new Response("build response");
    const resolve = vi.fn(async () => response);

    expect(await handle({ event, resolve })).toBe(response);
    expect(resolve).toHaveBeenCalledWith(event);
    expect(mocks.getAuth).not.toHaveBeenCalled();
    expect(mocks.svelteKitHandler).not.toHaveBeenCalled();
  });

  it("uses the validated auth instance for runtime requests", async () => {
    const { handle } = await import("../src/hooks.server");
    const event = {} as Parameters<Handle>[0]["event"];
    const resolve = vi.fn(async () => new Response());
    const response = new Response("runtime response");
    mocks.svelteKitHandler.mockResolvedValue(response);

    expect(await handle({ event, resolve })).toBe(response);
    expect(mocks.getAuth).toHaveBeenCalledTimes(1);
    expect(mocks.svelteKitHandler).toHaveBeenCalledWith({
      event, resolve, auth: mocks.getAuth.mock.results[0].value, building: false,
    });
  });
});
