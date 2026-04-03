type SpinnerVariant = "white" | "brand";

interface SpinnerProps {
  variant?: SpinnerVariant;
  size?: number;
  className?: string;
}

const variantClasses: Record<SpinnerVariant, string> = {
  white: "border-white/30 border-t-white",
  brand: "border-brand-l border-t-brand",
};

export function Spinner({
  variant = "brand",
  size = 18,
  className = "",
}: SpinnerProps): React.ReactElement {
  return (
    <span
      className={`inline-block rounded-full animate-spin ${variantClasses[variant]} ${className}`}
      style={{ width: size, height: size, borderWidth: Math.max(2, size / 9) }}
      role="status"
      aria-label="Loading"
    />
  );
}
