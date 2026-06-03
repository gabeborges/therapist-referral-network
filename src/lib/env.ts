/**
 * Centralized env-var accessors with fail-fast semantics for production.
 *
 * Add accessors here rather than reading `process.env.X` ad-hoc — that
 * way a missing or malformed env is detected once, with a clear error,
 * instead of producing broken behavior at the call site (e.g. emails
 * with `http://localhost:3000/...` links in production).
 */

function requireEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined || value === "") {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

/**
 * Returns the public application URL (no trailing slash).
 * In production this throws when NEXT_PUBLIC_APP_URL is unset, so we
 * never silently ship emails with localhost links. In dev/test we
 * fall back to `http://localhost:3000` for convenience.
 */
export function getAppUrl(): string {
  const env = process.env.NEXT_PUBLIC_APP_URL;
  if (env && env.length > 0) {
    return env.replace(/\/$/, "");
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("NEXT_PUBLIC_APP_URL is required in production. Set it in your Vercel env.");
  }
  return "http://localhost:3000";
}

export function getResendFromEmail(): string {
  return process.env.RESEND_FROM_EMAIL ?? "noreply@example.com";
}

/**
 * Returns the support inbox used as the `replyTo` on outbound notifications,
 * or `undefined` when unset (Resend simply omits the header). Read at call
 * time so deployments can change it without a rebuild.
 */
export function getSupportEmail(): string | undefined {
  const value = process.env.SUPPORT_EMAIL;
  return value && value.length > 0 ? value : undefined;
}

export function getCronSecret(): string {
  return requireEnv("CRON_SECRET");
}
