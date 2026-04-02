import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure } from "@/lib/trpc/server";
import { referralPostSchema } from "@/lib/validations/referral-post";

export const referralRouter = router({
  getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ ctx, input }) => {
    const referralPost = await ctx.prisma.referralPost.findUnique({
      where: { slug: input.slug },
      include: {
        author: {
          select: {
            id: true,
            displayName: true,
            city: true,
            province: true,
            user: {
              select: {
                email: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!referralPost) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Referral not found.",
      });
    }

    // If the user is authenticated, return full data including author contact
    if (ctx.session?.user?.id) {
      return {
        id: referralPost.id,
        presentingIssue: referralPost.presentingIssue,
        ageGroup: referralPost.ageGroup,
        city: referralPost.city,
        province: referralPost.province,
        modalities: referralPost.modalities,
        details: referralPost.details,
        status: referralPost.status,
        createdAt: referralPost.createdAt,
        slug: referralPost.slug,
        author: {
          displayName: referralPost.author.displayName,
          city: referralPost.author.city,
          province: referralPost.author.province,
          email: referralPost.author.user.email,
        },
        authenticated: true as const,
      };
    }

    // Unauthenticated: return limited teaser data only
    return {
      id: referralPost.id,
      presentingIssue: referralPost.presentingIssue,
      city: referralPost.city,
      province: referralPost.province,
      modalities: referralPost.modalities,
      status: referralPost.status,
      slug: referralPost.slug,
      authenticated: false as const,
    };
  }),

  create: protectedProcedure.input(referralPostSchema).mutation(async ({ ctx, input }) => {
    const userId = ctx.session.user.id as string;

    const profile = await ctx.prisma.therapistProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new TRPCError({
        code: "PRECONDITION_FAILED",
        message: "You must complete your profile before posting a referral.",
      });
    }

    const referralPost = await ctx.prisma.referralPost.create({
      data: {
        authorId: profile.id,
        presentingIssue: input.presentingIssue,
        ageGroup: [input.ageGroup],
        city: input.city ?? null,
        province: input.province ?? null,
        modalities: input.modalities,
        details: input.details ?? null,
        participants: input.participants ? [input.participants] : [],
        rate: input.rate ?? null,
        therapistGenderPref: input.therapistGenderPref ?? null,
        therapyTypes: input.therapyTypes ?? [],
        languages: input.languages ?? [],
        additionalContext: input.additionalContext ?? null,
      },
    });

    return referralPost;
  }),

  listMine: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id as string;

    const profile = await ctx.prisma.therapistProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      return [];
    }

    return ctx.prisma.referralPost.findMany({
      where: { authorId: profile.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { notifications: true },
        },
      },
    });
  }),

  getById: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const userId = ctx.session.user.id as string;

    const profile = await ctx.prisma.therapistProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Profile not found.",
      });
    }

    const referralPost = await ctx.prisma.referralPost.findUnique({
      where: { id: input.id },
      include: {
        notifications: {
          include: {
            recipient: {
              select: {
                id: true,
                displayName: true,
                city: true,
                province: true,
              },
            },
          },
          orderBy: { sentAt: "desc" },
        },
      },
    });

    if (!referralPost) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Referral post not found.",
      });
    }

    if (referralPost.authorId !== profile.id) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You do not have access to this referral.",
      });
    }

    return referralPost;
  }),

  fulfill: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id as string;

      const profile = await ctx.prisma.therapistProfile.findUnique({
        where: { userId },
        select: { id: true },
      });

      if (!profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Profile not found.",
        });
      }

      const referralPost = await ctx.prisma.referralPost.findUnique({
        where: { id: input.id },
        select: { id: true, authorId: true, status: true },
      });

      if (!referralPost) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Referral post not found.",
        });
      }

      if (referralPost.authorId !== profile.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this referral.",
        });
      }

      if (referralPost.status !== "OPEN") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Only open referrals can be fulfilled.",
        });
      }

      return ctx.prisma.referralPost.update({
        where: { id: input.id },
        data: { status: "FULFILLED", fulfilledAt: new Date() },
      });
    }),

  cancel: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id as string;

      const profile = await ctx.prisma.therapistProfile.findUnique({
        where: { userId },
        select: { id: true },
      });

      if (!profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Profile not found.",
        });
      }

      const referralPost = await ctx.prisma.referralPost.findUnique({
        where: { id: input.id },
        select: { id: true, authorId: true, status: true },
      });

      if (!referralPost) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Referral post not found.",
        });
      }

      if (referralPost.authorId !== profile.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this referral.",
        });
      }

      if (referralPost.status !== "OPEN") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Only open referrals can be cancelled.",
        });
      }

      return ctx.prisma.referralPost.update({
        where: { id: input.id },
        data: { status: "CANCELLED", cancelledAt: new Date() },
      });
    }),
});
