import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/lib/email/resend", () => ({
  resend: { emails: { send: vi.fn() } },
}));

import { resend } from "@/lib/email/resend";
import { sendEmailWithRetry, __resetEmailThrottleForTests } from "@/lib/email/send-with-retry";

const mockSend = resend.emails.send as ReturnType<typeof vi.fn>;

const SUCCESS = { data: { id: "email_1" }, error: null };
const RATE_LIMIT = {
  data: null,
  error: { name: "rate_limit_exceeded", message: "Too many requests" },
};
const PAYLOAD = { from: "f@x.com", to: "t@x.com", subject: "s", text: "b" };

describe("sendEmailWithRetry", () => {
  beforeEach(() => {
    mockSend.mockReset();
    __resetEmailThrottleForTests();
    vi.stubEnv("RESEND_SEND_MIN_INTERVAL_MS", "0");
    vi.stubEnv("RESEND_SEND_BACKOFF_BASE_MS", "0");
    mockSend.mockResolvedValue(SUCCESS);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.useRealTimers();
  });

  it("returns the success result and sends once", async () => {
    const result = await sendEmailWithRetry(PAYLOAD);
    expect(result).toEqual(SUCCESS);
    expect(mockSend).toHaveBeenCalledOnce();
  });

  it("retries on rate_limit_exceeded then succeeds", async () => {
    vi.stubEnv("RESEND_SEND_MAX_RETRIES", "3");
    mockSend
      .mockResolvedValueOnce(RATE_LIMIT)
      .mockResolvedValueOnce(RATE_LIMIT)
      .mockResolvedValue(SUCCESS);

    const result = await sendEmailWithRetry(PAYLOAD);

    expect(mockSend).toHaveBeenCalledTimes(3);
    expect(result).toEqual(SUCCESS);
  });

  it("gives up after maxRetries and returns the rate-limit error", async () => {
    vi.stubEnv("RESEND_SEND_MAX_RETRIES", "2");
    mockSend.mockResolvedValue(RATE_LIMIT);

    const result = await sendEmailWithRetry(PAYLOAD);

    expect(mockSend).toHaveBeenCalledTimes(3); // initial + 2 retries
    expect(result.error?.name).toBe("rate_limit_exceeded");
  });

  it("retries a thrown transport error then succeeds", async () => {
    vi.stubEnv("RESEND_SEND_MAX_RETRIES", "2");
    mockSend.mockRejectedValueOnce(new Error("ECONNRESET")).mockResolvedValue(SUCCESS);

    const result = await sendEmailWithRetry(PAYLOAD);

    expect(mockSend).toHaveBeenCalledTimes(2);
    expect(result).toEqual(SUCCESS);
  });

  it("normalizes a persistent transport error into an application_error result", async () => {
    vi.stubEnv("RESEND_SEND_MAX_RETRIES", "1");
    mockSend.mockRejectedValue(new Error("ECONNRESET"));

    const result = await sendEmailWithRetry(PAYLOAD);

    expect(mockSend).toHaveBeenCalledTimes(2); // initial + 1 retry
    expect(result.data).toBeNull();
    expect(result.error?.name).toBe("application_error");
    expect(result.error?.message).toContain("ECONNRESET");
  });

  it("spaces consecutive dispatches by the min interval", async () => {
    vi.useFakeTimers();
    vi.stubEnv("RESEND_SEND_MIN_INTERVAL_MS", "100");
    __resetEmailThrottleForTests();
    mockSend.mockResolvedValue(SUCCESS);

    const p1 = sendEmailWithRetry({ ...PAYLOAD, to: "a@x.com" });
    const p2 = sendEmailWithRetry({ ...PAYLOAD, to: "b@x.com" });
    const p3 = sendEmailWithRetry({ ...PAYLOAD, to: "c@x.com" });

    await vi.advanceTimersByTimeAsync(0);
    expect(mockSend).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(100);
    expect(mockSend).toHaveBeenCalledTimes(2);

    await vi.advanceTimersByTimeAsync(100);
    expect(mockSend).toHaveBeenCalledTimes(3);

    await Promise.all([p1, p2, p3]);
  });
});
