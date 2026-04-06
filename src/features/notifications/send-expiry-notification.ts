import type { PrismaClient } from "@/generated/prisma/client";
import type { ReferralPostModel } from "@/generated/prisma/models/ReferralPost";
import { resend } from "@/lib/email/resend";
import {
  ReferralExpiredEmail,
  referralExpiredSubject,
} from "@/lib/email/templates/referral-expired";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "noreply@example.com";

/**
 * Sends an expiry notification email to the referral author informing them
 * that their referral has expired and no more batches will be sent.
 */
export async function sendExpiryNotification(
  referralPost: ReferralPostModel,
  prisma: PrismaClient,
): Promise<void> {
  const author = await prisma.therapistProfile.findUniqueOrThrow({
    where: { id: referralPost.authorId },
    include: { user: { select: { email: true, name: true } } },
  });

  const therapistsNotified = await prisma.referralNotification.count({
    where: { referralPostId: referralPost.id },
  });

  const referrerName = author.user.name ?? `${author.firstName} ${author.lastName}`;

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: author.user.email,
    subject: referralExpiredSubject(),
    react: ReferralExpiredEmail({
      baseUrl: APP_URL,
      referrerName,
      presentingIssue: referralPost.presentingIssue,
      city: referralPost.city,
      province: referralPost.province ?? "Unknown",
      therapistsNotified,
    }),
  });

  if (error) {
    console.error(
      `Failed to send expiry notification for referral ${referralPost.id}:`,
      error.message,
    );
  }
}
