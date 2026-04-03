"use client";

import { useState } from "react";
import Link from "next/link";
import { acceptTerms } from "@/app/auth/consent/actions";
import { Button } from "@/components/ui/Button";

export function ConsentForm(): React.ReactElement {
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (!agreed) return;

    setLoading(true);
    setError(null);

    const result = await acceptTerms();
    if (!result.success) {
      setError(result.error ?? "Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    // Full navigation so the JWT callback detects the new user and clears needsConsent
    window.location.href = "/onboarding";
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div
          className="rounded-sm p-4 text-[0.8125rem] leading-[1.6] max-h-[240px] overflow-y-auto"
          style={{
            border: "1px solid var(--border)",
            background: "var(--s1)",
            color: "var(--fg-2)",
          }}
        >
          <p className="font-semibold mb-2" style={{ color: "var(--fg)" }}>
            Terms of Service
          </p>
          <p>
            By creating an account on Therapist Referral Network, you agree to use this platform for
            professional therapist-to-therapist referrals only. You agree not to share any Protected
            Health Information (PHI) on this platform. Full terms are available on our{" "}
            <Link
              href="/terms"
              target="_blank"
              className="underline"
              style={{ color: "var(--brand)" }}
            >
              Terms of Service
            </Link>{" "}
            page.
          </p>
        </div>

        <div
          className="rounded-sm p-4 text-[0.8125rem] leading-[1.6] max-h-[240px] overflow-y-auto"
          style={{
            border: "1px solid var(--border)",
            background: "var(--s1)",
            color: "var(--fg-2)",
          }}
        >
          <p className="font-semibold mb-2" style={{ color: "var(--fg)" }}>
            Privacy Policy
          </p>
          <p>
            We collect your professional information (name, credentials, practice details) to
            provide referral matching services. Your data may be processed by our service providers
            (Vercel, Supabase) in the United States. You have the right to access, correct, or
            delete your personal data at any time. Full details are available in our{" "}
            <Link
              href="/privacy"
              target="_blank"
              className="underline"
              style={{ color: "var(--brand)" }}
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded-sm accent-[var(--brand)]"
        />
        <span className="text-[0.8125rem] leading-[1.5]" style={{ color: "var(--fg-2)" }}>
          I have read and agree to the{" "}
          <Link
            href="/terms"
            target="_blank"
            className="underline"
            style={{ color: "var(--brand)" }}
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            target="_blank"
            className="underline"
            style={{ color: "var(--brand)" }}
          >
            Privacy Policy
          </Link>
          .
        </span>
      </label>

      {error && (
        <p className="text-[0.8125rem]" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}

      <Button type="submit" disabled={!agreed || loading} loading={loading} className="w-full">
        {loading ? "Creating your account..." : "Continue"}
      </Button>
    </form>
  );
}
