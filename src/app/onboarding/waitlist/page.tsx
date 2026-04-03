import { Suspense } from "react";
import { WaitlistForm } from "@/features/onboarding/components/WaitlistForm";
import { BrandHeader } from "@/features/layout/components/BrandHeader";

export const metadata = {
  title: "Waitlist — Therapist Referral Network",
};

export default function WaitlistPage(): React.ReactElement {
  return (
    <div className="px-4 sm:px-6 pt-12 pb-24">
      <div className="max-w-[560px] mx-auto">
        <BrandHeader />

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-[1.5rem] font-semibold tracking-[-0.015em] leading-[1.3] text-fg mb-2">
            We're launching in Canada first
          </h1>
          <p className="text-[0.875rem] leading-[1.5] text-fg-2">
            Therapist Referral Network is currently available for Canadian practitioners. Join our
            waitlist to be notified when we expand to your region.
          </p>
        </div>

        {/* Waitlist form (needs Suspense for useSearchParams) */}
        <Suspense
          fallback={
            <div className="bg-s1 border border-border rounded-md p-6 shadow-1 animate-pulse h-48" />
          }
        >
          <WaitlistForm />
        </Suspense>
      </div>
    </div>
  );
}
