"use client";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  ariaLabel: string;
}

export function Toggle({
  checked,
  onChange,
  disabled = false,
  ariaLabel,
}: ToggleProps): React.ReactElement {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative w-9 h-5 rounded-full shrink-0 transition-colors duration-150 ease-out focus-visible:outline-2 focus-visible:outline-border-f focus-visible:outline-offset-2 ${
        disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"
      }`}
      style={{ background: checked ? "var(--brand)" : "var(--border-e)" }}
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
    >
      <span
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-[left] duration-150 ease-out"
        style={{ left: checked ? "calc(100% - 18px)" : "2px" }}
      />
    </button>
  );
}
