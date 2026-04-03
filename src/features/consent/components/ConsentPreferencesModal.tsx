"use client";

import { useEffect, useState } from "react";
import { useConsent } from "@/lib/consent/ConsentProvider";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function ConsentPreferencesModal({ open, onClose }: Props): React.ReactElement | null {
  const { preferences, updatePreferences } = useConsent();
  const [analytics, setAnalytics] = useState(false);
  const [sessionRecording, setSessionRecording] = useState(false);

  useEffect(() => {
    if (open && preferences) {
      setAnalytics(preferences.analytics);
      setSessionRecording(preferences.sessionRecording);
    }
  }, [open, preferences]);

  if (!open) return null;

  function handleSave(): void {
    updatePreferences({ analytics, sessionRecording });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-4"
      role="dialog"
      aria-label="Cookie preferences"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 cursor-pointer"
        style={{ background: "rgba(0, 0, 0, 0.5)" }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-[440px] rounded-sm p-6"
        style={{
          background: "var(--bg)",
          border: "1px solid var(--border)",
        }}
      >
        <h2 className="text-[1rem] font-semibold mb-4" style={{ color: "var(--fg)" }}>
          Cookie preferences
        </h2>

        <div className="space-y-4">
          {/* Essential — always on */}
          <div className="flex items-center gap-3">
            <Toggle
              checked={true}
              onChange={() => {}}
              disabled
              ariaLabel="Essential cookies (always on)"
            />
            <div>
              <p className="text-[0.8125rem] font-medium" style={{ color: "var(--fg)" }}>
                Essential
              </p>
              <p className="text-[0.75rem]" style={{ color: "var(--fg-3)" }}>
                Required for the platform to function
              </p>
            </div>
          </div>

          {/* Analytics */}
          <div className="flex items-center gap-3">
            <Toggle checked={analytics} onChange={setAnalytics} ariaLabel="Analytics cookies" />
            <div>
              <p className="text-[0.8125rem] font-medium" style={{ color: "var(--fg)" }}>
                Analytics
              </p>
              <p className="text-[0.75rem]" style={{ color: "var(--fg-3)" }}>
                Help us understand how you use the platform
              </p>
            </div>
          </div>

          {/* Session recording */}
          <div className="flex items-center gap-3">
            <Toggle
              checked={sessionRecording}
              onChange={setSessionRecording}
              ariaLabel="Session recording cookies"
            />
            <div>
              <p className="text-[0.8125rem] font-medium" style={{ color: "var(--fg)" }}>
                Session recording
              </p>
              <p className="text-[0.75rem]" style={{ color: "var(--fg-3)" }}>
                Help us improve the experience by recording sessions
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave}>
            Save preferences
          </Button>
        </div>
      </div>
    </div>
  );
}
