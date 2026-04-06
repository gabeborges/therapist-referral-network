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
  Img,
  Row,
  Column,
} from "@react-email/components";

interface ReferralExpiredEmailProps {
  baseUrl: string;
  referrerName: string;
  presentingIssue: string;
  city: string | null;
  province: string;
  therapistsNotified: number;
}

export function referralExpiredSubject(): string {
  return "Your referral has expired";
}

export function ReferralExpiredEmail({
  baseUrl,
  referrerName,
  presentingIssue,
  city,
  province,
  therapistsNotified,
}: ReferralExpiredEmailProps): React.ReactElement {
  const location = city ? `${city}, ${province}` : province;

  return (
    <Html lang="en">
      <Head />
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerStyle}>
            <Row>
              <Column style={{ width: "36px", verticalAlign: "middle" }}>
                <Img
                  src={`${baseUrl}/email/logo-white.png`}
                  width="28"
                  height="28"
                  alt=""
                  style={{ display: "block" }}
                />
              </Column>
              <Column style={{ verticalAlign: "middle" }}>
                <Text style={logoTextStyle}>Therapist Referral Network</Text>
              </Column>
            </Row>
          </Section>

          <Section style={contentStyle}>
            <Text style={headingStyle}>Your referral has expired</Text>
            <Text style={introStyle}>
              Hi {referrerName}, your referral has expired after we reached out to{" "}
              {therapistsNotified} therapist{therapistsNotified !== 1 ? "s" : ""} on your behalf.
            </Text>

            <Section style={detailsBoxStyle}>
              <Text style={detailLabelStyle}>Presenting Issue</Text>
              <Text style={detailValueStyle}>{presentingIssue}</Text>

              <Text style={detailLabelStyle}>Location</Text>
              <Text style={detailValueStyle}>{location}</Text>

              <Text style={detailLabelStyle}>Therapists Notified</Text>
              <Text style={detailValueStyle}>{therapistsNotified}</Text>
            </Section>

            <Hr style={hrStyle} />

            <Text style={promptStyle}>
              If you&apos;re still looking for a match, you can post a new referral anytime.
            </Text>

            <Section style={buttonContainerStyle}>
              <Button href={`${baseUrl}/referrals/new`} style={primaryButtonStyle}>
                Post a new referral
              </Button>
            </Section>

            <Section style={buttonContainerStyle}>
              <Button href={`${baseUrl}/dashboard`} style={secondaryButtonStyle}>
                View dashboard
              </Button>
            </Section>
          </Section>

          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              You received this email because you posted a referral on the Therapist Referral
              Network.
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
  fontSize: "18px",
  fontWeight: 500,
  letterSpacing: "-0.005em",
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

const promptStyle: React.CSSProperties = {
  color: "#4A4A4A",
  fontSize: "16px",
  textAlign: "center" as const,
  margin: "0 0 20px 0",
};

const buttonContainerStyle: React.CSSProperties = {
  textAlign: "center" as const,
  margin: "12px 0",
};

const primaryButtonStyle: React.CSSProperties = {
  backgroundColor: "#2A7C7C",
  color: "#FFFFFF",
  fontSize: "16px",
  fontWeight: 600,
  padding: "14px 32px",
  borderRadius: "6px",
  textDecoration: "none",
  display: "inline-block",
  width: "220px",
};

const secondaryButtonStyle: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  color: "#2A7C7C",
  fontSize: "16px",
  fontWeight: 600,
  padding: "12px 32px",
  borderRadius: "6px",
  textDecoration: "none",
  display: "inline-block",
  border: "2px solid #2A7C7C",
  width: "220px",
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
export default ReferralExpiredEmail;

ReferralExpiredEmail.PreviewProps = {
  baseUrl: "http://localhost:3000",
  referrerName: "Dr. Sarah Chen",
  presentingIssue: "Anxiety & PTSD",
  city: "Toronto",
  province: "ON",
  therapistsNotified: 15,
} satisfies ReferralExpiredEmailProps;
