"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useTRPC } from "@/lib/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { referralPostSchema, type ReferralPostFormData } from "@/lib/validations/referral-post";
import {
  AutocompleteSelect,
  type AutocompleteOption,
} from "@/features/onboarding/components/AutocompleteSelect";
import { FormGroup } from "@/components/ui/FormGroup";

const AGE_GROUPS = [
  "Children (6-12)",
  "Adolescents (13-17)",
  "Young Adults (18-25)",
  "Adults (26-64)",
  "Seniors (65+)",
];

const PROVINCES = [
  { value: "AB", label: "Alberta" },
  { value: "BC", label: "British Columbia" },
  { value: "MB", label: "Manitoba" },
  { value: "NB", label: "New Brunswick" },
  { value: "NL", label: "Newfoundland and Labrador" },
  { value: "NS", label: "Nova Scotia" },
  { value: "NT", label: "Northwest Territories" },
  { value: "NU", label: "Nunavut" },
  { value: "ON", label: "Ontario" },
  { value: "PE", label: "Prince Edward Island" },
  { value: "QC", label: "Quebec" },
  { value: "SK", label: "Saskatchewan" },
  { value: "YT", label: "Yukon" },
];

const MODALITY_OPTIONS = [
  { value: "in-person", label: "In-person" },
  { value: "virtual", label: "Virtual" },
  { value: "phone", label: "Phone" },
] as const;

const PARTICIPANTS = ["Individual", "Couples", "Family", "Group"] as const;

const RATE_OPTIONS = ["Full fee", "Sliding scale", "Pro-bono"] as const;

const THERAPIST_GENDER_PREF_OPTIONS = ["Any", "Female", "Male", "Non-binary"] as const;

const selectStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%238F8279' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
};

const inputBaseClass =
  "w-full h-11 px-3 bg-inset text-fg border rounded-sm text-[0.9375rem] font-sans transition-[border-color,background,box-shadow] duration-150 ease-out focus:border-border-f focus:bg-bg focus:outline-2 focus:outline-border-f focus:outline-offset-2 placeholder:text-fg-4";

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
      modalities: ["in-person"],
      city: "",
      province: "",
      rate: "",
      therapistGenderPref: "",
      therapyTypes: [],
      languages: [],
      additionalContext: "",
    },
  });

  const details = watch("details") ?? "";
  const additionalContext = watch("additionalContext") ?? "";

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
        <FormGroup title="Client need">
          {/* 1. Presenting issue */}
          <div>
            <label htmlFor="presentingIssue" className={labelClass}>
              Presenting issue
            </label>
            <input
              id="presentingIssue"
              {...register("presentingIssue")}
              aria-required="true"
              aria-invalid={!!errors.presentingIssue}
              aria-describedby={errors.presentingIssue ? "presentingIssue-error" : undefined}
              className={`${inputBaseClass} ${errors.presentingIssue ? "border-err" : "border-border"}`}
              placeholder="e.g., Anxiety, Depression, Trauma"
            />
            {errors.presentingIssue && (
              <p id="presentingIssue-error" className="mt-1 text-[0.75rem] text-err">
                {errors.presentingIssue.message}
              </p>
            )}
          </div>

          {/* 2. Details (renamed from "Additional notes") */}
          <div>
            <label htmlFor="details" className={labelClass}>
              Details
            </label>
            <div className="p-3 rounded-sm border-l-[3px] border-l-warn bg-warn-l mb-3">
              <p className="text-[0.875rem] text-fg-2 m-0">
                Do not include client names, dates of birth, or identifying health details.
              </p>
            </div>
            <textarea
              id="details"
              {...register("details")}
              aria-invalid={!!errors.details}
              aria-describedby={errors.details ? "details-error" : undefined}
              className={`w-full min-h-[100px] p-3 bg-inset text-fg border rounded-sm text-[0.9375rem] font-sans resize-y transition-[border-color] duration-150 ease-out focus:border-border-f focus:bg-bg focus:outline-2 focus:outline-border-f focus:outline-offset-2 placeholder:text-fg-4 ${
                errors.details ? "border-err" : "border-border"
              }`}
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

          {/* 3. Participants (dropdown) */}
          <div>
            <label htmlFor="participants" className={labelClass}>
              Participants <span className="font-normal text-fg-4">(optional)</span>
            </label>
            <select
              id="participants"
              {...register("participants")}
              className={`${inputBaseClass} cursor-pointer pr-9 appearance-none border-border`}
              style={selectStyle}
              defaultValue=""
            >
              <option value="">Select participant type...</option>
              {PARTICIPANTS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Age group */}
          <div>
            <label htmlFor="ageGroup" className={labelClass}>
              Age group
            </label>
            <select
              id="ageGroup"
              {...register("ageGroup")}
              aria-required="true"
              aria-invalid={!!errors.ageGroup}
              aria-describedby={errors.ageGroup ? "ageGroup-error" : undefined}
              className={`${inputBaseClass} cursor-pointer pr-9 appearance-none ${
                errors.ageGroup ? "border-err" : "border-border"
              }`}
              style={selectStyle}
              defaultValue=""
            >
              <option value="" disabled>
                Select age group...
              </option>
              {AGE_GROUPS.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
            {errors.ageGroup && (
              <p id="ageGroup-error" className="mt-1 text-[0.75rem] text-err">
                {errors.ageGroup.message}
              </p>
            )}
          </div>
        </FormGroup>

        <FormGroup title="Matching preferences">
          {/* 5. Modalities (checkboxes, "In-person" pre-selected) */}
          <fieldset
            className="border-none p-0 m-0"
            aria-required="true"
            aria-invalid={!!errors.modalities}
            aria-describedby={errors.modalities ? "modalities-error" : undefined}
          >
            <legend className={labelClass}>Modalities</legend>
            <Controller
              name="modalities"
              control={control}
              render={({ field }) => (
                <div className="flex flex-wrap gap-4">
                  {MODALITY_OPTIONS.map((m) => {
                    const checked = (field.value ?? []).includes(m.value);
                    return (
                      <label
                        key={m.value}
                        className="inline-flex items-center gap-2 cursor-pointer text-[0.9375rem] text-fg select-none leading-[1.4] hover:[&>.cb-box]:border-border-e hover:[&>.cb-box]:bg-bg hover:[&_input:checked+.cb-box]:bg-brand-h hover:[&_input:checked+.cb-box]:border-brand-h"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            const current = field.value ?? [];
                            if (e.target.checked) {
                              field.onChange([...current, m.value]);
                            } else {
                              field.onChange(current.filter((v: string) => v !== m.value));
                            }
                          }}
                          className="sr-only peer"
                        />
                        <span className="cb-box w-[18px] h-[18px] shrink-0 rounded-[4px] border border-border bg-inset inline-flex items-center justify-center transition-[background,border-color,box-shadow] duration-150 ease-out peer-checked:bg-brand peer-checked:border-brand peer-checked:[&>svg]:opacity-100 peer-checked:[&>svg]:scale-100 peer-focus-visible:outline-2 peer-focus-visible:outline-border-f peer-focus-visible:outline-offset-2">
                          <svg
                            className="w-3 h-3 opacity-0 scale-[0.6] transition-[opacity,transform] duration-150 ease-out"
                            viewBox="0 0 12 12"
                            fill="none"
                            stroke="white"
                            strokeWidth={3}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <polyline points="2.5,6 5,8.5 9.5,3.5" />
                          </svg>
                        </span>
                        {m.label}
                      </label>
                    );
                  })}
                </div>
              )}
            />
            {errors.modalities && (
              <p id="modalities-error" className="mt-1 text-[0.75rem] text-err">
                {errors.modalities.message}
              </p>
            )}
          </fieldset>

          {/* 6. City + Province (both optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className={labelClass}>
                City <span className="font-normal text-fg-4">(optional)</span>
              </label>
              <input
                id="city"
                {...register("city")}
                className={`${inputBaseClass} border-border`}
                placeholder="e.g., Toronto"
              />
            </div>
            <div>
              <label htmlFor="province" className={labelClass}>
                Province <span className="font-normal text-fg-4">(optional)</span>
              </label>
              <select
                id="province"
                {...register("province")}
                className={`${inputBaseClass} cursor-pointer pr-9 appearance-none border-border`}
                style={selectStyle}
                defaultValue=""
              >
                <option value="">Select province...</option>
                {PROVINCES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 7. Rate (radio buttons, optional) */}
          <fieldset>
            <legend className={labelClass}>
              Rate <span className="font-normal text-fg-4">(optional)</span>
            </legend>
            <div className="flex flex-wrap gap-4">
              {RATE_OPTIONS.map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value={option}
                    {...register("rate")}
                    className="w-4 h-4 accent-brand"
                  />
                  <span className="text-[0.9375rem] text-fg">{option}</span>
                </label>
              ))}
            </div>
          </fieldset>
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
                <select
                  id="therapistGenderPref"
                  {...register("therapistGenderPref")}
                  className={`${inputBaseClass} cursor-pointer pr-9 appearance-none border-border`}
                  style={selectStyle}
                  defaultValue=""
                >
                  <option value="">Select preference...</option>
                  {THERAPIST_GENDER_PREF_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Therapeutic approaches (renamed from "Therapy types") */}
              <Controller
                name="therapyTypes"
                control={control}
                render={({ field }) => (
                  <AutocompleteSelect
                    label="Therapeutic approaches"
                    options={therapyTypeOptions}
                    selected={
                      (field.value ?? [])
                        .map((name) => therapyTypeOptions.find((o) => o.name === name))
                        .filter(Boolean) as AutocompleteOption[]
                    }
                    onChange={(selected) => field.onChange(selected.map((s) => s.name))}
                    placeholder="Search therapeutic approaches..."
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

              {/* Additional context */}
              <div>
                <label htmlFor="additionalContext" className={labelClass}>
                  Additional context <span className="font-normal text-fg-4">(optional)</span>
                </label>
                <textarea
                  id="additionalContext"
                  {...register("additionalContext")}
                  aria-invalid={!!errors.additionalContext}
                  aria-describedby={
                    errors.additionalContext ? "additionalContext-error" : undefined
                  }
                  className={`w-full min-h-[100px] p-3 bg-inset text-fg border rounded-sm text-[0.9375rem] font-sans resize-y transition-[border-color] duration-150 ease-out focus:border-border-f focus:bg-bg focus:outline-2 focus:outline-border-f focus:outline-offset-2 placeholder:text-fg-4 ${
                    errors.additionalContext ? "border-err" : "border-border"
                  }`}
                  placeholder="Any other relevant context for matching..."
                  maxLength={2000}
                />
                <div className="flex items-center justify-between mt-1">
                  {errors.additionalContext ? (
                    <p id="additionalContext-error" className="text-[0.75rem] text-err">
                      {errors.additionalContext.message}
                    </p>
                  ) : (
                    <span />
                  )}
                  <span className="text-[0.75rem] text-fg-4">{additionalContext.length}/2000</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-s">
          <button
            type="button"
            onClick={() => router.push("/referrals")}
            className="inline-flex items-center justify-center h-11 px-6 bg-transparent text-fg-2 border border-border rounded-sm text-[0.8125rem] font-semibold tracking-[0.01em] cursor-pointer transition-[border-color,background] duration-150 ease-out font-sans hover:bg-inset hover:border-border-e focus-visible:outline-2 focus-visible:outline-border-f focus-visible:outline-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createReferral.isPending}
            className="inline-flex items-center justify-center gap-2 h-11 px-6 bg-brand text-brand-on border-none rounded-sm text-[0.8125rem] font-semibold tracking-[0.01em] cursor-pointer transition-[background] duration-150 ease-out font-sans hover:bg-brand-h focus-visible:outline-2 focus-visible:outline-border-f focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createReferral.isPending ? (
              <>
                <span
                  aria-hidden="true"
                  className="w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin"
                />
                Posting...
              </>
            ) : (
              "Post referral"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
