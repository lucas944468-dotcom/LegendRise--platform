import { env } from "$env/dynamic/private";

// Central mail sender (Resend). Server-only — never import from components.
// - Uses RESEND_API_KEY from the environment (never hard-coded, never committed).
// - Without a key: logs the message in development and returns { dev: true }
//   so signup/verification flows stay testable with zero setup.
// - Default sender is Resend's test identity. Resend delivers test mail ONLY
//   to the address that owns the API key; production needs a verified domain
//   (Resend dashboard → Domains) + EMAIL_FROM set to it.
export interface MailInput {
  to: string;
  subject: string;
  text: string;
}

const TEST_FROM = "LegendRise <onboarding@resend.dev>";

export function emailFrom(): string {
  return env.EMAIL_FROM ?? TEST_FROM;
}

export function resendConfigured(): boolean {
  return !!env.RESEND_API_KEY;
}

export async function sendMail({ to, subject, text }: MailInput): Promise<{ id?: string; dev?: true }> {
  if (!env.RESEND_API_KEY) {
    console.log(`[dev mail] To: ${to}\nSubject: ${subject}\n${text}`);
    return { dev: true };
  }
  const { Resend } = await import("resend");
  const resend = new Resend(env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from: emailFrom(),
    to,
    subject,
    text,
  });
  if (error) {
    console.error("[resend] send failed:", error);
    throw new Error(`Email delivery failed: ${error.message}`);
  }
  console.log(`[resend] sent ${data?.id} → ${to}`);
  return { id: data?.id };
}
