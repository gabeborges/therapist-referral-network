"use client";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, useMemo } from "react";
import { useTRPC } from "@/lib/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  therapistProfileSchema,
  type TherapistProfileFormData,
  PRONOUNS_OPTIONS,
  AGE_OPTIONS,
  PARTICIPANT_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  GENDER_OPTIONS,
} from "@/lib/validations/therapist-profile";
import { CheckboxGroup } from "@/components/ui/CheckboxGroup";
import { FormGroup } from "@/components/ui/FormGroup";
import {
  AutocompleteSelect,
  type AutocompleteOption,
} from "@/features/onboarding/components/AutocompleteSelect";
import { ProfileImageUpload } from "@/features/profile/components/ProfileImageUpload";

const MODALITIES = ["In-Person", "Virtual", "Phone"];

const PARTICIPANT_RATE_MAP: Record<
  string,
  { field: "rateIndividual" | "rateGroup" | "rateFamily" | "rateCouples"; label: string }
> = {
  Individual: { field: "rateIndividual", label: "Individual session rate" },
  Group: { field: "rateGroup", label: "Group session rate" },
  Family: { field: "rateFamily", label: "Family session rate" },
  Couples: { field: "rateCouples", label: "Couples session rate" },
};

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

// PARTICIPANTS now imported as PARTICIPANT_OPTIONS from validations

const CLIENT_ETHNICITY_OPTIONS = [
  "Asian",
  "Black",
  "Hispanic and Latino",
  "Indigenous Peoples",
  "Other Racial or Ethnic Background",
  "Pacific Islander",
];

const STYLE_DESCRIPTORS = [
  "Structured",
  "Direct",
  "Relational",
  "Anti-oppressive",
  "Skills-based",
  "Warm",
  "Gentle",
];

const FAITH_ORIENTATIONS = [
  "Any",
  "Buddhist",
  "Christian",
  "Hindu",
  "Jewish",
  "Muslim",
  "Other Spiritual or Religious Affiliations",
  "Secular and Non-Religious",
  "Sikh",
  "The Church of Jesus Christ of Latter-day Saints",
];

// PRONOUNS_OPTIONS imported from validations

const LICENSING_LEVELS = ["Fully Licensed", "Supervised Practice", "Practicum Student"];

const selectStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%238F8279' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
};

interface ProfileFormProps {
  defaultValues: TherapistProfileFormData;
}

export function ProfileForm({ defaultValues }: ProfileFormProps): React.ReactElement {
  const router = useRouter();
  const trpc = useTRPC();
  const [serverError, setServerError] = useState<string | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (serverError) errorRef.current?.focus();
  }, [serverError]);

  // Taxonomy queries
  const { data: specialtiesData, isLoading: specialtiesLoading } = useQuery(
    trpc.taxonomy.getSpecialties.queryOptions(),
  );
  const { data: therapyTypesData, isLoading: therapyTypesLoading } = useQuery(
    trpc.taxonomy.getTherapyTypes.queryOptions(),
  );
  const { data: languagesData, isLoading: languagesLoading } = useQuery(
    trpc.taxonomy.getLanguages.queryOptions(),
  );
  const { data: alliedGroupsData, isLoading: alliedGroupsLoading } = useQuery(
    trpc.taxonomy.getAlliedGroups.queryOptions(),
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

  const therapyTypeOptions: AutocompleteOption[] = useMemo(
    () => (therapyTypesData ?? []).map((t) => ({ id: t.id, name: t.name })),
    [therapyTypesData],
  );

  const languageOptions: AutocompleteOption[] = useMemo(
    () => (languagesData ?? []).map((l) => ({ id: l.id, name: l.name })),
    [languagesData],
  );

  const alliedGroupOptions: AutocompleteOption[] = useMemo(
    () => (alliedGroupsData ?? []).map((g) => ({ id: g.id, name: g.name })),
    [alliedGroupsData],
  );

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TherapistProfileFormData>({
    resolver: zodResolver(therapistProfileSchema),
    defaultValues,
  });

  const {
    fields: credentialFields,
    append: appendCredential,
    remove: removeCredential,
  } = useFieldArray({ control, name: "credentials" as never });

  const watchedSpecialties = watch("specialties");
  const selectedParticipants = watch("participants") ?? [];
  const acceptsInsurance = watch("acceptsInsurance");

  // Filter specialty options for top specialties to only show currently selected ones
  const topSpecialtyOptions: AutocompleteOption[] = useMemo(
    () => specialtyOptions.filter((opt) => (watchedSpecialties ?? []).includes(opt.id)),
    [specialtyOptions, watchedSpecialties],
  );

  const updateProfile = useMutation(
    trpc.therapist.updateProfile.mutationOptions({
      onSuccess() {
        router.push("/profile");
      },
      onError(error) {
        setServerError(error.message);
      },
    }),
  );

  function onSubmit(data: TherapistProfileFormData): void {
    setServerError(null);
    updateProfile.mutate(data);
  }

  function handleCancel(): void {
    router.push("/profile");
  }

  /** Convert an array of IDs to AutocompleteOption[] for the component */
  function idsToOptions(ids: string[], options: AutocompleteOption[]): AutocompleteOption[] {
    const map = new Map(options.map((o) => [o.id, o]));
    return ids.map((id) => map.get(id)).filter(Boolean) as AutocompleteOption[];
  }

  /** Convert AutocompleteOption[] back to an array of IDs for the form */
  function optionsToIds(selected: AutocompleteOption[]): string[] {
    return selected.map((o) => o.id);
  }

  const inputClasses = (hasError: boolean): string =>
    `w-full h-11 px-3 bg-inset text-fg border rounded-sm text-[0.9375rem] font-sans transition-[border-color,background,box-shadow] duration-150 ease-out focus:border-border-f focus:bg-bg focus:outline-2 focus:outline-border-f focus:outline-offset-2 placeholder:text-fg-4 ${
      hasError ? "border-err" : "border-border"
    }`;

  const selectClasses = (hasError: boolean): string =>
    `w-full h-11 px-3 bg-inset text-fg border rounded-sm text-[0.9375rem] font-sans cursor-pointer transition-[border-color,background,box-shadow] duration-150 ease-out pr-9 appearance-none focus:border-border-f focus:bg-bg focus:outline-2 focus:outline-border-f focus:outline-offset-2 ${
      hasError ? "border-err" : "border-border"
    }`;

  return (
    <div className="px-4 sm:px-6 pt-12">
      <div className="max-w-[720px] mx-auto">
        <div className="bg-s1 border border-border rounded-md p-6 shadow-1">
          <h2 className="text-[1.25rem] font-semibold tracking-[-0.01em] leading-[1.35] text-fg mb-4">
            Edit profile
          </h2>

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
            {/* ── Section 1: Bio ── */}
            <FormGroup title="About you" >
              {/* 1. Profile photo */}
              <ProfileImageUpload
                currentImageUrl={watch("imageUrl") || null}
                onUploadComplete={(url) => setValue("imageUrl", url)}
              />

              {/* 2. First name + Middle name + Last name */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="pf-firstName"
                    className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2"
                  >
                    First name
                  </label>
                  <input
                    id="pf-firstName"
                    {...register("firstName")}
                    aria-required="true"
                    aria-invalid={!!errors.firstName}
                    aria-describedby={errors.firstName ? "pf-firstName-error" : undefined}
                    className={inputClasses(!!errors.firstName)}
                    placeholder="First name"
                  />
                  {errors.firstName && (
                    <p id="pf-firstName-error" className="mt-1 text-[0.75rem] text-err">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="pf-middleName"
                    className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2"
                  >
                    Middle name
                  </label>
                  <input
                    id="pf-middleName"
                    {...register("middleName")}
                    className={inputClasses(false)}
                    placeholder="Middle name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="pf-lastName"
                    className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2"
                  >
                    Last name
                  </label>
                  <input
                    id="pf-lastName"
                    {...register("lastName")}
                    aria-required="true"
                    aria-invalid={!!errors.lastName}
                    aria-describedby={errors.lastName ? "pf-lastName-error" : undefined}
                    className={inputClasses(!!errors.lastName)}
                    placeholder="Last name"
                  />
                  {errors.lastName && (
                    <p id="pf-lastName-error" className="mt-1 text-[0.75rem] text-err">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* 3-4. Pronouns + Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="pf-pronouns"
                    className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2"
                  >
                    Pronouns
                  </label>
                  <select
                    id="pf-pronouns"
                    {...register("pronouns")}
                    className={selectClasses(false)}
                    style={selectStyle}
                  >
                    <option value="">Select pronouns...</option>
                    {PRONOUNS_OPTIONS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="pf-therapistGender"
                    className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2"
                  >
                    Gender
                  </label>
                  <select
                    id="pf-therapistGender"
                    {...register("therapistGender")}
                    className={selectClasses(false)}
                    style={selectStyle}
                  >
                    <option value="">Select gender...</option>
                    {GENDER_OPTIONS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 5. Display name */}
              <div>
                <label
                  htmlFor="pf-displayName"
                  className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2"
                >
                  Display name
                </label>
                <input
                  id="pf-displayName"
                  {...register("displayName")}
                  aria-invalid={!!errors.displayName}
                  aria-describedby={errors.displayName ? "pf-displayName-error" : undefined}
                  className={inputClasses(!!errors.displayName)}
                  placeholder="How your name appears to colleagues"
                />
                {errors.displayName && (
                  <p id="pf-displayName-error" className="mt-1 text-[0.75rem] text-err">
                    {errors.displayName.message}
                  </p>
                )}
                <p className="mt-1 text-[0.75rem] italic text-fg-3 tracking-[0.015em]">
                  This is how your name appears to other therapists in the network.
                </p>
              </div>

              {/* 6. Bio */}
              <div>
                <label
                  htmlFor="pf-bio"
                  className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2"
                >
                  Short bio
                </label>

                <textarea
                  id="pf-bio"
                  {...register("bio")}
                  maxLength={500}
                  aria-invalid={!!errors.bio}
                  aria-describedby={errors.bio ? "pf-bio-error" : undefined}
                  className={`w-full min-h-[100px] p-3 bg-inset text-fg border rounded-sm text-[0.9375rem] font-sans resize-y transition-[border-color] duration-150 ease-out focus:border-border-f focus:bg-bg focus:outline-2 focus:outline-border-f focus:outline-offset-2 placeholder:text-fg-4 ${
                    errors.bio ? "border-err" : "border-border"
                  }`}
                  placeholder="Tell colleagues about your practice, experience, and approach..."
                />
                {errors.bio && (
                  <p id="pf-bio-error" className="mt-1 text-[0.75rem] text-err">
                    {errors.bio.message}
                  </p>
                )}
              </div>

              {/* 7. Contact email */}
              <div>
                <label
                  htmlFor="pf-contactEmail"
                  className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2"
                >
                  Contact email
                </label>
                <input
                  id="pf-contactEmail"
                  type="email"
                  {...register("contactEmail")}
                  aria-invalid={!!errors.contactEmail}
                  aria-describedby={errors.contactEmail ? "pf-contactEmail-error" : undefined}
                  className={inputClasses(!!errors.contactEmail)}
                  placeholder="contact@yourpractice.com"
                />
                {errors.contactEmail && (
                  <p id="pf-contactEmail-error" className="mt-1 text-[0.75rem] text-err">
                    {errors.contactEmail.message}
                  </p>
                )}
              </div>

              {/* 8-9. Website URL + Psychology Today URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="pf-websiteUrl"
                    className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2"
                  >
                    Website URL
                  </label>
                  <input
                    id="pf-websiteUrl"
                    type="url"
                    {...register("websiteUrl")}
                    aria-invalid={!!errors.websiteUrl}
                    aria-describedby={errors.websiteUrl ? "pf-websiteUrl-error" : undefined}
                    className={inputClasses(!!errors.websiteUrl)}
                    placeholder="https://yourpractice.com"
                  />
                  {errors.websiteUrl && (
                    <p id="pf-websiteUrl-error" className="mt-1 text-[0.75rem] text-err">
                      {errors.websiteUrl.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="pf-psychologyTodayUrl"
                    className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2"
                  >
                    Psychology Today URL
                  </label>
                  <input
                    id="pf-psychologyTodayUrl"
                    type="url"
                    {...register("psychologyTodayUrl")}
                    aria-invalid={!!errors.psychologyTodayUrl}
                    aria-describedby={
                      errors.psychologyTodayUrl ? "pf-psychologyTodayUrl-error" : undefined
                    }
                    className={inputClasses(!!errors.psychologyTodayUrl)}
                    placeholder="https://psychologytoday.com/profile/..."
                  />
                  {errors.psychologyTodayUrl && (
                    <p id="pf-psychologyTodayUrl-error" className="mt-1 text-[0.75rem] text-err">
                      {errors.psychologyTodayUrl.message}
                    </p>
                  )}
                </div>
              </div>

              {/* 10. City + Province */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="pf-city"
                    className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2"
                  >
                    City
                  </label>
                  <input
                    id="pf-city"
                    {...register("city")}
                    aria-required="true"
                    aria-invalid={!!errors.city}
                    aria-describedby={errors.city ? "pf-city-error" : undefined}
                    className={inputClasses(!!errors.city)}
                    placeholder="Your city"
                  />
                  {errors.city && (
                    <p id="pf-city-error" className="mt-1 text-[0.75rem] text-err">
                      {errors.city.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="pf-province"
                    className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2"
                  >
                    Province
                  </label>
                  <select
                    id="pf-province"
                    {...register("province")}
                    aria-required="true"
                    aria-invalid={!!errors.province}
                    aria-describedby={errors.province ? "pf-province-error" : undefined}
                    className={selectClasses(!!errors.province)}
                    style={selectStyle}
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
                    <p id="pf-province-error" className="mt-1 text-[0.75rem] text-err">
                      {errors.province.message}
                    </p>
                  )}
                </div>
              </div>
            </FormGroup>

            {/* ── Section 2: Qualifications ── */}
            <FormGroup title="Qualifications">
              {/* 11. Primary credential */}
              <div>
                <label
                  htmlFor="pf-primaryCredential"
                  className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2"
                >
                  Primary credential
                </label>
                <input
                  id="pf-primaryCredential"
                  {...register("primaryCredential")}
                  className={inputClasses(false)}
                  placeholder="e.g. Registered Psychologist"
                />
              </div>

              {/* 12. Additional credentials */}
              <div>
                <label className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2">
                  Additional credentials
                </label>
                <div className="space-y-2">
                  {credentialFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <input
                        {...register(`credentials.${index}` as const)}
                        className={inputClasses(false)}
                        placeholder={`Credential ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeCredential(index)}
                        className="shrink-0 h-11 w-11 inline-flex items-center justify-center rounded-sm border border-border text-fg-3 hover:text-err hover:border-err transition-colors duration-150 cursor-pointer"
                        aria-label={`Remove credential ${index + 1}`}
                      >
                        <svg
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-5 h-5"
                        >
                          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  {credentialFields.length < 3 && (
                    <button
                      type="button"
                      onClick={() => appendCredential("" as never)}
                      className="text-[0.8125rem] text-brand font-medium hover:underline cursor-pointer"
                    >
                      + Add credential
                    </button>
                  )}
                </div>
                {errors.credentials && (
                  <p className="mt-1 text-[0.75rem] text-err">{errors.credentials.message}</p>
                )}
              </div>

              {/* 13. License level */}
              <div>
                <label
                  htmlFor="pf-licensingLevel"
                  className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2"
                >
                  License level
                </label>
                <select
                  id="pf-licensingLevel"
                  {...register("licensingLevel")}
                  className={selectClasses(false)}
                  style={selectStyle}
                >
                  <option value="">Select license level...</option>
                  {LICENSING_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            </FormGroup>

            {/* ── Section 3: Your practice ── */}
            <FormGroup title="Your practice">
              {/* 14. Therapeutic approaches */}
              <Controller
                name="therapeuticApproach"
                control={control}
                render={({ field }) => (
                  <AutocompleteSelect
                    label="Therapeutic approaches"
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
                  <label className="inline-flex items-center gap-2 cursor-pointer text-[0.9375rem] text-fg select-none leading-[1.4] hover:[&>.cb-box]:border-border-e hover:[&>.cb-box]:bg-bg hover:[&_input:checked+.cb-box]:bg-brand-h hover:[&_input:checked+.cb-box]:border-brand-h">
                    <input type="checkbox" {...register("reducedFees")} className="sr-only peer" />
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
                    I offer reduced fees / sliding scale
                  </label>
                  <label className="inline-flex items-center gap-2 cursor-pointer text-[0.9375rem] text-fg select-none leading-[1.4] hover:[&>.cb-box]:border-border-e hover:[&>.cb-box]:bg-bg hover:[&_input:checked+.cb-box]:bg-brand-h hover:[&_input:checked+.cb-box]:border-brand-h">
                    <input
                      type="checkbox"
                      {...register("acceptsInsurance")}
                      onChange={(e) => {
                        register("acceptsInsurance").onChange(e);
                        if (!e.target.checked) {
                          setValue("insurers", []);
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
                    I accept insurance
                  </label>
                  <label className="inline-flex items-center gap-2 cursor-pointer text-[0.9375rem] text-fg select-none leading-[1.4] hover:[&>.cb-box]:border-border-e hover:[&>.cb-box]:bg-bg hover:[&_input:checked+.cb-box]:bg-brand-h hover:[&_input:checked+.cb-box]:border-brand-h">
                    <input type="checkbox" {...register("proBono")} className="sr-only peer" />
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
                    I offer pro bono sessions
                  </label>
                  <label className="inline-flex items-center gap-2 cursor-pointer text-[0.9375rem] text-fg select-none leading-[1.4] hover:[&>.cb-box]:border-border-e hover:[&>.cb-box]:bg-bg hover:[&_input:checked+.cb-box]:bg-brand-h hover:[&_input:checked+.cb-box]:border-brand-h">
                    <input
                      type="checkbox"
                      {...register("freeConsultation")}
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
                    I offer a free initial consultation
                  </label>
                </div>
              </div>
            </FormGroup>

            {/* ── Section 4: Communities served ── */}
            <FormGroup title="Communities served" description="Your clients">
              {/* 20. Participants */}
              <CheckboxGroup
                name="participants"
                control={control}
                label="Participants"
                options={[...PARTICIPANT_OPTIONS].map((p) => ({ value: p, label: p }))}
                itemMinWidth="compact"
                error={errors.participants?.message}
              />

              {/* 21. Ages */}
              <CheckboxGroup
                name="ages"
                control={control}
                label="Ages"
                options={[...AGE_OPTIONS].map((a) => ({ value: a, label: a }))}
                itemMinWidth="compact"
                error={errors.ages?.message}
              />

              {/* 22. Modalities */}
              <CheckboxGroup
                name="modalities"
                control={control}
                label="Modalities"
                options={MODALITIES.map((m) => ({ value: m, label: m }))}
                itemMinWidth="compact"
                error={errors.modalities?.message}
              />

              {/* 23. Faith orientation */}
              <Controller
                name="faithOrientation"
                control={control}
                render={({ field }) => (
                  <AutocompleteSelect
                    label="Faith orientation"
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
                label="Ethnicity"
                options={CLIENT_ETHNICITY_OPTIONS.map((e) => ({ value: e, label: e }))}
                itemMinWidth="wide"
                error={errors.ethnicity?.message}
              />

              {/* 25. Languages spoken */}
              <Controller
                name="languages"
                control={control}
                render={({ field }) => (
                  <AutocompleteSelect
                    label="Languages spoken"
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
                    label="Groups"
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

            {/* ── Section 5: Finances ── */}
            <FormGroup title="Finances">
              {/* 27. Rate */}
              <div>
                <label className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2">
                  Rate
                </label>
                <p className="text-[0.75rem] text-fg-3 mb-3">
                  Set your rate per session type. Leave blank if you prefer not to share.
                </p>
                {selectedParticipants.length === 0 ? (
                  <p className="text-[0.8125rem] text-fg-4 italic">
                    Select participant types above to set rates.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {selectedParticipants.map((participant: string) => {
                      const config = PARTICIPANT_RATE_MAP[participant];
                      if (!config) return null;
                      return (
                        <Controller
                          key={config.field}
                          name={config.field}
                          control={control}
                          render={({ field }) => (
                            <div>
                              <label
                                htmlFor={`pf-${config.field}`}
                                className="block mb-1 text-[0.75rem] text-fg-3"
                              >
                                {config.label}
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-4 text-[0.9375rem]">
                                  $
                                </span>
                                <input
                                  id={`pf-${config.field}`}
                                  type="number"
                                  min="0"
                                  step="1"
                                  className={`${inputClasses(false)} pl-7`}
                                  placeholder="0"
                                  value={field.value ?? ""}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    field.onChange(val === "" ? undefined : Number(val));
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        />
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 28. Payment methods */}
              <CheckboxGroup
                name="paymentMethods"
                control={control}
                label="Payment methods"
                options={PAYMENT_METHOD_OPTIONS.map((m) => ({ value: m, label: m }))}
                itemMinWidth="standard"
                error={errors.paymentMethods?.message}
              />

              {/* 29. Insurance */}
              {acceptsInsurance && (
                <CheckboxGroup
                  name="insurers"
                  control={control}
                  label="Insurance"
                  options={INSURERS.map((i) => ({ value: i, label: i }))}
                  itemMinWidth="standard"
                  error={errors.insurers?.message}
                />
              )}

              {/* 30. Accepting referrals */}
              <div className="flex items-center gap-3">
                <Controller
                  name="acceptingClients"
                  control={control}
                  render={({ field }) => (
                    <button
                      type="button"
                      role="switch"
                      aria-checked={field.value}
                      aria-label="Accepting referrals"
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
                <div>
                  <p className="text-[0.9375rem] text-fg font-medium">Accepting referrals</p>
                  <p className="text-[0.875rem] text-fg-2">
                    Visible to other therapists in the network
                  </p>
                </div>
              </div>
            </FormGroup>

            {/* Actions */}
            <div className="pt-4 border-t border-border-s flex gap-3">
            <button
                type="button"
                onClick={handleCancel}
                disabled={updateProfile.isPending}
                className="inline-flex items-center justify-center gap-2 h-11 px-6 bg-transparent text-fg-2 border border-border rounded-sm text-[0.8125rem] font-medium tracking-[0.01em] cursor-pointer transition-all duration-150 ease-out font-sans hover:border-border-e hover:text-fg focus-visible:outline-2 focus-visible:outline-border-f focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Cancel
            </button>
              <button
                type="submit"
                disabled={updateProfile.isPending}
                className="inline-flex items-center justify-center gap-2 flex-1 h-11 px-6 bg-brand text-brand-on border-none rounded-sm text-[0.8125rem] font-semibold tracking-[0.01em] cursor-pointer transition-[background] duration-150 ease-out font-sans hover:bg-brand-h focus-visible:outline-2 focus-visible:outline-border-f focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateProfile.isPending ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin"
                    />
                    Saving...
                  </>
                ) : (
                  "Save changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
