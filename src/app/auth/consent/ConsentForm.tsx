"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { acceptTerms } from "@/app/auth/consent/actions";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";

export function ConsentForm(): React.ReactElement {
  const router = useRouter();
  const { update } = useSession();
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

    // Refresh the JWT so the session picks up the new user and clears needsConsent
    await update();
    router.push("/onboarding");
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

      <Checkbox checked={agreed} onChange={setAgreed}>
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
      </Checkbox>

      {error && (
        <p className="text-[0.8125rem]" style={{ color: "var(--err)" }}>
          {error}
        </p>
      )}

      <Button type="submit" disabled={!agreed || loading} loading={loading} className="w-full">
        {loading ? "Creating your account..." : "Continue"}
      </Button>
    </form>
  );
}
