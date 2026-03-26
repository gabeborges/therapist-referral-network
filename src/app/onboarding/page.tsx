import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OnboardingFlow } from "@/features/onboarding/components/OnboardingFlow";

export const metadata = {
  title: "Onboarding — Therapist Referral Network",
};

export default async function OnboardingPage(): Promise<React.ReactElement> {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const existingProfile = await prisma.therapistProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (existingProfile) {
    redirect("/referrals");
  }

  return (
    <div className="px-4 sm:px-6 pt-12 pb-24">
      <div className="max-w-[560px] mx-auto">
        {/* Logo only (no full nav) */}
        <div className="text-center mb-8">
          <span className="font-semibold text-sm inline-flex items-center gap-2 text-fg">
            <svg
              width="26"
              height="26"
              viewBox="0 0 48 48"
              className="text-brand"
            >
              <circle
                cx="24"
                cy="24"
                r="21"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
              />
              <circle
                cx="24"
                cy="24"
                r="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
              />
              <circle
                cx="24"
                cy="24"
                r="11"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
              />
              <circle
                cx="24"
                cy="24"
                r="6"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
              />
            </svg>
            Therapist Referral Network
          </span>
        </div>

        {/* Welcome */}
        <div className="text-center mb-8">
          <h1 className="text-[1.5rem] font-semibold tracking-[-0.015em] leading-[1.3] text-fg mb-2">
            Welcome to Therapist Referral Network
          </h1>
          <p className="text-[0.875rem] leading-[1.5] text-fg-2">
            Complete your profile to start giving and receiving referrals from
            trusted colleagues.
          </p>
        </div>

        {/* How it works */}
        <div className="bg-s1 border border-border rounded-md p-6 shadow-1 mb-8">
          <h2 className="text-[0.8125rem] font-semibold tracking-[0.06em] uppercase text-fg-3 mb-4">
            How it works
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <span className="w-8 h-8 rounded-full inline-flex items-center justify-center bg-brand text-brand-on text-[0.8125rem] font-bold shrink-0">
                1
              </span>
              <div>
                <p className="text-[0.9375rem] font-medium text-fg">
                  Set up your profile
                </p>
                <p className="text-[0.875rem] leading-[1.5] text-fg-2">
                  Add your specialties, insurance, and location so colleagues
                  can find you.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="w-8 h-8 rounded-full inline-flex items-center justify-center bg-brand text-brand-on text-[0.8125rem] font-bold shrink-0">
                2
              </span>
              <div>
                <p className="text-[0.9375rem] font-medium text-fg">
                  Receive matched referrals
                </p>
                <p className="text-[0.875rem] leading-[1.5] text-fg-2">
                  When a colleague sends a referral, you'll be matched based on
                  clinical fit.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="w-8 h-8 rounded-full inline-flex items-center justify-center bg-brand text-brand-on text-[0.8125rem] font-bold shrink-0">
                3
              </span>
              <div>
                <p className="text-[0.9375rem] font-medium text-fg">
                  Connect with clients
                </p>
                <p className="text-[0.875rem] leading-[1.5] text-fg-2">
                  Accept referrals and coordinate care directly with the
                  referring therapist.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Country gate → Profile form */}
        <OnboardingFlow />
      </div>
    </div>
  );
}
