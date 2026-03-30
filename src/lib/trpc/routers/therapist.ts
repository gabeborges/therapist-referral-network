import { router, protectedProcedure } from "@/lib/trpc/server";
import { therapistProfileSchema } from "@/lib/validations/therapist-profile";

export const therapistRouter = router({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.therapistProfile.findUnique({
      where: { userId: ctx.session.user.id },
      include: {
        specialtyRecords: { select: { id: true, name: true } },
        therapyTypeRecords: { select: { id: true, name: true } },
        languageRecords: { select: { id: true, name: true } },
        alliedGroupRecords: { select: { id: true, name: true } },
        paymentMethodRecords: { select: { id: true, name: true } },
      },
    });
  }),

  createProfile: protectedProcedure
    .input(therapistProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id as string;
      const profile = await ctx.prisma.therapistProfile.create({
        data: {
          userId,
          // Core identity
          firstName: input.firstName,
          lastName: input.lastName,
          displayName: input.displayName,
          bio: input.bio ?? null,
          imageUrl: input.imageUrl || null,
          pronouns: input.pronouns ?? null,
          therapistGender: input.therapistGender ?? null,
          primaryCredential: input.primaryCredential ?? null,
          credentials: input.credentials ?? [],
          // Practice info
          websiteUrl: input.websiteUrl || null,
          psychologyTodayUrl: input.psychologyTodayUrl || null,
          professionalEmail: input.professionalEmail || null,
          licensingLevel: input.licensingLevel ?? null,
          freeConsultation: input.freeConsultation,
          // Location
          city: input.city,
          province: input.province,
          country: input.country,
          // Legacy String[] (kept for backward compat)
          specialties: input.specialties,
          therapeuticApproach: input.therapeuticApproach,
          languages: input.languages,
          // Taxonomy relations
          specialtyRecords: { connect: input.specialties.map((id) => ({ id })) },
          therapyTypeRecords: { connect: input.therapeuticApproach.map((id) => ({ id })) },
          languageRecords: { connect: input.languages.map((id) => ({ id })) },
          alliedGroupRecords: input.alliedGroups?.length
            ? { connect: input.alliedGroups.map((id) => ({ id })) }
            : undefined,
          paymentMethodRecords: input.paymentMethods?.length
            ? { connect: input.paymentMethods.map((id) => ({ id })) }
            : undefined,
          // Session details
          modalities: input.modalities,
          ageGroups: input.ageGroups,
          // Communities
          participants: input.participants ?? [],
          topSpecialties: input.topSpecialties ?? [],
          faithOrientation: input.faithOrientation ?? null,
          clientEthnicity: input.clientEthnicity ?? [],
          styleDescriptors: input.styleDescriptors ?? [],
          otherTreatmentOrientation: input.otherTreatmentOrientation ?? null,
          // Insurance & pricing
          acceptsInsurance: input.acceptsInsurance,
          directBilling: input.directBilling,
          insurers: input.insurers ?? [],
          hourlyRate: input.hourlyRate ?? null,
          reducedFees: input.reducedFees,
          proBono: input.proBono,
          // Availability
          acceptingClients: input.acceptingClients,
        },
      });
      return profile;
    }),

  updateProfile: protectedProcedure
    .input(therapistProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id as string;
      const profile = await ctx.prisma.therapistProfile.update({
        where: { userId },
        data: {
          // Core identity
          firstName: input.firstName,
          lastName: input.lastName,
          displayName: input.displayName,
          bio: input.bio ?? null,
          imageUrl: input.imageUrl || null,
          pronouns: input.pronouns ?? null,
          therapistGender: input.therapistGender ?? null,
          primaryCredential: input.primaryCredential ?? null,
          credentials: input.credentials ?? [],
          // Practice info
          websiteUrl: input.websiteUrl || null,
          psychologyTodayUrl: input.psychologyTodayUrl || null,
          professionalEmail: input.professionalEmail || null,
          licensingLevel: input.licensingLevel ?? null,
          freeConsultation: input.freeConsultation,
          // Location
          city: input.city,
          province: input.province,
          country: input.country,
          // Legacy String[]
          specialties: input.specialties,
          therapeuticApproach: input.therapeuticApproach,
          languages: input.languages,
          // Taxonomy relations (set replaces all existing)
          specialtyRecords: { set: input.specialties.map((id) => ({ id })) },
          therapyTypeRecords: { set: input.therapeuticApproach.map((id) => ({ id })) },
          languageRecords: { set: input.languages.map((id) => ({ id })) },
          alliedGroupRecords: { set: (input.alliedGroups ?? []).map((id) => ({ id })) },
          paymentMethodRecords: { set: (input.paymentMethods ?? []).map((id) => ({ id })) },
          // Session details
          modalities: input.modalities,
          ageGroups: input.ageGroups,
          // Communities
          participants: input.participants ?? [],
          topSpecialties: input.topSpecialties ?? [],
          faithOrientation: input.faithOrientation ?? null,
          clientEthnicity: input.clientEthnicity ?? [],
          styleDescriptors: input.styleDescriptors ?? [],
          otherTreatmentOrientation: input.otherTreatmentOrientation ?? null,
          // Insurance & pricing
          acceptsInsurance: input.acceptsInsurance,
          directBilling: input.directBilling,
          insurers: input.insurers ?? [],
          hourlyRate: input.hourlyRate ?? null,
          reducedFees: input.reducedFees,
          proBono: input.proBono,
          // Availability
          acceptingClients: input.acceptingClients,
          lastActiveAt: new Date(),
        },
      });
      return profile;
    }),

  toggleAvailability: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id as string;
    const current = await ctx.prisma.therapistProfile.findUniqueOrThrow({
      where: { userId },
      select: { acceptingClients: true },
    });
    const profile = await ctx.prisma.therapistProfile.update({
      where: { userId },
      data: {
        acceptingClients: !current.acceptingClients,
        lastActiveAt: new Date(),
      },
    });
    return profile;
  }),
});
