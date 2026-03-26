import * as React from "react";

interface ReferralNotificationEmailProps {
  referrerName: string;
  presentingIssue: string;
  location: string;
  modality: string;
  referralUrl: string;
}

export function ReferralNotificationEmail({
  referrerName,
  presentingIssue,
  location,
  modality,
  referralUrl,
}: ReferralNotificationEmailProps): React.ReactElement {
  return (
    <div>
      <h1>New Referral Opportunity</h1>
      <p>
        {referrerName} is looking for a therapist for a client with {presentingIssue} in {location}{" "}
        ({modality}).
      </p>
      <a href={referralUrl}>View Referral Details</a>
    </div>
  );
}
