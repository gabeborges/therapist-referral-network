"use client";

import { Controller } from "react-hook-form";

const ITEM_MIN_WIDTH = {
  compact: "140px",
  standard: "180px",
  wide: "240px",
  full: "100%",
} as const;

interface CheckboxGroupProps {
  name: string;
  options: { value: string; label: string }[];
  itemMinWidth?: keyof typeof ITEM_MIN_WIDTH;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  label: string;
  srOnlyLabel?: boolean;
  helpText?: string;
  error?: string;
}

export function CheckboxGroup({
  name,
  options,
  itemMinWidth = "standard",
  control,
  label,
  srOnlyLabel = false,
  helpText,
  error,
}: CheckboxGroupProps): React.ReactElement | null {
  if (options.length === 0) return null;

  const legendId = `${name}-legend`;
  const helpId = `${name}-help`;
  const errorId = `${name}-error`;
  const minWidth = ITEM_MIN_WIDTH[itemMinWidth];

  const describedBy =
    [helpText ? helpId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined;

  return (
    <fieldset className="border-none p-0">
      <legend
        id={legendId}
        className={`block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2 ${srOnlyLabel ? "sr-only" : ""}`}
      >
        {label}
      </legend>
      {helpText && (
        <p id={helpId} className="text-[0.75rem] text-fg-3 mb-2">
          {helpText}
        </p>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div
            className="grid gap-y-2 gap-x-4"
            style={{
              gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}, 1fr))`,
            }}
            role="group"
            aria-labelledby={legendId}
            aria-describedby={describedBy}
          >
            {options.map((opt) => {
              const inputId = `${name}-${opt.value}`;
              const checked = ((field.value as string[]) ?? []).includes(opt.value);
              return (
                <label
                  key={opt.value}
                  htmlFor={inputId}
                  className="inline-flex items-center gap-2 cursor-pointer text-[0.9375rem] text-fg select-none leading-[1.4] hover:[&>.cb-box]:border-border-e hover:[&>.cb-box]:bg-bg hover:[&_input:checked+.cb-box]:bg-brand-h hover:[&_input:checked+.cb-box]:border-brand-h"
                >
                  <input
                    type="checkbox"
                    id={inputId}
                    checked={checked}
                    onChange={(e) => {
                      const current = (field.value as string[]) ?? [];
                      if (e.target.checked) {
                        field.onChange([...current, opt.value]);
                      } else {
                        field.onChange(current.filter((v: string) => v !== opt.value));
                      }
                    }}
                    className="sr-only peer"
                  />
                  <span
                    className={`cb-box w-[18px] h-[18px] shrink-0 rounded-[4px] border ${error ? "border-err" : "border-border"} bg-inset inline-flex items-center justify-center transition-[background,border-color,box-shadow] duration-150 ease-out peer-checked:bg-brand peer-checked:border-brand peer-checked:[&>svg]:opacity-100 peer-checked:[&>svg]:scale-100 peer-focus-visible:outline-2 peer-focus-visible:outline-border-f peer-focus-visible:outline-offset-2`}
                  >
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
                  {opt.label}
                </label>
              );
            })}
          </div>
        )}
      />
      {error && (
        <p id={errorId} className="mt-1 text-[0.75rem] text-err">
          {error}
        </p>
      )}
    </fieldset>
  );
}
