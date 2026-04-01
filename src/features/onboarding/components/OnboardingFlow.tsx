"use client";

import { useState } from "react";
import { CountryGate } from "@/features/onboarding/components/CountryGate";
import { OnboardingWizard } from "@/features/onboarding/components/OnboardingWizard";

interface OnboardingFlowProps {
  onHideHowItWorks?: (hide: boolean) => void;
}

export function OnboardingFlow({ onHideHowItWorks }: OnboardingFlowProps): React.ReactElement {
  const [passedGate, setPassedGate] = useState(false);

  function handleProceed(): void {
    setPassedGate(true);
    onHideHowItWorks?.(true);
  }

  function handleBack(): void {
    setPassedGate(false);
    onHideHowItWorks?.(false);
  }

  return (
    <>
      {!passedGate ? (
        <CountryGate onProceed={handleProceed} />
      ) : (
        <OnboardingWizard onBack={handleBack} />
      )}
    </>
  );
}
