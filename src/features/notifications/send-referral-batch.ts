import type { PrismaClient } from "@/generated/prisma/client";
import type { ReferralPostModel } from "@/generated/prisma/models/ReferralPost";
import type { ProfileMatch } from "@/features/matching/match-referral-to-profiles";
import { resend } from "@/lib/email/resend";
import {
  ReferralNotificationEmail,
  referralNotificationSubject,
} from "@/lib/email/templates/referral-notification";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "noreply@example.com";

/**
 * Sends referral notification emails to a batch of matched therapist profiles.
 *
 * For each matched profile:
 * 1. Sends an email via Resend with the ReferralNotificationEmail template
 * 2. Creates a ReferralNotification record with the batch number and Resend email ID
 *
 * @returns The count of emails successfully sent
 */
export async function sendReferralBatch(
  referralPost: ReferralPostModel,
  matchedProfiles: ProfileMatch[],
  prisma: PrismaClient,
): Promise<number> {
  const batch = referralPost.currentBatch + 1;

  // Fetch the referral author's profile for the email template
  const author = await prisma.therapistProfile.findUniqueOrThrow({
    where: { id: referralPost.authorId },
    include: { user: { select: { email: true } } },
  });

  // Fetch recipient profiles with their user emails
  const recipientProfiles = await prisma.therapistProfile.findMany({
    where: { id: { in: matchedProfiles.map((m) => m.profileId) } },
    include: { user: { select: { email: true } } },
  });

  const recipientMap = new Map(
    recipientProfiles.map((p) => [p.id, p]),
  );

  const referralUrl = `${APP_URL}/r/${referralPost.slug}`;
  const subject = referralNotificationSubject(
    referralPost.presentingIssue,
    referralPost.locationCity,
    referralPost.locationProvince,
  );

  let sentCount = 0;

  for (const match of matchedProfiles) {
    const recipient = recipientMap.get(match.profileId);
    if (!recipient) continue;

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: recipient.user.email,
      subject,
      react: ReferralNotificationEmail({
        referrerName: `${author.firstName} ${author.lastName}`,
        referrerEmail: author.user.email,
        presentingIssue: referralPost.presentingIssue,
        ageGroup: referralPost.ageGroup,
        city: referralPost.locationCity,
        province: referralPost.locationProvince,
        modality: referralPost.modality,
        additionalNotes: referralPost.additionalNotes,
        referralUrl,
      }),
    });

    if (error) {
      console.error(
        `Failed to send referral notification to profile ${match.profileId}:`,
        error.message,
      );
      continue;
    }

    await prisma.referralNotification.create({
      data: {
        referralPostId: referralPost.id,
        recipientId: match.profileId,
        batch,
        emailId: data?.id ?? null,
      },
    });

    sentCount++;
  }

  // Update the referral post batch tracking
  await prisma.referralPost.update({
    where: { id: referralPost.id },
    data: {
      currentBatch: batch,
      lastDrippedAt: new Date(),
    },
  });

  return sentCount;
}
