"use client";

import { useState } from "react";
import { useConsent } from "@/lib/consent/ConsentProvider";
import { Button } from "@/components/ui/Button";
import { ConsentPreferencesModal } from "@/features/consent/components/ConsentPreferencesModal";

export function CookieConsentBanner(): React.ReactElement | null {
  const { hasConsented, isReady, updatePreferences } = useConsent();
  const [showPreferences, setShowPreferences] = useState(false);

  if (!isReady || hasConsented) return null;

  function acceptAll(): void {
    updatePreferences({ analytics: true, sessionRecording: true });
  }

  function rejectAll(): void {
    updatePreferences({ analytics: false, sessionRecording: false });
  }

  return (
    <>
      <div
        className="fixed bottom-0 inset-x-0 z-50 px-4 pb-4"
        role="dialog"
        aria-label="Cookie consent"
      >
        <div
          className="max-w-[520px] mx-auto rounded-sm p-4 shadow-lg"
          style={{
            background: "var(--s1)",
            border: "1px solid var(--border)",
          }}
        >
          <p className="text-[0.8125rem] leading-[1.5] mb-4" style={{ color: "var(--fg-2)" }}>
            We use cookies to improve your experience. You can customize your preferences or
            accept/reject all non-essential cookies.
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="secondary" size="sm" onClick={rejectAll}>
              Reject all
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setShowPreferences(true)}>
              Customize
            </Button>
            <Button variant="primary" size="sm" onClick={acceptAll}>
              Accept all
            </Button>
          </div>
        </div>
      </div>

      <ConsentPreferencesModal open={showPreferences} onClose={() => setShowPreferences(false)} />
    </>
  );
}
