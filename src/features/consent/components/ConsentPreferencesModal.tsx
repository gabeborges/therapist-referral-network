"use client";

import { useEffect, useState } from "react";
import { useConsent } from "@/lib/consent/ConsentProvider";

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
        className="absolute inset-0"
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
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[0.8125rem] font-medium" style={{ color: "var(--fg)" }}>
                Essential
              </p>
              <p className="text-[0.75rem]" style={{ color: "var(--fg-3)" }}>
                Required for the platform to function
              </p>
            </div>
            <button
              disabled
              className="relative w-9 h-5 rounded-full cursor-not-allowed opacity-70"
              style={{ background: "var(--brand)" }}
              aria-label="Essential cookies (always on)"
            >
              <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-white transition-transform" />
            </button>
          </div>

          {/* Analytics */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[0.8125rem] font-medium" style={{ color: "var(--fg)" }}>
                Analytics
              </p>
              <p className="text-[0.75rem]" style={{ color: "var(--fg-3)" }}>
                Help us understand how you use the platform
              </p>
            </div>
            <button
              onClick={() => setAnalytics(!analytics)}
              className="relative w-9 h-5 rounded-full transition-colors"
              style={{ background: analytics ? "var(--brand)" : "var(--border-e)" }}
              role="switch"
              aria-checked={analytics}
              aria-label="Analytics cookies"
            >
              <span
                className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                style={{ left: analytics ? "calc(100% - 18px)" : "2px" }}
              />
            </button>
          </div>

          {/* Session recording */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[0.8125rem] font-medium" style={{ color: "var(--fg)" }}>
                Session recording
              </p>
              <p className="text-[0.75rem]" style={{ color: "var(--fg-3)" }}>
                Help us improve the experience by recording sessions
              </p>
            </div>
            <button
              onClick={() => setSessionRecording(!sessionRecording)}
              className="relative w-9 h-5 rounded-full transition-colors"
              style={{ background: sessionRecording ? "var(--brand)" : "var(--border-e)" }}
              role="switch"
              aria-checked={sessionRecording}
              aria-label="Session recording cookies"
            >
              <span
                className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                style={{ left: sessionRecording ? "calc(100% - 18px)" : "2px" }}
              />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-6">
          <button
            onClick={onClose}
            className="h-9 px-4 rounded-sm text-[0.8125rem] font-medium"
            style={{
              border: "1px solid var(--border)",
              background: "transparent",
              color: "var(--fg-2)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="h-9 px-4 rounded-sm text-[0.8125rem] font-semibold"
            style={{
              background: "var(--brand)",
              color: "var(--brand-on)",
            }}
          >
            Save preferences
          </button>
        </div>
      </div>
    </div>
  );
}
