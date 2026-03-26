import { ReferralPostCard } from "@/features/referrals/components/ReferralPostCard";

interface ReferralPostItem {
  id: string;
  status: "OPEN" | "FULFILLED" | "EXPIRED";
  presentingIssue: string;
  ageGroup: string;
  locationCity: string | null;
  locationProvince: string;
  modality: string;
  currentBatch: number;
  createdAt: Date;
  _count: {
    notifications: number;
  };
}

interface ReferralPostListProps {
  referrals: ReferralPostItem[];
}

export function ReferralPostList({
  referrals,
}: ReferralPostListProps): React.ReactElement {
  if (referrals.length === 0) {
    return (
      <div className="text-center py-16">
        {/* Match Ring icon */}
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          className="text-fg-4 mx-auto mb-4"
        >
          <circle
            cx="24"
            cy="24"
            r="21"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          />
          <circle
            cx="24"
            cy="24"
            r="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          />
          <circle
            cx="24"
            cy="24"
            r="9"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          />
        </svg>
        <p className="text-[1rem] font-medium text-fg-3 mb-1">
          No referrals yet
        </p>
        <p className="text-[0.875rem] text-fg-4">
          Post your first referral to find a match for your client.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {referrals.map((referral) => (
        <ReferralPostCard
          key={referral.id}
          id={referral.id}
          status={referral.status}
          presentingIssue={referral.presentingIssue}
          ageGroup={referral.ageGroup}
          locationCity={referral.locationCity}
          locationProvince={referral.locationProvince}
          modality={referral.modality}
          currentBatch={referral.currentBatch}
          createdAt={referral.createdAt}
          notificationCount={referral._count.notifications}
        />
      ))}
    </div>
  );
}
