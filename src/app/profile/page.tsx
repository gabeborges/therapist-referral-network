import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileView } from "@/features/profile/components/ProfileView";
import { Navbar } from "@/features/layout/components/Navbar";

export default async function ProfilePage(): Promise<React.ReactElement> {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const profile = await prisma.therapistProfile.findUnique({
    where: { userId: session.user.id },
    include: { user: { select: { email: true } } },
  });

  if (!profile) {
    redirect("/onboarding");
  }

  return (
    <>
      <Navbar />
      <ProfileView profile={profile} />
    </>
  );
}
