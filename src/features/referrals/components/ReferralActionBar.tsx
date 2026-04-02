"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/lib/trpc/client";
import { useMutation } from "@tanstack/react-query";

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
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (state !== "default") {
      confirmRef.current?.focus();
    }
  }, [state]);

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
        <button
          type="button"
          onClick={() => setState("confirm-fulfill")}
          className="inline-flex items-center justify-center h-9 px-4 bg-ok text-white border-none rounded-sm text-[0.8125rem] font-semibold tracking-[0.01em] cursor-pointer transition-opacity duration-150 ease-out font-sans hover:opacity-90 focus-visible:outline-2 focus-visible:outline-border-f focus-visible:outline-offset-2"
        >
          Mark as Fulfilled
        </button>
        <button
          type="button"
          onClick={() => setState("confirm-cancel")}
          className="inline-flex items-center justify-center h-9 px-4 bg-transparent text-err border border-err/30 rounded-sm text-[0.8125rem] font-medium tracking-[0.01em] cursor-pointer transition-all duration-150 ease-out font-sans hover:bg-err-l hover:border-err focus-visible:outline-2 focus-visible:outline-border-f focus-visible:outline-offset-2"
        >
          Cancel Referral
        </button>
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
        <button
          type="button"
          onClick={() => setState("default")}
          disabled={isPending}
          className="inline-flex items-center justify-center h-9 px-4 bg-transparent text-fg-3 border border-border rounded-sm text-[0.8125rem] font-medium cursor-pointer transition-[border-color,background] duration-150 ease-out font-sans hover:bg-inset focus-visible:outline-2 focus-visible:outline-border-f focus-visible:outline-offset-2 disabled:opacity-50"
        >
          No
        </button>
        <button
          ref={confirmRef}
          type="button"
          onClick={() => fulfillMutation.mutate({ id: referralId })}
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 h-9 px-4 bg-ok text-white border-none rounded-sm text-[0.8125rem] font-semibold cursor-pointer transition-opacity duration-150 ease-out font-sans hover:opacity-90 focus-visible:outline-2 focus-visible:outline-border-f focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {fulfillMutation.isPending ? (
            <>
              <span className="w-[14px] h-[14px] border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Fulfilling...
            </>
          ) : (
            "Yes, Fulfilled"
          )}
        </button>
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
      <button
        type="button"
        onClick={() => setState("default")}
        disabled={isPending}
        className="inline-flex items-center justify-center h-9 px-4 bg-transparent text-fg-3 border border-border rounded-sm text-[0.8125rem] font-medium cursor-pointer transition-[border-color,background] duration-150 ease-out font-sans hover:bg-inset focus-visible:outline-2 focus-visible:outline-border-f focus-visible:outline-offset-2 disabled:opacity-50"
      >
        No
      </button>
      <button
        ref={confirmRef}
        type="button"
        onClick={() => cancelMutation.mutate({ id: referralId })}
        disabled={isPending}
        className="inline-flex items-center justify-center gap-2 h-9 px-4 bg-err text-white border-none rounded-sm text-[0.8125rem] font-semibold cursor-pointer transition-opacity duration-150 ease-out font-sans hover:opacity-90 focus-visible:outline-2 focus-visible:outline-border-f focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {cancelMutation.isPending ? (
          <>
            <span className="w-[14px] h-[14px] border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Cancelling...
          </>
        ) : (
          "Yes, Cancel"
        )}
      </button>
    </div>
  );
}
