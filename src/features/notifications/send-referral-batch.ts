import type { PrismaClient } from "@/generated/prisma/client";
import type { ReferralPostModel } from "@/generated/prisma/models/ReferralPost";
import type { ProfileMatch } from "@/features/matching/match-referral-to-profiles";
import { sendEmailWithRetry } from "@/lib/email/send-with-retry";
import {
  ReferralNotificationEmail,
  referralNotificationSubject,
} from "@/lib/email/templates/referral-notification";
import { getAppUrl, getResendFromEmail, getSupportEmail } from "@/lib/env";

const APP_URL = getAppUrl();
const FROM_EMAIL = getResendFromEmail();

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

  const recipientMap = new Map(recipientProfiles.map((p) => [p.id, p]));

  const referralUrl = `${APP_URL}/r/${referralPost.slug}`;
  const subject = referralNotificationSubject(
    referralPost.presentingIssue,
    referralPost.city,
    referralPost.province ?? "Unknown",
  );

  let sentCount = 0;

  for (const match of matchedProfiles) {
    const recipient = recipientMap.get(match.profileId);
    if (!recipient) continue;

    const { data, error } = await sendEmailWithRetry({
      from: FROM_EMAIL,
      replyTo: getSupportEmail(),
      to: recipient.user.email,
      subject,
      react: ReferralNotificationEmail({
        baseUrl: APP_URL,
        referrerName: `${author.firstName} ${author.lastName}`,
        referrerEmail: author.user.email,
        referrerContactEmail: author.contactEmail,
        referrerPronouns: author.pronouns,
        referrerWebsiteUrl: author.websiteUrl,
        referrerPsychologyTodayUrl: author.psychologyTodayUrl,
        presentingIssue: referralPost.presentingIssue,
        ageGroup: referralPost.ageGroup,
        city: referralPost.city,
        province: referralPost.province ?? "Unknown",
        modalities: referralPost.modalities,
        details: referralPost.details,
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

  // Only advance batch tracking when at least one email actually went out.
  // A batch where every send failed (e.g. all rate-limited with retries
  // exhausted) must NOT advance — otherwise those recipients are skipped
  // forever and the referral marches toward EXPIRED having notified no one.
  if (sentCount > 0) {
    await prisma.referralPost.update({
      where: { id: referralPost.id },
      data: {
        currentBatch: batch,
        lastDrippedAt: new Date(),
      },
    });
  }

  return sentCount;
}
