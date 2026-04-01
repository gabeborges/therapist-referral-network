"use client";

import { useFormContext, Controller } from "react-hook-form";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc/client";
import type { OnboardingFormData } from "@/lib/validations/onboarding";
import { AGE_OPTIONS, PARTICIPANT_OPTIONS, MODALITIES } from "@/lib/validations/therapist-profile";
import {
  AutocompleteSelect,
  type AutocompleteOption,
} from "@/features/onboarding/components/AutocompleteSelect";
import { CheckboxGroup } from "@/components/ui/CheckboxGroup";

export function OnboardingStepCommunities(): React.ReactElement {
  const trpc = useTRPC();
  const {
    control,
    formState: { errors },
  } = useFormContext<OnboardingFormData>();

  const { data: specialtiesData, isLoading: specialtiesLoading } = useQuery(
    trpc.taxonomy.getSpecialties.queryOptions(),
  );

  const specialtyOptions: AutocompleteOption[] = useMemo(
    () =>
      (specialtiesData ?? []).map((s) => ({
        id: s.id,
        name: s.name,
        category: s.category,
      })),
    [specialtiesData],
  );

  function idsToOptions(ids: string[], options: AutocompleteOption[]): AutocompleteOption[] {
    const map = new Map(options.map((o) => [o.id, o]));
    return ids.map((id) => map.get(id)).filter(Boolean) as AutocompleteOption[];
  }

  function optionsToIds(selected: AutocompleteOption[]): string[] {
    return selected.map((o) => o.id);
  }

  return (
    <div className="space-y-8">
      {/* Specialties */}
      <Controller
        name="specialties"
        control={control}
        render={({ field }) => (
          <AutocompleteSelect
            label="Specialties"
            options={specialtyOptions}
            selected={idsToOptions(field.value ?? [], specialtyOptions)}
            onChange={(selected) => field.onChange(optionsToIds(selected))}
            placeholder="Search specialties..."
            loading={specialtiesLoading}
            error={errors.specialties?.message}
          />
        )}
      />

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
        options={MODALITIES.map((m) => ({ value: m, label: m }))}
        layout="inline"
        error={errors.modalities?.message}
      />
    </div>
  );
}
