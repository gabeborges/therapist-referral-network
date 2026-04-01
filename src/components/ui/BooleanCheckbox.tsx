"use client";

import { Controller } from "react-hook-form";

interface BooleanCheckboxProps {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  label: string;
  onChange?: (checked: boolean) => void;
}

export function BooleanCheckbox({
  name,
  control,
  label,
  onChange,
}: BooleanCheckboxProps): React.ReactElement {
  const inputId = `bool-${name}`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <label
          htmlFor={inputId}
          className="inline-flex items-center gap-2 cursor-pointer text-[0.9375rem] text-fg select-none leading-[1.4] hover:[&>.cb-box]:border-border-e hover:[&>.cb-box]:bg-bg hover:[&_input:checked+.cb-box]:bg-brand-h hover:[&_input:checked+.cb-box]:border-brand-h"
        >
          <input
            type="checkbox"
            id={inputId}
            checked={!!field.value}
            onChange={(e) => {
              field.onChange(e.target.checked);
              onChange?.(e.target.checked);
            }}
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
          {label}
        </label>
      )}
    />
  );
}
