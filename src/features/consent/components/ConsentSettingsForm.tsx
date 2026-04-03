"use client";

import { useEffect, useState, useRef } from "react";
import { useConsent } from "@/lib/consent/ConsentProvider";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";

export function ConsentSettingsForm(): React.ReactElement {
  const { preferences, isReady, updatePreferences } = useConsent();
  const [analytics, setAnalytics] = useState(false);
  const [sessionRecording, setSessionRecording] = useState(false);
  const [saved, setSaved] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (isReady && preferences) {
      setAnalytics(preferences.analytics);
      setSessionRecording(preferences.sessionRecording);
    }
  }, [isReady, preferences]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function handleSave(): void {
    updatePreferences({ analytics, sessionRecording });
    setSaved(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setSaved(false), 2000);
  }

  const disabled = !isReady;

  return (
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
        <Toggle
          checked={analytics}
          onChange={setAnalytics}
          disabled={disabled}
          ariaLabel="Analytics cookies"
        />
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
          disabled={disabled}
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

      <div className="flex items-center gap-3 pt-2">
        <Button variant="primary" size="sm" onClick={handleSave} disabled={disabled}>
          Save preferences
        </Button>
        {saved && (
          <span className="text-[0.8125rem] font-medium" style={{ color: "var(--ok)" }}>
            Saved
          </span>
        )}
      </div>
    </div>
  );
}
