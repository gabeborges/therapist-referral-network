import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OnboardingPageClient } from "@/features/onboarding/components/OnboardingPageClient";

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
            <svg width="26" height="26" viewBox="0 0 48 48" className="text-brand">
              <circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" strokeWidth="3.5" />
              <circle cx="24" cy="24" r="16" fill="none" stroke="currentColor" strokeWidth="3.5" />
              <circle cx="24" cy="24" r="11" fill="none" stroke="currentColor" strokeWidth="3.5" />
              <circle cx="24" cy="24" r="6" fill="none" stroke="currentColor" strokeWidth="3.5" />
            </svg>
            Therapist Referral Network
          </span>
        </div>

        {/* Wizard (progress bar + step title rendered by OnboardingWizard) */}
        <OnboardingPageClient />
      </div>
    </div>
  );
}
