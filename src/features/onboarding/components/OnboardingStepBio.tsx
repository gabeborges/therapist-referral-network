"use client";

import { useFormContext, Controller } from "react-hook-form";
import type { OnboardingFormData } from "@/lib/validations/onboarding";
import { ProfileImageUpload } from "@/features/profile/components/ProfileImageUpload";
import { FormGroup } from "@/components/ui/FormGroup";
import { PRONOUNS_OPTIONS } from "@/lib/validations/therapist-profile";

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

const selectStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%238F8279' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
};

const inputClasses = (hasError: boolean): string =>
  `w-full h-11 px-3 bg-inset text-fg border rounded-sm text-[0.9375rem] font-sans transition-[border-color,background,box-shadow] duration-150 ease-out focus:border-border-f focus:bg-bg focus:outline-2 focus:outline-border-f focus:outline-offset-2 placeholder:text-fg-4 ${
    hasError ? "border-err" : "border-border"
  }`;

const selectClasses = (hasError: boolean): string =>
  `w-full h-11 px-3 bg-inset text-fg border rounded-sm text-[0.9375rem] font-sans cursor-pointer transition-[border-color,background,box-shadow] duration-150 ease-out pr-9 appearance-none focus:border-border-f focus:bg-bg focus:outline-2 focus:outline-border-f focus:outline-offset-2 ${
    hasError ? "border-err" : "border-border"
  }`;

export function OnboardingStepBio(): React.ReactElement {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<OnboardingFormData>();

  const pronounsValue = watch("pronouns");

  return (
    <FormGroup title="Bio">
      {/* Profile photo */}
      <ProfileImageUpload
        currentImageUrl={watch("imageUrl") || null}
        onUploadComplete={(url) => setValue("imageUrl", url)}
      />

      {/* Name fields */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="ob-firstName"
            className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2"
          >
            First name
          </label>
          <input
            id="ob-firstName"
            {...register("firstName")}
            aria-required="true"
            aria-invalid={!!errors.firstName}
            aria-describedby={errors.firstName ? "ob-firstName-error" : undefined}
            className={inputClasses(!!errors.firstName)}
            placeholder="First name"
          />
          {errors.firstName && (
            <p id="ob-firstName-error" className="mt-1 text-[0.75rem] text-err">
              {errors.firstName.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="ob-middleName"
            className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2"
          >
            Middle name
          </label>
          <input
            id="ob-middleName"
            {...register("middleName")}
            className={inputClasses(false)}
            placeholder="Middle name"
          />
        </div>
        <div>
          <label
            htmlFor="ob-lastName"
            className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2"
          >
            Last name
          </label>
          <input
            id="ob-lastName"
            {...register("lastName")}
            aria-required="true"
            aria-invalid={!!errors.lastName}
            aria-describedby={errors.lastName ? "ob-lastName-error" : undefined}
            className={inputClasses(!!errors.lastName)}
            placeholder="Last name"
          />
          {errors.lastName && (
            <p id="ob-lastName-error" className="mt-1 text-[0.75rem] text-err">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      {/* Pronouns */}
      <div>
        <label
          htmlFor="ob-pronouns"
          className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2"
        >
          Pronouns
        </label>
        <select
          id="ob-pronouns"
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
        {pronounsValue === "other" && (
          <Controller
            name="pronouns"
            render={({ field }) => (
              <input
                className={`${inputClasses(false)} mt-2`}
                placeholder="Enter your pronouns (max 20 characters)"
                maxLength={20}
                value={field.value === "other" ? "" : (field.value ?? "")}
                onChange={(e) => field.onChange(e.target.value || "other")}
              />
            )}
          />
        )}
      </div>

      {/* Display name */}
      <div>
        <label
          htmlFor="ob-displayName"
          className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2"
        >
          Display name
        </label>
        <input
          id="ob-displayName"
          {...register("displayName")}
          className={inputClasses(!!errors.displayName)}
          placeholder="How your name appears to colleagues"
        />
        {errors.displayName && (
          <p className="mt-1 text-[0.75rem] text-err">{errors.displayName.message}</p>
        )}
        <p className="mt-1 text-[0.75rem] italic text-fg-3 tracking-[0.015em]">
          This is how your name appears to other therapists in the network.
        </p>
      </div>

      {/* Contact email */}
      <div>
        <label
          htmlFor="ob-contactEmail"
          className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2"
        >
          Contact email
        </label>
        <input
          id="ob-contactEmail"
          type="email"
          {...register("contactEmail")}
          aria-invalid={!!errors.contactEmail}
          aria-describedby={errors.contactEmail ? "ob-email-error" : undefined}
          className={inputClasses(!!errors.contactEmail)}
          placeholder="you@practice.com"
        />
        {errors.contactEmail && (
          <p id="ob-email-error" className="mt-1 text-[0.75rem] text-err">
            {errors.contactEmail.message}
          </p>
        )}
      </div>

      {/* City + Province */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="ob-city"
            className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2"
          >
            City
          </label>
          <input
            id="ob-city"
            {...register("city")}
            aria-required="true"
            aria-invalid={!!errors.city}
            aria-describedby={errors.city ? "ob-city-error" : undefined}
            className={inputClasses(!!errors.city)}
            placeholder="City"
          />
          {errors.city && (
            <p id="ob-city-error" className="mt-1 text-[0.75rem] text-err">
              {errors.city.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="ob-province"
            className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2"
          >
            Province
          </label>
          <select
            id="ob-province"
            {...register("province")}
            aria-required="true"
            aria-invalid={!!errors.province}
            aria-describedby={errors.province ? "ob-province-error" : undefined}
            className={selectClasses(!!errors.province)}
            style={selectStyle}
          >
            <option value="">Select province...</option>
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
    </FormGroup>
  );
}
