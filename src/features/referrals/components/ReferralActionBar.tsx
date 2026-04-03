"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/lib/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";

type ActionBarState = "default" | "confirm-fulfill" | "confirm-cancel";

interface ReferralActionBarProps {
  referralId: string;
  status: "OPEN" | "FULFILLED" | "CANCELLED" | "EXPIRED";
}

export function ReferralActionBar({
  referralId,
  status,
}: ReferralActionBarProps): React.ReactElement {
  const router = useRouter();
  const trpc = useTRPC();
  const [state, setState] = useState<ActionBarState>("default");

  const fulfillMutation = useMutation(
    trpc.referral.fulfill.mutationOptions({
      onSuccess() {
        router.refresh();
      },
    }),
  );

  const cancelMutation = useMutation(
    trpc.referral.cancel.mutationOptions({
      onSuccess() {
        router.refresh();
      },
    }),
  );

  const isPending = fulfillMutation.isPending || cancelMutation.isPending;

  // Terminal state: fulfilled
  if (status === "FULFILLED") {
    return (
      <div className="flex items-center gap-2">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-ok"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <p className="text-[0.875rem] font-medium text-ok m-0">
          This referral was marked as fulfilled
        </p>
      </div>
    );
  }

  // Terminal state: cancelled
  if (status === "CANCELLED") {
    return (
      <div className="flex items-center gap-2">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-fg-3"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
        <p className="text-[0.875rem] font-medium text-fg-3 m-0">This referral was cancelled</p>
      </div>
    );
  }

  // Non-OPEN status (e.g. EXPIRED) — no action bar
  if (status !== "OPEN") {
    return <></>;
  }

  // Default: two action buttons
  if (state === "default") {
    return (
      <div className="flex items-center gap-3 flex-wrap">
        <Button
          type="button"
          onClick={() => setState("confirm-fulfill")}
          className="bg-ok text-white hover:opacity-90"
        >
          Mark as Fulfilled
        </Button>
        <Button
          variant="secondary"
          type="button"
          onClick={() => setState("confirm-cancel")}
          className="text-err border-err/30 hover:bg-err-l hover:border-err"
        >
          Cancel Referral
        </Button>
      </div>
    );
  }

  // Confirm fulfill
  if (state === "confirm-fulfill") {
    return (
      <div
        role="alertdialog"
        aria-labelledby="confirm-fulfill-text"
        className="flex items-center gap-3 flex-wrap"
      >
        <p id="confirm-fulfill-text" className="text-[0.875rem] text-fg-2 m-0">
          Mark this referral as fulfilled?
        </p>
        <Button
          variant="secondary"
          size="sm"
          type="button"
          onClick={() => setState("default")}
          disabled={isPending}
        >
          No
        </Button>
        <Button
          autoFocus
          size="sm"
          type="button"
          onClick={() => fulfillMutation.mutate({ id: referralId })}
          loading={fulfillMutation.isPending}
          disabled={isPending}
          className="bg-ok text-white hover:opacity-90"
        >
          {fulfillMutation.isPending ? "Fulfilling..." : "Yes, Fulfilled"}
        </Button>
      </div>
    );
  }

  // Confirm cancel
  return (
    <div
      role="alertdialog"
      aria-labelledby="confirm-cancel-text"
      className="flex items-center gap-3 flex-wrap"
    >
      <p id="confirm-cancel-text" className="text-[0.875rem] text-fg-2 m-0">
        Cancel this referral? This cannot be undone.
      </p>
      <Button
        variant="secondary"
        size="sm"
        type="button"
        onClick={() => setState("default")}
        disabled={isPending}
      >
        No
      </Button>
      <Button
        autoFocus
        size="sm"
        type="button"
        onClick={() => cancelMutation.mutate({ id: referralId })}
        loading={cancelMutation.isPending}
        disabled={isPending}
        className="bg-err text-white hover:opacity-90"
      >
        {cancelMutation.isPending ? "Cancelling..." : "Yes, Cancel"}
      </Button>
    </div>
  );
}
