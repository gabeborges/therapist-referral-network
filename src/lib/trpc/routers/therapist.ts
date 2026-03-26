import { router, protectedProcedure } from "@/lib/trpc/server";
import { therapistProfileSchema } from "@/lib/validations/therapist-profile";

export const therapistRouter = router({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.therapistProfile.findUnique({
      where: { userId: ctx.session.user.id },
    });
  }),

  createProfile: protectedProcedure
    .input(therapistProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id as string;
      const profile = await ctx.prisma.therapistProfile.create({
        data: {
          userId,
          firstName: input.firstName,
          lastName: input.lastName,
          displayName: input.displayName,
          bio: input.bio ?? null,
          city: input.city,
          province: input.province,
          country: input.country,
          specialties: input.specialties,
          modalities: input.modalities,
          therapeuticApproach: input.therapeuticApproach,
          languages: input.languages,
          ageGroups: input.ageGroups,
          acceptsInsurance: input.acceptsInsurance,
          directBilling: input.directBilling,
          insurers: input.insurers ?? [],
          hourlyRate: input.hourlyRate ?? null,
          reducedFees: input.reducedFees,
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
          firstName: input.firstName,
          lastName: input.lastName,
          displayName: input.displayName,
          bio: input.bio ?? null,
          city: input.city,
          province: input.province,
          country: input.country,
          specialties: input.specialties,
          modalities: input.modalities,
          therapeuticApproach: input.therapeuticApproach,
          languages: input.languages,
          ageGroups: input.ageGroups,
          acceptsInsurance: input.acceptsInsurance,
          directBilling: input.directBilling,
          insurers: input.insurers ?? [],
          hourlyRate: input.hourlyRate ?? null,
          reducedFees: input.reducedFees,
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
