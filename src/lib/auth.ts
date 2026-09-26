import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";

// Better Auth server instance (ADR-3). Email verification + password reset
// mail is sent via Resend when RESEND_API_KEY is set, else logged (dev).
export const auth = betterAuth({
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
