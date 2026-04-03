"use client";

type ChipVariant = "brand" | "neutral";

interface ChipProps {
  variant?: ChipVariant;
  onRemove?: () => void;
  children: React.ReactNode;
}

const variantClasses: Record<ChipVariant, string> = {
  brand: "bg-brand-l text-brand",
  neutral: "bg-inset text-fg-2",
};

export function Chip({ variant = "brand", onRemove, children }: ChipProps): React.ReactElement {
  return (
    <span
      className={`inline-flex items-center gap-1 h-7 px-2.5 rounded-full text-[0.8125rem] font-medium whitespace-nowrap ${variantClasses[variant]}`}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="bg-transparent border-none text-current cursor-pointer p-0 ml-0.5 opacity-60 hover:opacity-100 w-3.5 h-3.5 inline-flex items-center justify-center"
          aria-label="Remove"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}
