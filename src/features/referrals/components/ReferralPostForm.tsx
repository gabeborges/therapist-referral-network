"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useTRPC } from "@/lib/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { referralPostSchema, type ReferralPostFormData } from "@/lib/validations/referral-post";
import {
  AGE_OPTIONS,
  MODALITIES,
  MODALITY_LABELS,
  PARTICIPANT_OPTIONS,
  PROVINCES,
  UNSUPPORTED_PROVINCES,
} from "@/lib/validations/therapist-profile";
import {
  AutocompleteSelect,
  type AutocompleteOption,
} from "@/features/onboarding/components/AutocompleteSelect";
import { FormGroup } from "@/components/ui/FormGroup";
import { BooleanCheckbox } from "@/components/ui/BooleanCheckbox";
import { CheckboxGroup } from "@/components/ui/CheckboxGroup";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { PHINotice } from "@/components/ui/PHINotice";

const RATE_OPTIONS = ["Full fee", "Sliding scale", "Pro-bono"] as const;

const THERAPIST_GENDER_PREF_OPTIONS = ["Any", "Female", "Male", "Non-binary"] as const;

const labelClass = "block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2";

export function ReferralPostForm(): React.ReactElement {
  const router = useRouter();
  const trpc = useTRPC();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);

  const { data: therapyTypesData } = useQuery(trpc.taxonomy.getTherapyTypes.queryOptions());
  const { data: languagesData } = useQuery(trpc.taxonomy.getLanguages.queryOptions());

  const therapyTypeOptions: AutocompleteOption[] = (therapyTypesData ?? []).map((t) => ({
    id: t.id,
    name: t.name,
  }));
  const languageOptions: AutocompleteOption[] = (languagesData ?? []).map((l) => ({
    id: l.id,
    name: l.name,
  }));

  useEffect(() => {
    if (serverError) errorRef.current?.focus();
  }, [serverError]);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<ReferralPostFormData>({
    resolver: zodResolver(referralPostSchema),
    defaultValues: {
      presentingIssue: "",
      details: "",
      participants: undefined,
      ageGroup: "",
      modalities: [],
      city: "",
      province: "",
      rate: "",
      insuranceRequired: false,
      therapistGenderPref: "",
      therapyTypes: [],
      languages: [],
    },
  });

  const details = watch("details") ?? "";

  const createReferral = useMutation(
    trpc.referral.create.mutationOptions({
      onSuccess() {
        router.push("/referrals");
      },
      onError(error) {
        setServerError(error.message);
      },
    }),
  );

  function onSubmit(data: ReferralPostFormData): void {
    setServerError(null);
    createReferral.mutate(data);
  }

  return (
    <div className="bg-s1 border border-border rounded-md p-6 shadow-1">
      <h2 className="text-[1.25rem] font-semibold tracking-[-0.01em] leading-[1.35] text-fg mb-1">
        Post a referral
      </h2>
      <p className="text-[0.875rem] text-fg-2 mb-6">
        Describe the client need and we will match them with the right therapist.
      </p>

      {serverError && (
        <div
          ref={errorRef}
          role="alert"
          tabIndex={-1}
          className="p-4 rounded-md border border-err/20 bg-err-l flex gap-3 items-start mb-6"
        >
          <svg
            aria-hidden="true"
            className="w-5 h-5 shrink-0 mt-0.5 text-err"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <p className="text-[0.9375rem] font-medium text-err">{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <FormGroup title="Details">
          {/* Presenting issue */}
          <div>
            <label htmlFor="presentingIssue" className={labelClass}>
              Presenting issue
            </label>
            <Input
              id="presentingIssue"
              {...register("presentingIssue")}
              aria-required="true"
              aria-invalid={!!errors.presentingIssue}
              aria-describedby={errors.presentingIssue ? "presentingIssue-error" : undefined}
              error={!!errors.presentingIssue}
              placeholder="e.g., Anxiety, Depression, Trauma"
            />
            {errors.presentingIssue && (
              <p id="presentingIssue-error" className="mt-1 text-[0.75rem] text-err">
                {errors.presentingIssue.message}
              </p>
            )}
          </div>

          {/* Details */}
          <div>
            <label htmlFor="details" className={labelClass}>
              More details
            </label>
            <div className="mb-3">
              <PHINotice>
                Do not include client names, dates of birth, email addresses, or any identifying
                health details.
              </PHINotice>
            </div>
            <Textarea
              id="details"
              {...register("details")}
              aria-required="true"
              aria-invalid={!!errors.details}
              aria-describedby={errors.details ? "details-error" : undefined}
              error={!!errors.details}
              placeholder="Any additional context for the receiving therapist..."
              maxLength={1000}
            />
            <div className="flex items-center justify-between mt-1">
              {errors.details ? (
                <p id="details-error" className="text-[0.75rem] text-err">
                  {errors.details.message}
                </p>
              ) : (
                <span />
              )}
              <span className="text-[0.75rem] text-fg-4">{details.length}/1000</span>
            </div>
          </div>

          {/* Ages (dropdown) */}
          <div>
            <label htmlFor="ageGroup" className={labelClass}>
              Ages
            </label>
            <Select
              id="ageGroup"
              {...register("ageGroup")}
              aria-required="true"
              aria-invalid={!!errors.ageGroup}
              aria-describedby={errors.ageGroup ? "ageGroup-error" : undefined}
              error={!!errors.ageGroup}
              defaultValue=""
            >
              <option value="" disabled>
                Select age group...
              </option>
              {AGE_OPTIONS.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </Select>
            {errors.ageGroup && (
              <p id="ageGroup-error" className="mt-1 text-[0.75rem] text-err">
                {errors.ageGroup.message}
              </p>
            )}
          </div>

          {/* Modalities (checkboxes) */}
          <CheckboxGroup
            name="modalities"
            control={control}
            label="Modalities"
            options={[...MODALITIES].map((m) => ({ value: m, label: MODALITY_LABELS[m] ?? m }))}
            layout="inline"
            error={errors.modalities?.message}
          />
        </FormGroup>

        <FormGroup title="Service preferences">
          {/* Participants (dropdown) */}
          <div>
            <label htmlFor="participants" className={labelClass}>
              Participants <span className="font-normal text-fg-4">(optional)</span>
            </label>
            <Select id="participants" {...register("participants")} defaultValue="">
              <option value="">Select participant type...</option>
              {PARTICIPANT_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </Select>
          </div>

          {/* City + Province */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className={labelClass}>
                City <span className="font-normal text-fg-4">(optional)</span>
              </label>
              <Input id="city" {...register("city")} placeholder="e.g., Toronto" />
            </div>
            <div>
              <label htmlFor="province" className={labelClass}>
                Province <span className="font-normal text-fg-4">(optional)</span>
              </label>
              <Select id="province" {...register("province")} defaultValue="">
                <option value="">Select province...</option>
                {PROVINCES.map((p) => {
                  const unsupported = UNSUPPORTED_PROVINCES.has(p.value);
                  return (
                    <option key={p.value} value={p.value} disabled={unsupported}>
                      {p.label}
                      {unsupported ? " (not yet supported)" : ""}
                    </option>
                  );
                })}
              </Select>
              <p className="mt-1 text-[0.75rem] italic text-fg-3 tracking-[0.015em]">
                Quebec is not yet supported.
              </p>
            </div>
          </div>

          {/* Rate (radio buttons) */}
          <RadioGroup
            name="rate"
            control={control}
            label="Rate"
            optional
            options={RATE_OPTIONS.map((r) => ({ value: r, label: r }))}
            layout="inline"
            allowDeselect
          />

          {/* Insurance */}
          <div>
            <span className={labelClass}>
              Insurance <span className="font-normal text-fg-4">(optional)</span>
            </span>
            <BooleanCheckbox
              name="insuranceRequired"
              control={control}
              label="Insurance required"
            />
          </div>
        </FormGroup>

        {/* Collapsible additional details */}
        <div className="border border-border rounded-sm">
          <button
            type="button"
            onClick={() => setShowDetails((prev) => !prev)}
            className="w-full flex items-center justify-between px-4 py-3 bg-transparent border-none cursor-pointer text-left font-sans"
            aria-expanded={showDetails}
            aria-controls="additional-details-section"
          >
            <span className="text-[0.875rem] font-medium text-fg-2">Additional details</span>
            <svg
              aria-hidden="true"
              className={`w-4 h-4 text-fg-4 transition-transform duration-200 ${
                showDetails ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showDetails && (
            <div
              id="additional-details-section"
              className="px-4 pb-4 space-y-5 border-t border-border"
            >
              {/* Therapist gender preference */}
              <div className="pt-4">
                <label htmlFor="therapistGenderPref" className={labelClass}>
                  Therapist gender preference{" "}
                  <span className="font-normal text-fg-4">(optional)</span>
                </label>
                <Select
                  id="therapistGenderPref"
                  {...register("therapistGenderPref")}
                  defaultValue=""
                >
                  <option value="">Select preference...</option>
                  {THERAPIST_GENDER_PREF_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Therapy types */}
              <Controller
                name="therapyTypes"
                control={control}
                render={({ field }) => (
                  <AutocompleteSelect
                    label="Therapy types"
                    optional
                    options={therapyTypeOptions}
                    selected={
                      (field.value ?? [])
                        .map((name) => therapyTypeOptions.find((o) => o.name === name))
                        .filter(Boolean) as AutocompleteOption[]
                    }
                    onChange={(selected) => field.onChange(selected.map((s) => s.name))}
                    placeholder="Search therapy types..."
                    loading={!therapyTypesData}
                  />
                )}
              />

              {/* Languages (renamed from "Language requirements") */}
              <Controller
                name="languages"
                control={control}
                render={({ field }) => (
                  <AutocompleteSelect
                    label="Languages"
                    optional
                    options={languageOptions}
                    selected={
                      (field.value ?? [])
                        .map((name) => languageOptions.find((o) => o.name === name))
                        .filter(Boolean) as AutocompleteOption[]
                    }
                    onChange={(selected) => field.onChange(selected.map((s) => s.name))}
                    placeholder="Search languages..."
                    loading={!languagesData}
                  />
                )}
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border-s">
          <Button type="button" variant="secondary" onClick={() => router.push("/referrals")}>
            Cancel
          </Button>
          <Button type="submit" loading={createReferral.isPending}>
            {createReferral.isPending ? "Posting..." : "Post referral"}
          </Button>
        </div>
      </form>
    </div>
  );
}
