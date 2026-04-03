import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function createTRPCContext() {
  const session = await auth();
  return {
    prisma,
    session,
  };
}

const t = initTRPC.context<Awaited<ReturnType<typeof createTRPCContext>>>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session?.user?.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  // Reject soft-deleted users (account deletion in progress)
  const user = await ctx.prisma.user.findUnique({
    where: { id: ctx.session.user.id },
    select: { deletedAt: true },
  });
  if (!user || user.deletedAt) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Account has been deleted" });
  }

  // Touch lastActiveAt for matching decay scoring (fire-and-forget)
  ctx.prisma.therapistProfile
    .update({
      where: { userId: ctx.session.user.id },
      data: { lastActiveAt: new Date() },
    })
    .catch(() => {
      // Profile may not exist yet (onboarding) — safe to ignore
    });

  return next({
    ctx: {
      ...ctx,
      session: {
        ...ctx.session,
        user: ctx.session.user,
      },
    },
  });
});
