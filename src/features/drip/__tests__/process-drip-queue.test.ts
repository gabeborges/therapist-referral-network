import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { PrismaClient } from "@/generated/prisma/client";

vi.mock("@/features/matching/match-referral-to-profiles", () => ({
  matchReferralToProfiles: vi.fn(),
}));
vi.mock("@/features/notifications/send-referral-batch", () => ({
  sendReferralBatch: vi.fn(),
}));
vi.mock("@/features/notifications/send-fulfillment-check", () => ({
  sendFulfillmentCheck: vi.fn(),
}));
vi.mock("@/features/notifications/send-expiry-notification", () => ({
  sendExpiryNotification: vi.fn(),
}));

import { processDripQueue } from "@/features/drip/process-drip-queue";
import { matchReferralToProfiles } from "@/features/matching/match-referral-to-profiles";
import { sendReferralBatch } from "@/features/notifications/send-referral-batch";
import { sendFulfillmentCheck } from "@/features/notifications/send-fulfillment-check";
import { sendExpiryNotification } from "@/features/notifications/send-expiry-notification";

const matchMock = matchReferralToProfiles as ReturnType<typeof vi.fn>;
const sendBatchMock = sendReferralBatch as ReturnType<typeof vi.fn>;
const sendCheckMock = sendFulfillmentCheck as ReturnType<typeof vi.fn>;
const sendExpiryMock = sendExpiryNotification as ReturnType<typeof vi.fn>;

type CheckRow = {
  id: string;
  sentAt: Date;
  respondedAt: Date | null;
  fulfilled: boolean | null;
};

type ReferralRow = {
  id: string;
  status: "OPEN" | "FULFILLED" | "EXPIRED" | "CANCELLED";
  currentBatch: number;
  lastDrippedAt: Date | null;
  fulfillmentChecks: CheckRow[];
};

function makeReferral(overrides: Partial<ReferralRow> = {}): ReferralRow {
  return {
    id: "ref-1",
    status: "OPEN",
    currentBatch: 0,
    lastDrippedAt: null,
    fulfillmentChecks: [],
    ...overrides,
  };
}

function makeCheck(overrides: Partial<CheckRow> = {}): CheckRow {
  return {
    id: "chk-1",
    sentAt: new Date(),
    respondedAt: null,
    fulfilled: null,
    ...overrides,
  };
}

function makePrisma(referrals: ReferralRow[]): {
  prisma: PrismaClient;
  updateMock: ReturnType<typeof vi.fn>;
} {
  const updateMock = vi.fn().mockResolvedValue(undefined);
  const prisma = {
    referralPost: {
      findMany: vi.fn().mockResolvedValue(referrals),
      update: updateMock,
    },
  } as unknown as PrismaClient;
  return { prisma, updateMock };
}

function hoursAgo(h: number): Date {
  return new Date(Date.now() - h * 60 * 60 * 1000);
}

describe("processDripQueue", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    delete process.env.DRIP_BATCH_SIZE;
    delete process.env.DRIP_MAX_BATCHES;
    delete process.env.DRIP_FOLLOWUP_HOURS;
    delete process.env.DRIP_CHECK_TIMEOUT_HOURS;
    matchMock.mockReset();
    sendBatchMock.mockReset();
    sendCheckMock.mockReset();
    sendExpiryMock.mockReset();
  });

  afterEach(() => {
    delete process.env.DRIP_BATCH_SIZE;
    delete process.env.DRIP_MAX_BATCHES;
    delete process.env.DRIP_FOLLOWUP_HOURS;
    delete process.env.DRIP_CHECK_TIMEOUT_HOURS;
  });

  // 2.2 first batch
  it("State 1: dispatches first batch when no batch sent yet", async () => {
    const referral = makeReferral({ currentBatch: 0, lastDrippedAt: null });
    const { prisma } = makePrisma([referral]);
    matchMock.mockResolvedValue([{ profileId: "t-1" }]);

    const summary = await processDripQueue(prisma);

    expect(sendBatchMock).toHaveBeenCalledOnce();
    expect(summary.batched).toBe(1);
    expect(summary.processed).toBe(1);
  });

  // 2.2 first batch skipped when no matches
  it("State 1: skips when no matches available on first batch", async () => {
    const referral = makeReferral({ currentBatch: 0, lastDrippedAt: null });
    const { prisma } = makePrisma([referral]);
    matchMock.mockResolvedValue([]);

    const summary = await processDripQueue(prisma);

    expect(sendBatchMock).not.toHaveBeenCalled();
    expect(summary.batched).toBe(0);
  });

  // 2.3 batch sent <24h ago → no action
  it("State 2: no action when batch was sent less than followupHours ago", async () => {
    const referral = makeReferral({
      currentBatch: 1,
      lastDrippedAt: hoursAgo(12),
      fulfillmentChecks: [],
    });
    const { prisma } = makePrisma([referral]);

    const summary = await processDripQueue(prisma);

    expect(sendBatchMock).not.toHaveBeenCalled();
    expect(sendCheckMock).not.toHaveBeenCalled();
    expect(summary.fulfillmentChecks).toBe(0);
    expect(summary.batched).toBe(0);
  });

  // 2.4 batch sent >24h ago, no check → send fulfillment check
  it("State 2: sends fulfillment check when batch is older than followupHours and no check exists", async () => {
    const referral = makeReferral({
      currentBatch: 1,
      lastDrippedAt: hoursAgo(25),
      fulfillmentChecks: [],
    });
    const { prisma } = makePrisma([referral]);

    const summary = await processDripQueue(prisma);

    expect(sendCheckMock).toHaveBeenCalledOnce();
    expect(summary.fulfillmentChecks).toBe(1);
    expect(sendBatchMock).not.toHaveBeenCalled();
  });

  // 2.5 explicit "no" → next batch
  it("State 3: sends next batch when latest check responded 'no'", async () => {
    const referral = makeReferral({
      currentBatch: 1,
      lastDrippedAt: hoursAgo(48),
      fulfillmentChecks: [
        makeCheck({
          sentAt: hoursAgo(24),
          respondedAt: hoursAgo(1),
          fulfilled: false,
        }),
      ],
    });
    const { prisma } = makePrisma([referral]);
    matchMock.mockResolvedValue([{ profileId: "t-2" }]);

    const summary = await processDripQueue(prisma);

    expect(sendBatchMock).toHaveBeenCalledOnce();
    expect(summary.batched).toBe(1);
    expect(sendCheckMock).not.toHaveBeenCalled();
  });

  // 2.6 pending check stale → implicit no, next batch
  it("State 3: sends next batch when pending check is older than checkTimeoutHours (implicit no)", async () => {
    const referral = makeReferral({
      currentBatch: 1,
      lastDrippedAt: hoursAgo(48),
      fulfillmentChecks: [
        makeCheck({
          sentAt: hoursAgo(25),
          respondedAt: null,
          fulfilled: null,
        }),
      ],
    });
    const { prisma } = makePrisma([referral]);
    matchMock.mockResolvedValue([{ profileId: "t-3" }]);

    const summary = await processDripQueue(prisma);

    expect(sendBatchMock).toHaveBeenCalledOnce();
    expect(summary.batched).toBe(1);
  });

  // 2.7 pending check fresh → no action
  it("State 3: no action when pending check is younger than checkTimeoutHours", async () => {
    const referral = makeReferral({
      currentBatch: 1,
      lastDrippedAt: hoursAgo(48),
      fulfillmentChecks: [
        makeCheck({
          sentAt: hoursAgo(12),
          respondedAt: null,
          fulfilled: null,
        }),
      ],
    });
    const { prisma } = makePrisma([referral]);

    const summary = await processDripQueue(prisma);

    expect(sendBatchMock).not.toHaveBeenCalled();
    expect(sendCheckMock).not.toHaveBeenCalled();
    expect(summary.batched).toBe(0);
  });

  // 2.7a tunables independence
  it("Window A and Window B are independent", async () => {
    process.env.DRIP_FOLLOWUP_HOURS = "48";
    process.env.DRIP_CHECK_TIMEOUT_HOURS = "12";

    // batch sent 49h ago, no check yet → followup window elapsed (48h) → send check
    const referralA = makeReferral({
      id: "ref-A",
      currentBatch: 1,
      lastDrippedAt: hoursAgo(49),
      fulfillmentChecks: [],
    });
    // batch sent 60h ago, check sent 13h ago, pending → check window elapsed (12h) → next batch
    const referralB = makeReferral({
      id: "ref-B",
      currentBatch: 1,
      lastDrippedAt: hoursAgo(60),
      fulfillmentChecks: [makeCheck({ sentAt: hoursAgo(13), respondedAt: null, fulfilled: null })],
    });
    // batch sent 30h ago, no check → followup (48h) NOT elapsed → no action
    const referralC = makeReferral({
      id: "ref-C",
      currentBatch: 1,
      lastDrippedAt: hoursAgo(30),
      fulfillmentChecks: [],
    });

    const { prisma } = makePrisma([referralA, referralB, referralC]);
    matchMock.mockResolvedValue([{ profileId: "t-x" }]);

    const summary = await processDripQueue(prisma);

    expect(sendCheckMock).toHaveBeenCalledTimes(1);
    expect(sendBatchMock).toHaveBeenCalledTimes(1);
    expect(summary.fulfillmentChecks).toBe(1);
    expect(summary.batched).toBe(1);
  });

  // 2.8 responded-no + no further matches → EXPIRED
  it("State 3: expires referral when no further matches exist after 'no' response", async () => {
    const referral = makeReferral({
      currentBatch: 2,
      lastDrippedAt: hoursAgo(48),
      fulfillmentChecks: [
        makeCheck({
          sentAt: hoursAgo(24),
          respondedAt: hoursAgo(1),
          fulfilled: false,
        }),
      ],
    });
    const { prisma, updateMock } = makePrisma([referral]);
    matchMock.mockResolvedValue([]);

    const summary = await processDripQueue(prisma);

    expect(updateMock).toHaveBeenCalledWith({
      where: { id: "ref-1" },
      data: { status: "EXPIRED" },
    });
    expect(sendExpiryMock).toHaveBeenCalledOnce();
    expect(summary.expired).toBe(1);
  });

  // 2.9 stale pending + no further matches → EXPIRED
  it("State 3: expires referral when no further matches exist after implicit-no timeout", async () => {
    const referral = makeReferral({
      currentBatch: 2,
      lastDrippedAt: hoursAgo(48),
      fulfillmentChecks: [
        makeCheck({
          sentAt: hoursAgo(25),
          respondedAt: null,
          fulfilled: null,
        }),
      ],
    });
    const { prisma, updateMock } = makePrisma([referral]);
    matchMock.mockResolvedValue([]);

    const summary = await processDripQueue(prisma);

    expect(updateMock).toHaveBeenCalledWith({
      where: { id: "ref-1" },
      data: { status: "EXPIRED" },
    });
    expect(sendExpiryMock).toHaveBeenCalledOnce();
    expect(summary.expired).toBe(1);
  });

  // 2.10 maxBatches reached → EXPIRED regardless of check state
  it("State 4: expires referral when currentBatch >= maxBatches", async () => {
    const referral = makeReferral({
      currentBatch: 5,
      lastDrippedAt: hoursAgo(48),
      fulfillmentChecks: [makeCheck({ sentAt: hoursAgo(24), respondedAt: null, fulfilled: null })],
    });
    const { prisma, updateMock } = makePrisma([referral]);

    const summary = await processDripQueue(prisma);

    expect(updateMock).toHaveBeenCalledWith({
      where: { id: "ref-1" },
      data: { status: "EXPIRED" },
    });
    expect(sendExpiryMock).toHaveBeenCalledOnce();
    expect(sendBatchMock).not.toHaveBeenCalled();
    expect(sendCheckMock).not.toHaveBeenCalled();
    expect(summary.expired).toBe(1);
  });

  // 2.11 silent therapist scenario — simulate ticks, ensure EXPIRED reached
  it("guarantees EXPIRED for silent therapists within bounded ticks", async () => {
    // Simulate the worst case: every check stays pending until it times out.
    // We model each cron tick by advancing state manually and re-running.

    let currentBatch = 0;
    let lastDrippedAt: Date | null = null;
    let checks: CheckRow[] = [];
    let status: "OPEN" | "EXPIRED" = "OPEN";

    const MAX_BATCHES = 5;
    const FOLLOWUP_H = 24;
    const CHECK_TIMEOUT_H = 24;

    // helper: simulate effects when sendReferralBatch / sendFulfillmentCheck would have fired
    sendBatchMock.mockImplementation(async () => {
      currentBatch += 1;
      lastDrippedAt = new Date();
      checks = [];
    });
    sendCheckMock.mockImplementation(async () => {
      checks = [makeCheck({ id: `chk-${currentBatch}`, sentAt: new Date() })];
    });
    matchMock.mockResolvedValue([{ profileId: "t-z" }]);

    let ticks = 0;
    const MAX_TICKS = 100; // safety

    while (status === "OPEN" && ticks < MAX_TICKS) {
      ticks += 1;
      const referral = makeReferral({
        id: "loop-ref",
        currentBatch,
        lastDrippedAt,
        fulfillmentChecks: checks,
      });
      const { prisma } = makePrisma([referral]);

      // Hack: each iteration we age timestamps by simulating a tick
      // by replacing the prisma update side effect for EXPIRED.
      (prisma.referralPost.update as ReturnType<typeof vi.fn>).mockImplementation(
        async (args: { where: { id: string }; data: { status: string } }) => {
          if (args.data.status === "EXPIRED") status = "EXPIRED";
        },
      );

      await processDripQueue(prisma);

      // Age all timestamps by 24h to simulate the next cron tick
      if (lastDrippedAt)
        lastDrippedAt = new Date(lastDrippedAt.getTime() - FOLLOWUP_H * 60 * 60 * 1000);
      checks = checks.map((c) => ({
        ...c,
        sentAt: new Date(c.sentAt.getTime() - CHECK_TIMEOUT_H * 60 * 60 * 1000),
      }));
    }

    expect(status).toBe("EXPIRED");
    // Worst-case bound: every advance can take up to ~2 ticks (check tick + next-batch tick),
    // plus the first-batch tick and the final expiry tick. Add slack for sub-ms drift
    // between mock-created Dates and processDripQueue's `now`.
    expect(ticks).toBeLessThanOrEqual(4 * MAX_BATCHES);
  });
});
