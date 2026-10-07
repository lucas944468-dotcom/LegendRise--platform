import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { env } from "$env/dynamic/private";
import { prisma } from "./db";
import { sendMail } from "./email";

function createAuth() {
  if (!env.BETTER_AUTH_SECRET) {
    throw new Error("BETTER_AUTH_SECRET is required for authentication at runtime.");
  }
  if (!env.BETTER_AUTH_URL) {
    throw new Error("BETTER_AUTH_URL is required for authentication at runtime.");
  }

  return betterAuth({
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
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

let auth: ReturnType<typeof createAuth> | undefined;

export function getAuth() {
  return auth ??= createAuth();
}
