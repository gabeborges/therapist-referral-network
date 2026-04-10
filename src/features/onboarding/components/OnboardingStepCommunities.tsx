"use client";

import { useFormContext } from "react-hook-form";
import type { OnboardingFormData } from "@/lib/validations/onboarding";
import {
  AGE_OPTIONS,
  PARTICIPANT_OPTIONS,
  MODALITIES,
  MODALITY_LABELS,
} from "@/lib/validations/therapist-profile";
import { CheckboxGroup } from "@/components/ui/CheckboxGroup";

export function OnboardingStepCommunities(): React.ReactElement {
  const {
    control,
    formState: { errors },
  } = useFormContext<OnboardingFormData>();

  return (
    <div className="space-y-8">
      {/* Participants (inline) */}
      <CheckboxGroup
        name="participants"
        control={control}
        label="Participants"
        options={[...PARTICIPANT_OPTIONS].map((p) => ({ value: p, label: p }))}
        layout="inline"
        error={errors.participants?.message}
      />

      {/* Ages (column) */}
      <CheckboxGroup
        name="ages"
        control={control}
        label="Ages"
        options={[...AGE_OPTIONS].map((a) => ({ value: a, label: a }))}
        layout="column"
        error={errors.ages?.message}
      />

      {/* Modalities (inline) */}
      <CheckboxGroup
        name="modalities"
        control={control}
        label="Modalities"
        options={MODALITIES.map((m) => ({ value: m, label: MODALITY_LABELS[m] ?? m }))}
        layout="inline"
        error={errors.modalities?.message}
      />
    </div>
  );
}
