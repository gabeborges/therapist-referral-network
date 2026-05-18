import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { processDripQueue } from "@/features/drip/process-drip-queue";

// Postgres advisory-lock key for the drip cron. Arbitrary signed 32-bit int —
// changing this value would let an old concurrent invocation slip through.
const DRIP_ADVISORY_LOCK_KEY = 734195120;

export async function GET(request: Request): Promise<NextResponse> {
  const authHeader = request.headers.get("authorization");
  const expectedToken = process.env.CRON_SECRET;

  if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Single-flight guard: a second invocation (cron retry, manual trigger)
  // will get `acquired = false` and bail out without re-sending batches.
  const lockResult = await prisma.$queryRaw<{ acquired: boolean }[]>`
    SELECT pg_try_advisory_lock(${DRIP_ADVISORY_LOCK_KEY}) AS acquired
  `;
  const acquired = lockResult[0]?.acquired === true;

  if (!acquired) {
    return NextResponse.json({
      ok: true,
      skipped: "another drip run is in progress",
      timestamp: new Date().toISOString(),
    });
  }

  try {
    const summary = await processDripQueue(prisma);
    return NextResponse.json({
      ok: true,
      summary,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    // Return 200 with an error summary so Vercel doesn't retry the whole
    // queue. Individual referral errors are already caught inside
    // processDripQueue; this handles unexpected top-level failures.
    console.error("drip cron top-level failure", {
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json({
      ok: false,
      error: "drip cron failed; see logs",
      timestamp: new Date().toISOString(),
    });
  } finally {
    await prisma.$queryRaw`SELECT pg_advisory_unlock(${DRIP_ADVISORY_LOCK_KEY})`;
  }
}
