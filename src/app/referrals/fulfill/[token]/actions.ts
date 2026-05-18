"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

/**
 * Records a therapist's response to a fulfillment check.
 *
 * Side effects live in a POST-only Server Action (never GET) so that
 * email prefetchers and link scanners cannot inadvertently mark a
 * referral fulfilled by visiting the link.
 *
 * Idempotent: re-submitting after a response is a no-op.
 */
export async function submitFulfillmentResponse(formData: FormData): Promise<void> {
  const token = formData.get("token");
  const fulfilledRaw = formData.get("fulfilled");

  if (typeof token !== "string" || token.length === 0) {
    redirect("/referrals/fulfill/invalid");
  }
  if (fulfilledRaw !== "true" && fulfilledRaw !== "false") {
    redirect(`/referrals/fulfill/${token}`);
  }

  const isFulfilled = fulfilledRaw === "true";

  const check = await prisma.fulfillmentCheck.findUnique({
    where: { token },
    select: { id: true, respondedAt: true, referralPostId: true },
  });

  if (!check) {
    redirect("/referrals/fulfill/invalid");
  }

  // Idempotent: only the first response wins.
  if (check.respondedAt === null) {
    await prisma.$transaction(async (tx) => {
      await tx.fulfillmentCheck.update({
        where: { id: check.id },
        data: { fulfilled: isFulfilled, respondedAt: new Date() },
      });

      if (isFulfilled) {
        await tx.referralPost.update({
          where: { id: check.referralPostId },
          data: { status: "FULFILLED", fulfilledAt: new Date() },
        });
      }
    });
  }

  revalidatePath(`/referrals/fulfill/${token}`);
  redirect(`/referrals/fulfill/${token}?confirmed=${isFulfilled ? "yes" : "no"}`);
}
