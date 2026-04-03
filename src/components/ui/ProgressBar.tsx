interface ProgressBarProps {
  value: number;
  label?: string;
  className?: string;
}

export function ProgressBar({
  value,
  label,
  className = "",
}: ProgressBarProps): React.ReactElement {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={className}>
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[0.875rem] font-semibold text-fg">{label}</span>
        </div>
      )}
      <div
        className="h-1.5 rounded-full bg-inset overflow-hidden"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-brand transition-[width] duration-300 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
