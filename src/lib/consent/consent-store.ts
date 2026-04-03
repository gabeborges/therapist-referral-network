export type ConsentPreferences = {
  essential: true;
  analytics: boolean;
  sessionRecording: boolean;
  updatedAt: string;
};

const COOKIE_NAME = "consent-preferences";
const MAX_AGE_SECONDS = 365 * 24 * 60 * 60; // 1 year

export function getConsentPreferences(): ConsentPreferences | null {
  if (typeof document === "undefined") return null;

  const raw = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${COOKIE_NAME}=`))
    ?.split("=")
    .slice(1)
    .join("=");

  if (!raw) return null;

  try {
    return JSON.parse(decodeURIComponent(raw)) as ConsentPreferences;
  } catch {
    return null;
  }
}

export function setConsentPreferences(
  prefs: Omit<ConsentPreferences, "essential" | "updatedAt">,
): ConsentPreferences {
  const full: ConsentPreferences = {
    essential: true,
    analytics: prefs.analytics,
    sessionRecording: prefs.sessionRecording,
    updatedAt: new Date().toISOString(),
  };

  const value = encodeURIComponent(JSON.stringify(full));
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${MAX_AGE_SECONDS}; SameSite=Lax`;

  return full;
}

export function hasConsented(): boolean {
  return getConsentPreferences() !== null;
}
