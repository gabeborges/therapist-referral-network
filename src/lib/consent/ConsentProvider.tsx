"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  type ConsentPreferences,
  getConsentPreferences,
  setConsentPreferences,
  hasConsented as checkHasConsented,
} from "@/lib/consent/consent-store";

type ConsentContextValue = {
  preferences: ConsentPreferences | null;
  hasConsented: boolean;
  isReady: boolean;
  updatePreferences: (prefs: Omit<ConsentPreferences, "essential" | "updatedAt">) => void;
};

const ConsentContext = createContext<ConsentContextValue>({
  preferences: null,
  hasConsented: false,
  isReady: false,
  updatePreferences: () => {},
});

export function ConsentProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [preferences, setPreferences] = useState<ConsentPreferences | null>(null);
  const [consented, setConsented] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const prefs = getConsentPreferences();
    setPreferences(prefs);
    setConsented(checkHasConsented());
    setIsReady(true);
  }, []);

  const updatePreferences = useCallback(
    (prefs: Omit<ConsentPreferences, "essential" | "updatedAt">) => {
      if (typeof window.gtag === "function") {
        window.gtag("consent", "update", {
          analytics_storage: prefs.analytics ? "granted" : "denied",
        });
      }
      const updated = setConsentPreferences(prefs);
      setPreferences(updated);
      setConsented(true);
    },
    [],
  );

  return (
    <ConsentContext.Provider
      value={{ preferences, hasConsented: consented, isReady, updatePreferences }}
    >
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent(): ConsentContextValue {
  return useContext(ConsentContext);
}
