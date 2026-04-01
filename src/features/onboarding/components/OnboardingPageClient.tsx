"use client";

import { useState } from "react";
import { OnboardingFlow } from "@/features/onboarding/components/OnboardingFlow";

export function OnboardingPageClient(): React.ReactElement {
  const [hideHowItWorks, setHideHowItWorks] = useState(false);

  return (
    <>
      {/* How it works — hidden after country selection */}
      {!hideHowItWorks && (
        <div className="bg-s1 border border-border rounded-md p-6 shadow-1 mb-8">
          <h2 className="text-[0.8125rem] font-semibold tracking-[0.06em] uppercase text-fg-3 mb-4">
            How it works
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <span className="w-8 h-8 rounded-full inline-flex items-center justify-center bg-brand text-brand-on text-[0.8125rem] font-bold shrink-0">
                1
              </span>
              <div>
                <p className="text-[0.9375rem] font-medium text-fg">Set up your profile</p>
                <p className="text-[0.875rem] leading-[1.5] text-fg-2">
                  Add your specialties, insurance, and location so colleagues can find you.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="w-8 h-8 rounded-full inline-flex items-center justify-center bg-brand text-brand-on text-[0.8125rem] font-bold shrink-0">
                2
              </span>
              <div>
                <p className="text-[0.9375rem] font-medium text-fg">Receive matched referrals</p>
                <p className="text-[0.875rem] leading-[1.5] text-fg-2">
                  When a colleague sends a referral, you&apos;ll be matched based on clinical fit.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="w-8 h-8 rounded-full inline-flex items-center justify-center bg-brand text-brand-on text-[0.8125rem] font-bold shrink-0">
                3
              </span>
              <div>
                <p className="text-[0.9375rem] font-medium text-fg">Connect with clients</p>
                <p className="text-[0.875rem] leading-[1.5] text-fg-2">
                  Accept referrals and coordinate care directly with the referring therapist.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <OnboardingFlow onHideHowItWorks={setHideHowItWorks} />
    </>
  );
}
