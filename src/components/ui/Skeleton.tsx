interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  radius?: string;
  className?: string;
}

export function Skeleton({
  width,
  height,
  radius,
  className = "",
}: SkeletonProps): React.ReactElement {
  return (
    <div
      className={`animate-shimmer rounded-sm ${className}`}
      style={{
        width,
        height,
        borderRadius: radius,
        background: "linear-gradient(90deg, var(--inset) 25%, var(--bg) 50%, var(--inset) 75%)",
        backgroundSize: "200% 100%",
      }}
    />
  );
}
