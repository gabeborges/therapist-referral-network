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
} from "@/lib/validations/therapist-profile";
import { ChipSelect } from "@/features/onboarding/components/ChipSelect";
import {
  AutocompleteSelect,
  type AutocompleteOption,
} from "@/features/onboarding/components/AutocompleteSelect";
import { ProfileImageUpload } from "@/features/profile/components/ProfileImageUpload";

const MODALITIES = ["In-Person", "Virtual", "Phone"];

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

const PARTICIPANTS = ["Individuals", "Couples", "Family", "Group"];

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

const PRONOUNS_OPTIONS = ["she/her", "he/him", "they/them", "other"];

const GENDER_OPTIONS = ["Female", "Male", "Non-binary", "Prefer not to say"];

const LICENSING_LEVELS = [
  "Fully Licensed",
  "Supervised Practice",
  "Practicum Student",
];

const selectStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%238F8279' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
};

interface ProfileFormProps {
  defaultValues: TherapistProfileFormData;
}

export function ProfileForm({
  defaultValues,
}: ProfileFormProps): React.ReactElement {
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
  const { data: paymentMethodsData, isLoading: paymentMethodsLoading } =
    useQuery(trpc.taxonomy.getPaymentMethods.queryOptions());

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
    () =>
      (therapyTypesData ?? []).map((t) => ({ id: t.id, name: t.name })),
    [therapyTypesData],
  );

  const languageOptions: AutocompleteOption[] = useMemo(
    () =>
      (languagesData ?? []).map((l) => ({ id: l.id, name: l.name })),
    [languagesData],
  );

  const alliedGroupOptions: AutocompleteOption[] = useMemo(
    () =>
      (alliedGroupsData ?? []).map((g) => ({ id: g.id, name: g.name })),
    [alliedGroupsData],
  );

  const paymentMethodOptions: AutocompleteOption[] = useMemo(
    () =>
      (paymentMethodsData ?? []).map((p) => ({ id: p.id, name: p.name })),
    [paymentMethodsData],
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

  const { fields: credentialFields, append: appendCredential, remove: removeCredential } =
    useFieldArray({ control, name: "credentials" as never });

  const acceptsInsurance = watch("acceptsInsurance");
  const watchedSpecialties = watch("specialties");

  // Filter specialty options for top specialties to only show currently selected ones
  const topSpecialtyOptions: AutocompleteOption[] = useMemo(
    () =>
      specialtyOptions.filter((opt) =>
        (watchedSpecialties ?? []).includes(opt.id),
      ),
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
  function idsToOptions(
    ids: string[],
    options: AutocompleteOption[],
  ): AutocompleteOption[] {
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
            Edit Profile
          </h2>

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
              <p className="text-[0.9375rem] font-medium text-err">
                {serverError}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* ── Identity Section ── */}
            <fieldset className="space-y-6 border-none p-0 m-0">
              <legend className="text-[0.9375rem] font-semibold text-fg mb-2">
                Identity
              </legend>

              {/* Profile photo */}
              <ProfileImageUpload
                currentImageUrl={watch("imageUrl") || null}
                onUploadComplete={(url) => setValue("imageUrl", url)}
              />

              {/* Name fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pf-firstName" className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2">
                    First Name
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
                  <label htmlFor="pf-lastName" className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2">
                    Last Name
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

              {/* Display Name */}
              <div>
                <label htmlFor="pf-displayName" className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2">
                  Display Name
                </label>
                <input
                  id="pf-displayName"
                  {...register("displayName")}
                  aria-required="true"
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
                  This is how your name appears to other therapists in the
                  network.
                </p>
              </div>

              {/* Pronouns & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pf-pronouns" className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2">
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
                  <label htmlFor="pf-therapistGender" className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2">
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

              {/* Primary Credential */}
              <div>
                <label htmlFor="pf-primaryCredential" className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2">
                  Primary Credential
                </label>
                <input
                  id="pf-primaryCredential"
                  {...register("primaryCredential")}
                  className={inputClasses(false)}
                  placeholder="e.g. Registered Psychologist"
                />
              </div>

              {/* Additional Credentials (up to 3) */}
              <div>
                <label className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2">
                  Additional Credentials
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
                        className="shrink-0 h-11 w-11 inline-flex items-center justify-center rounded-sm border border-border text-fg-3 hover:text-err hover:border-err transition-colors duration-150"
                        aria-label={`Remove credential ${index + 1}`}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                  {credentialFields.length < 3 && (
                    <button
                      type="button"
                      onClick={() => appendCredential("" as never)}
                      className="text-[0.8125rem] text-brand font-medium hover:underline"
                    >
                      + Add credential
                    </button>
                  )}
                </div>
                {errors.credentials && (
                  <p className="mt-1 text-[0.75rem] text-err">
                    {errors.credentials.message}
                  </p>
                )}
              </div>

              {/* Bio */}
              <div>
                <label htmlFor="pf-bio" className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2">
                  About You
                </label>
                <div className="p-3 rounded-sm border-l-[3px] border-l-warn bg-warn-l mb-4">
                  <p className="text-[0.875rem] text-fg-2 m-0">
                    Do not include client-identifying information. Describe your
                    practice approach and experience only.
                  </p>
                </div>
                <textarea
                  id="pf-bio"
                  {...register("bio")}
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
            </fieldset>

            {/* ── Practice Section ── */}
            <fieldset className="space-y-6 border-none p-0 m-0">
              <legend className="text-[0.9375rem] font-semibold text-fg mb-2">
                Practice
              </legend>

              {/* Website & Psychology Today */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pf-websiteUrl" className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2">
                    Website URL
                  </label>
                  <input
                    id="pf-websiteUrl"
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
                  <label htmlFor="pf-psychologyTodayUrl" className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2">
                    Psychology Today URL
                  </label>
                  <input
                    id="pf-psychologyTodayUrl"
                    {...register("psychologyTodayUrl")}
                    aria-invalid={!!errors.psychologyTodayUrl}
                    aria-describedby={errors.psychologyTodayUrl ? "pf-psychologyTodayUrl-error" : undefined}
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

              {/* Professional Email */}
              <div>
                <label htmlFor="pf-professionalEmail" className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2">
                  Professional Email
                </label>
                <input
                  id="pf-professionalEmail"
                  type="email"
                  {...register("professionalEmail")}
                  aria-invalid={!!errors.professionalEmail}
                  aria-describedby={errors.professionalEmail ? "pf-professionalEmail-error" : undefined}
                  className={inputClasses(!!errors.professionalEmail)}
                  placeholder="contact@yourpractice.com"
                />
                {errors.professionalEmail && (
                  <p id="pf-professionalEmail-error" className="mt-1 text-[0.75rem] text-err">
                    {errors.professionalEmail.message}
                  </p>
                )}
              </div>

              {/* Licensing Level */}
              <div>
                <label htmlFor="pf-licensingLevel" className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2">
                  Licensing Level
                </label>
                <select
                  id="pf-licensingLevel"
                  {...register("licensingLevel")}
                  className={selectClasses(false)}
                  style={selectStyle}
                >
                  <option value="">Select licensing level...</option>
                  {LICENSING_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              {/* Free Consultation */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("freeConsultation")}
                  className="w-4 h-4 rounded accent-brand"
                />
                <span className="text-[0.9375rem] text-fg">
                  I offer a free initial consultation
                </span>
              </label>

              {/* Specialties (AutocompleteSelect) */}
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

              {/* Therapeutic Approaches (AutocompleteSelect) */}
              <Controller
                name="therapeuticApproach"
                control={control}
                render={({ field }) => (
                  <AutocompleteSelect
                    label="Therapeutic Approaches"
                    options={therapyTypeOptions}
                    selected={idsToOptions(field.value, therapyTypeOptions)}
                    onChange={(sel) => field.onChange(optionsToIds(sel))}
                    placeholder="Search approaches..."
                    error={errors.therapeuticApproach?.message}
                    helperText="Referring therapists often request specific modalities for their clients."
                    loading={therapyTypesLoading}
                  />
                )}
              />

              {/* Other Treatment Orientation */}
              <div>
                <label htmlFor="pf-otherTreatmentOrientation" className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2">
                  Other Treatment Orientation
                </label>
                <input
                  id="pf-otherTreatmentOrientation"
                  {...register("otherTreatmentOrientation")}
                  className={inputClasses(false)}
                  placeholder="Any other treatment approaches not listed above"
                />
              </div>

              {/* Modalities (ChipSelect) */}
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

              {/* Languages (AutocompleteSelect) */}
              <Controller
                name="languages"
                control={control}
                render={({ field }) => (
                  <AutocompleteSelect
                    label="Languages"
                    options={languageOptions}
                    selected={idsToOptions(field.value, languageOptions)}
                    onChange={(sel) => field.onChange(optionsToIds(sel))}
                    placeholder="Search languages..."
                    error={errors.languages?.message}
                    loading={languagesLoading}
                  />
                )}
              />

              {/* Age Groups (ChipSelect) */}
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
                  <label htmlFor="pf-city" className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2">
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
                  <label htmlFor="pf-province" className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2">
                    Province / Territory
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
              <p className="text-[0.75rem] italic text-fg-3 tracking-[0.015em] -mt-4">
                Location proximity is a key matching factor for in-person clients.
              </p>
            </fieldset>

            {/* ── Communities Section ── */}
            <fieldset className="space-y-6 border-none p-0 m-0">
              <legend className="text-[0.9375rem] font-semibold text-fg mb-2">
                Communities
              </legend>

              {/* Participants (ChipSelect) */}
              <Controller
                name="participants"
                control={control}
                render={({ field }) => (
                  <ChipSelect
                    label="Participants"
                    options={PARTICIPANTS}
                    selected={field.value ?? []}
                    onChange={field.onChange}
                    placeholder="Add participants..."
                    error={errors.participants?.message}
                  />
                )}
              />

              {/* Allied Groups (AutocompleteSelect) */}
              <Controller
                name="alliedGroups"
                control={control}
                render={({ field }) => (
                  <AutocompleteSelect
                    label="Allied Groups"
                    options={alliedGroupOptions}
                    selected={idsToOptions(field.value ?? [], alliedGroupOptions)}
                    onChange={(sel) => field.onChange(optionsToIds(sel))}
                    placeholder="Search allied groups..."
                    error={errors.alliedGroups?.message}
                    loading={alliedGroupsLoading}
                  />
                )}
              />

              {/* Faith Orientation */}
              <div>
                <label htmlFor="pf-faithOrientation" className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2">
                  Faith Orientation
                </label>
                <select
                  id="pf-faithOrientation"
                  {...register("faithOrientation")}
                  className={selectClasses(false)}
                  style={selectStyle}
                >
                  <option value="">Select faith orientation...</option>
                  {FAITH_ORIENTATIONS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              {/* Client Ethnicity (ChipSelect) */}
              <Controller
                name="clientEthnicity"
                control={control}
                render={({ field }) => (
                  <ChipSelect
                    label="Client Ethnicity"
                    options={CLIENT_ETHNICITY_OPTIONS}
                    selected={field.value ?? []}
                    onChange={field.onChange}
                    placeholder="Add ethnicities..."
                    error={errors.clientEthnicity?.message}
                  />
                )}
              />

              {/* Style Descriptors (ChipSelect) */}
              <Controller
                name="styleDescriptors"
                control={control}
                render={({ field }) => (
                  <ChipSelect
                    label="Style Descriptors"
                    options={STYLE_DESCRIPTORS}
                    selected={field.value ?? []}
                    onChange={field.onChange}
                    placeholder="Add style descriptors..."
                    error={errors.styleDescriptors?.message}
                  />
                )}
              />
            </fieldset>

            {/* ── Top Specialties Section ── */}
            <fieldset className="space-y-6 border-none p-0 m-0">
              <legend className="text-[0.9375rem] font-semibold text-fg mb-2">
                Top Specialties
              </legend>

              <Controller
                name="topSpecialties"
                control={control}
                render={({ field }) => (
                  <AutocompleteSelect
                    label="Top Specialties"
                    options={topSpecialtyOptions}
                    selected={idsToOptions(field.value ?? [], specialtyOptions)}
                    onChange={(sel) => field.onChange(optionsToIds(sel))}
                    placeholder="Rank your top 3 specialties..."
                    error={errors.topSpecialties?.message}
                    helperText="Choose up to 3 from your selected specialties. Order matters -- your first choice is weighted most heavily in matching."
                    maxItems={3}
                    ranked
                    loading={specialtiesLoading}
                  />
                )}
              />
            </fieldset>

            {/* ── Pricing Section ── */}
            <fieldset className="space-y-6 border-none p-0 m-0">
              <legend className="text-[0.9375rem] font-semibold text-fg mb-2">
                Pricing
              </legend>

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

              {/* Payment Methods (AutocompleteSelect) */}
              <Controller
                name="paymentMethods"
                control={control}
                render={({ field }) => (
                  <AutocompleteSelect
                    label="Payment Methods"
                    options={paymentMethodOptions}
                    selected={idsToOptions(field.value ?? [], paymentMethodOptions)}
                    onChange={(sel) => field.onChange(optionsToIds(sel))}
                    placeholder="Search payment methods..."
                    error={errors.paymentMethods?.message}
                    loading={paymentMethodsLoading}
                  />
                )}
              />

              {/* Hourly Rate */}
              <div>
                <label htmlFor="pf-hourlyRate" className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2">
                  Hourly Rate (CAD)
                </label>
                <input
                  id="pf-hourlyRate"
                  type="number"
                  {...register("hourlyRate", { valueAsNumber: true })}
                  aria-invalid={!!errors.hourlyRate}
                  aria-describedby={errors.hourlyRate ? "pf-hourlyRate-error" : undefined}
                  className={inputClasses(!!errors.hourlyRate)}
                  placeholder="e.g. 150"
                />
                {errors.hourlyRate && (
                  <p id="pf-hourlyRate-error" className="mt-1 text-[0.75rem] text-err">
                    {errors.hourlyRate.message}
                  </p>
                )}
              </div>

              {/* Reduced Fees & Pro Bono */}
              <div className="space-y-3">
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
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("proBono")}
                    className="w-4 h-4 rounded accent-brand"
                  />
                  <span className="text-[0.9375rem] text-fg">
                    I offer pro bono sessions
                  </span>
                </label>
              </div>
            </fieldset>

            {/* ── Availability Section ── */}
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

            {/* Actions */}
            <div className="pt-4 border-t border-border-s flex gap-3">
              <button
                type="submit"
                disabled={updateProfile.isPending}
                className="inline-flex items-center justify-center gap-2 flex-1 h-11 px-6 bg-brand text-brand-on border-none rounded-sm text-[0.8125rem] font-semibold tracking-[0.01em] cursor-pointer transition-[background] duration-150 ease-out font-sans hover:bg-brand-h focus-visible:outline-2 focus-visible:outline-border-f focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateProfile.isPending ? (
                  <>
                    <span aria-hidden="true" className="w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={updateProfile.isPending}
                className="inline-flex items-center justify-center gap-2 h-11 px-6 bg-transparent text-fg-2 border border-border rounded-sm text-[0.8125rem] font-medium tracking-[0.01em] cursor-pointer transition-all duration-150 ease-out font-sans hover:border-border-e hover:text-fg focus-visible:outline-2 focus-visible:outline-border-f focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
