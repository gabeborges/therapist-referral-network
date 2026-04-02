import Link from "next/link";
import { MatchRingLogo } from "@/features/auth/components/match-ring-logo";
import { GoogleSignInButton } from "@/features/auth/components/google-sign-in-button";

export const metadata = {
  title: "Sign In — Therapist Referral Network",
};

export default function SignInPage(): React.ReactElement {
  return (
    <div
      data-theme="light"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "var(--bg)",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "360px", width: "100%" }}>
        {/* Logo */}
        <div style={{ marginBottom: "16px" }}>
          <MatchRingLogo />
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 600,
            letterSpacing: "-0.015em",
            lineHeight: 1.3,
            color: "var(--fg)",
            margin: "0 0 8px 0",
          }}
        >
          Therapist Referral Network
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontSize: "0.875rem",
            lineHeight: 1.5,
            color: "var(--fg-2)",
            margin: "0 0 32px 0",
          }}
        >
          Smarter referrals between therapists
        </p>

        {/* Google Sign-In Button */}
        <div style={{ marginBottom: "24px" }}>
          <GoogleSignInButton />
        </div>

        {/* Link to Sign Up */}
        <p
          style={{
            fontSize: "0.875rem",
            lineHeight: 1.5,
            color: "var(--fg-2)",
            margin: 0,
          }}
        >
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            style={{
              color: "var(--brand)",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
