"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { deleteAccount } from "@/features/account/actions";

export function DeleteAccountForm(): React.ReactElement {
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(): Promise<void> {
    if (!confirmed) return;
    setLoading(true);
    setError(null);

    const result = await deleteAccount();
    if (!result.success) {
      setError(result.error ?? "Something went wrong. Please try again.");
      setLoading(false);
    }
    // On success, signOut redirects to "/" — this point is not reached
  }

  return (
    <div className="space-y-6">
      <div
        className="rounded-sm p-4 text-[0.8125rem] leading-[1.6]"
        style={{
          border: "1px solid var(--danger)",
          background: "color-mix(in srgb, var(--danger) 6%, transparent)",
          color: "var(--fg-2)",
        }}
      >
        <p className="font-semibold mb-2" style={{ color: "var(--danger)" }}>
          What happens when you delete your account
        </p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Your profile is immediately hidden from the directory and referral matching</li>
          <li>Sensitive data (faith orientation, ethnicity) is deleted immediately</li>
          <li>All open referrals are cancelled</li>
          <li>Your login credentials are revoked</li>
          <li>Remaining profile data is permanently deleted within 30 days</li>
          <li>Consent records are retained for 24 months as required by law</li>
        </ul>
      </div>

      <label className="flex items-start gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded-sm accent-[var(--danger)]"
        />
        <span className="text-[0.8125rem] leading-[1.5]" style={{ color: "var(--fg-2)" }}>
          I understand this action is permanent and cannot be undone.
        </span>
      </label>

      {error && (
        <p className="text-[0.8125rem]" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}

      <Button
        onClick={handleDelete}
        disabled={!confirmed || loading}
        loading={loading}
        className="bg-danger text-white border-none hover:opacity-90"
      >
        {loading ? "Deleting account..." : "Delete my account"}
      </Button>
    </div>
  );
}
