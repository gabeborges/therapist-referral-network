import { TRPCError } from "@trpc/server";
import { PrismaClientKnownRequestError } from "@/generated/prisma/internal/prismaNamespace";
import { router, publicProcedure } from "@/lib/trpc/server";
import { waitlistSchema } from "@/lib/validations/waitlist";
import { subscribeToWaitlist } from "@/lib/email/mailerlite";

export const waitlistRouter = router({
  join: publicProcedure.input(waitlistSchema).mutation(async ({ ctx, input }) => {
    try {
      const entry = await ctx.prisma.waitlist.create({
        data: {
          email: input.email,
          country: input.country,
        },
      });
      // Sync to MailerLite (fire-and-forget, never blocks response)
      subscribeToWaitlist(input.email, input.country);

      return { success: true, id: entry.id };
    } catch (error) {
      // Handle duplicate email gracefully
      if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
        // Already on waitlist — still sync to MailerLite (idempotent)
        subscribeToWaitlist(input.email, input.country);
        return { success: true, id: null };
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to join waitlist. Please try again.",
      });
    }
  }),
});
