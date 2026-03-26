"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useTRPC } from "@/lib/trpc/client";
import { useMutation } from "@tanstack/react-query";
import {
  waitlistSchema,
  type WaitlistFormData,
} from "@/lib/validations/waitlist";

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
          <svg
            className="w-8 h-8 text-brand"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-[1.25rem] font-semibold tracking-[-0.01em] leading-[1.35] text-fg mb-2">
          You're on the list!
        </h2>
        <p className="text-[0.875rem] leading-[1.5] text-fg-2">
          We'll let you know as soon as Therapist Referral Network is available
          in your area.
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
          <input
            type="email"
            {...register("email")}
            className={`w-full h-11 px-3 bg-inset text-fg border rounded-sm text-[0.9375rem] font-sans transition-[border-color,background,box-shadow] duration-150 ease-out focus:border-border-f focus:bg-bg focus:outline-2 focus:outline-border-f focus:outline-offset-2 placeholder:text-fg-4 ${
              errors.email ? "border-err" : "border-border"
            }`}
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-[0.75rem] text-err">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2">
            Country
          </label>
          <input
            type="text"
            readOnly
            value={COUNTRY_LABELS[countryParam] ?? countryParam}
            className="w-full h-11 px-3 bg-inset text-fg-3 border border-border rounded-sm text-[0.9375rem] font-sans cursor-not-allowed opacity-70"
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

        <button
          type="submit"
          disabled={joinWaitlist.isPending}
          className="inline-flex items-center justify-center gap-2 w-full h-11 px-6 bg-brand text-brand-on border-none rounded-sm text-[0.8125rem] font-semibold tracking-[0.01em] cursor-pointer transition-[background] duration-150 ease-out font-sans hover:bg-brand-h focus-visible:outline-2 focus-visible:outline-border-f focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {joinWaitlist.isPending ? (
            <>
              <span className="w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Joining...
            </>
          ) : (
            "Join Waitlist"
          )}
        </button>
      </form>
    </div>
  );
}
