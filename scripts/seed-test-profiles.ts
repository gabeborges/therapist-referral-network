/**
 * Seeds test therapist profiles for drip-queue testing.
 * Creates 5 profiles with varied specialties, all in Toronto/ON.
 *
 * Usage: bun scripts/seed-test-profiles.ts
 * Cleanup: bun scripts/seed-test-profiles.ts --clean
 */
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { config } from "dotenv";
config({ path: ".env.local" });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const TEST_EMAIL_DOMAIN = "test-seed.local";

const testProfiles = [
  { first: "Alice", last: "Chen", email: `alice@${TEST_EMAIL_DOMAIN}` },
  { first: "Ben", last: "Okafor", email: `ben@${TEST_EMAIL_DOMAIN}` },
  { first: "Clara", last: "Singh", email: `clara@${TEST_EMAIL_DOMAIN}` },
  { first: "Diego", last: "Morales", email: `diego@${TEST_EMAIL_DOMAIN}` },
  { first: "Erin", last: "Park", email: `erin@${TEST_EMAIL_DOMAIN}` },
];

async function seed(): Promise<void> {
  console.log("Seeding 5 test therapist profiles...");

  for (const p of testProfiles) {
    const user = await prisma.user.create({
      data: {
        email: p.email,
        name: `${p.first} ${p.last}`,
      },
    });

    await prisma.therapistProfile.create({
      data: {
        userId: user.id,
        firstName: p.first,
        middleName: "",
        lastName: p.last,
        displayName: `${p.first} ${p.last}`,
        bio: "Test therapist profile for drip-queue testing.",
        pronouns: "they/them",
        therapistGender: "Non-binary",
        primaryCredential: "Registered Psychologist",
        credentials: ["PhD"],
        licensingLevel: "Fully Licensed",
        freeConsultation: true,
        city: "Toronto",
        province: "ON",
        country: "CA",
        specialties: [],
        modalities: ["in-person", "virtual"],
        therapeuticApproach: [],
        languages: [],
        ages: ["Adults", "Teen"],
        consentCommunitiesServed: true,
        participants: ["Individual", "Couples"],
        topSpecialties: [],
        faithOrientation: [],
        ethnicity: [],
        therapyStyle: ["Warm"],
        insurers: [],
        paymentMethods: ["e-Transfer"],
        rateIndividual: 150,
        proBono: false,
        reducedFees: false,
        acceptsInsurance: true,
        acceptingClients: true,
      },
    });

    console.log(`  Created: ${p.first} ${p.last} (${p.email})`);
  }

  console.log("Done! 5 test profiles seeded.");
}

async function clean(): Promise<void> {
  const users = await prisma.user.findMany({
    where: { email: { endsWith: `@${TEST_EMAIL_DOMAIN}` } },
    select: { id: true, email: true },
  });

  if (users.length === 0) {
    console.log("No test profiles found to clean up.");
    return;
  }

  // Delete profiles first (FK), then users
  await prisma.therapistProfile.deleteMany({
    where: { userId: { in: users.map((u) => u.id) } },
  });
  await prisma.user.deleteMany({
    where: { id: { in: users.map((u) => u.id) } },
  });

  console.log(`Cleaned up ${users.length} test profiles.`);
}

const isClean = process.argv.includes("--clean");

(isClean ? clean() : seed())
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error(err);
    return prisma.$disconnect();
  });
