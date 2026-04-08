"use client";

import { signOut } from "next-auth/react";
import { MatchRingLogo } from "@/features/auth/components/match-ring-logo";
import { Button } from "@/components/ui/Button";

export default function SignOutPage(): React.ReactElement {
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
          Sign out
        </h1>

        {/* Message */}
        <p
          style={{
            fontSize: "0.875rem",
            lineHeight: 1.5,
            color: "var(--fg-2)",
            margin: "0 0 32px 0",
          }}
        >
          Are you sure you want to sign out?
        </p>

        {/* Sign Out Button */}
        <div style={{ marginBottom: "16px" }}>
          <Button
            variant="primary"
            className="w-full"
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
          >
            Sign out
          </Button>
        </div>

        {/* Go Back Link */}
        <p
          style={{
            fontSize: "0.875rem",
            lineHeight: 1.5,
            color: "var(--fg-2)",
            margin: 0,
          }}
        >
          <button
            type="button"
            onClick={() => window.history.back()}
            style={{
              color: "var(--brand)",
              textDecoration: "none",
              fontWeight: 500,
              background: "none",
              border: "none",
              cursor: "pointer",
              font: "inherit",
              fontSize: "inherit",
            }}
          >
            Go back
          </button>
        </p>
      </div>
    </div>
  );
}
