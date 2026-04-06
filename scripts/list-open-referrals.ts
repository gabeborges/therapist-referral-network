import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { config } from "dotenv";
config({ path: ".env.local" });
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });
prisma.referralPost
  .findMany({
    where: { status: "OPEN" },
    select: {
      id: true,
      presentingIssue: true,
      city: true,
      currentBatch: true,
      lastDrippedAt: true,
      createdAt: true,
    },
  })
  .then((r) => {
    console.log(JSON.stringify(r, null, 2));
    return prisma.$disconnect();
  });
