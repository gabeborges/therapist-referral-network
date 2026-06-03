import { resend } from "@/lib/email/resend";

/**
 * Rate-limit-aware wrapper around `resend.emails.send`.
 *
 * Resend enforces a default limit of 5 requests/second per *team* (shared
 * across every API key). The daily drip cron drains the whole referral queue
 * in one sequential sweep, so without pacing it bursts past that limit and
 * Resend returns `429 rate_limit_exceeded` — and the bare `resend.emails.send`
 * callers used to drop those emails silently (`if (error) continue`).
 *
 * Two layers of protection:
 *   1. Proactive throttle — serializes sends with a minimum gap between
 *      dispatches (default 250ms ≈ 4 req/s). This is the PRIMARY control.
 *   2. Reactive retry — on a rate-limit response (or a thrown transport
 *      error), retry with exponential backoff + jitter.
 *
 * Resend contract (verified against Resend docs, 2026-06):
 *   - `emails.send` resolves to `{ data, error }` and does NOT throw on 429;
 *     the rate-limit case is `error.name === "rate_limit_exceeded"`.
 *   - The resolved value does not expose response headers, so `ratelimit-reset`
 *     / `Retry-After` are unavailable — backoff is computed blindly.
 *
 * Tunables (read from env per call so tests can override):
 *   - RESEND_SEND_MIN_INTERVAL_MS  (prod default 250)
 *   - RESEND_SEND_MAX_RETRIES      (default 4)
 *   - RESEND_SEND_BACKOFF_BASE_MS  (prod default 500)
 */

type SendPayload = Parameters<typeof resend.emails.send>[0];
type SendResult = Awaited<ReturnType<typeof resend.emails.send>>;

const RATE_LIMIT_ERROR = "rate_limit_exceeded";

function isTestEnv(): boolean {
  return process.env.VITEST !== undefined || process.env.NODE_ENV === "test";
}

function numEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

function readConfig(): { minIntervalMs: number; maxRetries: number; backoffBaseMs: number } {
  const test = isTestEnv();
  return {
    minIntervalMs: numEnv("RESEND_SEND_MIN_INTERVAL_MS", test ? 0 : 250),
    maxRetries: numEnv("RESEND_SEND_MAX_RETRIES", 4),
    backoffBaseMs: numEnv("RESEND_SEND_BACKOFF_BASE_MS", test ? 1 : 500),
  };
}

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

// ── Proactive throttle ──────────────────────────────────────────────────────
// A single promise chain serializes spacing across all concurrent callers so
// dispatches are at least `minIntervalMs` apart. Module-level state is the
// correct scope: the drip cron is one serverless invocation.
let gate: Promise<void> = Promise.resolve();
let lastDispatchAt = 0;

function waitForSlot(minIntervalMs: number): Promise<void> {
  const run = gate.then(async () => {
    const wait = Math.max(0, lastDispatchAt + minIntervalMs - Date.now());
    if (wait > 0) await sleep(wait);
    lastDispatchAt = Date.now();
  });
  // Keep the chain alive even if a slot wait somehow rejects.
  gate = run.catch(() => {});
  return run;
}

function isRateLimit(error: SendResult["error"]): boolean {
  return !!error && (error as { name?: string }).name === RATE_LIMIT_ERROR;
}

function backoffMs(attempt: number, baseMs: number): number {
  const expo = baseMs * 2 ** attempt;
  const jitter = expo * 0.25 * Math.random();
  return expo + jitter;
}

/**
 * Sends an email through Resend with throttling + retry. Returns the same
 * `{ data, error }` shape as `resend.emails.send`, so existing callers keep
 * their `if (error) { ... }` handling. Never throws for ordinary send
 * failures — a final transport error is normalized into the `error` field
 * (with the underlying cause folded into the message; no PHI).
 */
export async function sendEmailWithRetry(payload: SendPayload): Promise<SendResult> {
  const { minIntervalMs, maxRetries, backoffBaseMs } = readConfig();

  for (let attempt = 0; ; attempt++) {
    await waitForSlot(minIntervalMs);

    let result: SendResult;
    try {
      result = await resend.emails.send(payload);
    } catch (err) {
      // Network/transport failure — retry, then normalize to an error result.
      if (attempt < maxRetries) {
        await sleep(backoffMs(attempt, backoffBaseMs));
        continue;
      }
      const cause = err instanceof Error ? err.message : String(err);
      return {
        data: null,
        error: {
          name: "application_error",
          message: `Email send failed after ${attempt + 1} attempts: ${cause}`,
        },
      } as SendResult;
    }

    // Retry on rate-limit until the budget is exhausted, then return the
    // error result so the caller can log + skip as before.
    if (isRateLimit(result.error) && attempt < maxRetries) {
      await sleep(backoffMs(attempt, backoffBaseMs));
      continue;
    }

    return result;
  }
}

/** Test-only: reset the proactive-throttle state between cases. */
export function __resetEmailThrottleForTests(): void {
  gate = Promise.resolve();
  lastDispatchAt = 0;
}
