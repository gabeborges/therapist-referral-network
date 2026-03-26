import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ReferralPostForm } from "@/features/referrals/components/ReferralPostForm";
import { Navbar } from "@/features/layout/components/Navbar";

export const metadata = {
  title: "Post a Referral — Therapist Referral Network",
};

export default async function NewReferralPage(): Promise<React.ReactElement> {
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

  return (
    <>
      <Navbar />
      <div className="px-4 sm:px-6 pt-12 pb-24">
        <div className="max-w-[560px] mx-auto">
          <ReferralPostForm />
        </div>
      </div>
    </>
  );
}
