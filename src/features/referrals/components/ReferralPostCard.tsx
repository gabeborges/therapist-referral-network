import Link from "next/link";
import { ReferralStatusBadge } from "@/features/referrals/components/ReferralStatusBadge";

interface ReferralPostCardProps {
  id: string;
  status: "OPEN" | "FULFILLED" | "CANCELLED" | "EXPIRED";
  presentingIssue: string;
  ageGroup: string[];
  city: string | null;
  province: string;
  modalities: string[];
  currentBatch: number;
  createdAt: Date;
  notificationCount: number;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function ReferralPostCard({
  id,
  status,
  presentingIssue,
  ageGroup,
  city,
  province,
  modalities,
  currentBatch,
  createdAt,
  notificationCount,
}: ReferralPostCardProps): React.ReactElement {
  const location = city ? `${city}, ${province}` : province;

  return (
    <Link
      href={`/referrals/${id}`}
      className="block bg-s1 border border-border rounded-md p-5 shadow-1 transition-[border-color,box-shadow] duration-150 ease-out hover:border-border-e hover:shadow-2 no-underline"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-[0.9375rem] font-semibold text-fg leading-snug m-0">
          {presentingIssue}
        </h3>
        <ReferralStatusBadge status={status} />
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[0.8125rem] text-fg-2 mb-3">
        <span>{Array.isArray(ageGroup) ? ageGroup.join(", ") : ageGroup}</span>
        {location && <span>{location}</span>}
        <span>{modalities.join(", ")}</span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border-s">
        <span className="text-[0.75rem] text-fg-3">{formatDate(createdAt)}</span>

        {/* Compact batch ring */}
        <div className="flex items-center gap-1.5">
          <svg width="16" height="16" viewBox="0 0 24 24" className="text-brand">
            <circle
              cx="12"
              cy="12"
              r="9"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeDasharray={`${Math.min(currentBatch * 18.85, 56.55)} 56.55`}
              strokeLinecap="round"
              transform="rotate(-90 12 12)"
            />
            <circle cx="12" cy="12" r="9" fill="none" stroke="var(--border)" strokeWidth="2.5" />
            <circle
              cx="12"
              cy="12"
              r="9"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeDasharray={`${Math.min(currentBatch * 18.85, 56.55)} 56.55`}
              strokeLinecap="round"
              transform="rotate(-90 12 12)"
            />
          </svg>
          <span className="text-[0.75rem] text-fg-3">
            {currentBatch === 0
              ? "Not sent"
              : `${currentBatch} batch${currentBatch !== 1 ? "es" : ""}`}
            {notificationCount > 0 && ` \u00B7 ${notificationCount} notified`}
          </span>
        </div>
      </div>
    </Link>
  );
}
