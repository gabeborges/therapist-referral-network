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
} from "@react-email/components";

interface FulfillmentCheckEmailProps {
  referrerName: string;
  presentingIssue: string;
  city: string | null;
  province: string;
  fulfillYesUrl: string;
  fulfillNoUrl: string;
}

export function fulfillmentCheckSubject(): string {
  return "Was your referral fulfilled?";
}

export function FulfillmentCheckEmail({
  referrerName,
  presentingIssue,
  city,
  province,
  fulfillYesUrl,
  fulfillNoUrl,
}: FulfillmentCheckEmailProps): React.ReactElement {
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
            <Text style={headingStyle}>Was your referral fulfilled?</Text>
            <Text style={introStyle}>
              Hi {referrerName}, we wanted to check in on the referral you
              posted. Has a therapist connected with your client?
            </Text>

            <Section style={detailsBoxStyle}>
              <Text style={detailLabelStyle}>Presenting Issue</Text>
              <Text style={detailValueStyle}>{presentingIssue}</Text>

              <Text style={detailLabelStyle}>Location</Text>
              <Text style={detailValueStyle}>{location}</Text>
            </Section>

            <Hr style={hrStyle} />

            <Text style={promptStyle}>
              Please let us know so we can update the referral status:
            </Text>

            <Section style={buttonContainerStyle}>
              <Button href={fulfillYesUrl} style={yesButtonStyle}>
                Yes, it was filled
              </Button>
            </Section>

            <Section style={buttonContainerStyle}>
              <Button href={fulfillNoUrl} style={noButtonStyle}>
                No, still looking
              </Button>
            </Section>
          </Section>

          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              You received this email because you posted a referral on the
              Therapist Referral Network.
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
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
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

const yesButtonStyle: React.CSSProperties = {
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

const noButtonStyle: React.CSSProperties = {
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
export default FulfillmentCheckEmail;

FulfillmentCheckEmail.PreviewProps = {
  referrerName: "Dr. Sarah Chen",
  presentingIssue: "Anxiety & PTSD",
  city: "Toronto",
  province: "ON",
  fulfillYesUrl: "https://therapistreferral.network/referrals/fulfill/tok123?fulfilled=true",
  fulfillNoUrl: "https://therapistreferral.network/referrals/fulfill/tok123?fulfilled=false",
} satisfies FulfillmentCheckEmailProps;
