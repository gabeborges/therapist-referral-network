/**
 * E2E Referral Test Script
 *
 * Seeds test therapist profiles, creates a referral, and runs the matching/drip flow.
 *
 * Usage:
 *   npx tsx scripts/test-referral-e2e.ts           # dry-run (matching only, no emails)
 *   npx tsx scripts/test-referral-e2e.ts --send     # full flow with email sending
 *   npx tsx scripts/test-referral-e2e.ts --keep     # skip cleanup, inspect data in Prisma Studio
 */

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

// ─── CLI Flags ───────────────────────────────────────────────────────────────

const flags = {
  send: process.argv.includes("--send"),
  keep: process.argv.includes("--keep"),
};

// ─── Prisma Client ───────────────────────────────────────────────────────────

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ─── Test Data Constants ─────────────────────────────────────────────────────

const PREFIX = "e2e-test";

const TEST_USERS = [
  { id: `${PREFIX}-user-author`, email: `${PREFIX}-author@test.local`, name: "E2E Author" },
  { id: `${PREFIX}-user-good`, email: `${PREFIX}-good@test.local`, name: "E2E Good Match" },
  {
    id: `${PREFIX}-user-partial`,
    email: `${PREFIX}-partial@test.local`,
    name: "E2E Partial Match",
  },
  { id: `${PREFIX}-user-poor`, email: `${PREFIX}-poor@test.local`, name: "E2E Poor Match" },
] as const;

const TEST_PROFILES = [
  {
    id: `${PREFIX}-profile-author`,
    userId: TEST_USERS[0].id,
    firstName: "Author",
    lastName: "Therapist",
    displayName: "Author Therapist",
    city: "Toronto",
    province: "ON",
    country: "CA",
    specialties: ["Anxiety"],
    modalities: ["virtual"],
    ages: ["Adults"],
    therapeuticApproach: ["Cognitive Behavioural (CBT)"],
    languages: ["English"],
    participants: ["Individual"],
    acceptingClients: true,
    bio: "E2E test author profile",
    insurers: [],
    topSpecialties: ["Anxiety"],
    paymentMethods: [],
  },
  {
    id: `${PREFIX}-profile-good`,
    userId: TEST_USERS[1].id,
    firstName: "Good",
    lastName: "Match",
    displayName: "Good Match",
    city: "Toronto",
    province: "ON",
    country: "CA",
    specialties: ["Anxiety", "Depression"],
    modalities: ["virtual", "phone"],
    ages: ["Adults", "Teen"],
    therapeuticApproach: ["Cognitive Behavioural (CBT)", "EMDR"],
    languages: ["English", "French"],
    participants: ["Individual", "Couples"],
    acceptingClients: true,
    bio: "E2E test good match — same city, same specialty, same modality",
    insurers: ["Sun Life"],
    topSpecialties: ["Anxiety", "Depression"],
    paymentMethods: ["Visa"],
  },
  {
    id: `${PREFIX}-profile-partial`,
    userId: TEST_USERS[2].id,
    firstName: "Partial",
    lastName: "Match",
    displayName: "Partial Match",
    city: "Ottawa",
    province: "ON",
    country: "CA",
    specialties: ["Grief", "Anxiety"],
    modalities: ["in-person", "virtual"],
    ages: ["Adults", "Teen"],
    therapeuticApproach: ["EMDR"],
    languages: ["English"],
    participants: ["Individual"],
    acceptingClients: true,
    bio: "E2E test partial match — same province, different city",
    insurers: [],
    topSpecialties: ["Grief"],
    paymentMethods: [],
  },
  {
    id: `${PREFIX}-profile-poor`,
    userId: TEST_USERS[3].id,
    firstName: "Poor",
    lastName: "Match",
    displayName: "Poor Match",
    city: "Vancouver",
    province: "BC",
    country: "CA",
    specialties: ["Career Guidance"],
    modalities: ["in-person"],
    ages: ["Adults"],
    therapeuticApproach: ["Coaching"],
    languages: ["English"],
    participants: ["Individual"],
    acceptingClients: true,
    bio: null,
    insurers: [],
    topSpecialties: [],
    paymentMethods: [],
  },
];

const TEST_REFERRAL = {
  id: `${PREFIX}-referral`,
  slug: `${PREFIX}-referral-slug`,
  presentingIssue: "Anxiety",
  ageGroup: ["Adults"],
  city: "Toronto",
  province: "ON",
  modalities: ["virtual"],
  details: "E2E test referral — looking for an anxiety specialist in Toronto for virtual sessions.",
  participants: ["Individual"],
  therapyTypes: [],
  languages: [],
  insuranceRequired: false,
  rate: null,
  therapistGenderPref: null,
  additionalContext: null,
} as const;

// ─── Seed Functions ──────────────────────────────────────────────────────────

async function seedUsers(): Promise<void> {
  for (const user of TEST_USERS) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: { email: user.email, name: user.name },
      create: { id: user.id, email: user.email, name: user.name },
    });
  }
}

async function seedProfiles(): Promise<void> {
  for (const profile of TEST_PROFILES) {
    await prisma.therapistProfile.upsert({
      where: { id: profile.id },
      update: {
        firstName: profile.firstName,
        lastName: profile.lastName,
        displayName: profile.displayName,
        city: profile.city,
        province: profile.province,
        country: profile.country,
        specialties: profile.specialties,
        modalities: profile.modalities,
        ages: profile.ages,
        therapeuticApproach: profile.therapeuticApproach,
        languages: profile.languages,
        participants: profile.participants,
        acceptingClients: profile.acceptingClients,
        bio: profile.bio,
        insurers: profile.insurers,
        topSpecialties: profile.topSpecialties,
        paymentMethods: profile.paymentMethods,
        lastActiveAt: new Date(), // fresh activity for good decay score
      },
      create: {
        id: profile.id,
        userId: profile.userId,
        firstName: profile.firstName,
        lastName: profile.lastName,
        displayName: profile.displayName,
        city: profile.city,
        province: profile.province,
        country: profile.country,
        specialties: [...profile.specialties],
        modalities: [...profile.modalities],
        ages: [...profile.ages],
        therapeuticApproach: [...profile.therapeuticApproach],
        languages: [...profile.languages],
        participants: [...profile.participants],
        acceptingClients: profile.acceptingClients,
        bio: profile.bio,
        insurers: [...profile.insurers],
        topSpecialties: [...profile.topSpecialties],
        paymentMethods: [...profile.paymentMethods],
        lastActiveAt: new Date(),
      },
    });
  }
}

async function seedReferral(): Promise<void> {
  // Delete existing test referral first (slug is unique)
  await prisma.referralPost.deleteMany({
    where: { id: TEST_REFERRAL.id },
  });

  await prisma.referralPost.create({
    data: {
      id: TEST_REFERRAL.id,
      slug: TEST_REFERRAL.slug,
      authorId: TEST_PROFILES[0]!.id,
      presentingIssue: TEST_REFERRAL.presentingIssue,
      ageGroup: [...TEST_REFERRAL.ageGroup],
      city: TEST_REFERRAL.city,
      province: TEST_REFERRAL.province,
      modalities: [...TEST_REFERRAL.modalities],
      details: TEST_REFERRAL.details,
      participants: [...TEST_REFERRAL.participants],
      therapyTypes: [...TEST_REFERRAL.therapyTypes],
      languages: [...TEST_REFERRAL.languages],
      insuranceRequired: TEST_REFERRAL.insuranceRequired,
      rate: TEST_REFERRAL.rate,
      therapistGenderPref: TEST_REFERRAL.therapistGenderPref,
      additionalContext: TEST_REFERRAL.additionalContext,
      status: "OPEN",
      currentBatch: 0,
      lastDrippedAt: null,
    },
  });
}

// ─── Cleanup ─────────────────────────────────────────────────────────────────

async function cleanup(): Promise<void> {
  // Cascade: User → TherapistProfile → ReferralPost → ReferralNotification/FulfillmentCheck
  await prisma.user.deleteMany({
    where: { id: { in: TEST_USERS.map((u) => u.id) } },
  });
}

// ─── Formatting ──────────────────────────────────────────────────────────────

function dim(text: string): string {
  return `\x1b[2m${text}\x1b[0m`;
}

function bold(text: string): string {
  return `\x1b[1m${text}\x1b[0m`;
}

function green(text: string): string {
  return `\x1b[32m${text}\x1b[0m`;
}

function red(text: string): string {
  return `\x1b[31m${text}\x1b[0m`;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const mode = flags.send ? "send (full drip + emails)" : "dry-run (matching only, no emails)";
  console.log(`\n${bold("=== E2E Referral Test ===")}`);
  console.log(`Mode: ${mode}\n`);

  if (flags.send && !process.env.RESEND_API_KEY) {
    console.error("ERROR: --send requires RESEND_API_KEY in .env.local");
    console.error("Tip: use a Resend test key (re_test_...) to avoid sending real emails.");
    process.exit(1);
  }

  // 1. Seed users
  process.stdout.write("[1/4] Seeding test users... ");
  await seedUsers();
  console.log(`done (${TEST_USERS.length} users)`);

  // 2. Seed profiles
  process.stdout.write("[2/4] Seeding test profiles... ");
  await seedProfiles();
  console.log(`done (${TEST_PROFILES.length} profiles)`);

  // 3. Create referral
  process.stdout.write("[3/4] Creating test referral... ");
  await seedReferral();
  console.log("done");

  // 4. Run matching or full drip
  console.log("[4/4] Running " + (flags.send ? "full drip processor..." : "matching..."));

  if (flags.send) {
    // Dynamic import to avoid resend.ts throwing when RESEND_API_KEY is not set
    const { processDripQueue } = await import("../src/features/drip/process-drip-queue");
    const summary = await processDripQueue(prisma);

    console.log(`\n${bold("--- Drip Summary ---")}`);
    console.log(`  Processed: ${summary.processed}`);
    console.log(`  Batched:   ${summary.batched}`);
    console.log(`  Checks:    ${summary.fulfillmentChecks}`);
    console.log(`  Expired:   ${summary.expired}`);

    // Show notifications created
    const notifications = await prisma.referralNotification.findMany({
      where: { referralPostId: TEST_REFERRAL.id },
      include: { recipient: { include: { user: { select: { email: true } } } } },
    });

    console.log(`\n${bold("--- Notifications Sent ---")}`);
    if (notifications.length === 0) {
      console.log("  (none)");
    } else {
      for (const n of notifications) {
        console.log(
          `  Batch ${n.batch}: ${n.recipient.displayName} (${n.recipient.user.email}) ${dim(`emailId=${n.emailId ?? "n/a"}`)}`,
        );
      }
    }
  } else {
    // Dry-run: only run matching
    const { matchReferralToProfiles } =
      await import("../src/features/matching/match-referral-to-profiles");

    const referral = await prisma.referralPost.findUniqueOrThrow({
      where: { id: TEST_REFERRAL.id },
    });

    const matches = await matchReferralToProfiles(referral, prisma, 10);

    // Look up display info for matched profiles
    const profiles = await prisma.therapistProfile.findMany({
      where: { id: { in: matches.map((m) => m.profileId) } },
      include: { user: { select: { email: true } } },
    });
    const profileMap = new Map(profiles.map((p) => [p.id, p]));

    console.log(`\n${bold("--- Match Results ---")}`);
    if (matches.length === 0) {
      console.log("  (no matches found)");
    } else {
      for (let i = 0; i < matches.length; i++) {
        const m = matches[i]!;
        const p = profileMap.get(m.profileId);
        const d = m.matchDimensions;

        const dims = [
          `specialty ${d.specialty ? green("✓") : red("✗")}`,
          `ageGroup ${d.ageGroup ? green("✓") : red("✗")}`,
          `modality ${d.modality ? green("✓") : red("✗")}`,
          `location ${d.location ? green("✓") : red("✗")}`,
        ].join(" | ");

        console.log(
          `  #${i + 1}  ${bold(p?.displayName ?? m.profileId)} ${dim(`(${p?.user.email ?? "?"})`)}`,
        );
        console.log(`      Score: ${m.score} | ${dims}`);
      }
    }
  }

  // Cleanup
  if (flags.keep) {
    console.log(`\n${dim("Skipping cleanup (--keep). Inspect data with: npx prisma studio")}`);
  } else {
    process.stdout.write("\nCleaning up test data... ");
    await cleanup();
    console.log("done");
  }

  console.log(`\n${bold("=== Complete ===")}\n`);
}

main()
  .catch((e) => {
    console.error("\nScript failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
