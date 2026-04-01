"use client";

import { useFormContext } from "react-hook-form";
import type { TherapistProfileFormData } from "@/lib/validations/therapist-profile";
import { LICENSING_LEVELS } from "@/lib/validations/therapist-profile";
import { inputClasses, selectClasses, selectStyle } from "@/lib/form-styles";
import { FormGroup } from "@/components/ui/FormGroup";

export function ProfileSectionQualifications(): React.ReactElement {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<TherapistProfileFormData>();

  const credentials = watch("credentials") ?? [];

  function appendCredential(): void {
    setValue("credentials", [...credentials, ""]);
  }

  function removeCredential(index: number): void {
    setValue(
      "credentials",
      credentials.filter((_, i) => i !== index),
    );
  }

  return (
    <FormGroup title="Qualifications">
      {/* 11. Primary credential */}
      <div>
        <label
          htmlFor="pf-primaryCredential"
          className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2"
        >
          Primary credential <span className="font-normal text-fg-4">(optional)</span>
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
          Additional credentials <span className="font-normal text-fg-4">(optional)</span>
        </label>
        <div className="space-y-2">
          {credentials.map((_value, index) => (
            <div key={index} className="flex gap-2">
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
          {credentials.length < 3 && (
            <button
              type="button"
              onClick={appendCredential}
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
          License level <span className="font-normal text-fg-4">(optional)</span>
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
  );
}
