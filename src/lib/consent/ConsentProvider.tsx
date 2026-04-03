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
  updatePreferences: (prefs: Omit<ConsentPreferences, "essential" | "updatedAt">) => void;
};

const ConsentContext = createContext<ConsentContextValue>({
  preferences: null,
  hasConsented: false,
  updatePreferences: () => {},
});

export function ConsentProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [preferences, setPreferences] = useState<ConsentPreferences | null>(null);
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    const prefs = getConsentPreferences();
    const consented = checkHasConsented();
    console.log(
      "[ConsentDebug] prefs:",
      prefs,
      "hasConsented:",
      consented,
      "raw cookie:",
      document.cookie,
    );
    setPreferences(prefs);
    setConsented(consented);
  }, []);

  const updatePreferences = useCallback(
    (prefs: Omit<ConsentPreferences, "essential" | "updatedAt">) => {
      const updated = setConsentPreferences(prefs);
      setPreferences(updated);
      setConsented(true);
    },
    [],
  );

  return (
    <ConsentContext.Provider value={{ preferences, hasConsented: consented, updatePreferences }}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent(): ConsentContextValue {
  return useContext(ConsentContext);
}
