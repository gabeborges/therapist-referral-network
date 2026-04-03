"use client";

import { useFormContext, Controller } from "react-hook-form";
import type { OnboardingFormData } from "@/lib/validations/onboarding";
import { PARTICIPANT_RATE_MAP } from "@/lib/validations/therapist-profile";
import { BooleanCheckbox } from "@/components/ui/BooleanCheckbox";
import { Input } from "@/components/ui/Input";
import { Toggle } from "@/components/ui/Toggle";

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
                        <Input
                          id={`ob-${config.field}`}
                          type="number"
                          min="0"
                          step="1"
                          className="pl-7"
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
            <Toggle
              checked={field.value}
              onChange={(checked) => field.onChange(checked)}
              ariaLabel="Toggle accepting referrals"
            />
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
