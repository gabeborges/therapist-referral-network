import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ReferralStatusBadge } from "@/features/referrals/components/ReferralStatusBadge";
import { ReferralActionBar } from "@/features/referrals/components/ReferralActionBar";
import { Navbar } from "@/features/layout/components/Navbar";

export const metadata = {
  title: "Referral Details — Therapist Referral Network",
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

interface ReferralDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ReferralDetailPage({
  params,
}: ReferralDetailPageProps): Promise<React.ReactElement> {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const profile = await prisma.therapistProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!profile) {
    redirect("/onboarding");
  }

  const referral = await prisma.referralPost.findUnique({
    where: { id },
    include: {
      notifications: {
        include: {
          recipient: {
            select: {
              id: true,
              displayName: true,
              city: true,
              province: true,
            },
          },
        },
        orderBy: { sentAt: "desc" },
      },
    },
  });

  if (!referral || referral.authorId !== profile.id) {
    notFound();
  }

  const location = referral.city ? `${referral.city}, ${referral.province}` : referral.province;

  return (
    <>
      <Navbar />
      <div className="px-4 sm:px-6 pt-12 pb-24">
        <div className="max-w-[640px] mx-auto">
          {/* Back link */}
          <Link
            href="/referrals"
            className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-fg-3 no-underline mb-6 hover:text-fg-2 transition-colors duration-150"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Referrals
          </Link>

          {/* Header */}
          <div className="bg-s1 border border-border rounded-md p-6 shadow-1 mb-4">
            <div className="flex items-start justify-between gap-3 mb-1">
              <h1 className="text-[1.25rem] font-semibold tracking-[-0.01em] leading-[1.35] text-fg m-0">
                {referral.presentingIssue}
              </h1>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <ReferralStatusBadge status={referral.status} />
                {referral.status === "FULFILLED" && referral.fulfilledAt && (
                  <span className="text-[0.75rem] text-fg-3">
                    {formatDate(referral.fulfilledAt)}
                  </span>
                )}
                {referral.status === "CANCELLED" && referral.cancelledAt && (
                  <span className="text-[0.75rem] text-fg-3">
                    {formatDate(referral.cancelledAt)}
                  </span>
                )}
              </div>
            </div>
            <p className="text-[0.75rem] text-fg-3 m-0 mb-5">{formatDate(referral.createdAt)}</p>

            {/* Criteria grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div>
                <p className="text-[0.75rem] font-medium tracking-[0.04em] uppercase text-fg-3 mb-1">
                  Age group
                </p>
                <p className="text-[0.9375rem] text-fg m-0">{referral.ageGroup.join(", ")}</p>
              </div>
              <div>
                <p className="text-[0.75rem] font-medium tracking-[0.04em] uppercase text-fg-3 mb-1">
                  Location
                </p>
                <p className="text-[0.9375rem] text-fg m-0">{location}</p>
              </div>
              <div>
                <p className="text-[0.75rem] font-medium tracking-[0.04em] uppercase text-fg-3 mb-1">
                  Modalities
                </p>
                <p className="text-[0.9375rem] text-fg m-0">{referral.modalities.join(", ")}</p>
              </div>
              {referral.participants.length > 0 && (
                <div>
                  <p className="text-[0.75rem] font-medium tracking-[0.04em] uppercase text-fg-3 mb-1">
                    Participants
                  </p>
                  <p className="text-[0.9375rem] text-fg m-0">{referral.participants.join(", ")}</p>
                </div>
              )}
              {referral.rate && (
                <div>
                  <p className="text-[0.75rem] font-medium tracking-[0.04em] uppercase text-fg-3 mb-1">
                    Rate
                  </p>
                  <p className="text-[0.9375rem] text-fg m-0">{referral.rate}</p>
                </div>
              )}
              {referral.insuranceRequired && (
                <div>
                  <p className="text-[0.75rem] font-medium tracking-[0.04em] uppercase text-fg-3 mb-1">
                    Insurance required
                  </p>
                  <p className="text-[0.9375rem] text-fg m-0">Yes</p>
                </div>
              )}
              {referral.therapistGenderPref && (
                <div>
                  <p className="text-[0.75rem] font-medium tracking-[0.04em] uppercase text-fg-3 mb-1">
                    Gender preference
                  </p>
                  <p className="text-[0.9375rem] text-fg m-0">{referral.therapistGenderPref}</p>
                </div>
              )}
              {referral.therapyTypes.length > 0 && (
                <div className="sm:col-span-2">
                  <p className="text-[0.75rem] font-medium tracking-[0.04em] uppercase text-fg-3 mb-1">
                    Therapy types
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {referral.therapyTypes.map((type) => (
                      <span
                        key={type}
                        className="inline-flex items-center h-7 px-2.5 bg-brand-l text-brand rounded-full text-[0.8125rem] font-medium"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {referral.languages.length > 0 && (
                <div>
                  <p className="text-[0.75rem] font-medium tracking-[0.04em] uppercase text-fg-3 mb-1">
                    Languages
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {referral.languages.map((lang) => (
                      <span
                        key={lang}
                        className="inline-flex items-center h-7 px-2.5 bg-inset text-fg-2 rounded-full text-[0.8125rem] font-medium"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {referral.details && (
              <div className="pt-4 border-t border-border-s">
                <p className="text-[0.75rem] font-medium tracking-[0.04em] uppercase text-fg-3 mb-1">
                  Details
                </p>
                <p className="text-[0.9375rem] text-fg-2 leading-relaxed m-0 whitespace-pre-wrap">
                  {referral.details}
                </p>
              </div>
            )}

            {/* Action bar */}
            <div className="pt-4 mt-4 border-t border-border-s">
              <ReferralActionBar referralId={referral.id} status={referral.status} />
            </div>
          </div>

          {/* Notification history */}
          <div className="bg-s1 border border-border rounded-md p-6 shadow-1">
            <h2 className="text-[0.8125rem] font-semibold tracking-[0.06em] uppercase text-fg-3 mb-4">
              Notification history
            </h2>

            {referral.notifications.length === 0 ? (
              <p className="text-[0.875rem] text-fg-4 text-center py-6">
                No notifications sent yet. Matching will begin shortly.
              </p>
            ) : (
              <div className="space-y-3">
                {referral.notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-center justify-between py-2.5 border-b border-border-s last:border-b-0"
                  >
                    <div>
                      <p className="text-[0.9375rem] font-medium text-fg m-0">
                        {notification.recipient.displayName}
                      </p>
                      <p className="text-[0.75rem] text-fg-3 m-0">
                        {notification.recipient.city}, {notification.recipient.province} — Batch{" "}
                        {notification.batch}
                      </p>
                    </div>
                    <span className="text-[0.75rem] text-fg-4">
                      {formatDate(notification.sentAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
