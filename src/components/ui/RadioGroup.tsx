"use client";

import { useRef } from "react";
import { Controller } from "react-hook-form";

interface RadioGroupProps {
  name: string;
  options: { value: string; label: string }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  label: string;
  optional?: boolean;
  srOnlyLabel?: boolean;
  layout?: "inline" | "column";
  error?: string;
  allowDeselect?: boolean;
}

export function RadioGroup({
  name,
  options,
  control,
  label,
  optional = false,
  srOnlyLabel = false,
  layout = "inline",
  error,
  allowDeselect = false,
}: RadioGroupProps): React.ReactElement | null {
  if (options.length === 0) return null;

  const legendId = `${name}-legend`;
  const errorId = `${name}-error`;
  const prevValueRef = useRef<string | null>(null);

  return (
    <fieldset className="border-none p-0">
      <legend
        id={legendId}
        className={`block mb-2 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2 ${srOnlyLabel ? "sr-only" : ""}`}
      >
        {label}
        {optional && <span className="font-normal text-fg-4"> (optional)</span>}
      </legend>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div
            className={layout === "inline" ? "flex gap-6 flex-wrap" : "flex flex-col gap-2"}
            role="radiogroup"
            aria-labelledby={legendId}
            aria-describedby={error ? errorId : undefined}
          >
            {options.map((opt) => {
              const inputId = `${name}-${opt.value}`;
              const checked = field.value === opt.value;
              return (
                <label
                  key={opt.value}
                  htmlFor={inputId}
                  className="inline-flex items-center gap-2 cursor-pointer text-[0.9375rem] text-fg select-none leading-[1.4] hover:[&>.rb-dot]:border-border-e hover:[&>.rb-dot]:bg-bg hover:[&_input:checked+.rb-dot]:bg-brand-h hover:[&_input:checked+.rb-dot]:border-brand-h"
                >
                  <input
                    type="radio"
                    id={inputId}
                    name={name}
                    checked={checked}
                    onChange={() => {
                      field.onChange(opt.value);
                      prevValueRef.current = opt.value;
                    }}
                    onClick={() => {
                      if (allowDeselect && prevValueRef.current === opt.value) {
                        field.onChange("");
                        prevValueRef.current = null;
                      }
                    }}
                    className="sr-only peer"
                  />
                  <span
                    className={`rb-dot relative w-[18px] h-[18px] shrink-0 rounded-full border ${error ? "border-err" : "border-border"} bg-inset inline-flex items-center justify-center transition-[background,border-color,box-shadow] duration-150 ease-out peer-checked:bg-brand peer-checked:border-brand peer-focus-visible:outline-2 peer-focus-visible:outline-border-f peer-focus-visible:outline-offset-2 peer-checked:[&>span]:opacity-100 peer-checked:[&>span]:scale-100`}
                  >
                    <span className="w-2 h-2 rounded-full bg-white opacity-0 scale-[0.4] transition-[opacity,transform] duration-150 ease-out" />
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
