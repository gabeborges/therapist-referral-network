"use client";

import { useFormContext } from "react-hook-form";
import type { OnboardingFormData } from "@/lib/validations/onboarding";
import { ProfileImageUpload } from "@/features/profile/components/ProfileImageUpload";
import { PROVINCES, UNSUPPORTED_PROVINCES } from "@/lib/validations/therapist-profile";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

export function OnboardingStepBio(): React.ReactElement {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<OnboardingFormData>();

  return (
    <div className="space-y-5">
      {/* Profile photo */}
      <ProfileImageUpload
        currentImageUrl={watch("imageUrl") || null}
        onUploadComplete={(url) => setValue("imageUrl", url)}
      />

      {/* Name fields */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label
            htmlFor="ob-firstName"
            className="block mb-1 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2"
          >
            First name
          </label>
          <Input
            id="ob-firstName"
            {...register("firstName")}
            aria-required="true"
            aria-invalid={!!errors.firstName}
            aria-describedby={errors.firstName ? "ob-firstName-error" : undefined}
            error={!!errors.firstName}
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
            className="block mb-1 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2"
          >
            Middle name <span className="font-normal text-fg-4">(optional)</span>
          </label>
          <Input id="ob-middleName" {...register("middleName")} placeholder="Middle name" />
        </div>
        <div>
          <label
            htmlFor="ob-lastName"
            className="block mb-1 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2"
          >
            Last name
          </label>
          <Input
            id="ob-lastName"
            {...register("lastName")}
            aria-required="true"
            aria-invalid={!!errors.lastName}
            aria-describedby={errors.lastName ? "ob-lastName-error" : undefined}
            error={!!errors.lastName}
            placeholder="Last name"
          />
          {errors.lastName && (
            <p id="ob-lastName-error" className="mt-1 text-[0.75rem] text-err">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      {/* City + Province */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="ob-city"
            className="block mb-1 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2"
          >
            City
          </label>
          <Input
            id="ob-city"
            {...register("city")}
            aria-required="true"
            aria-invalid={!!errors.city}
            aria-describedby={errors.city ? "ob-city-error" : undefined}
            error={!!errors.city}
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
            className="block mb-1 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2"
          >
            Province
          </label>
          <Select
            id="ob-province"
            {...register("province")}
            aria-required="true"
            aria-invalid={!!errors.province}
            aria-describedby={errors.province ? "ob-province-error" : undefined}
            error={!!errors.province}
          >
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
          {errors.province && (
            <p id="ob-province-error" className="mt-1 text-[0.75rem] text-err">
              {errors.province.message}
            </p>
          )}
          <p className="mt-1 text-[0.75rem] italic text-fg-3 tracking-[0.015em]">
            Quebec is not yet supported.
          </p>
        </div>
      </div>
    </div>
  );
}
