"use client";

import { useFormContext, Controller } from "react-hook-form";
import type { OnboardingFormData } from "@/lib/validations/onboarding";
import { PARTICIPANT_RATE_MAP } from "@/lib/validations/therapist-profile";
import { BooleanCheckbox } from "@/components/ui/BooleanCheckbox";
import { inputClasses } from "@/lib/form-styles";

export function OnboardingStepServices(): React.ReactElement {
  const { watch, control } = useFormContext<OnboardingFormData>();

  const selectedParticipants = watch("participants") ?? [];

  return (
    <div className="space-y-6">
      {/* Dynamic rate inputs */}
      <div>
        <label className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2">
          Rate <span className="font-normal text-fg-4">(optional)</span>
        </label>
        <p className="text-[0.75rem] text-fg-3 mb-3">
          Set your rate per session type. Leave blank if you prefer not to share.
        </p>
        {selectedParticipants.length === 0 ? (
          <p className="text-[0.8125rem] text-fg-4 italic">
            Select participant types in the previous step to set rates.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {selectedParticipants.map((participant) => {
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
                        htmlFor={`ob-${config.field}`}
                        className="block mb-1 text-[0.75rem] text-fg-3"
                      >
                        {config.label}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-4 text-[0.9375rem]">
                          $
                        </span>
                        <input
                          id={`ob-${config.field}`}
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

      {/* Therapy service options */}
      <div>
        <p className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2">
          Therapy service options <span className="font-normal text-fg-4">(optional)</span>
        </p>
        <div className="flex flex-col gap-2">
          <BooleanCheckbox name="acceptsInsurance" control={control} label="I accept insurance" />
          <BooleanCheckbox
            name="reducedFees"
            control={control}
            label="I offer reduced fees / sliding scale"
          />
          <BooleanCheckbox name="proBono" control={control} label="I offer pro bono sessions" />
          <BooleanCheckbox
            name="freeConsultation"
            control={control}
            label="I offer a free initial consultation"
          />
        </div>
      </div>

      {/* Accepting referrals toggle */}
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
          <p className="text-[0.875rem] text-fg-2">Visible to other therapists in the network</p>
        </div>
      </div>
    </div>
  );
}
