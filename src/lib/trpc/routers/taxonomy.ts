import { router, publicProcedure } from "@/lib/trpc/server";

export const taxonomyRouter = router({
  getSpecialties: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.specialty.findMany({
      select: { id: true, name: true, category: true },
      orderBy: { sortOrder: "asc" },
    });
  }),

  getTherapyTypes: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.therapyType.findMany({
      select: { id: true, name: true },
      orderBy: { sortOrder: "asc" },
    });
  }),

  getLanguages: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.language.findMany({
      select: { id: true, name: true },
      orderBy: { sortOrder: "asc" },
    });
  }),

  getAlliedGroups: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.alliedGroup.findMany({
      select: { id: true, name: true },
      orderBy: { sortOrder: "asc" },
    });
  }),

  getPaymentMethods: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.paymentMethod.findMany({
      select: { id: true, name: true },
      orderBy: { sortOrder: "asc" },
    });
  }),
});
