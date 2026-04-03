import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { purgeClosedAccounts } from "@/features/retention/purge-closed-accounts";

export async function POST(request: Request): Promise<NextResponse> {
  const authHeader = request.headers.get("authorization");
  const expectedToken = process.env.CRON_SECRET;

  if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const summary = await purgeClosedAccounts(prisma);

  return NextResponse.json({
    ok: true,
    summary,
    timestamp: new Date().toISOString(),
  });
}
