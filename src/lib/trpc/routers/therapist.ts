import { router, protectedProcedure } from "@/lib/trpc/server";
import { therapistProfileSchema } from "@/lib/validations/therapist-profile";

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

      // Fetch current consent state for audit logging
      const current = await ctx.prisma.therapistProfile.findUnique({
        where: { userId },
        select: { consentCommunitiesServed: true },
      });
      const consentChanged =
        current && current.consentCommunitiesServed !== input.consentCommunitiesServed;

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
          lastActiveAt: new Date(),
        },
      });

      // Log consent changes for audit trail
      if (consentChanged) {
        await ctx.prisma.consentLog.create({
          data: {
            userId,
            consentType: "communities_served",
            action: input.consentCommunitiesServed ? "granted" : "withdrawn",
            policyVersion: CONSENT_POLICY_VERSION,
            metadata: !input.consentCommunitiesServed
              ? { fieldsCleared: ["faithOrientation", "ethnicity"] }
              : undefined,
          },
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
    const now = new Date();

    await ctx.prisma.$transaction(async (tx) => {
      // 1. Soft-delete the user
      await tx.user.update({
        where: { id: userId },
        data: { deletedAt: now, deleteReason: "user_request" },
      });

      // 2. Clear sensitive data immediately (PIPEDA — no retention for sensitive fields)
      const profile = await tx.therapistProfile.findUnique({
        where: { userId },
        select: { id: true },
      });

      if (profile) {
        await tx.therapistProfile.update({
          where: { id: profile.id },
          data: {
            consentCommunitiesServed: false,
            faithOrientation: [],
            ethnicity: [],
          },
        });

        // 3. Cancel all OPEN referrals
        await tx.referralPost.updateMany({
          where: { authorId: profile.id, status: "OPEN" },
          data: { status: "CANCELLED", cancelledAt: now },
        });
      }

      // 4. Revoke auth — delete sessions and OAuth accounts
      await tx.session.deleteMany({ where: { userId } });
      await tx.account.deleteMany({ where: { userId } });

      // 5. Consent audit log (survives hard-delete — no FK)
      await tx.consentLog.create({
        data: {
          userId,
          consentType: "account_deletion",
          action: "withdrawn",
          policyVersion: "2026-04-01",
        },
      });
    });

    return { success: true };
  }),
});
