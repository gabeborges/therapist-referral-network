import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OnboardingPageClient } from "@/features/onboarding/components/OnboardingPageClient";
import { BrandHeader } from "@/features/layout/components/BrandHeader";

export const metadata = {
  title: "Onboarding — Therapist Referral Network",
};

export default async function OnboardingPage(): Promise<React.ReactElement> {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // Block soft-deleted users before they can interact with onboarding
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { deletedAt: true },
  });
  if (!user || user.deletedAt) {
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
        <BrandHeader />

        {/* Wizard (progress bar + step title rendered by OnboardingWizard) */}
        <OnboardingPageClient />
      </div>
    </div>
  );
}
