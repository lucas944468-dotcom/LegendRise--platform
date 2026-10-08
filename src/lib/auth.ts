import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { env } from "$env/dynamic/private";
import { prisma } from "./db";
import { sendMail } from "./email";

function createAuth() {
  const secret = env.BETTER_AUTH_SECRET;
  const baseURL = env.BETTER_AUTH_URL;

  if (!secret || secret.trim().length < 32) {
    throw new Error("BETTER_AUTH_SECRET must be configured with at least 32 characters in the runtime environment.");
  }
  if (!baseURL?.trim()) {
    throw new Error("BETTER_AUTH_URL must be configured in the runtime environment.");
  }

  return betterAuth({
    secret,
    baseURL,
    database: prismaAdapter(prisma, { provider: "postgresql" }),
    user: {
      // Exposes the Prisma isAdmin flag on session.user (typed).
      additionalFields: {
        isAdmin: { type: "boolean", required: false, defaultValue: false, input: false },
      },
    },
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      // Password reset via the same Resend sender. Better Auth supplies the
      // one-time reset `url`; the /reset-password page completes the flow.
      sendResetPassword: async ({ user, url }) => {
        await sendMail({
          to: user.email,
          subject: "Reset your LegendRise password",
          text: `Reset your LegendRise password with this one-time link (expires in 1 hour):\n\n${url}\n\nIf you did not request this, ignore this email.`,
        });
      },
    },
    emailVerification: {
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      // Better Auth generates the `url`; we only deliver it. Never disabled.
      sendVerificationEmail: async ({ user, url }) => {
        await sendMail({
          to: user.email,
          subject: "Verify your LegendRise account",
          text: `Welcome to LegendRise! Verify your account with this link:\n\n${url}`,
        });
      },
    },
  });
}

let authInstance: ReturnType<typeof createAuth> | undefined;

export function getAuth() {
  return authInstance ??= createAuth();
}
