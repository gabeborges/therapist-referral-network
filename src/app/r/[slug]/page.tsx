import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/ui/BackLink";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const MODALITY_LABELS: Record<string, string> = {
  "in-person": "In-person",
  virtual: "Virtual",
  both: "In-person & virtual",
};

interface ReferralSharePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ReferralSharePageProps): Promise<Metadata> {
  const { slug } = await params;

  const referral = await prisma.referralPost.findUnique({
    where: { slug },
    select: {
      presentingIssue: true,
      city: true,
      province: true,
      modalities: true,
    },
  });

  if (!referral) {
    return { title: "Referral Not Found" };
  }

  const location = referral.city ? `${referral.city}, ${referral.province}` : referral.province;

  const modalities = referral.modalities.map((m) => MODALITY_LABELS[m] ?? m).join(", ");

  const title = `Referral: ${referral.presentingIssue} — Therapist Referral Network`;
  const description = `Looking for a therapist match: ${referral.presentingIssue} in ${location} (${modalities}). Join the Therapist Referral Network to respond.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Therapist Referral Network",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function ReferralSharePage({
  params,
}: ReferralSharePageProps): Promise<React.ReactElement> {
  const { slug } = await params;

  const referral = await prisma.referralPost.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          displayName: true,
          city: true,
          province: true,
          user: {
            select: {
              email: true,
            },
          },
        },
      },
    },
  });

  if (!referral) {
    notFound();
  }

  const session = await auth();
  const isAuthenticated = !!session?.user?.id;

  const location = referral.city ? `${referral.city}, ${referral.province}` : referral.province;

  const modalities = referral.modalities.map((m) => MODALITY_LABELS[m] ?? m).join(", ");

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "var(--bg)" }}
    >
      <div className="w-full max-w-[520px]">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <svg width="32" height="32" viewBox="0 0 48 48" style={{ color: "var(--brand)" }}>
            <circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" strokeWidth="3" />
            <circle cx="24" cy="24" r="16" fill="none" stroke="currentColor" strokeWidth="3" />
            <circle cx="24" cy="24" r="11" fill="none" stroke="currentColor" strokeWidth="3" />
            <circle cx="24" cy="24" r="6" fill="none" stroke="currentColor" strokeWidth="3" />
          </svg>
          <span
            className="text-[1rem] font-semibold tracking-[-0.005em]"
            style={{ color: "var(--fg)" }}
          >
            Therapist Referral Network
          </span>
        </div>

        {/* Referral Card */}
        <div
          className="rounded-md p-6"
          style={{
            background: "var(--s1)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-2)",
          }}
        >
          {/* Status badge */}
          <div className="flex items-center gap-2 mb-4">
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.6875rem] font-semibold tracking-[0.04em] uppercase"
              style={{
                background: referral.status === "OPEN" ? "var(--ok-l)" : "var(--inset)",
                color: referral.status === "OPEN" ? "var(--ok)" : "var(--fg-4)",
              }}
            >
              {referral.status}
            </span>
            <span className="text-[0.75rem]" style={{ color: "var(--fg-3)" }}>
              Referral request
            </span>
          </div>

          {/* Presenting Issue */}
          <h1
            className="text-[1.25rem] font-semibold tracking-[-0.01em] leading-[1.35] m-0 mb-5"
            style={{ color: "var(--fg)" }}
          >
            {referral.presentingIssue}
          </h1>

          {/* Criteria Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <p
                className="text-[0.75rem] font-medium tracking-[0.04em] uppercase mb-1 m-0"
                style={{ color: "var(--fg-3)" }}
              >
                Location
              </p>
              <p className="text-[0.9375rem] m-0" style={{ color: "var(--fg)" }}>
                {location}
              </p>
            </div>
            <div>
              <p
                className="text-[0.75rem] font-medium tracking-[0.04em] uppercase mb-1 m-0"
                style={{ color: "var(--fg-3)" }}
              >
                Modalities
              </p>
              <p className="text-[0.9375rem] m-0" style={{ color: "var(--fg)" }}>
                {modalities}
              </p>
            </div>

            {isAuthenticated && (
              <div>
                <p
                  className="text-[0.75rem] font-medium tracking-[0.04em] uppercase mb-1 m-0"
                  style={{ color: "var(--fg-3)" }}
                >
                  Age group
                </p>
                <p className="text-[0.9375rem] m-0" style={{ color: "var(--fg)" }}>
                  {referral.ageGroup}
                </p>
              </div>
            )}

            {isAuthenticated && referral.details && (
              <div className="sm:col-span-2">
                <p
                  className="text-[0.75rem] font-medium tracking-[0.04em] uppercase mb-1 m-0"
                  style={{ color: "var(--fg-3)" }}
                >
                  Details
                </p>
                <p
                  className="text-[0.9375rem] leading-relaxed m-0 whitespace-pre-wrap"
                  style={{ color: "var(--fg-2)" }}
                >
                  {referral.details}
                </p>
              </div>
            )}
          </div>

          {/* Authenticated: Show author info */}
          {isAuthenticated && (
            <div className="pt-4 mt-1" style={{ borderTop: "1px solid var(--border-s)" }}>
              <p
                className="text-[0.75rem] font-medium tracking-[0.04em] uppercase mb-1 m-0"
                style={{ color: "var(--fg-3)" }}
              >
                Referring therapist
              </p>
              <p className="text-[0.9375rem] font-medium m-0" style={{ color: "var(--fg)" }}>
                {referral.author.displayName}
              </p>
              <p className="text-[0.8125rem] m-0 mt-0.5" style={{ color: "var(--fg-2)" }}>
                {referral.author.city}, {referral.author.province}
              </p>
              <a
                href={`mailto:${referral.author.user.email}`}
                className="inline-flex items-center gap-1 text-[0.8125rem] font-medium mt-1 no-underline hover:underline"
                style={{ color: "var(--brand)" }}
              >
                {referral.author.user.email}
              </a>
            </div>
          )}

          {/* Unauthenticated: Show CTA */}
          {!isAuthenticated && (
            <div className="pt-5 mt-1" style={{ borderTop: "1px solid var(--border-s)" }}>
              <p
                className="text-[0.875rem] leading-relaxed mb-4 m-0"
                style={{ color: "var(--fg-2)" }}
              >
                Sign up to see the full referral details and contact the referring therapist.
              </p>
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center w-full h-11 px-6 rounded-sm text-[0.8125rem] font-semibold tracking-[0.01em] no-underline transition-[background] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{
                  background: "var(--brand)",
                  color: "var(--brand-on)",
                  border: "none",
                }}
              >
                Sign up to respond to this referral
              </Link>
              <p className="text-[0.8125rem] text-center mt-3 m-0" style={{ color: "var(--fg-3)" }}>
                Already have an account?{" "}
                <Link
                  href="/auth/signin"
                  className="no-underline font-medium hover:underline"
                  style={{ color: "var(--brand)" }}
                >
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Back to dashboard for authenticated users */}
        {isAuthenticated && (
          <div className="text-center mt-6">
            <BackLink href="/referrals">Back to My Referrals</BackLink>
          </div>
        )}
      </div>
    </div>
  );
}
