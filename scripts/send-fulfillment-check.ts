import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { sendFulfillmentCheck } from "../src/features/notifications/send-fulfillment-check";
import { config } from "dotenv";
config({ path: ".env.local" });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
  const referrals = await prisma.referralPost.findMany({
    where: { status: "OPEN" },
  });

  if (referrals.length === 0) {
    console.log("No open referrals found.");
    return;
  }

  console.log(`Found ${referrals.length} open referral(s). Sending fulfillment checks...`);

  for (const referral of referrals) {
    const check = await sendFulfillmentCheck(referral, prisma);
    console.log(
      `Sent fulfillment check for "${referral.presentingIssue}" (${referral.city}) — token: ${check.token}`,
    );
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error(err);
    return prisma.$disconnect();
  });
