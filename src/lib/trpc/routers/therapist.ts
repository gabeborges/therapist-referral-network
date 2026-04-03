import { router, protectedProcedure } from "@/lib/trpc/server";
import { therapistProfileSchema } from "@/lib/validations/therapist-profile";
import { resolveCommunitiesConsent } from "@/features/consent/resolve-communities-consent";
import { requestDeletion } from "@/features/account/request-deletion";

const CONSENT_POLICY_VERSION = "2026-04-01";

export const therapistRouter = router({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.therapistProfile.findUnique({
      where: { userId: ctx.session.user.id },
      include: {
        specialtyRecords: { select: { id: true, name: true } },
        therapyTypeRecords: { select: { id: true, name: true } },
        languageRecords: { select: { id: true, name: true } },
        groupRecords: { select: { id: true, name: true } },
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
          middleName: input.middleName ?? null,
          lastName: input.lastName,
          displayName: input.displayName || `${input.firstName} ${input.lastName}`.trim(),
          bio: input.bio ?? null,
          imageUrl: input.imageUrl || null,
          pronouns: input.pronouns ?? null,
          primaryCredential: input.primaryCredential ?? null,
          credentials: input.credentials ?? [],
          // Practice info
          websiteUrl: input.websiteUrl || null,
          psychologyTodayUrl: input.psychologyTodayUrl || null,
          contactEmail: input.contactEmail || null,
          licensingLevel: input.licensingLevel ?? null,
          freeConsultation: input.freeConsultation,
          // Location
          city: input.city,
          province: input.province,
          country: input.country,
          // Legacy String[] (kept for backward compat)
          specialties: input.specialties,
          therapeuticApproach: input.therapeuticApproach ?? [],
          languages: input.languages ?? [],
          // Taxonomy relations
          specialtyRecords: { connect: input.specialties.map((id) => ({ id })) },
          therapyTypeRecords: input.therapeuticApproach?.length
            ? { connect: input.therapeuticApproach.map((id) => ({ id })) }
            : undefined,
          languageRecords: input.languages?.length
            ? { connect: input.languages.map((id) => ({ id })) }
            : undefined,
          groupRecords: input.groups?.length
            ? { connect: input.groups.map((id) => ({ id })) }
            : undefined,
          // Session details
          modalities: input.modalities,
          ages: input.ages,
          // Communities — clear sensitive fields when consent is withdrawn (PIPEDA 4.5)
          consentCommunitiesServed: input.consentCommunitiesServed,
          participants: input.participants,
          topSpecialties: input.topSpecialties ?? [],
          faithOrientation: input.consentCommunitiesServed ? (input.faithOrientation ?? []) : [],
          ethnicity: input.consentCommunitiesServed ? (input.ethnicity ?? []) : [],
          therapyStyle: input.therapyStyle ?? [],
          therapistGender: input.therapistGender ?? null,
          // Insurance & pricing
          insurers: input.insurers ?? [],
          paymentMethods: input.paymentMethods ?? [],
          proBono: input.proBono,
          reducedFees: input.reducedFees,
          acceptsInsurance: input.acceptsInsurance,
          rateIndividual: input.rateIndividual ?? null,
          rateGroup: input.rateGroup ?? null,
          rateFamily: input.rateFamily ?? null,
          rateCouples: input.rateCouples ?? null,
          // Availability
          acceptingClients: input.acceptingClients,
        },
      });

      // Log initial communities consent if granted
      if (input.consentCommunitiesServed) {
        await ctx.prisma.consentLog.create({
          data: {
            userId,
            consentType: "communities_served",
            action: "granted",
            policyVersion: CONSENT_POLICY_VERSION,
          },
        });
      }

      return profile;
    }),

  updateProfile: protectedProcedure
    .input(therapistProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id as string;

      // Resolve consent state, field values, and audit log data
      const consent = await resolveCommunitiesConsent(
        ctx.prisma,
        userId,
        input.consentCommunitiesServed,
        input.faithOrientation,
        input.ethnicity,
      );

      const profile = await ctx.prisma.therapistProfile.update({
        where: { userId },
        data: {
          // Core identity
          firstName: input.firstName,
          middleName: input.middleName ?? null,
          lastName: input.lastName,
          displayName: input.displayName || `${input.firstName} ${input.lastName}`.trim(),
          bio: input.bio ?? null,
          imageUrl: input.imageUrl || null,
          pronouns: input.pronouns ?? null,
          primaryCredential: input.primaryCredential ?? null,
          credentials: input.credentials ?? [],
          // Practice info
          websiteUrl: input.websiteUrl || null,
          psychologyTodayUrl: input.psychologyTodayUrl || null,
          contactEmail: input.contactEmail || null,
          licensingLevel: input.licensingLevel ?? null,
          freeConsultation: input.freeConsultation,
          // Location
          city: input.city,
          province: input.province,
          country: input.country,
          // Legacy String[]
          specialties: input.specialties,
          therapeuticApproach: input.therapeuticApproach ?? [],
          languages: input.languages ?? [],
          // Taxonomy relations (set replaces all existing)
          specialtyRecords: { set: input.specialties.map((id) => ({ id })) },
          therapyTypeRecords: { set: (input.therapeuticApproach ?? []).map((id) => ({ id })) },
          languageRecords: { set: (input.languages ?? []).map((id) => ({ id })) },
          groupRecords: { set: (input.groups ?? []).map((id) => ({ id })) },
          // Session details
          modalities: input.modalities,
          ages: input.ages,
          // Communities — clear sensitive fields when consent is withdrawn (PIPEDA 4.5)
          consentCommunitiesServed: input.consentCommunitiesServed,
          participants: input.participants,
          topSpecialties: input.topSpecialties ?? [],
          faithOrientation: consent.faithOrientation,
          ethnicity: consent.ethnicity,
          therapyStyle: input.therapyStyle ?? [],
          therapistGender: input.therapistGender ?? null,
          // Insurance & pricing
          insurers: input.insurers ?? [],
          paymentMethods: input.paymentMethods ?? [],
          proBono: input.proBono,
          reducedFees: input.reducedFees,
          acceptsInsurance: input.acceptsInsurance,
          rateIndividual: input.rateIndividual ?? null,
          rateGroup: input.rateGroup ?? null,
          rateFamily: input.rateFamily ?? null,
          rateCouples: input.rateCouples ?? null,
          // Availability
          acceptingClients: input.acceptingClients,
          lastActiveAt: new Date(),
        },
      });

      // Log consent changes for audit trail
      if (consent.consentLog) {
        await ctx.prisma.consentLog.create({
          data: consent.consentLog,
        });
      }

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

  // Account deletion workflow (PIPEDA data retention compliance)
  requestDeletion: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id as string;
    await requestDeletion(ctx.prisma, userId);
    return { success: true };
  }),
});
