"use client";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  children: React.ReactNode;
}

export function Checkbox({
  checked,
  onChange,
  disabled = false,
  children,
}: CheckboxProps): React.ReactElement {
  return (
    <label
      className={`inline-flex items-center gap-2 cursor-pointer select-none leading-[1.4] hover:[&>.cb-box]:border-border-e hover:[&>.cb-box]:bg-bg hover:[&_input:checked+.cb-box]:bg-brand-h hover:[&_input:checked+.cb-box]:border-brand-h ${
        disabled ? "cursor-not-allowed opacity-70" : ""
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => !disabled && onChange(e.target.checked)}
        disabled={disabled}
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
      {children}
    </label>
  );
}
