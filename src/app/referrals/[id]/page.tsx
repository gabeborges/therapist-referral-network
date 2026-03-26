import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ReferralStatusBadge } from "@/features/referrals/components/ReferralStatusBadge";
import { CloseReferralButton } from "@/features/referrals/components/CloseReferralButton";
import { Navbar } from "@/features/layout/components/Navbar";

export const metadata = {
  title: "Referral Details — Therapist Referral Network",
};

const MODALITY_LABELS: Record<string, string> = {
  "in-person": "In-Person",
  virtual: "Virtual",
  both: "In-Person & Virtual",
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

  const location = referral.locationCity
    ? `${referral.locationCity}, ${referral.locationProvince}`
    : referral.locationProvince;

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
          <div className="flex items-start justify-between gap-3 mb-4">
            <h1 className="text-[1.25rem] font-semibold tracking-[-0.01em] leading-[1.35] text-fg m-0">
              {referral.presentingIssue}
            </h1>
            <ReferralStatusBadge status={referral.status} />
          </div>

          {/* Criteria grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <p className="text-[0.75rem] font-medium tracking-[0.04em] uppercase text-fg-3 mb-1">
                Age Group
              </p>
              <p className="text-[0.9375rem] text-fg m-0">
                {referral.ageGroup}
              </p>
            </div>
            <div>
              <p className="text-[0.75rem] font-medium tracking-[0.04em] uppercase text-fg-3 mb-1">
                Location
              </p>
              <p className="text-[0.9375rem] text-fg m-0">{location}</p>
            </div>
            <div>
              <p className="text-[0.75rem] font-medium tracking-[0.04em] uppercase text-fg-3 mb-1">
                Modality
              </p>
              <p className="text-[0.9375rem] text-fg m-0">
                {MODALITY_LABELS[referral.modality] ?? referral.modality}
              </p>
            </div>
            <div>
              <p className="text-[0.75rem] font-medium tracking-[0.04em] uppercase text-fg-3 mb-1">
                Created
              </p>
              <p className="text-[0.9375rem] text-fg m-0">
                {formatDate(referral.createdAt)}
              </p>
            </div>
          </div>

          {referral.additionalNotes && (
            <div className="pt-4 border-t border-border-s">
              <p className="text-[0.75rem] font-medium tracking-[0.04em] uppercase text-fg-3 mb-1">
                Additional Notes
              </p>
              <p className="text-[0.9375rem] text-fg-2 leading-relaxed m-0 whitespace-pre-wrap">
                {referral.additionalNotes}
              </p>
            </div>
          )}

          {/* Close button */}
          {referral.status === "OPEN" && (
            <div className="pt-4 mt-4 border-t border-border-s">
              <CloseReferralButton referralId={referral.id} />
            </div>
          )}
        </div>

        {/* Notification history */}
        <div className="bg-s1 border border-border rounded-md p-6 shadow-1">
          <h2 className="text-[0.8125rem] font-semibold tracking-[0.06em] uppercase text-fg-3 mb-4">
            Notification History
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
                      {notification.recipient.city},{" "}
                      {notification.recipient.province} — Batch{" "}
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
