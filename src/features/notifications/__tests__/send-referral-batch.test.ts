import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import type { PrismaClient } from "@/generated/prisma/client";
import type { ReferralPostModel } from "@/generated/prisma/models/ReferralPost";
import type { ProfileMatch } from "@/features/matching/match-referral-to-profiles";
import { sendReferralBatch } from "@/features/notifications/send-referral-batch";

vi.mock("@/lib/email/resend", () => ({
  resend: { emails: { send: vi.fn() } },
}));

import { resend } from "@/lib/email/resend";
import { __resetEmailThrottleForTests } from "@/lib/email/send-with-retry";

const mockSend = resend.emails.send as ReturnType<typeof vi.fn>;

const SUCCESS = { data: { id: "email_1" }, error: null };
const NON_RETRYABLE = { data: null, error: { name: "validation_error", message: "bad" } };

const matches = [{ profileId: "p1" }, { profileId: "p2" }] as unknown as ProfileMatch[];

function createMockReferral(overrides: Partial<ReferralPostModel> = {}): ReferralPostModel {
  return {
    id: "ref-1",
    authorId: "author-1",
    slug: "ref-slug",
    presentingIssue: "Anxiety",
    ageGroup: ["Adults"],
    city: "Toronto",
    province: "ON",
    modalities: ["virtual"],
    details: null,
    currentBatch: 0,
    ...overrides,
  } as unknown as ReferralPostModel;
}

function createMockPrisma(): PrismaClient {
  const author = {
    id: "author-1",
    firstName: "Sarah",
    lastName: "Chen",
    contactEmail: "contact@example.com",
    pronouns: "she/her",
    websiteUrl: null,
    psychologyTodayUrl: null,
    user: { email: "author@example.com" },
  };
  const recipients = [
    { id: "p1", user: { email: "p1@example.com" } },
    { id: "p2", user: { email: "p2@example.com" } },
  ];
  return {
    therapistProfile: {
      findUniqueOrThrow: vi.fn().mockResolvedValue(author),
      findMany: vi.fn().mockResolvedValue(recipients),
    },
    referralNotification: { create: vi.fn().mockResolvedValue({}) },
    referralPost: { update: vi.fn().mockResolvedValue({}) },
  } as unknown as PrismaClient;
}

describe("sendReferralBatch", () => {
  beforeEach(() => {
    mockSend.mockReset();
    __resetEmailThrottleForTests();
    mockSend.mockResolvedValue(SUCCESS);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("sends to every matched recipient and records each notification", async () => {
    const prisma = createMockPrisma();

    const sent = await sendReferralBatch(createMockReferral(), matches, prisma);

    expect(sent).toBe(2);
    expect(mockSend).toHaveBeenCalledTimes(2);
    expect(prisma.referralNotification.create).toHaveBeenCalledTimes(2);
    expect(prisma.referralPost.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ currentBatch: 1 }) }),
    );
  });

  it("passes from + replyTo (support inbox) on each send", async () => {
    vi.stubEnv("SUPPORT_EMAIL", "support@therapistreferralnetwork.com");
    const prisma = createMockPrisma();

    await sendReferralBatch(createMockReferral(), matches, prisma);

    const call = mockSend.mock.calls[0]![0];
    expect(call.from).toBeDefined();
    expect(call.replyTo).toBe("support@therapistreferralnetwork.com");
  });

  it("skips a failed recipient but still advances when others succeed", async () => {
    const prisma = createMockPrisma();
    mockSend.mockResolvedValueOnce(NON_RETRYABLE).mockResolvedValueOnce(SUCCESS);

    const sent = await sendReferralBatch(createMockReferral(), matches, prisma);

    expect(sent).toBe(1);
    expect(prisma.referralNotification.create).toHaveBeenCalledTimes(1);
    expect(prisma.referralPost.update).toHaveBeenCalledOnce();
  });

  it("does NOT advance batch tracking when every send fails", async () => {
    const prisma = createMockPrisma();
    mockSend.mockResolvedValue(NON_RETRYABLE);

    const sent = await sendReferralBatch(createMockReferral(), matches, prisma);

    expect(sent).toBe(0);
    expect(prisma.referralNotification.create).not.toHaveBeenCalled();
    expect(prisma.referralPost.update).not.toHaveBeenCalled();
  });
});
