"use client";

import { useFormContext, Controller } from "react-hook-form";
import type { TherapistProfileFormData } from "@/lib/validations/therapist-profile";
import {
  PARTICIPANT_OPTIONS,
  AGE_OPTIONS,
  MODALITIES,
  FAITH_ORIENTATIONS,
  CLIENT_ETHNICITY_OPTIONS,
} from "@/lib/validations/therapist-profile";
import {
  AutocompleteSelect,
  type AutocompleteOption,
} from "@/features/onboarding/components/AutocompleteSelect";
import { CheckboxGroup } from "@/components/ui/CheckboxGroup";
import { FormGroup } from "@/components/ui/FormGroup";

interface ProfileSectionCommunitiesProps {
  languageOptions: AutocompleteOption[];
  alliedGroupOptions: AutocompleteOption[];
  languagesLoading: boolean;
  alliedGroupsLoading: boolean;
}

function idsToOptions(ids: string[], options: AutocompleteOption[]): AutocompleteOption[] {
  const map = new Map(options.map((o) => [o.id, o]));
  return ids.map((id) => map.get(id)).filter(Boolean) as AutocompleteOption[];
}

function optionsToIds(selected: AutocompleteOption[]): string[] {
  return selected.map((o) => o.id);
}

export function ProfileSectionCommunities({
  languageOptions,
  alliedGroupOptions,
  languagesLoading,
  alliedGroupsLoading,
}: ProfileSectionCommunitiesProps): React.ReactElement {
  const {
    control,
    formState: { errors },
  } = useFormContext<TherapistProfileFormData>();

  return (
    <FormGroup title="Communities served" description="Your clients">
      {/* 20. Participants */}
      <CheckboxGroup
        name="participants"
        control={control}
        label="Participants"
        options={[...PARTICIPANT_OPTIONS].map((p) => ({ value: p, label: p }))}
        itemMinWidth="full"
        error={errors.participants?.message}
      />

      {/* 21. Ages */}
      <CheckboxGroup
        name="ages"
        control={control}
        label="Ages"
        options={[...AGE_OPTIONS].map((a) => ({ value: a, label: a }))}
        itemMinWidth="full"
        error={errors.ages?.message}
      />

      {/* 22. Modalities */}
      <CheckboxGroup
        name="modalities"
        control={control}
        label="Modalities"
        options={[...MODALITIES].map((m) => ({ value: m, label: m }))}
        itemMinWidth="full"
        error={errors.modalities?.message}
      />

      {/* 23. Faith orientation */}
      <Controller
        name="faithOrientation"
        control={control}
        render={({ field }) => (
          <AutocompleteSelect
            label="Faith orientation (optional)"
            options={FAITH_ORIENTATIONS.map((f) => ({ id: f, name: f }))}
            selected={(field.value ?? []).map((f: string) => ({ id: f, name: f }))}
            onChange={(sel) => field.onChange(sel.map((s) => s.id))}
            placeholder="Search faith orientations..."
          />
        )}
      />

      {/* 24. Ethnicity */}
      <CheckboxGroup
        name="ethnicity"
        control={control}
        label="Ethnicity (optional)"
        options={[...CLIENT_ETHNICITY_OPTIONS].map((e) => ({ value: e, label: e }))}
        itemMinWidth="full"
        error={errors.ethnicity?.message}
      />

      {/* 25. Languages spoken */}
      <Controller
        name="languages"
        control={control}
        render={({ field }) => (
          <AutocompleteSelect
            label="Languages spoken (optional)"
            options={languageOptions}
            selected={idsToOptions(field.value ?? [], languageOptions)}
            onChange={(sel) => field.onChange(optionsToIds(sel))}
            placeholder="Search languages..."
            error={errors.languages?.message}
            loading={languagesLoading}
          />
        )}
      />

      {/* 26. Groups */}
      <Controller
        name="groups"
        control={control}
        render={({ field }) => (
          <AutocompleteSelect
            label="Groups (optional)"
            options={alliedGroupOptions}
            selected={idsToOptions(field.value ?? [], alliedGroupOptions)}
            onChange={(sel) => field.onChange(optionsToIds(sel))}
            placeholder="Search groups..."
            error={errors.groups?.message}
            loading={alliedGroupsLoading}
          />
        )}
      />
    </FormGroup>
  );
}
