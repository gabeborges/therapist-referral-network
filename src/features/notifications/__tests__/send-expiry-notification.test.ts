import { describe, expect, it, vi, beforeEach } from "vitest";
import type { PrismaClient } from "@/generated/prisma/client";
import type { ReferralPostModel } from "@/generated/prisma/models/ReferralPost";
import { sendExpiryNotification } from "@/features/notifications/send-expiry-notification";

vi.mock("@/lib/email/resend", () => ({
  resend: {
    emails: {
      send: vi.fn().mockResolvedValue({ data: { id: "email_123" }, error: null }),
    },
  },
}));

import { resend } from "@/lib/email/resend";

const mockSend = resend.emails.send as ReturnType<typeof vi.fn>;

function createMockReferral(overrides: Partial<ReferralPostModel> = {}): ReferralPostModel {
  return {
    id: "ref-1",
    authorId: "author-1",
    presentingIssue: "Anxiety & PTSD",
    city: "Toronto",
    province: "ON",
    currentBatch: 3,
    status: "EXPIRED",
    ...overrides,
  } as ReferralPostModel;
}

function createMockPrisma(therapistsNotified = 15) {
  return {
    therapistProfile: {
      findUniqueOrThrow: vi.fn().mockResolvedValue({
        firstName: "Sarah",
        lastName: "Chen",
        user: { email: "sarah@example.com", name: "Dr. Sarah Chen" },
      }),
    },
    referralNotification: {
      count: vi.fn().mockResolvedValue(therapistsNotified),
    },
  } as unknown as PrismaClient;
}

describe("sendExpiryNotification", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockSend.mockResolvedValue({ data: { id: "email_123" }, error: null });
  });

  it("sends an expiry email with correct args", async () => {
    const prisma = createMockPrisma(15);
    const referral = createMockReferral();

    await sendExpiryNotification(referral, prisma);

    expect(mockSend).toHaveBeenCalledOnce();
    const call = mockSend.mock.calls[0]![0];
    expect(call.to).toBe("sarah@example.com");
    expect(call.subject).toBe("Your referral has expired");
    expect(call.react).toBeDefined();
  });

  it("counts therapists notified for the specific referral", async () => {
    const prisma = createMockPrisma(8);
    const referral = createMockReferral({ id: "ref-42" });

    await sendExpiryNotification(referral, prisma);

    expect(prisma.referralNotification.count).toHaveBeenCalledWith({
      where: { referralPostId: "ref-42" },
    });
  });

  it("does not throw when Resend returns an error", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockSend.mockResolvedValue({ data: null, error: { message: "Rate limited" } });

    const prisma = createMockPrisma();
    const referral = createMockReferral();

    await expect(sendExpiryNotification(referral, prisma)).resolves.toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledOnce();

    consoleSpy.mockRestore();
  });
});
