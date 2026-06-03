# Email Deliverability & Rate-Limit Fix Plan

**Status:** T-001 + T-002 IMPLEMENTED (code + tests, preflight green). T-003 (DNS/env) is yours — see "Remaining manual steps".
**Date:** 2026-06-03
**Provider:** Resend (`resend ^6.9.4`), Next.js 15.5.14, Vercel cron.

## Remaining manual steps (no code)

1. **Vercel env:** set `RESEND_FROM_EMAIL=referrals@therapistreferralnetwork.com`; confirm `SUPPORT_EMAIL` is set (used as `replyTo`, and the DMARC `rua=` address). Confirm the `referrals@` mailbox exists/forwards.
2. **DNS:** add `_dmarc.therapistreferralnetwork.com` TXT → `v=DMARC1; p=none; rua=mailto:<SUPPORT_EMAIL>`. Confirm Resend SPF/DKIM records pass in the Resend domain dashboard. Tighten `p=none → quarantine → reject` after monitoring `rua` reports.
3. **Optional fast-follow:** switch `send-referral-batch` to `resend.batch.send` (5 sends → 1 request) if volume grows.

### What shipped (T-001 + T-002)

- **NEW** `src/lib/email/send-with-retry.ts` — throttle (≥250ms ≈4 req/s) + blind exp-backoff retry on `error.name === "rate_limit_exceeded"` / transport throw.
- All three notification senders route through it and set `replyTo: getSupportEmail()` (inline, call-time).
- `send-referral-batch` no longer advances `currentBatch`/`lastDrippedAt` when every send fails (`sentCount === 0`).
- **NEW** `getSupportEmail()` in `src/lib/env.ts`.
- Tests: new `send-with-retry.test.ts` + `send-referral-batch.test.ts`; updated `send-expiry-notification.test.ts`. Preflight: typecheck + lint + full suite (211) all green.

---

## TL;DR

The three dashboard errors are **two distinct failure modes**:

| #   | Symptom                    | Layer                                                              | Root cause                                                                                                                                                                       | Fix type                |
| --- | -------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| A   | `429 rate limit` (5 req/s) | **Send-side** — Resend API rejects the request, email never leaves | No throttling, no retry, no backoff anywhere in the send path. Daily cron drains the whole queue in one sequential burst. On 429 the code silently drops the email (`continue`). | **Code**                |
| B   | `No DMARC record found`    | **Inbox-side** — Gmail/Yahoo/Microsoft reject or spam-folder       | `therapistreferralnetwork.com` has no `_dmarc` TXT record (required by 2024 bulk-sender rules).                                                                                  | **DNS**                 |
| C   | `Don't use "no-reply"`     | **Inbox-side** — reputation/trust penalty                          | `RESEND_FROM_EMAIL=noreply@therapistreferralnetwork.com`; no `replyTo` on notification emails.                                                                                   | **Config + small code** |

A is why notifications "bounce" (never arrive). B and C degrade deliverability of the ones that _do_ send.

---

## Evidence / execution trace (failure mode A)

Entry → cron → queue → senders:

1. **`vercel.json`** — drip cron schedule is `"0 9 * * *"` → **once per day at 09:00**. The entire open-referral backlog is processed in a single invocation.
2. **`src/app/api/cron/drip/route.ts:33`** → `processDripQueue(prisma)`. Advisory lock prevents _concurrent_ runs but does nothing to pace API calls _within_ a run.
3. **`src/features/drip/process-drip-queue.ts:123`** — `for (const referral of openReferrals)` loops over **every** OPEN referral with **no inter-referral delay**. Each iteration may fire a batch send, a fulfillment check, or an expiry email.
4. **`src/features/notifications/send-referral-batch.ts:53-97`** — `for (const match of matchedProfiles)` calls `resend.emails.send()` **once per recipient** (up to `DRIP_BATCH_SIZE`, default 5), sequential, **no delay, no retry**.
   - **`:79-85`** — on error: `console.error(...); continue;` → **email permanently dropped**, never retried.
   - **`:100-106`** — `currentBatch` / `lastDrippedAt` are bumped **regardless** of how many sends actually succeeded → dropped recipients are never retried and the referral advances anyway.
5. **`src/features/notifications/send-fulfillment-check.ts:44`** and **`send-expiry-notification.ts:32`** — each one `resend.emails.send()`, error logged only.
6. **`src/lib/email/resend.ts:7`** — bare `new Resend(...)` client; no wrapper, no limiter, no retry.

### Burst math

Resend default limit = **5 req/s** (account-wide). At 09:00 a modest backlog — e.g. 10 new referrals (×5 = 50 sends) + 20 in follow-up (20 checks) + a few expiring — fires **70+ sequential `resend.emails.send` calls back-to-back**. Sequential awaited sends at ~150 ms each ≈ 6–7 req/s, already over the limit, with zero jitter or pacing → sustained 429s → dropped emails. The observed 429s confirm the burst exceeds 5 req/s; the code has **no protection**, so any burst over the limit loses mail.

---

## Proposed plan

> ⚠️ **First implementation step:** verify current Resend API surface via **context7** (`resend.batch.send` signature with `react`, rate-limit error shape / `Retry-After` exposure in v6.9.x) before writing code — per project rule.

### Workstream 1 — Code: throttle + retry (fixes A) — **primary**

Create a shared send helper so all three senders inherit pacing + recovery, instead of patching each loop.

- **New `src/lib/email/send-with-retry.ts`** (or extend `src/lib/email/resend.ts`):
  - **Proactive pacing:** in-process limiter spacing calls ≥ **250 ms** apart (~4 req/s, safe margin under 5). Module-level state is fine — the daily cron is a _single_ serverless invocation, exactly the limiter's scope.
  - **Reactive retry:** on `429` (and transient 5xx), exponential backoff honoring `Retry-After` if present — base 500 ms, ×2, jitter, max ~4 retries.
  - **Logging:** keep PHI-free error logs (opaque IDs only) per `health-data-compliance.md`. Log final give-up.
- **Refactor the three senders** to call the helper instead of `resend.emails.send` directly:
  - `send-referral-batch.ts`, `send-fulfillment-check.ts`, `send-expiry-notification.ts`.
- **Optional but recommended — Batch API** for the multi-recipient sender: replace the per-recipient loop in `send-referral-batch.ts` with one `resend.batch.send([...])` (up to 100 messages/request). Collapses 5 requests → 1 and directly implements Resend's own advice. Keep the limiter for the cross-referral loop regardless.
- **Reliability hardening (related, in scope):** in `send-referral-batch.ts`, only advance `currentBatch` / `lastDrippedAt` when at least one send succeeded (or track failures so dropped recipients can be retried next tick) — otherwise the retry work is undone by premature batch advance.

### Workstream 2 — Config + small code: replyable sender (fixes C)

- Change `RESEND_FROM_EMAIL` (Vercel env) from `noreply@…` to a **monitored, replyable** mailbox — e.g. `referrals@therapistreferralnetwork.com` or `notifications@therapistreferralnetwork.com`.
- Add `replyTo` to the three notification sends (support inbox, or the referrer's contact email where appropriate — confirm privacy stance first).
- Update `getResendFromEmail()` default in `src/lib/env.ts` / document the var in an env example.

### Workstream 3 — DNS: authentication records (fixes B) — **no code**

On the DNS host for `therapistreferralnetwork.com` (verify exact values in the Resend domain dashboard):

- **DMARC** — add TXT at `_dmarc.therapistreferralnetwork.com`. Safe start: `v=DMARC1; p=none; rua=mailto:dmarc@therapistreferralnetwork.com` (`p=none` = monitor; satisfies the "has DMARC" bulk-sender requirement). Tighten to `quarantine`/`reject` after confirming SPF+DKIM alignment.
- **SPF + DKIM** — confirm Resend's domain-verification records are present and _passing/aligned_ (DMARC only helps if SPF/DKIM align).

---

## Fix tickets

### T-001: Throttle + retry/backoff on Resend sends (fixes 429 drops)

- **root-cause:** `src/features/notifications/send-referral-batch.ts:57` (+ fulfillment/expiry senders) call `resend.emails.send` with no pacing/retry; `:79` drops email on 429 via `continue`. Cron `vercel.json "0 9 * * *"` bursts the whole queue at once.
- **fix-approach:** shared `sendWithRetry` helper — ≥250 ms spacing + exp-backoff retry honoring `Retry-After`; route all three senders through it. Optionally switch referral-batch to `resend.batch.send`.
- **regression-risk:** Medium — touches all outbound notification email. Verify with existing `send-expiry-notification.test.ts` + new tests for limiter spacing and 429-retry. Watch Vercel function max-duration (≈250 ms × N + retries; batch API mitigates).

### T-002: Replyable From + replyTo (fixes no-reply trust penalty)

- **root-cause:** `src/lib/env.ts:36` default + `RESEND_FROM_EMAIL` prod value are `noreply@…`; no `replyTo` on notification sends.
- **fix-approach:** set `RESEND_FROM_EMAIL` to a monitored mailbox; add `replyTo` to the three senders; update default + env docs.
- **regression-risk:** Low — config + additive field. Confirm the new mailbox exists and is monitored.

### T-003: Publish DMARC (+ confirm SPF/DKIM) (fixes inbox rejection) — DNS only

- **root-cause:** no `_dmarc` TXT for the sending domain; required by Gmail/Yahoo/Microsoft.
- **fix-approach:** add `_dmarc` TXT (`p=none` to start) + verify Resend SPF/DKIM records pass. No code.
- **regression-risk:** Low (DNS), but `p=reject` too early can drop legit mail — start at `p=none`, monitor `rua` reports, then tighten.

---

## Phase 4 — Verify

**Diagnosis confirmed: YES.** All three dashboard errors are explained and consistent with the code:

- The user-supplied `429` with "5 req/s" matches Resend's documented default and the unthrottled burst path traced above — the diagnosis predicts exactly the observed symptom.
- `send-expiry-notification.test.ts:78` already simulates `{ data: null, error: { message: "Rate limited" } }` and asserts the current handling = **log + return (no throw, no retry)** — confirming (a) the Resend SDK signals 429 via the returned `error` object, _not_ a thrown exception, and (b) the codebase's current contract is to silently swallow it. This is direct evidence the dropped-email behavior is real, not hypothetical.
- B (DMARC) and C (no-reply) are verified by inspection of `env.ts:36` + the user's `From:` header and are independent DNS/reputation issues.

**Will the proposed fix resolve it?** Yes — proactive pacing keeps the account under 5 req/s so 429s stop occurring; reactive backoff recovers any that still happen instead of dropping.

**API contract verified via context7 (`/websites/resend`, 2026-06-03):**

- Limit = **5 req/s per _team_**, shared across all API keys → the contact form (`src/features/contact/actions.ts`) draws from the same budget as the drip cron. The in-process limiter covers the dominant 9am burst; cross-invocation contention (contact form firing during the cron) is a residual handled by retry.
- `emails.send` returns `{ data: null, error: { message, name } }` on failure — **`error` carries only `message` + `name`, no `statusCode`.** Detect rate-limit via **`error.name === "rate_limit_exceeded"`** (status 429), NOT a `statusCode` field, and NOT `try/catch` (the SDK does not throw on 429).
- The `{ data, error }` return value does **not** surface response headers, so `ratelimit-reset` / `Retry-After` are **not reachable** through the high-level call → retry uses **blind exponential backoff + jitter**, and the proactive ≥250 ms limiter is the _primary_ control (retry is only the safety net). Network/transport errors may still throw, so the wrapper handles both: catch throws AND inspect `error.name`.

**Tests that must still pass (regression guard):**

- `src/features/drip/__tests__/process-drip-queue.test.ts` — mocks the senders (`vi.mock("@/features/notifications/send-referral-batch")`), so it does **not** touch the real send path. Internal helper changes should leave all State 1–4 tests green. **Low risk.**
- `src/features/notifications/__tests__/send-expiry-notification.test.ts` — its line-78 "Rate limited" case asserts the _old_ swallow behavior; **this assertion must be updated** once retry is added (the call will now retry, then either succeed or give up after N).

**New tests needed:**

- `send-with-retry` helper (new): spacing ≥250 ms between calls (fake timers), retry when `error.name === "rate_limit_exceeded"` (or a thrown transport error), blind exponential backoff + jitter, give up after max retries, PHI-free logging.
- `send-referral-batch.test.ts` (**new — currently zero coverage of the buggy loop**): multi-recipient send, partial-failure handling, and the hardening (don't advance `currentBatch`/`lastDrippedAt` when all sends failed). Add a `batch.send` mock if the Batch API path is adopted.
- `send-fulfillment-check.test.ts` (optional, lower priority).

**Mock pattern to reuse:** `vi.mock("@/lib/email/resend", () => ({ resend: { emails: { send: vi.fn() } } }))` + `mockSend.mockResolvedValue(...)` (from `send-expiry-notification.test.ts:6,16`). Extend with `batch: { send: vi.fn() }` if batching.

**Regression risk: Medium** — every outbound notification email is rerouted through the new helper. Mitigations: senders are already isolated behind `@/lib/email/resend`; drip-state tests mock the senders; fake timers in helper tests must avoid real-delay hangs.

---

## Decisions — LOCKED (2026-06-03)

1. **From address:** `referrals@therapistreferralnetwork.com` (replyable, monitored). → confirm mailbox exists/forwards.
2. **replyTo:** existing `SUPPORT_EMAIL` inbox.
3. **Rate-limit fix:** **limiter + retry only** for T-001. Batch API (`resend.batch.send`) deferred to a fast-follow.
4. **DMARC `rua=`:** reuse the support inbox address.

## Out of scope (noted, not changing)

- `src/features/contact/actions.ts` already sets `replyTo`; shares the same `noreply` From (covered by T-002 env change).
- MailerLite path (`src/lib/email/mailerlite.ts`) is waitlist marketing, unrelated to referral bounces.
