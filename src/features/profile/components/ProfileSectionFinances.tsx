"use client";

import { useFormContext, Controller } from "react-hook-form";
import type { TherapistProfileFormData } from "@/lib/validations/therapist-profile";
import {
  PARTICIPANT_RATE_MAP,
  PAYMENT_METHOD_OPTIONS,
  INSURERS,
} from "@/lib/validations/therapist-profile";
import { Input } from "@/components/ui/Input";
import { CheckboxGroup } from "@/components/ui/CheckboxGroup";
import { FormGroup } from "@/components/ui/FormGroup";
import { Toggle } from "@/components/ui/Toggle";

export function ProfileSectionFinances(): React.ReactElement {
  const {
    watch,
    control,
    formState: { errors },
  } = useFormContext<TherapistProfileFormData>();

  const selectedParticipants = watch("participants") ?? [];
  const acceptsInsurance = watch("acceptsInsurance");

  return (
    <FormGroup title="Finances">
      {/* 27. Rate */}
      <div>
        <label className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2">
          Rate <span className="font-normal text-fg-4">(optional)</span>
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
                        <Input
                          id={`pf-${config.field}`}
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

      {/* 28. Payment methods */}
      <CheckboxGroup
        name="paymentMethods"
        control={control}
        label="Payment methods"
        optional
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
          optional
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
    </FormGroup>
  );
}
