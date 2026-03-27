"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTRPC } from "@/lib/trpc/client";
import { useMutation } from "@tanstack/react-query";
import {
  therapistProfileSchema,
  type TherapistProfileFormData,
} from "@/lib/validations/therapist-profile";
import { ChipSelect } from "@/features/onboarding/components/ChipSelect";

const SPECIALTIES = [
  "Anxiety",
  "Depression",
  "Trauma / PTSD",
  "Relationship Issues",
  "Grief & Loss",
  "ADHD",
  "OCD",
  "Eating Disorders",
  "Substance Use",
  "Self-Harm",
  "Personality Disorders",
  "Bipolar Disorder",
  "Anger Management",
  "Stress Management",
  "Life Transitions",
  "Self-Esteem",
  "Sexual Abuse",
  "Domestic Violence",
];

const MODALITIES = ["In-Person", "Virtual", "Phone"];

const THERAPEUTIC_APPROACHES = [
  "CBT",
  "EMDR",
  "Psychodynamic",
  "DBT",
  "Somatic",
  "ACT",
  "Narrative Therapy",
  "Solution-Focused",
  "Art Therapy",
  "Play Therapy",
  "Mindfulness-Based",
  "Internal Family Systems (IFS)",
  "Emotion-Focused Therapy (EFT)",
];

const LANGUAGES = [
  "English",
  "French",
  "Spanish",
  "Portuguese",
  "Mandarin",
  "Cantonese",
  "Punjabi",
  "Hindi",
  "Arabic",
  "Tagalog",
  "Italian",
  "German",
  "Korean",
  "Japanese",
  "Vietnamese",
  "Farsi",
  "Urdu",
  "Tamil",
  "ASL",
];

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

const INSURERS = [
  "Blue Cross",
  "Sun Life",
  "Manulife",
  "Green Shield",
  "Canada Life",
  "Desjardins",
  "Industrial Alliance",
  "SSQ Insurance",
  "Equitable Life",
  "Medavie Blue Cross",
  "TELUS Health",
];

export function OnboardingProfileForm(): React.ReactElement {
  const router = useRouter();
  const trpc = useTRPC();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<TherapistProfileFormData>({
    resolver: zodResolver(therapistProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      displayName: "",
      bio: "",
      city: "",
      province: "",
      country: "CA" as const,
      specialties: [],
      modalities: [],
      therapeuticApproach: [],
      languages: [],
      ageGroups: [],
      acceptsInsurance: false,
      directBilling: false,
      insurers: [],
      hourlyRate: undefined,
      reducedFees: false,
      acceptingClients: true,
    },
  });

  const acceptsInsurance = watch("acceptsInsurance");

  const createProfile = useMutation(
    trpc.therapist.createProfile.mutationOptions({
      onSuccess() {
        router.push("/referrals");
      },
      onError(error) {
        setServerError(error.message);
      },
    }),
  );

  function onSubmit(data: TherapistProfileFormData): void {
    setServerError(null);
    createProfile.mutate(data);
  }

  return (
    <div className="bg-s1 border border-border rounded-md p-6 shadow-1">
      <h2 className="text-[1.25rem] font-semibold tracking-[-0.01em] leading-[1.35] text-fg mb-4">
        Your Profile
      </h2>

      {serverError && (
        <div className="p-4 rounded-md border border-err/20 bg-err-l flex gap-3 items-start mb-6">
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
        {/* Name fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ob-firstName" className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2">
              First Name
            </label>
            <input
              id="ob-firstName"
              {...register("firstName")}
              aria-required="true"
              aria-invalid={!!errors.firstName}
              aria-describedby={errors.firstName ? "ob-firstName-error" : undefined}
              className={`w-full h-11 px-3 bg-inset text-fg border rounded-sm text-[0.9375rem] font-sans transition-[border-color,background,box-shadow] duration-150 ease-out focus:border-border-f focus:bg-bg focus:outline-2 focus:outline-border-f focus:outline-offset-2 placeholder:text-fg-4 ${
                errors.firstName ? "border-err" : "border-border"
              }`}
              placeholder="First name"
            />
            {errors.firstName && (
              <p id="ob-firstName-error" className="mt-1 text-[0.75rem] text-err">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="ob-lastName" className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2">
              Last Name
            </label>
            <input
              id="ob-lastName"
              {...register("lastName")}
              aria-required="true"
              aria-invalid={!!errors.lastName}
              aria-describedby={errors.lastName ? "ob-lastName-error" : undefined}
              className={`w-full h-11 px-3 bg-inset text-fg border rounded-sm text-[0.9375rem] font-sans transition-[border-color,background,box-shadow] duration-150 ease-out focus:border-border-f focus:bg-bg focus:outline-2 focus:outline-border-f focus:outline-offset-2 placeholder:text-fg-4 ${
                errors.lastName ? "border-err" : "border-border"
              }`}
              placeholder="Last name"
            />
            {errors.lastName && (
              <p id="ob-lastName-error" className="mt-1 text-[0.75rem] text-err">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        {/* Display Name */}
        <div>
          <label htmlFor="ob-displayName" className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2">
            Display Name
          </label>
          <input
            id="ob-displayName"
            {...register("displayName")}
            aria-required="true"
            aria-invalid={!!errors.displayName}
            aria-describedby={errors.displayName ? "ob-displayName-error" : undefined}
            className={`w-full h-11 px-3 bg-inset text-fg border rounded-sm text-[0.9375rem] font-sans transition-[border-color,background,box-shadow] duration-150 ease-out focus:border-border-f focus:bg-bg focus:outline-2 focus:outline-border-f focus:outline-offset-2 placeholder:text-fg-4 ${
              errors.displayName ? "border-err" : "border-border"
            }`}
            placeholder="How your name appears to colleagues"
          />
          {errors.displayName && (
            <p id="ob-displayName-error" className="mt-1 text-[0.75rem] text-err">
              {errors.displayName.message}
            </p>
          )}
          <p className="mt-1 text-[0.75rem] italic text-fg-3 tracking-[0.015em]">
            This is how your name appears to other therapists in the network.
          </p>
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="ob-bio" className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2">
            About You
          </label>
          <div className="p-3 rounded-sm border-l-[3px] border-l-warn bg-warn-l mb-4">
            <p className="text-[0.875rem] text-fg-2 m-0">
              Do not include client-identifying information. Describe your
              practice approach and experience only.
            </p>
          </div>
          <textarea
            id="ob-bio"
            {...register("bio")}
            aria-invalid={!!errors.bio}
            aria-describedby={errors.bio ? "ob-bio-error" : undefined}
            className={`w-full min-h-[100px] p-3 bg-inset text-fg border rounded-sm text-[0.9375rem] font-sans resize-y transition-[border-color] duration-150 ease-out focus:border-border-f focus:bg-bg focus:outline-2 focus:outline-border-f focus:outline-offset-2 placeholder:text-fg-4 ${
              errors.bio ? "border-err" : "border-border"
            }`}
            placeholder="Tell colleagues about your practice, experience, and approach..."
          />
          {errors.bio && (
            <p id="ob-bio-error" className="mt-1 text-[0.75rem] text-err">
              {errors.bio.message}
            </p>
          )}
        </div>

        {/* Specialties */}
        <Controller
          name="specialties"
          control={control}
          render={({ field }) => (
            <ChipSelect
              label="Specialties"
              options={SPECIALTIES}
              selected={field.value}
              onChange={field.onChange}
              placeholder="Add specialties..."
              error={errors.specialties?.message}
              helperText="Used for matching. The more you add, the more referrals you'll receive."
            />
          )}
        />

        {/* Modalities */}
        <Controller
          name="modalities"
          control={control}
          render={({ field }) => (
            <ChipSelect
              label="Session Modalities"
              options={MODALITIES}
              selected={field.value}
              onChange={field.onChange}
              placeholder="Add modalities..."
              error={errors.modalities?.message}
              helperText="How you deliver therapy sessions."
            />
          )}
        />

        {/* Therapeutic Approaches */}
        <Controller
          name="therapeuticApproach"
          control={control}
          render={({ field }) => (
            <ChipSelect
              label="Therapeutic Approaches"
              options={THERAPEUTIC_APPROACHES}
              selected={field.value}
              onChange={field.onChange}
              placeholder="Add approaches..."
              error={errors.therapeuticApproach?.message}
              helperText="Referring therapists often request specific modalities for their clients."
            />
          )}
        />

        {/* Languages */}
        <Controller
          name="languages"
          control={control}
          render={({ field }) => (
            <ChipSelect
              label="Languages"
              options={LANGUAGES}
              selected={field.value}
              onChange={field.onChange}
              placeholder="Add languages..."
              error={errors.languages?.message}
            />
          )}
        />

        {/* Age Groups */}
        <Controller
          name="ageGroups"
          control={control}
          render={({ field }) => (
            <ChipSelect
              label="Age Groups Served"
              options={AGE_GROUPS}
              selected={field.value}
              onChange={field.onChange}
              placeholder="Add age groups..."
              error={errors.ageGroups?.message}
            />
          )}
        />

        {/* Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ob-city" className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2">
              City
            </label>
            <input
              id="ob-city"
              {...register("city")}
              aria-required="true"
              aria-invalid={!!errors.city}
              aria-describedby={errors.city ? "ob-city-error" : undefined}
              className={`w-full h-11 px-3 bg-inset text-fg border rounded-sm text-[0.9375rem] font-sans transition-[border-color,background,box-shadow] duration-150 ease-out focus:border-border-f focus:bg-bg focus:outline-2 focus:outline-border-f focus:outline-offset-2 placeholder:text-fg-4 ${
                errors.city ? "border-err" : "border-border"
              }`}
              placeholder="Your city"
            />
            {errors.city && (
              <p id="ob-city-error" className="mt-1 text-[0.75rem] text-err">
                {errors.city.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="ob-province" className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2">
              Province / Territory
            </label>
            <select
              id="ob-province"
              {...register("province")}
              aria-required="true"
              aria-invalid={!!errors.province}
              aria-describedby={errors.province ? "ob-province-error" : undefined}
              className={`w-full h-11 px-3 bg-inset text-fg border rounded-sm text-[0.9375rem] font-sans cursor-pointer transition-[border-color,background,box-shadow] duration-150 ease-out pr-9 appearance-none focus:border-border-f focus:bg-bg focus:outline-2 focus:outline-border-f focus:outline-offset-2 ${
                errors.province ? "border-err" : "border-border"
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
            {errors.province && (
              <p id="ob-province-error" className="mt-1 text-[0.75rem] text-err">
                {errors.province.message}
              </p>
            )}
          </div>
        </div>
        <p className="text-[0.75rem] italic text-fg-3 tracking-[0.015em] -mt-4">
          Location proximity is a key matching factor for in-person clients.
        </p>

        {/* Insurance */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer mb-3">
            <input
              type="checkbox"
              {...register("acceptsInsurance")}
              className="w-4 h-4 rounded accent-brand"
            />
            <span className="text-[0.9375rem] text-fg font-medium">
              I accept insurance
            </span>
          </label>

          {acceptsInsurance && (
            <>
              <label className="flex items-center gap-2 cursor-pointer mb-3">
                <input
                  type="checkbox"
                  {...register("directBilling")}
                  className="w-4 h-4 rounded accent-brand"
                />
                <span className="text-[0.875rem] text-fg-2">
                  I offer direct billing
                </span>
              </label>
              <Controller
                name="insurers"
                control={control}
                render={({ field }) => (
                  <ChipSelect
                    label="Insurance Plans Accepted"
                    options={INSURERS}
                    selected={field.value ?? []}
                    onChange={field.onChange}
                    placeholder="Add insurance plans..."
                    error={errors.insurers?.message}
                    helperText="Helps match clients who can afford your services."
                  />
                )}
              />
            </>
          )}
        </div>

        {/* Hourly Rate */}
        <div>
          <label htmlFor="ob-hourlyRate" className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2">
            Hourly Rate (CAD)
          </label>
          <input
            id="ob-hourlyRate"
            type="number"
            {...register("hourlyRate", { valueAsNumber: true })}
            aria-invalid={!!errors.hourlyRate}
            aria-describedby={errors.hourlyRate ? "ob-hourlyRate-error" : undefined}
            className={`w-full h-11 px-3 bg-inset text-fg border rounded-sm text-[0.9375rem] font-sans transition-[border-color,background,box-shadow] duration-150 ease-out focus:border-border-f focus:bg-bg focus:outline-2 focus:outline-border-f focus:outline-offset-2 placeholder:text-fg-4 ${
              errors.hourlyRate ? "border-err" : "border-border"
            }`}
            placeholder="e.g. 150"
          />
          {errors.hourlyRate && (
            <p id="ob-hourlyRate-error" className="mt-1 text-[0.75rem] text-err">
              {errors.hourlyRate.message}
            </p>
          )}
        </div>

        {/* Reduced Fees */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...register("reducedFees")}
            className="w-4 h-4 rounded accent-brand"
          />
          <span className="text-[0.9375rem] text-fg">
            I offer reduced fees / sliding scale
          </span>
        </label>

        {/* Accepting Clients */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[0.9375rem] text-fg font-medium">
              Currently accepting clients
            </p>
            <p className="text-[0.75rem] text-fg-3">
              Toggle off if your practice is full.
            </p>
          </div>
          <Controller
            name="acceptingClients"
            control={control}
            render={({ field }) => (
              <button
                type="button"
                role="switch"
                aria-checked={field.value}
                aria-label="Currently accepting clients"
                onClick={() => field.onChange(!field.value)}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    field.onChange(!field.value);
                  }
                }}
                className={`relative w-11 h-6 rounded-xl cursor-pointer border-none p-0 transition-[background] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-border-f focus-visible:outline-offset-2 ${
                  field.value ? "bg-ok" : "bg-fg-4"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.15)] transition-transform duration-150 ease-out ${
                    field.value ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            )}
          />
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-border-s">
          <button
            type="submit"
            disabled={createProfile.isPending}
            className="inline-flex items-center justify-center gap-2 w-full h-11 px-6 bg-brand text-brand-on border-none rounded-sm text-[0.8125rem] font-semibold tracking-[0.01em] cursor-pointer transition-[background] duration-150 ease-out font-sans hover:bg-brand-h focus-visible:outline-2 focus-visible:outline-border-f focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createProfile.isPending ? (
              <>
                <span className="w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Setting up...
              </>
            ) : (
              "Complete Setup"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
