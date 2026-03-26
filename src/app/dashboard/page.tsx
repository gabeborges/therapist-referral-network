import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage(): Promise<never> {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const therapistProfile = await prisma.therapistProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!therapistProfile) {
    redirect("/onboarding");
  }

  redirect("/referrals");
}
