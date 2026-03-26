type ReferralStatusValue = "OPEN" | "FULFILLED" | "EXPIRED";

interface ReferralStatusBadgeProps {
  status: ReferralStatusValue;
}

const STATUS_STYLES: Record<ReferralStatusValue, string> = {
  OPEN: "bg-inset text-fg-3",
  FULFILLED: "bg-ok-l text-ok",
  EXPIRED: "bg-inset text-fg-4",
};

const STATUS_LABELS: Record<ReferralStatusValue, string> = {
  OPEN: "Open",
  FULFILLED: "Fulfilled",
  EXPIRED: "Expired",
};

export function ReferralStatusBadge({
  status,
}: ReferralStatusBadgeProps): React.ReactElement {
  return (
    <span
      className={`inline-flex items-center h-6 px-2.5 rounded-full text-[0.75rem] font-semibold tracking-[0.02em] uppercase ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
