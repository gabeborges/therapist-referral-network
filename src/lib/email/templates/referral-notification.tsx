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
  Img,
  Row,
  Column,
} from "@react-email/components";

interface ReferralNotificationEmailProps {
  baseUrl: string;
  referrerName: string;
  referrerEmail: string;
  referrerContactEmail: string | null;
  referrerPronouns: string | null;
  referrerWebsiteUrl: string | null;
  referrerPsychologyTodayUrl: string | null;
  presentingIssue: string;
  ageGroup: string[];
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
  baseUrl,
  referrerName,
  referrerEmail,
  referrerContactEmail,
  referrerPronouns,
  referrerWebsiteUrl,
  referrerPsychologyTodayUrl,
  presentingIssue,
  ageGroup,
  city,
  province,
  modalities,
  details,
  referralUrl,
}: ReferralNotificationEmailProps): React.ReactElement {
  const location = city ? `${city}, ${province}` : province;
  const displayEmail = referrerContactEmail ?? referrerEmail;

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
            <Text style={headingStyle}>New referral opportunity</Text>
            <Text style={introStyle}>
              You've been matched to a referral from a colleague. Review the details below and reach
              out to coordinate.
            </Text>

            <Section style={detailsBoxStyle}>
              <Text style={detailLabelStyle}>Presenting issue</Text>
              <Text style={detailValueStyle}>{presentingIssue}</Text>

              <Text style={detailLabelStyle}>Age group</Text>
              <Text style={detailValueStyle}>{ageGroup.join(", ")}</Text>

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

            <Text style={sectionHeadingStyle}>Are you a good match for this referral?</Text>

            <Section style={ctaContainerStyle}>
              <Button
                href={`mailto:${displayEmail}?subject=${encodeURIComponent(`Re: Referral — ${presentingIssue} in ${location}`)}`}
                style={ctaButtonStyle}
              >
                Accept referral
              </Button>
            </Section>

            <Text style={helperTextStyle}>
              Send an email to {referrerName} to accept this referral
            </Text>

            <Section style={secondaryCtaContainerStyle}>
              <Link href={referralUrl} style={secondaryCtaStyle}>
                Check status
              </Link>
            </Section>

            <Hr style={hrStyle} />

            <Text style={referredByLabelStyle}>Referred by</Text>
            <Text style={referredByNameStyle}>
              {referrerName}
              {referrerPronouns ? ` (${referrerPronouns})` : ""}
            </Text>

            {(() => {
              const links: React.ReactElement[] = [];
              if (referrerWebsiteUrl) {
                links.push(
                  <Link key="website" href={referrerWebsiteUrl} style={referrerLinkStyle}>
                    Website
                  </Link>,
                );
              }
              if (referrerPsychologyTodayUrl) {
                links.push(
                  <Link key="pt" href={referrerPsychologyTodayUrl} style={referrerLinkStyle}>
                    Psychology Today
                  </Link>,
                );
              }
              links.push(
                <Link key="email" href={`mailto:${displayEmail}`} style={referrerLinkStyle}>
                  {displayEmail}
                </Link>,
              );
              return (
                <Text style={referrerLinksStyle}>
                  {links.reduce<React.ReactNode[]>((acc, link, i) => {
                    if (i > 0) acc.push(" · ");
                    acc.push(link);
                    return acc;
                  }, [])}
                </Text>
              );
            })()}
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

const sectionHeadingStyle: React.CSSProperties = {
  color: "#1A1A1A",
  fontSize: "18px",
  fontWeight: 600,
  margin: "0 0 4px 0",
  textAlign: "center" as const,
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

const referredByLabelStyle: React.CSSProperties = {
  color: "#2A7C7C",
  fontSize: "12px",
  fontWeight: 600,
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 2px 0",
  textAlign: "center" as const,
};

const referredByNameStyle: React.CSSProperties = {
  color: "#4A4A4A",
  fontSize: "14px",
  fontWeight: 600,
  lineHeight: "20px",
  margin: "0 0 4px 0",
  textAlign: "center" as const,
};

const referrerLinksStyle: React.CSSProperties = {
  color: "#4A4A4A",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0 0 4px 0",
  textAlign: "center" as const,
};

const referrerLinkStyle: React.CSSProperties = {
  color: "#2A7C7C",
  fontSize: "14px",
  textDecoration: "underline",
};

const helperTextStyle: React.CSSProperties = {
  color: "#6B6B6B",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0 0 16px 0",
  textAlign: "center" as const,
};

const ctaContainerStyle: React.CSSProperties = {
  textAlign: "center" as const,
  margin: "12px 0 12px 0",
};

const secondaryCtaContainerStyle: React.CSSProperties = {
  textAlign: "center" as const,
  margin: "0 0 8px 0",
};

const secondaryCtaStyle: React.CSSProperties = {
  color: "#2A7C7C",
  fontSize: "14px",
  textDecoration: "underline",
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
  baseUrl: "http://localhost:3000",
  referrerName: "Dr. Sarah Chen",
  referrerEmail: "sarah.chen@practice.com",
  referrerContactEmail: "sarah@privatepractice.com",
  referrerPronouns: "she/her",
  referrerWebsiteUrl: "https://drsarahchen.com",
  referrerPsychologyTodayUrl: "https://psychologytoday.com/ca/therapists/sarah-chen",
  presentingIssue: "Anxiety & PTSD",
  ageGroup: ["Adults"],
  city: "Toronto",
  province: "ON",
  modalities: ["virtual"],
  details: "Client prefers evening availability and a therapist experienced with complex trauma.",
  referralUrl: "https://therapistreferralnetwork.com/r/abc123",
} satisfies ReferralNotificationEmailProps;
