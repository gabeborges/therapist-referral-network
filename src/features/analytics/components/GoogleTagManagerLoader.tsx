"use client";

import { useEffect, useRef } from "react";
import { GoogleTagManager } from "@next/third-parties/google";
import { useConsent } from "@/lib/consent/ConsentProvider";

type Props = {
  gtmId: string;
};

export function GoogleTagManagerLoader({ gtmId }: Props): React.ReactElement | null {
  const { preferences, isReady } = useConsent();
  const prevAnalyticsRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (!isReady || !preferences) return;

    const granted = preferences.analytics;
    if (prevAnalyticsRef.current === granted) return;
    prevAnalyticsRef.current = granted;

    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage: granted ? "granted" : "denied",
      });
    }
  }, [isReady, preferences]);

  if (!gtmId || !isReady || !preferences?.analytics) return null;

  return <GoogleTagManager gtmId={gtmId} />;
}
