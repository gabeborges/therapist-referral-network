import { router } from "@/lib/trpc/server";
import { therapistRouter } from "@/lib/trpc/routers/therapist";
import { waitlistRouter } from "@/lib/trpc/routers/waitlist";
import { referralRouter } from "@/lib/trpc/routers/referral";
import { taxonomyRouter } from "@/lib/trpc/routers/taxonomy";

export const appRouter = router({
  therapist: therapistRouter,
  waitlist: waitlistRouter,
  referral: referralRouter,
  taxonomy: taxonomyRouter,
});

export type AppRouter = typeof appRouter;
