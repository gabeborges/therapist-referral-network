import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ConsentForm } from "@/app/auth/consent/ConsentForm";
import { BrandHeader } from "@/features/layout/components/BrandHeader";

export const metadata = {
  title: "Terms & Privacy — Therapist Referral Network",
};

export default async function ConsentPage(): Promise<React.ReactElement> {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  if (!session.needsConsent) {
    // Already consented — check if they have a profile
    if (session.user?.id) {
      const profile = await prisma.therapistProfile.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
      });
      if (profile) {
        redirect("/referrals");
      }
    }
    redirect("/onboarding");
  }

  return (
    <div className="px-4 sm:px-6 pt-12 pb-24">
      <div className="max-w-[560px] mx-auto">
        <BrandHeader />

        <h1
          className="text-[1.25rem] font-semibold tracking-[-0.01em] mb-2 text-center"
          style={{ color: "var(--fg)" }}
        >
          Before we get started
        </h1>
        <p className="text-[0.875rem] mb-6 text-center" style={{ color: "var(--fg-3)" }}>
          Please review and accept our terms to create your account.
        </p>

        <ConsentForm />
      </div>
    </div>
  );
}
