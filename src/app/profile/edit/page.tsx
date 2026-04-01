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
    middleName: profile.middleName ?? "",
    lastName: profile.lastName,
    displayName: profile.displayName,
    bio: profile.bio ?? "",
    imageUrl: profile.imageUrl ?? "",
    pronouns: profile.pronouns ?? "",
    primaryCredential: profile.primaryCredential ?? "",
    credentials: profile.credentials,
    websiteUrl: profile.websiteUrl ?? "",
    psychologyTodayUrl: profile.psychologyTodayUrl ?? "",
    contactEmail: profile.contactEmail ?? "",
    licensingLevel: profile.licensingLevel ?? "",
    freeConsultation: profile.freeConsultation,
    city: profile.city,
    province: profile.province,
    country: "CA",
    specialties: profile.specialties,
    topSpecialties: profile.topSpecialties,
    therapeuticApproach: profile.therapeuticApproach,
    modalities: profile.modalities,
    languages: profile.languages,
    ages: profile.ages,
    participants: profile.participants,
    groups: [],
    faithOrientation: profile.faithOrientation ?? [],
    ethnicity: profile.ethnicity,
    therapyStyle: profile.therapyStyle,
    therapistGender: profile.therapistGender ?? "",
    insurers: profile.insurers,
    paymentMethods: profile.paymentMethods,
    proBono: profile.proBono,
    reducedFees: profile.reducedFees,
    acceptsInsurance: profile.acceptsInsurance,
    rateIndividual: profile.rateIndividual ?? undefined,
    rateGroup: profile.rateGroup ?? undefined,
    rateFamily: profile.rateFamily ?? undefined,
    rateCouples: profile.rateCouples ?? undefined,
    acceptingClients: profile.acceptingClients,
  };

  return (
    <>
      <Navbar />
      <ProfileForm defaultValues={defaultValues} />
    </>
  );
}
