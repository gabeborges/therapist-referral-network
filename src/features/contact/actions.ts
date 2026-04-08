"use server";

import { auth } from "@/lib/auth";
import { resend } from "@/lib/email/resend";
import { contactSchema, type ContactFormData } from "@/lib/validations/contact";

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "noreply@example.com";
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL;

export async function submitContactForm(
  data: ContactFormData,
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Invalid form data" };
  }

  if (!SUPPORT_EMAIL) {
    console.error("SUPPORT_EMAIL environment variable is not configured");
    return { success: false, error: "Contact form is not configured. Please try again later." };
  }

  const { subject, message } = parsed.data;
  const { id: userId, name, email } = session.user;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: SUPPORT_EMAIL,
      replyTo: email ?? undefined,
      subject: `[Contact] ${subject}`,
      text: [
        `Subject: ${subject}`,
        "",
        "Message:",
        message,
        "",
        "---",
        `From: ${name ?? "Unknown"} (${email ?? "no email"})`,
        `User ID: ${userId}`,
      ].join("\n"),
    });
  } catch {
    return { success: false, error: "Failed to send message. Please try again." };
  }

  return { success: true };
}
