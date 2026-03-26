"use client";

import { useState } from "react";
import { CountryGate } from "@/features/onboarding/components/CountryGate";
import { OnboardingProfileForm } from "@/features/onboarding/components/OnboardingProfileForm";

export function OnboardingFlow(): React.ReactElement {
  const [passedGate, setPassedGate] = useState(false);

  return (
    <>
      {!passedGate ? (
        <CountryGate onProceed={() => setPassedGate(true)} />
      ) : (
        <OnboardingProfileForm />
      )}
    </>
  );
}
