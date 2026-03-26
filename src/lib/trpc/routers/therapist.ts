import { router, protectedProcedure } from "@/lib/trpc/server";

export const therapistRouter = router({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.therapistProfile.findUnique({
      where: { userId: ctx.session.user.id },
    });
  }),
});
