"use client";

import { useFormContext } from "react-hook-form";
import type { TherapistProfileFormData } from "@/lib/validations/therapist-profile";
import {
  PRONOUNS_OPTIONS,
  GENDER_OPTIONS,
  PROVINCES,
  UNSUPPORTED_PROVINCES,
} from "@/lib/validations/therapist-profile";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { FormGroup } from "@/components/ui/FormGroup";
import { ProfileImageUpload } from "@/features/profile/components/ProfileImageUpload";

export function ProfileSectionBio(): React.ReactElement {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<TherapistProfileFormData>();

  return (
    <FormGroup title="About you">
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
          <Input
            id="pf-firstName"
            {...register("firstName")}
            aria-required="true"
            aria-invalid={!!errors.firstName}
            aria-describedby={errors.firstName ? "pf-firstName-error" : undefined}
            error={!!errors.firstName}
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
            Middle name <span className="font-normal text-fg-4">(optional)</span>
          </label>
          <Input id="pf-middleName" {...register("middleName")} placeholder="Middle name" />
        </div>
        <div>
          <label
            htmlFor="pf-lastName"
            className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2"
          >
            Last name
          </label>
          <Input
            id="pf-lastName"
            {...register("lastName")}
            aria-required="true"
            aria-invalid={!!errors.lastName}
            aria-describedby={errors.lastName ? "pf-lastName-error" : undefined}
            error={!!errors.lastName}
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
            Pronouns <span className="font-normal text-fg-4">(optional)</span>
          </label>
          <Select id="pf-pronouns" {...register("pronouns")}>
            <option value="">Select pronouns...</option>
            {PRONOUNS_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label
            htmlFor="pf-therapistGender"
            className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2"
          >
            Gender <span className="font-normal text-fg-4">(optional)</span>
          </label>
          <Select id="pf-therapistGender" {...register("therapistGender")}>
            <option value="">Select gender...</option>
            {GENDER_OPTIONS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* 5. Display name */}
      <div>
        <label
          htmlFor="pf-displayName"
          className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2"
        >
          Display name <span className="font-normal text-fg-4">(optional)</span>
        </label>
        <Input
          id="pf-displayName"
          {...register("displayName")}
          aria-invalid={!!errors.displayName}
          aria-describedby={errors.displayName ? "pf-displayName-error" : undefined}
          error={!!errors.displayName}
          placeholder="How your name appears to colleagues"
        />
        {errors.displayName && (
          <p id="pf-displayName-error" className="mt-1 text-[0.75rem] text-err">
            {errors.displayName.message}
          </p>
        )}
        <p className="mt-1 text-[0.75rem] italic text-fg-3 tracking-[0.015em]">
          This is how your name appears to other therapists.
        </p>
      </div>

      {/* 6. Bio */}
      <div>
        <label
          htmlFor="pf-bio"
          className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2"
        >
          Short bio <span className="font-normal text-fg-4">(optional)</span>
        </label>
        <Textarea
          id="pf-bio"
          {...register("bio")}
          maxLength={500}
          aria-invalid={!!errors.bio}
          aria-describedby={errors.bio ? "pf-bio-error" : undefined}
          error={!!errors.bio}
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
          Contact email <span className="font-normal text-fg-4">(optional)</span>
        </label>
        <Input
          id="pf-contactEmail"
          type="email"
          {...register("contactEmail")}
          aria-invalid={!!errors.contactEmail}
          aria-describedby={errors.contactEmail ? "pf-contactEmail-error" : undefined}
          error={!!errors.contactEmail}
          placeholder="contact@yourpractice.com"
        />
        {errors.contactEmail && (
          <p id="pf-contactEmail-error" className="mt-1 text-[0.75rem] text-err">
            {errors.contactEmail.message}
          </p>
        )}
        <p className="mt-1 text-[0.75rem] italic text-fg-3 tracking-[0.015em]">
          We will use this email to send you referrals.
        </p>
      </div>

      {/* 8-9. Website URL + Psychology Today URL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="pf-websiteUrl"
            className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2"
          >
            Website URL <span className="font-normal text-fg-4">(optional)</span>
          </label>
          <Input
            id="pf-websiteUrl"
            type="text"
            {...register("websiteUrl")}
            aria-invalid={!!errors.websiteUrl}
            aria-describedby={errors.websiteUrl ? "pf-websiteUrl-error" : undefined}
            error={!!errors.websiteUrl}
            placeholder="yourpractice.com"
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
            Psychology Today URL <span className="font-normal text-fg-4">(optional)</span>
          </label>
          <Input
            id="pf-psychologyTodayUrl"
            type="url"
            {...register("psychologyTodayUrl")}
            aria-invalid={!!errors.psychologyTodayUrl}
            aria-describedby={errors.psychologyTodayUrl ? "pf-psychologyTodayUrl-error" : undefined}
            error={!!errors.psychologyTodayUrl}
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
          <Input
            id="pf-city"
            {...register("city")}
            aria-required="true"
            aria-invalid={!!errors.city}
            aria-describedby={errors.city ? "pf-city-error" : undefined}
            error={!!errors.city}
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
          <Select
            id="pf-province"
            {...register("province")}
            aria-required="true"
            aria-invalid={!!errors.province}
            aria-describedby={errors.province ? "pf-province-error" : undefined}
            error={!!errors.province}
          >
            <option value="" disabled>
              Select province...
            </option>
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
            <p id="pf-province-error" className="mt-1 text-[0.75rem] text-err">
              {errors.province.message}
            </p>
          )}
          <p className="mt-1 text-[0.75rem] italic text-fg-3 tracking-[0.015em]">
            Quebec is not yet supported.
          </p>
        </div>
      </div>
    </FormGroup>
  );
}
