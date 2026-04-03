"use client";

import { useMemo } from "react";
import { useFormContext, Controller } from "react-hook-form";
import type { TherapistProfileFormData } from "@/lib/validations/therapist-profile";
import { STYLE_DESCRIPTORS } from "@/lib/validations/therapist-profile";
import {
  AutocompleteSelect,
  type AutocompleteOption,
} from "@/features/onboarding/components/AutocompleteSelect";
import { CheckboxGroup } from "@/components/ui/CheckboxGroup";
import { BooleanCheckbox } from "@/components/ui/BooleanCheckbox";
import { FormGroup } from "@/components/ui/FormGroup";

interface ProfileSectionPracticeProps {
  specialtyOptions: AutocompleteOption[];
  therapyTypeOptions: AutocompleteOption[];
  specialtiesLoading: boolean;
  therapyTypesLoading: boolean;
}

function idsToOptions(ids: string[], options: AutocompleteOption[]): AutocompleteOption[] {
  const map = new Map(options.map((o) => [o.id, o]));
  return ids.map((id) => map.get(id)).filter(Boolean) as AutocompleteOption[];
}

function optionsToIds(selected: AutocompleteOption[]): string[] {
  return selected.map((o) => o.id);
}

export function ProfileSectionPractice({
  specialtyOptions,
  therapyTypeOptions,
  specialtiesLoading,
  therapyTypesLoading,
}: ProfileSectionPracticeProps): React.ReactElement {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<TherapistProfileFormData>();

  const watchedSpecialties = watch("specialties");

  const topSpecialtyOptions: AutocompleteOption[] = useMemo(
    () => specialtyOptions.filter((opt) => (watchedSpecialties ?? []).includes(opt.id)),
    [specialtyOptions, watchedSpecialties],
  );

  return (
    <FormGroup title="Your practice">
      {/* 14. Therapeutic approaches */}
      <Controller
        name="therapeuticApproach"
        control={control}
        render={({ field }) => (
          <AutocompleteSelect
            label="Therapeutic approaches"
            optional
            options={therapyTypeOptions}
            selected={idsToOptions(field.value ?? [], therapyTypeOptions)}
            onChange={(sel) => field.onChange(optionsToIds(sel))}
            placeholder="Search approaches..."
            error={errors.therapeuticApproach?.message}
            helperText="Referring therapists often request specific modalities for their clients."
            loading={therapyTypesLoading}
          />
        )}
      />

      {/* 15. Specialties */}
      <Controller
        name="specialties"
        control={control}
        render={({ field }) => (
          <AutocompleteSelect
            label="Specialties"
            options={specialtyOptions}
            selected={idsToOptions(field.value, specialtyOptions)}
            onChange={(sel) => field.onChange(optionsToIds(sel))}
            placeholder="Search specialties..."
            error={errors.specialties?.message}
            helperText="Used for matching. The more you add, the more referrals you'll receive."
            loading={specialtiesLoading}
          />
        )}
      />

      {/* 16. Top specialties */}
      <Controller
        name="topSpecialties"
        control={control}
        render={({ field }) => (
          <AutocompleteSelect
            label="Top specialties"
            optional
            options={topSpecialtyOptions}
            selected={idsToOptions(field.value ?? [], specialtyOptions)}
            onChange={(sel) => field.onChange(optionsToIds(sel))}
            placeholder="Rank your top 3 specialties..."
            error={errors.topSpecialties?.message}
            helperText="Choose up to 3 from your selected specialties. Order matters, your first choice is weighted most heavily in matching."
            maxItems={3}
            ranked
            loading={specialtiesLoading}
          />
        )}
      />

      {/* 17. Therapy style */}
      <CheckboxGroup
        name="therapyStyle"
        control={control}
        label="Therapy style"
        optional
        options={STYLE_DESCRIPTORS.map((s) => ({ value: s, label: s }))}
        itemMinWidth="standard"
        error={errors.therapyStyle?.message}
      />

      {/* 18. Therapy service options */}
      <div>
        <p className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2">
          Therapy service options
        </p>
        <div className="flex flex-col gap-2">
          <BooleanCheckbox
            name="acceptsInsurance"
            control={control}
            label="I accept insurance"
            onChange={(checked) => {
              if (!checked) setValue("insurers", []);
            }}
          />
          <BooleanCheckbox
            name="reducedFees"
            control={control}
            label="I offer reduced fees / sliding scale"
          />
          <BooleanCheckbox name="proBono" control={control} label="I offer pro bono sessions" />
          <BooleanCheckbox
            name="freeConsultation"
            control={control}
            label="I offer a free initial consultation"
          />
        </div>
      </div>
    </FormGroup>
  );
}
