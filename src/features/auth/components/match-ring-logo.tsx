export function MatchRingLogo({ size = 48 }: { size?: number }): React.ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      style={{ color: "var(--brand)", display: "block", margin: "0 auto" }}
    >
      <circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="24" cy="24" r="16" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="24" cy="24" r="11" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="24" cy="24" r="6" fill="none" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  );
}
