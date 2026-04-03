type MatchRingSize = "default" | "compact";

interface MatchRingProps {
  score: 1 | 2 | 3 | 4;
  size?: MatchRingSize;
  className?: string;
}

const configs: Record<
  MatchRingSize,
  { width: number; viewBox: string; rings: number[]; strokeWidth: number }
> = {
  default: { width: 48, viewBox: "0 0 48 48", rings: [21, 16, 11, 6], strokeWidth: 2.5 },
  compact: { width: 28, viewBox: "0 0 28 28", rings: [12, 9, 6, 3], strokeWidth: 2 },
};

export function MatchRing({
  score,
  size = "default",
  className = "",
}: MatchRingProps): React.ReactElement {
  const { width, viewBox, rings, strokeWidth } = configs[size];
  const cx = width / 2;
  const cy = width / 2;

  return (
    <svg
      className={`match-ring ${className}`}
      width={width}
      height={width}
      viewBox={viewBox}
      aria-label={`Match: ${score} of 4`}
      role="img"
    >
      {rings.map((r, i) => (
        <circle
          key={r}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          strokeWidth={strokeWidth}
          stroke={i < score ? "var(--brand)" : "var(--border)"}
        />
      ))}
    </svg>
  );
}
