import { router } from "@/lib/trpc/server";
import { therapistRouter } from "@/lib/trpc/routers/therapist";

export const appRouter = router({
  therapist: therapistRouter,
});

export type AppRouter = typeof appRouter;
