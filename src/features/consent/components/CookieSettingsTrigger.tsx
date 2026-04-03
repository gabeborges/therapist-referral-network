"use client";

import { useState } from "react";
import { useConsent } from "@/lib/consent/ConsentProvider";
import { ConsentPreferencesModal } from "@/features/consent/components/ConsentPreferencesModal";

export function CookieSettingsTrigger(): React.ReactElement | null {
  const { hasConsented } = useConsent();
  const [open, setOpen] = useState(false);

  // Only show after user has already made a cookie choice
  // (hidden while banner is active to avoid double UI)
  if (!hasConsented) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-40 flex items-center justify-center w-9 h-9 rounded-full shadow-md transition-opacity hover:opacity-100"
        style={{
          background: "color-mix(in srgb, var(--s1) 85%, transparent)",
          border: "1px solid var(--border)",
          opacity: 0.6,
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
        aria-label="Cookie preferences"
        title="Cookie preferences"
      >
        {/* Shield icon */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: "var(--fg-3)" }}
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      </button>

      <ConsentPreferencesModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
