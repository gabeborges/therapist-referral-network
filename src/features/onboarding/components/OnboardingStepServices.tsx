"use client";

import { useFormContext, Controller } from "react-hook-form";
import type { OnboardingFormData } from "@/lib/validations/onboarding";
import { FormGroup } from "@/components/ui/FormGroup";

const inputClasses = (hasError: boolean): string =>
  `w-full h-11 px-3 bg-inset text-fg border rounded-sm text-[0.9375rem] font-sans transition-[border-color,background,box-shadow] duration-150 ease-out focus:border-border-f focus:bg-bg focus:outline-2 focus:outline-border-f focus:outline-offset-2 placeholder:text-fg-4 ${
    hasError ? "border-err" : "border-border"
  }`;

const PARTICIPANT_RATE_MAP: Record<
  string,
  { field: "rateIndividual" | "rateGroup" | "rateFamily" | "rateCouples"; label: string }
> = {
  Individual: { field: "rateIndividual", label: "Individual session rate" },
  Group: { field: "rateGroup", label: "Group session rate" },
  Family: { field: "rateFamily", label: "Family session rate" },
  Couples: { field: "rateCouples", label: "Couples session rate" },
};

export function OnboardingStepServices(): React.ReactElement {
  const {
    watch,
    control,
    formState: { errors },
  } = useFormContext<OnboardingFormData>();

  const selectedParticipants = watch("participants") ?? [];

  return (
    <FormGroup title="Your services">
      {/* Dynamic rate inputs */}
      <div>
        <label className="block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2">
          Rate
        </label>
        <p className="text-[0.75rem] text-fg-3 mb-3">
          Set your rate per session type. Leave blank if you prefer not to share.
        </p>
        {selectedParticipants.length === 0 ? (
          <p className="text-[0.8125rem] text-fg-4 italic">
            Select participant types in the previous step to set rates.
          </p>
        ) : (
          <div className="space-y-3">
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
          Therapy service options
        </p>
        <div className="flex flex-col gap-2">
          <Controller
            name="acceptsInsurance"
            control={control}
            render={({ field }) => (
              <label className="inline-flex items-center gap-2 cursor-pointer text-[0.9375rem] text-fg select-none leading-[1.4] hover:[&>.cb-box]:border-border-e hover:[&>.cb-box]:bg-bg hover:[&_input:checked+.cb-box]:bg-brand-h hover:[&_input:checked+.cb-box]:border-brand-h">
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
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
            )}
          />
          <Controller
            name="reducedFees"
            control={control}
            render={({ field }) => (
              <label className="inline-flex items-center gap-2 cursor-pointer text-[0.9375rem] text-fg select-none leading-[1.4] hover:[&>.cb-box]:border-border-e hover:[&>.cb-box]:bg-bg hover:[&_input:checked+.cb-box]:bg-brand-h hover:[&_input:checked+.cb-box]:border-brand-h">
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
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
                I offer reduced fees / sliding scale
              </label>
            )}
          />
          <Controller
            name="proBono"
            control={control}
            render={({ field }) => (
              <label className="inline-flex items-center gap-2 cursor-pointer text-[0.9375rem] text-fg select-none leading-[1.4] hover:[&>.cb-box]:border-border-e hover:[&>.cb-box]:bg-bg hover:[&_input:checked+.cb-box]:bg-brand-h hover:[&_input:checked+.cb-box]:border-brand-h">
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
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
                I offer pro bono sessions
              </label>
            )}
          />
          <Controller
            name="freeConsultation"
            control={control}
            render={({ field }) => (
              <label className="inline-flex items-center gap-2 cursor-pointer text-[0.9375rem] text-fg select-none leading-[1.4] hover:[&>.cb-box]:border-border-e hover:[&>.cb-box]:bg-bg hover:[&_input:checked+.cb-box]:bg-brand-h hover:[&_input:checked+.cb-box]:border-brand-h">
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
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
            )}
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
    </FormGroup>
  );
}
