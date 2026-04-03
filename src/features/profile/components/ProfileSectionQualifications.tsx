"use client";

import { useFormContext } from "react-hook-form";
import type { TherapistProfileFormData } from "@/lib/validations/therapist-profile";
import { LICENSING_LEVELS } from "@/lib/validations/therapist-profile";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
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
        <Input
          id="pf-primaryCredential"
          {...register("primaryCredential")}
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
              <Input
                {...register(`credentials.${index}` as const)}
                placeholder={`Credential ${index + 1}`}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => removeCredential(index)}
                className="shrink-0 h-11 w-11 !px-0 text-fg-3 hover:text-err hover:border-err"
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
              </Button>
            </div>
          ))}
          {credentials.length < 3 && (
            <Button
              type="button"
              variant="text"
              onClick={appendCredential}
              className="text-brand hover:underline"
            >
              + Add credential
            </Button>
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
        <Select id="pf-licensingLevel" {...register("licensingLevel")}>
          <option value="">Select license level...</option>
          {LICENSING_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </Select>
      </div>
    </FormGroup>
  );
}
