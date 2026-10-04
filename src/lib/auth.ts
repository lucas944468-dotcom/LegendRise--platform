import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { BETTER_AUTH_SECRET, BETTER_AUTH_URL } from "$env/static/private";
import { prisma } from "./db";
import { sendMail } from "./email";

// Better Auth server instance (ADR-3). Secrets come from $env/static/private
// so they are statically available at build AND runtime (never shipped to client).
export const auth = betterAuth({
  secret: BETTER_AUTH_SECRET,
  baseURL: BETTER_AUTH_URL,
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
