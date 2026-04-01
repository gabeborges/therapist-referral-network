import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ReferralPostList } from "@/features/referrals/components/ReferralPostList";
import { Navbar } from "@/features/layout/components/Navbar";

export const metadata = {
  title: "My Referrals — Therapist Referral Network",
};

export default async function ReferralsPage(): Promise<React.ReactElement> {
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

  const referrals = await prisma.referralPost.findMany({
    where: { authorId: profile.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { notifications: true },
      },
    },
  });

  return (
    <>
    <Navbar />
    <div className="px-4 sm:px-6 pt-12 pb-24">
      <div className="max-w-[640px] mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
          <h1 className="text-[1.5rem] font-semibold tracking-[-0.015em] leading-[1.3] text-fg m-0">
            My referrals
          </h1>
          <Link
            href="/referrals/new"
            className="inline-flex items-center justify-center h-10 px-5 bg-brand text-brand-on border-none rounded-sm text-[0.8125rem] font-semibold tracking-[0.01em] no-underline transition-[background] duration-150 ease-out hover:bg-brand-h focus-visible:outline-2 focus-visible:outline-border-f focus-visible:outline-offset-2"
          >
            Post a referral
          </Link>
        </div>

        <ReferralPostList referrals={referrals} />

        {referrals.length === 0 && (
          <div className="text-center mt-4">
            <Link
              href="/referrals/new"
              className="inline-flex items-center justify-center h-10 px-5 bg-brand text-brand-on border-none rounded-sm text-[0.8125rem] font-semibold tracking-[0.01em] no-underline transition-[background] duration-150 ease-out hover:bg-brand-h focus-visible:outline-2 focus-visible:outline-border-f focus-visible:outline-offset-2"
            >
              Post your first referral
            </Link>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
