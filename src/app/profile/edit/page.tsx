import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/features/profile/components/ProfileForm";
import { Navbar } from "@/features/layout/components/Navbar";
import type { TherapistProfileFormData } from "@/lib/validations/therapist-profile";

export default async function ProfileEditPage(): Promise<React.ReactElement> {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const profile = await prisma.therapistProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) {
    redirect("/onboarding");
  }

  const defaultValues: TherapistProfileFormData = {
    firstName: profile.firstName,
    lastName: profile.lastName,
    displayName: profile.displayName,
    bio: profile.bio ?? "",
    city: profile.city,
    province: profile.province,
    country: "CA",
    specialties: profile.specialties,
    modalities: profile.modalities,
    therapeuticApproach: profile.therapeuticApproach,
    languages: profile.languages,
    ageGroups: profile.ageGroups,
    acceptsInsurance: profile.acceptsInsurance,
    directBilling: profile.directBilling,
    insurers: profile.insurers,
    hourlyRate: profile.hourlyRate ?? undefined,
    reducedFees: profile.reducedFees,
    acceptingClients: profile.acceptingClients,
  };

  return (
    <>
      <Navbar />
      <ProfileForm defaultValues={defaultValues} />
    </>
  );
}
