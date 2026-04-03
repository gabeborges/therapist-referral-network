"use client";

import { useState } from "react";
import { useTRPC } from "@/lib/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { Toggle } from "@/components/ui/Toggle";

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
      <Toggle
        checked={accepting}
        onChange={handleToggle}
        disabled={toggleMutation.isPending}
        ariaLabel="Toggle accepting referrals"
      />
      <div>
        <p className="text-[0.9375rem] text-fg font-medium">Accepting referrals</p>
        <p className="text-[0.875rem] text-fg-2">Visible to other therapists in the network</p>
      </div>
    </div>
  );
}
