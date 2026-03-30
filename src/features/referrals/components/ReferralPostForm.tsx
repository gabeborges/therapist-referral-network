"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useTRPC } from "@/lib/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  referralPostSchema,
  type ReferralPostFormData,
} from "@/lib/validations/referral-post";
import {
  AutocompleteSelect,
  type AutocompleteOption,
} from "@/features/onboarding/components/AutocompleteSelect";

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

const MODALITIES = [
  { value: "in-person", label: "In-Person" },
  { value: "virtual", label: "Virtual" },
  { value: "both", label: "Both" },
] as const;

const PARTICIPANTS = ["Individual", "Couples", "Family", "Group"] as const;

const RATE_BILLING_OPTIONS = [
  "",
  "Full fee",
  "Sliding scale",
  "Pro-bono",
  "Direct billing",
] as const;

const CLIENT_GENDER_OPTIONS = [
  "",
  "Male",
  "Female",
  "Non-binary",
  "Prefer not to say",
] as const;

const THERAPIST_GENDER_PREF_OPTIONS = [
  "",
  "Any",
  "Female",
  "Male",
  "Non-binary",
] as const;

const inputBaseClass =
  "w-full h-11 px-3 bg-inset text-fg border rounded-sm text-[0.9375rem] font-sans transition-[border-color,background,box-shadow] duration-150 ease-out focus:border-border-f focus:bg-bg focus:outline-2 focus:outline-border-f focus:outline-offset-2 placeholder:text-fg-4";

const labelClass =
  "block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2";

export function ReferralPostForm(): React.ReactElement {
  const router = useRouter();
  const trpc = useTRPC();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);

  const { data: specialtiesData } = useQuery(
    trpc.taxonomy.getSpecialties.queryOptions(),
  );
  const { data: therapyTypesData } = useQuery(
    trpc.taxonomy.getTherapyTypes.queryOptions(),
  );
  const { data: languagesData } = useQuery(
    trpc.taxonomy.getLanguages.queryOptions(),
  );

  const therapyTypeOptions: AutocompleteOption[] = (therapyTypesData ?? []).map(
    (t) => ({ id: t.id, name: t.name }),
  );
  const languageOptions: AutocompleteOption[] = (languagesData ?? []).map(
    (l) => ({ id: l.id, name: l.name }),
  );

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
      ageGroup: "",
      locationCity: "",
      locationProvince: "",
      modality: undefined,
      participants: undefined,
      rateBilling: "",
      additionalNotes: "",
      clientGender: "",
      clientAge: "",
      therapistGenderPref: "",
      therapyTypes: [],
      languageRequirements: [],
      additionalContext: "",
    },
  });

  const additionalNotes = watch("additionalNotes") ?? "";
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
        Post a Referral
      </h2>
      <p className="text-[0.875rem] text-fg-2 mb-6">
        Describe the client need and we will match them with the right
        therapist.
      </p>

      {serverError && (
        <div ref={errorRef} role="alert" tabIndex={-1} className="p-4 rounded-md border border-err/20 bg-err-l flex gap-3 items-start mb-6">
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Presenting Issue */}
        <div>
          <label htmlFor="presentingIssue" className={labelClass}>Presenting Issue</label>
          <input
            id="presentingIssue"
            {...register("presentingIssue")}
            aria-required="true"
            aria-invalid={!!errors.presentingIssue}
            aria-describedby={errors.presentingIssue ? "presentingIssue-error" : undefined}
            className={`${inputBaseClass} ${
              errors.presentingIssue ? "border-err" : "border-border"
            }`}
            placeholder="e.g., Anxiety, Depression, Trauma"
          />
          {errors.presentingIssue && (
            <p id="presentingIssue-error" className="mt-1 text-[0.75rem] text-err">
              {errors.presentingIssue.message}
            </p>
          )}
        </div>

        {/* Age Group */}
        <div>
          <label htmlFor="ageGroup" className={labelClass}>Age Group</label>
          <select
            id="ageGroup"
            {...register("ageGroup")}
            aria-required="true"
            aria-invalid={!!errors.ageGroup}
            aria-describedby={errors.ageGroup ? "ageGroup-error" : undefined}
            className={`${inputBaseClass} cursor-pointer pr-9 appearance-none ${
              errors.ageGroup ? "border-err" : "border-border"
            }`}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%238F8279' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12px center",
            }}
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

        {/* Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="locationCity" className={labelClass}>
              City{" "}
              <span className="font-normal text-fg-4">(optional)</span>
            </label>
            <input
              id="locationCity"
              {...register("locationCity")}
              className={`${inputBaseClass} border-border`}
              placeholder="e.g., Toronto"
            />
          </div>
          <div>
            <label htmlFor="locationProvince" className={labelClass}>Province / Territory</label>
            <select
              id="locationProvince"
              {...register("locationProvince")}
              aria-required="true"
              aria-invalid={!!errors.locationProvince}
              aria-describedby={errors.locationProvince ? "locationProvince-error" : undefined}
              className={`${inputBaseClass} cursor-pointer pr-9 appearance-none ${
                errors.locationProvince ? "border-err" : "border-border"
              }`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%238F8279' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 12px center",
              }}
              defaultValue=""
            >
              <option value="" disabled>
                Select province...
              </option>
              {PROVINCES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            {errors.locationProvince && (
              <p id="locationProvince-error" className="mt-1 text-[0.75rem] text-err">
                {errors.locationProvince.message}
              </p>
            )}
          </div>
        </div>

        {/* Modality */}
        <fieldset
          aria-required="true"
          aria-invalid={!!errors.modality}
          aria-describedby={errors.modality ? "modality-error" : undefined}
        >
          <legend className={labelClass}>Preferred Modality</legend>
          <div className="flex flex-wrap gap-3">
            {MODALITIES.map((m) => (
              <label
                key={m.value}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  value={m.value}
                  {...register("modality")}
                  className="w-4 h-4 accent-brand"
                />
                <span className="text-[0.9375rem] text-fg">{m.label}</span>
              </label>
            ))}
          </div>
          {errors.modality && (
            <p id="modality-error" className="mt-1 text-[0.75rem] text-err">
              {errors.modality.message}
            </p>
          )}
        </fieldset>

        {/* Participants */}
        <fieldset>
          <legend className={labelClass}>Participants</legend>
          <div className="flex flex-wrap gap-3">
            {PARTICIPANTS.map((p) => (
              <label
                key={p}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  value={p}
                  {...register("participants")}
                  className="w-4 h-4 accent-brand"
                />
                <span className="text-[0.9375rem] text-fg">{p}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Rate / Billing */}
        <div>
          <label htmlFor="rateBilling" className={labelClass}>
            Rate / Billing{" "}
            <span className="font-normal text-fg-4">(optional)</span>
          </label>
          <select
            id="rateBilling"
            {...register("rateBilling")}
            className={`${inputBaseClass} cursor-pointer pr-9 appearance-none border-border`}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%238F8279' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12px center",
            }}
            defaultValue=""
          >
            <option value="">Select billing preference...</option>
            {RATE_BILLING_OPTIONS.filter((o) => o !== "").map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Collapsible Additional Details */}
        <div className="border border-border rounded-sm">
          <button
            type="button"
            onClick={() => setShowDetails((prev) => !prev)}
            className="w-full flex items-center justify-between px-4 py-3 bg-transparent border-none cursor-pointer text-left font-sans"
            aria-expanded={showDetails}
            aria-controls="additional-details-section"
          >
            <span className="text-[0.875rem] font-medium text-fg-2">
              Additional Details
            </span>
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
              {/* Client Gender */}
              <div className="pt-4">
                <label htmlFor="clientGender" className={labelClass}>
                  Client Gender{" "}
                  <span className="font-normal text-fg-4">(optional)</span>
                </label>
                <select
                  id="clientGender"
                  {...register("clientGender")}
                  className={`${inputBaseClass} cursor-pointer pr-9 appearance-none border-border`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%238F8279' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 12px center",
                  }}
                  defaultValue=""
                >
                  <option value="">Select gender...</option>
                  {CLIENT_GENDER_OPTIONS.filter((o) => o !== "").map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Client Age */}
              <div>
                <label htmlFor="clientAge" className={labelClass}>
                  Client Age{" "}
                  <span className="font-normal text-fg-4">(optional)</span>
                </label>
                <input
                  id="clientAge"
                  {...register("clientAge")}
                  className={`${inputBaseClass} border-border`}
                  placeholder="e.g., 34"
                />
              </div>

              {/* Therapist Gender Preference */}
              <div>
                <label htmlFor="therapistGenderPref" className={labelClass}>
                  Therapist Gender Preference{" "}
                  <span className="font-normal text-fg-4">(optional)</span>
                </label>
                <select
                  id="therapistGenderPref"
                  {...register("therapistGenderPref")}
                  className={`${inputBaseClass} cursor-pointer pr-9 appearance-none border-border`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%238F8279' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 12px center",
                  }}
                  defaultValue=""
                >
                  <option value="">Select preference...</option>
                  {THERAPIST_GENDER_PREF_OPTIONS.filter((o) => o !== "").map(
                    (option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ),
                  )}
                </select>
              </div>

              {/* Therapy Types */}
              <Controller
                name="therapyTypes"
                control={control}
                render={({ field }) => (
                  <AutocompleteSelect
                    label="Therapy Types"
                    options={therapyTypeOptions}
                    selected={
                      (field.value ?? [])
                        .map((name) =>
                          therapyTypeOptions.find((o) => o.name === name),
                        )
                        .filter(Boolean) as AutocompleteOption[]
                    }
                    onChange={(selected) =>
                      field.onChange(selected.map((s) => s.name))
                    }
                    placeholder="Search therapy types..."
                    loading={!therapyTypesData}
                  />
                )}
              />

              {/* Language Requirements */}
              <Controller
                name="languageRequirements"
                control={control}
                render={({ field }) => (
                  <AutocompleteSelect
                    label="Language Requirements"
                    options={languageOptions}
                    selected={
                      (field.value ?? [])
                        .map((name) =>
                          languageOptions.find((o) => o.name === name),
                        )
                        .filter(Boolean) as AutocompleteOption[]
                    }
                    onChange={(selected) =>
                      field.onChange(selected.map((s) => s.name))
                    }
                    placeholder="Search languages..."
                    loading={!languagesData}
                  />
                )}
              />

              {/* Additional Context */}
              <div>
                <label htmlFor="additionalContext" className={labelClass}>
                  Additional Context{" "}
                  <span className="font-normal text-fg-4">(optional)</span>
                </label>
                <textarea
                  id="additionalContext"
                  {...register("additionalContext")}
                  aria-invalid={!!errors.additionalContext}
                  aria-describedby={
                    errors.additionalContext
                      ? "additionalContext-error"
                      : undefined
                  }
                  className={`w-full min-h-[100px] p-3 bg-inset text-fg border rounded-sm text-[0.9375rem] font-sans resize-y transition-[border-color] duration-150 ease-out focus:border-border-f focus:bg-bg focus:outline-2 focus:outline-border-f focus:outline-offset-2 placeholder:text-fg-4 ${
                    errors.additionalContext ? "border-err" : "border-border"
                  }`}
                  placeholder="Any other relevant context for matching..."
                  maxLength={2000}
                />
                <div className="flex items-center justify-between mt-1">
                  {errors.additionalContext ? (
                    <p
                      id="additionalContext-error"
                      className="text-[0.75rem] text-err"
                    >
                      {errors.additionalContext.message}
                    </p>
                  ) : (
                    <span />
                  )}
                  <span className="text-[0.75rem] text-fg-4">
                    {additionalContext.length}/2000
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Additional Notes */}
        <div>
          <label htmlFor="additionalNotes" className={labelClass}>Additional Notes</label>

          {/* PHI reminder */}
          <div className="p-3 rounded-sm border-l-[3px] border-l-warn bg-warn-l mb-3">
            <p className="text-[0.875rem] text-fg-2 m-0">
              Do not include client names, dates of birth, or identifying health
              details.
            </p>
          </div>

          <textarea
            id="additionalNotes"
            {...register("additionalNotes")}
            aria-invalid={!!errors.additionalNotes}
            aria-describedby={errors.additionalNotes ? "additionalNotes-error" : undefined}
            className={`w-full min-h-[100px] p-3 bg-inset text-fg border rounded-sm text-[0.9375rem] font-sans resize-y transition-[border-color] duration-150 ease-out focus:border-border-f focus:bg-bg focus:outline-2 focus:outline-border-f focus:outline-offset-2 placeholder:text-fg-4 ${
              errors.additionalNotes ? "border-err" : "border-border"
            }`}
            placeholder="Any additional context for the receiving therapist..."
            maxLength={1000}
          />
          <div className="flex items-center justify-between mt-1">
            {errors.additionalNotes ? (
              <p id="additionalNotes-error" className="text-[0.75rem] text-err">
                {errors.additionalNotes.message}
              </p>
            ) : (
              <span />
            )}
            <span className="text-[0.75rem] text-fg-4">
              {additionalNotes.length}/1000
            </span>
          </div>
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
                <span aria-hidden="true" className="w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Posting...
              </>
            ) : (
              "Post Referral"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
