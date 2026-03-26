"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/lib/trpc/client";
import { useMutation } from "@tanstack/react-query";

interface CloseReferralButtonProps {
  referralId: string;
}

export function CloseReferralButton({
  referralId,
}: CloseReferralButtonProps): React.ReactElement {
  const router = useRouter();
  const trpc = useTRPC();
  const [confirming, setConfirming] = useState(false);

  const closeReferral = useMutation(
    trpc.referral.close.mutationOptions({
      onSuccess() {
        router.refresh();
      },
    }),
  );

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="inline-flex items-center justify-center h-10 px-5 bg-transparent text-fg-2 border border-border rounded-sm text-[0.8125rem] font-semibold tracking-[0.01em] cursor-pointer transition-[border-color,background] duration-150 ease-out font-sans hover:bg-inset hover:border-border-e focus-visible:outline-2 focus-visible:outline-border-f focus-visible:outline-offset-2"
      >
        Close Referral
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <p className="text-[0.875rem] text-fg-2 m-0">
        Mark this referral as fulfilled?
      </p>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        disabled={closeReferral.isPending}
        className="inline-flex items-center justify-center h-9 px-4 bg-transparent text-fg-3 border border-border rounded-sm text-[0.8125rem] font-medium cursor-pointer transition-[border-color,background] duration-150 ease-out font-sans hover:bg-inset focus-visible:outline-2 focus-visible:outline-border-f focus-visible:outline-offset-2 disabled:opacity-50"
      >
        No
      </button>
      <button
        type="button"
        onClick={() => closeReferral.mutate({ id: referralId })}
        disabled={closeReferral.isPending}
        className="inline-flex items-center justify-center gap-2 h-9 px-4 bg-ok text-white border-none rounded-sm text-[0.8125rem] font-semibold cursor-pointer transition-[background] duration-150 ease-out font-sans hover:opacity-90 focus-visible:outline-2 focus-visible:outline-border-f focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {closeReferral.isPending ? (
          <>
            <span className="w-[14px] h-[14px] border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Closing...
          </>
        ) : (
          "Yes, Close"
        )}
      </button>
    </div>
  );
}
