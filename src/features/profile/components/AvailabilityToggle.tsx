"use client";

import { useState } from "react";
import { useTRPC } from "@/lib/trpc/client";
import { useMutation } from "@tanstack/react-query";

interface AvailabilityToggleProps {
  initialValue: boolean;
}

export function AvailabilityToggle({ initialValue }: AvailabilityToggleProps): React.ReactElement {
  const [accepting, setAccepting] = useState(initialValue);
  const trpc = useTRPC();

  const toggleMutation = useMutation(
    trpc.therapist.toggleAvailability.mutationOptions({
      onMutate() {
        setAccepting((prev) => !prev);
      },
      onError() {
        setAccepting((prev) => !prev);
      },
    }),
  );

  function handleToggle(): void {
    toggleMutation.mutate();
  }

  return (
    <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border-s">
      <button
        type="button"
        role="switch"
        aria-checked={accepting}
        aria-label="Accepting referrals"
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            handleToggle();
          }
        }}
        disabled={toggleMutation.isPending}
        className={`relative w-11 h-6 shrink-0 rounded-xl cursor-pointer border-none p-0 transition-[background] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-border-f focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
          accepting ? "bg-ok" : "bg-fg-4"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.15)] transition-transform duration-150 ease-out ${
            accepting ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
      <div>
        <p className="text-[0.9375rem] text-fg font-medium">Accepting referrals</p>
        <p className="text-[0.875rem] text-fg-2">Visible to other therapists in the network</p>
      </div>
    </div>
  );
}
