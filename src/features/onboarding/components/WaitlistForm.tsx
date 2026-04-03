"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useTRPC } from "@/lib/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { waitlistSchema, type WaitlistFormData } from "@/lib/validations/waitlist";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const COUNTRY_LABELS: Record<string, string> = {
  US: "United States",
  OTHER: "Other",
};

export function WaitlistForm(): React.ReactElement {
  const searchParams = useSearchParams();
  const countryParam = searchParams.get("country") ?? "US";
  const trpc = useTRPC();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      email: "",
      country: countryParam,
    },
  });

  const joinWaitlist = useMutation(
    trpc.waitlist.join.mutationOptions({
      onSuccess() {
        setSubmitted(true);
      },
    }),
  );

  function onSubmit(data: WaitlistFormData): void {
    joinWaitlist.mutate(data);
  }

  if (submitted) {
    return (
      <div className="bg-s1 border border-border rounded-md p-6 shadow-1 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-l mb-5">
          <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-[1.25rem] font-semibold tracking-[-0.01em] leading-[1.35] text-fg mb-2">
          You're on the list!
        </h2>
        <p className="text-[0.875rem] leading-[1.5] text-fg-2">
          We'll let you know as soon as Therapist Referral Network is available in your area.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-s1 border border-border rounded-md p-6 shadow-1">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2">
            Email Address
          </label>
          <Input
            type="email"
            {...register("email")}
            error={!!errors.email}
            placeholder="your@email.com"
          />
          {errors.email && <p className="mt-1 text-[0.75rem] text-err">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2">
            Country
          </label>
          <Input
            type="text"
            readOnly
            value={COUNTRY_LABELS[countryParam] ?? countryParam}
            className="cursor-not-allowed opacity-70"
          />
          <input type="hidden" {...register("country")} />
        </div>

        {joinWaitlist.isError && (
          <p className="text-[0.875rem] text-err">
            {joinWaitlist.error.message.includes("Unique")
              ? "This email is already on the waitlist!"
              : joinWaitlist.error.message}
          </p>
        )}

        <Button type="submit" loading={joinWaitlist.isPending} className="w-full">
          {joinWaitlist.isPending ? "Joining..." : "Join Waitlist"}
        </Button>
      </form>
    </div>
  );
}
