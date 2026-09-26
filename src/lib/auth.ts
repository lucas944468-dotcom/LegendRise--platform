import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { BETTER_AUTH_SECRET, BETTER_AUTH_URL } from "$env/static/private";
import { prisma } from "./db";

// Better Auth server instance (ADR-3). Secrets come from $env/static/private
// so they are statically available at build AND runtime (never shipped to client).
export const auth = betterAuth({
  secret: BETTER_AUTH_SECRET,
  baseURL: BETTER_AUTH_URL,
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      if (!process.env.RESEND_API_KEY) {
        console.log(`[dev] Verify ${user.email}: ${url}`);
        return;
      }
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.EMAIL_FROM ?? "LegendRise <noreply@example.com>",
        to: user.email,
        subject: "Verify your LegendRise account",
        text: `Welcome to LegendRise! Verify your account: ${url}`,
      });
    },
  },
});
