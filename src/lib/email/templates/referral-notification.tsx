import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Link,
} from "@react-email/components";

interface ReferralNotificationEmailProps {
  referrerName: string;
  referrerEmail: string;
  presentingIssue: string;
  ageGroup: string;
  city: string | null;
  province: string;
  modalities: string[];
  details: string | null;
  referralUrl: string;
}

export function referralNotificationSubject(
  presentingIssue: string,
  city: string | null,
  province: string,
): string {
  const location = city ?? province;
  return `Referral opportunity: ${presentingIssue} in ${location}`;
}

export function ReferralNotificationEmail({
  referrerName,
  referrerEmail,
  presentingIssue,
  ageGroup,
  city,
  province,
  modalities,
  details,
  referralUrl,
}: ReferralNotificationEmailProps): React.ReactElement {
  const location = city ? `${city}, ${province}` : province;

  return (
    <Html lang="en">
      <Head />
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerStyle}>
            <Text style={logoTextStyle}>Therapist Referral Network</Text>
          </Section>

          <Section style={contentStyle}>
            <Text style={headingStyle}>New Referral Opportunity</Text>
            <Text style={introStyle}>
              A colleague is looking for a therapist for their client. Review the details below to
              see if this is a good fit for your practice.
            </Text>

            <Section style={detailsBoxStyle}>
              <Text style={detailLabelStyle}>Presenting issue</Text>
              <Text style={detailValueStyle}>{presentingIssue}</Text>

              <Text style={detailLabelStyle}>Age group</Text>
              <Text style={detailValueStyle}>{ageGroup}</Text>

              <Text style={detailLabelStyle}>Location</Text>
              <Text style={detailValueStyle}>{location}</Text>

              <Text style={detailLabelStyle}>Modalities</Text>
              <Text style={detailValueStyle}>{modalities.join(", ")}</Text>

              {details ? (
                <>
                  <Text style={detailLabelStyle}>Details</Text>
                  <Text style={detailValueStyle}>{details}</Text>
                </>
              ) : null}
            </Section>

            <Hr style={hrStyle} />

            <Text style={sectionTitleStyle}>Referring therapist</Text>
            <Text style={referrerStyle}>{referrerName}</Text>
            <Link href={`mailto:${referrerEmail}`} style={linkStyle}>
              {referrerEmail}
            </Link>

            <Section style={ctaContainerStyle}>
              <Button href={referralUrl} style={ctaButtonStyle}>
                View full details
              </Button>
            </Section>
          </Section>

          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              You received this email because you are a registered therapist on the Therapist
              Referral Network and your profile matched this referral.
            </Text>
            <Text style={footerTextStyle}>
              &copy; {new Date().getFullYear()} Therapist Referral Network
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const bodyStyle: React.CSSProperties = {
  backgroundColor: "#FAF7F5",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  margin: 0,
  padding: 0,
};

const containerStyle: React.CSSProperties = {
  maxWidth: "600px",
  margin: "0 auto",
};

const headerStyle: React.CSSProperties = {
  backgroundColor: "#2A7C7C",
  padding: "24px 32px",
  borderRadius: "8px 8px 0 0",
};

const logoTextStyle: React.CSSProperties = {
  color: "#FFFFFF",
  fontSize: "20px",
  fontWeight: 700,
  margin: 0,
};

const contentStyle: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  padding: "32px",
};

const headingStyle: React.CSSProperties = {
  color: "#1A1A1A",
  fontSize: "24px",
  fontWeight: 700,
  margin: "0 0 8px 0",
};

const introStyle: React.CSSProperties = {
  color: "#4A4A4A",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 24px 0",
};

const detailsBoxStyle: React.CSSProperties = {
  backgroundColor: "#F5FAFA",
  border: "1px solid #D4EDED",
  borderRadius: "8px",
  padding: "20px 24px",
};

const detailLabelStyle: React.CSSProperties = {
  color: "#2A7C7C",
  fontSize: "12px",
  fontWeight: 600,
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "12px 0 2px 0",
};

const detailValueStyle: React.CSSProperties = {
  color: "#1A1A1A",
  fontSize: "16px",
  margin: "0 0 4px 0",
};

const hrStyle: React.CSSProperties = {
  borderColor: "#E5E5E5",
  margin: "24px 0",
};

const sectionTitleStyle: React.CSSProperties = {
  color: "#1A1A1A",
  fontSize: "14px",
  fontWeight: 600,
  margin: "0 0 4px 0",
};

const referrerStyle: React.CSSProperties = {
  color: "#4A4A4A",
  fontSize: "16px",
  margin: "0 0 2px 0",
};

const linkStyle: React.CSSProperties = {
  color: "#2A7C7C",
  fontSize: "14px",
  textDecoration: "underline",
};

const ctaContainerStyle: React.CSSProperties = {
  textAlign: "center" as const,
  margin: "32px 0 8px 0",
};

const ctaButtonStyle: React.CSSProperties = {
  backgroundColor: "#2A7C7C",
  color: "#FFFFFF",
  fontSize: "16px",
  fontWeight: 600,
  padding: "14px 32px",
  borderRadius: "6px",
  textDecoration: "none",
  display: "inline-block",
};

const footerStyle: React.CSSProperties = {
  backgroundColor: "#F5F5F5",
  padding: "20px 32px",
  borderRadius: "0 0 8px 8px",
};

const footerTextStyle: React.CSSProperties = {
  color: "#999999",
  fontSize: "12px",
  lineHeight: "18px",
  margin: "0 0 4px 0",
  textAlign: "center" as const,
};

// react-email dev server preview
export default ReferralNotificationEmail;

ReferralNotificationEmail.PreviewProps = {
  referrerName: "Dr. Sarah Chen",
  referrerEmail: "sarah.chen@practice.com",
  presentingIssue: "Anxiety & PTSD",
  ageGroup: "Adults",
  city: "Toronto",
  province: "ON",
  modalities: ["virtual"],
  details: "Client prefers evening availability and a therapist experienced with complex trauma.",
  referralUrl: "https://therapistreferralnetwork.com/r/abc123",
} satisfies ReferralNotificationEmailProps;
